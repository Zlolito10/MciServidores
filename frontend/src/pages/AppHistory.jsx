// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  u as useNavigate,
  r as React,
} from "../vendor/vendor-react-BwINE3B3.js";
import { useAuth, isBffEnabled, bffFetch, BffError } from "../app/App.jsx";
import {
  an as ShieldAlertIcon,
  H as HistoryIcon,
  ae as RefreshCwIcon,
  F as ChevronUpIcon,
  x as ChevronDownIcon,
  ao as ActivityIcon,
  w as SearchIcon,
  s as ClockIcon,
  f as UsersIcon,
  D as BellIcon,
  ap as MessageSquareIcon,
  d as CalendarIcon,
  U as UserIcon,
  aq as ClipboardCheckIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import "../vendor/vendor-firebase-BjYbfC3F.js";
const U = (n) => {
  try {
    if (!n) return null;
    if (n instanceof Date) return n;
    if (typeof n == "number" && Number.isFinite(n)) return new Date(n);
    if (typeof n == "string") {
      const m = new Date(n);
      return Number.isFinite(m.getTime()) ? m : null;
    }
    if (typeof n?.toDate == "function") return n.toDate();
    const a =
      typeof n?.seconds == "number"
        ? n.seconds
        : typeof n?._seconds == "number"
          ? n._seconds
          : null;
    return typeof a == "number" && Number.isFinite(a)
      ? new Date(a * 1e3)
      : null;
  } catch {
    return null;
  }
};
const Le = (n) => {
  const a = U(n);
  return a ? a.toLocaleString() : "(sin fecha)";
};
const Re = (n) => {
  const a = U(n);
  if (!a) return "";
  const m = Date.now() - a.getTime();
  if (!Number.isFinite(m)) return "";
  const c = Math.abs(m),
    i = m >= 0 ? "hace" : "en",
    k = Math.round(c / 6e4);
  if (k <= 1) return `${i} 1 min`;
  if (k < 60) return `${i} ${k} min`;
  const y = Math.round(k / 60);
  if (y <= 1) return `${i} 1 h`;
  if (y < 48) return `${i} ${y} h`;
  const N = Math.round(y / 24);
  return `${i} ${N} d`;
};
const C = (n) => {
  const a = typeof n == "number" && Number.isFinite(n) ? n : 0;
  if (a <= 0) return "0 B";
  const m = ["B", "KB", "MB", "GB"];
  let c = 0,
    i = a;
  for (; i >= 1024 && c < m.length - 1; ) ((i /= 1024), (c += 1));
  const k = c === 0 ? 0 : i < 10 ? 1 : 0;
  return `${i.toFixed(k)} ${m[c]}`;
};
const xt = (n) => {
  const a = String(n || "").trim();
  return a ? (a.length <= 10 ? a : `${a.slice(0, 6)}…${a.slice(-3)}`) : "";
};
const Me = (n) => {
  const a = String(n || "").trim();
  if (!a) return "?";
  const c = a.includes("@") ? a.split("@")[0] : a,
    i = c
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  return i.length === 0
    ? c.slice(0, 2).toUpperCase()
    : i.length === 1
      ? i[0].slice(0, 2).toUpperCase()
      : `${i[0].slice(0, 1)}${i[1].slice(0, 1)}`.toUpperCase();
};
const De = (n) => {
  let a = 0;
  for (let m = 0; m < n.length; m++) a = (a * 31 + n.charCodeAt(m)) % 360;
  return a;
};
const mt = (n) => {
  const a = String(n || "").toUpperCase();
  return a === "POST"
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-900/40"
    : a === "PATCH" || a === "PUT"
      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200 border-indigo-200/60 dark:border-indigo-900/40"
      : a === "DELETE"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200 border-rose-200/60 dark:border-rose-900/40"
        : "bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-200 border-slate-200/60 dark:border-slate-900/40";
};
const ut = (n) =>
  typeof n != "number"
    ? "bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-200 border-slate-200/60 dark:border-slate-900/40"
    : n >= 200 && n < 300
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-900/40"
      : n >= 300 && n < 400
        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200 border-amber-200/60 dark:border-amber-900/40"
        : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200 border-rose-200/60 dark:border-rose-900/40";
const gt = (n) => {
  const a = String(n || "");
  return a === "master_admin"
    ? {
        label: "Master Admin",
        cls: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-200 border-purple-200/60 dark:border-purple-900/40",
      }
    : a
      ? {
          label: a,
          cls: "bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-200 border-slate-200/60 dark:border-slate-900/40",
        }
      : {
          label: "",
          cls: "bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-200 border-slate-200/60 dark:border-slate-900/40",
        };
};
const h =
  "inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 bg-white/70 dark:bg-slate-900/30 border-gray-200/70 dark:border-slate-700/70 text-gray-700 dark:text-slate-200";
const de =
  "inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/30 text-sm text-gray-900 dark:text-white hover:bg-white dark:hover:bg-slate-900/50";
const j =
  "inline-flex items-center px-2.5 py-1 rounded-xl border text-xs font-semibold";
const z = (n) => {
  const a = U(n);
  return a ? a.getTime() : 0;
};
const bt = (n) => {
  const a = String(n.actionCode || "").toLowerCase(),
    m = String(n.path || "").toLowerCase();
  return a.startsWith("notify.") || m.includes("/api/notify")
    ? BellIcon
    : a.startsWith("notifications.")
      ? BellIcon
      : a.startsWith("comments.")
        ? MessageSquareIcon
        : a.startsWith("events.")
          ? CalendarIcon
          : a.startsWith("users.")
            ? UserIcon
            : a.startsWith("attendance.")
              ? ClipboardCheckIcon
              : ActivityIcon;
};
const ht = (n) => {
  const a = [];
  for (const c of n) {
    const i = z(c.createdAt),
      k = [
        c.actionCode || "",
        c.method || "",
        c.path || "",
        c.email || c.uid || "",
        String(c.status ?? ""),
      ].join("|"),
      y = a[a.length - 1];
    if (y) {
      const N = z(y.primary.createdAt);
      if (y.key === k && Math.abs(N - i) <= 6e4) {
        ((y.count += 1), i > N && (y.primary = c));
        continue;
      }
    }
    a.push({
      key: k,
      primary: c,
      count: 1,
    });
  }
  return a;
};
const AppHistory = () => {
  const { userProfile: n } = useAuth(),
    a = useNavigate(),
    m = "cem_app_history_mobile_tab_v1",
    c = "cem_app_history_insights_open_v1",
    i = n?.role === "master_admin",
    [k, y] = React.useState(!1),
    [N, ie] = React.useState(""),
    [oe, Ie] = React.useState([]),
    [B, Te] = React.useState([]),
    [Fe, _e] = React.useState({}),
    [P, ze] = React.useState({}),
    [ce, Ue] = React.useState([]),
    [xe, Be] = React.useState([]),
    [u, Pe] = React.useState(null),
    O = React.useRef(!1),
    q = React.useRef(0),
    K = React.useRef(!1),
    H = React.useRef(0),
    [G, Oe] = React.useState(""),
    [E, qe] = React.useState(!0),
    [D, me] = React.useState("desc"),
    [I, Ke] = React.useState(() => {
      try {
        const t = localStorage.getItem(c);
        return t === "1";
      } catch {
        return !1;
      }
    }),
    [W, He] = React.useState(!1),
    [$, ue] = React.useState(() => {
      try {
        const t = localStorage.getItem(m);
        return t === "activity" || t === "users" ? t : "users";
      } catch {
        return "users";
      }
    }),
    [L, ge] = React.useState("all"),
    [w, V] = React.useState("all"),
    [Ge, We] = React.useState(null),
    Q = React.useRef(!1),
    Y = React.useRef(!1),
    Z = React.useRef(""),
    J = React.useRef(0),
    directoryFetchedAt = React.useRef(0),
    g = isBffEnabled(),
    X = React.useRef(!1),
    be = React.useRef(0),
    he = async () => {
      if (!i || !g || document.visibilityState !== "visible") return;
      const t = Date.now();
      if (!(t - be.current < 6e4) && !X.current) {
        X.current = !0;
        try {
          const r = `/api/admin/telemetry/latest?limitUsers=80&${`__t=${Date.now().toString(36)}`}`,
            l = await bffFetch(r, {
              method: "GET",
              cache: "no-store",
              timeoutMs: 1e4,
            }),
            o = Array.isArray(l.items) ? l.items : [],
            x = {};
          for (const b of o) {
            const p = String(b?.userId || "");
            p && (x[p] = b);
          }
          (_e(x), (be.current = t));
        } catch {
        } finally {
          X.current = !1;
        }
      }
    };
  (React.useEffect(() => {
    try {
      localStorage.setItem(m, $);
    } catch {}
  }, [$]),
    React.useEffect(() => {
      try {
        localStorage.setItem(c, I ? "1" : "0");
      } catch {}
    }, [I]));
  const ee = React.useRef(!1),
    pe = React.useRef(0),
    fe = async () => {
      if (!i || !g || document.visibilityState !== "visible") return;
      const t = Date.now();
      if (!(t - pe.current < 6e4) && !ee.current) {
        ee.current = !0;
        try {
          const r = `/api/admin/telemetry/daily?days=7&limit=3000&${`__t=${Date.now().toString(36)}`}`,
            l = await bffFetch(r, {
              method: "GET",
              cache: "no-store",
              timeoutMs: 12e3,
            }),
            o = Array.isArray(l.items) ? l.items : [],
            x = {};
          for (const b of o) {
            const p = String(b?.userId || ""),
              f = String(b?.day || "");
            !p || !f || (x[p] || (x[p] = {}), (x[p][f] = b));
          }
          (ze(x), (pe.current = t));
        } catch {
        } finally {
          ee.current = !1;
        }
      }
    },
    ye = async () => {
      if (!i || !g || document.visibilityState !== "visible") return;
      const t = Date.now();
      if (!(t - q.current < 6e4) && !O.current) {
        O.current = !0;
        try {
          const s = new Date().toISOString().slice(0, 10),
            r = `__t=${Date.now().toString(36)}`,
            [l, o] = await Promise.all([
              bffFetch(
                `/api/admin/telemetry/daily/routes?day=${encodeURIComponent(s)}&type=api&limit=5&${r}`,
                {
                  method: "GET",
                  cache: "no-store",
                  timeoutMs: 12e3,
                },
              ),
              bffFetch(
                `/api/admin/telemetry/daily/routes?day=${encodeURIComponent(s)}&type=asset&limit=5&${r}`,
                {
                  method: "GET",
                  cache: "no-store",
                  timeoutMs: 12e3,
                },
              ),
            ]);
          (Ue(Array.isArray(l.items) ? l.items : []),
            Be(Array.isArray(o.items) ? o.items : []),
            (q.current = t));
        } catch {
          q.current = t + 5 * 6e4;
        } finally {
          O.current = !1;
        }
      }
    },
    ke = async () => {
      if (!i || !g || document.visibilityState !== "visible") return;
      const t = Date.now();
      if (!(t - H.current < 6e4) && !K.current) {
        K.current = !0;
        try {
          const r = `/api/admin/firestore-reads?hours=24&${`__t=${Date.now().toString(36)}`}`,
            l = await bffFetch(r, {
              method: "GET",
              cache: "no-store",
              timeoutMs: 15e3,
            });
          (l.ok && Pe(l), (H.current = t));
        } catch {
          H.current = t + 5 * 6e4;
        } finally {
          K.current = !1;
        }
      }
    },
    R = async (t) => {
      if (Q.current) return;
      Q.current = !0;
      const s = t?.showLoading !== !1;
      (s && y(!0), ie(""));
      try {
        const includeUsers = Date.now() - directoryFetchedAt.current > 5 * 6e4;
        const l = `/api/admin/app-history?limit=200&includeUsers=${includeUsers ? 1 : 0}&${`__t=${Date.now().toString(36)}`}`,
          o = await bffFetch(l, {
            method: "GET",
            cache: "no-store",
            timeoutMs: 15e3,
          });
        Ie(Array.isArray(o.logs) ? o.logs : []);
        if (Array.isArray(o.users)) {
          Te(o.users);
          directoryFetchedAt.current = Date.now();
        }
        J.current = Date.now();
      } catch (r) {
        const l =
          r instanceof BffError
            ? r?.data?.error || `Error (status ${r.status})`
            : r?.message;
        ie(l || "No se pudo cargar el historial.");
      } finally {
        (s && y(!1), (Q.current = !1));
      }
    },
    Ve = async () => {
      if (Y.current) return null;
      Y.current = !0;
      try {
        const s = `/api/admin/app-history/meta?${`__t=${Date.now().toString(36)}`}`,
          r = await bffFetch(s, {
            method: "GET",
            cache: "no-store",
            timeoutMs: 8e3,
          });
        return !r || r.ok !== !0 ? null : r;
      } catch {
        return null;
      } finally {
        Y.current = !1;
      }
    },
    Qe = (t) => `${t.latestLogMs}|${t.latestUsersMs}`;
  (React.useEffect(() => {
    i &&
      g &&
      (R({
        showLoading: !0,
      }),
      he(),
      fe(),
      ye(),
      ke());
  }, [i, g]),
    React.useEffect(() => {
      if (!i || !g || document.visibilityState !== "visible") return;
      const t = () => void he(),
        s = window.setInterval(t, 2 * 6e4);
      return (
        window.addEventListener("focus", t),
        () => {
          (window.clearInterval(s), window.removeEventListener("focus", t));
        }
      );
    }, [i, g]),
    React.useEffect(() => {
      if (!i || !g || document.visibilityState !== "visible") return;
      const t = () => void fe(),
        s = window.setInterval(t, 5 * 6e4);
      return (
        window.addEventListener("focus", t),
        () => {
          (window.clearInterval(s), window.removeEventListener("focus", t));
        }
      );
    }, [i, g]),
    React.useEffect(() => {
      if (!i || !g || document.visibilityState !== "visible") return;
      const t = () => void ye(),
        s = window.setInterval(t, 5 * 6e4);
      return (
        window.addEventListener("focus", t),
        () => {
          (window.clearInterval(s), window.removeEventListener("focus", t));
        }
      );
    }, [i, g]),
    React.useEffect(() => {
      if (!i || !g || document.visibilityState !== "visible") return;
      const t = () => void ke(),
        s = window.setInterval(t, 5 * 6e4);
      return (
        window.addEventListener("focus", t),
        () => {
          (window.clearInterval(s), window.removeEventListener("focus", t));
        }
      );
    }, [i, g]),
    React.useEffect(() => {
      if (!i || !g || !E) return;
      const t = 3e4,
        s = 300 * 1e3,
        r = async () => {
          if (document.visibilityState !== "visible") return;
          const b = await Ve(),
            p = Date.now();
          if (!b) {
            p - J.current > s &&
              R({
                showLoading: !1,
              });
            return;
          }
          const f = Qe(b),
            M = Z.current,
            re = p - J.current > s;
          if (!M) {
            Z.current = f;
            return;
          }
          if (f !== M) {
            ((Z.current = f),
              R({
                showLoading: !1,
              }));
            return;
          }
          re &&
            R({
              showLoading: !1,
            });
        },
        l = () => void r(),
        o = () => void r();
      r();
      const x = window.setInterval(() => void r(), t);
      return (
        window.addEventListener("focus", l),
        document.addEventListener("visibilitychange", o),
        () => {
          (window.clearInterval(x),
            window.removeEventListener("focus", l),
            document.removeEventListener("visibilitychange", o));
        }
      );
    }, [i, g, E]));
  const Ye = 300 * 1e3,
    v = React.useMemo(() => {
      const t = B.map((s) => {
        const r = U(s.lastSeenAt),
          l = r ? r.getTime() : 0,
          o = r ? Date.now() - l <= Ye : !1;
        return {
          u: s,
          t: l,
          isOnline: o,
        };
      });
      return (
        t.sort((s, r) =>
          s.isOnline !== r.isOnline ? (s.isOnline ? -1 : 1) : r.t - s.t,
        ),
        t
      );
    }, [B]),
    te = React.useMemo(() => {
      const t = [...oe];
      return (t.sort((s, r) => z(r.createdAt) - z(s.createdAt)), t);
    }, [oe]),
    se = React.useMemo(
      () => (D === "asc" ? [...te].reverse() : te).slice(0, 200),
      [te, D],
    ),
    je = React.useMemo(() => {
      const t = G.trim().toLowerCase(),
        s = se.filter((r) => {
          const l = String(r.method || "").toUpperCase();
          if (L !== "all" && l !== L) return !1;
          if (w !== "all") {
            const o = typeof r.status == "number" ? r.status : 0,
              x = o >= 200 && o < 300;
            if ((w === "ok" && !x) || (w === "other" && x)) return !1;
          }
          return !0;
        });
      return t
        ? s.filter((r) =>
            [
              r.actionLabel,
              r.actionCode,
              r.method,
              r.path,
              r.email,
              r.uid,
              r.appPath,
              r.appVersion,
            ]
              .filter(Boolean)
              .join(" | ")
              .toLowerCase()
              .includes(t),
          )
        : s;
    }, [se, G, L, w]),
    T = React.useMemo(() => ht(je), [je]),
    Ze = React.useMemo(() => v.filter((t) => t.isOnline).length, [v]),
    Ne = React.useMemo(() => {
      const t = new Date().toISOString().slice(0, 10);
      return v
        .map(({ u: r }) => {
          const l = P[r.uid]?.[t],
            o = typeof l?.transferSize == "number" ? l.transferSize : 0,
            x = typeof l?.requestCount == "number" ? l.requestCount : 0,
            b = typeof l?.metaCount == "number" ? l.metaCount : 0;
          return {
            uid: r.uid,
            name: r.name || r.email || r.uid,
            email: r.email || null,
            bytes: o,
            reqs: x,
            meta: b,
          };
        })
        .filter((r) => r.bytes > 0)
        .sort((r, l) => l.bytes - r.bytes)
        .slice(0, 5);
    }, [v, P]);
  return i ? (
    g ? (
      <div className="space-y-6 max-w-6xl mx-auto">
        {[
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
            {[
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {[
                  <div className="flex items-center gap-3">
                    {[
                      <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl">
                        <HistoryIcon size={20} />
                      </div>,
                      <div>
                        {[
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {"Historial de la aplicación"}
                          </h1>,
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {
                              "Vista de control (Master Admin): quién está en línea + feed de actividad"
                            }
                          </p>,
                        ]}
                      </div>,
                    ]}
                  </div>,
                  <button
                    type="button"
                    onClick={() =>
                      void R({
                        showLoading: !0,
                      })
                    }
                    disabled={k}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {[
                      <RefreshCwIcon
                        size={18}
                        className={k ? "animate-spin" : ""}
                      />,
                      "Actualizar",
                    ]}
                  </button>,
                ]}
              </div>,
              N && (
                <div className="mt-4 p-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300">
                  {N}
                </div>
              ),
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 p-4">
                    {[
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {"En línea"}
                      </p>,
                      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {Ze}
                      </p>,
                    ]}
                  </div>,
                  <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 p-4">
                    {[
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {"Usuarios recientes"}
                      </p>,
                      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {v.length}
                      </p>,
                    ]}
                  </div>,
                  <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 p-4">
                    {[
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {"Acciones recientes"}
                      </p>,
                      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {T.length}
                      </p>,
                    ]}
                  </div>,
                ]}
              </div>,
              <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                {[
                  <button
                    type="button"
                    onClick={() => Ke((t) => !t)}
                    className={de}
                  >
                    {[
                      I ? (
                        <ChevronUpIcon size={16} />
                      ) : (
                        <ChevronDownIcon size={16} />
                      ),
                      "Consumo y rankings",
                    ]}
                  </button>,
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {"Top usuarios y rutas (hoy)"}
                  </p>,
                ]}
              </div>,
              I ? (
                <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {[
                    <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-white/70 dark:bg-slate-900/20 p-4">
                      {[
                        <div className="flex items-center gap-2">
                          {[
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl">
                              <ActivityIcon size={16} />
                            </div>,
                            <div>
                              {[
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  {"Top usuarios (hoy)"}
                                </p>,
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                  {"Bytes descargados + requests (same-origin)"}
                                </p>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        Ne.length === 0 ? (
                          <div className="mt-3 text-sm text-gray-500 dark:text-slate-400">
                            {"Sin datos aún."}
                          </div>
                        ) : (
                          <div className="mt-3 space-y-2">
                            {Ne.map((t) =>
                              jsxRuntime.jsxs(
                                "div",
                                {
                                  className:
                                    "flex items-center justify-between gap-3",
                                  children: [
                                    <div className="min-w-0">
                                      {[
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                          {t.name}
                                        </div>,
                                        t.email ? (
                                          <div className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                            {t.email}
                                          </div>
                                        ) : null,
                                      ]}
                                    </div>,
                                    <div className="flex flex-wrap gap-2 justify-end shrink-0">
                                      {[
                                        <span className={h}>{C(t.bytes)}</span>,
                                        <span className={h}>
                                          {[t.reqs, " req"]}
                                        </span>,
                                        t.meta > 0 ? (
                                          <span className={h}>
                                            {[t.meta, " meta"]}
                                          </span>
                                        ) : null,
                                      ]}
                                    </div>,
                                  ],
                                },
                                t.uid,
                              ),
                            )}
                          </div>
                        ),
                      ]}
                    </div>,
                    <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-white/70 dark:bg-slate-900/20 p-4">
                      {[
                        <div className="flex items-center gap-2">
                          {[
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl">
                              <HistoryIcon size={16} />
                            </div>,
                            <div>
                              {[
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  {"Top rutas (hoy)"}
                                </p>,
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                  {"Agregado global (API + assets)"}
                                </p>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            <div>
                              {[
                                <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">
                                  {"API"}
                                </p>,
                                ce.length === 0 ? (
                                  <div className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                                    {"Sin datos."}
                                  </div>
                                ) : (
                                  <div className="mt-2 space-y-2">
                                    {ce.map((t) =>
                                      jsxRuntime.jsxs(
                                        "div",
                                        {
                                          className:
                                            "flex items-center justify-between gap-2",
                                          children: [
                                            <div className="text-xs text-gray-700 dark:text-slate-200 truncate">
                                              {t.path}
                                            </div>,
                                            <div className="flex gap-2 shrink-0">
                                              <span className={h}>
                                                {C(
                                                  typeof t.bytes == "number"
                                                    ? t.bytes
                                                    : 0,
                                                )}
                                              </span>
                                            </div>,
                                          ],
                                        },
                                        t.path,
                                      ),
                                    )}
                                  </div>
                                ),
                              ]}
                            </div>,
                            <div>
                              {[
                                <p className="text-xs font-semibold text-gray-700 dark:text-slate-200">
                                  {"Assets"}
                                </p>,
                                xe.length === 0 ? (
                                  <div className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                                    {"Sin datos."}
                                  </div>
                                ) : (
                                  <div className="mt-2 space-y-2">
                                    {xe.map((t) =>
                                      jsxRuntime.jsxs(
                                        "div",
                                        {
                                          className:
                                            "flex items-center justify-between gap-2",
                                          children: [
                                            <div className="text-xs text-gray-700 dark:text-slate-200 truncate">
                                              {t.path}
                                            </div>,
                                            <div className="flex gap-2 shrink-0">
                                              <span className={h}>
                                                {C(
                                                  typeof t.bytes == "number"
                                                    ? t.bytes
                                                    : 0,
                                                )}
                                              </span>
                                            </div>,
                                          ],
                                        },
                                        t.path,
                                      ),
                                    )}
                                  </div>
                                ),
                              ]}
                            </div>,
                          ]}
                        </div>,
                      ]}
                    </div>,
                    <div className="lg:col-span-2 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/10 p-4">
                      {[
                        <div className="flex items-center gap-2 mb-3">
                          {[
                            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl">
                              <ShieldAlertIcon size={16} />
                            </div>,
                            <div>
                              {[
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  {
                                    "⚡ Consumo de Firestore (Lecturas en Tiempo Real)"
                                  }
                                </p>,
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                  {[
                                    "Datos reales de las últimas",
                                    " ",
                                    u?.hoursAnalyzed || 24,
                                    " horas",
                                  ]}
                                </p>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        u ? (
                          <div className="space-y-3">
                            {[
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                                    {[
                                      <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase">
                                        {"Total Lecturas"}
                                      </p>,
                                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {u.totalReads.toLocaleString()}
                                      </p>,
                                    ]}
                                  </div>,
                                  <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                                    {[
                                      <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase">
                                        {"Reads/Hora"}
                                      </p>,
                                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                        {u.readsPerHour.toLocaleString()}
                                      </p>,
                                    ]}
                                  </div>,
                                  <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                                    {[
                                      <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase">
                                        {"Proyección Diaria"}
                                      </p>,
                                      <p
                                        className={`text-lg font-bold ${u.projectedDaily > 4e4 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                                      >
                                        {u.projectedDaily.toLocaleString()}
                                      </p>,
                                    ]}
                                  </div>,
                                  <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                                    {[
                                      <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase">
                                        {"Total Requests"}
                                      </p>,
                                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {u.totalRequests.toLocaleString()}
                                      </p>,
                                    ]}
                                  </div>,
                                ]}
                              </div>,
                              <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                                {[
                                  <div className="flex justify-between text-xs mb-1">
                                    {[
                                      <span className="text-gray-600 dark:text-slate-400">
                                        {"Uso del límite diario (50,000)"}
                                      </span>,
                                      <span
                                        className={`font-bold ${u.projectedDaily > 4e4 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                                      >
                                        {[
                                          Math.min(
                                            100,
                                            Math.round(
                                              (u.projectedDaily / 5e4) * 100,
                                            ),
                                          ),
                                          "%",
                                        ]}
                                      </span>,
                                    ]}
                                  </div>,
                                  <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full transition-all ${u.projectedDaily > 4e4 ? "bg-red-500" : u.projectedDaily > 25e3 ? "bg-amber-500" : "bg-green-500"}`}
                                      style={{
                                        width: `${Math.min(100, (u.projectedDaily / 5e4) * 100)}%`,
                                      }}
                                    />
                                  </div>,
                                ]}
                              </div>,
                              u.byPage && u.byPage.length > 0 && (
                                <div>
                                  {[
                                    <p className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                                      {
                                        "📱 Consumo por Página (¿Qué genera más lecturas?)"
                                      }
                                    </p>,
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                                      {u.byPage.map((t, s) =>
                                        jsxRuntime.jsxs(
                                          "div",
                                          {
                                            className: `p-2 rounded-lg border ${s === 0 ? "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800" : s === 1 ? "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800" : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"}`,
                                            children: [
                                              <p
                                                className={`font-bold ${s === 0 ? "text-red-700 dark:text-red-300" : s === 1 ? "text-orange-700 dark:text-orange-300" : "text-gray-700 dark:text-slate-300"}`}
                                              >
                                                {t.page}
                                              </p>,
                                              <p
                                                className={`text-sm font-semibold ${s === 0 ? "text-red-600 dark:text-red-400" : s === 1 ? "text-orange-600 dark:text-orange-400" : "text-gray-600 dark:text-slate-400"}`}
                                              >
                                                {[
                                                  t.reads.toLocaleString(),
                                                  " reads",
                                                ]}
                                              </p>,
                                              <p className="text-gray-500 dark:text-slate-500 text-[10px]">
                                                {[t.requests, " requests"]}
                                              </p>,
                                            ],
                                          },
                                          t.page,
                                        ),
                                      )}
                                    </div>,
                                  ]}
                                </div>
                              ),
                              <div>
                                {[
                                  <p className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                                    {
                                      "📊 Top Endpoints (¿Qué operaciones consumen más?)"
                                    }
                                  </p>,
                                  <div className="space-y-1.5 text-xs">
                                    {u.byEndpoint.slice(0, 8).map((t, s) =>
                                      jsxRuntime.jsx(
                                        "div",
                                        {
                                          className: `p-2 rounded-lg ${s < 2 ? "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30" : s < 4 ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30" : "bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30"}`,
                                          children: (
                                            <div className="flex justify-between items-start">
                                              {[
                                                <div className="flex-1 mr-2">
                                                  {[
                                                    <span className="font-bold text-gray-800 dark:text-slate-200">
                                                      {t.description ||
                                                        t.path.replace(
                                                          "/api/",
                                                          "",
                                                        )}
                                                    </span>,
                                                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-gray-600 dark:text-slate-400">
                                                      {t.page}
                                                    </span>,
                                                    <p className="text-[10px] text-gray-500 dark:text-slate-500 mt-0.5">
                                                      {[
                                                        "💡 ",
                                                        t.cause ||
                                                          "Lectura de datos",
                                                      ]}
                                                    </p>,
                                                  ]}
                                                </div>,
                                                <div className="text-right shrink-0">
                                                  {[
                                                    <span
                                                      className={`font-bold ${s < 2 ? "text-red-600 dark:text-red-400" : s < 4 ? "text-orange-600 dark:text-orange-400" : "text-amber-600 dark:text-amber-400"}`}
                                                    >
                                                      {t.reads.toLocaleString()}
                                                    </span>,
                                                    <span className="text-gray-500 dark:text-slate-400 ml-1">
                                                      {"reads"}
                                                    </span>,
                                                    <p className="text-[10px] text-gray-400 dark:text-slate-500">
                                                      {[
                                                        t.requests,
                                                        " req ×",
                                                        " ",
                                                        t.avgReadsPerRequest.toFixed(
                                                          0,
                                                        ),
                                                        " reads/req",
                                                      ]}
                                                    </p>,
                                                  ]}
                                                </div>,
                                              ]}
                                            </div>
                                          ),
                                        },
                                        t.path,
                                      ),
                                    )}
                                  </div>,
                                ]}
                              </div>,
                              u.byUser.length > 0 && (
                                <div>
                                  {[
                                    <p className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                                      {"👤 Top Usuarios por Lecturas"}
                                    </p>,
                                    <div className="space-y-1 text-xs">
                                      {u.byUser.slice(0, 5).map((t, s) => {
                                        const r = B.find(
                                          (l) => l.uid === t.uid,
                                        );
                                        return jsxRuntime.jsxs(
                                          "div",
                                          {
                                            className:
                                              "flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700",
                                            children: [
                                              <span className="font-medium text-gray-800 dark:text-slate-200 truncate flex-1 mr-2">
                                                {r?.name ||
                                                  r?.email ||
                                                  t.uid.slice(0, 8) + "..."}
                                              </span>,
                                              <span
                                                className={`font-semibold ${s === 0 ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-slate-400"}`}
                                              >
                                                {[
                                                  t.reads.toLocaleString(),
                                                  " reads",
                                                ]}
                                              </span>,
                                            ],
                                          },
                                          t.uid,
                                        );
                                      })}
                                    </div>,
                                  ]}
                                </div>
                              ),
                              u.projectedDaily > 4e4 && (
                                <div className="mt-2 p-3 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                                  {[
                                    <p className="text-xs font-bold text-red-700 dark:text-red-300">
                                      {
                                        "⚠️ ALERTA: Proyección cercana al límite"
                                      }
                                    </p>,
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                      {
                                        "Considera aumentar los intervalos de polling o reducir el número de pestañas abiertas."
                                      }
                                    </p>,
                                  ]}
                                </div>
                              ),
                            ]}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                              {"Cargando datos de Firestore..."}
                            </p>
                          </div>
                        ),
                      ]}
                    </div>,
                  ]}
                </div>
              ) : null,
            ]}
          </div>,
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {[
              <div className="lg:hidden flex items-center gap-2">
                {[
                  <button
                    type="button"
                    onClick={() => ue("activity")}
                    className={`${j} ${$ === "activity" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                  >
                    {"Actividad"}
                  </button>,
                  <button
                    type="button"
                    onClick={() => ue("users")}
                    className={`${j} ${$ === "users" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                  >
                    {"Usuarios"}
                  </button>,
                ]}
              </div>,
              <div
                className={`lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden ${$ === "activity" ? "block" : "hidden"} lg:block`}
              >
                {[
                  <div className="p-5 border-b border-gray-100 dark:border-slate-700">
                    {[
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        {[
                          <div className="flex items-center gap-3">
                            {[
                              <div className="p-2.5 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-xl">
                                <ActivityIcon size={20} />
                              </div>,
                              <div>
                                {[
                                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {"Actividad"}
                                  </h2>,
                                  <p className="text-sm text-gray-500 dark:text-slate-400">
                                    {
                                      "Feed de acciones (bonito y sin tanto texto técnico)"
                                    }
                                  </p>,
                                ]}
                              </div>,
                            ]}
                          </div>,
                          <div className="w-full sm:w-auto">
                            {[
                              <div className="relative">
                                {[
                                  <SearchIcon
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  />,
                                  <input
                                    value={G}
                                    onChange={(t) => Oe(t.target.value)}
                                    placeholder="Buscar por usuario, acción, ruta, versión…"
                                    className="w-full sm:w-[360px] pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/30 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                  />,
                                ]}
                              </div>,
                              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                {["Mostrando ", T.length, " de ", se.length]}
                              </p>,
                            ]}
                          </div>,
                        ]}
                      </div>,
                      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                        {[
                          <div className="flex items-center gap-2">
                            {[
                              <button
                                type="button"
                                onClick={() => qe((t) => !t)}
                                className={`${j} ${E ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                                title="Actualiza automáticamente"
                              >
                                {E ? "En vivo" : "Pausado"}
                              </button>,
                              <span className="text-xs text-gray-500 dark:text-slate-400">
                                {E
                                  ? "Se actualiza cada 5s"
                                  : "Actualiza manual"}
                              </span>,
                            ]}
                          </div>,
                          <div className="flex items-center gap-2">
                            {[
                              <button
                                type="button"
                                onClick={() => me("desc")}
                                className={`${j} ${D === "desc" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                                title="Ordenar por más recientes"
                              >
                                <span className="inline-flex items-center gap-1">
                                  {[<ChevronDownIcon size={14} />, "Recientes"]}
                                </span>
                              </button>,
                              <button
                                type="button"
                                onClick={() => me("asc")}
                                className={`${j} ${D === "asc" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                                title="Ordenar por más antiguos"
                              >
                                <span className="inline-flex items-center gap-1">
                                  {[<ChevronUpIcon size={14} />, "Antiguos"]}
                                </span>
                              </button>,
                            ]}
                          </div>,
                        ]}
                      </div>,
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {[
                          <button
                            type="button"
                            onClick={() => ge("all")}
                            className={`${j} ${L === "all" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                          >
                            {"Todos"}
                          </button>,
                          ["POST", "PATCH", "DELETE"].map((t) => (
                            <button
                              type="button"
                              onClick={() => ge(t)}
                              className={`${j} ${L === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                              key={t}
                            >
                              {t}
                            </button>
                          )),
                          <div className="mx-1 h-5 w-px bg-gray-200 dark:bg-slate-700" />,
                          <button
                            type="button"
                            onClick={() => V("all")}
                            className={`${j} ${w === "all" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                          >
                            {"Todo"}
                          </button>,
                          <button
                            type="button"
                            onClick={() => V("ok")}
                            className={`${j} ${w === "ok" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                          >
                            {"OK"}
                          </button>,
                          <button
                            type="button"
                            onClick={() => V("other")}
                            className={`${j} ${w === "other" ? "bg-rose-600 text-white border-rose-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`}
                          >
                            {"Otros"}
                          </button>,
                        ]}
                      </div>,
                    ]}
                  </div>,
                  <div className="p-5">
                    {T.length === 0 ? (
                      <div className="text-sm text-gray-500 dark:text-slate-400">
                        {"No hay resultados."}
                      </div>
                    ) : (
                      <div className="relative">
                        {[
                          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100 dark:bg-slate-700" />,
                          <div className="space-y-4">
                            {T.slice(0, 80).map((t) => {
                              const s = t.primary,
                                RenderComponent1 = bt(s),
                                l = String(s.email || s.uid || "(sin usuario)"),
                                o = De(l),
                                x = Ge === s.id,
                                b = Le(s.createdAt),
                                p = Re(s.createdAt);
                              return jsxRuntime.jsxs(
                                "div",
                                {
                                  className: "relative pl-10",
                                  children: [
                                    <div className="absolute left-[7px] top-4">
                                      <div className="w-7 h-7 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                                        <RenderComponent1
                                          size={16}
                                          className="text-slate-700 dark:text-slate-200"
                                        />
                                      </div>
                                    </div>,
                                    <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 shadow-sm p-4">
                                      {[
                                        <div className="flex items-start justify-between gap-3">
                                          {[
                                            <div className="flex items-start gap-3 min-w-0">
                                              {[
                                                <div
                                                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                                                  style={{
                                                    background: `linear-gradient(135deg, hsl(${o} 80% 55%), hsl(${(o + 40) % 360} 80% 45%))`,
                                                  }}
                                                >
                                                  {Me(l)}
                                                </div>,
                                                <div className="min-w-0">
                                                  {[
                                                    <p className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white truncate">
                                                      {s.actionLabel ||
                                                        "Acción"}
                                                    </p>,
                                                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                                      {[
                                                        l,
                                                        s.appVersion
                                                          ? ` · v${s.appVersion}`
                                                          : "",
                                                        s.appPath
                                                          ? ` · ${s.appPath}`
                                                          : "",
                                                        p ? ` · ${p}` : "",
                                                        b ? ` · ${b}` : "",
                                                      ]}
                                                    </p>,
                                                  ]}
                                                </div>,
                                              ]}
                                            </div>,
                                            <div className="flex items-center gap-2 shrink-0">
                                              {[
                                                s.method ? (
                                                  <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 ${mt(s.method)}`}
                                                  >
                                                    {String(
                                                      s.method,
                                                    ).toUpperCase()}
                                                  </span>
                                                ) : null,
                                                <span
                                                  className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 ${ut(s.status)}`}
                                                >
                                                  {typeof s.status == "number"
                                                    ? s.status
                                                    : ""}
                                                </span>,
                                                t.count > 1 ? (
                                                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200 border-indigo-200/60 dark:border-indigo-900/40">
                                                    {["x", t.count]}
                                                  </span>
                                                ) : null,
                                              ]}
                                            </div>,
                                          ]}
                                        </div>,
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                          {[
                                            typeof s.durationMs == "number" ? (
                                              <span className={h}>
                                                <span className="inline-flex items-center gap-1">
                                                  {[
                                                    <ClockIcon size={14} />,
                                                    s.durationMs,
                                                    "ms",
                                                  ]}
                                                </span>
                                              </span>
                                            ) : null,
                                            Array.isArray(s.bodyKeys) &&
                                            s.bodyKeys.length > 0 ? (
                                              <span className={h}>
                                                {[s.bodyKeys.length, " campos"]}
                                              </span>
                                            ) : null,
                                            s.resourceId ? (
                                              <span className={h}>
                                                {["id:", xt(s.resourceId)]}
                                              </span>
                                            ) : null,
                                          ]}
                                        </div>,
                                        <div className="mt-3">
                                          <button
                                            type="button"
                                            className={de}
                                            onClick={() =>
                                              We((f) =>
                                                f === s.id ? null : s.id,
                                              )
                                            }
                                          >
                                            {[
                                              x ? (
                                                <ChevronUpIcon size={16} />
                                              ) : (
                                                <ChevronDownIcon size={16} />
                                              ),
                                              "Detalles",
                                            ]}
                                          </button>
                                        </div>,
                                        x ? (
                                          <div className="mt-3 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white/70 dark:bg-slate-900/30 p-4 space-y-3">
                                            {[
                                              <div className="text-xs text-gray-500 dark:text-slate-400 break-words">
                                                {[
                                                  s.path ? (
                                                    <div>
                                                      {[
                                                        <span className="font-semibold text-gray-700 dark:text-slate-200">
                                                          {"Ruta:"}
                                                        </span>,
                                                        " ",
                                                        s.path,
                                                      ]}
                                                    </div>
                                                  ) : null,
                                                  s.actionCode ? (
                                                    <div>
                                                      {[
                                                        <span className="font-semibold text-gray-700 dark:text-slate-200">
                                                          {"Código:"}
                                                        </span>,
                                                        " ",
                                                        s.actionCode,
                                                      ]}
                                                    </div>
                                                  ) : null,
                                                  s.referer ? (
                                                    <div>
                                                      {[
                                                        <span className="font-semibold text-gray-700 dark:text-slate-200">
                                                          {"Referer:"}
                                                        </span>,
                                                        " ",
                                                        s.referer,
                                                      ]}
                                                    </div>
                                                  ) : null,
                                                ]}
                                              </div>,
                                              Array.isArray(s.bodyKeys) &&
                                              s.bodyKeys.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                  {[
                                                    s.bodyKeys
                                                      .slice(0, 16)
                                                      .map((f) => (
                                                        <span
                                                          className={h}
                                                          key={f}
                                                        >
                                                          {f}
                                                        </span>
                                                      )),
                                                    s.bodyKeys.length > 16 ? (
                                                      <span className={h}>
                                                        {[
                                                          "+",
                                                          s.bodyKeys.length -
                                                            16,
                                                        ]}
                                                      </span>
                                                    ) : null,
                                                  ]}
                                                </div>
                                              ) : null,
                                            ]}
                                          </div>
                                        ) : null,
                                      ]}
                                    </div>,
                                  ],
                                },
                                s.id,
                              );
                            })}
                          </div>,
                        ]}
                      </div>
                    )}
                  </div>,
                ]}
              </div>,
              <div
                className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden ${$ === "users" ? "block" : "hidden"} lg:block`}
              >
                {[
                  <div className="p-5 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      {[
                        <div className="flex items-center gap-3">
                          {[
                            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl">
                              <UsersIcon size={20} />
                            </div>,
                            <div>
                              {[
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {"Últimas conexiones"}
                                </h2>,
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                  {"Quién está en línea + última vez + versión"}
                                </p>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        <button
                          type="button"
                          onClick={() => He((t) => !t)}
                          className={de}
                          title="Mostrar más/menos usuarios"
                        >
                          {[
                            W ? (
                              <ChevronUpIcon size={16} />
                            ) : (
                              <ChevronDownIcon size={16} />
                            ),
                            W ? "Ver menos" : "Ver más",
                          ]}
                        </button>,
                      ]}
                    </div>
                  </div>,
                  <div className="p-5">
                    {v.length === 0 ? (
                      <div className="text-sm text-gray-500 dark:text-slate-400">
                        {"Sin datos aún."}
                      </div>
                    ) : (
                      <div className="max-h-[820px] overflow-auto pr-1">
                        <div className="grid grid-cols-1 gap-4">
                          {v
                            .slice(0, W ? 30 : 10)
                            .map(({ u: t, isOnline: s }) => {
                              const r = t.name || t.email || t.uid,
                                l = t.email && t.name ? t.email : t.uid,
                                o = De(String(t.email || t.uid || r)),
                                x = gt(t.role),
                                b = Re(t.lastSeenAt),
                                p = Le(t.lastSeenAt),
                                f = Fe[t.uid],
                                M =
                                  typeof f?.transferSize == "number"
                                    ? f.transferSize
                                    : null,
                                re = new Date().toISOString().slice(0, 10),
                                Je = new Date(Date.now() - 1440 * 60 * 1e3)
                                  .toISOString()
                                  .slice(0, 10),
                                we = P[t.uid] || {},
                                A = we[re],
                                ve = we[Je],
                                Se =
                                  typeof A?.transferSize == "number"
                                    ? A.transferSize
                                    : null,
                                $e =
                                  typeof A?.requestCount == "number"
                                    ? A.requestCount
                                    : null,
                                ae =
                                  typeof A?.metaCount == "number"
                                    ? A.metaCount
                                    : null,
                                Ae =
                                  typeof ve?.transferSize == "number"
                                    ? ve.transferSize
                                    : null;
                              return jsxRuntime.jsxs(
                                "div",
                                {
                                  className:
                                    "rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 shadow-sm p-4",
                                  children: [
                                    <div className="flex items-start justify-between gap-3">
                                      {[
                                        <div className="flex items-center gap-3 min-w-0">
                                          {[
                                            <div
                                              className="relative w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                                              style={{
                                                background: `linear-gradient(135deg, hsl(${o} 80% 55%), hsl(${(o + 40) % 360} 80% 45%))`,
                                              }}
                                            >
                                              {[
                                                Me(r),
                                                s && (
                                                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
                                                ),
                                              ]}
                                            </div>,
                                            <div className="min-w-0">
                                              {[
                                                <div className="flex items-center gap-2 min-w-0">
                                                  {[
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                      {r}
                                                    </p>,
                                                    s && (
                                                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-900/40 whitespace-nowrap">
                                                        {"En línea"}
                                                      </span>
                                                    ),
                                                  ]}
                                                </div>,
                                                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                                  {l}
                                                </p>,
                                              ]}
                                            </div>,
                                          ]}
                                        </div>,
                                        x.label ? (
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 whitespace-nowrap ${x.cls}`}
                                          >
                                            {x.label}
                                          </span>
                                        ) : null,
                                      ]}
                                    </div>,
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                      {[
                                        <span className={h}>
                                          {[
                                            <span className="text-gray-500 dark:text-slate-400 mr-1">
                                              {"Última vez:"}
                                            </span>,
                                            b ? `${b} · ` : "",
                                            p,
                                          ]}
                                        </span>,
                                        Se !== null ? (
                                          <span className={h}>
                                            {[
                                              <span className="text-gray-500 dark:text-slate-400 mr-1">
                                                {"Hoy:"}
                                              </span>,
                                              C(Se),
                                              $e !== null ? ` · ${$e} req` : "",
                                              ae !== null && ae > 0
                                                ? ` · ${ae} meta`
                                                : "",
                                            ]}
                                          </span>
                                        ) : null,
                                        Ae !== null ? (
                                          <span className={h}>
                                            {[
                                              <span className="text-gray-500 dark:text-slate-400 mr-1">
                                                {"Ayer:"}
                                              </span>,
                                              C(Ae),
                                            ]}
                                          </span>
                                        ) : null,
                                        M !== null ? (
                                          <span className={h}>
                                            {[
                                              <span className="text-gray-500 dark:text-slate-400 mr-1">
                                                {"Consumo:"}
                                              </span>,
                                              C(M),
                                            ]}
                                          </span>
                                        ) : null,
                                        t.lastSeenPath ? (
                                          <span className={h}>
                                            {t.lastSeenPath}
                                          </span>
                                        ) : null,
                                        <span className={h}>
                                          {["v", t.lastSeenVersion || "?"]}
                                        </span>,
                                      ]}
                                    </div>,
                                  ],
                                },
                                t.uid,
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>,
                ]}
              </div>,
            ]}
          </div>,
        ]}
      </div>
    ) : (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center gap-3">
            {[
              <div className="p-2.5 bg-gradient-to-br from-slate-600 to-slate-800 text-white rounded-xl">
                <HistoryIcon size={20} />
              </div>,
              <div>
                {[
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {"Historial de la aplicación"}
                  </h1>,
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {"Esta vista depende del modo BFF (producción)."}
                  </p>,
                ]}
              </div>,
            ]}
          </div>
        </div>
      </div>
    )
  ) : (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
        {[
          <div className="flex items-center gap-3">
            {[
              <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl">
                <ShieldAlertIcon size={20} />
              </div>,
              <div>
                {[
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {"Acceso restringido"}
                  </h1>,
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {
                      "Solo Master Admin puede ver el historial de la aplicación."
                    }
                  </p>,
                ]}
              </div>,
            ]}
          </div>,
          <div className="mt-4">
            <button
              type="button"
              onClick={() => a("/dashboard")}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              {"Volver al Panel"}
            </button>
          </div>,
        ]}
      </div>
    </div>
  );
};
export { AppHistory };
