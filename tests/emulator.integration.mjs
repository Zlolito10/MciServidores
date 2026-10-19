import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {seedEmulators,fixtures,fixturePassword,project} from '../scripts/seed-emulators.mjs';
const base='http://127.0.0.1:5001/'+project+'/us-central1/serverApi';
async function api(route,{session,method='GET',body,csrf=true}={}){
 const headers={};if(session){headers.cookie=session.cookie;if(csrf)headers['x-xsrf-token']=session.csrf;}
 if(body!==undefined)headers['Content-Type']='application/json';
 const response=await fetch(base+route,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(25000)});
 let data;try{data=await response.json();}catch{data=null;}
 return {status:response.status,data,response};
}
async function sessionFor(username){
 const r=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-mci-local-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:username+'@church.app',password:fixturePassword,returnSecureToken:true})});
 assert.equal(r.status,200);const auth=await r.json();
 const result=await api('/api/sessionLogin',{method:'POST',body:{idToken:auth.idToken}});
 assert.equal(result.status,200);assert.equal(result.data.ok,true);
 const cookie=result.response.headers.getSetCookie().map(v=>v.split(';')[0]).join('; ');
 assert.ok(cookie.includes('__session='));assert.ok(cookie.includes('XSRF-TOKEN='));
 return {cookie,csrf:result.data.csrfToken,idToken:auth.idToken};
}
test('Recovered backend, Auth, Firestore and Storage integration on local demo project',async t=>{
 const {app,db}=await seedEmulators();t.after(()=>app.delete());
 let admin,user,other;
 await t.test('all 30 deployed functions can be loaded',()=>{
  process.env.GCLOUD_PROJECT=project;process.env.FIREBASE_CONFIG=JSON.stringify({projectId:project,storageBucket:project+'.appspot.com'});
  const require=createRequire(new URL('../functions/package.json',import.meta.url));const exported=require('../functions/lib/index.js');
  const deployed=JSON.parse(readFileSync(new URL('../recovered/functions-inventory.json',import.meta.url),'utf8')).map(f=>f.name).sort();
  assert.deepEqual(Object.keys(exported).filter(k=>!k.startsWith('__')).sort(),deployed);
 });
 await t.test('public probe and protected route behave correctly',async()=>{
  assert.equal((await api('/api/hello')).status,200);
  assert.deepEqual((await api('/api/me')).data,{ok:false});
  assert.equal((await api('/api/events')).status,401);
 });
 await t.test('actual emulator sign-in exchanges tokens for session cookies',async()=>{
  admin=await sessionFor('recoveryadmin');user=await sessionFor('recoveryuser');other=await sessionFor('recoveryother');
  const me=await api('/api/me',{session:admin});assert.equal(me.data.user.uid,'recovery-admin');assert.equal(me.data.user.role,'master_admin');
 });
 await t.test('writes reject missing CSRF and insufficient role',async()=>{
  assert.equal((await api('/api/roles/recovery-test',{session:admin,method:'PUT',body:{name:'Test'},csrf:false})).status,403);
  assert.equal((await api('/api/roles/recovery-test',{session:user,method:'PUT',body:{name:'Test'}})).status,403);
 });
 await t.test('administrator can create, read, edit and delete roles',async()=>{
  assert.equal((await api('/api/roles/recovery-test',{session:admin,method:'PUT',body:{name:'Test',permissions:['view_dashboard']}})).status,200);
  assert.equal((await api('/api/roles/recovery-test',{session:admin})).data.item.name,'Test');
  assert.equal((await api('/api/roles/recovery-test',{session:admin,method:'PUT',body:{name:'Edited',permissions:[]}})).status,200);
  assert.equal((await api('/api/roles/recovery-test',{session:admin,method:'DELETE'})).status,200);
 });
 await t.test('event details include assignments and repertoire',async()=>{
  const r=await api('/api/events/recovery-event/details',{session:admin});assert.equal(r.status,200);assert.equal(r.data.event.title,'Servicio de prueba local');assert.ok(r.data.assignments.length);assert.ok(r.data.repertoire.length);
 });
 await t.test('repertoire edits persist through the recovered API',async()=>{
  const r=await api('/api/events/recovery-event/repertoire',{session:admin,method:'POST',body:{title:'Nueva canción',key:'D',link:'',notes:'Fixture',order:2}});
  assert.equal(r.status,200);assert.equal((await db.doc('events/recovery-event/repertoire/'+r.data.id).get()).data().key,'D');
  assert.equal((await api('/api/events/recovery-event/repertoire/'+r.data.id,{session:admin,method:'DELETE'})).status,200);
 });
 await t.test('attendance accepts the assigned user and rejects another user',async()=>{
  const route='/api/events/recovery-event/assignments/recovery-assignment/attendance';
  assert.equal((await api(route,{session:other,method:'POST',body:{type:'check-in'}})).status,403);
  assert.equal((await api(route,{session:user,method:'POST',body:{type:'check-in',attendanceTimeIso:'2026-10-20T15:00:00Z',wasLate:false}})).status,200);
  assert.equal((await db.doc('events/recovery-event/assignments/recovery-assignment').get()).data().attendanceStatus,'present');
 });
 await t.test('comments persist and reject invalid command types',async()=>{
  const r=await api('/api/comments',{session:user,method:'POST',body:{text:'Mensaje de prueba local'}});assert.equal(r.status,200);assert.equal((await db.doc('comments/'+r.data.id).get()).data().authorId,'recovery-user');
  assert.equal((await api('/api/commands',{session:user,method:'POST',body:{type:'UNKNOWN'}})).status,400);
 });
 await t.test('Firestore rules reject anonymous profile reads and privilege escalation',async()=>{
  const endpoint='http://127.0.0.1:8080/v1/projects/'+project+'/databases/(default)/documents/users/recovery-user';
  assert.equal((await fetch(endpoint)).status,403);
  assert.equal((await fetch(endpoint,{headers:{Authorization:'Bearer '+user.idToken}})).status,200);
  const r=await fetch(endpoint+'?updateMask.fieldPaths=role',{method:'PATCH',headers:{Authorization:'Bearer '+user.idToken,'Content-Type':'application/json'},body:JSON.stringify({fields:{role:{stringValue:'master_admin'}}})});assert.equal(r.status,403);
 });
 await t.test('Storage rules allow an owner image upload and reject other owners',async()=>{
  const require=createRequire(new URL('../functions/package.json',import.meta.url));
  const bucket=project+'.appspot.com';const bytes=await require('sharp')({create:{width:4,height:4,channels:3,background:'#245185'}}).png().toBuffer();
  for(const [owner,status] of [['recovery-user',200],['recovery-other',403]]){
   const u='http://127.0.0.1:9199/v0/b/'+bucket+'/o?uploadType=media&name='+encodeURIComponent('profile-photos/'+owner+'/recovery.png');
   assert.equal((await fetch(u,{method:'POST',headers:{Authorization:'Bearer '+user.idToken,'Content-Type':'image/png'},body:bytes})).status,status);
  }
 });
 await t.test('updated sharp dependency decodes, resizes and exports images',async()=>{
  const require=createRequire(new URL('../functions/package.json',import.meta.url));const sharp=require('sharp');
  const bytes=await sharp({create:{width:4,height:4,channels:3,background:'#245185'}}).resize(2,2).webp().toBuffer();assert.equal((await sharp(bytes).metadata()).width,2);
 });
 await t.test('logout clears session cookies',async()=>{
  const r=await api('/api/sessionLogout',{session:user,method:'POST',body:{}});assert.equal(r.status,200);assert.ok(r.response.headers.getSetCookie().some(x=>x.includes('Max-Age=0')));
 });
});
