import test from "node:test";
import assert from "node:assert/strict";
import {
  boundedEventQuery,
  eventDateWindow,
  eventPage,
  ecuadorCalendarDate,
  createEventAssignmentFeed,
} from "../frontend/src/services/bounded-event-queries.js";

const doc = (id, data = {}) => ({ id, data: () => data });
function feedFixture() {
  const subscriptions = new Map(),
    output = [],
    failures = [];
  let eventNext,
    eventError,
    eventsStopped = 0,
    assignmentStarts = 0;
  const stop = createEventAssignmentFeed({
    watchEvents(next, error) {
      eventNext = next;
      eventError = error;
      return () => eventsStopped++;
    },
    watchAssignments(id, next, error) {
      assignmentStarts++;
      const subscription = { next, error, stops: 0 };
      subscriptions.set(id, subscription);
      return () => subscription.stops++;
    },
    next: (value) => output.push(value),
    error: (error) => failures.push(error),
  });
  return {
    stop,
    subscriptions,
    output,
    failures,
    events: (docs) => eventNext({ docs }),
    eventError: (error) => eventError(error),
    get eventsStopped() {
      return eventsStopped;
    },
    get assignmentStarts() {
      return assignmentStarts;
    },
  };
}

test("Ecuador defaults retain the local day and month around UTC midnight", () => {
  assert.deepEqual(ecuadorCalendarDate(new Date("2026-11-01T03:30:00Z")), {
    year: "2026",
    month: "10",
    day: "31",
  });
  assert.deepEqual(ecuadorCalendarDate(new Date("2026-11-01T05:30:00Z")), {
    year: "2026",
    month: "11",
    day: "01",
  });
});

test("selected calendar ranges are inclusive, support leap years and distinguish month conventions", () => {
  assert.deepEqual(eventDateWindow("2024", "02"), {
    startDate: "2024-02-01",
    endDate: "2024-02-29",
  });
  assert.deepEqual(eventDateWindow("2026", "1", { zeroBasedMonth: true }), {
    startDate: "2026-02-01",
    endDate: "2026-02-28",
  });
  assert.deepEqual(eventDateWindow("2026", "all"), {
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  });
  assert.equal(eventDateWindow("all", "all"), null);
  assert.throws(() => eventDateWindow("bad", "1"), /INVALID_EVENT_YEAR/);
  assert.throws(() => eventDateWindow("2026", "13"), /INVALID_EVENT_MONTH/);
});

test("event queries apply date bounds on the server and cap each user-requested page with a sentinel", () => {
  const sdk = {
    query: (...args) => args,
    where: (...args) => ["where", ...args],
    orderBy: (...args) => ["orderBy", ...args],
    limit: (...args) => ["limit", ...args],
  };
  assert.deepEqual(
    boundedEventQuery(sdk, "events", eventDateWindow("2026", "10"), 50),
    [
      "events",
      ["where", "date", ">=", "2026-10-01"],
      ["where", "date", "<=", "2026-10-31"],
      ["orderBy", "date", "desc"],
      ["limit", 51],
    ],
  );
  assert.deepEqual(boundedEventQuery(sdk, "events", null, 9999), [
    "events",
    ["orderBy", "date", "desc"],
    ["limit", 201],
  ]);
  const docs = Array.from({ length: 51 }, (_, i) => doc(String(i)));
  assert.equal(eventPage({ docs }, 50).docs.length, 50);
  assert.equal(eventPage({ docs }, 50).hasMore, true);
  assert.equal(eventPage({ docs: docs.slice(0, 50) }, 50).hasMore, false);
});

test("attendance joins authorized snapshots without initiating another event or assignment read", () => {
  const f = feedFixture();
  f.events([doc("a", { title: "A" }), doc("b", { title: "B" })]);
  f.subscriptions
    .get("a")
    .next({ docs: [doc("a1", { userId: "owner", checkInTime: "initial" })] });
  assert.equal(f.output.length, 0, "do not publish incomplete totals");
  f.subscriptions.get("b").next({ docs: [] });
  assert.equal(f.output.length, 1);
  assert.equal(f.assignmentStarts, 2);
  f.subscriptions
    .get("a")
    .next({ docs: [doc("a1", { userId: "owner", checkInTime: "updated" })] });
  assert.equal(f.output.length, 2);
  assert.equal(
    f.assignmentStarts,
    2,
    "reuse existing subscriptions on attendance updates",
  );
  assert.equal(
    f.output.at(-1).assignments.get("a").docs[0].data().checkInTime,
    "updated",
  );
  f.stop();
});

