/** Event-first history also handles legacy assignment documents without eventDate. */
import { getEcuadorDateString } from "./notification-utils";

function date(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T12:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function historyFilters(query: any, now = Date.now()) {
  const all = query.all === "1";
  const current = getEcuadorDateString(0, now);
  const month = current.slice(0, 7);
  const monthEnd = new Date(Date.UTC(Number(current.slice(0, 4)), Number(current.slice(5, 7)), 0)).toISOString().slice(0, 10);
  const startDate = all ? null : String(query.startDate || month + "-01");
  const endDate = all ? null : String(query.endDate || monthEnd);
  if (!all && (!date(startDate) || !date(endDate) || startDate! > endDate!)) throw Object.assign(new Error("INVALID_DATE_RANGE"), { status: 400 });
  const requested = query.limit === undefined ? 50 : Number(query.limit);
  if (!Number.isInteger(requested) || requested < 1 || requested > 200) throw Object.assign(new Error("INVALID_LIMIT"), { status: 400 });
  return { startDate, endDate, limit: requested };
}

export async function userServiceHistory(db: any, uid: string, query: any, now = Date.now()) {
  const filters = historyFilters(query, now);
  let eventsQuery = db.collection("events").orderBy("date", "desc");
  if (filters.startDate) eventsQuery = eventsQuery.where("date", ">=", filters.startDate).where("date", "<=", filters.endDate);
  const snapshot = await eventsQuery.limit(filters.limit + 1).get();
  const selected = snapshot.docs.slice(0, filters.limit);
  const results = await Promise.all(selected.map(async (document: any) => {
    const assignments = await document.ref.collection("assignments").where("userId", "==", uid).get();
    return { document, assignments };
  }));
  const assignments: any[] = [], events: any[] = [];
  for (const item of results) {
    if (item.assignments.empty) continue;
    const data = item.document.data();
    const event: any = { id: item.document.id, title: data.title || "", date: data.date || "", time: data.time || "", location: data.location || "" };
    for (const field of ["serviceTime", "endTime", "status"]) if (data[field] !== undefined) event[field] = data[field];
    events.push(event);
    for (const document of item.assignments.docs) assignments.push({ ...document.data(), id: document.id, eventId: item.document.id });
  }
  return { ok: true, assignments, events, hasMore: snapshot.docs.length > filters.limit, limit: filters.limit, startDate: filters.startDate, endDate: filters.endDate };
}
