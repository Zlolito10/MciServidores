import {build} from 'esbuild';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const camera=path.join(root,'frontend/src/components/CameraModal.jsx');
const destination=path.join(root,'dist/__browser-tests');
await mkdir(destination,{recursive:true});
const result=await build({absWorkingDir:root,entryPoints:['tests/browser-fixtures/real-device.jsx'],outfile:'dist/__browser-tests/real-device.js',bundle:true,format:'esm',target:'es2022',metafile:true,legalComments:'linked',external:['node-fetch','util'],jsx:'automatic',jsxImportSource:'#mci',plugins:[{name:'camera-without-app-bootstrap',setup(builder){
  builder.onResolve({filter:/^#mci\/jsx-runtime$/},()=>({path:path.join(root,'frontend/src/vendor/jsx-runtime.js')}));
  builder.onResolve({filter:/^\.\.\/app\/App\.jsx$/},args=>path.resolve(args.importer)===camera?{path:path.join(root,'frontend/src/components/Modal.jsx')}:undefined);
}}]});
if(Object.keys(result.metafile.inputs).some(input=>/frontend\/src\/(?:main\.jsx|app\/App\.jsx)$/.test(input)))throw new Error('Unexpected app bootstrap');
await writeFile(path.join(destination,'real-device.html'),'<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MCI · Dispositivo real</title><link rel="stylesheet" href="/assets/index-B05fqWAG.css"><style>main{max-width:850px;margin:32px auto;padding:24px;font:16px system-ui}h1{font-size:26px;font-weight:700}p{margin:16px 0}pre{margin:20px 0;background:#f1f5f9;padding:20px}button{padding:12px 18px;background:#245185;color:white;border-radius:8px}</style></head><body><div id="device-test-root"></div><script type="module" src="/\u005f\u005fbrowser-tests/real-device.js"></script></body></html>');
console.log(JSON.stringify({fixture:'/__browser-tests/real-device.html',mainBootstrapIncluded:false,physicalCameraRequestedOnlyOnClick:true,mediaPersisted:false}));
