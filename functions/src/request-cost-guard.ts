/** Bounded abuse controls. No credentials, email addresses or raw IPs are persisted. */
import { createHash } from "node:crypto";

const digest = (value: string) => createHash("sha256").update(value).digest("hex");
type Bucket = { count: number; expires: number };

/** Coarse per-instance guard before expensive Auth/Firestore calls. Global actor quota is separate. */
export function createRequestCostGuard({ now = Date.now, maximumBuckets = 10000 } = {}) {
  const buckets = new Map<string, Bucket>();
  function consume(key: string, maximum: number, windowMs: number): number {
    const time = now();
    if (buckets.size >= maximumBuckets) {
      for (const [oldKey, value] of buckets) if (value.expires <= time) buckets.delete(oldKey);
    }
    const old = buckets.get(key);
    if (!old || old.expires <= time) {
      // Fail closed rather than evict a live bucket when flooded with new identities.
      if (!old && buckets.size >= maximumBuckets) return 60;
      buckets.set(key, { count: 1, expires: time + windowMs });
      return 0;
    }
    if (old.count >= maximum) return Math.max(1, Math.ceil((old.expires - time) / 1000));
    old.count++;
    return 0;
  }
  return (req: any, res: any, next: any) => {
    const path = String(req.path || "");
    if (req.method !== "POST") return next();
    const login = /^(?:\/api)?\/(?:passwordLogin|sessionLogin)$/.test(path);
    const notification = /^(?:\/api)?\/notify\/(?:user|users|all|week|repertoire|materials)\/?$/.test(path);
    if (!login && !notification) return next();
    const peer = digest(String(req.ip || req.socket?.remoteAddress || "unknown"));
    let retryAfter = consume((login ? "login:" : "notification:") + peer, login ? 120 : 60, 5 * 60000);
    if (!retryAfter && /passwordLogin$/.test(path)) {
      const loginName = String(req.body?.email || req.body?.username || "").trim().toLowerCase();
      if (loginName) retryAfter = consume("identity:" + peer + ":" + digest(loginName), 10, 5 * 60000);
    }
    if (!retryAfter) return next();
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({ error: "RATE_LIMITED", retryAfterSeconds: retryAfter });
  };
}

/** Transactional cross-instance quota: at most 20 accepted notification attempts per actor/minute. */
export async function consumeNotificationQuota(db: any, uid: string, now = Date.now()): Promise<number> {
  const ref = db.collection("request_quotas").doc("notification_" + digest(uid));
  const start = Math.floor(now / 60000) * 60000;
  return db.runTransaction(async (transaction: any) => {
    const snapshot = await transaction.get(ref);
    const value = snapshot.exists ? snapshot.data() : {};
    const count = value.windowStart === start && Number.isInteger(value.count) ? value.count : 0;
    if (count >= 20) return Math.max(1, Math.ceil((start + 60000 - now) / 1000));
    transaction.set(ref, { windowStart: start, count: count + 1 });
    return 0;
  });
}

export function notificationQuotaGuard(db: any) {
  return async (_req: any, res: any, next: any) => {
    try {
      const retry = await consumeNotificationQuota(db, String(res.locals.uid));
      if (!retry) return next();
      res.setHeader("Retry-After", String(retry));
      return res.status(429).json({ error: "RATE_LIMITED", retryAfterSeconds: retry });
    } catch {
      return res.status(503).json({ error: "RATE_LIMIT_UNAVAILABLE" });
    }
  };
}

export function allowedRequestOrigin(origin: unknown, localDemo = false, extra = ""): boolean {
  if (origin === undefined) return true; // Server clients still need normal authentication.
  if (typeof origin !== "string") return false;
  let parsed: URL;
  try { parsed = new URL(origin); } catch { return false; }
  if (parsed.origin !== origin || parsed.username || parsed.password) return false;
  if (origin === "https://mcimachala-servidor.web.app" || origin === "https://mcimachala-servidor.firebaseapp.com") return true;
  if (localDemo && parsed.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname)) return true;
  return parsed.protocol === "https:" && extra.split(",").map(value => value.trim()).includes(origin);
}
