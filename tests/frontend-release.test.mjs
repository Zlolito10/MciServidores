import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { parseFrontendBuildArgs, frontendEnvironment, assertPublicAssetPath, copyPublicAssets, frontendReleaseManifest } from '../scripts/lib/frontend-build.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
async function temporary(callback) {
  const base = await mkdtemp(path.join(tmpdir(), 'mci-frontend-release-'));
  try { await callback(base); }
  finally { assert.equal(path.dirname(base), path.resolve(tmpdir())); assert.match(path.basename(base), /^mci-frontend-release-/); await rm(base, { recursive: true, force: true }); }
}

test('release flags are explicit and preserve published BFF defaults', () => {
  const demo = frontendEnvironment(parseFrontendBuildArgs([]));
  assert.equal(demo.emulators, true); assert.equal(demo.firebase.projectId, 'demo-mci-servidores'); assert.equal(demo.enableServiceWorker, false);
  const production = frontendEnvironment(parseFrontendBuildArgs(['--production-services', '--out-dir', 'dist-production-review']));
  assert.equal(production.emulators, false); assert.equal(production.firebase.projectId, 'mcimachala-servidor'); assert.equal(production.enableServiceWorker, true);
  assert.deepEqual(production.flags, {});
  const bff = frontendEnvironment(parseFrontendBuildArgs(['--production-services', '--bff']));
  assert.equal(bff.flags.VITE_ENABLE_BFF, '1'); assert.equal(bff.flags.VITE_BFF_MODE, '1'); assert.equal(bff.flags.VITE_BFF_STRICT_AUTH, undefined);
  assert.equal(frontendEnvironment(parseFrontendBuildArgs(['--pwa-test'])).enableServiceWorker, true);
});

test('build options reject typo flags, duplicate options and unsafe output paths', () => {
  for (const args of [['--production-service'], ['--production-services', '--production-services'], ['--out-dir'], ['--out-dir', '../dist'], ['--out-dir', 'dist/private'], ['--out-dir', 'C:\\dist'], ['--out-dir', 'dist', '--out-dir', 'dist-bff']]) assert.throws(() => parseFrontendBuildArgs(args));
});

test('public assets cannot include private credentials, fixtures or backend files', () => {
  for (const filename of ['.env', 'folder/.secret', '__browser-tests/proof.js', 'private/token.json', 'api/profile.json', 'comments/export.json', 'credentials-owner.json', 'owner.private.json', 'service-account.json', 'config.pem', 'traffic.har', 'package.json', 'utils.test.js', '../secret']) assert.throws(() => assertPublicAssetPath(filename));
  assert.equal(assertPublicAssetPath('.well-known/security.txt'), '.well-known/security.txt');
  assert.equal(assertPublicAssetPath('assets/vendor.js.LEGAL.txt'), 'assets/vendor.js.LEGAL.txt');
});

test('production copies omit source maps and reject symlink assets', async (context) => temporary(async (base) => {
  const input = path.join(base, 'input'), output = path.join(base, 'output');
  await mkdir(path.join(input, 'assets'), { recursive: true }); await mkdir(output);
  await writeFile(path.join(input, 'assets/app.js'), 'export const ok = true;'); await writeFile(path.join(input, 'assets/app.js.map'), '{}');
  await copyPublicAssets(input, output, { omitSourceMaps: true });
  assert.deepEqual(await readdir(path.join(output, 'assets')), ['app.js']);
  try { await symlink(input, path.join(input, 'linked'), 'junction'); }
  catch (error) { if (['EPERM', 'ENOTSUP'].includes(error.code)) { context.diagnostic('Host does not permit the symlink fixture'); return; } throw error; }
  await assert.rejects(copyPublicAssets(input, output), /Symlink/);
}));

test('artifact manifest hashes every public file, excludes itself and requires its entry', async () => temporary(async (base) => {
  await mkdir(path.join(base, 'app')); await writeFile(path.join(base, 'app/entry.js'), 'export {};'); await writeFile(path.join(base, 'index.html'), '<!doctype html>'); await writeFile(path.join(base, 'mci-release.json'), 'ignored previous marker');
  const environment = frontendEnvironment(parseFrontendBuildArgs(['--production-services']));
  const manifest = await frontendReleaseManifest(base, { environment, bff: false, entry: 'app/entry.js', sourceMaps: false });
  assert.equal(manifest.target, 'production'); assert.equal(manifest.originalJsxRecovered, false);
  assert.deepEqual(manifest.files.map((file) => file.path), ['app/entry.js', 'index.html']);
  assert.equal(manifest.files[0].sha256, createHash('sha256').update('export {};').digest('hex'));
  await assert.rejects(frontendReleaseManifest(base, { environment, bff: false, entry: 'app/missing.js', sourceMaps: false }), /Missing release entry/);
  await writeFile(path.join(base, 'app/entry.js.map'), '{}');
  await assert.rejects(frontendReleaseManifest(base, { environment, bff: false, entry: 'app/entry.js', sourceMaps: false }), /Source map/);
}));

test('isolated production build has verifiable bytes, production config and no emitted source maps', async () => {
  execFileSync(process.execPath, ['scripts/build-frontend.mjs', '--production-services', '--out-dir', 'dist-production-review'], { cwd: root, windowsHide: true, stdio: 'pipe' });
  const output = path.join(root, 'dist-production-review');
  const manifest = JSON.parse(await readFile(path.join(output, 'mci-release.json'), 'utf8'));
  assert.equal(manifest.schemaVersion, 1); assert.equal(manifest.target, 'production'); assert.equal(manifest.projectId, 'mcimachala-servidor'); assert.equal(manifest.emulators, false);
  assert.equal(manifest.bff, false); assert.equal(manifest.serviceWorkerEnabled, true); assert.equal(manifest.sourceMaps, false); assert.equal(manifest.originalJsxRecovered, false);
  assert.ok(manifest.files.length > 50); assert.ok(manifest.files.some((file) => file.path === manifest.entry));
  const compiledEnvironments = [];
  for (const file of manifest.files) {
    const bytes = await readFile(path.join(output, file.path));
    assert.equal(bytes.length, file.bytes); assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
    assert.equal(file.path.endsWith('.map'), false); assert.equal(file.path.startsWith('__'), false);
    if (file.path.startsWith('app/') && file.path.endsWith('.js')) {
      const text = bytes.toString('utf8'); assert.equal(text.includes('sourceMappingURL='), false);
      traverse(parse(text, { sourceType: 'module' }), { VariableDeclarator(node) {
        if (node.node.id.name?.startsWith('define_MCI_RECOVERY_ENV') && node.node.init?.type === 'ObjectExpression') compiledEnvironments.push(node.node.init);
      } });
    }
  }
  assert.equal(compiledEnvironments.length, 1);
  const properties = Object.fromEntries(compiledEnvironments[0].properties.map((property) => [property.key.name, property.value]));
  assert.equal(properties.emulators.value, false); assert.equal(properties.enableServiceWorker.value, true); assert.equal(properties.flags.properties.length, 0);
  const html = await readFile(path.join(output, 'index.html'), 'utf8'); assert.ok(html.includes('/' + manifest.entry));
});
