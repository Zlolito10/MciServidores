import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {archiveOldEventFiles}=require('../functions/lib/cleanup.js');
const {createRuntimeDrive}=require('../functions/lib/runtime-services.js');
const now=new Date('2026-10-29T00:00:00Z');
const logger={info(){},warn(){}};
function fixture({generation='9007199254740993',bytes=Buffer.from('original media')}={}) {
 let deleted=false,downloaded=false;const calls=[];
 const file={name:'events/local/material.pdf',getMetadata:async()=>[{timeCreated:'2026-10-01T00:00:00Z',generation,contentType:'application/pdf'}],download:async()=>{downloaded=true;return [bytes];},delete:async options=>{calls.push(options);deleted=true;}};
 const bucket={getFiles:async options=>{assert.deepEqual(options,{prefix:'events/'});return [[file]];}};
 return {file,bucket,bytes,calls,get deleted(){return deleted;},get downloaded(){return downloaded;}};
}
function confirmed(bytes){return {data:{id:'confirmed-archive',size:String(bytes.length),md5Checksum:createHash('md5').update(bytes).digest('hex')}};}

test('Drive archive requests shared-drive support and confirms bytes before a generation-guarded delete',async()=>{
 const x=fixture();let uploaded=false;
 const drive={files:{create:async request=>{
  assert.equal(x.deleted,false);assert.equal(request.supportsAllDrives,true);assert.equal(request.fields,'id,size,md5Checksum');
  const chunks=[];for await(const chunk of request.media.body)chunks.push(chunk);assert.deepEqual(Buffer.concat(chunks),x.bytes);uploaded=true;return confirmed(x.bytes);
 }}};
 assert.deepEqual(await archiveOldEventFiles({bucket:x.bucket,drive,folderId:'local-folder',now,logger}),{archived:1,deleted:1,skipped:0,errors:0});
 assert.equal(uploaded,true);assert.deepEqual(x.calls,[{ifGenerationMatch:'9007199254740993'}]);
});

test('Drive id alone, wrong size, missing checksum or wrong checksum never authorize deleting the source',async()=>{
 for(const data of [{id:'id-only'},{...confirmed(Buffer.from('other')).data},{...confirmed(Buffer.from('original media')).data,md5Checksum:undefined},{...confirmed(Buffer.from('original media')).data,md5Checksum:'0'.repeat(32)}]){
  const x=fixture();const result=await archiveOldEventFiles({bucket:x.bucket,drive:{files:{create:async()=>({data})}},folderId:'local-folder',now,logger});
  assert.equal(x.deleted,false);assert.deepEqual(result,{archived:0,deleted:0,skipped:0,errors:1});
 }
});

test('a replacement uploaded during archival survives the conditional Storage delete',async()=>{
 const x=fixture();let newerGeneration='9007199254740993';
 x.file.delete=async options=>{assert.notEqual(options.ifGenerationMatch,newerGeneration);throw Object.assign(Error('Precondition failed'),{code:412});};
 const drive={files:{create:async()=>{newerGeneration='9007199254740994';return confirmed(x.bytes);}}};
 const result=await archiveOldEventFiles({bucket:x.bucket,drive,folderId:'local-folder',now,logger});
 assert.equal(x.deleted,false);assert.deepEqual(result,{archived:1,deleted:0,skipped:0,errors:1});
});

test('the installed Storage SDK passes the full generation string into the delete request',async()=>{
 const {Storage}=require('@google-cloud/storage');const storage=new Storage({projectId:'demo-mci-servidores'});let observed;
 storage.request=(options,callback)=>{observed=options;callback(null,{}, {statusCode:204});};
 await storage.bucket('demo-only').file('events/test/material.pdf').delete({ifGenerationMatch:'9007199254740993'});
 assert.equal(observed.method,'DELETE');assert.equal(observed.qs.ifGenerationMatch,'9007199254740993');
});

test('missing Storage generation stops archival before downloading or uploading',async()=>{
 const x=fixture({generation:''});let uploaded=false;
 const result=await archiveOldEventFiles({bucket:x.bucket,drive:{files:{create:async()=>{uploaded=true;return confirmed(x.bytes);}}},folderId:'local-folder',now,logger});
 assert.equal(uploaded,false);assert.equal(x.downloaded,false);assert.equal(x.deleted,false);assert.equal(result.errors,1);
});

test('invalid archive windows cannot start listing Storage files',async()=>{
 for(const options of [{now:new Date('invalid')},{maxAgeDays:0},{maxAgeDays:-1},{maxAgeDays:Infinity}])await assert.rejects(archiveOldEventFiles({bucket:{getFiles(){throw Error('Must not list');}},drive:{},folderId:'local-folder',logger,...options}),/INVALID_ARCHIVE_AGE_WINDOW/);
});

test('demo Drive outbox failure preserves source even after the archive bytes were stored',async()=>{
 const x=fixture();const copies=[];
 const admin={storage:()=>({bucket:()=>({file:()=>({save:async bytes=>copies.push(bytes)})})}),firestore:()=>({collection:()=>({add:async()=>{throw Error('Outbox unavailable');}})})};
 const demo={GCLOUD_PROJECT:'demo-mci-servidores',FUNCTIONS_EMULATOR:'true',FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080',FIREBASE_STORAGE_EMULATOR_HOST:'127.0.0.1:9199'};
 const result=await archiveOldEventFiles({bucket:x.bucket,drive:createRuntimeDrive(admin,{},demo),folderId:'local-folder',now,logger});
 assert.equal(copies.length,1);assert.deepEqual(copies[0],x.bytes);assert.equal(x.deleted,false);assert.equal(result.errors,1);
});
