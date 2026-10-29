import {build} from 'esbuild';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const destination=path.resolve(root,'dist/__browser-tests');
if(!destination.startsWith(path.join(root,'dist')+path.sep))throw new Error('Unsafe browser fixture destination');
await mkdir(destination,{recursive:true});
const camera=path.join(root,'frontend/src/components/CameraModal.jsx');
const environment={emulators:true,enableServiceWorker:false,flags:{VITE_USE_EMULATORS:'1'},firebase:{apiKey:'demo-mci-local-key',authDomain:'demo-mci-servidores.firebaseapp.com',projectId:'demo-mci-servidores',storageBucket:'demo-mci-servidores.appspot.com',messagingSenderId:'584384917166',appId:'1:584384917166:web:bae42d13f0da36961dc73f'}};
const result=await build({
  absWorkingDir:root,
  entryPoints:['tests/browser-fixtures/camera.jsx'],
  outfile:'dist/__browser-tests/camera.js',
  bundle:true,format:'esm',target:'es2022',sourcemap:true,metafile:true,legalComments:'linked',
  external:['node-fetch','util'],jsx:'automatic',jsxImportSource:'#mci',
  define:{__MCI_RECOVERY_ENV__:JSON.stringify(environment)},
  plugins:[{name:'isolated-camera-fixture',setup(builder){
    builder.onResolve({filter:/^#mci\/jsx-runtime$/},()=>({path:path.join(root,'frontend/src/vendor/jsx-runtime.js')}));
    // App.jsx only re-exports Modal. Bind that same real component directly so
    // importing CameraModal does not initialize auth/providers or the app shell.
    builder.onResolve({filter:/^\.\.\/app\/App\.jsx$/},args=>path.resolve(args.importer)===camera?{path:path.join(root,'frontend/src/components/Modal.jsx')}:undefined);
  }}],
});
const inputs=Object.keys(result.metafile.inputs);
if(inputs.some(input=>/frontend\/src\/(?:main\.jsx|app\/App\.jsx)$/.test(input)))throw new Error('Browser fixture included the main application bootstrap');
await writeFile(path.join(destination,'camera.html'),`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MCI · Cámara sintética</title>
<link rel="stylesheet" href="/assets/index-B05fqWAG.css"><style>body{font:16px system-ui,sans-serif;background:#f8fafc;color:#172033;margin:0}.fixture{max-width:800px;margin:32px auto;padding:24px}.fixture h1{font-size:26px;font-weight:700}.fixture p{margin:12px 0}.fixture button{background:#245185;color:white;border-radius:8px;padding:10px 16px;margin-right:10px}.fixture dl{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}.fixture output{font-weight:700}.fixture-preview{max-width:360px;border:1px solid #cbd5e1;border-radius:8px}.fixture-error{color:#a11919}</style>
</head><body><div id="camera-fixture-root"></div><script type="module" src="/\u005f\u005fbrowser-tests/camera.js"></script></body></html>`);
console.log(JSON.stringify({fixture:'/__browser-tests/camera.html',modules:inputs.length,mainBootstrapIncluded:false,requiresInjectedSyntheticMedia:true}));
