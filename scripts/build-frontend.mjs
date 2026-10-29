import {build} from 'esbuild';
import {cp,mkdir,readFile,writeFile,rm,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyHosting} from './verify.mjs';
import {buildServiceWorker} from './build-service-worker.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await verifyHosting();
const production=process.argv.includes('--production-services');
const pwaTest=process.argv.includes('--pwa-test');
const bff=process.argv.includes('--bff');
const outIndex=process.argv.indexOf('--out-dir');
const outDir=outIndex<0?'dist':process.argv[outIndex+1];
if(!/^dist(?:-[a-z0-9-]+)?$/.test(outDir||''))throw new Error('--out-dir must be dist or dist-NAME inside the project');
const flags={...(production?{}:{VITE_USE_EMULATORS:'1'}),...(bff?{VITE_ENABLE_BFF:'1',VITE_BFF_MODE:'1'}:{})};
const environment={emulators:!production,enableServiceWorker:production||pwaTest,flags,firebase:production?{
 apiKey:'AIzaSyCJFCaTuhu_Tz1kPVIsZBeWcLdxdTlED-Y',authDomain:'mcimachala-servidor.firebaseapp.com',projectId:'mcimachala-servidor',storageBucket:'mcimachala-servidor.firebasestorage.app',messagingSenderId:'584384917166',appId:'1:584384917166:web:bae42d13f0da36961dc73f',measurementId:'G-0TTT6RL85E',
}:{apiKey:'demo-mci-local-key',authDomain:'demo-mci-servidores.firebaseapp.com',projectId:'demo-mci-servidores',storageBucket:'demo-mci-servidores.appspot.com',messagingSenderId:'584384917166',appId:'1:584384917166:web:bae42d13f0da36961dc73f'}};
const destination=path.resolve(root,outDir);
if(destination!==path.join(root,outDir)||!destination.startsWith(root+path.sep))throw new Error('Unsafe build destination');
await rm(destination,{recursive:true,force:true});await mkdir(destination,{recursive:true});
// Published artifacts remain alongside new chunks for original preload lists.
await cp(path.join(root,'recovered/hosting'),destination,{recursive:true});
await cp(path.join(root,'frontend/styles/app.css'),path.join(destination,'assets/index-B05fqWAG.css'));
try{await access(path.join(root,'frontend/public'));await cp(path.join(root,'frontend/public'),destination,{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
const entryPoint='frontend/src/main.jsx';
const result=await build({absWorkingDir:root,entryPoints:[entryPoint],outdir:outDir+'/app',entryNames:'entry-[hash]',chunkNames:'[name]-[hash]',bundle:true,splitting:true,format:'esm',target:'es2022',sourcemap:true,metafile:true,legalComments:'linked',external:['node-fetch','util'],jsx:'automatic',jsxImportSource:'#mci',define:{__MCI_RECOVERY_ENV__:JSON.stringify(environment)},plugins:[{name:'mci-recovery-environment',setup(builder){
 builder.onResolve({filter:/^#mci\/jsx-runtime$/},()=>({path:path.join(root,'frontend/src/vendor/jsx-runtime.js')}));
 if(!production)builder.onLoad({filter:/\.(?:js|jsx)$/},async args=>{
 if(!args.path.startsWith(path.join(root,'frontend/src')))return;
 const original=await readFile(args.path,'utf8');
 const contents=original.replaceAll('https://us-central1-mcimachala-servidor.cloudfunctions.net/api','http://127.0.0.1:5001/demo-mci-servidores/us-central1/api');
 return {contents,loader:args.path.endsWith('.jsx')?'jsx':'js'};
 });
}}]});
const entry=Object.entries(result.metafile.outputs).find(([,value])=>value.entryPoint===entryPoint);
if(!entry)throw new Error('Missing reconstructed application entry');
let html=await readFile(path.join(root,'frontend/index.html'),'utf8');
html=html.replace('/assets/index-BU_ZgoWo.js','/'+path.posix.relative(outDir,entry[0]));
if(!environment.enableServiceWorker)html=html.replace(/<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/,'');
await writeFile(path.join(destination,'index.html'),html);
const pwa=await buildServiceWorker({destination});
await writeFile(path.join(root,'recovery/frontend-build'+(outDir==='dist'?'':'.'+outDir)+'.json'),JSON.stringify({environment:production?'production-services':'local-emulators',bff,entry:entry[0],moduleInputs:Object.keys(result.metafile.inputs).length,originalJsxRecovered:false,reconstructedJsx:true,rebuiltFromEditableRecoveredJavaScript:true,serviceWorker:{...pwa,automaticRegistration:environment.enableServiceWorker}},null,2)+'\n');
console.log(`Recompiled reconstructed JSX frontend (${production?'production services':'local emulators'}), ${pwa.assets} PWA assets.`);
