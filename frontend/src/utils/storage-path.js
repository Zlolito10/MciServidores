/** Recognize only the local demo Storage Emulator's Firebase object URLs. */
export function extractEmulatorStoragePath(value) {
  if (typeof value !== "string") return null;
  let url;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "http:" || url.port !== "9199" || url.username || url.password ||
      !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) return null;
  const match = /^\/v0\/b\/(demo-[^/]+)\/o\/(.+)$/.exec(url.pathname);
  if (!match) return null;
  try { return decodeURIComponent(match[2]); } catch { return null; }
}
