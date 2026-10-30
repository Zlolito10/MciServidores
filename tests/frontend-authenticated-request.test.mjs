import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { createNotificationRequest, requireFirebaseUid } from '../frontend/src/services/authenticated-request.js';

test('notifications obtain the current Firebase token and send authenticated same-origin JSON', async () => {
  const calls = [], payload = { eventId: 'event-fixture' };
  let reads = 0;
  const send = createNotificationRequest({ auth: { currentUser: { uid: 'actor', getIdToken: async () => { reads++; return 'signed-fixture-id-token'; } } }, requestJson: async (...args) => { calls.push(args); return { success: true, sent: 1 }; } });
  await send('/api/notify/repertoire', payload); await send('/api/notify/materials', payload);
  assert.equal(reads, 2);
  for (const [endpoint, options] of calls) {
    assert.match(endpoint, /^\/api\/notify\//); assert.equal(options.method, 'POST'); assert.equal(options.cache, 'no-store');
    assert.equal(options.headers.Authorization, 'Bearer signed-fixture-id-token'); assert.equal(options.json, payload);
  }
});

test('anonymous users and failed token refresh cannot fall back to an unprotected request', async () => {
  let calls = 0;
  for (const auth of [{ currentUser: null }, { currentUser: { getIdToken: async () => { throw Error('sensitive SDK details'); } } }, { currentUser: { getIdToken: async () => '' } }]) {
    const send = createNotificationRequest({ auth, requestJson: async () => { calls++; } });
    await assert.rejects(send('/api/notify/user', { userId: 'actor' }), (error) => error.code === 'AUTH_REQUIRED' && !error.message.includes('sensitive'));
  }
  assert.equal(calls, 0);
});

test('explicit BFF session mode retains the existing cookie and CSRF transport', async () => {
  const calls = [];
  const send = createNotificationRequest({ auth: { currentUser: null }, allowSession: () => true, requestJson: async (...args) => { calls.push(args); return { success: true }; } });
  await send('/api/notify/user', { userId: 'actor' });
  assert.equal(calls.length, 1); assert.deepEqual(calls[0][1].headers, {});
  const module = await readFile(new URL('../frontend/src/services/notification-client.js', import.meta.url), 'utf8');
  assert.match(module, /requestJson: bffFetch/); assert.match(module, /allowSession: isBffEnabled/);
});

test('notification adapter rejects foreign URLs and reports backend failures as failures', async () => {
  let calls = 0;
  const send = createNotificationRequest({ auth: { currentUser: { getIdToken: async () => 'fixture' } }, requestJson: async () => { calls++; return { success: false }; } });
  for (const endpoint of ['https://example.invalid/api/notify/all', '//example.invalid/api/notify/all', '/api/sessionLogin', '/api/notify/all?target=other']) await assert.rejects(send(endpoint, {}), /INVALID_NOTIFICATION_ENDPOINT/);
  assert.equal(calls, 0);
  await assert.rejects(send('/api/notify/all', {}), /No se pudo enviar/);
});

test('direct Firestore command authors always come from the current Auth user', () => {
  assert.equal(requireFirebaseUid({ currentUser: { uid: 'actual-auth-user' } }), 'actual-auth-user');
  assert.throws(() => requireFirebaseUid({ currentUser: null }), (error) => error.code === 'AUTH_REQUIRED');
  assert.throws(() => requireFirebaseUid({ currentUser: { uid: '' } }), (error) => error.code === 'AUTH_REQUIRED');
});

test('all recovered notification buttons use the authenticated adapter, including non-BFF screens', async () => {
  const expected = { EventDetails: ['repertoire', 'materials'], Settings: ['user'], Events: ['users', 'all'] };
  for (const [page, endpoints] of Object.entries(expected)) {
    const source = await readFile(new URL('../frontend/src/pages/' + page + '.jsx', import.meta.url), 'utf8');
    const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] }), found = [];
    traverse(ast, { CallExpression(path) { if (path.node.callee.name === 'sendNotification') found.push(path.node.arguments[0].value); } });
    assert.deepEqual(found.sort(), endpoints.map((endpoint) => '/api/notify/' + endpoint).sort());
    assert.equal(source.includes('cloudfunctions.net/api/notify/'), false);
    assert.equal(source.includes('Simulating notification'), false); assert.equal(source.includes('Simulating broadcast'), false);
  }
});

test('all four direct command payloads include an authenticated author with no unknown fallback', async () => {
  const source = await readFile(new URL('../frontend/src/pages/EventDetails.jsx', import.meta.url), 'utf8');
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const commands = [];
  traverse(ast, { ObjectExpression(path) {
    const fields = Object.fromEntries(path.node.properties.filter((property) => property.type === 'ObjectProperty').map((property) => [property.key.name, property.value]));
    if (!fields.createdAt || !['REPLICATE_ASSIGNMENTS', 'REPLICATE_REPERTOIRE', 'RESTORE_REPERTOIRE', 'REPLICATE_MATERIALS'].includes(fields.type?.value)) return;
    assert.equal(fields.createdBy?.type, 'CallExpression'); assert.equal(fields.createdBy.callee.name, 'getCommandAuthor'); commands.push(fields.type.value);
  } });
  assert.deepEqual(commands.sort(), ['REPLICATE_ASSIGNMENTS', 'REPLICATE_REPERTOIRE', 'REPLICATE_MATERIALS', 'RESTORE_REPERTOIRE'].sort());
});
