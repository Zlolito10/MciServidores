#!/usr/bin/env node
/**
 * Recover Firebase deployment metadata and available function source, read-only.
 * No deployment, API enablement, IAM changes, data export, or user export.
 * The only resource POST is functions:generateDownloadUrl (read source access).
 * OAuth tokens and generated signed URLs are never saved or printed.
 * All cloud metadata/source goes under recovery/private (keep git-ignored).
 *
 * Usage:
 * node scripts/recover-firebase.mjs --account EMAIL --project PROJECT_ID [--site HOSTING_SITE_ID]
 *   [--firebase-tools PATH_TO_FIREBASE_TOOLS] [--out recovery/private]
 *   [--only firestore,realtimeDatabase]
 */
import { createRequire } from 'node:module';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createHash } from 'node:crypto';

const require = createRequire(import.meta.url);
const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const flags = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i];
  const value = process.argv[i + 1];
  if (!key?.startsWith('--') || !value || value.startsWith('--')) {
    throw new Error('Expected --option value pairs. Required: --account EMAIL --project PROJECT_ID.');
  }
  if (!['--account', '--project', '--site', '--firebase-tools', '--out', '--only'].includes(key)) {
    throw new Error(`Unknown option: ${key}`);
  }
  flags.set(key.slice(2), value);
}
const project = flags.get('project');
const site = flags.get('site') || project;
const email = flags.get('account');
const resourceGroups = ['project', 'webApps', 'hosting', 'securityRules', 'firestore',
  'realtimeDatabase', 'storageBuckets', 'authenticationConfig', 'functions'];
const selected = flags.has('only') ? new Set(flags.get('only').split(',')) : null;
if (selected && [...selected].some((group) => !resourceGroups.includes(group))) {
  throw new Error(`--only must contain comma-separated names from: ${resourceGroups.join(',')}`);
}
if (!email) throw new Error('Specify the Firebase CLI account with --account EMAIL.');
if (!project) throw new Error('Specify the Firebase project ID with --project PROJECT_ID.');
if (!/^[a-z][a-z0-9-]{4,62}$/.test(project) || !/^[a-z0-9-]+$/.test(site)) {
  throw new Error('Invalid project or Hosting site ID.');
}
const out = path.resolve(workspace, flags.get('out') || 'recovery/private');
const privateBase = path.resolve(workspace, 'recovery/private');
if (out !== privateBase && !out.startsWith(privateBase + path.sep)) {
  throw new Error('Output must stay inside recovery/private to protect cloud metadata.');
}
const firebaseTools = flags.get('firebase-tools') || process.env.FIREBASE_TOOLS_PACKAGE ||
  path.dirname(require.resolve('firebase-tools/package.json'));
await access(path.join(firebaseTools, 'lib/auth.js'));
// Firebase Tools has no transports until its CLI runner is invoked; suppress any
// logger output as an additional precaution before loading its authentication.
const { logger } = require(path.join(firebaseTools, 'lib/logger.js'));
logger.silent = true;
const auth = require(path.join(firebaseTools, 'lib/auth.js'));
const account = auth.selectAccount(email, workspace);
if (account?.user?.email !== email || !account?.tokens?.refresh_token) {
  throw new Error('Requested account is not signed into Firebase CLI. Run firebase login:add.');
}
const scopes = [
  // Match the CLI login grant. RTDB requires the email scope, so never narrow
  // a refresh to only firebase/cloud-platform even when other APIs accept that.
  'email',
  'openid',
  'https://www.googleapis.com/auth/cloudplatformprojects.readonly',
  'https://www.googleapis.com/auth/cloud-platform',
  'https://www.googleapis.com/auth/firebase',
];
let token;
let tokenExpiresAt = 0;
async function getBearer(force = false) {
  if (!force && token && tokenExpiresAt > Date.now() + 60_000) return token;
  const credentials = await auth.getAccessToken(account.tokens.refresh_token, scopes);
  if (!credentials?.access_token || credentials.access_token === account.tokens.refresh_token) {
    throw new SafeError('AUTH_FAILED');
  }
  token = credentials.access_token;
  tokenExpiresAt = credentials.expires_at || Date.now() + 180_000;
  return token;
}

