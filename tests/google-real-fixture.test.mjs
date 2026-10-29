import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = (await readFile(new URL('./browser-fixtures/google-real.jsx', import.meta.url), 'utf8')).replace(/^import .*;\r?\n/gm, '');
function fixture({ failure, hostname = 'localhost', tokenResponse = { isNewUser: false, idToken: 'fake-sensitive-token' } } = {}) {
  const elements = new Map(), calls = [];
  const auth = { currentUser: null }, memory = {}, resolver = {};
  const user = { email: 'fake-person@example.invalid', uid: 'fake-sensitive-id' };
  const element = (id) => {
    if (!elements.has(id)) elements.set(id, { value: '', textContent: '', disabled: false, handlers: {}, addEventListener(event, handler) { this.handlers[event] = handler; } });
    return elements.get(id);
  };
  const context = {
    location: { hostname },
    document: { getElementById: () => ({ innerHTML: '', querySelector: element }) },
    window: { addEventListener() {} },
    initializeApp(config, name) { calls.push(['initializeApp', name]); return { name }; },
    authSdk: {
      inMemoryPersistence: memory, browserPopupRedirectResolver: resolver,
      initializeAuth(app, options) { assert.equal(options.persistence, memory); assert.equal(options.popupRedirectResolver, resolver); calls.push(['initializeAuth', app.name]); return auth; },
      GoogleAuthProvider: class { setCustomParameters(parameters) { calls.push(['parameters', parameters]); } },
      async signInWithPopup(actualAuth) {
        assert.equal(actualAuth, auth); calls.push(['popup']);
        if (failure) throw failure;
        auth.currentUser = user;
        return { user, providerId: 'google.com', _tokenResponse: tokenResponse };
      },
      async signOut(actualAuth) { assert.equal(actualAuth, auth); calls.push(['signOut']); auth.currentUser = null; },
    },
  };
  vm.runInNewContext(source, context);
  return { calls, element, result: () => JSON.parse(element('#google-proof-result').textContent) };
}

test('isolated Google proof initializes named in-memory Auth without opening a popup', () => {
  const app = fixture();
  assert.deepEqual(app.calls, [['initializeApp', 'mci-isolated-google-auth-proof'], ['initializeAuth', 'mci-isolated-google-auth-proof']]);
  assert.equal(app.element('#account-hint').value, '');
  assert.equal(app.result().signedIn, false);
});

test('isolated Google proof displays only identity-free results and explicitly signs out', async () => {
  const app = fixture();
  app.element('#account-hint').value = 'fake-person@example.invalid';
  await app.element('#google-login').handlers.click();
  const result = app.result();
  assert.equal(result.phase, 'verified'); assert.equal(result.provider, 'google.com'); assert.equal(result.existingUser, true);
  assert.equal(result.signedIn, true); assert.equal(app.element('#account-hint').value, '');
  assert.equal(app.calls.find(([name]) => name === 'parameters')[1].prompt, 'select_account');
  assert.doesNotMatch(app.element('#google-proof-result').textContent, /fake-person|fake-sensitive|@/);
  await app.element('#google-signout').handlers.click();
  assert.equal(app.result().signedIn, false); assert.equal(app.result().signOutCompleted, true);
  assert.equal(app.calls.at(-1)[0], 'signOut');
});

test('isolated Google proof sanitizes auth errors without exposing provider messages', async () => {
  const app = fixture({ failure: { code: 'auth/popup-closed-by-user', message: 'fake-person@example.invalid' } });
  await app.element('#google-login').handlers.click();
  assert.equal(app.result().errorCode, 'auth/popup-closed-by-user');
  assert.equal(app.result().signedIn, false);
  assert.doesNotMatch(app.element('#google-proof-result').textContent, /fake-person|@/);
});

test('isolated Google proof accepts an omitted optional false isNewUser field', async () => {
  const app = fixture({ tokenResponse: { idToken: 'fake-sensitive-token' } });
  await app.element('#google-login').handlers.click();
  assert.equal(app.result().existingUser, true);
  assert.equal(app.result().phase, 'verified');
  assert.doesNotMatch(app.element('#google-proof-result').textContent, /fake-sensitive/);
});

test('isolated Google proof keeps successful Auth distinct from missing or malformed optional metadata', async () => {
  for (const tokenResponse of [null, [], { isNewUser: 'false' }]) {
    const app = fixture({ tokenResponse });
    await app.element('#google-login').handlers.click();
    assert.equal(app.result().signedIn, true);
    assert.equal(app.result().existingUser, null);
    assert.equal(app.result().phase, 'signed-in');
  }
  const app = fixture({ tokenResponse: { isNewUser: true } });
  await app.element('#google-login').handlers.click();
  assert.equal(app.result().existingUser, false);
  assert.equal(app.result().phase, 'new-user-unexpected');
});

test('isolated real Google proof refuses an origin other than authorized localhost', () => {
  assert.throws(() => fixture({ hostname: '127.0.0.1' }), /authorized localhost/);
});
