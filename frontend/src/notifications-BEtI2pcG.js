import {
  r as T,
  _ as k,
  C as I,
  b as D,
  a0 as ee,
  a1 as R,
  a2 as De,
  g as Re,
  c as F,
  a3 as Fe,
  a4 as Ke,
  a5 as Le,
  a6 as E,
  A as te,
  S as je,
  a7 as qe,
  B as $e,
  a8 as We,
} from "./vendor-firebase-BjYbfC3F.js";
import { v as xe, i as ne, f as oe, e as ie } from "./App-BPrQ3EPG.js";
const re = "@firebase/installations",
  K = "0.6.19";
const ae = 1e4,
  se = `w:${K}`,
  ce = "FIS_v2",
  Ve = "https://firebaseinstallations.googleapis.com/v1",
  Be = 3600 * 1e3,
  He = "installations",
  Ue = "Installations";
const Ge = {
    "missing-app-config-values":
      'Missing App configuration value: "{$valueName}"',
    "not-registered": "Firebase Installation is not registered.",
    "installation-not-found": "Firebase Installation not found.",
    "request-failed":
      '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
    "app-offline": "Could not process request. Application offline.",
    "delete-pending-registration":
      "Can't delete installation while there is a pending registration request.",
  },
  l = new ee(He, Ue, Ge);
