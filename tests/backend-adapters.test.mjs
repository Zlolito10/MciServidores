import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {Readable} from 'node:stream';
import {createHash} from 'node:crypto';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {isLocalDemoRuntime,passwordSignInUrl,normalizeLoginEmail,createRuntimeMessaging,createRuntimeDrive}=require('../functions/lib/runtime-services.js');
const {normalizeFcmData,getEcuadorDateString,parseLocalEcuadorDateTimeToUtcMs,shouldRunInWindow}=require('../functions/lib/notification-utils.js');
const {archiveOldEventFiles}=require('../functions/lib/cleanup.js');
const {boundedInteger,timestampMs}=require('../functions/lib/admin-read-routes.js');
const demo={GCLOUD_PROJECT:'demo-mci-servidores',FUNCTIONS_EMULATOR:'true',FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099',FIREBASE_STORAGE_EMULATOR_HOST:'127.0.0.1:9199'};

test('local adapters require both a demo project and loopback emulator configuration',()=>{
 assert.equal(isLocalDemoRuntime(demo),true);
 assert.equal(isLocalDemoRuntime({...demo,GCLOUD_PROJECT:'mcimachala-servidor'}),false);
 assert.equal(isLocalDemoRuntime({...demo,FUNCTIONS_EMULATOR:'false'}),false);
 assert.equal(isLocalDemoRuntime({...demo,FIRESTORE_EMULATOR_HOST:'external.example:8080'}),false);
});

test('password login targets the local emulator and never falls through when its host is missing',()=>{
 assert.match(passwordSignInUrl('',demo),/^http:\/\/127\.0\.0\.1:9099\//);
 assert.throws(()=>passwordSignInUrl('',{...demo,FIREBASE_AUTH_EMULATOR_HOST:undefined}),/AUTH_EMULATOR_NOT_CONFIGURED/);
 assert.throws(()=>passwordSignInUrl('',{}),/MISSING_MCI_FIREBASE_WEB_API_KEY/);
 assert.match(passwordSignInUrl('public-key',{}),/^https:\/\/identitytoolkit\.googleapis\.com/);
 assert.equal(normalizeLoginEmail('', ' Example '),'example@church.app');
 assert.equal(normalizeLoginEmail(' User@Example.COM ','ignored'),'user@example.com');
});

test('demo FCM records payloads and counts without storing registration tokens',async()=>{
 const rows=[];const admin={firestore:()=>({collection:()=>({add:async r=>rows.push(r)})}),messaging:()=>{throw Error('External FCM must not be used');}};
 const adapter=createRuntimeMessaging(admin,demo);
 const result=await adapter.sendEachForMulticast({tokens:['demo-token-one','demo-invalid:expired'],data:{title:'Test',body:'Local only'}});
 assert.equal(result.successCount,1);assert.equal(result.failureCount,1);
 assert.equal(rows[0].simulated,true);assert.equal(rows[0].tokenCount,2);
 assert.deepEqual(rows[0].message,{data:{title:'Test',body:'Local only'}});
 assert.equal(JSON.stringify(rows).includes('demo-token-one'),false);
 assert.equal(JSON.stringify(rows).includes('demo-invalid:'),false);
 assert.match(await adapter.send({topic:'fixture-topic',data:{type:'event_updated'}}),/^local-simulation-/);
 assert.equal(rows[1].operation,'send');
 await adapter.subscribeToTopic('demo-subscription-token','fixture-topic');
 await adapter.unsubscribeFromTopic(['demo-subscription-token'],'fixture-topic');
 assert.equal(rows[2].operation,'subscribe');assert.equal(rows[3].operation,'unsubscribe');
 assert.equal(JSON.stringify(rows).includes('demo-subscription-token'),false);
});

test('production FCM adapter delegates to the SDK instead of fabricating successes',()=>{
 const real={sentinel:true};assert.equal(createRuntimeMessaging({messaging:()=>real},{GCLOUD_PROJECT:'mcimachala-servidor'}),real);
});

test('demo Drive stores a recoverable archive before returning an id',async()=>{
 const saved=[],rows=[];
 const admin={storage:()=>({bucket:()=>({file:p=>({save:async bytes=>saved.push({p,bytes})})})}),firestore:()=>({collection:()=>({add:async r=>rows.push(r)})})};
 const adapter=createRuntimeDrive(admin,{},demo);
 const result=await adapter.files.create({requestBody:{name:'song.pdf'},media:{mimeType:'application/pdf',body:Readable.from([Buffer.from('fixture-content')])}});
 assert.match(result.data.id,/^local-drive-/);assert.equal(result.data.simulated,true);
 assert.equal(saved[0].bytes.toString(),'fixture-content');assert.ok(saved[0].p.startsWith('_local-drive-archive/'));
 assert.equal(rows[0].service,'drive');assert.equal(rows[0].bytes,15);assert.ok(rows[0].sha256);
 assert.throws(()=>createRuntimeDrive(admin,{}, {...demo,FIREBASE_STORAGE_EMULATOR_HOST:'external.example:9199'}),/STORAGE_EMULATOR_NOT_CONFIGURED/);
});

test('FCM payload normalization preserves strings and serializes structured values',()=>{
 assert.deepEqual(normalizeFcmData({text:'a',number:2,enabled:true,array:[1],object:{a:1},nil:null,none:undefined}),{text:'a',number:'2',enabled:'true',array:'[1]',object:'{"a":1}'});
});

test('attendance scheduler uses Ecuador local date and exact five-minute boundaries',()=>{
 assert.equal(getEcuadorDateString(0,Date.parse('2026-10-29T03:00:00Z')),'2026-10-28');
 assert.equal(parseLocalEcuadorDateTimeToUtcMs('2026-10-29','10:30'),Date.parse('2026-10-29T15:30:00Z'));
 assert.ok(Number.isNaN(parseLocalEcuadorDateTimeToUtcMs('2026-02-30','10:30')));
 assert.ok(Number.isNaN(parseLocalEcuadorDateTimeToUtcMs('2026-10-29','25:00')));
 assert.equal(shouldRunInWindow(100,100,200),true);assert.equal(shouldRunInWindow(200,100,200),false);
});

function file(name,{created='2026-10-01T00:00:00Z',failDelete=false}={}){return {name,deleted:false,getMetadata:async()=>[{timeCreated:created,contentType:'application/pdf',generation:'1'}],download:async()=>[Buffer.from('archive-me')],async delete(){if(failDelete)throw Error('delete failed');this.deleted=true;}};}
const quiet={info(){},warn(){}};

test('scheduled cleanup touches only old event files and archives before deleting',async()=>{
 const old=file('events/id/materials/song.pdf'),recent=file('events/id/new.pdf',{created:'2026-10-28T00:00:00Z'}),profile=file('profile-photos/id/photo.jpg');let archived=false;
 const drive={files:{create:async req=>{assert.equal(old.deleted,false);const chunks=[];for await(const b of req.media.body)chunks.push(b);const bytes=Buffer.concat(chunks);assert.equal(bytes.toString(),'archive-me');archived=true;return {data:{id:'archive-confirmed',size:String(bytes.length),md5Checksum:createHash('md5').update(bytes).digest('hex')}};}}};
 const result=await archiveOldEventFiles({bucket:{getFiles:async()=>[[old,recent,profile]]},drive,folderId:'fixture-folder',now:new Date('2026-10-29T00:00:00Z'),logger:quiet});
 assert.equal(archived,true);assert.equal(old.deleted,true);assert.equal(recent.deleted,false);assert.equal(profile.deleted,false);
 assert.deepEqual(result,{archived:1,deleted:1,skipped:2,errors:0});
});

test('scheduled cleanup preserves originals when Drive fails or returns no archive id',async()=>{
 for(const create of [async()=>{throw Error('Drive offline');},async()=>({data:{}})]){
  const old=file('events/id/song.pdf');const result=await archiveOldEventFiles({bucket:{getFiles:async()=>[[old]]},drive:{files:{create}},folderId:'fixture',now:new Date('2026-10-29T00:00:00Z'),logger:quiet});
  assert.equal(old.deleted,false);assert.equal(result.errors,1);assert.equal(result.archived,0);
 }
});

test('scheduled cleanup is inert without a configured archive folder',async()=>{
 const result=await archiveOldEventFiles({bucket:{getFiles:async()=>{throw Error('Must not list');}},drive:{},folderId:'YOUR_DRIVE_FOLDER_ID_HERE'});assert.deepEqual(result,{archived:0,deleted:0,skipped:0,errors:0});
});

test('admin report limits clamp and timestamps preserve actual observed values',()=>{
 assert.equal(boundedInteger('999999',200,500),500);assert.equal(boundedInteger('-2',200,500),1);assert.equal(boundedInteger('bad',200,500),200);
 assert.equal(timestampMs({_seconds:100}),100000);assert.equal(timestampMs({toMillis:()=>123}),123);assert.equal(timestampMs('bad'),0);
});

test('patched Google client UUID dependencies preserve their consumed CommonJS v4 interface',()=>{
 for(const dependency of ['google-gax','teeny-request']){
  const dependencyRequire=createRequire(require.resolve(dependency));const uuid=dependencyRequire('uuid');
  assert.equal(typeof uuid.v4,'function');assert.match(uuid.v4(),/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
 }
 const qs=require('qs');assert.deepEqual(qs.parse('filter[role]=user&tags[]=a&tags[]=b'),{filter:{role:'user'},tags:['a','b']});
});
