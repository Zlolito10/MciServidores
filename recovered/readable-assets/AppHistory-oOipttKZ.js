import { j as e } from "./index-BU_ZgoWo.js";
import { u as Xe, r as d } from "./vendor-react-BwINE3B3.js";
import { u as et, i as tt, f as S, B as st } from "./App-BPrQ3EPG.js";
import {
  an as Ce,
  H as ne,
  ae as rt,
  F,
  x as _,
  ao as le,
  w as at,
  s as nt,
  f as dt,
  D as Ee,
  ap as lt,
  d as it,
  U as ot,
  aq as ct,
} from "./vendor-ui-CnvYSvQL.js";
import "./vendor-pdf-Cf03QSry.js";
import "./vendor-firebase-BjYbfC3F.js";
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
  },
  Le = (n) => {
    const a = U(n);
    return a ? a.toLocaleString() : "(sin fecha)";
  },
  Re = (n) => {
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
  },
  C = (n) => {
    const a = typeof n == "number" && Number.isFinite(n) ? n : 0;
    if (a <= 0) return "0 B";
    const m = ["B", "KB", "MB", "GB"];
    let c = 0,
      i = a;
    for (; i >= 1024 && c < m.length - 1; ) ((i /= 1024), (c += 1));
    const k = c === 0 ? 0 : i < 10 ? 1 : 0;
    return `${i.toFixed(k)} ${m[c]}`;
  },
  xt = (n) => {
    const a = String(n || "").trim();
    return a ? (a.length <= 10 ? a : `${a.slice(0, 6)}…${a.slice(-3)}`) : "";
  },
  Me = (n) => {
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
  },
  De = (n) => {
    let a = 0;
    for (let m = 0; m < n.length; m++) a = (a * 31 + n.charCodeAt(m)) % 360;
    return a;
  },
  mt = (n) => {
    const a = String(n || "").toUpperCase();
    return a === "POST"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-900/40"
      : a === "PATCH" || a === "PUT"
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200 border-indigo-200/60 dark:border-indigo-900/40"
        : a === "DELETE"
          ? "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200 border-rose-200/60 dark:border-rose-900/40"
          : "bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-200 border-slate-200/60 dark:border-slate-900/40";
  },
  ut = (n) =>
    typeof n != "number"
      ? "bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-200 border-slate-200/60 dark:border-slate-900/40"
      : n >= 200 && n < 300
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-900/40"
        : n >= 300 && n < 400
          ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200 border-amber-200/60 dark:border-amber-900/40"
          : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200 border-rose-200/60 dark:border-rose-900/40",
  gt = (n) => {
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
  },
  h =
    "inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 bg-white/70 dark:bg-slate-900/30 border-gray-200/70 dark:border-slate-700/70 text-gray-700 dark:text-slate-200",
  de =
    "inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/30 text-sm text-gray-900 dark:text-white hover:bg-white dark:hover:bg-slate-900/50",
  j =
    "inline-flex items-center px-2.5 py-1 rounded-xl border text-xs font-semibold",
  z = (n) => {
    const a = U(n);
    return a ? a.getTime() : 0;
  },
  bt = (n) => {
    const a = String(n.actionCode || "").toLowerCase(),
      m = String(n.path || "").toLowerCase();
    return a.startsWith("notify.") || m.includes("/api/notify")
      ? Ee
      : a.startsWith("notifications.")
        ? Ee
        : a.startsWith("comments.")
          ? lt
          : a.startsWith("events.")
            ? it
            : a.startsWith("users.")
              ? ot
              : a.startsWith("attendance.")
                ? ct
                : le;
  },
  ht = (n) => {
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
      a.push({ key: k, primary: c, count: 1 });
    }
    return a;
  },
  wt = () => {
    const { userProfile: n } = et(),
      a = Xe(),
      m = "cem_app_history_mobile_tab_v1",
      c = "cem_app_history_insights_open_v1",
      i = n?.role === "master_admin",
      [k, y] = d.useState(!1),
      [N, ie] = d.useState(""),
      [oe, Ie] = d.useState([]),
      [B, Te] = d.useState([]),
      [Fe, _e] = d.useState({}),
      [P, ze] = d.useState({}),
      [ce, Ue] = d.useState([]),
      [xe, Be] = d.useState([]),
      [u, Pe] = d.useState(null),
      O = d.useRef(!1),
      q = d.useRef(0),
      K = d.useRef(!1),
      H = d.useRef(0),
      [G, Oe] = d.useState(""),
      [E, qe] = d.useState(!0),
      [D, me] = d.useState("desc"),
      [I, Ke] = d.useState(() => {
        try {
          const t = localStorage.getItem(c);
          return t === "1";
        } catch {
          return !1;
        }
      }),
      [W, He] = d.useState(!1),
      [$, ue] = d.useState(() => {
        try {
          const t = localStorage.getItem(m);
          return t === "activity" || t === "users" ? t : "users";
        } catch {
          return "users";
        }
      }),
      [L, ge] = d.useState("all"),
      [w, V] = d.useState("all"),
      [Ge, We] = d.useState(null),
      Q = d.useRef(!1),
      Y = d.useRef(!1),
      Z = d.useRef(""),
      J = d.useRef(0),
      g = tt(),
      X = d.useRef(!1),
      be = d.useRef(0),
      he = async () => {
        if (!i || !g) return;
        const t = Date.now();
        if (!(t - be.current < 6e4) && !X.current) {
          X.current = !0;
          try {
            const r = `/api/admin/telemetry/latest?limitUsers=80&${`__t=${Date.now().toString(36)}`}`,
              l = await S(r, {
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
    (d.useEffect(() => {
      try {
        localStorage.setItem(m, $);
      } catch {}
    }, [$]),
      d.useEffect(() => {
        try {
          localStorage.setItem(c, I ? "1" : "0");
        } catch {}
      }, [I]));
    const ee = d.useRef(!1),
      pe = d.useRef(0),
      fe = async () => {
        if (!i || !g) return;
        const t = Date.now();
        if (!(t - pe.current < 6e4) && !ee.current) {
          ee.current = !0;
          try {
            const r = `/api/admin/telemetry/daily?days=7&limit=3000&${`__t=${Date.now().toString(36)}`}`,
              l = await S(r, {
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
        if (!i || !g) return;
        const t = Date.now();
        if (!(t - q.current < 6e4) && !O.current) {
          O.current = !0;
          try {
            const s = new Date().toISOString().slice(0, 10),
              r = `__t=${Date.now().toString(36)}`,
              [l, o] = await Promise.all([
                S(
                  `/api/admin/telemetry/daily/routes?day=${encodeURIComponent(s)}&type=api&limit=5&${r}`,
                  { method: "GET", cache: "no-store", timeoutMs: 12e3 },
                ),
                S(
                  `/api/admin/telemetry/daily/routes?day=${encodeURIComponent(s)}&type=asset&limit=5&${r}`,
                  { method: "GET", cache: "no-store", timeoutMs: 12e3 },
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
        if (!i || !g) return;
        const t = Date.now();
        if (!(t - H.current < 6e4) && !K.current) {
          K.current = !0;
          try {
            const r = `/api/admin/firestore-reads?hours=24&${`__t=${Date.now().toString(36)}`}`,
              l = await S(r, {
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
          const l = `/api/admin/app-history?limit=200&${`__t=${Date.now().toString(36)}`}`,
            o = await S(l, {
              method: "GET",
              cache: "no-store",
              timeoutMs: 15e3,
            });
          (Ie(Array.isArray(o.logs) ? o.logs : []),
            Te(Array.isArray(o.users) ? o.users : []),
            (J.current = Date.now()));
        } catch (r) {
          const l =
            r instanceof st
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
            r = await S(s, {
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
    (d.useEffect(() => {
      i && g && (R({ showLoading: !0 }), he(), fe(), ye(), ke());
    }, [i, g]),
      d.useEffect(() => {
        if (!i || !g) return;
        const t = () => void he(),
          s = window.setInterval(t, 2 * 6e4);
        return (
          window.addEventListener("focus", t),
          () => {
            (window.clearInterval(s), window.removeEventListener("focus", t));
          }
        );
      }, [i, g]),
      d.useEffect(() => {
        if (!i || !g) return;
        const t = () => void fe(),
          s = window.setInterval(t, 5 * 6e4);
        return (
          window.addEventListener("focus", t),
          () => {
            (window.clearInterval(s), window.removeEventListener("focus", t));
          }
        );
      }, [i, g]),
      d.useEffect(() => {
        if (!i || !g) return;
        const t = () => void ye(),
          s = window.setInterval(t, 5 * 6e4);
        return (
          window.addEventListener("focus", t),
          () => {
            (window.clearInterval(s), window.removeEventListener("focus", t));
          }
        );
      }, [i, g]),
      d.useEffect(() => {
        if (!i || !g) return;
        const t = () => void ke(),
          s = window.setInterval(t, 5 * 6e4);
        return (
          window.addEventListener("focus", t),
          () => {
            (window.clearInterval(s), window.removeEventListener("focus", t));
          }
        );
      }, [i, g]),
      d.useEffect(() => {
        if (!i || !g || !E) return;
        const t = 3e4,
          s = 300 * 1e3,
          r = async () => {
            if (document.visibilityState !== "visible") return;
            const b = await Ve(),
              p = Date.now();
            if (!b) {
              p - J.current > s && R({ showLoading: !1 });
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
              ((Z.current = f), R({ showLoading: !1 }));
              return;
            }
            re && R({ showLoading: !1 });
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
      v = d.useMemo(() => {
        const t = B.map((s) => {
          const r = U(s.lastSeenAt),
            l = r ? r.getTime() : 0,
            o = r ? Date.now() - l <= Ye : !1;
          return { u: s, t: l, isOnline: o };
        });
        return (
          t.sort((s, r) =>
            s.isOnline !== r.isOnline ? (s.isOnline ? -1 : 1) : r.t - s.t,
          ),
          t
        );
      }, [B]),
      te = d.useMemo(() => {
        const t = [...oe];
        return (t.sort((s, r) => z(r.createdAt) - z(s.createdAt)), t);
      }, [oe]),
      se = d.useMemo(
        () => (D === "asc" ? [...te].reverse() : te).slice(0, 200),
        [te, D],
      ),
      je = d.useMemo(() => {
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
      T = d.useMemo(() => ht(je), [je]),
      Ze = d.useMemo(() => v.filter((t) => t.isOnline).length, [v]),
      Ne = d.useMemo(() => {
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
    return i
      ? g
        ? e.jsxs("div", {
            className: "space-y-6 max-w-6xl mx-auto",
            children: [
              e.jsxs("div", {
                className:
                  "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5",
                children: [
                  e.jsxs("div", {
                    className:
                      "flex items-center justify-between gap-4 flex-wrap",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("div", {
                            className:
                              "p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl",
                            children: e.jsx(ne, { size: 20 }),
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("h1", {
                                className:
                                  "text-2xl font-bold text-gray-900 dark:text-white",
                                children: "Historial de la aplicación",
                              }),
                              e.jsx("p", {
                                className:
                                  "text-sm text-gray-500 dark:text-slate-400",
                                children:
                                  "Vista de control (Master Admin): quién está en línea + feed de actividad",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("button", {
                        type: "button",
                        onClick: () => void R({ showLoading: !0 }),
                        disabled: k,
                        className:
                          "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60",
                        children: [
                          e.jsx(rt, {
                            size: 18,
                            className: k ? "animate-spin" : "",
                          }),
                          "Actualizar",
                        ],
                      }),
                    ],
                  }),
                  N &&
                    e.jsx("div", {
                      className:
                        "mt-4 p-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300",
                      children: N,
                    }),
                  e.jsxs("div", {
                    className: "mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3",
                    children: [
                      e.jsxs("div", {
                        className:
                          "rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 p-4",
                        children: [
                          e.jsx("p", {
                            className:
                              "text-xs text-gray-500 dark:text-slate-400",
                            children: "En línea",
                          }),
                          e.jsx("p", {
                            className:
                              "text-2xl font-extrabold text-gray-900 dark:text-white",
                            children: Ze,
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className:
                          "rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 p-4",
                        children: [
                          e.jsx("p", {
                            className:
                              "text-xs text-gray-500 dark:text-slate-400",
                            children: "Usuarios recientes",
                          }),
                          e.jsx("p", {
                            className:
                              "text-2xl font-extrabold text-gray-900 dark:text-white",
                            children: v.length,
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className:
                          "rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 p-4",
                        children: [
                          e.jsx("p", {
                            className:
                              "text-xs text-gray-500 dark:text-slate-400",
                            children: "Acciones recientes",
                          }),
                          e.jsx("p", {
                            className:
                              "text-2xl font-extrabold text-gray-900 dark:text-white",
                            children: T.length,
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className:
                      "mt-3 flex items-center justify-between gap-3 flex-wrap",
                    children: [
                      e.jsxs("button", {
                        type: "button",
                        onClick: () => Ke((t) => !t),
                        className: de,
                        children: [
                          I ? e.jsx(F, { size: 16 }) : e.jsx(_, { size: 16 }),
                          "Consumo y rankings",
                        ],
                      }),
                      e.jsx("p", {
                        className: "text-xs text-gray-500 dark:text-slate-400",
                        children: "Top usuarios y rutas (hoy)",
                      }),
                    ],
                  }),
                  I
                    ? e.jsxs("div", {
                        className: "mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3",
                        children: [
                          e.jsxs("div", {
                            className:
                              "rounded-2xl border border-gray-100 dark:border-slate-700 bg-white/70 dark:bg-slate-900/20 p-4",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx("div", {
                                    className:
                                      "p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl",
                                    children: e.jsx(le, { size: 16 }),
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("p", {
                                        className:
                                          "text-sm font-bold text-gray-900 dark:text-white",
                                        children: "Top usuarios (hoy)",
                                      }),
                                      e.jsx("p", {
                                        className:
                                          "text-xs text-gray-500 dark:text-slate-400",
                                        children:
                                          "Bytes descargados + requests (same-origin)",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              Ne.length === 0
                                ? e.jsx("div", {
                                    className:
                                      "mt-3 text-sm text-gray-500 dark:text-slate-400",
                                    children: "Sin datos aún.",
                                  })
                                : e.jsx("div", {
                                    className: "mt-3 space-y-2",
                                    children: Ne.map((t) =>
                                      e.jsxs(
                                        "div",
                                        {
                                          className:
                                            "flex items-center justify-between gap-3",
                                          children: [
                                            e.jsxs("div", {
                                              className: "min-w-0",
                                              children: [
                                                e.jsx("div", {
                                                  className:
                                                    "text-sm font-semibold text-gray-900 dark:text-white truncate",
                                                  children: t.name,
                                                }),
                                                t.email
                                                  ? e.jsx("div", {
                                                      className:
                                                        "text-xs text-gray-500 dark:text-slate-400 truncate",
                                                      children: t.email,
                                                    })
                                                  : null,
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              className:
                                                "flex flex-wrap gap-2 justify-end shrink-0",
                                              children: [
                                                e.jsx("span", {
                                                  className: h,
                                                  children: C(t.bytes),
                                                }),
                                                e.jsxs("span", {
                                                  className: h,
                                                  children: [t.reqs, " req"],
                                                }),
                                                t.meta > 0
                                                  ? e.jsxs("span", {
                                                      className: h,
                                                      children: [
                                                        t.meta,
                                                        " meta",
                                                      ],
                                                    })
                                                  : null,
                                              ],
                                            }),
                                          ],
                                        },
                                        t.uid,
                                      ),
                                    ),
                                  }),
                            ],
                          }),
                          e.jsxs("div", {
                            className:
                              "rounded-2xl border border-gray-100 dark:border-slate-700 bg-white/70 dark:bg-slate-900/20 p-4",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx("div", {
                                    className:
                                      "p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl",
                                    children: e.jsx(ne, { size: 16 }),
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("p", {
                                        className:
                                          "text-sm font-bold text-gray-900 dark:text-white",
                                        children: "Top rutas (hoy)",
                                      }),
                                      e.jsx("p", {
                                        className:
                                          "text-xs text-gray-500 dark:text-slate-400",
                                        children:
                                          "Agregado global (API + assets)",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3",
                                children: [
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("p", {
                                        className:
                                          "text-xs font-semibold text-gray-700 dark:text-slate-200",
                                        children: "API",
                                      }),
                                      ce.length === 0
                                        ? e.jsx("div", {
                                            className:
                                              "mt-2 text-sm text-gray-500 dark:text-slate-400",
                                            children: "Sin datos.",
                                          })
                                        : e.jsx("div", {
                                            className: "mt-2 space-y-2",
                                            children: ce.map((t) =>
                                              e.jsxs(
                                                "div",
                                                {
                                                  className:
                                                    "flex items-center justify-between gap-2",
                                                  children: [
                                                    e.jsx("div", {
                                                      className:
                                                        "text-xs text-gray-700 dark:text-slate-200 truncate",
                                                      children: t.path,
                                                    }),
                                                    e.jsx("div", {
                                                      className:
                                                        "flex gap-2 shrink-0",
                                                      children: e.jsx("span", {
                                                        className: h,
                                                        children: C(
                                                          typeof t.bytes ==
                                                            "number"
                                                            ? t.bytes
                                                            : 0,
                                                        ),
                                                      }),
                                                    }),
                                                  ],
                                                },
                                                t.path,
                                              ),
                                            ),
                                          }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("p", {
                                        className:
                                          "text-xs font-semibold text-gray-700 dark:text-slate-200",
                                        children: "Assets",
                                      }),
                                      xe.length === 0
                                        ? e.jsx("div", {
                                            className:
                                              "mt-2 text-sm text-gray-500 dark:text-slate-400",
                                            children: "Sin datos.",
                                          })
                                        : e.jsx("div", {
                                            className: "mt-2 space-y-2",
                                            children: xe.map((t) =>
                                              e.jsxs(
                                                "div",
                                                {
                                                  className:
                                                    "flex items-center justify-between gap-2",
                                                  children: [
                                                    e.jsx("div", {
                                                      className:
                                                        "text-xs text-gray-700 dark:text-slate-200 truncate",
                                                      children: t.path,
                                                    }),
                                                    e.jsx("div", {
                                                      className:
                                                        "flex gap-2 shrink-0",
                                                      children: e.jsx("span", {
                                                        className: h,
                                                        children: C(
                                                          typeof t.bytes ==
                                                            "number"
                                                            ? t.bytes
                                                            : 0,
                                                        ),
                                                      }),
                                                    }),
                                                  ],
                                                },
                                                t.path,
                                              ),
                                            ),
                                          }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className:
                              "lg:col-span-2 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/10 p-4",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2 mb-3",
                                children: [
                                  e.jsx("div", {
                                    className:
                                      "p-2 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl",
                                    children: e.jsx(Ce, { size: 16 }),
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("p", {
                                        className:
                                          "text-sm font-bold text-gray-900 dark:text-white",
                                        children:
                                          "⚡ Consumo de Firestore (Lecturas en Tiempo Real)",
                                      }),
                                      e.jsxs("p", {
                                        className:
                                          "text-xs text-gray-500 dark:text-slate-400",
                                        children: [
                                          "Datos reales de las últimas",
                                          " ",
                                          u?.hoursAnalyzed || 24,
                                          " horas",
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              u
                                ? e.jsxs("div", {
                                    className: "space-y-3",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "grid grid-cols-2 sm:grid-cols-4 gap-2",
                                        children: [
                                          e.jsxs("div", {
                                            className:
                                              "p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700",
                                            children: [
                                              e.jsx("p", {
                                                className:
                                                  "text-[10px] text-gray-500 dark:text-slate-400 uppercase",
                                                children: "Total Lecturas",
                                              }),
                                              e.jsx("p", {
                                                className:
                                                  "text-lg font-bold text-gray-900 dark:text-white",
                                                children:
                                                  u.totalReads.toLocaleString(),
                                              }),
                                            ],
                                          }),
                                          e.jsxs("div", {
                                            className:
                                              "p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700",
                                            children: [
                                              e.jsx("p", {
                                                className:
                                                  "text-[10px] text-gray-500 dark:text-slate-400 uppercase",
                                                children: "Reads/Hora",
                                              }),
                                              e.jsx("p", {
                                                className:
                                                  "text-lg font-bold text-amber-600 dark:text-amber-400",
                                                children:
                                                  u.readsPerHour.toLocaleString(),
                                              }),
                                            ],
                                          }),
                                          e.jsxs("div", {
                                            className:
                                              "p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700",
                                            children: [
                                              e.jsx("p", {
                                                className:
                                                  "text-[10px] text-gray-500 dark:text-slate-400 uppercase",
                                                children: "Proyección Diaria",
                                              }),
                                              e.jsx("p", {
                                                className: `text-lg font-bold ${u.projectedDaily > 4e4 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`,
                                                children:
                                                  u.projectedDaily.toLocaleString(),
                                              }),
                                            ],
                                          }),
                                          e.jsxs("div", {
                                            className:
                                              "p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700",
                                            children: [
                                              e.jsx("p", {
                                                className:
                                                  "text-[10px] text-gray-500 dark:text-slate-400 uppercase",
                                                children: "Total Requests",
                                              }),
                                              e.jsx("p", {
                                                className:
                                                  "text-lg font-bold text-gray-900 dark:text-white",
                                                children:
                                                  u.totalRequests.toLocaleString(),
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700",
                                        children: [
                                          e.jsxs("div", {
                                            className:
                                              "flex justify-between text-xs mb-1",
                                            children: [
                                              e.jsx("span", {
                                                className:
                                                  "text-gray-600 dark:text-slate-400",
                                                children:
                                                  "Uso del límite diario (50,000)",
                                              }),
                                              e.jsxs("span", {
                                                className: `font-bold ${u.projectedDaily > 4e4 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`,
                                                children: [
                                                  Math.min(
                                                    100,
                                                    Math.round(
                                                      (u.projectedDaily / 5e4) *
                                                        100,
                                                    ),
                                                  ),
                                                  "%",
                                                ],
                                              }),
                                            ],
                                          }),
                                          e.jsx("div", {
                                            className:
                                              "h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden",
                                            children: e.jsx("div", {
                                              className: `h-full transition-all ${u.projectedDaily > 4e4 ? "bg-red-500" : u.projectedDaily > 25e3 ? "bg-amber-500" : "bg-green-500"}`,
                                              style: {
                                                width: `${Math.min(100, (u.projectedDaily / 5e4) * 100)}%`,
                                              },
                                            }),
                                          }),
                                        ],
                                      }),
                                      u.byPage &&
                                        u.byPage.length > 0 &&
                                        e.jsxs("div", {
                                          children: [
                                            e.jsx("p", {
                                              className:
                                                "text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5",
                                              children:
                                                "📱 Consumo por Página (¿Qué genera más lecturas?)",
                                            }),
                                            e.jsx("div", {
                                              className:
                                                "grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs",
                                              children: u.byPage.map((t, s) =>
                                                e.jsxs(
                                                  "div",
                                                  {
                                                    className: `p-2 rounded-lg border ${s === 0 ? "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800" : s === 1 ? "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800" : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"}`,
                                                    children: [
                                                      e.jsx("p", {
                                                        className: `font-bold ${s === 0 ? "text-red-700 dark:text-red-300" : s === 1 ? "text-orange-700 dark:text-orange-300" : "text-gray-700 dark:text-slate-300"}`,
                                                        children: t.page,
                                                      }),
                                                      e.jsxs("p", {
                                                        className: `text-sm font-semibold ${s === 0 ? "text-red-600 dark:text-red-400" : s === 1 ? "text-orange-600 dark:text-orange-400" : "text-gray-600 dark:text-slate-400"}`,
                                                        children: [
                                                          t.reads.toLocaleString(),
                                                          " reads",
                                                        ],
                                                      }),
                                                      e.jsxs("p", {
                                                        className:
                                                          "text-gray-500 dark:text-slate-500 text-[10px]",
                                                        children: [
                                                          t.requests,
                                                          " requests",
                                                        ],
                                                      }),
                                                    ],
                                                  },
                                                  t.page,
                                                ),
                                              ),
                                            }),
                                          ],
                                        }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("p", {
                                            className:
                                              "text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5",
                                            children:
                                              "📊 Top Endpoints (¿Qué operaciones consumen más?)",
                                          }),
                                          e.jsx("div", {
                                            className: "space-y-1.5 text-xs",
                                            children: u.byEndpoint
                                              .slice(0, 8)
                                              .map((t, s) =>
                                                e.jsx(
                                                  "div",
                                                  {
                                                    className: `p-2 rounded-lg ${s < 2 ? "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30" : s < 4 ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30" : "bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30"}`,
                                                    children: e.jsxs("div", {
                                                      className:
                                                        "flex justify-between items-start",
                                                      children: [
                                                        e.jsxs("div", {
                                                          className:
                                                            "flex-1 mr-2",
                                                          children: [
                                                            e.jsx("span", {
                                                              className:
                                                                "font-bold text-gray-800 dark:text-slate-200",
                                                              children:
                                                                t.description ||
                                                                t.path.replace(
                                                                  "/api/",
                                                                  "",
                                                                ),
                                                            }),
                                                            e.jsx("span", {
                                                              className:
                                                                "ml-1.5 text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-gray-600 dark:text-slate-400",
                                                              children: t.page,
                                                            }),
                                                            e.jsxs("p", {
                                                              className:
                                                                "text-[10px] text-gray-500 dark:text-slate-500 mt-0.5",
                                                              children: [
                                                                "💡 ",
                                                                t.cause ||
                                                                  "Lectura de datos",
                                                              ],
                                                            }),
                                                          ],
                                                        }),
                                                        e.jsxs("div", {
                                                          className:
                                                            "text-right shrink-0",
                                                          children: [
                                                            e.jsx("span", {
                                                              className: `font-bold ${s < 2 ? "text-red-600 dark:text-red-400" : s < 4 ? "text-orange-600 dark:text-orange-400" : "text-amber-600 dark:text-amber-400"}`,
                                                              children:
                                                                t.reads.toLocaleString(),
                                                            }),
                                                            e.jsx("span", {
                                                              className:
                                                                "text-gray-500 dark:text-slate-400 ml-1",
                                                              children: "reads",
                                                            }),
                                                            e.jsxs("p", {
                                                              className:
                                                                "text-[10px] text-gray-400 dark:text-slate-500",
                                                              children: [
                                                                t.requests,
                                                                " req ×",
                                                                " ",
                                                                t.avgReadsPerRequest.toFixed(
                                                                  0,
                                                                ),
                                                                " reads/req",
                                                              ],
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  },
                                                  t.path,
                                                ),
                                              ),
                                          }),
                                        ],
                                      }),
                                      u.byUser.length > 0 &&
                                        e.jsxs("div", {
                                          children: [
                                            e.jsx("p", {
                                              className:
                                                "text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5",
                                              children:
                                                "👤 Top Usuarios por Lecturas",
                                            }),
                                            e.jsx("div", {
                                              className: "space-y-1 text-xs",
                                              children: u.byUser
                                                .slice(0, 5)
                                                .map((t, s) => {
                                                  const r = B.find(
                                                    (l) => l.uid === t.uid,
                                                  );
                                                  return e.jsxs(
                                                    "div",
                                                    {
                                                      className:
                                                        "flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700",
                                                      children: [
                                                        e.jsx("span", {
                                                          className:
                                                            "font-medium text-gray-800 dark:text-slate-200 truncate flex-1 mr-2",
                                                          children:
                                                            r?.name ||
                                                            r?.email ||
                                                            t.uid.slice(0, 8) +
                                                              "...",
                                                        }),
                                                        e.jsxs("span", {
                                                          className: `font-semibold ${s === 0 ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-slate-400"}`,
                                                          children: [
                                                            t.reads.toLocaleString(),
                                                            " reads",
                                                          ],
                                                        }),
                                                      ],
                                                    },
                                                    t.uid,
                                                  );
                                                }),
                                            }),
                                          ],
                                        }),
                                      u.projectedDaily > 4e4 &&
                                        e.jsxs("div", {
                                          className:
                                            "mt-2 p-3 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800",
                                          children: [
                                            e.jsx("p", {
                                              className:
                                                "text-xs font-bold text-red-700 dark:text-red-300",
                                              children:
                                                "⚠️ ALERTA: Proyección cercana al límite",
                                            }),
                                            e.jsx("p", {
                                              className:
                                                "text-xs text-red-600 dark:text-red-400 mt-1",
                                              children:
                                                "Considera aumentar los intervalos de polling o reducir el número de pestañas abiertas.",
                                            }),
                                          ],
                                        }),
                                    ],
                                  })
                                : e.jsx("div", {
                                    className: "text-center py-4",
                                    children: e.jsx("p", {
                                      className:
                                        "text-sm text-gray-500 dark:text-slate-400",
                                      children:
                                        "Cargando datos de Firestore...",
                                    }),
                                  }),
                            ],
                          }),
                        ],
                      })
                    : null,
                ],
              }),
              e.jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start",
                children: [
                  e.jsxs("div", {
                    className: "lg:hidden flex items-center gap-2",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        onClick: () => ue("activity"),
                        className: `${j} ${$ === "activity" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                        children: "Actividad",
                      }),
                      e.jsx("button", {
                        type: "button",
                        onClick: () => ue("users"),
                        className: `${j} ${$ === "users" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                        children: "Usuarios",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: `lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden ${$ === "activity" ? "block" : "hidden"} lg:block`,
                    children: [
                      e.jsxs("div", {
                        className:
                          "p-5 border-b border-gray-100 dark:border-slate-700",
                        children: [
                          e.jsxs("div", {
                            className:
                              "flex items-start justify-between gap-4 flex-wrap",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("div", {
                                    className:
                                      "p-2.5 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-xl",
                                    children: e.jsx(le, { size: 20 }),
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("h2", {
                                        className:
                                          "text-lg font-bold text-gray-900 dark:text-white",
                                        children: "Actividad",
                                      }),
                                      e.jsx("p", {
                                        className:
                                          "text-sm text-gray-500 dark:text-slate-400",
                                        children:
                                          "Feed de acciones (bonito y sin tanto texto técnico)",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "w-full sm:w-auto",
                                children: [
                                  e.jsxs("div", {
                                    className: "relative",
                                    children: [
                                      e.jsx(at, {
                                        size: 16,
                                        className:
                                          "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                                      }),
                                      e.jsx("input", {
                                        value: G,
                                        onChange: (t) => Oe(t.target.value),
                                        placeholder:
                                          "Buscar por usuario, acción, ruta, versión…",
                                        className:
                                          "w-full sm:w-[360px] pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/30 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("p", {
                                    className:
                                      "mt-1 text-xs text-gray-500 dark:text-slate-400",
                                    children: [
                                      "Mostrando ",
                                      T.length,
                                      " de ",
                                      se.length,
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className:
                              "mt-3 flex items-center justify-between gap-3 flex-wrap",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx("button", {
                                    type: "button",
                                    onClick: () => qe((t) => !t),
                                    className: `${j} ${E ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                                    title: "Actualiza automáticamente",
                                    children: E ? "En vivo" : "Pausado",
                                  }),
                                  e.jsx("span", {
                                    className:
                                      "text-xs text-gray-500 dark:text-slate-400",
                                    children: E
                                      ? "Se actualiza cada 5s"
                                      : "Actualiza manual",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx("button", {
                                    type: "button",
                                    onClick: () => me("desc"),
                                    className: `${j} ${D === "desc" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                                    title: "Ordenar por más recientes",
                                    children: e.jsxs("span", {
                                      className:
                                        "inline-flex items-center gap-1",
                                      children: [
                                        e.jsx(_, { size: 14 }),
                                        "Recientes",
                                      ],
                                    }),
                                  }),
                                  e.jsx("button", {
                                    type: "button",
                                    onClick: () => me("asc"),
                                    className: `${j} ${D === "asc" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                                    title: "Ordenar por más antiguos",
                                    children: e.jsxs("span", {
                                      className:
                                        "inline-flex items-center gap-1",
                                      children: [
                                        e.jsx(F, { size: 14 }),
                                        "Antiguos",
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "mt-4 flex flex-wrap items-center gap-2",
                            children: [
                              e.jsx("button", {
                                type: "button",
                                onClick: () => ge("all"),
                                className: `${j} ${L === "all" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                                children: "Todos",
                              }),
                              ["POST", "PATCH", "DELETE"].map((t) =>
                                e.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => ge(t),
                                    className: `${j} ${L === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                                    children: t,
                                  },
                                  t,
                                ),
                              ),
                              e.jsx("div", {
                                className:
                                  "mx-1 h-5 w-px bg-gray-200 dark:bg-slate-700",
                              }),
                              e.jsx("button", {
                                type: "button",
                                onClick: () => V("all"),
                                className: `${j} ${w === "all" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                                children: "Todo",
                              }),
                              e.jsx("button", {
                                type: "button",
                                onClick: () => V("ok"),
                                className: `${j} ${w === "ok" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                                children: "OK",
                              }),
                              e.jsx("button", {
                                type: "button",
                                onClick: () => V("other"),
                                className: `${j} ${w === "other" ? "bg-rose-600 text-white border-rose-600" : "bg-white dark:bg-slate-900/30 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"}`,
                                children: "Otros",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsx("div", {
                        className: "p-5",
                        children:
                          T.length === 0
                            ? e.jsx("div", {
                                className:
                                  "text-sm text-gray-500 dark:text-slate-400",
                                children: "No hay resultados.",
                              })
                            : e.jsxs("div", {
                                className: "relative",
                                children: [
                                  e.jsx("div", {
                                    className:
                                      "absolute left-4 top-0 bottom-0 w-px bg-gray-100 dark:bg-slate-700",
                                  }),
                                  e.jsx("div", {
                                    className: "space-y-4",
                                    children: T.slice(0, 80).map((t) => {
                                      const s = t.primary,
                                        r = bt(s),
                                        l = String(
                                          s.email || s.uid || "(sin usuario)",
                                        ),
                                        o = De(l),
                                        x = Ge === s.id,
                                        b = Le(s.createdAt),
                                        p = Re(s.createdAt);
                                      return e.jsxs(
                                        "div",
                                        {
                                          className: "relative pl-10",
                                          children: [
                                            e.jsx("div", {
                                              className:
                                                "absolute left-[7px] top-4",
                                              children: e.jsx("div", {
                                                className:
                                                  "w-7 h-7 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center shadow-sm",
                                                children: e.jsx(r, {
                                                  size: 16,
                                                  className:
                                                    "text-slate-700 dark:text-slate-200",
                                                }),
                                              }),
                                            }),
                                            e.jsxs("div", {
                                              className:
                                                "rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 shadow-sm p-4",
                                              children: [
                                                e.jsxs("div", {
                                                  className:
                                                    "flex items-start justify-between gap-3",
                                                  children: [
                                                    e.jsxs("div", {
                                                      className:
                                                        "flex items-start gap-3 min-w-0",
                                                      children: [
                                                        e.jsx("div", {
                                                          className:
                                                            "w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0",
                                                          style: {
                                                            background: `linear-gradient(135deg, hsl(${o} 80% 55%), hsl(${(o + 40) % 360} 80% 45%))`,
                                                          },
                                                          children: Me(l),
                                                        }),
                                                        e.jsxs("div", {
                                                          className: "min-w-0",
                                                          children: [
                                                            e.jsx("p", {
                                                              className:
                                                                "text-sm sm:text-base font-extrabold text-gray-900 dark:text-white truncate",
                                                              children:
                                                                s.actionLabel ||
                                                                "Acción",
                                                            }),
                                                            e.jsxs("p", {
                                                              className:
                                                                "text-xs text-gray-500 dark:text-slate-400 truncate",
                                                              children: [
                                                                l,
                                                                s.appVersion
                                                                  ? ` · v${s.appVersion}`
                                                                  : "",
                                                                s.appPath
                                                                  ? ` · ${s.appPath}`
                                                                  : "",
                                                                p
                                                                  ? ` · ${p}`
                                                                  : "",
                                                                b
                                                                  ? ` · ${b}`
                                                                  : "",
                                                              ],
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                    e.jsxs("div", {
                                                      className:
                                                        "flex items-center gap-2 shrink-0",
                                                      children: [
                                                        s.method
                                                          ? e.jsx("span", {
                                                              className: `inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 ${mt(s.method)}`,
                                                              children: String(
                                                                s.method,
                                                              ).toUpperCase(),
                                                            })
                                                          : null,
                                                        e.jsx("span", {
                                                          className: `inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 ${ut(s.status)}`,
                                                          children:
                                                            typeof s.status ==
                                                            "number"
                                                              ? s.status
                                                              : "",
                                                        }),
                                                        t.count > 1
                                                          ? e.jsxs("span", {
                                                              className:
                                                                "inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200 border-indigo-200/60 dark:border-indigo-900/40",
                                                              children: [
                                                                "x",
                                                                t.count,
                                                              ],
                                                            })
                                                          : null,
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                e.jsxs("div", {
                                                  className:
                                                    "mt-3 flex flex-wrap items-center gap-2",
                                                  children: [
                                                    typeof s.durationMs ==
                                                    "number"
                                                      ? e.jsx("span", {
                                                          className: h,
                                                          children: e.jsxs(
                                                            "span",
                                                            {
                                                              className:
                                                                "inline-flex items-center gap-1",
                                                              children: [
                                                                e.jsx(nt, {
                                                                  size: 14,
                                                                }),
                                                                s.durationMs,
                                                                "ms",
                                                              ],
                                                            },
                                                          ),
                                                        })
                                                      : null,
                                                    Array.isArray(s.bodyKeys) &&
                                                    s.bodyKeys.length > 0
                                                      ? e.jsxs("span", {
                                                          className: h,
                                                          children: [
                                                            s.bodyKeys.length,
                                                            " campos",
                                                          ],
                                                        })
                                                      : null,
                                                    s.resourceId
                                                      ? e.jsxs("span", {
                                                          className: h,
                                                          children: [
                                                            "id:",
                                                            xt(s.resourceId),
                                                          ],
                                                        })
                                                      : null,
                                                  ],
                                                }),
                                                e.jsx("div", {
                                                  className: "mt-3",
                                                  children: e.jsxs("button", {
                                                    type: "button",
                                                    className: de,
                                                    onClick: () =>
                                                      We((f) =>
                                                        f === s.id
                                                          ? null
                                                          : s.id,
                                                      ),
                                                    children: [
                                                      x
                                                        ? e.jsx(F, { size: 16 })
                                                        : e.jsx(_, {
                                                            size: 16,
                                                          }),
                                                      "Detalles",
                                                    ],
                                                  }),
                                                }),
                                                x
                                                  ? e.jsxs("div", {
                                                      className:
                                                        "mt-3 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white/70 dark:bg-slate-900/30 p-4 space-y-3",
                                                      children: [
                                                        e.jsxs("div", {
                                                          className:
                                                            "text-xs text-gray-500 dark:text-slate-400 break-words",
                                                          children: [
                                                            s.path
                                                              ? e.jsxs("div", {
                                                                  children: [
                                                                    e.jsx(
                                                                      "span",
                                                                      {
                                                                        className:
                                                                          "font-semibold text-gray-700 dark:text-slate-200",
                                                                        children:
                                                                          "Ruta:",
                                                                      },
                                                                    ),
                                                                    " ",
                                                                    s.path,
                                                                  ],
                                                                })
                                                              : null,
                                                            s.actionCode
                                                              ? e.jsxs("div", {
                                                                  children: [
                                                                    e.jsx(
                                                                      "span",
                                                                      {
                                                                        className:
                                                                          "font-semibold text-gray-700 dark:text-slate-200",
                                                                        children:
                                                                          "Código:",
                                                                      },
                                                                    ),
                                                                    " ",
                                                                    s.actionCode,
                                                                  ],
                                                                })
                                                              : null,
                                                            s.referer
                                                              ? e.jsxs("div", {
                                                                  children: [
                                                                    e.jsx(
                                                                      "span",
                                                                      {
                                                                        className:
                                                                          "font-semibold text-gray-700 dark:text-slate-200",
                                                                        children:
                                                                          "Referer:",
                                                                      },
                                                                    ),
                                                                    " ",
                                                                    s.referer,
                                                                  ],
                                                                })
                                                              : null,
                                                          ],
                                                        }),
                                                        Array.isArray(
                                                          s.bodyKeys,
                                                        ) &&
                                                        s.bodyKeys.length > 0
                                                          ? e.jsxs("div", {
                                                              className:
                                                                "flex flex-wrap gap-2",
                                                              children: [
                                                                s.bodyKeys
                                                                  .slice(0, 16)
                                                                  .map((f) =>
                                                                    e.jsx(
                                                                      "span",
                                                                      {
                                                                        className:
                                                                          h,
                                                                        children:
                                                                          f,
                                                                      },
                                                                      f,
                                                                    ),
                                                                  ),
                                                                s.bodyKeys
                                                                  .length > 16
                                                                  ? e.jsxs(
                                                                      "span",
                                                                      {
                                                                        className:
                                                                          h,
                                                                        children:
                                                                          [
                                                                            "+",
                                                                            s
                                                                              .bodyKeys
                                                                              .length -
                                                                              16,
                                                                          ],
                                                                      },
                                                                    )
                                                                  : null,
                                                              ],
                                                            })
                                                          : null,
                                                      ],
                                                    })
                                                  : null,
                                              ],
                                            }),
                                          ],
                                        },
                                        s.id,
                                      );
                                    }),
                                  }),
                                ],
                              }),
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: `bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden ${$ === "users" ? "block" : "hidden"} lg:block`,
                    children: [
                      e.jsx("div", {
                        className:
                          "p-5 border-b border-gray-100 dark:border-slate-700",
                        children: e.jsxs("div", {
                          className:
                            "flex items-start justify-between gap-3 flex-wrap",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-3",
                              children: [
                                e.jsx("div", {
                                  className:
                                    "p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl",
                                  children: e.jsx(dt, { size: 20 }),
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("h2", {
                                      className:
                                        "text-lg font-bold text-gray-900 dark:text-white",
                                      children: "Últimas conexiones",
                                    }),
                                    e.jsx("p", {
                                      className:
                                        "text-sm text-gray-500 dark:text-slate-400",
                                      children:
                                        "Quién está en línea + última vez + versión",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => He((t) => !t),
                              className: de,
                              title: "Mostrar más/menos usuarios",
                              children: [
                                W
                                  ? e.jsx(F, { size: 16 })
                                  : e.jsx(_, { size: 16 }),
                                W ? "Ver menos" : "Ver más",
                              ],
                            }),
                          ],
                        }),
                      }),
                      e.jsx("div", {
                        className: "p-5",
                        children:
                          v.length === 0
                            ? e.jsx("div", {
                                className:
                                  "text-sm text-gray-500 dark:text-slate-400",
                                children: "Sin datos aún.",
                              })
                            : e.jsx("div", {
                                className: "max-h-[820px] overflow-auto pr-1",
                                children: e.jsx("div", {
                                  className: "grid grid-cols-1 gap-4",
                                  children: v
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
                                        re = new Date()
                                          .toISOString()
                                          .slice(0, 10),
                                        Je = new Date(
                                          Date.now() - 1440 * 60 * 1e3,
                                        )
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
                                      return e.jsxs(
                                        "div",
                                        {
                                          className:
                                            "rounded-2xl border border-gray-100 dark:border-slate-700 bg-gradient-to-b from-white to-gray-50/40 dark:from-slate-800 dark:to-slate-900/20 shadow-sm p-4",
                                          children: [
                                            e.jsxs("div", {
                                              className:
                                                "flex items-start justify-between gap-3",
                                              children: [
                                                e.jsxs("div", {
                                                  className:
                                                    "flex items-center gap-3 min-w-0",
                                                  children: [
                                                    e.jsxs("div", {
                                                      className:
                                                        "relative w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0",
                                                      style: {
                                                        background: `linear-gradient(135deg, hsl(${o} 80% 55%), hsl(${(o + 40) % 360} 80% 45%))`,
                                                      },
                                                      children: [
                                                        Me(r),
                                                        s &&
                                                          e.jsx("span", {
                                                            className:
                                                              "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800",
                                                          }),
                                                      ],
                                                    }),
                                                    e.jsxs("div", {
                                                      className: "min-w-0",
                                                      children: [
                                                        e.jsxs("div", {
                                                          className:
                                                            "flex items-center gap-2 min-w-0",
                                                          children: [
                                                            e.jsx("p", {
                                                              className:
                                                                "text-sm font-semibold text-gray-900 dark:text-white truncate",
                                                              children: r,
                                                            }),
                                                            s &&
                                                              e.jsx("span", {
                                                                className:
                                                                  "inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-900/40 whitespace-nowrap",
                                                                children:
                                                                  "En línea",
                                                              }),
                                                          ],
                                                        }),
                                                        e.jsx("p", {
                                                          className:
                                                            "text-xs text-gray-500 dark:text-slate-400 truncate",
                                                          children: l,
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                x.label
                                                  ? e.jsx("span", {
                                                      className: `inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] leading-5 whitespace-nowrap ${x.cls}`,
                                                      children: x.label,
                                                    })
                                                  : null,
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              className:
                                                "mt-3 flex flex-wrap items-center gap-2",
                                              children: [
                                                e.jsxs("span", {
                                                  className: h,
                                                  children: [
                                                    e.jsx("span", {
                                                      className:
                                                        "text-gray-500 dark:text-slate-400 mr-1",
                                                      children: "Última vez:",
                                                    }),
                                                    b ? `${b} · ` : "",
                                                    p,
                                                  ],
                                                }),
                                                Se !== null
                                                  ? e.jsxs("span", {
                                                      className: h,
                                                      children: [
                                                        e.jsx("span", {
                                                          className:
                                                            "text-gray-500 dark:text-slate-400 mr-1",
                                                          children: "Hoy:",
                                                        }),
                                                        C(Se),
                                                        $e !== null
                                                          ? ` · ${$e} req`
                                                          : "",
                                                        ae !== null && ae > 0
                                                          ? ` · ${ae} meta`
                                                          : "",
                                                      ],
                                                    })
                                                  : null,
                                                Ae !== null
                                                  ? e.jsxs("span", {
                                                      className: h,
                                                      children: [
                                                        e.jsx("span", {
                                                          className:
                                                            "text-gray-500 dark:text-slate-400 mr-1",
                                                          children: "Ayer:",
                                                        }),
                                                        C(Ae),
                                                      ],
                                                    })
                                                  : null,
                                                M !== null
                                                  ? e.jsxs("span", {
                                                      className: h,
                                                      children: [
                                                        e.jsx("span", {
                                                          className:
                                                            "text-gray-500 dark:text-slate-400 mr-1",
                                                          children: "Consumo:",
                                                        }),
                                                        C(M),
                                                      ],
                                                    })
                                                  : null,
                                                t.lastSeenPath
                                                  ? e.jsx("span", {
                                                      className: h,
                                                      children: t.lastSeenPath,
                                                    })
                                                  : null,
                                                e.jsxs("span", {
                                                  className: h,
                                                  children: [
                                                    "v",
                                                    t.lastSeenVersion || "?",
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        },
                                        t.uid,
                                      );
                                    }),
                                }),
                              }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        : e.jsx("div", {
            className: "max-w-4xl mx-auto space-y-4",
            children: e.jsx("div", {
              className:
                "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5",
              children: e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  e.jsx("div", {
                    className:
                      "p-2.5 bg-gradient-to-br from-slate-600 to-slate-800 text-white rounded-xl",
                    children: e.jsx(ne, { size: 20 }),
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("h1", {
                        className:
                          "text-xl font-bold text-gray-900 dark:text-white",
                        children: "Historial de la aplicación",
                      }),
                      e.jsx("p", {
                        className: "text-sm text-gray-500 dark:text-slate-400",
                        children:
                          "Esta vista depende del modo BFF (producción).",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          })
      : e.jsx("div", {
          className: "max-w-4xl mx-auto space-y-4",
          children: e.jsxs("div", {
            className:
              "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  e.jsx("div", {
                    className:
                      "p-2.5 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl",
                    children: e.jsx(Ce, { size: 20 }),
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("h1", {
                        className:
                          "text-xl font-bold text-gray-900 dark:text-white",
                        children: "Acceso restringido",
                      }),
                      e.jsx("p", {
                        className: "text-sm text-gray-500 dark:text-slate-400",
                        children:
                          "Solo Master Admin puede ver el historial de la aplicación.",
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx("div", {
                className: "mt-4",
                children: e.jsx("button", {
                  type: "button",
                  onClick: () => a("/dashboard"),
                  className:
                    "px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700",
                  children: "Volver al Panel",
                }),
              }),
            ],
          }),
        });
  };
export { wt as AppHistory };
