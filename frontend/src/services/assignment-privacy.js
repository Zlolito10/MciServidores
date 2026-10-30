// New recovery policy, aligned with Firestore rules and the backend actor scope.
export function assignmentScope(uid, profile) {
  const role = profile?.uid === uid && typeof profile?.role === 'string' ? profile.role : '';
  const scoped = /^(?:ministry_admin|ministry_subadmin)_(.+)$/.exec(role);
  const areaIds = scoped ? [scoped[1]] : ['ministry_admin', 'ministry_subadmin'].includes(role)
    ? (Array.isArray(profile.assignedMinistries) ? profile.assignedMinistries : []) : [];
  return { uid: typeof uid === 'string' && uid ? uid : null, all: !!uid && ['admin', 'master_admin'].includes(role), areaIds: [...new Set(areaIds.filter((id) => typeof id === 'string' && id && !id.includes('/')))] };
}
export function canReadAssignment(scope, assignment) {
  return !!scope.uid && (scope.all || assignment.userId === scope.uid || scope.areaIds.includes(assignment.areaId));
}
export function assignmentScopeKey(scope) { return JSON.stringify([scope.uid, scope.all, [...scope.areaIds].sort()]); }
const rosterFields = ['eventId', 'userId', 'areaId', 'roleId', 'roleName', 'status', 'createdAt', 'updatedAt'];
export function projectAssignmentRoster(assignment) {
  const row = {};
  for (const key of rosterFields) if (assignment[key] !== undefined && (key !== 'roleName' || (typeof assignment[key] === 'string' && assignment[key].length <= 120))) row[key] = assignment[key];
  return { ...row, id: assignment.id };
}
export function assignmentView(rows, scope, users = [], areas = []) {
  return rows.map((original) => {
    const visible = canReadAssignment(scope, original) && original.attendanceVisible !== false;
    const row = visible ? { ...original } : projectAssignmentRoster(original);
    const user = users.find((candidate) => (candidate.id || candidate.uid) === row.userId);
    const area = areas.find((candidate) => candidate.id === row.areaId);
    return { ...row, userName: user?.name || user?.displayName || row.userName || 'Nombre no disponible', areaName: area?.name || row.areaName || '', attendanceVisible: visible };
  });
}
function accepts(value, filter) {
  if (filter.op === '==') return value === filter.value;
  if (filter.op === 'in') return Array.isArray(filter.value) && filter.value.includes(value);
  if (filter.op === '!=') return value !== filter.value;
  if (filter.op === 'not-in') return Array.isArray(filter.value) && !filter.value.includes(value);
  return false;
}
/** Plans an OR union of separately authorized queries; never expands a failed query. */
export function assignmentReadPlans(scope, filters = []) {
  if (!scope.uid) return [];
  if (scope.all) return [{ filters }];
  const plans = [];
  const userFilters = filters.filter((filter) => filter.field === 'userId');
  if (userFilters.every((filter) => accepts(scope.uid, filter))) plans.push({ filters: [...filters.filter((filter) => filter.field !== 'userId'), { field: 'userId', op: '==', value: scope.uid }] });
  const areaFilters = filters.filter((filter) => filter.field === 'areaId');
  const allowed = scope.areaIds.filter((id) => areaFilters.every((filter) => accepts(id, filter)));
  // Keep DNF below Firestore's limit when another field already has an IN.
  const size = filters.some((filter) => filter.field !== 'areaId' && ['in', 'array-contains-any'].includes(filter.op)) ? 1 : 10;
  for (let index = 0; index < allowed.length; index += size) {
    const ids = allowed.slice(index, index + size);
    plans.push({ filters: [...filters.filter((filter) => filter.field !== 'areaId'), { field: 'areaId', op: ids.length === 1 ? '==' : 'in', value: ids.length === 1 ? ids[0] : ids }] });
  }
  return plans;
}

/** Tracks public query constructors instead of reading private Firebase SDK fields. */
export function createAssignmentReader(sdk, getScope) {
  const sources = new WeakMap(), conditions = new WeakMap();
  const collection = (...args) => { const result = sdk.collection(...args); if (result.id === 'assignments' || /(?:^|\/)assignments$/.test(String(args.at(-1)))) sources.set(result, { base: result, constraints: [] }); return result; };
  const where = (field, op, value) => { const result = sdk.where(field, op, value); conditions.set(result, { field, op, value }); return result; };
  const query = (source, ...constraints) => { const result = sdk.query(source, ...constraints); const metadata = sources.get(source); if (metadata) sources.set(result, { base: metadata.base, constraints: [...metadata.constraints, ...constraints] }); return result; };
  function queries(source, profile) {
    const metadata = sources.get(source);
    if (!metadata) return [source];
    const filters = metadata.constraints.map((condition) => conditions.get(condition)).filter(Boolean);
    const other = metadata.constraints.filter((condition) => !conditions.has(condition));
    return assignmentReadPlans(getScope(profile), filters).map((plan) => sdk.query(metadata.base, ...other, ...plan.filters.map((filter) => sdk.where(filter.field, filter.op, filter.value))));
  }
  function snapshot(results) {
    const docs = [...new Map(results.flatMap((result) => result.docs || []).map((doc) => [doc.ref?.path || doc.id, doc])).values()];
    return { docs, size: docs.length, empty: docs.length === 0, forEach: (callback) => docs.forEach(callback) };
  }
  return {
    collection, query, where,
    register(source) { sources.set(source, { base: source, constraints: [] }); },
    async getDocs(source, profile) { if (!sources.has(source)) return sdk.getDocs(source); return snapshot(await Promise.all(queries(source, profile).map((candidate) => sdk.getDocs(candidate)))); },
    onSnapshot(source, profile, next, error) {
      if (!sources.has(source)) return sdk.onSnapshot(source, next, error);
      let closed = false;
      const planned = queries(source, profile), results = new Map();
      if (!planned.length) { queueMicrotask(() => { if (!closed) next(snapshot([])); }); return () => { closed = true; }; }
      const stops = planned.map((candidate, index) => sdk.onSnapshot(candidate, (result) => {
        if (closed) return;
        results.set(index, result);
        if (results.size === planned.length) next(snapshot([...results.values()]));
      }, (failure) => { if (!closed) error?.(failure); }));
      return () => { closed = true; stops.forEach((stop) => stop()); };
    },
  };
}
