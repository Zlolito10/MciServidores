import {createHash} from 'node:crypto';
import {readFile, readdir, writeFile, copyFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workerFiles = ['firebase-messaging-logic.js', 'firebase-messaging-sw.js'];

export async function buildServiceWorker({destination = path.join(root, 'dist'),criticalAssets = []} = {}) {
  await mkdir(destination, {recursive: true});
  const assets = [];
  async function walk(directory, prefix = '') {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      // Only public regular files belong in this manifest. Never follow a symlink
      // or include private/test/backend paths left alongside the built app.
      if (entry.name.startsWith('.') || entry.isSymbolicLink()) continue;
      if (!prefix && (['api', 'comments'].includes(entry.name) || entry.name.startsWith('__'))) continue;
      const relative = prefix + '/' + entry.name;
      if (entry.isDirectory()) await walk(path.join(directory, entry.name), relative);
      else if (entry.isFile() && /\.(?:js|css|png|svg|webmanifest)$/.test(relative) &&
        !relative.includes('service-worker') && !relative.includes('firebase-messaging')) assets.push(relative);
    }
  }
  await walk(destination);
  assets.push('/index.html');
  assets.sort();
  // Install only the anonymous shell and its static dependency graph. Route,
  // PDF and camera chunks enter the cache when requested, not on every update.
  const shell = ['/index.html','/registerSW.js','/assets/index-B05fqWAG.css','/mci-logo.png','/mci-logo-pagina.png','/manifest.webmanifest'];
  for(const asset of criticalAssets)if(!assets.includes(asset))throw new Error('Critical asset outside public manifest');
  const precache=[...new Set([...shell.filter(asset=>assets.includes(asset)),...criticalAssets])].sort();

  let releaseVersion = 'unversioned';
  try {
    const metadata = JSON.parse(await readFile(path.join(destination, 'app-version.json'), 'utf8'));
    if (typeof metadata.version !== 'string' || !metadata.version.trim()) throw new Error('Invalid application version');
    releaseVersion = metadata.version.trim();
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const digest = createHash('sha256');
  digest.update(JSON.stringify(precache));
  for (const asset of assets) digest.update(asset).update(await readFile(path.join(destination, asset.slice(1))));
  for (const file of workerFiles) digest.update(file).update(await readFile(path.join(root, 'frontend/public', file)));
  const version = releaseVersion + '-reconstructed-' + digest.digest('hex').slice(0, 12);
  for (const file of workerFiles) await copyFile(path.join(root, 'frontend/public', file), path.join(destination, file));
  await writeFile(path.join(destination, 'service-worker-config.js'), 'self.__MCI_SW_CONFIG__ = ' + JSON.stringify({version, assets,precache}) + ';\n');
  const precacheBytes=(await Promise.all(precache.map(asset=>readFile(path.join(destination,asset.slice(1)))))).reduce((total,bytes)=>total+bytes.length,0);
  return {version, assets: assets.length,precacheAssets:precache.length,precacheUncompressedBytes:precacheBytes};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(await buildServiceWorker());
