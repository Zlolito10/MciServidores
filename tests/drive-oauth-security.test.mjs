import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {randomUUID} from 'node:crypto';
import {readFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createDriveOAuthBootstrap} from '../scripts/drive-oauth-bootstrap.mjs';
import {createAuthorizationAttempt,consumePopupCode,persistOwnerCredentials,loadOwnerCredentials,assertPrivateCredentialPath} from '../scripts/lib/drive-oauth-flow.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const origin='http://localhost:5000';
const raw={origin,web:{client_id:'584384917166-synthetic.apps.googleusercontent.com',client_secret:'sensitive-test-client-secret',javascript_origins:[origin]},expectedOwnerEmail:'owner@example.test',folderId:'original-folder',projectNumber:'584384917166',publicApiKey:'synthetic-public-key',outputFile:'recovery/private/drive-oauth/synthetic-unused.dpapi.json'};
const tokens={access_token:'sensitive-test-access',refresh_token:'sensitive-test-refresh',id_token:'sensitive-test-id-token'};

async function fixture(t,{tokenOverrides={},payloadOverrides={},exchangeError,holdExchange,folderError,persistError}={}){
 const seen={exchanges:0,preflights:0,persists:0,exchangeOptions:[],persisted:null};
 class OAuth2{
  constructor(id,secret,redirect){assert.equal(id,raw.web.client_id);assert.equal(secret,raw.web.client_secret);assert.equal(redirect,origin);}
  setCredentials(){}
  async getToken(options){seen.exchanges++;seen.exchangeOptions.push(options);if(exchangeError)throw exchangeError;if(holdExchange)await holdExchange;return{tokens:{...tokens,...tokenOverrides}};}
  async getTokenInfo(value){assert.equal(value,tokens.access_token);return{aud:raw.web.client_id,expiry_date:Date.now()+3600000,scopes:['openid','email','https://www.googleapis.com/auth/drive.file']};}
  async verifyIdToken(options){assert.deepEqual(options,{idToken:tokens.id_token,audience:raw.web.client_id});return{getPayload:()=>({sub:'synthetic-subject',email:'owner@example.test',email_verified:true,...payloadOverrides})};}
  async getAccessToken(){return{token:tokens.access_token};}
 }
 const app=await createDriveOAuthBootstrap(raw,{workspace:root,google:{auth:{OAuth2}},archiveClient:(_,env)=>({prepareArchive:async folder=>{seen.preflights++;assert.equal(folder,raw.folderId);assert.equal(env.MCI_DRIVE_ARCHIVE_FOLDER_ID,raw.folderId);if(folderError)throw folderError;}}),persist:async(_filename,record)=>{seen.persists++;if(persistError)throw persistError;seen.persisted=record;return{saved:true,protection:'synthetic-test-protector'};}});
 await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));t.after(()=>app.close());const port=app.server.address().port;
 async function request(route,{method='GET',headers={},body}={}){return new Promise((resolve,reject)=>{const req=http.request({hostname:'127.0.0.1',port,path:route,method,agent:false,headers:{Host:'localhost:5000',...headers}},res=>{let text='';res.setEncoding('utf8');res.on('data',value=>text+=value);res.on('end',()=>{let data;try{data=JSON.parse(text);}catch{}resolve({status:res.statusCode,headers:res.headers,text,data});});});req.setTimeout(5000,()=>req.destroy(new Error('LOCAL_TEST_TIMEOUT')));req.on('error',reject);req.end(body);});}
 const page=await request('/');const cookie=page.headers['set-cookie'][0].split(';')[0];const status=await request('/api/status',{headers:{Cookie:cookie}});const csrf=status.data.csrfToken;
 const headers={Cookie:cookie,Origin:origin,'X-Requested-With':'XMLHttpRequest','X-MCI-CSRF':csrf,'Content-Type':'application/json'};
 const post=(route,body={},overrides={})=>request(route,{method:'POST',headers:{...headers,...overrides},body:JSON.stringify(body)});
 return{app,seen,page,cookie,status,headers,request,post};
}
function assertRedacted(response){for(const value of Object.values(tokens).concat(raw.web.client_secret,'sensitive-code'))assert.equal(response.text.includes(value),false);}

