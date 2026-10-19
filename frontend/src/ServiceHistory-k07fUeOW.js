import { j as e } from "./index-BU_ZgoWo.js";
import { r as c } from "./vendor-react-BwINE3B3.js";
import { f as ne } from "./roleUtils-BDLO6O1S.js";
import { P as Se } from "./LoadingSpinner-DQ5LcqWB.js";
import {
  H as ie,
  I as le,
  K as oe,
  Y as Ee,
  E as Ce,
  Z as Le,
} from "./vendor-firebase-BjYbfC3F.js";
import { u as Oe, i as K, c as Ie, e as de, f as Me } from "./App-BPrQ3EPG.js";
import {
  H as ce,
  ai as ze,
  x as Q,
  C as O,
  X as $,
  d as me,
  s as ue,
  n as Ae,
  t as $e,
  k as xe,
  T as Re,
  u as Fe,
} from "./vendor-ui-CnvYSvQL.js";
import "./vendor-pdf-Cf03QSry.js";
const fe = (b, R) => {
    if (!b) return "";
    const [I, p, F] = b.split("-").map(Number);
    return new Date(I, p - 1, F).toLocaleDateString("es-ES", R);
  },
  qe = () => {
    const { user: b } = Oe(),
      [R, I] = c.useState(!0),
      [p, F] = c.useState([]),
      [D, B] = c.useState([]),
      [S, V] = c.useState([]),
      X = new Date(),
      ge = String(X.getFullYear()),
      he = String(X.getMonth() + 1).padStart(2, "0"),
      [u, H] = c.useState(he),
      [m, M] = c.useState(ge),
      [h, y] = c.useState("all"),
      [W, T] = c.useState(!1),
      [Y, E] = c.useState(!1),
      [P, w] = c.useState(!1),
      G = c.useRef(null),
      J = c.useRef(null),
      _ = c.useRef(null),
      x = c.useRef(!1),
      k = c.useRef(!1),
      z = c.useRef(null),
      N = () => {
        x.current && k.current && I(!1);
      };
    (c.useEffect(() => {
      const t = (s) => {
        (G.current && !G.current.contains(s.target) && T(!1),
          J.current && !J.current.contains(s.target) && E(!1),
          _.current && !_.current.contains(s.target) && w(!1));
      };
      return (
        document.addEventListener("mousedown", t),
        () => document.removeEventListener("mousedown", t)
      );
    }, []),
      c.useEffect(() => {
        if (!b) return;
        if (K()) {
          let r = !1,
            a = !1,
            n = 0;
          const i = async (g) => {
            const v = !!g?.force;
            try {
              if (r || a) return;
              const j = Date.now();
              if (!v && j - n < 3e4) return;
              a = !0;
              const L = await Me("/api/service-history");
              if (r) return;
              (V(L.assignments || []),
                B(L.events || []),
                (n = Date.now()),
                k.current || (k.current = !0),
                x.current || (x.current = !0),
                N());
            } catch (j) {
              if (r) return;
              (console.error("Error fetching service history (BFF):", j),
                k.current || (k.current = !0),
                x.current || (x.current = !0),
                N());
            } finally {
              a = !1;
            }
          };
          (i({ force: !0 }), (z.current = () => void i({ force: !0 })));
          const l = () => void i({ force: !0 }),
            o = () => void i({ force: !0 }),
            d = () => {
              document.visibilityState === "visible" && i({ force: !0 });
            };
          return (
            window.addEventListener("focus", l),
            window.addEventListener("online", o),
            document.addEventListener("visibilitychange", d),
            () => {
              ((r = !0),
                (z.current = null),
                window.removeEventListener("focus", l),
                window.removeEventListener("online", o),
                document.removeEventListener("visibilitychange", d));
            }
          );
        }
        const s = (async () => {
          const r = le(Le(de, "assignments"), oe("userId", "==", b.uid));
          return ie(
            r,
            (n) => {
              const i = n.docs.map((l) => {
                const o = l.ref.parent.parent?.id;
                return { id: l.id, eventId: o, ...l.data() };
              });
              (i.sort((l, o) => {
                const d = l.eventDate || "";
                return (o.eventDate || "").localeCompare(d);
              }),
                V(i),
                k.current || ((k.current = !0), N()));
            },
            (n) => {
              (console.error("Error listening to assignments:", n),
                k.current || ((k.current = !0), N()));
            },
          );
        })();
        return () => {
          s.then((r) => r && r());
        };
      }, [b]),
      Ie({
        enabled: K() && !!b,
        resources: ["attendance", "assignments", "events", "service-history"],
        onChange: () => {
          z.current?.();
        },
        debounceMs: 900,
      }),
      c.useEffect(() => {
        const t = (s) => {
          if (s.data?.type === "DATA_CHANGED") {
            const r = s.data.resources || [],
              a = ["attendance", "assignments", "events", "service-history"];
            r.some((i) => a.includes(i)) &&
              (console.log(
                "[ServiceHistory] 📲 Push detectó cambios - refrescando...",
              ),
              z.current?.());
          }
        };
        return (
          navigator.serviceWorker?.addEventListener("message", t),
          () => {
            navigator.serviceWorker?.removeEventListener("message", t);
          }
        );
      }, []),
      c.useEffect(() => {
        if (!b || K()) return;
        const t = Array.from(
          new Set(
            S.map((i) => i.eventId).filter(
              (i) => typeof i == "string" && i.length > 0,
            ),
          ),
        );
        if (((x.current = !1), I(!0), t.length === 0)) {
          (B([]), (x.current = !0), N());
          return;
        }
        const s = (i, l) => {
            const o = [];
            for (let d = 0; d < i.length; d += l) o.push(i.slice(d, d + l));
            return o;
          },
          r = new Map(),
          n = s(t, 10).map((i) =>
            ie(
              le(Ce(de, "events"), oe(Ee(), "in", i)),
              (l) => {
                l.docs.forEach((d) => {
                  r.set(d.id, { id: d.id, ...d.data() });
                });
                const o = t.map((d) => r.get(d)).filter(Boolean);
                (B(o), x.current || ((x.current = !0), N()));
              },
              (l) => {
                (console.error("Error listening to events for assignments:", l),
                  x.current || ((x.current = !0), N()));
              },
            ),
          );
        return () => {
          n.forEach((i) => i());
        };
      }, [b, S]),
      c.useEffect(() => {
        if (D.length === 0 && S.length === 0) return;
        const t = (a) => {
            if (a.status === "completed") return !0;
            if (a.endTime && a.date) {
              const [n, i, l] = a.date.split("-").map(Number),
                [o, d] = a.endTime.split(":").map(Number),
                g = new Date(n, i - 1, l, o, d),
                v = new Date(g.getTime() + 7200 * 1e3);
              return new Date() > v;
            }
            return !1;
          },
          s = new Set(D.map((a) => a.id)),
          r = S.filter((a) => s.has(a.eventId))
            .map((a) => {
              const n = D.find((o) => o.id === a.eventId);
              if (!n) return null;
              let i = "pending";
              const l = t(n);
              return (
                a.checkInTime && a.checkOutTime
                  ? (i = "completed")
                  : !a.checkInTime && a.checkOutTime
                    ? (i = "no-checkin")
                    : a.checkInTime && !a.checkOutTime
                      ? l
                        ? (i = "no-checkout")
                        : (i = "in-service")
                      : !a.checkInTime &&
                        !a.checkOutTime &&
                        l &&
                        (i = "absent"),
                {
                  ...a,
                  eventTitle: n.title,
                  eventDate: n.date,
                  eventTime: n.time,
                  serviceTime: n.serviceTime || null,
                  endTime: n.endTime || null,
                  eventLocation: n.location || "Sin ubicación",
                  eventStatus: n.status,
                  status: i,
                }
              );
            })
            .filter(Boolean);
        (r.sort(
          (a, n) =>
            new Date(n.eventDate).getTime() - new Date(a.eventDate).getTime(),
        ),
          F(r));
      }, [D, S]));
    const Z = (t) => {
        const [s, r, a] = t.split("-").map(Number),
          i = (new Date(s, r - 1, 1).getDay() + 6) % 7;
        return Math.ceil((a + i) / 7);
      },
      q = p.filter((t) => {
        if (!t.eventDate) return !1;
        const [s, r] = t.eventDate.split("-"),
          a = m === "all" || s === m,
          n = u === "all" || r === u;
        let i = !0;
        return (
          h !== "all" &&
            u !== "all" &&
            t.eventDate &&
            (i = Z(t.eventDate).toString() === h),
          a && n && i
        );
      }),
      U = (t, s) => {
        if (!t) return new Date(NaN);
        const [r, a, n] = t.split("-").map(Number);
        if (!s) return new Date(r, a - 1, n, 23, 59);
        const [i, l] = s.split(":").map(Number);
        return new Date(r, a - 1, n, i || 0, l || 0);
      },
      be = (t, s, r, a) => {
        const n = U(t, a || r || s || void 0);
        return new Date(n.getTime() + 10800 * 1e3);
      },
      pe = (t, s, r, a) => {
        if (a === "completed") return !0;
        const n = s || r;
        if (n && t) {
          const [i, l, o] = t.split("-").map(Number),
            [d, g] = n.split(":").map(Number),
            v = new Date(i, l - 1, o, d, g),
            j = new Date(v.getTime() + 7200 * 1e3);
          return new Date() > j;
        }
        return !1;
      },
      ke = (t, s, r, a) => {
        if (!t || !s) return !1;
        const n = new Date(t),
          i = n.getHours(),
          l = n.getMinutes(),
          o = i * 60 + l,
          d = a || r;
        if (!d) return !1;
        const [g, v] = d.split(":").map(Number),
          L = g * 60 + v - 30;
        return o >= L;
      },
      ve = (t, s, r, a, n) => {
        if (!t || !s) return !1;
        const i = new Date(t),
          l = i.getHours(),
          o = i.getMinutes(),
          d = l * 60 + o,
          g = r || a || n;
        if (!g) return !1;
        const [v, j] = g.split(":").map(Number),
          De = v * 60 + j + 90;
        return d >= De;
      },
      ee = (t) => {
        const s = new Map();
        for (const r of t) {
          const a = r.eventId || `${r.eventDate}|${r.eventTitle}`,
            n = s.get(a);
          n ? n.push(r) : s.set(a, [r]);
        }
        return Array.from(s.values()).map((r) => {
          const a = r[0],
            n = r
              .map((l) => l.checkInTime)
              .filter(Boolean)
              .sort((l, o) => new Date(l).getTime() - new Date(o).getTime())[0],
            i = r
              .map((l) => l.checkOutTime)
              .filter(Boolean)
              .sort((l, o) => new Date(o).getTime() - new Date(l).getTime())[0];
          return { ...a, checkInTime: n, checkOutTime: i };
        });
      },
      we = ee(p).sort(
        (t, s) =>
          new Date(s.eventDate).getTime() - new Date(t.eventDate).getTime(),
      ),
      te = ee(q).sort(
        (t, s) =>
          new Date(s.eventDate).getTime() - new Date(t.eventDate).getTime(),
      ),
      je = te.filter((t) => t.checkInTime || t.checkOutTime).length,
      ye = te.filter((t) => {
        if (t.eventStatus === "completed")
          return !t.checkInTime && !t.checkOutTime;
        if (t.eventStatus === "active") return !1;
        const s = be(t.eventDate, t.serviceTime, t.eventTime, t.endTime);
        return new Date() > s && !t.checkInTime && !t.checkOutTime;
      }).length;
    let f = 0;
    we.forEach((t) => {
      const s = pe(t.eventDate, t.endTime, t.eventTime, t.eventStatus),
        r = U(t.eventDate, t.eventTime || t.serviceTime),
        a = !!t.checkOutTime,
        n = new Date() > r,
        i = a || s;
      (t.checkInTime
        ? ke(t.checkInTime, t.eventDate, t.serviceTime, t.eventTime) &&
          (f += 0.25)
        : (i || n) && (f += 0.5),
        !t.checkOutTime && s
          ? (f += 0.5)
          : t.checkOutTime &&
            ve(
              t.checkOutTime,
              t.eventDate,
              t.endTime,
              t.eventTime,
              t.serviceTime,
            ) &&
            (f += 0.25));
    });
    const Ne = Math.min((f / 10) * 100, 100),
      re =
        u !== "all" && m !== "all"
          ? [
              ...new Set(
                p
                  .filter((t) => {
                    if (!t.eventDate) return !1;
                    const [s, r] = t.eventDate.split("-");
                    return s === m && r === u;
                  })
                  .map((t) => Z(t.eventDate)),
              ),
            ].sort((t, s) => t - s)
          : [],
      C = Array.from(new Set([...p.map((t) => t.eventDate.split("-")[0]), m]))
        .filter((t) => t !== "all" && !isNaN(Number(t)))
        .sort((t, s) => Number(s) - Number(t)),
      se = q.reduce((t, s) => {
        const [r, a] = s.eventDate.split("-"),
          n = `${r}-${a}`;
        return (
          t[n] ||
            (t[n] = {
              label: fe(s.eventDate, { month: "long", year: "numeric" }),
              assignments: [],
            }),
          t[n].assignments.push(s),
          t
        );
      }, {}),
      Te = {
        "01": "Enero",
        "02": "Febrero",
        "03": "Marzo",
        "04": "Abril",
        "05": "Mayo",
        "06": "Junio",
        "07": "Julio",
        "08": "Agosto",
        "09": "Septiembre",
        10: "Octubre",
        11: "Noviembre",
        12: "Diciembre",
      },
      A = (() => {
        const t = new Set();
        return (
          p.forEach((s) => {
            if (!s.eventDate) return;
            const [r, a] = s.eventDate.split("-");
            a && ((m !== "all" && r !== m) || t.add(a));
          }),
          Array.from(t).sort((s, r) => Number(s) - Number(r))
        );
      })(),
      ae = [
        { value: "all", label: "Todos los meses" },
        ...A.map((t) => ({ value: t, label: Te[t] || t })),
      ];
    return (
      c.useEffect(() => {
        (m !== "all" && C.length > 0 && (C.includes(m) || M(C[0])),
          u !== "all" && A.length > 0 && (A.includes(u) || H("all")));
      }, [C, A, m, u]),
      c.useEffect(() => {
        (y("all"), w(!1));
      }, [m, u]),
      R
        ? e.jsx(Se, { text: "Cargando historial..." })
        : e.jsxs("div", {
            className: "space-y-6",
            children: [
              e.jsx("div", {
                className:
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                children: e.jsxs("div", {
                  className: "flex items-center gap-4",
                  children: [
                    e.jsx("div", {
                      className:
                        "w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg",
                      children: e.jsx(ce, { size: 24 }),
                    }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("h1", {
                          className:
                            "text-2xl font-bold text-gray-900 dark:text-white",
                          children: "Historial de Servicios",
                        }),
                        e.jsxs("p", {
                          className:
                            "text-gray-500 dark:text-slate-400 text-sm",
                          children: [
                            p.length,
                            " servicio",
                            p.length !== 1 ? "s" : "",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              e.jsxs("div", {
                className:
                  "flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm",
                children: [
                  e.jsxs("div", {
                    className:
                      "flex items-center gap-2 text-gray-500 dark:text-slate-400",
                    children: [
                      e.jsx(ze, { size: 18 }),
                      e.jsx("span", {
                        className: "text-sm font-medium",
                        children: "Filtrar por:",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "relative",
                    ref: G,
                    children: [
                      e.jsxs("button", {
                        onClick: () => {
                          (T(!W), E(!1));
                        },
                        className:
                          "flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[140px] justify-between",
                        children: [
                          e.jsx("span", {
                            children: m === "all" ? "Todos los años" : m,
                          }),
                          e.jsx(Q, {
                            size: 16,
                            className: `text-gray-400 transition-transform ${W ? "rotate-180" : ""}`,
                          }),
                        ],
                      }),
                      W &&
                        e.jsxs("div", {
                          className:
                            "absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto",
                          children: [
                            e.jsxs("button", {
                              onClick: () => {
                                (M("all"), y("all"), w(!1), T(!1));
                              },
                              className: `w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${m === "all" ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 font-semibold" : "text-gray-700 dark:text-slate-200"}`,
                              children: [
                                "Todos los años",
                                m === "all" &&
                                  e.jsx(O, {
                                    size: 16,
                                    className:
                                      "text-indigo-600 dark:text-indigo-400",
                                  }),
                              ],
                            }),
                            C.map((t) =>
                              e.jsxs(
                                "button",
                                {
                                  onClick: () => {
                                    (M(t), y("all"), w(!1), T(!1));
                                  },
                                  className: `w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${m === t ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 font-semibold" : "text-gray-700 dark:text-slate-200"}`,
                                  children: [
                                    t,
                                    m === t &&
                                      e.jsx(O, {
                                        size: 16,
                                        className:
                                          "text-indigo-600 dark:text-indigo-400",
                                      }),
                                  ],
                                },
                                t,
                              ),
                            ),
                          ],
                        }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "relative",
                    ref: J,
                    children: [
                      e.jsxs("button", {
                        onClick: () => {
                          (E(!Y), T(!1));
                        },
                        className:
                          "flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[160px] justify-between",
                        children: [
                          e.jsx("span", {
                            children:
                              ae.find((t) => t.value === u)?.label ||
                              "Todos los meses",
                          }),
                          e.jsx(Q, {
                            size: 16,
                            className: `text-gray-400 transition-transform ${Y ? "rotate-180" : ""}`,
                          }),
                        ],
                      }),
                      Y &&
                        e.jsx("div", {
                          className:
                            "absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto",
                          children: ae.map((t) =>
                            e.jsxs(
                              "button",
                              {
                                onClick: () => {
                                  (H(t.value),
                                    t.value === "all" && (y("all"), w(!1)),
                                    E(!1));
                                },
                                className: `w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${u === t.value ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 font-semibold" : "text-gray-700 dark:text-slate-200"}`,
                                children: [
                                  t.label,
                                  u === t.value &&
                                    e.jsx(O, {
                                      size: 16,
                                      className:
                                        "text-indigo-600 dark:text-indigo-400",
                                    }),
                                ],
                              },
                              t.value,
                            ),
                          ),
                        }),
                    ],
                  }),
                  u !== "all" &&
                    m !== "all" &&
                    re.length > 0 &&
                    e.jsxs("div", {
                      className: "relative",
                      ref: _,
                      children: [
                        e.jsxs("button", {
                          onClick: () => {
                            (w(!P), T(!1), E(!1));
                          },
                          className:
                            "flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[160px] justify-between",
                          children: [
                            e.jsx("span", {
                              children:
                                h === "all"
                                  ? "Todas las semanas"
                                  : `Semana ${h}`,
                            }),
                            e.jsx(Q, {
                              size: 16,
                              className: `text-gray-400 transition-transform ${P ? "rotate-180" : ""}`,
                            }),
                          ],
                        }),
                        P &&
                          e.jsxs("div", {
                            className:
                              "absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto",
                            children: [
                              e.jsxs("button", {
                                onClick: () => {
                                  (y("all"), w(!1));
                                },
                                className: `w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${h === "all" ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 font-semibold" : "text-gray-700 dark:text-slate-200"}`,
                                children: [
                                  "Todas las semanas",
                                  h === "all" &&
                                    e.jsx(O, {
                                      size: 16,
                                      className:
                                        "text-indigo-600 dark:text-indigo-400",
                                    }),
                                ],
                              }),
                              re.map((t) =>
                                e.jsxs(
                                  "button",
                                  {
                                    onClick: () => {
                                      (y(t.toString()), w(!1));
                                    },
                                    className: `w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${h === t.toString() ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 font-semibold" : "text-gray-700 dark:text-slate-200"}`,
                                    children: [
                                      "Semana ",
                                      t,
                                      h === t.toString() &&
                                        e.jsx(O, {
                                          size: 16,
                                          className:
                                            "text-indigo-600 dark:text-indigo-400",
                                        }),
                                    ],
                                  },
                                  t,
                                ),
                              ),
                            ],
                          }),
                      ],
                    }),
                  (m !== "all" || u !== "all" || h !== "all") &&
                    e.jsxs("button", {
                      onClick: () => {
                        (M("all"), H("all"), y("all"));
                      },
                      className:
                        "flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-lg transition-colors",
                      children: [e.jsx($, { size: 16 }), "Limpiar"],
                    }),
                ],
              }),
              e.jsx("div", {
                className:
                  "bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm",
                children: e.jsxs("div", {
                  className:
                    "flex flex-wrap items-center justify-center gap-4 sm:gap-6",
                  children: [
                    e.jsxs("div", {
                      className:
                        "text-center min-w-[96px] flex flex-col items-center",
                      children: [
                        e.jsx("div", {
                          className:
                            "w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-1",
                          children: e.jsx("span", {
                            className:
                              "text-2xl font-bold text-indigo-600 dark:text-indigo-400",
                            children: q.length,
                          }),
                        }),
                        e.jsx("p", {
                          className:
                            "max-w-[96px] text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium leading-tight",
                          children:
                            m !== "all" || u !== "all" || h !== "all"
                              ? "Servicios filtrados"
                              : "Servicios totales",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "text-center",
                      children: [
                        e.jsx("div", {
                          className:
                            "w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-1",
                          children: e.jsx("span", {
                            className:
                              "text-2xl font-bold text-green-600 dark:text-green-400",
                            children: je,
                          }),
                        }),
                        e.jsx("p", {
                          className:
                            "text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium",
                          children: "Asist.",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "text-center",
                      children: [
                        e.jsx("div", {
                          className:
                            "w-14 h-14 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-1",
                          children: e.jsx("span", {
                            className:
                              "text-2xl font-bold text-red-600 dark:text-red-400",
                            children: ye,
                          }),
                        }),
                        e.jsx("p", {
                          className:
                            "text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium",
                          children: "Faltas",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "text-center min-w-[96px]",
                      children: [
                        e.jsxs("div", {
                          className:
                            "relative w-full h-14 flex flex-col items-center justify-center",
                          children: [
                            e.jsx("span", {
                              className: `text-2xl font-bold ${f >= 10 ? "text-red-600 dark:text-red-400" : f >= 5 ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-slate-300"}`,
                              children: Number.isFinite(f)
                                ? f.toFixed(2)
                                : "0.00",
                            }),
                            e.jsx("div", {
                              className:
                                "w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full mt-1 overflow-hidden",
                              children: e.jsx("div", {
                                className: `h-full rounded-full transition-all ${f >= 10 ? "bg-red-500" : f >= 5 ? "bg-amber-500" : "bg-green-500"}`,
                                style: { width: `${Ne}%` },
                              }),
                            }),
                          ],
                        }),
                        e.jsx("p", {
                          className:
                            "text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium",
                          children: "Strikes",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              Object.keys(se).length > 0
                ? e.jsx("div", {
                    className: "space-y-8",
                    children: Object.entries(se).map(([t, s]) =>
                      e.jsxs(
                        "div",
                        {
                          children: [
                            e.jsxs("h3", {
                              className:
                                "text-xl font-bold text-gray-900 dark:text-white mb-5 capitalize flex items-center gap-2",
                              children: [
                                e.jsx("div", {
                                  className:
                                    "w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full",
                                }),
                                s.label,
                              ],
                            }),
                            e.jsx("div", {
                              className: "grid gap-4",
                              children: s.assignments.map((r) =>
                                e.jsx(
                                  "div",
                                  {
                                    className:
                                      "group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300",
                                    children: e.jsxs("div", {
                                      className:
                                        "flex items-start justify-between gap-4",
                                      children: [
                                        e.jsxs("div", {
                                          className: "flex-1 min-w-0",
                                          children: [
                                            e.jsx("h4", {
                                              className:
                                                "text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3",
                                              children: r.eventTitle,
                                            }),
                                            e.jsxs("div", {
                                              className:
                                                "flex flex-wrap items-center gap-2 mb-4",
                                              children: [
                                                e.jsx("span", {
                                                  className:
                                                    "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200",
                                                  children: r.areaName,
                                                }),
                                                ne(r.roleName) &&
                                                  e.jsx("span", {
                                                    className:
                                                      "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
                                                    children: ne(r.roleName),
                                                  }),
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              className: "space-y-2.5",
                                              children: [
                                                e.jsxs("div", {
                                                  className:
                                                    "flex items-center gap-3 text-sm",
                                                  children: [
                                                    e.jsx("div", {
                                                      className:
                                                        "w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0",
                                                      children: e.jsx(me, {
                                                        size: 16,
                                                        className:
                                                          "text-indigo-500 dark:text-indigo-400",
                                                      }),
                                                    }),
                                                    e.jsx("span", {
                                                      className:
                                                        "text-gray-700 dark:text-slate-300 font-medium",
                                                      children: fe(
                                                        r.eventDate,
                                                        {
                                                          weekday: "short",
                                                          day: "numeric",
                                                          month: "short",
                                                        },
                                                      ),
                                                    }),
                                                  ],
                                                }),
                                                e.jsxs("div", {
                                                  className:
                                                    "flex items-center gap-3 text-sm",
                                                  children: [
                                                    e.jsx("div", {
                                                      className:
                                                        "w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0",
                                                      children: e.jsx(ue, {
                                                        size: 16,
                                                        className:
                                                          "text-emerald-500 dark:text-emerald-400",
                                                      }),
                                                    }),
                                                    e.jsxs("div", {
                                                      className:
                                                        "flex flex-col",
                                                      children: [
                                                        r.serviceTime &&
                                                          e.jsxs("span", {
                                                            className:
                                                              "text-gray-700 dark:text-slate-300 font-medium",
                                                            children: [
                                                              "Servicio: ",
                                                              r.serviceTime,
                                                            ],
                                                          }),
                                                        e.jsxs("span", {
                                                          className:
                                                            "text-gray-700 dark:text-slate-300 font-medium",
                                                          children: [
                                                            "Evento: ",
                                                            r.eventTime,
                                                            r.endTime &&
                                                              ` - ${r.endTime}`,
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                e.jsxs("div", {
                                                  className:
                                                    "flex items-center gap-3 text-sm",
                                                  children: [
                                                    e.jsx("div", {
                                                      className:
                                                        "w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0",
                                                      children: e.jsx(Ae, {
                                                        size: 16,
                                                        className:
                                                          "text-amber-500 dark:text-amber-400",
                                                      }),
                                                    }),
                                                    e.jsx("span", {
                                                      className:
                                                        "text-gray-700 dark:text-slate-300 font-medium",
                                                      children: r.eventLocation,
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          className:
                                            "flex-shrink-0 flex flex-col items-end gap-3",
                                          children: [
                                            e.jsxs("div", {
                                              className: `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${r.status === "completed" ? (r.wasLate ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300") : r.status === "in-service" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : r.status === "no-checkin" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" : r.status === "no-checkout" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : r.status === "absent" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300"}`,
                                              children: [
                                                r.status === "completed"
                                                  ? e.jsx($e, { size: 16 })
                                                  : r.status === "in-service"
                                                    ? e.jsx(ue, { size: 16 })
                                                    : r.status === "no-checkin"
                                                      ? e.jsx($, { size: 16 })
                                                      : r.status ===
                                                          "no-checkout"
                                                        ? e.jsx(xe, {
                                                            size: 16,
                                                          })
                                                        : r.status === "absent"
                                                          ? e.jsx(Re, {
                                                              size: 16,
                                                            })
                                                          : e.jsx(me, {
                                                              size: 16,
                                                            }),
                                                r.status === "completed"
                                                  ? r.wasLate
                                                    ? "Completado - Con atraso"
                                                    : "Completado"
                                                  : r.status === "in-service"
                                                    ? "En servicio"
                                                    : r.status === "no-checkin"
                                                      ? "Completado - Sin entrada"
                                                      : r.status ===
                                                          "no-checkout"
                                                        ? "Completado - Sin salida"
                                                        : r.status === "absent"
                                                          ? "Falta"
                                                          : "Pendiente",
                                              ],
                                            }),
                                            (r.checkInTime ||
                                              r.checkOutTime ||
                                              r.status === "no-checkin" ||
                                              r.status === "no-checkout") &&
                                              e.jsxs("div", {
                                                className:
                                                  "flex flex-col gap-2",
                                                children: [
                                                  r.checkInTime
                                                    ? e.jsxs("div", {
                                                        className: `flex items-center gap-2 px-3 py-2 rounded-lg ${r.wasLate ? "bg-amber-50 dark:bg-amber-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"}`,
                                                        children: [
                                                          e.jsx("div", {
                                                            className: `w-6 h-6 rounded-full flex items-center justify-center ${r.wasLate ? "bg-amber-100 dark:bg-amber-800/50" : "bg-emerald-100 dark:bg-emerald-800/50"}`,
                                                            children: e.jsx(
                                                              Fe,
                                                              {
                                                                size: 12,
                                                                className:
                                                                  r.wasLate
                                                                    ? "text-amber-600 dark:text-amber-400"
                                                                    : "text-emerald-600 dark:text-emerald-400",
                                                              },
                                                            ),
                                                          }),
                                                          e.jsxs("div", {
                                                            className:
                                                              "text-right",
                                                            children: [
                                                              e.jsx("p", {
                                                                className: `text-[10px] font-medium uppercase tracking-wide ${r.wasLate ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`,
                                                                children:
                                                                  r.wasLate
                                                                    ? "Entrada (tarde)"
                                                                    : "Entrada",
                                                              }),
                                                              e.jsx("p", {
                                                                className: `text-sm font-bold ${r.wasLate ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"}`,
                                                                children:
                                                                  new Date(
                                                                    r.checkInTime,
                                                                  ).toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                      hour: "2-digit",
                                                                      minute:
                                                                        "2-digit",
                                                                    },
                                                                  ),
                                                              }),
                                                            ],
                                                          }),
                                                        ],
                                                      })
                                                    : r.status === "no-checkin"
                                                      ? e.jsxs("div", {
                                                          className:
                                                            "flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg",
                                                          children: [
                                                            e.jsx("div", {
                                                              className:
                                                                "w-6 h-6 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center",
                                                              children: e.jsx(
                                                                $,
                                                                {
                                                                  size: 12,
                                                                  className:
                                                                    "text-red-600 dark:text-red-400",
                                                                },
                                                              ),
                                                            }),
                                                            e.jsxs("div", {
                                                              className:
                                                                "text-right",
                                                              children: [
                                                                e.jsx("p", {
                                                                  className:
                                                                    "text-[10px] text-red-600 dark:text-red-400 font-medium uppercase tracking-wide",
                                                                  children:
                                                                    "Entrada",
                                                                }),
                                                                e.jsx("p", {
                                                                  className:
                                                                    "text-sm font-bold text-red-700 dark:text-red-300",
                                                                  children:
                                                                    "No marcó",
                                                                }),
                                                              ],
                                                            }),
                                                          ],
                                                        })
                                                      : null,
                                                  r.checkOutTime
                                                    ? e.jsxs("div", {
                                                        className: `flex items-center gap-2 px-3 py-2 rounded-lg ${r.wasCheckOutLate ? "bg-amber-50 dark:bg-amber-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`,
                                                        children: [
                                                          e.jsx("div", {
                                                            className: `w-6 h-6 rounded-full flex items-center justify-center ${r.wasCheckOutLate ? "bg-amber-100 dark:bg-amber-800/50" : "bg-blue-100 dark:bg-blue-800/50"}`,
                                                            children: e.jsx(
                                                              xe,
                                                              {
                                                                size: 12,
                                                                className:
                                                                  r.wasCheckOutLate
                                                                    ? "text-amber-600 dark:text-amber-400"
                                                                    : "text-blue-600 dark:text-blue-400",
                                                              },
                                                            ),
                                                          }),
                                                          e.jsxs("div", {
                                                            className:
                                                              "text-right",
                                                            children: [
                                                              e.jsx("p", {
                                                                className: `text-[10px] font-medium uppercase tracking-wide ${r.wasCheckOutLate ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`,
                                                                children:
                                                                  r.wasCheckOutLate
                                                                    ? "Salida (tarde)"
                                                                    : "Salida",
                                                              }),
                                                              e.jsx("p", {
                                                                className: `text-sm font-bold ${r.wasCheckOutLate ? "text-amber-700 dark:text-amber-300" : "text-blue-700 dark:text-blue-300"}`,
                                                                children:
                                                                  new Date(
                                                                    r.checkOutTime,
                                                                  ).toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                      hour: "2-digit",
                                                                      minute:
                                                                        "2-digit",
                                                                    },
                                                                  ),
                                                              }),
                                                            ],
                                                          }),
                                                        ],
                                                      })
                                                    : r.status === "no-checkout"
                                                      ? e.jsxs("div", {
                                                          className:
                                                            "flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg",
                                                          children: [
                                                            e.jsx("div", {
                                                              className:
                                                                "w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center",
                                                              children: e.jsx(
                                                                $,
                                                                {
                                                                  size: 12,
                                                                  className:
                                                                    "text-amber-600 dark:text-amber-400",
                                                                },
                                                              ),
                                                            }),
                                                            e.jsxs("div", {
                                                              className:
                                                                "text-right",
                                                              children: [
                                                                e.jsx("p", {
                                                                  className:
                                                                    "text-[10px] text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide",
                                                                  children:
                                                                    "Salida",
                                                                }),
                                                                e.jsx("p", {
                                                                  className:
                                                                    "text-sm font-bold text-amber-700 dark:text-amber-300",
                                                                  children:
                                                                    "No marcó",
                                                                }),
                                                              ],
                                                            }),
                                                          ],
                                                        })
                                                      : null,
                                                ],
                                              }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  },
                                  r.id,
                                ),
                              ),
                            }),
                          ],
                        },
                        t,
                      ),
                    ),
                  })
                : e.jsxs("div", {
                    className:
                      "text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700",
                    children: [
                      e.jsx("div", {
                        className:
                          "w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4",
                        children: e.jsx(ce, {
                          size: 32,
                          className: "text-gray-400",
                        }),
                      }),
                      e.jsx("h3", {
                        className:
                          "text-lg font-medium text-gray-900 dark:text-white mb-2",
                        children: "No hay servicios en este período",
                      }),
                      e.jsx("p", {
                        className: "text-gray-500 dark:text-slate-400",
                        children:
                          u !== "all" || m !== "all"
                            ? "Intenta ajustar los filtros para ver más resultados."
                            : "Aún no has completado ningún servicio.",
                      }),
                    ],
                  }),
            ],
          })
    );
  };
export { qe as ServiceHistory };
