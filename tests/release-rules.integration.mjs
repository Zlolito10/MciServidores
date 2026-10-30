import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';

// Deliberately separate from npm test: this exercises the running demo services.
// Every resource uses a unique prefix; no existing account or fixture is reset.
const project = 'demo-mci-servidores';
const require = createRequire(new URL('../functions/package.json', import.meta.url));
const admin = require('firebase-admin');
const prefix = 'release-rules-' + randomUUID().slice(0, 8);
const flows = [];
const evidence = [];
const encode = value => {
  if (value === null) return {nullValue: null};
  if (value instanceof Date) return {timestampValue: value.toISOString()};
  if (Array.isArray(value)) return {arrayValue: {values: value.map(encode)}};
  if (typeof value === 'object') return {mapValue: {fields: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, encode(v)]))}};
  if (typeof value === 'boolean') return {booleanValue: value};
  if (typeof value === 'number') return {integerValue: String(value)};
  return {stringValue: value};
};
async function document(path, actor, data, mask, method = 'PATCH') {
  const url = new URL('http://127.0.0.1:8080/v1/projects/' + project + '/databases/(default)/documents/' + path);
  for (const field of mask || []) url.searchParams.append('updateMask.fieldPaths', field);
  const body = data === undefined ? undefined : JSON.stringify({fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, encode(v)]))});
  const response = await fetch(url, {method, headers: {...(actor ? {Authorization: 'Bearer ' + actor.token} : {}), 'Content-Type': 'application/json'}, body, signal: AbortSignal.timeout(10000)});
  evidence.push({service: 'firestore-rules', method, path: path.replaceAll(prefix, '<fixture>'), status: response.status});
  return response.status;
}
async function assignmentQuery(actor, {collection = 'assignments', field, value, eventId, op = 'EQUAL'} = {}) {
  const parent = eventId ? '/events/' + eventId : '';
  const structuredQuery = {from: [{collectionId: collection, allDescendants: !eventId}], ...(field ? {where: {fieldFilter: {field: {fieldPath: field}, op, value: encode(value)}}} : {})};
  const response = await fetch('http://127.0.0.1:8080/v1/projects/' + project + '/databases/(default)/documents' + parent + ':runQuery', {method: 'POST', headers: {...(actor ? {Authorization: 'Bearer ' + actor.token} : {}), 'Content-Type': 'application/json'}, body: JSON.stringify({structuredQuery}), signal: AbortSignal.timeout(10000)});
  evidence.push({service: 'firestore-rules', method: 'POST', path: '<fixture-query>/' + collection + (field ? '/' + field : '/unscoped'), status: response.status});
  return {status: response.status, data: await response.json()};
}
async function object(path, actor, method = 'POST', type = 'image/png', bytes = Buffer.from('synthetic bytes')) {
  const url = 'http://127.0.0.1:9199/v0/b/' + project + '.appspot.com/o' + (method === 'POST' ? '?uploadType=media&name=' + encodeURIComponent(path) : '/' + encodeURIComponent(path) + (method === 'GET' ? '?alt=media' : ''));
  const response = await fetch(url, {method, headers: {...(actor ? {Authorization: 'Bearer ' + actor.token} : {}), 'Content-Type': type}, ...(method === 'POST' ? {body: bytes} : {}), signal: AbortSignal.timeout(10000)});
  evidence.push({service: 'storage-rules', method, path: path.replaceAll(prefix, '<fixture>'), status: response.status});
  return response.status;
}
async function http(path, actor, {body = {}, cookie = false, csrf = true, bearer, method = 'POST'} = {}) {
  const headers = {'Content-Type': 'application/json'};
  if (actor && cookie) {
    if (!actor.cookie) {
      const response = await fetch('http://127.0.0.1:5001/' + project + '/us-central1/serverApi/api/sessionLogin', {method: 'POST', headers, body: JSON.stringify({idToken: actor.token})});
      assert.equal(response.status, 200);
      actor.cookie = response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
      actor.csrf = (await response.json()).csrfToken;
    }
    headers.cookie = actor.cookie;
    if (csrf) headers['x-xsrf-token'] = actor.csrf;
  } else if (actor) headers.Authorization = 'Bearer ' + actor.token;
  if (bearer) headers.Authorization = 'Bearer ' + bearer;
  const route = path.startsWith('/api/') ? 'serverApi' + path : path.slice(1);
  const response = await fetch('http://127.0.0.1:5001/' + project + '/us-central1/' + route, {method, headers, ...(method === 'GET' ? {} : {body: JSON.stringify(body)}), signal: AbortSignal.timeout(15000)});
  evidence.push({service: 'functions-http', method, path, status: response.status});
  return {status: response.status, data: await response.json(), response};
}

