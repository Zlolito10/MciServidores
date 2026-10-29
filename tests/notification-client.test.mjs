import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import {ensureMessagingWorker,createMessageSubscription,createTokenRequest,requestNotificationPermission,revokeBrowserRegistration} from '../frontend/src/services/notification-runtime.js';

test('native permission requests have a bounded pending state without faking a grant',async()=>{
 let calls=0;await assert.rejects(requestNotificationPermission({permission:'default',requestPermission:()=>{calls++;return new Promise(()=>{});}},{timeoutMs:5}),/NOTIFICATION_PERMISSION_PENDING/);assert.equal(calls,1);
 assert.equal(await requestNotificationPermission({permission:'denied',requestPermission:()=>{throw Error('Unexpected prompt');}}),'denied');
 assert.equal(await requestNotificationPermission({permission:'granted',requestPermission:()=>{throw Error('Unexpected prompt');}}),'granted');
});

test('logout removes only this browser token and keeps other devices and accounts',async()=>{
 const users=new Map([['a',new Set(['browser-a','phone-a'])],['b',new Set(['browser-b'])]]);const deleted=[],cleared=[];
 const result=await revokeBrowserRegistration({getStoredToken:async()=>({token:'browser-a'}),unregisterToken:async token=>users.get('a').delete(token),deleteToken:async token=>deleted.push(token),clearStoredToken:async()=>cleared.push(true),unsubscribePush:async()=>{}});
 assert.deepEqual([...users.get('a')],['phone-a']);assert.deepEqual([...users.get('b')],['browser-b']);assert.deepEqual(deleted,['browser-a']);assert.equal(result.remoteDeleted,true);assert.equal(result.localCleared,true);assert.equal(cleared.length,1);
});

test('logout still retires local subscription when remote SDK deletion fails or hangs',async()=>{
 for(const deletion of [async()=>{throw Error('SDK failed');},()=>new Promise(()=>{})]){
  let cleared=false,unsubscribed=false;
  const result=await revokeBrowserRegistration({getStoredToken:async()=>({token:'browser-a',subscriptionOptions:{swScope:'http://localhost/'}}),unregisterToken:async()=>{},deleteToken:deletion,clearStoredToken:async()=>cleared=true,unsubscribePush:async scope=>{assert.equal(scope,'http://localhost/');unsubscribed=true;},timeoutMs:5});
  assert.equal(result.remoteDeleted,false);assert.equal(result.unregistered,true);assert.equal(cleared,true);assert.equal(unsubscribed,true);
 }
});

