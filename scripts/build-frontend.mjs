import {build} from 'esbuild';
import {cp,mkdir,readFile,writeFile,readdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyHosting} from './verify.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await verifyHosting();
const production=process.argv.includes('--production-services');
const environment={emulators:!production,flags:production?{}:{VITE_USE_EMULATORS:'1'},firebase:production?{
 apiKey:'AIzaSyCJFCaTuhu_Tz1kPVIsZBeWcLdxdTlED-Y',authDomain:'mcimachala-servidor.firebaseapp.com',projectId:'mcimachala-servidor',storageBucket:'mcimachala-servidor.firebasestorage.app',messagingSenderId:'584384917166',appId:'1:584384917166:web:bae42d13f0da36961dc73f',measurementId:'G-0TTT6RL85E',
}:{apiKey:'demo-mci-local-key',authDomain:'demo-mci-servidores.firebaseapp.com',projectId:'demo-mci-servidores',storageBucket:'demo-mci-servidores.appspot.com',messagingSenderId:'584384917166',appId:'1:584384917166:web:bae42d13f0da36961dc73f'}};
const dest=path.join(root,'dist');
if(!dest.startsWith(root+path.sep))throw new Error('Unsafe build destination');
await rm(dest,{recursive:true,force:true});await mkdir(dest,{recursive:true});
await cp(path.join(root,'recovered/hosting'),dest,{recursive:true});
await cp(path.join(root,'frontend/styles/app.css'),path.join(dest,'assets/index-B05fqWAG.css'));
const result=await build({absWorkingDir:root,entryPoints:['frontend/src/index-BU_ZgoWo.js'],outdir:'dist/app',entryNames:'entry-[hash]',chunkNames:'[name]-[hash]',bundle:true,splitting:true,format:'esm',target:'es2022',sourcemap:true,metafile:true,legalComments:'linked',external:['node-fetch','util'],define:{__MCI_RECOVERY_ENV__:JSON.stringify(environment)},plugins:[{name:'local-functions-origins',setup(builder){if(!production)builder.onLoad({filter:/\.js$/},async args=>{
 if(!args.path.startsWith(path.join(root,'frontend/src')))return;
 let contents=await readFile(args.path,'utf8');
 contents=contents.replaceAll('https://us-central1-mcimachala-servidor.cloudfunctions.net/api','http://127.0.0.1:5001/demo-mci-servidores/us-central1/api');
 return {contents,loader:'js'};
});}}]});
const entry=Object.entries(result.metafile.outputs).find(([,v])=>v.entryPoint==='frontend/src/index-BU_ZgoWo.js');
if(!entry)throw new Error('Missing compiled entry');
let html=await readFile(path.join(root,'frontend/index.html'),'utf8');
html=html.replace('/assets/index-BU_ZgoWo.js','/'+entry[0].replace(/^dist\//,''));
if(!production)html=html.replace(/<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/,'');
await writeFile(path.join(dest,'index.html'),html);
await mkdir(path.join(root,'recovery'),{recursive:true});
await writeFile(path.join(root,'recovery/frontend-build.json'),JSON.stringify({environment:production?'production-services':'local-emulators',entry:entry[0],moduleInputs:Object.keys(result.metafile.inputs).length,originalJsxRecovered:false,rebuiltFromEditableRecoveredJavaScript:true},null,2)+'\n');
console.log(`Frontend recompiled from editable recovered JavaScript (${production?'production services':'local emulators'}).`);
