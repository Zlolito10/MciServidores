import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const admin=require('firebase-admin');
const {Timestamp}=require('firebase-admin/firestore');
export const project='demo-mci-servidores';
export const fixturePassword='LocalDemo-Mci-2026!';
export const recoveryEventDate=new Date(Date.now()+24*60*60*1000).toISOString().slice(0,10);
export const fixtures=[
 {uid:'recovery-admin',username:'recoveryadmin',role:'master_admin',name:'Administrador local',assignedMinistries:['recovery-music'],areas:['Alabanza']},
 {uid:'recovery-user',username:'recoveryuser',role:'user',name:'Servidor local',assignedMinistries:['recovery-music'],areas:['Alabanza']},
 {uid:'recovery-other',username:'recoveryother',role:'user',name:'Otro servidor local',assignedMinistries:['recovery-welcome'],areas:['Bienvenida']},
 {uid:'recovery-ministry',username:'recoveryministry',role:'ministry_admin_recovery-music',name:'Responsable local',assignedMinistries:['recovery-music'],areas:['Alabanza']},
 {uid:'recovery-pending',username:'recoverypending',role:'user',name:'Solicitud local pendiente',assignedMinistries:[],areas:[]},
];
export async function seedEmulators(){
 process.env.FIREBASE_AUTH_EMULATOR_HOST='127.0.0.1:9099';
 process.env.FIRESTORE_EMULATOR_HOST='127.0.0.1:8080';
 const app=admin.apps.find(a=>a.name==='recovery-fixtures')||admin.initializeApp({projectId:project},'recovery-fixtures');
 const db=app.firestore();
 const {syncUserDirectory,userDirectoryEntry}=require('./lib/user-directory.js');
 for(const fixture of fixtures){
  const email=fixture.username+'@church.app';
  try{await app.auth().getUser(fixture.uid);}catch(error){if(error.code!=='auth/user-not-found')throw error;await app.auth().createUser({uid:fixture.uid,email,password:fixturePassword});}
  await db.collection('users').doc(fixture.uid).set({...fixture,email,preferences:{notifications:false},createdAt:Timestamp.now()});
  await syncUserDirectory({db,userId:fixture.uid,timestamp:Timestamp.now()});
 }
 // Seed complete demo caches deterministically; a source write alone does not
 // prove that its asynchronous trigger has reached a shared aggregate cache.
 const profiles=await db.collection('users').get();
 await db.doc('app_cache/users').set({items:profiles.docs.map(doc=>({id:doc.id,...doc.data()})),updatedAt:Timestamp.now()});
 await db.doc('app_cache/user_directory').set({items:profiles.docs.map(doc=>userDirectoryEntry(doc.id,doc.data())),schemaVersion:1,updatedAt:Timestamp.now()});
 const perms=['view_dashboard','manage_users','manage_roles','manage_events','view_events','manage_services','view_reports'];
 await db.collection('roles').doc('master_admin').set({name:'Administrador',permissions:perms});
 await db.collection('roles').doc('user').set({name:'Servidor',permissions:['view_dashboard','view_events']});
 await db.collection('roles').doc('ministry_admin_recovery-music').set({name:'Responsable de Alabanza',permissions:['view_dashboard','view_events','manage_ministry_events','manage_ministry_users','view_ministry_attendance']});
 await db.collection('service_areas').doc('recovery-music').set({name:'Alabanza',description:'Ministerio de prueba local',active:true});
 await db.collection('service_areas').doc('recovery-welcome').set({name:'Bienvenida',description:'Otro ministerio de prueba',active:true});
 await db.collection('events').doc('recovery-event').set({title:'Servicio de prueba local',date:recoveryEventDate,time:'10:00',endTime:'12:00',serviceTime:'10:00',location:'Entorno local',type:'service',description:'Datos sintéticos de validación',activeMinistries:['recovery-music'],imageUrl:'',imageThumbUrl:'',status:'scheduled',createdBy:'recovery-admin',createdAt:Timestamp.now()});
 await db.doc('events/recovery-event/assignments/recovery-assignment').set({areaId:'recovery-music',areaName:'Alabanza',roleName:'Servidor',userId:'recovery-user',userName:'Servidor local',eventDate:recoveryEventDate});
 // Deterministic demo projection through the actual backend transaction. This
 // does not claim that an asynchronous trigger has already been delivered.
 const {syncAssignmentRoster}=require('./lib/assignment-roster.js');
 await syncAssignmentRoster({db,eventId:'recovery-event',assignmentId:'recovery-assignment'});
 await db.doc('events/recovery-event/repertoire/recovery-song').set({title:'Canción local',key:'C',link:'',notes:'',order:1});
 return {app,db};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const {app}=await seedEmulators();console.log('Synthetic fixtures ready in demo-mci-servidores. No production resources used.');await app.delete();}
