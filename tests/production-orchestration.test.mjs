import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile, copyFile, cp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const execute = promisify(execFile);
const repository = fileURLToPath(new URL('../', import.meta.url));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

// Exercise the real verifier, not a replica of its control flow. Every build,
// application test and emulator target inside this private fixture is synthetic.
// The Python step deliberately runs the actual installed unittest interpreter.
async function fixture(context, { changeDuringNode = false, changeBackendDuringNode = false } = {}) {
  const privateBase = path.resolve(repository, 'recovery/private');
  await mkdir(privateBase, { recursive: true });
  const root = await mkdtemp(path.join(privateBase, 'release-orchestration-'));
  context.after(async () => {
    assert.equal(path.dirname(root), privateBase);
    assert.match(path.basename(root), /^release-orchestration-/);
    await rm(root, { recursive: true, force: true });
  });
  for (const directory of ['frontend', 'functions/src', 'functions/lib', 'functions/node_modules/typescript/bin', 'scripts/lib', 'tests', 'recovery/private', 'dist-production/app', 'recovered/hosting', 'recovered/readable-assets']) await mkdir(path.join(root, directory), { recursive: true });
  const write = async (name, contents) => writeFile(path.join(root, name), contents);
  const json = async (name, value) => write(name, JSON.stringify(value));
  await json('package.json', { name: 'synthetic-release-orchestration', private: true, type: 'module' });
  await json('.firebaserc', { projects: { default: 'mcimachala-servidor' } });
  for (const config of ['firebase.json', 'firebase.production.json']) await copyFile(path.join(repository, config), path.join(root, config));
  await copyFile(path.join(repository, 'scripts/verify-production.mjs'), path.join(root, 'scripts/verify-production.mjs'));
  await cp(path.join(repository, 'scripts/lib'), path.join(root, 'scripts/lib'), { recursive: true });
  await write('frontend/application.js', 'export const syntheticValue = "NEW";\n');
  await write('functions/src/index.ts', 'exports.syntheticBackend = true;\n');
  await write('functions/lib/index.js', 'exports.syntheticBackend = "OLD";\n');

  const publicFiles = {
    'index.html': '<script type="module" src="/app/entry.js"></script>',
    'app/entry.js': 'export const syntheticValue = "OLD";\n',
    'registerSW.js': '/* Synthetic worker registration; never executed. */',
    'firebase-messaging-sw.js': '/* Synthetic worker; never executed. */',
    'firebase-messaging-logic.js': '/* Synthetic messaging; never executed. */',
    'service-worker-config.js': '/* Synthetic cache; never executed. */',
  };
  for (const [name, contents] of Object.entries(publicFiles)) await write('dist-production/' + name, contents);
  const manifest = {
    schemaVersion: 1, target: 'production', projectId: 'mcimachala-servidor', emulators: false, bff: false,
    serviceWorkerEnabled: true, sourceMaps: false, entry: 'app/entry.js', originalJsxRecovered: false,
    sourceKind: 'reconstructed-published-javascript',
    files: Object.entries(publicFiles).map(([name, contents]) => ({ path: name, sha256: hash(contents), bytes: Buffer.byteLength(contents) })),
  };
  await json('dist-production/mci-release.json', manifest);
  const oldManifestHash = hash(await readFile(path.join(root, 'dist-production/mci-release.json')));

  // These stubs only transform synthetic local files and contain no SDK clients.
  await write('scripts/build-frontend.mjs', `import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const entry=await readFile('frontend/application.js');
await writeFile('dist-production/app/entry.js',entry);
const manifest=JSON.parse(await readFile('dist-production/mci-release.json','utf8'));
for(const file of manifest.files){const bytes=await readFile('dist-production/'+file.path);file.bytes=bytes.length;file.sha256=createHash('sha256').update(bytes).digest('hex');}
await writeFile('dist-production/mci-release.json',JSON.stringify(manifest));
`);
  await json('functions/node_modules/typescript/package.json', { type: 'commonjs' });
  await write('functions/node_modules/typescript/bin/tsc', `const fs=require('node:fs');
fs.writeFileSync('functions/lib/index.js',fs.readFileSync('functions/src/index.ts'));
`);
  await write('tests/synthetic.test.mjs', `import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
test('synthetic local verifier fixture',async()=>{
 assert.match(await readFile('dist-production/app/entry.js','utf8'),/NEW/);
 ${changeDuringNode ? 'await writeFile(\'frontend/application.js\',\'export const syntheticValue = "CHANGED_DURING_TEST";\\n\');' : ''}
 ${changeBackendDuringNode ? 'await writeFile(\'functions/lib/index.js\',\'exports.syntheticBackend = "CHANGED_AFTER_COMPILATION";\\n\');' : ''}
});
`);
  await write('tests/test_synthetic.py', 'import unittest\n\nclass SyntheticLocalVerifier(unittest.TestCase):\n    def test_local_fixture(self):\n        self.assertTrue(True)\n');
  for (const filename of ['emulator.integration.mjs', 'release-rules.integration.mjs']) await write('tests/' + filename, `// Synthetic orchestration target: no emulator, credentials or Cloud service.
import test from 'node:test';
import assert from 'node:assert/strict';
test('synthetic isolated integration target',()=>assert.equal(1,1));
`);
  return {
    root, oldManifestHash,
    async run() {
      let exitCode = 0;
      const environment = { ...process.env, GCLOUD_PROJECT: 'mcimachala-servidor', PROJECT_DIR: root };
      // This is a separate CLI invocation, not a nested node:test worker. Node's
      // inherited worker marker otherwise suppresses the verifier's test runners.
      delete environment.NODE_TEST_CONTEXT;
      try {
        await execute(process.execPath, ['scripts/verify-production.mjs'], {
          cwd: root, windowsHide: true, timeout: 30000,
          env: environment,
        });
      } catch (error) {
        if (typeof error.code !== 'number') throw error;
        exitCode = error.code;
      }
      const report = JSON.parse(await readFile(path.join(root, 'recovery/production-validation.json'), 'utf8'));
      const currentManifestHash = hash(await readFile(path.join(root, 'dist-production/mci-release.json')));
      return { exitCode, report, currentManifestHash };
    },
  };
}