class SafeError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}
const apiHosts = new Set([
  'firebase.googleapis.com', 'firebasehosting.googleapis.com',
  'firebaserules.googleapis.com', 'firestore.googleapis.com',
  'firebasedatabase.googleapis.com', 'cloudfunctions.googleapis.com',
  'storage.googleapis.com', 'identitytoolkit.googleapis.com',
]);
function isDatabaseHost(host) {
  return host.endsWith('.firebaseio.com') || host.endsWith('.firebasedatabase.app');
}
async function api(urlValue, { method = 'GET', body, retryAuth = true } = {}) {
  const url = new URL(urlValue);
  if (url.protocol !== 'https:' || url.username || url.password ||
      (!apiHosts.has(url.hostname) && !isDatabaseHost(url.hostname))) {
    throw new SafeError('UNTRUSTED_API_HOST');
  }
  // Keep every cloud operation read-only, including future edits to callers.
  const sourcePost = method === 'POST' && url.hostname === 'cloudfunctions.googleapis.com' &&
    /^\/v[12]\/projects\/[^/]+\/locations\/[^/]+\/functions\/[^/:]+:generateDownloadUrl$/.test(url.pathname);
  if (method !== 'GET' && !sourcePost) throw new SafeError('MUTATION_BLOCKED');
  const response = await fetch(url, {
    method, redirect: 'error', signal: AbortSignal.timeout(60_000),
    headers: { Authorization: `Bearer ${await getBearer()}`,
      Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (response.status === 401 && retryAuth) {
    token = undefined;
    tokenExpiresAt = 0;
    await getBearer(true);
    return api(url, { method, body, retryAuth: false });
  }
  const text = await response.text();
  let result;
  try { result = JSON.parse(text); } catch { throw new SafeError('NON_JSON_RESPONSE', response.status); }
  if (!response.ok) {
    const code = typeof result.error?.status === 'string' && /^[A-Z_]+$/.test(result.error.status)
      ? result.error.status : 'HTTP_ERROR';
    // Never retain raw error messages/bodies: they can contain credentials or URLs.
    throw new SafeError(code, response.status);
  }
  return result;
}
async function list(urlValue, field, query = {}) {
  const values = [];
  const unreachable = new Set();
  const seenTokens = new Set();
  let pageToken;
  do {
    const url = new URL(urlValue);
    for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const response = await api(url);
    values.push(...(response[field] || []));
    for (const region of response.unreachable || []) unreachable.add(region);
    pageToken = response.nextPageToken;
    if (pageToken && seenTokens.has(pageToken)) throw new SafeError('REPEATED_PAGE_TOKEN');
    if (pageToken) seenTokens.add(pageToken);
  } while (pageToken);
  return { [field]: values, ...(unreachable.size ? { unreachable: [...unreachable] } : {}) };
}
function safeName(value) {
  const readable = String(value).replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^\.+/, '').slice(0, 100);
  return `${readable || 'resource'}-${createHash('sha256').update(String(value)).digest('hex').slice(0, 8)}`;
}
async function save(relative, value) {
  const filename = path.resolve(out, relative);
  if (!filename.startsWith(out + path.sep)) throw new SafeError('UNSAFE_LOCAL_PATH');
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
  return path.relative(workspace, filename).split(path.sep).join('/');
}
const summary = { project, site, startedAt: new Date().toISOString(),
  completedAt: null, resources: {}, errors: [], readOnly: true,
  ...(selected ? { selectedResources: [...selected].sort() } : {}) };
function shouldRecover(label) {
  if (!selected) return true;
  let group = label.split(':')[0];
  if (group === 'webApp') group = 'webApps';
  if (group === 'ruleset') group = 'securityRules';
  if (group === 'databaseRules') group = 'realtimeDatabase';
  if (group === 'functionSource' || group === 'functionsV1' || group === 'functionsV2') group = 'functions';
  return selected.has(group);
}
async function recover(label, fn) {
  if (!shouldRecover(label)) return undefined;
  try {
    const result = await fn();
    summary.resources[label] = { status: 'recovered', ...result };
    console.log(`${label}: recovered`);
    return result;
  } catch (error) {
    const safe = { resource: label, code: error instanceof SafeError ? error.code : 'LOCAL_OR_NETWORK_ERROR',
      ...(error instanceof SafeError && error.status ? { httpStatus: error.status } : {}) };
    summary.errors.push(safe);
    summary.resources[label] = { status: 'failed', ...safe };
    console.log(`${label}: ${safe.code}${safe.httpStatus ? ` (${safe.httpStatus})` : ''}`);
    return undefined;
  }
}
const firebase = `https://firebase.googleapis.com/v1beta1/projects/${project}`;
const hosting = 'https://firebasehosting.googleapis.com/v1beta1';
const firestore = `https://firestore.googleapis.com/v1/projects/${project}/databases`;
const rules = `https://firebaserules.googleapis.com/v1/projects/${project}`;
await mkdir(out, { recursive: true });
await recover('project', async () => {
  const config = await api(firebase);
  return { file: await save('project.json', config), displayName: config.displayName };
});
await recover('webApps', async () => {
  const apps = await list(`${firebase}/webApps`, 'apps', { pageSize: 100 });
  await save('web-apps.json', apps);
  for (const app of apps.apps) await recover(`webApp:${app.appId}`, async () => ({
    file: await save(`web-app-configs/${safeName(app.appId)}.json`,
      await api(`https://firebase.googleapis.com/v1beta1/projects/-/webApps/${encodeURIComponent(app.appId)}/config`)),
  }));
  return { count: apps.apps.length };
});
await recover('hosting', async () => {
  await save('hosting/site.json', await api(`${hosting}/projects/-/sites/${site}`));
  const releases = await list(`${hosting}/sites/${site}/channels/live/releases`, 'releases', { pageSize: 100 });
  await save('hosting/live-releases.json', releases);
  const current = [...releases.releases].sort((a, b) =>
    String(b.releaseTime || '').localeCompare(String(a.releaseTime || '')))[0];
  // A SITE_DISABLE release means there is no deployed live version to recover.
  if (!current?.version?.name) throw new SafeError('NO_LIVE_HOSTING_VERSION');
  const versionName = current.version.name.replace(/^projects\/[^/]+\//, '');
  if (!new RegExp(`^sites/${site}/versions/[a-zA-Z0-9_-]+$`).test(versionName)) {
    throw new SafeError('UNEXPECTED_HOSTING_VERSION_NAME');
  }
  const version = await api(`${hosting}/${versionName}`);
  await save('hosting/live-version.json', version);
  await save('hosting/config.json', version.config || {});
  const files = await list(`${hosting}/${versionName}/files`, 'files', { status: 'ACTIVE', pageSize: 1000 });
  const manifest = await save('hosting/files.json', files);
  return { version: versionName, fileCount: files.files.length, manifest };
});
await recover('securityRules', async () => {
  const releases = await list(`${rules}/releases`, 'releases', { pageSize: 10 });
  await save('rules/releases.json', releases);
  const rulesetNames = [...new Set(releases.releases.map((release) => release.rulesetName).filter(Boolean))];
  for (const name of rulesetNames) await recover(`ruleset:${name}`, async () => {
    if (!name.startsWith(`projects/${project}/rulesets/`)) throw new SafeError('UNEXPECTED_RULESET_PROJECT');
    const ruleset = await api(`https://firebaserules.googleapis.com/v1/${name}`);
    const folder = `rules/rulesets/${safeName(name)}`;
    const file = await save(`${folder}/metadata.json`, ruleset);
    for (const source of ruleset.source?.files || []) {
      await save(`${folder}/${safeName(source.name)}.rules`, source.content || '');
    }
    return { file, sourceFileCount: ruleset.source?.files?.length || 0 };
  });
  return { releaseCount: releases.releases.length, rulesetCount: rulesetNames.length };
});
await recover('firestore', async () => {
  const databases = await list(firestore, 'databases');
  await save('firestore/databases.json', databases);
  for (const database of databases.databases) await recover(`firestore:${database.name}`, async () => {
    if (!database.name.startsWith(`projects/${project}/databases/`)) throw new SafeError('UNEXPECTED_DATABASE_PROJECT');
    const folder = `firestore/${safeName(database.name.split('/').pop())}`;
    await save(`${folder}/config.json`, database);
    const base = `https://firestore.googleapis.com/v1/${database.name}/collectionGroups/-`;
    // Mirror the CLI's initial index-list query; follow nextPageToken if present.
    const indexes = await list(`${base}/indexes`, 'indexes');
    await save(`${folder}/indexes.json`, indexes);
    // Explicit field indexes/TTL settings, no document reads.
    const fields = await list(`${base}/fields`, 'fields', {
      filter: 'indexConfig.usesAncestorConfig=false OR ttlConfig:*',
    });
    await save(`${folder}/fields.json`, fields);
    return { indexCount: indexes.indexes.length, fieldCount: fields.fields.length };
  });
  return { databaseCount: databases.databases.length };
});
await recover('realtimeDatabase', async () => {
  const instances = await list(`https://firebasedatabase.googleapis.com/v1beta/projects/${project}/locations/-/instances`,
    'instances', { pageSize: 100 });
  await save('database/instances.json', instances);
  for (const instance of instances.instances) await recover(`databaseRules:${instance.name}`, async () => {
    const url = new URL(instance.databaseUrl);
    if (!isDatabaseHost(url.hostname) || url.protocol !== 'https:') throw new SafeError('UNEXPECTED_DATABASE_URL');
    url.pathname = '/.settings/rules.json';
    url.search = '';
    const content = await api(url);
    return { file: await save(`database/${safeName(instance.name)}/rules.json`, content) };
  });
  return { instanceCount: instances.instances.length };
});
await recover('storageBuckets', async () => {
  const buckets = await list('https://storage.googleapis.com/storage/v1/b', 'items', { project, maxResults: 100 });
  return { count: buckets.items.length, file: await save('storage/buckets.json', buckets) };
});
await recover('authenticationConfig', async () => ({
  file: await save('auth/config.json', await api(`https://identitytoolkit.googleapis.com/admin/v2/projects/${project}/config`)),
}));

const functionMap = new Map();
for (const generation of [1, 2]) await recover(`functionsV${generation}`, async () => {
  const response = await list(`https://cloudfunctions.googleapis.com/v${generation}/projects/${project}/locations/-/functions`,
    'functions', { pageSize: 1000, ...(generation === 2 ? { filter: 'environment="GEN_2"' } : {}) });
  await save(`functions/v${generation}-metadata.json`, response);
  for (const fn of response.functions) {
    if (!fn.name?.startsWith(`projects/${project}/locations/`)) continue;
    const prior = functionMap.get(fn.name);
    // v2 wins if one name is returned by both API generations.
    if (!prior || generation === 2) functionMap.set(fn.name, { fn, generation });
  }
  return { count: response.functions.length, unreachable: response.unreachable || [] };
});
const archiveMap = new Map();
const sourceMapping = [];
function archiveIdentity(fn, generation) {
  // Cloud Functions in one codebase often point to one uploaded archive. Include
  // the object generation so deployments/revisions are never merged by accident.
  const source = fn.buildConfig?.source?.storageSource;
  if (source?.bucket && source?.object && source?.generation) {
    return JSON.stringify({ bucket: source.bucket, object: source.object, generation: String(source.generation) });
  }
  // Legacy gs:// archive objects without a pinned generation cannot safely be
  // deduplicated: their contents may change between deployed function versions.
  return JSON.stringify({ function: fn.name, apiGeneration: generation, versionId: fn.versionId || null });
}
for (const { fn, generation } of functionMap.values()) await recover(`functionSource:${fn.name}`, async () => {
  const identity = archiveIdentity(fn, generation);
  const existing = archiveMap.get(identity);
  if (existing) {
    sourceMapping.push({ function: fn.name, apiGeneration: generation, ...existing, sharedArchive: true });
    return { generation, ...existing, sharedArchive: true };
  }
  const generated = await api(`https://cloudfunctions.googleapis.com/v${generation}/${fn.name}:generateDownloadUrl`,
    { method: 'POST', ...(generation === 1 ? { body: {} } : {}) });
  const url = new URL(generated.downloadUrl);
  if (url.protocol !== 'https:' || url.username || url.password ||
      !(url.hostname === 'storage.googleapis.com' || url.hostname.endsWith('.storage.googleapis.com'))) {
    throw new SafeError('UNTRUSTED_SOURCE_DOWNLOAD_HOST');
  }
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(180_000) });
  if (!response.ok) throw new SafeError('SOURCE_DOWNLOAD_FAILED', response.status);
  const archiveId = createHash('sha256').update(identity).digest('hex').slice(0, 24);
  const filename = path.join(out, 'functions', 'archives', archiveId, 'source.zip');
  await mkdir(path.dirname(filename), { recursive: true });
  let bytes = 0;
  const digest = createHash('sha256');
  const cap = 256 * 1024 * 1024;
  const meter = new Transform({ transform(chunk, encoding, callback) {
    bytes += chunk.length;
    if (bytes > cap) return callback(new SafeError('SOURCE_DOWNLOAD_TOO_LARGE'));
    digest.update(chunk);
    callback(null, chunk);
  } });
  // Stream source without retaining or displaying the URL/signature.
  await pipeline(Readable.fromWeb(response.body), meter, createWriteStream(filename));
  const archive = { archiveId, file: path.relative(workspace, filename).split(path.sep).join('/'),
    bytes, sha256: digest.digest('hex') };
  archiveMap.set(identity, archive);
  sourceMapping.push({ function: fn.name, apiGeneration: generation, ...archive, sharedArchive: false });
  return { generation, ...archive, sharedArchive: false };
});
if (shouldRecover('functionsV1')) {
  await save('functions/source-mapping.json', { functions: sourceMapping,
    archives: [...archiveMap.entries()].map(([identity, archive]) => ({ identity: JSON.parse(identity), ...archive })) });
  summary.uniqueFunctions = functionMap.size;
  summary.uniqueSourceArchives = archiveMap.size;
}
summary.completedAt = new Date().toISOString();
const summaryName = selected ? `recovery-summary.only-${[...selected].sort().join('_')}.json` : 'recovery-summary.json';
await save(summaryName, summary);
token = undefined;
console.log(`Recovery complete: ${Object.values(summary.resources).filter((r) => r.status === 'recovered').length} resources; ${summary.errors.length} errors.`);
console.log('Private metadata and source are in recovery/private. No cloud configuration was changed.');
process.exitCode = summary.errors.length ? 2 : 0;
