import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const admin=require('firebase-admin');
export const project='demo-mci-servidores';
export const fixturePassword='LocalDemo-Mci-2026!';
export const fixtures=[{uid:'recovery-admin',username:'recoveryadmin',role:'master_admin',name:'Administrador local'},{uid:'recovery-user',username:'recoveryuser',role:'user',name:'Servidor local'},{uid:'recovery-other',username:'recoveryother',role:'user',name:'Otro servidor local'}];
export async function seedEmulators(){
 process.env.FIREBASE_AUTH_EMULATOR_HOST='127.0.0.1:9099';
 process.env.FIRESTORE_EMULATOR_HOST='127.0.0.1:8080';
 const app=admin.apps.find(a=>a.name==='recovery-fixtures')||admin.initializeApp({projectId:project},'recovery-fixtures');
 const db=app.firestore();
 for(const fixture of fixtures){
  const email=fixture.username+'@church.app';
  try{await app.auth().getUser(fixture.uid);}catch(error){if(error.code!=='auth/user-not-found')throw error;await app.auth().createUser({uid:fixture.uid,email,password:fixturePassword});}
  await db.collection('users').doc(fixture.uid).set({...fixture,email,assignedMinistries:['recovery-music'],areas:['Alabanza'],preferences:{notifications:false},createdAt:admin.firestore.Timestamp.now()});
 }
 const perms=['view_dashboard','manage_users','manage_roles','manage_events','view_events','manage_services','view_reports'];
 await db.collection('roles').doc('master_admin').set({name:'Administrador',permissions:perms});
 await db.collection('roles').doc('user').set({name:'Servidor',permissions:['view_dashboard','view_events']});
 await db.collection('service_areas').doc('recovery-music').set({name:'Alabanza',description:'Ministerio de prueba local',active:true});
 await db.collection('events').doc('recovery-event').set({title:'Servicio de prueba local',date:'2026-10-20',time:'10:00',endTime:'12:00',serviceTime:'10:00',location:'Entorno local',type:'service',description:'Datos sintéticos de validación',activeMinistries:['recovery-music'],imageUrl:'',imageThumbUrl:'',status:'scheduled',createdBy:'recovery-admin',createdAt:admin.firestore.Timestamp.now()});
 await db.doc('events/recovery-event/assignments/recovery-assignment').set({areaId:'recovery-music',areaName:'Alabanza',roleName:'Servidor',userId:'recovery-user',userName:'Servidor local',eventDate:'2026-10-20'});
 await db.doc('events/recovery-event/repertoire/recovery-song').set({title:'Canción local',key:'C',link:'',notes:'',order:1});
 return {app,db};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const {app}=await seedEmulators();console.log('Synthetic fixtures ready in demo-mci-servidores. No production resources used.');await app.delete();}
