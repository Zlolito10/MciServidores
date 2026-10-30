/** Real read-time requests only. An unsupported or nonhistorical result cannot authorize restore. */
import { Timestamp } from "firebase-admin/firestore";
const failure = (code: string, status: number) => Object.assign(new Error(code), { code, status });

export function historicalReadTime(value: unknown, nowMs = Date.now()): Timestamp {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) throw failure("INVALID_PITR_TIMESTAMP", 400);
  const calendar = new Date(value.slice(0, 10) + "T00:00:00Z");
  if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== value.slice(0, 10)) throw failure("INVALID_PITR_TIMESTAMP", 400);
  const milliseconds = Date.parse(value);
  const age = nowMs - milliseconds;
  if (!Number.isFinite(milliseconds) || !Number.isFinite(nowMs) || age <= 0 || age > 7 * 86400000) throw failure("INVALID_PITR_WINDOW", 400);
  // Google permits microsecond precision in the past hour, whole minutes beyond.
  if (age > 3600000 && milliseconds % 60000 !== 0) throw failure("INVALID_PITR_PRECISION", 400);
  return Timestamp.fromMillis(milliseconds);
}

function requireExactReadTime(snapshot: any, readTime: Timestamp) {
  if (!(snapshot?.readTime instanceof Timestamp) || !snapshot.readTime.isEqual(readTime)) throw failure("PITR_UNAVAILABLE", 501);
}

export async function readHistoricalAssignments(db: any, eventId: string, value: unknown, { nowMs = Date.now() } = {}) {
  if (!eventId || /[\/\x00-\x1f]/.test(eventId) || Buffer.byteLength(eventId) > 1500) throw failure("INVALID_EVENT_ID", 400);
  const readTime = historicalReadTime(value, nowMs);
  try {
    return await db.runTransaction(async (transaction: any) => {
      const event = await transaction.get(db.doc(`events/${eventId}`));
      const assignments = await transaction.get(db.collection(`events/${eventId}/assignments`).limit(501));
      requireExactReadTime(event, readTime);
      requireExactReadTime(assignments, readTime);
      for (const document of assignments.docs) requireExactReadTime(document, readTime);
      if (assignments.size > 500) throw failure("PITR_RESULT_LIMIT", 413);
      return { event, assignments, snapshotTime: readTime.toDate().toISOString(), historicalReadTimeVerified: true };
    }, { readOnly: true, readTime });
  } catch (error) {
    if ((error as any)?.code === "PITR_RESULT_LIMIT") throw error;
    throw failure("PITR_UNAVAILABLE", 501);
  }
}
