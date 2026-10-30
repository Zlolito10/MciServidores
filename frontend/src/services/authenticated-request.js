/** New recovery adapter for authenticated notification endpoints and command authors. */
export function requireFirebaseUid(auth) {
  const uid = auth?.currentUser?.uid;
  if (typeof uid !== 'string' || !uid) throw Object.assign(new Error('Debes iniciar sesión para realizar esta acción.'), { code: 'AUTH_REQUIRED' });
  return uid;
}

export function createNotificationRequest({ auth, requestJson, allowSession = () => false }) {
  return async function sendNotification(endpoint, payload) {
    if (!/^\/api\/notify\/(?:user|users|all|week|repertoire|materials)$/.test(endpoint)) throw new Error('INVALID_NOTIFICATION_ENDPOINT');
    const headers = {};
    const user = auth?.currentUser;
    if (user && typeof user.getIdToken === 'function') {
      let token;
      try { token = await user.getIdToken(); } catch { throw Object.assign(new Error('La sesión caducó. Vuelve a iniciar sesión.'), { code: 'AUTH_REQUIRED' }); }
      if (typeof token !== 'string' || !token) throw Object.assign(new Error('Debes iniciar sesión para enviar notificaciones.'), { code: 'AUTH_REQUIRED' });
      headers.Authorization = 'Bearer ' + token;
    } else if (!allowSession()) throw Object.assign(new Error('Debes iniciar sesión para enviar notificaciones.'), { code: 'AUTH_REQUIRED' });
    // requestJson supplies the normal session cookie and CSRF header in BFF mode.
    const result = await requestJson(endpoint, { method: 'POST', json: payload, headers, cache: 'no-store' });
    if (result?.success !== true) throw new Error('No se pudo enviar la notificación.');
    return result;
  };
}
