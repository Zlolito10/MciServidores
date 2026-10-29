import importlib.util
import json
import unittest
from pathlib import Path
from types import SimpleNamespace

spec = importlib.util.spec_from_file_location("drive_readiness", Path(__file__).parents[1] / "scripts/check-drive-readonly-cloudshell.py")
probe = importlib.util.module_from_spec(spec)
spec.loader.exec_module(probe)


class DriveReadinessTests(unittest.TestCase):
    def test_dry_run_never_reads_credentials(self):
        def forbidden(*args, **kwargs):
            self.fail("Dry run must not use credentials or network")
        result = probe.check("operator@example.test", run_command=forbidden, api_request=forbidden, dry_run=True)
        self.assertEqual(result["result"], "DRY_RUN_NO_CREDENTIAL_ACCESS")

    def test_probe_only_issues_readonly_token_and_reads_metadata_without_outputting_tokens(self):
        calls = []
        def runner(command, **kwargs):
            self.assertEqual(command, ["gcloud", "auth", "print-access-token", "--account=operator@example.test", "--quiet"])
            return SimpleNamespace(returncode=0, stdout="synthetic-caller-token", stderr="")
        def api(url, method, token, payload=None):
            calls.append((url, method))
            if method == "POST":
                self.assertEqual(payload, {"scope": [probe.SCOPE], "lifetime": "600s"})
                return {"accessToken": "synthetic-runtime-token"}
            return {"mimeType": "application/vnd.google-apps.folder", "capabilities": {"canAddChildren": True}}
        result = probe.check("operator@example.test", run_command=runner, api_request=api)
        self.assertEqual(calls, [(probe.IAM_URL, "POST"), (probe.FOLDER_URL, "GET")])
        self.assertEqual(result["result"], "FOLDER_METADATA_READ")
        self.assertEqual(result["productionResourceWrites"], 0)
        self.assertNotIn("synthetic-", json.dumps(result))

    def test_iam_denial_stops_before_drive_and_auth_stderr_is_never_echoed(self):
        runner = lambda *args, **kwargs: SimpleNamespace(returncode=0, stdout="synthetic-caller-token", stderr="private error")
        calls = []
        def denied(url, *args):
            calls.append(url)
            raise probe.SafeApiError(403)
        result = probe.check("operator@example.test", run_command=runner, api_request=denied)
        self.assertEqual(calls, [probe.IAM_URL])
        self.assertEqual(result["httpStatus"], 403)
        self.assertEqual(result["blockedAt"], "service-account-readonly-token")
        failed = probe.check("operator@example.test", run_command=lambda *a, **kw: SimpleNamespace(returncode=1, stdout="", stderr="private token material"))
        self.assertNotIn("private", json.dumps(failed))


if __name__ == "__main__":
    unittest.main()
