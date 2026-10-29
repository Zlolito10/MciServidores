// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
const Lg = () => {};
var Vl = {};
const kd = function (n) {
  const e = [];
  let t = 0;
  for (let r = 0; r < n.length; r++) {
    let s = n.charCodeAt(r);
    s < 128 ? e[t++] = s : s < 2048 ? (e[t++] = s >> 6 | 192, e[t++] = s & 63 | 128) : (s & 64512) === 55296 && r + 1 < n.length && (n.charCodeAt(r + 1) & 64512) === 56320 ? (s = 65536 + ((s & 1023) << 10) + (n.charCodeAt(++r) & 1023), e[t++] = s >> 18 | 240, e[t++] = s >> 12 & 63 | 128, e[t++] = s >> 6 & 63 | 128, e[t++] = s & 63 | 128) : (e[t++] = s >> 12 | 224, e[t++] = s >> 6 & 63 | 128, e[t++] = s & 63 | 128);
  }
  return e;
};
const Fg = function (n) {
  const e = [];
  let t = 0,
    r = 0;
  for (; t < n.length;) {
    const s = n[t++];
    if (s < 128) e[r++] = String.fromCharCode(s);else if (s > 191 && s < 224) {
      const i = n[t++];
      e[r++] = String.fromCharCode((s & 31) << 6 | i & 63);
    } else if (s > 239 && s < 365) {
      const i = n[t++],
        o = n[t++],
        c = n[t++],
        u = ((s & 7) << 18 | (i & 63) << 12 | (o & 63) << 6 | c & 63) - 65536;
      e[r++] = String.fromCharCode(55296 + (u >> 10)), e[r++] = String.fromCharCode(56320 + (u & 1023));
    } else {
      const i = n[t++],
        o = n[t++];
      e[r++] = String.fromCharCode((s & 15) << 12 | (i & 63) << 6 | o & 63);
    }
  }
  return e.join("");
};
const Dd = {
  byteToCharMap_: null,
  charToByteMap_: null,
  byteToCharMapWebSafe_: null,
  charToByteMapWebSafe_: null,
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  HAS_NATIVE_SUPPORT: typeof atob == "function",
  encodeByteArray(n, e) {
    if (!Array.isArray(n)) throw Error("encodeByteArray takes an array as a parameter");
    this.init_();
    const t = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
      r = [];
    for (let s = 0; s < n.length; s += 3) {
      const i = n[s],
        o = s + 1 < n.length,
        c = o ? n[s + 1] : 0,
        u = s + 2 < n.length,
        h = u ? n[s + 2] : 0,
        f = i >> 2,
        m = (i & 3) << 4 | c >> 4;
      let _ = (c & 15) << 2 | h >> 6,
        b = h & 63;
      u || (b = 64, o || (_ = 64)), r.push(t[f], t[m], t[_], t[b]);
    }
    return r.join("");
  },
  encodeString(n, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? btoa(n) : this.encodeByteArray(kd(n), e);
  },
  decodeString(n, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? atob(n) : Fg(this.decodeStringToByteArray(n, e));
  },
  decodeStringToByteArray(n, e) {
    this.init_();
    const t = e ? this.charToByteMapWebSafe_ : this.charToByteMap_,
      r = [];
    for (let s = 0; s < n.length;) {
      const i = t[n.charAt(s++)],
        c = s < n.length ? t[n.charAt(s)] : 0;
      ++s;
      const h = s < n.length ? t[n.charAt(s)] : 64;
      ++s;
      const m = s < n.length ? t[n.charAt(s)] : 64;
      if (++s, i == null || c == null || h == null || m == null) throw new Ug();
      const _ = i << 2 | c >> 4;
      if (r.push(_), h !== 64) {
        const b = c << 4 & 240 | h >> 2;
        if (r.push(b), m !== 64) {
          const V = h << 6 & 192 | m;
          r.push(V);
        }
      }
    }
    return r;
  },
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
      for (let n = 0; n < this.ENCODED_VALS.length; n++) this.byteToCharMap_[n] = this.ENCODED_VALS.charAt(n), this.charToByteMap_[this.byteToCharMap_[n]] = n, this.byteToCharMapWebSafe_[n] = this.ENCODED_VALS_WEBSAFE.charAt(n), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]] = n, n >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)] = n, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)] = n);
    }
  }
};
class Ug extends Error {
  constructor() {
    super(...arguments), this.name = "DecodeBase64StringError";
  }
}
const Bg = function (n) {
  const e = kd(n);
  return Dd.encodeByteArray(e, !0);
};
const Mi = function (n) {
  return Bg(n).replace(/\./g, "");
};
const Nd = function (n) {
  try {
    return Dd.decodeString(n, !0);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
function xd() {
  if (typeof self < "u") return self;
  if (typeof window < "u") return window;
  if (typeof global < "u") return global;
  throw new Error("Unable to locate global object.");
}
const qg = () => xd().__FIREBASE_DEFAULTS__;
const jg = () => {
  if (typeof process > "u" || typeof Vl > "u") return;
  const n = Vl.__FIREBASE_DEFAULTS__;
  if (n) return JSON.parse(n);
};
const zg = () => {
  if (typeof document > "u") return;
  let n;
  try {
    n = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch {
    return;
  }
  const e = n && Nd(n[1]);
  return e && JSON.parse(e);
};
const co = () => {
  try {
    return Lg() || qg() || jg() || zg();
  } catch (n) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);
    return;
  }
};
const $g = n => co()?.emulatorHosts?.[n];
const Gg = n => {
  const e = $g(n);
  if (!e) return;
  const t = e.lastIndexOf(":");
  if (t <= 0 || t + 1 === e.length) throw new Error(`Invalid host ${e} with no separate hostname and port!`);
  const r = parseInt(e.substring(t + 1), 10);
  return e[0] === "[" ? [e.substring(1, t - 1), r] : [e.substring(0, t), r];
};
const Od = () => co()?.config;
const Kg = n => co()?.[`_${n}`];
class Hg {
  constructor() {
    this.reject = () => {}, this.resolve = () => {}, this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
  wrapCallback(e) {
    return (t, r) => {
      t ? this.reject(t) : this.resolve(r), typeof e == "function" && (this.promise.catch(() => {}), e.length === 1 ? e(t) : e(t, r));
    };
  }
}
function bt(n) {
  try {
    return (n.startsWith("http://") || n.startsWith("https://") ? new URL(n).hostname : n).endsWith(".cloudworkstations.dev");
  } catch {
    return !1;
  }
}
async function uo(n) {
  return (await fetch(n, {
    credentials: "include"
  })).ok;
}
function Md(n, e) {
  if (n.uid) throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
  const t = {
      alg: "none",
      type: "JWT"
    },
    r = e || "demo-project",
    s = n.iat || 0,
    i = n.sub || n.user_id;
  if (!i) throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  const o = {
    iss: `https://securetoken.google.com/${r}`,
    aud: r,
    iat: s,
    exp: s + 3600,
    auth_time: s,
    sub: i,
    user_id: i,
    firebase: {
      sign_in_provider: "custom",
      identities: {}
    },
    ...n
  };
  return [Mi(JSON.stringify(t)), Mi(JSON.stringify(o)), ""].join(".");
}
const is = {};
function Wg() {
  const n = {
    prod: [],
    emulator: []
  };
  for (const e of Object.keys(is)) is[e] ? n.emulator.push(e) : n.prod.push(e);
  return n;
}
function Qg(n) {
  let e = document.getElementById(n),
    t = !1;
  return e || (e = document.createElement("div"), e.setAttribute("id", n), t = !0), {
    created: t,
    element: e
  };
}
let kl = !1;
function mc(n, e) {
  if (typeof window > "u" || typeof document > "u" || !bt(window.location.host) || is[n] === e || is[n] || kl) return;
  is[n] = e;
  function t(_) {
    return `__firebase__banner__${_}`;
  }
  const r = "__firebase__banner",
    i = Wg().prod.length > 0;
  function o() {
    const _ = document.getElementById(r);
    _ && _.remove();
  }
  function c(_) {
    _.style.display = "flex", _.style.background = "#7faaf0", _.style.position = "fixed", _.style.bottom = "5px", _.style.left = "5px", _.style.padding = ".5em", _.style.borderRadius = "5px", _.style.alignItems = "center";
  }
  function u(_, b) {
    _.setAttribute("width", "24"), _.setAttribute("id", b), _.setAttribute("height", "24"), _.setAttribute("viewBox", "0 0 24 24"), _.setAttribute("fill", "none"), _.style.marginLeft = "-6px";
  }
  function h() {
    const _ = document.createElement("span");
    return _.style.cursor = "pointer", _.style.marginLeft = "16px", _.style.fontSize = "24px", _.innerHTML = " &times;", _.onclick = () => {
      kl = !0, o();
    }, _;
  }
  function f(_, b) {
    _.setAttribute("id", b), _.innerText = "Learn more", _.href = "https://firebase.google.com/docs/studio/preview-apps#preview-backend", _.setAttribute("target", "__blank"), _.style.paddingLeft = "5px", _.style.textDecoration = "underline";
  }
  function m() {
    const _ = Qg(r),
      b = t("text"),
      V = document.getElementById(b) || document.createElement("span"),
      N = t("learnmore"),
      C = document.getElementById(N) || document.createElement("a"),
      q = t("preprendIcon"),
      U = document.getElementById(q) || document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (_.created) {
      const M = _.element;
      c(M), f(C, N);
      const G = h();
      u(U, q), M.append(U, V, C, G), document.body.appendChild(M);
    }
    i ? (V.innerText = "Preview backend disconnected.", U.innerHTML = `<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`) : (U.innerHTML = `<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`, V.innerText = "Preview backend running in this workspace."), V.setAttribute("id", b);
  }
  document.readyState === "loading" ? window.addEventListener("DOMContentLoaded", m) : m();
}
function Ie() {
  return typeof navigator < "u" && typeof navigator.userAgent == "string" ? navigator.userAgent : "";
}
function Xg() {
  return typeof window < "u" && !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ie());
}
function Ld() {
  const n = co()?.forceEnvironment;
  if (n === "node") return !0;
  if (n === "browser") return !1;
  try {
    return Object.prototype.toString.call(global.process) === "[object process]";
  } catch {
    return !1;
  }
}
function Jg() {
  return typeof navigator < "u" && navigator.userAgent === "Cloudflare-Workers";
}
function Yg() {
  const n = typeof chrome == "object" ? chrome.runtime : typeof browser == "object" ? browser.runtime : void 0;
  return typeof n == "object" && n.id !== void 0;
}
function Zg() {
  return typeof navigator == "object" && navigator.product === "ReactNative";
}
function e_() {
  const n = Ie();
  return n.indexOf("MSIE ") >= 0 || n.indexOf("Trident/") >= 0;
}
function Fd() {
  return !Ld() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
}
function Ud() {
  return !Ld() && !!navigator.userAgent && (navigator.userAgent.includes("Safari") || navigator.userAgent.includes("WebKit")) && !navigator.userAgent.includes("Chrome");
}
function Bd() {
  try {
    return typeof indexedDB == "object";
  } catch {
    return !1;
  }
}
function t_() {
  return new Promise((n, e) => {
    try {
      let t = !0;
      const r = "validate-browser-context-for-indexeddb-analytics-module",
        s = self.indexedDB.open(r);
      s.onsuccess = () => {
        s.result.close(), t || self.indexedDB.deleteDatabase(r), n(!0);
      }, s.onupgradeneeded = () => {
        t = !1;
      }, s.onerror = () => {
        e(s.error?.message || "");
      };
    } catch (t) {
      e(t);
    }
  });
}
function AR() {
  return !(typeof navigator > "u" || !navigator.cookieEnabled);
}
const n_ = "FirebaseError";
class ft extends Error {
  constructor(e, t, r) {
    super(t), this.code = e, this.customData = r, this.name = n_, Object.setPrototypeOf(this, ft.prototype), Error.captureStackTrace && Error.captureStackTrace(this, Vs.prototype.create);
  }
}
class Vs {
  constructor(e, t, r) {
    this.service = e, this.serviceName = t, this.errors = r;
  }
  create(e, ...t) {
    const r = t[0] || {},
      s = `${this.service}/${e}`,
      i = this.errors[e],
      o = i ? r_(i, r) : "Error",
      c = `${this.serviceName}: ${o} (${s}).`;
    return new ft(s, c, r);
  }
}
function r_(n, e) {
  return n.replace(s_, (t, r) => {
    const s = e[r];
    return s != null ? String(s) : `<${r}?>`;
  });
}
const s_ = /\{\$([^}]+)}/g;
function i_(n) {
  for (const e in n) if (Object.prototype.hasOwnProperty.call(n, e)) return !1;
  return !0;
}
function ht(n, e) {
  if (n === e) return !0;
  const t = Object.keys(n),
    r = Object.keys(e);
  for (const s of t) {
    if (!r.includes(s)) return !1;
    const i = n[s],
      o = e[s];
    if (Dl(i) && Dl(o)) {
      if (!ht(i, o)) return !1;
    } else if (i !== o) return !1;
  }
  for (const s of r) if (!t.includes(s)) return !1;
  return !0;
}
function Dl(n) {
  return n !== null && typeof n == "object";
}
function ks(n) {
  const e = [];
  for (const [t, r] of Object.entries(n)) Array.isArray(r) ? r.forEach(s => {
    e.push(encodeURIComponent(t) + "=" + encodeURIComponent(s));
  }) : e.push(encodeURIComponent(t) + "=" + encodeURIComponent(r));
  return e.length ? "&" + e.join("&") : "";
}
function Yr(n) {
  const e = {};
  return n.replace(/^\?/, "").split("&").forEach(r => {
    if (r) {
      const [s, i] = r.split("=");
      e[decodeURIComponent(s)] = decodeURIComponent(i);
    }
  }), e;
}
function Zr(n) {
  const e = n.indexOf("?");
  if (!e) return "";
  const t = n.indexOf("#", e);
  return n.substring(e, t > 0 ? t : void 0);
}
function o_(n, e) {
  const t = new a_(n, e);
  return t.subscribe.bind(t);
}
class a_ {
  constructor(e, t) {
    this.observers = [], this.unsubscribes = [], this.observerCount = 0, this.task = Promise.resolve(), this.finalized = !1, this.onNoObservers = t, this.task.then(() => {
      e(this);
    }).catch(r => {
      this.error(r);
    });
  }
  next(e) {
    this.forEachObserver(t => {
      t.next(e);
    });
  }
  error(e) {
    this.forEachObserver(t => {
      t.error(e);
    }), this.close(e);
  }
  complete() {
    this.forEachObserver(e => {
      e.complete();
    }), this.close();
  }
  subscribe(e, t, r) {
    let s;
    if (e === void 0 && t === void 0 && r === void 0) throw new Error("Missing Observer.");
    c_(e, ["next", "error", "complete"]) ? s = e : s = {
      next: e,
      error: t,
      complete: r
    }, s.next === void 0 && (s.next = fa), s.error === void 0 && (s.error = fa), s.complete === void 0 && (s.complete = fa);
    const i = this.unsubscribeOne.bind(this, this.observers.length);
    return this.finalized && this.task.then(() => {
      try {
        this.finalError ? s.error(this.finalError) : s.complete();
      } catch {}
    }), this.observers.push(s), i;
  }
  unsubscribeOne(e) {
    this.observers === void 0 || this.observers[e] === void 0 || (delete this.observers[e], this.observerCount -= 1, this.observerCount === 0 && this.onNoObservers !== void 0 && this.onNoObservers(this));
  }
  forEachObserver(e) {
    if (!this.finalized) for (let t = 0; t < this.observers.length; t++) this.sendOne(t, e);
  }
  sendOne(e, t) {
    this.task.then(() => {
      if (this.observers !== void 0 && this.observers[e] !== void 0) try {
        t(this.observers[e]);
      } catch (r) {
        typeof console < "u" && console.error && console.error(r);
      }
    });
  }
  close(e) {
    this.finalized || (this.finalized = !0, e !== void 0 && (this.finalError = e), this.task.then(() => {
      this.observers = void 0, this.onNoObservers = void 0;
    }));
  }
}
function c_(n, e) {
  if (typeof n != "object" || n === null) return !1;
  for (const t of e) if (t in n && typeof n[t] == "function") return !0;
  return !1;
}
function fa() {}
function se(n) {
  return n && n._delegate ? n._delegate : n;
}
class Xt {
  constructor(e, t, r) {
    this.name = e, this.instanceFactory = t, this.type = r, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null;
  }
  setInstantiationMode(e) {
    return this.instantiationMode = e, this;
  }
  setMultipleInstances(e) {
    return this.multipleInstances = e, this;
  }
  setServiceProps(e) {
    return this.serviceProps = e, this;
  }
  setInstanceCreatedCallback(e) {
    return this.onInstanceCreated = e, this;
  }
}
const fn = "[DEFAULT]";
class u_ {
  constructor(e, t) {
    this.name = e, this.container = t, this.component = null, this.instances = new Map(), this.instancesDeferred = new Map(), this.instancesOptions = new Map(), this.onInitCallbacks = new Map();
  }
  get(e) {
    const t = this.normalizeInstanceIdentifier(e);
    if (!this.instancesDeferred.has(t)) {
      const r = new Hg();
      if (this.instancesDeferred.set(t, r), this.isInitialized(t) || this.shouldAutoInitialize()) try {
        const s = this.getOrInitializeService({
          instanceIdentifier: t
        });
        s && r.resolve(s);
      } catch {}
    }
    return this.instancesDeferred.get(t).promise;
  }
  getImmediate(e) {
    const t = this.normalizeInstanceIdentifier(e?.identifier),
      r = e?.optional ?? !1;
    if (this.isInitialized(t) || this.shouldAutoInitialize()) try {
      return this.getOrInitializeService({
        instanceIdentifier: t
      });
    } catch (s) {
      if (r) return null;
      throw s;
    } else {
      if (r) return null;
      throw Error(`Service ${this.name} is not available`);
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(e) {
    if (e.name !== this.name) throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
    if (this.component) throw Error(`Component for ${this.name} has already been provided`);
    if (this.component = e, !!this.shouldAutoInitialize()) {
      if (h_(e)) try {
        this.getOrInitializeService({
          instanceIdentifier: fn
        });
      } catch {}
      for (const [t, r] of this.instancesDeferred.entries()) {
        const s = this.normalizeInstanceIdentifier(t);
        try {
          const i = this.getOrInitializeService({
            instanceIdentifier: s
          });
          r.resolve(i);
        } catch {}
      }
    }
  }
  clearInstance(e = fn) {
    this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e);
  }
  async delete() {
    const e = Array.from(this.instances.values());
    await Promise.all([...e.filter(t => "INTERNAL" in t).map(t => t.INTERNAL.delete()), ...e.filter(t => "_delete" in t).map(t => t._delete())]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(e = fn) {
    return this.instances.has(e);
  }
  getOptions(e = fn) {
    return this.instancesOptions.get(e) || {};
  }
  initialize(e = {}) {
    const {
        options: t = {}
      } = e,
      r = this.normalizeInstanceIdentifier(e.instanceIdentifier);
    if (this.isInitialized(r)) throw Error(`${this.name}(${r}) has already been initialized`);
    if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
    const s = this.getOrInitializeService({
      instanceIdentifier: r,
      options: t
    });
    for (const [i, o] of this.instancesDeferred.entries()) {
      const c = this.normalizeInstanceIdentifier(i);
      r === c && o.resolve(s);
    }
    return s;
  }
  onInit(e, t) {
    const r = this.normalizeInstanceIdentifier(t),
      s = this.onInitCallbacks.get(r) ?? new Set();
    s.add(e), this.onInitCallbacks.set(r, s);
    const i = this.instances.get(r);
    return i && e(i, r), () => {
      s.delete(e);
    };
  }
  invokeOnInitCallbacks(e, t) {
    const r = this.onInitCallbacks.get(t);
    if (r) for (const s of r) try {
      s(e, t);
    } catch {}
  }
  getOrInitializeService({
    instanceIdentifier: e,
    options: t = {}
  }) {
    let r = this.instances.get(e);
    if (!r && this.component && (r = this.component.instanceFactory(this.container, {
      instanceIdentifier: l_(e),
      options: t
    }), this.instances.set(e, r), this.instancesOptions.set(e, t), this.invokeOnInitCallbacks(r, e), this.component.onInstanceCreated)) try {
      this.component.onInstanceCreated(this.container, e, r);
    } catch {}
    return r || null;
  }
  normalizeInstanceIdentifier(e = fn) {
    return this.component ? this.component.multipleInstances ? e : fn : e;
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}
function l_(n) {
  return n === fn ? void 0 : n;
}
function h_(n) {
  return n.instantiationMode === "EAGER";
}
class d_ {
  constructor(e) {
    this.name = e, this.providers = new Map();
  }
  addComponent(e) {
    const t = this.getProvider(e.name);
    if (t.isComponentSet()) throw new Error(`Component ${e.name} has already been registered with ${this.name}`);
    t.setComponent(e);
  }
  addOrOverwriteComponent(e) {
    this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name), this.addComponent(e);
  }
  getProvider(e) {
    if (this.providers.has(e)) return this.providers.get(e);
    const t = new u_(e, this);
    return this.providers.set(e, t), t;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}
var X;
(function (n) {
  n[n.DEBUG = 0] = "DEBUG", n[n.VERBOSE = 1] = "VERBOSE", n[n.INFO = 2] = "INFO", n[n.WARN = 3] = "WARN", n[n.ERROR = 4] = "ERROR", n[n.SILENT = 5] = "SILENT";
})(X || (X = {}));
const f_ = {
  debug: X.DEBUG,
  verbose: X.VERBOSE,
  info: X.INFO,
  warn: X.WARN,
  error: X.ERROR,
  silent: X.SILENT
};
const p_ = X.INFO;
const m_ = {
  [X.DEBUG]: "log",
  [X.VERBOSE]: "log",
  [X.INFO]: "info",
  [X.WARN]: "warn",
  [X.ERROR]: "error"
};
const g_ = (n, e, ...t) => {
  if (e < n.logLevel) return;
  const r = new Date().toISOString(),
    s = m_[e];
  if (s) console[s](`[${r}]  ${n.name}:`, ...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`);
};
class gc {
  constructor(e) {
    this.name = e, this._logLevel = p_, this._logHandler = g_, this._userLogHandler = null;
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(e) {
    if (!(e in X)) throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
    this._logLevel = e;
  }
  setLogLevel(e) {
    this._logLevel = typeof e == "string" ? f_[e] : e;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(e) {
    if (typeof e != "function") throw new TypeError("Value assigned to `logHandler` must be a function");
    this._logHandler = e;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(e) {
    this._userLogHandler = e;
  }
  debug(...e) {
    this._userLogHandler && this._userLogHandler(this, X.DEBUG, ...e), this._logHandler(this, X.DEBUG, ...e);
  }
  log(...e) {
    this._userLogHandler && this._userLogHandler(this, X.VERBOSE, ...e), this._logHandler(this, X.VERBOSE, ...e);
  }
  info(...e) {
    this._userLogHandler && this._userLogHandler(this, X.INFO, ...e), this._logHandler(this, X.INFO, ...e);
  }
  warn(...e) {
    this._userLogHandler && this._userLogHandler(this, X.WARN, ...e), this._logHandler(this, X.WARN, ...e);
  }
  error(...e) {
    this._userLogHandler && this._userLogHandler(this, X.ERROR, ...e), this._logHandler(this, X.ERROR, ...e);
  }
}
const __ = (n, e) => e.some(t => n instanceof t);
let Nl;
let xl;
function y_() {
  return Nl || (Nl = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
}
function I_() {
  return xl || (xl = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]);
}
const qd = new WeakMap();
const Va = new WeakMap();
const jd = new WeakMap();
const pa = new WeakMap();
const _c = new WeakMap();
function E_(n) {
  const e = new Promise((t, r) => {
    const s = () => {
        n.removeEventListener("success", i), n.removeEventListener("error", o);
      },
      i = () => {
        t(Tt(n.result)), s();
      },
      o = () => {
        r(n.error), s();
      };
    n.addEventListener("success", i), n.addEventListener("error", o);
  });
  return e.then(t => {
    t instanceof IDBCursor && qd.set(t, n);
  }).catch(() => {}), _c.set(e, n), e;
}
function T_(n) {
  if (Va.has(n)) return;
  const e = new Promise((t, r) => {
    const s = () => {
        n.removeEventListener("complete", i), n.removeEventListener("error", o), n.removeEventListener("abort", o);
      },
      i = () => {
        t(), s();
      },
      o = () => {
        r(n.error || new DOMException("AbortError", "AbortError")), s();
      };
    n.addEventListener("complete", i), n.addEventListener("error", o), n.addEventListener("abort", o);
  });
  Va.set(n, e);
}
let ka = {
  get(n, e, t) {
    if (n instanceof IDBTransaction) {
      if (e === "done") return Va.get(n);
      if (e === "objectStoreNames") return n.objectStoreNames || jd.get(n);
      if (e === "store") return t.objectStoreNames[1] ? void 0 : t.objectStore(t.objectStoreNames[0]);
    }
    return Tt(n[e]);
  },
  set(n, e, t) {
    return n[e] = t, !0;
  },
  has(n, e) {
    return n instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in n;
  }
};
function w_(n) {
  ka = n(ka);
}
function v_(n) {
  return n === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function (e, ...t) {
    const r = n.call(ma(this), e, ...t);
    return jd.set(r, e.sort ? e.sort() : [e]), Tt(r);
  } : I_().includes(n) ? function (...e) {
    return n.apply(ma(this), e), Tt(qd.get(this));
  } : function (...e) {
    return Tt(n.apply(ma(this), e));
  };
}
function A_(n) {
  return typeof n == "function" ? v_(n) : (n instanceof IDBTransaction && T_(n), __(n, y_()) ? new Proxy(n, ka) : n);
}
function Tt(n) {
  if (n instanceof IDBRequest) return E_(n);
  if (pa.has(n)) return pa.get(n);
  const e = A_(n);
  return e !== n && (pa.set(n, e), _c.set(e, n)), e;
}
const ma = n => _c.get(n);
function R_(n, e, {
  blocked: t,
  upgrade: r,
  blocking: s,
  terminated: i
} = {}) {
  const o = indexedDB.open(n, e),
    c = Tt(o);
  return r && o.addEventListener("upgradeneeded", u => {
    r(Tt(o.result), u.oldVersion, u.newVersion, Tt(o.transaction), u);
  }), t && o.addEventListener("blocked", u => t(u.oldVersion, u.newVersion, u)), c.then(u => {
    i && u.addEventListener("close", () => i()), s && u.addEventListener("versionchange", h => s(h.oldVersion, h.newVersion, h));
  }).catch(() => {}), c;
}
function RR(n, {
  blocked: e
} = {}) {
  const t = indexedDB.deleteDatabase(n);
  return e && t.addEventListener("blocked", r => e(r.oldVersion, r)), Tt(t).then(() => {});
}
const b_ = ["get", "getKey", "getAll", "getAllKeys", "count"];
const P_ = ["put", "add", "delete", "clear"];
const ga = new Map();
function Ol(n, e) {
  if (!(n instanceof IDBDatabase && !(e in n) && typeof e == "string")) return;
  if (ga.get(e)) return ga.get(e);
  const t = e.replace(/FromIndex$/, ""),
    r = e !== t,
    s = P_.includes(t);
  if (!(t in (r ? IDBIndex : IDBObjectStore).prototype) || !(s || b_.includes(t))) return;
  const i = async function (o, ...c) {
    const u = this.transaction(o, s ? "readwrite" : "readonly");
    let h = u.store;
    return r && (h = h.index(c.shift())), (await Promise.all([h[t](...c), s && u.done]))[0];
  };
  return ga.set(e, i), i;
}
w_(n => ({
  ...n,
  get: (e, t, r) => Ol(e, t) || n.get(e, t, r),
  has: (e, t) => !!Ol(e, t) || n.has(e, t)
}));
class S_ {
  constructor(e) {
    this.container = e;
  }
  getPlatformInfoString() {
    return this.container.getProviders().map(t => {
      if (C_(t)) {
        const r = t.getImmediate();
        return `${r.library}/${r.version}`;
      } else return null;
    }).filter(t => t).join(" ");
  }
}
function C_(n) {
  return n.getComponent()?.type === "VERSION";
}
const Da = "@firebase/app";
const Ml = "0.14.6";
const wt = new gc("@firebase/app");
const V_ = "@firebase/app-compat";
const k_ = "@firebase/analytics-compat";
const D_ = "@firebase/analytics";
const N_ = "@firebase/app-check-compat";
const x_ = "@firebase/app-check";
const O_ = "@firebase/auth";
const M_ = "@firebase/auth-compat";
const L_ = "@firebase/database";
const F_ = "@firebase/data-connect";
const U_ = "@firebase/database-compat";
const B_ = "@firebase/functions";
const q_ = "@firebase/functions-compat";
const j_ = "@firebase/installations";
const z_ = "@firebase/installations-compat";
const $_ = "@firebase/messaging";
const G_ = "@firebase/messaging-compat";
const K_ = "@firebase/performance";
const H_ = "@firebase/performance-compat";
const W_ = "@firebase/remote-config";
const Q_ = "@firebase/remote-config-compat";
const X_ = "@firebase/storage";
const J_ = "@firebase/storage-compat";
const Y_ = "@firebase/firestore";
const Z_ = "@firebase/ai";
const ey = "@firebase/firestore-compat";
const ty = "firebase";
const ny = "12.6.0";
const Na = "[DEFAULT]";
const ry = {
  [Da]: "fire-core",
  [V_]: "fire-core-compat",
  [D_]: "fire-analytics",
  [k_]: "fire-analytics-compat",
  [x_]: "fire-app-check",
  [N_]: "fire-app-check-compat",
  [O_]: "fire-auth",
  [M_]: "fire-auth-compat",
  [L_]: "fire-rtdb",
  [F_]: "fire-data-connect",
  [U_]: "fire-rtdb-compat",
  [B_]: "fire-fn",
  [q_]: "fire-fn-compat",
  [j_]: "fire-iid",
  [z_]: "fire-iid-compat",
  [$_]: "fire-fcm",
  [G_]: "fire-fcm-compat",
  [K_]: "fire-perf",
  [H_]: "fire-perf-compat",
  [W_]: "fire-rc",
  [Q_]: "fire-rc-compat",
  [X_]: "fire-gcs",
  [J_]: "fire-gcs-compat",
  [Y_]: "fire-fst",
  [ey]: "fire-fst-compat",
  [Z_]: "fire-vertex",
  "fire-js": "fire-js",
  [ty]: "fire-js-all"
};
const Li = new Map();
const sy = new Map();
const xa = new Map();
function Ll(n, e) {
  try {
    n.container.addComponent(e);
  } catch (t) {
    wt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`, t);
  }
}
function Pn(n) {
  const e = n.name;
  if (xa.has(e)) return wt.debug(`There were multiple attempts to register component ${e}.`), !1;
  xa.set(e, n);
  for (const t of Li.values()) Ll(t, n);
  for (const t of sy.values()) Ll(t, n);
  return !0;
}
function yc(n, e) {
  const t = n.container.getProvider("heartbeat").getImmediate({
    optional: !0
  });
  return t && t.triggerHeartbeat(), n.container.getProvider(e);
}
function xe(n) {
  return n == null ? !1 : n.settings !== void 0;
}
const iy = {
  "no-app": "No Firebase App '{$appName}' has been created - call initializeApp() first",
  "bad-app-name": "Illegal App name: '{$appName}'",
  "duplicate-app": "Firebase App named '{$appName}' already exists with different options or config",
  "app-deleted": "Firebase App named '{$appName}' already deleted",
  "server-app-deleted": "Firebase Server App has been deleted",
  "no-options": "Need to provide options, when not being deployed to hosting via source.",
  "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  "invalid-log-argument": "First argument to `onLog` must be null or a function.",
  "idb-open": "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-get": "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-set": "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-delete": "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  "finalization-registry-not-supported": "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
  "invalid-server-app-environment": "FirebaseServerApp is not for use in browser environments."
};
const Gt = new Vs("app", "Firebase", iy);
class oy {
  constructor(e, t, r) {
    this._isDeleted = !1, this._options = {
      ...e
    }, this._config = {
      ...t
    }, this._name = t.name, this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled, this._container = r, this.container.addComponent(new Xt("app", () => this, "PUBLIC"));
  }
  get automaticDataCollectionEnabled() {
    return this.checkDestroyed(), this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(e) {
    this.checkDestroyed(), this._automaticDataCollectionEnabled = e;
  }
  get name() {
    return this.checkDestroyed(), this._name;
  }
  get options() {
    return this.checkDestroyed(), this._options;
  }
  get config() {
    return this.checkDestroyed(), this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(e) {
    this._isDeleted = e;
  }
  checkDestroyed() {
    if (this.isDeleted) throw Gt.create("app-deleted", {
      appName: this._name
    });
  }
}
const Fn = ny;
function ay(n, e = {}) {
  let t = n;
  typeof e != "object" && (e = {
    name: e
  });
  const r = {
      name: Na,
      automaticDataCollectionEnabled: !0,
      ...e
    },
    s = r.name;
  if (typeof s != "string" || !s) throw Gt.create("bad-app-name", {
    appName: String(s)
  });
  if (t || (t = Od()), !t) throw Gt.create("no-options");
  const i = Li.get(s);
  if (i) {
    if (ht(t, i.options) && ht(r, i.config)) return i;
    throw Gt.create("duplicate-app", {
      appName: s
    });
  }
  const o = new d_(s);
  for (const u of xa.values()) o.addComponent(u);
  const c = new oy(t, r, o);
  return Li.set(s, c), c;
}
function cy(n = Na) {
  const e = Li.get(n);
  if (!e && n === Na && Od()) return ay();
  if (!e) throw Gt.create("no-app", {
    appName: n
  });
  return e;
}
function ot(n, e, t) {
  let r = ry[n] ?? n;
  t && (r += `-${t}`);
  const s = r.match(/\s|\//),
    i = e.match(/\s|\//);
  if (s || i) {
    const o = [`Unable to register library "${r}" with version "${e}":`];
    s && o.push(`library name "${r}" contains illegal characters (whitespace or "/")`), s && i && o.push("and"), i && o.push(`version name "${e}" contains illegal characters (whitespace or "/")`), wt.warn(o.join(" "));
    return;
  }
  Pn(new Xt(`${r}-version`, () => ({
    library: r,
    version: e
  }), "VERSION"));
}
const uy = "firebase-heartbeat-database";
const ly = 1;
const gs = "firebase-heartbeat-store";
let _a = null;
function zd() {
  return _a || (_a = R_(uy, ly, {
    upgrade: (n, e) => {
      switch (e) {
        case 0:
          try {
            n.createObjectStore(gs);
          } catch (t) {
            console.warn(t);
          }
      }
    }
  }).catch(n => {
    throw Gt.create("idb-open", {
      originalErrorMessage: n.message
    });
  })), _a;
}
async function hy(n) {
  try {
    const t = (await zd()).transaction(gs),
      r = await t.objectStore(gs).get($d(n));
    return await t.done, r;
  } catch (e) {
    if (e instanceof ft) wt.warn(e.message);else {
      const t = Gt.create("idb-get", {
        originalErrorMessage: e?.message
      });
      wt.warn(t.message);
    }
  }
}
async function Fl(n, e) {
  try {
    const r = (await zd()).transaction(gs, "readwrite");
    await r.objectStore(gs).put(e, $d(n)), await r.done;
  } catch (t) {
    if (t instanceof ft) wt.warn(t.message);else {
      const r = Gt.create("idb-set", {
        originalErrorMessage: t?.message
      });
      wt.warn(r.message);
    }
  }
}
function $d(n) {
  return `${n.name}!${n.options.appId}`;
}
const dy = 1024;
const fy = 30;
class py {
  constructor(e) {
    this.container = e, this._heartbeatsCache = null;
    const t = this.container.getProvider("app").getImmediate();
    this._storage = new gy(t), this._heartbeatsCachePromise = this._storage.read().then(r => (this._heartbeatsCache = r, r));
  }
  async triggerHeartbeat() {
    try {
      const t = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),
        r = Ul();
      if (this._heartbeatsCache?.heartbeats == null && (this._heartbeatsCache = await this._heartbeatsCachePromise, this._heartbeatsCache?.heartbeats == null) || this._heartbeatsCache.lastSentHeartbeatDate === r || this._heartbeatsCache.heartbeats.some(s => s.date === r)) return;
      if (this._heartbeatsCache.heartbeats.push({
        date: r,
        agent: t
      }), this._heartbeatsCache.heartbeats.length > fy) {
        const s = _y(this._heartbeatsCache.heartbeats);
        this._heartbeatsCache.heartbeats.splice(s, 1);
      }
      return this._storage.overwrite(this._heartbeatsCache);
    } catch (e) {
      wt.warn(e);
    }
  }
  async getHeartbeatsHeader() {
    try {
      if (this._heartbeatsCache === null && (await this._heartbeatsCachePromise), this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) return "";
      const e = Ul(),
        {
          heartbeatsToSend: t,
          unsentEntries: r
        } = my(this._heartbeatsCache.heartbeats),
        s = Mi(JSON.stringify({
          version: 2,
          heartbeats: t
        }));
      return this._heartbeatsCache.lastSentHeartbeatDate = e, r.length > 0 ? (this._heartbeatsCache.heartbeats = r, await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [], this._storage.overwrite(this._heartbeatsCache)), s;
    } catch (e) {
      return wt.warn(e), "";
    }
  }
}
function Ul() {
  return new Date().toISOString().substring(0, 10);
}
function my(n, e = dy) {
  const t = [];
  let r = n.slice();
  for (const s of n) {
    const i = t.find(o => o.agent === s.agent);
    if (i) {
      if (i.dates.push(s.date), Bl(t) > e) {
        i.dates.pop();
        break;
      }
    } else if (t.push({
      agent: s.agent,
      dates: [s.date]
    }), Bl(t) > e) {
      t.pop();
      break;
    }
    r = r.slice(1);
  }
  return {
    heartbeatsToSend: t,
    unsentEntries: r
  };
}
class gy {
  constructor(e) {
    this.app = e, this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    return Bd() ? t_().then(() => !0).catch(() => !1) : !1;
  }
  async read() {
    if (await this._canUseIndexedDBPromise) {
      const t = await hy(this.app);
      return t?.heartbeats ? t : {
        heartbeats: []
      };
    } else return {
      heartbeats: []
    };
  }
  async overwrite(e) {
    if (await this._canUseIndexedDBPromise) {
      const r = await this.read();
      return Fl(this.app, {
        lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? r.lastSentHeartbeatDate,
        heartbeats: e.heartbeats
      });
    } else return;
  }
  async add(e) {
    if (await this._canUseIndexedDBPromise) {
      const r = await this.read();
      return Fl(this.app, {
        lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? r.lastSentHeartbeatDate,
        heartbeats: [...r.heartbeats, ...e.heartbeats]
      });
    } else return;
  }
}
function Bl(n) {
  return Mi(JSON.stringify({
    version: 2,
    heartbeats: n
  })).length;
}
function _y(n) {
  if (n.length === 0) return -1;
  let e = 0,
    t = n[0].date;
  for (let r = 1; r < n.length; r++) n[r].date < t && (t = n[r].date, e = r);
  return e;
}
function yy(n) {
  Pn(new Xt("platform-logger", e => new S_(e), "PRIVATE")), Pn(new Xt("heartbeat", e => new py(e), "PRIVATE")), ot(Da, Ml, n), ot(Da, Ml, "esm2020"), ot("fire-js", "");
}
yy("");
function Gd() {
  return {
    "dependent-sdk-initialized-before-auth": "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
  };
}
const Kd = Gd;
const Hd = new Vs("auth", "Firebase", Gd());
const Fi = new gc("@firebase/auth");
function Iy(n, ...e) {
  Fi.logLevel <= X.WARN && Fi.warn(`Auth (${Fn}): ${n}`, ...e);
}
function Ei(n, ...e) {
  Fi.logLevel <= X.ERROR && Fi.error(`Auth (${Fn}): ${n}`, ...e);
}
function He(n, ...e) {
  throw Ec(n, ...e);
}
function Xe(n, ...e) {
  return Ec(n, ...e);
}
function Ic(n, e, t) {
  const r = {
    ...Kd(),
    [e]: t
  };
  return new Vs("auth", "Firebase", r).create(e, {
    appName: n.name
  });
}
function at(n) {
  return Ic(n, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
}
function Ey(n, e, t) {
  const r = t;
  if (!(e instanceof r)) throw r.name !== e.constructor.name && He(n, "argument-error"), Ic(n, "argument-error", `Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`);
}
function Ec(n, ...e) {
  if (typeof n != "string") {
    const t = e[0],
      r = [...e.slice(1)];
    return r[0] && (r[0].appName = n.name), n._errorFactory.create(t, ...r);
  }
  return Hd.create(n, ...e);
}
function j(n, e, ...t) {
  if (!n) throw Ec(e, ...t);
}
function yt(n) {
  const e = "INTERNAL ASSERTION FAILED: " + n;
  throw Ei(e), new Error(e);
}
function vt(n, e) {
  n || yt(e);
}
function Oa() {
  return typeof self < "u" && self.location?.href || "";
}
function Ty() {
  return ql() === "http:" || ql() === "https:";
}
function ql() {
  return typeof self < "u" && self.location?.protocol || null;
}
function wy() {
  return typeof navigator < "u" && navigator && "onLine" in navigator && typeof navigator.onLine == "boolean" && (Ty() || Yg() || "connection" in navigator) ? navigator.onLine : !0;
}
function vy() {
  if (typeof navigator > "u") return null;
  const n = navigator;
  return n.languages && n.languages[0] || n.language || null;
}
class Ds {
  constructor(e, t) {
    this.shortDelay = e, this.longDelay = t, vt(t > e, "Short delay should be less than long delay!"), this.isMobile = Xg() || Zg();
  }
  get() {
    return wy() ? this.isMobile ? this.longDelay : this.shortDelay : Math.min(5e3, this.shortDelay);
  }
}
function Tc(n, e) {
  vt(n.emulator, "Emulator should always be set here");
  const {
    url: t
  } = n.emulator;
  return e ? `${t}${e.startsWith("/") ? e.slice(1) : e}` : t;
}
class Wd {
  static initialize(e, t, r) {
    this.fetchImpl = e, t && (this.headersImpl = t), r && (this.responseImpl = r);
  }
  static fetch() {
    if (this.fetchImpl) return this.fetchImpl;
    if (typeof self < "u" && "fetch" in self) return self.fetch;
    if (typeof globalThis < "u" && globalThis.fetch) return globalThis.fetch;
    if (typeof fetch < "u") return fetch;
    yt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static headers() {
    if (this.headersImpl) return this.headersImpl;
    if (typeof self < "u" && "Headers" in self) return self.Headers;
    if (typeof globalThis < "u" && globalThis.Headers) return globalThis.Headers;
    if (typeof Headers < "u") return Headers;
    yt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static response() {
    if (this.responseImpl) return this.responseImpl;
    if (typeof self < "u" && "Response" in self) return self.Response;
    if (typeof globalThis < "u" && globalThis.Response) return globalThis.Response;
    if (typeof Response < "u") return Response;
    yt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
}
const Ay = {
  CREDENTIAL_MISMATCH: "custom-token-mismatch",
  MISSING_CUSTOM_TOKEN: "internal-error",
  INVALID_IDENTIFIER: "invalid-email",
  MISSING_CONTINUE_URI: "internal-error",
  INVALID_PASSWORD: "wrong-password",
  MISSING_PASSWORD: "missing-password",
  INVALID_LOGIN_CREDENTIALS: "invalid-credential",
  EMAIL_EXISTS: "email-already-in-use",
  PASSWORD_LOGIN_DISABLED: "operation-not-allowed",
  INVALID_IDP_RESPONSE: "invalid-credential",
  INVALID_PENDING_TOKEN: "invalid-credential",
  FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use",
  MISSING_REQ_TYPE: "internal-error",
  EMAIL_NOT_FOUND: "user-not-found",
  RESET_PASSWORD_EXCEED_LIMIT: "too-many-requests",
  EXPIRED_OOB_CODE: "expired-action-code",
  INVALID_OOB_CODE: "invalid-action-code",
  MISSING_OOB_CODE: "internal-error",
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login",
  INVALID_ID_TOKEN: "invalid-user-token",
  TOKEN_EXPIRED: "user-token-expired",
  USER_NOT_FOUND: "user-token-expired",
  TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests",
  PASSWORD_DOES_NOT_MEET_REQUIREMENTS: "password-does-not-meet-requirements",
  INVALID_CODE: "invalid-verification-code",
  INVALID_SESSION_INFO: "invalid-verification-id",
  INVALID_TEMPORARY_PROOF: "invalid-credential",
  MISSING_SESSION_INFO: "missing-verification-id",
  SESSION_EXPIRED: "code-expired",
  MISSING_ANDROID_PACKAGE_NAME: "missing-android-pkg-name",
  UNAUTHORIZED_DOMAIN: "unauthorized-continue-uri",
  INVALID_OAUTH_CLIENT_ID: "invalid-oauth-client-id",
  ADMIN_ONLY_OPERATION: "admin-restricted-operation",
  INVALID_MFA_PENDING_CREDENTIAL: "invalid-multi-factor-session",
  MFA_ENROLLMENT_NOT_FOUND: "multi-factor-info-not-found",
  MISSING_MFA_ENROLLMENT_ID: "missing-multi-factor-info",
  MISSING_MFA_PENDING_CREDENTIAL: "missing-multi-factor-session",
  SECOND_FACTOR_EXISTS: "second-factor-already-in-use",
  SECOND_FACTOR_LIMIT_EXCEEDED: "maximum-second-factor-count-exceeded",
  BLOCKING_FUNCTION_ERROR_RESPONSE: "internal-error",
  RECAPTCHA_NOT_ENABLED: "recaptcha-not-enabled",
  MISSING_RECAPTCHA_TOKEN: "missing-recaptcha-token",
  INVALID_RECAPTCHA_TOKEN: "invalid-recaptcha-token",
  INVALID_RECAPTCHA_ACTION: "invalid-recaptcha-action",
  MISSING_CLIENT_TYPE: "missing-client-type",
  MISSING_RECAPTCHA_VERSION: "missing-recaptcha-version",
  INVALID_RECAPTCHA_VERSION: "invalid-recaptcha-version",
  INVALID_REQ_TYPE: "invalid-req-type"
};
const Ry = ["/v1/accounts:signInWithCustomToken", "/v1/accounts:signInWithEmailLink", "/v1/accounts:signInWithIdp", "/v1/accounts:signInWithPassword", "/v1/accounts:signInWithPhoneNumber", "/v1/token"];
const by = new Ds(3e4, 6e4);
function Pt(n, e) {
  return n.tenantId && !e.tenantId ? {
    ...e,
    tenantId: n.tenantId
  } : e;
}
async function St(n, e, t, r, s = {}) {
  return Qd(n, s, async () => {
    let i = {},
      o = {};
    r && (e === "GET" ? o = r : i = {
      body: JSON.stringify(r)
    });
    const c = ks({
        key: n.config.apiKey,
        ...o
      }).slice(1),
      u = await n._getAdditionalHeaders();
    u["Content-Type"] = "application/json", n.languageCode && (u["X-Firebase-Locale"] = n.languageCode);
    const h = {
      method: e,
      headers: u,
      ...i
    };
    return Jg() || (h.referrerPolicy = "no-referrer"), n.emulatorConfig && bt(n.emulatorConfig.host) && (h.credentials = "include"), Wd.fetch()(await Xd(n, n.config.apiHost, t, c), h);
  });
}
async function Qd(n, e, t) {
  n._canInitEmulator = !1;
  const r = {
    ...Ay,
    ...e
  };
  try {
    const s = new Sy(n),
      i = await Promise.race([t(), s.promise]);
    s.clearNetworkTimeout();
    const o = await i.json();
    if ("needConfirmation" in o) throw li(n, "account-exists-with-different-credential", o);
    if (i.ok && !("errorMessage" in o)) return o;
    {
      const c = i.ok ? o.errorMessage : o.error.message,
        [u, h] = c.split(" : ");
      if (u === "FEDERATED_USER_ID_ALREADY_LINKED") throw li(n, "credential-already-in-use", o);
      if (u === "EMAIL_EXISTS") throw li(n, "email-already-in-use", o);
      if (u === "USER_DISABLED") throw li(n, "user-disabled", o);
      const f = r[u] || u.toLowerCase().replace(/[_\s]+/g, "-");
      if (h) throw Ic(n, f, h);
      He(n, f);
    }
  } catch (s) {
    if (s instanceof ft) throw s;
    He(n, "network-request-failed", {
      message: String(s)
    });
  }
}
async function vr(n, e, t, r, s = {}) {
  const i = await St(n, e, t, r, s);
  return "mfaPendingCredential" in i && He(n, "multi-factor-auth-required", {
    _serverResponse: i
  }), i;
}
async function Xd(n, e, t, r) {
  const s = `${e}${t}?${r}`,
    i = n,
    o = i.config.emulator ? Tc(n.config, s) : `${n.config.apiScheme}://${s}`;
  return Ry.includes(t) && (await i._persistenceManagerAvailable, i._getPersistenceType() === "COOKIE") ? i._getPersistence()._getFinalTarget(o).toString() : o;
}
function Py(n) {
  switch (n) {
    case "ENFORCE":
      return "ENFORCE";
    case "AUDIT":
      return "AUDIT";
    case "OFF":
      return "OFF";
    default:
      return "ENFORCEMENT_STATE_UNSPECIFIED";
  }
}
class Sy {
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
  constructor(e) {
    this.auth = e, this.timer = null, this.promise = new Promise((t, r) => {
      this.timer = setTimeout(() => r(Xe(this.auth, "network-request-failed")), by.get());
    });
  }
}
function li(n, e, t) {
  const r = {
    appName: n.name
  };
  t.email && (r.email = t.email), t.phoneNumber && (r.phoneNumber = t.phoneNumber);
  const s = Xe(n, e, r);
  return s.customData._tokenResponse = t, s;
}
function jl(n) {
  return n !== void 0 && n.enterprise !== void 0;
}
class Cy {
  constructor(e) {
    if (this.siteKey = "", this.recaptchaEnforcementState = [], e.recaptchaKey === void 0) throw new Error("recaptchaKey undefined");
    this.siteKey = e.recaptchaKey.split("/")[3], this.recaptchaEnforcementState = e.recaptchaEnforcementState;
  }
  getProviderEnforcementState(e) {
    if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) return null;
    for (const t of this.recaptchaEnforcementState) if (t.provider && t.provider === e) return Py(t.enforcementState);
    return null;
  }
  isProviderEnabled(e) {
    return this.getProviderEnforcementState(e) === "ENFORCE" || this.getProviderEnforcementState(e) === "AUDIT";
  }
  isAnyProviderEnabled() {
    return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER") || this.isProviderEnabled("PHONE_PROVIDER");
  }
}
async function Vy(n, e) {
  return St(n, "GET", "/v2/recaptchaConfig", Pt(n, e));
}
async function ky(n, e) {
  return St(n, "POST", "/v1/accounts:delete", e);
}
async function Ui(n, e) {
  return St(n, "POST", "/v1/accounts:lookup", e);
}
function os(n) {
  if (n) try {
    const e = new Date(Number(n));
    if (!isNaN(e.getTime())) return e.toUTCString();
  } catch {}
}
async function Jd(n, e = !1) {
  const t = se(n),
    r = await t.getIdToken(e),
    s = wc(r);
  j(s && s.exp && s.auth_time && s.iat, t.auth, "internal-error");
  const i = typeof s.firebase == "object" ? s.firebase : void 0,
    o = i?.sign_in_provider;
  return {
    claims: s,
    token: r,
    authTime: os(ya(s.auth_time)),
    issuedAtTime: os(ya(s.iat)),
    expirationTime: os(ya(s.exp)),
    signInProvider: o || null,
    signInSecondFactor: i?.sign_in_second_factor || null
  };
}
function ya(n) {
  return Number(n) * 1e3;
}
function wc(n) {
  const [e, t, r] = n.split(".");
  if (e === void 0 || t === void 0 || r === void 0) return Ei("JWT malformed, contained fewer than 3 sections"), null;
  try {
    const s = Nd(t);
    return s ? JSON.parse(s) : (Ei("Failed to decode base64 JWT payload"), null);
  } catch (s) {
    return Ei("Caught error parsing JWT payload as JSON", s?.toString()), null;
  }
}
function zl(n) {
  const e = wc(n);
  return j(e, "internal-error"), j(typeof e.exp < "u", "internal-error"), j(typeof e.iat < "u", "internal-error"), Number(e.exp) - Number(e.iat);
}
async function cr(n, e, t = !1) {
  if (t) return e;
  try {
    return await e;
  } catch (r) {
    throw r instanceof ft && Dy(r) && n.auth.currentUser === n && (await n.auth.signOut()), r;
  }
}
function Dy({
  code: n
}) {
  return n === "auth/user-disabled" || n === "auth/user-token-expired";
}
class Ny {
  constructor(e) {
    this.user = e, this.isRunning = !1, this.timerId = null, this.errorBackoff = 3e4;
  }
  _start() {
    this.isRunning || (this.isRunning = !0, this.schedule());
  }
  _stop() {
    this.isRunning && (this.isRunning = !1, this.timerId !== null && clearTimeout(this.timerId));
  }
  getInterval(e) {
    if (e) {
      const t = this.errorBackoff;
      return this.errorBackoff = Math.min(this.errorBackoff * 2, 96e4), t;
    } else {
      this.errorBackoff = 3e4;
      const r = (this.user.stsTokenManager.expirationTime ?? 0) - Date.now() - 3e5;
      return Math.max(0, r);
    }
  }
  schedule(e = !1) {
    if (!this.isRunning) return;
    const t = this.getInterval(e);
    this.timerId = setTimeout(async () => {
      await this.iteration();
    }, t);
  }
  async iteration() {
    try {
      await this.user.getIdToken(!0);
    } catch (e) {
      e?.code === "auth/network-request-failed" && this.schedule(!0);
      return;
    }
    this.schedule();
  }
}
class Ma {
  constructor(e, t) {
    this.createdAt = e, this.lastLoginAt = t, this._initializeTime();
  }
  _initializeTime() {
    this.lastSignInTime = os(this.lastLoginAt), this.creationTime = os(this.createdAt);
  }
  _copy(e) {
    this.createdAt = e.createdAt, this.lastLoginAt = e.lastLoginAt, this._initializeTime();
  }
  toJSON() {
    return {
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt
    };
  }
}
async function Bi(n) {
  const e = n.auth,
    t = await n.getIdToken(),
    r = await cr(n, Ui(e, {
      idToken: t
    }));
  j(r?.users.length, e, "internal-error");
  const s = r.users[0];
  n._notifyReloadListener(s);
  const i = s.providerUserInfo?.length ? Zd(s.providerUserInfo) : [],
    o = xy(n.providerData, i),
    c = n.isAnonymous,
    u = !(n.email && s.passwordHash) && !o?.length,
    h = c ? u : !1,
    f = {
      uid: s.localId,
      displayName: s.displayName || null,
      photoURL: s.photoUrl || null,
      email: s.email || null,
      emailVerified: s.emailVerified || !1,
      phoneNumber: s.phoneNumber || null,
      tenantId: s.tenantId || null,
      providerData: o,
      metadata: new Ma(s.createdAt, s.lastLoginAt),
      isAnonymous: h
    };
  Object.assign(n, f);
}
async function Yd(n) {
  const e = se(n);
  await Bi(e), await e.auth._persistUserIfCurrent(e), e.auth._notifyListenersIfCurrent(e);
}
function xy(n, e) {
  return [...n.filter(r => !e.some(s => s.providerId === r.providerId)), ...e];
}
function Zd(n) {
  return n.map(({
    providerId: e,
    ...t
  }) => ({
    providerId: e,
    uid: t.rawId || "",
    displayName: t.displayName || null,
    email: t.email || null,
    phoneNumber: t.phoneNumber || null,
    photoURL: t.photoUrl || null
  }));
}
async function Oy(n, e) {
  const t = await Qd(n, {}, async () => {
    const r = ks({
        grant_type: "refresh_token",
        refresh_token: e
      }).slice(1),
      {
        tokenApiHost: s,
        apiKey: i
      } = n.config,
      o = await Xd(n, s, "/v1/token", `key=${i}`),
      c = await n._getAdditionalHeaders();
    c["Content-Type"] = "application/x-www-form-urlencoded";
    const u = {
      method: "POST",
      headers: c,
      body: r
    };
    return n.emulatorConfig && bt(n.emulatorConfig.host) && (u.credentials = "include"), Wd.fetch()(o, u);
  });
  return {
    accessToken: t.access_token,
    expiresIn: t.expires_in,
    refreshToken: t.refresh_token
  };
}
async function My(n, e) {
  return St(n, "POST", "/v2/accounts:revokeToken", Pt(n, e));
}
class sr {
  constructor() {
    this.refreshToken = null, this.accessToken = null, this.expirationTime = null;
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
  }
  updateFromServerResponse(e) {
    j(e.idToken, "internal-error"), j(typeof e.idToken < "u", "internal-error"), j(typeof e.refreshToken < "u", "internal-error");
    const t = "expiresIn" in e && typeof e.expiresIn < "u" ? Number(e.expiresIn) : zl(e.idToken);
    this.updateTokensAndExpiration(e.idToken, e.refreshToken, t);
  }
  updateFromIdToken(e) {
    j(e.length !== 0, "internal-error");
    const t = zl(e);
    this.updateTokensAndExpiration(e, null, t);
  }
  async getToken(e, t = !1) {
    return !t && this.accessToken && !this.isExpired ? this.accessToken : (j(this.refreshToken, e, "user-token-expired"), this.refreshToken ? (await this.refresh(e, this.refreshToken), this.accessToken) : null);
  }
  clearRefreshToken() {
    this.refreshToken = null;
  }
  async refresh(e, t) {
    const {
      accessToken: r,
      refreshToken: s,
      expiresIn: i
    } = await Oy(e, t);
    this.updateTokensAndExpiration(r, s, Number(i));
  }
  updateTokensAndExpiration(e, t, r) {
    this.refreshToken = t || null, this.accessToken = e || null, this.expirationTime = Date.now() + r * 1e3;
  }
  static fromJSON(e, t) {
    const {
        refreshToken: r,
        accessToken: s,
        expirationTime: i
      } = t,
      o = new sr();
    return r && (j(typeof r == "string", "internal-error", {
      appName: e
    }), o.refreshToken = r), s && (j(typeof s == "string", "internal-error", {
      appName: e
    }), o.accessToken = s), i && (j(typeof i == "number", "internal-error", {
      appName: e
    }), o.expirationTime = i), o;
  }
  toJSON() {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      expirationTime: this.expirationTime
    };
  }
  _assign(e) {
    this.accessToken = e.accessToken, this.refreshToken = e.refreshToken, this.expirationTime = e.expirationTime;
  }
  _clone() {
    return Object.assign(new sr(), this.toJSON());
  }
  _performRefresh() {
    return yt("not implemented");
  }
}
function Ft(n, e) {
  j(typeof n == "string" || typeof n > "u", "internal-error", {
    appName: e
  });
}
class Qe {
  constructor({
    uid: e,
    auth: t,
    stsTokenManager: r,
    ...s
  }) {
    this.providerId = "firebase", this.proactiveRefresh = new Ny(this), this.reloadUserInfo = null, this.reloadListener = null, this.uid = e, this.auth = t, this.stsTokenManager = r, this.accessToken = r.accessToken, this.displayName = s.displayName || null, this.email = s.email || null, this.emailVerified = s.emailVerified || !1, this.phoneNumber = s.phoneNumber || null, this.photoURL = s.photoURL || null, this.isAnonymous = s.isAnonymous || !1, this.tenantId = s.tenantId || null, this.providerData = s.providerData ? [...s.providerData] : [], this.metadata = new Ma(s.createdAt || void 0, s.lastLoginAt || void 0);
  }
  async getIdToken(e) {
    const t = await cr(this, this.stsTokenManager.getToken(this.auth, e));
    return j(t, this.auth, "internal-error"), this.accessToken !== t && (this.accessToken = t, await this.auth._persistUserIfCurrent(this), this.auth._notifyListenersIfCurrent(this)), t;
  }
  getIdTokenResult(e) {
    return Jd(this, e);
  }
  reload() {
    return Yd(this);
  }
  _assign(e) {
    this !== e && (j(this.uid === e.uid, this.auth, "internal-error"), this.displayName = e.displayName, this.photoURL = e.photoURL, this.email = e.email, this.emailVerified = e.emailVerified, this.phoneNumber = e.phoneNumber, this.isAnonymous = e.isAnonymous, this.tenantId = e.tenantId, this.providerData = e.providerData.map(t => ({
      ...t
    })), this.metadata._copy(e.metadata), this.stsTokenManager._assign(e.stsTokenManager));
  }
  _clone(e) {
    const t = new Qe({
      ...this,
      auth: e,
      stsTokenManager: this.stsTokenManager._clone()
    });
    return t.metadata._copy(this.metadata), t;
  }
  _onReload(e) {
    j(!this.reloadListener, this.auth, "internal-error"), this.reloadListener = e, this.reloadUserInfo && (this._notifyReloadListener(this.reloadUserInfo), this.reloadUserInfo = null);
  }
  _notifyReloadListener(e) {
    this.reloadListener ? this.reloadListener(e) : this.reloadUserInfo = e;
  }
  _startProactiveRefresh() {
    this.proactiveRefresh._start();
  }
  _stopProactiveRefresh() {
    this.proactiveRefresh._stop();
  }
  async _updateTokensIfNecessary(e, t = !1) {
    let r = !1;
    e.idToken && e.idToken !== this.stsTokenManager.accessToken && (this.stsTokenManager.updateFromServerResponse(e), r = !0), t && (await Bi(this)), await this.auth._persistUserIfCurrent(this), r && this.auth._notifyListenersIfCurrent(this);
  }
  async delete() {
    if (xe(this.auth.app)) return Promise.reject(at(this.auth));
    const e = await this.getIdToken();
    return await cr(this, ky(this.auth, {
      idToken: e
    })), this.stsTokenManager.clearRefreshToken(), this.auth.signOut();
  }
  toJSON() {
    return {
      uid: this.uid,
      email: this.email || void 0,
      emailVerified: this.emailVerified,
      displayName: this.displayName || void 0,
      isAnonymous: this.isAnonymous,
      photoURL: this.photoURL || void 0,
      phoneNumber: this.phoneNumber || void 0,
      tenantId: this.tenantId || void 0,
      providerData: this.providerData.map(e => ({
        ...e
      })),
      stsTokenManager: this.stsTokenManager.toJSON(),
      _redirectEventId: this._redirectEventId,
      ...this.metadata.toJSON(),
      apiKey: this.auth.config.apiKey,
      appName: this.auth.name
    };
  }
  get refreshToken() {
    return this.stsTokenManager.refreshToken || "";
  }
  static _fromJSON(e, t) {
    const r = t.displayName ?? void 0,
      s = t.email ?? void 0,
      i = t.phoneNumber ?? void 0,
      o = t.photoURL ?? void 0,
      c = t.tenantId ?? void 0,
      u = t._redirectEventId ?? void 0,
      h = t.createdAt ?? void 0,
      f = t.lastLoginAt ?? void 0,
      {
        uid: m,
        emailVerified: _,
        isAnonymous: b,
        providerData: V,
        stsTokenManager: N
      } = t;
    j(m && N, e, "internal-error");
    const C = sr.fromJSON(this.name, N);
    j(typeof m == "string", e, "internal-error"), Ft(r, e.name), Ft(s, e.name), j(typeof _ == "boolean", e, "internal-error"), j(typeof b == "boolean", e, "internal-error"), Ft(i, e.name), Ft(o, e.name), Ft(c, e.name), Ft(u, e.name), Ft(h, e.name), Ft(f, e.name);
    const q = new Qe({
      uid: m,
      auth: e,
      email: s,
      emailVerified: _,
      displayName: r,
      isAnonymous: b,
      photoURL: o,
      phoneNumber: i,
      tenantId: c,
      stsTokenManager: C,
      createdAt: h,
      lastLoginAt: f
    });
    return V && Array.isArray(V) && (q.providerData = V.map(U => ({
      ...U
    }))), u && (q._redirectEventId = u), q;
  }
  static async _fromIdTokenResponse(e, t, r = !1) {
    const s = new sr();
    s.updateFromServerResponse(t);
    const i = new Qe({
      uid: t.localId,
      auth: e,
      stsTokenManager: s,
      isAnonymous: r
    });
    return await Bi(i), i;
  }
  static async _fromGetAccountInfoResponse(e, t, r) {
    const s = t.users[0];
    j(s.localId !== void 0, "internal-error");
    const i = s.providerUserInfo !== void 0 ? Zd(s.providerUserInfo) : [],
      o = !(s.email && s.passwordHash) && !i?.length,
      c = new sr();
    c.updateFromIdToken(r);
    const u = new Qe({
        uid: s.localId,
        auth: e,
        stsTokenManager: c,
        isAnonymous: o
      }),
      h = {
        uid: s.localId,
        displayName: s.displayName || null,
        photoURL: s.photoUrl || null,
        email: s.email || null,
        emailVerified: s.emailVerified || !1,
        phoneNumber: s.phoneNumber || null,
        tenantId: s.tenantId || null,
        providerData: i,
        metadata: new Ma(s.createdAt, s.lastLoginAt),
        isAnonymous: !(s.email && s.passwordHash) && !i?.length
      };
    return Object.assign(u, h), u;
  }
}
const $l = new Map();
function It(n) {
  vt(n instanceof Function, "Expected a class definition");
  let e = $l.get(n);
  return e ? (vt(e instanceof n, "Instance stored in cache mismatched with class"), e) : (e = new n(), $l.set(n, e), e);
}
class ef {
  constructor() {
    this.type = "NONE", this.storage = {};
  }
  async _isAvailable() {
    return !0;
  }
  async _set(e, t) {
    this.storage[e] = t;
  }
  async _get(e) {
    const t = this.storage[e];
    return t === void 0 ? null : t;
  }
  async _remove(e) {
    delete this.storage[e];
  }
  _addListener(e, t) {}
  _removeListener(e, t) {}
}
ef.type = "NONE";
const La = ef;
function Ti(n, e, t) {
  return `firebase:${n}:${e}:${t}`;
}
class ir {
  constructor(e, t, r) {
    this.persistence = e, this.auth = t, this.userKey = r;
    const {
      config: s,
      name: i
    } = this.auth;
    this.fullUserKey = Ti(this.userKey, s.apiKey, i), this.fullPersistenceKey = Ti("persistence", s.apiKey, i), this.boundEventHandler = t._onStorageEvent.bind(t), this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
  }
  setCurrentUser(e) {
    return this.persistence._set(this.fullUserKey, e.toJSON());
  }
  async getCurrentUser() {
    const e = await this.persistence._get(this.fullUserKey);
    if (!e) return null;
    if (typeof e == "string") {
      const t = await Ui(this.auth, {
        idToken: e
      }).catch(() => {});
      return t ? Qe._fromGetAccountInfoResponse(this.auth, t, e) : null;
    }
    return Qe._fromJSON(this.auth, e);
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey);
  }
  savePersistenceForRedirect() {
    return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
  }
  async setPersistence(e) {
    if (this.persistence === e) return;
    const t = await this.getCurrentUser();
    if (await this.removeCurrentUser(), this.persistence = e, t) return this.setCurrentUser(t);
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
  }
  static async create(e, t, r = "authUser") {
    if (!t.length) return new ir(It(La), e, r);
    const s = (await Promise.all(t.map(async h => {
      if (await h._isAvailable()) return h;
    }))).filter(h => h);
    let i = s[0] || It(La);
    const o = Ti(r, e.config.apiKey, e.name);
    let c = null;
    for (const h of t) try {
      const f = await h._get(o);
      if (f) {
        let m;
        if (typeof f == "string") {
          const _ = await Ui(e, {
            idToken: f
          }).catch(() => {});
          if (!_) break;
          m = await Qe._fromGetAccountInfoResponse(e, _, f);
        } else m = Qe._fromJSON(e, f);
        h !== i && (c = m), i = h;
        break;
      }
    } catch {}
    const u = s.filter(h => h._shouldAllowMigration);
    return !i._shouldAllowMigration || !u.length ? new ir(i, e, r) : (i = u[0], c && (await i._set(o, c.toJSON())), await Promise.all(t.map(async h => {
      if (h !== i) try {
        await h._remove(o);
      } catch {}
    })), new ir(i, e, r));
  }
}
function Gl(n) {
  const e = n.toLowerCase();
  if (e.includes("opera/") || e.includes("opr/") || e.includes("opios/")) return "Opera";
  if (sf(e)) return "IEMobile";
  if (e.includes("msie") || e.includes("trident/")) return "IE";
  if (e.includes("edge/")) return "Edge";
  if (tf(e)) return "Firefox";
  if (e.includes("silk/")) return "Silk";
  if (af(e)) return "Blackberry";
  if (cf(e)) return "Webos";
  if (nf(e)) return "Safari";
  if ((e.includes("chrome/") || rf(e)) && !e.includes("edge/")) return "Chrome";
  if (of(e)) return "Android";
  {
    const t = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
      r = n.match(t);
    if (r?.length === 2) return r[1];
  }
  return "Other";
}
function tf(n = Ie()) {
  return /firefox\//i.test(n);
}
function nf(n = Ie()) {
  const e = n.toLowerCase();
  return e.includes("safari/") && !e.includes("chrome/") && !e.includes("crios/") && !e.includes("android");
}
function rf(n = Ie()) {
  return /crios\//i.test(n);
}
function sf(n = Ie()) {
  return /iemobile/i.test(n);
}
function of(n = Ie()) {
  return /android/i.test(n);
}
function af(n = Ie()) {
  return /blackberry/i.test(n);
}
function cf(n = Ie()) {
  return /webos/i.test(n);
}
function vc(n = Ie()) {
  return /iphone|ipad|ipod/i.test(n) || /macintosh/i.test(n) && /mobile/i.test(n);
}
function Ly(n = Ie()) {
  return vc(n) && !!window.navigator?.standalone;
}
function Fy() {
  return e_() && document.documentMode === 10;
}
function uf(n = Ie()) {
  return vc(n) || of(n) || cf(n) || af(n) || /windows phone/i.test(n) || sf(n);
}
function lf(n, e = []) {
  let t;
  switch (n) {
    case "Browser":
      t = Gl(Ie());
      break;
    case "Worker":
      t = `${Gl(Ie())}-${n}`;
      break;
    default:
      t = n;
  }
  const r = e.length ? e.join(",") : "FirebaseCore-web";
  return `${t}/JsCore/${Fn}/${r}`;
}
class Uy {
  constructor(e) {
    this.auth = e, this.queue = [];
  }
  pushCallback(e, t) {
    const r = i => new Promise((o, c) => {
      try {
        const u = e(i);
        o(u);
      } catch (u) {
        c(u);
      }
    });
    r.onAbort = t, this.queue.push(r);
    const s = this.queue.length - 1;
    return () => {
      this.queue[s] = () => Promise.resolve();
    };
  }
  async runMiddleware(e) {
    if (this.auth.currentUser === e) return;
    const t = [];
    try {
      for (const r of this.queue) await r(e), r.onAbort && t.push(r.onAbort);
    } catch (r) {
      t.reverse();
      for (const s of t) try {
        s();
      } catch {}
      throw this.auth._errorFactory.create("login-blocked", {
        originalMessage: r?.message
      });
    }
  }
}
async function By(n, e = {}) {
  return St(n, "GET", "/v2/passwordPolicy", Pt(n, e));
}
const qy = 6;
class jy {
  constructor(e) {
    const t = e.customStrengthOptions;
    this.customStrengthOptions = {}, this.customStrengthOptions.minPasswordLength = t.minPasswordLength ?? qy, t.maxPasswordLength && (this.customStrengthOptions.maxPasswordLength = t.maxPasswordLength), t.containsLowercaseCharacter !== void 0 && (this.customStrengthOptions.containsLowercaseLetter = t.containsLowercaseCharacter), t.containsUppercaseCharacter !== void 0 && (this.customStrengthOptions.containsUppercaseLetter = t.containsUppercaseCharacter), t.containsNumericCharacter !== void 0 && (this.customStrengthOptions.containsNumericCharacter = t.containsNumericCharacter), t.containsNonAlphanumericCharacter !== void 0 && (this.customStrengthOptions.containsNonAlphanumericCharacter = t.containsNonAlphanumericCharacter), this.enforcementState = e.enforcementState, this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED" && (this.enforcementState = "OFF"), this.allowedNonAlphanumericCharacters = e.allowedNonAlphanumericCharacters?.join("") ?? "", this.forceUpgradeOnSignin = e.forceUpgradeOnSignin ?? !1, this.schemaVersion = e.schemaVersion;
  }
  validatePassword(e) {
    const t = {
      isValid: !0,
      passwordPolicy: this
    };
    return this.validatePasswordLengthOptions(e, t), this.validatePasswordCharacterOptions(e, t), t.isValid && (t.isValid = t.meetsMinPasswordLength ?? !0), t.isValid && (t.isValid = t.meetsMaxPasswordLength ?? !0), t.isValid && (t.isValid = t.containsLowercaseLetter ?? !0), t.isValid && (t.isValid = t.containsUppercaseLetter ?? !0), t.isValid && (t.isValid = t.containsNumericCharacter ?? !0), t.isValid && (t.isValid = t.containsNonAlphanumericCharacter ?? !0), t;
  }
  validatePasswordLengthOptions(e, t) {
    const r = this.customStrengthOptions.minPasswordLength,
      s = this.customStrengthOptions.maxPasswordLength;
    r && (t.meetsMinPasswordLength = e.length >= r), s && (t.meetsMaxPasswordLength = e.length <= s);
  }
  validatePasswordCharacterOptions(e, t) {
    this.updatePasswordCharacterOptionsStatuses(t, !1, !1, !1, !1);
    let r;
    for (let s = 0; s < e.length; s++) r = e.charAt(s), this.updatePasswordCharacterOptionsStatuses(t, r >= "a" && r <= "z", r >= "A" && r <= "Z", r >= "0" && r <= "9", this.allowedNonAlphanumericCharacters.includes(r));
  }
  updatePasswordCharacterOptionsStatuses(e, t, r, s, i) {
    this.customStrengthOptions.containsLowercaseLetter && (e.containsLowercaseLetter || (e.containsLowercaseLetter = t)), this.customStrengthOptions.containsUppercaseLetter && (e.containsUppercaseLetter || (e.containsUppercaseLetter = r)), this.customStrengthOptions.containsNumericCharacter && (e.containsNumericCharacter || (e.containsNumericCharacter = s)), this.customStrengthOptions.containsNonAlphanumericCharacter && (e.containsNonAlphanumericCharacter || (e.containsNonAlphanumericCharacter = i));
  }
}
class zy {
  constructor(e, t, r, s) {
    this.app = e, this.heartbeatServiceProvider = t, this.appCheckServiceProvider = r, this.config = s, this.currentUser = null, this.emulatorConfig = null, this.operations = Promise.resolve(), this.authStateSubscription = new Kl(this), this.idTokenSubscription = new Kl(this), this.beforeStateQueue = new Uy(this), this.redirectUser = null, this.isProactiveRefreshEnabled = !1, this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1, this._canInitEmulator = !0, this._isInitialized = !1, this._deleted = !1, this._initializationPromise = null, this._popupRedirectResolver = null, this._errorFactory = Hd, this._agentRecaptchaConfig = null, this._tenantRecaptchaConfigs = {}, this._projectPasswordPolicy = null, this._tenantPasswordPolicies = {}, this._resolvePersistenceManagerAvailable = void 0, this.lastNotifiedUid = void 0, this.languageCode = null, this.tenantId = null, this.settings = {
      appVerificationDisabledForTesting: !1
    }, this.frameworks = [], this.name = e.name, this.clientVersion = s.sdkClientVersion, this._persistenceManagerAvailable = new Promise(i => this._resolvePersistenceManagerAvailable = i);
  }
  _initializeWithPersistence(e, t) {
    return t && (this._popupRedirectResolver = It(t)), this._initializationPromise = this.queue(async () => {
      if (!this._deleted && (this.persistenceManager = await ir.create(this, e), this._resolvePersistenceManagerAvailable?.(), !this._deleted)) {
        if (this._popupRedirectResolver?._shouldInitProactively) try {
          await this._popupRedirectResolver._initialize(this);
        } catch {}
        await this.initializeCurrentUser(t), this.lastNotifiedUid = this.currentUser?.uid || null, !this._deleted && (this._isInitialized = !0);
      }
    }), this._initializationPromise;
  }
  async _onStorageEvent() {
    if (this._deleted) return;
    const e = await this.assertedPersistence.getCurrentUser();
    if (!(!this.currentUser && !e)) {
      if (this.currentUser && e && this.currentUser.uid === e.uid) {
        this._currentUser._assign(e), await this.currentUser.getIdToken();
        return;
      }
      await this._updateCurrentUser(e, !0);
    }
  }
  async initializeCurrentUserFromIdToken(e) {
    try {
      const t = await Ui(this, {
          idToken: e
        }),
        r = await Qe._fromGetAccountInfoResponse(this, t, e);
      await this.directlySetCurrentUser(r);
    } catch (t) {
      console.warn("FirebaseServerApp could not login user with provided authIdToken: ", t), await this.directlySetCurrentUser(null);
    }
  }
  async initializeCurrentUser(e) {
    if (xe(this.app)) {
      const i = this.app.settings.authIdToken;
      return i ? new Promise(o => {
        setTimeout(() => this.initializeCurrentUserFromIdToken(i).then(o, o));
      }) : this.directlySetCurrentUser(null);
    }
    const t = await this.assertedPersistence.getCurrentUser();
    let r = t,
      s = !1;
    if (e && this.config.authDomain) {
      await this.getOrInitRedirectPersistenceManager();
      const i = this.redirectUser?._redirectEventId,
        o = r?._redirectEventId,
        c = await this.tryRedirectSignIn(e);
      (!i || i === o) && c?.user && (r = c.user, s = !0);
    }
    if (!r) return this.directlySetCurrentUser(null);
    if (!r._redirectEventId) {
      if (s) try {
        await this.beforeStateQueue.runMiddleware(r);
      } catch (i) {
        r = t, this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(i));
      }
      return r ? this.reloadAndSetCurrentUserOrClear(r) : this.directlySetCurrentUser(null);
    }
    return j(this._popupRedirectResolver, this, "argument-error"), await this.getOrInitRedirectPersistenceManager(), this.redirectUser && this.redirectUser._redirectEventId === r._redirectEventId ? this.directlySetCurrentUser(r) : this.reloadAndSetCurrentUserOrClear(r);
  }
  async tryRedirectSignIn(e) {
    let t = null;
    try {
      t = await this._popupRedirectResolver._completeRedirectFn(this, e, !0);
    } catch {
      await this._setRedirectUser(null);
    }
    return t;
  }
  async reloadAndSetCurrentUserOrClear(e) {
    try {
      await Bi(e);
    } catch (t) {
      if (t?.code !== "auth/network-request-failed") return this.directlySetCurrentUser(null);
    }
    return this.directlySetCurrentUser(e);
  }
  useDeviceLanguage() {
    this.languageCode = vy();
  }
  async _delete() {
    this._deleted = !0;
  }
  async updateCurrentUser(e) {
    if (xe(this.app)) return Promise.reject(at(this));
    const t = e ? se(e) : null;
    return t && j(t.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token"), this._updateCurrentUser(t && t._clone(this));
  }
  async _updateCurrentUser(e, t = !1) {
    if (!this._deleted) return e && j(this.tenantId === e.tenantId, this, "tenant-id-mismatch"), t || (await this.beforeStateQueue.runMiddleware(e)), this.queue(async () => {
      await this.directlySetCurrentUser(e), this.notifyAuthListeners();
    });
  }
  async signOut() {
    return xe(this.app) ? Promise.reject(at(this)) : (await this.beforeStateQueue.runMiddleware(null), (this.redirectPersistenceManager || this._popupRedirectResolver) && (await this._setRedirectUser(null)), this._updateCurrentUser(null, !0));
  }
  setPersistence(e) {
    return xe(this.app) ? Promise.reject(at(this)) : this.queue(async () => {
      await this.assertedPersistence.setPersistence(It(e));
    });
  }
  _getRecaptchaConfig() {
    return this.tenantId == null ? this._agentRecaptchaConfig : this._tenantRecaptchaConfigs[this.tenantId];
  }
  async validatePassword(e) {
    this._getPasswordPolicyInternal() || (await this._updatePasswordPolicy());
    const t = this._getPasswordPolicyInternal();
    return t.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION ? Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {})) : t.validatePassword(e);
  }
  _getPasswordPolicyInternal() {
    return this.tenantId === null ? this._projectPasswordPolicy : this._tenantPasswordPolicies[this.tenantId];
  }
  async _updatePasswordPolicy() {
    const e = await By(this),
      t = new jy(e);
    this.tenantId === null ? this._projectPasswordPolicy = t : this._tenantPasswordPolicies[this.tenantId] = t;
  }
  _getPersistenceType() {
    return this.assertedPersistence.persistence.type;
  }
  _getPersistence() {
    return this.assertedPersistence.persistence;
  }
  _updateErrorMap(e) {
    this._errorFactory = new Vs("auth", "Firebase", e());
  }
  onAuthStateChanged(e, t, r) {
    return this.registerStateListener(this.authStateSubscription, e, t, r);
  }
  beforeAuthStateChanged(e, t) {
    return this.beforeStateQueue.pushCallback(e, t);
  }
  onIdTokenChanged(e, t, r) {
    return this.registerStateListener(this.idTokenSubscription, e, t, r);
  }
  authStateReady() {
    return new Promise((e, t) => {
      if (this.currentUser) e();else {
        const r = this.onAuthStateChanged(() => {
          r(), e();
        }, t);
      }
    });
  }
  async revokeAccessToken(e) {
    if (this.currentUser) {
      const t = await this.currentUser.getIdToken(),
        r = {
          providerId: "apple.com",
          tokenType: "ACCESS_TOKEN",
          token: e,
          idToken: t
        };
      this.tenantId != null && (r.tenantId = this.tenantId), await My(this, r);
    }
  }
  toJSON() {
    return {
      apiKey: this.config.apiKey,
      authDomain: this.config.authDomain,
      appName: this.name,
      currentUser: this._currentUser?.toJSON()
    };
  }
  async _setRedirectUser(e, t) {
    const r = await this.getOrInitRedirectPersistenceManager(t);
    return e === null ? r.removeCurrentUser() : r.setCurrentUser(e);
  }
  async getOrInitRedirectPersistenceManager(e) {
    if (!this.redirectPersistenceManager) {
      const t = e && It(e) || this._popupRedirectResolver;
      j(t, this, "argument-error"), this.redirectPersistenceManager = await ir.create(this, [It(t._redirectPersistence)], "redirectUser"), this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
    }
    return this.redirectPersistenceManager;
  }
  async _redirectUserForId(e) {
    return this._isInitialized && (await this.queue(async () => {})), this._currentUser?._redirectEventId === e ? this._currentUser : this.redirectUser?._redirectEventId === e ? this.redirectUser : null;
  }
  async _persistUserIfCurrent(e) {
    if (e === this.currentUser) return this.queue(async () => this.directlySetCurrentUser(e));
  }
  _notifyListenersIfCurrent(e) {
    e === this.currentUser && this.notifyAuthListeners();
  }
  _key() {
    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
  }
  _startProactiveRefresh() {
    this.isProactiveRefreshEnabled = !0, this.currentUser && this._currentUser._startProactiveRefresh();
  }
  _stopProactiveRefresh() {
    this.isProactiveRefreshEnabled = !1, this.currentUser && this._currentUser._stopProactiveRefresh();
  }
  get _currentUser() {
    return this.currentUser;
  }
  notifyAuthListeners() {
    if (!this._isInitialized) return;
    this.idTokenSubscription.next(this.currentUser);
    const e = this.currentUser?.uid ?? null;
    this.lastNotifiedUid !== e && (this.lastNotifiedUid = e, this.authStateSubscription.next(this.currentUser));
  }
  registerStateListener(e, t, r, s) {
    if (this._deleted) return () => {};
    const i = typeof t == "function" ? t : t.next.bind(t);
    let o = !1;
    const c = this._isInitialized ? Promise.resolve() : this._initializationPromise;
    if (j(c, this, "internal-error"), c.then(() => {
      o || i(this.currentUser);
    }), typeof t == "function") {
      const u = e.addObserver(t, r, s);
      return () => {
        o = !0, u();
      };
    } else {
      const u = e.addObserver(t);
      return () => {
        o = !0, u();
      };
    }
  }
  async directlySetCurrentUser(e) {
    this.currentUser && this.currentUser !== e && this._currentUser._stopProactiveRefresh(), e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(), this.currentUser = e, e ? await this.assertedPersistence.setCurrentUser(e) : await this.assertedPersistence.removeCurrentUser();
  }
  queue(e) {
    return this.operations = this.operations.then(e, e), this.operations;
  }
  get assertedPersistence() {
    return j(this.persistenceManager, this, "internal-error"), this.persistenceManager;
  }
  _logFramework(e) {
    !e || this.frameworks.includes(e) || (this.frameworks.push(e), this.frameworks.sort(), this.clientVersion = lf(this.config.clientPlatform, this._getFrameworks()));
  }
  _getFrameworks() {
    return this.frameworks;
  }
  async _getAdditionalHeaders() {
    const e = {
      "X-Client-Version": this.clientVersion
    };
    this.app.options.appId && (e["X-Firebase-gmpid"] = this.app.options.appId);
    const t = await this.heartbeatServiceProvider.getImmediate({
      optional: !0
    })?.getHeartbeatsHeader();
    t && (e["X-Firebase-Client"] = t);
    const r = await this._getAppCheckToken();
    return r && (e["X-Firebase-AppCheck"] = r), e;
  }
  async _getAppCheckToken() {
    if (xe(this.app) && this.app.settings.appCheckToken) return this.app.settings.appCheckToken;
    const e = await this.appCheckServiceProvider.getImmediate({
      optional: !0
    })?.getToken();
    return e?.error && Iy(`Error while retrieving App Check token: ${e.error}`), e?.token;
  }
}
function Ct(n) {
  return se(n);
}
class Kl {
  constructor(e) {
    this.auth = e, this.observer = null, this.addObserver = o_(t => this.observer = t);
  }
  get next() {
    return j(this.observer, this.auth, "internal-error"), this.observer.next.bind(this.observer);
  }
}
let lo = {
  async loadJS() {
    throw new Error("Unable to load external scripts");
  },
  recaptchaV2Script: "",
  recaptchaEnterpriseScript: "",
  gapiScript: ""
};
function $y(n) {
  lo = n;
}
function hf(n) {
  return lo.loadJS(n);
}
function Gy() {
  return lo.recaptchaEnterpriseScript;
}
function Ky() {
  return lo.gapiScript;
}
function Hy(n) {
  return `__${n}${Math.floor(Math.random() * 1e6)}`;
}
class Wy {
  constructor() {
    this.enterprise = new Qy();
  }
  ready(e) {
    e();
  }
  execute(e, t) {
    return Promise.resolve("token");
  }
  render(e, t) {
    return "";
  }
}
class Qy {
  ready(e) {
    e();
  }
  execute(e, t) {
    return Promise.resolve("token");
  }
  render(e, t) {
    return "";
  }
}
const Xy = "recaptcha-enterprise";
const df = "NO_RECAPTCHA";
class Jy {
  constructor(e) {
    this.type = Xy, this.auth = Ct(e);
  }
  async verify(e = "verify", t = !1) {
    async function r(i) {
      if (!t) {
        if (i.tenantId == null && i._agentRecaptchaConfig != null) return i._agentRecaptchaConfig.siteKey;
        if (i.tenantId != null && i._tenantRecaptchaConfigs[i.tenantId] !== void 0) return i._tenantRecaptchaConfigs[i.tenantId].siteKey;
      }
      return new Promise(async (o, c) => {
        Vy(i, {
          clientType: "CLIENT_TYPE_WEB",
          version: "RECAPTCHA_ENTERPRISE"
        }).then(u => {
          if (u.recaptchaKey === void 0) c(new Error("recaptcha Enterprise site key undefined"));else {
            const h = new Cy(u);
            return i.tenantId == null ? i._agentRecaptchaConfig = h : i._tenantRecaptchaConfigs[i.tenantId] = h, o(h.siteKey);
          }
        }).catch(u => {
          c(u);
        });
      });
    }
    function s(i, o, c) {
      const u = window.grecaptcha;
      jl(u) ? u.enterprise.ready(() => {
        u.enterprise.execute(i, {
          action: e
        }).then(h => {
          o(h);
        }).catch(() => {
          o(df);
        });
      }) : c(Error("No reCAPTCHA enterprise script loaded."));
    }
    return this.auth.settings.appVerificationDisabledForTesting ? new Wy().execute("siteKey", {
      action: "verify"
    }) : new Promise((i, o) => {
      r(this.auth).then(c => {
        if (!t && jl(window.grecaptcha)) s(c, i, o);else {
          if (typeof window > "u") {
            o(new Error("RecaptchaVerifier is only supported in browser"));
            return;
          }
          let u = Gy();
          u.length !== 0 && (u += c), hf(u).then(() => {
            s(c, i, o);
          }).catch(h => {
            o(h);
          });
        }
      }).catch(c => {
        o(c);
      });
    });
  }
}
async function Hl(n, e, t, r = !1, s = !1) {
  const i = new Jy(n);
  let o;
  if (s) o = df;else try {
    o = await i.verify(t);
  } catch {
    o = await i.verify(t, !0);
  }
  const c = {
    ...e
  };
  if (t === "mfaSmsEnrollment" || t === "mfaSmsSignIn") {
    if ("phoneEnrollmentInfo" in c) {
      const u = c.phoneEnrollmentInfo.phoneNumber,
        h = c.phoneEnrollmentInfo.recaptchaToken;
      Object.assign(c, {
        phoneEnrollmentInfo: {
          phoneNumber: u,
          recaptchaToken: h,
          captchaResponse: o,
          clientType: "CLIENT_TYPE_WEB",
          recaptchaVersion: "RECAPTCHA_ENTERPRISE"
        }
      });
    } else if ("phoneSignInInfo" in c) {
      const u = c.phoneSignInInfo.recaptchaToken;
      Object.assign(c, {
        phoneSignInInfo: {
          recaptchaToken: u,
          captchaResponse: o,
          clientType: "CLIENT_TYPE_WEB",
          recaptchaVersion: "RECAPTCHA_ENTERPRISE"
        }
      });
    }
    return c;
  }
  return r ? Object.assign(c, {
    captchaResp: o
  }) : Object.assign(c, {
    captchaResponse: o
  }), Object.assign(c, {
    clientType: "CLIENT_TYPE_WEB"
  }), Object.assign(c, {
    recaptchaVersion: "RECAPTCHA_ENTERPRISE"
  }), c;
}
async function Fa(n, e, t, r, s) {
  if (n._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")) {
    const i = await Hl(n, e, t, t === "getOobCode");
    return r(n, i);
  } else return r(n, e).catch(async i => {
    if (i.code === "auth/missing-recaptcha-token") {
      console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
      const o = await Hl(n, e, t, t === "getOobCode");
      return r(n, o);
    } else return Promise.reject(i);
  });
}
function Yy(n, e) {
  const t = yc(n, "auth");
  if (t.isInitialized()) {
    const s = t.getImmediate(),
      i = t.getOptions();
    if (ht(i, e ?? {})) return s;
    He(s, "already-initialized");
  }
  return t.initialize({
    options: e
  });
}
function Zy(n, e) {
  const t = e?.persistence || [],
    r = (Array.isArray(t) ? t : [t]).map(It);
  e?.errorMap && n._updateErrorMap(e.errorMap), n._initializeWithPersistence(r, e?.popupRedirectResolver);
}
function eI(n, e, t) {
  const r = Ct(n);
  j(/^https?:\/\//.test(e), r, "invalid-emulator-scheme");
  const s = !0,
    i = ff(e),
    {
      host: o,
      port: c
    } = tI(e),
    u = c === null ? "" : `:${c}`,
    h = {
      url: `${i}//${o}${u}/`
    },
    f = Object.freeze({
      host: o,
      port: c,
      protocol: i.replace(":", ""),
      options: Object.freeze({
        disableWarnings: s
      })
    });
  if (!r._canInitEmulator) {
    j(r.config.emulator && r.emulatorConfig, r, "emulator-config-failed"), j(ht(h, r.config.emulator) && ht(f, r.emulatorConfig), r, "emulator-config-failed");
    return;
  }
  r.config.emulator = h, r.emulatorConfig = f, r.settings.appVerificationDisabledForTesting = !0, bt(o) && (uo(`${i}//${o}${u}`), mc("Auth", !0));
}
function ff(n) {
  const e = n.indexOf(":");
  return e < 0 ? "" : n.substr(0, e + 1);
}
function tI(n) {
  const e = ff(n),
    t = /(\/\/)?([^?#/]+)/.exec(n.substr(e.length));
  if (!t) return {
    host: "",
    port: null
  };
  const r = t[2].split("@").pop() || "",
    s = /^(\[[^\]]+\])(:|$)/.exec(r);
  if (s) {
    const i = s[1];
    return {
      host: i,
      port: Wl(r.substr(i.length + 1))
    };
  } else {
    const [i, o] = r.split(":");
    return {
      host: i,
      port: Wl(o)
    };
  }
}
function Wl(n) {
  if (!n) return null;
  const e = Number(n);
  return isNaN(e) ? null : e;
}
class ho {
  constructor(e, t) {
    this.providerId = e, this.signInMethod = t;
  }
  toJSON() {
    return yt("not implemented");
  }
  _getIdTokenResponse(e) {
    return yt("not implemented");
  }
  _linkToIdToken(e, t) {
    return yt("not implemented");
  }
  _getReauthenticationResolver(e) {
    return yt("not implemented");
  }
}
async function nI(n, e) {
  return St(n, "POST", "/v1/accounts:update", e);
}
async function rI(n, e) {
  return St(n, "POST", "/v1/accounts:signUp", e);
}
async function sI(n, e) {
  return vr(n, "POST", "/v1/accounts:signInWithPassword", Pt(n, e));
}
async function iI(n, e) {
  return vr(n, "POST", "/v1/accounts:signInWithEmailLink", Pt(n, e));
}
async function oI(n, e) {
  return vr(n, "POST", "/v1/accounts:signInWithEmailLink", Pt(n, e));
}
class ur extends ho {
  constructor(e, t, r, s = null) {
    super("password", r), this._email = e, this._password = t, this._tenantId = s;
  }
  static _fromEmailAndPassword(e, t) {
    return new ur(e, t, "password");
  }
  static _fromEmailAndCode(e, t, r = null) {
    return new ur(e, t, "emailLink", r);
  }
  toJSON() {
    return {
      email: this._email,
      password: this._password,
      signInMethod: this.signInMethod,
      tenantId: this._tenantId
    };
  }
  static fromJSON(e) {
    const t = typeof e == "string" ? JSON.parse(e) : e;
    if (t?.email && t?.password) {
      if (t.signInMethod === "password") return this._fromEmailAndPassword(t.email, t.password);
      if (t.signInMethod === "emailLink") return this._fromEmailAndCode(t.email, t.password, t.tenantId);
    }
    return null;
  }
  async _getIdTokenResponse(e) {
    switch (this.signInMethod) {
      case "password":
        const t = {
          returnSecureToken: !0,
          email: this._email,
          password: this._password,
          clientType: "CLIENT_TYPE_WEB"
        };
        return Fa(e, t, "signInWithPassword", sI);
      case "emailLink":
        return iI(e, {
          email: this._email,
          oobCode: this._password
        });
      default:
        He(e, "internal-error");
    }
  }
  async _linkToIdToken(e, t) {
    switch (this.signInMethod) {
      case "password":
        const r = {
          idToken: t,
          returnSecureToken: !0,
          email: this._email,
          password: this._password,
          clientType: "CLIENT_TYPE_WEB"
        };
        return Fa(e, r, "signUpPassword", rI);
      case "emailLink":
        return oI(e, {
          idToken: t,
          email: this._email,
          oobCode: this._password
        });
      default:
        He(e, "internal-error");
    }
  }
  _getReauthenticationResolver(e) {
    return this._getIdTokenResponse(e);
  }
}
async function or(n, e) {
  return vr(n, "POST", "/v1/accounts:signInWithIdp", Pt(n, e));
}
const aI = "http://localhost";
class Jt extends ho {
  constructor() {
    super(...arguments), this.pendingToken = null;
  }
  static _fromParams(e) {
    const t = new Jt(e.providerId, e.signInMethod);
    return e.idToken || e.accessToken ? (e.idToken && (t.idToken = e.idToken), e.accessToken && (t.accessToken = e.accessToken), e.nonce && !e.pendingToken && (t.nonce = e.nonce), e.pendingToken && (t.pendingToken = e.pendingToken)) : e.oauthToken && e.oauthTokenSecret ? (t.accessToken = e.oauthToken, t.secret = e.oauthTokenSecret) : He("argument-error"), t;
  }
  toJSON() {
    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
      secret: this.secret,
      nonce: this.nonce,
      pendingToken: this.pendingToken,
      providerId: this.providerId,
      signInMethod: this.signInMethod
    };
  }
  static fromJSON(e) {
    const t = typeof e == "string" ? JSON.parse(e) : e,
      {
        providerId: r,
        signInMethod: s,
        ...i
      } = t;
    if (!r || !s) return null;
    const o = new Jt(r, s);
    return o.idToken = i.idToken || void 0, o.accessToken = i.accessToken || void 0, o.secret = i.secret, o.nonce = i.nonce, o.pendingToken = i.pendingToken || null, o;
  }
  _getIdTokenResponse(e) {
    const t = this.buildRequest();
    return or(e, t);
  }
  _linkToIdToken(e, t) {
    const r = this.buildRequest();
    return r.idToken = t, or(e, r);
  }
  _getReauthenticationResolver(e) {
    const t = this.buildRequest();
    return t.autoCreate = !1, or(e, t);
  }
  buildRequest() {
    const e = {
      requestUri: aI,
      returnSecureToken: !0
    };
    if (this.pendingToken) e.pendingToken = this.pendingToken;else {
      const t = {};
      this.idToken && (t.id_token = this.idToken), this.accessToken && (t.access_token = this.accessToken), this.secret && (t.oauth_token_secret = this.secret), t.providerId = this.providerId, this.nonce && !this.pendingToken && (t.nonce = this.nonce), e.postBody = ks(t);
    }
    return e;
  }
}
function cI(n) {
  switch (n) {
    case "recoverEmail":
      return "RECOVER_EMAIL";
    case "resetPassword":
      return "PASSWORD_RESET";
    case "signIn":
      return "EMAIL_SIGNIN";
    case "verifyEmail":
      return "VERIFY_EMAIL";
    case "verifyAndChangeEmail":
      return "VERIFY_AND_CHANGE_EMAIL";
    case "revertSecondFactorAddition":
      return "REVERT_SECOND_FACTOR_ADDITION";
    default:
      return null;
  }
}
function uI(n) {
  const e = Yr(Zr(n)).link,
    t = e ? Yr(Zr(e)).deep_link_id : null,
    r = Yr(Zr(n)).deep_link_id;
  return (r ? Yr(Zr(r)).link : null) || r || t || e || n;
}
class fo {
  constructor(e) {
    const t = Yr(Zr(e)),
      r = t.apiKey ?? null,
      s = t.oobCode ?? null,
      i = cI(t.mode ?? null);
    j(r && s && i, "argument-error"), this.apiKey = r, this.operation = i, this.code = s, this.continueUrl = t.continueUrl ?? null, this.languageCode = t.lang ?? null, this.tenantId = t.tenantId ?? null;
  }
  static parseLink(e) {
    const t = uI(e);
    try {
      return new fo(t);
    } catch {
      return null;
    }
  }
}
class Un {
  constructor() {
    this.providerId = Un.PROVIDER_ID;
  }
  static credential(e, t) {
    return ur._fromEmailAndPassword(e, t);
  }
  static credentialWithLink(e, t) {
    const r = fo.parseLink(t);
    return j(r, "argument-error"), ur._fromEmailAndCode(e, r.code, r.tenantId);
  }
}
Un.PROVIDER_ID = "password";
Un.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
Un.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
class Ac {
  constructor(e) {
    this.providerId = e, this.defaultLanguageCode = null, this.customParameters = {};
  }
  setDefaultLanguage(e) {
    this.defaultLanguageCode = e;
  }
  setCustomParameters(e) {
    return this.customParameters = e, this;
  }
  getCustomParameters() {
    return this.customParameters;
  }
}
class Ns extends Ac {
  constructor() {
    super(...arguments), this.scopes = [];
  }
  addScope(e) {
    return this.scopes.includes(e) || this.scopes.push(e), this;
  }
  getScopes() {
    return [...this.scopes];
  }
}
class pt extends Ns {
  constructor() {
    super("facebook.com");
  }
  static credential(e) {
    return Jt._fromParams({
      providerId: pt.PROVIDER_ID,
      signInMethod: pt.FACEBOOK_SIGN_IN_METHOD,
      accessToken: e
    });
  }
  static credentialFromResult(e) {
    return pt.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return pt.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({
    _tokenResponse: e
  }) {
    if (!e || !("oauthAccessToken" in e) || !e.oauthAccessToken) return null;
    try {
      return pt.credential(e.oauthAccessToken);
    } catch {
      return null;
    }
  }
}
pt.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
pt.PROVIDER_ID = "facebook.com";
class mt extends Ns {
  constructor() {
    super("google.com"), this.addScope("profile");
  }
  static credential(e, t) {
    return Jt._fromParams({
      providerId: mt.PROVIDER_ID,
      signInMethod: mt.GOOGLE_SIGN_IN_METHOD,
      idToken: e,
      accessToken: t
    });
  }
  static credentialFromResult(e) {
    return mt.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return mt.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({
    _tokenResponse: e
  }) {
    if (!e) return null;
    const {
      oauthIdToken: t,
      oauthAccessToken: r
    } = e;
    if (!t && !r) return null;
    try {
      return mt.credential(t, r);
    } catch {
      return null;
    }
  }
}
mt.GOOGLE_SIGN_IN_METHOD = "google.com";
mt.PROVIDER_ID = "google.com";
class gt extends Ns {
  constructor() {
    super("github.com");
  }
  static credential(e) {
    return Jt._fromParams({
      providerId: gt.PROVIDER_ID,
      signInMethod: gt.GITHUB_SIGN_IN_METHOD,
      accessToken: e
    });
  }
  static credentialFromResult(e) {
    return gt.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return gt.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({
    _tokenResponse: e
  }) {
    if (!e || !("oauthAccessToken" in e) || !e.oauthAccessToken) return null;
    try {
      return gt.credential(e.oauthAccessToken);
    } catch {
      return null;
    }
  }
}
gt.GITHUB_SIGN_IN_METHOD = "github.com";
gt.PROVIDER_ID = "github.com";
class _t extends Ns {
  constructor() {
    super("twitter.com");
  }
  static credential(e, t) {
    return Jt._fromParams({
      providerId: _t.PROVIDER_ID,
      signInMethod: _t.TWITTER_SIGN_IN_METHOD,
      oauthToken: e,
      oauthTokenSecret: t
    });
  }
  static credentialFromResult(e) {
    return _t.credentialFromTaggedObject(e);
  }
  static credentialFromError(e) {
    return _t.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({
    _tokenResponse: e
  }) {
    if (!e) return null;
    const {
      oauthAccessToken: t,
      oauthTokenSecret: r
    } = e;
    if (!t || !r) return null;
    try {
      return _t.credential(t, r);
    } catch {
      return null;
    }
  }
}
_t.TWITTER_SIGN_IN_METHOD = "twitter.com";
_t.PROVIDER_ID = "twitter.com";
async function lI(n, e) {
  return vr(n, "POST", "/v1/accounts:signUp", Pt(n, e));
}
class Yt {
  constructor(e) {
    this.user = e.user, this.providerId = e.providerId, this._tokenResponse = e._tokenResponse, this.operationType = e.operationType;
  }
  static async _fromIdTokenResponse(e, t, r, s = !1) {
    const i = await Qe._fromIdTokenResponse(e, r, s),
      o = Ql(r);
    return new Yt({
      user: i,
      providerId: o,
      _tokenResponse: r,
      operationType: t
    });
  }
  static async _forOperation(e, t, r) {
    await e._updateTokensIfNecessary(r, !0);
    const s = Ql(r);
    return new Yt({
      user: e,
      providerId: s,
      _tokenResponse: r,
      operationType: t
    });
  }
}
function Ql(n) {
  return n.providerId ? n.providerId : "phoneNumber" in n ? "phone" : null;
}
class qi extends ft {
  constructor(e, t, r, s) {
    super(t.code, t.message), this.operationType = r, this.user = s, Object.setPrototypeOf(this, qi.prototype), this.customData = {
      appName: e.name,
      tenantId: e.tenantId ?? void 0,
      _serverResponse: t.customData._serverResponse,
      operationType: r
    };
  }
  static _fromErrorAndOperation(e, t, r, s) {
    return new qi(e, t, r, s);
  }
}
function pf(n, e, t, r) {
  return (e === "reauthenticate" ? t._getReauthenticationResolver(n) : t._getIdTokenResponse(n)).catch(i => {
    throw i.code === "auth/multi-factor-auth-required" ? qi._fromErrorAndOperation(n, i, e, r) : i;
  });
}
async function hI(n, e, t = !1) {
  const r = await cr(n, e._linkToIdToken(n.auth, await n.getIdToken()), t);
  return Yt._forOperation(n, "link", r);
}
async function dI(n, e, t = !1) {
  const {
    auth: r
  } = n;
  if (xe(r.app)) return Promise.reject(at(r));
  const s = "reauthenticate";
  try {
    const i = await cr(n, pf(r, s, e, n), t);
    j(i.idToken, r, "internal-error");
    const o = wc(i.idToken);
    j(o, r, "internal-error");
    const {
      sub: c
    } = o;
    return j(n.uid === c, r, "user-mismatch"), Yt._forOperation(n, s, i);
  } catch (i) {
    throw i?.code === "auth/user-not-found" && He(r, "user-mismatch"), i;
  }
}
async function mf(n, e, t = !1) {
  if (xe(n.app)) return Promise.reject(at(n));
  const r = "signIn",
    s = await pf(n, r, e),
    i = await Yt._fromIdTokenResponse(n, r, s);
  return t || (await n._updateCurrentUser(i.user)), i;
}
async function gf(n, e) {
  return mf(Ct(n), e);
}
async function fI(n, e) {
  return vr(n, "POST", "/v1/accounts:signInWithCustomToken", Pt(n, e));
}
async function pI(n, e) {
  if (xe(n.app)) return Promise.reject(at(n));
  const t = Ct(n),
    r = await fI(t, {
      token: e,
      returnSecureToken: !0
    }),
    s = await Yt._fromIdTokenResponse(t, "signIn", r);
  return await t._updateCurrentUser(s.user), s;
}
async function _f(n) {
  const e = Ct(n);
  e._getPasswordPolicyInternal() && (await e._updatePasswordPolicy());
}
async function mI(n, e, t) {
  if (xe(n.app)) return Promise.reject(at(n));
  const r = Ct(n),
    o = await Fa(r, {
      returnSecureToken: !0,
      email: e,
      password: t,
      clientType: "CLIENT_TYPE_WEB"
    }, "signUpPassword", lI).catch(u => {
      throw u.code === "auth/password-does-not-meet-requirements" && _f(n), u;
    }),
    c = await Yt._fromIdTokenResponse(r, "signIn", o);
  return await r._updateCurrentUser(c.user), c;
}
function gI(n, e, t) {
  return xe(n.app) ? Promise.reject(at(n)) : gf(se(n), Un.credential(e, t)).catch(async r => {
    throw r.code === "auth/password-does-not-meet-requirements" && _f(n), r;
  });
}
function _I(n, e) {
  return yI(se(n), null, e);
}
async function yI(n, e, t) {
  const {
      auth: r
    } = n,
    i = {
      idToken: await n.getIdToken(),
      returnSecureToken: !0
    };
  t && (i.password = t);
  const o = await cr(n, nI(r, i));
  await n._updateTokensIfNecessary(o, !0);
}
function II(n, e, t, r) {
  return se(n).onAuthStateChanged(e, t, r);
}
function EI(n) {
  return se(n).signOut();
}
async function TI(n) {
  return se(n).delete();
}
const ji = "__sak";
class yf {
  constructor(e, t) {
    this.storageRetriever = e, this.type = t;
  }
  _isAvailable() {
    try {
      return this.storage ? (this.storage.setItem(ji, "1"), this.storage.removeItem(ji), Promise.resolve(!0)) : Promise.resolve(!1);
    } catch {
      return Promise.resolve(!1);
    }
  }
  _set(e, t) {
    return this.storage.setItem(e, JSON.stringify(t)), Promise.resolve();
  }
  _get(e) {
    const t = this.storage.getItem(e);
    return Promise.resolve(t ? JSON.parse(t) : null);
  }
  _remove(e) {
    return this.storage.removeItem(e), Promise.resolve();
  }
  get storage() {
    return this.storageRetriever();
  }
}
const wI = 1e3;
const vI = 10;
class If extends yf {
  constructor() {
    super(() => window.localStorage, "LOCAL"), this.boundEventHandler = (e, t) => this.onStorageEvent(e, t), this.listeners = {}, this.localCache = {}, this.pollTimer = null, this.fallbackToPolling = uf(), this._shouldAllowMigration = !0;
  }
  forAllChangedKeys(e) {
    for (const t of Object.keys(this.listeners)) {
      const r = this.storage.getItem(t),
        s = this.localCache[t];
      r !== s && e(t, s, r);
    }
  }
  onStorageEvent(e, t = !1) {
    if (!e.key) {
      this.forAllChangedKeys((o, c, u) => {
        this.notifyListeners(o, u);
      });
      return;
    }
    const r = e.key;
    t ? this.detachListener() : this.stopPolling();
    const s = () => {
        const o = this.storage.getItem(r);
        !t && this.localCache[r] === o || this.notifyListeners(r, o);
      },
      i = this.storage.getItem(r);
    Fy() && i !== e.newValue && e.newValue !== e.oldValue ? setTimeout(s, vI) : s();
  }
  notifyListeners(e, t) {
    this.localCache[e] = t;
    const r = this.listeners[e];
    if (r) for (const s of Array.from(r)) s(t && JSON.parse(t));
  }
  startPolling() {
    this.stopPolling(), this.pollTimer = setInterval(() => {
      this.forAllChangedKeys((e, t, r) => {
        this.onStorageEvent(new StorageEvent("storage", {
          key: e,
          oldValue: t,
          newValue: r
        }), !0);
      });
    }, wI);
  }
  stopPolling() {
    this.pollTimer && (clearInterval(this.pollTimer), this.pollTimer = null);
  }
  attachListener() {
    window.addEventListener("storage", this.boundEventHandler);
  }
  detachListener() {
    window.removeEventListener("storage", this.boundEventHandler);
  }
  _addListener(e, t) {
    Object.keys(this.listeners).length === 0 && (this.fallbackToPolling ? this.startPolling() : this.attachListener()), this.listeners[e] || (this.listeners[e] = new Set(), this.localCache[e] = this.storage.getItem(e)), this.listeners[e].add(t);
  }
  _removeListener(e, t) {
    this.listeners[e] && (this.listeners[e].delete(t), this.listeners[e].size === 0 && delete this.listeners[e]), Object.keys(this.listeners).length === 0 && (this.detachListener(), this.stopPolling());
  }
  async _set(e, t) {
    await super._set(e, t), this.localCache[e] = JSON.stringify(t);
  }
  async _get(e) {
    const t = await super._get(e);
    return this.localCache[e] = JSON.stringify(t), t;
  }
  async _remove(e) {
    await super._remove(e), delete this.localCache[e];
  }
}
If.type = "LOCAL";
const AI = If;
class Ef extends yf {
  constructor() {
    super(() => window.sessionStorage, "SESSION");
  }
  _addListener(e, t) {}
  _removeListener(e, t) {}
}
Ef.type = "SESSION";
const Tf = Ef;
function RI(n) {
  return Promise.all(n.map(async e => {
    try {
      return {
        fulfilled: !0,
        value: await e
      };
    } catch (t) {
      return {
        fulfilled: !1,
        reason: t
      };
    }
  }));
}
class po {
  constructor(e) {
    this.eventTarget = e, this.handlersMap = {}, this.boundEventHandler = this.handleEvent.bind(this);
  }
  static _getInstance(e) {
    const t = this.receivers.find(s => s.isListeningto(e));
    if (t) return t;
    const r = new po(e);
    return this.receivers.push(r), r;
  }
  isListeningto(e) {
    return this.eventTarget === e;
  }
  async handleEvent(e) {
    const t = e,
      {
        eventId: r,
        eventType: s,
        data: i
      } = t.data,
      o = this.handlersMap[s];
    if (!o?.size) return;
    t.ports[0].postMessage({
      status: "ack",
      eventId: r,
      eventType: s
    });
    const c = Array.from(o).map(async h => h(t.origin, i)),
      u = await RI(c);
    t.ports[0].postMessage({
      status: "done",
      eventId: r,
      eventType: s,
      response: u
    });
  }
  _subscribe(e, t) {
    Object.keys(this.handlersMap).length === 0 && this.eventTarget.addEventListener("message", this.boundEventHandler), this.handlersMap[e] || (this.handlersMap[e] = new Set()), this.handlersMap[e].add(t);
  }
  _unsubscribe(e, t) {
    this.handlersMap[e] && t && this.handlersMap[e].delete(t), (!t || this.handlersMap[e].size === 0) && delete this.handlersMap[e], Object.keys(this.handlersMap).length === 0 && this.eventTarget.removeEventListener("message", this.boundEventHandler);
  }
}
po.receivers = [];
function Rc(n = "", e = 10) {
  let t = "";
  for (let r = 0; r < e; r++) t += Math.floor(Math.random() * 10);
  return n + t;
}
class bI {
  constructor(e) {
    this.target = e, this.handlers = new Set();
  }
  removeMessageHandler(e) {
    e.messageChannel && (e.messageChannel.port1.removeEventListener("message", e.onMessage), e.messageChannel.port1.close()), this.handlers.delete(e);
  }
  async _send(e, t, r = 50) {
    const s = typeof MessageChannel < "u" ? new MessageChannel() : null;
    if (!s) throw new Error("connection_unavailable");
    let i, o;
    return new Promise((c, u) => {
      const h = Rc("", 20);
      s.port1.start();
      const f = setTimeout(() => {
        u(new Error("unsupported_event"));
      }, r);
      o = {
        messageChannel: s,
        onMessage(m) {
          const _ = m;
          if (_.data.eventId === h) switch (_.data.status) {
            case "ack":
              clearTimeout(f), i = setTimeout(() => {
                u(new Error("timeout"));
              }, 3e3);
              break;
            case "done":
              clearTimeout(i), c(_.data.response);
              break;
            default:
              clearTimeout(f), clearTimeout(i), u(new Error("invalid_response"));
              break;
          }
        }
      }, this.handlers.add(o), s.port1.addEventListener("message", o.onMessage), this.target.postMessage({
        eventType: e,
        eventId: h,
        data: t
      }, [s.port2]);
    }).finally(() => {
      o && this.removeMessageHandler(o);
    });
  }
}
function ct() {
  return window;
}
function PI(n) {
  ct().location.href = n;
}
function wf() {
  return typeof ct().WorkerGlobalScope < "u" && typeof ct().importScripts == "function";
}
async function SI() {
  if (!navigator?.serviceWorker) return null;
  try {
    return (await navigator.serviceWorker.ready).active;
  } catch {
    return null;
  }
}
function CI() {
  return navigator?.serviceWorker?.controller || null;
}
function VI() {
  return wf() ? self : null;
}
const vf = "firebaseLocalStorageDb";
const kI = 1;
const zi = "firebaseLocalStorage";
const Af = "fbase_key";
class xs {
  constructor(e) {
    this.request = e;
  }
  toPromise() {
    return new Promise((e, t) => {
      this.request.addEventListener("success", () => {
        e(this.request.result);
      }), this.request.addEventListener("error", () => {
        t(this.request.error);
      });
    });
  }
}
function mo(n, e) {
  return n.transaction([zi], e ? "readwrite" : "readonly").objectStore(zi);
}
function DI() {
  const n = indexedDB.deleteDatabase(vf);
  return new xs(n).toPromise();
}
function Ua() {
  const n = indexedDB.open(vf, kI);
  return new Promise((e, t) => {
    n.addEventListener("error", () => {
      t(n.error);
    }), n.addEventListener("upgradeneeded", () => {
      const r = n.result;
      try {
        r.createObjectStore(zi, {
          keyPath: Af
        });
      } catch (s) {
        t(s);
      }
    }), n.addEventListener("success", async () => {
      const r = n.result;
      r.objectStoreNames.contains(zi) ? e(r) : (r.close(), await DI(), e(await Ua()));
    });
  });
}
async function Xl(n, e, t) {
  const r = mo(n, !0).put({
    [Af]: e,
    value: t
  });
  return new xs(r).toPromise();
}
async function NI(n, e) {
  const t = mo(n, !1).get(e),
    r = await new xs(t).toPromise();
  return r === void 0 ? null : r.value;
}
function Jl(n, e) {
  const t = mo(n, !0).delete(e);
  return new xs(t).toPromise();
}
const xI = 800;
const OI = 3;
class Rf {
  constructor() {
    this.type = "LOCAL", this._shouldAllowMigration = !0, this.listeners = {}, this.localCache = {}, this.pollTimer = null, this.pendingWrites = 0, this.receiver = null, this.sender = null, this.serviceWorkerReceiverAvailable = !1, this.activeServiceWorker = null, this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {}, () => {});
  }
  async _openDb() {
    return this.db ? this.db : (this.db = await Ua(), this.db);
  }
  async _withRetries(e) {
    let t = 0;
    for (;;) try {
      const r = await this._openDb();
      return await e(r);
    } catch (r) {
      if (t++ > OI) throw r;
      this.db && (this.db.close(), this.db = void 0);
    }
  }
  async initializeServiceWorkerMessaging() {
    return wf() ? this.initializeReceiver() : this.initializeSender();
  }
  async initializeReceiver() {
    this.receiver = po._getInstance(VI()), this.receiver._subscribe("keyChanged", async (e, t) => ({
      keyProcessed: (await this._poll()).includes(t.key)
    })), this.receiver._subscribe("ping", async (e, t) => ["keyChanged"]);
  }
  async initializeSender() {
    if (this.activeServiceWorker = await SI(), !this.activeServiceWorker) return;
    this.sender = new bI(this.activeServiceWorker);
    const e = await this.sender._send("ping", {}, 800);
    e && e[0]?.fulfilled && e[0]?.value.includes("keyChanged") && (this.serviceWorkerReceiverAvailable = !0);
  }
  async notifyServiceWorker(e) {
    if (!(!this.sender || !this.activeServiceWorker || CI() !== this.activeServiceWorker)) try {
      await this.sender._send("keyChanged", {
        key: e
      }, this.serviceWorkerReceiverAvailable ? 800 : 50);
    } catch {}
  }
  async _isAvailable() {
    try {
      if (!indexedDB) return !1;
      const e = await Ua();
      return await Xl(e, ji, "1"), await Jl(e, ji), !0;
    } catch {}
    return !1;
  }
  async _withPendingWrite(e) {
    this.pendingWrites++;
    try {
      await e();
    } finally {
      this.pendingWrites--;
    }
  }
  async _set(e, t) {
    return this._withPendingWrite(async () => (await this._withRetries(r => Xl(r, e, t)), this.localCache[e] = t, this.notifyServiceWorker(e)));
  }
  async _get(e) {
    const t = await this._withRetries(r => NI(r, e));
    return this.localCache[e] = t, t;
  }
  async _remove(e) {
    return this._withPendingWrite(async () => (await this._withRetries(t => Jl(t, e)), delete this.localCache[e], this.notifyServiceWorker(e)));
  }
  async _poll() {
    const e = await this._withRetries(s => {
      const i = mo(s, !1).getAll();
      return new xs(i).toPromise();
    });
    if (!e) return [];
    if (this.pendingWrites !== 0) return [];
    const t = [],
      r = new Set();
    if (e.length !== 0) for (const {
      fbase_key: s,
      value: i
    } of e) r.add(s), JSON.stringify(this.localCache[s]) !== JSON.stringify(i) && (this.notifyListeners(s, i), t.push(s));
    for (const s of Object.keys(this.localCache)) this.localCache[s] && !r.has(s) && (this.notifyListeners(s, null), t.push(s));
    return t;
  }
  notifyListeners(e, t) {
    this.localCache[e] = t;
    const r = this.listeners[e];
    if (r) for (const s of Array.from(r)) s(t);
  }
  startPolling() {
    this.stopPolling(), this.pollTimer = setInterval(async () => this._poll(), xI);
  }
  stopPolling() {
    this.pollTimer && (clearInterval(this.pollTimer), this.pollTimer = null);
  }
  _addListener(e, t) {
    Object.keys(this.listeners).length === 0 && this.startPolling(), this.listeners[e] || (this.listeners[e] = new Set(), this._get(e)), this.listeners[e].add(t);
  }
  _removeListener(e, t) {
    this.listeners[e] && (this.listeners[e].delete(t), this.listeners[e].size === 0 && delete this.listeners[e]), Object.keys(this.listeners).length === 0 && this.stopPolling();
  }
}
Rf.type = "LOCAL";
const MI = Rf;
new Ds(3e4, 6e4);
function bf(n, e) {
  return e ? It(e) : (j(n._popupRedirectResolver, n, "argument-error"), n._popupRedirectResolver);
}
class bc extends ho {
  constructor(e) {
    super("custom", "custom"), this.params = e;
  }
  _getIdTokenResponse(e) {
    return or(e, this._buildIdpRequest());
  }
  _linkToIdToken(e, t) {
    return or(e, this._buildIdpRequest(t));
  }
  _getReauthenticationResolver(e) {
    return or(e, this._buildIdpRequest());
  }
  _buildIdpRequest(e) {
    const t = {
      requestUri: this.params.requestUri,
      sessionId: this.params.sessionId,
      postBody: this.params.postBody,
      tenantId: this.params.tenantId,
      pendingToken: this.params.pendingToken,
      returnSecureToken: !0,
      returnIdpCredential: !0
    };
    return e && (t.idToken = e), t;
  }
}
function LI(n) {
  return mf(n.auth, new bc(n), n.bypassAuthState);
}
function FI(n) {
  const {
    auth: e,
    user: t
  } = n;
  return j(t, e, "internal-error"), dI(t, new bc(n), n.bypassAuthState);
}
async function UI(n) {
  const {
    auth: e,
    user: t
  } = n;
  return j(t, e, "internal-error"), hI(t, new bc(n), n.bypassAuthState);
}
class Pf {
  constructor(e, t, r, s, i = !1) {
    this.auth = e, this.resolver = r, this.user = s, this.bypassAuthState = i, this.pendingPromise = null, this.eventManager = null, this.filter = Array.isArray(t) ? t : [t];
  }
  execute() {
    return new Promise(async (e, t) => {
      this.pendingPromise = {
        resolve: e,
        reject: t
      };
      try {
        this.eventManager = await this.resolver._initialize(this.auth), await this.onExecution(), this.eventManager.registerConsumer(this);
      } catch (r) {
        this.reject(r);
      }
    });
  }
  async onAuthEvent(e) {
    const {
      urlResponse: t,
      sessionId: r,
      postBody: s,
      tenantId: i,
      error: o,
      type: c
    } = e;
    if (o) {
      this.reject(o);
      return;
    }
    const u = {
      auth: this.auth,
      requestUri: t,
      sessionId: r,
      tenantId: i || void 0,
      postBody: s || void 0,
      user: this.user,
      bypassAuthState: this.bypassAuthState
    };
    try {
      this.resolve(await this.getIdpTask(c)(u));
    } catch (h) {
      this.reject(h);
    }
  }
  onError(e) {
    this.reject(e);
  }
  getIdpTask(e) {
    switch (e) {
      case "signInViaPopup":
      case "signInViaRedirect":
        return LI;
      case "linkViaPopup":
      case "linkViaRedirect":
        return UI;
      case "reauthViaPopup":
      case "reauthViaRedirect":
        return FI;
      default:
        He(this.auth, "internal-error");
    }
  }
  resolve(e) {
    vt(this.pendingPromise, "Pending promise was never set"), this.pendingPromise.resolve(e), this.unregisterAndCleanUp();
  }
  reject(e) {
    vt(this.pendingPromise, "Pending promise was never set"), this.pendingPromise.reject(e), this.unregisterAndCleanUp();
  }
  unregisterAndCleanUp() {
    this.eventManager && this.eventManager.unregisterConsumer(this), this.pendingPromise = null, this.cleanUp();
  }
}
const BI = new Ds(2e3, 1e4);
async function qI(n, e, t) {
  if (xe(n.app)) return Promise.reject(Xe(n, "operation-not-supported-in-this-environment"));
  const r = Ct(n);
  Ey(n, e, Ac);
  const s = bf(r, t);
  return new En(r, "signInViaPopup", e, s).executeNotNull();
}
class En extends Pf {
  constructor(e, t, r, s, i) {
    super(e, t, s, i), this.provider = r, this.authWindow = null, this.pollId = null, En.currentPopupAction && En.currentPopupAction.cancel(), En.currentPopupAction = this;
  }
  async executeNotNull() {
    const e = await this.execute();
    return j(e, this.auth, "internal-error"), e;
  }
  async onExecution() {
    vt(this.filter.length === 1, "Popup operations only handle one event");
    const e = Rc();
    this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], e), this.authWindow.associatedEvent = e, this.resolver._originValidation(this.auth).catch(t => {
      this.reject(t);
    }), this.resolver._isIframeWebStorageSupported(this.auth, t => {
      t || this.reject(Xe(this.auth, "web-storage-unsupported"));
    }), this.pollUserCancellation();
  }
  get eventId() {
    return this.authWindow?.associatedEvent || null;
  }
  cancel() {
    this.reject(Xe(this.auth, "cancelled-popup-request"));
  }
  cleanUp() {
    this.authWindow && this.authWindow.close(), this.pollId && window.clearTimeout(this.pollId), this.authWindow = null, this.pollId = null, En.currentPopupAction = null;
  }
  pollUserCancellation() {
    const e = () => {
      if (this.authWindow?.window?.closed) {
        this.pollId = window.setTimeout(() => {
          this.pollId = null, this.reject(Xe(this.auth, "popup-closed-by-user"));
        }, 8e3);
        return;
      }
      this.pollId = window.setTimeout(e, BI.get());
    };
    e();
  }
}
En.currentPopupAction = null;
const jI = "pendingRedirect";
const wi = new Map();
class zI extends Pf {
  constructor(e, t, r = !1) {
    super(e, ["signInViaRedirect", "linkViaRedirect", "reauthViaRedirect", "unknown"], t, void 0, r), this.eventId = null;
  }
  async execute() {
    let e = wi.get(this.auth._key());
    if (!e) {
      try {
        const r = (await $I(this.resolver, this.auth)) ? await super.execute() : null;
        e = () => Promise.resolve(r);
      } catch (t) {
        e = () => Promise.reject(t);
      }
      wi.set(this.auth._key(), e);
    }
    return this.bypassAuthState || wi.set(this.auth._key(), () => Promise.resolve(null)), e();
  }
  async onAuthEvent(e) {
    if (e.type === "signInViaRedirect") return super.onAuthEvent(e);
    if (e.type === "unknown") {
      this.resolve(null);
      return;
    }
    if (e.eventId) {
      const t = await this.auth._redirectUserForId(e.eventId);
      if (t) return this.user = t, super.onAuthEvent(e);
      this.resolve(null);
    }
  }
  async onExecution() {}
  cleanUp() {}
}
async function $I(n, e) {
  const t = HI(e),
    r = KI(n);
  if (!(await r._isAvailable())) return !1;
  const s = (await r._get(t)) === "true";
  return await r._remove(t), s;
}
function GI(n, e) {
  wi.set(n._key(), e);
}
function KI(n) {
  return It(n._redirectPersistence);
}
function HI(n) {
  return Ti(jI, n.config.apiKey, n.name);
}
async function WI(n, e, t = !1) {
  if (xe(n.app)) return Promise.reject(at(n));
  const r = Ct(n),
    s = bf(r, e),
    o = await new zI(r, s, t).execute();
  return o && !t && (delete o.user._redirectEventId, await r._persistUserIfCurrent(o.user), await r._setRedirectUser(null, e)), o;
}
const QI = 600 * 1e3;
class XI {
  constructor(e) {
    this.auth = e, this.cachedEventUids = new Set(), this.consumers = new Set(), this.queuedRedirectEvent = null, this.hasHandledPotentialRedirect = !1, this.lastProcessedEventTime = Date.now();
  }
  registerConsumer(e) {
    this.consumers.add(e), this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, e) && (this.sendToConsumer(this.queuedRedirectEvent, e), this.saveEventToCache(this.queuedRedirectEvent), this.queuedRedirectEvent = null);
  }
  unregisterConsumer(e) {
    this.consumers.delete(e);
  }
  onEvent(e) {
    if (this.hasEventBeenHandled(e)) return !1;
    let t = !1;
    return this.consumers.forEach(r => {
      this.isEventForConsumer(e, r) && (t = !0, this.sendToConsumer(e, r), this.saveEventToCache(e));
    }), this.hasHandledPotentialRedirect || !JI(e) || (this.hasHandledPotentialRedirect = !0, t || (this.queuedRedirectEvent = e, t = !0)), t;
  }
  sendToConsumer(e, t) {
    if (e.error && !Sf(e)) {
      const r = e.error.code?.split("auth/")[1] || "internal-error";
      t.onError(Xe(this.auth, r));
    } else t.onAuthEvent(e);
  }
  isEventForConsumer(e, t) {
    const r = t.eventId === null || !!e.eventId && e.eventId === t.eventId;
    return t.filter.includes(e.type) && r;
  }
  hasEventBeenHandled(e) {
    return Date.now() - this.lastProcessedEventTime >= QI && this.cachedEventUids.clear(), this.cachedEventUids.has(Yl(e));
  }
  saveEventToCache(e) {
    this.cachedEventUids.add(Yl(e)), this.lastProcessedEventTime = Date.now();
  }
}
function Yl(n) {
  return [n.type, n.eventId, n.sessionId, n.tenantId].filter(e => e).join("-");
}
function Sf({
  type: n,
  error: e
}) {
  return n === "unknown" && e?.code === "auth/no-auth-event";
}
function JI(n) {
  switch (n.type) {
    case "signInViaRedirect":
    case "linkViaRedirect":
    case "reauthViaRedirect":
      return !0;
    case "unknown":
      return Sf(n);
    default:
      return !1;
  }
}
async function YI(n, e = {}) {
  return St(n, "GET", "/v1/projects", e);
}
const ZI = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const eE = /^https?/;
async function tE(n) {
  if (n.config.emulator) return;
  const {
    authorizedDomains: e
  } = await YI(n);
  for (const t of e) try {
    if (nE(t)) return;
  } catch {}
  He(n, "unauthorized-domain");
}
function nE(n) {
  const e = Oa(),
    {
      protocol: t,
      hostname: r
    } = new URL(e);
  if (n.startsWith("chrome-extension://")) {
    const o = new URL(n);
    return o.hostname === "" && r === "" ? t === "chrome-extension:" && n.replace("chrome-extension://", "") === e.replace("chrome-extension://", "") : t === "chrome-extension:" && o.hostname === r;
  }
  if (!eE.test(t)) return !1;
  if (ZI.test(n)) return r === n;
  const s = n.replace(/\./g, "\\.");
  return new RegExp("^(.+\\." + s + "|" + s + ")$", "i").test(r);
}
const rE = new Ds(3e4, 6e4);
function Zl() {
  const n = ct().___jsl;
  if (n?.H) {
    for (const e of Object.keys(n.H)) if (n.H[e].r = n.H[e].r || [], n.H[e].L = n.H[e].L || [], n.H[e].r = [...n.H[e].L], n.CP) for (let t = 0; t < n.CP.length; t++) n.CP[t] = null;
  }
}
function sE(n) {
  return new Promise((e, t) => {
    function r() {
      Zl(), gapi.load("gapi.iframes", {
        callback: () => {
          e(gapi.iframes.getContext());
        },
        ontimeout: () => {
          Zl(), t(Xe(n, "network-request-failed"));
        },
        timeout: rE.get()
      });
    }
    if (ct().gapi?.iframes?.Iframe) e(gapi.iframes.getContext());else if (ct().gapi?.load) r();else {
      const s = Hy("iframefcb");
      return ct()[s] = () => {
        gapi.load ? r() : t(Xe(n, "network-request-failed"));
      }, hf(`${Ky()}?onload=${s}`).catch(i => t(i));
    }
  }).catch(e => {
    throw vi = null, e;
  });
}
let vi = null;
function iE(n) {
  return vi = vi || sE(n), vi;
}
const oE = new Ds(5e3, 15e3);
const aE = "__/auth/iframe";
const cE = "emulator/auth/iframe";
const uE = {
  style: {
    position: "absolute",
    top: "-100px",
    width: "1px",
    height: "1px"
  },
  "aria-hidden": "true",
  tabindex: "-1"
};
const lE = new Map([["identitytoolkit.googleapis.com", "p"], ["staging-identitytoolkit.sandbox.googleapis.com", "s"], ["test-identitytoolkit.sandbox.googleapis.com", "t"]]);
function hE(n) {
  const e = n.config;
  j(e.authDomain, n, "auth-domain-config-required");
  const t = e.emulator ? Tc(e, cE) : `https://${n.config.authDomain}/${aE}`,
    r = {
      apiKey: e.apiKey,
      appName: n.name,
      v: Fn
    },
    s = lE.get(n.config.apiHost);
  s && (r.eid = s);
  const i = n._getFrameworks();
  return i.length && (r.fw = i.join(",")), `${t}?${ks(r).slice(1)}`;
}
async function dE(n) {
  const e = await iE(n),
    t = ct().gapi;
  return j(t, n, "internal-error"), e.open({
    where: document.body,
    url: hE(n),
    messageHandlersFilter: t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
    attributes: uE,
    dontclear: !0
  }, r => new Promise(async (s, i) => {
    await r.restyle({
      setHideOnLeave: !1
    });
    const o = Xe(n, "network-request-failed"),
      c = ct().setTimeout(() => {
        i(o);
      }, oE.get());
    function u() {
      ct().clearTimeout(c), s(r);
    }
    r.ping(u).then(u, () => {
      i(o);
    });
  }));
}
const fE = {
  location: "yes",
  resizable: "yes",
  statusbar: "yes",
  toolbar: "no"
};
const pE = 500;
const mE = 600;
const gE = "_blank";
const _E = "http://localhost";
class eh {
  constructor(e) {
    this.window = e, this.associatedEvent = null;
  }
  close() {
    if (this.window) try {
      this.window.close();
    } catch {}
  }
}
function yE(n, e, t, r = pE, s = mE) {
  const i = Math.max((window.screen.availHeight - s) / 2, 0).toString(),
    o = Math.max((window.screen.availWidth - r) / 2, 0).toString();
  let c = "";
  const u = {
      ...fE,
      width: r.toString(),
      height: s.toString(),
      top: i,
      left: o
    },
    h = Ie().toLowerCase();
  t && (c = rf(h) ? gE : t), tf(h) && (e = e || _E, u.scrollbars = "yes");
  const f = Object.entries(u).reduce((_, [b, V]) => `${_}${b}=${V},`, "");
  if (Ly(h) && c !== "_self") return IE(e || "", c), new eh(null);
  const m = window.open(e || "", c, f);
  j(m, n, "popup-blocked");
  try {
    m.focus();
  } catch {}
  return new eh(m);
}
function IE(n, e) {
  const t = document.createElement("a");
  t.href = n, t.target = e;
  const r = document.createEvent("MouseEvent");
  r.initMouseEvent("click", !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 1, null), t.dispatchEvent(r);
}
const EE = "__/auth/handler";
const TE = "emulator/auth/handler";
const wE = encodeURIComponent("fac");
async function th(n, e, t, r, s, i) {
  j(n.config.authDomain, n, "auth-domain-config-required"), j(n.config.apiKey, n, "invalid-api-key");
  const o = {
    apiKey: n.config.apiKey,
    appName: n.name,
    authType: t,
    redirectUrl: r,
    v: Fn,
    eventId: s
  };
  if (e instanceof Ac) {
    e.setDefaultLanguage(n.languageCode), o.providerId = e.providerId || "", i_(e.getCustomParameters()) || (o.customParameters = JSON.stringify(e.getCustomParameters()));
    for (const [f, m] of Object.entries({})) o[f] = m;
  }
  if (e instanceof Ns) {
    const f = e.getScopes().filter(m => m !== "");
    f.length > 0 && (o.scopes = f.join(","));
  }
  n.tenantId && (o.tid = n.tenantId);
  const c = o;
  for (const f of Object.keys(c)) c[f] === void 0 && delete c[f];
  const u = await n._getAppCheckToken(),
    h = u ? `#${wE}=${encodeURIComponent(u)}` : "";
  return `${vE(n)}?${ks(c).slice(1)}${h}`;
}
function vE({
  config: n
}) {
  return n.emulator ? Tc(n, TE) : `https://${n.authDomain}/${EE}`;
}
const Ia = "webStorageSupport";
class AE {
  constructor() {
    this.eventManagers = {}, this.iframes = {}, this.originValidationPromises = {}, this._redirectPersistence = Tf, this._completeRedirectFn = WI, this._overrideRedirectResult = GI;
  }
  async _openPopup(e, t, r, s) {
    vt(this.eventManagers[e._key()]?.manager, "_initialize() not called before _openPopup()");
    const i = await th(e, t, r, Oa(), s);
    return yE(e, i, Rc());
  }
  async _openRedirect(e, t, r, s) {
    await this._originValidation(e);
    const i = await th(e, t, r, Oa(), s);
    return PI(i), new Promise(() => {});
  }
  _initialize(e) {
    const t = e._key();
    if (this.eventManagers[t]) {
      const {
        manager: s,
        promise: i
      } = this.eventManagers[t];
      return s ? Promise.resolve(s) : (vt(i, "If manager is not set, promise should be"), i);
    }
    const r = this.initAndGetManager(e);
    return this.eventManagers[t] = {
      promise: r
    }, r.catch(() => {
      delete this.eventManagers[t];
    }), r;
  }
  async initAndGetManager(e) {
    const t = await dE(e),
      r = new XI(e);
    return t.register("authEvent", s => (j(s?.authEvent, e, "invalid-auth-event"), {
      status: r.onEvent(s.authEvent) ? "ACK" : "ERROR"
    }), gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER), this.eventManagers[e._key()] = {
      manager: r
    }, this.iframes[e._key()] = t, r;
  }
  _isIframeWebStorageSupported(e, t) {
    this.iframes[e._key()].send(Ia, {
      type: Ia
    }, s => {
      const i = s?.[0]?.[Ia];
      i !== void 0 && t(!!i), He(e, "internal-error");
    }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
  }
  _originValidation(e) {
    const t = e._key();
    return this.originValidationPromises[t] || (this.originValidationPromises[t] = tE(e)), this.originValidationPromises[t];
  }
  get _shouldInitProactively() {
    return uf() || nf() || vc();
  }
}
const RE = AE;
var nh = "@firebase/auth";
var rh = "1.11.1";
class bE {
  constructor(e) {
    this.auth = e, this.internalListeners = new Map();
  }
  getUid() {
    return this.assertAuthConfigured(), this.auth.currentUser?.uid || null;
  }
  async getToken(e) {
    return this.assertAuthConfigured(), await this.auth._initializationPromise, this.auth.currentUser ? {
      accessToken: await this.auth.currentUser.getIdToken(e)
    } : null;
  }
  addAuthTokenListener(e) {
    if (this.assertAuthConfigured(), this.internalListeners.has(e)) return;
    const t = this.auth.onIdTokenChanged(r => {
      e(r?.stsTokenManager.accessToken || null);
    });
    this.internalListeners.set(e, t), this.updateProactiveRefresh();
  }
  removeAuthTokenListener(e) {
    this.assertAuthConfigured();
    const t = this.internalListeners.get(e);
    t && (this.internalListeners.delete(e), t(), this.updateProactiveRefresh());
  }
  assertAuthConfigured() {
    j(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth");
  }
  updateProactiveRefresh() {
    this.internalListeners.size > 0 ? this.auth._startProactiveRefresh() : this.auth._stopProactiveRefresh();
  }
}
function PE(n) {
  switch (n) {
    case "Node":
      return "node";
    case "ReactNative":
      return "rn";
    case "Worker":
      return "webworker";
    case "Cordova":
      return "cordova";
    case "WebExtension":
      return "web-extension";
    default:
      return;
  }
}
function SE(n) {
  Pn(new Xt("auth", (e, {
    options: t
  }) => {
    const r = e.getProvider("app").getImmediate(),
      s = e.getProvider("heartbeat"),
      i = e.getProvider("app-check-internal"),
      {
        apiKey: o,
        authDomain: c
      } = r.options;
    j(o && !o.includes(":"), "invalid-api-key", {
      appName: r.name
    });
    const u = {
        apiKey: o,
        authDomain: c,
        clientPlatform: n,
        apiHost: "identitytoolkit.googleapis.com",
        tokenApiHost: "securetoken.googleapis.com",
        apiScheme: "https",
        sdkClientVersion: lf(n)
      },
      h = new zy(r, s, i, u);
    return Zy(h, t), h;
  }, "PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e, t, r) => {
    e.getProvider("auth-internal").initialize();
  })), Pn(new Xt("auth-internal", e => {
    const t = Ct(e.getProvider("auth").getImmediate());
    return (r => new bE(r))(t);
  }, "PRIVATE").setInstantiationMode("EXPLICIT")), ot(nh, rh, PE(n)), ot(nh, rh, "esm2020");
}
const CE = 300;
Kg("authIdTokenMaxAge");
function VE() {
  return document.getElementsByTagName("head")?.[0] ?? document;
}
$y({
  loadJS(n) {
    return new Promise((e, t) => {
      const r = document.createElement("script");
      r.setAttribute("src", n), r.onload = e, r.onerror = s => {
        const i = Xe("internal-error");
        i.customData = s, t(i);
      }, r.type = "text/javascript", r.charset = "UTF-8", VE().appendChild(r);
    });
  },
  gapiScript: "https://apis.google.com/js/api.js",
  recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
  recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render="
});
SE("Browser");
const bR = Object.freeze(Object.defineProperty({
  __proto__: null,
  ActionCodeURL: fo,
  AuthCredential: ho,
  EmailAuthCredential: ur,
  EmailAuthProvider: Un,
  FacebookAuthProvider: pt,
  GithubAuthProvider: gt,
  GoogleAuthProvider: mt,
  OAuthCredential: Jt,
  TwitterAuthProvider: _t,
  browserLocalPersistence: AI,
  browserPopupRedirectResolver: RE,
  browserSessionPersistence: Tf,
  connectAuthEmulator: eI,
  createUserWithEmailAndPassword: mI,
  deleteUser: TI,
  getIdTokenResult: Jd,
  inMemoryPersistence: La,
  indexedDBLocalPersistence: MI,
  initializeAuth: Yy,
  onAuthStateChanged: II,
  prodErrorMap: Kd,
  reload: Yd,
  signInWithCredential: gf,
  signInWithCustomToken: pI,
  signInWithEmailAndPassword: gI,
  signInWithPopup: qI,
  signOut: EI,
  updatePassword: _I
}, Symbol.toStringTag, {
  value: "Module"
}));
var sh = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
var Kt;
var Cf;
(function () {
  var n;
  function e(E, g) {
    function I() {}
    I.prototype = g.prototype, E.F = g.prototype, E.prototype = new I(), E.prototype.constructor = E, E.D = function (w, T, R) {
      for (var y = Array(arguments.length - 2), Fe = 2; Fe < arguments.length; Fe++) y[Fe - 2] = arguments[Fe];
      return g.prototype[T].apply(w, y);
    };
  }
  function t() {
    this.blockSize = -1;
  }
  function r() {
    this.blockSize = -1, this.blockSize = 64, this.g = Array(4), this.C = Array(this.blockSize), this.o = this.h = 0, this.u();
  }
  e(r, t), r.prototype.u = function () {
    this.g[0] = 1732584193, this.g[1] = 4023233417, this.g[2] = 2562383102, this.g[3] = 271733878, this.o = this.h = 0;
  };
  function s(E, g, I) {
    I || (I = 0);
    const w = Array(16);
    if (typeof g == "string") for (var T = 0; T < 16; ++T) w[T] = g.charCodeAt(I++) | g.charCodeAt(I++) << 8 | g.charCodeAt(I++) << 16 | g.charCodeAt(I++) << 24;else for (T = 0; T < 16; ++T) w[T] = g[I++] | g[I++] << 8 | g[I++] << 16 | g[I++] << 24;
    g = E.g[0], I = E.g[1], T = E.g[2];
    let R = E.g[3],
      y;
    y = g + (R ^ I & (T ^ R)) + w[0] + 3614090360 & 4294967295, g = I + (y << 7 & 4294967295 | y >>> 25), y = R + (T ^ g & (I ^ T)) + w[1] + 3905402710 & 4294967295, R = g + (y << 12 & 4294967295 | y >>> 20), y = T + (I ^ R & (g ^ I)) + w[2] + 606105819 & 4294967295, T = R + (y << 17 & 4294967295 | y >>> 15), y = I + (g ^ T & (R ^ g)) + w[3] + 3250441966 & 4294967295, I = T + (y << 22 & 4294967295 | y >>> 10), y = g + (R ^ I & (T ^ R)) + w[4] + 4118548399 & 4294967295, g = I + (y << 7 & 4294967295 | y >>> 25), y = R + (T ^ g & (I ^ T)) + w[5] + 1200080426 & 4294967295, R = g + (y << 12 & 4294967295 | y >>> 20), y = T + (I ^ R & (g ^ I)) + w[6] + 2821735955 & 4294967295, T = R + (y << 17 & 4294967295 | y >>> 15), y = I + (g ^ T & (R ^ g)) + w[7] + 4249261313 & 4294967295, I = T + (y << 22 & 4294967295 | y >>> 10), y = g + (R ^ I & (T ^ R)) + w[8] + 1770035416 & 4294967295, g = I + (y << 7 & 4294967295 | y >>> 25), y = R + (T ^ g & (I ^ T)) + w[9] + 2336552879 & 4294967295, R = g + (y << 12 & 4294967295 | y >>> 20), y = T + (I ^ R & (g ^ I)) + w[10] + 4294925233 & 4294967295, T = R + (y << 17 & 4294967295 | y >>> 15), y = I + (g ^ T & (R ^ g)) + w[11] + 2304563134 & 4294967295, I = T + (y << 22 & 4294967295 | y >>> 10), y = g + (R ^ I & (T ^ R)) + w[12] + 1804603682 & 4294967295, g = I + (y << 7 & 4294967295 | y >>> 25), y = R + (T ^ g & (I ^ T)) + w[13] + 4254626195 & 4294967295, R = g + (y << 12 & 4294967295 | y >>> 20), y = T + (I ^ R & (g ^ I)) + w[14] + 2792965006 & 4294967295, T = R + (y << 17 & 4294967295 | y >>> 15), y = I + (g ^ T & (R ^ g)) + w[15] + 1236535329 & 4294967295, I = T + (y << 22 & 4294967295 | y >>> 10), y = g + (T ^ R & (I ^ T)) + w[1] + 4129170786 & 4294967295, g = I + (y << 5 & 4294967295 | y >>> 27), y = R + (I ^ T & (g ^ I)) + w[6] + 3225465664 & 4294967295, R = g + (y << 9 & 4294967295 | y >>> 23), y = T + (g ^ I & (R ^ g)) + w[11] + 643717713 & 4294967295, T = R + (y << 14 & 4294967295 | y >>> 18), y = I + (R ^ g & (T ^ R)) + w[0] + 3921069994 & 4294967295, I = T + (y << 20 & 4294967295 | y >>> 12), y = g + (T ^ R & (I ^ T)) + w[5] + 3593408605 & 4294967295, g = I + (y << 5 & 4294967295 | y >>> 27), y = R + (I ^ T & (g ^ I)) + w[10] + 38016083 & 4294967295, R = g + (y << 9 & 4294967295 | y >>> 23), y = T + (g ^ I & (R ^ g)) + w[15] + 3634488961 & 4294967295, T = R + (y << 14 & 4294967295 | y >>> 18), y = I + (R ^ g & (T ^ R)) + w[4] + 3889429448 & 4294967295, I = T + (y << 20 & 4294967295 | y >>> 12), y = g + (T ^ R & (I ^ T)) + w[9] + 568446438 & 4294967295, g = I + (y << 5 & 4294967295 | y >>> 27), y = R + (I ^ T & (g ^ I)) + w[14] + 3275163606 & 4294967295, R = g + (y << 9 & 4294967295 | y >>> 23), y = T + (g ^ I & (R ^ g)) + w[3] + 4107603335 & 4294967295, T = R + (y << 14 & 4294967295 | y >>> 18), y = I + (R ^ g & (T ^ R)) + w[8] + 1163531501 & 4294967295, I = T + (y << 20 & 4294967295 | y >>> 12), y = g + (T ^ R & (I ^ T)) + w[13] + 2850285829 & 4294967295, g = I + (y << 5 & 4294967295 | y >>> 27), y = R + (I ^ T & (g ^ I)) + w[2] + 4243563512 & 4294967295, R = g + (y << 9 & 4294967295 | y >>> 23), y = T + (g ^ I & (R ^ g)) + w[7] + 1735328473 & 4294967295, T = R + (y << 14 & 4294967295 | y >>> 18), y = I + (R ^ g & (T ^ R)) + w[12] + 2368359562 & 4294967295, I = T + (y << 20 & 4294967295 | y >>> 12), y = g + (I ^ T ^ R) + w[5] + 4294588738 & 4294967295, g = I + (y << 4 & 4294967295 | y >>> 28), y = R + (g ^ I ^ T) + w[8] + 2272392833 & 4294967295, R = g + (y << 11 & 4294967295 | y >>> 21), y = T + (R ^ g ^ I) + w[11] + 1839030562 & 4294967295, T = R + (y << 16 & 4294967295 | y >>> 16), y = I + (T ^ R ^ g) + w[14] + 4259657740 & 4294967295, I = T + (y << 23 & 4294967295 | y >>> 9), y = g + (I ^ T ^ R) + w[1] + 2763975236 & 4294967295, g = I + (y << 4 & 4294967295 | y >>> 28), y = R + (g ^ I ^ T) + w[4] + 1272893353 & 4294967295, R = g + (y << 11 & 4294967295 | y >>> 21), y = T + (R ^ g ^ I) + w[7] + 4139469664 & 4294967295, T = R + (y << 16 & 4294967295 | y >>> 16), y = I + (T ^ R ^ g) + w[10] + 3200236656 & 4294967295, I = T + (y << 23 & 4294967295 | y >>> 9), y = g + (I ^ T ^ R) + w[13] + 681279174 & 4294967295, g = I + (y << 4 & 4294967295 | y >>> 28), y = R + (g ^ I ^ T) + w[0] + 3936430074 & 4294967295, R = g + (y << 11 & 4294967295 | y >>> 21), y = T + (R ^ g ^ I) + w[3] + 3572445317 & 4294967295, T = R + (y << 16 & 4294967295 | y >>> 16), y = I + (T ^ R ^ g) + w[6] + 76029189 & 4294967295, I = T + (y << 23 & 4294967295 | y >>> 9), y = g + (I ^ T ^ R) + w[9] + 3654602809 & 4294967295, g = I + (y << 4 & 4294967295 | y >>> 28), y = R + (g ^ I ^ T) + w[12] + 3873151461 & 4294967295, R = g + (y << 11 & 4294967295 | y >>> 21), y = T + (R ^ g ^ I) + w[15] + 530742520 & 4294967295, T = R + (y << 16 & 4294967295 | y >>> 16), y = I + (T ^ R ^ g) + w[2] + 3299628645 & 4294967295, I = T + (y << 23 & 4294967295 | y >>> 9), y = g + (T ^ (I | ~R)) + w[0] + 4096336452 & 4294967295, g = I + (y << 6 & 4294967295 | y >>> 26), y = R + (I ^ (g | ~T)) + w[7] + 1126891415 & 4294967295, R = g + (y << 10 & 4294967295 | y >>> 22), y = T + (g ^ (R | ~I)) + w[14] + 2878612391 & 4294967295, T = R + (y << 15 & 4294967295 | y >>> 17), y = I + (R ^ (T | ~g)) + w[5] + 4237533241 & 4294967295, I = T + (y << 21 & 4294967295 | y >>> 11), y = g + (T ^ (I | ~R)) + w[12] + 1700485571 & 4294967295, g = I + (y << 6 & 4294967295 | y >>> 26), y = R + (I ^ (g | ~T)) + w[3] + 2399980690 & 4294967295, R = g + (y << 10 & 4294967295 | y >>> 22), y = T + (g ^ (R | ~I)) + w[10] + 4293915773 & 4294967295, T = R + (y << 15 & 4294967295 | y >>> 17), y = I + (R ^ (T | ~g)) + w[1] + 2240044497 & 4294967295, I = T + (y << 21 & 4294967295 | y >>> 11), y = g + (T ^ (I | ~R)) + w[8] + 1873313359 & 4294967295, g = I + (y << 6 & 4294967295 | y >>> 26), y = R + (I ^ (g | ~T)) + w[15] + 4264355552 & 4294967295, R = g + (y << 10 & 4294967295 | y >>> 22), y = T + (g ^ (R | ~I)) + w[6] + 2734768916 & 4294967295, T = R + (y << 15 & 4294967295 | y >>> 17), y = I + (R ^ (T | ~g)) + w[13] + 1309151649 & 4294967295, I = T + (y << 21 & 4294967295 | y >>> 11), y = g + (T ^ (I | ~R)) + w[4] + 4149444226 & 4294967295, g = I + (y << 6 & 4294967295 | y >>> 26), y = R + (I ^ (g | ~T)) + w[11] + 3174756917 & 4294967295, R = g + (y << 10 & 4294967295 | y >>> 22), y = T + (g ^ (R | ~I)) + w[2] + 718787259 & 4294967295, T = R + (y << 15 & 4294967295 | y >>> 17), y = I + (R ^ (T | ~g)) + w[9] + 3951481745 & 4294967295, E.g[0] = E.g[0] + g & 4294967295, E.g[1] = E.g[1] + (T + (y << 21 & 4294967295 | y >>> 11)) & 4294967295, E.g[2] = E.g[2] + T & 4294967295, E.g[3] = E.g[3] + R & 4294967295;
  }
  r.prototype.v = function (E, g) {
    g === void 0 && (g = E.length);
    const I = g - this.blockSize,
      w = this.C;
    let T = this.h,
      R = 0;
    for (; R < g;) {
      if (T == 0) for (; R <= I;) s(this, E, R), R += this.blockSize;
      if (typeof E == "string") {
        for (; R < g;) if (w[T++] = E.charCodeAt(R++), T == this.blockSize) {
          s(this, w), T = 0;
          break;
        }
      } else for (; R < g;) if (w[T++] = E[R++], T == this.blockSize) {
        s(this, w), T = 0;
        break;
      }
    }
    this.h = T, this.o += g;
  }, r.prototype.A = function () {
    var E = Array((this.h < 56 ? this.blockSize : this.blockSize * 2) - this.h);
    E[0] = 128;
    for (var g = 1; g < E.length - 8; ++g) E[g] = 0;
    g = this.o * 8;
    for (var I = E.length - 8; I < E.length; ++I) E[I] = g & 255, g /= 256;
    for (this.v(E), E = Array(16), g = 0, I = 0; I < 4; ++I) for (let w = 0; w < 32; w += 8) E[g++] = this.g[I] >>> w & 255;
    return E;
  };
  function i(E, g) {
    var I = c;
    return Object.prototype.hasOwnProperty.call(I, E) ? I[E] : I[E] = g(E);
  }
  function o(E, g) {
    this.h = g;
    const I = [];
    let w = !0;
    for (let T = E.length - 1; T >= 0; T--) {
      const R = E[T] | 0;
      w && R == g || (I[T] = R, w = !1);
    }
    this.g = I;
  }
  var c = {};
  function u(E) {
    return -128 <= E && E < 128 ? i(E, function (g) {
      return new o([g | 0], g < 0 ? -1 : 0);
    }) : new o([E | 0], E < 0 ? -1 : 0);
  }
  function h(E) {
    if (isNaN(E) || !isFinite(E)) return m;
    if (E < 0) return C(h(-E));
    const g = [];
    let I = 1;
    for (let w = 0; E >= I; w++) g[w] = E / I | 0, I *= 4294967296;
    return new o(g, 0);
  }
  function f(E, g) {
    if (E.length == 0) throw Error("number format error: empty string");
    if (g = g || 10, g < 2 || 36 < g) throw Error("radix out of range: " + g);
    if (E.charAt(0) == "-") return C(f(E.substring(1), g));
    if (E.indexOf("-") >= 0) throw Error('number format error: interior "-" character');
    const I = h(Math.pow(g, 8));
    let w = m;
    for (let R = 0; R < E.length; R += 8) {
      var T = Math.min(8, E.length - R);
      const y = parseInt(E.substring(R, R + T), g);
      T < 8 ? (T = h(Math.pow(g, T)), w = w.j(T).add(h(y))) : (w = w.j(I), w = w.add(h(y)));
    }
    return w;
  }
  var m = u(0),
    _ = u(1),
    b = u(16777216);
  n = o.prototype, n.m = function () {
    if (N(this)) return -C(this).m();
    let E = 0,
      g = 1;
    for (let I = 0; I < this.g.length; I++) {
      const w = this.i(I);
      E += (w >= 0 ? w : 4294967296 + w) * g, g *= 4294967296;
    }
    return E;
  }, n.toString = function (E) {
    if (E = E || 10, E < 2 || 36 < E) throw Error("radix out of range: " + E);
    if (V(this)) return "0";
    if (N(this)) return "-" + C(this).toString(E);
    const g = h(Math.pow(E, 6));
    var I = this;
    let w = "";
    for (;;) {
      const T = G(I, g).g;
      I = q(I, T.j(g));
      let R = ((I.g.length > 0 ? I.g[0] : I.h) >>> 0).toString(E);
      if (I = T, V(I)) return R + w;
      for (; R.length < 6;) R = "0" + R;
      w = R + w;
    }
  }, n.i = function (E) {
    return E < 0 ? 0 : E < this.g.length ? this.g[E] : this.h;
  };
  function V(E) {
    if (E.h != 0) return !1;
    for (let g = 0; g < E.g.length; g++) if (E.g[g] != 0) return !1;
    return !0;
  }
  function N(E) {
    return E.h == -1;
  }
  n.l = function (E) {
    return E = q(this, E), N(E) ? -1 : V(E) ? 0 : 1;
  };
  function C(E) {
    const g = E.g.length,
      I = [];
    for (let w = 0; w < g; w++) I[w] = ~E.g[w];
    return new o(I, ~E.h).add(_);
  }
  n.abs = function () {
    return N(this) ? C(this) : this;
  }, n.add = function (E) {
    const g = Math.max(this.g.length, E.g.length),
      I = [];
    let w = 0;
    for (let T = 0; T <= g; T++) {
      let R = w + (this.i(T) & 65535) + (E.i(T) & 65535),
        y = (R >>> 16) + (this.i(T) >>> 16) + (E.i(T) >>> 16);
      w = y >>> 16, R &= 65535, y &= 65535, I[T] = y << 16 | R;
    }
    return new o(I, I[I.length - 1] & -2147483648 ? -1 : 0);
  };
  function q(E, g) {
    return E.add(C(g));
  }
  n.j = function (E) {
    if (V(this) || V(E)) return m;
    if (N(this)) return N(E) ? C(this).j(C(E)) : C(C(this).j(E));
    if (N(E)) return C(this.j(C(E)));
    if (this.l(b) < 0 && E.l(b) < 0) return h(this.m() * E.m());
    const g = this.g.length + E.g.length,
      I = [];
    for (var w = 0; w < 2 * g; w++) I[w] = 0;
    for (w = 0; w < this.g.length; w++) for (let T = 0; T < E.g.length; T++) {
      const R = this.i(w) >>> 16,
        y = this.i(w) & 65535,
        Fe = E.i(T) >>> 16,
        on = E.i(T) & 65535;
      I[2 * w + 2 * T] += y * on, U(I, 2 * w + 2 * T), I[2 * w + 2 * T + 1] += R * on, U(I, 2 * w + 2 * T + 1), I[2 * w + 2 * T + 1] += y * Fe, U(I, 2 * w + 2 * T + 1), I[2 * w + 2 * T + 2] += R * Fe, U(I, 2 * w + 2 * T + 2);
    }
    for (E = 0; E < g; E++) I[E] = I[2 * E + 1] << 16 | I[2 * E];
    for (E = g; E < 2 * g; E++) I[E] = 0;
    return new o(I, 0);
  };
  function U(E, g) {
    for (; (E[g] & 65535) != E[g];) E[g + 1] += E[g] >>> 16, E[g] &= 65535, g++;
  }
  function M(E, g) {
    this.g = E, this.h = g;
  }
  function G(E, g) {
    if (V(g)) throw Error("division by zero");
    if (V(E)) return new M(m, m);
    if (N(E)) return g = G(C(E), g), new M(C(g.g), C(g.h));
    if (N(g)) return g = G(E, C(g)), new M(C(g.g), g.h);
    if (E.g.length > 30) {
      if (N(E) || N(g)) throw Error("slowDivide_ only works with positive integers.");
      for (var I = _, w = g; w.l(E) <= 0;) I = Q(I), w = Q(w);
      var T = W(I, 1),
        R = W(w, 1);
      for (w = W(w, 2), I = W(I, 2); !V(w);) {
        var y = R.add(w);
        y.l(E) <= 0 && (T = T.add(I), R = y), w = W(w, 1), I = W(I, 1);
      }
      return g = q(E, T.j(g)), new M(T, g);
    }
    for (T = m; E.l(g) >= 0;) {
      for (I = Math.max(1, Math.floor(E.m() / g.m())), w = Math.ceil(Math.log(I) / Math.LN2), w = w <= 48 ? 1 : Math.pow(2, w - 48), R = h(I), y = R.j(g); N(y) || y.l(E) > 0;) I -= w, R = h(I), y = R.j(g);
      V(R) && (R = _), T = T.add(R), E = q(E, y);
    }
    return new M(T, E);
  }
  n.B = function (E) {
    return G(this, E).h;
  }, n.and = function (E) {
    const g = Math.max(this.g.length, E.g.length),
      I = [];
    for (let w = 0; w < g; w++) I[w] = this.i(w) & E.i(w);
    return new o(I, this.h & E.h);
  }, n.or = function (E) {
    const g = Math.max(this.g.length, E.g.length),
      I = [];
    for (let w = 0; w < g; w++) I[w] = this.i(w) | E.i(w);
    return new o(I, this.h | E.h);
  }, n.xor = function (E) {
    const g = Math.max(this.g.length, E.g.length),
      I = [];
    for (let w = 0; w < g; w++) I[w] = this.i(w) ^ E.i(w);
    return new o(I, this.h ^ E.h);
  };
  function Q(E) {
    const g = E.g.length + 1,
      I = [];
    for (let w = 0; w < g; w++) I[w] = E.i(w) << 1 | E.i(w - 1) >>> 31;
    return new o(I, E.h);
  }
  function W(E, g) {
    const I = g >> 5;
    g %= 32;
    const w = E.g.length - I,
      T = [];
    for (let R = 0; R < w; R++) T[R] = g > 0 ? E.i(R + I) >>> g | E.i(R + I + 1) << 32 - g : E.i(R + I);
    return new o(T, E.h);
  }
  r.prototype.digest = r.prototype.A, r.prototype.reset = r.prototype.u, r.prototype.update = r.prototype.v, Cf = r, o.prototype.add = o.prototype.add, o.prototype.multiply = o.prototype.j, o.prototype.modulo = o.prototype.B, o.prototype.compare = o.prototype.l, o.prototype.toNumber = o.prototype.m, o.prototype.toString = o.prototype.toString, o.prototype.getBits = o.prototype.i, o.fromNumber = h, o.fromString = f, Kt = o;
}).apply(typeof sh < "u" ? sh : typeof self < "u" ? self : typeof window < "u" ? window : {});
var hi = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
var Vf;
var es;
var kf;
var Ai;
var Ba;
var Df;
var Nf;
var xf;
(function () {
  var n,
    e = Object.defineProperty;
  function t(a) {
    a = [typeof globalThis == "object" && globalThis, a, typeof window == "object" && window, typeof self == "object" && self, typeof hi == "object" && hi];
    for (var l = 0; l < a.length; ++l) {
      var d = a[l];
      if (d && d.Math == Math) return d;
    }
    throw Error("Cannot find global object");
  }
  var r = t(this);
  function s(a, l) {
    if (l) e: {
      var d = r;
      a = a.split(".");
      for (var p = 0; p < a.length - 1; p++) {
        var A = a[p];
        if (!(A in d)) break e;
        d = d[A];
      }
      a = a[a.length - 1], p = d[a], l = l(p), l != p && l != null && e(d, a, {
        configurable: !0,
        writable: !0,
        value: l
      });
    }
  }
  s("Symbol.dispose", function (a) {
    return a || Symbol("Symbol.dispose");
  }), s("Array.prototype.values", function (a) {
    return a || function () {
      return this[Symbol.iterator]();
    };
  }), s("Object.entries", function (a) {
    return a || function (l) {
      var d = [],
        p;
      for (p in l) Object.prototype.hasOwnProperty.call(l, p) && d.push([p, l[p]]);
      return d;
    };
  });
  var i = i || {},
    o = this || self;
  function c(a) {
    var l = typeof a;
    return l == "object" && a != null || l == "function";
  }
  function u(a, l, d) {
    return a.call.apply(a.bind, arguments);
  }
  function h(a, l, d) {
    return h = u, h.apply(null, arguments);
  }
  function f(a, l) {
    var d = Array.prototype.slice.call(arguments, 1);
    return function () {
      var p = d.slice();
      return p.push.apply(p, arguments), a.apply(this, p);
    };
  }
  function m(a, l) {
    function d() {}
    d.prototype = l.prototype, a.Z = l.prototype, a.prototype = new d(), a.prototype.constructor = a, a.Ob = function (p, A, P) {
      for (var x = Array(arguments.length - 2), K = 2; K < arguments.length; K++) x[K - 2] = arguments[K];
      return l.prototype[A].apply(p, x);
    };
  }
  var _ = typeof AsyncContext < "u" && typeof AsyncContext.Snapshot == "function" ? a => a && AsyncContext.Snapshot.wrap(a) : a => a;
  function b(a) {
    const l = a.length;
    if (l > 0) {
      const d = Array(l);
      for (let p = 0; p < l; p++) d[p] = a[p];
      return d;
    }
    return [];
  }
  function V(a, l) {
    for (let p = 1; p < arguments.length; p++) {
      const A = arguments[p];
      var d = typeof A;
      if (d = d != "object" ? d : A ? Array.isArray(A) ? "array" : d : "null", d == "array" || d == "object" && typeof A.length == "number") {
        d = a.length || 0;
        const P = A.length || 0;
        a.length = d + P;
        for (let x = 0; x < P; x++) a[d + x] = A[x];
      } else a.push(A);
    }
  }
  class N {
    constructor(l, d) {
      this.i = l, this.j = d, this.h = 0, this.g = null;
    }
    get() {
      let l;
      return this.h > 0 ? (this.h--, l = this.g, this.g = l.next, l.next = null) : l = this.i(), l;
    }
  }
  function C(a) {
    o.setTimeout(() => {
      throw a;
    }, 0);
  }
  function q() {
    var a = E;
    let l = null;
    return a.g && (l = a.g, a.g = a.g.next, a.g || (a.h = null), l.next = null), l;
  }
  class U {
    constructor() {
      this.h = this.g = null;
    }
    add(l, d) {
      const p = M.get();
      p.set(l, d), this.h ? this.h.next = p : this.g = p, this.h = p;
    }
  }
  var M = new N(() => new G(), a => a.reset());
  class G {
    constructor() {
      this.next = this.g = this.h = null;
    }
    set(l, d) {
      this.h = l, this.g = d, this.next = null;
    }
    reset() {
      this.next = this.g = this.h = null;
    }
  }
  let Q,
    W = !1,
    E = new U(),
    g = () => {
      const a = Promise.resolve(void 0);
      Q = () => {
        a.then(I);
      };
    };
  function I() {
    for (var a; a = q();) {
      try {
        a.h.call(a.g);
      } catch (d) {
        C(d);
      }
      var l = M;
      l.j(a), l.h < 100 && (l.h++, a.next = l.g, l.g = a);
    }
    W = !1;
  }
  function w() {
    this.u = this.u, this.C = this.C;
  }
  w.prototype.u = !1, w.prototype.dispose = function () {
    this.u || (this.u = !0, this.N());
  }, w.prototype[Symbol.dispose] = function () {
    this.dispose();
  }, w.prototype.N = function () {
    if (this.C) for (; this.C.length;) this.C.shift()();
  };
  function T(a, l) {
    this.type = a, this.g = this.target = l, this.defaultPrevented = !1;
  }
  T.prototype.h = function () {
    this.defaultPrevented = !0;
  };
  var R = function () {
    if (!o.addEventListener || !Object.defineProperty) return !1;
    var a = !1,
      l = Object.defineProperty({}, "passive", {
        get: function () {
          a = !0;
        }
      });
    try {
      const d = () => {};
      o.addEventListener("test", d, l), o.removeEventListener("test", d, l);
    } catch {}
    return a;
  }();
  function y(a) {
    return /^[\s\xa0]*$/.test(a);
  }
  function Fe(a, l) {
    T.call(this, a ? a.type : ""), this.relatedTarget = this.g = this.target = null, this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0, this.key = "", this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1, this.state = null, this.pointerId = 0, this.pointerType = "", this.i = null, a && this.init(a, l);
  }
  m(Fe, T), Fe.prototype.init = function (a, l) {
    const d = this.type = a.type,
      p = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
    this.target = a.target || a.srcElement, this.g = l, l = a.relatedTarget, l || (d == "mouseover" ? l = a.fromElement : d == "mouseout" && (l = a.toElement)), this.relatedTarget = l, p ? (this.clientX = p.clientX !== void 0 ? p.clientX : p.pageX, this.clientY = p.clientY !== void 0 ? p.clientY : p.pageY, this.screenX = p.screenX || 0, this.screenY = p.screenY || 0) : (this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX, this.clientY = a.clientY !== void 0 ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0), this.button = a.button, this.key = a.key || "", this.ctrlKey = a.ctrlKey, this.altKey = a.altKey, this.shiftKey = a.shiftKey, this.metaKey = a.metaKey, this.pointerId = a.pointerId || 0, this.pointerType = a.pointerType, this.state = a.state, this.i = a, a.defaultPrevented && Fe.Z.h.call(this);
  }, Fe.prototype.h = function () {
    Fe.Z.h.call(this);
    const a = this.i;
    a.preventDefault ? a.preventDefault() : a.returnValue = !1;
  };
  var on = "closure_listenable_" + (Math.random() * 1e6 | 0),
    ig = 0;
  function og(a, l, d, p, A) {
    this.listener = a, this.proxy = null, this.src = l, this.type = d, this.capture = !!p, this.ha = A, this.key = ++ig, this.da = this.fa = !1;
  }
  function Qs(a) {
    a.da = !0, a.listener = null, a.proxy = null, a.src = null, a.ha = null;
  }
  function Xs(a, l, d) {
    for (const p in a) l.call(d, a[p], p, a);
  }
  function ag(a, l) {
    for (const d in a) l.call(void 0, a[d], d, a);
  }
  function Cu(a) {
    const l = {};
    for (const d in a) l[d] = a[d];
    return l;
  }
  const Vu = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
  function ku(a, l) {
    let d, p;
    for (let A = 1; A < arguments.length; A++) {
      p = arguments[A];
      for (d in p) a[d] = p[d];
      for (let P = 0; P < Vu.length; P++) d = Vu[P], Object.prototype.hasOwnProperty.call(p, d) && (a[d] = p[d]);
    }
  }
  function Js(a) {
    this.src = a, this.g = {}, this.h = 0;
  }
  Js.prototype.add = function (a, l, d, p, A) {
    const P = a.toString();
    a = this.g[P], a || (a = this.g[P] = [], this.h++);
    const x = $o(a, l, p, A);
    return x > -1 ? (l = a[x], d || (l.fa = !1)) : (l = new og(l, this.src, P, !!p, A), l.fa = d, a.push(l)), l;
  };
  function zo(a, l) {
    const d = l.type;
    if (d in a.g) {
      var p = a.g[d],
        A = Array.prototype.indexOf.call(p, l, void 0),
        P;
      (P = A >= 0) && Array.prototype.splice.call(p, A, 1), P && (Qs(l), a.g[d].length == 0 && (delete a.g[d], a.h--));
    }
  }
  function $o(a, l, d, p) {
    for (let A = 0; A < a.length; ++A) {
      const P = a[A];
      if (!P.da && P.listener == l && P.capture == !!d && P.ha == p) return A;
    }
    return -1;
  }
  var Go = "closure_lm_" + (Math.random() * 1e6 | 0),
    Ko = {};
  function Du(a, l, d, p, A) {
    if (Array.isArray(l)) {
      for (let P = 0; P < l.length; P++) Du(a, l[P], d, p, A);
      return null;
    }
    return d = Ou(d), a && a[on] ? a.J(l, d, c(p) ? !!p.capture : !1, A) : cg(a, l, d, !1, p, A);
  }
  function cg(a, l, d, p, A, P) {
    if (!l) throw Error("Invalid event type");
    const x = c(A) ? !!A.capture : !!A;
    let K = Wo(a);
    if (K || (a[Go] = K = new Js(a)), d = K.add(l, d, p, x, P), d.proxy) return d;
    if (p = ug(), d.proxy = p, p.src = a, p.listener = d, a.addEventListener) R || (A = x), A === void 0 && (A = !1), a.addEventListener(l.toString(), p, A);else if (a.attachEvent) a.attachEvent(xu(l.toString()), p);else if (a.addListener && a.removeListener) a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");
    return d;
  }
  function ug() {
    function a(d) {
      return l.call(a.src, a.listener, d);
    }
    const l = lg;
    return a;
  }
  function Nu(a, l, d, p, A) {
    if (Array.isArray(l)) for (var P = 0; P < l.length; P++) Nu(a, l[P], d, p, A);else p = c(p) ? !!p.capture : !!p, d = Ou(d), a && a[on] ? (a = a.i, P = String(l).toString(), P in a.g && (l = a.g[P], d = $o(l, d, p, A), d > -1 && (Qs(l[d]), Array.prototype.splice.call(l, d, 1), l.length == 0 && (delete a.g[P], a.h--)))) : a && (a = Wo(a)) && (l = a.g[l.toString()], a = -1, l && (a = $o(l, d, p, A)), (d = a > -1 ? l[a] : null) && Ho(d));
  }
  function Ho(a) {
    if (typeof a != "number" && a && !a.da) {
      var l = a.src;
      if (l && l[on]) zo(l.i, a);else {
        var d = a.type,
          p = a.proxy;
        l.removeEventListener ? l.removeEventListener(d, p, a.capture) : l.detachEvent ? l.detachEvent(xu(d), p) : l.addListener && l.removeListener && l.removeListener(p), (d = Wo(l)) ? (zo(d, a), d.h == 0 && (d.src = null, l[Go] = null)) : Qs(a);
      }
    }
  }
  function xu(a) {
    return a in Ko ? Ko[a] : Ko[a] = "on" + a;
  }
  function lg(a, l) {
    if (a.da) a = !0;else {
      l = new Fe(l, this);
      const d = a.listener,
        p = a.ha || a.src;
      a.fa && Ho(a), a = d.call(p, l);
    }
    return a;
  }
  function Wo(a) {
    return a = a[Go], a instanceof Js ? a : null;
  }
  var Qo = "__closure_events_fn_" + (Math.random() * 1e9 >>> 0);
  function Ou(a) {
    return typeof a == "function" ? a : (a[Qo] || (a[Qo] = function (l) {
      return a.handleEvent(l);
    }), a[Qo]);
  }
  function be() {
    w.call(this), this.i = new Js(this), this.M = this, this.G = null;
  }
  m(be, w), be.prototype[on] = !0, be.prototype.removeEventListener = function (a, l, d, p) {
    Nu(this, a, l, d, p);
  };
  function ke(a, l) {
    var d,
      p = a.G;
    if (p) for (d = []; p; p = p.G) d.push(p);
    if (a = a.M, p = l.type || l, typeof l == "string") l = new T(l, a);else if (l instanceof T) l.target = l.target || a;else {
      var A = l;
      l = new T(p, a), ku(l, A);
    }
    A = !0;
    let P, x;
    if (d) for (x = d.length - 1; x >= 0; x--) P = l.g = d[x], A = Ys(P, p, !0, l) && A;
    if (P = l.g = a, A = Ys(P, p, !0, l) && A, A = Ys(P, p, !1, l) && A, d) for (x = 0; x < d.length; x++) P = l.g = d[x], A = Ys(P, p, !1, l) && A;
  }
  be.prototype.N = function () {
    if (be.Z.N.call(this), this.i) {
      var a = this.i;
      for (const l in a.g) {
        const d = a.g[l];
        for (let p = 0; p < d.length; p++) Qs(d[p]);
        delete a.g[l], a.h--;
      }
    }
    this.G = null;
  }, be.prototype.J = function (a, l, d, p) {
    return this.i.add(String(a), l, !1, d, p);
  }, be.prototype.K = function (a, l, d, p) {
    return this.i.add(String(a), l, !0, d, p);
  };
  function Ys(a, l, d, p) {
    if (l = a.i.g[String(l)], !l) return !0;
    l = l.concat();
    let A = !0;
    for (let P = 0; P < l.length; ++P) {
      const x = l[P];
      if (x && !x.da && x.capture == d) {
        const K = x.listener,
          _e = x.ha || x.src;
        x.fa && zo(a.i, x), A = K.call(_e, p) !== !1 && A;
      }
    }
    return A && !p.defaultPrevented;
  }
  function hg(a, l) {
    if (typeof a != "function") if (a && typeof a.handleEvent == "function") a = h(a.handleEvent, a);else throw Error("Invalid listener argument");
    return Number(l) > 2147483647 ? -1 : o.setTimeout(a, l || 0);
  }
  function Mu(a) {
    a.g = hg(() => {
      a.g = null, a.i && (a.i = !1, Mu(a));
    }, a.l);
    const l = a.h;
    a.h = null, a.m.apply(null, l);
  }
  class dg extends w {
    constructor(l, d) {
      super(), this.m = l, this.l = d, this.h = null, this.i = !1, this.g = null;
    }
    j(l) {
      this.h = arguments, this.g ? this.i = !0 : Mu(this);
    }
    N() {
      super.N(), this.g && (o.clearTimeout(this.g), this.g = null, this.i = !1, this.h = null);
    }
  }
  function Vr(a) {
    w.call(this), this.h = a, this.g = {};
  }
  m(Vr, w);
  var Lu = [];
  function Fu(a) {
    Xs(a.g, function (l, d) {
      this.g.hasOwnProperty(d) && Ho(l);
    }, a), a.g = {};
  }
  Vr.prototype.N = function () {
    Vr.Z.N.call(this), Fu(this);
  }, Vr.prototype.handleEvent = function () {
    throw Error("EventHandler.handleEvent not implemented");
  };
  var Xo = o.JSON.stringify,
    fg = o.JSON.parse,
    pg = class {
      stringify(a) {
        return o.JSON.stringify(a, void 0);
      }
      parse(a) {
        return o.JSON.parse(a, void 0);
      }
    };
  function Uu() {}
  function Bu() {}
  var kr = {
    OPEN: "a",
    hb: "b",
    ERROR: "c",
    tb: "d"
  };
  function Jo() {
    T.call(this, "d");
  }
  m(Jo, T);
  function Yo() {
    T.call(this, "c");
  }
  m(Yo, T);
  var an = {},
    qu = null;
  function Zs() {
    return qu = qu || new be();
  }
  an.Ia = "serverreachability";
  function ju(a) {
    T.call(this, an.Ia, a);
  }
  m(ju, T);
  function Dr(a) {
    const l = Zs();
    ke(l, new ju(l));
  }
  an.STAT_EVENT = "statevent";
  function zu(a, l) {
    T.call(this, an.STAT_EVENT, a), this.stat = l;
  }
  m(zu, T);
  function De(a) {
    const l = Zs();
    ke(l, new zu(l, a));
  }
  an.Ja = "timingevent";
  function $u(a, l) {
    T.call(this, an.Ja, a), this.size = l;
  }
  m($u, T);
  function Nr(a, l) {
    if (typeof a != "function") throw Error("Fn must not be null and must be a function");
    return o.setTimeout(function () {
      a();
    }, l);
  }
  function xr() {
    this.g = !0;
  }
  xr.prototype.ua = function () {
    this.g = !1;
  };
  function mg(a, l, d, p, A, P) {
    a.info(function () {
      if (a.g) {
        if (P) {
          var x = "",
            K = P.split("&");
          for (let re = 0; re < K.length; re++) {
            var _e = K[re].split("=");
            if (_e.length > 1) {
              const Te = _e[0];
              _e = _e[1];
              const tt = Te.split("_");
              x = tt.length >= 2 && tt[1] == "type" ? x + (Te + "=" + _e + "&") : x + (Te + "=redacted&");
            }
          }
        } else x = null;
      } else x = P;
      return "XMLHTTP REQ (" + p + ") [attempt " + A + "]: " + l + `
` + d + `
` + x;
    });
  }
  function gg(a, l, d, p, A, P, x) {
    a.info(function () {
      return "XMLHTTP RESP (" + p + ") [ attempt " + A + "]: " + l + `
` + d + `
` + P + " " + x;
    });
  }
  function $n(a, l, d, p) {
    a.info(function () {
      return "XMLHTTP TEXT (" + l + "): " + yg(a, d) + (p ? " " + p : "");
    });
  }
  function _g(a, l) {
    a.info(function () {
      return "TIMEOUT: " + l;
    });
  }
  xr.prototype.info = function () {};
  function yg(a, l) {
    if (!a.g) return l;
    if (!l) return null;
    try {
      const P = JSON.parse(l);
      if (P) {
        for (a = 0; a < P.length; a++) if (Array.isArray(P[a])) {
          var d = P[a];
          if (!(d.length < 2)) {
            var p = d[1];
            if (Array.isArray(p) && !(p.length < 1)) {
              var A = p[0];
              if (A != "noop" && A != "stop" && A != "close") for (let x = 1; x < p.length; x++) p[x] = "";
            }
          }
        }
      }
      return Xo(P);
    } catch {
      return l;
    }
  }
  var ei = {
      NO_ERROR: 0,
      cb: 1,
      qb: 2,
      pb: 3,
      kb: 4,
      ob: 5,
      rb: 6,
      Ga: 7,
      TIMEOUT: 8,
      ub: 9
    },
    Gu = {
      ib: "complete",
      Fb: "success",
      ERROR: "error",
      Ga: "abort",
      xb: "ready",
      yb: "readystatechange",
      TIMEOUT: "timeout",
      sb: "incrementaldata",
      wb: "progress",
      lb: "downloadprogress",
      Nb: "uploadprogress"
    },
    Ku;
  function Zo() {}
  m(Zo, Uu), Zo.prototype.g = function () {
    return new XMLHttpRequest();
  }, Ku = new Zo();
  function Or(a) {
    return encodeURIComponent(String(a));
  }
  function Ig(a) {
    var l = 1;
    a = a.split(":");
    const d = [];
    for (; l > 0 && a.length;) d.push(a.shift()), l--;
    return a.length && d.push(a.join(":")), d;
  }
  function Dt(a, l, d, p) {
    this.j = a, this.i = l, this.l = d, this.S = p || 1, this.V = new Vr(this), this.H = 45e3, this.J = null, this.o = !1, this.u = this.B = this.A = this.M = this.F = this.T = this.D = null, this.G = [], this.g = null, this.C = 0, this.m = this.v = null, this.X = -1, this.K = !1, this.P = 0, this.O = null, this.W = this.L = this.U = this.R = !1, this.h = new Hu();
  }
  function Hu() {
    this.i = null, this.g = "", this.h = !1;
  }
  var Wu = {},
    ea = {};
  function ta(a, l, d) {
    a.M = 1, a.A = ni(et(l)), a.u = d, a.R = !0, Qu(a, null);
  }
  function Qu(a, l) {
    a.F = Date.now(), ti(a), a.B = et(a.A);
    var d = a.B,
      p = a.S;
    Array.isArray(p) || (p = [String(p)]), cl(d.i, "t", p), a.C = 0, d = a.j.L, a.h = new Hu(), a.g = bl(a.j, d ? l : null, !a.u), a.P > 0 && (a.O = new dg(h(a.Y, a, a.g), a.P)), l = a.V, d = a.g, p = a.ba;
    var A = "readystatechange";
    Array.isArray(A) || (A && (Lu[0] = A.toString()), A = Lu);
    for (let P = 0; P < A.length; P++) {
      const x = Du(d, A[P], p || l.handleEvent, !1, l.h || l);
      if (!x) break;
      l.g[x.key] = x;
    }
    l = a.J ? Cu(a.J) : {}, a.u ? (a.v || (a.v = "POST"), l["Content-Type"] = "application/x-www-form-urlencoded", a.g.ea(a.B, a.v, a.u, l)) : (a.v = "GET", a.g.ea(a.B, a.v, null, l)), Dr(), mg(a.i, a.v, a.B, a.l, a.S, a.u);
  }
  Dt.prototype.ba = function (a) {
    a = a.target;
    const l = this.O;
    l && Ot(a) == 3 ? l.j() : this.Y(a);
  }, Dt.prototype.Y = function (a) {
    try {
      if (a == this.g) e: {
        const K = Ot(this.g),
          _e = this.g.ya(),
          re = this.g.ca();
        if (!(K < 3) && (K != 3 || this.g && (this.h.h || this.g.la() || ml(this.g)))) {
          this.K || K != 4 || _e == 7 || (_e == 8 || re <= 0 ? Dr(3) : Dr(2)), na(this);
          var l = this.g.ca();
          this.X = l;
          var d = Eg(this);
          if (this.o = l == 200, gg(this.i, this.v, this.B, this.l, this.S, K, l), this.o) {
            if (this.U && !this.L) {
              t: {
                if (this.g) {
                  var p,
                    A = this.g;
                  if ((p = A.g ? A.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !y(p)) {
                    var P = p;
                    break t;
                  }
                }
                P = null;
              }
              if (a = P) $n(this.i, this.l, a, "Initial handshake response via X-HTTP-Initial-Response"), this.L = !0, ra(this, a);else {
                this.o = !1, this.m = 3, De(12), cn(this), Mr(this);
                break e;
              }
            }
            if (this.R) {
              a = !0;
              let Te;
              for (; !this.K && this.C < d.length;) if (Te = Tg(this, d), Te == ea) {
                K == 4 && (this.m = 4, De(14), a = !1), $n(this.i, this.l, null, "[Incomplete Response]");
                break;
              } else if (Te == Wu) {
                this.m = 4, De(15), $n(this.i, this.l, d, "[Invalid Chunk]"), a = !1;
                break;
              } else $n(this.i, this.l, Te, null), ra(this, Te);
              if (Xu(this) && this.C != 0 && (this.h.g = this.h.g.slice(this.C), this.C = 0), K != 4 || d.length != 0 || this.h.h || (this.m = 1, De(16), a = !1), this.o = this.o && a, !a) $n(this.i, this.l, d, "[Invalid Chunked Response]"), cn(this), Mr(this);else if (d.length > 0 && !this.W) {
                this.W = !0;
                var x = this.j;
                x.g == this && x.aa && !x.P && (x.j.info("Great, no buffering proxy detected. Bytes received: " + d.length), ha(x), x.P = !0, De(11));
              }
            } else $n(this.i, this.l, d, null), ra(this, d);
            K == 4 && cn(this), this.o && !this.K && (K == 4 ? wl(this.j, this) : (this.o = !1, ti(this)));
          } else Og(this.g), l == 400 && d.indexOf("Unknown SID") > 0 ? (this.m = 3, De(12)) : (this.m = 0, De(13)), cn(this), Mr(this);
        }
      }
    } catch {} finally {}
  };
  function Eg(a) {
    if (!Xu(a)) return a.g.la();
    const l = ml(a.g);
    if (l === "") return "";
    let d = "";
    const p = l.length,
      A = Ot(a.g) == 4;
    if (!a.h.i) {
      if (typeof TextDecoder > "u") return cn(a), Mr(a), "";
      a.h.i = new o.TextDecoder();
    }
    for (let P = 0; P < p; P++) a.h.h = !0, d += a.h.i.decode(l[P], {
      stream: !(A && P == p - 1)
    });
    return l.length = 0, a.h.g += d, a.C = 0, a.h.g;
  }
  function Xu(a) {
    return a.g ? a.v == "GET" && a.M != 2 && a.j.Aa : !1;
  }
  function Tg(a, l) {
    var d = a.C,
      p = l.indexOf(`
`, d);
    return p == -1 ? ea : (d = Number(l.substring(d, p)), isNaN(d) ? Wu : (p += 1, p + d > l.length ? ea : (l = l.slice(p, p + d), a.C = p + d, l)));
  }
  Dt.prototype.cancel = function () {
    this.K = !0, cn(this);
  };
  function ti(a) {
    a.T = Date.now() + a.H, Ju(a, a.H);
  }
  function Ju(a, l) {
    if (a.D != null) throw Error("WatchDog timer not null");
    a.D = Nr(h(a.aa, a), l);
  }
  function na(a) {
    a.D && (o.clearTimeout(a.D), a.D = null);
  }
  Dt.prototype.aa = function () {
    this.D = null;
    const a = Date.now();
    a - this.T >= 0 ? (_g(this.i, this.B), this.M != 2 && (Dr(), De(17)), cn(this), this.m = 2, Mr(this)) : Ju(this, this.T - a);
  };
  function Mr(a) {
    a.j.I == 0 || a.K || wl(a.j, a);
  }
  function cn(a) {
    na(a);
    var l = a.O;
    l && typeof l.dispose == "function" && l.dispose(), a.O = null, Fu(a.V), a.g && (l = a.g, a.g = null, l.abort(), l.dispose());
  }
  function ra(a, l) {
    try {
      var d = a.j;
      if (d.I != 0 && (d.g == a || sa(d.h, a))) {
        if (!a.L && sa(d.h, a) && d.I == 3) {
          try {
            var p = d.Ba.g.parse(l);
          } catch {
            p = null;
          }
          if (Array.isArray(p) && p.length == 3) {
            var A = p;
            if (A[0] == 0) {
              e: if (!d.v) {
                if (d.g) if (d.g.F + 3e3 < a.F) ai(d), ii(d);else break e;
                la(d), De(18);
              }
            } else d.xa = A[1], 0 < d.xa - d.K && A[2] < 37500 && d.F && d.A == 0 && !d.C && (d.C = Nr(h(d.Va, d), 6e3));
            el(d.h) <= 1 && d.ta && (d.ta = void 0);
          } else ln(d, 11);
        } else if ((a.L || d.g == a) && ai(d), !y(l)) for (A = d.Ba.g.parse(l), l = 0; l < A.length; l++) {
          let re = A[l];
          const Te = re[0];
          if (!(Te <= d.K)) if (d.K = Te, re = re[1], d.I == 2) {
            if (re[0] == "c") {
              d.M = re[1], d.ba = re[2];
              const tt = re[3];
              tt != null && (d.ka = tt, d.j.info("VER=" + d.ka));
              const hn = re[4];
              hn != null && (d.za = hn, d.j.info("SVER=" + d.za));
              const Mt = re[5];
              Mt != null && typeof Mt == "number" && Mt > 0 && (p = 1.5 * Mt, d.O = p, d.j.info("backChannelRequestTimeoutMs_=" + p)), p = d;
              const Lt = a.g;
              if (Lt) {
                const ui = Lt.g ? Lt.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                if (ui) {
                  var P = p.h;
                  P.g || ui.indexOf("spdy") == -1 && ui.indexOf("quic") == -1 && ui.indexOf("h2") == -1 || (P.j = P.l, P.g = new Set(), P.h && (ia(P, P.h), P.h = null));
                }
                if (p.G) {
                  const da = Lt.g ? Lt.g.getResponseHeader("X-HTTP-Session-Id") : null;
                  da && (p.wa = da, ie(p.J, p.G, da));
                }
              }
              d.I = 3, d.l && d.l.ra(), d.aa && (d.T = Date.now() - a.F, d.j.info("Handshake RTT: " + d.T + "ms")), p = d;
              var x = a;
              if (p.na = Rl(p, p.L ? p.ba : null, p.W), x.L) {
                tl(p.h, x);
                var K = x,
                  _e = p.O;
                _e && (K.H = _e), K.D && (na(K), ti(K)), p.g = x;
              } else El(p);
              d.i.length > 0 && oi(d);
            } else re[0] != "stop" && re[0] != "close" || ln(d, 7);
          } else d.I == 3 && (re[0] == "stop" || re[0] == "close" ? re[0] == "stop" ? ln(d, 7) : ua(d) : re[0] != "noop" && d.l && d.l.qa(re), d.A = 0);
        }
      }
      Dr(4);
    } catch {}
  }
  var wg = class {
    constructor(a, l) {
      this.g = a, this.map = l;
    }
  };
  function Yu(a) {
    this.l = a || 10, o.PerformanceNavigationTiming ? (a = o.performance.getEntriesByType("navigation"), a = a.length > 0 && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(o.chrome && o.chrome.loadTimes && o.chrome.loadTimes() && o.chrome.loadTimes().wasFetchedViaSpdy), this.j = a ? this.l : 1, this.g = null, this.j > 1 && (this.g = new Set()), this.h = null, this.i = [];
  }
  function Zu(a) {
    return a.h ? !0 : a.g ? a.g.size >= a.j : !1;
  }
  function el(a) {
    return a.h ? 1 : a.g ? a.g.size : 0;
  }
  function sa(a, l) {
    return a.h ? a.h == l : a.g ? a.g.has(l) : !1;
  }
  function ia(a, l) {
    a.g ? a.g.add(l) : a.h = l;
  }
  function tl(a, l) {
    a.h && a.h == l ? a.h = null : a.g && a.g.has(l) && a.g.delete(l);
  }
  Yu.prototype.cancel = function () {
    if (this.i = nl(this), this.h) this.h.cancel(), this.h = null;else if (this.g && this.g.size !== 0) {
      for (const a of this.g.values()) a.cancel();
      this.g.clear();
    }
  };
  function nl(a) {
    if (a.h != null) return a.i.concat(a.h.G);
    if (a.g != null && a.g.size !== 0) {
      let l = a.i;
      for (const d of a.g.values()) l = l.concat(d.G);
      return l;
    }
    return b(a.i);
  }
  var rl = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
  function vg(a, l) {
    if (a) {
      a = a.split("&");
      for (let d = 0; d < a.length; d++) {
        const p = a[d].indexOf("=");
        let A,
          P = null;
        p >= 0 ? (A = a[d].substring(0, p), P = a[d].substring(p + 1)) : A = a[d], l(A, P ? decodeURIComponent(P.replace(/\+/g, " ")) : "");
      }
    }
  }
  function Nt(a) {
    this.g = this.o = this.j = "", this.u = null, this.m = this.h = "", this.l = !1;
    let l;
    a instanceof Nt ? (this.l = a.l, Lr(this, a.j), this.o = a.o, this.g = a.g, Fr(this, a.u), this.h = a.h, oa(this, ul(a.i)), this.m = a.m) : a && (l = String(a).match(rl)) ? (this.l = !1, Lr(this, l[1] || "", !0), this.o = Ur(l[2] || ""), this.g = Ur(l[3] || "", !0), Fr(this, l[4]), this.h = Ur(l[5] || "", !0), oa(this, l[6] || "", !0), this.m = Ur(l[7] || "")) : (this.l = !1, this.i = new qr(null, this.l));
  }
  Nt.prototype.toString = function () {
    const a = [];
    var l = this.j;
    l && a.push(Br(l, sl, !0), ":");
    var d = this.g;
    return (d || l == "file") && (a.push("//"), (l = this.o) && a.push(Br(l, sl, !0), "@"), a.push(Or(d).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), d = this.u, d != null && a.push(":", String(d))), (d = this.h) && (this.g && d.charAt(0) != "/" && a.push("/"), a.push(Br(d, d.charAt(0) == "/" ? bg : Rg, !0))), (d = this.i.toString()) && a.push("?", d), (d = this.m) && a.push("#", Br(d, Sg)), a.join("");
  }, Nt.prototype.resolve = function (a) {
    const l = et(this);
    let d = !!a.j;
    d ? Lr(l, a.j) : d = !!a.o, d ? l.o = a.o : d = !!a.g, d ? l.g = a.g : d = a.u != null;
    var p = a.h;
    if (d) Fr(l, a.u);else if (d = !!a.h) {
      if (p.charAt(0) != "/") if (this.g && !this.h) p = "/" + p;else {
        var A = l.h.lastIndexOf("/");
        A != -1 && (p = l.h.slice(0, A + 1) + p);
      }
      if (A = p, A == ".." || A == ".") p = "";else if (A.indexOf("./") != -1 || A.indexOf("/.") != -1) {
        p = A.lastIndexOf("/", 0) == 0, A = A.split("/");
        const P = [];
        for (let x = 0; x < A.length;) {
          const K = A[x++];
          K == "." ? p && x == A.length && P.push("") : K == ".." ? ((P.length > 1 || P.length == 1 && P[0] != "") && P.pop(), p && x == A.length && P.push("")) : (P.push(K), p = !0);
        }
        p = P.join("/");
      } else p = A;
    }
    return d ? l.h = p : d = a.i.toString() !== "", d ? oa(l, ul(a.i)) : d = !!a.m, d && (l.m = a.m), l;
  };
  function et(a) {
    return new Nt(a);
  }
  function Lr(a, l, d) {
    a.j = d ? Ur(l, !0) : l, a.j && (a.j = a.j.replace(/:$/, ""));
  }
  function Fr(a, l) {
    if (l) {
      if (l = Number(l), isNaN(l) || l < 0) throw Error("Bad port number " + l);
      a.u = l;
    } else a.u = null;
  }
  function oa(a, l, d) {
    l instanceof qr ? (a.i = l, Cg(a.i, a.l)) : (d || (l = Br(l, Pg)), a.i = new qr(l, a.l));
  }
  function ie(a, l, d) {
    a.i.set(l, d);
  }
  function ni(a) {
    return ie(a, "zx", Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ Date.now()).toString(36)), a;
  }
  function Ur(a, l) {
    return a ? l ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
  }
  function Br(a, l, d) {
    return typeof a == "string" ? (a = encodeURI(a).replace(l, Ag), d && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
  }
  function Ag(a) {
    return a = a.charCodeAt(0), "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
  }
  var sl = /[#\/\?@]/g,
    Rg = /[#\?:]/g,
    bg = /[#\?]/g,
    Pg = /[#\?@]/g,
    Sg = /#/g;
  function qr(a, l) {
    this.h = this.g = null, this.i = a || null, this.j = !!l;
  }
  function un(a) {
    a.g || (a.g = new Map(), a.h = 0, a.i && vg(a.i, function (l, d) {
      a.add(decodeURIComponent(l.replace(/\+/g, " ")), d);
    }));
  }
  n = qr.prototype, n.add = function (a, l) {
    un(this), this.i = null, a = Gn(this, a);
    let d = this.g.get(a);
    return d || this.g.set(a, d = []), d.push(l), this.h += 1, this;
  };
  function il(a, l) {
    un(a), l = Gn(a, l), a.g.has(l) && (a.i = null, a.h -= a.g.get(l).length, a.g.delete(l));
  }
  function ol(a, l) {
    return un(a), l = Gn(a, l), a.g.has(l);
  }
  n.forEach = function (a, l) {
    un(this), this.g.forEach(function (d, p) {
      d.forEach(function (A) {
        a.call(l, A, p, this);
      }, this);
    }, this);
  };
  function al(a, l) {
    un(a);
    let d = [];
    if (typeof l == "string") ol(a, l) && (d = d.concat(a.g.get(Gn(a, l))));else for (a = Array.from(a.g.values()), l = 0; l < a.length; l++) d = d.concat(a[l]);
    return d;
  }
  n.set = function (a, l) {
    return un(this), this.i = null, a = Gn(this, a), ol(this, a) && (this.h -= this.g.get(a).length), this.g.set(a, [l]), this.h += 1, this;
  }, n.get = function (a, l) {
    return a ? (a = al(this, a), a.length > 0 ? String(a[0]) : l) : l;
  };
  function cl(a, l, d) {
    il(a, l), d.length > 0 && (a.i = null, a.g.set(Gn(a, l), b(d)), a.h += d.length);
  }
  n.toString = function () {
    if (this.i) return this.i;
    if (!this.g) return "";
    const a = [],
      l = Array.from(this.g.keys());
    for (let p = 0; p < l.length; p++) {
      var d = l[p];
      const A = Or(d);
      d = al(this, d);
      for (let P = 0; P < d.length; P++) {
        let x = A;
        d[P] !== "" && (x += "=" + Or(d[P])), a.push(x);
      }
    }
    return this.i = a.join("&");
  };
  function ul(a) {
    const l = new qr();
    return l.i = a.i, a.g && (l.g = new Map(a.g), l.h = a.h), l;
  }
  function Gn(a, l) {
    return l = String(l), a.j && (l = l.toLowerCase()), l;
  }
  function Cg(a, l) {
    l && !a.j && (un(a), a.i = null, a.g.forEach(function (d, p) {
      const A = p.toLowerCase();
      p != A && (il(this, p), cl(this, A, d));
    }, a)), a.j = l;
  }
  function Vg(a, l) {
    const d = new xr();
    if (o.Image) {
      const p = new Image();
      p.onload = f(xt, d, "TestLoadImage: loaded", !0, l, p), p.onerror = f(xt, d, "TestLoadImage: error", !1, l, p), p.onabort = f(xt, d, "TestLoadImage: abort", !1, l, p), p.ontimeout = f(xt, d, "TestLoadImage: timeout", !1, l, p), o.setTimeout(function () {
        p.ontimeout && p.ontimeout();
      }, 1e4), p.src = a;
    } else l(!1);
  }
  function kg(a, l) {
    const d = new xr(),
      p = new AbortController(),
      A = setTimeout(() => {
        p.abort(), xt(d, "TestPingServer: timeout", !1, l);
      }, 1e4);
    fetch(a, {
      signal: p.signal
    }).then(P => {
      clearTimeout(A), P.ok ? xt(d, "TestPingServer: ok", !0, l) : xt(d, "TestPingServer: server error", !1, l);
    }).catch(() => {
      clearTimeout(A), xt(d, "TestPingServer: error", !1, l);
    });
  }
  function xt(a, l, d, p, A) {
    try {
      A && (A.onload = null, A.onerror = null, A.onabort = null, A.ontimeout = null), p(d);
    } catch {}
  }
  function Dg() {
    this.g = new pg();
  }
  function aa(a) {
    this.i = a.Sb || null, this.h = a.ab || !1;
  }
  m(aa, Uu), aa.prototype.g = function () {
    return new ri(this.i, this.h);
  };
  function ri(a, l) {
    be.call(this), this.H = a, this.o = l, this.m = void 0, this.status = this.readyState = 0, this.responseType = this.responseText = this.response = this.statusText = "", this.onreadystatechange = null, this.A = new Headers(), this.h = null, this.F = "GET", this.D = "", this.g = !1, this.B = this.j = this.l = null, this.v = new AbortController();
  }
  m(ri, be), n = ri.prototype, n.open = function (a, l) {
    if (this.readyState != 0) throw this.abort(), Error("Error reopening a connection");
    this.F = a, this.D = l, this.readyState = 1, zr(this);
  }, n.send = function (a) {
    if (this.readyState != 1) throw this.abort(), Error("need to call open() first. ");
    if (this.v.signal.aborted) throw this.abort(), Error("Request was aborted.");
    this.g = !0;
    const l = {
      headers: this.A,
      method: this.F,
      credentials: this.m,
      cache: void 0,
      signal: this.v.signal
    };
    a && (l.body = a), (this.H || o).fetch(new Request(this.D, l)).then(this.Pa.bind(this), this.ga.bind(this));
  }, n.abort = function () {
    this.response = this.responseText = "", this.A = new Headers(), this.status = 0, this.v.abort(), this.j && this.j.cancel("Request was aborted.").catch(() => {}), this.readyState >= 1 && this.g && this.readyState != 4 && (this.g = !1, jr(this)), this.readyState = 0;
  }, n.Pa = function (a) {
    if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, zr(this)), this.g && (this.readyState = 3, zr(this), this.g))) if (this.responseType === "arraybuffer") a.arrayBuffer().then(this.Na.bind(this), this.ga.bind(this));else if (typeof o.ReadableStream < "u" && "body" in a) {
      if (this.j = a.body.getReader(), this.o) {
        if (this.responseType) throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        this.response = [];
      } else this.response = this.responseText = "", this.B = new TextDecoder();
      ll(this);
    } else a.text().then(this.Oa.bind(this), this.ga.bind(this));
  };
  function ll(a) {
    a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a));
  }
  n.Ma = function (a) {
    if (this.g) {
      if (this.o && a.value) this.response.push(a.value);else if (!this.o) {
        var l = a.value ? a.value : new Uint8Array(0);
        (l = this.B.decode(l, {
          stream: !a.done
        })) && (this.response = this.responseText += l);
      }
      a.done ? jr(this) : zr(this), this.readyState == 3 && ll(this);
    }
  }, n.Oa = function (a) {
    this.g && (this.response = this.responseText = a, jr(this));
  }, n.Na = function (a) {
    this.g && (this.response = a, jr(this));
  }, n.ga = function () {
    this.g && jr(this);
  };
  function jr(a) {
    a.readyState = 4, a.l = null, a.j = null, a.B = null, zr(a);
  }
  n.setRequestHeader = function (a, l) {
    this.A.append(a, l);
  }, n.getResponseHeader = function (a) {
    return this.h && this.h.get(a.toLowerCase()) || "";
  }, n.getAllResponseHeaders = function () {
    if (!this.h) return "";
    const a = [],
      l = this.h.entries();
    for (var d = l.next(); !d.done;) d = d.value, a.push(d[0] + ": " + d[1]), d = l.next();
    return a.join(`\r
`);
  };
  function zr(a) {
    a.onreadystatechange && a.onreadystatechange.call(a);
  }
  Object.defineProperty(ri.prototype, "withCredentials", {
    get: function () {
      return this.m === "include";
    },
    set: function (a) {
      this.m = a ? "include" : "same-origin";
    }
  });
  function hl(a) {
    let l = "";
    return Xs(a, function (d, p) {
      l += p, l += ":", l += d, l += `\r
`;
    }), l;
  }
  function ca(a, l, d) {
    e: {
      for (p in d) {
        var p = !1;
        break e;
      }
      p = !0;
    }
    p || (d = hl(d), typeof a == "string" ? d != null && Or(d) : ie(a, l, d));
  }
  function ue(a) {
    be.call(this), this.headers = new Map(), this.L = a || null, this.h = !1, this.g = null, this.D = "", this.o = 0, this.l = "", this.j = this.B = this.v = this.A = !1, this.m = null, this.F = "", this.H = !1;
  }
  m(ue, be);
  var Ng = /^https?$/i,
    xg = ["POST", "PUT"];
  n = ue.prototype, n.Fa = function (a) {
    this.H = a;
  }, n.ea = function (a, l, d, p) {
    if (this.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.D + "; newUri=" + a);
    l = l ? l.toUpperCase() : "GET", this.D = a, this.l = "", this.o = 0, this.A = !1, this.h = !0, this.g = this.L ? this.L.g() : Ku.g(), this.g.onreadystatechange = _(h(this.Ca, this));
    try {
      this.B = !0, this.g.open(l, String(a), !0), this.B = !1;
    } catch (P) {
      dl(this, P);
      return;
    }
    if (a = d || "", d = new Map(this.headers), p) if (Object.getPrototypeOf(p) === Object.prototype) for (var A in p) d.set(A, p[A]);else if (typeof p.keys == "function" && typeof p.get == "function") for (const P of p.keys()) d.set(P, p.get(P));else throw Error("Unknown input type for opt_headers: " + String(p));
    p = Array.from(d.keys()).find(P => P.toLowerCase() == "content-type"), A = o.FormData && a instanceof o.FormData, !(Array.prototype.indexOf.call(xg, l, void 0) >= 0) || p || A || d.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    for (const [P, x] of d) this.g.setRequestHeader(P, x);
    this.F && (this.g.responseType = this.F), "withCredentials" in this.g && this.g.withCredentials !== this.H && (this.g.withCredentials = this.H);
    try {
      this.m && (clearTimeout(this.m), this.m = null), this.v = !0, this.g.send(a), this.v = !1;
    } catch (P) {
      dl(this, P);
    }
  };
  function dl(a, l) {
    a.h = !1, a.g && (a.j = !0, a.g.abort(), a.j = !1), a.l = l, a.o = 5, fl(a), si(a);
  }
  function fl(a) {
    a.A || (a.A = !0, ke(a, "complete"), ke(a, "error"));
  }
  n.abort = function (a) {
    this.g && this.h && (this.h = !1, this.j = !0, this.g.abort(), this.j = !1, this.o = a || 7, ke(this, "complete"), ke(this, "abort"), si(this));
  }, n.N = function () {
    this.g && (this.h && (this.h = !1, this.j = !0, this.g.abort(), this.j = !1), si(this, !0)), ue.Z.N.call(this);
  }, n.Ca = function () {
    this.u || (this.B || this.v || this.j ? pl(this) : this.Xa());
  }, n.Xa = function () {
    pl(this);
  };
  function pl(a) {
    if (a.h && typeof i < "u") {
      if (a.v && Ot(a) == 4) setTimeout(a.Ca.bind(a), 0);else if (ke(a, "readystatechange"), Ot(a) == 4) {
        a.h = !1;
        try {
          const P = a.ca();
          e: switch (P) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var l = !0;
              break e;
            default:
              l = !1;
          }
          var d;
          if (!(d = l)) {
            var p;
            if (p = P === 0) {
              let x = String(a.D).match(rl)[1] || null;
              !x && o.self && o.self.location && (x = o.self.location.protocol.slice(0, -1)), p = !Ng.test(x ? x.toLowerCase() : "");
            }
            d = p;
          }
          if (d) ke(a, "complete"), ke(a, "success");else {
            a.o = 6;
            try {
              var A = Ot(a) > 2 ? a.g.statusText : "";
            } catch {
              A = "";
            }
            a.l = A + " [" + a.ca() + "]", fl(a);
          }
        } finally {
          si(a);
        }
      }
    }
  }
  function si(a, l) {
    if (a.g) {
      a.m && (clearTimeout(a.m), a.m = null);
      const d = a.g;
      a.g = null, l || ke(a, "ready");
      try {
        d.onreadystatechange = null;
      } catch {}
    }
  }
  n.isActive = function () {
    return !!this.g;
  };
  function Ot(a) {
    return a.g ? a.g.readyState : 0;
  }
  n.ca = function () {
    try {
      return Ot(this) > 2 ? this.g.status : -1;
    } catch {
      return -1;
    }
  }, n.la = function () {
    try {
      return this.g ? this.g.responseText : "";
    } catch {
      return "";
    }
  }, n.La = function (a) {
    if (this.g) {
      var l = this.g.responseText;
      return a && l.indexOf(a) == 0 && (l = l.substring(a.length)), fg(l);
    }
  };
  function ml(a) {
    try {
      if (!a.g) return null;
      if ("response" in a.g) return a.g.response;
      switch (a.F) {
        case "":
        case "text":
          return a.g.responseText;
        case "arraybuffer":
          if ("mozResponseArrayBuffer" in a.g) return a.g.mozResponseArrayBuffer;
      }
      return null;
    } catch {
      return null;
    }
  }
  function Og(a) {
    const l = {};
    a = (a.g && Ot(a) >= 2 && a.g.getAllResponseHeaders() || "").split(`\r
`);
    for (let p = 0; p < a.length; p++) {
      if (y(a[p])) continue;
      var d = Ig(a[p]);
      const A = d[0];
      if (d = d[1], typeof d != "string") continue;
      d = d.trim();
      const P = l[A] || [];
      l[A] = P, P.push(d);
    }
    ag(l, function (p) {
      return p.join(", ");
    });
  }
  n.ya = function () {
    return this.o;
  }, n.Ha = function () {
    return typeof this.l == "string" ? this.l : String(this.l);
  };
  function $r(a, l, d) {
    return d && d.internalChannelParams && d.internalChannelParams[a] || l;
  }
  function gl(a) {
    this.za = 0, this.i = [], this.j = new xr(), this.ba = this.na = this.J = this.W = this.g = this.wa = this.G = this.H = this.u = this.U = this.o = null, this.Ya = this.V = 0, this.Sa = $r("failFast", !1, a), this.F = this.C = this.v = this.m = this.l = null, this.X = !0, this.xa = this.K = -1, this.Y = this.A = this.D = 0, this.Qa = $r("baseRetryDelayMs", 5e3, a), this.Za = $r("retryDelaySeedMs", 1e4, a), this.Ta = $r("forwardChannelMaxRetries", 2, a), this.va = $r("forwardChannelRequestTimeoutMs", 2e4, a), this.ma = a && a.xmlHttpFactory || void 0, this.Ua = a && a.Rb || void 0, this.Aa = a && a.useFetchStreams || !1, this.O = void 0, this.L = a && a.supportsCrossDomainXhr || !1, this.M = "", this.h = new Yu(a && a.concurrentRequestLimit), this.Ba = new Dg(), this.S = a && a.fastHandshake || !1, this.R = a && a.encodeInitMessageHeaders || !1, this.S && this.R && (this.R = !1), this.Ra = a && a.Pb || !1, a && a.ua && this.j.ua(), a && a.forceLongPolling && (this.X = !1), this.aa = !this.S && this.X && a && a.detectBufferingProxy || !1, this.ia = void 0, a && a.longPollingTimeout && a.longPollingTimeout > 0 && (this.ia = a.longPollingTimeout), this.ta = void 0, this.T = 0, this.P = !1, this.ja = this.B = null;
  }
  n = gl.prototype, n.ka = 8, n.I = 1, n.connect = function (a, l, d, p) {
    De(0), this.W = a, this.H = l || {}, d && p !== void 0 && (this.H.OSID = d, this.H.OAID = p), this.F = this.X, this.J = Rl(this, null, this.W), oi(this);
  };
  function ua(a) {
    if (_l(a), a.I == 3) {
      var l = a.V++,
        d = et(a.J);
      if (ie(d, "SID", a.M), ie(d, "RID", l), ie(d, "TYPE", "terminate"), Gr(a, d), l = new Dt(a, a.j, l), l.M = 2, l.A = ni(et(d)), d = !1, o.navigator && o.navigator.sendBeacon) try {
        d = o.navigator.sendBeacon(l.A.toString(), "");
      } catch {}
      !d && o.Image && (new Image().src = l.A, d = !0), d || (l.g = bl(l.j, null), l.g.ea(l.A)), l.F = Date.now(), ti(l);
    }
    Al(a);
  }
  function ii(a) {
    a.g && (ha(a), a.g.cancel(), a.g = null);
  }
  function _l(a) {
    ii(a), a.v && (o.clearTimeout(a.v), a.v = null), ai(a), a.h.cancel(), a.m && (typeof a.m == "number" && o.clearTimeout(a.m), a.m = null);
  }
  function oi(a) {
    if (!Zu(a.h) && !a.m) {
      a.m = !0;
      var l = a.Ea;
      Q || g(), W || (Q(), W = !0), E.add(l, a), a.D = 0;
    }
  }
  function Mg(a, l) {
    return el(a.h) >= a.h.j - (a.m ? 1 : 0) ? !1 : a.m ? (a.i = l.G.concat(a.i), !0) : a.I == 1 || a.I == 2 || a.D >= (a.Sa ? 0 : a.Ta) ? !1 : (a.m = Nr(h(a.Ea, a, l), vl(a, a.D)), a.D++, !0);
  }
  n.Ea = function (a) {
    if (this.m) if (this.m = null, this.I == 1) {
      if (!a) {
        this.V = Math.floor(Math.random() * 1e5), a = this.V++;
        const A = new Dt(this, this.j, a);
        let P = this.o;
        if (this.U && (P ? (P = Cu(P), ku(P, this.U)) : P = this.U), this.u !== null || this.R || (A.J = P, P = null), this.S) e: {
          for (var l = 0, d = 0; d < this.i.length; d++) {
            t: {
              var p = this.i[d];
              if ("__data__" in p.map && (p = p.map.__data__, typeof p == "string")) {
                p = p.length;
                break t;
              }
              p = void 0;
            }
            if (p === void 0) break;
            if (l += p, l > 4096) {
              l = d;
              break e;
            }
            if (l === 4096 || d === this.i.length - 1) {
              l = d + 1;
              break e;
            }
          }
          l = 1e3;
        } else l = 1e3;
        l = Il(this, A, l), d = et(this.J), ie(d, "RID", a), ie(d, "CVER", 22), this.G && ie(d, "X-HTTP-Session-Id", this.G), Gr(this, d), P && (this.R ? l = "headers=" + Or(hl(P)) + "&" + l : this.u && ca(d, this.u, P)), ia(this.h, A), this.Ra && ie(d, "TYPE", "init"), this.S ? (ie(d, "$req", l), ie(d, "SID", "null"), A.U = !0, ta(A, d, null)) : ta(A, d, l), this.I = 2;
      }
    } else this.I == 3 && (a ? yl(this, a) : this.i.length == 0 || Zu(this.h) || yl(this));
  };
  function yl(a, l) {
    var d;
    l ? d = l.l : d = a.V++;
    const p = et(a.J);
    ie(p, "SID", a.M), ie(p, "RID", d), ie(p, "AID", a.K), Gr(a, p), a.u && a.o && ca(p, a.u, a.o), d = new Dt(a, a.j, d, a.D + 1), a.u === null && (d.J = a.o), l && (a.i = l.G.concat(a.i)), l = Il(a, d, 1e3), d.H = Math.round(a.va * .5) + Math.round(a.va * .5 * Math.random()), ia(a.h, d), ta(d, p, l);
  }
  function Gr(a, l) {
    a.H && Xs(a.H, function (d, p) {
      ie(l, p, d);
    }), a.l && Xs({}, function (d, p) {
      ie(l, p, d);
    });
  }
  function Il(a, l, d) {
    d = Math.min(a.i.length, d);
    const p = a.l ? h(a.l.Ka, a.l, a) : null;
    e: {
      var A = a.i;
      let K = -1;
      for (;;) {
        const _e = ["count=" + d];
        K == -1 ? d > 0 ? (K = A[0].g, _e.push("ofs=" + K)) : K = 0 : _e.push("ofs=" + K);
        let re = !0;
        for (let Te = 0; Te < d; Te++) {
          var P = A[Te].g;
          const tt = A[Te].map;
          if (P -= K, P < 0) K = Math.max(0, A[Te].g - 100), re = !1;else try {
            P = "req" + P + "_" || "";
            try {
              var x = tt instanceof Map ? tt : Object.entries(tt);
              for (const [hn, Mt] of x) {
                let Lt = Mt;
                c(Mt) && (Lt = Xo(Mt)), _e.push(P + hn + "=" + encodeURIComponent(Lt));
              }
            } catch (hn) {
              throw _e.push(P + "type=" + encodeURIComponent("_badmap")), hn;
            }
          } catch {
            p && p(tt);
          }
        }
        if (re) {
          x = _e.join("&");
          break e;
        }
      }
      x = void 0;
    }
    return a = a.i.splice(0, d), l.G = a, x;
  }
  function El(a) {
    if (!a.g && !a.v) {
      a.Y = 1;
      var l = a.Da;
      Q || g(), W || (Q(), W = !0), E.add(l, a), a.A = 0;
    }
  }
  function la(a) {
    return a.g || a.v || a.A >= 3 ? !1 : (a.Y++, a.v = Nr(h(a.Da, a), vl(a, a.A)), a.A++, !0);
  }
  n.Da = function () {
    if (this.v = null, Tl(this), this.aa && !(this.P || this.g == null || this.T <= 0)) {
      var a = 4 * this.T;
      this.j.info("BP detection timer enabled: " + a), this.B = Nr(h(this.Wa, this), a);
    }
  }, n.Wa = function () {
    this.B && (this.B = null, this.j.info("BP detection timeout reached."), this.j.info("Buffering proxy detected and switch to long-polling!"), this.F = !1, this.P = !0, De(10), ii(this), Tl(this));
  };
  function ha(a) {
    a.B != null && (o.clearTimeout(a.B), a.B = null);
  }
  function Tl(a) {
    a.g = new Dt(a, a.j, "rpc", a.Y), a.u === null && (a.g.J = a.o), a.g.P = 0;
    var l = et(a.na);
    ie(l, "RID", "rpc"), ie(l, "SID", a.M), ie(l, "AID", a.K), ie(l, "CI", a.F ? "0" : "1"), !a.F && a.ia && ie(l, "TO", a.ia), ie(l, "TYPE", "xmlhttp"), Gr(a, l), a.u && a.o && ca(l, a.u, a.o), a.O && (a.g.H = a.O);
    var d = a.g;
    a = a.ba, d.M = 1, d.A = ni(et(l)), d.u = null, d.R = !0, Qu(d, a);
  }
  n.Va = function () {
    this.C != null && (this.C = null, ii(this), la(this), De(19));
  };
  function ai(a) {
    a.C != null && (o.clearTimeout(a.C), a.C = null);
  }
  function wl(a, l) {
    var d = null;
    if (a.g == l) {
      ai(a), ha(a), a.g = null;
      var p = 2;
    } else if (sa(a.h, l)) d = l.G, tl(a.h, l), p = 1;else return;
    if (a.I != 0) {
      if (l.o) {
        if (p == 1) {
          d = l.u ? l.u.length : 0, l = Date.now() - l.F;
          var A = a.D;
          p = Zs(), ke(p, new $u(p, d)), oi(a);
        } else El(a);
      } else if (A = l.m, A == 3 || A == 0 && l.X > 0 || !(p == 1 && Mg(a, l) || p == 2 && la(a))) switch (d && d.length > 0 && (l = a.h, l.i = l.i.concat(d)), A) {
        case 1:
          ln(a, 5);
          break;
        case 4:
          ln(a, 10);
          break;
        case 3:
          ln(a, 6);
          break;
        default:
          ln(a, 2);
      }
    }
  }
  function vl(a, l) {
    let d = a.Qa + Math.floor(Math.random() * a.Za);
    return a.isActive() || (d *= 2), d * l;
  }
  function ln(a, l) {
    if (a.j.info("Error code " + l), l == 2) {
      var d = h(a.bb, a),
        p = a.Ua;
      const A = !p;
      p = new Nt(p || "//www.google.com/images/cleardot.gif"), o.location && o.location.protocol == "http" || Lr(p, "https"), ni(p), A ? Vg(p.toString(), d) : kg(p.toString(), d);
    } else De(2);
    a.I = 0, a.l && a.l.pa(l), Al(a), _l(a);
  }
  n.bb = function (a) {
    a ? (this.j.info("Successfully pinged google.com"), De(2)) : (this.j.info("Failed to ping google.com"), De(1));
  };
  function Al(a) {
    if (a.I = 0, a.ja = [], a.l) {
      const l = nl(a.h);
      (l.length != 0 || a.i.length != 0) && (V(a.ja, l), V(a.ja, a.i), a.h.i.length = 0, b(a.i), a.i.length = 0), a.l.oa();
    }
  }
  function Rl(a, l, d) {
    var p = d instanceof Nt ? et(d) : new Nt(d);
    if (p.g != "") l && (p.g = l + "." + p.g), Fr(p, p.u);else {
      var A = o.location;
      p = A.protocol, l = l ? l + "." + A.hostname : A.hostname, A = +A.port;
      const P = new Nt(null);
      p && Lr(P, p), l && (P.g = l), A && Fr(P, A), d && (P.h = d), p = P;
    }
    return d = a.G, l = a.wa, d && l && ie(p, d, l), ie(p, "VER", a.ka), Gr(a, p), p;
  }
  function bl(a, l, d) {
    if (l && !a.L) throw Error("Can't create secondary domain capable XhrIo object.");
    return l = a.Aa && !a.ma ? new ue(new aa({
      ab: d
    })) : new ue(a.ma), l.Fa(a.L), l;
  }
  n.isActive = function () {
    return !!this.l && this.l.isActive(this);
  };
  function Pl() {}
  n = Pl.prototype, n.ra = function () {}, n.qa = function () {}, n.pa = function () {}, n.oa = function () {}, n.isActive = function () {
    return !0;
  }, n.Ka = function () {};
  function ci() {}
  ci.prototype.g = function (a, l) {
    return new Be(a, l);
  };
  function Be(a, l) {
    be.call(this), this.g = new gl(l), this.l = a, this.h = l && l.messageUrlParams || null, a = l && l.messageHeaders || null, l && l.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = {
      "X-Client-Protocol": "webchannel"
    }), this.g.o = a, a = l && l.initMessageHeaders || null, l && l.messageContentType && (a ? a["X-WebChannel-Content-Type"] = l.messageContentType : a = {
      "X-WebChannel-Content-Type": l.messageContentType
    }), l && l.sa && (a ? a["X-WebChannel-Client-Profile"] = l.sa : a = {
      "X-WebChannel-Client-Profile": l.sa
    }), this.g.U = a, (a = l && l.Qb) && !y(a) && (this.g.u = a), this.A = l && l.supportsCrossDomainXhr || !1, this.v = l && l.sendRawJson || !1, (l = l && l.httpSessionIdParam) && !y(l) && (this.g.G = l, a = this.h, a !== null && l in a && (a = this.h, l in a && delete a[l])), this.j = new Kn(this);
  }
  m(Be, be), Be.prototype.m = function () {
    this.g.l = this.j, this.A && (this.g.L = !0), this.g.connect(this.l, this.h || void 0);
  }, Be.prototype.close = function () {
    ua(this.g);
  }, Be.prototype.o = function (a) {
    var l = this.g;
    if (typeof a == "string") {
      var d = {};
      d.__data__ = a, a = d;
    } else this.v && (d = {}, d.__data__ = Xo(a), a = d);
    l.i.push(new wg(l.Ya++, a)), l.I == 3 && oi(l);
  }, Be.prototype.N = function () {
    this.g.l = null, delete this.j, ua(this.g), delete this.g, Be.Z.N.call(this);
  };
  function Sl(a) {
    Jo.call(this), a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
    var l = a.__sm__;
    if (l) {
      e: {
        for (const d in l) {
          a = d;
          break e;
        }
        a = void 0;
      }
      (this.i = a) && (a = this.i, l = l !== null && a in l ? l[a] : void 0), this.data = l;
    } else this.data = a;
  }
  m(Sl, Jo);
  function Cl() {
    Yo.call(this), this.status = 1;
  }
  m(Cl, Yo);
  function Kn(a) {
    this.g = a;
  }
  m(Kn, Pl), Kn.prototype.ra = function () {
    ke(this.g, "a");
  }, Kn.prototype.qa = function (a) {
    ke(this.g, new Sl(a));
  }, Kn.prototype.pa = function (a) {
    ke(this.g, new Cl());
  }, Kn.prototype.oa = function () {
    ke(this.g, "b");
  }, ci.prototype.createWebChannel = ci.prototype.g, Be.prototype.send = Be.prototype.o, Be.prototype.open = Be.prototype.m, Be.prototype.close = Be.prototype.close, xf = function () {
    return new ci();
  }, Nf = function () {
    return Zs();
  }, Df = an, Ba = {
    jb: 0,
    mb: 1,
    nb: 2,
    Hb: 3,
    Mb: 4,
    Jb: 5,
    Kb: 6,
    Ib: 7,
    Gb: 8,
    Lb: 9,
    PROXY: 10,
    NOPROXY: 11,
    Eb: 12,
    Ab: 13,
    Bb: 14,
    zb: 15,
    Cb: 16,
    Db: 17,
    fb: 18,
    eb: 19,
    gb: 20
  }, ei.NO_ERROR = 0, ei.TIMEOUT = 8, ei.HTTP_ERROR = 6, Ai = ei, Gu.COMPLETE = "complete", kf = Gu, Bu.EventType = kr, kr.OPEN = "a", kr.CLOSE = "b", kr.ERROR = "c", kr.MESSAGE = "d", be.prototype.listen = be.prototype.J, es = Bu, ue.prototype.listenOnce = ue.prototype.K, ue.prototype.getLastError = ue.prototype.Ha, ue.prototype.getLastErrorCode = ue.prototype.ya, ue.prototype.getStatus = ue.prototype.ca, ue.prototype.getResponseJson = ue.prototype.La, ue.prototype.getResponseText = ue.prototype.la, ue.prototype.send = ue.prototype.ea, ue.prototype.setWithCredentials = ue.prototype.Fa, Vf = ue;
}).apply(typeof hi < "u" ? hi : typeof self < "u" ? self : typeof window < "u" ? window : {});
const ih = "@firebase/firestore";
const oh = "4.9.2";
class Ae {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return this.uid != null;
  }
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
}
Ae.UNAUTHENTICATED = new Ae(null), Ae.GOOGLE_CREDENTIALS = new Ae("google-credentials-uid"), Ae.FIRST_PARTY = new Ae("first-party-uid"), Ae.MOCK_USER = new Ae("mock-user");
let Ar = "12.3.0";
const Sn = new gc("@firebase/firestore");
function Zn() {
  return Sn.logLevel;
}
function k(n, ...e) {
  if (Sn.logLevel <= X.DEBUG) {
    const t = e.map(Pc);
    Sn.debug(`Firestore (${Ar}): ${n}`, ...t);
  }
}
function Oe(n, ...e) {
  if (Sn.logLevel <= X.ERROR) {
    const t = e.map(Pc);
    Sn.error(`Firestore (${Ar}): ${n}`, ...t);
  }
}
function lr(n, ...e) {
  if (Sn.logLevel <= X.WARN) {
    const t = e.map(Pc);
    Sn.warn(`Firestore (${Ar}): ${n}`, ...t);
  }
}
function Pc(n) {
  if (typeof n == "string") return n;
  try {
    return function (t) {
      return JSON.stringify(t);
    }(n);
  } catch {
    return n;
  }
}
function L(n, e, t) {
  let r = "Unexpected state";
  typeof e == "string" ? r = e : t = e, Of(n, r, t);
}
function Of(n, e, t) {
  let r = `FIRESTORE (${Ar}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;
  if (t !== void 0) try {
    r += " CONTEXT: " + JSON.stringify(t);
  } catch {
    r += " CONTEXT: " + t;
  }
  throw Oe(r), new Error(r);
}
function F(n, e, t, r) {
  let s = "Unexpected state";
  typeof t == "string" ? s = t : r = t, n || Of(e, s, r);
}
function $(n, e) {
  return n;
}
const S = {
  OK: "ok",
  CANCELLED: "cancelled",
  UNKNOWN: "unknown",
  INVALID_ARGUMENT: "invalid-argument",
  DEADLINE_EXCEEDED: "deadline-exceeded",
  NOT_FOUND: "not-found",
  ALREADY_EXISTS: "already-exists",
  PERMISSION_DENIED: "permission-denied",
  UNAUTHENTICATED: "unauthenticated",
  RESOURCE_EXHAUSTED: "resource-exhausted",
  FAILED_PRECONDITION: "failed-precondition",
  ABORTED: "aborted",
  OUT_OF_RANGE: "out-of-range",
  UNIMPLEMENTED: "unimplemented",
  INTERNAL: "internal",
  UNAVAILABLE: "unavailable",
  DATA_LOSS: "data-loss"
};
class D extends ft {
  constructor(e, t) {
    super(e, t), this.code = e, this.message = t, this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
}
class Je {
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}
class Mf {
  constructor(e, t) {
    this.user = t, this.type = "OAuth", this.headers = new Map(), this.headers.set("Authorization", `Bearer ${e}`);
  }
}
class kE {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {}
  start(e, t) {
    e.enqueueRetryable(() => t(Ae.UNAUTHENTICATED));
  }
  shutdown() {}
}
class DE {
  constructor(e) {
    this.token = e, this.changeListener = null;
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {}
  start(e, t) {
    this.changeListener = t, e.enqueueRetryable(() => t(this.token.user));
  }
  shutdown() {
    this.changeListener = null;
  }
}
class NE {
  constructor(e) {
    this.t = e, this.currentUser = Ae.UNAUTHENTICATED, this.i = 0, this.forceRefresh = !1, this.auth = null;
  }
  start(e, t) {
    F(this.o === void 0, 42304);
    let r = this.i;
    const s = u => this.i !== r ? (r = this.i, t(u)) : Promise.resolve();
    let i = new Je();
    this.o = () => {
      this.i++, this.currentUser = this.u(), i.resolve(), i = new Je(), e.enqueueRetryable(() => s(this.currentUser));
    };
    const o = () => {
        const u = i;
        e.enqueueRetryable(async () => {
          await u.promise, await s(this.currentUser);
        });
      },
      c = u => {
        k("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = u, this.o && (this.auth.addAuthTokenListener(this.o), o());
      };
    this.t.onInit(u => c(u)), setTimeout(() => {
      if (!this.auth) {
        const u = this.t.getImmediate({
          optional: !0
        });
        u ? c(u) : (k("FirebaseAuthCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new Je());
      }
    }, 0), o();
  }
  getToken() {
    const e = this.i,
      t = this.forceRefresh;
    return this.forceRefresh = !1, this.auth ? this.auth.getToken(t).then(r => this.i !== e ? (k("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : r ? (F(typeof r.accessToken == "string", 31837, {
      l: r
    }), new Mf(r.accessToken, this.currentUser)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = !0;
  }
  shutdown() {
    this.auth && this.o && this.auth.removeAuthTokenListener(this.o), this.o = void 0;
  }
  u() {
    const e = this.auth && this.auth.getUid();
    return F(e === null || typeof e == "string", 2055, {
      h: e
    }), new Ae(e);
  }
}
class xE {
  constructor(e, t, r) {
    this.P = e, this.T = t, this.I = r, this.type = "FirstParty", this.user = Ae.FIRST_PARTY, this.A = new Map();
  }
  R() {
    return this.I ? this.I() : null;
  }
  get headers() {
    this.A.set("X-Goog-AuthUser", this.P);
    const e = this.R();
    return e && this.A.set("Authorization", e), this.T && this.A.set("X-Goog-Iam-Authorization-Token", this.T), this.A;
  }
}
class OE {
  constructor(e, t, r) {
    this.P = e, this.T = t, this.I = r;
  }
  getToken() {
    return Promise.resolve(new xE(this.P, this.T, this.I));
  }
  start(e, t) {
    e.enqueueRetryable(() => t(Ae.FIRST_PARTY));
  }
  shutdown() {}
  invalidateToken() {}
}
class ah {
  constructor(e) {
    this.value = e, this.type = "AppCheck", this.headers = new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
}
class ME {
  constructor(e, t) {
    this.V = t, this.forceRefresh = !1, this.appCheck = null, this.m = null, this.p = null, xe(e) && e.settings.appCheckToken && (this.p = e.settings.appCheckToken);
  }
  start(e, t) {
    F(this.o === void 0, 3512);
    const r = i => {
      i.error != null && k("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);
      const o = i.token !== this.m;
      return this.m = i.token, k("FirebaseAppCheckTokenProvider", `Received ${o ? "new" : "existing"} token.`), o ? t(i.token) : Promise.resolve();
    };
    this.o = i => {
      e.enqueueRetryable(() => r(i));
    };
    const s = i => {
      k("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = i, this.o && this.appCheck.addTokenListener(this.o);
    };
    this.V.onInit(i => s(i)), setTimeout(() => {
      if (!this.appCheck) {
        const i = this.V.getImmediate({
          optional: !0
        });
        i ? s(i) : k("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
      }
    }, 0);
  }
  getToken() {
    if (this.p) return Promise.resolve(new ah(this.p));
    const e = this.forceRefresh;
    return this.forceRefresh = !1, this.appCheck ? this.appCheck.getToken(e).then(t => t ? (F(typeof t.token == "string", 44558, {
      tokenResult: t
    }), this.m = t.token, new ah(t.token)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = !0;
  }
  shutdown() {
    this.appCheck && this.o && this.appCheck.removeTokenListener(this.o), this.o = void 0;
  }
}
function LE(n) {
  const e = typeof self < "u" && (self.crypto || self.msCrypto),
    t = new Uint8Array(n);
  if (e && typeof e.getRandomValues == "function") e.getRandomValues(t);else for (let r = 0; r < n; r++) t[r] = Math.floor(256 * Math.random());
  return t;
}
class Sc {
  static newId() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      t = 62 * Math.floor(4.129032258064516);
    let r = "";
    for (; r.length < 20;) {
      const s = LE(40);
      for (let i = 0; i < s.length; ++i) r.length < 20 && s[i] < t && (r += e.charAt(s[i] % 62));
    }
    return r;
  }
}
function z(n, e) {
  return n < e ? -1 : n > e ? 1 : 0;
}
function qa(n, e) {
  const t = Math.min(n.length, e.length);
  for (let r = 0; r < t; r++) {
    const s = n.charAt(r),
      i = e.charAt(r);
    if (s !== i) return Ea(s) === Ea(i) ? z(s, i) : Ea(s) ? 1 : -1;
  }
  return z(n.length, e.length);
}
const FE = 55296;
const UE = 57343;
function Ea(n) {
  const e = n.charCodeAt(0);
  return e >= FE && e <= UE;
}
function hr(n, e, t) {
  return n.length === e.length && n.every((r, s) => t(r, e[s]));
}
function Lf(n) {
  return n + "\0";
}
const ja = "__name__";
class nt {
  constructor(e, t, r) {
    t === void 0 ? t = 0 : t > e.length && L(637, {
      offset: t,
      range: e.length
    }), r === void 0 ? r = e.length - t : r > e.length - t && L(1746, {
      length: r,
      range: e.length - t
    }), this.segments = e, this.offset = t, this.len = r;
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return nt.comparator(this, e) === 0;
  }
  child(e) {
    const t = this.segments.slice(this.offset, this.limit());
    return e instanceof nt ? e.forEach(r => {
      t.push(r);
    }) : t.push(e), this.construct(t);
  }
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return e = e === void 0 ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return this.length === 0;
  }
  isPrefixOf(e) {
    if (e.length < this.length) return !1;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
    return !0;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length) return !1;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
    return !0;
  }
  forEach(e) {
    for (let t = this.offset, r = this.limit(); t < r; t++) e(this.segments[t]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  static comparator(e, t) {
    const r = Math.min(e.length, t.length);
    for (let s = 0; s < r; s++) {
      const i = nt.compareSegments(e.get(s), t.get(s));
      if (i !== 0) return i;
    }
    return z(e.length, t.length);
  }
  static compareSegments(e, t) {
    const r = nt.isNumericId(e),
      s = nt.isNumericId(t);
    return r && !s ? -1 : !r && s ? 1 : r && s ? nt.extractNumericId(e).compare(nt.extractNumericId(t)) : qa(e, t);
  }
  static isNumericId(e) {
    return e.startsWith("__id") && e.endsWith("__");
  }
  static extractNumericId(e) {
    return Kt.fromString(e.substring(4, e.length - 2));
  }
}
class Z extends nt {
  construct(e, t, r) {
    return new Z(e, t, r);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  toUriEncodedString() {
    return this.toArray().map(encodeURIComponent).join("/");
  }
  static fromString(...e) {
    const t = [];
    for (const r of e) {
      if (r.indexOf("//") >= 0) throw new D(S.INVALID_ARGUMENT, `Invalid segment (${r}). Paths must not contain // in them.`);
      t.push(...r.split("/").filter(s => s.length > 0));
    }
    return new Z(t);
  }
  static emptyPath() {
    return new Z([]);
  }
}
const BE = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
class ce extends nt {
  construct(e, t, r) {
    return new ce(e, t, r);
  }
  static isValidIdentifier(e) {
    return BE.test(e);
  }
  canonicalString() {
    return this.toArray().map(e => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), ce.isValidIdentifier(e) || (e = "`" + e + "`"), e)).join(".");
  }
  toString() {
    return this.canonicalString();
  }
  isKeyField() {
    return this.length === 1 && this.get(0) === ja;
  }
  static keyField() {
    return new ce([ja]);
  }
  static fromServerFormat(e) {
    const t = [];
    let r = "",
      s = 0;
    const i = () => {
      if (r.length === 0) throw new D(S.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
      t.push(r), r = "";
    };
    let o = !1;
    for (; s < e.length;) {
      const c = e[s];
      if (c === "\\") {
        if (s + 1 === e.length) throw new D(S.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
        const u = e[s + 1];
        if (u !== "\\" && u !== "." && u !== "`") throw new D(S.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
        r += u, s += 2;
      } else c === "`" ? (o = !o, s++) : c !== "." || o ? (r += c, s++) : (i(), s++);
    }
    if (i(), o) throw new D(S.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
    return new ce(t);
  }
  static emptyPath() {
    return new ce([]);
  }
}
class O {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new O(Z.fromString(e));
  }
  static fromName(e) {
    return new O(Z.fromString(e).popFirst(5));
  }
  static empty() {
    return new O(Z.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return e !== null && Z.comparator(this.path, e.path) === 0;
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t) {
    return Z.comparator(e.path, t.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  static fromSegments(e) {
    return new O(new Z(e.slice()));
  }
}
function Cc(n, e, t) {
  if (!t) throw new D(S.INVALID_ARGUMENT, `Function ${n}() cannot be called with an empty ${e}.`);
}
function qE(n, e, t, r) {
  if (e === !0 && r === !0) throw new D(S.INVALID_ARGUMENT, `${n} and ${t} cannot be used together.`);
}
function ch(n) {
  if (!O.isDocumentKey(n)) throw new D(S.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`);
}
function uh(n) {
  if (O.isDocumentKey(n)) throw new D(S.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`);
}
function Ff(n) {
  return typeof n == "object" && n !== null && (Object.getPrototypeOf(n) === Object.prototype || Object.getPrototypeOf(n) === null);
}
function go(n) {
  if (n === void 0) return "undefined";
  if (n === null) return "null";
  if (typeof n == "string") return n.length > 20 && (n = `${n.substring(0, 20)}...`), JSON.stringify(n);
  if (typeof n == "number" || typeof n == "boolean") return "" + n;
  if (typeof n == "object") {
    if (n instanceof Array) return "an array";
    {
      const e = function (r) {
        return r.constructor ? r.constructor.name : null;
      }(n);
      return e ? `a custom ${e} object` : "an object";
    }
  }
  return typeof n == "function" ? "a function" : L(12329, {
    type: typeof n
  });
}
function ve(n, e) {
  if ("_delegate" in n && (n = n._delegate), !(n instanceof e)) {
    if (e.name === n.constructor.name) throw new D(S.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const t = go(n);
      throw new D(S.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${t}`);
    }
  }
  return n;
}
function Uf(n, e) {
  if (e <= 0) throw new D(S.INVALID_ARGUMENT, `Function ${n}() requires a positive number, but it was: ${e}.`);
}
function me(n, e) {
  const t = {
    typeString: n
  };
  return e && (t.value = e), t;
}
function Os(n, e) {
  if (!Ff(n)) throw new D(S.INVALID_ARGUMENT, "JSON must be an object");
  let t;
  for (const r in e) if (e[r]) {
    const s = e[r].typeString,
      i = "value" in e[r] ? {
        value: e[r].value
      } : void 0;
    if (!(r in n)) {
      t = `JSON missing required field: '${r}'`;
      break;
    }
    const o = n[r];
    if (s && typeof o !== s) {
      t = `JSON field '${r}' must be a ${s}.`;
      break;
    }
    if (i !== void 0 && o !== i.value) {
      t = `Expected '${r}' field to equal '${i.value}'`;
      break;
    }
  }
  if (t) throw new D(S.INVALID_ARGUMENT, t);
  return !0;
}
const lh = -62135596800;
const hh = 1e6;
class ee {
  static now() {
    return ee.fromMillis(Date.now());
  }
  static fromDate(e) {
    return ee.fromMillis(e.getTime());
  }
  static fromMillis(e) {
    const t = Math.floor(e / 1e3),
      r = Math.floor((e - 1e3 * t) * hh);
    return new ee(t, r);
  }
  constructor(e, t) {
    if (this.seconds = e, this.nanoseconds = t, t < 0) throw new D(S.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (t >= 1e9) throw new D(S.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (e < lh) throw new D(S.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    if (e >= 253402300800) throw new D(S.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
  }
  toDate() {
    return new Date(this.toMillis());
  }
  toMillis() {
    return 1e3 * this.seconds + this.nanoseconds / hh;
  }
  _compareTo(e) {
    return this.seconds === e.seconds ? z(this.nanoseconds, e.nanoseconds) : z(this.seconds, e.seconds);
  }
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
  }
  toString() {
    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
  }
  toJSON() {
    return {
      type: ee._jsonSchemaVersion,
      seconds: this.seconds,
      nanoseconds: this.nanoseconds
    };
  }
  static fromJSON(e) {
    if (Os(e, ee._jsonSchema)) return new ee(e.seconds, e.nanoseconds);
  }
  valueOf() {
    const e = this.seconds - lh;
    return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
  }
}
ee._jsonSchemaVersion = "firestore/timestamp/1.0", ee._jsonSchema = {
  type: me("string", ee._jsonSchemaVersion),
  seconds: me("number"),
  nanoseconds: me("number")
};
class B {
  static fromTimestamp(e) {
    return new B(e);
  }
  static min() {
    return new B(new ee(0, 0));
  }
  static max() {
    return new B(new ee(253402300799, 999999999));
  }
  constructor(e) {
    this.timestamp = e;
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp);
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp);
  }
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
  }
  toString() {
    return "SnapshotVersion(" + this.timestamp.toString() + ")";
  }
  toTimestamp() {
    return this.timestamp;
  }
}
const _s = -1;
class $i {
  constructor(e, t, r, s) {
    this.indexId = e, this.collectionGroup = t, this.fields = r, this.indexState = s;
  }
}
function za(n) {
  return n.fields.find(e => e.kind === 2);
}
function pn(n) {
  return n.fields.filter(e => e.kind !== 2);
}
$i.UNKNOWN_ID = -1;
class Ri {
  constructor(e, t) {
    this.fieldPath = e, this.kind = t;
  }
}
class ys {
  constructor(e, t) {
    this.sequenceNumber = e, this.offset = t;
  }
  static empty() {
    return new ys(0, ze.min());
  }
}
function jE(n, e) {
  const t = n.toTimestamp().seconds,
    r = n.toTimestamp().nanoseconds + 1,
    s = B.fromTimestamp(r === 1e9 ? new ee(t + 1, 0) : new ee(t, r));
  return new ze(s, O.empty(), e);
}
function Bf(n) {
  return new ze(n.readTime, n.key, _s);
}
class ze {
  constructor(e, t, r) {
    this.readTime = e, this.documentKey = t, this.largestBatchId = r;
  }
  static min() {
    return new ze(B.min(), O.empty(), _s);
  }
  static max() {
    return new ze(B.max(), O.empty(), _s);
  }
}
function Vc(n, e) {
  let t = n.readTime.compareTo(e.readTime);
  return t !== 0 ? t : (t = O.comparator(n.documentKey, e.documentKey), t !== 0 ? t : z(n.largestBatchId, e.largestBatchId));
}
const qf = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
class jf {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(e) {
    this.onCommittedListeners.push(e);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach(e => e());
  }
}
async function Bn(n) {
  if (n.code !== S.FAILED_PRECONDITION || n.message !== qf) throw n;
  k("LocalStore", "Unexpectedly lost primary lease");
}
class v {
  constructor(e) {
    this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = !1, this.callbackAttached = !1, e(t => {
      this.isDone = !0, this.result = t, this.nextCallback && this.nextCallback(t);
    }, t => {
      this.isDone = !0, this.error = t, this.catchCallback && this.catchCallback(t);
    });
  }
  catch(e) {
    return this.next(void 0, e);
  }
  next(e, t) {
    return this.callbackAttached && L(59440), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new v((r, s) => {
      this.nextCallback = i => {
        this.wrapSuccess(e, i).next(r, s);
      }, this.catchCallback = i => {
        this.wrapFailure(t, i).next(r, s);
      };
    });
  }
  toPromise() {
    return new Promise((e, t) => {
      this.next(e, t);
    });
  }
  wrapUserFunction(e) {
    try {
      const t = e();
      return t instanceof v ? t : v.resolve(t);
    } catch (t) {
      return v.reject(t);
    }
  }
  wrapSuccess(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : v.resolve(t);
  }
  wrapFailure(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : v.reject(t);
  }
  static resolve(e) {
    return new v((t, r) => {
      t(e);
    });
  }
  static reject(e) {
    return new v((t, r) => {
      r(e);
    });
  }
  static waitFor(e) {
    return new v((t, r) => {
      let s = 0,
        i = 0,
        o = !1;
      e.forEach(c => {
        ++s, c.next(() => {
          ++i, o && i === s && t();
        }, u => r(u));
      }), o = !0, i === s && t();
    });
  }
  static or(e) {
    let t = v.resolve(!1);
    for (const r of e) t = t.next(s => s ? v.resolve(s) : r());
    return t;
  }
  static forEach(e, t) {
    const r = [];
    return e.forEach((s, i) => {
      r.push(t.call(this, s, i));
    }), this.waitFor(r);
  }
  static mapArray(e, t) {
    return new v((r, s) => {
      const i = e.length,
        o = new Array(i);
      let c = 0;
      for (let u = 0; u < i; u++) {
        const h = u;
        t(e[h]).next(f => {
          o[h] = f, ++c, c === i && r(o);
        }, f => s(f));
      }
    });
  }
  static doWhile(e, t) {
    return new v((r, s) => {
      const i = () => {
        e() === !0 ? t().next(() => {
          i();
        }, s) : r();
      };
      i();
    });
  }
}
const qe = "SimpleDb";
class _o {
  static open(e, t, r, s) {
    try {
      return new _o(t, e.transaction(s, r));
    } catch (i) {
      throw new as(t, i);
    }
  }
  constructor(e, t) {
    this.action = e, this.transaction = t, this.aborted = !1, this.S = new Je(), this.transaction.oncomplete = () => {
      this.S.resolve();
    }, this.transaction.onabort = () => {
      t.error ? this.S.reject(new as(e, t.error)) : this.S.resolve();
    }, this.transaction.onerror = r => {
      const s = kc(r.target.error);
      this.S.reject(new as(e, s));
    };
  }
  get D() {
    return this.S.promise;
  }
  abort(e) {
    e && this.S.reject(e), this.aborted || (k(qe, "Aborting transaction:", e ? e.message : "Client-initiated abort"), this.aborted = !0, this.transaction.abort());
  }
  C() {
    const e = this.transaction;
    this.aborted || typeof e.commit != "function" || e.commit();
  }
  store(e) {
    const t = this.transaction.objectStore(e);
    return new $E(t);
  }
}
class Ht {
  static delete(e) {
    return k(qe, "Removing database:", e), gn(xd().indexedDB.deleteDatabase(e)).toPromise();
  }
  static v() {
    if (!Bd()) return !1;
    if (Ht.F()) return !0;
    const e = Ie(),
      t = Ht.M(e),
      r = 0 < t && t < 10,
      s = zf(e),
      i = 0 < s && s < 4.5;
    return !(e.indexOf("MSIE ") > 0 || e.indexOf("Trident/") > 0 || e.indexOf("Edge/") > 0 || r || i);
  }
  static F() {
    return typeof process < "u" && process.__PRIVATE_env?.__PRIVATE_USE_MOCK_PERSISTENCE === "YES";
  }
  static O(e, t) {
    return e.store(t);
  }
  static M(e) {
    const t = e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),
      r = t ? t[1].split("_").slice(0, 2).join(".") : "-1";
    return Number(r);
  }
  constructor(e, t, r) {
    this.name = e, this.version = t, this.N = r, this.B = null, Ht.M(Ie()) === 12.2 && Oe("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
  }
  async L(e) {
    return this.db || (k(qe, "Opening database:", this.name), this.db = await new Promise((t, r) => {
      const s = indexedDB.open(this.name, this.version);
      s.onsuccess = i => {
        const o = i.target.result;
        t(o);
      }, s.onblocked = () => {
        r(new as(e, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
      }, s.onerror = i => {
        const o = i.target.error;
        o.name === "VersionError" ? r(new D(S.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : o.name === "InvalidStateError" ? r(new D(S.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + o)) : r(new as(e, o));
      }, s.onupgradeneeded = i => {
        k(qe, 'Database "' + this.name + '" requires upgrade from version:', i.oldVersion);
        const o = i.target.result;
        this.N.k(o, s.transaction, i.oldVersion, this.version).next(() => {
          k(qe, "Database upgrade to version " + this.version + " complete");
        });
      };
    })), this.q && (this.db.onversionchange = t => this.q(t)), this.db;
  }
  $(e) {
    this.q = e, this.db && (this.db.onversionchange = t => e(t));
  }
  async runTransaction(e, t, r, s) {
    const i = t === "readonly";
    let o = 0;
    for (;;) {
      ++o;
      try {
        this.db = await this.L(e);
        const c = _o.open(this.db, e, i ? "readonly" : "readwrite", r),
          u = s(c).next(h => (c.C(), h)).catch(h => (c.abort(h), v.reject(h))).toPromise();
        return u.catch(() => {}), await c.D, u;
      } catch (c) {
        const u = c,
          h = u.name !== "FirebaseError" && o < 3;
        if (k(qe, "Transaction failed with error:", u.message, "Retrying:", h), this.close(), !h) return Promise.reject(u);
      }
    }
  }
  close() {
    this.db && this.db.close(), this.db = void 0;
  }
}
function zf(n) {
  const e = n.match(/Android ([\d.]+)/i),
    t = e ? e[1].split(".").slice(0, 2).join(".") : "-1";
  return Number(t);
}
class zE {
  constructor(e) {
    this.U = e, this.K = !1, this.W = null;
  }
  get isDone() {
    return this.K;
  }
  get G() {
    return this.W;
  }
  set cursor(e) {
    this.U = e;
  }
  done() {
    this.K = !0;
  }
  j(e) {
    this.W = e;
  }
  delete() {
    return gn(this.U.delete());
  }
}
class as extends D {
  constructor(e, t) {
    super(S.UNAVAILABLE, `IndexedDB transaction '${e}' failed: ${t}`), this.name = "IndexedDbTransactionError";
  }
}
function rn(n) {
  return n.name === "IndexedDbTransactionError";
}
class $E {
  constructor(e) {
    this.store = e;
  }
  put(e, t) {
    let r;
    return t !== void 0 ? (k(qe, "PUT", this.store.name, e, t), r = this.store.put(t, e)) : (k(qe, "PUT", this.store.name, "<auto-key>", e), r = this.store.put(e)), gn(r);
  }
  add(e) {
    return k(qe, "ADD", this.store.name, e, e), gn(this.store.add(e));
  }
  get(e) {
    return gn(this.store.get(e)).next(t => (t === void 0 && (t = null), k(qe, "GET", this.store.name, e, t), t));
  }
  delete(e) {
    return k(qe, "DELETE", this.store.name, e), gn(this.store.delete(e));
  }
  count() {
    return k(qe, "COUNT", this.store.name), gn(this.store.count());
  }
  J(e, t) {
    const r = this.options(e, t),
      s = r.index ? this.store.index(r.index) : this.store;
    if (typeof s.getAll == "function") {
      const i = s.getAll(r.range);
      return new v((o, c) => {
        i.onerror = u => {
          c(u.target.error);
        }, i.onsuccess = u => {
          o(u.target.result);
        };
      });
    }
    {
      const i = this.cursor(r),
        o = [];
      return this.H(i, (c, u) => {
        o.push(u);
      }).next(() => o);
    }
  }
  Y(e, t) {
    const r = this.store.getAll(e, t === null ? void 0 : t);
    return new v((s, i) => {
      r.onerror = o => {
        i(o.target.error);
      }, r.onsuccess = o => {
        s(o.target.result);
      };
    });
  }
  Z(e, t) {
    k(qe, "DELETE ALL", this.store.name);
    const r = this.options(e, t);
    r.X = !1;
    const s = this.cursor(r);
    return this.H(s, (i, o, c) => c.delete());
  }
  ee(e, t) {
    let r;
    t ? r = e : (r = {}, t = e);
    const s = this.cursor(r);
    return this.H(s, t);
  }
  te(e) {
    const t = this.cursor({});
    return new v((r, s) => {
      t.onerror = i => {
        const o = kc(i.target.error);
        s(o);
      }, t.onsuccess = i => {
        const o = i.target.result;
        o ? e(o.primaryKey, o.value).next(c => {
          c ? o.continue() : r();
        }) : r();
      };
    });
  }
  H(e, t) {
    const r = [];
    return new v((s, i) => {
      e.onerror = o => {
        i(o.target.error);
      }, e.onsuccess = o => {
        const c = o.target.result;
        if (!c) return void s();
        const u = new zE(c),
          h = t(c.primaryKey, c.value, u);
        if (h instanceof v) {
          const f = h.catch(m => (u.done(), v.reject(m)));
          r.push(f);
        }
        u.isDone ? s() : u.G === null ? c.continue() : c.continue(u.G);
      };
    }).next(() => v.waitFor(r));
  }
  options(e, t) {
    let r;
    return e !== void 0 && (typeof e == "string" ? r = e : t = e), {
      index: r,
      range: t
    };
  }
  cursor(e) {
    let t = "next";
    if (e.reverse && (t = "prev"), e.index) {
      const r = this.store.index(e.index);
      return e.X ? r.openKeyCursor(e.range, t) : r.openCursor(e.range, t);
    }
    return this.store.openCursor(e.range, t);
  }
}
function gn(n) {
  return new v((e, t) => {
    n.onsuccess = r => {
      const s = r.target.result;
      e(s);
    }, n.onerror = r => {
      const s = kc(r.target.error);
      t(s);
    };
  });
}
let dh = !1;
function kc(n) {
  const e = Ht.M(Ie());
  if (e >= 12.2 && e < 13) {
    const t = "An internal error was encountered in the Indexed Database server";
    if (n.message.indexOf(t) >= 0) {
      const r = new D("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
      return dh || (dh = !0, setTimeout(() => {
        throw r;
      }, 0)), r;
    }
  }
  return n;
}
const cs = "IndexBackfiller";
class GE {
  constructor(e, t) {
    this.asyncQueue = e, this.ne = t, this.task = null;
  }
  start() {
    this.re(15e3);
  }
  stop() {
    this.task && (this.task.cancel(), this.task = null);
  }
  get started() {
    return this.task !== null;
  }
  re(e) {
    k(cs, `Scheduled in ${e}ms`), this.task = this.asyncQueue.enqueueAfterDelay("index_backfill", e, async () => {
      this.task = null;
      try {
        const t = await this.ne.ie();
        k(cs, `Documents written: ${t}`);
      } catch (t) {
        rn(t) ? k(cs, "Ignoring IndexedDB error during index backfill: ", t) : await Bn(t);
      }
      await this.re(6e4);
    });
  }
}
class KE {
  constructor(e, t) {
    this.localStore = e, this.persistence = t;
  }
  async ie(e = 50) {
    return this.persistence.runTransaction("Backfill Indexes", "readwrite-primary", t => this.se(t, e));
  }
  se(e, t) {
    const r = new Set();
    let s = t,
      i = !0;
    return v.doWhile(() => i === !0 && s > 0, () => this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(o => {
      if (o !== null && !r.has(o)) return k(cs, `Processing collection: ${o}`), this.oe(e, o, s).next(c => {
        s -= c, r.add(o);
      });
      i = !1;
    })).next(() => t - s);
  }
  oe(e, t, r) {
    return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e, t).next(s => this.localStore.localDocuments.getNextDocuments(e, t, s, r).next(i => {
      const o = i.changes;
      return this.localStore.indexManager.updateIndexEntries(e, o).next(() => this._e(s, i)).next(c => (k(cs, `Updating offset: ${c}`), this.localStore.indexManager.updateCollectionGroup(e, t, c))).next(() => o.size);
    }));
  }
  _e(e, t) {
    let r = e;
    return t.changes.forEach((s, i) => {
      const o = Bf(i);
      Vc(o, r) > 0 && (r = o);
    }), new ze(r.readTime, r.documentKey, Math.max(t.batchId, e.largestBatchId));
  }
}
class Ge {
  constructor(e, t) {
    this.previousValue = e, t && (t.sequenceNumberHandler = r => this.ae(r), this.ue = r => t.writeSequenceNumber(r));
  }
  ae(e) {
    return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
  }
  next() {
    const e = ++this.previousValue;
    return this.ue && this.ue(e), e;
  }
}
Ge.ce = -1;
const wn = -1;
function yo(n) {
  return n == null;
}
function Is(n) {
  return n === 0 && 1 / n == -1 / 0;
}
function HE(n) {
  return typeof n == "number" && Number.isInteger(n) && !Is(n) && n <= Number.MAX_SAFE_INTEGER && n >= Number.MIN_SAFE_INTEGER;
}
const Gi = "";
function Ve(n) {
  let e = "";
  for (let t = 0; t < n.length; t++) e.length > 0 && (e = fh(e)), e = WE(n.get(t), e);
  return fh(e);
}
function WE(n, e) {
  let t = e;
  const r = n.length;
  for (let s = 0; s < r; s++) {
    const i = n.charAt(s);
    switch (i) {
      case "\0":
        t += "";
        break;
      case Gi:
        t += "";
        break;
      default:
        t += i;
    }
  }
  return t;
}
function fh(n) {
  return n + Gi + "";
}
function rt(n) {
  const e = n.length;
  if (F(e >= 2, 64408, {
    path: n
  }), e === 2) return F(n.charAt(0) === Gi && n.charAt(1) === "", 56145, {
    path: n
  }), Z.emptyPath();
  const t = e - 2,
    r = [];
  let s = "";
  for (let i = 0; i < e;) {
    const o = n.indexOf(Gi, i);
    switch ((o < 0 || o > t) && L(50515, {
      path: n
    }), n.charAt(o + 1)) {
      case "":
        const c = n.substring(i, o);
        let u;
        s.length === 0 ? u = c : (s += c, u = s, s = ""), r.push(u);
        break;
      case "":
        s += n.substring(i, o), s += "\0";
        break;
      case "":
        s += n.substring(i, o + 1);
        break;
      default:
        L(61167, {
          path: n
        });
    }
    i = o + 2;
  }
  return new Z(r);
}
const mn = "remoteDocuments";
const Ms = "owner";
const Hn = "owner";
const Es = "mutationQueues";
const QE = "userId";
const We = "mutations";
const ph = "batchId";
const Tn = "userMutationsIndex";
const mh = ["userId", "batchId"];
function bi(n, e) {
  return [n, Ve(e)];
}
function $f(n, e, t) {
  return [n, Ve(e), t];
}
const XE = {};
const dr = "documentMutations";
const Ki = "remoteDocumentsV14";
const JE = ["prefixPath", "collectionGroup", "readTime", "documentId"];
const Pi = "documentKeyIndex";
const YE = ["prefixPath", "collectionGroup", "documentId"];
const Gf = "collectionGroupIndex";
const ZE = ["collectionGroup", "readTime", "prefixPath", "documentId"];
const Ts = "remoteDocumentGlobal";
const $a = "remoteDocumentGlobalKey";
const fr = "targets";
const Kf = "queryTargetsIndex";
const eT = ["canonicalId", "targetId"];
const pr = "targetDocuments";
const tT = ["targetId", "path"];
const Dc = "documentTargetsIndex";
const nT = ["path", "targetId"];
const Hi = "targetGlobalKey";
const vn = "targetGlobal";
const ws = "collectionParents";
const rT = ["collectionId", "parent"];
const mr = "clientMetadata";
const sT = "clientId";
const Io = "bundles";
const iT = "bundleId";
const Eo = "namedQueries";
const oT = "name";
const Nc = "indexConfiguration";
const aT = "indexId";
const Ga = "collectionGroupIndex";
const cT = "collectionGroup";
const us = "indexState";
const uT = ["indexId", "uid"];
const Hf = "sequenceNumberIndex";
const lT = ["uid", "sequenceNumber"];
const ls = "indexEntries";
const hT = ["indexId", "uid", "arrayValue", "directionalValue", "orderedDocumentKey", "documentKey"];
const Wf = "documentKeyIndex";
const dT = ["indexId", "uid", "orderedDocumentKey"];
const To = "documentOverlays";
const fT = ["userId", "collectionPath", "documentId"];
const Ka = "collectionPathOverlayIndex";
const pT = ["userId", "collectionPath", "largestBatchId"];
const Qf = "collectionGroupOverlayIndex";
const mT = ["userId", "collectionGroup", "largestBatchId"];
const xc = "globals";
const gT = "name";
const Xf = [Es, We, dr, mn, fr, Ms, vn, pr, mr, Ts, ws, Io, Eo];
const _T = [...Xf, To];
const Jf = [Es, We, dr, Ki, fr, Ms, vn, pr, mr, Ts, ws, Io, Eo, To];
const Yf = Jf;
const Oc = [...Yf, Nc, us, ls];
const yT = Oc;
const Zf = [...Oc, xc];
const IT = Zf;
class Ha extends jf {
  constructor(e, t) {
    super(), this.le = e, this.currentSequenceNumber = t;
  }
}
function Ee(n, e) {
  const t = $(n);
  return Ht.O(t.le, e);
}
function gh(n) {
  let e = 0;
  for (const t in n) Object.prototype.hasOwnProperty.call(n, t) && e++;
  return e;
}
function sn(n, e) {
  for (const t in n) Object.prototype.hasOwnProperty.call(n, t) && e(t, n[t]);
}
function ep(n) {
  for (const e in n) if (Object.prototype.hasOwnProperty.call(n, e)) return !1;
  return !0;
}
class ae {
  constructor(e, t) {
    this.comparator = e, this.root = t || Re.EMPTY;
  }
  insert(e, t) {
    return new ae(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, Re.BLACK, null, null));
  }
  remove(e) {
    return new ae(this.comparator, this.root.remove(e, this.comparator).copy(null, null, Re.BLACK, null, null));
  }
  get(e) {
    let t = this.root;
    for (; !t.isEmpty();) {
      const r = this.comparator(e, t.key);
      if (r === 0) return t.value;
      r < 0 ? t = t.left : r > 0 && (t = t.right);
    }
    return null;
  }
  indexOf(e) {
    let t = 0,
      r = this.root;
    for (; !r.isEmpty();) {
      const s = this.comparator(e, r.key);
      if (s === 0) return t + r.left.size;
      s < 0 ? r = r.left : (t += r.left.size + 1, r = r.right);
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  get size() {
    return this.root.size;
  }
  minKey() {
    return this.root.minKey();
  }
  maxKey() {
    return this.root.maxKey();
  }
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal((t, r) => (e(t, r), !1));
  }
  toString() {
    const e = [];
    return this.inorderTraversal((t, r) => (e.push(`${t}:${r}`), !1)), `{${e.join(", ")}}`;
  }
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  getIterator() {
    return new di(this.root, null, this.comparator, !1);
  }
  getIteratorFrom(e) {
    return new di(this.root, e, this.comparator, !1);
  }
  getReverseIterator() {
    return new di(this.root, null, this.comparator, !0);
  }
  getReverseIteratorFrom(e) {
    return new di(this.root, e, this.comparator, !0);
  }
}
class di {
  constructor(e, t, r, s) {
    this.isReverse = s, this.nodeStack = [];
    let i = 1;
    for (; !e.isEmpty();) if (i = t ? r(e.key, t) : 1, t && s && (i *= -1), i < 0) e = this.isReverse ? e.left : e.right;else {
      if (i === 0) {
        this.nodeStack.push(e);
        break;
      }
      this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
    }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t = {
      key: e.key,
      value: e.value
    };
    if (this.isReverse) for (e = e.left; !e.isEmpty();) this.nodeStack.push(e), e = e.right;else for (e = e.right; !e.isEmpty();) this.nodeStack.push(e), e = e.left;
    return t;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (this.nodeStack.length === 0) return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: e.key,
      value: e.value
    };
  }
}
class Re {
  constructor(e, t, r, s, i) {
    this.key = e, this.value = t, this.color = r ?? Re.RED, this.left = s ?? Re.EMPTY, this.right = i ?? Re.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  copy(e, t, r, s, i) {
    return new Re(e ?? this.key, t ?? this.value, r ?? this.color, s ?? this.left, i ?? this.right);
  }
  isEmpty() {
    return !1;
  }
  inorderTraversal(e) {
    return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
  }
  reverseTraversal(e) {
    return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
  }
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  minKey() {
    return this.min().key;
  }
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  insert(e, t, r) {
    let s = this;
    const i = r(e, s.key);
    return s = i < 0 ? s.copy(null, null, null, s.left.insert(e, t, r), null) : i === 0 ? s.copy(null, t, null, null, null) : s.copy(null, null, null, null, s.right.insert(e, t, r)), s.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty()) return Re.EMPTY;
    let e = this;
    return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
  }
  remove(e, t) {
    let r,
      s = this;
    if (t(e, s.key) < 0) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(e, t), null);else {
      if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), t(e, s.key) === 0) {
        if (s.right.isEmpty()) return Re.EMPTY;
        r = s.right.min(), s = s.copy(r.key, r.value, null, null, s.right.removeMin());
      }
      s = s.copy(null, null, null, null, s.right.remove(e, t));
    }
    return s.fixUp();
  }
  isRed() {
    return this.color;
  }
  fixUp() {
    let e = this;
    return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
  }
  moveRedRight() {
    let e = this.colorFlip();
    return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
  }
  rotateLeft() {
    const e = this.copy(null, null, Re.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, Re.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null),
      t = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t);
  }
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  check() {
    if (this.isRed() && this.left.isRed()) throw L(43730, {
      key: this.key,
      value: this.value
    });
    if (this.right.isRed()) throw L(14113, {
      key: this.key,
      value: this.value
    });
    const e = this.left.check();
    if (e !== this.right.check()) throw L(27949);
    return e + (this.isRed() ? 0 : 1);
  }
}
Re.EMPTY = null, Re.RED = !0, Re.BLACK = !1;
Re.EMPTY = new class {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw L(57766);
  }
  get value() {
    throw L(16141);
  }
  get color() {
    throw L(16727);
  }
  get left() {
    throw L(29726);
  }
  get right() {
    throw L(36894);
  }
  copy(e, t, r, s, i) {
    return this;
  }
  insert(e, t, r) {
    return new Re(e, t);
  }
  remove(e, t) {
    return this;
  }
  isEmpty() {
    return !0;
  }
  inorderTraversal(e) {
    return !1;
  }
  reverseTraversal(e) {
    return !1;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return !1;
  }
  checkMaxDepth() {
    return !0;
  }
  check() {
    return 0;
  }
}();
class ne {
  constructor(e) {
    this.comparator = e, this.data = new ae(this.comparator);
  }
  has(e) {
    return this.data.get(e) !== null;
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  forEach(e) {
    this.data.inorderTraversal((t, r) => (e(t), !1));
  }
  forEachInRange(e, t) {
    const r = this.data.getIteratorFrom(e[0]);
    for (; r.hasNext();) {
      const s = r.getNext();
      if (this.comparator(s.key, e[1]) >= 0) return;
      t(s.key);
    }
  }
  forEachWhile(e, t) {
    let r;
    for (r = t !== void 0 ? this.data.getIteratorFrom(t) : this.data.getIterator(); r.hasNext();) if (!e(r.getNext().key)) return;
  }
  firstAfterOrEqual(e) {
    const t = this.data.getIteratorFrom(e);
    return t.hasNext() ? t.getNext().key : null;
  }
  getIterator() {
    return new _h(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new _h(this.data.getIteratorFrom(e));
  }
  add(e) {
    return this.copy(this.data.remove(e).insert(e, !0));
  }
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t = this;
    return t.size < e.size && (t = e, e = this), e.forEach(r => {
      t = t.add(r);
    }), t;
  }
  isEqual(e) {
    if (!(e instanceof ne) || this.size !== e.size) return !1;
    const t = this.data.getIterator(),
      r = e.data.getIterator();
    for (; t.hasNext();) {
      const s = t.getNext().key,
        i = r.getNext().key;
      if (this.comparator(s, i) !== 0) return !1;
    }
    return !0;
  }
  toArray() {
    const e = [];
    return this.forEach(t => {
      e.push(t);
    }), e;
  }
  toString() {
    const e = [];
    return this.forEach(t => e.push(t)), "SortedSet(" + e.toString() + ")";
  }
  copy(e) {
    const t = new ne(this.comparator);
    return t.data = e, t;
  }
}
class _h {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
}
function Wn(n) {
  return n.hasNext() ? n.getNext() : void 0;
}
class Ue {
  constructor(e) {
    this.fields = e, e.sort(ce.comparator);
  }
  static empty() {
    return new Ue([]);
  }
  unionWith(e) {
    let t = new ne(ce.comparator);
    for (const r of this.fields) t = t.add(r);
    for (const r of e) t = t.add(r);
    return new Ue(t.toArray());
  }
  covers(e) {
    for (const t of this.fields) if (t.isPrefixOf(e)) return !0;
    return !1;
  }
  isEqual(e) {
    return hr(this.fields, e.fields, (t, r) => t.isEqual(r));
  }
}
class tp extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
}
class ge {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t = function (s) {
      try {
        return atob(s);
      } catch (i) {
        throw typeof DOMException < "u" && i instanceof DOMException ? new tp("Invalid base64 string: " + i) : i;
      }
    }(e);
    return new ge(t);
  }
  static fromUint8Array(e) {
    const t = function (s) {
      let i = "";
      for (let o = 0; o < s.length; ++o) i += String.fromCharCode(s[o]);
      return i;
    }(e);
    return new ge(t);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(e++),
        done: !1
      } : {
        value: void 0,
        done: !0
      }
    };
  }
  toBase64() {
    return function (t) {
      return btoa(t);
    }(this.binaryString);
  }
  toUint8Array() {
    return function (t) {
      const r = new Uint8Array(t.length);
      for (let s = 0; s < t.length; s++) r[s] = t.charCodeAt(s);
      return r;
    }(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return z(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
}
ge.EMPTY_BYTE_STRING = new ge("");
const ET = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function At(n) {
  if (F(!!n, 39018), typeof n == "string") {
    let e = 0;
    const t = ET.exec(n);
    if (F(!!t, 46558, {
      timestamp: n
    }), t[1]) {
      let s = t[1];
      s = (s + "000000000").substr(0, 9), e = Number(s);
    }
    const r = new Date(n);
    return {
      seconds: Math.floor(r.getTime() / 1e3),
      nanos: e
    };
  }
  return {
    seconds: oe(n.seconds),
    nanos: oe(n.nanos)
  };
}
function oe(n) {
  return typeof n == "number" ? n : typeof n == "string" ? Number(n) : 0;
}
function Rt(n) {
  return typeof n == "string" ? ge.fromBase64String(n) : ge.fromUint8Array(n);
}
const np = "server_timestamp";
const rp = "__type__";
const sp = "__previous_value__";
const ip = "__local_write_time__";
function Mc(n) {
  return (n?.mapValue?.fields || {})[rp]?.stringValue === np;
}
function wo(n) {
  const e = n.mapValue.fields[sp];
  return Mc(e) ? wo(e) : e;
}
function vs(n) {
  const e = At(n.mapValue.fields[ip].timestampValue);
  return new ee(e.seconds, e.nanos);
}
class TT {
  constructor(e, t, r, s, i, o, c, u, h, f) {
    this.databaseId = e, this.appId = t, this.persistenceKey = r, this.host = s, this.ssl = i, this.forceLongPolling = o, this.autoDetectLongPolling = c, this.longPollingOptions = u, this.useFetchStreams = h, this.isUsingEmulator = f;
  }
}
const Wi = "(default)";
class Cn {
  constructor(e, t) {
    this.projectId = e, this.database = t || Wi;
  }
  static empty() {
    return new Cn("", "");
  }
  get isDefaultDatabase() {
    return this.database === Wi;
  }
  isEqual(e) {
    return e instanceof Cn && e.projectId === this.projectId && e.database === this.database;
  }
}
const Lc = "__type__";
const op = "__max__";
const $t = {
  mapValue: {
    fields: {
      __type__: {
        stringValue: op
      }
    }
  }
};
const Fc = "__vector__";
const gr = "value";
const Si = {
  nullValue: "NULL_VALUE"
};
function Zt(n) {
  return "nullValue" in n ? 0 : "booleanValue" in n ? 1 : "integerValue" in n || "doubleValue" in n ? 2 : "timestampValue" in n ? 3 : "stringValue" in n ? 5 : "bytesValue" in n ? 6 : "referenceValue" in n ? 7 : "geoPointValue" in n ? 8 : "arrayValue" in n ? 9 : "mapValue" in n ? Mc(n) ? 4 : ap(n) ? 9007199254740991 : vo(n) ? 10 : 11 : L(28295, {
    value: n
  });
}
function dt(n, e) {
  if (n === e) return !0;
  const t = Zt(n);
  if (t !== Zt(e)) return !1;
  switch (t) {
    case 0:
    case 9007199254740991:
      return !0;
    case 1:
      return n.booleanValue === e.booleanValue;
    case 4:
      return vs(n).isEqual(vs(e));
    case 3:
      return function (s, i) {
        if (typeof s.timestampValue == "string" && typeof i.timestampValue == "string" && s.timestampValue.length === i.timestampValue.length) return s.timestampValue === i.timestampValue;
        const o = At(s.timestampValue),
          c = At(i.timestampValue);
        return o.seconds === c.seconds && o.nanos === c.nanos;
      }(n, e);
    case 5:
      return n.stringValue === e.stringValue;
    case 6:
      return function (s, i) {
        return Rt(s.bytesValue).isEqual(Rt(i.bytesValue));
      }(n, e);
    case 7:
      return n.referenceValue === e.referenceValue;
    case 8:
      return function (s, i) {
        return oe(s.geoPointValue.latitude) === oe(i.geoPointValue.latitude) && oe(s.geoPointValue.longitude) === oe(i.geoPointValue.longitude);
      }(n, e);
    case 2:
      return function (s, i) {
        if ("integerValue" in s && "integerValue" in i) return oe(s.integerValue) === oe(i.integerValue);
        if ("doubleValue" in s && "doubleValue" in i) {
          const o = oe(s.doubleValue),
            c = oe(i.doubleValue);
          return o === c ? Is(o) === Is(c) : isNaN(o) && isNaN(c);
        }
        return !1;
      }(n, e);
    case 9:
      return hr(n.arrayValue.values || [], e.arrayValue.values || [], dt);
    case 10:
    case 11:
      return function (s, i) {
        const o = s.mapValue.fields || {},
          c = i.mapValue.fields || {};
        if (gh(o) !== gh(c)) return !1;
        for (const u in o) if (o.hasOwnProperty(u) && (c[u] === void 0 || !dt(o[u], c[u]))) return !1;
        return !0;
      }(n, e);
    default:
      return L(52216, {
        left: n
      });
  }
}
function As(n, e) {
  return (n.values || []).find(t => dt(t, e)) !== void 0;
}
function en(n, e) {
  if (n === e) return 0;
  const t = Zt(n),
    r = Zt(e);
  if (t !== r) return z(t, r);
  switch (t) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return z(n.booleanValue, e.booleanValue);
    case 2:
      return function (i, o) {
        const c = oe(i.integerValue || i.doubleValue),
          u = oe(o.integerValue || o.doubleValue);
        return c < u ? -1 : c > u ? 1 : c === u ? 0 : isNaN(c) ? isNaN(u) ? 0 : -1 : 1;
      }(n, e);
    case 3:
      return yh(n.timestampValue, e.timestampValue);
    case 4:
      return yh(vs(n), vs(e));
    case 5:
      return qa(n.stringValue, e.stringValue);
    case 6:
      return function (i, o) {
        const c = Rt(i),
          u = Rt(o);
        return c.compareTo(u);
      }(n.bytesValue, e.bytesValue);
    case 7:
      return function (i, o) {
        const c = i.split("/"),
          u = o.split("/");
        for (let h = 0; h < c.length && h < u.length; h++) {
          const f = z(c[h], u[h]);
          if (f !== 0) return f;
        }
        return z(c.length, u.length);
      }(n.referenceValue, e.referenceValue);
    case 8:
      return function (i, o) {
        const c = z(oe(i.latitude), oe(o.latitude));
        return c !== 0 ? c : z(oe(i.longitude), oe(o.longitude));
      }(n.geoPointValue, e.geoPointValue);
    case 9:
      return Ih(n.arrayValue, e.arrayValue);
    case 10:
      return function (i, o) {
        const c = i.fields || {},
          u = o.fields || {},
          h = c[gr]?.arrayValue,
          f = u[gr]?.arrayValue,
          m = z(h?.values?.length || 0, f?.values?.length || 0);
        return m !== 0 ? m : Ih(h, f);
      }(n.mapValue, e.mapValue);
    case 11:
      return function (i, o) {
        if (i === $t.mapValue && o === $t.mapValue) return 0;
        if (i === $t.mapValue) return 1;
        if (o === $t.mapValue) return -1;
        const c = i.fields || {},
          u = Object.keys(c),
          h = o.fields || {},
          f = Object.keys(h);
        u.sort(), f.sort();
        for (let m = 0; m < u.length && m < f.length; ++m) {
          const _ = qa(u[m], f[m]);
          if (_ !== 0) return _;
          const b = en(c[u[m]], h[f[m]]);
          if (b !== 0) return b;
        }
        return z(u.length, f.length);
      }(n.mapValue, e.mapValue);
    default:
      throw L(23264, {
        he: t
      });
  }
}
function yh(n, e) {
  if (typeof n == "string" && typeof e == "string" && n.length === e.length) return z(n, e);
  const t = At(n),
    r = At(e),
    s = z(t.seconds, r.seconds);
  return s !== 0 ? s : z(t.nanos, r.nanos);
}
function Ih(n, e) {
  const t = n.values || [],
    r = e.values || [];
  for (let s = 0; s < t.length && s < r.length; ++s) {
    const i = en(t[s], r[s]);
    if (i) return i;
  }
  return z(t.length, r.length);
}
function _r(n) {
  return Wa(n);
}
function Wa(n) {
  return "nullValue" in n ? "null" : "booleanValue" in n ? "" + n.booleanValue : "integerValue" in n ? "" + n.integerValue : "doubleValue" in n ? "" + n.doubleValue : "timestampValue" in n ? function (t) {
    const r = At(t);
    return `time(${r.seconds},${r.nanos})`;
  }(n.timestampValue) : "stringValue" in n ? n.stringValue : "bytesValue" in n ? function (t) {
    return Rt(t).toBase64();
  }(n.bytesValue) : "referenceValue" in n ? function (t) {
    return O.fromName(t).toString();
  }(n.referenceValue) : "geoPointValue" in n ? function (t) {
    return `geo(${t.latitude},${t.longitude})`;
  }(n.geoPointValue) : "arrayValue" in n ? function (t) {
    let r = "[",
      s = !0;
    for (const i of t.values || []) s ? s = !1 : r += ",", r += Wa(i);
    return r + "]";
  }(n.arrayValue) : "mapValue" in n ? function (t) {
    const r = Object.keys(t.fields || {}).sort();
    let s = "{",
      i = !0;
    for (const o of r) i ? i = !1 : s += ",", s += `${o}:${Wa(t.fields[o])}`;
    return s + "}";
  }(n.mapValue) : L(61005, {
    value: n
  });
}
function Ci(n) {
  switch (Zt(n)) {
    case 0:
    case 1:
      return 4;
    case 2:
      return 8;
    case 3:
    case 8:
      return 16;
    case 4:
      const e = wo(n);
      return e ? 16 + Ci(e) : 16;
    case 5:
      return 2 * n.stringValue.length;
    case 6:
      return Rt(n.bytesValue).approximateByteSize();
    case 7:
      return n.referenceValue.length;
    case 9:
      return function (r) {
        return (r.values || []).reduce((s, i) => s + Ci(i), 0);
      }(n.arrayValue);
    case 10:
    case 11:
      return function (r) {
        let s = 0;
        return sn(r.fields, (i, o) => {
          s += i.length + Ci(o);
        }), s;
      }(n.mapValue);
    default:
      throw L(13486, {
        value: n
      });
  }
}
function Rs(n, e) {
  return {
    referenceValue: `projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`
  };
}
function Qa(n) {
  return !!n && "integerValue" in n;
}
function bs(n) {
  return !!n && "arrayValue" in n;
}
function Eh(n) {
  return !!n && "nullValue" in n;
}
function Th(n) {
  return !!n && "doubleValue" in n && isNaN(Number(n.doubleValue));
}
function Vi(n) {
  return !!n && "mapValue" in n;
}
function vo(n) {
  return (n?.mapValue?.fields || {})[Lc]?.stringValue === Fc;
}
function hs(n) {
  if (n.geoPointValue) return {
    geoPointValue: {
      ...n.geoPointValue
    }
  };
  if (n.timestampValue && typeof n.timestampValue == "object") return {
    timestampValue: {
      ...n.timestampValue
    }
  };
  if (n.mapValue) {
    const e = {
      mapValue: {
        fields: {}
      }
    };
    return sn(n.mapValue.fields, (t, r) => e.mapValue.fields[t] = hs(r)), e;
  }
  if (n.arrayValue) {
    const e = {
      arrayValue: {
        values: []
      }
    };
    for (let t = 0; t < (n.arrayValue.values || []).length; ++t) e.arrayValue.values[t] = hs(n.arrayValue.values[t]);
    return e;
  }
  return {
    ...n
  };
}
function ap(n) {
  return (((n.mapValue || {}).fields || {}).__type__ || {}).stringValue === op;
}
const cp = {
  mapValue: {
    fields: {
      [Lc]: {
        stringValue: Fc
      },
      [gr]: {
        arrayValue: {}
      }
    }
  }
};
function wT(n) {
  return "nullValue" in n ? Si : "booleanValue" in n ? {
    booleanValue: !1
  } : "integerValue" in n || "doubleValue" in n ? {
    doubleValue: NaN
  } : "timestampValue" in n ? {
    timestampValue: {
      seconds: Number.MIN_SAFE_INTEGER
    }
  } : "stringValue" in n ? {
    stringValue: ""
  } : "bytesValue" in n ? {
    bytesValue: ""
  } : "referenceValue" in n ? Rs(Cn.empty(), O.empty()) : "geoPointValue" in n ? {
    geoPointValue: {
      latitude: -90,
      longitude: -180
    }
  } : "arrayValue" in n ? {
    arrayValue: {}
  } : "mapValue" in n ? vo(n) ? cp : {
    mapValue: {}
  } : L(35942, {
    value: n
  });
}
function vT(n) {
  return "nullValue" in n ? {
    booleanValue: !1
  } : "booleanValue" in n ? {
    doubleValue: NaN
  } : "integerValue" in n || "doubleValue" in n ? {
    timestampValue: {
      seconds: Number.MIN_SAFE_INTEGER
    }
  } : "timestampValue" in n ? {
    stringValue: ""
  } : "stringValue" in n ? {
    bytesValue: ""
  } : "bytesValue" in n ? Rs(Cn.empty(), O.empty()) : "referenceValue" in n ? {
    geoPointValue: {
      latitude: -90,
      longitude: -180
    }
  } : "geoPointValue" in n ? {
    arrayValue: {}
  } : "arrayValue" in n ? cp : "mapValue" in n ? vo(n) ? {
    mapValue: {}
  } : $t : L(61959, {
    value: n
  });
}
function wh(n, e) {
  const t = en(n.value, e.value);
  return t !== 0 ? t : n.inclusive && !e.inclusive ? -1 : !n.inclusive && e.inclusive ? 1 : 0;
}
function vh(n, e) {
  const t = en(n.value, e.value);
  return t !== 0 ? t : n.inclusive && !e.inclusive ? 1 : !n.inclusive && e.inclusive ? -1 : 0;
}
class Ce {
  constructor(e) {
    this.value = e;
  }
  static empty() {
    return new Ce({
      mapValue: {}
    });
  }
  field(e) {
    if (e.isEmpty()) return this.value;
    {
      let t = this.value;
      for (let r = 0; r < e.length - 1; ++r) if (t = (t.mapValue.fields || {})[e.get(r)], !Vi(t)) return null;
      return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
    }
  }
  set(e, t) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = hs(t);
  }
  setAll(e) {
    let t = ce.emptyPath(),
      r = {},
      s = [];
    e.forEach((o, c) => {
      if (!t.isImmediateParentOf(c)) {
        const u = this.getFieldsMap(t);
        this.applyChanges(u, r, s), r = {}, s = [], t = c.popLast();
      }
      o ? r[c.lastSegment()] = hs(o) : s.push(c.lastSegment());
    });
    const i = this.getFieldsMap(t);
    this.applyChanges(i, r, s);
  }
  delete(e) {
    const t = this.field(e.popLast());
    Vi(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
  }
  isEqual(e) {
    return dt(this.value, e.value);
  }
  getFieldsMap(e) {
    let t = this.value;
    t.mapValue.fields || (t.mapValue = {
      fields: {}
    });
    for (let r = 0; r < e.length; ++r) {
      let s = t.mapValue.fields[e.get(r)];
      Vi(s) && s.mapValue.fields || (s = {
        mapValue: {
          fields: {}
        }
      }, t.mapValue.fields[e.get(r)] = s), t = s;
    }
    return t.mapValue.fields;
  }
  applyChanges(e, t, r) {
    sn(t, (s, i) => e[s] = i);
    for (const s of r) delete e[s];
  }
  clone() {
    return new Ce(hs(this.value));
  }
}
function up(n) {
  const e = [];
  return sn(n.fields, (t, r) => {
    const s = new ce([t]);
    if (Vi(r)) {
      const i = up(r.mapValue).fields;
      if (i.length === 0) e.push(s);else for (const o of i) e.push(s.child(o));
    } else e.push(s);
  }), new Ue(e);
}
class le {
  constructor(e, t, r, s, i, o, c) {
    this.key = e, this.documentType = t, this.version = r, this.readTime = s, this.createTime = i, this.data = o, this.documentState = c;
  }
  static newInvalidDocument(e) {
    return new le(e, 0, B.min(), B.min(), B.min(), Ce.empty(), 0);
  }
  static newFoundDocument(e, t, r, s) {
    return new le(e, 1, t, B.min(), r, s, 0);
  }
  static newNoDocument(e, t) {
    return new le(e, 2, t, B.min(), B.min(), Ce.empty(), 0);
  }
  static newUnknownDocument(e, t) {
    return new le(e, 3, t, B.min(), B.min(), Ce.empty(), 2);
  }
  convertToFoundDocument(e, t) {
    return !this.createTime.isEqual(B.min()) || this.documentType !== 2 && this.documentType !== 0 || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
  }
  convertToNoDocument(e) {
    return this.version = e, this.documentType = 2, this.data = Ce.empty(), this.documentState = 0, this;
  }
  convertToUnknownDocument(e) {
    return this.version = e, this.documentType = 3, this.data = Ce.empty(), this.documentState = 2, this;
  }
  setHasCommittedMutations() {
    return this.documentState = 2, this;
  }
  setHasLocalMutations() {
    return this.documentState = 1, this.version = B.min(), this;
  }
  setReadTime(e) {
    return this.readTime = e, this;
  }
  get hasLocalMutations() {
    return this.documentState === 1;
  }
  get hasCommittedMutations() {
    return this.documentState === 2;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return this.documentType !== 0;
  }
  isFoundDocument() {
    return this.documentType === 1;
  }
  isNoDocument() {
    return this.documentType === 2;
  }
  isUnknownDocument() {
    return this.documentType === 3;
  }
  isEqual(e) {
    return e instanceof le && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
  }
  mutableCopy() {
    return new le(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
  }
}
class yr {
  constructor(e, t) {
    this.position = e, this.inclusive = t;
  }
}
function Ah(n, e, t) {
  let r = 0;
  for (let s = 0; s < n.position.length; s++) {
    const i = e[s],
      o = n.position[s];
    if (i.field.isKeyField() ? r = O.comparator(O.fromName(o.referenceValue), t.key) : r = en(o, t.data.field(i.field)), i.dir === "desc" && (r *= -1), r !== 0) break;
  }
  return r;
}
function Rh(n, e) {
  if (n === null) return e === null;
  if (e === null || n.inclusive !== e.inclusive || n.position.length !== e.position.length) return !1;
  for (let t = 0; t < n.position.length; t++) if (!dt(n.position[t], e.position[t])) return !1;
  return !0;
}
class Ps {
  constructor(e, t = "asc") {
    this.field = e, this.dir = t;
  }
}
function AT(n, e) {
  return n.dir === e.dir && n.field.isEqual(e.field);
}
class lp {}
class J extends lp {
  constructor(e, t, r) {
    super(), this.field = e, this.op = t, this.value = r;
  }
  static create(e, t, r) {
    return e.isKeyField() ? t === "in" || t === "not-in" ? this.createKeyFieldInFilter(e, t, r) : new RT(e, t, r) : t === "array-contains" ? new ST(e, r) : t === "in" ? new gp(e, r) : t === "not-in" ? new CT(e, r) : t === "array-contains-any" ? new VT(e, r) : new J(e, t, r);
  }
  static createKeyFieldInFilter(e, t, r) {
    return t === "in" ? new bT(e, r) : new PT(e, r);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return this.op === "!=" ? t !== null && t.nullValue === void 0 && this.matchesComparison(en(t, this.value)) : t !== null && Zt(this.value) === Zt(t) && this.matchesComparison(en(t, this.value));
  }
  matchesComparison(e) {
    switch (this.op) {
      case "<":
        return e < 0;
      case "<=":
        return e <= 0;
      case "==":
        return e === 0;
      case "!=":
        return e !== 0;
      case ">":
        return e > 0;
      case ">=":
        return e >= 0;
      default:
        return L(47266, {
          operator: this.op
        });
    }
  }
  isInequality() {
    return ["<", "<=", ">", ">=", "!=", "not-in"].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
}
class te extends lp {
  constructor(e, t) {
    super(), this.filters = e, this.op = t, this.Pe = null;
  }
  static create(e, t) {
    return new te(e, t);
  }
  matches(e) {
    return Ir(this) ? this.filters.find(t => !t.matches(e)) === void 0 : this.filters.find(t => t.matches(e)) !== void 0;
  }
  getFlattenedFilters() {
    return this.Pe !== null || (this.Pe = this.filters.reduce((e, t) => e.concat(t.getFlattenedFilters()), [])), this.Pe;
  }
  getFilters() {
    return Object.assign([], this.filters);
  }
}
function Ir(n) {
  return n.op === "and";
}
function Xa(n) {
  return n.op === "or";
}
function Uc(n) {
  return hp(n) && Ir(n);
}
function hp(n) {
  for (const e of n.filters) if (e instanceof te) return !1;
  return !0;
}
function Ja(n) {
  if (n instanceof J) return n.field.canonicalString() + n.op.toString() + _r(n.value);
  if (Uc(n)) return n.filters.map(e => Ja(e)).join(",");
  {
    const e = n.filters.map(t => Ja(t)).join(",");
    return `${n.op}(${e})`;
  }
}
function dp(n, e) {
  return n instanceof J ? function (r, s) {
    return s instanceof J && r.op === s.op && r.field.isEqual(s.field) && dt(r.value, s.value);
  }(n, e) : n instanceof te ? function (r, s) {
    return s instanceof te && r.op === s.op && r.filters.length === s.filters.length ? r.filters.reduce((i, o, c) => i && dp(o, s.filters[c]), !0) : !1;
  }(n, e) : void L(19439);
}
function fp(n, e) {
  const t = n.filters.concat(e);
  return te.create(t, n.op);
}
function pp(n) {
  return n instanceof J ? function (t) {
    return `${t.field.canonicalString()} ${t.op} ${_r(t.value)}`;
  }(n) : n instanceof te ? function (t) {
    return t.op.toString() + " {" + t.getFilters().map(pp).join(" ,") + "}";
  }(n) : "Filter";
}
class RT extends J {
  constructor(e, t, r) {
    super(e, t, r), this.key = O.fromName(r.referenceValue);
  }
  matches(e) {
    const t = O.comparator(e.key, this.key);
    return this.matchesComparison(t);
  }
}
class bT extends J {
  constructor(e, t) {
    super(e, "in", t), this.keys = mp("in", t);
  }
  matches(e) {
    return this.keys.some(t => t.isEqual(e.key));
  }
}
class PT extends J {
  constructor(e, t) {
    super(e, "not-in", t), this.keys = mp("not-in", t);
  }
  matches(e) {
    return !this.keys.some(t => t.isEqual(e.key));
  }
}
function mp(n, e) {
  return (e.arrayValue?.values || []).map(t => O.fromName(t.referenceValue));
}
class ST extends J {
  constructor(e, t) {
    super(e, "array-contains", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return bs(t) && As(t.arrayValue, this.value);
  }
}
class gp extends J {
  constructor(e, t) {
    super(e, "in", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return t !== null && As(this.value.arrayValue, t);
  }
}
class CT extends J {
  constructor(e, t) {
    super(e, "not-in", t);
  }
  matches(e) {
    if (As(this.value.arrayValue, {
      nullValue: "NULL_VALUE"
    })) return !1;
    const t = e.data.field(this.field);
    return t !== null && t.nullValue === void 0 && !As(this.value.arrayValue, t);
  }
}
class VT extends J {
  constructor(e, t) {
    super(e, "array-contains-any", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return !(!bs(t) || !t.arrayValue.values) && t.arrayValue.values.some(r => As(this.value.arrayValue, r));
  }
}
class kT {
  constructor(e, t = null, r = [], s = [], i = null, o = null, c = null) {
    this.path = e, this.collectionGroup = t, this.orderBy = r, this.filters = s, this.limit = i, this.startAt = o, this.endAt = c, this.Te = null;
  }
}
function Ya(n, e = null, t = [], r = [], s = null, i = null, o = null) {
  return new kT(n, e, t, r, s, i, o);
}
function Vn(n) {
  const e = $(n);
  if (e.Te === null) {
    let t = e.path.canonicalString();
    e.collectionGroup !== null && (t += "|cg:" + e.collectionGroup), t += "|f:", t += e.filters.map(r => Ja(r)).join(","), t += "|ob:", t += e.orderBy.map(r => function (i) {
      return i.field.canonicalString() + i.dir;
    }(r)).join(","), yo(e.limit) || (t += "|l:", t += e.limit), e.startAt && (t += "|lb:", t += e.startAt.inclusive ? "b:" : "a:", t += e.startAt.position.map(r => _r(r)).join(",")), e.endAt && (t += "|ub:", t += e.endAt.inclusive ? "a:" : "b:", t += e.endAt.position.map(r => _r(r)).join(",")), e.Te = t;
  }
  return e.Te;
}
function Ls(n, e) {
  if (n.limit !== e.limit || n.orderBy.length !== e.orderBy.length) return !1;
  for (let t = 0; t < n.orderBy.length; t++) if (!AT(n.orderBy[t], e.orderBy[t])) return !1;
  if (n.filters.length !== e.filters.length) return !1;
  for (let t = 0; t < n.filters.length; t++) if (!dp(n.filters[t], e.filters[t])) return !1;
  return n.collectionGroup === e.collectionGroup && !!n.path.isEqual(e.path) && !!Rh(n.startAt, e.startAt) && Rh(n.endAt, e.endAt);
}
function Qi(n) {
  return O.isDocumentKey(n.path) && n.collectionGroup === null && n.filters.length === 0;
}
function Xi(n, e) {
  return n.filters.filter(t => t instanceof J && t.field.isEqual(e));
}
function bh(n, e, t) {
  let r = Si,
    s = !0;
  for (const i of Xi(n, e)) {
    let o = Si,
      c = !0;
    switch (i.op) {
      case "<":
      case "<=":
        o = wT(i.value);
        break;
      case "==":
      case "in":
      case ">=":
        o = i.value;
        break;
      case ">":
        o = i.value, c = !1;
        break;
      case "!=":
      case "not-in":
        o = Si;
    }
    wh({
      value: r,
      inclusive: s
    }, {
      value: o,
      inclusive: c
    }) < 0 && (r = o, s = c);
  }
  if (t !== null) {
    for (let i = 0; i < n.orderBy.length; ++i) if (n.orderBy[i].field.isEqual(e)) {
      const o = t.position[i];
      wh({
        value: r,
        inclusive: s
      }, {
        value: o,
        inclusive: t.inclusive
      }) < 0 && (r = o, s = t.inclusive);
      break;
    }
  }
  return {
    value: r,
    inclusive: s
  };
}
function Ph(n, e, t) {
  let r = $t,
    s = !0;
  for (const i of Xi(n, e)) {
    let o = $t,
      c = !0;
    switch (i.op) {
      case ">=":
      case ">":
        o = vT(i.value), c = !1;
        break;
      case "==":
      case "in":
      case "<=":
        o = i.value;
        break;
      case "<":
        o = i.value, c = !1;
        break;
      case "!=":
      case "not-in":
        o = $t;
    }
    vh({
      value: r,
      inclusive: s
    }, {
      value: o,
      inclusive: c
    }) > 0 && (r = o, s = c);
  }
  if (t !== null) {
    for (let i = 0; i < n.orderBy.length; ++i) if (n.orderBy[i].field.isEqual(e)) {
      const o = t.position[i];
      vh({
        value: r,
        inclusive: s
      }, {
        value: o,
        inclusive: t.inclusive
      }) > 0 && (r = o, s = t.inclusive);
      break;
    }
  }
  return {
    value: r,
    inclusive: s
  };
}
class qn {
  constructor(e, t = null, r = [], s = [], i = null, o = "F", c = null, u = null) {
    this.path = e, this.collectionGroup = t, this.explicitOrderBy = r, this.filters = s, this.limit = i, this.limitType = o, this.startAt = c, this.endAt = u, this.Ie = null, this.Ee = null, this.de = null, this.startAt, this.endAt;
  }
}
function DT(n, e, t, r, s, i, o, c) {
  return new qn(n, e, t, r, s, i, o, c);
}
function Fs(n) {
  return new qn(n);
}
function Sh(n) {
  return n.filters.length === 0 && n.limit === null && n.startAt == null && n.endAt == null && (n.explicitOrderBy.length === 0 || n.explicitOrderBy.length === 1 && n.explicitOrderBy[0].field.isKeyField());
}
function _p(n) {
  return n.collectionGroup !== null;
}
function ds(n) {
  const e = $(n);
  if (e.Ie === null) {
    e.Ie = [];
    const t = new Set();
    for (const i of e.explicitOrderBy) e.Ie.push(i), t.add(i.field.canonicalString());
    const r = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc";
    (function (o) {
      let c = new ne(ce.comparator);
      return o.filters.forEach(u => {
        u.getFlattenedFilters().forEach(h => {
          h.isInequality() && (c = c.add(h.field));
        });
      }), c;
    })(e).forEach(i => {
      t.has(i.canonicalString()) || i.isKeyField() || e.Ie.push(new Ps(i, r));
    }), t.has(ce.keyField().canonicalString()) || e.Ie.push(new Ps(ce.keyField(), r));
  }
  return e.Ie;
}
function Ke(n) {
  const e = $(n);
  return e.Ee || (e.Ee = NT(e, ds(n))), e.Ee;
}
function NT(n, e) {
  if (n.limitType === "F") return Ya(n.path, n.collectionGroup, e, n.filters, n.limit, n.startAt, n.endAt);
  {
    e = e.map(s => {
      const i = s.dir === "desc" ? "asc" : "desc";
      return new Ps(s.field, i);
    });
    const t = n.endAt ? new yr(n.endAt.position, n.endAt.inclusive) : null,
      r = n.startAt ? new yr(n.startAt.position, n.startAt.inclusive) : null;
    return Ya(n.path, n.collectionGroup, e, n.filters, n.limit, t, r);
  }
}
function Za(n, e) {
  const t = n.filters.concat([e]);
  return new qn(n.path, n.collectionGroup, n.explicitOrderBy.slice(), t, n.limit, n.limitType, n.startAt, n.endAt);
}
function Ji(n, e, t) {
  return new qn(n.path, n.collectionGroup, n.explicitOrderBy.slice(), n.filters.slice(), e, t, n.startAt, n.endAt);
}
function Ao(n, e) {
  return Ls(Ke(n), Ke(e)) && n.limitType === e.limitType;
}
function yp(n) {
  return `${Vn(Ke(n))}|lt:${n.limitType}`;
}
function er(n) {
  return `Query(target=${function (t) {
    let r = t.path.canonicalString();
    return t.collectionGroup !== null && (r += " collectionGroup=" + t.collectionGroup), t.filters.length > 0 && (r += `, filters: [${t.filters.map(s => pp(s)).join(", ")}]`), yo(t.limit) || (r += ", limit: " + t.limit), t.orderBy.length > 0 && (r += `, orderBy: [${t.orderBy.map(s => function (o) {
      return `${o.field.canonicalString()} (${o.dir})`;
    }(s)).join(", ")}]`), t.startAt && (r += ", startAt: ", r += t.startAt.inclusive ? "b:" : "a:", r += t.startAt.position.map(s => _r(s)).join(",")), t.endAt && (r += ", endAt: ", r += t.endAt.inclusive ? "a:" : "b:", r += t.endAt.position.map(s => _r(s)).join(",")), `Target(${r})`;
  }(Ke(n))}; limitType=${n.limitType})`;
}
function Us(n, e) {
  return e.isFoundDocument() && function (r, s) {
    const i = s.key.path;
    return r.collectionGroup !== null ? s.key.hasCollectionId(r.collectionGroup) && r.path.isPrefixOf(i) : O.isDocumentKey(r.path) ? r.path.isEqual(i) : r.path.isImmediateParentOf(i);
  }(n, e) && function (r, s) {
    for (const i of ds(r)) if (!i.field.isKeyField() && s.data.field(i.field) === null) return !1;
    return !0;
  }(n, e) && function (r, s) {
    for (const i of r.filters) if (!i.matches(s)) return !1;
    return !0;
  }(n, e) && function (r, s) {
    return !(r.startAt && !function (o, c, u) {
      const h = Ah(o, c, u);
      return o.inclusive ? h <= 0 : h < 0;
    }(r.startAt, ds(r), s) || r.endAt && !function (o, c, u) {
      const h = Ah(o, c, u);
      return o.inclusive ? h >= 0 : h > 0;
    }(r.endAt, ds(r), s));
  }(n, e);
}
function xT(n) {
  return n.collectionGroup || (n.path.length % 2 == 1 ? n.path.lastSegment() : n.path.get(n.path.length - 2));
}
function Ip(n) {
  return (e, t) => {
    let r = !1;
    for (const s of ds(n)) {
      const i = OT(s, e, t);
      if (i !== 0) return i;
      r = r || s.field.isKeyField();
    }
    return 0;
  };
}
function OT(n, e, t) {
  const r = n.field.isKeyField() ? O.comparator(e.key, t.key) : function (i, o, c) {
    const u = o.data.field(i),
      h = c.data.field(i);
    return u !== null && h !== null ? en(u, h) : L(42886);
  }(n.field, e, t);
  switch (n.dir) {
    case "asc":
      return r;
    case "desc":
      return -1 * r;
    default:
      return L(19790, {
        direction: n.dir
      });
  }
}
class Vt {
  constructor(e, t) {
    this.mapKeyFn = e, this.equalsFn = t, this.inner = {}, this.innerSize = 0;
  }
  get(e) {
    const t = this.mapKeyFn(e),
      r = this.inner[t];
    if (r !== void 0) {
      for (const [s, i] of r) if (this.equalsFn(s, e)) return i;
    }
  }
  has(e) {
    return this.get(e) !== void 0;
  }
  set(e, t) {
    const r = this.mapKeyFn(e),
      s = this.inner[r];
    if (s === void 0) return this.inner[r] = [[e, t]], void this.innerSize++;
    for (let i = 0; i < s.length; i++) if (this.equalsFn(s[i][0], e)) return void (s[i] = [e, t]);
    s.push([e, t]), this.innerSize++;
  }
  delete(e) {
    const t = this.mapKeyFn(e),
      r = this.inner[t];
    if (r === void 0) return !1;
    for (let s = 0; s < r.length; s++) if (this.equalsFn(r[s][0], e)) return r.length === 1 ? delete this.inner[t] : r.splice(s, 1), this.innerSize--, !0;
    return !1;
  }
  forEach(e) {
    sn(this.inner, (t, r) => {
      for (const [s, i] of r) e(s, i);
    });
  }
  isEmpty() {
    return ep(this.inner);
  }
  size() {
    return this.innerSize;
  }
}
const MT = new ae(O.comparator);
function je() {
  return MT;
}
const Ep = new ae(O.comparator);
function ts(...n) {
  let e = Ep;
  for (const t of n) e = e.insert(t.key, t);
  return e;
}
function Tp(n) {
  let e = Ep;
  return n.forEach((t, r) => e = e.insert(t, r.overlayedDocument)), e;
}
function st() {
  return fs();
}
function wp() {
  return fs();
}
function fs() {
  return new Vt(n => n.toString(), (n, e) => n.isEqual(e));
}
const LT = new ae(O.comparator);
const FT = new ne(O.comparator);
function H(...n) {
  let e = FT;
  for (const t of n) e = e.add(t);
  return e;
}
const UT = new ne(z);
function BT() {
  return UT;
}
function Bc(n, e) {
  if (n.useProto3Json) {
    if (isNaN(e)) return {
      doubleValue: "NaN"
    };
    if (e === 1 / 0) return {
      doubleValue: "Infinity"
    };
    if (e === -1 / 0) return {
      doubleValue: "-Infinity"
    };
  }
  return {
    doubleValue: Is(e) ? "-0" : e
  };
}
function vp(n) {
  return {
    integerValue: "" + n
  };
}
function qT(n, e) {
  return HE(e) ? vp(e) : Bc(n, e);
}
class Ro {
  constructor() {
    this._ = void 0;
  }
}
function jT(n, e, t) {
  return n instanceof Er ? function (s, i) {
    const o = {
      fields: {
        [rp]: {
          stringValue: np
        },
        [ip]: {
          timestampValue: {
            seconds: s.seconds,
            nanos: s.nanoseconds
          }
        }
      }
    };
    return i && Mc(i) && (i = wo(i)), i && (o.fields[sp] = i), {
      mapValue: o
    };
  }(t, e) : n instanceof kn ? Rp(n, e) : n instanceof Dn ? bp(n, e) : function (s, i) {
    const o = Ap(s, i),
      c = Ch(o) + Ch(s.Ae);
    return Qa(o) && Qa(s.Ae) ? vp(c) : Bc(s.serializer, c);
  }(n, e);
}
function zT(n, e, t) {
  return n instanceof kn ? Rp(n, e) : n instanceof Dn ? bp(n, e) : t;
}
function Ap(n, e) {
  return n instanceof Ss ? function (r) {
    return Qa(r) || function (i) {
      return !!i && "doubleValue" in i;
    }(r);
  }(e) ? e : {
    integerValue: 0
  } : null;
}
class Er extends Ro {}
class kn extends Ro {
  constructor(e) {
    super(), this.elements = e;
  }
}
function Rp(n, e) {
  const t = Pp(e);
  for (const r of n.elements) t.some(s => dt(s, r)) || t.push(r);
  return {
    arrayValue: {
      values: t
    }
  };
}
class Dn extends Ro {
  constructor(e) {
    super(), this.elements = e;
  }
}
function bp(n, e) {
  let t = Pp(e);
  for (const r of n.elements) t = t.filter(s => !dt(s, r));
  return {
    arrayValue: {
      values: t
    }
  };
}
class Ss extends Ro {
  constructor(e, t) {
    super(), this.serializer = e, this.Ae = t;
  }
}
function Ch(n) {
  return oe(n.integerValue || n.doubleValue);
}
function Pp(n) {
  return bs(n) && n.arrayValue.values ? n.arrayValue.values.slice() : [];
}
class bo {
  constructor(e, t) {
    this.field = e, this.transform = t;
  }
}
function $T(n, e) {
  return n.field.isEqual(e.field) && function (r, s) {
    return r instanceof kn && s instanceof kn || r instanceof Dn && s instanceof Dn ? hr(r.elements, s.elements, dt) : r instanceof Ss && s instanceof Ss ? dt(r.Ae, s.Ae) : r instanceof Er && s instanceof Er;
  }(n.transform, e.transform);
}
class GT {
  constructor(e, t) {
    this.version = e, this.transformResults = t;
  }
}
class ye {
  constructor(e, t) {
    this.updateTime = e, this.exists = t;
  }
  static none() {
    return new ye();
  }
  static exists(e) {
    return new ye(void 0, e);
  }
  static updateTime(e) {
    return new ye(e);
  }
  get isNone() {
    return this.updateTime === void 0 && this.exists === void 0;
  }
  isEqual(e) {
    return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
  }
}
function ki(n, e) {
  return n.updateTime !== void 0 ? e.isFoundDocument() && e.version.isEqual(n.updateTime) : n.exists === void 0 || n.exists === e.isFoundDocument();
}
class Po {}
function Sp(n, e) {
  if (!n.hasLocalMutations || e && e.fields.length === 0) return null;
  if (e === null) return n.isNoDocument() ? new Bs(n.key, ye.none()) : new Rr(n.key, n.data, ye.none());
  {
    const t = n.data,
      r = Ce.empty();
    let s = new ne(ce.comparator);
    for (let i of e.fields) if (!s.has(i)) {
      let o = t.field(i);
      o === null && i.length > 1 && (i = i.popLast(), o = t.field(i)), o === null ? r.delete(i) : r.set(i, o), s = s.add(i);
    }
    return new kt(n.key, r, new Ue(s.toArray()), ye.none());
  }
}
function KT(n, e, t) {
  n instanceof Rr ? function (s, i, o) {
    const c = s.value.clone(),
      u = kh(s.fieldTransforms, i, o.transformResults);
    c.setAll(u), i.convertToFoundDocument(o.version, c).setHasCommittedMutations();
  }(n, e, t) : n instanceof kt ? function (s, i, o) {
    if (!ki(s.precondition, i)) return void i.convertToUnknownDocument(o.version);
    const c = kh(s.fieldTransforms, i, o.transformResults),
      u = i.data;
    u.setAll(Cp(s)), u.setAll(c), i.convertToFoundDocument(o.version, u).setHasCommittedMutations();
  }(n, e, t) : function (s, i, o) {
    i.convertToNoDocument(o.version).setHasCommittedMutations();
  }(0, e, t);
}
function ps(n, e, t, r) {
  return n instanceof Rr ? function (i, o, c, u) {
    if (!ki(i.precondition, o)) return c;
    const h = i.value.clone(),
      f = Dh(i.fieldTransforms, u, o);
    return h.setAll(f), o.convertToFoundDocument(o.version, h).setHasLocalMutations(), null;
  }(n, e, t, r) : n instanceof kt ? function (i, o, c, u) {
    if (!ki(i.precondition, o)) return c;
    const h = Dh(i.fieldTransforms, u, o),
      f = o.data;
    return f.setAll(Cp(i)), f.setAll(h), o.convertToFoundDocument(o.version, f).setHasLocalMutations(), c === null ? null : c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m => m.field));
  }(n, e, t, r) : function (i, o, c) {
    return ki(i.precondition, o) ? (o.convertToNoDocument(o.version).setHasLocalMutations(), null) : c;
  }(n, e, t);
}
function HT(n, e) {
  let t = null;
  for (const r of n.fieldTransforms) {
    const s = e.data.field(r.field),
      i = Ap(r.transform, s || null);
    i != null && (t === null && (t = Ce.empty()), t.set(r.field, i));
  }
  return t || null;
}
function Vh(n, e) {
  return n.type === e.type && !!n.key.isEqual(e.key) && !!n.precondition.isEqual(e.precondition) && !!function (r, s) {
    return r === void 0 && s === void 0 || !(!r || !s) && hr(r, s, (i, o) => $T(i, o));
  }(n.fieldTransforms, e.fieldTransforms) && (n.type === 0 ? n.value.isEqual(e.value) : n.type !== 1 || n.data.isEqual(e.data) && n.fieldMask.isEqual(e.fieldMask));
}
class Rr extends Po {
  constructor(e, t, r, s = []) {
    super(), this.key = e, this.value = t, this.precondition = r, this.fieldTransforms = s, this.type = 0;
  }
  getFieldMask() {
    return null;
  }
}
class kt extends Po {
  constructor(e, t, r, s, i = []) {
    super(), this.key = e, this.data = t, this.fieldMask = r, this.precondition = s, this.fieldTransforms = i, this.type = 1;
  }
  getFieldMask() {
    return this.fieldMask;
  }
}
function Cp(n) {
  const e = new Map();
  return n.fieldMask.fields.forEach(t => {
    if (!t.isEmpty()) {
      const r = n.data.field(t);
      e.set(t, r);
    }
  }), e;
}
function kh(n, e, t) {
  const r = new Map();
  F(n.length === t.length, 32656, {
    Re: t.length,
    Ve: n.length
  });
  for (let s = 0; s < t.length; s++) {
    const i = n[s],
      o = i.transform,
      c = e.data.field(i.field);
    r.set(i.field, zT(o, c, t[s]));
  }
  return r;
}
function Dh(n, e, t) {
  const r = new Map();
  for (const s of n) {
    const i = s.transform,
      o = t.data.field(s.field);
    r.set(s.field, jT(i, o, e));
  }
  return r;
}
class Bs extends Po {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}
class Vp extends Po {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}
class qc {
  constructor(e, t, r, s) {
    this.batchId = e, this.localWriteTime = t, this.baseMutations = r, this.mutations = s;
  }
  applyToRemoteDocument(e, t) {
    const r = t.mutationResults;
    for (let s = 0; s < this.mutations.length; s++) {
      const i = this.mutations[s];
      i.key.isEqual(e.key) && KT(i, e, r[s]);
    }
  }
  applyToLocalView(e, t) {
    for (const r of this.baseMutations) r.key.isEqual(e.key) && (t = ps(r, e, t, this.localWriteTime));
    for (const r of this.mutations) r.key.isEqual(e.key) && (t = ps(r, e, t, this.localWriteTime));
    return t;
  }
  applyToLocalDocumentSet(e, t) {
    const r = wp();
    return this.mutations.forEach(s => {
      const i = e.get(s.key),
        o = i.overlayedDocument;
      let c = this.applyToLocalView(o, i.mutatedFields);
      c = t.has(s.key) ? null : c;
      const u = Sp(o, c);
      u !== null && r.set(s.key, u), o.isValidDocument() || o.convertToNoDocument(B.min());
    }), r;
  }
  keys() {
    return this.mutations.reduce((e, t) => e.add(t.key), H());
  }
  isEqual(e) {
    return this.batchId === e.batchId && hr(this.mutations, e.mutations, (t, r) => Vh(t, r)) && hr(this.baseMutations, e.baseMutations, (t, r) => Vh(t, r));
  }
}
class jc {
  constructor(e, t, r, s) {
    this.batch = e, this.commitVersion = t, this.mutationResults = r, this.docVersions = s;
  }
  static from(e, t, r) {
    F(e.mutations.length === r.length, 58842, {
      me: e.mutations.length,
      fe: r.length
    });
    let s = function () {
      return LT;
    }();
    const i = e.mutations;
    for (let o = 0; o < i.length; o++) s = s.insert(i[o].key, r[o].version);
    return new jc(e, t, r, s);
  }
}
class zc {
  constructor(e, t) {
    this.largestBatchId = e, this.mutation = t;
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(e) {
    return e !== null && this.mutation === e.mutation;
  }
  toString() {
    return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
  }
}
class WT {
  constructor(e, t) {
    this.count = e, this.unchangedNames = t;
  }
}
var pe;
var Y;
function QT(n) {
  switch (n) {
    case S.OK:
      return L(64938);
    case S.CANCELLED:
    case S.UNKNOWN:
    case S.DEADLINE_EXCEEDED:
    case S.RESOURCE_EXHAUSTED:
    case S.INTERNAL:
    case S.UNAVAILABLE:
    case S.UNAUTHENTICATED:
      return !1;
    case S.INVALID_ARGUMENT:
    case S.NOT_FOUND:
    case S.ALREADY_EXISTS:
    case S.PERMISSION_DENIED:
    case S.FAILED_PRECONDITION:
    case S.ABORTED:
    case S.OUT_OF_RANGE:
    case S.UNIMPLEMENTED:
    case S.DATA_LOSS:
      return !0;
    default:
      return L(15467, {
        code: n
      });
  }
}
function kp(n) {
  if (n === void 0) return Oe("GRPC error has no .code"), S.UNKNOWN;
  switch (n) {
    case pe.OK:
      return S.OK;
    case pe.CANCELLED:
      return S.CANCELLED;
    case pe.UNKNOWN:
      return S.UNKNOWN;
    case pe.DEADLINE_EXCEEDED:
      return S.DEADLINE_EXCEEDED;
    case pe.RESOURCE_EXHAUSTED:
      return S.RESOURCE_EXHAUSTED;
    case pe.INTERNAL:
      return S.INTERNAL;
    case pe.UNAVAILABLE:
      return S.UNAVAILABLE;
    case pe.UNAUTHENTICATED:
      return S.UNAUTHENTICATED;
    case pe.INVALID_ARGUMENT:
      return S.INVALID_ARGUMENT;
    case pe.NOT_FOUND:
      return S.NOT_FOUND;
    case pe.ALREADY_EXISTS:
      return S.ALREADY_EXISTS;
    case pe.PERMISSION_DENIED:
      return S.PERMISSION_DENIED;
    case pe.FAILED_PRECONDITION:
      return S.FAILED_PRECONDITION;
    case pe.ABORTED:
      return S.ABORTED;
    case pe.OUT_OF_RANGE:
      return S.OUT_OF_RANGE;
    case pe.UNIMPLEMENTED:
      return S.UNIMPLEMENTED;
    case pe.DATA_LOSS:
      return S.DATA_LOSS;
    default:
      return L(39323, {
        code: n
      });
  }
}
(Y = pe || (pe = {}))[Y.OK = 0] = "OK", Y[Y.CANCELLED = 1] = "CANCELLED", Y[Y.UNKNOWN = 2] = "UNKNOWN", Y[Y.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", Y[Y.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", Y[Y.NOT_FOUND = 5] = "NOT_FOUND", Y[Y.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", Y[Y.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", Y[Y.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", Y[Y.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", Y[Y.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", Y[Y.ABORTED = 10] = "ABORTED", Y[Y.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", Y[Y.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", Y[Y.INTERNAL = 13] = "INTERNAL", Y[Y.UNAVAILABLE = 14] = "UNAVAILABLE", Y[Y.DATA_LOSS = 15] = "DATA_LOSS";
function XT() {
  return new TextEncoder();
}
const JT = new Kt([4294967295, 4294967295], 0);
function Nh(n) {
  const e = XT().encode(n),
    t = new Cf();
  return t.update(e), new Uint8Array(t.digest());
}
function xh(n) {
  const e = new DataView(n.buffer),
    t = e.getUint32(0, !0),
    r = e.getUint32(4, !0),
    s = e.getUint32(8, !0),
    i = e.getUint32(12, !0);
  return [new Kt([t, r], 0), new Kt([s, i], 0)];
}
class $c {
  constructor(e, t, r) {
    if (this.bitmap = e, this.padding = t, this.hashCount = r, t < 0 || t >= 8) throw new ns(`Invalid padding: ${t}`);
    if (r < 0) throw new ns(`Invalid hash count: ${r}`);
    if (e.length > 0 && this.hashCount === 0) throw new ns(`Invalid hash count: ${r}`);
    if (e.length === 0 && t !== 0) throw new ns(`Invalid padding when bitmap length is 0: ${t}`);
    this.ge = 8 * e.length - t, this.pe = Kt.fromNumber(this.ge);
  }
  ye(e, t, r) {
    let s = e.add(t.multiply(Kt.fromNumber(r)));
    return s.compare(JT) === 1 && (s = new Kt([s.getBits(0), s.getBits(1)], 0)), s.modulo(this.pe).toNumber();
  }
  we(e) {
    return !!(this.bitmap[Math.floor(e / 8)] & 1 << e % 8);
  }
  mightContain(e) {
    if (this.ge === 0) return !1;
    const t = Nh(e),
      [r, s] = xh(t);
    for (let i = 0; i < this.hashCount; i++) {
      const o = this.ye(r, s, i);
      if (!this.we(o)) return !1;
    }
    return !0;
  }
  static create(e, t, r) {
    const s = e % 8 == 0 ? 0 : 8 - e % 8,
      i = new Uint8Array(Math.ceil(e / 8)),
      o = new $c(i, s, t);
    return r.forEach(c => o.insert(c)), o;
  }
  insert(e) {
    if (this.ge === 0) return;
    const t = Nh(e),
      [r, s] = xh(t);
    for (let i = 0; i < this.hashCount; i++) {
      const o = this.ye(r, s, i);
      this.Se(o);
    }
  }
  Se(e) {
    const t = Math.floor(e / 8),
      r = e % 8;
    this.bitmap[t] |= 1 << r;
  }
}
class ns extends Error {
  constructor() {
    super(...arguments), this.name = "BloomFilterError";
  }
}
class So {
  constructor(e, t, r, s, i) {
    this.snapshotVersion = e, this.targetChanges = t, this.targetMismatches = r, this.documentUpdates = s, this.resolvedLimboDocuments = i;
  }
  static createSynthesizedRemoteEventForCurrentChange(e, t, r) {
    const s = new Map();
    return s.set(e, qs.createSynthesizedTargetChangeForCurrentChange(e, t, r)), new So(B.min(), s, new ae(z), je(), H());
  }
}
class qs {
  constructor(e, t, r, s, i) {
    this.resumeToken = e, this.current = t, this.addedDocuments = r, this.modifiedDocuments = s, this.removedDocuments = i;
  }
  static createSynthesizedTargetChangeForCurrentChange(e, t, r) {
    return new qs(r, t, H(), H(), H());
  }
}
class Di {
  constructor(e, t, r, s) {
    this.be = e, this.removedTargetIds = t, this.key = r, this.De = s;
  }
}
class Dp {
  constructor(e, t) {
    this.targetId = e, this.Ce = t;
  }
}
class Np {
  constructor(e, t, r = ge.EMPTY_BYTE_STRING, s = null) {
    this.state = e, this.targetIds = t, this.resumeToken = r, this.cause = s;
  }
}
class Oh {
  constructor() {
    this.ve = 0, this.Fe = Mh(), this.Me = ge.EMPTY_BYTE_STRING, this.xe = !1, this.Oe = !0;
  }
  get current() {
    return this.xe;
  }
  get resumeToken() {
    return this.Me;
  }
  get Ne() {
    return this.ve !== 0;
  }
  get Be() {
    return this.Oe;
  }
  Le(e) {
    e.approximateByteSize() > 0 && (this.Oe = !0, this.Me = e);
  }
  ke() {
    let e = H(),
      t = H(),
      r = H();
    return this.Fe.forEach((s, i) => {
      switch (i) {
        case 0:
          e = e.add(s);
          break;
        case 2:
          t = t.add(s);
          break;
        case 1:
          r = r.add(s);
          break;
        default:
          L(38017, {
            changeType: i
          });
      }
    }), new qs(this.Me, this.xe, e, t, r);
  }
  qe() {
    this.Oe = !1, this.Fe = Mh();
  }
  Qe(e, t) {
    this.Oe = !0, this.Fe = this.Fe.insert(e, t);
  }
  $e(e) {
    this.Oe = !0, this.Fe = this.Fe.remove(e);
  }
  Ue() {
    this.ve += 1;
  }
  Ke() {
    this.ve -= 1, F(this.ve >= 0, 3241, {
      ve: this.ve
    });
  }
  We() {
    this.Oe = !0, this.xe = !0;
  }
}
class YT {
  constructor(e) {
    this.Ge = e, this.ze = new Map(), this.je = je(), this.Je = fi(), this.He = fi(), this.Ye = new ae(z);
  }
  Ze(e) {
    for (const t of e.be) e.De && e.De.isFoundDocument() ? this.Xe(t, e.De) : this.et(t, e.key, e.De);
    for (const t of e.removedTargetIds) this.et(t, e.key, e.De);
  }
  tt(e) {
    this.forEachTarget(e, t => {
      const r = this.nt(t);
      switch (e.state) {
        case 0:
          this.rt(t) && r.Le(e.resumeToken);
          break;
        case 1:
          r.Ke(), r.Ne || r.qe(), r.Le(e.resumeToken);
          break;
        case 2:
          r.Ke(), r.Ne || this.removeTarget(t);
          break;
        case 3:
          this.rt(t) && (r.We(), r.Le(e.resumeToken));
          break;
        case 4:
          this.rt(t) && (this.it(t), r.Le(e.resumeToken));
          break;
        default:
          L(56790, {
            state: e.state
          });
      }
    });
  }
  forEachTarget(e, t) {
    e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.ze.forEach((r, s) => {
      this.rt(s) && t(s);
    });
  }
  st(e) {
    const t = e.targetId,
      r = e.Ce.count,
      s = this.ot(t);
    if (s) {
      const i = s.target;
      if (Qi(i)) {
        if (r === 0) {
          const o = new O(i.path);
          this.et(t, o, le.newNoDocument(o, B.min()));
        } else F(r === 1, 20013, {
          expectedCount: r
        });
      } else {
        const o = this._t(t);
        if (o !== r) {
          const c = this.ut(e),
            u = c ? this.ct(c, e, o) : 1;
          if (u !== 0) {
            this.it(t);
            const h = u === 2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
            this.Ye = this.Ye.insert(t, h);
          }
        }
      }
    }
  }
  ut(e) {
    const t = e.Ce.unchangedNames;
    if (!t || !t.bits) return null;
    const {
      bits: {
        bitmap: r = "",
        padding: s = 0
      },
      hashCount: i = 0
    } = t;
    let o, c;
    try {
      o = Rt(r).toUint8Array();
    } catch (u) {
      if (u instanceof tp) return lr("Decoding the base64 bloom filter in existence filter failed (" + u.message + "); ignoring the bloom filter and falling back to full re-query."), null;
      throw u;
    }
    try {
      c = new $c(o, s, i);
    } catch (u) {
      return lr(u instanceof ns ? "BloomFilter error: " : "Applying bloom filter failed: ", u), null;
    }
    return c.ge === 0 ? null : c;
  }
  ct(e, t, r) {
    return t.Ce.count === r - this.Pt(e, t.targetId) ? 0 : 2;
  }
  Pt(e, t) {
    const r = this.Ge.getRemoteKeysForTarget(t);
    let s = 0;
    return r.forEach(i => {
      const o = this.Ge.ht(),
        c = `projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;
      e.mightContain(c) || (this.et(t, i, null), s++);
    }), s;
  }
  Tt(e) {
    const t = new Map();
    this.ze.forEach((i, o) => {
      const c = this.ot(o);
      if (c) {
        if (i.current && Qi(c.target)) {
          const u = new O(c.target.path);
          this.It(u).has(o) || this.Et(o, u) || this.et(o, u, le.newNoDocument(u, e));
        }
        i.Be && (t.set(o, i.ke()), i.qe());
      }
    });
    let r = H();
    this.He.forEach((i, o) => {
      let c = !0;
      o.forEachWhile(u => {
        const h = this.ot(u);
        return !h || h.purpose === "TargetPurposeLimboResolution" || (c = !1, !1);
      }), c && (r = r.add(i));
    }), this.je.forEach((i, o) => o.setReadTime(e));
    const s = new So(e, t, this.Ye, this.je, r);
    return this.je = je(), this.Je = fi(), this.He = fi(), this.Ye = new ae(z), s;
  }
  Xe(e, t) {
    if (!this.rt(e)) return;
    const r = this.Et(e, t.key) ? 2 : 0;
    this.nt(e).Qe(t.key, r), this.je = this.je.insert(t.key, t), this.Je = this.Je.insert(t.key, this.It(t.key).add(e)), this.He = this.He.insert(t.key, this.dt(t.key).add(e));
  }
  et(e, t, r) {
    if (!this.rt(e)) return;
    const s = this.nt(e);
    this.Et(e, t) ? s.Qe(t, 1) : s.$e(t), this.He = this.He.insert(t, this.dt(t).delete(e)), this.He = this.He.insert(t, this.dt(t).add(e)), r && (this.je = this.je.insert(t, r));
  }
  removeTarget(e) {
    this.ze.delete(e);
  }
  _t(e) {
    const t = this.nt(e).ke();
    return this.Ge.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size;
  }
  Ue(e) {
    this.nt(e).Ue();
  }
  nt(e) {
    let t = this.ze.get(e);
    return t || (t = new Oh(), this.ze.set(e, t)), t;
  }
  dt(e) {
    let t = this.He.get(e);
    return t || (t = new ne(z), this.He = this.He.insert(e, t)), t;
  }
  It(e) {
    let t = this.Je.get(e);
    return t || (t = new ne(z), this.Je = this.Je.insert(e, t)), t;
  }
  rt(e) {
    const t = this.ot(e) !== null;
    return t || k("WatchChangeAggregator", "Detected inactive target", e), t;
  }
  ot(e) {
    const t = this.ze.get(e);
    return t && t.Ne ? null : this.Ge.At(e);
  }
  it(e) {
    this.ze.set(e, new Oh()), this.Ge.getRemoteKeysForTarget(e).forEach(t => {
      this.et(e, t, null);
    });
  }
  Et(e, t) {
    return this.Ge.getRemoteKeysForTarget(e).has(t);
  }
}
function fi() {
  return new ae(O.comparator);
}
function Mh() {
  return new ae(O.comparator);
}
const ZT = {
  asc: "ASCENDING",
  desc: "DESCENDING"
};
const ew = {
  "<": "LESS_THAN",
  "<=": "LESS_THAN_OR_EQUAL",
  ">": "GREATER_THAN",
  ">=": "GREATER_THAN_OR_EQUAL",
  "==": "EQUAL",
  "!=": "NOT_EQUAL",
  "array-contains": "ARRAY_CONTAINS",
  in: "IN",
  "not-in": "NOT_IN",
  "array-contains-any": "ARRAY_CONTAINS_ANY"
};
const tw = {
  and: "AND",
  or: "OR"
};
class nw {
  constructor(e, t) {
    this.databaseId = e, this.useProto3Json = t;
  }
}
function ec(n, e) {
  return n.useProto3Json || yo(e) ? e : {
    value: e
  };
}
function Tr(n, e) {
  return n.useProto3Json ? `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z` : {
    seconds: "" + e.seconds,
    nanos: e.nanoseconds
  };
}
function xp(n, e) {
  return n.useProto3Json ? e.toBase64() : e.toUint8Array();
}
function rw(n, e) {
  return Tr(n, e.toTimestamp());
}
function Le(n) {
  return F(!!n, 49232), B.fromTimestamp(function (t) {
    const r = At(t);
    return new ee(r.seconds, r.nanos);
  }(n));
}
function Gc(n, e) {
  return tc(n, e).canonicalString();
}
function tc(n, e) {
  const t = function (s) {
    return new Z(["projects", s.projectId, "databases", s.database]);
  }(n).child("documents");
  return e === void 0 ? t : t.child(e);
}
function Op(n) {
  const e = Z.fromString(n);
  return F($p(e), 10190, {
    key: e.toString()
  }), e;
}
function Yi(n, e) {
  return Gc(n.databaseId, e.path);
}
function An(n, e) {
  const t = Op(e);
  if (t.get(1) !== n.databaseId.projectId) throw new D(S.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + t.get(1) + " vs " + n.databaseId.projectId);
  if (t.get(3) !== n.databaseId.database) throw new D(S.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + t.get(3) + " vs " + n.databaseId.database);
  return new O(Fp(t));
}
function Mp(n, e) {
  return Gc(n.databaseId, e);
}
function Lp(n) {
  const e = Op(n);
  return e.length === 4 ? Z.emptyPath() : Fp(e);
}
function nc(n) {
  return new Z(["projects", n.databaseId.projectId, "databases", n.databaseId.database]).canonicalString();
}
function Fp(n) {
  return F(n.length > 4 && n.get(4) === "documents", 29091, {
    key: n.toString()
  }), n.popFirst(5);
}
function Lh(n, e, t) {
  return {
    name: Yi(n, e),
    fields: t.value.mapValue.fields
  };
}
function sw(n, e, t) {
  const r = An(n, e.name),
    s = Le(e.updateTime),
    i = e.createTime ? Le(e.createTime) : B.min(),
    o = new Ce({
      mapValue: {
        fields: e.fields
      }
    }),
    c = le.newFoundDocument(r, s, i, o);
  return t && c.setHasCommittedMutations(), t ? c.setHasCommittedMutations() : c;
}
function iw(n, e) {
  let t;
  if ("targetChange" in e) {
    e.targetChange;
    const r = function (h) {
        return h === "NO_CHANGE" ? 0 : h === "ADD" ? 1 : h === "REMOVE" ? 2 : h === "CURRENT" ? 3 : h === "RESET" ? 4 : L(39313, {
          state: h
        });
      }(e.targetChange.targetChangeType || "NO_CHANGE"),
      s = e.targetChange.targetIds || [],
      i = function (h, f) {
        return h.useProto3Json ? (F(f === void 0 || typeof f == "string", 58123), ge.fromBase64String(f || "")) : (F(f === void 0 || f instanceof Buffer || f instanceof Uint8Array, 16193), ge.fromUint8Array(f || new Uint8Array()));
      }(n, e.targetChange.resumeToken),
      o = e.targetChange.cause,
      c = o && function (h) {
        const f = h.code === void 0 ? S.UNKNOWN : kp(h.code);
        return new D(f, h.message || "");
      }(o);
    t = new Np(r, s, i, c || null);
  } else if ("documentChange" in e) {
    e.documentChange;
    const r = e.documentChange;
    r.document, r.document.name, r.document.updateTime;
    const s = An(n, r.document.name),
      i = Le(r.document.updateTime),
      o = r.document.createTime ? Le(r.document.createTime) : B.min(),
      c = new Ce({
        mapValue: {
          fields: r.document.fields
        }
      }),
      u = le.newFoundDocument(s, i, o, c),
      h = r.targetIds || [],
      f = r.removedTargetIds || [];
    t = new Di(h, f, u.key, u);
  } else if ("documentDelete" in e) {
    e.documentDelete;
    const r = e.documentDelete;
    r.document;
    const s = An(n, r.document),
      i = r.readTime ? Le(r.readTime) : B.min(),
      o = le.newNoDocument(s, i),
      c = r.removedTargetIds || [];
    t = new Di([], c, o.key, o);
  } else if ("documentRemove" in e) {
    e.documentRemove;
    const r = e.documentRemove;
    r.document;
    const s = An(n, r.document),
      i = r.removedTargetIds || [];
    t = new Di([], i, s, null);
  } else {
    if (!("filter" in e)) return L(11601, {
      Rt: e
    });
    {
      e.filter;
      const r = e.filter;
      r.targetId;
      const {
          count: s = 0,
          unchangedNames: i
        } = r,
        o = new WT(s, i),
        c = r.targetId;
      t = new Dp(c, o);
    }
  }
  return t;
}
function Zi(n, e) {
  let t;
  if (e instanceof Rr) t = {
    update: Lh(n, e.key, e.value)
  };else if (e instanceof Bs) t = {
    delete: Yi(n, e.key)
  };else if (e instanceof kt) t = {
    update: Lh(n, e.key, e.data),
    updateMask: hw(e.fieldMask)
  };else {
    if (!(e instanceof Vp)) return L(16599, {
      Vt: e.type
    });
    t = {
      verify: Yi(n, e.key)
    };
  }
  return e.fieldTransforms.length > 0 && (t.updateTransforms = e.fieldTransforms.map(r => function (i, o) {
    const c = o.transform;
    if (c instanceof Er) return {
      fieldPath: o.field.canonicalString(),
      setToServerValue: "REQUEST_TIME"
    };
    if (c instanceof kn) return {
      fieldPath: o.field.canonicalString(),
      appendMissingElements: {
        values: c.elements
      }
    };
    if (c instanceof Dn) return {
      fieldPath: o.field.canonicalString(),
      removeAllFromArray: {
        values: c.elements
      }
    };
    if (c instanceof Ss) return {
      fieldPath: o.field.canonicalString(),
      increment: c.Ae
    };
    throw L(20930, {
      transform: o.transform
    });
  }(0, r))), e.precondition.isNone || (t.currentDocument = function (s, i) {
    return i.updateTime !== void 0 ? {
      updateTime: rw(s, i.updateTime)
    } : i.exists !== void 0 ? {
      exists: i.exists
    } : L(27497);
  }(n, e.precondition)), t;
}
function rc(n, e) {
  const t = e.currentDocument ? function (i) {
      return i.updateTime !== void 0 ? ye.updateTime(Le(i.updateTime)) : i.exists !== void 0 ? ye.exists(i.exists) : ye.none();
    }(e.currentDocument) : ye.none(),
    r = e.updateTransforms ? e.updateTransforms.map(s => function (o, c) {
      let u = null;
      if ("setToServerValue" in c) F(c.setToServerValue === "REQUEST_TIME", 16630, {
        proto: c
      }), u = new Er();else if ("appendMissingElements" in c) {
        const f = c.appendMissingElements.values || [];
        u = new kn(f);
      } else if ("removeAllFromArray" in c) {
        const f = c.removeAllFromArray.values || [];
        u = new Dn(f);
      } else "increment" in c ? u = new Ss(o, c.increment) : L(16584, {
        proto: c
      });
      const h = ce.fromServerFormat(c.fieldPath);
      return new bo(h, u);
    }(n, s)) : [];
  if (e.update) {
    e.update.name;
    const s = An(n, e.update.name),
      i = new Ce({
        mapValue: {
          fields: e.update.fields
        }
      });
    if (e.updateMask) {
      const o = function (u) {
        const h = u.fieldPaths || [];
        return new Ue(h.map(f => ce.fromServerFormat(f)));
      }(e.updateMask);
      return new kt(s, i, o, t, r);
    }
    return new Rr(s, i, t, r);
  }
  if (e.delete) {
    const s = An(n, e.delete);
    return new Bs(s, t);
  }
  if (e.verify) {
    const s = An(n, e.verify);
    return new Vp(s, t);
  }
  return L(1463, {
    proto: e
  });
}
function ow(n, e) {
  return n && n.length > 0 ? (F(e !== void 0, 14353), n.map(t => function (s, i) {
    let o = s.updateTime ? Le(s.updateTime) : Le(i);
    return o.isEqual(B.min()) && (o = Le(i)), new GT(o, s.transformResults || []);
  }(t, e))) : [];
}
function Up(n, e) {
  return {
    documents: [Mp(n, e.path)]
  };
}
function Bp(n, e) {
  const t = {
      structuredQuery: {}
    },
    r = e.path;
  let s;
  e.collectionGroup !== null ? (s = r, t.structuredQuery.from = [{
    collectionId: e.collectionGroup,
    allDescendants: !0
  }]) : (s = r.popLast(), t.structuredQuery.from = [{
    collectionId: r.lastSegment()
  }]), t.parent = Mp(n, s);
  const i = function (h) {
    if (h.length !== 0) return zp(te.create(h, "and"));
  }(e.filters);
  i && (t.structuredQuery.where = i);
  const o = function (h) {
    if (h.length !== 0) return h.map(f => function (_) {
      return {
        field: tr(_.field),
        direction: cw(_.dir)
      };
    }(f));
  }(e.orderBy);
  o && (t.structuredQuery.orderBy = o);
  const c = ec(n, e.limit);
  return c !== null && (t.structuredQuery.limit = c), e.startAt && (t.structuredQuery.startAt = function (h) {
    return {
      before: h.inclusive,
      values: h.position
    };
  }(e.startAt)), e.endAt && (t.structuredQuery.endAt = function (h) {
    return {
      before: !h.inclusive,
      values: h.position
    };
  }(e.endAt)), {
    ft: t,
    parent: s
  };
}
function qp(n) {
  let e = Lp(n.parent);
  const t = n.structuredQuery,
    r = t.from ? t.from.length : 0;
  let s = null;
  if (r > 0) {
    F(r === 1, 65062);
    const f = t.from[0];
    f.allDescendants ? s = f.collectionId : e = e.child(f.collectionId);
  }
  let i = [];
  t.where && (i = function (m) {
    const _ = jp(m);
    return _ instanceof te && Uc(_) ? _.getFilters() : [_];
  }(t.where));
  let o = [];
  t.orderBy && (o = function (m) {
    return m.map(_ => function (V) {
      return new Ps(nr(V.field), function (C) {
        switch (C) {
          case "ASCENDING":
            return "asc";
          case "DESCENDING":
            return "desc";
          default:
            return;
        }
      }(V.direction));
    }(_));
  }(t.orderBy));
  let c = null;
  t.limit && (c = function (m) {
    let _;
    return _ = typeof m == "object" ? m.value : m, yo(_) ? null : _;
  }(t.limit));
  let u = null;
  t.startAt && (u = function (m) {
    const _ = !!m.before,
      b = m.values || [];
    return new yr(b, _);
  }(t.startAt));
  let h = null;
  return t.endAt && (h = function (m) {
    const _ = !m.before,
      b = m.values || [];
    return new yr(b, _);
  }(t.endAt)), DT(e, s, o, i, c, "F", u, h);
}
function aw(n, e) {
  const t = function (s) {
    switch (s) {
      case "TargetPurposeListen":
        return null;
      case "TargetPurposeExistenceFilterMismatch":
        return "existence-filter-mismatch";
      case "TargetPurposeExistenceFilterMismatchBloom":
        return "existence-filter-mismatch-bloom";
      case "TargetPurposeLimboResolution":
        return "limbo-document";
      default:
        return L(28987, {
          purpose: s
        });
    }
  }(e.purpose);
  return t == null ? null : {
    "goog-listen-tags": t
  };
}
function jp(n) {
  return n.unaryFilter !== void 0 ? function (t) {
    switch (t.unaryFilter.op) {
      case "IS_NAN":
        const r = nr(t.unaryFilter.field);
        return J.create(r, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const s = nr(t.unaryFilter.field);
        return J.create(s, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const i = nr(t.unaryFilter.field);
        return J.create(i, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const o = nr(t.unaryFilter.field);
        return J.create(o, "!=", {
          nullValue: "NULL_VALUE"
        });
      case "OPERATOR_UNSPECIFIED":
        return L(61313);
      default:
        return L(60726);
    }
  }(n) : n.fieldFilter !== void 0 ? function (t) {
    return J.create(nr(t.fieldFilter.field), function (s) {
      switch (s) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        case "OPERATOR_UNSPECIFIED":
          return L(58110);
        default:
          return L(50506);
      }
    }(t.fieldFilter.op), t.fieldFilter.value);
  }(n) : n.compositeFilter !== void 0 ? function (t) {
    return te.create(t.compositeFilter.filters.map(r => jp(r)), function (s) {
      switch (s) {
        case "AND":
          return "and";
        case "OR":
          return "or";
        default:
          return L(1026);
      }
    }(t.compositeFilter.op));
  }(n) : L(30097, {
    filter: n
  });
}
function cw(n) {
  return ZT[n];
}
function uw(n) {
  return ew[n];
}
function lw(n) {
  return tw[n];
}
function tr(n) {
  return {
    fieldPath: n.canonicalString()
  };
}
function nr(n) {
  return ce.fromServerFormat(n.fieldPath);
}
function zp(n) {
  return n instanceof J ? function (t) {
    if (t.op === "==") {
      if (Th(t.value)) return {
        unaryFilter: {
          field: tr(t.field),
          op: "IS_NAN"
        }
      };
      if (Eh(t.value)) return {
        unaryFilter: {
          field: tr(t.field),
          op: "IS_NULL"
        }
      };
    } else if (t.op === "!=") {
      if (Th(t.value)) return {
        unaryFilter: {
          field: tr(t.field),
          op: "IS_NOT_NAN"
        }
      };
      if (Eh(t.value)) return {
        unaryFilter: {
          field: tr(t.field),
          op: "IS_NOT_NULL"
        }
      };
    }
    return {
      fieldFilter: {
        field: tr(t.field),
        op: uw(t.op),
        value: t.value
      }
    };
  }(n) : n instanceof te ? function (t) {
    const r = t.getFilters().map(s => zp(s));
    return r.length === 1 ? r[0] : {
      compositeFilter: {
        op: lw(t.op),
        filters: r
      }
    };
  }(n) : L(54877, {
    filter: n
  });
}
function hw(n) {
  const e = [];
  return n.fields.forEach(t => e.push(t.canonicalString())), {
    fieldPaths: e
  };
}
function $p(n) {
  return n.length >= 4 && n.get(0) === "projects" && n.get(2) === "databases";
}
class Et {
  constructor(e, t, r, s, i = B.min(), o = B.min(), c = ge.EMPTY_BYTE_STRING, u = null) {
    this.target = e, this.targetId = t, this.purpose = r, this.sequenceNumber = s, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = o, this.resumeToken = c, this.expectedCount = u;
  }
  withSequenceNumber(e) {
    return new Et(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
  }
  withResumeToken(e, t) {
    return new Et(this.target, this.targetId, this.purpose, this.sequenceNumber, t, this.lastLimboFreeSnapshotVersion, e, null);
  }
  withExpectedCount(e) {
    return new Et(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
  }
  withLastLimboFreeSnapshotVersion(e) {
    return new Et(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
  }
}
class Gp {
  constructor(e) {
    this.yt = e;
  }
}
function dw(n, e) {
  let t;
  if (e.document) t = sw(n.yt, e.document, !!e.hasCommittedMutations);else if (e.noDocument) {
    const r = O.fromSegments(e.noDocument.path),
      s = xn(e.noDocument.readTime);
    t = le.newNoDocument(r, s), e.hasCommittedMutations && t.setHasCommittedMutations();
  } else {
    if (!e.unknownDocument) return L(56709);
    {
      const r = O.fromSegments(e.unknownDocument.path),
        s = xn(e.unknownDocument.version);
      t = le.newUnknownDocument(r, s);
    }
  }
  return e.readTime && t.setReadTime(function (s) {
    const i = new ee(s[0], s[1]);
    return B.fromTimestamp(i);
  }(e.readTime)), t;
}
function Fh(n, e) {
  const t = e.key,
    r = {
      prefixPath: t.getCollectionPath().popLast().toArray(),
      collectionGroup: t.collectionGroup,
      documentId: t.path.lastSegment(),
      readTime: eo(e.readTime),
      hasCommittedMutations: e.hasCommittedMutations
    };
  if (e.isFoundDocument()) r.document = function (i, o) {
    return {
      name: Yi(i, o.key),
      fields: o.data.value.mapValue.fields,
      updateTime: Tr(i, o.version.toTimestamp()),
      createTime: Tr(i, o.createTime.toTimestamp())
    };
  }(n.yt, e);else if (e.isNoDocument()) r.noDocument = {
    path: t.path.toArray(),
    readTime: Nn(e.version)
  };else {
    if (!e.isUnknownDocument()) return L(57904, {
      document: e
    });
    r.unknownDocument = {
      path: t.path.toArray(),
      version: Nn(e.version)
    };
  }
  return r;
}
function eo(n) {
  const e = n.toTimestamp();
  return [e.seconds, e.nanoseconds];
}
function Nn(n) {
  const e = n.toTimestamp();
  return {
    seconds: e.seconds,
    nanoseconds: e.nanoseconds
  };
}
function xn(n) {
  const e = new ee(n.seconds, n.nanoseconds);
  return B.fromTimestamp(e);
}
function _n(n, e) {
  const t = (e.baseMutations || []).map(i => rc(n.yt, i));
  for (let i = 0; i < e.mutations.length - 1; ++i) {
    const o = e.mutations[i];
    if (i + 1 < e.mutations.length && e.mutations[i + 1].transform !== void 0) {
      const c = e.mutations[i + 1];
      o.updateTransforms = c.transform.fieldTransforms, e.mutations.splice(i + 1, 1), ++i;
    }
  }
  const r = e.mutations.map(i => rc(n.yt, i)),
    s = ee.fromMillis(e.localWriteTimeMs);
  return new qc(e.batchId, s, t, r);
}
function rs(n) {
  const e = xn(n.readTime),
    t = n.lastLimboFreeSnapshotVersion !== void 0 ? xn(n.lastLimboFreeSnapshotVersion) : B.min();
  let r;
  return r = function (i) {
    return i.documents !== void 0;
  }(n.query) ? function (i) {
    const o = i.documents.length;
    return F(o === 1, 1966, {
      count: o
    }), Ke(Fs(Lp(i.documents[0])));
  }(n.query) : function (i) {
    return Ke(qp(i));
  }(n.query), new Et(r, n.targetId, "TargetPurposeListen", n.lastListenSequenceNumber, e, t, ge.fromBase64String(n.resumeToken));
}
function Kp(n, e) {
  const t = Nn(e.snapshotVersion),
    r = Nn(e.lastLimboFreeSnapshotVersion);
  let s;
  s = Qi(e.target) ? Up(n.yt, e.target) : Bp(n.yt, e.target).ft;
  const i = e.resumeToken.toBase64();
  return {
    targetId: e.targetId,
    canonicalId: Vn(e.target),
    readTime: t,
    resumeToken: i,
    lastListenSequenceNumber: e.sequenceNumber,
    lastLimboFreeSnapshotVersion: r,
    query: s
  };
}
function Hp(n) {
  const e = qp({
    parent: n.parent,
    structuredQuery: n.structuredQuery
  });
  return n.limitType === "LAST" ? Ji(e, e.limit, "L") : e;
}
function Ta(n, e) {
  return new zc(e.largestBatchId, rc(n.yt, e.overlayMutation));
}
function Uh(n, e) {
  const t = e.path.lastSegment();
  return [n, Ve(e.path.popLast()), t];
}
function Bh(n, e, t, r) {
  return {
    indexId: n,
    uid: e,
    sequenceNumber: t,
    readTime: Nn(r.readTime),
    documentKey: Ve(r.documentKey.path),
    largestBatchId: r.largestBatchId
  };
}
class fw {
  getBundleMetadata(e, t) {
    return qh(e).get(t).next(r => {
      if (r) return function (i) {
        return {
          id: i.bundleId,
          createTime: xn(i.createTime),
          version: i.version
        };
      }(r);
    });
  }
  saveBundleMetadata(e, t) {
    return qh(e).put(function (s) {
      return {
        bundleId: s.id,
        createTime: Nn(Le(s.createTime)),
        version: s.version
      };
    }(t));
  }
  getNamedQuery(e, t) {
    return jh(e).get(t).next(r => {
      if (r) return function (i) {
        return {
          name: i.name,
          query: Hp(i.bundledQuery),
          readTime: xn(i.readTime)
        };
      }(r);
    });
  }
  saveNamedQuery(e, t) {
    return jh(e).put(function (s) {
      return {
        name: s.name,
        readTime: Nn(Le(s.readTime)),
        bundledQuery: s.bundledQuery
      };
    }(t));
  }
}
function qh(n) {
  return Ee(n, Io);
}
function jh(n) {
  return Ee(n, Eo);
}
class Co {
  constructor(e, t) {
    this.serializer = e, this.userId = t;
  }
  static wt(e, t) {
    const r = t.uid || "";
    return new Co(e, r);
  }
  getOverlay(e, t) {
    return Kr(e).get(Uh(this.userId, t)).next(r => r ? Ta(this.serializer, r) : null);
  }
  getOverlays(e, t) {
    const r = st();
    return v.forEach(t, s => this.getOverlay(e, s).next(i => {
      i !== null && r.set(s, i);
    })).next(() => r);
  }
  saveOverlays(e, t, r) {
    const s = [];
    return r.forEach((i, o) => {
      const c = new zc(t, o);
      s.push(this.St(e, c));
    }), v.waitFor(s);
  }
  removeOverlaysForBatchId(e, t, r) {
    const s = new Set();
    t.forEach(o => s.add(Ve(o.getCollectionPath())));
    const i = [];
    return s.forEach(o => {
      const c = IDBKeyRange.bound([this.userId, o, r], [this.userId, o, r + 1], !1, !0);
      i.push(Kr(e).Z(Ka, c));
    }), v.waitFor(i);
  }
  getOverlaysForCollection(e, t, r) {
    const s = st(),
      i = Ve(t),
      o = IDBKeyRange.bound([this.userId, i, r], [this.userId, i, Number.POSITIVE_INFINITY], !0);
    return Kr(e).J(Ka, o).next(c => {
      for (const u of c) {
        const h = Ta(this.serializer, u);
        s.set(h.getKey(), h);
      }
      return s;
    });
  }
  getOverlaysForCollectionGroup(e, t, r, s) {
    const i = st();
    let o;
    const c = IDBKeyRange.bound([this.userId, t, r], [this.userId, t, Number.POSITIVE_INFINITY], !0);
    return Kr(e).ee({
      index: Qf,
      range: c
    }, (u, h, f) => {
      const m = Ta(this.serializer, h);
      i.size() < s || m.largestBatchId === o ? (i.set(m.getKey(), m), o = m.largestBatchId) : f.done();
    }).next(() => i);
  }
  St(e, t) {
    return Kr(e).put(function (s, i, o) {
      const [c, u, h] = Uh(i, o.mutation.key);
      return {
        userId: i,
        collectionPath: u,
        documentId: h,
        collectionGroup: o.mutation.key.getCollectionGroup(),
        largestBatchId: o.largestBatchId,
        overlayMutation: Zi(s.yt, o.mutation)
      };
    }(this.serializer, this.userId, t));
  }
}
function Kr(n) {
  return Ee(n, To);
}
class pw {
  bt(e) {
    return Ee(e, xc);
  }
  getSessionToken(e) {
    return this.bt(e).get("sessionToken").next(t => {
      const r = t?.value;
      return r ? ge.fromUint8Array(r) : ge.EMPTY_BYTE_STRING;
    });
  }
  setSessionToken(e, t) {
    return this.bt(e).put({
      name: "sessionToken",
      value: t.toUint8Array()
    });
  }
}
class yn {
  constructor() {}
  Dt(e, t) {
    this.Ct(e, t), t.vt();
  }
  Ct(e, t) {
    if ("nullValue" in e) this.Ft(t, 5);else if ("booleanValue" in e) this.Ft(t, 10), t.Mt(e.booleanValue ? 1 : 0);else if ("integerValue" in e) this.Ft(t, 15), t.Mt(oe(e.integerValue));else if ("doubleValue" in e) {
      const r = oe(e.doubleValue);
      isNaN(r) ? this.Ft(t, 13) : (this.Ft(t, 15), Is(r) ? t.Mt(0) : t.Mt(r));
    } else if ("timestampValue" in e) {
      let r = e.timestampValue;
      this.Ft(t, 20), typeof r == "string" && (r = At(r)), t.xt(`${r.seconds || ""}`), t.Mt(r.nanos || 0);
    } else if ("stringValue" in e) this.Ot(e.stringValue, t), this.Nt(t);else if ("bytesValue" in e) this.Ft(t, 30), t.Bt(Rt(e.bytesValue)), this.Nt(t);else if ("referenceValue" in e) this.Lt(e.referenceValue, t);else if ("geoPointValue" in e) {
      const r = e.geoPointValue;
      this.Ft(t, 45), t.Mt(r.latitude || 0), t.Mt(r.longitude || 0);
    } else "mapValue" in e ? ap(e) ? this.Ft(t, Number.MAX_SAFE_INTEGER) : vo(e) ? this.kt(e.mapValue, t) : (this.qt(e.mapValue, t), this.Nt(t)) : "arrayValue" in e ? (this.Qt(e.arrayValue, t), this.Nt(t)) : L(19022, {
      $t: e
    });
  }
  Ot(e, t) {
    this.Ft(t, 25), this.Ut(e, t);
  }
  Ut(e, t) {
    t.xt(e);
  }
  qt(e, t) {
    const r = e.fields || {};
    this.Ft(t, 55);
    for (const s of Object.keys(r)) this.Ot(s, t), this.Ct(r[s], t);
  }
  kt(e, t) {
    const r = e.fields || {};
    this.Ft(t, 53);
    const s = gr,
      i = r[s].arrayValue?.values?.length || 0;
    this.Ft(t, 15), t.Mt(oe(i)), this.Ot(s, t), this.Ct(r[s], t);
  }
  Qt(e, t) {
    const r = e.values || [];
    this.Ft(t, 50);
    for (const s of r) this.Ct(s, t);
  }
  Lt(e, t) {
    this.Ft(t, 37), O.fromName(e).path.forEach(r => {
      this.Ft(t, 60), this.Ut(r, t);
    });
  }
  Ft(e, t) {
    e.Mt(t);
  }
  Nt(e) {
    e.Mt(2);
  }
}
yn.Kt = new yn();
const Qn = 255;
function mw(n) {
  if (n === 0) return 8;
  let e = 0;
  return n >> 4 || (e += 4, n <<= 4), n >> 6 || (e += 2, n <<= 2), n >> 7 || (e += 1), e;
}
function zh(n) {
  const e = 64 - function (r) {
    let s = 0;
    for (let i = 0; i < 8; ++i) {
      const o = mw(255 & r[i]);
      if (s += o, o !== 8) break;
    }
    return s;
  }(n);
  return Math.ceil(e / 8);
}
class gw {
  constructor() {
    this.buffer = new Uint8Array(1024), this.position = 0;
  }
  Wt(e) {
    const t = e[Symbol.iterator]();
    let r = t.next();
    for (; !r.done;) this.Gt(r.value), r = t.next();
    this.zt();
  }
  jt(e) {
    const t = e[Symbol.iterator]();
    let r = t.next();
    for (; !r.done;) this.Jt(r.value), r = t.next();
    this.Ht();
  }
  Yt(e) {
    for (const t of e) {
      const r = t.charCodeAt(0);
      if (r < 128) this.Gt(r);else if (r < 2048) this.Gt(960 | r >>> 6), this.Gt(128 | 63 & r);else if (t < "\uD800" || "\uDBFF" < t) this.Gt(480 | r >>> 12), this.Gt(128 | 63 & r >>> 6), this.Gt(128 | 63 & r);else {
        const s = t.codePointAt(0);
        this.Gt(240 | s >>> 18), this.Gt(128 | 63 & s >>> 12), this.Gt(128 | 63 & s >>> 6), this.Gt(128 | 63 & s);
      }
    }
    this.zt();
  }
  Zt(e) {
    for (const t of e) {
      const r = t.charCodeAt(0);
      if (r < 128) this.Jt(r);else if (r < 2048) this.Jt(960 | r >>> 6), this.Jt(128 | 63 & r);else if (t < "\uD800" || "\uDBFF" < t) this.Jt(480 | r >>> 12), this.Jt(128 | 63 & r >>> 6), this.Jt(128 | 63 & r);else {
        const s = t.codePointAt(0);
        this.Jt(240 | s >>> 18), this.Jt(128 | 63 & s >>> 12), this.Jt(128 | 63 & s >>> 6), this.Jt(128 | 63 & s);
      }
    }
    this.Ht();
  }
  Xt(e) {
    const t = this.en(e),
      r = zh(t);
    this.tn(1 + r), this.buffer[this.position++] = 255 & r;
    for (let s = t.length - r; s < t.length; ++s) this.buffer[this.position++] = 255 & t[s];
  }
  nn(e) {
    const t = this.en(e),
      r = zh(t);
    this.tn(1 + r), this.buffer[this.position++] = ~(255 & r);
    for (let s = t.length - r; s < t.length; ++s) this.buffer[this.position++] = ~(255 & t[s]);
  }
  rn() {
    this.sn(Qn), this.sn(255);
  }
  _n() {
    this.an(Qn), this.an(255);
  }
  reset() {
    this.position = 0;
  }
  seed(e) {
    this.tn(e.length), this.buffer.set(e, this.position), this.position += e.length;
  }
  un() {
    return this.buffer.slice(0, this.position);
  }
  en(e) {
    const t = function (i) {
        const o = new DataView(new ArrayBuffer(8));
        return o.setFloat64(0, i, !1), new Uint8Array(o.buffer);
      }(e),
      r = !!(128 & t[0]);
    t[0] ^= r ? 255 : 128;
    for (let s = 1; s < t.length; ++s) t[s] ^= r ? 255 : 0;
    return t;
  }
  Gt(e) {
    const t = 255 & e;
    t === 0 ? (this.sn(0), this.sn(255)) : t === Qn ? (this.sn(Qn), this.sn(0)) : this.sn(t);
  }
  Jt(e) {
    const t = 255 & e;
    t === 0 ? (this.an(0), this.an(255)) : t === Qn ? (this.an(Qn), this.an(0)) : this.an(e);
  }
  zt() {
    this.sn(0), this.sn(1);
  }
  Ht() {
    this.an(0), this.an(1);
  }
  sn(e) {
    this.tn(1), this.buffer[this.position++] = e;
  }
  an(e) {
    this.tn(1), this.buffer[this.position++] = ~e;
  }
  tn(e) {
    const t = e + this.position;
    if (t <= this.buffer.length) return;
    let r = 2 * this.buffer.length;
    r < t && (r = t);
    const s = new Uint8Array(r);
    s.set(this.buffer), this.buffer = s;
  }
}
class _w {
  constructor(e) {
    this.cn = e;
  }
  Bt(e) {
    this.cn.Wt(e);
  }
  xt(e) {
    this.cn.Yt(e);
  }
  Mt(e) {
    this.cn.Xt(e);
  }
  vt() {
    this.cn.rn();
  }
}
class yw {
  constructor(e) {
    this.cn = e;
  }
  Bt(e) {
    this.cn.jt(e);
  }
  xt(e) {
    this.cn.Zt(e);
  }
  Mt(e) {
    this.cn.nn(e);
  }
  vt() {
    this.cn._n();
  }
}
class Hr {
  constructor() {
    this.cn = new gw(), this.ln = new _w(this.cn), this.hn = new yw(this.cn);
  }
  seed(e) {
    this.cn.seed(e);
  }
  Pn(e) {
    return e === 0 ? this.ln : this.hn;
  }
  un() {
    return this.cn.un();
  }
  reset() {
    this.cn.reset();
  }
}
class In {
  constructor(e, t, r, s) {
    this.Tn = e, this.In = t, this.En = r, this.dn = s;
  }
  An() {
    const e = this.dn.length,
      t = e === 0 || this.dn[e - 1] === 255 ? e + 1 : e,
      r = new Uint8Array(t);
    return r.set(this.dn, 0), t !== e ? r.set([0], this.dn.length) : ++r[r.length - 1], new In(this.Tn, this.In, this.En, r);
  }
  Rn(e, t, r) {
    return {
      indexId: this.Tn,
      uid: e,
      arrayValue: Ni(this.En),
      directionalValue: Ni(this.dn),
      orderedDocumentKey: Ni(t),
      documentKey: r.path.toArray()
    };
  }
  Vn(e, t, r) {
    const s = this.Rn(e, t, r);
    return [s.indexId, s.uid, s.arrayValue, s.directionalValue, s.orderedDocumentKey, s.documentKey];
  }
}
function Ut(n, e) {
  let t = n.Tn - e.Tn;
  return t !== 0 ? t : (t = $h(n.En, e.En), t !== 0 ? t : (t = $h(n.dn, e.dn), t !== 0 ? t : O.comparator(n.In, e.In)));
}
function $h(n, e) {
  for (let t = 0; t < n.length && t < e.length; ++t) {
    const r = n[t] - e[t];
    if (r !== 0) return r;
  }
  return n.length - e.length;
}
function Ni(n) {
  return Ud() ? function (t) {
    let r = "";
    for (let s = 0; s < t.length; s++) r += String.fromCharCode(t[s]);
    return r;
  }(n) : n;
}
function Gh(n) {
  return typeof n != "string" ? n : function (t) {
    const r = new Uint8Array(t.length);
    for (let s = 0; s < t.length; s++) r[s] = t.charCodeAt(s);
    return r;
  }(n);
}
class Kh {
  constructor(e) {
    this.mn = new ne((t, r) => ce.comparator(t.field, r.field)), this.collectionId = e.collectionGroup != null ? e.collectionGroup : e.path.lastSegment(), this.fn = e.orderBy, this.gn = [];
    for (const t of e.filters) {
      const r = t;
      r.isInequality() ? this.mn = this.mn.add(r) : this.gn.push(r);
    }
  }
  get pn() {
    return this.mn.size > 1;
  }
  yn(e) {
    if (F(e.collectionGroup === this.collectionId, 49279), this.pn) return !1;
    const t = za(e);
    if (t !== void 0 && !this.wn(t)) return !1;
    const r = pn(e);
    let s = new Set(),
      i = 0,
      o = 0;
    for (; i < r.length && this.wn(r[i]); ++i) s = s.add(r[i].fieldPath.canonicalString());
    if (i === r.length) return !0;
    if (this.mn.size > 0) {
      const c = this.mn.getIterator().getNext();
      if (!s.has(c.field.canonicalString())) {
        const u = r[i];
        if (!this.Sn(c, u) || !this.bn(this.fn[o++], u)) return !1;
      }
      ++i;
    }
    for (; i < r.length; ++i) {
      const c = r[i];
      if (o >= this.fn.length || !this.bn(this.fn[o++], c)) return !1;
    }
    return !0;
  }
  Dn() {
    if (this.pn) return null;
    let e = new ne(ce.comparator);
    const t = [];
    for (const r of this.gn) if (!r.field.isKeyField()) if (r.op === "array-contains" || r.op === "array-contains-any") t.push(new Ri(r.field, 2));else {
      if (e.has(r.field)) continue;
      e = e.add(r.field), t.push(new Ri(r.field, 0));
    }
    for (const r of this.fn) r.field.isKeyField() || e.has(r.field) || (e = e.add(r.field), t.push(new Ri(r.field, r.dir === "asc" ? 0 : 1)));
    return new $i($i.UNKNOWN_ID, this.collectionId, t, ys.empty());
  }
  wn(e) {
    for (const t of this.gn) if (this.Sn(t, e)) return !0;
    return !1;
  }
  Sn(e, t) {
    if (e === void 0 || !e.field.isEqual(t.fieldPath)) return !1;
    const r = e.op === "array-contains" || e.op === "array-contains-any";
    return t.kind === 2 === r;
  }
  bn(e, t) {
    return !!e.field.isEqual(t.fieldPath) && (t.kind === 0 && e.dir === "asc" || t.kind === 1 && e.dir === "desc");
  }
}
function Wp(n) {
  if (F(n instanceof J || n instanceof te, 20012), n instanceof J) {
    if (n instanceof gp) {
      const t = n.value.arrayValue?.values?.map(r => J.create(n.field, "==", r)) || [];
      return te.create(t, "or");
    }
    return n;
  }
  const e = n.filters.map(t => Wp(t));
  return te.create(e, n.op);
}
function Iw(n) {
  if (n.getFilters().length === 0) return [];
  const e = oc(Wp(n));
  return F(Qp(e), 7391), sc(e) || ic(e) ? [e] : e.getFilters();
}
function sc(n) {
  return n instanceof J;
}
function ic(n) {
  return n instanceof te && Uc(n);
}
function Qp(n) {
  return sc(n) || ic(n) || function (t) {
    if (t instanceof te && Xa(t)) {
      for (const r of t.getFilters()) if (!sc(r) && !ic(r)) return !1;
      return !0;
    }
    return !1;
  }(n);
}
function oc(n) {
  if (F(n instanceof J || n instanceof te, 34018), n instanceof J) return n;
  if (n.filters.length === 1) return oc(n.filters[0]);
  const e = n.filters.map(r => oc(r));
  let t = te.create(e, n.op);
  return t = to(t), Qp(t) ? t : (F(t instanceof te, 64498), F(Ir(t), 40251), F(t.filters.length > 1, 57927), t.filters.reduce((r, s) => Kc(r, s)));
}
function Kc(n, e) {
  let t;
  return F(n instanceof J || n instanceof te, 38388), F(e instanceof J || e instanceof te, 25473), t = n instanceof J ? e instanceof J ? function (s, i) {
    return te.create([s, i], "and");
  }(n, e) : Hh(n, e) : e instanceof J ? Hh(e, n) : function (s, i) {
    if (F(s.filters.length > 0 && i.filters.length > 0, 48005), Ir(s) && Ir(i)) return fp(s, i.getFilters());
    const o = Xa(s) ? s : i,
      c = Xa(s) ? i : s,
      u = o.filters.map(h => Kc(h, c));
    return te.create(u, "or");
  }(n, e), to(t);
}
function Hh(n, e) {
  if (Ir(e)) return fp(e, n.getFilters());
  {
    const t = e.filters.map(r => Kc(n, r));
    return te.create(t, "or");
  }
}
function to(n) {
  if (F(n instanceof J || n instanceof te, 11850), n instanceof J) return n;
  const e = n.getFilters();
  if (e.length === 1) return to(e[0]);
  if (hp(n)) return n;
  const t = e.map(s => to(s)),
    r = [];
  return t.forEach(s => {
    s instanceof J ? r.push(s) : s instanceof te && (s.op === n.op ? r.push(...s.filters) : r.push(s));
  }), r.length === 1 ? r[0] : te.create(r, n.op);
}
class Ew {
  constructor() {
    this.Cn = new Hc();
  }
  addToCollectionParentIndex(e, t) {
    return this.Cn.add(t), v.resolve();
  }
  getCollectionParents(e, t) {
    return v.resolve(this.Cn.getEntries(t));
  }
  addFieldIndex(e, t) {
    return v.resolve();
  }
  deleteFieldIndex(e, t) {
    return v.resolve();
  }
  deleteAllFieldIndexes(e) {
    return v.resolve();
  }
  createTargetIndexes(e, t) {
    return v.resolve();
  }
  getDocumentsMatchingTarget(e, t) {
    return v.resolve(null);
  }
  getIndexType(e, t) {
    return v.resolve(0);
  }
  getFieldIndexes(e, t) {
    return v.resolve([]);
  }
  getNextCollectionGroupToUpdate(e) {
    return v.resolve(null);
  }
  getMinOffset(e, t) {
    return v.resolve(ze.min());
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return v.resolve(ze.min());
  }
  updateCollectionGroup(e, t, r) {
    return v.resolve();
  }
  updateIndexEntries(e, t) {
    return v.resolve();
  }
}
class Hc {
  constructor() {
    this.index = {};
  }
  add(e) {
    const t = e.lastSegment(),
      r = e.popLast(),
      s = this.index[t] || new ne(Z.comparator),
      i = !s.has(r);
    return this.index[t] = s.add(r), i;
  }
  has(e) {
    const t = e.lastSegment(),
      r = e.popLast(),
      s = this.index[t];
    return s && s.has(r);
  }
  getEntries(e) {
    return (this.index[e] || new ne(Z.comparator)).toArray();
  }
}
const Wh = "IndexedDbIndexManager";
const pi = new Uint8Array(0);
class Tw {
  constructor(e, t) {
    this.databaseId = t, this.vn = new Hc(), this.Fn = new Vt(r => Vn(r), (r, s) => Ls(r, s)), this.uid = e.uid || "";
  }
  addToCollectionParentIndex(e, t) {
    if (!this.vn.has(t)) {
      const r = t.lastSegment(),
        s = t.popLast();
      e.addOnCommittedListener(() => {
        this.vn.add(t);
      });
      const i = {
        collectionId: r,
        parent: Ve(s)
      };
      return Qh(e).put(i);
    }
    return v.resolve();
  }
  getCollectionParents(e, t) {
    const r = [],
      s = IDBKeyRange.bound([t, ""], [Lf(t), ""], !1, !0);
    return Qh(e).J(s).next(i => {
      for (const o of i) {
        if (o.collectionId !== t) break;
        r.push(rt(o.parent));
      }
      return r;
    });
  }
  addFieldIndex(e, t) {
    const r = Wr(e),
      s = function (c) {
        return {
          indexId: c.indexId,
          collectionGroup: c.collectionGroup,
          fields: c.fields.map(u => [u.fieldPath.canonicalString(), u.kind])
        };
      }(t);
    delete s.indexId;
    const i = r.add(s);
    if (t.indexState) {
      const o = Jn(e);
      return i.next(c => {
        o.put(Bh(c, this.uid, t.indexState.sequenceNumber, t.indexState.offset));
      });
    }
    return i.next();
  }
  deleteFieldIndex(e, t) {
    const r = Wr(e),
      s = Jn(e),
      i = Xn(e);
    return r.delete(t.indexId).next(() => s.delete(IDBKeyRange.bound([t.indexId], [t.indexId + 1], !1, !0))).next(() => i.delete(IDBKeyRange.bound([t.indexId], [t.indexId + 1], !1, !0)));
  }
  deleteAllFieldIndexes(e) {
    const t = Wr(e),
      r = Xn(e),
      s = Jn(e);
    return t.Z().next(() => r.Z()).next(() => s.Z());
  }
  createTargetIndexes(e, t) {
    return v.forEach(this.Mn(t), r => this.getIndexType(e, r).next(s => {
      if (s === 0 || s === 1) {
        const i = new Kh(r).Dn();
        if (i != null) return this.addFieldIndex(e, i);
      }
    }));
  }
  getDocumentsMatchingTarget(e, t) {
    const r = Xn(e);
    let s = !0;
    const i = new Map();
    return v.forEach(this.Mn(t), o => this.xn(e, o).next(c => {
      s && (s = !!c), i.set(o, c);
    })).next(() => {
      if (s) {
        let o = H();
        const c = [];
        return v.forEach(i, (u, h) => {
          k(Wh, `Using index ${function (M) {
            return `id=${M.indexId}|cg=${M.collectionGroup}|f=${M.fields.map(G => `${G.fieldPath}:${G.kind}`).join(",")}`;
          }(u)} to execute ${Vn(t)}`);
          const f = function (M, G) {
              const Q = za(G);
              if (Q === void 0) return null;
              for (const W of Xi(M, Q.fieldPath)) switch (W.op) {
                case "array-contains-any":
                  return W.value.arrayValue.values || [];
                case "array-contains":
                  return [W.value];
              }
              return null;
            }(h, u),
            m = function (M, G) {
              const Q = new Map();
              for (const W of pn(G)) for (const E of Xi(M, W.fieldPath)) switch (E.op) {
                case "==":
                case "in":
                  Q.set(W.fieldPath.canonicalString(), E.value);
                  break;
                case "not-in":
                case "!=":
                  return Q.set(W.fieldPath.canonicalString(), E.value), Array.from(Q.values());
              }
              return null;
            }(h, u),
            _ = function (M, G) {
              const Q = [];
              let W = !0;
              for (const E of pn(G)) {
                const g = E.kind === 0 ? bh(M, E.fieldPath, M.startAt) : Ph(M, E.fieldPath, M.startAt);
                Q.push(g.value), W && (W = g.inclusive);
              }
              return new yr(Q, W);
            }(h, u),
            b = function (M, G) {
              const Q = [];
              let W = !0;
              for (const E of pn(G)) {
                const g = E.kind === 0 ? Ph(M, E.fieldPath, M.endAt) : bh(M, E.fieldPath, M.endAt);
                Q.push(g.value), W && (W = g.inclusive);
              }
              return new yr(Q, W);
            }(h, u),
            V = this.On(u, h, _),
            N = this.On(u, h, b),
            C = this.Nn(u, h, m),
            q = this.Bn(u.indexId, f, V, _.inclusive, N, b.inclusive, C);
          return v.forEach(q, U => r.Y(U, t.limit).next(M => {
            M.forEach(G => {
              const Q = O.fromSegments(G.documentKey);
              o.has(Q) || (o = o.add(Q), c.push(Q));
            });
          }));
        }).next(() => c);
      }
      return v.resolve(null);
    });
  }
  Mn(e) {
    let t = this.Fn.get(e);
    return t || (e.filters.length === 0 ? t = [e] : t = Iw(te.create(e.filters, "and")).map(r => Ya(e.path, e.collectionGroup, e.orderBy, r.getFilters(), e.limit, e.startAt, e.endAt)), this.Fn.set(e, t), t);
  }
  Bn(e, t, r, s, i, o, c) {
    const u = (t != null ? t.length : 1) * Math.max(r.length, i.length),
      h = u / (t != null ? t.length : 1),
      f = [];
    for (let m = 0; m < u; ++m) {
      const _ = t ? this.Ln(t[m / h]) : pi,
        b = this.kn(e, _, r[m % h], s),
        V = this.qn(e, _, i[m % h], o),
        N = c.map(C => this.kn(e, _, C, !0));
      f.push(...this.createRange(b, V, N));
    }
    return f;
  }
  kn(e, t, r, s) {
    const i = new In(e, O.empty(), t, r);
    return s ? i : i.An();
  }
  qn(e, t, r, s) {
    const i = new In(e, O.empty(), t, r);
    return s ? i.An() : i;
  }
  xn(e, t) {
    const r = new Kh(t),
      s = t.collectionGroup != null ? t.collectionGroup : t.path.lastSegment();
    return this.getFieldIndexes(e, s).next(i => {
      let o = null;
      for (const c of i) r.yn(c) && (!o || c.fields.length > o.fields.length) && (o = c);
      return o;
    });
  }
  getIndexType(e, t) {
    let r = 2;
    const s = this.Mn(t);
    return v.forEach(s, i => this.xn(e, i).next(o => {
      o ? r !== 0 && o.fields.length < function (u) {
        let h = new ne(ce.comparator),
          f = !1;
        for (const m of u.filters) for (const _ of m.getFlattenedFilters()) _.field.isKeyField() || (_.op === "array-contains" || _.op === "array-contains-any" ? f = !0 : h = h.add(_.field));
        for (const m of u.orderBy) m.field.isKeyField() || (h = h.add(m.field));
        return h.size + (f ? 1 : 0);
      }(i) && (r = 1) : r = 0;
    })).next(() => function (o) {
      return o.limit !== null;
    }(t) && s.length > 1 && r === 2 ? 1 : r);
  }
  Qn(e, t) {
    const r = new Hr();
    for (const s of pn(e)) {
      const i = t.data.field(s.fieldPath);
      if (i == null) return null;
      const o = r.Pn(s.kind);
      yn.Kt.Dt(i, o);
    }
    return r.un();
  }
  Ln(e) {
    const t = new Hr();
    return yn.Kt.Dt(e, t.Pn(0)), t.un();
  }
  $n(e, t) {
    const r = new Hr();
    return yn.Kt.Dt(Rs(this.databaseId, t), r.Pn(function (i) {
      const o = pn(i);
      return o.length === 0 ? 0 : o[o.length - 1].kind;
    }(e))), r.un();
  }
  Nn(e, t, r) {
    if (r === null) return [];
    let s = [];
    s.push(new Hr());
    let i = 0;
    for (const o of pn(e)) {
      const c = r[i++];
      for (const u of s) if (this.Un(t, o.fieldPath) && bs(c)) s = this.Kn(s, o, c);else {
        const h = u.Pn(o.kind);
        yn.Kt.Dt(c, h);
      }
    }
    return this.Wn(s);
  }
  On(e, t, r) {
    return this.Nn(e, t, r.position);
  }
  Wn(e) {
    const t = [];
    for (let r = 0; r < e.length; ++r) t[r] = e[r].un();
    return t;
  }
  Kn(e, t, r) {
    const s = [...e],
      i = [];
    for (const o of r.arrayValue.values || []) for (const c of s) {
      const u = new Hr();
      u.seed(c.un()), yn.Kt.Dt(o, u.Pn(t.kind)), i.push(u);
    }
    return i;
  }
  Un(e, t) {
    return !!e.filters.find(r => r instanceof J && r.field.isEqual(t) && (r.op === "in" || r.op === "not-in"));
  }
  getFieldIndexes(e, t) {
    const r = Wr(e),
      s = Jn(e);
    return (t ? r.J(Ga, IDBKeyRange.bound(t, t)) : r.J()).next(i => {
      const o = [];
      return v.forEach(i, c => s.get([c.indexId, this.uid]).next(u => {
        o.push(function (f, m) {
          const _ = m ? new ys(m.sequenceNumber, new ze(xn(m.readTime), new O(rt(m.documentKey)), m.largestBatchId)) : ys.empty(),
            b = f.fields.map(([V, N]) => new Ri(ce.fromServerFormat(V), N));
          return new $i(f.indexId, f.collectionGroup, b, _);
        }(c, u));
      })).next(() => o);
    });
  }
  getNextCollectionGroupToUpdate(e) {
    return this.getFieldIndexes(e).next(t => t.length === 0 ? null : (t.sort((r, s) => {
      const i = r.indexState.sequenceNumber - s.indexState.sequenceNumber;
      return i !== 0 ? i : z(r.collectionGroup, s.collectionGroup);
    }), t[0].collectionGroup));
  }
  updateCollectionGroup(e, t, r) {
    const s = Wr(e),
      i = Jn(e);
    return this.Gn(e).next(o => s.J(Ga, IDBKeyRange.bound(t, t)).next(c => v.forEach(c, u => i.put(Bh(u.indexId, this.uid, o, r)))));
  }
  updateIndexEntries(e, t) {
    const r = new Map();
    return v.forEach(t, (s, i) => {
      const o = r.get(s.collectionGroup);
      return (o ? v.resolve(o) : this.getFieldIndexes(e, s.collectionGroup)).next(c => (r.set(s.collectionGroup, c), v.forEach(c, u => this.zn(e, s, u).next(h => {
        const f = this.jn(i, u);
        return h.isEqual(f) ? v.resolve() : this.Jn(e, i, u, h, f);
      }))));
    });
  }
  Hn(e, t, r, s) {
    return Xn(e).put(s.Rn(this.uid, this.$n(r, t.key), t.key));
  }
  Yn(e, t, r, s) {
    return Xn(e).delete(s.Vn(this.uid, this.$n(r, t.key), t.key));
  }
  zn(e, t, r) {
    const s = Xn(e);
    let i = new ne(Ut);
    return s.ee({
      index: Wf,
      range: IDBKeyRange.only([r.indexId, this.uid, Ni(this.$n(r, t))])
    }, (o, c) => {
      i = i.add(new In(r.indexId, t, Gh(c.arrayValue), Gh(c.directionalValue)));
    }).next(() => i);
  }
  jn(e, t) {
    let r = new ne(Ut);
    const s = this.Qn(t, e);
    if (s == null) return r;
    const i = za(t);
    if (i != null) {
      const o = e.data.field(i.fieldPath);
      if (bs(o)) for (const c of o.arrayValue.values || []) r = r.add(new In(t.indexId, e.key, this.Ln(c), s));
    } else r = r.add(new In(t.indexId, e.key, pi, s));
    return r;
  }
  Jn(e, t, r, s, i) {
    k(Wh, "Updating index entries for document '%s'", t.key);
    const o = [];
    return function (u, h, f, m, _) {
      const b = u.getIterator(),
        V = h.getIterator();
      let N = Wn(b),
        C = Wn(V);
      for (; N || C;) {
        let q = !1,
          U = !1;
        if (N && C) {
          const M = f(N, C);
          M < 0 ? U = !0 : M > 0 && (q = !0);
        } else N != null ? U = !0 : q = !0;
        q ? (m(C), C = Wn(V)) : U ? (_(N), N = Wn(b)) : (N = Wn(b), C = Wn(V));
      }
    }(s, i, Ut, c => {
      o.push(this.Hn(e, t, r, c));
    }, c => {
      o.push(this.Yn(e, t, r, c));
    }), v.waitFor(o);
  }
  Gn(e) {
    let t = 1;
    return Jn(e).ee({
      index: Hf,
      reverse: !0,
      range: IDBKeyRange.upperBound([this.uid, Number.MAX_SAFE_INTEGER])
    }, (r, s, i) => {
      i.done(), t = s.sequenceNumber + 1;
    }).next(() => t);
  }
  createRange(e, t, r) {
    r = r.sort((o, c) => Ut(o, c)).filter((o, c, u) => !c || Ut(o, u[c - 1]) !== 0);
    const s = [];
    s.push(e);
    for (const o of r) {
      const c = Ut(o, e),
        u = Ut(o, t);
      if (c === 0) s[0] = e.An();else if (c > 0 && u < 0) s.push(o), s.push(o.An());else if (u > 0) break;
    }
    s.push(t);
    const i = [];
    for (let o = 0; o < s.length; o += 2) {
      if (this.Zn(s[o], s[o + 1])) return [];
      const c = s[o].Vn(this.uid, pi, O.empty()),
        u = s[o + 1].Vn(this.uid, pi, O.empty());
      i.push(IDBKeyRange.bound(c, u));
    }
    return i;
  }
  Zn(e, t) {
    return Ut(e, t) > 0;
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return this.getFieldIndexes(e, t).next(Xh);
  }
  getMinOffset(e, t) {
    return v.mapArray(this.Mn(t), r => this.xn(e, r).next(s => s || L(44426))).next(Xh);
  }
}
function Qh(n) {
  return Ee(n, ws);
}
function Xn(n) {
  return Ee(n, ls);
}
function Wr(n) {
  return Ee(n, Nc);
}
function Jn(n) {
  return Ee(n, us);
}
function Xh(n) {
  F(n.length !== 0, 28825);
  let e = n[0].indexState.offset,
    t = e.largestBatchId;
  for (let r = 1; r < n.length; r++) {
    const s = n[r].indexState.offset;
    Vc(s, e) < 0 && (e = s), t < s.largestBatchId && (t = s.largestBatchId);
  }
  return new ze(e.readTime, e.documentKey, t);
}
const Jh = {
  didRun: !1,
  sequenceNumbersCollected: 0,
  targetsRemoved: 0,
  documentsRemoved: 0
};
const Xp = 41943040;
class Se {
  static withCacheSize(e) {
    return new Se(e, Se.DEFAULT_COLLECTION_PERCENTILE, Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
  constructor(e, t, r) {
    this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = r;
  }
}
function Jp(n, e, t) {
  const r = n.store(We),
    s = n.store(dr),
    i = [],
    o = IDBKeyRange.only(t.batchId);
  let c = 0;
  const u = r.ee({
    range: o
  }, (f, m, _) => (c++, _.delete()));
  i.push(u.next(() => {
    F(c === 1, 47070, {
      batchId: t.batchId
    });
  }));
  const h = [];
  for (const f of t.mutations) {
    const m = $f(e, f.key.path, t.batchId);
    i.push(s.delete(m)), h.push(f.key);
  }
  return v.waitFor(i).next(() => h);
}
function no(n) {
  if (!n) return 0;
  let e;
  if (n.document) e = n.document;else if (n.unknownDocument) e = n.unknownDocument;else {
    if (!n.noDocument) throw L(14731);
    e = n.noDocument;
  }
  return JSON.stringify(e).length;
}
Se.DEFAULT_COLLECTION_PERCENTILE = 10, Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, Se.DEFAULT = new Se(Xp, Se.DEFAULT_COLLECTION_PERCENTILE, Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), Se.DISABLED = new Se(-1, 0, 0);
class Vo {
  constructor(e, t, r, s) {
    this.userId = e, this.serializer = t, this.indexManager = r, this.referenceDelegate = s, this.Xn = {};
  }
  static wt(e, t, r, s) {
    F(e.uid !== "", 64387);
    const i = e.isAuthenticated() ? e.uid : "";
    return new Vo(i, t, r, s);
  }
  checkEmpty(e) {
    let t = !0;
    const r = IDBKeyRange.bound([this.userId, Number.NEGATIVE_INFINITY], [this.userId, Number.POSITIVE_INFINITY]);
    return Bt(e).ee({
      index: Tn,
      range: r
    }, (s, i, o) => {
      t = !1, o.done();
    }).next(() => t);
  }
  addMutationBatch(e, t, r, s) {
    const i = rr(e),
      o = Bt(e);
    return o.add({}).next(c => {
      F(typeof c == "number", 49019);
      const u = new qc(c, t, r, s),
        h = function (b, V, N) {
          const C = N.baseMutations.map(U => Zi(b.yt, U)),
            q = N.mutations.map(U => Zi(b.yt, U));
          return {
            userId: V,
            batchId: N.batchId,
            localWriteTimeMs: N.localWriteTime.toMillis(),
            baseMutations: C,
            mutations: q
          };
        }(this.serializer, this.userId, u),
        f = [];
      let m = new ne((_, b) => z(_.canonicalString(), b.canonicalString()));
      for (const _ of s) {
        const b = $f(this.userId, _.key.path, c);
        m = m.add(_.key.path.popLast()), f.push(o.put(h)), f.push(i.put(b, XE));
      }
      return m.forEach(_ => {
        f.push(this.indexManager.addToCollectionParentIndex(e, _));
      }), e.addOnCommittedListener(() => {
        this.Xn[c] = u.keys();
      }), v.waitFor(f).next(() => u);
    });
  }
  lookupMutationBatch(e, t) {
    return Bt(e).get(t).next(r => r ? (F(r.userId === this.userId, 48, "Unexpected user for mutation batch", {
      userId: r.userId,
      batchId: t
    }), _n(this.serializer, r)) : null);
  }
  er(e, t) {
    return this.Xn[t] ? v.resolve(this.Xn[t]) : this.lookupMutationBatch(e, t).next(r => {
      if (r) {
        const s = r.keys();
        return this.Xn[t] = s, s;
      }
      return null;
    });
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const r = t + 1,
      s = IDBKeyRange.lowerBound([this.userId, r]);
    let i = null;
    return Bt(e).ee({
      index: Tn,
      range: s
    }, (o, c, u) => {
      c.userId === this.userId && (F(c.batchId >= r, 47524, {
        tr: r
      }), i = _n(this.serializer, c)), u.done();
    }).next(() => i);
  }
  getHighestUnacknowledgedBatchId(e) {
    const t = IDBKeyRange.upperBound([this.userId, Number.POSITIVE_INFINITY]);
    let r = wn;
    return Bt(e).ee({
      index: Tn,
      range: t,
      reverse: !0
    }, (s, i, o) => {
      r = i.batchId, o.done();
    }).next(() => r);
  }
  getAllMutationBatches(e) {
    const t = IDBKeyRange.bound([this.userId, wn], [this.userId, Number.POSITIVE_INFINITY]);
    return Bt(e).J(Tn, t).next(r => r.map(s => _n(this.serializer, s)));
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const r = bi(this.userId, t.path),
      s = IDBKeyRange.lowerBound(r),
      i = [];
    return rr(e).ee({
      range: s
    }, (o, c, u) => {
      const [h, f, m] = o,
        _ = rt(f);
      if (h === this.userId && t.path.isEqual(_)) return Bt(e).get(m).next(b => {
        if (!b) throw L(61480, {
          nr: o,
          batchId: m
        });
        F(b.userId === this.userId, 10503, "Unexpected user for mutation batch", {
          userId: b.userId,
          batchId: m
        }), i.push(_n(this.serializer, b));
      });
      u.done();
    }).next(() => i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let r = new ne(z);
    const s = [];
    return t.forEach(i => {
      const o = bi(this.userId, i.path),
        c = IDBKeyRange.lowerBound(o),
        u = rr(e).ee({
          range: c
        }, (h, f, m) => {
          const [_, b, V] = h,
            N = rt(b);
          _ === this.userId && i.path.isEqual(N) ? r = r.add(V) : m.done();
        });
      s.push(u);
    }), v.waitFor(s).next(() => this.rr(e, r));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const r = t.path,
      s = r.length + 1,
      i = bi(this.userId, r),
      o = IDBKeyRange.lowerBound(i);
    let c = new ne(z);
    return rr(e).ee({
      range: o
    }, (u, h, f) => {
      const [m, _, b] = u,
        V = rt(_);
      m === this.userId && r.isPrefixOf(V) ? V.length === s && (c = c.add(b)) : f.done();
    }).next(() => this.rr(e, c));
  }
  rr(e, t) {
    const r = [],
      s = [];
    return t.forEach(i => {
      s.push(Bt(e).get(i).next(o => {
        if (o === null) throw L(35274, {
          batchId: i
        });
        F(o.userId === this.userId, 9748, "Unexpected user for mutation batch", {
          userId: o.userId,
          batchId: i
        }), r.push(_n(this.serializer, o));
      }));
    }), v.waitFor(s).next(() => r);
  }
  removeMutationBatch(e, t) {
    return Jp(e.le, this.userId, t).next(r => (e.addOnCommittedListener(() => {
      this.ir(t.batchId);
    }), v.forEach(r, s => this.referenceDelegate.markPotentiallyOrphaned(e, s))));
  }
  ir(e) {
    delete this.Xn[e];
  }
  performConsistencyCheck(e) {
    return this.checkEmpty(e).next(t => {
      if (!t) return v.resolve();
      const r = IDBKeyRange.lowerBound(function (o) {
          return [o];
        }(this.userId)),
        s = [];
      return rr(e).ee({
        range: r
      }, (i, o, c) => {
        if (i[0] === this.userId) {
          const u = rt(i[1]);
          s.push(u);
        } else c.done();
      }).next(() => {
        F(s.length === 0, 56720, {
          sr: s.map(i => i.canonicalString())
        });
      });
    });
  }
  containsKey(e, t) {
    return Yp(e, this.userId, t);
  }
  _r(e) {
    return Zp(e).get(this.userId).next(t => t || {
      userId: this.userId,
      lastAcknowledgedBatchId: wn,
      lastStreamToken: ""
    });
  }
}
function Yp(n, e, t) {
  const r = bi(e, t.path),
    s = r[1],
    i = IDBKeyRange.lowerBound(r);
  let o = !1;
  return rr(n).ee({
    range: i,
    X: !0
  }, (c, u, h) => {
    const [f, m, _] = c;
    f === e && m === s && (o = !0), h.done();
  }).next(() => o);
}
function Bt(n) {
  return Ee(n, We);
}
function rr(n) {
  return Ee(n, dr);
}
function Zp(n) {
  return Ee(n, Es);
}
class On {
  constructor(e) {
    this.ar = e;
  }
  next() {
    return this.ar += 2, this.ar;
  }
  static ur() {
    return new On(0);
  }
  static cr() {
    return new On(-1);
  }
}
class ww {
  constructor(e, t) {
    this.referenceDelegate = e, this.serializer = t;
  }
  allocateTargetId(e) {
    return this.lr(e).next(t => {
      const r = new On(t.highestTargetId);
      return t.highestTargetId = r.next(), this.hr(e, t).next(() => t.highestTargetId);
    });
  }
  getLastRemoteSnapshotVersion(e) {
    return this.lr(e).next(t => B.fromTimestamp(new ee(t.lastRemoteSnapshotVersion.seconds, t.lastRemoteSnapshotVersion.nanoseconds)));
  }
  getHighestSequenceNumber(e) {
    return this.lr(e).next(t => t.highestListenSequenceNumber);
  }
  setTargetsMetadata(e, t, r) {
    return this.lr(e).next(s => (s.highestListenSequenceNumber = t, r && (s.lastRemoteSnapshotVersion = r.toTimestamp()), t > s.highestListenSequenceNumber && (s.highestListenSequenceNumber = t), this.hr(e, s)));
  }
  addTargetData(e, t) {
    return this.Pr(e, t).next(() => this.lr(e).next(r => (r.targetCount += 1, this.Tr(t, r), this.hr(e, r))));
  }
  updateTargetData(e, t) {
    return this.Pr(e, t);
  }
  removeTargetData(e, t) {
    return this.removeMatchingKeysForTargetId(e, t.targetId).next(() => Yn(e).delete(t.targetId)).next(() => this.lr(e)).next(r => (F(r.targetCount > 0, 8065), r.targetCount -= 1, this.hr(e, r)));
  }
  removeTargets(e, t, r) {
    let s = 0;
    const i = [];
    return Yn(e).ee((o, c) => {
      const u = rs(c);
      u.sequenceNumber <= t && r.get(u.targetId) === null && (s++, i.push(this.removeTargetData(e, u)));
    }).next(() => v.waitFor(i)).next(() => s);
  }
  forEachTarget(e, t) {
    return Yn(e).ee((r, s) => {
      const i = rs(s);
      t(i);
    });
  }
  lr(e) {
    return Yh(e).get(Hi).next(t => (F(t !== null, 2888), t));
  }
  hr(e, t) {
    return Yh(e).put(Hi, t);
  }
  Pr(e, t) {
    return Yn(e).put(Kp(this.serializer, t));
  }
  Tr(e, t) {
    let r = !1;
    return e.targetId > t.highestTargetId && (t.highestTargetId = e.targetId, r = !0), e.sequenceNumber > t.highestListenSequenceNumber && (t.highestListenSequenceNumber = e.sequenceNumber, r = !0), r;
  }
  getTargetCount(e) {
    return this.lr(e).next(t => t.targetCount);
  }
  getTargetData(e, t) {
    const r = Vn(t),
      s = IDBKeyRange.bound([r, Number.NEGATIVE_INFINITY], [r, Number.POSITIVE_INFINITY]);
    let i = null;
    return Yn(e).ee({
      range: s,
      index: Kf
    }, (o, c, u) => {
      const h = rs(c);
      Ls(t, h.target) && (i = h, u.done());
    }).next(() => i);
  }
  addMatchingKeys(e, t, r) {
    const s = [],
      i = jt(e);
    return t.forEach(o => {
      const c = Ve(o.path);
      s.push(i.put({
        targetId: r,
        path: c
      })), s.push(this.referenceDelegate.addReference(e, r, o));
    }), v.waitFor(s);
  }
  removeMatchingKeys(e, t, r) {
    const s = jt(e);
    return v.forEach(t, i => {
      const o = Ve(i.path);
      return v.waitFor([s.delete([r, o]), this.referenceDelegate.removeReference(e, r, i)]);
    });
  }
  removeMatchingKeysForTargetId(e, t) {
    const r = jt(e),
      s = IDBKeyRange.bound([t], [t + 1], !1, !0);
    return r.delete(s);
  }
  getMatchingKeysForTargetId(e, t) {
    const r = IDBKeyRange.bound([t], [t + 1], !1, !0),
      s = jt(e);
    let i = H();
    return s.ee({
      range: r,
      X: !0
    }, (o, c, u) => {
      const h = rt(o[1]),
        f = new O(h);
      i = i.add(f);
    }).next(() => i);
  }
  containsKey(e, t) {
    const r = Ve(t.path),
      s = IDBKeyRange.bound([r], [Lf(r)], !1, !0);
    let i = 0;
    return jt(e).ee({
      index: Dc,
      X: !0,
      range: s
    }, ([o, c], u, h) => {
      o !== 0 && (i++, h.done());
    }).next(() => i > 0);
  }
  At(e, t) {
    return Yn(e).get(t).next(r => r ? rs(r) : null);
  }
}
function Yn(n) {
  return Ee(n, fr);
}
function Yh(n) {
  return Ee(n, vn);
}
function jt(n) {
  return Ee(n, pr);
}
const Zh = "LruGarbageCollector";
const em = 1048576;
function ed([n, e], [t, r]) {
  const s = z(n, t);
  return s === 0 ? z(e, r) : s;
}
class vw {
  constructor(e) {
    this.Ir = e, this.buffer = new ne(ed), this.Er = 0;
  }
  dr() {
    return ++this.Er;
  }
  Ar(e) {
    const t = [e, this.dr()];
    if (this.buffer.size < this.Ir) this.buffer = this.buffer.add(t);else {
      const r = this.buffer.last();
      ed(t, r) < 0 && (this.buffer = this.buffer.delete(r).add(t));
    }
  }
  get maxValue() {
    return this.buffer.last()[0];
  }
}
class tm {
  constructor(e, t, r) {
    this.garbageCollector = e, this.asyncQueue = t, this.localStore = r, this.Rr = null;
  }
  start() {
    this.garbageCollector.params.cacheSizeCollectionThreshold !== -1 && this.Vr(6e4);
  }
  stop() {
    this.Rr && (this.Rr.cancel(), this.Rr = null);
  }
  get started() {
    return this.Rr !== null;
  }
  Vr(e) {
    k(Zh, `Garbage collection scheduled in ${e}ms`), this.Rr = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, async () => {
      this.Rr = null;
      try {
        await this.localStore.collectGarbage(this.garbageCollector);
      } catch (t) {
        rn(t) ? k(Zh, "Ignoring IndexedDB error during garbage collection: ", t) : await Bn(t);
      }
      await this.Vr(3e5);
    });
  }
}
class Aw {
  constructor(e, t) {
    this.mr = e, this.params = t;
  }
  calculateTargetCount(e, t) {
    return this.mr.gr(e).next(r => Math.floor(t / 100 * r));
  }
  nthSequenceNumber(e, t) {
    if (t === 0) return v.resolve(Ge.ce);
    const r = new vw(t);
    return this.mr.forEachTarget(e, s => r.Ar(s.sequenceNumber)).next(() => this.mr.pr(e, s => r.Ar(s))).next(() => r.maxValue);
  }
  removeTargets(e, t, r) {
    return this.mr.removeTargets(e, t, r);
  }
  removeOrphanedDocuments(e, t) {
    return this.mr.removeOrphanedDocuments(e, t);
  }
  collect(e, t) {
    return this.params.cacheSizeCollectionThreshold === -1 ? (k("LruGarbageCollector", "Garbage collection skipped; disabled"), v.resolve(Jh)) : this.getCacheSize(e).next(r => r < this.params.cacheSizeCollectionThreshold ? (k("LruGarbageCollector", `Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), Jh) : this.yr(e, t));
  }
  getCacheSize(e) {
    return this.mr.getCacheSize(e);
  }
  yr(e, t) {
    let r, s, i, o, c, u, h;
    const f = Date.now();
    return this.calculateTargetCount(e, this.params.percentileToCollect).next(m => (m > this.params.maximumSequenceNumbersToCollect ? (k("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`), s = this.params.maximumSequenceNumbersToCollect) : s = m, o = Date.now(), this.nthSequenceNumber(e, s))).next(m => (r = m, c = Date.now(), this.removeTargets(e, r, t))).next(m => (i = m, u = Date.now(), this.removeOrphanedDocuments(e, r))).next(m => (h = Date.now(), Zn() <= X.DEBUG && k("LruGarbageCollector", `LRU Garbage Collection
	Counted targets in ${o - f}ms
	Determined least recently used ${s} in ` + (c - o) + `ms
	Removed ${i} targets in ` + (u - c) + `ms
	Removed ${m} documents in ` + (h - u) + `ms
Total Duration: ${h - f}ms`), v.resolve({
      didRun: !0,
      sequenceNumbersCollected: s,
      targetsRemoved: i,
      documentsRemoved: m
    })));
  }
}
function nm(n, e) {
  return new Aw(n, e);
}
class Rw {
  constructor(e, t) {
    this.db = e, this.garbageCollector = nm(this, t);
  }
  gr(e) {
    const t = this.wr(e);
    return this.db.getTargetCache().getTargetCount(e).next(r => t.next(s => r + s));
  }
  wr(e) {
    let t = 0;
    return this.pr(e, r => {
      t++;
    }).next(() => t);
  }
  forEachTarget(e, t) {
    return this.db.getTargetCache().forEachTarget(e, t);
  }
  pr(e, t) {
    return this.Sr(e, (r, s) => t(s));
  }
  addReference(e, t, r) {
    return mi(e, r);
  }
  removeReference(e, t, r) {
    return mi(e, r);
  }
  removeTargets(e, t, r) {
    return this.db.getTargetCache().removeTargets(e, t, r);
  }
  markPotentiallyOrphaned(e, t) {
    return mi(e, t);
  }
  br(e, t) {
    return function (s, i) {
      let o = !1;
      return Zp(s).te(c => Yp(s, c, i).next(u => (u && (o = !0), v.resolve(!u)))).next(() => o);
    }(e, t);
  }
  removeOrphanedDocuments(e, t) {
    const r = this.db.getRemoteDocumentCache().newChangeBuffer(),
      s = [];
    let i = 0;
    return this.Sr(e, (o, c) => {
      if (c <= t) {
        const u = this.br(e, o).next(h => {
          if (!h) return i++, r.getEntry(e, o).next(() => (r.removeEntry(o, B.min()), jt(e).delete(function (m) {
            return [0, Ve(m.path)];
          }(o))));
        });
        s.push(u);
      }
    }).next(() => v.waitFor(s)).next(() => r.apply(e)).next(() => i);
  }
  removeTarget(e, t) {
    const r = t.withSequenceNumber(e.currentSequenceNumber);
    return this.db.getTargetCache().updateTargetData(e, r);
  }
  updateLimboDocument(e, t) {
    return mi(e, t);
  }
  Sr(e, t) {
    const r = jt(e);
    let s,
      i = Ge.ce;
    return r.ee({
      index: Dc
    }, ([o, c], {
      path: u,
      sequenceNumber: h
    }) => {
      o === 0 ? (i !== Ge.ce && t(new O(rt(s)), i), i = h, s = u) : i = Ge.ce;
    }).next(() => {
      i !== Ge.ce && t(new O(rt(s)), i);
    });
  }
  getCacheSize(e) {
    return this.db.getRemoteDocumentCache().getSize(e);
  }
}
function mi(n, e) {
  return jt(n).put(function (r, s) {
    return {
      targetId: 0,
      path: Ve(r.path),
      sequenceNumber: s
    };
  }(e, n.currentSequenceNumber));
}
class rm {
  constructor() {
    this.changes = new Vt(e => e.toString(), (e, t) => e.isEqual(t)), this.changesApplied = !1;
  }
  addEntry(e) {
    this.assertNotApplied(), this.changes.set(e.key, e);
  }
  removeEntry(e, t) {
    this.assertNotApplied(), this.changes.set(e, le.newInvalidDocument(e).setReadTime(t));
  }
  getEntry(e, t) {
    this.assertNotApplied();
    const r = this.changes.get(t);
    return r !== void 0 ? v.resolve(r) : this.getFromCache(e, t);
  }
  getEntries(e, t) {
    return this.getAllFromCache(e, t);
  }
  apply(e) {
    return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(e);
  }
  assertNotApplied() {}
}
class bw {
  constructor(e) {
    this.serializer = e;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  addEntry(e, t, r) {
    return dn(e).put(r);
  }
  removeEntry(e, t, r) {
    return dn(e).delete(function (i, o) {
      const c = i.path.toArray();
      return [c.slice(0, c.length - 2), c[c.length - 2], eo(o), c[c.length - 1]];
    }(t, r));
  }
  updateMetadata(e, t) {
    return this.getMetadata(e).next(r => (r.byteSize += t, this.Dr(e, r)));
  }
  getEntry(e, t) {
    let r = le.newInvalidDocument(t);
    return dn(e).ee({
      index: Pi,
      range: IDBKeyRange.only(Qr(t))
    }, (s, i) => {
      r = this.Cr(t, i);
    }).next(() => r);
  }
  vr(e, t) {
    let r = {
      size: 0,
      document: le.newInvalidDocument(t)
    };
    return dn(e).ee({
      index: Pi,
      range: IDBKeyRange.only(Qr(t))
    }, (s, i) => {
      r = {
        document: this.Cr(t, i),
        size: no(i)
      };
    }).next(() => r);
  }
  getEntries(e, t) {
    let r = je();
    return this.Fr(e, t, (s, i) => {
      const o = this.Cr(s, i);
      r = r.insert(s, o);
    }).next(() => r);
  }
  Mr(e, t) {
    let r = je(),
      s = new ae(O.comparator);
    return this.Fr(e, t, (i, o) => {
      const c = this.Cr(i, o);
      r = r.insert(i, c), s = s.insert(i, no(o));
    }).next(() => ({
      documents: r,
      Or: s
    }));
  }
  Fr(e, t, r) {
    if (t.isEmpty()) return v.resolve();
    let s = new ne(rd);
    t.forEach(u => s = s.add(u));
    const i = IDBKeyRange.bound(Qr(s.first()), Qr(s.last())),
      o = s.getIterator();
    let c = o.getNext();
    return dn(e).ee({
      index: Pi,
      range: i
    }, (u, h, f) => {
      const m = O.fromSegments([...h.prefixPath, h.collectionGroup, h.documentId]);
      for (; c && rd(c, m) < 0;) r(c, null), c = o.getNext();
      c && c.isEqual(m) && (r(c, h), c = o.hasNext() ? o.getNext() : null), c ? f.j(Qr(c)) : f.done();
    }).next(() => {
      for (; c;) r(c, null), c = o.hasNext() ? o.getNext() : null;
    });
  }
  getDocumentsMatchingQuery(e, t, r, s, i) {
    const o = t.path,
      c = [o.popLast().toArray(), o.lastSegment(), eo(r.readTime), r.documentKey.path.isEmpty() ? "" : r.documentKey.path.lastSegment()],
      u = [o.popLast().toArray(), o.lastSegment(), [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], ""];
    return dn(e).J(IDBKeyRange.bound(c, u, !0)).next(h => {
      i?.incrementDocumentReadCount(h.length);
      let f = je();
      for (const m of h) {
        const _ = this.Cr(O.fromSegments(m.prefixPath.concat(m.collectionGroup, m.documentId)), m);
        _.isFoundDocument() && (Us(t, _) || s.has(_.key)) && (f = f.insert(_.key, _));
      }
      return f;
    });
  }
  getAllFromCollectionGroup(e, t, r, s) {
    let i = je();
    const o = nd(t, r),
      c = nd(t, ze.max());
    return dn(e).ee({
      index: Gf,
      range: IDBKeyRange.bound(o, c, !0)
    }, (u, h, f) => {
      const m = this.Cr(O.fromSegments(h.prefixPath.concat(h.collectionGroup, h.documentId)), h);
      i = i.insert(m.key, m), i.size === s && f.done();
    }).next(() => i);
  }
  newChangeBuffer(e) {
    return new Pw(this, !!e && e.trackRemovals);
  }
  getSize(e) {
    return this.getMetadata(e).next(t => t.byteSize);
  }
  getMetadata(e) {
    return td(e).get($a).next(t => (F(!!t, 20021), t));
  }
  Dr(e, t) {
    return td(e).put($a, t);
  }
  Cr(e, t) {
    if (t) {
      const r = dw(this.serializer, t);
      if (!(r.isNoDocument() && r.version.isEqual(B.min()))) return r;
    }
    return le.newInvalidDocument(e);
  }
}
function sm(n) {
  return new bw(n);
}
class Pw extends rm {
  constructor(e, t) {
    super(), this.Nr = e, this.trackRemovals = t, this.Br = new Vt(r => r.toString(), (r, s) => r.isEqual(s));
  }
  applyChanges(e) {
    const t = [];
    let r = 0,
      s = new ne((i, o) => z(i.canonicalString(), o.canonicalString()));
    return this.changes.forEach((i, o) => {
      const c = this.Br.get(i);
      if (t.push(this.Nr.removeEntry(e, i, c.readTime)), o.isValidDocument()) {
        const u = Fh(this.Nr.serializer, o);
        s = s.add(i.path.popLast());
        const h = no(u);
        r += h - c.size, t.push(this.Nr.addEntry(e, i, u));
      } else if (r -= c.size, this.trackRemovals) {
        const u = Fh(this.Nr.serializer, o.convertToNoDocument(B.min()));
        t.push(this.Nr.addEntry(e, i, u));
      }
    }), s.forEach(i => {
      t.push(this.Nr.indexManager.addToCollectionParentIndex(e, i));
    }), t.push(this.Nr.updateMetadata(e, r)), v.waitFor(t);
  }
  getFromCache(e, t) {
    return this.Nr.vr(e, t).next(r => (this.Br.set(t, {
      size: r.size,
      readTime: r.document.readTime
    }), r.document));
  }
  getAllFromCache(e, t) {
    return this.Nr.Mr(e, t).next(({
      documents: r,
      Or: s
    }) => (s.forEach((i, o) => {
      this.Br.set(i, {
        size: o,
        readTime: r.get(i).readTime
      });
    }), r));
  }
}
function td(n) {
  return Ee(n, Ts);
}
function dn(n) {
  return Ee(n, Ki);
}
function Qr(n) {
  const e = n.path.toArray();
  return [e.slice(0, e.length - 2), e[e.length - 2], e[e.length - 1]];
}
function nd(n, e) {
  const t = e.documentKey.path.toArray();
  return [n, eo(e.readTime), t.slice(0, t.length - 2), t.length > 0 ? t[t.length - 1] : ""];
}
function rd(n, e) {
  const t = n.path.toArray(),
    r = e.path.toArray();
  let s = 0;
  for (let i = 0; i < t.length - 2 && i < r.length - 2; ++i) if (s = z(t[i], r[i]), s) return s;
  return s = z(t.length, r.length), s || (s = z(t[t.length - 2], r[r.length - 2]), s || z(t[t.length - 1], r[r.length - 1]));
}
class Sw {
  constructor(e, t) {
    this.overlayedDocument = e, this.mutatedFields = t;
  }
}
class im {
  constructor(e, t, r, s) {
    this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = r, this.indexManager = s;
  }
  getDocument(e, t) {
    let r = null;
    return this.documentOverlayCache.getOverlay(e, t).next(s => (r = s, this.remoteDocumentCache.getEntry(e, t))).next(s => (r !== null && ps(r.mutation, s, Ue.empty(), ee.now()), s));
  }
  getDocuments(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next(r => this.getLocalViewOfDocuments(e, r, H()).next(() => r));
  }
  getLocalViewOfDocuments(e, t, r = H()) {
    const s = st();
    return this.populateOverlays(e, s, t).next(() => this.computeViews(e, t, s, r).next(i => {
      let o = ts();
      return i.forEach((c, u) => {
        o = o.insert(c, u.overlayedDocument);
      }), o;
    }));
  }
  getOverlayedDocuments(e, t) {
    const r = st();
    return this.populateOverlays(e, r, t).next(() => this.computeViews(e, t, r, H()));
  }
  populateOverlays(e, t, r) {
    const s = [];
    return r.forEach(i => {
      t.has(i) || s.push(i);
    }), this.documentOverlayCache.getOverlays(e, s).next(i => {
      i.forEach((o, c) => {
        t.set(o, c);
      });
    });
  }
  computeViews(e, t, r, s) {
    let i = je();
    const o = fs(),
      c = function () {
        return fs();
      }();
    return t.forEach((u, h) => {
      const f = r.get(h.key);
      s.has(h.key) && (f === void 0 || f.mutation instanceof kt) ? i = i.insert(h.key, h) : f !== void 0 ? (o.set(h.key, f.mutation.getFieldMask()), ps(f.mutation, h, f.mutation.getFieldMask(), ee.now())) : o.set(h.key, Ue.empty());
    }), this.recalculateAndSaveOverlays(e, i).next(u => (u.forEach((h, f) => o.set(h, f)), t.forEach((h, f) => c.set(h, new Sw(f, o.get(h) ?? null))), c));
  }
  recalculateAndSaveOverlays(e, t) {
    const r = fs();
    let s = new ae((o, c) => o - c),
      i = H();
    return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next(o => {
      for (const c of o) c.keys().forEach(u => {
        const h = t.get(u);
        if (h === null) return;
        let f = r.get(u) || Ue.empty();
        f = c.applyToLocalView(h, f), r.set(u, f);
        const m = (s.get(c.batchId) || H()).add(u);
        s = s.insert(c.batchId, m);
      });
    }).next(() => {
      const o = [],
        c = s.getReverseIterator();
      for (; c.hasNext();) {
        const u = c.getNext(),
          h = u.key,
          f = u.value,
          m = wp();
        f.forEach(_ => {
          if (!i.has(_)) {
            const b = Sp(t.get(_), r.get(_));
            b !== null && m.set(_, b), i = i.add(_);
          }
        }), o.push(this.documentOverlayCache.saveOverlays(e, h, m));
      }
      return v.waitFor(o);
    }).next(() => r);
  }
  recalculateAndSaveOverlaysForDocumentKeys(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next(r => this.recalculateAndSaveOverlays(e, r));
  }
  getDocumentsMatchingQuery(e, t, r, s) {
    return function (o) {
      return O.isDocumentKey(o.path) && o.collectionGroup === null && o.filters.length === 0;
    }(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : _p(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, r, s) : this.getDocumentsMatchingCollectionQuery(e, t, r, s);
  }
  getNextDocuments(e, t, r, s) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, r, s).next(i => {
      const o = s - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, r.largestBatchId, s - i.size) : v.resolve(st());
      let c = _s,
        u = i;
      return o.next(h => v.forEach(h, (f, m) => (c < m.largestBatchId && (c = m.largestBatchId), i.get(f) ? v.resolve() : this.remoteDocumentCache.getEntry(e, f).next(_ => {
        u = u.insert(f, _);
      }))).next(() => this.populateOverlays(e, h, i)).next(() => this.computeViews(e, u, h, H())).next(f => ({
        batchId: c,
        changes: Tp(f)
      })));
    });
  }
  getDocumentsMatchingDocumentQuery(e, t) {
    return this.getDocument(e, new O(t)).next(r => {
      let s = ts();
      return r.isFoundDocument() && (s = s.insert(r.key, r)), s;
    });
  }
  getDocumentsMatchingCollectionGroupQuery(e, t, r, s) {
    const i = t.collectionGroup;
    let o = ts();
    return this.indexManager.getCollectionParents(e, i).next(c => v.forEach(c, u => {
      const h = function (m, _) {
        return new qn(_, null, m.explicitOrderBy.slice(), m.filters.slice(), m.limit, m.limitType, m.startAt, m.endAt);
      }(t, u.child(i));
      return this.getDocumentsMatchingCollectionQuery(e, h, r, s).next(f => {
        f.forEach((m, _) => {
          o = o.insert(m, _);
        });
      });
    }).next(() => o));
  }
  getDocumentsMatchingCollectionQuery(e, t, r, s) {
    let i;
    return this.documentOverlayCache.getOverlaysForCollection(e, t.path, r.largestBatchId).next(o => (i = o, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, r, i, s))).next(o => {
      i.forEach((u, h) => {
        const f = h.getKey();
        o.get(f) === null && (o = o.insert(f, le.newInvalidDocument(f)));
      });
      let c = ts();
      return o.forEach((u, h) => {
        const f = i.get(u);
        f !== void 0 && ps(f.mutation, h, Ue.empty(), ee.now()), Us(t, h) && (c = c.insert(u, h));
      }), c;
    });
  }
}
class Cw {
  constructor(e) {
    this.serializer = e, this.Lr = new Map(), this.kr = new Map();
  }
  getBundleMetadata(e, t) {
    return v.resolve(this.Lr.get(t));
  }
  saveBundleMetadata(e, t) {
    return this.Lr.set(t.id, function (s) {
      return {
        id: s.id,
        version: s.version,
        createTime: Le(s.createTime)
      };
    }(t)), v.resolve();
  }
  getNamedQuery(e, t) {
    return v.resolve(this.kr.get(t));
  }
  saveNamedQuery(e, t) {
    return this.kr.set(t.name, function (s) {
      return {
        name: s.name,
        query: Hp(s.bundledQuery),
        readTime: Le(s.readTime)
      };
    }(t)), v.resolve();
  }
}
class Vw {
  constructor() {
    this.overlays = new ae(O.comparator), this.qr = new Map();
  }
  getOverlay(e, t) {
    return v.resolve(this.overlays.get(t));
  }
  getOverlays(e, t) {
    const r = st();
    return v.forEach(t, s => this.getOverlay(e, s).next(i => {
      i !== null && r.set(s, i);
    })).next(() => r);
  }
  saveOverlays(e, t, r) {
    return r.forEach((s, i) => {
      this.St(e, t, i);
    }), v.resolve();
  }
  removeOverlaysForBatchId(e, t, r) {
    const s = this.qr.get(r);
    return s !== void 0 && (s.forEach(i => this.overlays = this.overlays.remove(i)), this.qr.delete(r)), v.resolve();
  }
  getOverlaysForCollection(e, t, r) {
    const s = st(),
      i = t.length + 1,
      o = new O(t.child("")),
      c = this.overlays.getIteratorFrom(o);
    for (; c.hasNext();) {
      const u = c.getNext().value,
        h = u.getKey();
      if (!t.isPrefixOf(h.path)) break;
      h.path.length === i && u.largestBatchId > r && s.set(u.getKey(), u);
    }
    return v.resolve(s);
  }
  getOverlaysForCollectionGroup(e, t, r, s) {
    let i = new ae((h, f) => h - f);
    const o = this.overlays.getIterator();
    for (; o.hasNext();) {
      const h = o.getNext().value;
      if (h.getKey().getCollectionGroup() === t && h.largestBatchId > r) {
        let f = i.get(h.largestBatchId);
        f === null && (f = st(), i = i.insert(h.largestBatchId, f)), f.set(h.getKey(), h);
      }
    }
    const c = st(),
      u = i.getIterator();
    for (; u.hasNext() && (u.getNext().value.forEach((h, f) => c.set(h, f)), !(c.size() >= s)););
    return v.resolve(c);
  }
  St(e, t, r) {
    const s = this.overlays.get(r.key);
    if (s !== null) {
      const o = this.qr.get(s.largestBatchId).delete(r.key);
      this.qr.set(s.largestBatchId, o);
    }
    this.overlays = this.overlays.insert(r.key, new zc(t, r));
    let i = this.qr.get(t);
    i === void 0 && (i = H(), this.qr.set(t, i)), this.qr.set(t, i.add(r.key));
  }
}
class kw {
  constructor() {
    this.sessionToken = ge.EMPTY_BYTE_STRING;
  }
  getSessionToken(e) {
    return v.resolve(this.sessionToken);
  }
  setSessionToken(e, t) {
    return this.sessionToken = t, v.resolve();
  }
}
class Wc {
  constructor() {
    this.Qr = new ne(we.$r), this.Ur = new ne(we.Kr);
  }
  isEmpty() {
    return this.Qr.isEmpty();
  }
  addReference(e, t) {
    const r = new we(e, t);
    this.Qr = this.Qr.add(r), this.Ur = this.Ur.add(r);
  }
  Wr(e, t) {
    e.forEach(r => this.addReference(r, t));
  }
  removeReference(e, t) {
    this.Gr(new we(e, t));
  }
  zr(e, t) {
    e.forEach(r => this.removeReference(r, t));
  }
  jr(e) {
    const t = new O(new Z([])),
      r = new we(t, e),
      s = new we(t, e + 1),
      i = [];
    return this.Ur.forEachInRange([r, s], o => {
      this.Gr(o), i.push(o.key);
    }), i;
  }
  Jr() {
    this.Qr.forEach(e => this.Gr(e));
  }
  Gr(e) {
    this.Qr = this.Qr.delete(e), this.Ur = this.Ur.delete(e);
  }
  Hr(e) {
    const t = new O(new Z([])),
      r = new we(t, e),
      s = new we(t, e + 1);
    let i = H();
    return this.Ur.forEachInRange([r, s], o => {
      i = i.add(o.key);
    }), i;
  }
  containsKey(e) {
    const t = new we(e, 0),
      r = this.Qr.firstAfterOrEqual(t);
    return r !== null && e.isEqual(r.key);
  }
}
class we {
  constructor(e, t) {
    this.key = e, this.Yr = t;
  }
  static $r(e, t) {
    return O.comparator(e.key, t.key) || z(e.Yr, t.Yr);
  }
  static Kr(e, t) {
    return z(e.Yr, t.Yr) || O.comparator(e.key, t.key);
  }
}
class Dw {
  constructor(e, t) {
    this.indexManager = e, this.referenceDelegate = t, this.mutationQueue = [], this.tr = 1, this.Zr = new ne(we.$r);
  }
  checkEmpty(e) {
    return v.resolve(this.mutationQueue.length === 0);
  }
  addMutationBatch(e, t, r, s) {
    const i = this.tr;
    this.tr++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
    const o = new qc(i, t, r, s);
    this.mutationQueue.push(o);
    for (const c of s) this.Zr = this.Zr.add(new we(c.key, i)), this.indexManager.addToCollectionParentIndex(e, c.key.path.popLast());
    return v.resolve(o);
  }
  lookupMutationBatch(e, t) {
    return v.resolve(this.Xr(t));
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const r = t + 1,
      s = this.ei(r),
      i = s < 0 ? 0 : s;
    return v.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return v.resolve(this.mutationQueue.length === 0 ? wn : this.tr - 1);
  }
  getAllMutationBatches(e) {
    return v.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const r = new we(t, 0),
      s = new we(t, Number.POSITIVE_INFINITY),
      i = [];
    return this.Zr.forEachInRange([r, s], o => {
      const c = this.Xr(o.Yr);
      i.push(c);
    }), v.resolve(i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let r = new ne(z);
    return t.forEach(s => {
      const i = new we(s, 0),
        o = new we(s, Number.POSITIVE_INFINITY);
      this.Zr.forEachInRange([i, o], c => {
        r = r.add(c.Yr);
      });
    }), v.resolve(this.ti(r));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const r = t.path,
      s = r.length + 1;
    let i = r;
    O.isDocumentKey(i) || (i = i.child(""));
    const o = new we(new O(i), 0);
    let c = new ne(z);
    return this.Zr.forEachWhile(u => {
      const h = u.key.path;
      return !!r.isPrefixOf(h) && (h.length === s && (c = c.add(u.Yr)), !0);
    }, o), v.resolve(this.ti(c));
  }
  ti(e) {
    const t = [];
    return e.forEach(r => {
      const s = this.Xr(r);
      s !== null && t.push(s);
    }), t;
  }
  removeMutationBatch(e, t) {
    F(this.ni(t.batchId, "removed") === 0, 55003), this.mutationQueue.shift();
    let r = this.Zr;
    return v.forEach(t.mutations, s => {
      const i = new we(s.key, t.batchId);
      return r = r.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, s.key);
    }).next(() => {
      this.Zr = r;
    });
  }
  ir(e) {}
  containsKey(e, t) {
    const r = new we(t, 0),
      s = this.Zr.firstAfterOrEqual(r);
    return v.resolve(t.isEqual(s && s.key));
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, v.resolve();
  }
  ni(e, t) {
    return this.ei(e);
  }
  ei(e) {
    return this.mutationQueue.length === 0 ? 0 : e - this.mutationQueue[0].batchId;
  }
  Xr(e) {
    const t = this.ei(e);
    return t < 0 || t >= this.mutationQueue.length ? null : this.mutationQueue[t];
  }
}
class Nw {
  constructor(e) {
    this.ri = e, this.docs = function () {
      return new ae(O.comparator);
    }(), this.size = 0;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  addEntry(e, t) {
    const r = t.key,
      s = this.docs.get(r),
      i = s ? s.size : 0,
      o = this.ri(t);
    return this.docs = this.docs.insert(r, {
      document: t.mutableCopy(),
      size: o
    }), this.size += o - i, this.indexManager.addToCollectionParentIndex(e, r.path.popLast());
  }
  removeEntry(e) {
    const t = this.docs.get(e);
    t && (this.docs = this.docs.remove(e), this.size -= t.size);
  }
  getEntry(e, t) {
    const r = this.docs.get(t);
    return v.resolve(r ? r.document.mutableCopy() : le.newInvalidDocument(t));
  }
  getEntries(e, t) {
    let r = je();
    return t.forEach(s => {
      const i = this.docs.get(s);
      r = r.insert(s, i ? i.document.mutableCopy() : le.newInvalidDocument(s));
    }), v.resolve(r);
  }
  getDocumentsMatchingQuery(e, t, r, s) {
    let i = je();
    const o = t.path,
      c = new O(o.child("__id-9223372036854775808__")),
      u = this.docs.getIteratorFrom(c);
    for (; u.hasNext();) {
      const {
        key: h,
        value: {
          document: f
        }
      } = u.getNext();
      if (!o.isPrefixOf(h.path)) break;
      h.path.length > o.length + 1 || Vc(Bf(f), r) <= 0 || (s.has(f.key) || Us(t, f)) && (i = i.insert(f.key, f.mutableCopy()));
    }
    return v.resolve(i);
  }
  getAllFromCollectionGroup(e, t, r, s) {
    L(9500);
  }
  ii(e, t) {
    return v.forEach(this.docs, r => t(r));
  }
  newChangeBuffer(e) {
    return new xw(this);
  }
  getSize(e) {
    return v.resolve(this.size);
  }
}
class xw extends rm {
  constructor(e) {
    super(), this.Nr = e;
  }
  applyChanges(e) {
    const t = [];
    return this.changes.forEach((r, s) => {
      s.isValidDocument() ? t.push(this.Nr.addEntry(e, s)) : this.Nr.removeEntry(r);
    }), v.waitFor(t);
  }
  getFromCache(e, t) {
    return this.Nr.getEntry(e, t);
  }
  getAllFromCache(e, t) {
    return this.Nr.getEntries(e, t);
  }
}
class Ow {
  constructor(e) {
    this.persistence = e, this.si = new Vt(t => Vn(t), Ls), this.lastRemoteSnapshotVersion = B.min(), this.highestTargetId = 0, this.oi = 0, this._i = new Wc(), this.targetCount = 0, this.ai = On.ur();
  }
  forEachTarget(e, t) {
    return this.si.forEach((r, s) => t(s)), v.resolve();
  }
  getLastRemoteSnapshotVersion(e) {
    return v.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(e) {
    return v.resolve(this.oi);
  }
  allocateTargetId(e) {
    return this.highestTargetId = this.ai.next(), v.resolve(this.highestTargetId);
  }
  setTargetsMetadata(e, t, r) {
    return r && (this.lastRemoteSnapshotVersion = r), t > this.oi && (this.oi = t), v.resolve();
  }
  Pr(e) {
    this.si.set(e.target, e);
    const t = e.targetId;
    t > this.highestTargetId && (this.ai = new On(t), this.highestTargetId = t), e.sequenceNumber > this.oi && (this.oi = e.sequenceNumber);
  }
  addTargetData(e, t) {
    return this.Pr(t), this.targetCount += 1, v.resolve();
  }
  updateTargetData(e, t) {
    return this.Pr(t), v.resolve();
  }
  removeTargetData(e, t) {
    return this.si.delete(t.target), this._i.jr(t.targetId), this.targetCount -= 1, v.resolve();
  }
  removeTargets(e, t, r) {
    let s = 0;
    const i = [];
    return this.si.forEach((o, c) => {
      c.sequenceNumber <= t && r.get(c.targetId) === null && (this.si.delete(o), i.push(this.removeMatchingKeysForTargetId(e, c.targetId)), s++);
    }), v.waitFor(i).next(() => s);
  }
  getTargetCount(e) {
    return v.resolve(this.targetCount);
  }
  getTargetData(e, t) {
    const r = this.si.get(t) || null;
    return v.resolve(r);
  }
  addMatchingKeys(e, t, r) {
    return this._i.Wr(t, r), v.resolve();
  }
  removeMatchingKeys(e, t, r) {
    this._i.zr(t, r);
    const s = this.persistence.referenceDelegate,
      i = [];
    return s && t.forEach(o => {
      i.push(s.markPotentiallyOrphaned(e, o));
    }), v.waitFor(i);
  }
  removeMatchingKeysForTargetId(e, t) {
    return this._i.jr(t), v.resolve();
  }
  getMatchingKeysForTargetId(e, t) {
    const r = this._i.Hr(t);
    return v.resolve(r);
  }
  containsKey(e, t) {
    return v.resolve(this._i.containsKey(t));
  }
}
class Qc {
  constructor(e, t) {
    this.ui = {}, this.overlays = {}, this.ci = new Ge(0), this.li = !1, this.li = !0, this.hi = new kw(), this.referenceDelegate = e(this), this.Pi = new Ow(this), this.indexManager = new Ew(), this.remoteDocumentCache = function (s) {
      return new Nw(s);
    }(r => this.referenceDelegate.Ti(r)), this.serializer = new Gp(t), this.Ii = new Cw(this.serializer);
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return this.li = !1, Promise.resolve();
  }
  get started() {
    return this.li;
  }
  setDatabaseDeletedListener() {}
  setNetworkEnabled() {}
  getIndexManager(e) {
    return this.indexManager;
  }
  getDocumentOverlayCache(e) {
    let t = this.overlays[e.toKey()];
    return t || (t = new Vw(), this.overlays[e.toKey()] = t), t;
  }
  getMutationQueue(e, t) {
    let r = this.ui[e.toKey()];
    return r || (r = new Dw(t, this.referenceDelegate), this.ui[e.toKey()] = r), r;
  }
  getGlobalsCache() {
    return this.hi;
  }
  getTargetCache() {
    return this.Pi;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.Ii;
  }
  runTransaction(e, t, r) {
    k("MemoryPersistence", "Starting transaction:", e);
    const s = new Mw(this.ci.next());
    return this.referenceDelegate.Ei(), r(s).next(i => this.referenceDelegate.di(s).next(() => i)).toPromise().then(i => (s.raiseOnCommittedEvent(), i));
  }
  Ai(e, t) {
    return v.or(Object.values(this.ui).map(r => () => r.containsKey(e, t)));
  }
}
class Mw extends jf {
  constructor(e) {
    super(), this.currentSequenceNumber = e;
  }
}
class ko {
  constructor(e) {
    this.persistence = e, this.Ri = new Wc(), this.Vi = null;
  }
  static mi(e) {
    return new ko(e);
  }
  get fi() {
    if (this.Vi) return this.Vi;
    throw L(60996);
  }
  addReference(e, t, r) {
    return this.Ri.addReference(r, t), this.fi.delete(r.toString()), v.resolve();
  }
  removeReference(e, t, r) {
    return this.Ri.removeReference(r, t), this.fi.add(r.toString()), v.resolve();
  }
  markPotentiallyOrphaned(e, t) {
    return this.fi.add(t.toString()), v.resolve();
  }
  removeTarget(e, t) {
    this.Ri.jr(t.targetId).forEach(s => this.fi.add(s.toString()));
    const r = this.persistence.getTargetCache();
    return r.getMatchingKeysForTargetId(e, t.targetId).next(s => {
      s.forEach(i => this.fi.add(i.toString()));
    }).next(() => r.removeTargetData(e, t));
  }
  Ei() {
    this.Vi = new Set();
  }
  di(e) {
    const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return v.forEach(this.fi, r => {
      const s = O.fromPath(r);
      return this.gi(e, s).next(i => {
        i || t.removeEntry(s, B.min());
      });
    }).next(() => (this.Vi = null, t.apply(e)));
  }
  updateLimboDocument(e, t) {
    return this.gi(e, t).next(r => {
      r ? this.fi.delete(t.toString()) : this.fi.add(t.toString());
    });
  }
  Ti(e) {
    return 0;
  }
  gi(e, t) {
    return v.or([() => v.resolve(this.Ri.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.Ai(e, t)]);
  }
}
class ro {
  constructor(e, t) {
    this.persistence = e, this.pi = new Vt(r => Ve(r.path), (r, s) => r.isEqual(s)), this.garbageCollector = nm(this, t);
  }
  static mi(e, t) {
    return new ro(e, t);
  }
  Ei() {}
  di(e) {
    return v.resolve();
  }
  forEachTarget(e, t) {
    return this.persistence.getTargetCache().forEachTarget(e, t);
  }
  gr(e) {
    const t = this.wr(e);
    return this.persistence.getTargetCache().getTargetCount(e).next(r => t.next(s => r + s));
  }
  wr(e) {
    let t = 0;
    return this.pr(e, r => {
      t++;
    }).next(() => t);
  }
  pr(e, t) {
    return v.forEach(this.pi, (r, s) => this.br(e, r, s).next(i => i ? v.resolve() : t(s)));
  }
  removeTargets(e, t, r) {
    return this.persistence.getTargetCache().removeTargets(e, t, r);
  }
  removeOrphanedDocuments(e, t) {
    let r = 0;
    const s = this.persistence.getRemoteDocumentCache(),
      i = s.newChangeBuffer();
    return s.ii(e, o => this.br(e, o, t).next(c => {
      c || (r++, i.removeEntry(o, B.min()));
    })).next(() => i.apply(e)).next(() => r);
  }
  markPotentiallyOrphaned(e, t) {
    return this.pi.set(t, e.currentSequenceNumber), v.resolve();
  }
  removeTarget(e, t) {
    const r = t.withSequenceNumber(e.currentSequenceNumber);
    return this.persistence.getTargetCache().updateTargetData(e, r);
  }
  addReference(e, t, r) {
    return this.pi.set(r, e.currentSequenceNumber), v.resolve();
  }
  removeReference(e, t, r) {
    return this.pi.set(r, e.currentSequenceNumber), v.resolve();
  }
  updateLimboDocument(e, t) {
    return this.pi.set(t, e.currentSequenceNumber), v.resolve();
  }
  Ti(e) {
    let t = e.key.toString().length;
    return e.isFoundDocument() && (t += Ci(e.data.value)), t;
  }
  br(e, t, r) {
    return v.or([() => this.persistence.Ai(e, t), () => this.persistence.getTargetCache().containsKey(e, t), () => {
      const s = this.pi.get(t);
      return v.resolve(s !== void 0 && s > r);
    }]);
  }
  getCacheSize(e) {
    return this.persistence.getRemoteDocumentCache().getSize(e);
  }
}
class Lw {
  constructor(e) {
    this.serializer = e;
  }
  k(e, t, r, s) {
    const i = new _o("createOrUpgrade", t);
    r < 1 && s >= 1 && (function (u) {
      u.createObjectStore(Ms);
    }(e), function (u) {
      u.createObjectStore(Es, {
        keyPath: QE
      }), u.createObjectStore(We, {
        keyPath: ph,
        autoIncrement: !0
      }).createIndex(Tn, mh, {
        unique: !0
      }), u.createObjectStore(dr);
    }(e), sd(e), function (u) {
      u.createObjectStore(mn);
    }(e));
    let o = v.resolve();
    return r < 3 && s >= 3 && (r !== 0 && (function (u) {
      u.deleteObjectStore(pr), u.deleteObjectStore(fr), u.deleteObjectStore(vn);
    }(e), sd(e)), o = o.next(() => function (u) {
      const h = u.store(vn),
        f = {
          highestTargetId: 0,
          highestListenSequenceNumber: 0,
          lastRemoteSnapshotVersion: B.min().toTimestamp(),
          targetCount: 0
        };
      return h.put(Hi, f);
    }(i))), r < 4 && s >= 4 && (r !== 0 && (o = o.next(() => function (u, h) {
      return h.store(We).J().next(m => {
        u.deleteObjectStore(We), u.createObjectStore(We, {
          keyPath: ph,
          autoIncrement: !0
        }).createIndex(Tn, mh, {
          unique: !0
        });
        const _ = h.store(We),
          b = m.map(V => _.put(V));
        return v.waitFor(b);
      });
    }(e, i))), o = o.next(() => {
      (function (u) {
        u.createObjectStore(mr, {
          keyPath: sT
        });
      })(e);
    })), r < 5 && s >= 5 && (o = o.next(() => this.yi(i))), r < 6 && s >= 6 && (o = o.next(() => (function (u) {
      u.createObjectStore(Ts);
    }(e), this.wi(i)))), r < 7 && s >= 7 && (o = o.next(() => this.Si(i))), r < 8 && s >= 8 && (o = o.next(() => this.bi(e, i))), r < 9 && s >= 9 && (o = o.next(() => {
      (function (u) {
        u.objectStoreNames.contains("remoteDocumentChanges") && u.deleteObjectStore("remoteDocumentChanges");
      })(e);
    })), r < 10 && s >= 10 && (o = o.next(() => this.Di(i))), r < 11 && s >= 11 && (o = o.next(() => {
      (function (u) {
        u.createObjectStore(Io, {
          keyPath: iT
        });
      })(e), function (u) {
        u.createObjectStore(Eo, {
          keyPath: oT
        });
      }(e);
    })), r < 12 && s >= 12 && (o = o.next(() => {
      (function (u) {
        const h = u.createObjectStore(To, {
          keyPath: fT
        });
        h.createIndex(Ka, pT, {
          unique: !1
        }), h.createIndex(Qf, mT, {
          unique: !1
        });
      })(e);
    })), r < 13 && s >= 13 && (o = o.next(() => function (u) {
      const h = u.createObjectStore(Ki, {
        keyPath: JE
      });
      h.createIndex(Pi, YE), h.createIndex(Gf, ZE);
    }(e)).next(() => this.Ci(e, i)).next(() => e.deleteObjectStore(mn))), r < 14 && s >= 14 && (o = o.next(() => this.Fi(e, i))), r < 15 && s >= 15 && (o = o.next(() => function (u) {
      u.createObjectStore(Nc, {
        keyPath: aT,
        autoIncrement: !0
      }).createIndex(Ga, cT, {
        unique: !1
      }), u.createObjectStore(us, {
        keyPath: uT
      }).createIndex(Hf, lT, {
        unique: !1
      }), u.createObjectStore(ls, {
        keyPath: hT
      }).createIndex(Wf, dT, {
        unique: !1
      });
    }(e))), r < 16 && s >= 16 && (o = o.next(() => {
      t.objectStore(us).clear();
    }).next(() => {
      t.objectStore(ls).clear();
    })), r < 17 && s >= 17 && (o = o.next(() => {
      (function (u) {
        u.createObjectStore(xc, {
          keyPath: gT
        });
      })(e);
    })), r < 18 && s >= 18 && Ud() && (o = o.next(() => {
      t.objectStore(us).clear();
    }).next(() => {
      t.objectStore(ls).clear();
    })), o;
  }
  wi(e) {
    let t = 0;
    return e.store(mn).ee((r, s) => {
      t += no(s);
    }).next(() => {
      const r = {
        byteSize: t
      };
      return e.store(Ts).put($a, r);
    });
  }
  yi(e) {
    const t = e.store(Es),
      r = e.store(We);
    return t.J().next(s => v.forEach(s, i => {
      const o = IDBKeyRange.bound([i.userId, wn], [i.userId, i.lastAcknowledgedBatchId]);
      return r.J(Tn, o).next(c => v.forEach(c, u => {
        F(u.userId === i.userId, 18650, "Cannot process batch from unexpected user", {
          batchId: u.batchId
        });
        const h = _n(this.serializer, u);
        return Jp(e, i.userId, h).next(() => {});
      }));
    }));
  }
  Si(e) {
    const t = e.store(pr),
      r = e.store(mn);
    return e.store(vn).get(Hi).next(s => {
      const i = [];
      return r.ee((o, c) => {
        const u = new Z(o),
          h = function (m) {
            return [0, Ve(m)];
          }(u);
        i.push(t.get(h).next(f => f ? v.resolve() : (m => t.put({
          targetId: 0,
          path: Ve(m),
          sequenceNumber: s.highestListenSequenceNumber
        }))(u)));
      }).next(() => v.waitFor(i));
    });
  }
  bi(e, t) {
    e.createObjectStore(ws, {
      keyPath: rT
    });
    const r = t.store(ws),
      s = new Hc(),
      i = o => {
        if (s.add(o)) {
          const c = o.lastSegment(),
            u = o.popLast();
          return r.put({
            collectionId: c,
            parent: Ve(u)
          });
        }
      };
    return t.store(mn).ee({
      X: !0
    }, (o, c) => {
      const u = new Z(o);
      return i(u.popLast());
    }).next(() => t.store(dr).ee({
      X: !0
    }, ([o, c, u], h) => {
      const f = rt(c);
      return i(f.popLast());
    }));
  }
  Di(e) {
    const t = e.store(fr);
    return t.ee((r, s) => {
      const i = rs(s),
        o = Kp(this.serializer, i);
      return t.put(o);
    });
  }
  Ci(e, t) {
    const r = t.store(mn),
      s = [];
    return r.ee((i, o) => {
      const c = t.store(Ki),
        u = function (m) {
          return m.document ? new O(Z.fromString(m.document.name).popFirst(5)) : m.noDocument ? O.fromSegments(m.noDocument.path) : m.unknownDocument ? O.fromSegments(m.unknownDocument.path) : L(36783);
        }(o).path.toArray(),
        h = {
          prefixPath: u.slice(0, u.length - 2),
          collectionGroup: u[u.length - 2],
          documentId: u[u.length - 1],
          readTime: o.readTime || [0, 0],
          unknownDocument: o.unknownDocument,
          noDocument: o.noDocument,
          document: o.document,
          hasCommittedMutations: !!o.hasCommittedMutations
        };
      s.push(c.put(h));
    }).next(() => v.waitFor(s));
  }
  Fi(e, t) {
    const r = t.store(We),
      s = sm(this.serializer),
      i = new Qc(ko.mi, this.serializer.yt);
    return r.J().next(o => {
      const c = new Map();
      return o.forEach(u => {
        let h = c.get(u.userId) ?? H();
        _n(this.serializer, u).keys().forEach(f => h = h.add(f)), c.set(u.userId, h);
      }), v.forEach(c, (u, h) => {
        const f = new Ae(h),
          m = Co.wt(this.serializer, f),
          _ = i.getIndexManager(f),
          b = Vo.wt(f, this.serializer, _, i.referenceDelegate);
        return new im(s, b, m, _).recalculateAndSaveOverlaysForDocumentKeys(new Ha(t, Ge.ce), u).next();
      });
    });
  }
}
function sd(n) {
  n.createObjectStore(pr, {
    keyPath: tT
  }).createIndex(Dc, nT, {
    unique: !0
  }), n.createObjectStore(fr, {
    keyPath: "targetId"
  }).createIndex(Kf, eT, {
    unique: !0
  }), n.createObjectStore(vn);
}
const qt = "IndexedDbPersistence";
const wa = 18e5;
const va = 5e3;
const Aa = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";
const Fw = "main";
class Xc {
  constructor(e, t, r, s, i, o, c, u, h, f, m = 18) {
    if (this.allowTabSynchronization = e, this.persistenceKey = t, this.clientId = r, this.Mi = i, this.window = o, this.document = c, this.xi = h, this.Oi = f, this.Ni = m, this.ci = null, this.li = !1, this.isPrimary = !1, this.networkEnabled = !0, this.Bi = null, this.inForeground = !1, this.Li = null, this.ki = null, this.qi = Number.NEGATIVE_INFINITY, this.Qi = _ => Promise.resolve(), !Xc.v()) throw new D(S.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
    this.referenceDelegate = new Rw(this, s), this.$i = t + Fw, this.serializer = new Gp(u), this.Ui = new Ht(this.$i, this.Ni, new Lw(this.serializer)), this.hi = new pw(), this.Pi = new ww(this.referenceDelegate, this.serializer), this.remoteDocumentCache = sm(this.serializer), this.Ii = new fw(), this.window && this.window.localStorage ? this.Ki = this.window.localStorage : (this.Ki = null, f === !1 && Oe(qt, "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
  }
  start() {
    return this.Wi().then(() => {
      if (!this.isPrimary && !this.allowTabSynchronization) throw new D(S.FAILED_PRECONDITION, Aa);
      return this.Gi(), this.zi(), this.ji(), this.runTransaction("getHighestListenSequenceNumber", "readonly", e => this.Pi.getHighestSequenceNumber(e));
    }).then(e => {
      this.ci = new Ge(e, this.xi);
    }).then(() => {
      this.li = !0;
    }).catch(e => (this.Ui && this.Ui.close(), Promise.reject(e)));
  }
  Ji(e) {
    return this.Qi = async t => {
      if (this.started) return e(t);
    }, e(this.isPrimary);
  }
  setDatabaseDeletedListener(e) {
    this.Ui.$(async t => {
      t.newVersion === null && (await e());
    });
  }
  setNetworkEnabled(e) {
    this.networkEnabled !== e && (this.networkEnabled = e, this.Mi.enqueueAndForget(async () => {
      this.started && (await this.Wi());
    }));
  }
  Wi() {
    return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", e => gi(e).put({
      clientId: this.clientId,
      updateTimeMs: Date.now(),
      networkEnabled: this.networkEnabled,
      inForeground: this.inForeground
    }).next(() => {
      if (this.isPrimary) return this.Hi(e).next(t => {
        t || (this.isPrimary = !1, this.Mi.enqueueRetryable(() => this.Qi(!1)));
      });
    }).next(() => this.Yi(e)).next(t => this.isPrimary && !t ? this.Zi(e).next(() => !1) : !!t && this.Xi(e).next(() => !0))).catch(e => {
      if (rn(e)) return k(qt, "Failed to extend owner lease: ", e), this.isPrimary;
      if (!this.allowTabSynchronization) throw e;
      return k(qt, "Releasing owner lease after error during lease refresh", e), !1;
    }).then(e => {
      this.isPrimary !== e && this.Mi.enqueueRetryable(() => this.Qi(e)), this.isPrimary = e;
    });
  }
  Hi(e) {
    return Xr(e).get(Hn).next(t => v.resolve(this.es(t)));
  }
  ts(e) {
    return gi(e).delete(this.clientId);
  }
  async ns() {
    if (this.isPrimary && !this.rs(this.qi, wa)) {
      this.qi = Date.now();
      const e = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", t => {
        const r = Ee(t, mr);
        return r.J().next(s => {
          const i = this.ss(s, wa),
            o = s.filter(c => i.indexOf(c) === -1);
          return v.forEach(o, c => r.delete(c.clientId)).next(() => o);
        });
      }).catch(() => []);
      if (this.Ki) for (const t of e) this.Ki.removeItem(this._s(t.clientId));
    }
  }
  ji() {
    this.ki = this.Mi.enqueueAfterDelay("client_metadata_refresh", 4e3, () => this.Wi().then(() => this.ns()).then(() => this.ji()));
  }
  es(e) {
    return !!e && e.ownerId === this.clientId;
  }
  Yi(e) {
    return this.Oi ? v.resolve(!0) : Xr(e).get(Hn).next(t => {
      if (t !== null && this.rs(t.leaseTimestampMs, va) && !this.us(t.ownerId)) {
        if (this.es(t) && this.networkEnabled) return !0;
        if (!this.es(t)) {
          if (!t.allowTabSynchronization) throw new D(S.FAILED_PRECONDITION, Aa);
          return !1;
        }
      }
      return !(!this.networkEnabled || !this.inForeground) || gi(e).J().next(r => this.ss(r, va).find(s => {
        if (this.clientId !== s.clientId) {
          const i = !this.networkEnabled && s.networkEnabled,
            o = !this.inForeground && s.inForeground,
            c = this.networkEnabled === s.networkEnabled;
          if (i || o && c) return !0;
        }
        return !1;
      }) === void 0);
    }).next(t => (this.isPrimary !== t && k(qt, `Client ${t ? "is" : "is not"} eligible for a primary lease.`), t));
  }
  async shutdown() {
    this.li = !1, this.cs(), this.ki && (this.ki.cancel(), this.ki = null), this.ls(), this.hs(), await this.Ui.runTransaction("shutdown", "readwrite", [Ms, mr], e => {
      const t = new Ha(e, Ge.ce);
      return this.Zi(t).next(() => this.ts(t));
    }), this.Ui.close(), this.Ps();
  }
  ss(e, t) {
    return e.filter(r => this.rs(r.updateTimeMs, t) && !this.us(r.clientId));
  }
  Ts() {
    return this.runTransaction("getActiveClients", "readonly", e => gi(e).J().next(t => this.ss(t, wa).map(r => r.clientId)));
  }
  get started() {
    return this.li;
  }
  getGlobalsCache() {
    return this.hi;
  }
  getMutationQueue(e, t) {
    return Vo.wt(e, this.serializer, t, this.referenceDelegate);
  }
  getTargetCache() {
    return this.Pi;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getIndexManager(e) {
    return new Tw(e, this.serializer.yt.databaseId);
  }
  getDocumentOverlayCache(e) {
    return Co.wt(this.serializer, e);
  }
  getBundleCache() {
    return this.Ii;
  }
  runTransaction(e, t, r) {
    k(qt, "Starting transaction:", e);
    const s = t === "readonly" ? "readonly" : "readwrite",
      i = function (u) {
        return u === 18 ? IT : u === 17 ? Zf : u === 16 ? yT : u === 15 ? Oc : u === 14 ? Yf : u === 13 ? Jf : u === 12 ? _T : u === 11 ? Xf : void L(60245);
      }(this.Ni);
    let o;
    return this.Ui.runTransaction(e, s, i, c => (o = new Ha(c, this.ci ? this.ci.next() : Ge.ce), t === "readwrite-primary" ? this.Hi(o).next(u => !!u || this.Yi(o)).next(u => {
      if (!u) throw Oe(`Failed to obtain primary lease for action '${e}'.`), this.isPrimary = !1, this.Mi.enqueueRetryable(() => this.Qi(!1)), new D(S.FAILED_PRECONDITION, qf);
      return r(o);
    }).next(u => this.Xi(o).next(() => u)) : this.Is(o).next(() => r(o)))).then(c => (o.raiseOnCommittedEvent(), c));
  }
  Is(e) {
    return Xr(e).get(Hn).next(t => {
      if (t !== null && this.rs(t.leaseTimestampMs, va) && !this.us(t.ownerId) && !this.es(t) && !(this.Oi || this.allowTabSynchronization && t.allowTabSynchronization)) throw new D(S.FAILED_PRECONDITION, Aa);
    });
  }
  Xi(e) {
    const t = {
      ownerId: this.clientId,
      allowTabSynchronization: this.allowTabSynchronization,
      leaseTimestampMs: Date.now()
    };
    return Xr(e).put(Hn, t);
  }
  static v() {
    return Ht.v();
  }
  Zi(e) {
    const t = Xr(e);
    return t.get(Hn).next(r => this.es(r) ? (k(qt, "Releasing primary lease."), t.delete(Hn)) : v.resolve());
  }
  rs(e, t) {
    const r = Date.now();
    return !(e < r - t) && (!(e > r) || (Oe(`Detected an update time that is in the future: ${e} > ${r}`), !1));
  }
  Gi() {
    this.document !== null && typeof this.document.addEventListener == "function" && (this.Li = () => {
      this.Mi.enqueueAndForget(() => (this.inForeground = this.document.visibilityState === "visible", this.Wi()));
    }, this.document.addEventListener("visibilitychange", this.Li), this.inForeground = this.document.visibilityState === "visible");
  }
  ls() {
    this.Li && (this.document.removeEventListener("visibilitychange", this.Li), this.Li = null);
  }
  zi() {
    typeof this.window?.addEventListener == "function" && (this.Bi = () => {
      this.cs();
      const e = /(?:Version|Mobile)\/1[456]/;
      Fd() && (navigator.appVersion.match(e) || navigator.userAgent.match(e)) && this.Mi.enterRestrictedMode(!0), this.Mi.enqueueAndForget(() => this.shutdown());
    }, this.window.addEventListener("pagehide", this.Bi));
  }
  hs() {
    this.Bi && (this.window.removeEventListener("pagehide", this.Bi), this.Bi = null);
  }
  us(e) {
    try {
      const t = this.Ki?.getItem(this._s(e)) !== null;
      return k(qt, `Client '${e}' ${t ? "is" : "is not"} zombied in LocalStorage`), t;
    } catch (t) {
      return Oe(qt, "Failed to get zombied client id.", t), !1;
    }
  }
  cs() {
    if (this.Ki) try {
      this.Ki.setItem(this._s(this.clientId), String(Date.now()));
    } catch (e) {
      Oe("Failed to set zombie client id.", e);
    }
  }
  Ps() {
    if (this.Ki) try {
      this.Ki.removeItem(this._s(this.clientId));
    } catch {}
  }
  _s(e) {
    return `firestore_zombie_${this.persistenceKey}_${e}`;
  }
}
function Xr(n) {
  return Ee(n, Ms);
}
function gi(n) {
  return Ee(n, mr);
}
function Uw(n, e) {
  let t = n.projectId;
  return n.isDefaultDatabase || (t += "." + n.database), "firestore/" + e + "/" + t + "/";
}
class Jc {
  constructor(e, t, r, s) {
    this.targetId = e, this.fromCache = t, this.Es = r, this.ds = s;
  }
  static As(e, t) {
    let r = H(),
      s = H();
    for (const i of t.docChanges) switch (i.type) {
      case 0:
        r = r.add(i.doc.key);
        break;
      case 1:
        s = s.add(i.doc.key);
    }
    return new Jc(e, t.fromCache, r, s);
  }
}
class Bw {
  constructor() {
    this._documentReadCount = 0;
  }
  get documentReadCount() {
    return this._documentReadCount;
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e;
  }
}
class om {
  constructor() {
    this.Rs = !1, this.Vs = !1, this.fs = 100, this.gs = function () {
      return Fd() ? 8 : zf(Ie()) > 0 ? 6 : 4;
    }();
  }
  initialize(e, t) {
    this.ps = e, this.indexManager = t, this.Rs = !0;
  }
  getDocumentsMatchingQuery(e, t, r, s) {
    const i = {
      result: null
    };
    return this.ys(e, t).next(o => {
      i.result = o;
    }).next(() => {
      if (!i.result) return this.ws(e, t, s, r).next(o => {
        i.result = o;
      });
    }).next(() => {
      if (i.result) return;
      const o = new Bw();
      return this.Ss(e, t, o).next(c => {
        if (i.result = c, this.Vs) return this.bs(e, t, o, c.size);
      });
    }).next(() => i.result);
  }
  bs(e, t, r, s) {
    return r.documentReadCount < this.fs ? (Zn() <= X.DEBUG && k("QueryEngine", "SDK will not create cache indexes for query:", er(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.fs, "documents"), v.resolve()) : (Zn() <= X.DEBUG && k("QueryEngine", "Query:", er(t), "scans", r.documentReadCount, "local documents and returns", s, "documents as results."), r.documentReadCount > this.gs * s ? (Zn() <= X.DEBUG && k("QueryEngine", "The SDK decides to create cache indexes for query:", er(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, Ke(t))) : v.resolve());
  }
  ys(e, t) {
    if (Sh(t)) return v.resolve(null);
    let r = Ke(t);
    return this.indexManager.getIndexType(e, r).next(s => s === 0 ? null : (t.limit !== null && s === 1 && (t = Ji(t, null, "F"), r = Ke(t)), this.indexManager.getDocumentsMatchingTarget(e, r).next(i => {
      const o = H(...i);
      return this.ps.getDocuments(e, o).next(c => this.indexManager.getMinOffset(e, r).next(u => {
        const h = this.Ds(t, c);
        return this.Cs(t, h, o, u.readTime) ? this.ys(e, Ji(t, null, "F")) : this.vs(e, h, t, u);
      }));
    })));
  }
  ws(e, t, r, s) {
    return Sh(t) || s.isEqual(B.min()) ? v.resolve(null) : this.ps.getDocuments(e, r).next(i => {
      const o = this.Ds(t, i);
      return this.Cs(t, o, r, s) ? v.resolve(null) : (Zn() <= X.DEBUG && k("QueryEngine", "Re-using previous result from %s to execute query: %s", s.toString(), er(t)), this.vs(e, o, t, jE(s, _s)).next(c => c));
    });
  }
  Ds(e, t) {
    let r = new ne(Ip(e));
    return t.forEach((s, i) => {
      Us(e, i) && (r = r.add(i));
    }), r;
  }
  Cs(e, t, r, s) {
    if (e.limit === null) return !1;
    if (r.size !== t.size) return !0;
    const i = e.limitType === "F" ? t.last() : t.first();
    return !!i && (i.hasPendingWrites || i.version.compareTo(s) > 0);
  }
  Ss(e, t, r) {
    return Zn() <= X.DEBUG && k("QueryEngine", "Using full collection scan to execute query:", er(t)), this.ps.getDocumentsMatchingQuery(e, t, ze.min(), r);
  }
  vs(e, t, r, s) {
    return this.ps.getDocumentsMatchingQuery(e, r, s).next(i => (t.forEach(o => {
      i = i.insert(o.key, o);
    }), i));
  }
}
const Yc = "LocalStore";
const qw = 3e8;
class jw {
  constructor(e, t, r, s) {
    this.persistence = e, this.Fs = t, this.serializer = s, this.Ms = new ae(z), this.xs = new Vt(i => Vn(i), Ls), this.Os = new Map(), this.Ns = e.getRemoteDocumentCache(), this.Pi = e.getTargetCache(), this.Ii = e.getBundleCache(), this.Bs(r);
  }
  Bs(e) {
    this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new im(this.Ns, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.Ns.setIndexManager(this.indexManager), this.Fs.initialize(this.localDocuments, this.indexManager);
  }
  collectGarbage(e) {
    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", t => e.collect(t, this.Ms));
  }
}
function am(n, e, t, r) {
  return new jw(n, e, t, r);
}
async function cm(n, e) {
  const t = $(n);
  return await t.persistence.runTransaction("Handle user change", "readonly", r => {
    let s;
    return t.mutationQueue.getAllMutationBatches(r).next(i => (s = i, t.Bs(e), t.mutationQueue.getAllMutationBatches(r))).next(i => {
      const o = [],
        c = [];
      let u = H();
      for (const h of s) {
        o.push(h.batchId);
        for (const f of h.mutations) u = u.add(f.key);
      }
      for (const h of i) {
        c.push(h.batchId);
        for (const f of h.mutations) u = u.add(f.key);
      }
      return t.localDocuments.getDocuments(r, u).next(h => ({
        Ls: h,
        removedBatchIds: o,
        addedBatchIds: c
      }));
    });
  });
}
function zw(n, e) {
  const t = $(n);
  return t.persistence.runTransaction("Acknowledge batch", "readwrite-primary", r => {
    const s = e.batch.keys(),
      i = t.Ns.newChangeBuffer({
        trackRemovals: !0
      });
    return function (c, u, h, f) {
      const m = h.batch,
        _ = m.keys();
      let b = v.resolve();
      return _.forEach(V => {
        b = b.next(() => f.getEntry(u, V)).next(N => {
          const C = h.docVersions.get(V);
          F(C !== null, 48541), N.version.compareTo(C) < 0 && (m.applyToRemoteDocument(N, h), N.isValidDocument() && (N.setReadTime(h.commitVersion), f.addEntry(N)));
        });
      }), b.next(() => c.mutationQueue.removeMutationBatch(u, m));
    }(t, r, e, i).next(() => i.apply(r)).next(() => t.mutationQueue.performConsistencyCheck(r)).next(() => t.documentOverlayCache.removeOverlaysForBatchId(r, s, e.batch.batchId)).next(() => t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r, function (c) {
      let u = H();
      for (let h = 0; h < c.mutationResults.length; ++h) c.mutationResults[h].transformResults.length > 0 && (u = u.add(c.batch.mutations[h].key));
      return u;
    }(e))).next(() => t.localDocuments.getDocuments(r, s));
  });
}
function um(n) {
  const e = $(n);
  return e.persistence.runTransaction("Get last remote snapshot version", "readonly", t => e.Pi.getLastRemoteSnapshotVersion(t));
}
function $w(n, e) {
  const t = $(n),
    r = e.snapshotVersion;
  let s = t.Ms;
  return t.persistence.runTransaction("Apply remote event", "readwrite-primary", i => {
    const o = t.Ns.newChangeBuffer({
      trackRemovals: !0
    });
    s = t.Ms;
    const c = [];
    e.targetChanges.forEach((f, m) => {
      const _ = s.get(m);
      if (!_) return;
      c.push(t.Pi.removeMatchingKeys(i, f.removedDocuments, m).next(() => t.Pi.addMatchingKeys(i, f.addedDocuments, m)));
      let b = _.withSequenceNumber(i.currentSequenceNumber);
      e.targetMismatches.get(m) !== null ? b = b.withResumeToken(ge.EMPTY_BYTE_STRING, B.min()).withLastLimboFreeSnapshotVersion(B.min()) : f.resumeToken.approximateByteSize() > 0 && (b = b.withResumeToken(f.resumeToken, r)), s = s.insert(m, b), function (N, C, q) {
        return N.resumeToken.approximateByteSize() === 0 || C.snapshotVersion.toMicroseconds() - N.snapshotVersion.toMicroseconds() >= qw ? !0 : q.addedDocuments.size + q.modifiedDocuments.size + q.removedDocuments.size > 0;
      }(_, b, f) && c.push(t.Pi.updateTargetData(i, b));
    });
    let u = je(),
      h = H();
    if (e.documentUpdates.forEach(f => {
      e.resolvedLimboDocuments.has(f) && c.push(t.persistence.referenceDelegate.updateLimboDocument(i, f));
    }), c.push(Gw(i, o, e.documentUpdates).next(f => {
      u = f.ks, h = f.qs;
    })), !r.isEqual(B.min())) {
      const f = t.Pi.getLastRemoteSnapshotVersion(i).next(m => t.Pi.setTargetsMetadata(i, i.currentSequenceNumber, r));
      c.push(f);
    }
    return v.waitFor(c).next(() => o.apply(i)).next(() => t.localDocuments.getLocalViewOfDocuments(i, u, h)).next(() => u);
  }).then(i => (t.Ms = s, i));
}
function Gw(n, e, t) {
  let r = H(),
    s = H();
  return t.forEach(i => r = r.add(i)), e.getEntries(n, r).next(i => {
    let o = je();
    return t.forEach((c, u) => {
      const h = i.get(c);
      u.isFoundDocument() !== h.isFoundDocument() && (s = s.add(c)), u.isNoDocument() && u.version.isEqual(B.min()) ? (e.removeEntry(c, u.readTime), o = o.insert(c, u)) : !h.isValidDocument() || u.version.compareTo(h.version) > 0 || u.version.compareTo(h.version) === 0 && h.hasPendingWrites ? (e.addEntry(u), o = o.insert(c, u)) : k(Yc, "Ignoring outdated watch update for ", c, ". Current version:", h.version, " Watch version:", u.version);
    }), {
      ks: o,
      qs: s
    };
  });
}
function Kw(n, e) {
  const t = $(n);
  return t.persistence.runTransaction("Get next mutation batch", "readonly", r => (e === void 0 && (e = wn), t.mutationQueue.getNextMutationBatchAfterBatchId(r, e)));
}
function Hw(n, e) {
  const t = $(n);
  return t.persistence.runTransaction("Allocate target", "readwrite", r => {
    let s;
    return t.Pi.getTargetData(r, e).next(i => i ? (s = i, v.resolve(s)) : t.Pi.allocateTargetId(r).next(o => (s = new Et(e, o, "TargetPurposeListen", r.currentSequenceNumber), t.Pi.addTargetData(r, s).next(() => s))));
  }).then(r => {
    const s = t.Ms.get(r.targetId);
    return (s === null || r.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (t.Ms = t.Ms.insert(r.targetId, r), t.xs.set(e, r.targetId)), r;
  });
}
async function ac(n, e, t) {
  const r = $(n),
    s = r.Ms.get(e),
    i = t ? "readwrite" : "readwrite-primary";
  try {
    t || (await r.persistence.runTransaction("Release target", i, o => r.persistence.referenceDelegate.removeTarget(o, s)));
  } catch (o) {
    if (!rn(o)) throw o;
    k(Yc, `Failed to update sequence numbers for target ${e}: ${o}`);
  }
  r.Ms = r.Ms.remove(e), r.xs.delete(s.target);
}
function cc(n, e, t) {
  const r = $(n);
  let s = B.min(),
    i = H();
  return r.persistence.runTransaction("Execute query", "readwrite", o => function (u, h, f) {
    const m = $(u),
      _ = m.xs.get(f);
    return _ !== void 0 ? v.resolve(m.Ms.get(_)) : m.Pi.getTargetData(h, f);
  }(r, o, Ke(e)).next(c => {
    if (c) return s = c.lastLimboFreeSnapshotVersion, r.Pi.getMatchingKeysForTargetId(o, c.targetId).next(u => {
      i = u;
    });
  }).next(() => r.Fs.getDocumentsMatchingQuery(o, e, t ? s : B.min(), t ? i : H())).next(c => (Ww(r, xT(e), c), {
    documents: c,
    Qs: i
  })));
}
function Ww(n, e, t) {
  let r = n.Os.get(e) || B.min();
  t.forEach((s, i) => {
    i.readTime.compareTo(r) > 0 && (r = i.readTime);
  }), n.Os.set(e, r);
}
class id {
  constructor() {
    this.activeTargetIds = BT();
  }
  zs(e) {
    this.activeTargetIds = this.activeTargetIds.add(e);
  }
  js(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e);
  }
  Gs() {
    const e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now()
    };
    return JSON.stringify(e);
  }
}
class lm {
  constructor() {
    this.Mo = new id(), this.xo = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
  }
  addPendingMutation(e) {}
  updateMutationState(e, t, r) {}
  addLocalQueryTarget(e, t = !0) {
    return t && this.Mo.zs(e), this.xo[e] || "not-current";
  }
  updateQueryState(e, t, r) {
    this.xo[e] = t;
  }
  removeLocalQueryTarget(e) {
    this.Mo.js(e);
  }
  isLocalQueryTarget(e) {
    return this.Mo.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    delete this.xo[e];
  }
  getAllActiveQueryTargets() {
    return this.Mo.activeTargetIds;
  }
  isActiveQueryTarget(e) {
    return this.Mo.activeTargetIds.has(e);
  }
  start() {
    return this.Mo = new id(), Promise.resolve();
  }
  handleUserChange(e, t, r) {}
  setOnlineState(e) {}
  shutdown() {}
  writeSequenceNumber(e) {}
  notifyBundleLoaded(e) {}
}
class Qw {
  Oo(e) {}
  shutdown() {}
}
const od = "ConnectivityMonitor";
class ad {
  constructor() {
    this.No = () => this.Bo(), this.Lo = () => this.ko(), this.qo = [], this.Qo();
  }
  Oo(e) {
    this.qo.push(e);
  }
  shutdown() {
    window.removeEventListener("online", this.No), window.removeEventListener("offline", this.Lo);
  }
  Qo() {
    window.addEventListener("online", this.No), window.addEventListener("offline", this.Lo);
  }
  Bo() {
    k(od, "Network connectivity changed: AVAILABLE");
    for (const e of this.qo) e(0);
  }
  ko() {
    k(od, "Network connectivity changed: UNAVAILABLE");
    for (const e of this.qo) e(1);
  }
  static v() {
    return typeof window < "u" && window.addEventListener !== void 0 && window.removeEventListener !== void 0;
  }
}
let _i = null;
function uc() {
  return _i === null ? _i = function () {
    return 268435456 + Math.round(2147483648 * Math.random());
  }() : _i++, "0x" + _i.toString(16);
}
const Ra = "RestConnection";
const Xw = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery",
  RunAggregationQuery: "runAggregationQuery"
};
class Jw {
  get $o() {
    return !1;
  }
  constructor(e) {
    this.databaseInfo = e, this.databaseId = e.databaseId;
    const t = e.ssl ? "https" : "http",
      r = encodeURIComponent(this.databaseId.projectId),
      s = encodeURIComponent(this.databaseId.database);
    this.Uo = t + "://" + e.host, this.Ko = `projects/${r}/databases/${s}`, this.Wo = this.databaseId.database === Wi ? `project_id=${r}` : `project_id=${r}&database_id=${s}`;
  }
  Go(e, t, r, s, i) {
    const o = uc(),
      c = this.zo(e, t.toUriEncodedString());
    k(Ra, `Sending RPC '${e}' ${o}:`, c, r);
    const u = {
      "google-cloud-resource-prefix": this.Ko,
      "x-goog-request-params": this.Wo
    };
    this.jo(u, s, i);
    const {
        host: h
      } = new URL(c),
      f = bt(h);
    return this.Jo(e, c, u, r, f).then(m => (k(Ra, `Received RPC '${e}' ${o}: `, m), m), m => {
      throw lr(Ra, `RPC '${e}' ${o} failed with error: `, m, "url: ", c, "request:", r), m;
    });
  }
  Ho(e, t, r, s, i, o) {
    return this.Go(e, t, r, s, i);
  }
  jo(e, t, r) {
    e["X-Goog-Api-Client"] = function () {
      return "gl-js/ fire/" + Ar;
    }(), e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach((s, i) => e[i] = s), r && r.headers.forEach((s, i) => e[i] = s);
  }
  zo(e, t) {
    const r = Xw[e];
    return `${this.Uo}/v1/${t}:${r}`;
  }
  terminate() {}
}
class Yw {
  constructor(e) {
    this.Yo = e.Yo, this.Zo = e.Zo;
  }
  Xo(e) {
    this.e_ = e;
  }
  t_(e) {
    this.n_ = e;
  }
  r_(e) {
    this.i_ = e;
  }
  onMessage(e) {
    this.s_ = e;
  }
  close() {
    this.Zo();
  }
  send(e) {
    this.Yo(e);
  }
  o_() {
    this.e_();
  }
  __() {
    this.n_();
  }
  a_(e) {
    this.i_(e);
  }
  u_(e) {
    this.s_(e);
  }
}
const Pe = "WebChannelConnection";
class Zw extends Jw {
  constructor(e) {
    super(e), this.c_ = [], this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
  }
  Jo(e, t, r, s, i) {
    const o = uc();
    return new Promise((c, u) => {
      const h = new Vf();
      h.setWithCredentials(!0), h.listenOnce(kf.COMPLETE, () => {
        try {
          switch (h.getLastErrorCode()) {
            case Ai.NO_ERROR:
              const m = h.getResponseJson();
              k(Pe, `XHR for RPC '${e}' ${o} received:`, JSON.stringify(m)), c(m);
              break;
            case Ai.TIMEOUT:
              k(Pe, `RPC '${e}' ${o} timed out`), u(new D(S.DEADLINE_EXCEEDED, "Request time out"));
              break;
            case Ai.HTTP_ERROR:
              const _ = h.getStatus();
              if (k(Pe, `RPC '${e}' ${o} failed with status:`, _, "response text:", h.getResponseText()), _ > 0) {
                let b = h.getResponseJson();
                Array.isArray(b) && (b = b[0]);
                const V = b?.error;
                if (V && V.status && V.message) {
                  const N = function (q) {
                    const U = q.toLowerCase().replace(/_/g, "-");
                    return Object.values(S).indexOf(U) >= 0 ? U : S.UNKNOWN;
                  }(V.status);
                  u(new D(N, V.message));
                } else u(new D(S.UNKNOWN, "Server responded with status " + h.getStatus()));
              } else u(new D(S.UNAVAILABLE, "Connection failed."));
              break;
            default:
              L(9055, {
                l_: e,
                streamId: o,
                h_: h.getLastErrorCode(),
                P_: h.getLastError()
              });
          }
        } finally {
          k(Pe, `RPC '${e}' ${o} completed.`);
        }
      });
      const f = JSON.stringify(s);
      k(Pe, `RPC '${e}' ${o} sending request:`, s), h.send(t, "POST", f, r, 15);
    });
  }
  T_(e, t, r) {
    const s = uc(),
      i = [this.Uo, "/", "google.firestore.v1.Firestore", "/", e, "/channel"],
      o = xf(),
      c = Nf(),
      u = {
        httpSessionIdParam: "gsessionid",
        initMessageHeaders: {},
        messageUrlParams: {
          database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
        },
        sendRawJson: !0,
        supportsCrossDomainXhr: !0,
        internalChannelParams: {
          forwardChannelRequestTimeoutMs: 6e5
        },
        forceLongPolling: this.forceLongPolling,
        detectBufferingProxy: this.autoDetectLongPolling
      },
      h = this.longPollingOptions.timeoutSeconds;
    h !== void 0 && (u.longPollingTimeout = Math.round(1e3 * h)), this.useFetchStreams && (u.useFetchStreams = !0), this.jo(u.initMessageHeaders, t, r), u.encodeInitMessageHeaders = !0;
    const f = i.join("");
    k(Pe, `Creating RPC '${e}' stream ${s}: ${f}`, u);
    const m = o.createWebChannel(f, u);
    this.I_(m);
    let _ = !1,
      b = !1;
    const V = new Yw({
        Yo: C => {
          b ? k(Pe, `Not sending because RPC '${e}' stream ${s} is closed:`, C) : (_ || (k(Pe, `Opening RPC '${e}' stream ${s} transport.`), m.open(), _ = !0), k(Pe, `RPC '${e}' stream ${s} sending:`, C), m.send(C));
        },
        Zo: () => m.close()
      }),
      N = (C, q, U) => {
        C.listen(q, M => {
          try {
            U(M);
          } catch (G) {
            setTimeout(() => {
              throw G;
            }, 0);
          }
        });
      };
    return N(m, es.EventType.OPEN, () => {
      b || (k(Pe, `RPC '${e}' stream ${s} transport opened.`), V.o_());
    }), N(m, es.EventType.CLOSE, () => {
      b || (b = !0, k(Pe, `RPC '${e}' stream ${s} transport closed`), V.a_(), this.E_(m));
    }), N(m, es.EventType.ERROR, C => {
      b || (b = !0, lr(Pe, `RPC '${e}' stream ${s} transport errored. Name:`, C.name, "Message:", C.message), V.a_(new D(S.UNAVAILABLE, "The operation could not be completed")));
    }), N(m, es.EventType.MESSAGE, C => {
      if (!b) {
        const q = C.data[0];
        F(!!q, 16349);
        const U = q,
          M = U?.error || U[0]?.error;
        if (M) {
          k(Pe, `RPC '${e}' stream ${s} received error:`, M);
          const G = M.status;
          let Q = function (g) {
              const I = pe[g];
              if (I !== void 0) return kp(I);
            }(G),
            W = M.message;
          Q === void 0 && (Q = S.INTERNAL, W = "Unknown error status: " + G + " with message " + M.message), b = !0, V.a_(new D(Q, W)), m.close();
        } else k(Pe, `RPC '${e}' stream ${s} received:`, q), V.u_(q);
      }
    }), N(c, Df.STAT_EVENT, C => {
      C.stat === Ba.PROXY ? k(Pe, `RPC '${e}' stream ${s} detected buffering proxy`) : C.stat === Ba.NOPROXY && k(Pe, `RPC '${e}' stream ${s} detected no buffering proxy`);
    }), setTimeout(() => {
      V.__();
    }, 0), V;
  }
  terminate() {
    this.c_.forEach(e => e.close()), this.c_ = [];
  }
  I_(e) {
    this.c_.push(e);
  }
  E_(e) {
    this.c_ = this.c_.filter(t => t === e);
  }
}
function ev() {
  return typeof window < "u" ? window : null;
}
function xi() {
  return typeof document < "u" ? document : null;
}
function Do(n) {
  return new nw(n, !0);
}
class hm {
  constructor(e, t, r = 1e3, s = 1.5, i = 6e4) {
    this.Mi = e, this.timerId = t, this.d_ = r, this.A_ = s, this.R_ = i, this.V_ = 0, this.m_ = null, this.f_ = Date.now(), this.reset();
  }
  reset() {
    this.V_ = 0;
  }
  g_() {
    this.V_ = this.R_;
  }
  p_(e) {
    this.cancel();
    const t = Math.floor(this.V_ + this.y_()),
      r = Math.max(0, Date.now() - this.f_),
      s = Math.max(0, t - r);
    s > 0 && k("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`), this.m_ = this.Mi.enqueueAfterDelay(this.timerId, s, () => (this.f_ = Date.now(), e())), this.V_ *= this.A_, this.V_ < this.d_ && (this.V_ = this.d_), this.V_ > this.R_ && (this.V_ = this.R_);
  }
  w_() {
    this.m_ !== null && (this.m_.skipDelay(), this.m_ = null);
  }
  cancel() {
    this.m_ !== null && (this.m_.cancel(), this.m_ = null);
  }
  y_() {
    return (Math.random() - .5) * this.V_;
  }
}
const cd = "PersistentStream";
class dm {
  constructor(e, t, r, s, i, o, c, u) {
    this.Mi = e, this.S_ = r, this.b_ = s, this.connection = i, this.authCredentialsProvider = o, this.appCheckCredentialsProvider = c, this.listener = u, this.state = 0, this.D_ = 0, this.C_ = null, this.v_ = null, this.stream = null, this.F_ = 0, this.M_ = new hm(e, t);
  }
  x_() {
    return this.state === 1 || this.state === 5 || this.O_();
  }
  O_() {
    return this.state === 2 || this.state === 3;
  }
  start() {
    this.F_ = 0, this.state !== 4 ? this.auth() : this.N_();
  }
  async stop() {
    this.x_() && (await this.close(0));
  }
  B_() {
    this.state = 0, this.M_.reset();
  }
  L_() {
    this.O_() && this.C_ === null && (this.C_ = this.Mi.enqueueAfterDelay(this.S_, 6e4, () => this.k_()));
  }
  q_(e) {
    this.Q_(), this.stream.send(e);
  }
  async k_() {
    if (this.O_()) return this.close(0);
  }
  Q_() {
    this.C_ && (this.C_.cancel(), this.C_ = null);
  }
  U_() {
    this.v_ && (this.v_.cancel(), this.v_ = null);
  }
  async close(e, t) {
    this.Q_(), this.U_(), this.M_.cancel(), this.D_++, e !== 4 ? this.M_.reset() : t && t.code === S.RESOURCE_EXHAUSTED ? (Oe(t.toString()), Oe("Using maximum backoff delay to prevent overloading the backend."), this.M_.g_()) : t && t.code === S.UNAUTHENTICATED && this.state !== 3 && (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), this.stream !== null && (this.K_(), this.stream.close(), this.stream = null), this.state = e, await this.listener.r_(t);
  }
  K_() {}
  auth() {
    this.state = 1;
    const e = this.W_(this.D_),
      t = this.D_;
    Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([r, s]) => {
      this.D_ === t && this.G_(r, s);
    }, r => {
      e(() => {
        const s = new D(S.UNKNOWN, "Fetching auth token failed: " + r.message);
        return this.z_(s);
      });
    });
  }
  G_(e, t) {
    const r = this.W_(this.D_);
    this.stream = this.j_(e, t), this.stream.Xo(() => {
      r(() => this.listener.Xo());
    }), this.stream.t_(() => {
      r(() => (this.state = 2, this.v_ = this.Mi.enqueueAfterDelay(this.b_, 1e4, () => (this.O_() && (this.state = 3), Promise.resolve())), this.listener.t_()));
    }), this.stream.r_(s => {
      r(() => this.z_(s));
    }), this.stream.onMessage(s => {
      r(() => ++this.F_ == 1 ? this.J_(s) : this.onNext(s));
    });
  }
  N_() {
    this.state = 5, this.M_.p_(async () => {
      this.state = 0, this.start();
    });
  }
  z_(e) {
    return k(cd, `close with error: ${e}`), this.stream = null, this.close(4, e);
  }
  W_(e) {
    return t => {
      this.Mi.enqueueAndForget(() => this.D_ === e ? t() : (k(cd, "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
    };
  }
}
class tv extends dm {
  constructor(e, t, r, s, i, o) {
    super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, r, s, o), this.serializer = i;
  }
  j_(e, t) {
    return this.connection.T_("Listen", e, t);
  }
  J_(e) {
    return this.onNext(e);
  }
  onNext(e) {
    this.M_.reset();
    const t = iw(this.serializer, e),
      r = function (i) {
        if (!("targetChange" in i)) return B.min();
        const o = i.targetChange;
        return o.targetIds && o.targetIds.length ? B.min() : o.readTime ? Le(o.readTime) : B.min();
      }(e);
    return this.listener.H_(t, r);
  }
  Y_(e) {
    const t = {};
    t.database = nc(this.serializer), t.addTarget = function (i, o) {
      let c;
      const u = o.target;
      if (c = Qi(u) ? {
        documents: Up(i, u)
      } : {
        query: Bp(i, u).ft
      }, c.targetId = o.targetId, o.resumeToken.approximateByteSize() > 0) {
        c.resumeToken = xp(i, o.resumeToken);
        const h = ec(i, o.expectedCount);
        h !== null && (c.expectedCount = h);
      } else if (o.snapshotVersion.compareTo(B.min()) > 0) {
        c.readTime = Tr(i, o.snapshotVersion.toTimestamp());
        const h = ec(i, o.expectedCount);
        h !== null && (c.expectedCount = h);
      }
      return c;
    }(this.serializer, e);
    const r = aw(this.serializer, e);
    r && (t.labels = r), this.q_(t);
  }
  Z_(e) {
    const t = {};
    t.database = nc(this.serializer), t.removeTarget = e, this.q_(t);
  }
}
class nv extends dm {
  constructor(e, t, r, s, i, o) {
    super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, r, s, o), this.serializer = i;
  }
  get X_() {
    return this.F_ > 0;
  }
  start() {
    this.lastStreamToken = void 0, super.start();
  }
  K_() {
    this.X_ && this.ea([]);
  }
  j_(e, t) {
    return this.connection.T_("Write", e, t);
  }
  J_(e) {
    return F(!!e.streamToken, 31322), this.lastStreamToken = e.streamToken, F(!e.writeResults || e.writeResults.length === 0, 55816), this.listener.ta();
  }
  onNext(e) {
    F(!!e.streamToken, 12678), this.lastStreamToken = e.streamToken, this.M_.reset();
    const t = ow(e.writeResults, e.commitTime),
      r = Le(e.commitTime);
    return this.listener.na(r, t);
  }
  ra() {
    const e = {};
    e.database = nc(this.serializer), this.q_(e);
  }
  ea(e) {
    const t = {
      streamToken: this.lastStreamToken,
      writes: e.map(r => Zi(this.serializer, r))
    };
    this.q_(t);
  }
}
class rv {}
class sv extends rv {
  constructor(e, t, r, s) {
    super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = r, this.serializer = s, this.ia = !1;
  }
  sa() {
    if (this.ia) throw new D(S.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  Go(e, t, r, s) {
    return this.sa(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([i, o]) => this.connection.Go(e, tc(t, r), s, i, o)).catch(i => {
      throw i.name === "FirebaseError" ? (i.code === S.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), i) : new D(S.UNKNOWN, i.toString());
    });
  }
  Ho(e, t, r, s, i) {
    return this.sa(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([o, c]) => this.connection.Ho(e, tc(t, r), s, o, c, i)).catch(o => {
      throw o.name === "FirebaseError" ? (o.code === S.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), o) : new D(S.UNKNOWN, o.toString());
    });
  }
  terminate() {
    this.ia = !0, this.connection.terminate();
  }
}
class iv {
  constructor(e, t) {
    this.asyncQueue = e, this.onlineStateHandler = t, this.state = "Unknown", this.oa = 0, this._a = null, this.aa = !0;
  }
  ua() {
    this.oa === 0 && (this.ca("Unknown"), this._a = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this._a = null, this.la("Backend didn't respond within 10 seconds."), this.ca("Offline"), Promise.resolve())));
  }
  ha(e) {
    this.state === "Online" ? this.ca("Unknown") : (this.oa++, this.oa >= 1 && (this.Pa(), this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.ca("Offline")));
  }
  set(e) {
    this.Pa(), this.oa = 0, e === "Online" && (this.aa = !1), this.ca(e);
  }
  ca(e) {
    e !== this.state && (this.state = e, this.onlineStateHandler(e));
  }
  la(e) {
    const t = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this.aa ? (Oe(t), this.aa = !1) : k("OnlineStateTracker", t);
  }
  Pa() {
    this._a !== null && (this._a.cancel(), this._a = null);
  }
}
const Mn = "RemoteStore";
class ov {
  constructor(e, t, r, s, i) {
    this.localStore = e, this.datastore = t, this.asyncQueue = r, this.remoteSyncer = {}, this.Ta = [], this.Ia = new Map(), this.Ea = new Set(), this.da = [], this.Aa = i, this.Aa.Oo(o => {
      r.enqueueAndForget(async () => {
        jn(this) && (k(Mn, "Restarting streams for network reachability change."), await async function (u) {
          const h = $(u);
          h.Ea.add(4), await js(h), h.Ra.set("Unknown"), h.Ea.delete(4), await No(h);
        }(this));
      });
    }), this.Ra = new iv(r, s);
  }
}
async function No(n) {
  if (jn(n)) for (const e of n.da) await e(!0);
}
async function js(n) {
  for (const e of n.da) await e(!1);
}
function fm(n, e) {
  const t = $(n);
  t.Ia.has(e.targetId) || (t.Ia.set(e.targetId, e), nu(t) ? tu(t) : br(t).O_() && eu(t, e));
}
function Zc(n, e) {
  const t = $(n),
    r = br(t);
  t.Ia.delete(e), r.O_() && pm(t, e), t.Ia.size === 0 && (r.O_() ? r.L_() : jn(t) && t.Ra.set("Unknown"));
}
function eu(n, e) {
  if (n.Va.Ue(e.targetId), e.resumeToken.approximateByteSize() > 0 || e.snapshotVersion.compareTo(B.min()) > 0) {
    const t = n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;
    e = e.withExpectedCount(t);
  }
  br(n).Y_(e);
}
function pm(n, e) {
  n.Va.Ue(e), br(n).Z_(e);
}
function tu(n) {
  n.Va = new YT({
    getRemoteKeysForTarget: e => n.remoteSyncer.getRemoteKeysForTarget(e),
    At: e => n.Ia.get(e) || null,
    ht: () => n.datastore.serializer.databaseId
  }), br(n).start(), n.Ra.ua();
}
function nu(n) {
  return jn(n) && !br(n).x_() && n.Ia.size > 0;
}
function jn(n) {
  return $(n).Ea.size === 0;
}
function mm(n) {
  n.Va = void 0;
}
async function av(n) {
  n.Ra.set("Online");
}
async function cv(n) {
  n.Ia.forEach((e, t) => {
    eu(n, e);
  });
}
async function uv(n, e) {
  mm(n), nu(n) ? (n.Ra.ha(e), tu(n)) : n.Ra.set("Unknown");
}
async function lv(n, e, t) {
  if (n.Ra.set("Online"), e instanceof Np && e.state === 2 && e.cause) try {
    await async function (s, i) {
      const o = i.cause;
      for (const c of i.targetIds) s.Ia.has(c) && (await s.remoteSyncer.rejectListen(c, o), s.Ia.delete(c), s.Va.removeTarget(c));
    }(n, e);
  } catch (r) {
    k(Mn, "Failed to remove targets %s: %s ", e.targetIds.join(","), r), await so(n, r);
  } else if (e instanceof Di ? n.Va.Ze(e) : e instanceof Dp ? n.Va.st(e) : n.Va.tt(e), !t.isEqual(B.min())) try {
    const r = await um(n.localStore);
    t.compareTo(r) >= 0 && (await function (i, o) {
      const c = i.Va.Tt(o);
      return c.targetChanges.forEach((u, h) => {
        if (u.resumeToken.approximateByteSize() > 0) {
          const f = i.Ia.get(h);
          f && i.Ia.set(h, f.withResumeToken(u.resumeToken, o));
        }
      }), c.targetMismatches.forEach((u, h) => {
        const f = i.Ia.get(u);
        if (!f) return;
        i.Ia.set(u, f.withResumeToken(ge.EMPTY_BYTE_STRING, f.snapshotVersion)), pm(i, u);
        const m = new Et(f.target, u, h, f.sequenceNumber);
        eu(i, m);
      }), i.remoteSyncer.applyRemoteEvent(c);
    }(n, t));
  } catch (r) {
    k(Mn, "Failed to raise snapshot:", r), await so(n, r);
  }
}
async function so(n, e, t) {
  if (!rn(e)) throw e;
  n.Ea.add(1), await js(n), n.Ra.set("Offline"), t || (t = () => um(n.localStore)), n.asyncQueue.enqueueRetryable(async () => {
    k(Mn, "Retrying IndexedDB access"), await t(), n.Ea.delete(1), await No(n);
  });
}
function gm(n, e) {
  return e().catch(t => so(n, t, e));
}
async function zs(n) {
  const e = $(n),
    t = tn(e);
  let r = e.Ta.length > 0 ? e.Ta[e.Ta.length - 1].batchId : wn;
  for (; hv(e);) try {
    const s = await Kw(e.localStore, r);
    if (s === null) {
      e.Ta.length === 0 && t.L_();
      break;
    }
    r = s.batchId, dv(e, s);
  } catch (s) {
    await so(e, s);
  }
  _m(e) && ym(e);
}
function hv(n) {
  return jn(n) && n.Ta.length < 10;
}
function dv(n, e) {
  n.Ta.push(e);
  const t = tn(n);
  t.O_() && t.X_ && t.ea(e.mutations);
}
function _m(n) {
  return jn(n) && !tn(n).x_() && n.Ta.length > 0;
}
function ym(n) {
  tn(n).start();
}
async function fv(n) {
  tn(n).ra();
}
async function pv(n) {
  const e = tn(n);
  for (const t of n.Ta) e.ea(t.mutations);
}
async function mv(n, e, t) {
  const r = n.Ta.shift(),
    s = jc.from(r, e, t);
  await gm(n, () => n.remoteSyncer.applySuccessfulWrite(s)), await zs(n);
}
async function gv(n, e) {
  e && tn(n).X_ && (await async function (r, s) {
    if (function (o) {
      return QT(o) && o !== S.ABORTED;
    }(s.code)) {
      const i = r.Ta.shift();
      tn(r).B_(), await gm(r, () => r.remoteSyncer.rejectFailedWrite(i.batchId, s)), await zs(r);
    }
  }(n, e)), _m(n) && ym(n);
}
async function ud(n, e) {
  const t = $(n);
  t.asyncQueue.verifyOperationInProgress(), k(Mn, "RemoteStore received new credentials");
  const r = jn(t);
  t.Ea.add(3), await js(t), r && t.Ra.set("Unknown"), await t.remoteSyncer.handleCredentialChange(e), t.Ea.delete(3), await No(t);
}
async function _v(n, e) {
  const t = $(n);
  e ? (t.Ea.delete(2), await No(t)) : e || (t.Ea.add(2), await js(t), t.Ra.set("Unknown"));
}
function br(n) {
  return n.ma || (n.ma = function (t, r, s) {
    const i = $(t);
    return i.sa(), new tv(r, i.connection, i.authCredentials, i.appCheckCredentials, i.serializer, s);
  }(n.datastore, n.asyncQueue, {
    Xo: av.bind(null, n),
    t_: cv.bind(null, n),
    r_: uv.bind(null, n),
    H_: lv.bind(null, n)
  }), n.da.push(async e => {
    e ? (n.ma.B_(), nu(n) ? tu(n) : n.Ra.set("Unknown")) : (await n.ma.stop(), mm(n));
  })), n.ma;
}
function tn(n) {
  return n.fa || (n.fa = function (t, r, s) {
    const i = $(t);
    return i.sa(), new nv(r, i.connection, i.authCredentials, i.appCheckCredentials, i.serializer, s);
  }(n.datastore, n.asyncQueue, {
    Xo: () => Promise.resolve(),
    t_: fv.bind(null, n),
    r_: gv.bind(null, n),
    ta: pv.bind(null, n),
    na: mv.bind(null, n)
  }), n.da.push(async e => {
    e ? (n.fa.B_(), await zs(n)) : (await n.fa.stop(), n.Ta.length > 0 && (k(Mn, `Stopping write stream with ${n.Ta.length} pending writes`), n.Ta = []));
  })), n.fa;
}
class ru {
  constructor(e, t, r, s, i) {
    this.asyncQueue = e, this.timerId = t, this.targetTimeMs = r, this.op = s, this.removalCallback = i, this.deferred = new Je(), this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch(o => {});
  }
  get promise() {
    return this.deferred.promise;
  }
  static createAndSchedule(e, t, r, s, i) {
    const o = Date.now() + r,
      c = new ru(e, t, o, s, i);
    return c.start(r), c;
  }
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  skipDelay() {
    return this.handleDelayElapsed();
  }
  cancel(e) {
    this.timerHandle !== null && (this.clearTimeout(), this.deferred.reject(new D(S.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() => this.timerHandle !== null ? (this.clearTimeout(), this.op().then(e => this.deferred.resolve(e))) : Promise.resolve());
  }
  clearTimeout() {
    this.timerHandle !== null && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
}
function xo(n, e) {
  if (Oe("AsyncQueue", `${e}: ${n}`), rn(n)) return new D(S.UNAVAILABLE, `${e}: ${n}`);
  throw n;
}
class ar {
  static emptySet(e) {
    return new ar(e.comparator);
  }
  constructor(e) {
    this.comparator = e ? (t, r) => e(t, r) || O.comparator(t.key, r.key) : (t, r) => O.comparator(t.key, r.key), this.keyedMap = ts(), this.sortedSet = new ae(this.comparator);
  }
  has(e) {
    return this.keyedMap.get(e) != null;
  }
  get(e) {
    return this.keyedMap.get(e);
  }
  first() {
    return this.sortedSet.minKey();
  }
  last() {
    return this.sortedSet.maxKey();
  }
  isEmpty() {
    return this.sortedSet.isEmpty();
  }
  indexOf(e) {
    const t = this.keyedMap.get(e);
    return t ? this.sortedSet.indexOf(t) : -1;
  }
  get size() {
    return this.sortedSet.size;
  }
  forEach(e) {
    this.sortedSet.inorderTraversal((t, r) => (e(t), !1));
  }
  add(e) {
    const t = this.delete(e.key);
    return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
  }
  delete(e) {
    const t = this.get(e);
    return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
  }
  isEqual(e) {
    if (!(e instanceof ar) || this.size !== e.size) return !1;
    const t = this.sortedSet.getIterator(),
      r = e.sortedSet.getIterator();
    for (; t.hasNext();) {
      const s = t.getNext().key,
        i = r.getNext().key;
      if (!s.isEqual(i)) return !1;
    }
    return !0;
  }
  toString() {
    const e = [];
    return this.forEach(t => {
      e.push(t.toString());
    }), e.length === 0 ? "DocumentSet ()" : `DocumentSet (
  ` + e.join(`  
`) + `
)`;
  }
  copy(e, t) {
    const r = new ar();
    return r.comparator = this.comparator, r.keyedMap = e, r.sortedSet = t, r;
  }
}
class ld {
  constructor() {
    this.ga = new ae(O.comparator);
  }
  track(e) {
    const t = e.doc.key,
      r = this.ga.get(t);
    r ? e.type !== 0 && r.type === 3 ? this.ga = this.ga.insert(t, e) : e.type === 3 && r.type !== 1 ? this.ga = this.ga.insert(t, {
      type: r.type,
      doc: e.doc
    }) : e.type === 2 && r.type === 2 ? this.ga = this.ga.insert(t, {
      type: 2,
      doc: e.doc
    }) : e.type === 2 && r.type === 0 ? this.ga = this.ga.insert(t, {
      type: 0,
      doc: e.doc
    }) : e.type === 1 && r.type === 0 ? this.ga = this.ga.remove(t) : e.type === 1 && r.type === 2 ? this.ga = this.ga.insert(t, {
      type: 1,
      doc: r.doc
    }) : e.type === 0 && r.type === 1 ? this.ga = this.ga.insert(t, {
      type: 2,
      doc: e.doc
    }) : L(63341, {
      Rt: e,
      pa: r
    }) : this.ga = this.ga.insert(t, e);
  }
  ya() {
    const e = [];
    return this.ga.inorderTraversal((t, r) => {
      e.push(r);
    }), e;
  }
}
class wr {
  constructor(e, t, r, s, i, o, c, u, h) {
    this.query = e, this.docs = t, this.oldDocs = r, this.docChanges = s, this.mutatedKeys = i, this.fromCache = o, this.syncStateChanged = c, this.excludesMetadataChanges = u, this.hasCachedResults = h;
  }
  static fromInitialDocuments(e, t, r, s, i) {
    const o = [];
    return t.forEach(c => {
      o.push({
        type: 0,
        doc: c
      });
    }), new wr(e, t, ar.emptySet(t), o, r, s, !0, !1, i);
  }
  get hasPendingWrites() {
    return !this.mutatedKeys.isEmpty();
  }
  isEqual(e) {
    if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && Ao(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs))) return !1;
    const t = this.docChanges,
      r = e.docChanges;
    if (t.length !== r.length) return !1;
    for (let s = 0; s < t.length; s++) if (t[s].type !== r[s].type || !t[s].doc.isEqual(r[s].doc)) return !1;
    return !0;
  }
}
class yv {
  constructor() {
    this.wa = void 0, this.Sa = [];
  }
  ba() {
    return this.Sa.some(e => e.Da());
  }
}
class Iv {
  constructor() {
    this.queries = hd(), this.onlineState = "Unknown", this.Ca = new Set();
  }
  terminate() {
    (function (t, r) {
      const s = $(t),
        i = s.queries;
      s.queries = hd(), i.forEach((o, c) => {
        for (const u of c.Sa) u.onError(r);
      });
    })(this, new D(S.ABORTED, "Firestore shutting down"));
  }
}
function hd() {
  return new Vt(n => yp(n), Ao);
}
async function su(n, e) {
  const t = $(n);
  let r = 3;
  const s = e.query;
  let i = t.queries.get(s);
  i ? !i.ba() && e.Da() && (r = 2) : (i = new yv(), r = e.Da() ? 0 : 1);
  try {
    switch (r) {
      case 0:
        i.wa = await t.onListen(s, !0);
        break;
      case 1:
        i.wa = await t.onListen(s, !1);
        break;
      case 2:
        await t.onFirstRemoteStoreListen(s);
    }
  } catch (o) {
    const c = xo(o, `Initialization of query '${er(e.query)}' failed`);
    return void e.onError(c);
  }
  t.queries.set(s, i), i.Sa.push(e), e.va(t.onlineState), i.wa && e.Fa(i.wa) && ou(t);
}
async function iu(n, e) {
  const t = $(n),
    r = e.query;
  let s = 3;
  const i = t.queries.get(r);
  if (i) {
    const o = i.Sa.indexOf(e);
    o >= 0 && (i.Sa.splice(o, 1), i.Sa.length === 0 ? s = e.Da() ? 0 : 1 : !i.ba() && e.Da() && (s = 2));
  }
  switch (s) {
    case 0:
      return t.queries.delete(r), t.onUnlisten(r, !0);
    case 1:
      return t.queries.delete(r), t.onUnlisten(r, !1);
    case 2:
      return t.onLastRemoteStoreUnlisten(r);
    default:
      return;
  }
}
function Ev(n, e) {
  const t = $(n);
  let r = !1;
  for (const s of e) {
    const i = s.query,
      o = t.queries.get(i);
    if (o) {
      for (const c of o.Sa) c.Fa(s) && (r = !0);
      o.wa = s;
    }
  }
  r && ou(t);
}
function Tv(n, e, t) {
  const r = $(n),
    s = r.queries.get(e);
  if (s) for (const i of s.Sa) i.onError(t);
  r.queries.delete(e);
}
function ou(n) {
  n.Ca.forEach(e => {
    e.next();
  });
}
var lc;
var dd;
(dd = lc || (lc = {})).Ma = "default", dd.Cache = "cache";
class au {
  constructor(e, t, r) {
    this.query = e, this.xa = t, this.Oa = !1, this.Na = null, this.onlineState = "Unknown", this.options = r || {};
  }
  Fa(e) {
    if (!this.options.includeMetadataChanges) {
      const r = [];
      for (const s of e.docChanges) s.type !== 3 && r.push(s);
      e = new wr(e.query, e.docs, e.oldDocs, r, e.mutatedKeys, e.fromCache, e.syncStateChanged, !0, e.hasCachedResults);
    }
    let t = !1;
    return this.Oa ? this.Ba(e) && (this.xa.next(e), t = !0) : this.La(e, this.onlineState) && (this.ka(e), t = !0), this.Na = e, t;
  }
  onError(e) {
    this.xa.error(e);
  }
  va(e) {
    this.onlineState = e;
    let t = !1;
    return this.Na && !this.Oa && this.La(this.Na, e) && (this.ka(this.Na), t = !0), t;
  }
  La(e, t) {
    if (!e.fromCache || !this.Da()) return !0;
    const r = t !== "Offline";
    return (!this.options.qa || !r) && (!e.docs.isEmpty() || e.hasCachedResults || t === "Offline");
  }
  Ba(e) {
    if (e.docChanges.length > 0) return !0;
    const t = this.Na && this.Na.hasPendingWrites !== e.hasPendingWrites;
    return !(!e.syncStateChanged && !t) && this.options.includeMetadataChanges === !0;
  }
  ka(e) {
    e = wr.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), this.Oa = !0, this.xa.next(e);
  }
  Da() {
    return this.options.source !== lc.Cache;
  }
}
class Im {
  constructor(e) {
    this.key = e;
  }
}
class Em {
  constructor(e) {
    this.key = e;
  }
}
class Tm {
  constructor(e, t) {
    this.query = e, this.Ya = t, this.Za = null, this.hasCachedResults = !1, this.current = !1, this.Xa = H(), this.mutatedKeys = H(), this.eu = Ip(e), this.tu = new ar(this.eu);
  }
  get nu() {
    return this.Ya;
  }
  ru(e, t) {
    const r = t ? t.iu : new ld(),
      s = t ? t.tu : this.tu;
    let i = t ? t.mutatedKeys : this.mutatedKeys,
      o = s,
      c = !1;
    const u = this.query.limitType === "F" && s.size === this.query.limit ? s.last() : null,
      h = this.query.limitType === "L" && s.size === this.query.limit ? s.first() : null;
    if (e.inorderTraversal((f, m) => {
      const _ = s.get(f),
        b = Us(this.query, m) ? m : null,
        V = !!_ && this.mutatedKeys.has(_.key),
        N = !!b && (b.hasLocalMutations || this.mutatedKeys.has(b.key) && b.hasCommittedMutations);
      let C = !1;
      _ && b ? _.data.isEqual(b.data) ? V !== N && (r.track({
        type: 3,
        doc: b
      }), C = !0) : this.su(_, b) || (r.track({
        type: 2,
        doc: b
      }), C = !0, (u && this.eu(b, u) > 0 || h && this.eu(b, h) < 0) && (c = !0)) : !_ && b ? (r.track({
        type: 0,
        doc: b
      }), C = !0) : _ && !b && (r.track({
        type: 1,
        doc: _
      }), C = !0, (u || h) && (c = !0)), C && (b ? (o = o.add(b), i = N ? i.add(f) : i.delete(f)) : (o = o.delete(f), i = i.delete(f)));
    }), this.query.limit !== null) for (; o.size > this.query.limit;) {
      const f = this.query.limitType === "F" ? o.last() : o.first();
      o = o.delete(f.key), i = i.delete(f.key), r.track({
        type: 1,
        doc: f
      });
    }
    return {
      tu: o,
      iu: r,
      Cs: c,
      mutatedKeys: i
    };
  }
  su(e, t) {
    return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
  }
  applyChanges(e, t, r, s) {
    const i = this.tu;
    this.tu = e.tu, this.mutatedKeys = e.mutatedKeys;
    const o = e.iu.ya();
    o.sort((f, m) => function (b, V) {
      const N = C => {
        switch (C) {
          case 0:
            return 1;
          case 2:
          case 3:
            return 2;
          case 1:
            return 0;
          default:
            return L(20277, {
              Rt: C
            });
        }
      };
      return N(b) - N(V);
    }(f.type, m.type) || this.eu(f.doc, m.doc)), this.ou(r), s = s ?? !1;
    const c = t && !s ? this._u() : [],
      u = this.Xa.size === 0 && this.current && !s ? 1 : 0,
      h = u !== this.Za;
    return this.Za = u, o.length !== 0 || h ? {
      snapshot: new wr(this.query, e.tu, i, o, e.mutatedKeys, u === 0, h, !1, !!r && r.resumeToken.approximateByteSize() > 0),
      au: c
    } : {
      au: c
    };
  }
  va(e) {
    return this.current && e === "Offline" ? (this.current = !1, this.applyChanges({
      tu: this.tu,
      iu: new ld(),
      mutatedKeys: this.mutatedKeys,
      Cs: !1
    }, !1)) : {
      au: []
    };
  }
  uu(e) {
    return !this.Ya.has(e) && !!this.tu.has(e) && !this.tu.get(e).hasLocalMutations;
  }
  ou(e) {
    e && (e.addedDocuments.forEach(t => this.Ya = this.Ya.add(t)), e.modifiedDocuments.forEach(t => {}), e.removedDocuments.forEach(t => this.Ya = this.Ya.delete(t)), this.current = e.current);
  }
  _u() {
    if (!this.current) return [];
    const e = this.Xa;
    this.Xa = H(), this.tu.forEach(r => {
      this.uu(r.key) && (this.Xa = this.Xa.add(r.key));
    });
    const t = [];
    return e.forEach(r => {
      this.Xa.has(r) || t.push(new Em(r));
    }), this.Xa.forEach(r => {
      e.has(r) || t.push(new Im(r));
    }), t;
  }
  cu(e) {
    this.Ya = e.Qs, this.Xa = H();
    const t = this.ru(e.documents);
    return this.applyChanges(t, !0);
  }
  lu() {
    return wr.fromInitialDocuments(this.query, this.tu, this.mutatedKeys, this.Za === 0, this.hasCachedResults);
  }
}
const cu = "SyncEngine";
class wv {
  constructor(e, t, r) {
    this.query = e, this.targetId = t, this.view = r;
  }
}
class vv {
  constructor(e) {
    this.key = e, this.hu = !1;
  }
}
class Av {
  constructor(e, t, r, s, i, o) {
    this.localStore = e, this.remoteStore = t, this.eventManager = r, this.sharedClientState = s, this.currentUser = i, this.maxConcurrentLimboResolutions = o, this.Pu = {}, this.Tu = new Vt(c => yp(c), Ao), this.Iu = new Map(), this.Eu = new Set(), this.du = new ae(O.comparator), this.Au = new Map(), this.Ru = new Wc(), this.Vu = {}, this.mu = new Map(), this.fu = On.cr(), this.onlineState = "Unknown", this.gu = void 0;
  }
  get isPrimaryClient() {
    return this.gu === !0;
  }
}
async function Rv(n, e, t = !0) {
  const r = Pm(n);
  let s;
  const i = r.Tu.get(e);
  return i ? (r.sharedClientState.addLocalQueryTarget(i.targetId), s = i.view.lu()) : s = await wm(r, e, t, !0), s;
}
async function bv(n, e) {
  const t = Pm(n);
  await wm(t, e, !0, !1);
}
async function wm(n, e, t, r) {
  const s = await Hw(n.localStore, Ke(e)),
    i = s.targetId,
    o = n.sharedClientState.addLocalQueryTarget(i, t);
  let c;
  return r && (c = await Pv(n, e, i, o === "current", s.resumeToken)), n.isPrimaryClient && t && fm(n.remoteStore, s), c;
}
async function Pv(n, e, t, r, s) {
  n.pu = (m, _, b) => async function (N, C, q, U) {
    let M = C.view.ru(q);
    M.Cs && (M = await cc(N.localStore, C.query, !1).then(({
      documents: E
    }) => C.view.ru(E, M)));
    const G = U && U.targetChanges.get(C.targetId),
      Q = U && U.targetMismatches.get(C.targetId) != null,
      W = C.view.applyChanges(M, N.isPrimaryClient, G, Q);
    return pd(N, C.targetId, W.au), W.snapshot;
  }(n, m, _, b);
  const i = await cc(n.localStore, e, !0),
    o = new Tm(e, i.Qs),
    c = o.ru(i.documents),
    u = qs.createSynthesizedTargetChangeForCurrentChange(t, r && n.onlineState !== "Offline", s),
    h = o.applyChanges(c, n.isPrimaryClient, u);
  pd(n, t, h.au);
  const f = new wv(e, t, o);
  return n.Tu.set(e, f), n.Iu.has(t) ? n.Iu.get(t).push(e) : n.Iu.set(t, [e]), h.snapshot;
}
async function Sv(n, e, t) {
  const r = $(n),
    s = r.Tu.get(e),
    i = r.Iu.get(s.targetId);
  if (i.length > 1) return r.Iu.set(s.targetId, i.filter(o => !Ao(o, e))), void r.Tu.delete(e);
  r.isPrimaryClient ? (r.sharedClientState.removeLocalQueryTarget(s.targetId), r.sharedClientState.isActiveQueryTarget(s.targetId) || (await ac(r.localStore, s.targetId, !1).then(() => {
    r.sharedClientState.clearQueryState(s.targetId), t && Zc(r.remoteStore, s.targetId), hc(r, s.targetId);
  }).catch(Bn))) : (hc(r, s.targetId), await ac(r.localStore, s.targetId, !0));
}
async function Cv(n, e) {
  const t = $(n),
    r = t.Tu.get(e),
    s = t.Iu.get(r.targetId);
  t.isPrimaryClient && s.length === 1 && (t.sharedClientState.removeLocalQueryTarget(r.targetId), Zc(t.remoteStore, r.targetId));
}
async function Vv(n, e, t) {
  const r = Sm(n);
  try {
    const s = await function (o, c) {
      const u = $(o),
        h = ee.now(),
        f = c.reduce((b, V) => b.add(V.key), H());
      let m, _;
      return u.persistence.runTransaction("Locally write mutations", "readwrite", b => {
        let V = je(),
          N = H();
        return u.Ns.getEntries(b, f).next(C => {
          V = C, V.forEach((q, U) => {
            U.isValidDocument() || (N = N.add(q));
          });
        }).next(() => u.localDocuments.getOverlayedDocuments(b, V)).next(C => {
          m = C;
          const q = [];
          for (const U of c) {
            const M = HT(U, m.get(U.key).overlayedDocument);
            M != null && q.push(new kt(U.key, M, up(M.value.mapValue), ye.exists(!0)));
          }
          return u.mutationQueue.addMutationBatch(b, h, q, c);
        }).next(C => {
          _ = C;
          const q = C.applyToLocalDocumentSet(m, N);
          return u.documentOverlayCache.saveOverlays(b, C.batchId, q);
        });
      }).then(() => ({
        batchId: _.batchId,
        changes: Tp(m)
      }));
    }(r.localStore, e);
    r.sharedClientState.addPendingMutation(s.batchId), function (o, c, u) {
      let h = o.Vu[o.currentUser.toKey()];
      h || (h = new ae(z)), h = h.insert(c, u), o.Vu[o.currentUser.toKey()] = h;
    }(r, s.batchId, t), await $s(r, s.changes), await zs(r.remoteStore);
  } catch (s) {
    const i = xo(s, "Failed to persist write");
    t.reject(i);
  }
}
async function vm(n, e) {
  const t = $(n);
  try {
    const r = await $w(t.localStore, e);
    e.targetChanges.forEach((s, i) => {
      const o = t.Au.get(i);
      o && (F(s.addedDocuments.size + s.modifiedDocuments.size + s.removedDocuments.size <= 1, 22616), s.addedDocuments.size > 0 ? o.hu = !0 : s.modifiedDocuments.size > 0 ? F(o.hu, 14607) : s.removedDocuments.size > 0 && (F(o.hu, 42227), o.hu = !1));
    }), await $s(t, r, e);
  } catch (r) {
    await Bn(r);
  }
}
function fd(n, e, t) {
  const r = $(n);
  if (r.isPrimaryClient && t === 0 || !r.isPrimaryClient && t === 1) {
    const s = [];
    r.Tu.forEach((i, o) => {
      const c = o.view.va(e);
      c.snapshot && s.push(c.snapshot);
    }), function (o, c) {
      const u = $(o);
      u.onlineState = c;
      let h = !1;
      u.queries.forEach((f, m) => {
        for (const _ of m.Sa) _.va(c) && (h = !0);
      }), h && ou(u);
    }(r.eventManager, e), s.length && r.Pu.H_(s), r.onlineState = e, r.isPrimaryClient && r.sharedClientState.setOnlineState(e);
  }
}
async function kv(n, e, t) {
  const r = $(n);
  r.sharedClientState.updateQueryState(e, "rejected", t);
  const s = r.Au.get(e),
    i = s && s.key;
  if (i) {
    let o = new ae(O.comparator);
    o = o.insert(i, le.newNoDocument(i, B.min()));
    const c = H().add(i),
      u = new So(B.min(), new Map(), new ae(z), o, c);
    await vm(r, u), r.du = r.du.remove(i), r.Au.delete(e), uu(r);
  } else await ac(r.localStore, e, !1).then(() => hc(r, e, t)).catch(Bn);
}
async function Dv(n, e) {
  const t = $(n),
    r = e.batch.batchId;
  try {
    const s = await zw(t.localStore, e);
    Rm(t, r, null), Am(t, r), t.sharedClientState.updateMutationState(r, "acknowledged"), await $s(t, s);
  } catch (s) {
    await Bn(s);
  }
}
async function Nv(n, e, t) {
  const r = $(n);
  try {
    const s = await function (o, c) {
      const u = $(o);
      return u.persistence.runTransaction("Reject batch", "readwrite-primary", h => {
        let f;
        return u.mutationQueue.lookupMutationBatch(h, c).next(m => (F(m !== null, 37113), f = m.keys(), u.mutationQueue.removeMutationBatch(h, m))).next(() => u.mutationQueue.performConsistencyCheck(h)).next(() => u.documentOverlayCache.removeOverlaysForBatchId(h, f, c)).next(() => u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h, f)).next(() => u.localDocuments.getDocuments(h, f));
      });
    }(r.localStore, e);
    Rm(r, e, t), Am(r, e), r.sharedClientState.updateMutationState(e, "rejected", t), await $s(r, s);
  } catch (s) {
    await Bn(s);
  }
}
function Am(n, e) {
  (n.mu.get(e) || []).forEach(t => {
    t.resolve();
  }), n.mu.delete(e);
}
function Rm(n, e, t) {
  const r = $(n);
  let s = r.Vu[r.currentUser.toKey()];
  if (s) {
    const i = s.get(e);
    i && (t ? i.reject(t) : i.resolve(), s = s.remove(e)), r.Vu[r.currentUser.toKey()] = s;
  }
}
function hc(n, e, t = null) {
  n.sharedClientState.removeLocalQueryTarget(e);
  for (const r of n.Iu.get(e)) n.Tu.delete(r), t && n.Pu.yu(r, t);
  n.Iu.delete(e), n.isPrimaryClient && n.Ru.jr(e).forEach(r => {
    n.Ru.containsKey(r) || bm(n, r);
  });
}
function bm(n, e) {
  n.Eu.delete(e.path.canonicalString());
  const t = n.du.get(e);
  t !== null && (Zc(n.remoteStore, t), n.du = n.du.remove(e), n.Au.delete(t), uu(n));
}
function pd(n, e, t) {
  for (const r of t) r instanceof Im ? (n.Ru.addReference(r.key, e), xv(n, r)) : r instanceof Em ? (k(cu, "Document no longer in limbo: " + r.key), n.Ru.removeReference(r.key, e), n.Ru.containsKey(r.key) || bm(n, r.key)) : L(19791, {
    wu: r
  });
}
function xv(n, e) {
  const t = e.key,
    r = t.path.canonicalString();
  n.du.get(t) || n.Eu.has(r) || (k(cu, "New document in limbo: " + t), n.Eu.add(r), uu(n));
}
function uu(n) {
  for (; n.Eu.size > 0 && n.du.size < n.maxConcurrentLimboResolutions;) {
    const e = n.Eu.values().next().value;
    n.Eu.delete(e);
    const t = new O(Z.fromString(e)),
      r = n.fu.next();
    n.Au.set(r, new vv(t)), n.du = n.du.insert(t, r), fm(n.remoteStore, new Et(Ke(Fs(t.path)), r, "TargetPurposeLimboResolution", Ge.ce));
  }
}
async function $s(n, e, t) {
  const r = $(n),
    s = [],
    i = [],
    o = [];
  r.Tu.isEmpty() || (r.Tu.forEach((c, u) => {
    o.push(r.pu(u, e, t).then(h => {
      if ((h || t) && r.isPrimaryClient) {
        const f = h ? !h.fromCache : t?.targetChanges.get(u.targetId)?.current;
        r.sharedClientState.updateQueryState(u.targetId, f ? "current" : "not-current");
      }
      if (h) {
        s.push(h);
        const f = Jc.As(u.targetId, h);
        i.push(f);
      }
    }));
  }), await Promise.all(o), r.Pu.H_(s), await async function (u, h) {
    const f = $(u);
    try {
      await f.persistence.runTransaction("notifyLocalViewChanges", "readwrite", m => v.forEach(h, _ => v.forEach(_.Es, b => f.persistence.referenceDelegate.addReference(m, _.targetId, b)).next(() => v.forEach(_.ds, b => f.persistence.referenceDelegate.removeReference(m, _.targetId, b)))));
    } catch (m) {
      if (!rn(m)) throw m;
      k(Yc, "Failed to update sequence numbers: " + m);
    }
    for (const m of h) {
      const _ = m.targetId;
      if (!m.fromCache) {
        const b = f.Ms.get(_),
          V = b.snapshotVersion,
          N = b.withLastLimboFreeSnapshotVersion(V);
        f.Ms = f.Ms.insert(_, N);
      }
    }
  }(r.localStore, i));
}
async function Ov(n, e) {
  const t = $(n);
  if (!t.currentUser.isEqual(e)) {
    k(cu, "User change. New user:", e.toKey());
    const r = await cm(t.localStore, e);
    t.currentUser = e, function (i, o) {
      i.mu.forEach(c => {
        c.forEach(u => {
          u.reject(new D(S.CANCELLED, o));
        });
      }), i.mu.clear();
    }(t, "'waitForPendingWrites' promise is rejected due to a user change."), t.sharedClientState.handleUserChange(e, r.removedBatchIds, r.addedBatchIds), await $s(t, r.Ls);
  }
}
function Mv(n, e) {
  const t = $(n),
    r = t.Au.get(e);
  if (r && r.hu) return H().add(r.key);
  {
    let s = H();
    const i = t.Iu.get(e);
    if (!i) return s;
    for (const o of i) {
      const c = t.Tu.get(o);
      s = s.unionWith(c.view.nu);
    }
    return s;
  }
}
function Pm(n) {
  const e = $(n);
  return e.remoteStore.remoteSyncer.applyRemoteEvent = vm.bind(null, e), e.remoteStore.remoteSyncer.getRemoteKeysForTarget = Mv.bind(null, e), e.remoteStore.remoteSyncer.rejectListen = kv.bind(null, e), e.Pu.H_ = Ev.bind(null, e.eventManager), e.Pu.yu = Tv.bind(null, e.eventManager), e;
}
function Sm(n) {
  const e = $(n);
  return e.remoteStore.remoteSyncer.applySuccessfulWrite = Dv.bind(null, e), e.remoteStore.remoteSyncer.rejectFailedWrite = Nv.bind(null, e), e;
}
class Cs {
  constructor() {
    this.kind = "memory", this.synchronizeTabs = !1;
  }
  async initialize(e) {
    this.serializer = Do(e.databaseInfo.databaseId), this.sharedClientState = this.Du(e), this.persistence = this.Cu(e), await this.persistence.start(), this.localStore = this.vu(e), this.gcScheduler = this.Fu(e, this.localStore), this.indexBackfillerScheduler = this.Mu(e, this.localStore);
  }
  Fu(e, t) {
    return null;
  }
  Mu(e, t) {
    return null;
  }
  vu(e) {
    return am(this.persistence, new om(), e.initialUser, this.serializer);
  }
  Cu(e) {
    return new Qc(ko.mi, this.serializer);
  }
  Du(e) {
    return new lm();
  }
  async terminate() {
    this.gcScheduler?.stop(), this.indexBackfillerScheduler?.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
  }
}
Cs.provider = {
  build: () => new Cs()
};
class Lv extends Cs {
  constructor(e) {
    super(), this.cacheSizeBytes = e;
  }
  Fu(e, t) {
    F(this.persistence.referenceDelegate instanceof ro, 46915);
    const r = this.persistence.referenceDelegate.garbageCollector;
    return new tm(r, e.asyncQueue, t);
  }
  Cu(e) {
    const t = this.cacheSizeBytes !== void 0 ? Se.withCacheSize(this.cacheSizeBytes) : Se.DEFAULT;
    return new Qc(r => ro.mi(r, t), this.serializer);
  }
}
class Fv extends Cs {
  constructor(e, t, r) {
    super(), this.xu = e, this.cacheSizeBytes = t, this.forceOwnership = r, this.kind = "persistent", this.synchronizeTabs = !1;
  }
  async initialize(e) {
    await super.initialize(e), await this.xu.initialize(this, e), await Sm(this.xu.syncEngine), await zs(this.xu.remoteStore), await this.persistence.Ji(() => (this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(), this.indexBackfillerScheduler && !this.indexBackfillerScheduler.started && this.indexBackfillerScheduler.start(), Promise.resolve()));
  }
  vu(e) {
    return am(this.persistence, new om(), e.initialUser, this.serializer);
  }
  Fu(e, t) {
    const r = this.persistence.referenceDelegate.garbageCollector;
    return new tm(r, e.asyncQueue, t);
  }
  Mu(e, t) {
    const r = new KE(t, this.persistence);
    return new GE(e.asyncQueue, r);
  }
  Cu(e) {
    const t = Uw(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey),
      r = this.cacheSizeBytes !== void 0 ? Se.withCacheSize(this.cacheSizeBytes) : Se.DEFAULT;
    return new Xc(this.synchronizeTabs, t, e.clientId, r, e.asyncQueue, ev(), xi(), this.serializer, this.sharedClientState, !!this.forceOwnership);
  }
  Du(e) {
    return new lm();
  }
}
class io {
  async initialize(e, t) {
    this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(t, !e.synchronizeTabs), this.sharedClientState.onlineStateHandler = r => fd(this.syncEngine, r, 1), this.remoteStore.remoteSyncer.handleCredentialChange = Ov.bind(null, this.syncEngine), await _v(this.remoteStore, this.syncEngine.isPrimaryClient));
  }
  createEventManager(e) {
    return function () {
      return new Iv();
    }();
  }
  createDatastore(e) {
    const t = Do(e.databaseInfo.databaseId),
      r = function (i) {
        return new Zw(i);
      }(e.databaseInfo);
    return function (i, o, c, u) {
      return new sv(i, o, c, u);
    }(e.authCredentials, e.appCheckCredentials, r, t);
  }
  createRemoteStore(e) {
    return function (r, s, i, o, c) {
      return new ov(r, s, i, o, c);
    }(this.localStore, this.datastore, e.asyncQueue, t => fd(this.syncEngine, t, 0), function () {
      return ad.v() ? new ad() : new Qw();
    }());
  }
  createSyncEngine(e, t) {
    return function (s, i, o, c, u, h, f) {
      const m = new Av(s, i, o, c, u, h);
      return f && (m.gu = !0), m;
    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
  }
  async terminate() {
    await async function (t) {
      const r = $(t);
      k(Mn, "RemoteStore shutting down."), r.Ea.add(5), await js(r), r.Aa.shutdown(), r.Ra.set("Unknown");
    }(this.remoteStore), this.datastore?.terminate(), this.eventManager?.terminate();
  }
}
io.provider = {
  build: () => new io()
};
class lu {
  constructor(e) {
    this.observer = e, this.muted = !1;
  }
  next(e) {
    this.muted || this.observer.next && this.Ou(this.observer.next, e);
  }
  error(e) {
    this.muted || (this.observer.error ? this.Ou(this.observer.error, e) : Oe("Uncaught Error in snapshot listener:", e.toString()));
  }
  Nu() {
    this.muted = !0;
  }
  Ou(e, t) {
    setTimeout(() => {
      this.muted || e(t);
    }, 0);
  }
}
const nn = "FirestoreClient";
class Uv {
  constructor(e, t, r, s, i) {
    this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = r, this.databaseInfo = s, this.user = Ae.UNAUTHENTICATED, this.clientId = Sc.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this._uninitializedComponentsProvider = i, this.authCredentials.start(r, async o => {
      k(nn, "Received user=", o.uid), await this.authCredentialListener(o), this.user = o;
    }), this.appCheckCredentials.start(r, o => (k(nn, "Received new app check token=", o), this.appCheckCredentialListener(o, this.user)));
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this.databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100
    };
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new Je();
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
      try {
        this._onlineComponents && (await this._onlineComponents.terminate()), this._offlineComponents && (await this._offlineComponents.terminate()), this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
      } catch (t) {
        const r = xo(t, "Failed to shutdown persistence");
        e.reject(r);
      }
    }), e.promise;
  }
}
async function ba(n, e) {
  n.asyncQueue.verifyOperationInProgress(), k(nn, "Initializing OfflineComponentProvider");
  const t = n.configuration;
  await e.initialize(t);
  let r = t.initialUser;
  n.setCredentialChangeListener(async s => {
    r.isEqual(s) || (await cm(e.localStore, s), r = s);
  }), e.persistence.setDatabaseDeletedListener(() => n.terminate()), n._offlineComponents = e;
}
async function md(n, e) {
  n.asyncQueue.verifyOperationInProgress();
  const t = await Cm(n);
  k(nn, "Initializing OnlineComponentProvider"), await e.initialize(t, n.configuration), n.setCredentialChangeListener(r => ud(e.remoteStore, r)), n.setAppCheckTokenChangeListener((r, s) => ud(e.remoteStore, s)), n._onlineComponents = e;
}
async function Cm(n) {
  if (!n._offlineComponents) if (n._uninitializedComponentsProvider) {
    k(nn, "Using user provided OfflineComponentProvider");
    try {
      await ba(n, n._uninitializedComponentsProvider._offline);
    } catch (e) {
      const t = e;
      if (!function (s) {
        return s.name === "FirebaseError" ? s.code === S.FAILED_PRECONDITION || s.code === S.UNIMPLEMENTED : !(typeof DOMException < "u" && s instanceof DOMException) || s.code === 22 || s.code === 20 || s.code === 11;
      }(t)) throw t;
      lr("Error using user provided cache. Falling back to memory cache: " + t), await ba(n, new Cs());
    }
  } else k(nn, "Using default OfflineComponentProvider"), await ba(n, new Lv(void 0));
  return n._offlineComponents;
}
async function Vm(n) {
  return n._onlineComponents || (n._uninitializedComponentsProvider ? (k(nn, "Using user provided OnlineComponentProvider"), await md(n, n._uninitializedComponentsProvider._online)) : (k(nn, "Using default OnlineComponentProvider"), await md(n, new io()))), n._onlineComponents;
}
function Bv(n) {
  return Cm(n).then(e => e.localStore);
}
function qv(n) {
  return Vm(n).then(e => e.syncEngine);
}
async function oo(n) {
  const e = await Vm(n),
    t = e.eventManager;
  return t.onListen = Rv.bind(null, e.syncEngine), t.onUnlisten = Sv.bind(null, e.syncEngine), t.onFirstRemoteStoreListen = bv.bind(null, e.syncEngine), t.onLastRemoteStoreUnlisten = Cv.bind(null, e.syncEngine), t;
}
function jv(n, e, t = {}) {
  const r = new Je();
  return n.asyncQueue.enqueueAndForget(async () => function (i, o, c, u, h) {
    const f = new lu({
        next: _ => {
          f.Nu(), o.enqueueAndForget(() => iu(i, m));
          const b = _.docs.has(c);
          !b && _.fromCache ? h.reject(new D(S.UNAVAILABLE, "Failed to get document because the client is offline.")) : b && _.fromCache && u && u.source === "server" ? h.reject(new D(S.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : h.resolve(_);
        },
        error: _ => h.reject(_)
      }),
      m = new au(Fs(c.path), f, {
        includeMetadataChanges: !0,
        qa: !0
      });
    return su(i, m);
  }(await oo(n), n.asyncQueue, e, t, r)), r.promise;
}
function zv(n, e) {
  const t = new Je();
  return n.asyncQueue.enqueueAndForget(async () => async function (s, i, o) {
    try {
      const c = await cc(s, i, !0),
        u = new Tm(i, c.Qs),
        h = u.ru(c.documents),
        f = u.applyChanges(h, !1);
      o.resolve(f.snapshot);
    } catch (c) {
      const u = xo(c, `Failed to execute query '${i} against cache`);
      o.reject(u);
    }
  }(await Bv(n), e, t)), t.promise;
}
function $v(n, e, t = {}) {
  const r = new Je();
  return n.asyncQueue.enqueueAndForget(async () => function (i, o, c, u, h) {
    const f = new lu({
        next: _ => {
          f.Nu(), o.enqueueAndForget(() => iu(i, m)), _.fromCache && u.source === "server" ? h.reject(new D(S.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : h.resolve(_);
        },
        error: _ => h.reject(_)
      }),
      m = new au(c, f, {
        includeMetadataChanges: !0,
        qa: !0
      });
    return su(i, m);
  }(await oo(n), n.asyncQueue, e, t, r)), r.promise;
}
function km(n) {
  const e = {};
  return n.timeoutSeconds !== void 0 && (e.timeoutSeconds = n.timeoutSeconds), e;
}
const gd = new Map();
const Dm = "firestore.googleapis.com";
const _d = !0;
class yd {
  constructor(e) {
    if (e.host === void 0) {
      if (e.ssl !== void 0) throw new D(S.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = Dm, this.ssl = _d;
    } else this.host = e.host, this.ssl = e.ssl ?? _d;
    if (this.isUsingEmulator = e.emulatorOptions !== void 0, this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, e.cacheSizeBytes === void 0) this.cacheSizeBytes = Xp;else {
      if (e.cacheSizeBytes !== -1 && e.cacheSizeBytes < em) throw new D(S.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    qE("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = !1 : e.experimentalAutoDetectLongPolling === void 0 ? this.experimentalAutoDetectLongPolling = !0 : this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling, this.experimentalLongPollingOptions = km(e.experimentalLongPollingOptions ?? {}), function (r) {
      if (r.timeoutSeconds !== void 0) {
        if (isNaN(r.timeoutSeconds)) throw new D(S.INVALID_ARGUMENT, `invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);
        if (r.timeoutSeconds < 5) throw new D(S.INVALID_ARGUMENT, `invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);
        if (r.timeoutSeconds > 30) throw new D(S.INVALID_ARGUMENT, `invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`);
      }
    }(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
  }
  isEqual(e) {
    return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function (r, s) {
      return r.timeoutSeconds === s.timeoutSeconds;
    }(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
  }
}
class Gs {
  constructor(e, t, r, s) {
    this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = r, this._app = s, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new yd({}), this._settingsFrozen = !1, this._emulatorOptions = {}, this._terminateTask = "notTerminated";
  }
  get app() {
    if (!this._app) throw new D(S.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return this._terminateTask !== "notTerminated";
  }
  _setSettings(e) {
    if (this._settingsFrozen) throw new D(S.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new yd(e), this._emulatorOptions = e.emulatorOptions || {}, e.credentials !== void 0 && (this._authCredentials = function (r) {
      if (!r) return new kE();
      switch (r.type) {
        case "firstParty":
          return new OE(r.sessionIndex || "0", r.iamToken || null, r.authTokenFactory || null);
        case "provider":
          return r.client;
        default:
          throw new D(S.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    }(e.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _getEmulatorOptions() {
    return this._emulatorOptions;
  }
  _freezeSettings() {
    return this._settingsFrozen = !0, this._settings;
  }
  _delete() {
    return this._terminateTask === "notTerminated" && (this._terminateTask = this._terminate()), this._terminateTask;
  }
  async _restart() {
    this._terminateTask === "notTerminated" ? await this._terminate() : this._terminateTask = "notTerminated";
  }
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  _terminate() {
    return function (t) {
      const r = gd.get(t);
      r && (k("ComponentProvider", "Removing Datastore"), gd.delete(t), r.terminate());
    }(this), Promise.resolve();
  }
}
function SR(n, e, t, r = {}) {
  n = ve(n, Gs);
  const s = bt(e),
    i = n._getSettings(),
    o = {
      ...i,
      emulatorOptions: n._getEmulatorOptions()
    },
    c = `${e}:${t}`;
  s && (uo(`https://${c}`), mc("Firestore", !0)), i.host !== Dm && i.host !== c && lr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
  const u = {
    ...i,
    host: c,
    ssl: s,
    emulatorOptions: r
  };
  if (!ht(u, o) && (n._setSettings(u), r.mockUserToken)) {
    let h, f;
    if (typeof r.mockUserToken == "string") h = r.mockUserToken, f = Ae.MOCK_USER;else {
      h = Md(r.mockUserToken, n._app?.options.projectId);
      const m = r.mockUserToken.sub || r.mockUserToken.user_id;
      if (!m) throw new D(S.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
      f = new Ae(m);
    }
    n._authCredentials = new DE(new Mf(h, f));
  }
}
class Ze {
  constructor(e, t, r) {
    this.converter = t, this._query = r, this.type = "query", this.firestore = e;
  }
  withConverter(e) {
    return new Ze(this.firestore, e, this._query);
  }
}
class he {
  constructor(e, t, r) {
    this.converter = t, this._key = r, this.type = "document", this.firestore = e;
  }
  get _path() {
    return this._key.path;
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get path() {
    return this._key.path.canonicalString();
  }
  get parent() {
    return new Wt(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(e) {
    return new he(this.firestore, e, this._key);
  }
  toJSON() {
    return {
      type: he._jsonSchemaVersion,
      referencePath: this._key.toString()
    };
  }
  static fromJSON(e, t, r) {
    if (Os(t, he._jsonSchema)) return new he(e, r || null, new O(Z.fromString(t.referencePath)));
  }
}
he._jsonSchemaVersion = "firestore/documentReference/1.0", he._jsonSchema = {
  type: me("string", he._jsonSchemaVersion),
  referencePath: me("string")
};
class Wt extends Ze {
  constructor(e, t, r) {
    super(e, t, Fs(r)), this._path = r, this.type = "collection";
  }
  get id() {
    return this._query.path.lastSegment();
  }
  get path() {
    return this._query.path.canonicalString();
  }
  get parent() {
    const e = this._path.popLast();
    return e.isEmpty() ? null : new he(this.firestore, null, new O(e));
  }
  withConverter(e) {
    return new Wt(this.firestore, e, this._path);
  }
}
function CR(n, e, ...t) {
  if (n = se(n), Cc("collection", "path", e), n instanceof Gs) {
    const r = Z.fromString(e, ...t);
    return uh(r), new Wt(n, null, r);
  }
  {
    if (!(n instanceof he || n instanceof Wt)) throw new D(S.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r = n._path.child(Z.fromString(e, ...t));
    return uh(r), new Wt(n.firestore, null, r);
  }
}
function VR(n, e) {
  if (n = ve(n, Gs), Cc("collectionGroup", "collection id", e), e.indexOf("/") >= 0) throw new D(S.INVALID_ARGUMENT, `Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
  return new Ze(n, null, function (r) {
    return new qn(Z.emptyPath(), r);
  }(e));
}
function Gv(n, e, ...t) {
  if (n = se(n), arguments.length === 1 && (e = Sc.newId()), Cc("doc", "path", e), n instanceof Gs) {
    const r = Z.fromString(e, ...t);
    return ch(r), new he(n, null, new O(r));
  }
  {
    if (!(n instanceof he || n instanceof Wt)) throw new D(S.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r = n._path.child(Z.fromString(e, ...t));
    return ch(r), new he(n.firestore, n instanceof Wt ? n.converter : null, new O(r));
  }
}
const Id = "AsyncQueue";
class Ed {
  constructor(e = Promise.resolve()) {
    this.Xu = [], this.ec = !1, this.tc = [], this.nc = null, this.rc = !1, this.sc = !1, this.oc = [], this.M_ = new hm(this, "async_queue_retry"), this._c = () => {
      const r = xi();
      r && k(Id, "Visibility state changed to " + r.visibilityState), this.M_.w_();
    }, this.ac = e;
    const t = xi();
    t && typeof t.addEventListener == "function" && t.addEventListener("visibilitychange", this._c);
  }
  get isShuttingDown() {
    return this.ec;
  }
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.uc(), this.cc(e);
  }
  enterRestrictedMode(e) {
    if (!this.ec) {
      this.ec = !0, this.sc = e || !1;
      const t = xi();
      t && typeof t.removeEventListener == "function" && t.removeEventListener("visibilitychange", this._c);
    }
  }
  enqueue(e) {
    if (this.uc(), this.ec) return new Promise(() => {});
    const t = new Je();
    return this.cc(() => this.ec && this.sc ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise)).then(() => t.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.Xu.push(e), this.lc()));
  }
  async lc() {
    if (this.Xu.length !== 0) {
      try {
        await this.Xu[0](), this.Xu.shift(), this.M_.reset();
      } catch (e) {
        if (!rn(e)) throw e;
        k(Id, "Operation failed with retryable error: " + e);
      }
      this.Xu.length > 0 && this.M_.p_(() => this.lc());
    }
  }
  cc(e) {
    const t = this.ac.then(() => (this.rc = !0, e().catch(r => {
      throw this.nc = r, this.rc = !1, Oe("INTERNAL UNHANDLED ERROR: ", Td(r)), r;
    }).then(r => (this.rc = !1, r))));
    return this.ac = t, t;
  }
  enqueueAfterDelay(e, t, r) {
    this.uc(), this.oc.indexOf(e) > -1 && (t = 0);
    const s = ru.createAndSchedule(this, e, t, r, i => this.hc(i));
    return this.tc.push(s), s;
  }
  uc() {
    this.nc && L(47125, {
      Pc: Td(this.nc)
    });
  }
  verifyOperationInProgress() {}
  async Tc() {
    let e;
    do e = this.ac, await e; while (e !== this.ac);
  }
  Ic(e) {
    for (const t of this.tc) if (t.timerId === e) return !0;
    return !1;
  }
  Ec(e) {
    return this.Tc().then(() => {
      this.tc.sort((t, r) => t.targetTimeMs - r.targetTimeMs);
      for (const t of this.tc) if (t.skipDelay(), e !== "all" && t.timerId === e) break;
      return this.Tc();
    });
  }
  dc(e) {
    this.oc.push(e);
  }
  hc(e) {
    const t = this.tc.indexOf(e);
    this.tc.splice(t, 1);
  }
}
function Td(n) {
  let e = n.message || "";
  return n.stack && (e = n.stack.includes(n.message) ? n.stack : n.message + `
` + n.stack), e;
}
function wd(n) {
  return function (t, r) {
    if (typeof t != "object" || t === null) return !1;
    const s = t;
    for (const i of r) if (i in s && typeof s[i] == "function") return !0;
    return !1;
  }(n, ["next", "error", "complete"]);
}
class Ye extends Gs {
  constructor(e, t, r, s) {
    super(e, t, r, s), this.type = "firestore", this._queue = new Ed(), this._persistenceKey = s?.name || "[DEFAULT]";
  }
  async _terminate() {
    if (this._firestoreClient) {
      const e = this._firestoreClient.terminate();
      this._queue = new Ed(e), this._firestoreClient = void 0, await e;
    }
  }
}
function kR(n, e, t) {
  t || (t = Wi);
  const r = yc(n, "firestore");
  if (r.isInitialized(t)) {
    const s = r.getImmediate({
        identifier: t
      }),
      i = r.getOptions(t);
    if (ht(i, e)) return s;
    throw new D(S.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
  }
  if (e.cacheSizeBytes !== void 0 && e.localCache !== void 0) throw new D(S.INVALID_ARGUMENT, "cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");
  if (e.cacheSizeBytes !== void 0 && e.cacheSizeBytes !== -1 && e.cacheSizeBytes < em) throw new D(S.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
  return e.host && bt(e.host) && uo(e.host), r.initialize({
    options: e,
    instanceIdentifier: t
  });
}
function Pr(n) {
  if (n._terminated) throw new D(S.FAILED_PRECONDITION, "The client has already been terminated.");
  return n._firestoreClient || Kv(n), n._firestoreClient;
}
function Kv(n) {
  const e = n._freezeSettings(),
    t = function (s, i, o, c) {
      return new TT(s, i, o, c.host, c.ssl, c.experimentalForceLongPolling, c.experimentalAutoDetectLongPolling, km(c.experimentalLongPollingOptions), c.useFetchStreams, c.isUsingEmulator);
    }(n._databaseId, n._app?.options.appId || "", n._persistenceKey, e);
  n._componentsProvider || e.localCache?._offlineComponentProvider && e.localCache?._onlineComponentProvider && (n._componentsProvider = {
    _offline: e.localCache._offlineComponentProvider,
    _online: e.localCache._onlineComponentProvider
  }), n._firestoreClient = new Uv(n._authCredentials, n._appCheckCredentials, n._queue, t, n._componentsProvider && function (s) {
    const i = s?._online.build();
    return {
      _offline: s?._offline.build(i),
      _online: i
    };
  }(n._componentsProvider));
}
class $e {
  constructor(e) {
    this._byteString = e;
  }
  static fromBase64String(e) {
    try {
      return new $e(ge.fromBase64String(e));
    } catch (t) {
      throw new D(S.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t);
    }
  }
  static fromUint8Array(e) {
    return new $e(ge.fromUint8Array(e));
  }
  toBase64() {
    return this._byteString.toBase64();
  }
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  toString() {
    return "Bytes(base64: " + this.toBase64() + ")";
  }
  isEqual(e) {
    return this._byteString.isEqual(e._byteString);
  }
  toJSON() {
    return {
      type: $e._jsonSchemaVersion,
      bytes: this.toBase64()
    };
  }
  static fromJSON(e) {
    if (Os(e, $e._jsonSchema)) return $e.fromBase64String(e.bytes);
  }
}
$e._jsonSchemaVersion = "firestore/bytes/1.0", $e._jsonSchema = {
  type: me("string", $e._jsonSchemaVersion),
  bytes: me("string")
};
class Sr {
  constructor(...e) {
    for (let t = 0; t < e.length; ++t) if (e[t].length === 0) throw new D(S.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    this._internalPath = new ce(e);
  }
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath);
  }
}
function DR() {
  return new Sr(ja);
}
class Cr {
  constructor(e) {
    this._methodName = e;
  }
}
class ut {
  constructor(e, t) {
    if (!isFinite(e) || e < -90 || e > 90) throw new D(S.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
    if (!isFinite(t) || t < -180 || t > 180) throw new D(S.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
    this._lat = e, this._long = t;
  }
  get latitude() {
    return this._lat;
  }
  get longitude() {
    return this._long;
  }
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long;
  }
  _compareTo(e) {
    return z(this._lat, e._lat) || z(this._long, e._long);
  }
  toJSON() {
    return {
      latitude: this._lat,
      longitude: this._long,
      type: ut._jsonSchemaVersion
    };
  }
  static fromJSON(e) {
    if (Os(e, ut._jsonSchema)) return new ut(e.latitude, e.longitude);
  }
}
ut._jsonSchemaVersion = "firestore/geoPoint/1.0", ut._jsonSchema = {
  type: me("string", ut._jsonSchemaVersion),
  latitude: me("number"),
  longitude: me("number")
};
class lt {
  constructor(e) {
    this._values = (e || []).map(t => t);
  }
  toArray() {
    return this._values.map(e => e);
  }
  isEqual(e) {
    return function (r, s) {
      if (r.length !== s.length) return !1;
      for (let i = 0; i < r.length; ++i) if (r[i] !== s[i]) return !1;
      return !0;
    }(this._values, e._values);
  }
  toJSON() {
    return {
      type: lt._jsonSchemaVersion,
      vectorValues: this._values
    };
  }
  static fromJSON(e) {
    if (Os(e, lt._jsonSchema)) {
      if (Array.isArray(e.vectorValues) && e.vectorValues.every(t => typeof t == "number")) return new lt(e.vectorValues);
      throw new D(S.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
    }
  }
}
lt._jsonSchemaVersion = "firestore/vectorValue/1.0", lt._jsonSchema = {
  type: me("string", lt._jsonSchemaVersion),
  vectorValues: me("object")
};
const Hv = /^__.*__$/;
class Wv {
  constructor(e, t, r) {
    this.data = e, this.fieldMask = t, this.fieldTransforms = r;
  }
  toMutation(e, t) {
    return this.fieldMask !== null ? new kt(e, this.data, this.fieldMask, t, this.fieldTransforms) : new Rr(e, this.data, t, this.fieldTransforms);
  }
}
class Nm {
  constructor(e, t, r) {
    this.data = e, this.fieldMask = t, this.fieldTransforms = r;
  }
  toMutation(e, t) {
    return new kt(e, this.data, this.fieldMask, t, this.fieldTransforms);
  }
}
function xm(n) {
  switch (n) {
    case 0:
    case 2:
    case 1:
      return !0;
    case 3:
    case 4:
      return !1;
    default:
      throw L(40011, {
        Ac: n
      });
  }
}
class Oo {
  constructor(e, t, r, s, i, o) {
    this.settings = e, this.databaseId = t, this.serializer = r, this.ignoreUndefinedProperties = s, i === void 0 && this.Rc(), this.fieldTransforms = i || [], this.fieldMask = o || [];
  }
  get path() {
    return this.settings.path;
  }
  get Ac() {
    return this.settings.Ac;
  }
  Vc(e) {
    return new Oo({
      ...this.settings,
      ...e
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
  }
  mc(e) {
    const t = this.path?.child(e),
      r = this.Vc({
        path: t,
        fc: !1
      });
    return r.gc(e), r;
  }
  yc(e) {
    const t = this.path?.child(e),
      r = this.Vc({
        path: t,
        fc: !1
      });
    return r.Rc(), r;
  }
  wc(e) {
    return this.Vc({
      path: void 0,
      fc: !0
    });
  }
  Sc(e) {
    return ao(e, this.settings.methodName, this.settings.bc || !1, this.path, this.settings.Dc);
  }
  contains(e) {
    return this.fieldMask.find(t => e.isPrefixOf(t)) !== void 0 || this.fieldTransforms.find(t => e.isPrefixOf(t.field)) !== void 0;
  }
  Rc() {
    if (this.path) for (let e = 0; e < this.path.length; e++) this.gc(this.path.get(e));
  }
  gc(e) {
    if (e.length === 0) throw this.Sc("Document fields must not be empty");
    if (xm(this.Ac) && Hv.test(e)) throw this.Sc('Document fields cannot begin and end with "__"');
  }
}
class Qv {
  constructor(e, t, r) {
    this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = r || Do(e);
  }
  Cc(e, t, r, s = !1) {
    return new Oo({
      Ac: e,
      methodName: t,
      Dc: r,
      path: ce.emptyPath(),
      fc: !1,
      bc: s
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
  }
}
function Ks(n) {
  const e = n._freezeSettings(),
    t = Do(n._databaseId);
  return new Qv(n._databaseId, !!e.ignoreUndefinedProperties, t);
}
function hu(n, e, t, r, s, i = {}) {
  const o = n.Cc(i.merge || i.mergeFields ? 2 : 0, e, t, s);
  mu("Data must be an object, but it was:", o, r);
  const c = Fm(r, o);
  let u, h;
  if (i.merge) u = new Ue(o.fieldMask), h = o.fieldTransforms;else if (i.mergeFields) {
    const f = [];
    for (const m of i.mergeFields) {
      const _ = dc(e, m, t);
      if (!o.contains(_)) throw new D(S.INVALID_ARGUMENT, `Field '${_}' is specified in your field mask but missing from your input data.`);
      Bm(f, _) || f.push(_);
    }
    u = new Ue(f), h = o.fieldTransforms.filter(m => u.covers(m.field));
  } else u = null, h = o.fieldTransforms;
  return new Wv(new Ce(c), u, h);
}
class Mo extends Cr {
  _toFieldTransform(e) {
    if (e.Ac !== 2) throw e.Ac === 1 ? e.Sc(`${this._methodName}() can only appear at the top level of your update data`) : e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
    return e.fieldMask.push(e.path), null;
  }
  isEqual(e) {
    return e instanceof Mo;
  }
}
function Om(n, e, t) {
  return new Oo({
    Ac: 3,
    Dc: e.settings.Dc,
    methodName: n._methodName,
    fc: t
  }, e.databaseId, e.serializer, e.ignoreUndefinedProperties);
}
class du extends Cr {
  _toFieldTransform(e) {
    return new bo(e.path, new Er());
  }
  isEqual(e) {
    return e instanceof du;
  }
}
class fu extends Cr {
  constructor(e, t) {
    super(e), this.vc = t;
  }
  _toFieldTransform(e) {
    const t = Om(this, e, !0),
      r = this.vc.map(i => zn(i, t)),
      s = new kn(r);
    return new bo(e.path, s);
  }
  isEqual(e) {
    return e instanceof fu && ht(this.vc, e.vc);
  }
}
class pu extends Cr {
  constructor(e, t) {
    super(e), this.vc = t;
  }
  _toFieldTransform(e) {
    const t = Om(this, e, !0),
      r = this.vc.map(i => zn(i, t)),
      s = new Dn(r);
    return new bo(e.path, s);
  }
  isEqual(e) {
    return e instanceof pu && ht(this.vc, e.vc);
  }
}
function Mm(n, e, t, r) {
  const s = n.Cc(1, e, t);
  mu("Data must be an object, but it was:", s, r);
  const i = [],
    o = Ce.empty();
  sn(r, (u, h) => {
    const f = gu(e, u, t);
    h = se(h);
    const m = s.yc(f);
    if (h instanceof Mo) i.push(f);else {
      const _ = zn(h, m);
      _ != null && (i.push(f), o.set(f, _));
    }
  });
  const c = new Ue(i);
  return new Nm(o, c, s.fieldTransforms);
}
function Lm(n, e, t, r, s, i) {
  const o = n.Cc(1, e, t),
    c = [dc(e, r, t)],
    u = [s];
  if (i.length % 2 != 0) throw new D(S.INVALID_ARGUMENT, `Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);
  for (let _ = 0; _ < i.length; _ += 2) c.push(dc(e, i[_])), u.push(i[_ + 1]);
  const h = [],
    f = Ce.empty();
  for (let _ = c.length - 1; _ >= 0; --_) if (!Bm(h, c[_])) {
    const b = c[_];
    let V = u[_];
    V = se(V);
    const N = o.yc(b);
    if (V instanceof Mo) h.push(b);else {
      const C = zn(V, N);
      C != null && (h.push(b), f.set(b, C));
    }
  }
  const m = new Ue(h);
  return new Nm(f, m, o.fieldTransforms);
}
function Xv(n, e, t, r = !1) {
  return zn(t, n.Cc(r ? 4 : 3, e));
}
function zn(n, e) {
  if (Um(n = se(n))) return mu("Unsupported field value:", e, n), Fm(n, e);
  if (n instanceof Cr) return function (r, s) {
    if (!xm(s.Ac)) throw s.Sc(`${r._methodName}() can only be used with update() and set()`);
    if (!s.path) throw s.Sc(`${r._methodName}() is not currently supported inside arrays`);
    const i = r._toFieldTransform(s);
    i && s.fieldTransforms.push(i);
  }(n, e), null;
  if (n === void 0 && e.ignoreUndefinedProperties) return null;
  if (e.path && e.fieldMask.push(e.path), n instanceof Array) {
    if (e.settings.fc && e.Ac !== 4) throw e.Sc("Nested arrays are not supported");
    return function (r, s) {
      const i = [];
      let o = 0;
      for (const c of r) {
        let u = zn(c, s.wc(o));
        u == null && (u = {
          nullValue: "NULL_VALUE"
        }), i.push(u), o++;
      }
      return {
        arrayValue: {
          values: i
        }
      };
    }(n, e);
  }
  return function (r, s) {
    if ((r = se(r)) === null) return {
      nullValue: "NULL_VALUE"
    };
    if (typeof r == "number") return qT(s.serializer, r);
    if (typeof r == "boolean") return {
      booleanValue: r
    };
    if (typeof r == "string") return {
      stringValue: r
    };
    if (r instanceof Date) {
      const i = ee.fromDate(r);
      return {
        timestampValue: Tr(s.serializer, i)
      };
    }
    if (r instanceof ee) {
      const i = new ee(r.seconds, 1e3 * Math.floor(r.nanoseconds / 1e3));
      return {
        timestampValue: Tr(s.serializer, i)
      };
    }
    if (r instanceof ut) return {
      geoPointValue: {
        latitude: r.latitude,
        longitude: r.longitude
      }
    };
    if (r instanceof $e) return {
      bytesValue: xp(s.serializer, r._byteString)
    };
    if (r instanceof he) {
      const i = s.databaseId,
        o = r.firestore._databaseId;
      if (!o.isEqual(i)) throw s.Sc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);
      return {
        referenceValue: Gc(r.firestore._databaseId || s.databaseId, r._key.path)
      };
    }
    if (r instanceof lt) return function (o, c) {
      return {
        mapValue: {
          fields: {
            [Lc]: {
              stringValue: Fc
            },
            [gr]: {
              arrayValue: {
                values: o.toArray().map(h => {
                  if (typeof h != "number") throw c.Sc("VectorValues must only contain numeric values.");
                  return Bc(c.serializer, h);
                })
              }
            }
          }
        }
      };
    }(r, s);
    throw s.Sc(`Unsupported field value: ${go(r)}`);
  }(n, e);
}
function Fm(n, e) {
  const t = {};
  return ep(n) ? e.path && e.path.length > 0 && e.fieldMask.push(e.path) : sn(n, (r, s) => {
    const i = zn(s, e.mc(r));
    i != null && (t[r] = i);
  }), {
    mapValue: {
      fields: t
    }
  };
}
function Um(n) {
  return !(typeof n != "object" || n === null || n instanceof Array || n instanceof Date || n instanceof ee || n instanceof ut || n instanceof $e || n instanceof he || n instanceof Cr || n instanceof lt);
}
function mu(n, e, t) {
  if (!Um(t) || !Ff(t)) {
    const r = go(t);
    throw r === "an object" ? e.Sc(n + " a custom object") : e.Sc(n + " " + r);
  }
}
function dc(n, e, t) {
  if ((e = se(e)) instanceof Sr) return e._internalPath;
  if (typeof e == "string") return gu(n, e);
  throw ao("Field path arguments must be of type string or ", n, !1, void 0, t);
}
const Jv = new RegExp("[~\\*/\\[\\]]");
function gu(n, e, t) {
  if (e.search(Jv) >= 0) throw ao(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, n, !1, void 0, t);
  try {
    return new Sr(...e.split("."))._internalPath;
  } catch {
    throw ao(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, n, !1, void 0, t);
  }
}
function ao(n, e, t, r, s) {
  const i = r && !r.isEmpty(),
    o = s !== void 0;
  let c = `Function ${e}() called with invalid data`;
  t && (c += " (via `toFirestore()`)"), c += ". ";
  let u = "";
  return (i || o) && (u += " (found", i && (u += ` in field ${r}`), o && (u += ` in document ${s}`), u += ")"), new D(S.INVALID_ARGUMENT, c + n + u);
}
function Bm(n, e) {
  return n.some(t => t.isEqual(e));
}
class qm {
  constructor(e, t, r, s, i) {
    this._firestore = e, this._userDataWriter = t, this._key = r, this._document = s, this._converter = i;
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get ref() {
    return new he(this._firestore, this._converter, this._key);
  }
  exists() {
    return this._document !== null;
  }
  data() {
    if (this._document) {
      if (this._converter) {
        const e = new Yv(this._firestore, this._userDataWriter, this._key, this._document, null);
        return this._converter.fromFirestore(e);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  get(e) {
    if (this._document) {
      const t = this._document.data.field(Lo("DocumentSnapshot.get", e));
      if (t !== null) return this._userDataWriter.convertValue(t);
    }
  }
}
class Yv extends qm {
  data() {
    return super.data();
  }
}
function Lo(n, e) {
  return typeof e == "string" ? gu(n, e) : e instanceof Sr ? e._internalPath : e._delegate._internalPath;
}
function jm(n) {
  if (n.limitType === "L" && n.explicitOrderBy.length === 0) throw new D(S.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}
class _u {}
class yu extends _u {}
function NR(n, e, ...t) {
  let r = [];
  e instanceof _u && r.push(e), r = r.concat(t), function (i) {
    const o = i.filter(u => u instanceof Iu).length,
      c = i.filter(u => u instanceof Fo).length;
    if (o > 1 || o > 0 && c > 0) throw new D(S.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
  }(r);
  for (const s of r) n = s._apply(n);
  return n;
}
class Fo extends yu {
  constructor(e, t, r) {
    super(), this._field = e, this._op = t, this._value = r, this.type = "where";
  }
  static _create(e, t, r) {
    return new Fo(e, t, r);
  }
  _apply(e) {
    const t = this._parse(e);
    return zm(e._query, t), new Ze(e.firestore, e.converter, Za(e._query, t));
  }
  _parse(e) {
    const t = Ks(e.firestore);
    return function (i, o, c, u, h, f, m) {
      let _;
      if (h.isKeyField()) {
        if (f === "array-contains" || f === "array-contains-any") throw new D(S.INVALID_ARGUMENT, `Invalid Query. You can't perform '${f}' queries on documentId().`);
        if (f === "in" || f === "not-in") {
          Ad(m, f);
          const V = [];
          for (const N of m) V.push(vd(u, i, N));
          _ = {
            arrayValue: {
              values: V
            }
          };
        } else _ = vd(u, i, m);
      } else f !== "in" && f !== "not-in" && f !== "array-contains-any" || Ad(m, f), _ = Xv(c, o, m, f === "in" || f === "not-in");
      return J.create(h, f, _);
    }(e._query, "where", t, e.firestore._databaseId, this._field, this._op, this._value);
  }
}
function xR(n, e, t) {
  const r = e,
    s = Lo("where", n);
  return Fo._create(s, r, t);
}
class Iu extends _u {
  constructor(e, t) {
    super(), this.type = e, this._queryConstraints = t;
  }
  static _create(e, t) {
    return new Iu(e, t);
  }
  _parse(e) {
    const t = this._queryConstraints.map(r => r._parse(e)).filter(r => r.getFilters().length > 0);
    return t.length === 1 ? t[0] : te.create(t, this._getOperator());
  }
  _apply(e) {
    const t = this._parse(e);
    return t.getFilters().length === 0 ? e : (function (s, i) {
      let o = s;
      const c = i.getFlattenedFilters();
      for (const u of c) zm(o, u), o = Za(o, u);
    }(e._query, t), new Ze(e.firestore, e.converter, Za(e._query, t)));
  }
  _getQueryConstraints() {
    return this._queryConstraints;
  }
  _getOperator() {
    return this.type === "and" ? "and" : "or";
  }
}
class Eu extends yu {
  constructor(e, t) {
    super(), this._field = e, this._direction = t, this.type = "orderBy";
  }
  static _create(e, t) {
    return new Eu(e, t);
  }
  _apply(e) {
    const t = function (s, i, o) {
      if (s.startAt !== null) throw new D(S.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
      if (s.endAt !== null) throw new D(S.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
      return new Ps(i, o);
    }(e._query, this._field, this._direction);
    return new Ze(e.firestore, e.converter, function (s, i) {
      const o = s.explicitOrderBy.concat([i]);
      return new qn(s.path, s.collectionGroup, o, s.filters.slice(), s.limit, s.limitType, s.startAt, s.endAt);
    }(e._query, t));
  }
}
function OR(n, e = "asc") {
  const t = e,
    r = Lo("orderBy", n);
  return Eu._create(r, t);
}
class Uo extends yu {
  constructor(e, t, r) {
    super(), this.type = e, this._limit = t, this._limitType = r;
  }
  static _create(e, t, r) {
    return new Uo(e, t, r);
  }
  _apply(e) {
    return new Ze(e.firestore, e.converter, Ji(e._query, this._limit, this._limitType));
  }
}
function MR(n) {
  return Uf("limit", n), Uo._create("limit", n, "F");
}
function LR(n) {
  return Uf("limitToLast", n), Uo._create("limitToLast", n, "L");
}
function vd(n, e, t) {
  if (typeof (t = se(t)) == "string") {
    if (t === "") throw new D(S.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
    if (!_p(e) && t.indexOf("/") !== -1) throw new D(S.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);
    const r = e.path.child(Z.fromString(t));
    if (!O.isDocumentKey(r)) throw new D(S.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);
    return Rs(n, new O(r));
  }
  if (t instanceof he) return Rs(n, t._key);
  throw new D(S.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${go(t)}.`);
}
function Ad(n, e) {
  if (!Array.isArray(n) || n.length === 0) throw new D(S.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);
}
function zm(n, e) {
  const t = function (s, i) {
    for (const o of s) for (const c of o.getFlattenedFilters()) if (i.indexOf(c.op) >= 0) return c.op;
    return null;
  }(n.filters, function (s) {
    switch (s) {
      case "!=":
        return ["!=", "not-in"];
      case "array-contains-any":
      case "in":
        return ["not-in"];
      case "not-in":
        return ["array-contains-any", "in", "not-in", "!="];
      default:
        return [];
    }
  }(e.op));
  if (t !== null) throw t === e.op ? new D(S.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new D(S.INVALID_ARGUMENT, `Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`);
}
class Zv {
  convertValue(e, t = "none") {
    switch (Zt(e)) {
      case 0:
        return null;
      case 1:
        return e.booleanValue;
      case 2:
        return oe(e.integerValue || e.doubleValue);
      case 3:
        return this.convertTimestamp(e.timestampValue);
      case 4:
        return this.convertServerTimestamp(e, t);
      case 5:
        return e.stringValue;
      case 6:
        return this.convertBytes(Rt(e.bytesValue));
      case 7:
        return this.convertReference(e.referenceValue);
      case 8:
        return this.convertGeoPoint(e.geoPointValue);
      case 9:
        return this.convertArray(e.arrayValue, t);
      case 11:
        return this.convertObject(e.mapValue, t);
      case 10:
        return this.convertVectorValue(e.mapValue);
      default:
        throw L(62114, {
          value: e
        });
    }
  }
  convertObject(e, t) {
    return this.convertObjectMap(e.fields, t);
  }
  convertObjectMap(e, t = "none") {
    const r = {};
    return sn(e, (s, i) => {
      r[s] = this.convertValue(i, t);
    }), r;
  }
  convertVectorValue(e) {
    const t = e.fields?.[gr].arrayValue?.values?.map(r => oe(r.doubleValue));
    return new lt(t);
  }
  convertGeoPoint(e) {
    return new ut(oe(e.latitude), oe(e.longitude));
  }
  convertArray(e, t) {
    return (e.values || []).map(r => this.convertValue(r, t));
  }
  convertServerTimestamp(e, t) {
    switch (t) {
      case "previous":
        const r = wo(e);
        return r == null ? null : this.convertValue(r, t);
      case "estimate":
        return this.convertTimestamp(vs(e));
      default:
        return null;
    }
  }
  convertTimestamp(e) {
    const t = At(e);
    return new ee(t.seconds, t.nanos);
  }
  convertDocumentKey(e, t) {
    const r = Z.fromString(e);
    F($p(r), 9688, {
      name: e
    });
    const s = new Cn(r.get(1), r.get(3)),
      i = new O(r.popFirst(5));
    return s.isEqual(t) || Oe(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), i;
  }
}
function Tu(n, e, t) {
  let r;
  return r = n ? t && (t.merge || t.mergeFields) ? n.toFirestore(e, t) : n.toFirestore(e) : e, r;
}
class ss {
  constructor(e, t) {
    this.hasPendingWrites = e, this.fromCache = t;
  }
  isEqual(e) {
    return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache;
  }
}
class Rn extends qm {
  constructor(e, t, r, s, i, o) {
    super(e, t, r, s, o), this._firestore = e, this._firestoreImpl = e, this.metadata = i;
  }
  exists() {
    return super.exists();
  }
  data(e = {}) {
    if (this._document) {
      if (this._converter) {
        const t = new Oi(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
        return this._converter.fromFirestore(t, e);
      }
      return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
    }
  }
  get(e, t = {}) {
    if (this._document) {
      const r = this._document.data.field(Lo("DocumentSnapshot.get", e));
      if (r !== null) return this._userDataWriter.convertValue(r, t.serverTimestamps);
    }
  }
  toJSON() {
    if (this.metadata.hasPendingWrites) throw new D(S.FAILED_PRECONDITION, "DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
    const e = this._document,
      t = {};
    return t.type = Rn._jsonSchemaVersion, t.bundle = "", t.bundleSource = "DocumentSnapshot", t.bundleName = this._key.toString(), !e || !e.isValidDocument() || !e.isFoundDocument() ? t : (this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields, "previous"), t.bundle = (this._firestore, this.ref.path, "NOT SUPPORTED"), t);
  }
}
Rn._jsonSchemaVersion = "firestore/documentSnapshot/1.0", Rn._jsonSchema = {
  type: me("string", Rn._jsonSchemaVersion),
  bundleSource: me("string", "DocumentSnapshot"),
  bundleName: me("string"),
  bundle: me("string")
};
class Oi extends Rn {
  data(e = {}) {
    return super.data(e);
  }
}
class Qt {
  constructor(e, t, r, s) {
    this._firestore = e, this._userDataWriter = t, this._snapshot = s, this.metadata = new ss(s.hasPendingWrites, s.fromCache), this.query = r;
  }
  get docs() {
    const e = [];
    return this.forEach(t => e.push(t)), e;
  }
  get size() {
    return this._snapshot.docs.size;
  }
  get empty() {
    return this.size === 0;
  }
  forEach(e, t) {
    this._snapshot.docs.forEach(r => {
      e.call(t, new Oi(this._firestore, this._userDataWriter, r.key, r, new ss(this._snapshot.mutatedKeys.has(r.key), this._snapshot.fromCache), this.query.converter));
    });
  }
  docChanges(e = {}) {
    const t = !!e.includeMetadataChanges;
    if (t && this._snapshot.excludesMetadataChanges) throw new D(S.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t || (this._cachedChanges = function (s, i) {
      if (s._snapshot.oldDocs.isEmpty()) {
        let o = 0;
        return s._snapshot.docChanges.map(c => {
          const u = new Oi(s._firestore, s._userDataWriter, c.doc.key, c.doc, new ss(s._snapshot.mutatedKeys.has(c.doc.key), s._snapshot.fromCache), s.query.converter);
          return c.doc, {
            type: "added",
            doc: u,
            oldIndex: -1,
            newIndex: o++
          };
        });
      }
      {
        let o = s._snapshot.oldDocs;
        return s._snapshot.docChanges.filter(c => i || c.type !== 3).map(c => {
          const u = new Oi(s._firestore, s._userDataWriter, c.doc.key, c.doc, new ss(s._snapshot.mutatedKeys.has(c.doc.key), s._snapshot.fromCache), s.query.converter);
          let h = -1,
            f = -1;
          return c.type !== 0 && (h = o.indexOf(c.doc.key), o = o.delete(c.doc.key)), c.type !== 1 && (o = o.add(c.doc), f = o.indexOf(c.doc.key)), {
            type: eA(c.type),
            doc: u,
            oldIndex: h,
            newIndex: f
          };
        });
      }
    }(this, t), this._cachedChangesIncludeMetadataChanges = t), this._cachedChanges;
  }
  toJSON() {
    if (this.metadata.hasPendingWrites) throw new D(S.FAILED_PRECONDITION, "QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
    const e = {};
    e.type = Qt._jsonSchemaVersion, e.bundleSource = "QuerySnapshot", e.bundleName = Sc.newId(), this._firestore._databaseId.database, this._firestore._databaseId.projectId;
    const t = [],
      r = [],
      s = [];
    return this.docs.forEach(i => {
      i._document !== null && (t.push(i._document), r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields, "previous")), s.push(i.ref.path));
    }), e.bundle = (this._firestore, this.query._query, e.bundleName, "NOT SUPPORTED"), e;
  }
}
function eA(n) {
  switch (n) {
    case 0:
      return "added";
    case 2:
    case 3:
      return "modified";
    case 1:
      return "removed";
    default:
      return L(61501, {
        type: n
      });
  }
}
function FR(n) {
  n = ve(n, he);
  const e = ve(n.firestore, Ye);
  return jv(Pr(e), n._key).then(t => $m(e, n, t));
}
Qt._jsonSchemaVersion = "firestore/querySnapshot/1.0", Qt._jsonSchema = {
  type: me("string", Qt._jsonSchemaVersion),
  bundleSource: me("string", "QuerySnapshot"),
  bundleName: me("string"),
  bundle: me("string")
};
class Bo extends Zv {
  constructor(e) {
    super(), this.firestore = e;
  }
  convertBytes(e) {
    return new $e(e);
  }
  convertReference(e) {
    const t = this.convertDocumentKey(e, this.firestore._databaseId);
    return new he(this.firestore, null, t);
  }
}
function UR(n) {
  n = ve(n, Ze);
  const e = ve(n.firestore, Ye),
    t = Pr(e),
    r = new Bo(e);
  return jm(n._query), $v(t, n._query).then(s => new Qt(e, r, n, s));
}
function BR(n) {
  n = ve(n, Ze);
  const e = ve(n.firestore, Ye),
    t = Pr(e),
    r = new Bo(e);
  return zv(t, n._query).then(s => new Qt(e, r, n, s));
}
function qR(n, e, t) {
  n = ve(n, he);
  const r = ve(n.firestore, Ye),
    s = Tu(n.converter, e, t);
  return Hs(r, [hu(Ks(r), "setDoc", n._key, s, n.converter !== null, t).toMutation(n._key, ye.none())]);
}
function jR(n, e, t, ...r) {
  n = ve(n, he);
  const s = ve(n.firestore, Ye),
    i = Ks(s);
  let o;
  return o = typeof (e = se(e)) == "string" || e instanceof Sr ? Lm(i, "updateDoc", n._key, e, t, r) : Mm(i, "updateDoc", n._key, e), Hs(s, [o.toMutation(n._key, ye.exists(!0))]);
}
function zR(n) {
  return Hs(ve(n.firestore, Ye), [new Bs(n._key, ye.none())]);
}
function $R(n, e) {
  const t = ve(n.firestore, Ye),
    r = Gv(n),
    s = Tu(n.converter, e);
  return Hs(t, [hu(Ks(n.firestore), "addDoc", r._key, s, n.converter !== null, {}).toMutation(r._key, ye.exists(!1))]).then(() => r);
}
function GR(n, ...e) {
  n = se(n);
  let t = {
      includeMetadataChanges: !1,
      source: "default"
    },
    r = 0;
  typeof e[r] != "object" || wd(e[r]) || (t = e[r++]);
  const s = {
    includeMetadataChanges: t.includeMetadataChanges,
    source: t.source
  };
  if (wd(e[r])) {
    const u = e[r];
    e[r] = u.next?.bind(u), e[r + 1] = u.error?.bind(u), e[r + 2] = u.complete?.bind(u);
  }
  let i, o, c;
  if (n instanceof he) o = ve(n.firestore, Ye), c = Fs(n._key.path), i = {
    next: u => {
      e[r] && e[r]($m(o, n, u));
    },
    error: e[r + 1],
    complete: e[r + 2]
  };else {
    const u = ve(n, Ze);
    o = ve(u.firestore, Ye), c = u._query;
    const h = new Bo(o);
    i = {
      next: f => {
        e[r] && e[r](new Qt(o, h, u, f));
      },
      error: e[r + 1],
      complete: e[r + 2]
    }, jm(n._query);
  }
  return function (h, f, m, _) {
    const b = new lu(_),
      V = new au(f, b, m);
    return h.asyncQueue.enqueueAndForget(async () => su(await oo(h), V)), () => {
      b.Nu(), h.asyncQueue.enqueueAndForget(async () => iu(await oo(h), V));
    };
  }(Pr(o), c, s, i);
}
function Hs(n, e) {
  return function (r, s) {
    const i = new Je();
    return r.asyncQueue.enqueueAndForget(async () => Vv(await qv(r), s, i)), i.promise;
  }(Pr(n), e);
}
function $m(n, e, t) {
  const r = t.docs.get(e._key),
    s = new Bo(n);
  return new Rn(n, s, e._key, r, new ss(t.hasPendingWrites, t.fromCache), e.converter);
}
class tA {
  constructor(e) {
    let t;
    this.kind = "persistent", e?.tabManager ? (e.tabManager._initialize(e), t = e.tabManager) : (t = rA(void 0), t._initialize(e)), this._onlineComponentProvider = t._onlineComponentProvider, this._offlineComponentProvider = t._offlineComponentProvider;
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
}
function KR(n) {
  return new tA(n);
}
class nA {
  constructor(e) {
    this.forceOwnership = e, this.kind = "persistentSingleTab";
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
  _initialize(e) {
    this._onlineComponentProvider = io.provider, this._offlineComponentProvider = {
      build: t => new Fv(t, e?.cacheSizeBytes, this.forceOwnership)
    };
  }
}
function rA(n) {
  return new nA(n?.forceOwnership);
}
class sA {
  constructor(e, t) {
    this._firestore = e, this._commitHandler = t, this._mutations = [], this._committed = !1, this._dataReader = Ks(e);
  }
  set(e, t, r) {
    this._verifyNotCommitted();
    const s = Pa(e, this._firestore),
      i = Tu(s.converter, t, r),
      o = hu(this._dataReader, "WriteBatch.set", s._key, i, s.converter !== null, r);
    return this._mutations.push(o.toMutation(s._key, ye.none())), this;
  }
  update(e, t, r, ...s) {
    this._verifyNotCommitted();
    const i = Pa(e, this._firestore);
    let o;
    return o = typeof (t = se(t)) == "string" || t instanceof Sr ? Lm(this._dataReader, "WriteBatch.update", i._key, t, r, s) : Mm(this._dataReader, "WriteBatch.update", i._key, t), this._mutations.push(o.toMutation(i._key, ye.exists(!0))), this;
  }
  delete(e) {
    this._verifyNotCommitted();
    const t = Pa(e, this._firestore);
    return this._mutations = this._mutations.concat(new Bs(t._key, ye.none())), this;
  }
  commit() {
    return this._verifyNotCommitted(), this._committed = !0, this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve();
  }
  _verifyNotCommitted() {
    if (this._committed) throw new D(S.FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
  }
}
function Pa(n, e) {
  if ((n = se(n)).firestore !== e) throw new D(S.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
  return n;
}
function HR() {
  return new du("serverTimestamp");
}
function WR(...n) {
  return new fu("arrayUnion", n);
}
function QR(...n) {
  return new pu("arrayRemove", n);
}
function XR(n) {
  return Pr(n = ve(n, Ye)), new sA(n, e => Hs(n, e));
}
(function (e, t = !0) {
  (function (s) {
    Ar = s;
  })(Fn), Pn(new Xt("firestore", (r, {
    instanceIdentifier: s,
    options: i
  }) => {
    const o = r.getProvider("app").getImmediate(),
      c = new Ye(new NE(r.getProvider("auth-internal")), new ME(o, r.getProvider("app-check-internal")), function (h, f) {
        if (!Object.prototype.hasOwnProperty.apply(h.options, ["projectId"])) throw new D(S.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
        return new Cn(h.options.projectId, f);
      }(o, s), o);
    return i = {
      useFetchStreams: t,
      ...i
    }, c._setSettings(i), c;
  }, "PUBLIC").setMultipleInstances(!0)), ot(ih, oh, e), ot(ih, oh, "esm2020");
})();
var iA = "firebase";
var oA = "12.6.0";
ot(iA, oA, "app");
const Gm = "firebasestorage.googleapis.com";
const Km = "storageBucket";
const aA = 120 * 1e3;
const cA = 600 * 1e3;
class fe extends ft {
  constructor(e, t, r = 0) {
    super(Sa(e), `Firebase Storage: ${t} (${Sa(e)})`), this.status_ = r, this.customData = {
      serverResponse: null
    }, this._baseMessage = this.message, Object.setPrototypeOf(this, fe.prototype);
  }
  get status() {
    return this.status_;
  }
  set status(e) {
    this.status_ = e;
  }
  _codeEquals(e) {
    return Sa(e) === this.code;
  }
  get serverResponse() {
    return this.customData.serverResponse;
  }
  set serverResponse(e) {
    this.customData.serverResponse = e, this.customData.serverResponse ? this.message = `${this._baseMessage}
${this.customData.serverResponse}` : this.message = this._baseMessage;
  }
}
var de;
(function (n) {
  n.UNKNOWN = "unknown", n.OBJECT_NOT_FOUND = "object-not-found", n.BUCKET_NOT_FOUND = "bucket-not-found", n.PROJECT_NOT_FOUND = "project-not-found", n.QUOTA_EXCEEDED = "quota-exceeded", n.UNAUTHENTICATED = "unauthenticated", n.UNAUTHORIZED = "unauthorized", n.UNAUTHORIZED_APP = "unauthorized-app", n.RETRY_LIMIT_EXCEEDED = "retry-limit-exceeded", n.INVALID_CHECKSUM = "invalid-checksum", n.CANCELED = "canceled", n.INVALID_EVENT_NAME = "invalid-event-name", n.INVALID_URL = "invalid-url", n.INVALID_DEFAULT_BUCKET = "invalid-default-bucket", n.NO_DEFAULT_BUCKET = "no-default-bucket", n.CANNOT_SLICE_BLOB = "cannot-slice-blob", n.SERVER_FILE_WRONG_SIZE = "server-file-wrong-size", n.NO_DOWNLOAD_URL = "no-download-url", n.INVALID_ARGUMENT = "invalid-argument", n.INVALID_ARGUMENT_COUNT = "invalid-argument-count", n.APP_DELETED = "app-deleted", n.INVALID_ROOT_OPERATION = "invalid-root-operation", n.INVALID_FORMAT = "invalid-format", n.INTERNAL_ERROR = "internal-error", n.UNSUPPORTED_ENVIRONMENT = "unsupported-environment";
})(de || (de = {}));
function Sa(n) {
  return "storage/" + n;
}
function wu() {
  const n = "An unknown error occurred, please check the error payload for server response.";
  return new fe(de.UNKNOWN, n);
}
function uA(n) {
  return new fe(de.OBJECT_NOT_FOUND, "Object '" + n + "' does not exist.");
}
function lA(n) {
  return new fe(de.QUOTA_EXCEEDED, "Quota for bucket '" + n + "' exceeded, please view quota on https://firebase.google.com/pricing/.");
}
function hA() {
  const n = "User is not authenticated, please authenticate using Firebase Authentication and try again.";
  return new fe(de.UNAUTHENTICATED, n);
}
function dA() {
  return new fe(de.UNAUTHORIZED_APP, "This app does not have permission to access Firebase Storage on this project.");
}
function fA(n) {
  return new fe(de.UNAUTHORIZED, "User does not have permission to access '" + n + "'.");
}
function pA() {
  return new fe(de.RETRY_LIMIT_EXCEEDED, "Max retry time for operation exceeded, please try again.");
}
function mA() {
  return new fe(de.CANCELED, "User canceled the upload/download.");
}
function gA(n) {
  return new fe(de.INVALID_URL, "Invalid URL '" + n + "'.");
}
function _A(n) {
  return new fe(de.INVALID_DEFAULT_BUCKET, "Invalid default bucket '" + n + "'.");
}
function yA() {
  return new fe(de.NO_DEFAULT_BUCKET, "No default bucket found. Did you set the '" + Km + "' property when initializing the app?");
}
function IA() {
  return new fe(de.CANNOT_SLICE_BLOB, "Cannot slice blob for upload. Please retry the upload.");
}
function EA() {
  return new fe(de.NO_DOWNLOAD_URL, "The given file does not have any download URLs.");
}
function TA(n) {
  return new fe(de.UNSUPPORTED_ENVIRONMENT, `${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`);
}
function fc(n) {
  return new fe(de.INVALID_ARGUMENT, n);
}
function Hm() {
  return new fe(de.APP_DELETED, "The Firebase app was deleted.");
}
function wA(n) {
  return new fe(de.INVALID_ROOT_OPERATION, "The operation '" + n + "' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').");
}
function ms(n, e) {
  return new fe(de.INVALID_FORMAT, "String does not match format '" + n + "': " + e);
}
function Jr(n) {
  throw new fe(de.INTERNAL_ERROR, "Internal error: " + n);
}
class Me {
  constructor(e, t) {
    this.bucket = e, this.path_ = t;
  }
  get path() {
    return this.path_;
  }
  get isRoot() {
    return this.path.length === 0;
  }
  fullServerUrl() {
    const e = encodeURIComponent;
    return "/b/" + e(this.bucket) + "/o/" + e(this.path);
  }
  bucketOnlyServerUrl() {
    return "/b/" + encodeURIComponent(this.bucket) + "/o";
  }
  static makeFromBucketSpec(e, t) {
    let r;
    try {
      r = Me.makeFromUrl(e, t);
    } catch {
      return new Me(e, "");
    }
    if (r.path === "") return r;
    throw _A(e);
  }
  static makeFromUrl(e, t) {
    let r = null;
    const s = "([A-Za-z0-9.\\-_]+)";
    function i(G) {
      G.path.charAt(G.path.length - 1) === "/" && (G.path_ = G.path_.slice(0, -1));
    }
    const o = "(/(.*))?$",
      c = new RegExp("^gs://" + s + o, "i"),
      u = {
        bucket: 1,
        path: 3
      };
    function h(G) {
      G.path_ = decodeURIComponent(G.path);
    }
    const f = "v[A-Za-z0-9_]+",
      m = t.replace(/[.]/g, "\\."),
      _ = "(/([^?#]*).*)?$",
      b = new RegExp(`^https?://${m}/${f}/b/${s}/o${_}`, "i"),
      V = {
        bucket: 1,
        path: 3
      },
      N = t === Gm ? "(?:storage.googleapis.com|storage.cloud.google.com)" : t,
      C = "([^?#]*)",
      q = new RegExp(`^https?://${N}/${s}/${C}`, "i"),
      M = [{
        regex: c,
        indices: u,
        postModify: i
      }, {
        regex: b,
        indices: V,
        postModify: h
      }, {
        regex: q,
        indices: {
          bucket: 1,
          path: 2
        },
        postModify: h
      }];
    for (let G = 0; G < M.length; G++) {
      const Q = M[G],
        W = Q.regex.exec(e);
      if (W) {
        const E = W[Q.indices.bucket];
        let g = W[Q.indices.path];
        g || (g = ""), r = new Me(E, g), Q.postModify(r);
        break;
      }
    }
    if (r == null) throw gA(e);
    return r;
  }
}
class vA {
  constructor(e) {
    this.promise_ = Promise.reject(e);
  }
  getPromise() {
    return this.promise_;
  }
  cancel(e = !1) {}
}
function AA(n, e, t) {
  let r = 1,
    s = null,
    i = null,
    o = !1,
    c = 0;
  function u() {
    return c === 2;
  }
  let h = !1;
  function f(...C) {
    h || (h = !0, e.apply(null, C));
  }
  function m(C) {
    s = setTimeout(() => {
      s = null, n(b, u());
    }, C);
  }
  function _() {
    i && clearTimeout(i);
  }
  function b(C, ...q) {
    if (h) {
      _();
      return;
    }
    if (C) {
      _(), f.call(null, C, ...q);
      return;
    }
    if (u() || o) {
      _(), f.call(null, C, ...q);
      return;
    }
    r < 64 && (r *= 2);
    let M;
    c === 1 ? (c = 2, M = 0) : M = (r + Math.random()) * 1e3, m(M);
  }
  let V = !1;
  function N(C) {
    V || (V = !0, _(), !h && (s !== null ? (C || (c = 2), clearTimeout(s), m(0)) : C || (c = 1)));
  }
  return m(0), i = setTimeout(() => {
    o = !0, N(!0);
  }, t), N;
}
function RA(n) {
  n(!1);
}
function bA(n) {
  return n !== void 0;
}
function PA(n) {
  return typeof n == "object" && !Array.isArray(n);
}
function vu(n) {
  return typeof n == "string" || n instanceof String;
}
function Rd(n) {
  return Au() && n instanceof Blob;
}
function Au() {
  return typeof Blob < "u";
}
function pc(n, e, t, r) {
  if (r < e) throw fc(`Invalid value for '${n}'. Expected ${e} or greater.`);
  if (r > t) throw fc(`Invalid value for '${n}'. Expected ${t} or less.`);
}
function Ws(n, e, t) {
  let r = e;
  return t == null && (r = `https://${e}`), `${t}://${r}/v0${n}`;
}
function Wm(n) {
  const e = encodeURIComponent;
  let t = "?";
  for (const r in n) if (n.hasOwnProperty(r)) {
    const s = e(r) + "=" + e(n[r]);
    t = t + s + "&";
  }
  return t = t.slice(0, -1), t;
}
var bn;
(function (n) {
  n[n.NO_ERROR = 0] = "NO_ERROR", n[n.NETWORK_ERROR = 1] = "NETWORK_ERROR", n[n.ABORT = 2] = "ABORT";
})(bn || (bn = {}));
function SA(n, e) {
  const t = n >= 500 && n < 600,
    s = [408, 429].indexOf(n) !== -1,
    i = e.indexOf(n) !== -1;
  return t || s || i;
}
class CA {
  constructor(e, t, r, s, i, o, c, u, h, f, m, _ = !0, b = !1) {
    this.url_ = e, this.method_ = t, this.headers_ = r, this.body_ = s, this.successCodes_ = i, this.additionalRetryCodes_ = o, this.callback_ = c, this.errorCallback_ = u, this.timeout_ = h, this.progressCallback_ = f, this.connectionFactory_ = m, this.retry = _, this.isUsingEmulator = b, this.pendingConnection_ = null, this.backoffId_ = null, this.canceled_ = !1, this.appDelete_ = !1, this.promise_ = new Promise((V, N) => {
      this.resolve_ = V, this.reject_ = N, this.start_();
    });
  }
  start_() {
    const e = (r, s) => {
        if (s) {
          r(!1, new yi(!1, null, !0));
          return;
        }
        const i = this.connectionFactory_();
        this.pendingConnection_ = i;
        const o = c => {
          const u = c.loaded,
            h = c.lengthComputable ? c.total : -1;
          this.progressCallback_ !== null && this.progressCallback_(u, h);
        };
        this.progressCallback_ !== null && i.addUploadProgressListener(o), i.send(this.url_, this.method_, this.isUsingEmulator, this.body_, this.headers_).then(() => {
          this.progressCallback_ !== null && i.removeUploadProgressListener(o), this.pendingConnection_ = null;
          const c = i.getErrorCode() === bn.NO_ERROR,
            u = i.getStatus();
          if (!c || SA(u, this.additionalRetryCodes_) && this.retry) {
            const f = i.getErrorCode() === bn.ABORT;
            r(!1, new yi(!1, null, f));
            return;
          }
          const h = this.successCodes_.indexOf(u) !== -1;
          r(!0, new yi(h, i));
        });
      },
      t = (r, s) => {
        const i = this.resolve_,
          o = this.reject_,
          c = s.connection;
        if (s.wasSuccessCode) try {
          const u = this.callback_(c, c.getResponse());
          bA(u) ? i(u) : i();
        } catch (u) {
          o(u);
        } else if (c !== null) {
          const u = wu();
          u.serverResponse = c.getErrorText(), this.errorCallback_ ? o(this.errorCallback_(c, u)) : o(u);
        } else if (s.canceled) {
          const u = this.appDelete_ ? Hm() : mA();
          o(u);
        } else {
          const u = pA();
          o(u);
        }
      };
    this.canceled_ ? t(!1, new yi(!1, null, !0)) : this.backoffId_ = AA(e, t, this.timeout_);
  }
  getPromise() {
    return this.promise_;
  }
  cancel(e) {
    this.canceled_ = !0, this.appDelete_ = e || !1, this.backoffId_ !== null && RA(this.backoffId_), this.pendingConnection_ !== null && this.pendingConnection_.abort();
  }
}
class yi {
  constructor(e, t, r) {
    this.wasSuccessCode = e, this.connection = t, this.canceled = !!r;
  }
}
function VA(n, e) {
  e !== null && e.length > 0 && (n.Authorization = "Firebase " + e);
}
function kA(n, e) {
  n["X-Firebase-Storage-Version"] = "webjs/" + (e ?? "AppManager");
}
function DA(n, e) {
  e && (n["X-Firebase-GMPID"] = e);
}
function NA(n, e) {
  e !== null && (n["X-Firebase-AppCheck"] = e);
}
function xA(n, e, t, r, s, i, o = !0, c = !1) {
  const u = Wm(n.urlParams),
    h = n.url + u,
    f = Object.assign({}, n.headers);
  return DA(f, e), VA(f, t), kA(f, i), NA(f, r), new CA(h, n.method, f, n.body, n.successCodes, n.additionalRetryCodes, n.handler, n.errorHandler, n.timeout, n.progressCallback, s, o, c);
}
function OA() {
  return typeof BlobBuilder < "u" ? BlobBuilder : typeof WebKitBlobBuilder < "u" ? WebKitBlobBuilder : void 0;
}
function MA(...n) {
  const e = OA();
  if (e !== void 0) {
    const t = new e();
    for (let r = 0; r < n.length; r++) t.append(n[r]);
    return t.getBlob();
  } else {
    if (Au()) return new Blob(n);
    throw new fe(de.UNSUPPORTED_ENVIRONMENT, "This browser doesn't seem to support creating Blobs");
  }
}
function LA(n, e, t) {
  return n.webkitSlice ? n.webkitSlice(e, t) : n.mozSlice ? n.mozSlice(e, t) : n.slice ? n.slice(e, t) : null;
}
function FA(n) {
  if (typeof atob > "u") throw TA("base-64");
  return atob(n);
}
const it = {
  RAW: "raw",
  BASE64: "base64",
  BASE64URL: "base64url",
  DATA_URL: "data_url"
};
class Ca {
  constructor(e, t) {
    this.data = e, this.contentType = t || null;
  }
}
function UA(n, e) {
  switch (n) {
    case it.RAW:
      return new Ca(Qm(e));
    case it.BASE64:
    case it.BASE64URL:
      return new Ca(Xm(n, e));
    case it.DATA_URL:
      return new Ca(qA(e), jA(e));
  }
  throw wu();
}
function Qm(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    let r = n.charCodeAt(t);
    if (r <= 127) e.push(r);else if (r <= 2047) e.push(192 | r >> 6, 128 | r & 63);else if ((r & 64512) === 55296) {
      if (!(t < n.length - 1 && (n.charCodeAt(t + 1) & 64512) === 56320)) e.push(239, 191, 189);else {
        const i = r,
          o = n.charCodeAt(++t);
        r = 65536 | (i & 1023) << 10 | o & 1023, e.push(240 | r >> 18, 128 | r >> 12 & 63, 128 | r >> 6 & 63, 128 | r & 63);
      }
    } else (r & 64512) === 56320 ? e.push(239, 191, 189) : e.push(224 | r >> 12, 128 | r >> 6 & 63, 128 | r & 63);
  }
  return new Uint8Array(e);
}
function BA(n) {
  let e;
  try {
    e = decodeURIComponent(n);
  } catch {
    throw ms(it.DATA_URL, "Malformed data URL.");
  }
  return Qm(e);
}
function Xm(n, e) {
  switch (n) {
    case it.BASE64:
      {
        const s = e.indexOf("-") !== -1,
          i = e.indexOf("_") !== -1;
        if (s || i) throw ms(n, "Invalid character '" + (s ? "-" : "_") + "' found: is it base64url encoded?");
        break;
      }
    case it.BASE64URL:
      {
        const s = e.indexOf("+") !== -1,
          i = e.indexOf("/") !== -1;
        if (s || i) throw ms(n, "Invalid character '" + (s ? "+" : "/") + "' found: is it base64 encoded?");
        e = e.replace(/-/g, "+").replace(/_/g, "/");
        break;
      }
  }
  let t;
  try {
    t = FA(e);
  } catch (s) {
    throw s.message.includes("polyfill") ? s : ms(n, "Invalid character found");
  }
  const r = new Uint8Array(t.length);
  for (let s = 0; s < t.length; s++) r[s] = t.charCodeAt(s);
  return r;
}
class Jm {
  constructor(e) {
    this.base64 = !1, this.contentType = null;
    const t = e.match(/^data:([^,]+)?,/);
    if (t === null) throw ms(it.DATA_URL, "Must be formatted 'data:[<mediatype>][;base64],<data>");
    const r = t[1] || null;
    r != null && (this.base64 = zA(r, ";base64"), this.contentType = this.base64 ? r.substring(0, r.length - 7) : r), this.rest = e.substring(e.indexOf(",") + 1);
  }
}
function qA(n) {
  const e = new Jm(n);
  return e.base64 ? Xm(it.BASE64, e.rest) : BA(e.rest);
}
function jA(n) {
  return new Jm(n).contentType;
}
function zA(n, e) {
  return n.length >= e.length ? n.substring(n.length - e.length) === e : !1;
}
class zt {
  constructor(e, t) {
    let r = 0,
      s = "";
    Rd(e) ? (this.data_ = e, r = e.size, s = e.type) : e instanceof ArrayBuffer ? (t ? this.data_ = new Uint8Array(e) : (this.data_ = new Uint8Array(e.byteLength), this.data_.set(new Uint8Array(e))), r = this.data_.length) : e instanceof Uint8Array && (t ? this.data_ = e : (this.data_ = new Uint8Array(e.length), this.data_.set(e)), r = e.length), this.size_ = r, this.type_ = s;
  }
  size() {
    return this.size_;
  }
  type() {
    return this.type_;
  }
  slice(e, t) {
    if (Rd(this.data_)) {
      const r = this.data_,
        s = LA(r, e, t);
      return s === null ? null : new zt(s);
    } else {
      const r = new Uint8Array(this.data_.buffer, e, t - e);
      return new zt(r, !0);
    }
  }
  static getBlob(...e) {
    if (Au()) {
      const t = e.map(r => r instanceof zt ? r.data_ : r);
      return new zt(MA.apply(null, t));
    } else {
      const t = e.map(o => vu(o) ? UA(it.RAW, o).data : o.data_);
      let r = 0;
      t.forEach(o => {
        r += o.byteLength;
      });
      const s = new Uint8Array(r);
      let i = 0;
      return t.forEach(o => {
        for (let c = 0; c < o.length; c++) s[i++] = o[c];
      }), new zt(s, !0);
    }
  }
  uploadData() {
    return this.data_;
  }
}
function Ru(n) {
  let e;
  try {
    e = JSON.parse(n);
  } catch {
    return null;
  }
  return PA(e) ? e : null;
}
function $A(n) {
  if (n.length === 0) return null;
  const e = n.lastIndexOf("/");
  return e === -1 ? "" : n.slice(0, e);
}
function GA(n, e) {
  const t = e.split("/").filter(r => r.length > 0).join("/");
  return n.length === 0 ? t : n + "/" + t;
}
function Ym(n) {
  const e = n.lastIndexOf("/", n.length - 2);
  return e === -1 ? n : n.slice(e + 1);
}
function KA(n, e) {
  return e;
}
class Ne {
  constructor(e, t, r, s) {
    this.server = e, this.local = t || e, this.writable = !!r, this.xform = s || KA;
  }
}
let Ii = null;
function HA(n) {
  return !vu(n) || n.length < 2 ? n : Ym(n);
}
function Zm() {
  if (Ii) return Ii;
  const n = [];
  n.push(new Ne("bucket")), n.push(new Ne("generation")), n.push(new Ne("metageneration")), n.push(new Ne("name", "fullPath", !0));
  function e(i, o) {
    return HA(o);
  }
  const t = new Ne("name");
  t.xform = e, n.push(t);
  function r(i, o) {
    return o !== void 0 ? Number(o) : o;
  }
  const s = new Ne("size");
  return s.xform = r, n.push(s), n.push(new Ne("timeCreated")), n.push(new Ne("updated")), n.push(new Ne("md5Hash", null, !0)), n.push(new Ne("cacheControl", null, !0)), n.push(new Ne("contentDisposition", null, !0)), n.push(new Ne("contentEncoding", null, !0)), n.push(new Ne("contentLanguage", null, !0)), n.push(new Ne("contentType", null, !0)), n.push(new Ne("metadata", "customMetadata", !0)), Ii = n, Ii;
}
function WA(n, e) {
  function t() {
    const r = n.bucket,
      s = n.fullPath,
      i = new Me(r, s);
    return e._makeStorageReference(i);
  }
  Object.defineProperty(n, "ref", {
    get: t
  });
}
function QA(n, e, t) {
  const r = {};
  r.type = "file";
  const s = t.length;
  for (let i = 0; i < s; i++) {
    const o = t[i];
    r[o.local] = o.xform(r, e[o.server]);
  }
  return WA(r, n), r;
}
function eg(n, e, t) {
  const r = Ru(e);
  return r === null ? null : QA(n, r, t);
}
function XA(n, e, t, r) {
  const s = Ru(e);
  if (s === null || !vu(s.downloadTokens)) return null;
  const i = s.downloadTokens;
  if (i.length === 0) return null;
  const o = encodeURIComponent;
  return i.split(",").map(h => {
    const f = n.bucket,
      m = n.fullPath,
      _ = "/b/" + o(f) + "/o/" + o(m),
      b = Ws(_, t, r),
      V = Wm({
        alt: "media",
        token: h
      });
    return b + V;
  })[0];
}
function JA(n, e) {
  const t = {},
    r = e.length;
  for (let s = 0; s < r; s++) {
    const i = e[s];
    i.writable && (t[i.server] = n[i.local]);
  }
  return JSON.stringify(t);
}
const bd = "prefixes";
const Pd = "items";
function YA(n, e, t) {
  const r = {
    prefixes: [],
    items: [],
    nextPageToken: t.nextPageToken
  };
  if (t[bd]) for (const s of t[bd]) {
    const i = s.replace(/\/$/, ""),
      o = n._makeStorageReference(new Me(e, i));
    r.prefixes.push(o);
  }
  if (t[Pd]) for (const s of t[Pd]) {
    const i = n._makeStorageReference(new Me(e, s.name));
    r.items.push(i);
  }
  return r;
}
function ZA(n, e, t) {
  const r = Ru(t);
  return r === null ? null : YA(n, e, r);
}
class qo {
  constructor(e, t, r, s) {
    this.url = e, this.method = t, this.handler = r, this.timeout = s, this.urlParams = {}, this.headers = {}, this.body = null, this.errorHandler = null, this.progressCallback = null, this.successCodes = [200], this.additionalRetryCodes = [];
  }
}
function bu(n) {
  if (!n) throw wu();
}
function eR(n, e) {
  function t(r, s) {
    const i = eg(n, s, e);
    return bu(i !== null), i;
  }
  return t;
}
function tR(n, e) {
  function t(r, s) {
    const i = ZA(n, e, s);
    return bu(i !== null), i;
  }
  return t;
}
function nR(n, e) {
  function t(r, s) {
    const i = eg(n, s, e);
    return bu(i !== null), XA(i, s, n.host, n._protocol);
  }
  return t;
}
function Pu(n) {
  function e(t, r) {
    let s;
    return t.getStatus() === 401 ? t.getErrorText().includes("Firebase App Check token is invalid") ? s = dA() : s = hA() : t.getStatus() === 402 ? s = lA(n.bucket) : t.getStatus() === 403 ? s = fA(n.path) : s = r, s.status = t.getStatus(), s.serverResponse = r.serverResponse, s;
  }
  return e;
}
function tg(n) {
  const e = Pu(n);
  function t(r, s) {
    let i = e(r, s);
    return r.getStatus() === 404 && (i = uA(n.path)), i.serverResponse = s.serverResponse, i;
  }
  return t;
}
function rR(n, e, t, r, s) {
  const i = {};
  e.isRoot ? i.prefix = "" : i.prefix = e.path + "/", t.length > 0 && (i.delimiter = t), r && (i.pageToken = r), s && (i.maxResults = s);
  const o = e.bucketOnlyServerUrl(),
    c = Ws(o, n.host, n._protocol),
    u = "GET",
    h = n.maxOperationRetryTime,
    f = new qo(c, u, tR(n, e.bucket), h);
  return f.urlParams = i, f.errorHandler = Pu(e), f;
}
function sR(n, e, t) {
  const r = e.fullServerUrl(),
    s = Ws(r, n.host, n._protocol),
    i = "GET",
    o = n.maxOperationRetryTime,
    c = new qo(s, i, nR(n, t), o);
  return c.errorHandler = tg(e), c;
}
function iR(n, e) {
  const t = e.fullServerUrl(),
    r = Ws(t, n.host, n._protocol),
    s = "DELETE",
    i = n.maxOperationRetryTime;
  function o(u, h) {}
  const c = new qo(r, s, o, i);
  return c.successCodes = [200, 204], c.errorHandler = tg(e), c;
}
function oR(n, e) {
  return n && n.contentType || e && e.type() || "application/octet-stream";
}
function aR(n, e, t) {
  const r = Object.assign({}, t);
  return r.fullPath = n.path, r.size = e.size(), r.contentType || (r.contentType = oR(null, e)), r;
}
function cR(n, e, t, r, s) {
  const i = e.bucketOnlyServerUrl(),
    o = {
      "X-Goog-Upload-Protocol": "multipart"
    };
  function c() {
    let M = "";
    for (let G = 0; G < 2; G++) M = M + Math.random().toString().slice(2);
    return M;
  }
  const u = c();
  o["Content-Type"] = "multipart/related; boundary=" + u;
  const h = aR(e, r, s),
    f = JA(h, t),
    m = "--" + u + `\r
Content-Type: application/json; charset=utf-8\r
\r
` + f + `\r
--` + u + `\r
Content-Type: ` + h.contentType + `\r
\r
`,
    _ = `\r
--` + u + "--",
    b = zt.getBlob(m, r, _);
  if (b === null) throw IA();
  const V = {
      name: h.fullPath
    },
    N = Ws(i, n.host, n._protocol),
    C = "POST",
    q = n.maxUploadRetryTime,
    U = new qo(N, C, eR(n, t), q);
  return U.urlParams = V, U.headers = o, U.body = b.uploadData(), U.errorHandler = Pu(e), U;
}
class uR {
  constructor() {
    this.sent_ = !1, this.xhr_ = new XMLHttpRequest(), this.initXhr(), this.errorCode_ = bn.NO_ERROR, this.sendPromise_ = new Promise(e => {
      this.xhr_.addEventListener("abort", () => {
        this.errorCode_ = bn.ABORT, e();
      }), this.xhr_.addEventListener("error", () => {
        this.errorCode_ = bn.NETWORK_ERROR, e();
      }), this.xhr_.addEventListener("load", () => {
        e();
      });
    });
  }
  send(e, t, r, s, i) {
    if (this.sent_) throw Jr("cannot .send() more than once");
    if (bt(e) && r && (this.xhr_.withCredentials = !0), this.sent_ = !0, this.xhr_.open(t, e, !0), i !== void 0) for (const o in i) i.hasOwnProperty(o) && this.xhr_.setRequestHeader(o, i[o].toString());
    return s !== void 0 ? this.xhr_.send(s) : this.xhr_.send(), this.sendPromise_;
  }
  getErrorCode() {
    if (!this.sent_) throw Jr("cannot .getErrorCode() before sending");
    return this.errorCode_;
  }
  getStatus() {
    if (!this.sent_) throw Jr("cannot .getStatus() before sending");
    try {
      return this.xhr_.status;
    } catch {
      return -1;
    }
  }
  getResponse() {
    if (!this.sent_) throw Jr("cannot .getResponse() before sending");
    return this.xhr_.response;
  }
  getErrorText() {
    if (!this.sent_) throw Jr("cannot .getErrorText() before sending");
    return this.xhr_.statusText;
  }
  abort() {
    this.xhr_.abort();
  }
  getResponseHeader(e) {
    return this.xhr_.getResponseHeader(e);
  }
  addUploadProgressListener(e) {
    this.xhr_.upload != null && this.xhr_.upload.addEventListener("progress", e);
  }
  removeUploadProgressListener(e) {
    this.xhr_.upload != null && this.xhr_.upload.removeEventListener("progress", e);
  }
}
class lR extends uR {
  initXhr() {
    this.xhr_.responseType = "text";
  }
}
function jo() {
  return new lR();
}
class Ln {
  constructor(e, t) {
    this._service = e, t instanceof Me ? this._location = t : this._location = Me.makeFromUrl(t, e.host);
  }
  toString() {
    return "gs://" + this._location.bucket + "/" + this._location.path;
  }
  _newRef(e, t) {
    return new Ln(e, t);
  }
  get root() {
    const e = new Me(this._location.bucket, "");
    return this._newRef(this._service, e);
  }
  get bucket() {
    return this._location.bucket;
  }
  get fullPath() {
    return this._location.path;
  }
  get name() {
    return Ym(this._location.path);
  }
  get storage() {
    return this._service;
  }
  get parent() {
    const e = $A(this._location.path);
    if (e === null) return null;
    const t = new Me(this._location.bucket, e);
    return new Ln(this._service, t);
  }
  _throwIfRoot(e) {
    if (this._location.path === "") throw wA(e);
  }
}
function hR(n, e, t) {
  n._throwIfRoot("uploadBytes");
  const r = cR(n.storage, n._location, Zm(), new zt(e, !0), t);
  return n.storage.makeRequestWithTokens(r, jo).then(s => ({
    metadata: s,
    ref: n
  }));
}
function dR(n) {
  const e = {
    prefixes: [],
    items: []
  };
  return ng(n, e).then(() => e);
}
async function ng(n, e, t) {
  const s = await fR(n, {
    pageToken: t
  });
  e.prefixes.push(...s.prefixes), e.items.push(...s.items), s.nextPageToken != null && (await ng(n, e, s.nextPageToken));
}
function fR(n, e) {
  e != null && typeof e.maxResults == "number" && pc("options.maxResults", 1, 1e3, e.maxResults);
  const t = e || {},
    r = rR(n.storage, n._location, "/", t.pageToken, t.maxResults);
  return n.storage.makeRequestWithTokens(r, jo);
}
function pR(n) {
  n._throwIfRoot("getDownloadURL");
  const e = sR(n.storage, n._location, Zm());
  return n.storage.makeRequestWithTokens(e, jo).then(t => {
    if (t === null) throw EA();
    return t;
  });
}
function mR(n) {
  n._throwIfRoot("deleteObject");
  const e = iR(n.storage, n._location);
  return n.storage.makeRequestWithTokens(e, jo);
}
function gR(n, e) {
  const t = GA(n._location.path, e),
    r = new Me(n._location.bucket, t);
  return new Ln(n.storage, r);
}
function _R(n) {
  return /^[A-Za-z]+:\/\//.test(n);
}
function yR(n, e) {
  return new Ln(n, e);
}
function rg(n, e) {
  if (n instanceof Su) {
    const t = n;
    if (t._bucket == null) throw yA();
    const r = new Ln(t, t._bucket);
    return e != null ? rg(r, e) : r;
  } else return e !== void 0 ? gR(n, e) : n;
}
function IR(n, e) {
  if (e && _R(e)) {
    if (n instanceof Su) return yR(n, e);
    throw fc("To use ref(service, url), the first argument must be a Storage instance.");
  } else return rg(n, e);
}
function Sd(n, e) {
  const t = e?.[Km];
  return t == null ? null : Me.makeFromBucketSpec(t, n);
}
function ER(n, e, t, r = {}) {
  n.host = `${e}:${t}`;
  const s = bt(e);
  s && (uo(`https://${n.host}/b`), mc("Storage", !0)), n._isUsingEmulator = !0, n._protocol = s ? "https" : "http";
  const {
    mockUserToken: i
  } = r;
  i && (n._overrideAuthToken = typeof i == "string" ? i : Md(i, n.app.options.projectId));
}
class Su {
  constructor(e, t, r, s, i, o = !1) {
    this.app = e, this._authProvider = t, this._appCheckProvider = r, this._url = s, this._firebaseVersion = i, this._isUsingEmulator = o, this._bucket = null, this._host = Gm, this._protocol = "https", this._appId = null, this._deleted = !1, this._maxOperationRetryTime = aA, this._maxUploadRetryTime = cA, this._requests = new Set(), s != null ? this._bucket = Me.makeFromBucketSpec(s, this._host) : this._bucket = Sd(this._host, this.app.options);
  }
  get host() {
    return this._host;
  }
  set host(e) {
    this._host = e, this._url != null ? this._bucket = Me.makeFromBucketSpec(this._url, e) : this._bucket = Sd(e, this.app.options);
  }
  get maxUploadRetryTime() {
    return this._maxUploadRetryTime;
  }
  set maxUploadRetryTime(e) {
    pc("time", 0, Number.POSITIVE_INFINITY, e), this._maxUploadRetryTime = e;
  }
  get maxOperationRetryTime() {
    return this._maxOperationRetryTime;
  }
  set maxOperationRetryTime(e) {
    pc("time", 0, Number.POSITIVE_INFINITY, e), this._maxOperationRetryTime = e;
  }
  async _getAuthToken() {
    if (this._overrideAuthToken) return this._overrideAuthToken;
    const e = this._authProvider.getImmediate({
      optional: !0
    });
    if (e) {
      const t = await e.getToken();
      if (t !== null) return t.accessToken;
    }
    return null;
  }
  async _getAppCheckToken() {
    if (xe(this.app) && this.app.settings.appCheckToken) return this.app.settings.appCheckToken;
    const e = this._appCheckProvider.getImmediate({
      optional: !0
    });
    return e ? (await e.getToken()).token : null;
  }
  _delete() {
    return this._deleted || (this._deleted = !0, this._requests.forEach(e => e.cancel()), this._requests.clear()), Promise.resolve();
  }
  _makeStorageReference(e) {
    return new Ln(this, e);
  }
  _makeRequest(e, t, r, s, i = !0) {
    if (this._deleted) return new vA(Hm());
    {
      const o = xA(e, this._appId, r, s, t, this._firebaseVersion, i, this._isUsingEmulator);
      return this._requests.add(o), o.getPromise().then(() => this._requests.delete(o), () => this._requests.delete(o)), o;
    }
  }
  async makeRequestWithTokens(e, t) {
    const [r, s] = await Promise.all([this._getAuthToken(), this._getAppCheckToken()]);
    return this._makeRequest(e, t, r, s).getPromise();
  }
}
const Cd = "@firebase/storage";
const Vd = "0.14.0";
const sg = "storage";
function JR(n, e, t) {
  return n = se(n), hR(n, e, t);
}
function YR(n) {
  return n = se(n), dR(n);
}
function ZR(n) {
  return n = se(n), pR(n);
}
function eb(n) {
  return n = se(n), mR(n);
}
function tb(n, e) {
  return n = se(n), IR(n, e);
}
function nb(n = cy(), e) {
  n = se(n);
  const r = yc(n, sg).getImmediate({
      identifier: e
    }),
    s = Gg("storage");
  return s && TR(r, ...s), r;
}
function TR(n, e, t, r = {}) {
  ER(n, e, t, r);
}
function wR(n, {
  instanceIdentifier: e
}) {
  const t = n.getProvider("app").getImmediate(),
    r = n.getProvider("auth-internal"),
    s = n.getProvider("app-check-internal");
  return new Su(t, r, s, e, Fn);
}
function vR() {
  Pn(new Xt(sg, wR, "PUBLIC").setMultipleInstances(!0)), ot(Cd, Vd, ""), ot(Cd, Vd, "esm2020");
}
vR();
export { LR as $, Gv as A, qR as B, Xt as C, HR as D, CR as E, BR as F, mt as G, GR as H, NR as I, OR as J, xR as K, MR as L, zR as M, $R as N, tb as O, JR as P, ZR as Q, XR as R, jR as S, ee as T, YR as U, eb as V, _I as W, TI as X, DR as Y, VR as Z, Pn as _, xe as a, Vs as a0, R_ as a1, ft as a2, t_ as a3, Bd as a4, AR as a5, RR as a6, QR as a7, WR as a8, bR as a9, yc as b, se as c, Gg as d, Yy as e, kR as f, cy as g, KR as h, bt as i, ay as j, nb as k, RE as l, La as m, Tf as n, MI as o, uo as p, AI as q, ot as r, SR as s, eI as t, mc as u, FR as v, UR as w, EI as x, pI as y, II as z };