function ue(e) {
  return e instanceof De && e.code.includes("request-failed");
}
function fe({ projectId: e }) {
  return `${Ve}/projects/${e}/installations`;
}
function de(e) {
  return {
    token: e.token,
    requestStatus: 2,
    expiresIn: Ye(e.expiresIn),
    creationTime: Date.now(),
  };
}
async function pe(e, t) {
  const o = (await t.json()).error;
  return l.create("request-failed", {
    requestName: e,
    serverCode: o.code,
    serverMessage: o.message,
    serverStatus: o.status,
  });
}
function le({ apiKey: e }) {
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": e,
  });
}
function Je(e, { refreshToken: t }) {
  const n = le(e);
  return (n.append("Authorization", ze(t)), n);
}
async function ge(e) {
  const t = await e();
  return t.status >= 500 && t.status < 600 ? e() : t;
}
function Ye(e) {
  return Number(e.replace("s", "000"));
}
function ze(e) {
  return `${ce} ${e}`;
}
async function Xe({ appConfig: e, heartbeatServiceProvider: t }, { fid: n }) {
  const o = fe(e),
    i = le(e),
    r = t.getImmediate({ optional: !0 });
  if (r) {
    const a = await r.getHeartbeatsHeader();
    a && i.append("x-firebase-client", a);
  }
  const s = { fid: n, authVersion: ce, appId: e.appId, sdkVersion: se },
    c = { method: "POST", headers: i, body: JSON.stringify(s) },
    f = await ge(() => fetch(o, c));
  if (f.ok) {
    const a = await f.json();
    return {
      fid: a.fid || n,
      registrationStatus: 2,
      refreshToken: a.refreshToken,
      authToken: de(a.authToken),
    };
  } else throw await pe("Create Installation", f);
}
function we(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}
function Ze(e) {
  return btoa(String.fromCharCode(...e))
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
const Qe = /^[cdef][\w-]{21}$/,
  M = "";
function et() {
  try {
    const e = new Uint8Array(17);
    ((self.crypto || self.msCrypto).getRandomValues(e),
      (e[0] = 112 + (e[0] % 16)));
    const n = tt(e);
    return Qe.test(n) ? n : M;
  } catch {
    return M;
  }
}
function tt(e) {
  return Ze(e).substr(0, 22);
}
function v(e) {
  return `${e.appName}!${e.appId}`;
}
const he = new Map();
function me(e, t) {
  const n = v(e);
  (be(n, t), nt(n, t));
}
function be(e, t) {
  const n = he.get(e);
  if (n) for (const o of n) o(t);
}
function nt(e, t) {
  const n = ot();
  (n && n.postMessage({ key: e, fid: t }), it());
}
let p = null;
function ot() {
  return (
    !p &&
      "BroadcastChannel" in self &&
      ((p = new BroadcastChannel("[Firebase] FID Change")),
      (p.onmessage = (e) => {
        be(e.data.key, e.data.fid);
      })),
    p
  );
}
function it() {
  he.size === 0 && p && (p.close(), (p = null));
}
const rt = "firebase-installations-database",
  at = 1,
  g = "firebase-installations-store";
let N = null;
function L() {
  return (
    N ||
      (N = R(rt, at, {
        upgrade: (e, t) => {
          switch (t) {
            case 0:
              e.createObjectStore(g);
          }
        },
      })),
    N
  );
}
async function S(e, t) {
  const n = v(e),
    i = (await L()).transaction(g, "readwrite"),
    r = i.objectStore(g),
    s = await r.get(n);
  return (
    await r.put(t, n),
    await i.done,
    (!s || s.fid !== t.fid) && me(e, t.fid),
    t
  );
}
async function ye(e) {
  const t = v(e),
    o = (await L()).transaction(g, "readwrite");
  (await o.objectStore(g).delete(t), await o.done);
}
async function A(e, t) {
  const n = v(e),
    i = (await L()).transaction(g, "readwrite"),
    r = i.objectStore(g),
    s = await r.get(n),
    c = t(s);
  return (
    c === void 0 ? await r.delete(n) : await r.put(c, n),
    await i.done,
    c && (!s || s.fid !== c.fid) && me(e, c.fid),
    c
  );
}
async function j(e) {
  let t;
  const n = await A(e.appConfig, (o) => {
    const i = st(o),
      r = ct(e, i);
    return ((t = r.registrationPromise), r.installationEntry);
  });
  return n.fid === M
    ? { installationEntry: await t }
    : { installationEntry: n, registrationPromise: t };
}
function st(e) {
  const t = e || { fid: et(), registrationStatus: 0 };
  return Te(t);
}
function ct(e, t) {
  if (t.registrationStatus === 0) {
    if (!navigator.onLine) {
      const i = Promise.reject(l.create("app-offline"));
      return { installationEntry: t, registrationPromise: i };
    }
    const n = {
        fid: t.fid,
        registrationStatus: 1,
        registrationTime: Date.now(),
      },
      o = ut(e, n);
    return { installationEntry: n, registrationPromise: o };
  } else
    return t.registrationStatus === 1
      ? { installationEntry: t, registrationPromise: ft(e) }
      : { installationEntry: t };
}
async function ut(e, t) {
  try {
    const n = await Xe(e, t);
    return S(e.appConfig, n);
  } catch (n) {
    throw (
      ue(n) && n.customData.serverCode === 409
        ? await ye(e.appConfig)
        : await S(e.appConfig, { fid: t.fid, registrationStatus: 0 }),
      n
    );
  }
}
async function ft(e) {
  let t = await B(e.appConfig);
  for (; t.registrationStatus === 1; )
    (await we(100), (t = await B(e.appConfig)));
  if (t.registrationStatus === 0) {
    const { installationEntry: n, registrationPromise: o } = await j(e);
    return o || n;
  }
  return t;
}
function B(e) {
  return A(e, (t) => {
    if (!t) throw l.create("installation-not-found");
    return Te(t);
  });
}
function Te(e) {
  return dt(e) ? { fid: e.fid, registrationStatus: 0 } : e;
}
function dt(e) {
  return e.registrationStatus === 1 && e.registrationTime + ae < Date.now();
}
async function pt({ appConfig: e, heartbeatServiceProvider: t }, n) {
  const o = lt(e, n),
    i = Je(e, n),
    r = t.getImmediate({ optional: !0 });
  if (r) {
    const a = await r.getHeartbeatsHeader();
    a && i.append("x-firebase-client", a);
  }
  const s = { installation: { sdkVersion: se, appId: e.appId } },
    c = { method: "POST", headers: i, body: JSON.stringify(s) },
    f = await ge(() => fetch(o, c));
  if (f.ok) {
    const a = await f.json();
    return de(a);
  } else throw await pe("Generate Auth Token", f);
}
function lt(e, { fid: t }) {
  return `${fe(e)}/${t}/authTokens:generate`;
}
async function q(e, t = !1) {
  let n;
  const o = await A(e.appConfig, (r) => {
    if (!ke(r)) throw l.create("not-registered");
    const s = r.authToken;
    if (!t && ht(s)) return r;
    if (s.requestStatus === 1) return ((n = gt(e, t)), r);
    {
      if (!navigator.onLine) throw l.create("app-offline");
      const c = bt(r);
      return ((n = wt(e, c)), c);
    }
  });
  return n ? await n : o.authToken;
}
async function gt(e, t) {
  let n = await H(e.appConfig);
  for (; n.authToken.requestStatus === 1; )
    (await we(100), (n = await H(e.appConfig)));
  const o = n.authToken;
  return o.requestStatus === 0 ? q(e, t) : o;
}
function H(e) {
  return A(e, (t) => {
    if (!ke(t)) throw l.create("not-registered");
    const n = t.authToken;
    return yt(n) ? { ...t, authToken: { requestStatus: 0 } } : t;
  });
}
async function wt(e, t) {
  try {
    const n = await pt(e, t),
      o = { ...t, authToken: n };
    return (await S(e.appConfig, o), n);
  } catch (n) {
    if (
      ue(n) &&
      (n.customData.serverCode === 401 || n.customData.serverCode === 404)
    )
      await ye(e.appConfig);
    else {
      const o = { ...t, authToken: { requestStatus: 0 } };
      await S(e.appConfig, o);
    }
    throw n;
  }
}
function ke(e) {
  return e !== void 0 && e.registrationStatus === 2;
}
function ht(e) {
  return e.requestStatus === 2 && !mt(e);
}
function mt(e) {
  const t = Date.now();
  return t < e.creationTime || e.creationTime + e.expiresIn < t + Be;
}
function bt(e) {
  const t = { requestStatus: 1, requestTime: Date.now() };
  return { ...e, authToken: t };
}
function yt(e) {
  return e.requestStatus === 1 && e.requestTime + ae < Date.now();
}
async function Tt(e) {
  const t = e,
    { installationEntry: n, registrationPromise: o } = await j(t);
  return (o ? o.catch(console.error) : q(t).catch(console.error), n.fid);
}
async function kt(e, t = !1) {
  const n = e;
  return (await It(n), (await q(n, t)).token);
}
async function It(e) {
  const { registrationPromise: t } = await j(e);
  t && (await t);
}
function St(e) {
  if (!e || !e.options) throw _("App Configuration");
  if (!e.name) throw _("App Name");
  const t = ["projectId", "apiKey", "appId"];
  for (const n of t) if (!e.options[n]) throw _(n);
  return {
    appName: e.name,
    projectId: e.options.projectId,
    apiKey: e.options.apiKey,
    appId: e.options.appId,
  };
}
function _(e) {
  return l.create("missing-app-config-values", { valueName: e });
}
const Ie = "installations",
  vt = "installations-internal",
  At = (e) => {
    const t = e.getProvider("app").getImmediate(),
      n = St(t),
      o = D(t, "heartbeat");
    return {
      app: t,
      appConfig: n,
      heartbeatServiceProvider: o,
      _delete: () => Promise.resolve(),
    };
  },
  Et = (e) => {
    const t = e.getProvider("app").getImmediate(),
      n = D(t, Ie).getImmediate();
    return { getId: () => Tt(n), getToken: (i) => kt(n, i) };
  };
function Nt() {
  (k(new I(Ie, At, "PUBLIC")), k(new I(vt, Et, "PRIVATE")));
}
Nt();
T(re, K);
T(re, K, "esm2020");
const _t = "/firebase-messaging-sw.js",
  Ct = "/firebase-cloud-messaging-push-scope",
  Se =
    "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",
  Pt = "https://fcmregistrations.googleapis.com/v1",
  ve = "google.c.a.c_id",
  Ot = "google.c.a.c_l",
  Mt = "google.c.a.ts",
  Dt = "google.c.a.e",
  U = 1e4;
var G;
(function (e) {
  ((e[(e.DATA_MESSAGE = 1)] = "DATA_MESSAGE"),
    (e[(e.DISPLAY_NOTIFICATION = 3)] = "DISPLAY_NOTIFICATION"));
})(G || (G = {}));
var m;
(function (e) {
  ((e.PUSH_RECEIVED = "push-received"),
    (e.NOTIFICATION_CLICKED = "notification-clicked"));
})(m || (m = {}));
function d(e) {
  const t = new Uint8Array(e);
  return btoa(String.fromCharCode(...t))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
function Rt(e) {
  const t = "=".repeat((4 - (e.length % 4)) % 4),
    n = (e + t).replace(/\-/g, "+").replace(/_/g, "/"),
    o = atob(n),
    i = new Uint8Array(o.length);
  for (let r = 0; r < o.length; ++r) i[r] = o.charCodeAt(r);
  return i;
}
const C = "fcm_token_details_db",
  Ft = 5,
  J = "fcm_token_object_Store";
async function Kt(e) {
  if (
    "databases" in indexedDB &&
    !(await indexedDB.databases()).map((r) => r.name).includes(C)
  )
    return null;
  let t = null;
  return (
    (
      await R(C, Ft, {
        upgrade: async (o, i, r, s) => {
          if (i < 2 || !o.objectStoreNames.contains(J)) return;
          const c = s.objectStore(J),
            f = await c.index("fcmSenderId").get(e);
          if ((await c.clear(), !!f)) {
            if (i === 2) {
              const a = f;
              if (!a.auth || !a.p256dh || !a.endpoint) return;
              t = {
                token: a.fcmToken,
                createTime: a.createTime ?? Date.now(),
                subscriptionOptions: {
                  auth: a.auth,
                  p256dh: a.p256dh,
                  endpoint: a.endpoint,
                  swScope: a.swScope,
                  vapidKey:
                    typeof a.vapidKey == "string" ? a.vapidKey : d(a.vapidKey),
                },
              };
            } else if (i === 3) {
              const a = f;
              t = {
                token: a.fcmToken,
                createTime: a.createTime,
                subscriptionOptions: {
                  auth: d(a.auth),
                  p256dh: d(a.p256dh),
                  endpoint: a.endpoint,
                  swScope: a.swScope,
                  vapidKey: d(a.vapidKey),
                },
              };
            } else if (i === 4) {
              const a = f;
              t = {
                token: a.fcmToken,
                createTime: a.createTime,
                subscriptionOptions: {
                  auth: d(a.auth),
                  p256dh: d(a.p256dh),
                  endpoint: a.endpoint,
                  swScope: a.swScope,
                  vapidKey: d(a.vapidKey),
                },
              };
            }
          }
        },
      })
    ).close(),
    await E(C),
    await E("fcm_vapid_details_db"),
    await E("undefined"),
    Lt(t) ? t : null
  );
}
function Lt(e) {
  if (!e || !e.subscriptionOptions) return !1;
  const { subscriptionOptions: t } = e;
  return (
    typeof e.createTime == "number" &&
    e.createTime > 0 &&
    typeof e.token == "string" &&
    e.token.length > 0 &&
    typeof t.auth == "string" &&
    t.auth.length > 0 &&
    typeof t.p256dh == "string" &&
    t.p256dh.length > 0 &&
    typeof t.endpoint == "string" &&
    t.endpoint.length > 0 &&
    typeof t.swScope == "string" &&
    t.swScope.length > 0 &&
    typeof t.vapidKey == "string" &&
    t.vapidKey.length > 0
  );
}
const jt = "firebase-messaging-database",
  qt = 1,
  b = "firebase-messaging-store";
let P = null;
function Ae() {
  return (
    P ||
      (P = R(jt, qt, {
        upgrade: (e, t) => {
          switch (t) {
            case 0:
              e.createObjectStore(b);
          }
        },
      })),
    P
  );
}
async function $t(e) {
  const t = Ee(e),
    o = await (await Ae()).transaction(b).objectStore(b).get(t);
  if (o) return o;
  {
    const i = await Kt(e.appConfig.senderId);
    if (i) return (await $(e, i), i);
  }
}
async function $(e, t) {
  const n = Ee(e),
    i = (await Ae()).transaction(b, "readwrite");
  return (await i.objectStore(b).put(t, n), await i.done, t);
}
function Ee({ appConfig: e }) {
  return e.appId;
}
const Wt = {
    "missing-app-config-values":
      'Missing App configuration value: "{$valueName}"',
    "only-available-in-window": "This method is available in a Window context.",
    "only-available-in-sw":
      "This method is available in a service worker context.",
    "permission-default":
      "The notification permission was not granted and dismissed instead.",
    "permission-blocked":
      "The notification permission was not granted and blocked instead.",
    "unsupported-browser":
      "This browser doesn't support the API's required to use the Firebase SDK.",
    "indexed-db-unsupported":
      "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
    "failed-service-worker-registration":
      "We are unable to register the default service worker. {$browserErrorMessage}",
    "token-subscribe-failed":
      "A problem occurred while subscribing the user to FCM: {$errorInfo}",
    "token-subscribe-no-token":
      "FCM returned no token when subscribing the user to push.",
    "token-unsubscribe-failed":
      "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
    "token-update-failed":
      "A problem occurred while updating the user from FCM: {$errorInfo}",
    "token-update-no-token":
      "FCM returned no token when updating the user to push.",
    "use-sw-after-get-token":
      "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
    "invalid-sw-registration":
      "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
    "invalid-bg-handler":
      "The input to setBackgroundMessageHandler() must be a function.",
    "invalid-vapid-key": "The public VAPID key must be a string.",
    "use-vapid-key-after-get-token":
      "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.",
  },
  u = new ee("messaging", "Messaging", Wt);
async function xt(e, t) {
  const n = await x(e),
    o = Ne(t),
    i = { method: "POST", headers: n, body: JSON.stringify(o) };
  let r;
  try {
    r = await (await fetch(W(e.appConfig), i)).json();
  } catch (s) {
    throw u.create("token-subscribe-failed", { errorInfo: s?.toString() });
  }
  if (r.error) {
    const s = r.error.message;
    throw u.create("token-subscribe-failed", { errorInfo: s });
  }
  if (!r.token) throw u.create("token-subscribe-no-token");
  return r.token;
}
async function Vt(e, t) {
  const n = await x(e),
    o = Ne(t.subscriptionOptions),
    i = { method: "PATCH", headers: n, body: JSON.stringify(o) };
  let r;
  try {
    r = await (await fetch(`${W(e.appConfig)}/${t.token}`, i)).json();
  } catch (s) {
    throw u.create("token-update-failed", { errorInfo: s?.toString() });
  }
  if (r.error) {
    const s = r.error.message;
    throw u.create("token-update-failed", { errorInfo: s });
  }
  if (!r.token) throw u.create("token-update-no-token");
  return r.token;
}
async function Bt(e, t) {
  const o = { method: "DELETE", headers: await x(e) };
  try {
    const r = await (await fetch(`${W(e.appConfig)}/${t}`, o)).json();
    if (r.error) {
      const s = r.error.message;
      throw u.create("token-unsubscribe-failed", { errorInfo: s });
    }
  } catch (i) {
    throw u.create("token-unsubscribe-failed", { errorInfo: i?.toString() });
  }
}
function W({ projectId: e }) {
  return `${Pt}/projects/${e}/registrations`;
}
async function x({ appConfig: e, installations: t }) {
  const n = await t.getToken();
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": e.apiKey,
    "x-goog-firebase-installations-auth": `FIS ${n}`,
  });
}
function Ne({ p256dh: e, auth: t, endpoint: n, vapidKey: o }) {
  const i = { web: { endpoint: n, auth: t, p256dh: e } };
  return (o !== Se && (i.web.applicationPubKey = o), i);
}
const Ht = 10080 * 60 * 1e3;
async function Ut(e) {
  const t = await Jt(e.swRegistration, e.vapidKey),
    n = {
      vapidKey: e.vapidKey,
      swScope: e.swRegistration.scope,
      endpoint: t.endpoint,
      auth: d(t.getKey("auth")),
      p256dh: d(t.getKey("p256dh")),
    },
    o = await $t(e.firebaseDependencies);
  if (o) {
    if (Yt(o.subscriptionOptions, n))
      return Date.now() >= o.createTime + Ht
        ? Gt(e, {
            token: o.token,
            createTime: Date.now(),
            subscriptionOptions: n,
          })
        : o.token;
    try {
      await Bt(e.firebaseDependencies, o.token);
    } catch (i) {
      console.warn(i);
    }
    return Y(e.firebaseDependencies, n);
  } else return Y(e.firebaseDependencies, n);
}
async function Gt(e, t) {
  try {
    const n = await Vt(e.firebaseDependencies, t),
      o = { ...t, token: n, createTime: Date.now() };
    return (await $(e.firebaseDependencies, o), n);
  } catch (n) {
    throw n;
  }
}
async function Y(e, t) {
  const o = {
    token: await xt(e, t),
    createTime: Date.now(),
    subscriptionOptions: t,
  };
  return (await $(e, o), o.token);
}
async function Jt(e, t) {
  const n = await e.pushManager.getSubscription();
  return (
    n ||
    e.pushManager.subscribe({
      userVisibleOnly: !0,
      applicationServerKey: Rt(t),
    })
  );
}
function Yt(e, t) {
  const n = t.vapidKey === e.vapidKey,
    o = t.endpoint === e.endpoint,
    i = t.auth === e.auth,
    r = t.p256dh === e.p256dh;
  return n && o && i && r;
}
function z(e) {
  const t = {
    from: e.from,
    collapseKey: e.collapse_key,
    messageId: e.fcmMessageId,
  };
  return (zt(t, e), Xt(t, e), Zt(t, e), t);
}
function zt(e, t) {
  if (!t.notification) return;
  e.notification = {};
  const n = t.notification.title;
  n && (e.notification.title = n);
  const o = t.notification.body;
  o && (e.notification.body = o);
  const i = t.notification.image;
  i && (e.notification.image = i);
  const r = t.notification.icon;
  r && (e.notification.icon = r);
}
function Xt(e, t) {
  t.data && (e.data = t.data);
}
function Zt(e, t) {
  if (!t.fcmOptions && !t.notification?.click_action) return;
  e.fcmOptions = {};
  const n = t.fcmOptions?.link ?? t.notification?.click_action;
  n && (e.fcmOptions.link = n);
  const o = t.fcmOptions?.analytics_label;
  o && (e.fcmOptions.analyticsLabel = o);
}
function Qt(e) {
  return typeof e == "object" && !!e && ve in e;
}
function en(e) {
  if (!e || !e.options) throw O("App Configuration Object");
  if (!e.name) throw O("App Name");
  const t = ["projectId", "apiKey", "appId", "messagingSenderId"],
    { options: n } = e;
  for (const o of t) if (!n[o]) throw O(o);
  return {
    appName: e.name,
    projectId: n.projectId,
    apiKey: n.apiKey,
    appId: n.appId,
    senderId: n.messagingSenderId,
  };
}
function O(e) {
  return u.create("missing-app-config-values", { valueName: e });
}
class tn {
  constructor(t, n, o) {
    ((this.deliveryMetricsExportedToBigQueryEnabled = !1),
      (this.onBackgroundMessageHandler = null),
      (this.onMessageHandler = null),
      (this.logEvents = []),
      (this.isLogServiceStarted = !1));
    const i = en(t);
    this.firebaseDependencies = {
      app: t,
      appConfig: i,
      installations: n,
      analyticsProvider: o,
    };
  }
  _delete() {
    return Promise.resolve();
  }
}
async function nn(e) {
  try {
    ((e.swRegistration = await navigator.serviceWorker.register(_t, {
      scope: Ct,
    })),
      e.swRegistration.update().catch(() => {}),
      await on(e.swRegistration));
  } catch (t) {
    throw u.create("failed-service-worker-registration", {
      browserErrorMessage: t?.message,
    });
  }
}
async function on(e) {
  return new Promise((t, n) => {
    const o = setTimeout(
        () => n(new Error(`Service worker not registered after ${U} ms`)),
        U,
      ),
      i = e.installing || e.waiting;
    e.active
      ? (clearTimeout(o), t())
      : i
        ? (i.onstatechange = (r) => {
            r.target?.state === "activated" &&
              ((i.onstatechange = null), clearTimeout(o), t());
          })
        : (clearTimeout(o), n(new Error("No incoming service worker found.")));
  });
}
async function rn(e, t) {
  if ((!t && !e.swRegistration && (await nn(e)), !(!t && e.swRegistration))) {
    if (!(t instanceof ServiceWorkerRegistration))
      throw u.create("invalid-sw-registration");
    e.swRegistration = t;
  }
}
async function an(e, t) {
  t ? (e.vapidKey = t) : e.vapidKey || (e.vapidKey = Se);
}
async function _e(e, t) {
  if (!navigator) throw u.create("only-available-in-window");
  if (
    (Notification.permission === "default" &&
      (await Notification.requestPermission()),
    Notification.permission !== "granted")
  )
    throw u.create("permission-blocked");
  return (
    await an(e, t?.vapidKey),
    await rn(e, t?.serviceWorkerRegistration),
    Ut(e)
  );
}
async function sn(e, t, n) {
  const o = cn(t);
  (await e.firebaseDependencies.analyticsProvider.get()).logEvent(o, {
    message_id: n[ve],
    message_name: n[Ot],
    message_time: n[Mt],
    message_device_time: Math.floor(Date.now() / 1e3),
  });
}
function cn(e) {
  switch (e) {
    case m.NOTIFICATION_CLICKED:
      return "notification_open";
    case m.PUSH_RECEIVED:
      return "notification_foreground";
    default:
      throw new Error();
  }
}
async function un(e, t) {
  const n = t.data;
  if (!n.isFirebaseMessaging) return;
  e.onMessageHandler &&
    n.messageType === m.PUSH_RECEIVED &&
    (typeof e.onMessageHandler == "function"
      ? e.onMessageHandler(z(n))
      : e.onMessageHandler.next(z(n)));
  const o = n.data;
  Qt(o) && o[Dt] === "1" && (await sn(e, n.messageType, o));
}
const X = "@firebase/messaging",
  Z = "0.12.23";
