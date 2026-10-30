import {build} from 'esbuild';
import {mkdtemp,readFile,writeFile,rm,access,lstat,rename,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyHosting} from './verify.mjs';
import {buildServiceWorker} from './build-service-worker.mjs';
import {parseFrontendBuildArgs,frontendEnvironment,copyPublicAssets,frontendReleaseManifest} from './lib/frontend-build.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await verifyHosting();
const options=parseFrontendBuildArgs(process.argv.slice(2));
const {production,bff,outDir}=options;
const environment=frontendEnvironment(options);
const sourceMaps=!production;
const destination=path.resolve(root,outDir);
if(destination!==path.join(root,outDir)||!destination.startsWith(root+path.sep))throw new Error('Unsafe build destination');
try{const info=await lstat(destination);if(info.isSymbolicLink()||!info.isDirectory())throw new Error('Build destination must be a regular directory');}catch(error){if(error.code!=='ENOENT')throw error;}
// An unsuccessful build must not replace the previous artifact or its manifest.
const staging=await mkdtemp(path.join(root,'.dist-staging-'));
try{
// Keep the recovered static resources. Current chunks replace the published JS;
// the immutable Hosting snapshot is retained separately in recovered/hosting.
await copyPublicAssets(path.join(root,'recovered/hosting'),staging,{omitSourceMaps:production,omitPublishedModules:true});
const cssBytes=await readFile(path.join(root,'frontend/styles/app.css'));
const cssRelative='assets/app-'+createHash('sha256').update(cssBytes).digest('hex').slice(0,12)+'.css';
await mkdir(path.join(staging,'assets'),{recursive:true});
await writeFile(path.join(staging,cssRelative),cssBytes);
try{await access(path.join(root,'frontend/public'));await copyPublicAssets(path.join(root,'frontend/public'),staging,{omitSourceMaps:production});}catch(error){if(error.code!=='ENOENT')throw error;}
const entryPoint='frontend/src/main.jsx';
const result=await build({absWorkingDir:root,entryPoints:[entryPoint],outdir:path.join(staging,'app'),entryNames:'entry-[hash]',chunkNames:'[name]-[hash]',bundle:true,splitting:true,format:'esm',target:'es2022',minifySyntax:production,minifyWhitespace:production,sourcemap:sourceMaps,metafile:true,legalComments:'linked',external:['node-fetch','util'],jsx:'automatic',jsxImportSource:'#mci',define:{__MCI_RECOVERY_ENV__:JSON.stringify(environment)},plugins:[{name:'mci-recovery-environment',setup(builder){
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
const entryRelative=path.relative(staging,path.resolve(root,entry[0])).replaceAll(path.sep,'/');
if(entryRelative.startsWith('../')||path.isAbsolute(entryRelative))throw new Error('Entry outside build staging');
let html=await readFile(path.join(root,'frontend/index.html'),'utf8');
if(!html.includes('/assets/index-BU_ZgoWo.js'))throw new Error('Missing published entry placeholder');
html=html.replace('/assets/index-BU_ZgoWo.js','/'+entryRelative);
html=html.replace('/assets/index-B05fqWAG.css','/'+cssRelative);
if(!environment.enableServiceWorker)html=html.replace(/<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/,'');
await writeFile(path.join(staging,'index.html'),html);
const outputByPath=new Map(Object.entries(result.metafile.outputs).map(([filename,metadata])=>[path.resolve(root,filename),metadata]));
const critical=new Set();
function visitStaticOutput(filename){
 const absolute=path.resolve(root,filename);
 if(critical.has(absolute))return;
 const metadata=outputByPath.get(absolute);
 if(!metadata)throw new Error('Missing static chunk in build graph');
 critical.add(absolute);
 for(const imported of metadata.imports||[]){
  if(imported.external||imported.kind==='dynamic-import')continue;
  const resolved=outputByPath.has(path.resolve(root,imported.path))?path.resolve(root,imported.path):path.resolve(path.dirname(absolute),imported.path);
  visitStaticOutput(resolved);
 }
 if(metadata.cssBundle)visitStaticOutput(metadata.cssBundle);
}
visitStaticOutput(entry[0]);
// The application module is bootstrap, even though the published entry loads it
// dynamically. Offline navigation needs this shell; its lazy pages stay deferred.
for(const [filename,metadata]of Object.entries(result.metafile.outputs))if(metadata.entryPoint==='frontend/src/app/App.jsx')visitStaticOutput(filename);
const pwa=await buildServiceWorker({destination:staging,criticalAssets:['/'+cssRelative,...[...critical].map(filename=>'/'+path.relative(staging,filename).replaceAll(path.sep,'/'))]});
const manifest=await frontendReleaseManifest(staging,{environment,bff,entry:entryRelative,sourceMaps});
await writeFile(path.join(staging,'mci-release.json'),JSON.stringify(manifest,null,2)+'\n');
// Validate the final absolute target again before the only recursive replacement.
if(path.dirname(destination)!==root||!/^dist(?:-[a-z0-9-]+)?$/.test(path.basename(destination)))throw new Error('Unsafe build replacement');
try{const info=await lstat(destination);if(info.isSymbolicLink()||!info.isDirectory())throw new Error('Unsafe build replacement target');}catch(error){if(error.code!=='ENOENT')throw error;}
await rm(destination,{recursive:true,force:true});
await rename(staging,destination);
await writeFile(path.join(root,'recovery/frontend-build'+(outDir==='dist'?'':'.'+outDir)+'.json'),JSON.stringify({environment:production?'production-services':'local-emulators',bff,entry:outDir+'/'+entryRelative,moduleInputs:Object.keys(result.metafile.inputs).length,originalJsxRecovered:false,reconstructedJsx:true,rebuiltFromEditableRecoveredJavaScript:true,sourceMaps,releaseManifest:'mci-release.json',serviceWorker:{...pwa,automaticRegistration:environment.enableServiceWorker}},null,2)+'\n');
console.log(`Recompiled reconstructed JSX frontend (${production?'production services':'local emulators'}), ${pwa.assets} PWA assets.`);
}finally{
 if(path.dirname(staging)!==root||!path.basename(staging).startsWith('.dist-staging-'))throw new Error('Unsafe staging cleanup');
 await rm(staging,{recursive:true,force:true});
}
