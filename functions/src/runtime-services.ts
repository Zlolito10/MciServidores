/** Recovery adapters. External FCM/Drive calls are replaced only in a demo emulator runtime. */
import { createHash, randomUUID } from "node:crypto";

type Environment = NodeJS.ProcessEnv;

export function runtimeProject(env: Environment = process.env): string {
  if (env.GCLOUD_PROJECT || env.GOOGLE_CLOUD_PROJECT) return env.GCLOUD_PROJECT || env.GOOGLE_CLOUD_PROJECT || "";
  try { return JSON.parse(env.FIREBASE_CONFIG || "{}").projectId || ""; } catch { return ""; }
}

function loopbackHost(value: string | undefined): boolean {
  if (!value) return false;
  try { const url = new URL(`http://${value}`); return ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) && url.pathname === "/" && !url.username && !url.password && !url.search && !url.hash; } catch { return false; }
}

export function isLocalDemoRuntime(env: Environment = process.env): boolean {
  return runtimeProject(env).startsWith("demo-") &&
    (env.FUNCTIONS_EMULATOR === "true" || env.MCI_LOCAL_TEST_MODE === "1") &&
    loopbackHost(env.FIRESTORE_EMULATOR_HOST);
}

export function passwordSignInUrl(apiKey: string, env: Environment = process.env): string {
  if (isLocalDemoRuntime(env)) {
    if (!loopbackHost(env.FIREBASE_AUTH_EMULATOR_HOST)) throw new Error("AUTH_EMULATOR_NOT_CONFIGURED");
    return `http://${env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-local-only`;
  }
  if (!apiKey) throw new Error("MISSING_MCI_FIREBASE_WEB_API_KEY");
  return `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`;
}

export function normalizeLoginEmail(email: unknown, username: unknown): string {
  const explicit = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (explicit.includes("@")) return explicit;
  const name = typeof username === "string" ? username.trim().toLowerCase() : "";
  return name ? `${name}@church.app` : "";
}

function fingerprint(value: string): string { return createHash("sha256").update(value).digest("hex").slice(0, 16); }

export function createRuntimeMessaging(admin: any, env: Environment = process.env): any {
  if (!isLocalDemoRuntime(env)) return admin.messaging();
  const record = async (operation: string, message: any) => {
    const { token, tokens, ...payload } = message || {};
    const targets: string[] = Array.isArray(tokens) ? tokens.map(String) : token ? [String(token)] : [];
    await admin.firestore().collection("_local_integration_outbox").add({
      service: "fcm", operation, simulated: true, projectId: runtimeProject(env),
      createdAt: new Date().toISOString(), message: payload, tokenCount: targets.length,
      tokenHashes: targets.map(fingerprint),
    });
    return targets;
  };
  return {
    async send(message: any) { await record("send", message); return `local-simulation-${randomUUID()}`; },
    async subscribeToTopic(tokens: string[] | string, topic: string) {
      const targets = Array.isArray(tokens) ? tokens : [tokens];
      await record("subscribe", { tokens: targets, topic });
      return { successCount: targets.length, failureCount: 0, errors: [] };
    },
    async unsubscribeFromTopic(tokens: string[] | string, topic: string) {
      const targets = Array.isArray(tokens) ? tokens : [tokens];
      await record("unsubscribe", { tokens: targets, topic });
      return { successCount: targets.length, failureCount: 0, errors: [] };
    },
    async sendEachForMulticast(message: any) {
      const tokens = await record("multicast", message);
      const responses = tokens.map(token => token.startsWith("demo-invalid:")
        ? { success: false, error: { code: "messaging/registration-token-not-registered" } }
        : { success: true, messageId: `local-simulation-${randomUUID()}` });
      const successCount = responses.filter(response => response.success).length;
      return { responses, successCount, failureCount: responses.length - successCount };
    },
  };
}

export function createRuntimeDrive(admin: any, google: any, env: Environment = process.env): any {
  if (!isLocalDemoRuntime(env)) {
    const auth = new google.auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/drive"] });
    return google.drive({ version: "v3", auth });
  }
  const storageHost = (env.FIREBASE_STORAGE_EMULATOR_HOST || env.STORAGE_EMULATOR_HOST || "").replace(/^http:\/\//, "");
  if (!loopbackHost(storageHost)) throw new Error("STORAGE_EMULATOR_NOT_CONFIGURED");
  return { files: { async create(request: any) {
    const chunks: Buffer[] = [];
    for await (const chunk of request.media.body) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const bytes = Buffer.concat(chunks);
    const id = `local-drive-${randomUUID()}`;
    const originalName = String(request.requestBody.name || "archive").split(/[\\/]/).pop();
    const archivePath = `_local-drive-archive/${id}/${originalName}`;
    await admin.storage().bucket().file(archivePath).save(bytes, { contentType: request.media.mimeType });
    await admin.firestore().collection("_local_integration_outbox").add({
      service: "drive", operation: "archive", simulated: true, id, archivePath,
      name: originalName, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"),
      createdAt: new Date().toISOString(),
    });
    return { data: { id, simulated: true, archivePath } };
  } } };
}
