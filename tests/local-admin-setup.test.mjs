import test from 'node:test';
import assert from 'node:assert/strict';
import {parseLocalAdminInput,localAdminProfile} from '../scripts/local-admin-input.mjs';
import {createLocalAdmin} from '../scripts/create-local-admin.mjs';
test('local admin setup validates bounded input without echoing credentials',()=>{
 for(const input of ['null','[]','not-json',JSON.stringify({username:'ab',password:'fixture-password'}),JSON.stringify({username:'test',password:'x'}),' '.repeat(17000)])assert.throws(()=>parseLocalAdminInput(input));
 const input=parseLocalAdminInput(JSON.stringify({username:' Fixture.Admin ',password:'local-fixture-pass',name:' Local Admin ',project:'production-should-be-ignored'}));
 assert.equal(input.username,'Fixture.Admin');assert.equal(input.name,'Local Admin');assert.equal('project'in input,false);
});
test('the profile DTO excludes the password and unknown input fields',()=>{
 const profile=localAdminProfile('local-uid',{username:'Example',password:'local-fixture-pass',name:'Demo'},'timestamp');
 assert.equal(profile.role,'master_admin');assert.equal(profile.email,'example@church.app');assert.equal('password'in profile,false);assert.equal(JSON.stringify(profile).includes('local-fixture-pass'),false);
});
test('setup overrides production hints, preserves createdAt and excludes credentials from profile/output',async()=>{
 const keys=['FIREBASE_AUTH_EMULATOR_HOST','FIRESTORE_EMULATOR_HOST','GCLOUD_PROJECT'];
 const previous=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
 process.env.GCLOUD_PROJECT='production-example';process.env.FIREBASE_AUTH_EMULATOR_HOST='external.example:9099';process.env.FIRESTORE_EMULATOR_HOST='external.example:8080';
 let options,stored,closed=false,authWrite=false;
 const profile={get:async()=>({exists:true,data:()=>({createdAt:'original-time'})}),set:async data=>{stored=data;}};
 const app={auth:()=>({getUserByEmail:async()=>({uid:'demo-user'}),updateUser:async()=>{authWrite=true;}}),firestore:()=>({collection:()=>({doc:()=>profile})}),delete:async()=>{closed=true;}};
 const sdk={initializeApp:configuration=>{options=configuration;assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9099');assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8080');return app;}};
 const input={username:'Fixture.Admin',password:'local-fixture-pass',project:'production-example'};
 try {
  const output=await createLocalAdmin(input,{sdk,timestamp:()=>{throw Error('Do not replace createdAt');}});
  assert.deepEqual(options,{projectId:'demo-mci-servidores'});assert.equal(authWrite,true);assert.equal(closed,true);
  assert.equal(stored.createdAt,'original-time');assert.equal(stored.role,'master_admin');assert.equal('password'in stored,false);assert.equal(JSON.stringify(output).includes('local-fixture-pass'),false);assert.equal(input.password,'');
 }finally{for(const key of keys){if(previous[key]===undefined)delete process.env[key];else process.env[key]=previous[key];}}
});