test('real verifier recompiles an OLD artifact from NEW source before certifying its digest', async (context) => {
  const app = await fixture(context);
  const { exitCode, report, currentManifestHash } = await app.run();
  assert.equal(exitCode, 0, JSON.stringify(report)); assert.equal(report.status, 'passed');
  assert.equal(report.sourceChangedDuringValidation, false);
  assert.notEqual(currentManifestHash, app.oldManifestHash);
  assert.equal(report.manifestSha256, currentManifestHash);
  assert.deepEqual(report.commands.map((command) => command.label), ['frontend-build', 'backend-build', 'node', 'python', 'emulator']);
  assert.ok(report.commands.every((command) => command.exitCode === 0));
  assert.equal(report.commands.find((command) => command.label === 'node').tests, 1);
  assert.equal(report.commands.find((command) => command.label === 'python').tests, 1);
  assert.equal(report.commands.find((command) => command.label === 'emulator').tests, 2);
  assert.match(await readFile(path.join(app.root, 'dist-production/app/entry.js'), 'utf8'), /NEW/);
});

test('real verifier blocks source changes made during a passing synthetic test run', async (context) => {
  const app = await fixture(context, { changeDuringNode: true });
  const { exitCode, report } = await app.run();
  assert.equal(exitCode, 2); assert.equal(report.status, 'blocked');
  assert.equal(report.sourceChangedDuringValidation, true, JSON.stringify(report));
  assert.ok(report.commands.every((command) => command.exitCode === 0));
  assert.match(await readFile(path.join(app.root, 'frontend/application.js'), 'utf8'), /CHANGED_DURING_TEST/);
  assert.match(await readFile(path.join(app.root, 'dist-production/app/entry.js'), 'utf8'), /NEW/);
});

test('real verifier blocks compiled backend changes after compilation even when sources remain unchanged', async (context) => {
  const app = await fixture(context, { changeBackendDuringNode: true });
  const { exitCode, report, currentManifestHash } = await app.run();
  assert.equal(exitCode, 2, JSON.stringify(report));
  assert.equal(report.status, 'blocked');
  assert.equal(report.backendChangedDuringValidation, true, JSON.stringify(report));
  assert.equal(report.sourceChangedDuringValidation, false);
  assert.ok(report.commands.every((command) => command.exitCode === 0));
  assert.equal(report.manifestSha256, currentManifestHash);
  assert.match(await readFile(path.join(app.root, 'functions/lib/index.js'), 'utf8'), /CHANGED_AFTER_COMPILATION/);
  assert.equal(await readFile(path.join(app.root, 'functions/src/index.ts'), 'utf8'), 'exports.syntheticBackend = true;\n');
});
