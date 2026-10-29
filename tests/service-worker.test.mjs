import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {buildServiceWorker} from '../scripts/build-service-worker.mjs';
import vm from 'node:vm';
const logic=await readFile(new URL('../frontend/public/firebase-messaging-logic.js',import.meta.url),'utf8');
const worker=await readFile(new URL('../frontend/public/firebase-messaging-sw.js',import.meta.url),'utf8');
function setup({windows=[],fetchImpl,assets=['/index.html','/app/entry.js']}={}) {
 const handlers={},shown=[],opened=[],messages=[],cached=[],deleted=[],requests=[];
 const self={location:{origin:'https://mci.test'},__MCI_SW_CONFIG__:{version:'test-v1',assets},addEventListener:(event,handler)=>{handlers[event]=handler;},skipWaiting:async()=>{},registration:{showNotification:async(title,options)=>shown.push({title,options})},clients:{matchAll:async()=>windows,openWindow:async url=>opened.push(url),claim:async()=>{}}};
 const caches={open:async()=>({put:async asset=>cached.push(asset),match:async url=>url==='/index.html'?new Response('offline app'):undefined}),keys:async()=>['other-site-cache','mci-recovery-static-old','mci-recovery-static-test-v1'],delete:async key=>deleted.push(key)};
 const context=vm.createContext({self,URL,Map,Date,Request,Response,caches,fetch:async request=>{requests.push(request);if(fetchImpl)return fetchImpl(request);throw new Error('offline');},importScripts:()=>{}});
 vm.runInContext(logic,context);vm.runInContext(worker,context);
 async function fire(name,event={}) {let pending;handlers[name]({...event,waitUntil:p=>pending=p});await pending;}
 return {self,handlers,shown,opened,messages,cached,deleted,requests,fire};
}
test('background data-only FCM message displays title, body and safe route',async()=>{const x=setup();await x.self.MciMessaging.receive({data:{title:'Evento',body:'Nueva asignación',url:'/dashboard/events/123'},messageId:'one'});assert.equal(x.shown[0].title,'Evento');assert.equal(x.shown[0].options.body,'Nueva asignación');assert.equal(x.shown[0].options.data.url,'https://mci.test/dashboard/events/123');});
test('notification payload is shown once and message IDs deduplicate',async()=>{const x=setup();const payload={notification:{title:'Título',body:'Cuerpo'},messageId:'same'};await x.self.MciMessaging.receive(payload);await x.self.MciMessaging.receive(payload);assert.equal(x.shown.length,1);assert.equal(x.shown[0].title,'Título');});
test('visible clients receive the original Firebase onMessage envelope',async()=>{const messages=[];const x=setup({windows:[{visibilityState:'visible',postMessage:m=>messages.push(m)}]});await x.self.MciMessaging.receive({data:{title:'Foreground'}});assert.equal(x.shown.length,0);assert.equal(messages[0].isFirebaseMessaging,true);assert.equal(messages[0].messageType,'push-received');});
test('untrusted links stay within the application origin',()=>{const x=setup();for(const u of ['https://evil.test/','javascript:alert(1)','//evil.test/','https://user:password@mci.test/dashboard'])assert.equal(x.self.MciMessaging.sameOriginUrl(u),'https://mci.test/dashboard');});
test('notification clicks focus and navigate an existing application window',async()=>{let closed=false,navigated,focused=false;const x=setup({windows:[{url:'https://mci.test/dashboard',navigate:async u=>{navigated=u;},focus:async()=>focused=true,postMessage:()=>{}}]});await x.self.MciMessaging.clicked({notification:{close:()=>closed=true,data:{url:'/dashboard/events/one'}}});assert.ok(closed&&focused);assert.equal(navigated,'https://mci.test/dashboard/events/one');assert.equal(x.opened.length,0);});
test('a click opens a new safe window when no app window exists',async()=>{const x=setup();await x.self.MciMessaging.clicked({notification:{close:()=>{},data:{url:'https://evil.test'}}});assert.deepEqual(x.opened,['https://mci.test/dashboard']);});
test('malformed push data does not crash the worker',async()=>{const x=setup();await x.fire('push',{data:{json:()=>{throw Error('bad');}}});assert.equal(x.shown.length,0);});
test('install precaches anonymous static assets without cookies or redirects',async()=>{const x=setup({fetchImpl:request=>new Response('public asset',{headers:{'Content-Type':request.url.endsWith('.html')?'text/html':'text/javascript'}})});await x.fire('install');assert.deepEqual(x.cached,['/index.html','/app/entry.js']);for(const r of x.requests){assert.equal(r.credentials,'omit');assert.equal(r.redirect,'error');assert.equal(r.cache,'reload');}});
test('activation removes only obsolete MCI caches',async()=>{const x=setup();await x.fire('activate');assert.deepEqual(x.deleted,['mci-recovery-static-old']);});
test('worker exposes its build version using the existing message port protocol',async()=>{const x=setup();let version;await x.fire('message',{data:{type:'GET_VERSION'},ports:[{postMessage:x=>version=x.version}]});assert.equal(version,'test-v1');});
test('API, comments, version checks, writes and other origins bypass caches',()=>{const x=setup();for(const [url,method] of [['/api/me','GET'],['/%61pi/me','GET'],['/comments/react','GET'],['/app-version.json','GET'],['/app/entry.js','POST'],['https://firestore.googleapis.com/a','GET']]){let intercepted=false;x.handlers.fetch({request:{method,url:new URL(url,'https://mci.test').href,mode:'cors'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);}});
test('offline application navigation falls back to the cached shell',async()=>{const x=setup();let response;x.handlers.fetch({request:{method:'GET',url:'https://mci.test/dashboard/events/one',mode:'navigate'},respondWith:p=>response=p});assert.equal(await (await response).text(),'offline app');});

test('silent DATA_CHANGED refreshes clients without generating empty notifications',async()=>{const messages=[];const x=setup({windows:[{visibilityState:'hidden',postMessage:m=>messages.push(m)}]});await x.self.MciMessaging.receive({data:{type:'DATA_CHANGED',resources:'["events"]'}});assert.equal(x.shown.length,0);assert.equal(messages[0].data.type,'DATA_CHANGED');assert.equal(messages[0].messageType,'push-received');});

test('wire-format FCM message ids deduplicate background displays',async()=>{const x=setup();const payload={fcm_message_id:'wire-id',data:{title:'Hello'}};await x.self.MciMessaging.receive(payload);await x.self.MciMessaging.receive(payload);assert.equal(x.shown.length,1);});

test('failed client navigation falls back to a safe opened window',async()=>{const x=setup({windows:[{url:'https://mci.test/dashboard',navigate:async()=>{throw Error('Closed client');},focus:async()=>{},postMessage:()=>{}}]});await x.self.MciMessaging.clicked({notification:{close:()=>{},data:{url:'/dashboard/events/test'}}});assert.deepEqual(x.opened,['https://mci.test/dashboard/events/test']);});

test('notification click messaging targets the new client returned by navigation',async()=>{let focused=false,posted;const destination={focus:async()=>{focused=true;},postMessage:message=>{posted=message;}};const x=setup({windows:[{url:'https://mci.test/dashboard',navigate:async()=>destination,focus:async()=>{throw Error('Old client used');},postMessage:()=>{throw Error('Old client used');}}]});await x.self.MciMessaging.clicked({notification:{close:()=>{},data:{url:'/dashboard/events/test',FCM_MSG:{data:{eventId:'test'}}}}});assert.equal(focused,true);assert.equal(posted.messageType,'notification-clicked');assert.equal(posted.data.eventId,'test');});

test('private, cookie-setting, failed and invalid-MIME shells are rejected',async()=>{
 for(const response of [new Response('private',{headers:{'Content-Type':'text/html','Cache-Control':'private'}}),new Response('cookie',{headers:{'Content-Type':'text/html','Set-Cookie':'session=private'}}),new Response('error',{status:401}),new Response('{}',{headers:{'Content-Type':'application/json'}})]){
  const x=setup({assets:['/index.html'],fetchImpl:()=>response});await assert.rejects(x.fire('install'));assert.deepEqual(x.cached,[]);
 }
});

test('backend paths cannot be smuggled into the public cache manifest',async()=>{for(const asset of ['/api/private.js','/%61pi/private.js','//other.test/public.js','/private/.env.js']){const x=setup({assets:[asset]});await assert.rejects(x.fire('install'),/Invalid public cache asset/);assert.deepEqual(x.requests,[]);}});

test('worker build tracks shell changes, release version and excludes private paths',async()=>{
 const temporary=await mkdtemp(path.join(tmpdir(),'mci-sw-test-'));
 try{
  await mkdir(path.join(temporary,'app'));await mkdir(path.join(temporary,'api'));await mkdir(path.join(temporary,'.private'));await mkdir(path.join(temporary,'comments'));await mkdir(path.join(temporary,'__browser-tests'));
  await writeFile(path.join(temporary,'index.html'),'<html>Public shell</html>');await writeFile(path.join(temporary,'app/entry.js'),'console.log("public")');await writeFile(path.join(temporary,'api/private.js'),'secret');await writeFile(path.join(temporary,'.private/secret.js'),'secret');await writeFile(path.join(temporary,'comments/private.js'),'secret');await writeFile(path.join(temporary,'__browser-tests/camera.js'),'test fixture');await writeFile(path.join(temporary,'app-version.json'),'{"version":"2.3.4"}');
  const first=await buildServiceWorker({destination:temporary});assert.ok(first.version.startsWith('2.3.4-reconstructed-'));
  const settings=await readFile(path.join(temporary,'service-worker-config.js'),'utf8');for(const privatePath of ['/api/','/.private/','/comments/','/__browser-tests/'])assert.equal(settings.includes(privatePath),false);
  assert.equal((await buildServiceWorker({destination:temporary})).version,first.version);
  await writeFile(path.join(temporary,'index.html'),'<html>New public shell</html>');assert.notEqual((await buildServiceWorker({destination:temporary})).version,first.version);
 }finally{
  if(!temporary.startsWith(path.resolve(tmpdir())+path.sep)||!path.basename(temporary).startsWith('mci-sw-test-'))throw Error('Unsafe cleanup target');
  await rm(temporary,{recursive:true,force:true});
 }
});
