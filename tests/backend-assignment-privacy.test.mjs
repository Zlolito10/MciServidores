import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {PassThrough,Readable} from 'node:stream';
import {once} from 'node:events';
import {readFileSync} from 'node:fs';
import {backfillAssignmentRoster,assertRosterDemoTarget} from '../scripts/backfill-assignment-roster.mjs';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {Timestamp}=require('firebase-admin/firestore');
const {ROSTER_FIELDS,assignmentActorContext,publicAssignmentRoster,assignmentForActor,syncAssignmentRoster,servePrivateAttendance}=require('../functions/lib/assignment-roster.js');
const {releaseReadRequestGuard}=require('../functions/lib/release-security.js');
const sensitive={userId:'owner',areaId:'music',roleName:'Servidor',attendanceStatus:'present',checkInPhoto:'https://private.example/photo?token=private-token',checkOutPhoto:'attendance/event/assignment/out.jpg',checkInLocation:{lat:-3,lng:-79},checkOutLocation:{lat:-4,lng:-78},notes:'Private notes',checkInTime:'2026-10-29T10:00:00Z'};

test('roster preserves scheduling labels and valid timestamps while excluding every attendance/private field',()=>{
 const createdAt=Timestamp.fromMillis(1234),data={...sensitive,eventId:'forged-event',id:'forged-id',roleId:'role-real',status:'assigned',createdAt,updatedAt:'2026-10-29T01:02:03Z'};
 const projected=publicAssignmentRoster(data,'real-event');assert.deepEqual(Object.keys(projected).sort(),[...ROSTER_FIELDS].sort());assert.equal(projected.eventId,'real-event');assert.equal(projected.roleName,'Servidor');assert.equal(projected.roleId,'role-real');assert.equal(projected.createdAt,createdAt);assert.equal(projected.updatedAt,'2026-10-29T01:02:03.000Z');
 assert.equal(JSON.stringify(projected).includes('private-token'),false);for(const key of ['attendanceStatus','checkInTime','notes','id','checkInLocation','checkOutLocation','checkInPhoto','checkOutPhoto'])assert.equal(key in projected,false,key);
 assert.equal(publicAssignmentRoster({roleName:'Rol legado'},'event').roleId,undefined);
});
test('roster rejects object values hidden inside whitelisted keys and invalid labels/timestamps',()=>{
 const projected=publicAssignmentRoster({userId:{lat:1},areaId:'wrong/area',roleId:['token'],roleName:'a'.repeat(121),status:{photo:'private'},createdAt:{seconds:1,token:'private'},updatedAt:'2026-not-a-date'},'event');assert.deepEqual(projected,{eventId:'event'});
 assert.equal(publicAssignmentRoster({roleName:'invalid\nlabel',status:'https://private.example'},'event').roleName,undefined);assert.throws(()=>publicAssignmentRoster({},'event/other'),/INVALID_ASSIGNMENT_PATH/);
});
test('full assignment policy matches owner, administrator and exact manager area, including contradictory scoped-role arrays',()=>{
 for(const [profile,uid,full] of [[{role:'user'},'owner',true],[{role:'user'},'other',false],[{role:'admin'},'other',true],[{role:'master_admin'},'other',true],[{role:'ministry_admin_music',assignedMinistries:['other-area']},'manager',true],[{role:'ministry_subadmin_other-area',assignedMinistries:['music']},'manager',false],[{role:'ministry_admin',assignedMinistries:['music']},'manager',true],[{role:'ministry_subadmin',assignedMinistries:['other-area'],areas:['music']},'manager',false]]){
  const result=assignmentForActor({...sensitive,id:'spoof',eventId:'spoof'},'real-assignment','real-event',assignmentActorContext(profile,uid));assert.equal('checkInLocation' in result,full,JSON.stringify(profile));assert.equal(result.id,'real-assignment');assert.equal(result.eventId,'real-event');
 }
 assert.deepEqual(assignmentActorContext({role:'user',assignedMinistries:['music']},'other').assignedMinistries,[]);
});

