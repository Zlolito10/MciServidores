import {createHash} from 'node:crypto';
import {readFile,readdir,lstat,realpath} from 'node:fs/promises';
import path from 'node:path';
import {assertPublicAssetPath} from './frontend-build.mjs';

export const productionProject='mcimachala-servidor';
export const sha256=data=>createHash('sha256').update(data).digest('hex');
const fail=code=>Object.assign(new Error(code),{code});
const forbidden=relative=>{try{assertPublicAssetPath(relative);}catch{return true;}return relative.split('/').some(part=>/^(?:credentials|client_secret)/i.test(part)||/\.map$/i.test(part));};

export async function regularFiles(directory,prefix=''){
 const files=[];
 for(const item of await readdir(directory,{withFileTypes:true})){
  const name=prefix+item.name;
  if(item.isSymbolicLink())throw fail('SYMLINK_IN_RELEASE');
  if(item.isDirectory())files.push(...await regularFiles(path.join(directory,item.name),name+'/'));
  else if(item.isFile())files.push(name);
  else throw fail('SPECIAL_FILE_IN_RELEASE');
 }
 return files.sort();
}

export async function sourceDigest(root){
 const names=[];
 for(const folder of ['frontend','functions/src','scripts','tests','recovered/hosting','recovered/readable-assets']){
  let files;try{files=await regularFiles(path.join(root,folder));}catch(error){if(error.code==='ENOENT'&&folder.startsWith('recovered/'))continue;throw error;}
  names.push(...files.filter(file=>!file.split('/').some(part=>part==='__pycache__')&&!/\.py[co]$/.test(file)).map(file=>folder+'/'+file));
 }
 for(const file of ['package.json','package-lock.json','functions/package.json','functions/package-lock.json','functions/tsconfig.json','firebase.json','firebase.production.json','firebase.emulators.json','.firebaserc','.gitignore','.gitattributes','firestore.rules','storage.rules','firestore.indexes.json','recovered/hosting-inventory.json','recovered/functions-inventory.json']){
  try{await lstat(path.join(root,file));names.push(file);}catch(error){if(error.code!=='ENOENT')throw error;}
 }
 const digest=createHash('sha256');
 for(const name of names.sort())digest.update(name).update('\0').update(await readFile(path.join(root,name))).update('\0');
 return digest.digest('hex');
}

export async function backendBuildDigest(root){
 const digest=createHash('sha256'),directory=path.join(root,'functions/lib');
 for(const name of await regularFiles(directory))digest.update(name).update('\0').update(await readFile(path.join(directory,name))).update('\0');
 return digest.digest('hex');
}