test('the actual AuthProvider logout retires notifications before losing cookie and Firebase identity',async()=>{
 const source=await readFile(new URL('../frontend/src/auth/AuthProvider.jsx',import.meta.url),'utf8');let callback;
 traverse(parse(source,{sourceType:'module',plugins:['jsx']}),{VariableDeclarator(p){if(p.node.id.name==='L'&&p.node.init?.type==='CallExpression'&&p.node.init.arguments[0]?.async)callback=source.slice(p.node.init.arguments[0].start,p.node.init.arguments[0].end);}});
 assert.ok(callback);callback=callback.replace(/import\(["']\.\.\/services\/notifications\.js["']\)/,'loadNotifications()');
 const actions=[];let release;const cleanup=new Promise(resolve=>release=resolve),firebaseAuth={currentUser:{uid:'account-a'}};
 const env={firebaseAuth,r:{uid:'account-a'},a:{uid:'account-a'},loadNotifications:async()=>({revokeBrowserNotifications:async uid=>{actions.push('revoke:'+uid);await cleanup;}}),p:{current:false},u:{current:true},bffFetch:async route=>actions.push(route),Y:()=>{},is:async()=>{actions.push('firebase-sign-out');firebaseAuth.currentUser=null;},n:()=>{},l:()=>{},document:{cookie:''},console:{warn:()=>{},error:()=>{}}};
 const logout=new Function('env','const {firebaseAuth,r,a,loadNotifications,p,u,bffFetch,Y,is,n,l,document,console}=env;return ('+callback+');')(env);
 const pending=logout();await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(actions,['revoke:account-a']);assert.equal(firebaseAuth.currentUser.uid,'account-a');release();await pending;assert.deepEqual(actions,['revoke:account-a','/api/sessionLogout','firebase-sign-out']);assert.equal(firebaseAuth.currentUser,null);
});

test('messaging worker activation is bounded and rejects redundant installations',async()=>{
 const original=globalThis.location;globalThis.location={origin:'http://localhost:5182'};
 try {
  const listeners=new Set();const worker={scriptURL:'http://localhost:5182/firebase-messaging-sw.js',state:'installing',addEventListener:(_,fn)=>listeners.add(fn),removeEventListener:(_,fn)=>listeners.delete(fn),postMessage:()=>{}};
  const registration={installing:worker};const container={getRegistrations:async()=>[registration]};
  const rejected=ensureMessagingWorker(container,{timeoutMs:20});
  await assert.rejects(rejected,/MESSAGING_WORKER_TIMEOUT/);assert.equal(listeners.size,0);
  const redundant=ensureMessagingWorker(container,{timeoutMs:100});await Promise.resolve();await Promise.resolve();worker.state='redundant';for(const fn of listeners)fn();await assert.rejects(redundant,/REDUNDANT/);assert.equal(listeners.size,0);
  worker.state='activated';registration.active=worker;assert.equal(await ensureMessagingWorker(container),registration);
 } finally {globalThis.location=original;}
});

test('foreground subscription survives multiple consumers and a cancelled initialization',async()=>{
 let resolveMessaging;let active=0,receivedA=0,receivedB=0,dispatch;
 const ready=new Promise(resolve=>resolveMessaging=resolve);
 const subscribe=createMessageSubscription(()=>ready,(_,callback)=>{active++;dispatch=callback;return()=>active--;});
 const cancel=subscribe(()=>{throw Error('Unmounted callback called');});cancel();resolveMessaging({});await new Promise(resolve=>setImmediate(resolve));assert.equal(active,0);
 const stopA=subscribe(()=>receivedA++),stopB=subscribe(()=>receivedB++);await new Promise(resolve=>setImmediate(resolve));assert.equal(active,1);dispatch({});assert.equal(receivedA,1);assert.equal(receivedB,1);
 stopB();dispatch({});assert.equal(receivedA,2);assert.equal(receivedB,1);assert.equal(active,1);stopA();assert.equal(active,0);
});

test('token refresh never prompts without permission, deduplicates requests and backs off aborts',async()=>{
 let permission='default',calls=0,time=1000,resolveToken;
 const request=createTokenRequest({getPermission:()=>permission,getMessaging:async()=>({}),getRegistration:async()=>({}),requestToken:()=>{calls++;return new Promise(resolve=>resolveToken=resolve);},now:()=>time});
 assert.equal(await request(),null);assert.equal(calls,0);permission='granted';const first=request(),second=request();assert.equal(first,second);await new Promise(resolve=>setImmediate(resolve));resolveToken('synthetic-token');assert.equal(await first,'synthetic-token');assert.equal(calls,1);
 const aborted=createTokenRequest({getPermission:()=>permission,getMessaging:async()=>({}),getRegistration:async()=>({}),requestToken:async()=>{calls++;throw Object.assign(new Error(),{name:'AbortError'});},now:()=>time});
 assert.equal(await aborted(),null);assert.equal(await aborted(),null);assert.equal(calls,2);time+=600001;await aborted();assert.equal(calls,3);
});

async function hookFixture({token=null,register=async()=>{}}={}) {
 const effects=[],state=[];let index=0;
 const React={useState:initial=>{const at=index++;state[at]=typeof initial==='function'?initial():initial;return[state[at],value=>state[at]=value];},useRef:value=>({current:value}),useCallback:fn=>fn,useEffect:fn=>effects.push(fn)};
 const noop=()=>{};
 const source=(await readFile(new URL('../frontend/src/hooks/useNotifications.js',import.meta.url),'utf8')).replace(/^import .+;\r?\n/gm,'').replace(/^export .+;?\r?$/gm,'');
 const context=vm.createContext({React,useAuth:()=>({user:{uid:'synthetic-user'},userProfile:{preferences:{notifications:true}}}),isBffEnabled:()=>false,y:()=>true,O:()=> 'granted',D:async()=>true,U:()=>noop,W:async()=>({success:false}),v:async()=>token,q:async()=>{},k:register,x:noop,window:{matchMedia:()=>({matches:false}),navigator:{},addEventListener:noop,removeEventListener:noop},navigator:{userAgent:''},document:{visibilityState:'visible',addEventListener:noop,removeEventListener:noop},Notification:{permission:'granted'},console});
 vm.runInContext(source+'\nglobalThis.renderHook = useNotifications;',context);context.renderHook();for(const effect of effects)effect();
 await new Promise(resolve=>setImmediate(resolve));return{state};
}

test('notification UI never treats browser permission as successful token registration',async()=>{
 const failed=await hookFixture();assert.equal(failed.state[2],false);
 let release;const registered=new Promise(resolve=>release=resolve);
 const pending=await hookFixture({token:'synthetic-token',register:()=>registered});assert.equal(pending.state[2],false);
 release();await new Promise(resolve=>setImmediate(resolve));assert.equal(pending.state[2],true);
});
