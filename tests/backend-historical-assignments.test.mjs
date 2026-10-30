import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {Readable} from 'node:stream';
import {readFileSync} from 'node:fs';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {Firestore,Timestamp}=require('@google-cloud/firestore');
const {historicalReadTime,readHistoricalAssignments}=require('../functions/lib/historical-assignments.js');
const nowMs=Date.parse('2026-10-29T12:00:00Z'),time='2026-10-29T11:59:00Z';

function sdkFixture({mismatch=false,unavailable=false,empty=false}={}){
 const db=new Firestore({projectId:'demo-pitr-sdk-contract'}),calls=[];
 // These are the installed SDK's transport seams; no RPC/client/ADC is initialized.
 db.initializeIfNeeded=async()=>{};
 db.request=()=>{throw Error('Unexpected unary RPC or write');};
 db.requestStream=(method,_bidirectional,request)=>{
  calls.push({method,request});if(unavailable)throw Error('synthetic private transport details');
  const readTime=mismatch?Timestamp.fromMillis(nowMs).toProto().timestampValue:request.readTime;
  assert.ok(readTime,'Every real SDK RPC must carry an explicit readTime');
  const common={readTime};
  if(method==='batchGetDocuments')return Readable.from([{...common,found:{name:request.documents[0],fields:{title:{stringValue:'Historical event'}},createTime:readTime,updateTime:readTime}}]);
  if(method==='runQuery')return Readable.from([empty?common:{...common,document:{name:'projects/demo-pitr-sdk-contract/databases/(default)/documents/events/event/assignments/assignment',fields:{userId:{stringValue:'historical-owner'},areaId:{stringValue:'music'}},createTime:readTime,updateTime:readTime}}]);
  throw Error('Unexpected RPC '+method);
 };
 return {db,calls};
}

test('installed Firestore SDK emits exact readTime in document and query RPCs from a read-only transaction',async()=>{
 const {db,calls}=sdkFixture();try{
  const result=await readHistoricalAssignments(db,'event',time,{nowMs});assert.equal(result.historicalReadTimeVerified,true);assert.equal(result.snapshotTime,'2026-10-29T11:59:00.000Z');assert.equal(result.assignments.docs[0].data().userId,'historical-owner');
  assert.deepEqual(calls.map(c=>c.method),['batchGetDocuments','runQuery']);for(const call of calls){assert.deepEqual(call.request.readTime,Timestamp.fromDate(new Date(time)).toProto().timestampValue);assert.equal(call.request.transaction,undefined);}
 }finally{await db.terminate();}
});
test('a current or mismatched snapshot is rejected instead of being mislabeled as historical',async()=>{
 const {db,calls}=sdkFixture({mismatch:true});try{await assert.rejects(readHistoricalAssignments(db,'event',time,{nowMs}),error=>error.code==='PITR_UNAVAILABLE'&&error.status===501);assert.equal(calls.some(c=>/commit|write/i.test(c.method)),false);}finally{await db.terminate();}
});
test('PITR unavailability is sanitized and never falls back to current reads',async()=>{
 const {db,calls}=sdkFixture({unavailable:true});try{await assert.rejects(readHistoricalAssignments(db,'event',time,{nowMs}),error=>error.code==='PITR_UNAVAILABLE'&&error.message==='PITR_UNAVAILABLE');assert.deepEqual(calls.map(c=>c.method),['batchGetDocuments']);}finally{await db.terminate();}
});
test('an empty historical query still verifies its readTime and returns no current documents',async()=>{
 const {db}=sdkFixture({empty:true});try{const result=await readHistoricalAssignments(db,'event',time,{nowMs});assert.equal(result.assignments.empty,true);assert.equal(result.assignments.readTime.isEqual(Timestamp.fromDate(new Date(time))),true);}finally{await db.terminate();}
});
test('invalid, future, expired and overprecise older timestamps cannot initialize a Firestore read',async()=>{
 for(const value of ['not-a-date','2026-10-29T12:01:00Z','2026-10-20T12:00:00Z','2026-10-29T10:00:01Z','2026-02-30T12:00:00Z'])assert.throws(()=>historicalReadTime(value,nowMs));
 assert.equal(historicalReadTime('2026-10-29T10:00:00Z',nowMs).toMillis(),Date.parse('2026-10-29T10:00:00Z'));
 let initialized=false;await assert.rejects(readHistoricalAssignments({runTransaction(){initialized=true;}},'event','invalid',{nowMs}));assert.equal(initialized,false);
});
test('both PITR routes use verified read-only snapshots and contain no ignored readTime get arguments',()=>{
 const source=readFileSync(new URL('../functions/src/index.ts',import.meta.url),'utf8');assert.equal((source.match(/await readHistoricalAssignments\(db, eventId, snapshotTime\)/g)||[]).length,2);assert.equal(source.includes('readTime: Timestamp.fromDate(readTime)'),false);const restore=source.slice(source.indexOf('"/api/admin/debug/pitr-restore/:eventId"'));assert.ok(restore.indexOf('await readHistoricalAssignments(')<restore.indexOf('const batch = db.batch()'));
});
