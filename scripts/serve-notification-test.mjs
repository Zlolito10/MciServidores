/** Explicit local, single-device FCM test. Never registers tokens in Firestore. */
import {createRequire} from 'node:module';
import {randomUUID,timingSafeEqual} from 'node:crypto';
import {writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {createSiteServer} from './serve.mjs';
const {values}=parseArgs({options:{port:{type:'string',default:'5182'},account:{type:'string'},'firebase-cli':{type:'string'},'delay-ms':{type:'string',default:'0'}}});
const port=Number(values.port);if(!Number.isInteger(port)||port<1024||port>65535)throw Error('INVALID_LOCAL_PORT');
const delayMs=Number(values['delay-ms']);if(!Number.isInteger(delayMs)||delayMs<0||delayMs>15000)throw Error('INVALID_DELIVERY_DELAY');
const cli=values['firebase-cli']||process.env.FIREBASE_TOOLS_PATH;
if(!values.account||!cli)throw Error('Pass --account and --firebase-cli (or FIREBASE_TOOLS_PATH) for the existing authorized CLI session.');
const require=createRequire(import.meta.url),library=path.dirname(path.dirname(path.resolve(cli)));
require(path.join(library,'logger.js')).logger.silent=true;
const auth=require(path.join(library,'auth.js'));
const account=auth.getAllAccounts().find(value=>value.user?.email===values.account);
if(!account?.tokens?.refresh_token)throw Error('EXISTING_CLI_ACCOUNT_UNAVAILABLE');
const origin='http://127.0.0.1:'+port,nonce=randomUUID();let used=false;
const report={project:'mcimachala-servidor',startedAt:new Date().toISOString(),target:'one explicitly consenting browser on this loopback fixture',productionDeployments:0,firestoreWrites:0,deliveryRequests:0};
const server=await createSiteServer({root:path.resolve('dist')});
const staticHandlers=server.listeners('request');server.removeAllListeners('request');
function json(response,status,data){if(response.destroyed||response.writableEnded)return;response.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});response.end(JSON.stringify(data));}
function sameNonce(value){const a=Buffer.from(String(value||'')),b=Buffer.from(nonce);return a.length===b.length&&timingSafeEqual(a,b);}
server.on('request',async(request,response)=>{
 const route=(request.url||'').split('?')[0];
 if(route==='/__browser-tests/fcm-session'){
  if(request.method!=='GET'||request.headers.host!==new URL(origin).host||request.headers['sec-fetch-site']==='cross-site')return json(response,403,{error:'LOCAL_ORIGIN_REQUIRED'});
  return json(response,200,{nonce,deliveryAlreadyRequested:used,delayMs});
 }
 if(route!=='/__browser-tests/fcm-self-test'){for(const handler of staticHandlers)handler.call(server,request,response);return;}
 if(request.method!=='POST'||request.headers.origin!==origin||!sameNonce(request.headers['x-mci-test-nonce'])||!/^application\/json(?:;|$)/i.test(request.headers['content-type']||''))return json(response,403,{error:'EXPLICIT_LOCAL_REQUEST_REQUIRED'});
 if(used)return json(response,409,{error:'SINGLE_DEVICE_TEST_ALREADY_REQUESTED'});
 let body='';try{for await(const bytes of request){body+=bytes;if(Buffer.byteLength(body)>8192)return json(response,413,{error:'REQUEST_TOO_LARGE'});}}catch{return json(response,400,{error:'INVALID_REQUEST'});}
 let token;try{const input=JSON.parse(body);if(input.consent!==true||typeof input.token!=='string'||input.token.length<20||input.token.length>4096)return json(response,400,{error:'EXPLICIT_DEVICE_TOKEN_REQUIRED'});token=input.token;}catch{return json(response,400,{error:'INVALID_REQUEST'});}
 used=true;report.deliveryRequests=1;report.requestedAt=new Date().toISOString();report.deliveryDelayMs=delayMs;
 try{
  if(delayMs)await new Promise(resolve=>setTimeout(resolve,delayMs));
  const credential=await auth.getAccessToken(account.tokens.refresh_token,['email','openid','https://www.googleapis.com/auth/cloudplatformprojects.readonly','https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/firebase']);
  const result=await fetch('https://fcm.googleapis.com/v1/projects/mcimachala-servidor/messages:send',{method:'POST',headers:{Authorization:'Bearer '+credential.access_token,'Content-Type':'application/json'},body:JSON.stringify({message:{token,data:{title:'Prueba MCI en este navegador',body:'Aviso sintético solicitado desde la fixture local.',url:'/__browser-tests/notifications.html#self-test',type:'RECOVERY_SELF_TEST'},webpush:{headers:{TTL:'60'}}}}),redirect:'error',signal:AbortSignal.timeout(25000)});
  const data=await result.json();const fcmErrorCode=data.error?.details?.find(detail=>detail['@type']==='type.googleapis.com/google.firebase.fcm.v1.FcmError')?.errorCode||null;const genericReason=fcmErrorCode==='UNREGISTERED'?'DEVICE_REGISTRATION_UNAVAILABLE':fcmErrorCode==='SENDER_ID_MISMATCH'?'PROJECT_SENDER_MISMATCH':data.error?.status==='NOT_FOUND'?'DESTINATION_NOT_FOUND':result.ok?null:'FCM_REJECTED_REQUEST';Object.assign(report,{httpStatus:result.status,serverAccepted:result.ok,errorStatus:data.error?.status||null,fcmErrorCode,genericReason});
  json(response,result.ok?200:502,{serverAccepted:result.ok,httpStatus:result.status,errorStatus:data.error?.status||null,fcmErrorCode,genericReason});
 }catch{Object.assign(report,{serverAccepted:false,errorStatus:'FCM_REQUEST_FAILED'});json(response,502,{serverAccepted:false,errorStatus:'FCM_REQUEST_FAILED'});}
 finally{token=null;await mkdir('recovery/private',{recursive:true});await writeFile('recovery/private/fcm-device-self-test.json',JSON.stringify(report,null,2)+'\n');}
});
server.listen(port,'127.0.0.1',()=>console.log('Local single-device FCM fixture: '+origin+'/__browser-tests/notifications.html'));
