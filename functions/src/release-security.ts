/** Authorization for recovered HTTP entry points that previously bypassed BFF guards. */
import { timingSafeEqual } from "node:crypto";

type Dependencies = { auth: any; db: any };
const failure = (code: string, status = 403) => Object.assign(new Error(code), { code, status });
const equal = (a: unknown, b: unknown): boolean => {
  if (typeof a !== "string" || typeof b !== "string" || !a || a.length > 4096 || b.length > 4096) return false;
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};
const documentId = (value: unknown): value is string => typeof value === "string" && value.length > 0 && value.length <= 128 && !/[\/\x00-\x1f]/.test(value) && value !== "." && value !== "..";

function cookies(header: unknown): Record<string, string> {
  const result: Record<string, string> = Object.create(null);
  for (const item of String(header || "").split(";")) {
    const index = item.indexOf("="); if (index < 1) continue;
    const key = item.slice(0, index).trim();
    if (key !== "__session" && key !== "XSRF-TOKEN") continue;
    if (Object.prototype.hasOwnProperty.call(result, key)) throw failure("INVALID_COOKIE", 401);
    try { result[key] = decodeURIComponent(item.slice(index + 1).trim()); }
    catch { throw failure("INVALID_COOKIE", 401); }
  }
  return result;
}

export async function authenticateReleaseRequest(req: any, { auth, db }: Dependencies, { csrf = true } = {}): Promise<{ uid: string; role: string }> {
  let decoded: any;
  const authorization = req.headers.authorization;
  try {
    // An invalid explicit bearer must never fall back to a different cookie identity.
    if (authorization !== undefined) {
      const match = /^Bearer ([^\s]+)$/i.exec(String(authorization));
      if (!match || match[1].length > 16384) throw failure("UNAUTHENTICATED", 401);
      decoded = await auth.verifyIdToken(match[1], true);
    } else {
      const values = cookies(req.headers.cookie);
      if (!values.__session) throw failure("UNAUTHENTICATED", 401);
      decoded = await auth.verifySessionCookie(values.__session, true);
      if (csrf && !equal(values["XSRF-TOKEN"], req.headers["x-xsrf-token"])) throw failure("CSRF");
    }
  } catch (error) {
    if ((error as any)?.code === "CSRF") throw error;
    throw failure("UNAUTHENTICATED", 401);
  }
  if (!documentId(decoded?.uid)) throw failure("UNAUTHENTICATED", 401);
  let profile: any;
  try { profile = await db.collection("users").doc(decoded.uid).get(); }
  catch { throw failure("AUTHORIZATION_UNAVAILABLE", 503); }
  if (!profile.exists) throw failure("FORBIDDEN");
  return { uid: decoded.uid, role: String(profile.data()?.role || "") };
}

/** Private photo GETs work with the Firebase client bearer as well as the BFF cookie. */
export function releaseReadRequestGuard(dependencies: Dependencies) {
  return async (req: any, res: any, next: any) => {
    if (!["GET", "HEAD"].includes(req.method)) return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    try {
      const actor = await authenticateReleaseRequest(req, dependencies, { csrf: false });
      res.locals.uid = actor.uid; res.locals.role = actor.role;
      return next();
    } catch (error) {
      const code = (error as any)?.code;
      return res.status((error as any)?.status || 401).json({ error: ["FORBIDDEN", "AUTHORIZATION_UNAVAILABLE"].includes(code) ? code : "UNAUTHENTICATED" });
    }
  };
}

/** Testable middleware; it performs no external send or maintenance operation. */
export function releaseRequestGuard(dependencies: Dependencies, capability: "notification" | "maintenance") {
  return async (req: any, res: any, next: any) => {
    res.setHeader("Cache-Control", "private, no-store");
    if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "METHOD_NOT_ALLOWED" }); }
    try {
      const actor = await authenticateReleaseRequest(req, dependencies);
      const admin = actor.role === "admin" || actor.role === "master_admin";
      const personalTest = /^(?:\/api)?\/notify\/user\/?$/.test(String(req.path || "")) && req.body?.userId === actor.uid;
      if (capability === "maintenance" ? actor.role !== "master_admin" : !admin && !personalTest) throw failure("FORBIDDEN");
      res.locals.uid = actor.uid; res.locals.role = actor.role;
      return next();
    } catch (error) {
      const code = (error as any)?.code;
      const safe = ["UNAUTHENTICATED", "CSRF", "FORBIDDEN", "AUTHORIZATION_UNAVAILABLE"].includes(code) ? code : "FORBIDDEN";
      return res.status((error as any)?.status || 403).json({ error: safe });
    }
  };
}

