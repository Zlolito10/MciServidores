import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createSiteServer} from '../scripts/serve.mjs';
import {verifyHosting} from '../scripts/verify.mjs';
async function fixture(t,options){const server=await createSiteServer(options);await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>{server.close(r);server.closeAllConnections();}));return 'http://127.0.0.1:'+server.address().port;}
test('published snapshot is complete and matches its hashes',async()=>{assert.equal((await verifyHosting()).files.length,47);});
test('HTML navigation loads login',async t=>{const origin=await fixture(t);const r=await fetch(origin+'/login',{headers:{Accept:'text/html'}});assert.equal(r.status,200);assert.match(await r.text(),/MCI Servidores/);});
test('missing scripts never return SPA HTML',async t=>{const origin=await fixture(t);assert.equal((await fetch(origin+'/assets/missing.js',{headers:{Accept:'text/html'}})).status,404);});
test('unknown non-navigation paths return 404',async t=>{const origin=await fixture(t);assert.equal((await fetch(origin+'/unknown',{headers:{Accept:'application/json'}})).status,404);});
test('unconfigured backend is blocked',async t=>{const origin=await fixture(t);const r=await fetch(origin+'/api/me');assert.equal(r.status,503);assert.equal((await r.json()).error,'backend_not_configured');});
test('encoded traversal cannot disclose workspace files',async t=>{const origin=await fixture(t);assert.equal((await fetch(origin+'/%2e%2e%2fpackage.json')).status,404);});
test('HEAD has correct MIME and no response body',async t=>{const origin=await fixture(t);const r=await fetch(origin+'/assets/index-BU_ZgoWo.js',{method:'HEAD'});assert.equal(r.status,200);assert.match(r.headers.get('Content-Type'),/javascript/);assert.equal(await r.text(),'');});
test('static content rejects writes',async t=>{const origin=await fixture(t);assert.equal((await fetch(origin+'/index.html',{method:'POST',body:'test'})).status,405);});
test('local emulator proxy preserves prefix, method and body',async t=>{
 const upstream=http.createServer((req,res)=>{let body='';req.on('data',b=>body+=b);req.on('end',()=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({path:req.url,method:req.method,body}));});});await new Promise(r=>upstream.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>upstream.close(r)));
 const origin=await fixture(t,{apiOrigin:'http://127.0.0.1:'+upstream.address().port+'/demo/us-central1/serverApi'});const r=await fetch(origin+'/api/check',{method:'POST',body:'fixture'});assert.deepEqual(await r.json(),{path:'/demo/us-central1/serverApi/api/check',method:'POST',body:'fixture'});
});
