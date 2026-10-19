#!/usr/bin/env python3
"""Read-only Firebase source recovery; run privately in authenticated Cloud Shell.

Only the signed-URL generation request uses POST. It does not deploy or modify
the project. Tokens and signed URLs remain in memory and are never logged.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import zipfile


FUNCTIONS = "https://cloudfunctions.googleapis.com"
HOSTING = "https://firebasehosting.googleapis.com/v1beta1"
V1_FIELDS = (
    "functions(name,runtime,entryPoint,versionId,availableMemoryMb,timeout,"
    "httpsTrigger(url,securityLevel),eventTrigger(eventType,resource,service)),"
    "nextPageToken,unreachable"
)
V2_FIELDS = (
    "functions(name,environment,buildConfig(runtime,entryPoint),"
    "serviceConfig(uri,availableMemory,availableCpu,timeoutSeconds,"
    "minInstanceCount,maxInstanceCount,maxInstanceRequestConcurrency,ingressSettings),"
    "eventTrigger(eventType,eventFilters,triggerRegion)),nextPageToken,unreachable"
)
VERSION_FIELDS = "name,status,createTime,finalizeTime,fileCount,versionBytes"
RESOURCE = re.compile(r"^projects/([A-Za-z0-9:._-]+)/locations/([a-z0-9-]+)/functions/([A-Za-z0-9_.-]+)$")


class RecoveryError(Exception):
    """Messages are deliberately free of remote response bodies and URLs."""


class ApiError(RecoveryError):
    def __init__(self, status: int):
        self.status = status
        super().__init__(f"HTTP {status}")


def safe_relative(value: str) -> Path:
    """Validate remote paths before using them as local filesystem paths."""
    if not isinstance(value, str) or not value or "\\" in value or "\x00" in value:
        raise RecoveryError("Unsafe file path")
    if any(ord(c) < 32 for c in value):
        raise RecoveryError("Unsafe file path")
    normalized = value[1:] if value.startswith("/") else value
    if normalized.startswith("/") or re.match(r"^[A-Za-z]:", normalized):
        raise RecoveryError("Unsafe absolute file path")
    pieces = normalized.split("/")
    if any(p in ("", ".", "..") for p in pieces):
        raise RecoveryError("Unsafe file path component")
    return Path(*PurePosixPath(normalized).parts)


def public_url(value: str) -> str:
    """Keep routing information without credentials, query values, or fragments."""
    if not isinstance(value, str):
        return ""
    try:
        parts = urlsplit(value)
        host = parts.hostname or ""
        if parts.port:
            host += f":{parts.port}"
        return urlunsplit((parts.scheme, host, parts.path, "", ""))
    except ValueError:
        return "[invalid URL omitted]"


def sanitized_hosting_config(config: dict) -> dict:
    result = {k: config[k] for k in ("cleanUrls", "trailingSlash", "appAssociation") if k in config}
    for kind in ("redirects", "rewrites"):
        rules = []
        for rule in config.get(kind, []):
            item = {k: rule[k] for k in ("glob", "regex", "type", "function", "functionId", "region", "serviceId") if k in rule}
            if isinstance(rule.get("destination"), str):
                item["destination"] = public_url(rule["destination"])
            if isinstance(rule.get("run"), dict):
                item["run"] = {k: rule["run"][k] for k in ("serviceId", "region", "pinTag") if k in rule["run"]}
            rules.append(item)
        if kind in config:
            result[kind] = rules
    if isinstance(config.get("i18n"), dict):
        result["i18n"] = {k: config["i18n"][k] for k in ("root",) if k in config["i18n"]}
    # Headers contain arbitrary user-configured values; do not export them.
    result["recoveryNote"] = "Header values and URL query strings were intentionally omitted."
    return result


class Client:
    def __init__(self, token: str):
        self.token = token

    def api(self, url: str, params: dict | None = None, body: dict | None = None) -> dict:
        if params:
            url += ("&" if "?" in url else "?") + urlencode(params)
        headers = {"Authorization": "Bearer " + self.token}
        data = None
        if body is not None:
            data = json.dumps(body).encode()
            headers["Content-Type"] = "application/json"
        for attempt in range(3):
            try:
                with urlopen(Request(url, data=data, headers=headers), timeout=60) as response:
                    return json.load(response)
            except HTTPError as error:
                if error.code in (429, 500, 502, 503, 504) and attempt < 2:
                    time.sleep(2 ** attempt)
                    continue
                raise ApiError(error.code) from None
            except (URLError, TimeoutError, ValueError):
                raise RecoveryError("API transport or response error") from None
        raise RecoveryError("API request failed")

    def pages(self, url: str, key: str, params: dict | None = None) -> tuple[list, list]:
        values, unreachable, seen = [], [], set()
        query = dict(params or {})
        while True:
            page = self.api(url, query)
            values.extend(page.get(key, []))
            unreachable.extend(page.get("unreachable", []))
            token = page.get("nextPageToken")
            if not token:
                return values, sorted(set(unreachable))
            if token in seen:
                raise RecoveryError("API repeated a pagination token; inventory incomplete")
            seen.add(token)
            query["pageToken"] = token

    def download(self, url: str, destination: Path, limit: int = 300 * 1024 * 1024) -> None:
        # Never attach the Google access token to a signed URL or a Hosting URL.
        destination.parent.mkdir(parents=True, exist_ok=True)
        partial = destination.with_name(destination.name + ".partial")
        try:
            total = 0
            with urlopen(Request(url), timeout=90) as response, partial.open("xb") as target:
                while True:
                    chunk = response.read(128 * 1024)
                    if not chunk:
                        break
                    total += len(chunk)
                    if total > limit:
                        raise RecoveryError("Download exceeded the safety size limit")
                    target.write(chunk)
            partial.replace(destination)
        except HTTPError as error:
            raise ApiError(error.code) from None
        except (URLError, TimeoutError, OSError):
            raise RecoveryError("Download transport or local file error") from None
        finally:
            partial.unlink(missing_ok=True)


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def source_warnings(path: Path) -> list[str]:
    warnings = []
    scanned = 0
    try:
        with zipfile.ZipFile(path) as archive:
            entries = archive.infolist()
            if len(entries) > 100000:
                return ["Archive has too many files for a complete inspection; review privately."]
            for entry in entries:
                name = entry.filename
                try:
                    safe_relative(name.rstrip("/"))
                except RecoveryError:
                    warnings.append("Archive contains an unsafe path; do not extract automatically.")
                    continue
                leaf = name.rsplit("/", 1)[-1].lower()
                if (leaf == ".env" or leaf.startswith(".env.") or
                    re.search(r"(private[._-]?key|credentials|service[._-]?account|firebase-adminsdk)", leaf) or
                    leaf.endswith((".pem", ".key", ".p12", ".pfx"))):
                    warnings.append(f"Potential sensitive file: {name}")
                if entry.flag_bits & 1:
                    warnings.append("Encrypted source entry could not be inspected.")
                    continue
                if not entry.is_dir() and entry.file_size <= 2 * 1024 * 1024 and scanned < 20 * 1024 * 1024:
                    data = archive.read(entry)
                    scanned += len(data)
                    if (b"-----BEGIN PRIVATE KEY-----" in data or
                        b"-----BEGIN RSA PRIVATE KEY-----" in data or
                        re.search(rb'"private_key"\s*:\s*"', data)):
                        warnings.append(f"Potential private key material in: {name}")
            if scanned >= 20 * 1024 * 1024:
                warnings.append("Content inspection reached its size limit; review all source privately.")
    except (zipfile.BadZipFile, RuntimeError, OSError, NotImplementedError):
        raise RecoveryError("Downloaded source is invalid or could not be inspected as ZIP") from None
    return sorted(set(warnings))


def list_functions(client: Client, project: str, version: str, regions: list[str]) -> tuple[list, list]:
    fields = V1_FIELDS if version == "v1" else V2_FIELDS
    params = {"pageSize": 1000, "fields": fields}
    if version == "v2":
        params["filter"] = 'environment="GEN_2"'
    errors = []
    base = f"{FUNCTIONS}/{version}/projects/{project}/locations"
    try:
        found, unreachable = client.pages(base + "/-/functions", "functions", params)
        retry_regions = list(unreachable)
    except ApiError as error:
        if error.status not in (400, 404, 405, 501):
            return [], [{"stage": "functions_inventory", "api": version, "error": str(error)}]
        found, retry_regions = [], list(regions)
        if not retry_regions:
            try:
                locations, _ = client.pages(base, "locations", {"fields": "locations(locationId),nextPageToken"})
                retry_regions = [location["locationId"] for location in locations if location.get("locationId")]
            except RecoveryError as regional_error:
                return [], [{"stage": "functions_inventory", "api": version,
                             "error": f"Wildcard unsupported and regions unavailable: {regional_error}. Supply --regions."}]
        if not retry_regions:
            return [], [{"stage": "functions_inventory", "api": version,
                         "error": "Wildcard unsupported and no regions returned. Supply --regions."}]
    except RecoveryError as error:
        return [], [{"stage": "functions_inventory", "api": version, "error": str(error)}]
    for region in sorted(set(retry_regions)):
        if not re.fullmatch(r"[a-z0-9-]+", region):
            errors.append({"stage": "functions_inventory", "api": version, "error": "Invalid region identifier"})
            continue
        try:
            items, unreachable = client.pages(base + f"/{region}/functions", "functions", params)
            found.extend(items)
            if unreachable:
                errors.append({"stage": "functions_inventory", "api": version, "region": region,
                               "error": "Region remains unreachable; inventory incomplete"})
        except RecoveryError as error:
            errors.append({"stage": "functions_inventory", "api": version, "region": region, "error": str(error)})
    # Duplicate functions can appear when a formerly unreachable region recovers.
    return list({item.get("name", ""): item for item in found}.values()), errors


def recover_functions(client: Client, project: str, root: Path, inventory_only: bool, regions: list[str]) -> tuple[list, list]:
    statuses, errors = [], []
    for version, generation in (("v1", "GEN_1"), ("v2", "GEN_2")):
        functions, inventory_errors = list_functions(client, project, version, regions)
        errors.extend(inventory_errors)
        for function in functions:
            name = function.get("name", "")
            match = RESOURCE.fullmatch(name)
            status = {"name": name, "generation": generation, "metadata": function}
            statuses.append(status)
            if not match or match.group(1) != project:
                status.update(status="error", error="Unexpected function resource name")
                errors.append({"stage": "function_source", "error": "Unexpected function resource name"})
                continue
            region, identifier = match.group(2), match.group(3)
            try:
                safe_relative(identifier)
                if inventory_only:
                    status["status"] = "inventory_only"
                    continue
                signed = client.api(f"{FUNCTIONS}/{version}/{name}:generateDownloadUrl", body={})
                download_url = signed.get("downloadUrl")
                if not isinstance(download_url, str) or urlsplit(download_url).scheme != "https":
                    raise RecoveryError("API did not return a valid HTTPS source download URL")
                relative = Path("functions") / generation / region / identifier / "source.zip"
                destination = root / relative
                client.download(download_url, destination)
                warnings = source_warnings(destination)
                status.update(status="downloaded", archive=relative.as_posix(), warnings=warnings)
                print(f"Recovered source: {generation} {region}/{identifier}")
            except RecoveryError as error:
                status.update(status="error", error=str(error))
                errors.append({"stage": "function_source", "name": name, "error": str(error)})
    return statuses, errors


def recover_hosting(client: Client, project: str, root: Path, download_files: bool) -> tuple[list, list]:
    statuses, errors = [], []
    try:
        sites, _ = client.pages(f"{HOSTING}/projects/{project}/sites", "sites",
                                {"fields": "sites(name,defaultUrl),nextPageToken"})
    except RecoveryError as error:
        return [], [{"stage": "hosting_sites", "error": str(error)}]
    for site in sites:
        site_id = site.get("name", "").rsplit("/", 1)[-1]
        if not re.fullmatch(r"[a-z0-9-]+", site_id):
            errors.append({"stage": "hosting_site", "error": "Unexpected Hosting site identifier"})
            continue
        site_root = root / "hosting" / site_id
        status = {"site": site_id, "status": "inventory_only", "files_downloaded": 0, "files_failed": 0}
        statuses.append(status)
        try:
            versions, _ = client.pages(f"{HOSTING}/sites/{site_id}/versions", "versions",
                                       {"pageSize": 100, "fields": f"versions({VERSION_FIELDS}),nextPageToken"})
            write_json(site_root / "versions.json", versions)
            releases, _ = client.pages(f"{HOSTING}/sites/{site_id}/channels/live/releases", "releases",
                                       {"pageSize": 100, "fields": "releases(name,type,releaseTime,version(name)),nextPageToken"})
            write_json(site_root / "live-releases.json", releases)
            # Firebase returns releases newest first; timestamps remove reliance on that order.
            releases.sort(key=lambda item: item.get("releaseTime", ""), reverse=True)
            latest = releases[0] if releases else {}
            if not latest.get("version", {}).get("name") or latest.get("type") == "SITE_DISABLE":
                status["status"] = "no_live_version"
                continue
            version_name = latest["version"]["name"]
            if not re.fullmatch(r"sites/" + re.escape(site_id) + r"/versions/[A-Za-z0-9_-]+", version_name):
                raise RecoveryError("Unexpected Hosting version resource name")
            version = client.api(f"{HOSTING}/{version_name}", {"fields": VERSION_FIELDS + ",config(cleanUrls,trailingSlash,rewrites,redirects,i18n,appAssociation)"})
            if "config" in version:
                version["config"] = sanitized_hosting_config(version["config"])
            write_json(site_root / "live-version.json", version)
            files, _ = client.pages(f"{HOSTING}/{version_name}/files", "files",
                                    {"pageSize": 1000, "status": "ACTIVE", "fields": "files(path,hash,status),nextPageToken"})
            write_json(site_root / "live-files.json", files)
            status.update(version=version_name, file_count=len(files))
            if not download_files:
                continue
            for item in files:
                try:
                    relative = safe_relative(item.get("path", ""))
                    url = f"https://{site_id}.web.app/" + quote(relative.as_posix(), safe="/")
                    client.download(url, site_root / "public" / relative, limit=100 * 1024 * 1024)
                    status["files_downloaded"] += 1
                except RecoveryError as error:
                    status["files_failed"] += 1
                    errors.append({"stage": "hosting_file", "site": site_id,
                                   "path": item.get("path", ""), "error": str(error)})
            status["status"] = "downloaded" if not status["files_failed"] else "partial_download"
        except RecoveryError as error:
            status.update(status="error", error=str(error))
            errors.append({"stage": "hosting_inventory", "site": site_id, "error": str(error)})
    return statuses, errors


def package_output(root: Path) -> Path:
    destination = root.with_name(root.name + ".zip")
    with zipfile.ZipFile(destination, "x", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(root.rglob("*")):
            if path.is_symlink():
                raise RecoveryError("Refusing to package a symbolic link")
            if path.is_file():
                archive.write(path, Path(root.name) / path.relative_to(root))
    destination.chmod(0o600)
    return destination


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", default="mcimachala-servidor")
    parser.add_argument("--output", type=Path)
    parser.add_argument("--regions", default="", help="Comma-separated regions for fallback when wildcard listing is unsupported")
    parser.add_argument("--inventory-only", action="store_true", help="Save sanitized metadata without downloading sources")
    parser.add_argument("--download-hosting", action="store_true", help="Also download every file in the current live Hosting inventory")
    parser.add_argument("--dry-run", action="store_true", help="Describe the operation without authentication, requests, or writes")
    args = parser.parse_args(argv)
    if not re.fullmatch(r"[a-z][a-z0-9-]{4,61}[a-z0-9]", args.project):
        parser.error("Invalid Firebase project ID")
    if args.dry_run:
        print(f"Project: {args.project}. Read-only Functions Gen1/Gen2 and Hosting inventory.")
        print("Source download: " + ("disabled" if args.inventory_only else "enabled; private ZIP only"))
        print("Live Hosting files: " + ("enabled" if args.download_hosting and not args.inventory_only else "disabled"))
        return 0
    os.umask(0o077)
    try:
        auth = subprocess.run(["gcloud", "auth", "print-access-token"], capture_output=True, text=True, check=False)
    except OSError:
        print("gcloud is unavailable. Run this script in your authenticated Google Cloud Shell.", file=sys.stderr)
        return 2
    if auth.returncode or not auth.stdout.strip():
        print("gcloud authentication is unavailable. Sign in to Google Cloud Shell first.", file=sys.stderr)
        return 2
    client = Client(auth.stdout.strip())
    del auth
    stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    root = (args.output or Path.home() / f"{args.project}-recovery-{stamp}").resolve()
    if root.exists() or root.with_name(root.name + ".zip").exists():
        print("Output already exists; use a new --output directory to preserve earlier files.", file=sys.stderr)
        return 2
    root.mkdir(parents=True, mode=0o700)
    function_status, errors = recover_functions(client, args.project, root, args.inventory_only,
                                                 [value.strip() for value in args.regions.split(",") if value.strip()])
    hosting_status, hosting_errors = recover_hosting(client, args.project, root,
                                                     args.download_hosting and not args.inventory_only)
    errors.extend(hosting_errors)
    report = {"project": args.project, "generated_at": stamp, "inventory_only": args.inventory_only,
              "complete_without_reported_errors": not errors, "functions": function_status,
              "hosting": hosting_status, "errors": errors,
              "privacy": "PRIVATE BACKUP. Source ZIPs may contain .env, credentials, or private keys. Inspect before sharing or committing. No tokens, signed URLs, or environment variable values are exported by this tool.",
              "limits": ["Only deployed Functions source is available; missing original local files cannot be recovered.",
                         "Hosting files are deployment outputs. Original source requires deployed source maps or independent reconstruction.",
                         "Hosting historical versions are inventoried; only the current live version can be downloaded without modifying the project.",
                         "Hosting content can change during recovery. No atomic snapshot or raw-byte hash verification is claimed.",
                         "No database contents, Auth users, Secret Manager values, logs, or production changes are requested.",
                         "HTTP response bodies and arbitrary environment/configuration values are intentionally excluded."]}
    write_json(root / "report.json", report)
    (root / "READ_ME_FIRST.txt").write_text(report["privacy"] + "\n\nRead report.json for exact successes, errors, and limits.\n", encoding="utf-8")
    try:
        artifact = package_output(root)
    except (RecoveryError, OSError) as error:
        print("Packaging failed; recovered files remain in the output directory. " + type(error).__name__, file=sys.stderr)
        return 2
    recovered = sum(item.get("status") == "downloaded" for item in function_status)
    print(f"Functions downloaded: {recovered}; inventoried: {len(function_status)}; reported errors: {len(errors)}.")
    print(f"PRIVATE recovery archive: {artifact}")
    print("Review report.json. Do not publish or commit this archive before checking for secrets.")
    return 2 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
