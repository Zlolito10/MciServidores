import {fixtureMessaging,fixtureGetToken,fixtureVapid,fixtureDeleteToken,fixtureStoredToken,fixtureMessagingDatabase,fixtureMessagingKey,fixtureInstallationsDatabase,a as sdkSupported,o as onMessage,d as showForegroundNotification} from '../../frontend/src/services/notifications.js';
import {requestNotificationPermission} from '../../frontend/src/services/notification-runtime.js';
const state={status:'idle',permission:globalThis.Notification?.permission||'unsupported',sdkSupported:null,workerActive:false,appProject:null,appId:null,senderId:null,cachedRegistrationBeforeRequest:null,pushEndpointOrigin:null,tokenPresent:false,tokenLength:0,deliveryRequested:false,deliveryInSeconds:0,serverAccepted:false,fcmErrorCode:null,messagesReceived:0,notificationsShown:0,lastMessageId:null,errorCode:null};
window.__MCI_FCM_FIXTURE_STATE__=state;
let registration=null,messaging=null,token=null,stop=null;
const render=()=>document.querySelector('#state').textContent=JSON.stringify(state,null,2);
const safeError=error=>{state.status='failed';state.errorCode=typeof error.code==='string'?error.code:typeof error.message==='string'&&/^[A-Z_]+$/.test(error.message)?error.message:'NOTIFICATION_TEST_FAILED';render();};
async function prepare(){
 state.sdkSupported=await sdkSupported();if(!state.sdkSupported)throw Error('FCM_BROWSER_UNSUPPORTED');
 registration=await navigator.serviceWorker.register('/__browser-tests/notification-worker.js',{scope:'/__browser-tests/',updateViaCache:'none'});
 if(registration.active?.state!=='activated')await new Promise((resolve,reject)=>{const worker=registration.installing||registration.waiting||registration.active;if(!worker)return reject(Error('WORKER_UNAVAILABLE'));let timer;const changed=()=>{if(worker.state==='activated'){clearTimeout(timer);worker.removeEventListener('statechange',changed);resolve();}else if(worker.state==='redundant'){clearTimeout(timer);worker.removeEventListener('statechange',changed);reject(Error('WORKER_REDUNDANT'));}};worker.addEventListener('statechange',changed);timer=setTimeout(()=>{worker.removeEventListener('statechange',changed);reject(Error('WORKER_TIMEOUT'));},15000);changed();});
 messaging=fixtureMessaging();const config=messaging.firebaseDependencies.appConfig;state.appProject=config.projectId;state.appId=config.appId;state.senderId=config.senderId;stop?.();stop=onMessage(payload=>{
  state.messagesReceived++;state.lastMessageId=payload.messageId||null;
  // Exercise the same native foreground-display helper as useNotifications.
  // Keep this explicit test silent and persistent until cleanup/click.
  showForegroundNotification(payload.data?.title||'Prueba MCI en este navegador',{
   body:payload.data?.body||'Aviso sintético de prueba.',silent:true,requireInteraction:true,
   tag:'mci-explicit-device-test',data:payload.data,
  });
  state.status='foreground-message-received';render();
 });
 state.workerActive=true;state.status='ready';render();
}
document.querySelector('#prepare').onclick=()=>prepare().catch(safeError);
document.querySelector('#request').onclick=async()=>{
 try{
  if(!document.querySelector('#consent').checked)throw Error('EXPLICIT_DEVICE_CONSENT_REQUIRED');
  // Call from this explicit click before awaiting SDK/worker initialization.
  state.status='requesting-notification-permission';state.errorCode=null;render();
  const permission=requestNotificationPermission(Notification);
  state.permission=await permission;if(state.permission!=='granted')throw Error('NOTIFICATION_PERMISSION_NOT_GRANTED');
  if(!registration)await prepare();state.status='requesting-token';render();
  state.cachedRegistrationBeforeRequest=Boolean((await fixtureStoredToken(messaging.firebaseDependencies))?.token);
  token=await fixtureGetToken(messaging,{vapidKey:fixtureVapid,serviceWorkerRegistration:registration});
  const subscription=await registration.pushManager.getSubscription();state.pushEndpointOrigin=subscription?new URL(subscription.endpoint).origin:null;
  state.tokenPresent=Boolean(token);state.tokenLength=token?.length||0;
  if(!token)throw Error('FCM_TOKEN_UNAVAILABLE');
  // This ephemeral loopback endpoint holds the token only in memory and sends
  // one synthetic message to this browser; it cannot write app userTokens.
  const session=await fetch('/__browser-tests/fcm-session',{cache:'no-store'}).then(response=>response.json());
  if(!session.nonce)throw Error('LOCAL_TEST_SERVER_REQUIRED');
  state.deliveryInSeconds=Math.ceil((session.delayMs||0)/1000);state.status=state.deliveryInSeconds?'waiting-for-background-delivery':'sending-self-test';render();
  const countdown=setInterval(()=>{state.deliveryInSeconds=Math.max(0,state.deliveryInSeconds-1);render();},1000);
  let response;try{response=await fetch('/__browser-tests/fcm-self-test',{method:'POST',headers:{'Content-Type':'application/json','x-mci-test-nonce':session.nonce},body:JSON.stringify({consent:true,token})});}finally{clearInterval(countdown);state.deliveryInSeconds=0;}
  const result=await response.json();state.deliveryRequested=true;state.serverAccepted=result.serverAccepted===true;state.fcmErrorCode=result.fcmErrorCode||null;
  if(!response.ok)throw Error(result.error||result.errorStatus||'FCM_SEND_FAILED');
  state.status='self-test-accepted-by-fcm';render();
 }catch(error){safeError(error);}
};
document.querySelector('#inspect').onclick=async()=>{try{const notifications=registration?await registration.getNotifications():[];state.notificationsShown=notifications.length;state.status='notifications-inspected';render();}catch(error){safeError(error);}};
document.querySelector('#cleanup').onclick=async()=>{
 let remoteError=null;
 try{
  stop?.();stop=null;
  if(messaging){const dependencies=messaging.firebaseDependencies;const stored=await fixtureStoredToken(dependencies);if(stored?.token){await fixtureDeleteToken(dependencies,stored.token);const db=await fixtureMessagingDatabase();const tx=db.transaction('firebase-messaging-store','readwrite');await tx.objectStore('firebase-messaging-store').delete(fixtureMessagingKey(dependencies));await tx.done;}
   const db=await fixtureInstallationsDatabase();const key='mci-recovery-notification-fixture!'+dependencies.appConfig.appId;const entry=await db.transaction('firebase-installations-store').objectStore('firebase-installations-store').get(key);if(entry?.fid&&entry?.refreshToken){const response=await fetch('https://firebaseinstallations.googleapis.com/v1/projects/'+encodeURIComponent(dependencies.appConfig.projectId)+'/installations/'+encodeURIComponent(entry.fid),{method:'DELETE',headers:{'x-goog-api-key':dependencies.appConfig.apiKey,Authorization:'FIS_v2 '+entry.refreshToken}});if(!response.ok)throw Error('INSTALLATION_CLEANUP_FAILED');const tx=db.transaction('firebase-installations-store','readwrite');await tx.objectStore('firebase-installations-store').delete(key);await tx.done;}}
 }catch(error){remoteError=error;}
 finally{
  try{if(registration){for(const notification of await registration.getNotifications())notification.close();const subscription=await registration.pushManager.getSubscription();if(subscription)await subscription.unsubscribe();await registration.unregister();}}catch(error){remoteError||=error;}
  token=null;state.tokenPresent=false;state.tokenLength=0;state.workerActive=false;
  if(remoteError)safeError(remoteError);else{state.errorCode=null;state.status='cleaned';render();}
 }
};
render();
