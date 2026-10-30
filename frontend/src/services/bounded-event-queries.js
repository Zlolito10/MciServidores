// Query planning and lifecycle for bounded, permission-scoped event views.
// This module never stores snapshots beyond the lifetime of a mounted view.
export const EVENT_PAGE_SIZE = 50;
export const EVENT_RESULT_LIMIT = 200;

export function ecuadorCalendarDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guayaquil",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
}

export function eventDateWindow(
  year,
  month = "all",
  { zeroBasedMonth = false } = {},
) {
  if (year === "all") return null;
  const numericYear = Number(year);
  if (
    !Number.isInteger(numericYear) ||
    numericYear < 1900 ||
    numericYear > 9998
  )
    throw new Error("INVALID_EVENT_YEAR");
  if (month === "all")
    return {
      startDate: `${numericYear}-01-01`,
      endDate: `${numericYear}-12-31`,
    };
  const numericMonth = Number(month) + (zeroBasedMonth ? 1 : 0);
  if (!Number.isInteger(numericMonth) || numericMonth < 1 || numericMonth > 12)
    throw new Error("INVALID_EVENT_MONTH");
  const prefix = `${numericYear}-${String(numericMonth).padStart(2, "0")}`;
  const lastDay = new Date(Date.UTC(numericYear, numericMonth, 0)).getUTCDate();
  return {
    startDate: `${prefix}-01`,
    endDate: `${prefix}-${String(lastDay).padStart(2, "0")}`,
  };
}

export function boundedEventQuery(
  sdk,
  source,
  window,
  limit = EVENT_PAGE_SIZE,
) {
  const safeLimit = Math.max(
    EVENT_PAGE_SIZE,
    Math.min(EVENT_RESULT_LIMIT, Math.trunc(Number(limit) || EVENT_PAGE_SIZE)),
  );
  return sdk.query(
    source,
    ...(window
      ? [
          sdk.where("date", ">=", window.startDate),
          sdk.where("date", "<=", window.endDate),
        ]
      : []),
    sdk.orderBy("date", "desc"),
    sdk.limit(safeLimit + 1),
  );
}

export function eventPage(snapshot, limit = EVENT_PAGE_SIZE) {
  const safeLimit = Math.max(
    EVENT_PAGE_SIZE,
    Math.min(EVENT_RESULT_LIMIT, Math.trunc(Number(limit) || EVENT_PAGE_SIZE)),
  );
  return {
    docs: snapshot.docs.slice(0, safeLimit),
    hasMore: snapshot.docs.length > safeLimit,
  };
}

/**
 * Joins one bounded events subscription with only its authorized assignments.
 * Assignment changes reuse the received snapshots instead of re-reading every
 * event. A changed event list preserves subscriptions for unchanged event IDs.
 */
export function createEventAssignmentFeed({
  watchEvents,
  watchAssignments,
  next,
  error = () => {},
}) {
  let closed = false,
    eventDocs = [],
    stopEvents;
  const subscriptions = new Map();
  const stopEventSource = () => {
    const stop = stopEvents;
    stopEvents = undefined;
    stop?.();
  };
  const close = () => {
    if (closed) return;
    closed = true;
    stopEventSource();
    for (const subscription of subscriptions.values()) subscription.stop?.();
    subscriptions.clear();
    eventDocs = [];
  };
  const fail = (failure) => {
    if (!closed) error(failure);
  };
  const fatal = (failure) => {
    fail(failure);
    close();
  };
  const emit = () => {
    if (
      closed ||
      eventDocs.some((event) => !subscriptions.get(event.id)?.ready)
    )
      return;
    try {
      next({
        events: eventDocs.map((doc) => ({ id: doc.id, ...doc.data() })),
        assignments: new Map(
          eventDocs.map((doc) => [doc.id, subscriptions.get(doc.id).snapshot]),
        ),
      });
    } catch (failure) {
      fatal(failure);
    }
  };
  const onEvents = (snapshot) => {
    if (closed) return;
    try {
      eventDocs = snapshot.docs;
      const ids = new Set(eventDocs.map((doc) => doc.id));
      for (const [id, subscription] of subscriptions) {
        if (!ids.has(id)) {
          subscription.stop?.();
          subscriptions.delete(id);
        }
      }
      for (const event of eventDocs) {
        if (subscriptions.has(event.id)) continue;
        const subscription = { ready: false, snapshot: null, stop: null };
        subscriptions.set(event.id, subscription);
        subscription.stop = watchAssignments(
          event.id,
          (assignments) => {
            if (closed || subscriptions.get(event.id) !== subscription) return;
            subscription.snapshot = assignments;
            subscription.ready = true;
            emit();
          },
          fatal,
        );
        // An adapter can deliver a synchronous terminal error before returning
        // its disposer; close that newly returned handle as well.
        if (closed) {
          subscription.stop?.();
          return;
        }
      }
      emit();
    } catch (failure) {
      fatal(failure);
    }
  };
  try {
    stopEvents = watchEvents(onEvents, fatal);
    // Covers synchronous callbacks/errors that closed the feed while subscribing.
    if (closed) stopEventSource();
  } catch (failure) {
    fatal(failure);
  }
  return close;
}