test('loopback bootstrap sets isolated HttpOnly cookie and never serializes credentials in landing/status',async t=>{
 const f=await fixture(t);assert.equal(f.page.status,200);assert.match(f.page.headers['set-cookie'][0],/HttpOnly; SameSite=Strict/);assert.equal(f.page.headers['referrer-policy'],'no-referrer');assert.equal(f.status.headers['cache-control'],'no-store');assertRedacted(f.page);assertRedacted(f.status);
 assert.equal((await f.request('/api/status')).status,400);assert.equal((await f.request('/api/status',{headers:{Cookie:f.cookie,Host:'evil.example'}})).status,400);assert.equal((await f.request('http://evil.example/api/status',{headers:{Cookie:f.cookie}})).status,400);assert.equal(f.seen.exchanges,0);
});

test('foreign origins, missing popup header, wrong nonce and duplicate cookies cannot start or exchange OAuth',async t=>{
 const f=await fixture(t);
 for(const route of ['/api/oauth/start','/api/oauth/code','/api/save','/api/picker-token'])for(const headers of [{Origin:'https://evil.example'},{'X-Requested-With':''},{'X-MCI-CSRF':'wrong'},{Cookie:''},{Cookie:f.cookie+'; '+f.cookie}]){const response=await f.post(route,{code:'sensitive-code',state:'wrong'},headers);assert.equal(response.status,400);assertRedacted(response);}
 assert.equal(f.seen.exchanges,0);assert.equal(f.seen.persists,0);
});

test('wrong state leaves the legitimate attempt usable while replay and concurrent callback cannot exchange twice',async t=>{
 let release;const blocked=new Promise(resolve=>release=resolve);const f=await fixture(t,{holdExchange:blocked});
 const attempt=(await f.post('/api/oauth/start')).data;assert.match(attempt.state,/^[A-Za-z0-9_-]{43}$/);
 assert.equal((await f.post('/api/oauth/code',{state:'wrong',code:'sensitive-code'})).data.error,'OAUTH_STATE_MISMATCH');
 const pending=f.post('/api/oauth/code',{state:attempt.state,code:'sensitive-code'});await new Promise(resolve=>setTimeout(resolve,20));
 const concurrent=await f.post('/api/oauth/code',{state:attempt.state,code:'sensitive-code'});assert.equal(concurrent.status,400);assert.equal(f.seen.exchanges,1);release();assert.equal((await pending).status,200);
 const replay=await f.post('/api/oauth/code',{state:attempt.state,code:'sensitive-code'});assert.equal(replay.status,400);assert.equal(f.seen.exchanges,1);assert.equal(f.seen.exchangeOptions[0].redirect_uri,origin);
});

test('expired authorization and malformed codes cannot consume or exchange a valid live code',()=>{
 const attempt=createAuthorizationAttempt({now:1000,lifetimeMs:2000});assert.throws(()=>consumePopupCode(attempt,{state:attempt.state,code:'sensitive-code'},{now:3000}),/EXPIRED/);
 const live=createAuthorizationAttempt({now:1000});for(const code of ['',null,'two words','line\ncode','x'.repeat(4097)])assert.throws(()=>consumePopupCode(live,{state:live.state,code},{now:1001}),/INVALID_AUTHORIZATION_CODE/);assert.equal(live.used,false);assert.equal(consumePopupCode(live,{state:live.state,code:'sensitive-code'},{now:1001}),'sensitive-code');assert.throws(()=>consumePopupCode(live,{state:live.state,code:'sensitive-code'},{now:1002}),/ALREADY_USED/);
});

test('malformed and oversized request bodies are bounded before exchanging or saving credentials',async t=>{
 const f=await fixture(t);for(const body of ['{','x'.repeat(17000)]){const response=await f.request('/api/oauth/code',{method:'POST',headers:f.headers,body});assert.equal(response.status,400);assertRedacted(response);}const form=await f.post('/api/oauth/start',{}, {'Content-Type':'application/x-www-form-urlencoded'});assert.equal(form.data.error,'JSON_REQUIRED');assert.equal(f.seen.exchanges,0);assert.equal(f.seen.persists,0);
});

