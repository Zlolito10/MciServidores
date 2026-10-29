/** New recovery logic around the published Messaging SDK. No tokens are logged. */
export function requestNotificationPermission(api, {timeoutMs = 20000} = {}) {
  if (api.permission !== 'default') return Promise.resolve(api.permission);
  const requested = api.requestPermission();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('NOTIFICATION_PERMISSION_PENDING')), timeoutMs);
    Promise.resolve(requested).then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}

export async function revokeBrowserRegistration({getStoredToken, unregisterToken, deleteToken, clearStoredToken, unsubscribePush, timeoutMs = 5000}) {
  const result={hadToken:false,unregistered:false,remoteDeleted:false,localCleared:false,pushUnsubscribed:false};
  async function bounded(operation){let timer;try{return await Promise.race([Promise.resolve().then(operation),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('CLEANUP_TIMEOUT')),timeoutMs);})]);}finally{clearTimeout(timer);}}
  let stored;try{stored=await bounded(getStoredToken);}catch{}
  if(stored?.token){
    result.hadToken=true;
    try{await bounded(()=>unregisterToken(stored.token));result.unregistered=true;}catch{}
    try{await bounded(()=>deleteToken(stored.token));result.remoteDeleted=true;}catch{}
  }
  try{await bounded(clearStoredToken);result.localCleared=true;}catch{}
  try{await bounded(()=>unsubscribePush(stored?.subscriptionOptions?.swScope));result.pushUnsubscribed=true;}catch{}
  return result;
}

export async function ensureMessagingWorker(container, {timeoutMs = 15000} = {}) {
  const script = new URL('/firebase-messaging-sw.js', globalThis.location.origin).href;
  let registration = (await container.getRegistrations()).find(value =>
    [value.active, value.installing, value.waiting].some(worker => worker?.scriptURL === script));
  if (!registration) registration = await container.register(script, {updateViaCache: 'none'});
  registration.waiting?.postMessage({type: 'SKIP_WAITING'});
  if (registration.active?.state === 'activated') return registration;
  const worker = registration.installing || registration.waiting || registration.active;
  if (!worker) throw new Error('MESSAGING_WORKER_UNAVAILABLE');
  await new Promise((resolve, reject) => {
    let timer;
    const done = error => {
      clearTimeout(timer);
      worker.removeEventListener('statechange', changed);
      error ? reject(error) : resolve();
    };
    const changed = () => {
      if (worker.state === 'activated') done();
      else if (worker.state === 'redundant') done(new Error('MESSAGING_WORKER_REDUNDANT'));
      else if (worker.state === 'installed') worker.postMessage({type: 'SKIP_WAITING'});
    };
    worker.addEventListener('statechange', changed);
    timer = setTimeout(() => done(new Error('MESSAGING_WORKER_TIMEOUT')), timeoutMs);
    changed();
  });
  return registration;
}

// Firebase's recovered SDK stores one foreground handler. Share it among hook
// consumers and release it even when an unmount precedes async initialization.
export function createMessageSubscription(getMessaging, subscribe) {
  const listeners = new Set();
  let starting = null;
  let release = null;
  return callback => {
    listeners.add(callback);
    if (!release && !starting) {
      starting = Promise.resolve().then(getMessaging).then(messaging => {
        if (!messaging || !listeners.size) return;
        release = subscribe(messaging, payload => {
          for (const listener of [...listeners]) {
            try { listener(payload); } catch { /* One consumer cannot block another. */ }
          }
        });
      }).catch(() => {}).finally(() => { starting = null; });
    }
    return () => {
      listeners.delete(callback);
      if (!listeners.size && release) { release(); release = null; }
    };
  };
}

export function createTokenRequest({getPermission, getMessaging, getRegistration, requestToken, now = Date.now}) {
  let pending = null;
  let retryAt = 0;
  return () => {
    // Passive refresh and disabling notifications must never cause a permission prompt.
    if (getPermission() !== 'granted' || now() < retryAt) return Promise.resolve(null);
    if (pending) return pending;
    pending = Promise.resolve().then(async () => {
      const messaging = await getMessaging();
      if (!messaging) return null;
      const registration = await getRegistration();
      return registration ? (await requestToken(messaging, registration)) || null : null;
    }).catch(error => {
      if (error?.name === 'AbortError') retryAt = now() + 600000;
      return null;
    }).finally(() => { pending = null; });
    return pending;
  };
}
