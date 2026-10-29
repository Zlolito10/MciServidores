import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {createArchiveDriveClient,archiveFolderId}=require('../functions/lib/drive-archive.js');
const {archiveOldEventFiles}=require('../functions/lib/cleanup.js');
function googleFixture({folder={id:'folder',mimeType:'application/vnd.google-apps.folder',capabilities:{canAddChildren:true}},email='test@demo.iam.gserviceaccount.com',getError}={}){
 const state={reads:0,writes:0,auth:undefined,oauthCredentials:undefined};
 class GoogleAuth{async getCredentials(){return {client_email:email};}}
 class OAuth2{constructor(id,secret){assert.equal(id,'demo-client');assert.equal(secret,'demo-secret');}setCredentials(credentials){state.oauthCredentials=credentials;}}
 const google={auth:{GoogleAuth,OAuth2},drive:options=>{state.auth=options.auth;return {files:{get:async request=>{state.reads++;assert.equal(request.supportsAllDrives,true);assert.equal(request.fields,'id,mimeType,trashed,driveId,capabilities(canAddChildren)');if(getError)throw getError;return {data:folder};},create:async()=>{state.writes++;return {data:{id:'created'}};}}};}};
 return {google,state};
}
const request={requestBody:{parents:['folder']},media:{body:Buffer.from('synthetic')}};
const oauth={MCI_DRIVE_AUTH_MODE:'oauth',MCI_DRIVE_OAUTH_CLIENT_ID:'demo-client',MCI_DRIVE_OAUTH_CLIENT_SECRET:'demo-secret',MCI_DRIVE_OAUTH_REFRESH_TOKEN:'demo-refresh-token'};

test('ADC service account refuses a shared personal folder before Storage listing or Drive creation',async()=>{
 const {google,state}=googleFixture();const drive=createArchiveDriveClient(google,{});let listed=false;
 await assert.rejects(archiveOldEventFiles({bucket:{getFiles(){listed=true;throw Error('Must not list');}},drive,folderId:'folder'}),/DRIVE_SERVICE_ACCOUNT_REQUIRES_SHARED_DRIVE/);
 assert.equal(listed,false);assert.equal(state.writes,0);assert.equal(state.reads,1);
 await assert.rejects(drive.files.create(request),/DRIVE_SERVICE_ACCOUNT_REQUIRES_SHARED_DRIVE/);assert.equal(state.writes,0);
});

test('ADC service account accepts a writable Shared Drive and caches preflight for this invocation',async()=>{
 const {google,state}=googleFixture({folder:{mimeType:'application/vnd.google-apps.folder',driveId:'shared-drive',capabilities:{canAddChildren:true}}});
 const drive=createArchiveDriveClient(google,{});assert.equal((await drive.prepareArchive('folder')).sharedDrive,true);
 await drive.files.create(request);await drive.files.create(request);assert.equal(state.reads,1);assert.equal(state.writes,2);
});

test('explicit user OAuth can archive into a writable personal folder using provided credentials only',async()=>{
 const {google,state}=googleFixture();const drive=createArchiveDriveClient(google,oauth);
 const readiness=await drive.prepareArchive('folder');assert.equal(readiness.identity,'user-oauth');assert.equal(readiness.sharedDrive,false);
 assert.deepEqual(state.oauthCredentials,{refresh_token:'demo-refresh-token'});await drive.files.create(request);assert.equal(state.writes,1);
 assert.equal(JSON.stringify(readiness).includes('demo-refresh-token'),false);
});

test('unknown auth modes, incomplete OAuth and unverified ADC identities fail closed',async()=>{
 const {google,state}=googleFixture({email:''});
 assert.throws(()=>createArchiveDriveClient(google,{MCI_DRIVE_AUTH_MODE:'unknown'}),/INVALID_DRIVE_AUTH_MODE/);
 assert.throws(()=>createArchiveDriveClient(google,{MCI_DRIVE_AUTH_MODE:'oauth'}),/DRIVE_OAUTH_CONFIGURATION_INCOMPLETE/);
 assert.throws(()=>createArchiveDriveClient(google,{MCI_DRIVE_OAUTH_REFRESH_TOKEN:'unused-demo'}),/DRIVE_OAUTH_MODE_NOT_ENABLED/);
 await assert.rejects(createArchiveDriveClient(google,{}).files.create(request),/DRIVE_ADC_IDENTITY_UNVERIFIED_USE_EXPLICIT_OAUTH/);assert.equal(state.writes,0);
});

test('trashed folders, nonfolders and denied write capabilities prevent Drive uploads',async()=>{
 for(const folder of [{mimeType:'application/pdf',capabilities:{canAddChildren:true}},{mimeType:'application/vnd.google-apps.folder',trashed:true,capabilities:{canAddChildren:true}},{mimeType:'application/vnd.google-apps.folder',capabilities:{canAddChildren:false}},{mimeType:'application/vnd.google-apps.folder'}]){
  const {google,state}=googleFixture({folder});await assert.rejects(createArchiveDriveClient(google,oauth).files.create(request),/DRIVE_ARCHIVE_(DESTINATION_INVALID|FOLDER_NOT_WRITABLE)/);assert.equal(state.writes,0);
 }
 const {google,state}=googleFixture({getError:Error('SDK Authorization: Bearer sensitive-demo-value')});
 await assert.rejects(createArchiveDriveClient(google,oauth).files.create(request),error=>error.message==='DRIVE_ARCHIVE_FOLDER_UNAVAILABLE'&&!error.stack.includes('sensitive-demo-value'));assert.equal(state.writes,0);
});

test('folder configuration accepts an explicit override and rejects URLs or missing parents',async()=>{
 assert.equal(archiveFolderId('fallback',{}),'fallback');assert.equal(archiveFolderId('fallback',{MCI_DRIVE_ARCHIVE_FOLDER_ID:'new-folder'}),'new-folder');
 assert.throws(()=>archiveFolderId('fallback',{MCI_DRIVE_ARCHIVE_FOLDER_ID:'https://drive.google.com/folder/id'}),/INVALID_DRIVE_ARCHIVE_FOLDER_ID/);
 const {google,state}=googleFixture();await assert.rejects(createArchiveDriveClient(google,oauth).files.create({requestBody:{}}),/DRIVE_ARCHIVE_PARENT_REQUIRED/);assert.equal(state.reads,0);assert.equal(state.writes,0);
});
