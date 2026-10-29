import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {runOwnerArchiveProbe} from '../scripts/test-drive-owner-archive.mjs';
const credential={MCI_DRIVE_AUTH_MODE:'oauth',MCI_DRIVE_OAUTH_EXPECTED_EMAIL:'owner@example.test',MCI_DRIVE_ARCHIVE_FOLDER_ID:'synthetic-folder'};
function fixture({mutate=metadata=>metadata,corruptBytes=false,readError}={}){
 const calls=[],state={bytes:undefined,metadata:undefined};
 const drive={prepareArchive:async()=>({ready:true}),files:{
  create:async request=>{calls.push({operation:'create'});const chunks=[];for await(const chunk of request.media.body)chunks.push(chunk);state.bytes=Buffer.concat(chunks);state.metadata={id:'synthetic-created-id',...request.requestBody,size:String(state.bytes.length),md5Checksum:createHash('md5').update(state.bytes).digest('hex')};return {data:state.metadata};},
  get:async request=>{calls.push({operation:request.alt==='media'?'readback':'metadata',fileId:request.fileId});if(readError)throw readError;return {data:request.alt==='media'?(corruptBytes?Buffer.from('corrupt'):state.bytes):mutate({...state.metadata})};},
  delete:async request=>{calls.push({operation:'delete',fileId:request.fileId});},
 }};
 return {calls,state,driveFactory:()=>drive};
}

test('real archive probe runs recovered archival logic on synthetic memory and removes only its verified marked file',async()=>{
 const x=fixture();const report=await runOwnerArchiveProbe(credential,{driveFactory:x.driveFactory});
 assert.equal(report.result,'REAL_OWNER_DRIVE_ARCHIVE_PASSED');assert.equal(report.productionStorageReads,0);assert.equal(report.productionStorageDeletes,0);assert.equal(report.syntheticSourceReads,1);
 assert.deepEqual(x.calls.map(call=>call.operation),['create','metadata','readback','delete']);assert.equal(x.calls.at(-1).fileId,'synthetic-created-id');
 assert.equal(JSON.stringify(report).includes('synthetic-created-id'),false);assert.equal(JSON.stringify(report).includes('owner@example.test'),false);assert.ok(x.state.metadata.appProperties.mciRecoveryProbe);
});

test('different returned id, marker, parent or filename blocks removal of every Drive file',async()=>{
 for(const mutate of [m=>({...m,id:'different-id'}),m=>({...m,appProperties:{mciRecoveryProbe:'wrong-marker'}}),m=>({...m,parents:['other-folder']}),m=>({...m,name:'other-file.txt'})]){
  const x=fixture({mutate});await assert.rejects(runOwnerArchiveProbe(credential,{driveFactory:x.driveFactory}),/DRIVE_PROBE_CLEANUP_GUARD_REJECTED/);assert.equal(x.calls.filter(call=>call.operation==='delete').length,0);
 }
});

test('readback byte mismatch keeps the created test artifact instead of deleting an unverified file',async()=>{
 const x=fixture({corruptBytes:true});await assert.rejects(runOwnerArchiveProbe(credential,{driveFactory:x.driveFactory}),/DRIVE_PROBE_CLEANUP_GUARD_REJECTED/);assert.equal(x.calls.some(call=>call.operation==='delete'),false);
});

test('readback SDK errors are sanitized and do not trigger Drive deletion',async()=>{
 const x=fixture({readError:Error('Bearer synthetic-private-token')});await assert.rejects(runOwnerArchiveProbe(credential,{driveFactory:x.driveFactory}),error=>error.message==='DRIVE_PROBE_READBACK_FAILED'&&!error.stack.includes('synthetic-private-token'));assert.equal(x.calls.some(call=>call.operation==='delete'),false);
});

test('probe cannot fall back to service account credentials or an unidentified owner',async()=>{
 let created=false;for(const data of [{...credential,MCI_DRIVE_AUTH_MODE:'adc'},{...credential,MCI_DRIVE_OAUTH_EXPECTED_EMAIL:''}])await assert.rejects(runOwnerArchiveProbe(data,{driveFactory:()=>{created=true;}}),/OWNER_OAUTH_CREDENTIAL_REQUIRED/);assert.equal(created,false);
});

test('a lost create response leaves a private recovery intent and never permits any Drive deletion',async()=>{
 const x=fixture();const intents=[];let committed=false;
 const baseFactory=x.driveFactory;
 const driveFactory=()=>{const drive=baseFactory();drive.files.create=async request=>{assert.equal(intents.length,1);assert.equal(intents[0].id,null);assert.equal(intents[0].folderId,'synthetic-folder');assert.equal(intents[0].name,request.requestBody.name);assert.equal(intents[0].marker,request.requestBody.appProperties.mciRecoveryProbe);committed=true;throw Error('Response lost after Drive committed the file');};return drive;};
 await assert.rejects(runOwnerArchiveProbe(credential,{driveFactory,onArtifactIntent:async intent=>intents.push(intent),onArtifactCreated:async()=>assert.fail('A lost response cannot provide a file id')}),/DRIVE_PROBE_ARCHIVAL_FAILED/);
 assert.equal(committed,true);assert.equal(intents[0].createAttempted,true);assert.equal(x.calls.some(call=>call.operation==='delete'),false);
});