test('wrong owner and missing offline refresh never expose a Picker token or persist a credential',async t=>{
 for(const options of [{payloadOverrides:{email:'another@example.test'}},{payloadOverrides:{email_verified:false}},{tokenOverrides:{refresh_token:undefined}}]){const f=await fixture(t,options);const start=(await f.post('/api/oauth/start')).data;const response=await f.post('/api/oauth/code',{state:start.state,code:'sensitive-code'});assert.equal(response.status,400);assertRedacted(response);assert.equal((await f.post('/api/picker-token')).status,400);assert.equal((await f.post('/api/save')).status,400);assert.equal(f.seen.preflights,0);assert.equal(f.seen.persists,0);}
});

test('a verified owner can save only after selecting the exact existing folder and passing runtime preflight',async t=>{
 const f=await fixture(t);const start=(await f.post('/api/oauth/start')).data;const code=await f.post('/api/oauth/code',{state:start.state,code:'sensitive-code'});assert.equal(code.status,200);assertRedacted(code);
 assert.equal((await f.post('/api/save')).status,400);assert.equal((await f.post('/api/folder',{folderId:'different-folder'})).status,400);assert.equal(f.seen.preflights,0);
 const picker=await f.post('/api/picker-token');assert.deepEqual(picker.data,{accessToken:tokens.access_token});assert.equal(picker.headers['cache-control'],'no-store');
 const folder=await f.post('/api/folder',{folderId:raw.folderId});assert.equal(folder.status,200);assert.equal(f.seen.preflights,1);assertRedacted(folder);
 const saved=await f.post('/api/save');assert.equal(saved.status,200);assertRedacted(saved);assert.equal(f.seen.persists,1);assert.equal(f.seen.persisted.MCI_DRIVE_ARCHIVE_FOLDER_ID,raw.folderId);assert.equal((await f.post('/api/picker-token')).status,400);assert.equal((await f.post('/api/oauth/start')).status,400);
});

test('SDK exception text containing credentials is sanitized and cannot enter HTTP evidence',async t=>{
 const f=await fixture(t,{exchangeError:new Error('Authorization Bearer '+tokens.access_token+' '+tokens.refresh_token)});const start=(await f.post('/api/oauth/start')).data;const response=await f.post('/api/oauth/code',{state:start.state,code:'sensitive-code'});assert.equal(response.data.error,'OAUTH_CODE_EXCHANGE_FAILED');assertRedacted(response);assert.equal(f.seen.persists,0);
});

test('credential output cannot escape the ignored private directory or overwrite another file',async()=>{
 for(const name of ['owner.json','functions/.env.local','recovery/private/../../outside.json'])await assert.rejects(assertPrivateCredentialPath(name,{root}),/CREDENTIAL_PATH_OUTSIDE_PRIVATE/);
});

test('Windows DPAPI performs a real protected synthetic credential roundtrip without plaintext at rest', {skip:process.platform!=='win32'},async()=>{
 const filename=path.join(root,'recovery/private','test-drive-oauth-'+randomUUID()+'.dpapi.json');const record={MCI_DRIVE_OAUTH_REFRESH_TOKEN:'sensitive-synthetic-roundtrip-refresh',MCI_DRIVE_OAUTH_CLIENT_SECRET:'sensitive-synthetic-roundtrip-secret'};
 try{const result=await persistOwnerCredentials(filename,record,{root});assert.equal(result.protection,'windows-dpapi-current-user');const bytes=await readFile(filename,'utf8');assert.equal(bytes.includes(record.MCI_DRIVE_OAUTH_REFRESH_TOKEN),false);assert.equal(bytes.includes(record.MCI_DRIVE_OAUTH_CLIENT_SECRET),false);assert.deepEqual(await loadOwnerCredentials(filename,{root}),record);await assert.rejects(persistOwnerCredentials(filename,record,{root}),error=>error.code==='EEXIST');}
 finally{if(path.dirname(filename)!==path.join(root,'recovery/private')||!path.basename(filename).startsWith('test-drive-oauth-'))throw Error('UNSAFE_SYNTHETIC_TEST_CLEANUP');await unlink(filename).catch(error=>{if(error.code!=='ENOENT')throw error;});}
});
