import test from 'node:test';
import assert from 'node:assert/strict';
import { bootDriveOAuthPage, renderDriveOAuthPage } from '../scripts/lib/drive-oauth-page.mjs';

async function fixture({ phase = 'awaiting-consent', origin = 'http://localhost:5000', failRoute } = {}) {
  const elements = new Map(), calls = [], codeClients = [], pickers = [], views = [];
  let currentPhase = phase, starts = 0;
  const element = (id) => {
    if (!elements.has(id)) elements.set(id, { disabled: true, textContent: '', listeners: {}, addEventListener(type, callback) { this.listeners[type] = callback; } });
    return elements.get(id);
  };
  const config = { clientId: 'public-client', projectNumber: '584384917166', publicApiKey: 'public-key', expectedOwnerEmail: 'fake-private-owner@example.invalid', folderId: 'expected-folder', csrfToken: 'private-csrf', mode: 'gis-code-popup', origin: 'http://localhost:5000' };
  class DocsView {
    constructor(kind) { this.options = { kind }; views.push(this); }
    setIncludeFolders(value) { this.options.includeFolders = value; return this; }
    setSelectFolderEnabled(value) { this.options.folderSelection = value; return this; }
    setMode(value) { this.options.mode = value; return this; }
  }
  class PickerBuilder {
    constructor() { this.options = {}; }
    addView(value) { this.options.view = value; return this; }
    setOAuthToken(value) { this.options.token = value; return this; }
    setDeveloperKey(value) { this.options.key = value; return this; }
    setAppId(value) { this.options.appId = value; return this; }
    setOrigin(value) { this.options.origin = value; return this; }
    setTitle(value) { this.options.title = value; return this; }
    setCallback(value) { this.options.callback = value; return this; }
    build() {
      const picker = { options: this.options, visible: false, disposed: false, setVisible(value) { this.visible = value; }, dispose() { this.disposed = true; } };
      pickers.push(picker); return picker;
    }
  }
  const browser = {
    location: { origin }, addEventListener() {},
    google: {
      accounts: { oauth2: { initCodeClient(options) { const client = { options, requests: 0, requestCode() { this.requests++; } }; codeClients.push(client); return client; } } },
      picker: { DocsView, PickerBuilder, ViewId: { FOLDERS: 'folders' }, DocsViewMode: { LIST: 'list' }, Response: { ACTION: 'action', DOCUMENTS: 'docs' }, Action: { PICKED: 'picked', CANCEL: 'cancel' }, Document: { ID: 'id' } },
    },
  };
  const request = async (route, options) => {
    calls.push({ route, options, body: options.body ? JSON.parse(options.body) : null });
    if (route === failRoute) return { ok: false, json: async () => ({ error: 'fake-secret-owner@example.invalid' }) };
    let body;
    if (route === '/api/status') body = { ...config, phase: currentPhase };
    else if (route === '/api/oauth/start') body = { state: 'private-state-' + ++starts, expiresAt: Date.now() + 600000 };
    else if (route === '/api/oauth/code') { currentPhase = 'awaiting-folder'; body = { authorized: true }; }
    else if (route === '/api/picker-token') body = { accessToken: 'fake-private-access-token' };
    else if (route === '/api/folder') { currentPhase = 'ready'; body = { ready: true }; }
    else if (route === '/api/save') { currentPhase = 'saved'; body = { saved: true }; }
    else throw Error('Unexpected route');
    return { ok: true, json: async () => body };
  };
  await bootDriveOAuthPage({ window: browser, document: { getElementById: element }, fetch: request });
  return {
    calls, codeClients, pickers, views, config,
    button: (name) => element('drive-' + name),
    click: (name) => element('drive-' + name).listeners.click(),
    result: () => JSON.parse(element('drive-result').textContent),
    rendered: () => [...elements.values()].map((node) => node.textContent).join('\n'),
  };
}
function assertPrivate(app) {
  for (const value of ['fake-private-owner', 'fake-private-access-token', 'private-csrf', 'private-state-', 'fake-private-code']) assert.equal(app.rendered().includes(value), false);
}
function assertPostProtection(app) {
  for (const call of app.calls.filter((call) => call.options.method === 'POST')) {
    assert.equal(call.options.credentials, 'same-origin');
    assert.equal(call.options.cache, 'no-store');
    assert.equal(call.options.headers['X-Requested-With'], 'XMLHttpRequest');
    assert.equal(call.options.headers['X-MCI-CSRF'], app.config.csrfToken);
  }
}

test('Drive consent page is static and cannot serialize server credentials', () => {
  const html = renderDriveOAuthPage({ clientSecret: 'never-render-this', refreshToken: 'never-render-that' });
  assert.match(html, /Preparar autorización/); assert.match(html, /Guardar autorización local/);
  assert.doesNotMatch(html, /never-render|localStorage|sessionStorage|console\./);
});

