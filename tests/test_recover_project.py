import contextlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import recover_project as recovery


class FixtureClient(recovery.Client):
    def __init__(self, pages):
        super().__init__("fixture-token-not-real")
        self.responses = iter(pages)
        self.calls = []

    def api(self, url, params=None, body=None):
        self.calls.append((url, dict(params or {}), body))
        value = next(self.responses)
        if isinstance(value, Exception):
            raise value
        return value


class RecoveryTests(unittest.TestCase):
    def test_pagination_preserves_params_and_collects_unreachable(self):
        client = FixtureClient([
            {"functions": [{"name": "first"}], "nextPageToken": "next", "unreachable": ["us-east1"]},
            {"functions": [{"name": "second"}], "unreachable": ["us-east1", "us-west1"]},
        ])
        items, unreachable = client.pages("https://example.test", "functions", {"fields": "functions(name),nextPageToken"})
        self.assertEqual([item["name"] for item in items], ["first", "second"])
        self.assertEqual(unreachable, ["us-east1", "us-west1"])
        self.assertEqual(client.calls[1][1]["pageToken"], "next")
        self.assertIn("fields", client.calls[1][1])

    def test_repeated_pagination_token_is_failure(self):
        client = FixtureClient([{"nextPageToken": "same"}, {"nextPageToken": "same"}])
        with self.assertRaises(recovery.RecoveryError):
            client.pages("https://example.test", "functions")

    def test_paths_cannot_escape_output_directory(self):
        self.assertEqual(recovery.safe_relative("/assets/main.js"), Path("assets/main.js"))
        for value in ("../secret", "/../secret", "//etc/passwd", "a/../../secret", "C:/secret", "a\\secret", "a/./b", "a//b", "", "a\x00b"):
            with self.subTest(path=value), self.assertRaises(recovery.RecoveryError):
                recovery.safe_relative(value)

    def test_global_listing_falls_back_to_discovered_regions(self):
        client = FixtureClient([
            recovery.ApiError(400), {"locations": [{"locationId": "us-central1"}]},
            {"functions": [{"name": "projects/p/locations/us-central1/functions/f"}]},
        ])
        functions, errors = recovery.list_functions(client, "p", "v2", [])
        self.assertEqual(len(functions), 1)
        self.assertEqual(errors, [])
        self.assertIn("/us-central1/functions", client.calls[-1][0])
        self.assertEqual(client.calls[-1][1]["filter"], 'environment="GEN_2"')

    def test_unreachable_regions_are_retried_without_duplicates(self):
        item = {"name": "projects/p/locations/us-central1/functions/f"}
        client = FixtureClient([
            {"functions": [item], "unreachable": ["us-central1"]},
            {"functions": [item]},
        ])
        functions, errors = recovery.list_functions(client, "p", "v1", [])
        self.assertEqual(len(functions), 1)
        self.assertFalse(errors)

    def test_permission_failure_is_reported_without_claiming_empty_success(self):
        client = FixtureClient([recovery.ApiError(403)])
        functions, errors = recovery.list_functions(client, "p", "v2", [])
        self.assertFalse(functions)
        self.assertEqual(errors[0]["error"], "HTTP 403")

    def test_source_inspection_flags_secrets_and_unsafe_paths_without_extraction(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "source.zip"
            with zipfile.ZipFile(path, "w") as archive:
                archive.writestr(".env", "PASSWORD=fixture")
                archive.writestr("config.json", '{"private_key": "fixture"}')
                archive.writestr("../escape.txt", "fixture")
            warnings = recovery.source_warnings(path)
            self.assertTrue(any(".env" in item for item in warnings))
            self.assertTrue(any("private key" in item for item in warnings))
            self.assertTrue(any("unsafe path" in item for item in warnings))
            self.assertEqual(list(Path(folder).iterdir()), [path])
            self.assertNotIn("PASSWORD", json.dumps(warnings))

    def test_hosting_config_drops_query_credentials_and_headers(self):
        result = recovery.sanitized_hosting_config({
            "headers": [{"headers": [{"key": "Authorization", "value": "SECRET"}]}],
            "redirects": [{"glob": "/old", "destination": "https://user:pass@example.test/new?token=SECRET#SECRET", "type": 302}],
            "rewrites": [{"glob": "**", "function": "app"}],
        })
        self.assertEqual(result["redirects"][0]["destination"], "https://example.test/new")
        self.assertNotIn("SECRET", json.dumps(result))
        self.assertNotIn("headers", result)

    def test_dry_run_needs_no_credentials_and_writes_nothing(self):
        with patch("recover_project.subprocess.run") as subprocess_run:
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(recovery.main(["--dry-run"]), 0)
            subprocess_run.assert_not_called()

    def test_function_fields_exclude_environment_variable_values(self):
        self.assertNotIn("environmentVariables", recovery.V1_FIELDS)
        self.assertNotIn("environmentVariables", recovery.V2_FIELDS)
        self.assertNotIn("secretEnvironmentVariables", recovery.V2_FIELDS)

    def test_source_url_and_tokens_do_not_enter_recovery_manifest(self):
        class DownloadFixture(FixtureClient):
            def download(self, url, destination, limit=None):
                self.downloaded_url = url
                destination.parent.mkdir(parents=True, exist_ok=True)
                with zipfile.ZipFile(destination, "w") as archive:
                    archive.writestr("index.js", "exports.example = () => 'ok';")

        client = DownloadFixture([
            {"functions": [{"name": "projects/mcimachala-servidor/locations/us-central1/functions/example", "runtime": "nodejs20"}]},
            {"downloadUrl": "https://storage.example.test/source.zip?signature=PRIVATE_SIGNED_VALUE"},
            {"functions": []},
        ])
        with tempfile.TemporaryDirectory() as folder, contextlib.redirect_stdout(io.StringIO()):
            statuses, errors = recovery.recover_functions(client, "mcimachala-servidor", Path(folder), False, [])
            self.assertEqual(statuses[0]["status"], "downloaded")
            self.assertFalse(errors)
            self.assertTrue((Path(folder) / statuses[0]["archive"]).is_file())
            report = json.dumps({"functions": statuses, "errors": errors})
            self.assertNotIn("PRIVATE_SIGNED_VALUE", report)
            self.assertNotIn("fixture-token-not-real", report)
            self.assertNotIn("downloadUrl", report)

    def test_download_never_sends_bearer_token_to_storage(self):
        with tempfile.TemporaryDirectory() as folder:
            fake_response = io.BytesIO(b"source content")
            with patch("recover_project.urlopen", return_value=fake_response) as open_url:
                recovery.Client("PRIVATE_ACCESS_TOKEN").download("https://storage.example.test/file?signature=fixture", Path(folder) / "source.zip")
                request = open_url.call_args.args[0]
                self.assertNotIn("Authorization", request.headers)
                self.assertNotIn("PRIVATE_ACCESS_TOKEN", repr(request.headers))


if __name__ == "__main__":
    unittest.main()
