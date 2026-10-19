import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'recovery/private');
const flags=new Map();for(let i=2;i<process.argv.length;i+=2)flags.set(process.argv[i],process.argv[i+1]);
const email=flags.get('--account'),project=flags.get('--project');
if(!email||!project||!/^[a-z][a-z0-9-]+$/.test(project))throw new Error('Use --account EMAIL --project PROJECT [--firebase-tools PACKAGE_DIRECTORY]. Recover function metadata first.');
const require=createRequire(import.meta.url);
const cli=flags.get('--firebase-tools')||process.env.FIREBASE_TOOLS_PACKAGE||path.dirname(require.resolve('firebase-tools/package.json'));
require(path.join(cli,'lib/logger.js')).logger.silent=true;
const auth=require(path.join(cli,'lib/auth.js'));
const account=auth.selectAccount(email,root);
if(account?.user?.email!==email||!account?.tokens?.refresh_token)throw new Error('Requested account is not authenticated in Firebase CLI.');
const token=await auth.getAccessToken(account.tokens.refresh_token,['email','openid','https://www.googleapis.com/auth/cloudplatformprojects.readonly','https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/firebase']);
const headers={Authorization:`Bearer ${token.access_token}`,Accept:'application/vnd.docker.distribution.manifest.v2+json,application/vnd.oci.image.manifest.v1+json'};
const functions=JSON.parse(await readFile(path.join(out,'functions/v1-metadata.json'),'utf8')).functions;
await mkdir(path.join(out,'images/layers'),{recursive:true});
const apps=new Map(),report=[];
for(const fn of functions){
 const id=fn.name.split('/').pop();
 const name=id.replace(/([a-z0-9])([A-Z])/g,'$1_$2').toLowerCase();
 if(!fn.name.startsWith(`projects/${project}/locations/`))throw new Error('Unexpected source project');
 const region=fn.name.split('/')[3];if(!/^[a-z]+-[a-z]+[0-9]+$/.test(region))throw new Error('Unexpected region');
 const repo=`${project}/gcf-artifacts/${name}`,tag=`version_${fn.versionId}`;
 const endpoint=`https://${region}-docker.pkg.dev/v2/${repo}`;
 const r=await fetch(`${endpoint}/manifests/${tag}`,{headers,redirect:'error',signal:AbortSignal.timeout(60000)});
 if(!r.ok){report.push({function:id,versionId:fn.versionId,status:r.status});console.log(id,r.status);continue;}
 const manifest=await r.json();
 const c=await fetch(`${endpoint}/blobs/${manifest.config.digest}`,{headers,signal:AbortSignal.timeout(60000)});
 if(!c.ok){report.push({function:id,versionId:fn.versionId,status:c.status});continue;}
 const config=await c.json();
 await writeFile(path.join(out,'images',`${name}-${tag}.manifest.json`),JSON.stringify({image:`${region}-docker.pkg.dev/${repo}:${tag}`,manifest},null,2));
 await writeFile(path.join(out,'images',`${name}-${tag}.config.json`),JSON.stringify(config,null,2));
 const lifecycle=JSON.parse(config.config.Labels['io.buildpacks.lifecycle.metadata']);
 for(const app of lifecycle.app||[]){
  const index=config.rootfs.diff_ids.indexOf(app.sha);
  if(index<0)throw new Error('Missing application layer');
  const layer=manifest.layers[index];
  if(!apps.has(app.sha)){
   if(layer.size>96*1024*1024)throw new Error('Application layer exceeds recovery cap');
   const b=await fetch(`${endpoint}/blobs/${layer.digest}`,{headers,signal:AbortSignal.timeout(120000)});
   if(!b.ok)throw new Error(`Layer download HTTP ${b.status}`);
   const bytes=Buffer.from(await b.arrayBuffer());
   if('sha256:'+createHash('sha256').update(bytes).digest('hex')!==layer.digest)throw new Error('Layer digest mismatch');
   const file=`images/layers/${layer.digest.slice(7)}.tar.gz`;
   await writeFile(path.join(out,file),bytes);apps.set(app.sha,{file,compressedSha:layer.digest,bytes:bytes.length});
  }
  report.push({function:id,versionId:fn.versionId,buildId:fn.buildId,appSha:app.sha,...apps.get(app.sha),status:'recovered'});
 }
 console.log(id,'application layer recovered');
}
await writeFile(path.join(out,'images/source-report.json'),JSON.stringify({functions:report},null,2));
console.log('Function images checked:',report.length,'unique app layers:',apps.size);
