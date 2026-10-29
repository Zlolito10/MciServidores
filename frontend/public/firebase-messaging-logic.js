/* Reconstructed Web Push handler. The original imported file was not deployed.
 * Uses the FCM Web payload envelope and the original onMessage client protocol.
 * Contains no credentials and never sends notification data to another origin.
 */
(function installMciMessaging(scope) {
  'use strict';
  const fallbackPath = '/dashboard';
  const ownOrigin = scope.location.origin;
  const seen = new Map();

  function sameOriginUrl(value) {
    try {
      const url = new URL(typeof value === 'string' && value ? value : fallbackPath, ownOrigin);
      if (url.origin !== ownOrigin || url.username || url.password || !['http:', 'https:'].includes(url.protocol)) return ownOrigin + fallbackPath;
      return url.href;
    } catch { return ownOrigin + fallbackPath; }
  }

  function notificationFrom(payload) {
    const data = payload && typeof payload.data === 'object' && payload.data ? payload.data : {};
    const notification = payload && typeof payload.notification === 'object' && payload.notification ? payload.notification : {};
    const url = sameOriginUrl(data.url || notification.data?.url || payload?.fcmOptions?.link || payload?.fcm_options?.link);
    return {
      title: String(notification.title || data.title || 'MCI Servidores'),
      options: {
        body: String(notification.body || data.body || ''),
        icon: '/mci-logo.png', badge: '/mci-logo.png',
        tag: String(notification.tag || data.tag || payload?.fcmMessageId || payload?.messageId || ''),
        data: { ...data, url, FCM_MSG: payload },
      },
    };
  }

  async function receive(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return;
    const id = payload.fcmMessageId || payload.messageId || payload.fcm_message_id;
    const now = Date.now();
    for (const [key, at] of seen) if (now - at > 600000) seen.delete(key);
    if (id && seen.has(id)) return;
    if (id) { seen.set(id, now); if (seen.size > 256) seen.delete(seen.keys().next().value); }
    const windows = await scope.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const visible = windows.filter(client => client.visibilityState === 'visible');
    const notification = notificationFrom(payload);
    const hasDisplayContent = Boolean(payload.notification?.title || payload.notification?.body || payload.data?.title || payload.data?.body);
    if (visible.length || !hasDisplayContent) {
      for (const client of windows) client.postMessage({ ...payload, isFirebaseMessaging: true, messageType: 'push-received' });
      return;
    }
    await scope.registration.showNotification(notification.title, notification.options);
  }

  async function clicked(event) {
    event.notification.close();
    const target = sameOriginUrl(event.notification.data?.url);
    const payload = event.notification.data?.FCM_MSG || {};
    const windows = await scope.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find(client => { try { return new URL(client.url).origin === ownOrigin; } catch { return false; } });
    if (existing) {
      let destination = existing;
      try {
        if (existing.url !== target && existing.navigate) destination = await existing.navigate(target) || existing;
        await destination.focus();
        destination.postMessage({ ...payload, isFirebaseMessaging: true, messageType: 'notification-clicked' });
      } catch { await scope.clients.openWindow(target); }
    } else {
      await scope.clients.openWindow(target);
    }
  }

  scope.addEventListener('push', event => {
    let payload;
    try { payload = event.data?.json(); } catch { return; }
    event.waitUntil(receive(payload));
  });
  scope.addEventListener('notificationclick', event => {
    event.stopImmediatePropagation?.();
    event.waitUntil(clicked(event));
  });
  // Small pure surface for deterministic worker tests. No production messages are generated.
  scope.MciMessaging = { sameOriginUrl, notificationFrom, receive, clicked };
})(self);