const fn = (e) => {
    const t = new tn(
      e.getProvider("app").getImmediate(),
      e.getProvider("installations-internal").getImmediate(),
      e.getProvider("analytics-internal"),
    );
    return (
      navigator.serviceWorker.addEventListener("message", (n) => un(t, n)),
      t
    );
  },
  dn = (e) => {
    const t = e.getProvider("messaging").getImmediate();
    return { getToken: (o) => _e(t, o) };
  };
function pn() {
  (k(new I("messaging", fn, "PUBLIC")),
    k(new I("messaging-internal", dn, "PRIVATE")),
    T(X, Z),
    T(X, Z, "esm2020"));
}
async function Ce() {
  try {
    await Fe();
  } catch {
    return !1;
  }
  return (
    typeof window < "u" &&
    Ke() &&
    Le() &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window &&
    "fetch" in window &&
    ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") &&
    PushSubscription.prototype.hasOwnProperty("getKey")
  );
}
function ln(e, t) {
  if (!navigator) throw u.create("only-available-in-window");
  return (
    (e.onMessageHandler = t),
    () => {
      e.onMessageHandler = null;
    }
  );
}
function gn(e = Re()) {
  return (
    Ce().then(
      (t) => {
        if (!t) throw u.create("unsupported-browser");
      },
      (t) => {
        throw u.create("indexed-db-unsupported");
      },
    ),
    D(F(e), "messaging").getImmediate()
  );
}
async function wn(e, t) {
  return ((e = F(e)), _e(e, t));
}
function hn(e, t) {
  return ((e = F(e)), ln(e, t));
}
pn();
const mn =
  "BNPjYXUtK_EScF1Z4T0GP4NIpYFWbCS8tmsHSUSB8qD6zRNxgFJ1m115ZOlafR9JpuPTkS8H8JCIa4dOCf0Kk7M";