test('release authorization regression tests on isolated local demo fixtures', async t => {
  const hub = await fetch('http://127.0.0.1:4400/emulators', {signal: AbortSignal.timeout(5000)});
  assert.equal(hub.status, 200);
  const services = await hub.json();
  for (const [service, port] of Object.entries({auth: 9099, firestore: 8080, storage: 9199})) {
    assert.equal(services[service]?.port, port);
    assert.ok(['127.0.0.1', 'localhost'].includes(services[service]?.host));
  }
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
  const app = admin.initializeApp({projectId: project, storageBucket: project + '.appspot.com'}, prefix);
  const db = app.firestore(), bucket = app.storage().bucket();
  const identities = {};
  const tracked = new Set();
  const events = [prefix + '-event', prefix + '-other-event'];
  t.after(async () => {
    for (const path of tracked) await db.recursiveDelete(db.doc(path));
    for (const id of events) await db.recursiveDelete(db.doc('events/' + id));
    for (const actor of Object.values(identities)) {
      await db.recursiveDelete(db.doc('users/' + actor.uid));
      await app.auth().deleteUser(actor.uid);
    }
    // Only our exact fixture objects are removed; never a bucket-wide cleanup.
    const [files] = await bucket.getFiles();
    for (const file of files) if (file.name.split('/').some(segment => segment.startsWith(prefix))) await file.delete({ignoreNotFound: true});
    await app.delete();
    await writeFile(new URL('../recovery/release-rules-validation.json', import.meta.url), JSON.stringify({generatedAt: new Date().toISOString(), project, environment: 'running Auth/Firestore/Storage demo emulators', productionServicesUsed: false, existingFixturesReset: false, passed: flows.filter(f => f.status === 'passed').length, failed: flows.filter(f => f.status === 'failed').length, flows, requests: evidence, limitations: ['Emulator rule evaluation does not prove production deployment or Storage cross-service IAM.', 'The exported command worker is invoked directly with a real emulator snapshot; this does not verify Eventarc delivery or scheduling.', 'Admin SDK and download-token URLs bypass client rules; backend guards and token exposure require separate review.']}, null, 2) + '\n');
  });
  for (const [name, role, ministry] of [['master', 'master_admin', 'a'], ['admin', 'admin', 'a'], ['user', 'user', 'a'], ['other', 'user', 'b'], ['ministry', 'ministry_admin_' + prefix + '-a', 'a'], ['teacher', 'user', 'a'], ['generic', 'ministry_admin', 'a'], ['scopedContradiction', 'ministry_subadmin_' + prefix + '-a', 'b']]) {
    const uid = prefix + '-' + name, email = uid + '@example.test', password = randomUUID();
    await app.auth().createUser({uid, email, password});
    await db.doc('users/' + uid).set({uid, email, name, role, assignedMinistries: name === 'generic' ? [prefix + '-a', prefix + '-b'] : [prefix + '-' + ministry], areas: name === 'teacher' ? ['U de la Vida'] : [], preferences: {notifications: false}});
    const response = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-local', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, password, returnSecureToken: true})});
    assert.equal(response.status, 200); identities[name] = {uid, token: (await response.json()).idToken};
  }
  const {master, user, other, ministry, teacher} = identities;
  for (const [i, id] of events.entries()) await db.doc('events/' + id).set({title: 'Synthetic rule fixture', createdBy: master.uid, activeMinistries: [prefix + (i ? '-b' : '-a')]});
  const assignment = 'events/' + events[0] + '/assignments/' + prefix + '-assignment';
  await db.doc(assignment).set({userId: user.uid, areaId: prefix + '-a', userName: 'Synthetic'});
  const check = (name, body) => t.test(name, async () => {try {await body(); flows.push({name, status: 'passed'});} catch (error) {flows.push({name, status: 'failed'}); throw error;}});

  await check('profile additions and deletions cannot grant or remove privileged fields', async () => {
    const path = 'users/' + user.uid;
    assert.equal(await document(path, user, {name: 'Allowed update', photoURL: 'profile-photos/' + user.uid + '/test.png'}, ['name', 'photoURL']), 200);
    assert.equal(await document(path, user, {}, ['photoURL']), 200);
    for (const [field, value] of Object.entries({role: 'master_admin', permissions: ['manage_roles'], assignedMinistries: [prefix + '-b'], areas: ['U de la Vida'], uid: other.uid, email: 'spoof@example.test', username: 'spoof'})) {
      assert.equal(await document(path, user, {[field]: value}, [field]), 403, 'write ' + field);
      if ((await db.doc(path).get()).data()[field] !== undefined) assert.equal(await document(path, user, {}, [field]), 403, 'delete ' + field);
    }
    assert.equal(await document(path, user, {name: 'Replace drops identity and role'}), 403);
    assert.equal((await db.doc(path).get()).data().role, 'user');
  });
  await check('master-admin profile management remains authorized', async () => {
    assert.equal(await document('users/' + other.uid, master, {role: 'admin'}, ['role']), 200);
    await db.doc('users/' + other.uid).update({role: 'user'});
    assert.equal(await document('roles/' + prefix, user, {name: 'Unauthorized'}), 403);
  });
  const command = type => ({type, createdBy: master.uid, createdAt: new Date(), status: 'pending', ...(type === 'RESTORE_REPERTOIRE' ? {eventId: events[0], backupId: prefix + '-backup', collection: 'autoBackups'} : {sourceEventId: events[0], targetEventId: events[1]})});
  let count = 0;
  const submit = (actor, data) => {const path = 'commands/' + prefix + '-' + (++count); tracked.add(path); return document(path, actor, data);};
  await check('command queue rejects anonymous, ordinary and ministry-admin authors', async () => {
    for (const actor of [undefined, user, ministry]) assert.equal(await submit(actor, {...command('REPLICATE_REPERTOIRE'), createdBy: actor?.uid || master.uid}), 403);
    assert.equal(await submit(identities.admin, command('REPLICATE_REPERTOIRE')), 403, 'administrator cannot impersonate another author');
  });
  await check('command queue validates payload, type, status, document IDs and actor binding', async () => {
    const good = command('REPLICATE_REPERTOIRE');
    for (const mutation of [{type: 'DELETE_ALL'}, {targetEventId: good.sourceEventId}, {sourceEventId: 'events/path'}, {targetEventId: '..'}, {sourceEventId: 'bad\\path'}, {sourceEventId: ''}, {createdAt: 'not-a-timestamp'}, {createdBy: user.uid}, {status: 'completed'}, {injected: true}]) assert.equal(await submit(master, {...good, ...mutation}), 403, Object.keys(mutation)[0]);
    assert.equal(await submit(master, {...command('RESTORE_REPERTOIRE'), collection: 'users'}), 403);
    const noAuthor = {...good}; delete noAuthor.createdBy; assert.equal(await submit(master, noAuthor), 403);
  });
  await check('all four legitimate commands remain accepted for full administrators', async () => {
    for (const type of ['REPLICATE_ASSIGNMENTS', 'REPLICATE_REPERTOIRE', 'REPLICATE_MATERIALS', 'RESTORE_REPERTOIRE']) assert.equal(await submit(master, command(type)), 200, type);
    const data = {...command('REPLICATE_MATERIALS'), createdBy: identities.admin.uid}; delete data.status;
    assert.equal(await submit(identities.admin, data), 200);
  });
  await check('assigned users update attendance but cannot rewrite ownership or assignment scope', async () => {
    assert.equal(await document(assignment, user, {checkInTime: new Date().toISOString(), attendanceStatus: 'present'}, ['checkInTime', 'attendanceStatus']), 200);
    for (const data of [{userId: other.uid}, {areaId: prefix + '-b'}, {userName: 'Forged'}, {roleName: 'Administrator'}]) assert.equal(await document(assignment, user, data, Object.keys(data)), 403);
    assert.equal(await document(assignment, user, {}, ['userId']), 403);
    assert.equal(await document(assignment, other, {attendanceStatus: 'completed'}, ['attendanceStatus']), 403);
    assert.equal(await document(assignment, ministry, {roleName: 'Legitimate ministry edit'}, ['roleName']), 200);
    assert.equal(await document(assignment, ministry, {areaId: prefix + '-b'}, ['areaId']), 403);
  });
  await check('private assignment reads and collection-group queries enforce owner or ministry scope', async () => {
    assert.equal(await document(assignment, user, undefined, undefined, 'GET'), 200);
    assert.equal(await document(assignment, ministry, undefined, undefined, 'GET'), 200);
    assert.equal(await document(assignment, master, undefined, undefined, 'GET'), 200);
    assert.equal(await document(assignment, other, undefined, undefined, 'GET'), 403);
    assert.equal((await assignmentQuery(user)).status, 403, 'ordinary users cannot enumerate full assignments');
    assert.equal((await assignmentQuery(user, {field: 'userId', value: user.uid})).status, 200);
    assert.equal((await assignmentQuery(user, {field: 'userId', value: other.uid})).status, 403);
    assert.equal((await assignmentQuery(ministry, {field: 'areaId', value: prefix + '-a'})).status, 200);
    assert.equal((await assignmentQuery(ministry, {field: 'areaId', value: prefix + '-b'})).status, 403);
    assert.equal((await assignmentQuery(ministry, {field: 'areaId', value: [prefix + '-a'], op: 'IN'})).status, 200);
    assert.equal((await assignmentQuery(ministry, {field: 'areaId', value: [prefix + '-a', prefix + '-b'], op: 'IN'})).status, 403);
    assert.equal((await assignmentQuery(identities.generic, {field: 'areaId', value: [prefix + '-a', prefix + '-b'], op: 'IN'})).status, 200);
    assert.equal((await assignmentQuery(identities.scopedContradiction, {field: 'areaId', value: prefix + '-a'})).status, 200);
    assert.equal((await assignmentQuery(identities.scopedContradiction, {field: 'areaId', value: prefix + '-b'})).status, 403, 'scoped role does not inherit contradictory legacy arrays');
    assert.equal((await assignmentQuery(user, {eventId: events[0]})).status, 403);
    assert.equal((await assignmentQuery(user, {eventId: events[0], field: 'userId', value: user.uid})).status, 200);
  });
  await check('minimal assignment roster is readable to authenticated users and never writable by clients', async () => {
    const path = 'events/' + events[0] + '/assignment_roster/' + prefix + '-assignment';
    await db.doc(path).set({eventId: events[0], userId: user.uid, areaId: prefix + '-a', roleId: 'synthetic-role', status: 'assigned'});
    assert.equal(await document(path, other, undefined, undefined, 'GET'), 200);
    assert.equal(await document(path, undefined, undefined, undefined, 'GET'), 403);
    assert.equal((await assignmentQuery(other, {collection: 'assignment_roster'})).status, 200);
    assert.equal(await document(path, master, {checkInPhoto: 'forbidden'}, ['checkInPhoto']), 403);
    assert.equal(await document(path, user, undefined, undefined, 'DELETE'), 403);
  });
  await check('server projection strips private fields, replaces old data and follows source deletion', async () => {
    const {syncAssignmentRoster} = require('../functions/lib/assignment-roster.js');
    const id = prefix + '-projection', source = db.doc('events/' + events[0] + '/assignments/' + id), target = db.doc('events/' + events[0] + '/assignment_roster/' + id);
    await source.set({userId: user.uid, areaId: prefix + '-a', roleId: 'synthetic-role', roleName: 'Legacy role label', status: 'assigned', createdAt: new Date(), updatedAt: new Date(), userName: 'Must not be public', attendanceStatus: 'late', checkInPhoto: 'attendance/synthetic/private.jpg?token=synthetic', checkInTime: new Date().toISOString(), checkInLocation: {lat: 0, lng: 0}});
    await target.set({stalePhoto: 'must disappear', checkInLocation: {lat: 0, lng: 0}});
    await syncAssignmentRoster({db, eventId: events[0], assignmentId: id});
    const roster = (await target.get()).data();
    assert.deepEqual(Object.keys(roster).sort(), ['eventId', 'userId', 'areaId', 'roleId', 'roleName', 'status', 'createdAt', 'updatedAt'].sort());
    assert.equal(roster.userId, user.uid); assert.equal(roster.eventId, events[0]);
    assert.equal(roster.roleName, 'Legacy role label');
    await source.update({roleId: admin.firestore.FieldValue.delete()});
    await syncAssignmentRoster({db, eventId: events[0], assignmentId: id});
    assert.equal((await target.get()).data().roleName, 'Legacy role label', 'legacy role label survives without a role ID');
    assert.equal((await target.get()).data().userName, undefined);
    assert.equal(await document(source.path, other, undefined, undefined, 'GET'), 403);
    assert.equal(await document(target.path, other, undefined, undefined, 'GET'), 200);
    await source.delete();
    await syncAssignmentRoster({db, eventId: events[0], assignmentId: id});
    assert.equal((await target.get()).exists, false);
  });
  await check('Udlv course management is administrative and class records are teacher-bound', async () => {
    const path = 'udlv_classes/' + prefix + '-class', record = 'udlv_class_records/' + prefix + '-record'; tracked.add(path); tracked.add(record);
    assert.equal(await document(path, master, {title: 'Actual client schema without ministryId', teacherId: teacher.uid}), 200);
    assert.equal(await document(path, teacher, undefined, undefined, 'GET'), 200);
    assert.equal(await document(path, user, {title: 'Member overwrite'}, ['title']), 403);
    assert.equal(await document(record, user, {classId: prefix + '-class', studentId: user.uid, attendance: 'present'}), 403);
    assert.equal(await document(record, teacher, {classId: prefix + '-class', studentId: user.uid, attendance: 'present'}), 200);
    assert.equal(await document(record, teacher, {classId: prefix + '-different'}, ['classId']), 403);
  });
  await check('event writes require administrative roles and ministry creators cannot take other events', async () => {
    const path = 'events/' + prefix + '-own-event'; tracked.add(path);
    assert.equal(await document(path, user, {title: 'User injection', createdBy: user.uid}), 403);
    assert.equal(await document(path, ministry, {title: 'Ministry event', createdBy: ministry.uid, activeMinistries: [prefix + '-a']}), 200);
    assert.equal(await document(path, ministry, {title: 'Legitimate edit'}, ['title']), 200);
    assert.equal(await document(path, ministry, {createdBy: master.uid}, ['createdBy']), 403);
    assert.equal(await document('events/' + events[1], ministry, {title: 'Cross-owner overwrite'}, ['title']), 403);
    assert.equal(await document('events/' + events[1], user, undefined, undefined, 'DELETE'), 403);
    assert.equal(await document(path, ministry, undefined, undefined, 'DELETE'), 200);
  });
  await check('private chat authors cannot impersonate administrators and system caches stay server-only', async () => {
    const path = 'private_chats/' + user.uid + '/messages/' + prefix, parent = 'private_chats/' + user.uid;
    tracked.add(parent);
    const message = {text: 'Synthetic chat', senderId: user.uid, senderName: 'User', createdAt: new Date(), isAdmin: false};
    assert.equal(await document(path, user, {...message, isAdmin: true}), 403);
    assert.equal(await document(path, user, {...message, senderId: master.uid}), 403);
    assert.equal(await document(path, user, message), 200);
    assert.equal(await document(path, user, {text: 'History rewrite'}, ['text']), 403);
    assert.equal(await document(parent, user, {clearedAt: new Date()}), 403);
    assert.equal(await document(parent, master, {clearedAt: new Date()}), 200);
    assert.equal(await document('app_cache/' + prefix, master, {users: [{role: 'master_admin'}]}), 403);
  });
  const png = await require('sharp')({create: {width: 3, height: 3, channels: 3, background: '#245185'}}).png().toBuffer();
  await check('Storage profile owner writes remain allowed, other-user writes and non-images fail', async () => {
    const path = 'profile-photos/' + user.uid + '/rule.png';
    assert.equal(await object(path, user, 'POST', 'image/png', png), 200);
    assert.equal(await object(path, other, 'POST', 'image/png', png), 403);
    assert.equal(await object(path, user, 'POST', 'text/plain'), 403);
    assert.equal(await object(path, other, 'DELETE'), 403);
    assert.equal(await object(path, user, 'DELETE'), 204);
  });
  await check('Storage materials require full administrator for create, replace and delete', async () => {
    const path = 'events/' + events[0] + '/materials/' + prefix + '.txt';
    assert.equal(await object(path, user, 'POST', 'text/plain'), 403);
    assert.equal(await object(path, ministry, 'POST', 'text/plain'), 403);
    assert.equal(await object(path, master, 'POST', 'text/plain'), 200);
    assert.equal(await object(path, user, 'GET'), 200);
    assert.equal(await object(path, user, 'DELETE'), 403);
    assert.equal(await object(path, master, 'DELETE'), 204);
  });
  await check('Storage attendance objects enforce assignment ownership on reads and writes', async () => {
    const path = 'attendance/' + events[0] + '/' + prefix + '-assignment/photo.png';
    assert.equal(await object(path, user, 'POST', 'image/png', png), 200);
    for (const method of ['GET', 'POST', 'DELETE']) assert.equal(await object(path, other, method, 'image/png', png), 403, method);
    assert.equal(await object(path, ministry, 'GET'), 200);
    assert.equal(await object(path, identities.scopedContradiction, 'GET'), 200);
    assert.equal(await object(path, master, 'GET'), 200);
    assert.equal(await object(path, user, 'DELETE'), 204);
  });
  await check('Storage image writes use event scope and administrative global configuration', async () => {
    const own = 'event-images/' + events[0] + '/photo.png', foreign = 'event-images/' + events[1] + '/photo.png';
    assert.equal(await object(own, user, 'POST', 'image/png', png), 403);
    assert.equal(await object(own, ministry, 'POST', 'image/png', png), 200);
    assert.equal(await object(foreign, ministry, 'POST', 'image/png', png), 403);
    assert.equal(await object(own, identities.scopedContradiction, 'POST', 'image/png', png), 200);
    assert.equal(await object(foreign, identities.scopedContradiction, 'POST', 'image/png', png), 403);
    for (const path of ['event-template-images/' + prefix + '/photo.png', 'ministry-images/' + prefix + '.png', 'events/' + prefix + '.png']) {
      assert.equal(await object(path, user, 'POST', 'image/png', png), 403);
      assert.equal(await object(path, master, 'POST', 'image/png', png), 200);
      assert.equal(await object(path, user, 'DELETE'), 403);
    }
  });
  await check('Storage default grants cannot bypass private attendance or unknown-path restrictions', async () => {
    const path = prefix + '/unknown.txt'; await bucket.file(path).save('synthetic');
    assert.equal(await object(path, user, 'GET'), 403);
    assert.equal(await object(path, undefined, 'GET'), 403);
    assert.equal(await object('event-images/' + events[0] + '/photo.png', undefined, 'GET'), 200, 'public event images retain the published contract');
  });
  await check('user listing requires a session and prevents browser caching of authenticated profiles', async () => {
    assert.equal((await http('/api/users', undefined, {method: 'GET'})).status, 401);
    const listed = await http('/api/users', user, {method: 'GET', cookie: true});
    assert.equal(listed.status, 200);
    assert.equal(listed.data.ok, true); assert.ok(Array.isArray(listed.data.items));
    assert.match(listed.response.headers.get('cache-control'), /private/);
    assert.match(listed.response.headers.get('cache-control'), /no-store/);
    assert.match(listed.response.headers.get('vary'), /Cookie/);
    assert.match(listed.response.headers.get('vary'), /Authorization/);
  });
  await check('notification HTTP entry points require an actor and reject cross-user sends and CSRF', async () => {
    const before = (await db.collection('_local_integration_outbox').get()).size;
    for (const suffix of ['user', 'users', 'repertoire', 'materials', 'all', 'week']) {
      const path = '/api/notify/' + suffix;
      assert.equal((await http(path)).status, 401, suffix + ' anonymous');
      assert.equal((await http(path, user, {body: {userId: other.uid, title: 'Synthetic authorization check'}})).status, 403, suffix + ' ordinary');
    }
    assert.equal((await http('/api/notify/user', user, {body: {userId: user.uid, title: 'Self check without registered token'}})).status, 404, 'self test reaches handler but has no token');
    assert.equal((await http('/api/notify/user', master, {cookie: true, csrf: false})).status, 403);
    assert.equal((await http('/api/notify/user', master, {cookie: true})).status, 400, 'valid session+CSRF reaches input validation');
    assert.equal((await http('/api/notify/user', master, {cookie: true, bearer: 'invalid-explicit-token'})).status, 401, 'invalid bearer cannot fall back to a privileged cookie');
    assert.equal((await db.collection('_local_integration_outbox').get()).size, before, 'rejected HTTP requests never send to local outbox');
  });
  await check('maintenance entry points reject anonymous, ordinary and non-master administrators', async () => {
    for (const name of ['fixStorageCors', 'backfillPendingUsers']) {
      assert.equal((await http('/' + name)).status, 401);
      assert.equal((await http('/' + name, user)).status, 403);
      assert.equal((await http('/' + name, identities.admin)).status, 403);
    }
    // Never invoke the authorized maintenance mutation, even in this test.
  });
  await check('command HTTP and trigger guards independently reject malicious queued work', async () => {
    const payload = {type: 'REPLICATE_REPERTOIRE', sourceEventId: events[0], targetEventId: events[1]};
    assert.equal((await http('/api/commands', user, {cookie: true, body: payload})).status, 403);
    assert.equal((await http('/api/commands', master, {cookie: true, csrf: false, body: payload})).status, 403);
    const accepted = await http('/api/commands', master, {cookie: true, body: {...payload, createdBy: user.uid}});
    assert.equal(accepted.status, 200); tracked.add('commands/' + accepted.data.id);
    assert.equal(accepted.data.item.createdBy, master.uid, 'BFF uses verified session identity');
    const sentinel = db.doc('events/' + events[1] + '/repertoire/' + prefix + '-sentinel');
    await sentinel.set({title: 'Must remain'});
    const ref = db.doc('commands/' + prefix + '-admin-sdk-bypass'); tracked.add(ref.path);
    await ref.set({...payload, createdBy: user.uid, createdAt: new Date(), status: 'pending'});
    process.env.GCLOUD_PROJECT = project;
    process.env.FIREBASE_CONFIG = JSON.stringify({projectId: project, storageBucket: project + '.appspot.com'});
    process.env.MCI_LOCAL_TEST_MODE = '1';
    // Execute the actual exported worker with a real emulator snapshot. This
    // verifies its Admin SDK defense without claiming event delivery timing.
    const exported = require('../functions/lib/index.js');
    const queuedSnapshot = await ref.get();
    // The local event dispatcher may have rejected it before the explicit call.
    if (queuedSnapshot.data().status === 'pending') await exported.onCommandWritten.run(queuedSnapshot, {params: {commandId: ref.id}});
    assert.equal((await ref.get()).data().error, 'COMMAND_FORBIDDEN');
    assert.equal((await sentinel.get()).exists, true, 'Admin SDK injected queue record cannot delete target data');
  });
});
