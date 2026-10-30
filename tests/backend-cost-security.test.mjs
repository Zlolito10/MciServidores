import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {userDirectoryEntry,sanitizeUserDirectory,syncUserDirectory,registerDeviceToken}=require('../functions/lib/user-directory.js');
const {createRequestCostGuard,consumeNotificationQuota,notificationQuotaGuard,allowedRequestOrigin}=require('../functions/lib/request-cost-guard.js');
const {historyFilters,userServiceHistory}=require('../functions/lib/service-history.js');

test('function discovery does not initialize image processing or the Drive SDK for unrelated endpoints',()=>{
 const result=spawnSync(process.execPath,['-e',`
 process.env.GCLOUD_PROJECT='demo-mci-servidores';
 process.env.FIREBASE_CONFIG=JSON.stringify({projectId:'demo-mci-servidores',storageBucket:'demo-mci-servidores.appspot.com'});
 process.env.MCI_LOCAL_TEST_MODE='1';
 const loaded=require('./functions/lib/index.js');
 const google=require.resolve('./functions/node_modules/googleapis');
 const sharp=require.resolve('./functions/node_modules/sharp');
 process.stdout.write(JSON.stringify({exports:Object.keys(loaded).length,googleLoaded:!!require.cache[google],sharpLoaded:!!require.cache[sharp]}));
 `],{cwd:new URL('..',import.meta.url),encoding:'utf8',timeout:20000});
 assert.equal(result.status,0,result.stderr);const inspected=JSON.parse(result.stdout);
 assert.equal(inspected.exports,30);assert.equal(inspected.googleLoaded,false);assert.equal(inspected.sharpLoaded,false);
});

function transactionFixture(initial={}) {
 const documents=new Map(Object.entries(initial));let writes=0;
 const ref=path=>({path});
 const db={collection:name=>({doc:id=>ref(name+'/'+id)}),runTransaction:async callback=>callback({
  get:async target=>({exists:documents.has(target.path),data:()=>documents.get(target.path)}),
  set:(target,data,options)=>{documents.set(target.path,options?.merge?{...documents.get(target.path),...data}:data);writes++;},
  delete:target=>{documents.delete(target.path);writes++;}
 })};
 return {db,documents,get writes(){return writes;}};
}

test('directory is an explicit bounded whitelist and never leaks complete profile fields',()=>{
 const profile={name:'Member',username:'member',role:'user',areas:['Music','Music',42],isAssigned:true,email:'private@example.test',preferences:{notifications:true},assignedMinistries:['private-id'],lastSeenPath:'/private',nested:{secret:true}};
 assert.deepEqual(userDirectoryEntry('member',profile),{id:'member',uid:'member',name:'Member',username:'member',role:'user',areas:['Music'],isAssigned:true});
 assert.equal(userDirectoryEntry('member',{name:'x'.repeat(400)}).name.length,200);
 assert.deepEqual(userDirectoryEntry('member',{ministryRoles:{Music:['singer','singer',42,{secret:'omit'}],Invalid:{permissions:['master_admin']}}}),{id:'member',uid:'member',ministryRoles:{Music:['singer']}});
 assert.deepEqual(sanitizeUserDirectory([null,{id:'bad/path',email:'private'},{id:'ok',name:'Safe',email:'private'}]),[{id:'ok',uid:'ok',name:'Safe'}]);
});

test('directory transaction replaces polluted projections, sanitizes cache and follows current source deletion',async()=>{
 const x=transactionFixture({'users/member':{name:'Current',email:'private'},'user_directory/member':{name:'Old',email:'must disappear'},'app_cache/user_directory':{items:[{id:'member',email:'private'},{id:'other',name:'Other',email:'private'}]}});
 await syncUserDirectory({db:x.db,userId:'member',timestamp:'time'});
 assert.deepEqual(x.documents.get('user_directory/member'),{id:'member',uid:'member',name:'Current'});
 assert.equal(JSON.stringify(x.documents.get('app_cache/user_directory')).includes('private'),false);
 const before=x.writes;await syncUserDirectory({db:x.db,userId:'member',timestamp:'next'});assert.equal(x.writes,before,'unchanged public fields do not write');
 x.documents.delete('users/member');await syncUserDirectory({db:x.db,userId:'member',timestamp:'delete'});
 assert.equal(x.documents.has('user_directory/member'),false);assert.deepEqual(x.documents.get('app_cache/user_directory').items.map(item=>item.id),['other']);
});

test('one projected user cannot create an incomplete aggregate cache',async()=>{
 const x=transactionFixture({'users/member':{name:'Current'}});
 await syncUserDirectory({db:x.db,userId:'member',timestamp:'time'});
 assert.equal(x.documents.has('user_directory/member'),true);assert.equal(x.documents.has('app_cache/user_directory'),false);
});

test('HTTP token registration deduplicates existing devices and rejects an eleventh device without changing them',async()=>{
 const tokens=Array.from({length:10},(_,i)=>'device-'+i);
 const x=transactionFixture({'userTokens/member':{tokens}});
 await registerDeviceToken(x.db,'member','device-0','now');assert.equal(x.documents.get('userTokens/member').tokens.length,10);
 const before=x.writes;await assert.rejects(registerDeviceToken(x.db,'member','eleventh','later'),error=>error.status===409&&error.message==='DEVICE_LIMIT_REACHED');
 assert.equal(x.writes,before);assert.deepEqual(x.documents.get('userTokens/member').tokens,tokens);
});

