import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { projectRoot, requireSupportedNode } from './verify.mjs';

const contentTypes = new Map(Object.entries({
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.wasm': 'application/wasm', '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf', '.avif': 'image/avif', '.mp4': 'video/mp4',
}));

function send(request, response, status, body, type = 'text/plain; charset=utf-8', extra = {}) {
  const bytes = Buffer.from(body);
  response.writeHead(status, {
    'Content-Type': type, 'Content-Length': bytes.length,
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra,
  });
  response.end(request.method === 'HEAD' ? undefined : bytes);
}

function sendJson(request, response, status, value) {
  send(request, response, status, JSON.stringify(value), 'application/json; charset=utf-8');
}

function safePath(rawTarget) {
  const rawPath = rawTarget.split('?', 1)[0];
  let decoded;
  try { decoded = decodeURIComponent(rawPath); } catch { return { status: 400 }; }
  if (!decoded.startsWith('/') || decoded.startsWith('//') || /[\\\0\r\n]/.test(decoded)) return { status: 400 };
  if (decoded.split('/').some(segment => segment.startsWith('.'))) return { status: 404 };
  return { pathname: decoded };
}

function isNavigation(request, pathname) {
  if (pathname === '/assets' || pathname.startsWith('/assets/') || path.posix.extname(pathname)) return false;
  if (request.headers['sec-fetch-mode'] === 'navigate') return true;
  return (request.headers.accept ?? '').split(',').some(value => {
    const [type, ...parameters] = value.trim().split(';');
    return type.toLowerCase() === 'text/html' &&
      !parameters.some(parameter => /^\s*q\s*=\s*0(?:\.0*)?\s*$/i.test(parameter));
  });
}

function normalizeApiOrigin(value) {
  if (!value) return undefined;
  const url = new URL(value);
  const localHttp = url.protocol === 'http:' && ['127.0.0.1', '[::1]', 'localhost'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password ||
      (!localHttp && url.pathname !== '/') || url.search || url.hash) {
    throw new Error('--api-origin must be an HTTPS origin (or loopback HTTP for local testing).');
  }
  return localHttp ? url.href.replace(/\/$/, '') : url.origin;
}

const hopByHop = ['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade'];
function forwardedHeaders(headers) {
  const result = { ...headers };
  const connectionHeaders = String(headers.connection ?? '').split(',').map(value => value.trim().toLowerCase());
  for (const name of [...hopByHop, ...connectionHeaders]) delete result[name];
  return result;
}

function proxyApi(request, response, origin) {
  // Origin is fixed by an explicit CLI option. Only /api requests reach this function.
  const target = new URL(`${origin}${request.url}`);
  const headers = forwardedHeaders(request.headers);
  headers.host = target.host;
  const upstream = (target.protocol === 'https:' ? https : http).request(target, {
    method: request.method, headers,
  }, remote => {
    response.writeHead(remote.statusCode ?? 502, forwardedHeaders(remote.headers));
    remote.pipe(response);
    remote.on('error', () => response.destroy());
  });
  upstream.setTimeout(30_000, () => upstream.destroy(new Error('Upstream timeout')));
  upstream.on('error', () => {
    if (!response.headersSent) sendJson(request, response, 502, { error: 'upstream_unavailable' });
    else response.destroy();
  });
  request.on('aborted', () => upstream.destroy());
  request.pipe(upstream);
}

async function resolveFile(root, pathname) {
  const candidate = path.join(root, pathname === '/' ? 'index.html' : pathname.slice(1));
  try {
    const resolved = await realpath(candidate);
    if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) return undefined;
    const info = await stat(resolved);
    if (!info.isFile()) return undefined;
    return { resolved, size: info.size };
  } catch (error) {
    if (['ENOENT', 'ENOTDIR', 'EACCES', 'ELOOP'].includes(error.code)) return undefined;
    throw error;
  }
}

/** Local static server. API forwarding is disabled unless explicitly configured. */
export async function createSiteServer({ root, apiOrigin } = {}) {
  requireSupportedNode();
  const directory = await realpath(root ?? path.join(projectRoot, 'recovered', 'hosting'));
  if (!(await stat(directory)).isDirectory()) throw new Error('The Hosting root must be a directory.');
  const origin = normalizeApiOrigin(apiOrigin);
  return http.createServer(async (request, response) => {
    try {
      const { pathname, status } = safePath(request.url ?? '/');
      if (status) return send(request, response, status, status === 400 ? 'Bad request\n' : 'Not found\n');
      if (pathname === '/api' || pathname.startsWith('/api/') || pathname.startsWith('/comments/')) {
        if (origin) return proxyApi(request, response, origin);
        request.resume();
        return sendJson(request, response, 503, {
          error: 'backend_not_configured',
          message: 'Start the local emulators and configure --api-origin to use the recovered backend.',
        });
      }
      if (!['GET', 'HEAD'].includes(request.method)) {
        request.resume();
        return send(request, response, 405, 'Method not allowed\n', undefined, { Allow: 'GET, HEAD' });
      }
      let file = await resolveFile(directory, pathname);
      if (!file && isNavigation(request, pathname)) file = await resolveFile(directory, '/index.html');
      if (!file) return send(request, response, 404, 'Not found\n');
      const stream = createReadStream(file.resolved);
      stream.on('error', () => {
        if (!response.headersSent) send(request, response, 500, 'File unavailable\n');
        else response.destroy();
      });
      stream.once('open', () => {
        response.writeHead(200, {
          'Content-Type': contentTypes.get(path.extname(file.resolved).toLowerCase()) ?? 'application/octet-stream',
          'Content-Length': file.size, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
        });
        if (request.method === 'HEAD') { stream.destroy(); response.end(); }
        else stream.pipe(response);
      });
    } catch {
      if (!response.headersSent) send(request, response, 500, 'Internal server error\n');
      else response.destroy();
    }
  });
}

async function main() {
  const { values } = parseArgs({ options: {
    source: { type: 'boolean' }, dist: { type: 'boolean' },
    host: { type: 'string', default: '127.0.0.1' }, port: { type: 'string', default: '5173' },
    'api-origin': { type: 'string' }, help: { type: 'boolean' },
  } });
  if (values.help) {
    console.log('Usage: node scripts/serve.mjs [--source | --dist] [--host 127.0.0.1] [--port 5173] [--api-origin https://mcimachala-servidor.web.app]');
    return;
  }
  if (values.source && values.dist) throw new Error('Choose either --source or --dist.');
  const port = Number(values.port);
  if (!/^\d+$/.test(values.port) || !Number.isSafeInteger(port) || port < 0 || port > 65535) throw new Error('Invalid port.');
  const server = await createSiteServer({
    root: path.join(projectRoot, values.dist ? 'dist' : 'recovered/hosting'),
    apiOrigin: values['api-origin'],
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, values.host, resolve);
  });
  console.log(`Serving ${values.dist ? 'dist/' : 'recovered/hosting/'} at http://${values.host}:${server.address().port}`);
  console.log(values['api-origin'] ? 'API proxy explicitly enabled; requests can affect the configured backend.' : 'API proxy disabled. Local /api requests return 503.');
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => { server.close(); server.closeAllConnections(); });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`Server failed: ${error.message}`); process.exitCode = 1; });
}
