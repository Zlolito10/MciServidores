#!/usr/bin/env python3
"""One-time read-only Drive probe using an existing gcloud session. Never prints tokens."""
import argparse
import json
import re
import subprocess
import urllib.error
import urllib.request
from datetime import datetime, timezone

SERVICE_ACCOUNT = "mcimachala-servidor@appspot.gserviceaccount.com"
FOLDER_ID = "1d2k7PKav0bCPfGZng6tDqAhIhqT_0mqp"
SCOPE = "https://www.googleapis.com/auth/drive.readonly"
IAM_URL = "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/" + SERVICE_ACCOUNT + ":generateAccessToken"
FOLDER_URL = "https://www.googleapis.com/drive/v3/files/" + FOLDER_ID + "?supportsAllDrives=true&fields=mimeType,trashed,driveId,capabilities(canAddChildren)"


class SafeApiError(Exception):
    def __init__(self, status):
        self.status = status


def request_json(url, method, bearer, payload=None):
    # Fixed endpoints and operations: only an auth token request and metadata GET.
    if (url, method) not in [(IAM_URL, "POST"), (FOLDER_URL, "GET")]:
        raise ValueError("UNTRUSTED_READ_ONLY_REQUEST")
    if method == "POST" and payload != {"scope": [SCOPE], "lifetime": "600s"}:
        raise ValueError("UNTRUSTED_TOKEN_SCOPE")
    request = urllib.request.Request(url, method=method, headers={"Authorization": "Bearer " + bearer, "Content-Type": "application/json"}, data=json.dumps(payload).encode() if payload is not None else None)
    # Do not follow a redirect carrying authentication to another endpoint.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None
    try:
        with urllib.request.build_opener(NoRedirect).open(request, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        raise SafeApiError(error.code) from None


def check(account, *, run_command=subprocess.run, api_request=request_json, dry_run=False):
    if not re.fullmatch(r"[^@\s]+@[^@\s]+", account):
        raise ValueError("INVALID_CALLER_ACCOUNT")
    report = {"checkedAt": datetime.now(timezone.utc).isoformat(), "callerAccount": account, "serviceAccount": SERVICE_ACCOUNT, "requestedScope": SCOPE, "lifetimeSeconds": 600, "productionResourceWrites": 0, "serviceAccountTokenPrintedOrSaved": False}
    if dry_run:
        return {**report, "result": "DRY_RUN_NO_CREDENTIAL_ACCESS", "operations": ["gcloud existing-session token captured in memory", "IAM short-lived read-only token", "Drive folder metadata GET"]}
    stage = "caller-auth"
    try:
        caller = run_command(["gcloud", "auth", "print-access-token", "--account=" + account, "--quiet"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=30, check=False)
        if caller.returncode or not caller.stdout.strip():
            return {**report, "result": "CALLER_AUTH_UNAVAILABLE"}
        stage = "service-account-readonly-token"
        issued = api_request(IAM_URL, "POST", caller.stdout.strip(), {"scope": [SCOPE], "lifetime": "600s"})
        if not issued.get("accessToken"):
            return {**report, "result": "SERVICE_ACCOUNT_TOKEN_NOT_ISSUED"}
        stage = "folder-metadata"
        folder = api_request(FOLDER_URL, "GET", issued["accessToken"])
        return {**report, "result": "FOLDER_METADATA_READ", "folder": {"isFolder": folder.get("mimeType") == "application/vnd.google-apps.folder", "trashed": bool(folder.get("trashed")), "sharedDrive": bool(folder.get("driveId")), "declaredCanAddChildren": folder.get("capabilities", {}).get("canAddChildren")}, "writeAccessTested": False}
    except SafeApiError as error:
        return {**report, "result": "READ_ONLY_CHECK_BLOCKED", "blockedAt": stage, "httpStatus": error.status}
    except (OSError, subprocess.TimeoutExpired, ValueError, KeyError):
        return {**report, "result": "READ_ONLY_CHECK_FAILED", "blockedAt": stage}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--account", required=True, help="Existing gcloud account; no login or credential creation is performed")
    parser.add_argument("--dry-run", action="store_true")
    options = parser.parse_args()
    try:
        result = check(options.account, dry_run=options.dry_run)
    except ValueError:
        result = {"result": "INVALID_CALLER_ACCOUNT"}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["result"] in ["FOLDER_METADATA_READ", "DRY_RUN_NO_CREDENTIAL_ACCESS"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
