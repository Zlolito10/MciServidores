import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {authenticateReleaseRequest,releaseRequestGuard,requireMasterProfile,canWriteAssignmentScope,normalizeCommandPayload,authorizeQueuedCommand,claimQueuedCommand,completeEmptyCommand}=require('../functions/lib/release-security.js');
const {inspectBackendReleaseEnvironment,archiveFunctionRuntimeOptions,DRIVE_OAUTH_SECRET_NAMES}=require('../functions/lib/backend-release.js');

function fixture({role='user',uid='signed-user',exists=true,rejectToken=false}={}){
 const calls=[];
 const auth={verifyIdToken:async(token,revoked)=>{calls.push({op:'bearer',revoked});if(rejectToken)throw Error('Bearer private-token-must-not-leak');return {uid};},verifySessionCookie:async(cookie,revoked)=>{calls.push({op:'session',revoked});return {uid};}};
 const db={collection:name=>{assert.equal(name,'users');return {doc:id=>{calls.push({op:'profile',id});return {get:async()=>({exists,data:()=>({role})})};}};}};
 return {auth,db,calls};
}
const request=(path='/api/notify/user',body={userId:'signed-user'},headers={authorization:'Bearer synthetic-token'})=>({method:'POST',path,body,headers});
async function guard(req,capability='notification',options={}){
 const x=fixture(options);let nextCalls=0;const res={locals:{},headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(value){this.body=value;return this;}};
 await releaseRequestGuard(x,capability)(req,res,()=>nextCalls++);return {...x,res,nextCalls};
}

