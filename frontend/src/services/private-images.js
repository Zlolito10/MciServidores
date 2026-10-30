/** Normalize supported Storage images to same-origin authenticated streaming only. */
export function protectedImageProxy(source) {
  if (typeof source !== 'string' || !source) return null;
  try {
  let objectPath;
  if (source.startsWith('/api/download')) {
    const url = new URL(source, 'http://local.invalid');
    if (!['/api/download', '/api/download-material'].includes(url.pathname)) return null;
    objectPath = url.searchParams.get('path');
  } else if (source.startsWith('gs://')) {
    objectPath = source.slice(5).split('/').slice(1).join('/');
  } else if (/^https?:\/\//.test(source)) {
    const url = new URL(source);
    if (url.hostname === 'firebasestorage.googleapis.com' || (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && url.port === '9199')) {
      const match = /\/o\/(.+)$/.exec(url.pathname);
      if (match) { try { objectPath = decodeURIComponent(match[1]); } catch { return null; } }
    } else if (url.hostname === 'storage.googleapis.com') {
      try { objectPath = decodeURIComponent(url.pathname.split('/').slice(2).join('/')); } catch { return null; }
    }
  } else if (!/^(?:data:|blob:|\/|\.\.?\/)/.test(source) && source.includes('/')) objectPath = source;
  if (!objectPath || objectPath.split('/').some((part) => !part || part === '.' || part === '..') || /[\\\0\r\n]/.test(objectPath)) return null;
  return '/api/download?path=' + encodeURIComponent(objectPath) + '&inline=1';
  } catch { return null; }
}

export function createPrivateImageLoader({ auth, request = globalThis.fetch, objectURL = globalThis.URL }) {
  const owned = new Set();
  const aborted = () => Object.assign(new Error('IMAGE_REQUEST_CANCELLED'), { name: 'AbortError' });
  return {
    async load(source, { signal } = {}) {
      const proxy = protectedImageProxy(source);
      if (!proxy) return source;
      if (signal?.aborted) throw aborted();
      const headers = {};
      const user = auth?.currentUser;
      if (user?.getIdToken) {
        let token;
        try { token = await user.getIdToken(); } catch { throw new Error('IMAGE_AUTH_REQUIRED'); }
        if (!token) throw new Error('IMAGE_AUTH_REQUIRED');
        headers.Authorization = 'Bearer ' + token;
      }
      if (signal?.aborted) throw aborted();
      const response = await request(proxy, { method: 'GET', headers, credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal });
      if (!response.ok || !(response.headers.get('content-type') || '').startsWith('image/')) throw new Error('IMAGE_UNAVAILABLE');
      const blob = await response.blob();
      if (signal?.aborted) throw aborted();
      const url = objectURL.createObjectURL(blob);
      owned.add(url);
      return url;
    },
    release(url) { if (owned.delete(url)) objectURL.revokeObjectURL(url); },
  };
}

/** Retire the original persistent image cache, which could contain attendance photos. */
export async function clearLegacyImageCache(storage = globalThis.caches) {
  try { await storage?.delete('mci-images-cache-v1'); } catch {}
}
