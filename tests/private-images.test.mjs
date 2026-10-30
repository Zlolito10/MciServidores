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
function mountedImage(app, initialProps = { loading: 'eager' }, { observerAvailable = true } = {}) {
  let cursor, pending, dirty, tree;
  let props = { src: 'attendance/e/a/photo.jpg', alt: 'Imagen privada', ...initialProps };
  const hooks = [], observers = [];
  const React = {
    useRef(initial) { const index = cursor++; if (!hooks[index]) hooks[index] = { current: initial }; return hooks[index]; },
    useState(initial) {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { value: typeof initial === 'function' ? initial() : initial };
      return [hooks[index].value, (value) => {
        const next = typeof value === 'function' ? value(hooks[index].value) : value;
        if (!Object.is(next, hooks[index].value)) { hooks[index].value = next; dirty = true; }
      }];
    },
    useEffect(callback, dependencies) {
      const index = cursor++, previous = hooks[index];
      if (!previous || dependencies.some((value, item) => !Object.is(value, previous.dependencies[item]))) {
        pending.push(() => { previous?.cleanup?.(); hooks[index] = { dependencies, cleanup: callback() }; });
      }
    },
    createElement(type, attributes) { attributes?.ref?.({ element: type }); return { type, props: attributes }; },
  };
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(element) { this.element = element; }
    disconnect() { this.disconnected = true; }
  }
  const context = { React, AbortController, resolveProtectedImage: (source, options) => app.loader.load(source, options), releaseProtectedImage: (source) => app.loader.release(source) };
  if (observerAvailable) context.IntersectionObserver = Observer;
  const component = vm.runInNewContext(`(function(){${componentCode};return PrivateImage;})()`, context);
  const render = (next = props) => {
    props = next;
    let renders = 0;
    do {
      dirty = false; cursor = 0; pending = [];
      tree = component(props);
      pending.forEach((effect) => effect());
      assert.ok(renders++ < 15, 'native image settles');
    } while (dirty);
    return tree;
  };
  return {
    render, observers,
    visible() { observers.at(-1).callback([{ isIntersecting: true }]); return render(); },
    unmount() { hooks.forEach((hook) => hook?.cleanup?.()); },
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

test('PrivateImage defaults to lazy transport and reserves a minimal observation target without replacing caller sizes', async () => {
  const app = loaderFixture(), mounted = mountedImage(app, { className: 'w-full h-auto', width: 320, height: 240, style: { maxHeight: '60vh' }, decoding: 'async' });
  const initial = mounted.render(); await flush();
  assert.equal(initial.props.loading, 'lazy'); assert.equal(initial.props.src, undefined); assert.equal(app.calls.length, 0);
  assert.equal(initial.props.width, 320); assert.equal(initial.props.height, 240); assert.equal(initial.props.alt, 'Imagen privada');
  assert.equal(initial.props.style.maxHeight, '60vh'); assert.equal(initial.props.style.minHeight, 1); assert.equal(initial.props.style.minWidth, 1);
  assert.equal(mounted.observers.length, 1);
  mounted.visible(); await flush();
  const loaded = mounted.render();
  assert.equal(app.calls.length, 1); assert.equal(loaded.props.src, 'blob:synthetic-1');
  assert.equal(loaded.props.style.minHeight, undefined); assert.equal(loaded.props.style.maxHeight, '60vh');
  mounted.unmount(); assert.deepEqual(app.revoked, ['blob:synthetic-1']);
});

test('PrivateImage source replacement revokes the previous blob and waits for the new image visibility', async () => {
  const app = loaderFixture(), mounted = mountedImage(app, {});
  mounted.render(); mounted.visible(); await flush(); mounted.render();
  const next = mounted.render({ src: 'attendance/other/a/photo.jpg', alt: 'Otra evidencia' }); await flush();
  assert.equal(next.props.src, undefined); assert.equal(app.calls.length, 1); assert.deepEqual(app.revoked, ['blob:synthetic-1']);
  mounted.visible(); await flush();
  assert.equal(mounted.render().props.src, 'blob:synthetic-2'); assert.equal(app.calls.length, 2);
  mounted.unmount(); assert.deepEqual(app.revoked, ['blob:synthetic-1', 'blob:synthetic-2']);
});

test('PrivateImage works without IntersectionObserver and supports explicit priority with forwarded refs', async () => {
  const fallback = loaderFixture(), unavailable = mountedImage(fallback, {}, { observerAvailable: false });
  unavailable.render(); await flush(); assert.equal(unavailable.render().props.src, 'blob:synthetic-1'); unavailable.unmount();
  const app = loaderFixture(), ref = { current: null }, priority = mountedImage(app, { fetchPriority: 'high', ref });
  priority.render(); await flush();
  assert.equal(priority.observers.length, 0); assert.equal(app.calls.length, 1); assert.equal(ref.current.element, 'img');
  priority.unmount(); assert.deepEqual(app.revoked, ['blob:synthetic-1']);
});

test('PrivateImage cancels a visible lazy request and creates no URL from its late response', async () => {
  let complete;
  const app = loaderFixture({ request: () => new Promise((resolve) => { complete = resolve; }) });
  const mounted = mountedImage(app, {}); mounted.render(); mounted.visible(); await flush();
  mounted.unmount(); assert.equal(app.calls[0][1].signal.aborted, true);
  complete(response()); await flush(); assert.equal(app.created.length, 0);
});
