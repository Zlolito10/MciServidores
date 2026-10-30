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
const publicResponse = (response, asset, anonymousShell = false) => {
  const type=response.headers.get('Content-Type')||'';
  const mime=asset.endsWith('.js')?/^(?:text|application)\/(?:javascript|ecmascript)\b/i:
    asset.endsWith('.css')?/^text\/css\b/i:asset.endsWith('.png')?/^image\/png\b/i:
    asset.endsWith('.svg')?/^image\/svg\+xml\b/i:asset.endsWith('.webmanifest')?/^application\/(?:manifest\+json|json)\b/i:/^text\/html\b/i;
  const control=response.headers.get('Cache-Control')||'';
  // Hosting intentionally sends no-store on HTML. Only the known build shell,
  // fetched anonymously at install time, may be stored for offline navigation.
  return response.ok&&response.status===200&&!response.redirected&&mime.test(type)&&
    !/\bprivate\b/i.test(control)&&(!/\bno-store\b/i.test(control)||(anonymousShell&&asset==='/index.html'))&&!response.headers.has('Set-Cookie');
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    // Cache an anonymous build shell, never a response obtained with user cookies.
    for (const asset of settings.precache || settings.assets) {
      if (!publicAsset(asset) || !settings.assets.includes(asset)) throw new Error('Invalid public cache asset');
      const url = new URL(asset, ownOrigin).href;
      const response = await fetch(new Request(url, { credentials: 'omit', cache: 'reload', redirect: 'error' }));
      if (!publicResponse(response,asset,true)) throw new Error('Uncacheable public asset response');
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
  if (url.search || !publicAsset(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(url.pathname);
    if(cached)return cached;
    // Never store a response fetched with session cookies. Private images and
    // all API requests bypass this path entirely.
    const response=await fetch(new Request(url.href,{credentials:'omit',redirect:'error'}));
    if(publicResponse(response,url.pathname))await cache.put(url.pathname,response.clone());
    return response;
  })());
});