function database(initial={}){
 const records=new Map(Object.entries(initial));const writes=[];
 const db={doc:path=>({path}),runTransaction:async callback=>callback({get:async ref=>({exists:records.has(ref.path),data:()=>records.get(ref.path)}),set:(ref,data,options)=>{writes.push({operation:'set',path:ref.path,data,options});records.set(ref.path,data);},delete:ref=>{writes.push({operation:'delete',path:ref.path});records.delete(ref.path);}}),collectionGroup:name=>{
  assert.equal(name,'assignments');let max=100,after='';const query={orderBy(){return query;},limit(n){max=n;return query;},startAfter(doc){after=doc.ref.path;return query;},async get(){const docs=[...records.keys()].filter(path=>path.includes('/assignments/')&&path>after).sort().slice(0,max).map(path=>({ref:{path},data:()=>records.get(path)}));return {empty:!docs.length,docs};}};return query;
 }};return {db,records,writes};
}
test('projection sync reads current data and replaces on reassignment, removing stale and private fields',async()=>{
 const source='events/event/assignments/assignment',target='events/event/assignment_roster/assignment';const x=database({[source]:sensitive,[target]:{old:'stale',checkInPhoto:'private'}});
 await syncAssignmentRoster({db:x.db,eventId:'event',assignmentId:'assignment'});assert.equal(x.records.get(target).userId,'owner');assert.equal(x.records.get(target).old,undefined);assert.equal(x.writes[0].options,undefined);
 x.records.set(source,{...sensitive,userId:'new-owner',areaId:'other-area'});await syncAssignmentRoster({db:x.db,eventId:'event',assignmentId:'assignment'});assert.equal(x.records.get(target).userId,'new-owner');assert.equal(x.records.get(target).areaId,'other-area');assert.equal(x.records.get(source).checkInPhoto,sensitive.checkInPhoto);assert.equal(x.writes.every(w=>w.path===target),true);
});
test('a delayed delete/write trigger cannot resurrect a removed assignment projection',async()=>{
 const target='events/event/assignment_roster/assignment';const x=database({[target]:{userId:'stale-owner'}});const result=await syncAssignmentRoster({db:x.db,eventId:'event',assignmentId:'assignment'});assert.deepEqual(result,{projected:false,removed:true});assert.equal(x.records.has(target),false);assert.deepEqual(x.writes,[{operation:'delete',path:target}]);
});
test('backfill defaults to a local dry run without modifying original records or projections',async()=>{
 const x=database({'events/event/assignments/assignment':sensitive});const report=await backfillAssignmentRoster({db:x.db,project:'demo-mci',firestoreHost:'127.0.0.1:8080'});assert.equal(report.mode,'DEMO_EMULATOR_DRY_RUN');assert.equal(report.projectable,1);assert.equal(report.recordsWithPrivateFields,1);assert.equal(x.writes.length,0);assert.equal(JSON.stringify(report).includes('private-token'),false);assert.equal(JSON.stringify(report).includes('owner'),false);
});
test('backfill execution is emulator-only and writes only scheduling projections',async()=>{
 for(const target of [{project:'mcimachala-servidor',firestoreHost:'127.0.0.1:8080'},{project:'demo-mci',firestoreHost:'production.example:8080'},{project:'demo-mci',firestoreHost:'user:secret@127.0.0.1:8080'},{project:'demo-mci',firestoreHost:'127.0.0.1:8080/path'}])assert.throws(()=>assertRosterDemoTarget(target));
 let touched=false;await assert.rejects(backfillAssignmentRoster({db:{collectionGroup(){touched=true;}},project:'mcimachala-servidor',firestoreHost:'127.0.0.1:8080',execute:true}));assert.equal(touched,false);
 const x=database({'events/event/assignments/assignment':sensitive});const report=await backfillAssignmentRoster({db:x.db,project:'demo-mci',firestoreHost:'localhost:8080',execute:true});assert.equal(report.projected,1);assert.equal(report.originalAssignmentsModified,0);assert.equal(report.productionWrites,0);assert.equal(x.records.get('events/event/assignments/assignment'),sensitive);assert.equal(x.writes[0].path,'events/event/assignment_roster/assignment');
});
test('both attendance proxy flows stream bytes with no-store instead of creating transferable URLs',async()=>{
 const res=new PassThrough(),headers={},chunks=[];res.setHeader=(key,value)=>{headers[key]=value;};res.on('data',chunk=>chunks.push(chunk));const done=once(res,'end');let signed=0;
 const served=servePrivateAttendance({objectPath:'attendance/event/assignment/photo.jpg',file:{createReadStream:()=>Readable.from([Buffer.from('synthetic-private-photo')]),getSignedUrl:()=>{signed++;throw Error('Must not sign');}},metadata:{contentType:'image/jpeg'},filename:'photo.jpg',inline:true,res});await done;assert.equal(served,true);assert.equal(signed,0);assert.equal(Buffer.concat(chunks).toString(),'synthetic-private-photo');assert.match(headers['Cache-Control'],/no-store/);assert.equal(headers.Location,undefined);assert.equal(headers['Content-Type'],'image/jpeg');assert.equal(headers.Vary,'Authorization, Cookie');
 assert.equal(servePrivateAttendance({objectPath:'events/event/material.txt'}),false);
});
test('aborting a private photo response destroys the source and removes the close listener',()=>{
 const res=new PassThrough();res.setHeader=()=>{};const source=new PassThrough();
 servePrivateAttendance({objectPath:'attendance/event/assignment/photo.jpg',file:{createReadStream:()=>source},metadata:{contentType:'image/jpeg'},filename:'photo.jpg',inline:true,res});
 assert.ok(res.listeners('close').some(listener=>listener.name==='cancel'));res.emit('close');assert.equal(source.destroyed,true);assert.equal(res.listeners('close').some(listener=>listener.name==='cancel'),false);res.destroy();
});
test('private photo read guard accepts a verified Firebase bearer or session without requiring mutation CSRF',async()=>{
 for(const headers of [{authorization:'Bearer synthetic-token'},{cookie:'__session=synthetic-session'}]){
  const calls=[];const auth={verifyIdToken:async(_token,revoked)=>{calls.push(revoked);return {uid:'owner'};},verifySessionCookie:async(_token,revoked)=>{calls.push(revoked);return {uid:'owner'};}};
  const db={collection:()=>({doc:()=>({get:async()=>({exists:true,data:()=>({role:'user'})})})})};let next=0;const res={locals:{},status(n){this.code=n;return this;},json(){}};
  await releaseReadRequestGuard({auth,db})({method:'GET',headers},res,()=>next++);assert.equal(next,1);assert.deepEqual(calls,[true]);assert.equal(res.locals.uid,'owner');
 }
});
test('active BFF handlers and trigger are wired to privacy projection before silent exits or URL signing',()=>{
 const source=readFileSync(new URL('../functions/src/index.ts',import.meta.url),'utf8');assert.equal((source.match(/assignmentForActor\(d.data\(\), d.id, id, actor\)/g)||[]).length,2);assert.equal((source.match(/if \(servePrivateAttendance\(/g)||[]).length,2);
 assert.ok(source.includes('assignmentForActor(doc.data(), doc.id, eventId, actor)'));
 const trigger=source.slice(source.indexOf('exports.onAssignmentWritten = functions.firestore'));assert.ok(trigger.indexOf('await syncAssignmentRoster(')<trigger.indexOf('if (after && after._silent) return;'));
 for(const name of ['downloadFileHandler','downloadMaterialHandler']){const handler=source.slice(source.indexOf('const '+name));assert.ok(handler.indexOf('if (servePrivateAttendance(')<handler.indexOf('file.getSignedUrl('));}
});