export async function inspectProductionArtifact(root,{configFile='firebase.production.json',environment=process.env}={}){
 const checks=[];
 const check=(id,passed,detail)=>checks.push({id,passed,...(detail?{detail}: {})});
 try{
  if(!['firebase.json','firebase.production.json'].includes(configFile))throw fail('INVALID_FIREBASE_CONFIG_PATH');
  const config=JSON.parse(await readFile(path.join(root,configFile),'utf8'));
  const aliases=JSON.parse(await readFile(path.join(root,'.firebaserc'),'utf8'));
  check('expected-project',aliases.projects?.default===productionProject);
  check('actual-deployment-project',!environment.GCLOUD_PROJECT||environment.GCLOUD_PROJECT===productionProject);
  const publicPath=config.hosting?.public;
  if(typeof publicPath!=='string'||!/^dist(?:-[a-z0-9-]+)?$/.test(publicPath))throw fail('INVALID_HOSTING_PUBLIC_PATH');
  const directory=path.resolve(root,publicPath);
  if(await realpath(directory)!==directory)throw fail('SYMLINK_IN_RELEASE');
  const manifest=JSON.parse(await readFile(path.join(directory,'mci-release.json'),'utf8'));
  check('production-target',manifest.schemaVersion===1&&manifest.target==='production'&&manifest.projectId===productionProject&&manifest.emulators===false);
  check('production-worker',manifest.serviceWorkerEnabled===true);
  check('no-public-source-maps',manifest.sourceMaps===false);
  check('frontend-provenance',manifest.originalJsxRecovered===false&&manifest.sourceKind==='reconstructed-published-javascript');
  if(!Array.isArray(manifest.files)||manifest.files.length===0)throw fail('EMPTY_RELEASE_MANIFEST');
  const recorded=new Map();
  for(const file of manifest.files){
   if(typeof file.path!=='string'||file.path.startsWith('/')||file.path.includes('\\')||file.path.split('/').some(part=>!part||part==='.'||part==='..')||file.path==='mci-release.json'||recorded.has(file.path))throw fail('INVALID_MANIFEST_FILE_PATH');
   if(forbidden(file.path))throw fail('PRIVATE_OR_DEBUG_FILE_IN_RELEASE');
   recorded.set(file.path,file);
  }
  const actual=(await regularFiles(directory)).filter(name=>name!=='mci-release.json');
  check('worker-files-present',['registerSW.js','firebase-messaging-sw.js','firebase-messaging-logic.js','service-worker-config.js'].every(name=>recorded.has(name)));
  check('complete-public-file-list',actual.length===recorded.size&&actual.every(name=>recorded.has(name)));
  let hashesMatch=true;
  for(const name of actual){
   if(forbidden(name))throw fail('PRIVATE_OR_DEBUG_FILE_IN_RELEASE');
   const bytes=await readFile(path.join(directory,name)),expected=recorded.get(name);
   if(!expected||expected.bytes!==bytes.length||expected.sha256!==sha256(bytes))hashesMatch=false;
  }
  check('public-file-integrity',hashesMatch);
  check('entry-is-built',typeof manifest.entry==='string'&&manifest.entry.startsWith('app/')&&recorded.has(manifest.entry));
  if(recorded.has('index.html')){
   const html=await readFile(path.join(directory,'index.html'),'utf8');
   const markup=html.replace(/<!--[\s\S]*?-->/g,'');
   const scripts=[...markup.matchAll(/<script\b([^>]*)>/gi)].map(match=>match[1]);
   check('html-loads-current-entry',typeof manifest.entry==='string'&&scripts.some(attributes=>{
    const src=attributes.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    const type=attributes.match(/\btype\s*=\s*(["'])(.*?)\1/i)?.[2];
    return src==='/'+manifest.entry&&type==='module';
   }));
  }else check('html-loads-current-entry',false);
  const rewrites=config.hosting?.rewrites||[];
  check('api-and-spa-rewrites',['/api/**','/comments/**'].every(source=>rewrites.some(rule=>rule.source===source&&rule.function?.functionId==='serverApi'&&rule.function.region==='us-central1'))&&rewrites.at(-1)?.source==='**'&&rewrites.at(-1)?.destination==='/index.html');
  check('node22-functions',Array.isArray(config.functions)&&config.functions.length===1&&config.functions[0].runtime==='nodejs22'&&config.functions[0].source==='functions');
  return {status:checks.every(item=>item.passed)?'passed':'blocked',project:productionProject,configFile,publicPath,manifestSha256:sha256(await readFile(path.join(directory,'mci-release.json'))),publicFiles:actual.length+1,checks};
 }catch(error){
  check('artifact-inspection',false,error.code==='ENOENT'?'RELEASE_NOT_BUILT':/^[A-Z][A-Z0-9_]+$/.test(error.code||'')?error.code:'INVALID_RELEASE_ARTIFACT');
  return {status:'blocked',project:productionProject,configFile,checks};
 }
}

async function readReport(root,name){try{return JSON.parse(await readFile(path.join(root,name),'utf8'));}catch{return null;}}

export async function inspectProductionReadiness(root,options={}){
 const artifact=await inspectProductionArtifact(root,options),blockers=[];
 if(artifact.status!=='passed')blockers.push({id:'production-artifact',action:'Build and verify the production artifact.'});
 const local=await readReport(root,'recovery/production-validation.json');
 const currentDigest=await sourceDigest(root);
 let compiledDigest;try{compiledDigest=await backendBuildDigest(root);}catch{}
 const localValidationPassed=local?.status==='passed'&&local.sourceDigest===currentDigest&&!!compiledDigest&&local.backendBuildDigest===compiledDigest&&local.manifestSha256===artifact.manifestSha256&&Array.isArray(local.commands)&&['frontend-build','backend-build','node','python','emulator'].every(label=>local.commands.some(command=>command.label===label&&command.exitCode===0&&(label.endsWith('-build')||command.tests>0)))&&local.commands.every(command=>command.exitCode===0);
 if(!localValidationPassed)blockers.push({id:'current-local-validation',action:'Run npm run release:verify against the current sources and artifact.'});
 const drive=await readReport(root,'recovery/drive-owner-validation.json');
 if(drive?.result!=='REAL_OWNER_DRIVE_ARCHIVE_PASSED'||drive.downloadedSha256Matches!==true||drive.onlyCreatedProbeRemoved!==true)blockers.push({id:'real-owner-drive-archive',action:'Complete owner OAuth, select Respaldo MCI, save the protected credential and run the synthetic archive probe.'});
 const runtime=await readReport(root,'recovery/production-runtime-validation.json');
 if(runtime?.project!==productionProject||runtime.candidateConfigurationValidated!==true||runtime.secretReferencesVerified!==true||runtime.runtimeIdentityAccessVerified!==true||runtime.proposedMode!=='oauth')blockers.push({id:'production-runtime-configuration',action:'Validate the proposed OAuth runtime settings and bindings, existing Secret Manager references and runtime identity access before deployment; local DPAPI storage alone does not configure Cloud Functions.'});
 const storageIam=await readReport(root,'recovery/storage-rules-iam-validation.json');
 if(storageIam?.project!==productionProject||storageIam.crossServiceRoleBindingVerified!==true)blockers.push({id:'storage-rules-firestore-access',action:'Verify or authorize the Firebase Rules service agent role for the new Storage rules that consult Firestore.'});
 const notifications=await readReport(root,'recovery/fcm-device-validation.json');
 if(notifications?.backgroundNativeDisplayVerified!==true||notifications?.nativeClickVerified!==true)blockers.push({id:'background-notification-and-click',action:'Observe a real background notification and verify its click opens the intended same-origin page.'});
 const real=await readReport(root,'recovery/real-integrations-validation.json');
 if(real?.google?.realSignInSucceeded!==true||real?.google?.realSignOutSucceeded!==true)blockers.push({id:'real-google-auth',action:'Verify Google sign-in and sign-out using the intended provider.'});
 if(real?.camera?.physicalDevice!==true||!Number.isInteger(real?.camera?.captureCallbacks)||real.camera.captureCallbacks<1||real?.camera?.finalTrackState!=='ended')blockers.push({id:'physical-camera',action:'Verify camera capture and release of physical camera tracks.'});
 const privacy=await readReport(root,'recovery/production-privacy-validation.json');
 if(privacy?.project!==productionProject||privacy.candidatePrivacyTestsPassed!==true||privacy.migrationPlanValidated!==true||privacy.legacyTokenRotationPlanValidated!==true||privacy.rosterBackfillPlanValidated!==true)blockers.push({id:'attendance-privacy-migration',action:'Validate the bounded roster backfill and historical-token rotation plan, its rollback and rollout order; execute production mutations only in an authorized deployment.'});
 const external=await readReport(root,'recovery/production-external-validation.json');
 if(external?.physicalGpsVerified!==true)blockers.push({id:'physical-geolocation',action:'Verify location permission and the attendance flow on a real device.'});
 if(external?.schedulerDeliveryVerified!==true)blockers.push({id:'scheduler-delivery',action:'Verify the scheduled job delivery in an authorized isolated Cloud environment.'});
 return {schemaVersion:1,checkedAt:new Date().toISOString(),project:productionProject,status:blockers.length?'blocked':'ready',candidateStatus:artifact.status==='passed'&&localValidationPassed?'validated-locally':'pending-local-validation',readyToDeploy:blockers.length===0,productionDeploymentPerformed:false,sourceDigest:currentDigest,artifact,blockers};
}