test("event metadata changes preserve live assignment subscriptions and deletions remove their rows", () => {
  const f = feedFixture();
  f.events([doc("a", { title: "Before" }), doc("b")]);
  const a = f.subscriptions.get("a"),
    b = f.subscriptions.get("b");
  a.next({ docs: [doc("one")] });
  b.next({ docs: [doc("two")] });
  f.events([doc("a", { title: "After" })]);
  assert.equal(f.assignmentStarts, 2);
  assert.equal(b.stops, 1);
  assert.equal(f.output.at(-1).events[0].title, "After");
  assert.deepEqual([...f.output.at(-1).assignments.keys()], ["a"]);
  const count = f.output.length;
  b.next({ docs: [doc("late-private-row")] });
  assert.equal(f.output.length, count);
  f.stop();
  assert.equal(a.stops, 1);
  assert.equal(b.stops, 1);
});

test("disposal is idempotent and ignores late callbacks from an old view or permission scope", () => {
  const f = feedFixture();
  f.events([doc("old")]);
  const old = f.subscriptions.get("old");
  old.next({ docs: [doc("old-private-row")] });
  const count = f.output.length;
  f.stop();
  f.stop();
  old.next({ docs: [doc("should-not-render")] });
  f.events([doc("new-event")]);
  f.eventError(new Error("late error"));
  assert.equal(f.output.length, count);
  assert.equal(f.eventsStopped, 1);
  assert.equal(old.stops, 1);
  assert.equal(f.assignmentStarts, 1);
  assert.deepEqual(f.failures, []);
});

test("an empty range emits an empty summary and removes previous event subscriptions", () => {
  const f = feedFixture();
  f.events([doc("a")]);
  const previous = f.subscriptions.get("a");
  previous.next({ docs: [doc("row")] });
  f.events([]);
  assert.equal(previous.stops, 1);
  assert.deepEqual(f.output.at(-1).events, []);
  assert.equal(f.output.at(-1).assignments.size, 0);
  f.stop();
});

test("permission errors are surfaced without publishing a partial attendance total", () => {
  const f = feedFixture();
  f.events([doc("a"), doc("denied")]);
  f.subscriptions.get("a").next({ docs: [doc("row")] });
  const denied = new Error("permission-denied");
  f.subscriptions.get("denied").error(denied);
  assert.deepEqual(f.failures, [denied]);
  assert.deepEqual(f.output, []);
  f.stop();
});

test("a synchronous assignment subscription failure closes earlier handles and the event source", () => {
  const failure = new Error("invalid assignment query");
  const failures = [];
  let eventStops = 0,
    assignmentStops = 0,
    output = 0;
  const close = createEventAssignmentFeed({
    watchEvents(next) {
      next({ docs: [doc("valid"), doc("invalid")] });
      return () => eventStops++;
    },
    watchAssignments(id) {
      if (id === "invalid") throw failure;
      return () => assignmentStops++;
    },
    next() {
      output++;
    },
    error: (error) => failures.push(error),
  });
  assert.deepEqual(failures, [failure]);
  assert.equal(output, 0);
  assert.equal(eventStops, 1);
  assert.equal(assignmentStops, 1);
  close();
  assert.equal(eventStops, 1);
  assert.equal(assignmentStops, 1);
});

test("synchronous terminal callbacks dispose handles returned after the callback", () => {
  const failure = new Error("permission-denied");
  const failures = [];
  let eventStops = 0,
    assignmentStops = 0;
  const close = createEventAssignmentFeed({
    watchEvents(next) {
      next({ docs: [doc("denied")] });
      return () => eventStops++;
    },
    watchAssignments(_id, _next, error) {
      error(failure);
      return () => assignmentStops++;
    },
    next() {
      assert.fail("a failed scope cannot publish a summary");
    },
    error: (error) => failures.push(error),
  });
  assert.deepEqual(failures, [failure]);
  assert.equal(eventStops, 1);
  assert.equal(assignmentStops, 1);
  close();
  assert.equal(eventStops, 1);
  assert.equal(assignmentStops, 1);
});
