// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { recoveryEnvironment } from "../config/environment.js";
import { loadModule as S } from "../services/module-loader.js";
import { r as React, L as Link } from "../vendor/vendor-react-BwINE3B3.js";
import {
  s as as,
  t as os,
  v as Ee,
  w as ft,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  emulatorsEnabled,
  firebaseRuntimeState,
  firestoreDb,
  firebaseAuth,
  cloudFunctions,
} from "../firebase/client.js";
import { yt } from "../firebase/functions-sdk.js";
import { Modal } from "../components/Modal.jsx";
// Current esbuild imports resolve their own chunks; legacy preload URLs are retired.
const __vite__mapDeps = () => [];
emulatorsEnabled &&
  !firebaseRuntimeState.__mciFirebaseEmulatorsConnected &&
  (as(firestoreDb, "127.0.0.1", 8080),
  os(firebaseAuth, "http://127.0.0.1:9099"),
  yt(cloudFunctions, "127.0.0.1", 5001),
  (firebaseRuntimeState.__mciFirebaseEmulatorsConnected = !0));
const Vs = (t) => typeof t == "object" && t !== null && t.type === "document";
const rt = (t, s) => {
  t.next?.(s);
};
const Bs = (t) =>
  typeof t == "object" && t !== null && "includeMetadataChanges" in t;
const nt = (t) =>
  typeof t == "object" &&
  t !== null &&
  ("next" in t || "error" in t || "complete" in t);
function onSnapshot(t, ...s) {
  const [r, n, a, l] = s;
  let c, f, h;
  return (
    Bs(r)
      ? typeof n == "function"
        ? ((c = n), (f = a), (h = l))
        : nt(n) && ((c = (p) => rt(n, p)), (f = n.error), (h = n.complete))
      : typeof r == "function"
        ? ((c = r), (f = n), (h = a))
        : nt(r) && ((c = (p) => rt(r, p)), (f = r.error), (h = r.complete)),
    (async () => {
      try {
        if (Vs(t)) {
          const p = await Ee(t);
          c?.(p);
        } else {
          const p = await ft(t);
          c?.(p);
        }
        h?.();
      } catch (p) {
        f?.(p);
      }
    })(),
    () => {}
  );
}
const Ws = async (t) => {};
const Hs = (t) => {};
let Ce = !1;
let _e = null;
let Q = new Set();
let ie = !1;
let vt = 0;
let ke = 0;
let ot = "";
let wt = 0;
let Se = 0;
let Ge = 0;
const Gs = "cem-changefeed-v1";
const he = "cem_changefeed_leader_v1";
const qs = 5e3;
const jt = 15e3;
const Js = 4e3;
const G = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
let J = null;
let q = !1;
let Ne = null;
const te = () => Date.now();
const Ks = (t) => {
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
};
const _t = () => {
  try {
    const t = Ks(window.localStorage.getItem(he));
    if (!t) return null;
    const s = typeof t.id == "string" ? t.id : "",
      r = typeof t.ts == "number" ? t.ts : 0;
    return !s || !Number.isFinite(r)
      ? null
      : {
          id: s,
          ts: r,
        };
  } catch {
    return null;
  }
};
const Re = (t, s) => {
  try {
    window.localStorage.setItem(
      he,
      JSON.stringify({
        id: t,
        ts: s,
      }),
    );
  } catch {}
};
const Zs = () => {
  try {
    const t = _t();
    t && t.id === G && window.localStorage.removeItem(he);
  } catch {}
};
const Ys = (t, s) => (t ? s - t.ts < jt : !1);
const fe = () => {
  Ne !== null && (window.clearInterval(Ne), (Ne = null));
};
const Pe = () => {
  (fe(),
    (Ne = window.setInterval(() => {
      if (!q) return;
      const t = te();
      (Re(G, t),
        J?.postMessage({
          t: "leader",
          leaderId: G,
          at: t,
        }));
    }, qs)));
};
const Fe = () => {
  if (!J) {
    ((q = !0), fe());
    return;
  }
  const t = te(),
    s = _t();
  if (t - (Ge || 0) > jt * 2) {
    ((q = !0),
      Re(G, t),
      J?.postMessage({
        t: "leader",
        leaderId: G,
        at: t,
      }),
      Pe());
    return;
  }
  if (s && s.id === G) {
    ((q = !0), Pe());
    return;
  }
  if (!Ys(s, t)) {
    ((q = !0),
      Re(G, t),
      J?.postMessage({
        t: "leader",
        leaderId: G,
        at: t,
      }),
      Pe());
    return;
  }
  ((q = !1), fe());
};
const me = (t) => {
  const s = te();
  if (!J) {
    (pe(t), ge());
    return;
  }
  if (q) {
    (pe(t), ge());
    return;
  }
  J?.postMessage({
    t: "poke",
    boostMs: t,
    from: G,
    at: s,
  });
};
const kt = (t) => {
  ((ke = 0), (Ge = te()));
  const s = Xs(t);
  if (s && s !== ot) {
    ((ot = s), (wt = te()));
    for (const r of Array.from(Q))
      try {
        r(t);
      } catch {}
  }
};
const Xs = (t) => {
  const s = typeof t.rev == "number" ? t.rev : 0,
    r = typeof t.updatedAtMs == "number" ? t.updatedAtMs : 0;
  return `${s}|${r}`;
};
const it = () => {
  const t = Date.now();
  if (t < Se) return 5e3;
  const s = t - (wt || t);
  return s < 6e4 ? 8e3 : s < 5 * 6e4 ? 2e4 : 6e4;
};
const qe = () => {
  _e !== null && (window.clearTimeout(_e), (_e = null));
};
const ee = (t) => {
  (qe(),
    (_e = window.setTimeout(() => {
      ge();
    }, t)));
};
const lt = () =>
  !(
    !isBffEnabled() ||
    Q.size === 0 ||
    document.visibilityState !== "visible" ||
    (typeof navigator < "u" && navigator && navigator.onLine === !1)
  );