let y = null,
  w = null,
  Q = 0,
  h = null;
const Pe = async () => {
    if (h !== null) return h;
    try {
      return ((h = await Ce()), h);
    } catch {
      return ((h = !1), !1);
    }
  },
  bn = async () => Pe(),
  Oe = async () => {
    if (y) return y;
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !(await Pe())
    )
      return null;
    try {
      return ((y = gn(xe)), y);
    } catch {
      return null;
    }
  },
  yn = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
  Tn = () => {
    const e = navigator.userAgent.match(/OS (\d+)_(\d+)(?:_(\d+))?/);
    if (!e) return null;
    const t = parseInt(e[1], 10),
      n = parseInt(e[2], 10);
    return Number.isNaN(t) || Number.isNaN(n) ? null : { major: t, minor: n };
  },
  kn = () => {
    const e = Tn();
    return e ? (e.major > 16 ? !0 : e.major < 16 ? !1 : e.minor >= 4) : !1;
  },
  In = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === !0,
  V = () => {
    const e = "Notification" in window,
      t = "serviceWorker" in navigator,
      n = "PushManager" in window;
    return yn() && (!kn() || !In()) ? !1 : e && t && n;
  },
  Cn = () => (V() ? Notification.permission : "unsupported"),
  Sn = async () => {
    if (!V()) throw new Error("Notificaciones no soportadas en este navegador");
    return await Notification.requestPermission();
  },
  vn = async () => {
    if (!("serviceWorker" in navigator)) return null;
    try {
      let t = (await navigator.serviceWorker.getRegistrations()).find(
        (n) =>
          n.active?.scriptURL?.includes("firebase-messaging-sw.js") ||
          n.installing?.scriptURL?.includes("firebase-messaging-sw.js") ||
          n.waiting?.scriptURL?.includes("firebase-messaging-sw.js"),
      );
      return (
        t ||
          (t = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            { updateViaCache: "none" },
          )),
        t.waiting && t.waiting.postMessage({ type: "SKIP_WAITING" }),
        t.addEventListener("updatefound", () => {
          const n = t.installing;
          n &&
            n.addEventListener("statechange", () => {
              n.state === "installed" &&
                navigator.serviceWorker.controller &&
                n.postMessage({ type: "SKIP_WAITING" });
            });
        }),
        t.update().catch(() => {}),
        t.installing
          ? await new Promise((n) => {
              t.installing.addEventListener("statechange", function (i) {
                i.target.state === "activated" && n();
              });
            })
          : t.waiting &&
            (t.waiting.postMessage({ type: "SKIP_WAITING" }),
            await new Promise((n) => {
              t.waiting.addEventListener("statechange", function (i) {
                i.target.state === "activated" && n();
              });
            })),
        await navigator.serviceWorker.ready,
        t
      );
    } catch {
      return null;
    }
  },
  An = async () =>
    Date.now() < Q
      ? null
      : w ||
        ((w = (async () => {
          try {
            const t = await Oe();
            if (!t) return null;
            const n = await vn();
            if (!n) return null;
            const o = await wn(t, {
              vapidKey: mn,
              serviceWorkerRegistration: n,
            });
            return o || null;
          } catch (t) {
            return (
              t?.name === "AbortError" && (Q = Date.now() + 600 * 1e3),
              null
            );
          } finally {
            w = null;
          }
        })()),
        w),
  En = async (e, t) => {
    if (ne()) {
      await oe("/api/notifications/register", {
        method: "POST",
        json: { pushKey: t },
      });
      return;
    }
    const n = te(ie, "userTokens", e);
    try {
      await $e(
        n,
        { userId: e, tokens: We(t), updatedAt: new Date().toISOString() },
        { merge: !0 },
      );
    } catch (o) {
      throw o;
    }
  },
  Pn = async (e, t) => {
    if (ne()) {
      await oe("/api/notifications/unregister", {
        method: "POST",
        json: { pushKey: t },
      });
      return;
    }
    const n = te(ie, "userTokens", e);
    try {
      await je(n, { tokens: qe(t), updatedAt: new Date().toISOString() });
    } catch {}
  },
  On = (e) => {
    let t = null;
    return (
      Oe().then((n) => {
        n &&
          (t = hn(n, (o) => {
            e(o);
          }));
      }),
      () => {
        t && t();
      }
    );
  },
  Mn = async (e) => {
    try {
      if (!V()) return { success: !1, error: "Notificaciones no soportadas" };
      if (!(await bn()))
        return {
          success: !1,
          error:
            "Este navegador no soporta Firebase Messaging (FCM). En iPhone/iPad, normalmente FCM no funciona en Safari; usa Android/Chrome o implementa Web Push sin FCM.",
        };
      if ((await Sn()) !== "granted")
        return { success: !1, error: "Permiso denegado" };
      const o = await An();
      return o
        ? (await En(e, o), { success: !0, token: o })
        : {
            success: !1,
            error:
              "No se pudo obtener el token de notificaciones. Verifica permisos, que la app esté instalada como PWA (iOS) y que el navegador soporte FCM.",
          };
    } catch (t) {
      return { success: !1, error: String(t) };
    }
  },
  Dn = (e, t) => {
    if (Notification.permission !== "granted") return;
    const n = { icon: "/mci-logo.png", badge: "/mci-logo.png", ...t };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((o) => o.showNotification(e, n))
        .catch(() => {
          try {
            new Notification(e, n);
          } catch {}
        });
      return;
    }
    try {
      new Notification(e, n);
    } catch {}
  };
export {
  bn as a,
  Mn as b,
  An as c,
  Dn as d,
  Cn as g,
  V as i,
  On as o,
  Pn as r,
  En as s,
};
