import { createHash } from 'node:crypto';
import { cp, lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export function parseFrontendBuildArgs(args) {
  const options = { production: false, pwaTest: false, bff: false, outDir: 'dist' };
  const seen = new Set();
  for (let index = 0; index < args.length; index++) {
    const name = args[index];
    if (seen.has(name)) throw new Error('Duplicate frontend build option: ' + name);
    seen.add(name);
    if (name === '--production-services') options.production = true;
    else if (name === '--pwa-test') options.pwaTest = true;
    else if (name === '--bff') options.bff = true;
    else if (name === '--out-dir') options.outDir = args[++index];
    else throw new Error('Unknown frontend build option: ' + name);
  }
  if (!/^dist(?:-[a-z0-9-]+)?$/.test(options.outDir || '')) throw new Error('--out-dir must be dist or dist-NAME inside the project');
  return options;
}

export function frontendEnvironment({ production, pwaTest, bff }) {
  const flags = { ...(production ? {} : { VITE_USE_EMULATORS: '1' }), ...(bff ? { VITE_ENABLE_BFF: '1', VITE_BFF_MODE: '1' } : {}) };
  return {
    emulators: !production,
    enableServiceWorker: Boolean(production || pwaTest),
    flags,
    firebase: production ? {
      apiKey: 'AIzaSyCJFCaTuhu_Tz1kPVIsZBeWcLdxdTlED-Y', authDomain: 'mcimachala-servidor.firebaseapp.com', projectId: 'mcimachala-servidor',
      storageBucket: 'mcimachala-servidor.firebasestorage.app', messagingSenderId: '584384917166', appId: '1:584384917166:web:bae42d13f0da36961dc73f', measurementId: 'G-0TTT6RL85E',
    } : {
      apiKey: 'demo-mci-local-key', authDomain: 'demo-mci-servidores.firebaseapp.com', projectId: 'demo-mci-servidores', storageBucket: 'demo-mci-servidores.appspot.com', messagingSenderId: '584384917166', appId: '1:584384917166:web:bae42d13f0da36961dc73f',
    },
  };
}

export function assertPublicAssetPath(relative) {
  const normalized = relative.replaceAll('\\', '/');
  const segments = normalized.split('/');
  if (!normalized || /[:\0\r\n]/.test(normalized) || path.posix.isAbsolute(normalized) || segments.some((part, index) => !part || (part.startsWith('.') && !(index === 0 && part === '.well-known')) || part.startsWith('__') || ['private', 'node_modules'].includes(part.toLowerCase())) || ['api', 'comments'].includes(segments[0].toLowerCase())) throw new Error('Private or reserved frontend asset path: ' + normalized);
  const basename = segments.at(-1);
  if (/^(?:package(?:-lock)?\.json|credentials?.*\.json|.*service[-_]?account.*\.json|.*firebase-adminsdk.*|source\.zip)$/i.test(basename) || /(?:\.private\.json|\.(?:pem|key|p12|pfx|har|bundle|log)|\.(?:test|spec)\.[cm]?jsx?)$/i.test(basename)) throw new Error('Non-public frontend asset: ' + normalized);
  return normalized;
}

/** Copy only regular public files; never follow source links into private paths. */
export async function copyPublicAssets(source, destination, { omitSourceMaps = false, omitPublishedModules = false } = {}) {
  async function visit(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = assertPublicAssetPath(prefix + entry.name);
      const filename = path.join(directory, entry.name);
      if (entry.isSymbolicLink() || (await lstat(filename)).isSymbolicLink()) throw new Error('Symlink frontend asset: ' + relative);
      if (entry.isDirectory()) await visit(filename, relative + '/');
      else if (entry.isFile()) {
        if (omitSourceMaps && relative.endsWith('.map')) continue;
        if (omitPublishedModules && relative.startsWith('assets/') && /\.(?:js|css)(?:\.map|\.LEGAL\.txt)?$/.test(relative)) continue;
        await cp(filename, path.join(destination, relative), { recursive: false, force: true });
      } else throw new Error('Non-regular frontend asset: ' + relative);
    }
  }
  // cp creates the parent directory for each copied file on supported Node.js.
  await visit(source);
}

export async function frontendReleaseManifest(destination, { environment, bff, entry, sourceMaps }) {
  assertPublicAssetPath(entry);
  const files = [];
  async function walk(directory, prefix = '') {
    for (const asset of await readdir(directory, { withFileTypes: true })) {
      const relative = assertPublicAssetPath(prefix + asset.name);
      if (relative === 'mci-release.json') continue;
      const filename = path.join(directory, asset.name);
      if (asset.isSymbolicLink()) throw new Error('Symlink in frontend release: ' + relative);
      if (asset.isDirectory()) await walk(filename, relative + '/');
      else if (asset.isFile()) {
        if (!sourceMaps && relative.endsWith('.map')) throw new Error('Source map in production release: ' + relative);
        const bytes = await readFile(filename);
        files.push({ path: relative, sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length });
      } else throw new Error('Non-regular frontend release file: ' + relative);
    }
  }
  await walk(destination);
  files.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  if (!files.some((file) => file.path === entry)) throw new Error('Missing release entry');
  return {
    schemaVersion: 1,
    target: environment.emulators ? 'emulators' : 'production',
    projectId: environment.firebase.projectId,
    emulators: environment.emulators,
    bff,
    serviceWorkerEnabled: environment.enableServiceWorker,
    entry,
    originalJsxRecovered: false,
    sourceKind: 'reconstructed-published-javascript',
    sourceMaps,
    files,
  };
}