test('notification HTTP guards reject anonymous requests before a handler can send',async()=>{
 const x=await guard(request('/api/notify/all',{title:'Blocked'},{}));assert.equal(x.res.statusCode,401);assert.equal(x.nextCalls,0);assert.deepEqual(x.calls,[]);assert.equal(x.res.headers['Cache-Control'],'private, no-store');
});
test('signed owner can test their own devices but cannot notify another account or broadcast',async()=>{
 const own=await guard(request());assert.equal(own.nextCalls,1);assert.deepEqual(own.calls[0],{op:'bearer',revoked:true});
 for(const req of [request('/api/notify/user',{userId:'other-user'}),request('/notify/users',{userIds:['signed-user']}),request('/api/notify/all',{}),request('/api/notify/repertoire',{eventId:'event'})]){
  const x=await guard(req);assert.equal(x.res.statusCode,403);assert.equal(x.nextCalls,0);
 }
});
test('all notification aliases permit a currently authorized administrator',async()=>{
 for(const prefix of ['', '/api'])for(const suffix of ['user','users','all','week','repertoire','materials']){
  const x=await guard(request(prefix+'/notify/'+suffix,{}),'notification',{role:'admin'});assert.equal(x.nextCalls,1,prefix+suffix);assert.equal(x.res.locals.uid,'signed-user');
 }
});
test('maintenance permits POST only and requires current master administrator role',async()=>{
 const get=await guard({...request('/fixStorageCors'),method:'GET'},'maintenance',{role:'master_admin'});assert.equal(get.res.statusCode,405);assert.equal(get.res.headers.Allow,'POST');assert.equal(get.calls.length,0);
 for(const role of ['user','admin','ministry_admin']){const x=await guard(request('/fixStorageCors'),'maintenance',{role});assert.equal(x.res.statusCode,403);assert.equal(x.nextCalls,0);}
 assert.equal((await guard(request('/backfillPendingUsers'),'maintenance',{role:'master_admin'})).nextCalls,1);
});
test('cookie mutations require verified session and matching CSRF, with malformed cookies rejected safely',async()=>{
 const valid={cookie:'__session=synthetic-session; XSRF-TOKEN=synthetic-xsrf; unrelated=one; unrelated=two; ignored=%zz','x-xsrf-token':'synthetic-xsrf'};
 const x=await guard(request('/api/notify/user',{userId:'signed-user'},valid));assert.equal(x.nextCalls,1);assert.deepEqual(x.calls[0],{op:'session',revoked:true});
 for(const headers of [{cookie:valid.cookie},{...valid,'x-xsrf-token':'other'},{cookie:'__session=%zz; XSRF-TOKEN=x','x-xsrf-token':'x'},{cookie:'__session=a; __session=b; XSRF-TOKEN=x','x-xsrf-token':'x'}]){
  const denied=await guard(request('/api/notify/user',{userId:'signed-user'},headers));assert.equal(denied.nextCalls,0);assert.ok([401,403].includes(denied.res.statusCode));
 }
});
test('invalid explicit bearer never falls back to a privileged cookie or exposes SDK messages',async()=>{
 const x=await guard(request('/api/notify/all',{}, {authorization:'Bearer synthetic-revoked-token',cookie:'__session=another-session'}),'notification',{role:'master_admin',rejectToken:true});
 assert.equal(x.res.statusCode,401);assert.deepEqual(x.res.body,{error:'UNAUTHENTICATED'});assert.equal(x.calls.some(c=>c.op==='session'),false);assert.equal(JSON.stringify(x.res).includes('private-token'),false);
});
test('missing profile and unavailable authorization deny sends even with a valid token',async()=>{
 assert.equal((await guard(request(),'notification',{exists:false})).res.statusCode,403);
 const x=fixture();x.db.collection=()=>{throw Error('private backend error');};await assert.rejects(authenticateReleaseRequest(request(),x),error=>error.code==='AUTHORIZATION_UNAVAILABLE'&&!error.message.includes('private'));
});
test('only master administrators can mutate user privileges or role definitions through the BFF',()=>{
 for(const role of ['user','admin','ministry_admin','master_admin']){
  let next=0;const res={locals:{role},status(n){this.statusCode=n;return this;},json(v){this.body=v;}};
  requireMasterProfile({},res,()=>next++);assert.equal(next,role==='master_admin'?1:0);if(!next)assert.equal(res.statusCode,403);
 }
 const source=readFileSync(new URL('../functions/src/index.ts',import.meta.url),'utf8');
 for(const [method,route] of [['put','/api/roles/:id'],['post','/api/roles'],['delete','/api/roles/:id'],['patch','/api/users/:id'],['delete','/api/users/:id']])assert.ok(source.includes(`app.${method}(\n  "${route}",\n  requireSession,\n  requireCsrf,\n  requireMasterProfile,`),method+route);
});
test('ministry assignment edits require both current and destination area ownership',()=>{
 const ministry={isAdmin:false,isMinistryRestricted:true,assignedMinistries:['owned-area']};
 assert.equal(canWriteAssignmentScope(ministry,undefined,'owned-area'),true);assert.equal(canWriteAssignmentScope(ministry,'owned-area','owned-area'),true);
 assert.equal(canWriteAssignmentScope(ministry,'other-area','owned-area'),false);assert.equal(canWriteAssignmentScope(ministry,'owned-area','other-area'),false);assert.equal(canWriteAssignmentScope(ministry,'','owned-area'),false);
 assert.equal(canWriteAssignmentScope({...ministry,isMinistryRestricted:false},undefined,'owned-area'),false);assert.equal(canWriteAssignmentScope({isAdmin:true},'other-area','owned-area'),true);
});

