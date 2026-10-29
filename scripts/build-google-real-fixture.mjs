import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'dist/__browser-tests');
await mkdir(destination, { recursive: true });
const result = await build({
  absWorkingDir: root,
  entryPoints: ['tests/browser-fixtures/google-real.jsx'],
  outfile: 'dist/__browser-tests/google-real.js',
  bundle: true,
  format: 'esm',
  target: 'es2022',
  metafile: true,
  legalComments: 'linked',
});
const allowedInputs = new Set([
  'tests/browser-fixtures/google-real.jsx',
  'frontend/src/vendor/vendor-firebase-BjYbfC3F.js',
]);
const inputs = Object.keys(result.metafile.inputs).map((input) => input.replaceAll('\\', '/'));
if (inputs.length !== allowedInputs.size || inputs.some((input) => !allowedInputs.has(input))) {
  throw new Error('Google proof must contain only its UI and the preserved Firebase SDK');
}
await writeFile(path.join(destination, 'google-real.html'), `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="no-referrer"><title>MCI · Prueba aislada Google</title>
<style>body{font:16px system-ui;color:#15314a;background:#f5f8fc}main{max-width:850px;margin:32px auto;padding:24px;background:white;border-radius:14px}h1{font-size:26px}p{line-height:1.6}label{display:block;font-weight:600}input{display:block;width:min(95%,480px);padding:12px;margin:10px 0 20px;font:inherit}button{padding:12px 18px;background:#245185;color:white;border:0;border-radius:8px;font:inherit;cursor:pointer}button:disabled{opacity:.5;cursor:default}pre{padding:20px;background:#eef3f9;white-space:pre-wrap}</style>
</head><body><div id="google-proof-root"></div><script type="module" src="/__browser-tests/google-real.js"></script></body></html>\n`);
console.log(JSON.stringify({
  fixture: '/__browser-tests/google-real.html',
  inputs: inputs.length,
  applicationBootstrapIncluded: false,
  authPersistence: 'memory',
  signInOnlyOnClick: true,
  identityOrTokenEvidence: false,
}));
