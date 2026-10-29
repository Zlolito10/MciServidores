import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {writeFile} from 'node:fs/promises';
import {seedEmulators,fixtures,fixturePassword,project,recoveryEventDate} from '../scripts/seed-emulators.mjs';
const base='http://127.0.0.1:5001/'+project+'/us-central1/serverApi';
const requestEvidence=[];
async function api(route,{session,method='GET',body,csrf=true,headers:extraHeaders={}}={}){
 const headers={...extraHeaders};if(session){headers.cookie=session.cookie;if(csrf)headers['x-xsrf-token']=session.csrf;}
 const multipart=body instanceof FormData;
 if(body!==undefined&&!multipart)headers['Content-Type']='application/json';
 const response=await fetch(base+route,{method,headers,...(body===undefined?{}:{body:multipart?body:JSON.stringify(body)}),signal:AbortSignal.timeout(25000)});
 requestEvidence.push({service:'functions',method,path:route.split('?')[0],status:response.status});
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
function firestoreValue(value){
 if(value===null)return {nullValue:null};
 if(value instanceof Date)return {timestampValue:value.toISOString()};
 if(Array.isArray(value))return {arrayValue:{values:value.map(firestoreValue)}};
 if(typeof value==='object')return {mapValue:{fields:Object.fromEntries(Object.entries(value).map(([k,v])=>[k,firestoreValue(v)]))}};
 if(typeof value==='boolean')return {booleanValue:value};
 if(typeof value==='number')return Number.isInteger(value)?{integerValue:String(value)}:{doubleValue:value};
 return {stringValue:String(value)};
}
async function clientDocument(path,{session,method='GET',data}={}){
 const headers={};if(session)headers.Authorization='Bearer '+session.idToken;
 if(data!==undefined)headers['Content-Type']='application/json';
 const response=await fetch('http://127.0.0.1:8080/v1/projects/'+project+'/databases/(default)/documents/'+path,{method,headers,...(data===undefined?{}:{body:JSON.stringify({fields:Object.fromEntries(Object.entries(data).map(([k,v])=>[k,firestoreValue(v)]))})}),signal:AbortSignal.timeout(10000)});
 requestEvidence.push({service:'firestore-rules',method,path,status:response.status});return response;
}
async function until(check,message,timeout=8000){
 const end=Date.now()+timeout;
 while(Date.now()<end){if(await check())return;await new Promise(resolve=>setTimeout(resolve,100));}
 assert.fail(message);
}
test('Recovered backend, Auth, Firestore and Storage integration on local demo project',async t=>{
 const {app,db}=await seedEmulators();t.after(()=>app.delete());
 const flows=[];
 const check=(name,body)=>t.test(name,async()=>{try{await body();flows.push({name,status:'passed'});}catch(error){flows.push({name,status:'failed'});throw error;}});
 t.after(async()=>writeFile(new URL('../recovery/flow-validation.json',import.meta.url),JSON.stringify({generatedAt:new Date().toISOString(),project,environment:'local Firebase Auth/Firestore/Storage/Functions emulators',productionServicesUsed:false,passed:flows.filter(f=>f.status==='passed').length,failed:flows.filter(f=>f.status==='failed').length,flows,requests:requestEvidence,externalAdapterSimulations:['FCM delivery/topics','Drive archive'],unverifiedExternalSystems:['Real Google OAuth consent/provider','Real FCM delivery on a device','Real camera permission and capture','Real GPS permission and coordinates','Real Drive IAM and upload','Cloud Scheduler/PubSub delivery','Production IAM/PITR/history resources']},null,2)+'\n'));
 let admin,user,other,ministry;
 await check('all 30 deployed functions can be loaded',()=>{
  process.env.GCLOUD_PROJECT=project;process.env.FIREBASE_CONFIG=JSON.stringify({projectId:project,storageBucket:project+'.appspot.com'});process.env.MCI_LOCAL_TEST_MODE='1';process.env.FIREBASE_STORAGE_EMULATOR_HOST='127.0.0.1:9199';
  const require=createRequire(new URL('../functions/package.json',import.meta.url));const exported=require('../functions/lib/index.js');
  const deployed=JSON.parse(readFileSync(new URL('../recovered/functions-inventory.json',import.meta.url),'utf8')).map(f=>f.name).sort();
  assert.deepEqual(Object.keys(exported).filter(k=>!k.startsWith('__')).sort(),deployed);
 });
 await check('public probe and protected route behave correctly',async()=>{
  assert.equal((await api('/api/hello')).status,200);
  assert.deepEqual((await api('/api/me')).data,{ok:false});
  assert.equal((await api('/api/events')).status,401);
 });
 await check('actual emulator sign-in exchanges tokens for session cookies',async()=>{
  admin=await sessionFor('recoveryadmin');user=await sessionFor('recoveryuser');other=await sessionFor('recoveryother');ministry=await sessionFor('recoveryministry');
  const me=await api('/api/me',{session:admin});assert.equal(me.data.user.uid,'recovery-admin');assert.equal(me.data.user.role,'master_admin');
 });
 await check('writes reject missing CSRF and insufficient role',async()=>{
  assert.equal((await api('/api/roles/recovery-test',{session:admin,method:'PUT',body:{name:'Test'},csrf:false})).status,403);
  assert.equal((await api('/api/roles/recovery-test',{session:user,method:'PUT',body:{name:'Test'}})).status,403);
 });
 await check('administrator can create, read, edit and delete roles',async()=>{
  assert.equal((await api('/api/roles/recovery-test',{session:admin,method:'PUT',body:{name:'Test',permissions:['view_dashboard']}})).status,200);
  assert.equal((await api('/api/roles/recovery-test',{session:admin})).data.item.name,'Test');
  assert.equal((await api('/api/roles/recovery-test',{session:admin,method:'PUT',body:{name:'Edited',permissions:[]}})).status,200);
  assert.equal((await api('/api/roles/recovery-test',{session:admin,method:'DELETE'})).status,200);
 });
 await check('event details include assignments and repertoire',async()=>{
  const r=await api('/api/events/recovery-event/details',{session:admin});assert.equal(r.status,200);assert.equal(r.data.event.title,'Servicio de prueba local');assert.ok(r.data.assignments.length);assert.ok(r.data.repertoire.length);
 });
 await check('repertoire edits persist through the recovered API',async()=>{
  const r=await api('/api/events/recovery-event/repertoire',{session:admin,method:'POST',body:{title:'Nueva canción',key:'D',link:'',notes:'Fixture',order:2}});
  assert.equal(r.status,200);assert.equal((await db.doc('events/recovery-event/repertoire/'+r.data.id).get()).data().key,'D');
  assert.equal((await api('/api/events/recovery-event/repertoire/'+r.data.id,{session:admin,method:'DELETE'})).status,200);
 });
 await check('attendance accepts the assigned user and rejects another user',async()=>{
  const route='/api/events/recovery-event/assignments/recovery-assignment/attendance';
  assert.equal((await api(route,{session:other,method:'POST',body:{type:'check-in'}})).status,403);
  assert.equal((await api(route,{session:user,method:'POST',body:{type:'check-in',attendanceTimeIso:'2026-10-20T15:00:00Z',wasLate:false}})).status,200);
  assert.equal((await db.doc('events/recovery-event/assignments/recovery-assignment').get()).data().attendanceStatus,'present');
 });
 await check('comments persist and reject invalid command types',async()=>{
  const r=await api('/api/comments',{session:user,method:'POST',body:{text:'Mensaje de prueba local'}});assert.equal(r.status,200);assert.equal((await db.doc('comments/'+r.data.id).get()).data().authorId,'recovery-user');
  assert.equal((await api('/api/commands',{session:user,method:'POST',body:{type:'UNKNOWN'}})).status,400);
 });
 await check('Firestore rules reject anonymous profile reads and privilege escalation',async()=>{
  const endpoint='http://127.0.0.1:8080/v1/projects/'+project+'/databases/(default)/documents/users/recovery-user';
  assert.equal((await fetch(endpoint)).status,403);
  assert.equal((await fetch(endpoint,{headers:{Authorization:'Bearer '+user.idToken}})).status,200);
  const r=await fetch(endpoint+'?updateMask.fieldPaths=role',{method:'PATCH',headers:{Authorization:'Bearer '+user.idToken,'Content-Type':'application/json'},body:JSON.stringify({fields:{role:{stringValue:'master_admin'}}})});assert.equal(r.status,403);
 });
 await check('Storage rules allow an owner image upload and reject other owners',async()=>{
  const require=createRequire(new URL('../functions/package.json',import.meta.url));
  const bucket=project+'.appspot.com';const bytes=await require('sharp')({create:{width:4,height:4,channels:3,background:'#245185'}}).png().toBuffer();
  for(const [owner,status] of [['recovery-user',200],['recovery-other',403]]){
   const u='http://127.0.0.1:9199/v0/b/'+bucket+'/o?uploadType=media&name='+encodeURIComponent('profile-photos/'+owner+'/recovery.png');
   assert.equal((await fetch(u,{method:'POST',headers:{Authorization:'Bearer '+user.idToken,'Content-Type':'image/png'},body:bytes})).status,status);
  }
 });
 await check('updated sharp dependency decodes, resizes and exports images',async()=>{
  const require=createRequire(new URL('../functions/package.json',import.meta.url));const sharp=require('sharp');
  const bytes=await sharp({create:{width:4,height:4,channels:3,background:'#245185'}}).resize(2,2).webp().toBuffer();assert.equal((await sharp(bytes).metadata()).width,2);
 });
 await check('events can be created, edited, listed and deleted by an administrator',async()=>{
  const body={title:'Evento CRUD',date:recoveryEventDate,time:'11:00',location:'Local',activeMinistries:['recovery-music'],createdBy:'recovery-admin'};
  assert.equal((await api('/api/events',{session:user,method:'POST',body})).status,403);
  const created=await api('/api/events',{session:admin,method:'POST',body});assert.equal(created.status,200);const id=created.data.id;
  assert.equal((await api('/api/events/'+id,{session:admin,method:'PATCH',body:{title:'Evento editado'}})).status,200);
  assert.equal((await api('/api/events/'+id+'/details',{session:admin})).data.event.title,'Evento editado');
  assert.equal((await api('/api/events',{session:admin})).status,200);
  assert.equal((await api('/api/events/'+id,{session:admin,method:'DELETE'})).status,200);
  assert.equal((await db.doc('events/'+id).get()).exists,false);
 });
 await check('ministry assignment permissions are restricted to the matching area',async()=>{
  const route='/api/events/recovery-event/assignments/recovery-ministry-assignment';
  assert.equal((await api(route,{session:ministry,method:'PUT',body:{areaId:'recovery-welcome',userId:'recovery-user'}})).status,403);
  assert.equal((await api(route,{session:ministry,method:'PUT',body:{areaId:'recovery-music',areaName:'Alabanza',userId:'recovery-user',userName:'Servidor local',roleName:'Apoyo'}})).status,200);
  assert.equal((await db.doc('events/recovery-event/assignments/recovery-ministry-assignment').get()).data().roleName,'Apoyo');
  assert.equal((await api(route,{session:other,method:'DELETE'})).status,403);
  assert.equal((await api(route,{session:ministry,method:'DELETE'})).status,200);
 });
 await check('event templates can be created, edited and deleted',async()=>{
  const created=await api('/api/event_templates',{session:admin,method:'POST',body:{title:'Plantilla local',time:'09:00',activeMinistries:['recovery-music']}});assert.equal(created.status,200);const id=created.data.id;
  assert.equal((await api('/api/event_templates/'+id,{session:admin,method:'PUT',body:{title:'Plantilla editada'}})).status,200);
  const list=await api('/api/event_templates',{session:admin});assert.ok(list.data.items.some(x=>x.id===id&&x.title==='Plantilla editada'));
  assert.equal((await api('/api/event_templates/'+id,{session:user,method:'DELETE'})).status,403);
  assert.equal((await api('/api/event_templates/'+id,{session:admin,method:'DELETE'})).status,200);
 });
 await check('ministries can be created, edited and deleted',async()=>{
  const r=await api('/api/service_areas',{session:admin,method:'POST',body:{name:'Ministerio CRUD',active:true}});assert.equal(r.status,200);const id=r.data.id;
  assert.equal((await api('/api/service_areas/'+id,{session:admin,method:'PUT',body:{name:'Ministerio editado'}})).status,200);
  assert.equal((await db.doc('service_areas/'+id).get()).data().name,'Ministerio editado');
  assert.equal((await api('/api/service_areas/'+id,{session:admin,method:'DELETE'})).status,200);
 });
 await check('repertoire update and reordering persist exact order',async()=>{
  const prefix='/api/events/recovery-event/repertoire';
  const r=await api(prefix,{session:admin,method:'POST',body:{title:'Ordenar',key:'C',order:2}});assert.equal(r.status,200);const id=r.data.id;
  assert.equal((await api(prefix+'/'+id,{session:admin,method:'PATCH',body:{key:'G',notes:'Editada'}})).status,200);
  assert.equal((await api(prefix+'/reorder',{session:admin,method:'POST',body:{items:[{id,order:0},{id:'recovery-song',order:1}]}})).status,200);
  const saved=(await db.doc('events/recovery-event/repertoire/'+id).get()).data();assert.equal(saved.key,'G');assert.equal(saved.order,0);
  assert.equal((await api(prefix+'/'+id,{session:admin,method:'DELETE'})).status,200);
 });
 await check('link materials and the shared material library support CRUD',async()=>{
  const prefix='/api/events/recovery-event/materials';
  const created=await api(prefix,{session:admin,method:'POST',body:{title:'Material local',type:'link',url:'https://example.invalid/fixture',songId:'recovery-song'}});assert.equal(created.status,200);const id=created.data.id;
  assert.equal((await api(prefix+'/'+id,{session:admin,method:'PATCH',body:{title:'Material editado'}})).status,200);
  assert.ok((await api(prefix,{session:admin})).data.materials.some(x=>x.id===id&&x.title==='Material editado'));
  const library=await api('/api/materials_library',{session:admin,method:'POST',body:{title:'Biblioteca local',url:'https://example.invalid/library'}});assert.equal(library.status,200);
  assert.ok((await api('/api/materials_library',{session:admin})).data.items.some(x=>x.id===library.data.id));
  assert.equal((await api('/api/materials_library/'+library.data.id,{session:admin,method:'DELETE'})).status,200);
  assert.equal((await api(prefix+'/'+id,{session:admin,method:'DELETE'})).status,200);
 });
 await check('multipart material upload stores bytes and download returns the same content',async()=>{
  const text='Material sintético de recuperación';const form=new FormData();form.set('title','Archivo local');form.set('file',new Blob([text],{type:'text/plain'}),'recovery.txt');
  const r=await api('/api/events/recovery-event/materials/upload',{session:admin,method:'POST',body:form});assert.equal(r.status,200);const objectPath=r.data.item.url;
  const download=await fetch(base+'/api/download?path='+encodeURIComponent(objectPath),{headers:{cookie:admin.cookie},redirect:'manual',signal:AbortSignal.timeout(10000)});assert.equal(download.status,200);assert.equal(await download.text(),text);
  assert.equal((await api('/api/events/recovery-event/materials/'+r.data.id,{session:admin,method:'DELETE'})).status,200);
 });
 await check('file downloads reject traversal and unsupported prefixes',async()=>{
  for(const path of ['../private','/events/test'])assert.equal((await api('/api/download?path='+encodeURIComponent(path),{session:admin})).status,400);
  assert.equal((await api('/api/download?path='+encodeURIComponent('private/key'),{session:admin})).status,403);
  assert.equal((await api('/api/download',{session:admin})).status,400);
 });
 await check('profile edits whitelist fields and preserve nested preferences',async()=>{
  const r=await api('/api/users/me',{session:user,method:'PATCH',body:{name:'Servidor local editado',role:'master_admin',preferences:{notifications:false,darkMode:true}}});assert.equal(r.status,200);
  const data=(await db.doc('users/recovery-user').get()).data();assert.equal(data.name,'Servidor local editado');assert.equal(data.role,'user');assert.equal(data.preferences.darkMode,true);
  assert.equal((await api('/api/users/me',{session:user,method:'PATCH',body:{name:''}})).status,400);
 });
 await check('profile photo upload rejects non-images and persists a managed photo path',async()=>{
  const invalid=new FormData();invalid.set('file',new Blob(['text'],{type:'text/plain'}),'invalid.txt');assert.equal((await api('/api/users/me/photo',{session:user,method:'POST',body:invalid})).status,400);
  const require=createRequire(new URL('../functions/package.json',import.meta.url));const image=await require('sharp')({create:{width:5,height:5,channels:3,background:'#245185'}}).png().toBuffer();
  const form=new FormData();form.set('file',new Blob([image],{type:'image/png'}),'profile.png');const r=await api('/api/users/me/photo',{session:user,method:'POST',body:form});assert.equal(r.status,200);assert.match(r.data.photoURL,/^profile-photos\/recovery-user\//);
 });
 await check('profile upload enforces the recovered three MiB size limit',async()=>{
  const form=new FormData();form.set('file',new Blob([Buffer.alloc(3*1024*1024+1)],{type:'image/png'}),'too-large.png');
  assert.equal((await api('/api/users/me/photo',{session:user,method:'POST',body:form})).status,413);
 });
 await check('comments support reaction toggling and author/admin delete permissions',async()=>{
  const r=await api('/api/comments',{session:user,method:'POST',body:{text:'Reacción local'}});assert.equal(r.status,200);const id=r.data.id;
  assert.equal((await api('/api/comments/react',{session:other,method:'POST',body:{commentId:id,reaction:'like',action:'toggle'}})).data.action,'added');
  assert.ok((await db.doc('comments/'+id).get()).data().reactions.like.includes('recovery-other'));
  assert.equal((await api('/comments/react',{method:'POST',headers:{Authorization:'Bearer '+other.idToken},body:{commentId:id,reaction:'like',action:'toggle'}})).data.action,'removed');
  assert.equal((await api('/api/comments/'+id,{session:other,method:'DELETE'})).status,403);
  assert.equal((await api('/api/comments/'+id,{session:user,method:'DELETE'})).status,200);
 });
 await check('attendance check-out and reporting include the persisted assignment',async()=>{
  const route='/api/events/recovery-event/assignments/recovery-assignment/attendance';
  assert.equal((await api(route,{session:user,method:'POST',body:{type:'check-out',attendanceTimeIso:recoveryEventDate+'T17:00:00Z'}})).status,200);
  assert.ok((await db.doc('events/recovery-event/assignments/recovery-assignment').get()).data().checkOutTime);
  const query='?startDate='+recoveryEventDate+'&endDate='+recoveryEventDate+'&eventIds=recovery-event';
  assert.ok((await api('/api/attendance/events'+query,{session:admin})).data.events.some(x=>x.id==='recovery-event'));
  assert.ok((await api('/api/attendance/records'+query,{session:admin})).data.records.some(x=>x.id==='recovery-assignment'));
  assert.ok((await api('/api/attendance/peopleStatsData'+query,{session:admin})).data.assignments.some(x=>x.id==='recovery-assignment'));
  assert.equal((await api('/api/attendance/events'+query,{session:user})).status,403);
  assert.equal((await api('/api/attendance/events?startDate=invalid&endDate=x',{session:admin})).status,400);
 });
 await check('service history and dashboard aggregate local data',async()=>{
  const history=await api('/api/service-history',{session:user});assert.equal(history.status,200);assert.ok(history.data.assignments.some(x=>x.id==='recovery-assignment'));
  assert.equal((await api('/api/dashboard',{session:admin})).status,200);assert.equal((await api('/api/changes/meta',{session:admin})).status,200);
 });
 await check('private chats permit owner/admin and reject another user',async()=>{
  const path='private_chats/recovery-user/messages/recovery-test';
  assert.equal((await clientDocument(path,{session:user,method:'PATCH',data:{text:'Consulta local',senderId:'recovery-user',isAdmin:false,createdAt:new Date()}})).status,200);
  assert.equal((await clientDocument(path,{session:admin})).status,200);assert.equal((await clientDocument(path,{session:other})).status,403);
  assert.equal((await clientDocument(path,{session:user,method:'DELETE'})).status,200);
 });
 await check('Tuesday teaching session and attendance permissions match recovered rules',async()=>{
  const session='teaching_sessions/recovery-teaching',record='teaching_attendance_records/recovery-teaching-user';
  assert.equal((await clientDocument(session,{session:user,method:'PATCH',data:{date:recoveryEventDate,title:'Martes local'}})).status,403);
  assert.equal((await clientDocument(session,{session:ministry,method:'PATCH',data:{date:recoveryEventDate,title:'Martes local',isHoliday:false}})).status,200);
  assert.equal((await clientDocument(record,{session:ministry,method:'PATCH',data:{sessionId:'recovery-teaching',userId:'recovery-user',status:'present',date:recoveryEventDate}})).status,200);
  assert.equal((await clientDocument(session,{session:user})).status,200);assert.equal((await clientDocument(record,{session:other})).status,200);
  assert.equal((await clientDocument(record,{session:admin,method:'DELETE'})).status,200);assert.equal((await clientDocument(session,{session:admin,method:'DELETE'})).status,200);
 });
 await check('U de la Vida course, section, class and attendance respect ministry access',async()=>{
  const docs=[['udlv_courses/recovery-course',{name:'Curso local',ministryId:'recovery-music'}],['udlv_sections/recovery-section',{name:'Sección local',courseId:'recovery-course',ministryId:'recovery-music'}],['udlv_classes/recovery-class',{title:'Clase local',sectionId:'recovery-section',ministryId:'recovery-music'}],['udlv_class_records/recovery-class-user',{userId:'recovery-user',classId:'recovery-class',status:'present',ministryId:'recovery-music'}]];
  for(const [path,data] of docs){assert.equal((await clientDocument(path,{session:admin,method:'PATCH',data})).status,200);assert.equal((await clientDocument(path,{session:user})).status,200);assert.equal((await clientDocument(path,{session:other})).status,403);}
  for(const [path] of docs.reverse())assert.equal((await clientDocument(path,{session:admin,method:'DELETE'})).status,200);
 });
 await check('pending request ownership and admin-only reads match recovered rules',async()=>{
  const path='pending_assignments/recovery-pending';const pending=await sessionFor('recoverypending');
  assert.equal((await clientDocument(path,{session:pending,method:'PATCH',data:{userId:'recovery-pending',name:'Solicitud sintética',createdAt:new Date()}})).status,200);
  assert.equal((await clientDocument(path,{session:admin})).status,200);assert.equal((await clientDocument(path,{session:other})).status,403);
  assert.equal((await clientDocument(path,{session:admin,method:'DELETE'})).status,200);
 });
 await check('session restoration returns a custom token accepted by the Auth emulator',async()=>{
  const r=await api('/api/session/refresh',{session:user,method:'POST',body:{}});assert.equal(r.status,200);assert.ok(typeof r.data.token==='string');
  const response=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=demo-mci-local-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:r.data.token,returnSecureToken:true})});assert.equal(response.status,200);const identity=await response.json();assert.equal(JSON.parse(Buffer.from(identity.idToken.split('.')[1],'base64url').toString()).sub,'recovery-user');
 });
 await check('disposable user password change and self-delete affect local Auth only',async()=>{
  const uid='recovery-disposable';try{await app.auth().deleteUser(uid);}catch(error){if(error.code!=='auth/user-not-found')throw error;}
  await app.auth().createUser({uid,email:'recoverydisposable@church.app',password:fixturePassword});await db.doc('users/'+uid).set({uid,email:'recoverydisposable@church.app',name:'Cuenta desechable',role:'user',assignedMinistries:[]});
  const session=await sessionFor('recoverydisposable');assert.equal((await api('/api/users/me/password',{session,method:'POST',body:{newPassword:'x'}})).status,400);
  const changed=fixturePassword+'Changed';assert.equal((await api('/api/users/me/password',{session,method:'POST',body:{newPassword:changed}})).status,200);
  const signIn=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-mci-local-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'recoverydisposable@church.app',password:changed,returnSecureToken:true})});assert.equal(signIn.status,200);
  assert.equal((await api('/api/users/me/delete',{session,method:'POST',body:{}})).status,200);assert.equal((await db.doc('users/'+uid).get()).exists,false);await assert.rejects(()=>app.auth().getUser(uid),{code:'auth/user-not-found'});
 });
 await check('direct backend password login uses local Auth and rejects invalid credentials',async()=>{
  const good=await api('/api/passwordLogin',{method:'POST',body:{username:'recoveryuser',password:fixturePassword}});assert.equal(good.status,200);assert.equal(good.data.ok,true);assert.ok(good.response.headers.getSetCookie().some(x=>x.startsWith('__session=')));
  assert.equal((await api('/api/passwordLogin',{method:'POST',body:{username:'recoveryuser',password:'Incorrect-Local-Demo'}})).status,401);
  assert.equal((await api('/api/passwordLogin',{method:'POST',body:{username:'recoveryuser'}})).status,400);
 });
 await check('admin history and telemetry routes enforce master access and return stored records',async()=>{
  const day=new Date().toISOString().slice(0,10),stamp=new Date();
  await db.doc('app_audit_logs/recovery-audit').set({createdAt:stamp,uid:'recovery-user',email:'recoveryuser@church.app',method:'POST',path:'/api/comments',status:200,actionLabel:'Acción sintética'});
  await db.doc('app_telemetry/recovery-transfer').set({createdAt:stamp,userId:'recovery-user',transferSize:512,requestCount:1});
  await db.doc('app_telemetry_daily/recovery-day').set({day,userId:'recovery-user',transferSize:512,requestCount:1,metaCount:1});
  await db.doc('app_telemetry_daily_routes/recovery-route').set({day,type:'api',path:'/api/comments',bytes:512});
  const routes=['/api/admin/app-history','/api/admin/app-history/meta','/api/admin/telemetry/latest','/api/admin/telemetry/daily','/api/admin/telemetry/daily/routes?day='+day+'&type=api','/api/admin/firestore-reads'];
  for(const route of routes){assert.equal((await api(route)).status,401);assert.equal((await api(route,{session:user})).status,403);assert.equal((await api(route,{session:admin})).status,200);}
  const history=await api('/api/admin/app-history?limit=500',{session:admin});assert.ok(history.data.logs.some(x=>x.id==='recovery-audit'));assert.ok(Array.isArray(history.data.users));
  assert.ok((await api('/api/admin/telemetry/latest',{session:admin})).data.items.some(x=>x.userId==='recovery-user'));
  const reads=await api('/api/admin/firestore-reads',{session:admin});assert.equal(reads.data.ok,false);assert.equal(reads.data.error,'METRICS_NOT_COLLECTED');
  assert.equal((await api('/api/admin/app-history?cursor=invalid/missing',{session:admin})).status,400);assert.equal((await api('/api/admin/telemetry/daily/routes?type=unknown',{session:admin})).status,400);
 });
 await check('notification registration and delivery record a local outbox without sending FCM',async()=>{
  const token='demo-recovery-push-fixture';
  const r=await api('/api/notifications/register',{session:user,method:'POST',body:{pushKey:token}});assert.equal(r.status,200);assert.ok((await db.doc('userTokens/recovery-user').get()).data().tokens.includes(token));
  await db.doc('users/recovery-user').set({preferences:{notifications:true}},{merge:true});
  const sent=await api('/api/notify/user',{session:admin,method:'POST',body:{userId:'recovery-user',title:'Aviso local',body:'Simulación explícita'}});assert.equal(sent.status,200);
  await until(async()=>{const docs=await db.collection('_local_integration_outbox').where('service','==','fcm').get();return docs.docs.some(d=>['send','multicast'].includes(d.data().operation));},'Expected local FCM outbox record');
  const records=await db.collection('_local_integration_outbox').where('service','==','fcm').get();
  for(const doc of records.docs){const value=doc.data();assert.equal(value.simulated,true);assert.equal(value.message.token,undefined);assert.equal(value.message.tokens,undefined);}
  assert.ok(records.docs.some(d=>d.data().operation==='subscribe'));
  assert.equal((await api('/api/notifications/unregister',{session:user,method:'POST',body:{pushKey:token}})).status,200);
  assert.equal((await db.doc('userTokens/recovery-user').get()).data().tokens.includes(token),false);
  await db.doc('users/recovery-user').set({preferences:{notifications:false}},{merge:true});
 });
 await check('scheduled reminder runs against synthetic events and records simulated delivery',async()=>{
  const require=createRequire(new URL('../functions/package.json',import.meta.url));const exported=require('../functions/lib/index.js');
  const start=new Date(Date.now()+38*60000-5*3600000).toISOString(),id='recovery-reminder-'+Date.now();
  await db.doc('events/'+id).set({title:'Recordatorio sintético',date:start.slice(0,10),time:start.slice(11,16),endTime:start.slice(11,16),activeMinistries:['recovery-music']});
  await db.doc('events/'+id+'/assignments/recovery-reminder').set({userId:'recovery-user',areaId:'recovery-music'});
  await db.doc('userTokens/recovery-user').set({tokens:['demo-scheduled-fixture']});await db.doc('users/recovery-user').set({preferences:{notifications:true}},{merge:true});
  const before=(await db.collection('_local_integration_outbox').where('service','==','fcm').get()).size;await exported.attendanceReminders.run({});
  assert.ok((await db.collection('_local_integration_outbox').where('service','==','fcm').get()).size>before);
  await db.doc('userTokens/recovery-user').delete();await db.doc('events/'+id+'/assignments/recovery-reminder').delete();await db.doc('events/'+id).delete();await db.doc('users/recovery-user').set({preferences:{notifications:false}},{merge:true});
 });
 await check('Drive archive adapter preserves bytes locally before cleanup deletes the source',async()=>{
  const require=createRequire(new URL('../functions/package.json',import.meta.url));const sdk=require('firebase-admin');const {createRuntimeDrive}=require('../functions/lib/runtime-services.js');const {archiveOldEventFiles}=require('../functions/lib/cleanup.js');
  const bucket=sdk.storage().bucket(),object=bucket.file('events/recovery-cleanup/materials/fixture.txt'),bytes=Buffer.from('Respaldo sintético exacto');await object.save(bytes,{contentType:'text/plain'});
  const limitedBucket={getFiles:async()=>[[object]]};const drive=createRuntimeDrive(sdk,null);
  const result=await archiveOldEventFiles({bucket:limitedBucket,drive,folderId:'demo-drive-folder',now:new Date(Date.now()+15*86400000),logger:{info(){},warn(){}}});assert.equal(result.archived,1);assert.equal(result.deleted,1);assert.equal((await object.exists())[0],false);
  const archived=await db.collection('_local_integration_outbox').where('service','==','drive').get();const entry=archived.docs.find(d=>d.data().name==='fixture.txt');assert.ok(entry);assert.equal(entry.data().simulated,true);assert.deepEqual((await bucket.file(entry.data().archivePath).download())[0],bytes);
 });
 await check('Google provider emulation creates a client profile and usable backend session',async()=>{
  const postBody='id_token='+encodeURIComponent(JSON.stringify({sub:'recovery-google-provider',email:'recovery.google@example.invalid',name:'Google sintético'}))+'&providerId=google.com';
  const response=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=demo-mci-local-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestUri:'http://localhost',postBody,returnSecureToken:true})});assert.equal(response.status,200);const auth=await response.json();assert.equal(auth.providerId,'google.com');
  const session={idToken:auth.idToken};assert.equal((await clientDocument('users/'+auth.localId,{session,method:'PATCH',data:{uid:auth.localId,email:'recovery.google@example.invalid',name:'Google sintético',role:'user',createdAt:new Date()}})).status,200);
  const login=await api('/api/sessionLogin',{method:'POST',body:{idToken:auth.idToken}});assert.equal(login.status,200);const cookie=login.response.headers.getSetCookie().map(v=>v.split(';')[0]).join('; ');
  assert.equal((await api('/api/me',{session:{...session,cookie,csrf:login.data.csrfToken}})).data.user.uid,auth.localId);
  await db.doc('users/'+auth.localId).delete();await app.auth().deleteUser(auth.localId);
 });
 await check('email registration creates a least-privilege profile and pending request through client rules',async()=>{
  const email='recoveryclient@church.app';try{const prior=await app.auth().getUserByEmail(email);await app.auth().deleteUser(prior.uid);await db.doc('users/'+prior.uid).delete();await db.doc('pending_assignments/'+prior.uid).delete();}catch(error){if(error.code!=='auth/user-not-found')throw error;}
  const response=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-mci-local-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:fixturePassword,returnSecureToken:true})});assert.equal(response.status,200);const identity=await response.json(),session={idToken:identity.idToken};
  assert.equal((await clientDocument('users/'+identity.localId,{session,method:'PATCH',data:{uid:identity.localId,email,name:'Registro sintético',username:'recoveryclient',role:'user',createdAt:new Date()}})).status,200);
  assert.equal((await clientDocument('pending_assignments/'+identity.localId,{session,method:'PATCH',data:{userId:identity.localId,name:'Registro sintético',createdAt:new Date()}})).status,200);
  const login=await api('/api/sessionLogin',{method:'POST',body:{idToken:identity.idToken}});assert.equal(login.status,200);const cookie=login.response.headers.getSetCookie().map(v=>v.split(';')[0]).join('; ');
  const me=await api('/api/me',{session:{...session,cookie,csrf:login.data.csrfToken}});assert.equal(me.data.user.role,'user');assert.deepEqual(me.data.user.assignedMinistries,[]);
  await db.doc('pending_assignments/'+identity.localId).delete();await db.doc('users/'+identity.localId).delete();await app.auth().deleteUser(identity.localId);
 });
 await check('attendance photo and synthetic location persist for all roles and enforce download access',async()=>{
  const require=createRequire(new URL('../functions/package.json',import.meta.url));const image=await require('sharp')({create:{width:6,height:6,channels:3,background:'#245185'}}).png().toBuffer();
  const extra=db.doc('events/recovery-event/assignments/recovery-second-role');await extra.set({userId:'recovery-user',areaId:'recovery-music',roleName:'Segundo rol'});
  const form=new FormData();for(const [k,v]of Object.entries({type:'check-in',attendanceTimeIso:recoveryEventDate+'T15:00:00Z',lat:'0',lng:'0',accuracyMeters:'3',capturedAtMs:String(Date.now())}))form.set(k,v);form.set('file',new Blob([image],{type:'image/png'}),'attendance.png');
  const r=await api('/api/events/recovery-event/assignments/recovery-assignment/attendance/photo',{session:user,method:'POST',body:form});assert.equal(r.status,200);assert.ok(r.data.updated>=2);assert.match(r.data.photoPath,/^attendance\/recovery-event\/recovery-assignment\//);
  for(const id of ['recovery-assignment','recovery-second-role']){const saved=(await db.doc('events/recovery-event/assignments/'+id).get()).data();assert.equal(saved.checkInPhoto,r.data.photoPath);assert.equal(saved.checkInLocation.lat,0);assert.equal(saved.checkInLocation.lng,0);assert.equal(saved.checkInLocation.accuracyMeters,3);}
  const download=base+'/api/download?path='+encodeURIComponent(r.data.photoPath);assert.equal((await fetch(download,{headers:{cookie:other.cookie},redirect:'manual'})).status,403);
  const own=await fetch(download,{headers:{cookie:user.cookie},redirect:'manual'});assert.equal(own.status,200);assert.match(own.headers.get('cache-control'),/no-store/);assert.deepEqual(Buffer.from(await own.arrayBuffer()),image);await extra.delete();
 });
 await check('logout clears session cookies',async()=>{
  const r=await api('/api/sessionLogout',{session:user,method:'POST',body:{}});assert.equal(r.status,200);assert.ok(r.response.headers.getSetCookie().some(x=>x.includes('Max-Age=0')));
 });
});
