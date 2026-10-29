/** Creates a demo administrator. Password input is stdin-only and never part of profile writes/log output. */
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {parseLocalAdminInput,localAdminProfile} from './local-admin-input.mjs';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const admin=require('firebase-admin');
const {Timestamp}=require('firebase-admin/firestore');

export async function createLocalAdmin(input,{sdk=admin,timestamp=()=>Timestamp.now()}={}) {
 const data=parseLocalAdminInput(JSON.stringify(input));
 // Explicit app options and emulator hosts override inherited production environment settings.
 process.env.FIREBASE_AUTH_EMULATOR_HOST='127.0.0.1:9099';
 process.env.FIRESTORE_EMULATOR_HOST='127.0.0.1:8080';
 const project='demo-mci-servidores';
 const app=sdk.initializeApp({projectId:project},'local-admin-setup');
 const email=data.username.toLowerCase()+'@church.app';
 try {
  let user;try{user=await app.auth().getUserByEmail(email);}catch(error){if(error.code!=='auth/user-not-found')throw error;}
  if(user)await app.auth().updateUser(user.uid,{password:data.password,disabled:false});
  else user=await app.auth().createUser({email,password:data.password,displayName:data.name});
  data.password='';input.password='';
  const profileRef=app.firestore().collection('users').doc(user.uid);
  const existing=await profileRef.get();
  await profileRef.set(localAdminProfile(user.uid,data,existing.exists&&existing.data().createdAt?existing.data().createdAt:timestamp()),{merge:true});
  return {project,username:data.username,role:'master_admin',scope:'local emulators only',passwordSavedToFiles:false};
 } finally {data.password='';input.password='';await app.delete();}
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
 let input='';for await(const chunk of process.stdin){input+=chunk;if(Buffer.byteLength(input,'utf8')>16384)throw new Error('Local admin setup input exceeds its limit.');}
 const data=parseLocalAdminInput(input);input='';
 console.log(JSON.stringify(await createLocalAdmin(data)));
}
