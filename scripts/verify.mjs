import { createHash } from 'node:crypto';
import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export function requireSupportedNode() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 24 || (major === 24 && minor < 11)) {
    throw new Error('Frontend recovery tools require Node.js 24.11 or newer. Functions use Node.js 22.');
  }
}

async function listRegularFiles(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not allowed in recovered Hosting: ${relative}`);
    if (entry.isDirectory()) files.push(...await listRegularFiles(path.join(directory, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unsupported file type in recovered Hosting: ${relative}`);
  }
  return files.sort();
}

/** Verify every recovered byte before allowing it into a build. Makes no network calls. */
export async function verifyHosting({ root = projectRoot } = {}) {
  requireSupportedNode();
  const recoveredRoot = path.join(root, 'recovered');
  const hostingRoot = path.join(recoveredRoot, 'hosting');
  for (const directory of [recoveredRoot, hostingRoot]) {
    const info = await lstat(directory);
    if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('Recovered Hosting must use regular directories.');
  }
  const inventory = JSON.parse(await readFile(path.join(recoveredRoot, 'hosting-inventory.json'), 'utf8'));
  if (!Array.isArray(inventory)) throw new Error('Hosting inventory must be an array.');
  const entries = [];
  const seen = new Set();
  for (const record of inventory) {
    if (!record || typeof record !== 'object') throw new Error('Invalid Hosting inventory record.');
    if (record.local === undefined) continue; // Failed download attempts are retained as evidence.
    const local = record.local;
    if (typeof local !== 'string' || !local.startsWith('hosting/') || local.includes('\\')) {
      throw new Error('Unsafe local path in Hosting inventory.');
    }
    const segments = local.split('/');
    if (segments.some(segment => !segment || segment === '.' || segment === '..')) {
      throw new Error('Unsafe local path in Hosting inventory.');
    }
    const relative = segments.slice(1).join('/');
    if (seen.has(relative)) throw new Error(`Duplicate Hosting inventory path: ${relative}`);
    if (record.status !== 200 || record.error || !/^[a-f0-9]{64}$/i.test(record.sha256 ?? '') ||
        !Number.isSafeInteger(record.bytes) || record.bytes < 0) {
      throw new Error(`Invalid integrity metadata: ${relative}`);
    }
    seen.add(relative);
    entries.push({ relative, bytes: record.bytes, sha256: record.sha256.toLowerCase() });
  }
  if (!seen.has('index.html')) throw new Error('Hosting inventory must include index.html.');
  const files = await listRegularFiles(hostingRoot);
  const unexpected = files.filter(file => !seen.has(file));
  if (unexpected.length) throw new Error(`Unrecorded Hosting files: ${unexpected.join(', ')}`);
  const missing = [...seen].filter(file => !files.includes(file));
  if (missing.length) throw new Error(`Missing recovered Hosting files: ${missing.join(', ')}`);
  const verified = [];
  for (const entry of entries) {
    const content = await readFile(path.join(hostingRoot, entry.relative));
    const actualHash = createHash('sha256').update(content).digest('hex');
    if (content.length !== entry.bytes || actualHash !== entry.sha256) {
      throw new Error(`Integrity check failed: ${entry.relative}`);
    }
    verified.push({ ...entry, content });
  }
  return { hostingRoot, files: verified };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { files } = await verifyHosting();
    console.log(`Verified ${files.length} recovered Hosting files (SHA-256 and size).`);
  } catch (error) {
    console.error(`Verification failed: ${error.message}`);
    process.exitCode = 1;
  }
}