/** Session middleware has already loaded this role from the current user profile. */
export function requireMasterProfile(_req: any, res: any, next: any) {
  return res.locals.role === "master_admin" ? next() : res.status(403).json({ error: "FORBIDDEN" });
}

export function canWriteAssignmentScope(context: any, currentAreaId: unknown, requestedAreaId: unknown): boolean {
  if (context.isAdmin === true) return true;
  const areas = Array.isArray(context.assignedMinistries) ? context.assignedMinistries : [];
  return context.isMinistryRestricted === true && documentId(requestedAreaId) && areas.includes(requestedAreaId)
    && (currentAreaId === undefined || documentId(currentAreaId) && areas.includes(currentAreaId));
}

export const COMMAND_TYPES = ["REPLICATE_REPERTOIRE", "REPLICATE_MATERIALS", "REPLICATE_ASSIGNMENTS", "RESTORE_REPERTOIRE"];

export function normalizeCommandPayload(payload: any, createdBy: string): any {
  if (!payload || typeof payload !== "object" || Array.isArray(payload) || !COMMAND_TYPES.includes(payload.type)) throw failure("INVALID_TYPE", 400);
  if (!documentId(createdBy)) throw failure("COMMAND_ACTOR_REQUIRED", 400);
  if (payload.status !== undefined && payload.status !== "pending") throw failure("INVALID_COMMAND_STATUS", 400);
  const restore = payload.type === "RESTORE_REPERTOIRE";
  const fields = restore ? ["eventId", "backupId", "collection"] : ["sourceEventId", "targetEventId"];
  const allowed = new Set(["type", "createdBy", "createdAt", "status", ...fields]);
  if (Object.keys(payload).some(key => !allowed.has(key))) throw failure("INVALID_COMMAND_FIELDS", 400);
  if (restore) {
    if (!documentId(payload.eventId) || !documentId(payload.backupId) || !["replicateBackups", "autoBackups"].includes(payload.collection)) throw failure("INVALID_COMMAND_TARGET", 400);
  } else if (!documentId(payload.sourceEventId) || !documentId(payload.targetEventId) || payload.sourceEventId === payload.targetEventId) throw failure("INVALID_COMMAND_TARGET", 400);
  const command: any = { type: payload.type, createdBy, status: "pending" };
  for (const field of fields) command[field] = payload[field];
  return command;
}

/** Rules bind createdBy to request.auth.uid; the worker independently checks the current role. */
export async function authorizeQueuedCommand(payload: any, db: any): Promise<any> {
  const command = normalizeCommandPayload(payload, payload?.createdBy);
  const actor = await db.collection("users").doc(command.createdBy).get();
  if (!actor.exists || !["admin", "master_admin"].includes(actor.data()?.role)) throw failure("COMMAND_FORBIDDEN");
  return command;
}

/** At-least-once Firestore delivery cannot run a destructive command twice. */
export async function claimQueuedCommand(db: any, ref: any, startedAt: any): Promise<boolean> {
  return db.runTransaction(async (transaction: any) => {
    const latest = await transaction.get(ref);
    if (!latest.exists || ![undefined, "pending"].includes(latest.data()?.status)) return false;
    transaction.set(ref, { status: "processing", startedAt }, { merge: true });
    return true;
  });
}

/** An empty source is a successful no-op; it must not leave the queue processing forever. */
export async function completeEmptyCommand(source: any, ref: any, processedAt: any): Promise<boolean> {
  if (!source.empty) return false;
  await ref.set({ status: "completed", result: "empty_source", sourceCount: 0, processedAt }, { merge: true });
  return true;
}