const replicate={type:'REPLICATE_ASSIGNMENTS',sourceEventId:'source-event',targetEventId:'target-event'};
test('all four real command schemas normalize an authenticated actor, including BFF assignment replication and restore eventId',()=>{
 for(const type of ['REPLICATE_ASSIGNMENTS','REPLICATE_REPERTOIRE','REPLICATE_MATERIALS'])assert.deepEqual(normalizeCommandPayload({...replicate,type,createdBy:'forged-other'},'signed-admin'),{type,createdBy:'signed-admin',status:'pending',sourceEventId:'source-event',targetEventId:'target-event'});
 assert.deepEqual(normalizeCommandPayload({type:'RESTORE_REPERTOIRE',eventId:'target',backupId:'backup',collection:'autoBackups'},'signed-admin'),{type:'RESTORE_REPERTOIRE',createdBy:'signed-admin',status:'pending',eventId:'target',backupId:'backup',collection:'autoBackups'});
});
test('command schema rejects traversal, arbitrary collections, unknown operations and pre-completed payloads',()=>{
 for(const payload of [{...replicate,type:'DELETE_ALL'},{...replicate,sourceEventId:'events/foreign'},{...replicate,targetEventId:'source-event'},{...replicate,status:'completed'},{...replicate,unexpected:'secret'},{type:'RESTORE_REPERTOIRE',eventId:'event',backupId:'backup',collection:'users'}])assert.throws(()=>normalizeCommandPayload(payload,'admin'));
 assert.throws(()=>normalizeCommandPayload(replicate,''),/COMMAND_ACTOR_REQUIRED/);
});
test('worker rejects absent or demoted authors independently of the client and rules',async()=>{
 const payload={...replicate,createdBy:'signed-user'};
 for(const options of [{role:'user'},{role:'ministry_admin'},{role:'admin',exists:false}])await assert.rejects(authorizeQueuedCommand(payload,fixture(options).db),/COMMAND_FORBIDDEN/);
 await assert.rejects(authorizeQueuedCommand(replicate,fixture({role:'master_admin'}).db),/COMMAND_ACTOR_REQUIRED/);
 assert.equal((await authorizeQueuedCommand(payload,fixture({role:'master_admin'}).db)).createdBy,'signed-user');
});
test('transactional command claim skips processing/completed/error deliveries and runs a pending command once',async()=>{
 let status='pending',writes=0;const ref={id:'same-command'};
 const db={runTransaction:async callback=>callback({get:async checked=>{assert.equal(checked,ref);return {exists:true,data:()=>({status})};},set:(_ref,patch,options)=>{assert.equal(options.merge,true);status=patch.status;writes++;}})};
 assert.equal(await claimQueuedCommand(db,ref,'synthetic-timestamp'),true);assert.equal(await claimQueuedCommand(db,ref,'second-delivery'),false);assert.equal(writes,1);
 for(const value of ['completed','error']){status=value;assert.equal(await claimQueuedCommand(db,ref,'duplicate'),false);}assert.equal(writes,1);
});
test('empty replicate and restore sources reach a terminal completed no-op without touching target documents',async()=>{
 const state={status:'processing'},writes=[];const ref={set:async(value,options)=>{writes.push({value,options});Object.assign(state,value);}};
 assert.equal(await completeEmptyCommand({empty:false},ref,'unused'),false);assert.equal(writes.length,0);
 assert.equal(await completeEmptyCommand({empty:true},ref,'synthetic-time'),true);assert.deepEqual(state,{status:'completed',result:'empty_source',sourceCount:0,processedAt:'synthetic-time'});assert.deepEqual(writes[0].options,{merge:true});
 const source=readFileSync(new URL('../functions/src/index.ts',import.meta.url),'utf8');assert.equal((source.match(/if \(await completeEmptyCommand\((?:sourceSnap|backupSnap), snap.ref, FieldValue.serverTimestamp\(\)\)\) return;/g)||[]).length,4);
});

