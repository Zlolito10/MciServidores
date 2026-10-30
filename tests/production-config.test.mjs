import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const json=async file=>JSON.parse(await readFile(new URL('../'+file,import.meta.url),'utf8'));
test('all production deployable resources execute the complete release preflight',async()=>{
 for(const file of ['firebase.json','firebase.production.json']){
  const config=await json(file);
  for(const resource of [config.firestore,config.storage,...config.functions])assert.ok(resource.predeploy.some(hook=>hook.includes('scripts/check-production-release.mjs')&&hook.includes('firebase.production.json')&&!hook.includes('--artifact-only')),file);
 }
 const config=await json('firebase.production.json');assert.equal(config.hosting.public,'dist-production');assert.ok(config.hosting.predeploy.some(hook=>hook.includes('check-production-release.mjs')&&!hook.includes('--artifact-only')));
});
test('fixed-name worker imports are revalidated and public security.txt is not ignored',async()=>{
 const config=await json('firebase.production.json');
 for(const source of ['/firebase-messaging-sw.js','/firebase-messaging-logic.js','/service-worker-config.js','/registerSW.js'])assert.ok(config.hosting.headers.some(rule=>rule.source===source&&rule.headers.some(header=>header.key==='Cache-Control'&&header.value.includes('no-cache'))),source);
 assert.ok(!config.hosting.ignore.includes('**/.*'));
});
test('function archives exclude local credential formats and runtime secret files',async()=>{
 for(const file of ['firebase.json','firebase.production.json']){
  const config=await json(file);
  for(const name of ['.env*','.runtimeconfig.json','*.private.json','credentials*.json','.secret.local','*firebase-adminsdk*.json'])assert.ok(config.functions[0].ignore.includes(name),name);
 }
});
