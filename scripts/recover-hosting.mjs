import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(await readFile(path.join(root,'recovery/private/hosting/files.json'),'utf8'));
const origin='https://mcimachala-servidor.web.app';
const records=[];
for(const item of manifest.files){
 const segments=item.path.slice(1).split('/');
 if(segments.some(s=>!s||s==='.'||s==='..'||s.includes('\\')))throw new Error('Unsafe Hosting path');
 // Firebase owns /__ routes; retain responses as evidence, outside the app tree.
 const reserved=item.path.startsWith('/__/');
 const target=path.join(root,reserved?'recovery/private/reserved-hosting':'recovered/hosting',...segments);
 const response=await fetch(origin+item.path,{redirect:'error',signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw new Error(`Hosting HTTP ${response.status}: ${item.path}`);
 const data=Buffer.from(await response.arrayBuffer());
 if(!item.path.endsWith('.html')&&/^\s*(?:<!doctype html|<html)/i.test(data.toString('utf8',0,100)))throw new Error('Rejected HTML fallback: '+item.path);
 await mkdir(path.dirname(target),{recursive:true});await writeFile(target,data);
 if(!reserved)records.push({url:origin+item.path,path:item.path,status:200,content_type:response.headers.get('content-type'),bytes:data.length,local:'hosting'+item.path,sha256:createHash('sha256').update(data).digest('hex'),hostingUploadHash:item.hash});
}
await writeFile(path.join(root,'recovered/hosting-inventory.json'),JSON.stringify(records,null,2)+'\n');
console.log('Recovered public app files:',records.length,'reserved Firebase responses:',manifest.files.length-records.length);
