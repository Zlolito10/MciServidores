import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {createArchiveDriveClient}=require('../functions/lib/drive-archive.js');
const {archiveOldEventFiles}=require('../functions/lib/cleanup.js');
const perFile='https://www.googleapis.com/auth/drive.file';
const env={MCI_DRIVE_AUTH_MODE:'oauth',MCI_DRIVE_OAUTH_CLIENT_ID:'demo-client',MCI_DRIVE_OAUTH_CLIENT_SECRET:'synthetic-secret',MCI_DRIVE_OAUTH_REFRESH_TOKEN:'synthetic-refresh',MCI_DRIVE_OAUTH_EXPECTED_EMAIL:'owner@example.test'};
function fixture({refreshError,infoError,info={},aboutError,about={user:{emailAddress:'owner@example.test'},storageQuota:{limit:'100',usage:'1'}}}={}){
 const state={refreshes:0,tokenChecks:0,aboutReads:0,folderReads:0,writes:0};
 class OAuth2{setCredentials(){}async getAccessToken(){state.refreshes++;if(refreshError)throw refreshError;return {token:'synthetic-access'};}async getTokenInfo(token){assert.equal(token,'synthetic-access');state.tokenChecks++;if(infoError)throw infoError;return {aud:'demo-client',expiry_date:Date.now()+3600000,scopes:[perFile],...info};}}
 const drive={about:{get:async request=>{state.aboutReads++;assert.equal(request.fields,'user(emailAddress),storageQuota(limit,usage)');if(aboutError)throw aboutError;return {data:about};}},files:{get:async()=>{state.folderReads++;return {data:{mimeType:'application/vnd.google-apps.folder',capabilities:{canAddChildren:true}}};},create:async()=>{state.writes++;return {data:{id:'synthetic-upload'}};}}};
 return {state,drive:createArchiveDriveClient({auth:{OAuth2},drive:()=>drive},env)};
}

test('owner OAuth refresh, audience, write scope and Drive identity are verified once before folder access',async()=>{
 const x=fixture();const result=await x.drive.prepareArchive('folder');await x.drive.prepareArchive('folder');
 assert.deepEqual(result,{identity:'user-oauth',sharedDrive:false,canAddChildren:true,oauthRefreshVerified:true,ownerMatched:true,oauthScope:'per-file',quotaChecked:true});
 assert.deepEqual(x.state,{refreshes:1,tokenChecks:1,aboutReads:1,folderReads:1,writes:0});assert.equal(JSON.stringify(result).includes('owner@example.test'),false);assert.equal(JSON.stringify(result).includes('synthetic-'),false);
 const wider=fixture({info:{scopes:[perFile,'https://www.googleapis.com/auth/drive']}});assert.equal((await wider.drive.prepareArchive('folder')).oauthScope,'existing-all-drive-grant');
});

test('revoked refresh grants and token-info errors stop before folder or Storage reads with sanitized errors',async()=>{
 for(const options of [{refreshError:Error('invalid_grant synthetic-refresh')},{infoError:Error('Authorization Bearer synthetic-access')}]){
  const x=fixture(options);let listed=false;await assert.rejects(archiveOldEventFiles({drive:x.drive,folderId:'folder',bucket:{getFiles(){listed=true;}}}),error=>/^DRIVE_OAUTH_(REFRESH_FAILED|TOKEN_NOT_VERIFIED)$/.test(error.message)&&!error.stack.includes('synthetic-'));assert.equal(listed,false);assert.equal(x.state.folderReads,0);assert.equal(x.state.writes,0);
 }
});

test('wrong client audience, expired tokens and readonly grants cannot authorize Drive archival',async()=>{
 for(const info of [{aud:'other-client'},{expiry_date:Date.now()-1},{scopes:['https://www.googleapis.com/auth/drive.readonly']},{scopes:[]}]){
  const x=fixture({info});await assert.rejects(x.drive.prepareArchive('folder'),/DRIVE_OAUTH_(CLIENT_MISMATCH|TOKEN_EXPIRED|WRITE_SCOPE_MISSING)/);assert.equal(x.state.aboutReads,0);assert.equal(x.state.folderReads,0);
 }
});

test('wrong or unverifiable OAuth owner identity stops before accessing the archive folder',async()=>{
 for(const options of [{about:{user:{emailAddress:'other@example.test'}}},{about:{user:{}}},{aboutError:Error('private credential details')}]){const x=fixture(options);await assert.rejects(x.drive.prepareArchive('folder'),/DRIVE_OAUTH_(OWNER_MISMATCH|USER_NOT_VERIFIED)/);assert.equal(x.state.folderReads,0);assert.equal(x.state.writes,0);}
});

test('full personal quota blocks cleanup while unknown/unlimited quota does not invent a capacity error',async()=>{
 const exhausted=fixture({about:{user:{emailAddress:'owner@example.test'},storageQuota:{limit:'9007199254740993',usage:'9007199254740993'}}});await assert.rejects(exhausted.drive.prepareArchive('folder'),/DRIVE_OWNER_STORAGE_QUOTA_EXHAUSTED/);assert.equal(exhausted.state.folderReads,0);
 const unlimited=fixture({about:{user:{emailAddress:'owner@example.test'},storageQuota:{usage:'1'}}});assert.equal((await unlimited.drive.prepareArchive('folder')).quotaChecked,false);
});