function response(){return {locals:{uid:'member'},headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(body){this.body=body;return this;}};}
test('password abuse is bounded before upstream Auth and valid traffic resumes when the bucket expires',()=>{
 let now=0;const guard=createRequestCostGuard({now:()=>now});let accepted=0;
 const req={method:'POST',path:'/api/passwordLogin',ip:'192.0.2.1',body:{username:' Member '}};
 for(let i=0;i<10;i++)guard(req,response(),()=>accepted++);
 const blocked=response();guard({...req,path:'/passwordLogin',body:{username:'member'}},blocked,()=>accepted++);
 assert.equal(accepted,10);assert.equal(blocked.statusCode,429);assert.equal(blocked.body.error,'RATE_LIMITED');assert.equal(blocked.headers['Retry-After'],'300');
 now=300000;guard(req,response(),()=>accepted++);assert.equal(accepted,11);
 const unaffected=response();guard({method:'GET',path:'/api/events',ip:req.ip},unaffected,()=>accepted++);assert.equal(accepted,12);
});

test('bounded limiter does not evict an active identity to admit an unbounded stream of new identities',()=>{
 const guard=createRequestCostGuard({now:()=>0,maximumBuckets:1});let accepted=0;
 guard({method:'POST',path:'/api/sessionLogin',ip:'192.0.2.1'},response(),()=>accepted++);
 const blocked=response();guard({method:'POST',path:'/api/sessionLogin',ip:'192.0.2.2'},blocked,()=>accepted++);
 assert.equal(accepted,1);assert.equal(blocked.statusCode,429);
});

test('notification quota is stored per actor across instances and does not expose raw identifiers',async()=>{
 const x=transactionFixture();
 for(let i=0;i<20;i++)assert.equal(await consumeNotificationQuota(x.db,'member',1000),0);
 const before=x.writes;assert.equal(await consumeNotificationQuota(x.db,'member',1001),59);assert.equal(x.writes,before);
 assert.equal(await consumeNotificationQuota(x.db,'other',1001),0);assert.equal(await consumeNotificationQuota(x.db,'member',60000),0);
 assert.equal([...x.documents.keys()].some(key=>key.includes('member')||key.includes('other')),false);
});

test('a quota storage failure denies sends with a safe retryable code',async()=>{
 const res=response();let next=false;await notificationQuotaGuard({collection(){throw Error('private storage message');}})({},res,()=>next=true);
 assert.equal(next,false);assert.equal(res.statusCode,503);assert.deepEqual(res.body,{error:'RATE_LIMIT_UNAVAILABLE'});
});

test('credentialed browser origins are exact, with local origins accepted only in the isolated demo runtime',()=>{
 for(const origin of ['https://mcimachala-servidor.web.app','https://mcimachala-servidor.firebaseapp.com',undefined])assert.equal(allowedRequestOrigin(origin),true);
 for(const origin of ['null','https://mcimachala-servidor.web.app.attacker.test','https://attacker.test','http://localhost:5176','https://user:pass@mcimachala-servidor.web.app','https://mcimachala-servidor.web.app/'])assert.equal(allowedRequestOrigin(origin),false);
 assert.equal(allowedRequestOrigin('http://127.0.0.1:5176',true),true);assert.equal(allowedRequestOrigin('http://localhost:5176',true),true);
 assert.equal(allowedRequestOrigin('https://custom.example.test',false,'https://custom.example.test'),true);
 assert.equal(allowedRequestOrigin('http://custom.example.test',false,'http://custom.example.test'),false);
});

test('history defaults to Ecuador current month, validates real dates and bounds all-time requests',()=>{
 assert.deepEqual(historyFilters({},Date.parse('2026-11-01T02:00:00Z')),{startDate:'2026-10-01',endDate:'2026-10-31',limit:50});
 assert.deepEqual(historyFilters({all:'1',limit:'200'}),{startDate:null,endDate:null,limit:200});
 for(const query of [{startDate:'2026-02-30'},{startDate:'2026-10-31',endDate:'2026-10-01'},{limit:201},{limit:0},{limit:'Infinity'}])assert.throws(()=>historyFilters(query),error=>error.status===400);
});

test('history queries assignments only for bounded selected events and the authenticated owner, including missing eventDate',async()=>{
 const calls=[];
 const event=(id,date,rows)=>({id,data:()=>({date,title:id,heavyPrivateField:'omit'}),ref:{collection:name=>{assert.equal(name,'assignments');return {where:(field,op,uid)=>{calls.push({id,field,op,uid});return {get:async()=>({empty:rows.length===0,docs:rows.map(([aid,data])=>({id:aid,data:()=>data}))})};}};}}});
 const docs=[event('recent','2026-10-20',[['legacy',{userId:'owner',checkInPhoto:'private-own.jpg'}]]),event('empty','2026-10-19',[]),event('not-fetched','2026-10-18',[])];
 const query={orderBy(field,order){calls.push({orderBy:field,order});return this;},where(field,op,value){calls.push({field,op,value});return this;},limit(value){assert.equal(value,3);return this;},get:async()=>({docs})};
 const db={collection:name=>{assert.equal(name,'events');return query;},collectionGroup(){throw Error('Unbounded collection group forbidden');}};
 const result=await userServiceHistory(db,'owner',{startDate:'2026-10-01',endDate:'2026-10-31',limit:'2'});
 assert.equal(result.hasMore,true);assert.equal(calls.filter(call=>call.uid==='owner').length,2);assert.equal(calls.some(call=>call.id==='not-fetched'),false);
 assert.deepEqual(result.assignments,[{userId:'owner',checkInPhoto:'private-own.jpg',id:'legacy',eventId:'recent'}]);assert.equal(result.events[0].heavyPrivateField,undefined);
});
