import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

const source = await readFile(new URL('../frontend/src/pages/Login.jsx', import.meta.url), 'utf8');
let handler;
traverse(parse(source, { sourceType: 'module', plugins: ['jsx'] }), {
  VariableDeclarator(path) {
    if (path.node.id.name === 'handleGoogleLogin') handler = generate(path.node.init).code;
  },
});
assert.ok(handler, 'Google handler must remain in the rebuilt login page');

function loginFixture({ bff = false, strict = false, failure, cookie = true } = {}) {
  const events = [], auth = {}, provider = { setCustomParameters(value) { events.push(['provider', value.prompt]); } };
  const context = {
    setGoogleSubmitting: (value) => events.push(['loading', value]),
    setError: (value) => events.push(['error', value]),
    setInfoMessage() {},
    isBffEnabled: () => bff,
    isStrictBffAuth: () => strict,
    authReady: Promise.resolve(),
    googleProvider: provider,
    firebaseAuth: auth,
    S: async () => ({ signInWithPopup: async (actualAuth, actualProvider) => {
      assert.equal(actualAuth, auth); assert.equal(actualProvider, provider);
      events.push(['popup']);
      if (failure) throw Object.assign(new Error('fixture failure'), { code: failure });
      return { user: { getIdToken: async () => 'local-test-id-token' } };
    } }),
    bffFetch: async (route, options) => {
      events.push(['request', route, options?.json]);
      return route === '/api/me' ? { ok: cookie } : { csrfToken: 'test-csrf' };
    },
    Y: (value) => events.push(['csrf', value]),
    refreshUserProfile: async () => events.push(['profile']),
    navigate: (path) => events.push(['navigate', path]),
    console: { error() {} },
  };
  return { events, login: vm.runInNewContext(`(${handler})`, context) };
}

test('Google login keeps account selection and passes the configured Auth instance to the exact popup flow', async () => {
  const { login, events } = loginFixture();
  await login();
  assert.deepEqual(events.filter(([name]) => ['provider', 'popup', 'navigate'].includes(name)), [['provider', 'select_account'], ['popup'], ['navigate', '/dashboard']]);
  assert.deepEqual(events.at(-1), ['loading', false]);
});

test('BFF Google success verifies the cookie and refreshes the profile before navigation', async () => {
  const { login, events } = loginFixture({ bff: true });
  await login();
  const request = events.find(([name, route]) => name === 'request' && route === '/api/sessionLogin');
  assert.equal(request[2].idToken, 'local-test-id-token');
  const names = events.map(([name, route]) => name === 'request' ? route : name);
  assert.ok(names.indexOf('/api/sessionLogin') < names.indexOf('/api/me'));
  assert.ok(names.indexOf('/api/me') < names.indexOf('profile'));
  assert.ok(names.indexOf('profile') < names.indexOf('navigate'));
});

test('Google login refuses to enter dashboard when the BFF cookie was not created', async () => {
  const { login, events } = loginFixture({ bff: true, cookie: false });
  await login();
  assert.equal(events.some(([name]) => name === 'navigate'), false);
  assert.match(events.find(([name, value]) => name === 'error' && value)?.[1], /sesión \(cookie\)/);
  assert.deepEqual(events.at(-1), ['loading', false]);
});

test('strict BFF blocks Google without opening an external popup', async () => {
  const { login, events } = loginFixture({ bff: true, strict: true });
  await login();
  assert.equal(events.some(([name]) => name === 'popup' || name === 'navigate'), false);
  assert.deepEqual(events.at(-1), ['loading', false]);
});

for (const [code, message] of [
  ['auth/popup-closed-by-user', /cancelado/],
  ['auth/cancelled-popup-request', /cancelado/],
  ['auth/popup-blocked', /bloqueó/],
  ['auth/operation-not-supported-in-this-environment', /no soporta popups/],
]) test(`Google ${code} restores the login screen with the published error message`, async () => {
  const { login, events } = loginFixture({ failure: code });
  await login();
  assert.match(events.find(([name, value]) => name === 'error' && value)?.[1], message);
  assert.equal(events.some(([name]) => name === 'navigate'), false);
  assert.deepEqual(events.at(-1), ['loading', false]);
});
