/** Scheduling roster projection. Complete attendance records remain access controlled. */
import { Timestamp } from "firebase-admin/firestore";

export const ROSTER_FIELDS = ["eventId", "userId", "areaId", "roleId", "roleName", "status", "createdAt", "updatedAt"];
const id = (value: unknown): value is string => typeof value === "string" && !!value && Buffer.byteLength(value) <= 1500 && !/[\/\x00-\x1f]/.test(value) && value !== "." && value !== "..";

export function assignmentActorContext(profile: any, uid: string) {
  const role = typeof profile?.role === "string" ? profile.role : "";
  const scoped = /^(?:ministry_admin|ministry_subadmin)_(.+)$/.exec(role);
  const generic = role === "ministry_admin" || role === "ministry_subadmin";
  // Scoped roles represent exactly one area even if a legacy array disagrees.
  const assignedMinistries = scoped ? [scoped[1]].filter(id) : generic && Array.isArray(profile?.assignedMinistries)
    ? [...new Set(profile.assignedMinistries.filter(id))] : [];
  return { uid, role, isAdmin: role === "admin" || role === "master_admin", isMinistryRestricted: generic || !!scoped, assignedMinistries };
}

/** Whitelist both keys and value types: nested objects cannot smuggle GPS/token data. */
export function publicAssignmentRoster(data: any, eventId: string): any {
  if (!id(eventId)) throw new Error("INVALID_ASSIGNMENT_PATH");
  const roster: any = { eventId };
  for (const key of ["userId", "areaId", "roleId"]) if (id(data?.[key])) roster[key] = data[key];
  if (typeof data?.roleName === "string" && data.roleName.length <= 120 && !/[\x00-\x1f]/.test(data.roleName)) roster.roleName = data.roleName;
  if (typeof data?.status === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(data.status)) roster.status = data.status;
  for (const key of ["createdAt", "updatedAt"]) {
    const value = data?.[key];
    if (value instanceof Timestamp) roster[key] = value;
    else if (value instanceof Date && Number.isFinite(value.getTime())) roster[key] = value;
    else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value))) roster[key] = new Date(value).toISOString();
  }
  return roster;
}

export function canReadFullAssignment(data: any, context: any): boolean {
  return context.isAdmin === true || !!context.uid && data?.userId === context.uid ||
    context.isMinistryRestricted === true && Array.isArray(context.assignedMinistries) && context.assignedMinistries.includes(data?.areaId);
}

export function assignmentForActor(data: any, assignmentId: string, eventId: string, context: any): any {
  return { ...(canReadFullAssignment(data, context) ? data : publicAssignmentRoster(data, eventId)), id: assignmentId, eventId };
}

/** Read current state in a transaction so a delayed trigger cannot resurrect stale/deleted data. */
export async function syncAssignmentRoster({ db, eventId, assignmentId }: { db: any; eventId: string; assignmentId: string }) {
  if (!id(eventId) || !id(assignmentId)) throw new Error("INVALID_ASSIGNMENT_PATH");
  const source = db.doc(`events/${eventId}/assignments/${assignmentId}`);
  const target = db.doc(`events/${eventId}/assignment_roster/${assignmentId}`);
  return db.runTransaction(async (transaction: any) => {
    const latest = await transaction.get(source);
    if (!latest.exists) { transaction.delete(target); return { projected: false, removed: true }; }
    // Replace, never merge: a previous projection cannot retain a removed field.
    transaction.set(target, publicAssignmentRoster(latest.data(), eventId));
    return { projected: true, removed: false };
  });
}

/** Never turn an authorized attendance read into a reusable bearer URL. */
export function servePrivateAttendance({ objectPath, file, metadata, filename, inline, res }: any): boolean {
  if (typeof objectPath !== "string" || !objectPath.startsWith("attendance/")) return false;
  res.setHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Vary", "Authorization, Cookie");
  res.setHeader("Content-Type", metadata.contentType || "application/octet-stream");
  res.setHeader("Content-Disposition", `${inline ? "inline" : "attachment"}; filename="${encodeURIComponent(String(filename || "attendance"))}"`);
  const source = file.createReadStream();
  const detach = () => res.removeListener("close", cancel);
  const cancel = () => { detach(); if (!source.destroyed) source.destroy(); };
  res.once("close", cancel);
  source.once("end", detach);
  source.once("error", detach);
  source.on("error", () => {
    if (!res.headersSent) res.status(500).json({ error: "ATTENDANCE_READ_FAILED" });
    else if (typeof res.destroy === "function") res.destroy();
  });
  source.pipe(res);
  return true;
}