const Qs = async () => {
  try {
    const t = `__t=${Date.now().toString(36)}`,
      s = await bffFetch(`/api/changes/meta?${t}`, {
        method: "GET",
        cache: "no-store",
        timeoutMs: 8e3,
      });
    return !s || s.ok !== !0 ? null : s;
  } catch {
    return null;
  }
};
const ge = async () => {
  if (!Ce) return;
  if ((Fe(), !q)) {
    lt() ? ee(Js) : ee(15e3);
    return;
  }
  if (ie) return;
  if (((ie = !0), (vt = Date.now()), !lt())) {
    ((ie = !1), ee(15e3));
    return;
  }
  const t = await Qs();
  if (!t) {
    ((ke = Math.min(6, ke + 1)),
      (ie = !1),
      ee(Math.min(12e4, it() * (1 + ke))));
    return;
  }
  ((Ge = te()),
    kt(t),
    J?.postMessage({
      t: "meta",
      meta: t,
      from: G,
      at: te(),
    }),
    (ie = !1),
    ee(it()));
};
const er = () => {
  if (Ce) return;
  if (((Ce = !0), typeof BroadcastChannel < "u"))
    try {
      ((J = new BroadcastChannel(Gs)),
        (J.onmessage = (n) => {
          const a = n.data;
          if (!(!a || typeof a != "object")) {
            if (a.t === "meta") {
              if (a.from === G) return;
              kt(a.meta);
            }
            if (a.t === "poke") {
              if (!q || a.from === G) return;
              (pe(Math.max(0, a.boostMs)), ge());
            }
            if (a.t === "leader") {
              if (a.leaderId === G) return;
              const l = te();
              (Re(a.leaderId, l), q && ((q = !1), fe()));
            }
          }
        }));
    } catch {
      J = null;
    }
  if ((Fe(), !J))
    try {
      window.localStorage.removeItem(he);
    } catch {}
  (window.addEventListener("beforeunload", () => {
    (q && Zs(), fe());
    try {
      J?.close();
    } catch {}
  }),
    window.addEventListener("storage", (n) => {
      n.key === he && Fe();
    }));
  const t = () => {
      Q.size !== 0 && me(1e4);
    },
    s = () => {
      if (document.visibilityState === "visible") {
        if (Q.size === 0) return;
        me(1e4);
      }
    },
    r = () => {
      Q.size !== 0 && me(15e3);
    };
  (window.addEventListener("focus", t),
    document.addEventListener("visibilitychange", s),
    window.addEventListener("online", r),
    ee(500));
};
const pe = (t) => {
  const s = Date.now(),
    r = Math.max(0, Number.isFinite(t) ? t : 0);
  Se = Math.max(Se, s + r);
};
const tr = () => {
  !Ce || Q.size === 0 || (pe(5e3), me(5e3), q && !ie && (qe(), ge()));
};
const sr = (t) => (
  er(),
  Q.add(t),
  Date.now() - vt > 5e3 && (me(8e3), ee(800)),
  () => {
    (Q.delete(t), Q.size === 0 && ((Se = 0), qe(), ee(1e4)));
  }
);
const Nt = recoveryEnvironment.flags;
class BffError extends Error {
  status;
  data;
  url;
  constructor(s, r, n) {
    (super(`BFF ${r}`),
      (this.name = "BffError"),
      (this.url = s),
      (this.status = r),
      (this.data = n));
  }
}
const we = new Map();
let ze = null;
const Y = (t) => {
  ze = t;
};
const isBffEnabled = () => Nt?.VITE_ENABLE_BFF === "1";
const isStrictBffAuth = () => Nt?.VITE_BFF_STRICT_AUTH === "1";
const isHybridAuthEnabled = () => !0;
const bffFetch = async (t, s) => {
  const r = new Headers(s?.headers || void 0),
    n = s?.cache,
    a = n === "no-store" || n === "no-cache" || s?.bypassCache === !0;
  a && (r.has("Cache-Control") || r.set("Cache-Control", "no-store"));
  try {
    const y = localStorage.getItem("pwa_app_version");
    y && !r.has("x-app-version") && r.set("x-app-version", y);
  } catch {}
  try {
    r.has("x-app-path") || r.set("x-app-path", window.location.pathname);
  } catch {}
  s?.json !== void 0 && r.set("Content-Type", "application/json");
  const l = (s?.method || "GET").toUpperCase();
  l !== "GET" &&
    l !== "HEAD" &&
    l !== "OPTIONS" &&
    ze &&
    r.set("x-xsrf-token", ze);
  const c = l === "GET" || l === "HEAD",
    f = `${l}:${t}`;
  let h = t;
  if (a && c) {
    we.delete(f);
    const y = `__t=${Date.now().toString(36)}`;
    h = t.includes("?") ? `${t}&${y}` : `${t}?${y}`;
  }
  const b =
      typeof s?.timeoutMs == "number" && Number.isFinite(s.timeoutMs)
        ? Math.max(0, s.timeoutMs)
        : 3e4,
    p = s?.signal ? null : new AbortController(),
    u = s?.signal ?? p?.signal,
    E = p && b > 0 ? setTimeout(() => p.abort(), b) : null;
  let v;
  try {
    v = await fetch(h, {
      ...s,
      headers: r,
      credentials: "include",
      signal: u,
      body: s?.json !== void 0 ? JSON.stringify(s.json) : s?.body,
    });
  } finally {
    E && clearTimeout(E);
  }
  if (v.status === 304 && c) {
    const y = we.get(f);
    if (y) return y.data;
    const L = `__bff_bust=${Date.now().toString(36)}`,
      T = t.includes("?") ? `${t}&${L}` : `${t}?${L}`,
      A = await fetch(T, {
        ...s,
        headers: r,
        credentials: "include",
        body: s?.json !== void 0 ? JSON.stringify(s.json) : s?.body,
        cache: "no-store",
      }),
      N = await A.text(),
      I = N ? JSON.parse(N) : {};
    if (!A.ok) throw new Error(`BFF ${A.status}`);
    const i = A.headers.get("etag");
    return (
      we.set(f, {
        etag: i,
        data: I,
      }),
      I
    );
  }
  const _ = await v.text();
  let k = {};
  if (_)
    try {
      k = JSON.parse(_);
    } catch {
      k = {
        raw: _,
      };
    }
  if (!v.ok) throw new BffError(t, v.status, k);
  if (c) {
    const y = v.headers.get("etag");
    we.set(f, {
      etag: y,
      data: k,
    });
  } else
    try {
      tr();
    } catch (y) {
      console.warn("[bffFetch] ⚠️ pokeChangeFeed() falló:", y);
    }
  return k;
};
const Te = "church_app_user_cache";
const mr = (t, s) => {
  const r = String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, "")
      .slice(0, 50),
    n = t?.resources?.[r];
  return typeof n == "number" ? n : 0;
};
const useChangeFeed = (t) => {
  const s = !!t.enabled,
    r = Array.isArray(t.resources) ? t.resources : [],
    n = t.onChange,
    a =
      typeof t.debounceMs == "number" && Number.isFinite(t.debounceMs)
        ? Math.max(0, t.debounceMs)
        : 1e3,
    l = React.useRef({}),
    c = React.useRef(null);
  return (
    React.useEffect(() => {
      if (!s || !r.length) return;
      let h = !0;
      const b = () => {
          (c.current !== null && window.clearTimeout(c.current),
            (c.current = window.setTimeout(() => {
              c.current = null;
              try {
                n();
              } catch {}
            }, a)));
        },
        p = sr((u) => {
          let E = !1;
          for (const v of r) {
            const _ = mr(u, v),
              k = l.current[v];
            if (typeof k != "number") {
              ((l.current[v] = _), h && (E = !0));
              continue;
            }
            _ > k && ((l.current[v] = _), (E = !0));
          }
          ((h = !1), E && b());
        });
      return () => {
        (p(),
          c.current !== null &&
            (window.clearTimeout(c.current), (c.current = null)));
      };
    }, [s, a, r.join("|")]),
    {
      boost: (h = 1e4) => pe(h),
    }
  );
};
const _r = React.lazy(() =>
  S(
    () => import("../components/NotificationsAutoRegister.jsx"),
    __vite__mapDeps([0, 1, 2, 3, 4, 5, 6]),
  ).then((t) => ({
    default: t.NotificationsAutoRegister,
  })),
);
const Lt = React.memo(({ item: t, isActive: s, onClick: r, onPrefetch: n }) => {
  const RenderComponent1 = t.icon;
  return (
    <Link
      to={t.path}
      onClick={r}
      onMouseEnter={n}
      onFocus={n}
      onTouchStart={n}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${s ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"}`}
    >
      {[<RenderComponent1 size={20} />, <span>{t.label}</span>]}
    </Link>
  );
});
Lt.displayName = "MenuItem";
Modal.displayName = "Modal";
export {
  __vite__mapDeps,
  Vs,
  rt,
  Bs,
  nt,
  onSnapshot,
  Ws,
  Hs,
  Ce,
  _e,
  Q,
  ie,
  vt,
  ke,
  ot,
  wt,
  Se,
  Ge,
  Gs,
  he,
  qs,
  jt,
  Js,
  G,
  J,
  q,
  Ne,
  te,
  Ks,
  _t,
  Re,
  Zs,
  Ys,
  fe,
  Pe,
  Fe,
  me,
  kt,
  Xs,
  it,
  qe,
  ee,
  lt,
  Qs,
  ge,
  er,
  pe,
  tr,
  sr,
  Nt,
  BffError,
  we,
  ze,
  Y,
  isBffEnabled,
  isStrictBffAuth,
  isHybridAuthEnabled,
  bffFetch,
  Te,
  mr,
  useChangeFeed,
  _r,
  Lt,
};
