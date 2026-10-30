import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { transformSync } from 'esbuild';
import { protectedImageProxy, createPrivateImageLoader, clearLegacyImageCache } from '../frontend/src/services/private-images.js';
const response = (status = 200, type = 'image/jpeg') => ({ ok: status === 200, status, headers: new Headers({ 'content-type': type }), blob: async () => new Blob(['synthetic-image'], { type }) });
const flush = async () => { for (let index = 0; index < 12; index++) await Promise.resolve(); };
function loaderFixture({ request = async () => response() } = {}) {
  const calls = [], created = [], revoked = [];
  const loader = createPrivateImageLoader({
    auth: { currentUser: { getIdToken: async () => 'signed-private-fixture-token' } },
    request: async (...args) => { calls.push(args); return request(...args); },
    objectURL: { createObjectURL: (blob) => { created.push(blob); return 'blob:synthetic-' + created.length; }, revokeObjectURL: (url) => revoked.push(url) },
  });
  return { loader, calls, created, revoked };
}
test('private image paths discard legacy download tokens and never send Authorization to external hosts', async () => {
  const app = loaderFixture();
  const src = 'https://firebasestorage.googleapis.com/v0/b/fixture/o/attendance%2Fe%2Fa%2Fphoto.jpg?alt=media&token=legacy-private';
  const image = await app.loader.load(src);
  assert.equal(image, 'blob:synthetic-1');
  const [url, options] = app.calls[0];
  assert.equal(url, '/api/download?path=attendance%2Fe%2Fa%2Fphoto.jpg&inline=1');
  assert.equal(options.headers.Authorization, 'Bearer signed-private-fixture-token');
  assert.equal(options.cache, 'no-store'); assert.equal(options.credentials, 'same-origin'); assert.equal(options.redirect, 'error');
  assert.equal(url.includes('token'), false); assert.equal(url.includes('mode=url'), false);
  const external = 'https://googleusercontent.com/public-avatar';
  assert.equal(await app.loader.load(external), external); assert.equal(app.calls.length, 1);
  assert.equal(protectedImageProxy('https://firebasestorage.googleapis.com.evil.invalid/o/attendance%2Fx'), null);
  assert.equal(protectedImageProxy('https://'), null);
});
test('profile image proxy uses the same authenticated blob transport without a reusable URL', async () => {
  const app = loaderFixture();
  const url = await app.loader.load('/api/download?path=profile-photos%2Fperson%2Favatar.jpg&inline=1&mode=url');
  assert.match(url, /^blob:/); assert.equal(app.calls[0][0].includes('mode=url'), false);
});
test('404, redirects and non-image responses do not create a blob or expose a fallback URL', async () => {
  for (const result of [response(404), response(302), response(200, 'application/json')]) {
    const app = loaderFixture({ request: async () => result });
    await assert.rejects(app.loader.load('attendance/e/a/photo.jpg'), /IMAGE_UNAVAILABLE/);
    assert.equal(app.created.length, 0);
  }
});
test('cancellation before or during a request never creates a lingering object URL', async () => {
  const cancelled = new AbortController(); cancelled.abort();
  const early = loaderFixture(); await assert.rejects(early.loader.load('attendance/e/a/photo.jpg', { signal: cancelled.signal }), { name: 'AbortError' }); assert.equal(early.calls.length, 0);
  const controller = new AbortController(); let complete;
  const app = loaderFixture({ request: () => new Promise((resolve) => { complete = resolve; }) });
  const pending = app.loader.load('attendance/e/a/photo.jpg', { signal: controller.signal }); await flush();
  controller.abort(); complete(response());
  await assert.rejects(pending, { name: 'AbortError' }); assert.equal(app.created.length, 0);
});
test('owned object URLs are revoked exactly once and arbitrary external URLs are never revoked', async () => {
  const app = loaderFixture(); const url = await app.loader.load('attendance/e/a/photo.jpg');
  app.loader.release(url); app.loader.release(url); app.loader.release('https://external.invalid/avatar');
  assert.deepEqual(app.revoked, [url]);
});
test('only the known legacy image cache is retired; no photos are placed in persistent caches', async () => {
  const removed = [];
  await clearLegacyImageCache({ delete: async (name) => { removed.push(name); return true; } });
  assert.deepEqual(removed, ['mci-images-cache-v1']);
});

const componentText = (await readFile(new URL('../frontend/src/components/PrivateImage.jsx', import.meta.url), 'utf8')).replace(/^import .*;\r?\n/gm, '').replace('export function PrivateImage', 'function PrivateImage');
const componentCode = transformSync(componentText, { loader: 'jsx', jsx: 'transform', jsxFactory: 'React.createElement' }).code;
function mountedImage(app) {
  let state, initialized = false, cleanup, effect;
  const React = {
    useState(initial) { if (!initialized) { state = typeof initial === 'function' ? initial() : initial; initialized = true; } return [state, (value) => { state = value; }]; },
    useEffect(callback) { if (!cleanup && !effect) effect = callback; },
    createElement: (type, props) => ({ type, props }),
  };
  const component = vm.runInNewContext(`(function(){${componentCode};return PrivateImage;})()`, { React, AbortController, protectedImageProxy, resolveProtectedImage: (source, options) => app.loader.load(source, options), releaseProtectedImage: (source) => app.loader.release(source) });
  return {
    render() { const rendered = component({ src: 'attendance/e/a/photo.jpg', alt: 'Imagen privada' }); if (effect) { cleanup = effect(); effect = null; } return rendered; },
    unmount() { cleanup?.(); },
  };
}
test('PrivateImage keeps native src empty until authenticated success and revokes its blob on unmount', async () => {
  const app = loaderFixture(), mounted = mountedImage(app);
  assert.equal(mounted.render().props.src, undefined);
  await flush(); assert.equal(mounted.render().props.src, 'blob:synthetic-1');
  mounted.unmount(); assert.deepEqual(app.revoked, ['blob:synthetic-1']);
});
test('PrivateImage unmount aborts a pending fetch and ignores its late successful result', async () => {
  let complete;
  const app = loaderFixture({ request: () => new Promise((resolve) => { complete = resolve; }) });
  const mounted = mountedImage(app); mounted.render(); await flush();
  mounted.unmount(); assert.equal(app.calls[0][1].signal.aborted, true);
  complete(response()); await flush(); assert.equal(app.created.length, 0);
});
