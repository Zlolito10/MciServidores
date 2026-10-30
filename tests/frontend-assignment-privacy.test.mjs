import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { assignmentScope, assignmentScopeKey, assignmentReadPlans, assignmentView, createAssignmentReader } from '../frontend/src/services/assignment-privacy.js';
const member = { uid: 'self', role: 'user', assignedMinistries: ['foreign'] };
test('ordinary members and a mismatched cached profile can query only their own private assignments', () => {
  assert.deepEqual(assignmentReadPlans(assignmentScope('self', member)), [{ filters: [{ field: 'userId', op: '==', value: 'self' }] }]);
  assert.equal(assignmentScope('self', { uid: 'another', role: 'admin' }).all, false);
  assert.deepEqual(assignmentReadPlans(assignmentScope(null, member)), []);
});
test('scoped roles ignore contradictory ministry arrays; generic managers use ID chunks only', () => {
  const scoped = assignmentScope('self', { uid: 'self', role: 'ministry_admin_audio', assignedMinistries: ['video'], areas: ['Alabanza'] });
  assert.deepEqual(scoped.areaIds, ['audio']);
  const generic = assignmentScope('self', { uid: 'self', role: 'ministry_subadmin', assignedMinistries: Array.from({ length: 23 }, (_, index) => 'area-' + index), areas: ['Never an authority'] });
  const plans = assignmentReadPlans(generic);
  assert.equal(plans.length, 4);
  assert.ok(plans.slice(1).every((plan) => plan.filters.find((filter) => filter.field === 'areaId').value.length <= 10));
  const filtered = assignmentReadPlans(scoped, [{ field: 'areaId', op: 'in', value: ['video'] }]);
  assert.equal(filtered.length, 1); assert.equal(filtered[0].filters.some((filter) => filter.field === 'userId'), true);
  assert.notEqual(assignmentScopeKey(scoped), assignmentScopeKey(assignmentScope('different', member)));
});
test('ordinary member views keep their own details and discard another member photo, GPS, notes and URLs', () => {
  const rows = [
    { id: 'own', userId: 'self', areaId: 'audio', roleName: 'Sonido', attendanceStatus: 'present', checkInPhoto: 'attendance/e/own/a.jpg', checkInLocation: { lat: 1, lng: 2 } },
    { id: 'other', userId: 'other', areaId: 'audio', roleName: 'Cámara real', status: 'assigned', attendanceStatus: 'late', checkInPhoto: 'https://private.invalid/photo', checkInLocation: { lat: 9 }, notes: 'private', userPhoto: 'private' },
  ];
  const view = assignmentView(rows, assignmentScope('self', member), [], [{ id: 'audio', name: 'Audiovisuales' }]);
  assert.equal(view[0].checkInPhoto, rows[0].checkInPhoto); assert.equal(view[0].attendanceVisible, true);
  assert.equal(view[1].roleName, 'Cámara real'); assert.equal(view[1].areaName, 'Audiovisuales'); assert.equal(view[1].userName, 'Nombre no disponible'); assert.equal(view[1].attendanceVisible, false);
  for (const key of ['attendanceStatus', 'checkInPhoto', 'checkInLocation', 'notes', 'userPhoto']) assert.equal(key in view[1], false);
  const roster = assignmentView([{ ...rows[0], attendanceVisible: false }], assignmentScope('self', member));
  assert.equal(roster[0].attendanceVisible, false); assert.equal('attendanceStatus' in roster[0], false);
});
test('available public names and real legacy role labels are resolved without manufacturing role IDs', () => {
  const [row] = assignmentView([{ id: 'a', userId: 'other', areaId: 'music', roleName: 'Guitarra' }], assignmentScope('self', member), [{ id: 'other', name: 'Nombre público' }], [{ id: 'music', name: 'Alabanza' }]);
  assert.equal(row.userName, 'Nombre público'); assert.equal(row.roleName, 'Guitarra'); assert.equal('roleId' in row, false);
});
function sdkFixture({ fail = false } = {}) {
  const calls = [], rows = [
    { id: 'own', userId: 'self', areaId: 'video' },
    { id: 'managed', userId: 'other', areaId: 'audio' },
    { id: 'private', userId: 'other', areaId: 'video' },
  ];
  const docs = (query) => rows.filter((row) => query.filters.every((filter) => filter.op === '==' ? row[filter.field] === filter.value : filter.value.includes(row[filter.field]))).map((row) => ({ id: row.id, ref: { path: 'events/e/assignments/' + row.id }, data: () => row }));
  const sdk = {
    collection: (...segments) => ({ id: segments.at(-1), filters: [] }),
    where: (field, op, value) => ({ field, op, value }),
    query: (source, ...filters) => ({ id: source.id, filters: [...source.filters, ...filters] }),
    getDocs: async (query) => { calls.push(query); if (fail) throw Object.assign(Error('index missing'), { code: 'failed-precondition' }); return { docs: docs(query) }; },
    onSnapshot: (query, next) => { calls.push(query); next({ docs: docs(query) }); return () => {}; },
  };
  return { calls, sdk };
}
test('authorized query unions retrieve only owner/managed areas and de-duplicate overlapping documents', async () => {
  const { sdk, calls } = sdkFixture();
  const reader = createAssignmentReader(sdk, (profile) => assignmentScope('self', profile));
  const source = reader.collection('db', 'events', 'e', 'assignments');
  const result = await reader.getDocs(source, { uid: 'self', role: 'ministry_admin_audio', assignedMinistries: ['video'] });
  assert.deepEqual(result.docs.map((doc) => doc.id).sort(), ['managed', 'own']);
  assert.ok(calls.every((query) => query.filters.some((filter) => filter.field === 'userId' || filter.field === 'areaId')));
  const admin = await reader.getDocs(source, { uid: 'self', role: 'admin' });
  assert.equal(admin.docs.length, 3);
});
test('an index/permission error never retries an unrestricted assignments scan', async () => {
  const { sdk, calls } = sdkFixture({ fail: true });
  const reader = createAssignmentReader(sdk, () => assignmentScope('self', member));
  const source = reader.query(reader.collection('db', 'events', 'e', 'assignments'), reader.where('userId', '==', 'self'));
  await assert.rejects(reader.getDocs(source, member), /index missing/);
  assert.equal(calls.length, 1); assert.deepEqual(calls[0].filters, [{ field: 'userId', op: '==', value: 'self' }]);
});
test('generated readers use roster views, scoped full reads and attendance Storage paths', async () => {
  for (const page of ['EventDetails', 'Events']) {
    const source = await readFile(new URL('../frontend/src/pages/' + page + '.jsx', import.meta.url), 'utf8');
    assert.match(source, /watchAssignmentView\(/); assert.match(source, /prepareAssignmentView\(/);
  }
  const attendance = await readFile(new URL('../frontend/src/pages/Attendance.jsx', import.meta.url), 'utf8');
  const ast = parse(attendance, { sourceType: 'module', plugins: ['jsx'] });
  let rawReads = 0;
  traverse(ast, { CallExpression(path) { if (['ye', 'gt'].includes(path.node.callee.name)) rawReads++; } });
  assert.equal(rawReads, 0); assert.equal(attendance.includes('getAssignmentDocsForUserInEvent(fallback)'), false);
  assert.match(attendance, /assignmentPrivacyKey\(re\)/);
  const dashboard = await readFile(new URL('../frontend/src/pages/Dashboard.jsx', import.meta.url), 'utf8');
  assert.match(dashboard, /Q = Z\.fullPath/); assert.equal(dashboard.includes('await rs(Z)'), false);
});
