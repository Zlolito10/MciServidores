/** Reconstructed read contracts referenced by AppHistory. Collection ingestion stays disabled. */
export function boundedInteger(value: unknown, fallback: number, max: number, min = 1): number {
  const number = Number(value);
  return Number.isFinite(number) && String(value).trim() !== "" ? Math.max(min, Math.min(max, Math.floor(number))) : fallback;
}

export function timestampMs(value: any): number {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") { const parsed = Date.parse(value); return Number.isFinite(parsed) ? parsed : 0; }
  const seconds = value.seconds ?? value._seconds;
  return typeof seconds === "number" ? seconds * 1000 : 0;
}

function pickRecord(doc: any, keys: string[]): any {
  const data = doc.data() || {};
  const record: any = { id: doc.id };
  for (const key of keys) if (data[key] !== undefined) record[key] = data[key];
  return record;
}

const telemetryKeys = ["userId", "day", "createdAt", "updatedAt", "transferSize", "requestCount", "metaCount", "path", "type", "bytes", "durationMs", "resourceCount"];
const userKeys = ["uid", "name", "email", "role", "photoURL", "photoThumbURL", "lastSeenAt", "lastSeenVersion", "lastSeenPath", "createdAt", "updatedAt"];
const auditKeys = ["createdAt", "uid", "email", "actionCode", "actionLabel", "resource", "resourceId", "subresource", "subresourceId", "method", "path", "status", "durationMs", "appVersion", "appPath"];

export function registerAdminReadRoutes(app: any, dependencies: { db: any; requireSession: any }): void {
  const { db, requireSession } = dependencies;
  const master = (_req: any, res: any, next: any) => res.locals.role === "master_admin" ? next() : res.status(403).json({ error: "FORBIDDEN" });
  const route = (path: string, handler: any) => app.get(path, requireSession, master, async (req: any, res: any) => {
    res.setHeader("Cache-Control", "private, no-store");
    try { return await handler(req, res); }
    catch { return res.status(500).json({ error: "ADMIN_READ_FAILED" }); }
  });

  route("/api/admin/app-history", async (req: any, res: any) => {
    const limit = boundedInteger(req.query.limit, 200, 500);
    let query = db.collection("app_audit_logs").orderBy("createdAt", "desc").limit(limit + 1);
    if (req.query.cursor) {
      const cursor = String(req.query.cursor);
      if (cursor.includes("/") || cursor.length > 150 || /[\x00-\x1f]/.test(cursor)) return res.status(400).json({ error: "INVALID_CURSOR" });
      const document = await db.collection("app_audit_logs").doc(cursor).get();
      if (!document.exists) return res.status(400).json({ error: "INVALID_CURSOR" });
      query = query.startAfter(document);
    }
    const [logs, users] = await Promise.all([query.get(), db.collection("users").limit(2000).get()]);
    return res.json({ ok: true, logs: logs.docs.slice(0, limit).map((doc: any) => pickRecord(doc, auditKeys)),
      users: users.docs.map((doc: any) => ({ ...pickRecord(doc, userKeys), uid: doc.id })),
      nextCursor: logs.docs.length > limit ? logs.docs[limit - 1].id : null,
      collectionEnabled: false, source: "stored-audit-records", userLimit: 2000 });
  });

  route("/api/admin/app-history/meta", async (_req: any, res: any) => {
    const [logs, users] = await Promise.all([
      db.collection("app_audit_logs").orderBy("createdAt", "desc").limit(1).get(),
      db.collection("users").orderBy("lastSeenAt", "desc").limit(1).get(),
    ]);
    return res.json({ ok: true, latestLogMs: logs.empty ? 0 : timestampMs(logs.docs[0].data().createdAt), latestUsersMs: users.empty ? 0 : timestampMs(users.docs[0].data().lastSeenAt) });
  });

  route("/api/admin/telemetry/latest", async (req: any, res: any) => {
    const limit = boundedInteger(req.query.limitUsers, 80, 500);
    const snapshot = await db.collection("app_telemetry").orderBy("createdAt", "desc").limit(Math.min(2000, limit * 5)).get();
    const byUser = new Map();
    for (const document of snapshot.docs) { const record = pickRecord(document, telemetryKeys); if (record.userId && !byUser.has(record.userId)) byUser.set(record.userId, record); }
    return res.json({ ok: true, items: [...byUser.values()].slice(0, limit), collectionEnabled: false, source: "stored-client-telemetry" });
  });

  route("/api/admin/telemetry/daily", async (req: any, res: any) => {
    const days = boundedInteger(req.query.days, 7, 31);
    const limit = boundedInteger(req.query.limit, 3000, 3000);
    const from = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10);
    const snapshot = await db.collection("app_telemetry_daily").where("day", ">=", from).limit(limit).get();
    return res.json({ ok: true, items: snapshot.docs.map((document: any) => pickRecord(document, telemetryKeys)), collectionEnabled: false, source: "stored-client-telemetry", days });
  });

  route("/api/admin/telemetry/daily/routes", async (req: any, res: any) => {
    const day = String(req.query.day || new Date().toISOString().slice(0, 10));
    const type = String(req.query.type || "api");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !["api", "asset"].includes(type)) return res.status(400).json({ error: "INVALID_FILTER" });
    const limit = boundedInteger(req.query.limit, 5, 100);
    const snapshot = await db.collection("app_telemetry_daily_routes").where("day", "==", day).where("type", "==", type).orderBy("bytes", "desc").limit(limit).get();
    return res.json({ ok: true, items: snapshot.docs.map((document: any) => pickRecord(document, telemetryKeys)), collectionEnabled: false, source: "stored-client-telemetry" });
  });

  route("/api/admin/firestore-reads", async (req: any, res: any) => res.json({
    ok: false, error: "METRICS_NOT_COLLECTED", hoursAnalyzed: boundedInteger(req.query.hours, 24, 168),
    source: null, message: "No se recuperó un medidor de lecturas de Firestore. La telemetría cliente no equivale al consumo facturable y no se generan conteos estimados.",
  }));
}