const production={GCLOUD_PROJECT:'mcimachala-servidor',MCI_FIREBASE_WEB_API_KEY:'synthetic-public-key',MCI_DRIVE_AUTH_MODE:'oauth',MCI_DRIVE_OAUTH_CLIENT_ID:'synthetic-client',MCI_DRIVE_OAUTH_EXPECTED_EMAIL:'synthetic-owner@example.test',MCI_DRIVE_ARCHIVE_FOLDER_ID:'synthetic-folder'};
test('release preflight remains blocked without genuine external Drive evidence and secret bindings',()=>{
 const result=inspectBackendReleaseEnvironment(production);assert.equal(result.ready,false);assert.ok(result.checks.some(c=>c.id==='real-owner-drive-archive'&&c.status==='blocked'));assert.ok(result.checks.some(c=>c.id==='drive-secret-bindings'&&c.status==='blocked'));
});
test('release configuration checks return only redacted flags and cannot turn local emulator setup into production evidence',()=>{
 const options={boundSecrets:DRIVE_OAUTH_SECRET_NAMES,realOwnerArchiveVerified:true};assert.equal(inspectBackendReleaseEnvironment(production,options).ready,true);
 for(const overrides of [{GCLOUD_PROJECT:'demo-mci'},{GOOGLE_CLOUD_PROJECT:'other-project'},{FIREBASE_CONFIG:'invalid'},{FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099'},{FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080'},{FUNCTIONS_EMULATOR:'true'},{MCI_LOCAL_TEST_MODE:'1'},{MCI_DRIVE_OAUTH_EXPECTED_EMAIL:''}])assert.equal(inspectBackendReleaseEnvironment({...production,...overrides},options).ready,false);
 const serialized=JSON.stringify(inspectBackendReleaseEnvironment({...production,MCI_DRIVE_OAUTH_REFRESH_TOKEN:'synthetic-private-refresh'},options));assert.equal(serialized.includes('synthetic-'),false);assert.equal(serialized.includes('example.test'),false);
});
test('scheduler binds selected OAuth secrets explicitly, while ADC requires an independently verified shared drive',()=>{
 assert.deepEqual(archiveFunctionRuntimeOptions({MCI_DRIVE_AUTH_MODE:'oauth'}),{secrets:DRIVE_OAUTH_SECRET_NAMES});assert.deepEqual(archiveFunctionRuntimeOptions({MCI_DRIVE_AUTH_MODE:'adc'}),{});
 const adc={...production,MCI_DRIVE_AUTH_MODE:'adc',MCI_DRIVE_OAUTH_CLIENT_ID:undefined,MCI_DRIVE_OAUTH_EXPECTED_EMAIL:undefined};assert.equal(inspectBackendReleaseEnvironment(adc).ready,false);assert.equal(inspectBackendReleaseEnvironment(adc,{sharedDriveRuntimeVerified:true}).ready,true);
});
test('every recovered notification and maintenance export is wired through the reviewed authorization gate',()=>{
 const source=readFileSync(new URL('../functions/src/index.ts',import.meta.url),'utf8');
 for(const prefix of ['', '/api'])for(const kind of ['user','users','all','week','repertoire','materials'])assert.ok(source.includes(`app.post("${prefix}/notify/${kind}", requireNotificationActor,`));
 assert.equal((source.match(/return requireMaintenanceActor\(req, res, async \(\) =>/g)||[]).length,2);assert.ok(source.includes('functions.runWith(archiveFunctionRuntimeOptions()).pubsub'));assert.equal(source.includes('decodeJwtPayloadUnsafe'),false);
});
test('user directory requires a session and optional session routes are limited to the session probe and public metadata',()=>{
 const source=readFileSync(new URL('../functions/src/index.ts',import.meta.url),'utf8');
 const optional=[...source.matchAll(/app\.get\("([^"]+)", optionalSession,/g)].map(match=>match[1]).sort();
 assert.deepEqual(optional,['/api/me','/api/roles','/api/service_areas','/me']);
 const start=source.indexOf('app.get("/api/users", requireSession,');assert.ok(start>=0);
 const directory=source.slice(start,source.indexOf('// Users (self-service profile update)',start));
 assert.ok(directory.includes('"Cache-Control", "private, no-store"'));assert.ok(directory.includes('"Vary", "Cookie, Authorization"'));
});
