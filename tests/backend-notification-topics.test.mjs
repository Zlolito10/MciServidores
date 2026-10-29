import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {syncUserTokenTopics}=require('../functions/lib/notification-topics.js');
function messaging(){const calls=[];return {calls,subscribeToTopic:async(tokens,topic)=>{calls.push({operation:'subscribe',tokens,topic});return {successCount:tokens.length,failureCount:0};},unsubscribeFromTopic:async(tokens,topic)=>{calls.push({operation:'unsubscribe',tokens,topic});return {successCount:tokens.length,failureCount:0};}};}

test('token arrayRemove unsubscribes removed devices and subscribes only added ones',async()=>{
 const sdk=messaging();const result=await syncUserTokenTopics({messaging:sdk,userId:'fixture-user',before:{tokens:['old','kept']},after:{tokens:['kept','new']}});
 assert.deepEqual(sdk.calls,[{operation:'unsubscribe',tokens:['old'],topic:'user_fixture-user'},{operation:'unsubscribe',tokens:['old'],topic:'all_users'},{operation:'subscribe',tokens:['new'],topic:'user_fixture-user'},{operation:'subscribe',tokens:['new'],topic:'all_users'}]);
 assert.deepEqual(result,{addedTokens:1,removedTokens:1,topicCalls:4,failedSubscriptions:0});
});

test('deleting or emptying a token document revokes all prior topic subscriptions',async()=>{
 for(const after of [undefined,{tokens:[]},{tokens:null}]){const sdk=messaging();const result=await syncUserTokenTopics({messaging:sdk,userId:'fixture',before:{tokens:['one','two']},after});assert.equal(result.removedTokens,2);assert.equal(sdk.calls.length,2);assert.ok(sdk.calls.every(call=>call.operation==='unsubscribe'));}
});

test('unchanged documents do not resubscribe and legacy scalar tokens remain supported',async()=>{
 const sdk=messaging();await syncUserTokenTopics({messaging:sdk,userId:'fixture',before:{tokens:['same','same',null,'']},after:{tokens:'same'}});assert.deepEqual(sdk.calls,[]);
 const created=await syncUserTokenTopics({messaging:sdk,userId:'fixture',after:{tokens:'new'}});assert.equal(created.addedTokens,1);assert.equal(sdk.calls.length,2);
});

test('topic changes split more than 1000 devices into supported API batches',async()=>{
 const sdk=messaging();const result=await syncUserTokenTopics({messaging:sdk,userId:'fixture',after:{tokens:Array.from({length:1001},(_,i)=>'demo-'+i)}});
 assert.equal(result.addedTokens,1001);assert.deepEqual(sdk.calls.map(call=>call.tokens.length),[1000,1000,1,1]);
});

test('topic API failures do not become false success or disclose SDK registration tokens',async()=>{
 const sdk=messaging();sdk.subscribeToTopic=async()=>{throw Error('Sensitive demo-token-value');};
 await assert.rejects(syncUserTokenTopics({messaging:sdk,userId:'fixture',after:{tokens:['demo-token-value']}}),error=>error.message==='FCM_TOPIC_SYNC_FAILED'&&!error.stack.includes('demo-token-value'));
 const partial=messaging();partial.subscribeToTopic=async()=>({successCount:0,failureCount:1});assert.equal((await syncUserTokenTopics({messaging:partial,userId:'fixture',after:{tokens:['invalid-demo']}})).failedSubscriptions,2);
});