test('Drive page loads status without starting OAuth or selecting a folder automatically', async () => {
  const app = await fixture();
  assert.deepEqual(app.calls.map((call) => call.route), ['/api/status']);
  assert.equal(app.codeClients.length, 0); assert.equal(app.pickers.length, 0);
  assert.equal(app.button('prepare').disabled, false); assert.equal(app.button('authorize').disabled, true);
  assertPrivate(app);
});

test('Google popup requires a separate direct gesture and exchanges code with its bound state', async () => {
  const app = await fixture();
  await app.click('prepare');
  const client = app.codeClients[0];
  assert.equal(client.requests, 0);
  assert.equal(client.options.ux_mode, 'popup');
  assert.equal(client.options.include_granted_scopes, false);
  assert.equal(client.options.scope, 'openid email https://www.googleapis.com/auth/drive.file');
  assert.equal('code_challenge' in client.options, false);
  app.click('authorize'); assert.equal(client.requests, 1);
  await client.options.callback({ code: 'fake-private-code', state: 'untrusted-response-state' });
  assert.deepEqual(app.calls.find((call) => call.route === '/api/oauth/code').body, { code: 'fake-private-code', state: 'private-state-1' });
  assert.equal(app.result().authorized, true); assert.equal(app.result().phase, 'awaiting-folder');
  assert.equal(app.calls.some((call) => call.route === '/api/save'), false);
  assertPostProtection(app); assertPrivate(app);
});

test('stale authorization callbacks cannot exchange an old session code', async () => {
  const app = await fixture();
  await app.click('prepare'); const old = app.codeClients[0];
  await app.click('prepare');
  await old.options.callback({ code: 'fake-private-code' });
  assert.equal(app.calls.some((call) => call.route === '/api/oauth/code'), false);
});

test('Google errors stay sanitized and never exchange a failed result', async () => {
  const app = await fixture();
  await app.click('prepare');
  await app.codeClients[0].options.callback({ error: 'fake-private-owner@example.invalid' });
  assert.equal(app.result().error, 'GOOGLE_AUTHORIZATION_NOT_COMPLETED');
  assert.equal(app.calls.some((call) => call.route === '/api/oauth/code'), false);
  assertPrivate(app);
});

test('Picker uses the per-file token only in its SDK and rejects the wrong existing folder', async () => {
  const app = await fixture({ phase: 'awaiting-folder' });
  await app.click('folder');
  const picker = app.pickers[0];
  assert.equal(picker.options.token, 'fake-private-access-token');
  assert.equal(picker.options.appId, '584384917166'); assert.equal(picker.options.origin, 'http://localhost:5000');
  assert.deepEqual(app.views[0].options, { kind: 'folders', includeFolders: true, folderSelection: true, mode: 'list' });
  assert.equal(app.button('folder').disabled, true);
  await picker.options.callback({ action: 'picked', docs: [{ id: 'another-folder' }] });
  assert.equal(picker.disposed, true);
  assert.equal(app.result().error, 'ARCHIVE_FOLDER_MISMATCH');
  assert.equal(app.calls.some((call) => call.route === '/api/folder'), false);
  assertPrivate(app); assertPostProtection(app);
});

test('selecting the configured folder only enables an explicit protected save', async () => {
  const app = await fixture({ phase: 'awaiting-folder' });
  await app.click('folder');
  await app.pickers[0].options.callback({ action: 'picked', docs: [{ id: 'expected-folder' }] });
  assert.deepEqual(app.calls.find((call) => call.route === '/api/folder').body, { folderId: 'expected-folder' });
  assert.equal(app.result().folderSelected, true); assert.equal(app.button('save').disabled, false);
  assert.equal(app.calls.some((call) => call.route === '/api/save'), false);
  await app.click('save');
  assert.equal(app.result().saved, true); assert.equal(app.result().phase, 'saved');
  assert.equal(app.button('save').disabled, true);
  assertPrivate(app); assertPostProtection(app);
});

test('Picker cancellation leaves the destination unchanged and permits retry', async () => {
  const app = await fixture({ phase: 'awaiting-folder' });
  await app.click('folder');
  await app.pickers[0].options.callback({ action: 'cancel' });
  assert.equal(app.result().folderSelected, false); assert.equal(app.button('folder').disabled, false);
  assert.equal(app.calls.some((call) => call.route === '/api/folder'), false);
});

test('invalid local origin stays disabled and server error payloads cannot leak into evidence', async () => {
  const invalid = await fixture({ origin: 'http://127.0.0.1:5000' });
  assert.equal(invalid.result().error, 'INVALID_LOCAL_CONFIGURATION');
  assert.equal(invalid.button('prepare').disabled, true);
  await invalid.click('prepare'); assert.equal(invalid.calls.length, 1);
  const failed = await fixture({ failRoute: '/api/oauth/start' });
  await failed.click('prepare');
  assert.equal(failed.result().error, 'LOCAL_AUTHORIZATION_FAILED');
  assert.doesNotMatch(failed.rendered(), /fake-secret-owner/);
});
