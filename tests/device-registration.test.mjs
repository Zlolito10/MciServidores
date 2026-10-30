import test from 'node:test';
import assert from 'node:assert/strict';
import {registerBoundedDevice} from '../frontend/src/services/device-registration.js';
test('a known device needs no write, even in an oversized legacy list',async()=>{
 let writes=0;await registerBoundedDevice({token:'known',readTokens:async()=>['known',...Array.from({length:12},(_,i)=>'old'+i)],writeToken:async()=>writes++});assert.equal(writes,0);
});
test('a full device list explains its limit before creating any write',async()=>{
 let writes=0;await assert.rejects(registerBoundedDevice({token:'new',readTokens:async()=>Array.from({length:10},(_,i)=>'old'+i),writeToken:async()=>writes++}),{code:'DEVICE_LIMIT_REACHED'});assert.equal(writes,0);
});
test('a concurrent tenth registration is explained without masking unrelated permission errors',async()=>{
 let reads=0;await assert.rejects(registerBoundedDevice({token:'new',readTokens:async()=>Array.from({length:++reads===1?9:10},(_,i)=>'old'+i),writeToken:async()=>{throw Object.assign(new Error('denied'),{code:'permission-denied'});}}),{code:'DEVICE_LIMIT_REACHED'});
 const denied=Object.assign(new Error('denied'),{code:'permission-denied'});await assert.rejects(registerBoundedDevice({token:'new',readTokens:async()=>[],writeToken:async()=>{throw denied;}}),error=>error===denied);
});
