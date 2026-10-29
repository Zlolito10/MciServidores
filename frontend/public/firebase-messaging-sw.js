/* Reconstructed worker: version messages, safe static offline cache and Web Push.
 * scripts/build-service-worker.mjs injects a build-specific asset manifest.
 */
importScripts('/service-worker-config.js', '/firebase-messaging-logic.js');
const settings = self.__MCI_SW_CONFIG__;
const cacheName = 'mci-recovery-static-' + settings.version;
const ownOrigin = self.location.origin;
const sensitivePath = path => {
  try { return /^\/(?:api|comments|__)(?:\/|$)/.test(decodeURIComponent(path)); }
  catch { return true; }
};
const publicAsset = value => {
  try {
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return false;
    const url = new URL(value, ownOrigin);
    return url.origin === ownOrigin && !url.search && !url.hash && !sensitivePath(url.pathname) &&
      !url.pathname.split('/').some(part => part.startsWith('.')) &&
      (url.pathname === '/index.html' || /\.(?:js|css|png|svg|webmanifest)$/.test(url.pathname));
  } catch { return false; }
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    // Cache an anonymous build shell, never a response obtained with user cookies.
    for (const asset of settings.assets) {
      if (!publicAsset(asset)) throw new Error('Invalid public cache asset');
      const url = new URL(asset, ownOrigin).href;
      const response = await fetch(new Request(url, { credentials: 'omit', cache: 'reload', redirect: 'error' }));
      if (!response.ok || response.status !== 200 || response.redirected || /\bprivate\b/i.test(response.headers.get('Cache-Control') || '') || response.headers.has('Set-Cookie')) throw new Error('Uncacheable public asset response');
      if (new URL(asset, ownOrigin).pathname === '/index.html' && !/^text\/html\b/i.test(response.headers.get('Content-Type') || '')) throw new Error('Invalid application shell MIME');
      await cache.put(asset, response);
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('mci-recovery-static-') && key !== cacheName).map(key => caches.delete(key)));
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    windows.forEach(client => client.postMessage({ type: 'SW_UPDATED', version: settings.version }));
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') { event.waitUntil(self.skipWaiting()); return; }
  if (event.data?.type === 'GET_VERSION') event.ports?.[0]?.postMessage({ version: settings.version });
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== ownOrigin || sensitivePath(url.pathname) || url.pathname === '/app-version.json') return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try { return await fetch(request); }
      catch { return (await (await caches.open(cacheName)).match('/index.html')) || Response.error(); }
    })());
    return;
  }
  if (!settings.assets.includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(url.pathname);
    return cached || fetch(request);
  })());
});
