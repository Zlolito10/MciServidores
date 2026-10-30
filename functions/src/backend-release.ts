/** Pure, redacted checks for an operator's release gate. No credential or network I/O. */
import { runtimeProject } from "./runtime-services";

export const DRIVE_OAUTH_SECRET_NAMES = ["MCI_DRIVE_OAUTH_CLIENT_SECRET", "MCI_DRIVE_OAUTH_REFRESH_TOKEN"];

/** The chosen mode must be part of deploy-time runtime configuration. ADC needs no OAuth secrets. */
export function archiveFunctionRuntimeOptions(env: NodeJS.ProcessEnv = process.env): { secrets?: string[] } {
  return env.MCI_DRIVE_AUTH_MODE === "oauth" ? { secrets: [...DRIVE_OAUTH_SECRET_NAMES] } : {};
}

export function inspectBackendReleaseEnvironment(env: NodeJS.ProcessEnv = process.env, options: {
  expectedProject?: string; boundSecrets?: string[]; realOwnerArchiveVerified?: boolean; sharedDriveRuntimeVerified?: boolean;
} = {}) {
  const checks: { id: string; status: "passed" | "blocked"; code: string }[] = [];
  const add = (id: string, pass: boolean, code: string) => checks.push({ id, status: pass ? "passed" : "blocked", code });
  const expectedProject = options.expectedProject || "mcimachala-servidor";
  const projects = [env.GCLOUD_PROJECT, env.GOOGLE_CLOUD_PROJECT].filter(Boolean);
  let firebaseProject: unknown;
  try { firebaseProject = JSON.parse(env.FIREBASE_CONFIG || "{}").projectId; } catch { firebaseProject = "INVALID"; }
  if (firebaseProject) projects.push(String(firebaseProject));
  add("runtime-project", runtimeProject(env) === expectedProject && projects.every(value => value === expectedProject), "EXPECTED_PROJECT_REQUIRED");
  const emulatorKeys = Object.keys(env).filter(key => /(?:^|_)EMULATOR_HOST$/.test(key) && !!env[key]);
  add("production-isolation", !emulatorKeys.length && env.FUNCTIONS_EMULATOR !== "true" && env.MCI_LOCAL_TEST_MODE !== "1", "EMULATOR_CONFIGURATION_PRESENT");
  add("password-login-config", !!env.MCI_FIREBASE_WEB_API_KEY?.trim(), "PASSWORD_LOGIN_PUBLIC_KEY_REQUIRED");
  const mode = env.MCI_DRIVE_AUTH_MODE || "adc";
  add("drive-auth-mode", mode === "oauth" || mode === "adc", "INVALID_DRIVE_AUTH_MODE");
  add("archive-folder-config", /^[A-Za-z0-9_-]{1,200}$/.test(env.MCI_DRIVE_ARCHIVE_FOLDER_ID || ""), "EXPLICIT_ARCHIVE_DESTINATION_REQUIRED");
  if (mode === "oauth") {
    add("drive-oauth-client", !!env.MCI_DRIVE_OAUTH_CLIENT_ID?.trim(), "DRIVE_OAUTH_CLIENT_REQUIRED");
    add("drive-oauth-owner", /^[^@\s]+@[^@\s]+$/.test(env.MCI_DRIVE_OAUTH_EXPECTED_EMAIL || ""), "DRIVE_EXPECTED_OWNER_REQUIRED");
    add("drive-secret-bindings", DRIVE_OAUTH_SECRET_NAMES.every(name => options.boundSecrets?.includes(name)), "DRIVE_SECRET_BINDINGS_REQUIRED");
    // A deploy-time process should not need plaintext secrets to inspect bindings.
    add("real-owner-drive-archive", options.realOwnerArchiveVerified === true, "REAL_OWNER_ARCHIVE_NOT_VERIFIED");
  } else {
    add("adc-oauth-isolation", ![env.MCI_DRIVE_OAUTH_CLIENT_ID, env.MCI_DRIVE_OAUTH_CLIENT_SECRET, env.MCI_DRIVE_OAUTH_REFRESH_TOKEN].some(Boolean), "OAUTH_CONFIG_IN_ADC_MODE");
    add("real-shared-drive-runtime", options.sharedDriveRuntimeVerified === true, "SERVICE_ACCOUNT_SHARED_DRIVE_NOT_VERIFIED");
  }
  return { ready: checks.every(check => check.status === "passed"), checks, configurationValuesIncluded: false, externalOperationsPerformed: false };
}
