// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import {
  boundedEventQuery,
  eventDateWindow,
  eventPage,
  ecuadorCalendarDate,
  createEventAssignmentFeed,
  EVENT_PAGE_SIZE,
  EVENT_RESULT_LIMIT,
} from "../services/bounded-event-queries.js";
import { normalizeRoleId } from "../utils/roles.js";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import {
  H as ie,
  J as historyOrderBy,
  L as historyLimitQuery,
  I as le,
  K as oe,
  E as Ce,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  useAuth,
  isBffEnabled,
  useChangeFeed,
  firestoreDb,
  bffFetch,
} from "../app/App.jsx";
import {
  H as HistoryIcon,
  ai as FunnelIcon,
  x as ChevronDownIcon,
  C as CheckIcon,
  X as XIcon,
  d as CalendarIcon,
  s as ClockIcon,
  n as MapPinIcon,
  t as CircleCheckBigIcon,
  k as LogOutIcon,
  T as TriangleAlertIcon,
  u as LogInIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
const fe = (b, R) => {
  if (!b) return "";
  const [I, p, F] = b.split("-").map(Number);
  return new Date(I, p - 1, F).toLocaleDateString("es-ES", R);
};
const ServiceHistory = () => {
  const { user: b } = useAuth(),
    [R, I] = React.useState(!0),
    [p, F] = React.useState([]),
    [D, B] = React.useState([]),
    [S, V] = React.useState([]),
    ge = ecuadorCalendarDate().year,
    he = ecuadorCalendarDate().month,
    [u, setHistoryMonth] = React.useState(he),
    [m, setHistoryYear] = React.useState(ge),
    [historyLimit, setHistoryLimit] = React.useState(EVENT_PAGE_SIZE),
    [hasMoreHistory, setHasMoreHistory] = React.useState(false),
    [historyError, setHistoryError] = React.useState(""),
    H = (month) => {
      setHistoryMonth(month);
      setHistoryLimit(EVENT_PAGE_SIZE);
      if (month !== "all" && m === "all") setHistoryYear(ge);
    },
    M = (year) => {
      setHistoryYear(year);
      setHistoryLimit(EVENT_PAGE_SIZE);
      if (year === "all") setHistoryMonth("all");
    },
    [h, y] = React.useState("all"),
    [W, T] = React.useState(!1),
    [Y, E] = React.useState(!1),
    [P, w] = React.useState(!1),
    G = React.useRef(null),
    J = React.useRef(null),
    _ = React.useRef(null),
    z = React.useRef(null);
  (React.useEffect(() => {
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
    React.useEffect(() => {
      if (!b) return;
      I(true);
      B([]);
      V([]);
      F([]);
      setHistoryError("");
      const window = eventDateWindow(m, u);
      const fail = (error) => {
        console.error("Error loading bounded service history", error);
        setHistoryError(
          "No se pudo cargar el historial. Comprueba la conexión y vuelve a intentar.",
        );
        I(false);
      };
      if (isBffEnabled()) {
        let closed = false,
          inFlight = false,
          lastLoadedAt = 0;
        const load = async (options = {}) => {
          if (
            closed ||
            inFlight ||
            (!options.force && Date.now() - lastLoadedAt < 30000)
          )
            return;
          inFlight = true;
          try {
            const params = new URLSearchParams({ limit: String(historyLimit) });
            if (window) {
              params.set("startDate", window.startDate);
              params.set("endDate", window.endDate);
            } else params.set("all", "1");
            const result = await bffFetch(`/api/service-history?${params}`);
            if (closed) return;
            V(result.assignments || []);
            B(result.events || []);
            setHasMoreHistory(result.hasMore === true);
            lastLoadedAt = Date.now();
            I(false);
          } catch (error) {
            if (!closed) fail(error);
          } finally {
            inFlight = false;
          }
        };
        load({ force: true });
        z.current = () => load({ force: true });
        const onFocus = () => {
          if (document.visibilityState === "visible") load();
        };
        globalThis.window.addEventListener("focus", onFocus);
        globalThis.window.addEventListener("online", onFocus);
        document.addEventListener("visibilitychange", onFocus);
        return () => {
          closed = true;
          z.current = null;
          globalThis.window.removeEventListener("focus", onFocus);
          globalThis.window.removeEventListener("online", onFocus);
          document.removeEventListener("visibilitychange", onFocus);
        };
      }
      return createEventAssignmentFeed({
        watchEvents: (next, error) =>
          ie(
            boundedEventQuery(
              {
                query: le,
                where: oe,
                orderBy: historyOrderBy,
                limit: historyLimitQuery,
              },
              Ce(firestoreDb, "events"),
              window,
              historyLimit,
            ),
            (snapshot) => {
              const page = eventPage(snapshot, historyLimit);
              setHasMoreHistory(page.hasMore);
              next({ docs: page.docs });
            },
            error,
          ),
        watchAssignments: (eventId, next, error) =>
          ie(
            le(
              Ce(firestoreDb, "events", eventId, "assignments"),
              oe("userId", "==", b.uid),
            ),
            next,
            error,
          ),
        next: ({ events, assignments }) => {
          B(events);
          V(
            [...assignments].flatMap(([eventId, snapshot]) =>
              snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                eventId,
              })),
            ),
          );
          I(false);
        },
        error: fail,
      });
    }, [b?.uid, m, u, historyLimit]),
    useChangeFeed({
      enabled: isBffEnabled() && !!b,
      resources: ["attendance", "assignments", "events", "service-history"],
      onChange: () => {
        z.current?.();
      },
      debounceMs: 900,
    }),
    React.useEffect(() => {
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
    React.useEffect(() => {
      if (D.length === 0 && S.length === 0) {
        F([]);
        return;
      }
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
                    : !a.checkInTime && !a.checkOutTime && l && (i = "absent"),
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
        return {
          ...a,
          checkInTime: n,
          checkOutTime: i,
        };
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
  te.forEach((t) => {
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
    C = Array.from(
      new Set([
        ...Array.from({ length: 31 }, (_, offset) =>
          String(Number(ge) + 5 - offset),
        ),
        ...p.map((t) => t.eventDate.split("-")[0]),
        m,
      ]),
    )
      .filter((t) => t !== "all" && !isNaN(Number(t)))
      .sort((t, s) => Number(s) - Number(t)),
    se = q.reduce((t, s) => {
      const [r, a] = s.eventDate.split("-"),
        n = `${r}-${a}`;
      return (
        t[n] ||
          (t[n] = {
            label: fe(s.eventDate, {
              month: "long",
              year: "numeric",
            }),
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
    A = Array.from({ length: 12 }, (_, month) =>
      String(month + 1).padStart(2, "0"),
    ),
    ae = [
      {
        value: "all",
        label: "Todos los meses",
      },
      ...A.map((t) => ({
        value: t,
        label: Te[t] || t,
      })),
    ];
  return (
    React.useEffect(() => {
      (m !== "all" && C.length > 0 && (C.includes(m) || M(C[0])),
        u !== "all" && A.length > 0 && (A.includes(u) || H("all")));
    }, [C, A, m, u]),
    React.useEffect(() => {
      (y("all"), w(!1));
    }, [m, u]),
    R ? (
      <LoadingSpinner text="Cargando historial..." />
    ) : (
      <div className="space-y-6">
        {[
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {[
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <HistoryIcon size={24} />
                </div>,
                <div>
                  {[
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {"Historial de Servicios"}
                    </h1>,
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                      {[p.length, " servicio", p.length !== 1 ? "s" : ""]}
                    </p>,
                  ]}
                </div>,
              ]}
            </div>
          </div>,
          <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            {[
              <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                {[
                  <FunnelIcon size={18} />,
                  <span className="text-sm font-medium">{"Filtrar por:"}</span>,
                ]}
              </div>,
              <div className="relative" ref={G}>
                {[
                  <button
                    onClick={() => {
                      (T(!W), E(!1));
                    }}
                    className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[140px] justify-between"
                  >
                    {[
                      <span>{m === "all" ? "Todos los años" : m}</span>,
                      <ChevronDownIcon
                        size={16}
                        className={`text-gray-400 transition-transform ${W ? "rotate-180" : ""}`}
                      />,
                    ]}
                  </button>,
                  W && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
                      {[
                        <button
                          onClick={() => {
                            (M("all"), y("all"), w(!1), T(!1));
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${m === "all" ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 font-semibold" : "text-gray-700 dark:text-slate-200"}`}
                        >
                          {[
                            "Todos los años",
                            m === "all" && (
                              <CheckIcon
                                size={16}
                                className="text-indigo-600 dark:text-indigo-400"
                              />
                            ),
                          ]}
                        </button>,
                        C.map((t) => (
                          <button
                            onClick={() => {
                              (M(t), y("all"), w(!1), T(!1));
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${m === t ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 font-semibold" : "text-gray-700 dark:text-slate-200"}`}
                            key={t}
                          >
                            {[
                              t,
                              m === t && (
                                <CheckIcon
                                  size={16}
                                  className="text-indigo-600 dark:text-indigo-400"
                                />
                              ),
                            ]}
                          </button>
                        )),
                      ]}
                    </div>
                  ),
                ]}
              </div>,
              <div className="relative" ref={J}>
                {[
                  <button
                    onClick={() => {
                      (E(!Y), T(!1));
                    }}
                    className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[160px] justify-between"
                  >
                    {[
                      <span>
                        {ae.find((t) => t.value === u)?.label ||
                          "Todos los meses"}
                      </span>,
                      <ChevronDownIcon
                        size={16}
                        className={`text-gray-400 transition-transform ${Y ? "rotate-180" : ""}`}
                      />,
                    ]}
                  </button>,
                  Y && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
                      {ae.map((t) =>
                        jsxRuntime.jsxs(
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
                              u === t.value && (
                                <CheckIcon
                                  size={16}
                                  className="text-indigo-600 dark:text-indigo-400"
                                />
                              ),
                            ],
                          },
                          t.value,
                        ),
                      )}
                    </div>
                  ),
                ]}
              </div>,
              u !== "all" && m !== "all" && re.length > 0 && (
                <div className="relative" ref={_}>
                  {[
                    <button
                      onClick={() => {
                        (w(!P), T(!1), E(!1));
                      }}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[160px] justify-between"
                    >
                      {[
                        <span>
                          {h === "all" ? "Todas las semanas" : `Semana ${h}`}
                        </span>,
                        <ChevronDownIcon
                          size={16}
                          className={`text-gray-400 transition-transform ${P ? "rotate-180" : ""}`}
                        />,
                      ]}
                    </button>,
                    P && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
                        {[
                          <button
                            onClick={() => {
                              (y("all"), w(!1));
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${h === "all" ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 font-semibold" : "text-gray-700 dark:text-slate-200"}`}
                          >
                            {[
                              "Todas las semanas",
                              h === "all" && (
                                <CheckIcon
                                  size={16}
                                  className="text-indigo-600 dark:text-indigo-400"
                                />
                              ),
                            ]}
                          </button>,
                          re.map((t) => (
                            <button
                              onClick={() => {
                                (y(t.toString()), w(!1));
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${h === t.toString() ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 font-semibold" : "text-gray-700 dark:text-slate-200"}`}
                              key={t}
                            >
                              {[
                                "Semana ",
                                t,
                                h === t.toString() && (
                                  <CheckIcon
                                    size={16}
                                    className="text-indigo-600 dark:text-indigo-400"
                                  />
                                ),
                              ]}
                            </button>
                          )),
                        ]}
                      </div>
                    ),
                  ]}
                </div>
              ),
              (m !== "all" || u !== "all" || h !== "all") && (
                <button
                  onClick={() => {
                    (M("all"), H("all"), y("all"));
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-lg transition-colors"
                >
                  {[<XIcon size={16} />, "Limpiar"]}
                </button>
              ),
            ]}
          </div>,
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                <div className="text-center min-w-[96px] flex flex-col items-center">
                  {[
                    <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-1">
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {q.length}
                      </span>
                    </div>,
                    <p className="max-w-[96px] text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium leading-tight">
                      {m !== "all" || u !== "all" || h !== "all"
                        ? "Servicios filtrados"
                        : "Servicios cargados"}
                    </p>,
                  ]}
                </div>,
                <div className="text-center">
                  {[
                    <div className="w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-1">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {je}
                      </span>
                    </div>,
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium">
                      {"Asist."}
                    </p>,
                  ]}
                </div>,
                <div className="text-center">
                  {[
                    <div className="w-14 h-14 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-1">
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {ye}
                      </span>
                    </div>,
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium">
                      {"Faltas"}
                    </p>,
                  ]}
                </div>,
                <div className="text-center min-w-[96px]">
                  {[
                    <div className="relative w-full h-14 flex flex-col items-center justify-center">
                      {[
                        <span
                          className={`text-2xl font-bold ${f >= 10 ? "text-red-600 dark:text-red-400" : f >= 5 ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-slate-300"}`}
                        >
                          {Number.isFinite(f) ? f.toFixed(2) : "0.00"}
                        </span>,
                        <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${f >= 10 ? "bg-red-500" : f >= 5 ? "bg-amber-500" : "bg-green-500"}`}
                            style={{
                              width: `${Ne}%`,
                            }}
                          />
                        </div>,
                      ]}
                    </div>,
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium">
                      {"Strikes del período"}
                    </p>,
                  ]}
                </div>,
              ]}
            </div>
          </div>,
          historyError && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
            >
              {historyError}
            </p>
          ),
          <p className="text-sm text-gray-500">
            Resumen del período cargado.{" "}
            {hasMoreHistory
              ? "Hay más eventos; carga los siguientes para ampliar el resumen."
              : ""}
          </p>,
          hasMoreHistory &&
            (historyLimit < EVENT_RESULT_LIMIT ? (
              <button
                type="button"
                onClick={() =>
                  setHistoryLimit((limit) =>
                    Math.min(EVENT_RESULT_LIMIT, limit + EVENT_PAGE_SIZE),
                  )
                }
                className="px-5 py-3 border border-purple-200 rounded-xl text-purple-700 font-medium"
              >
                Cargar más historial
              </button>
            ) : (
              <p role="status" className="text-sm text-gray-500">
                Se muestran hasta {EVENT_RESULT_LIMIT} eventos. Selecciona un
                mes para acotar el historial.
              </p>
            )),
          Object.keys(se).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(se).map(([t, s]) => (
                <div key={t}>
                  {[
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 capitalize flex items-center gap-2">
                      {[
                        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />,
                        s.label,
                      ]}
                    </h3>,
                    <div className="grid gap-4">
                      {s.assignments.map((r) =>
                        jsxRuntime.jsx(
                          "div",
                          {
                            className:
                              "group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300",
                            children: (
                              <div className="flex items-start justify-between gap-4">
                                {[
                                  <div className="flex-1 min-w-0">
                                    {[
                                      <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3">
                                        {r.eventTitle}
                                      </h4>,
                                      <div className="flex flex-wrap items-center gap-2 mb-4">
                                        {[
                                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200">
                                            {r.areaName}
                                          </span>,
                                          normalizeRoleId(r.roleName) && (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                                              {normalizeRoleId(r.roleName)}
                                            </span>
                                          ),
                                        ]}
                                      </div>,
                                      <div className="space-y-2.5">
                                        {[
                                          <div className="flex items-center gap-3 text-sm">
                                            {[
                                              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                <CalendarIcon
                                                  size={16}
                                                  className="text-indigo-500 dark:text-indigo-400"
                                                />
                                              </div>,
                                              <span className="text-gray-700 dark:text-slate-300 font-medium">
                                                {fe(r.eventDate, {
                                                  weekday: "short",
                                                  day: "numeric",
                                                  month: "short",
                                                })}
                                              </span>,
                                            ]}
                                          </div>,
                                          <div className="flex items-center gap-3 text-sm">
                                            {[
                                              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                                <ClockIcon
                                                  size={16}
                                                  className="text-emerald-500 dark:text-emerald-400"
                                                />
                                              </div>,
                                              <div className="flex flex-col">
                                                {[
                                                  r.serviceTime && (
                                                    <span className="text-gray-700 dark:text-slate-300 font-medium">
                                                      {[
                                                        "Servicio: ",
                                                        r.serviceTime,
                                                      ]}
                                                    </span>
                                                  ),
                                                  <span className="text-gray-700 dark:text-slate-300 font-medium">
                                                    {[
                                                      "Evento: ",
                                                      r.eventTime,
                                                      r.endTime &&
                                                        ` - ${r.endTime}`,
                                                    ]}
                                                  </span>,
                                                ]}
                                              </div>,
                                            ]}
                                          </div>,
                                          <div className="flex items-center gap-3 text-sm">
                                            {[
                                              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                                <MapPinIcon
                                                  size={16}
                                                  className="text-amber-500 dark:text-amber-400"
                                                />
                                              </div>,
                                              <span className="text-gray-700 dark:text-slate-300 font-medium">
                                                {r.eventLocation}
                                              </span>,
                                            ]}
                                          </div>,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                  <div className="flex-shrink-0 flex flex-col items-end gap-3">
                                    {[
                                      <div
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${r.status === "completed" ? (r.wasLate ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300") : r.status === "in-service" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : r.status === "no-checkin" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" : r.status === "no-checkout" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : r.status === "absent" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300"}`}
                                      >
                                        {[
                                          r.status === "completed" ? (
                                            <CircleCheckBigIcon size={16} />
                                          ) : r.status === "in-service" ? (
                                            <ClockIcon size={16} />
                                          ) : r.status === "no-checkin" ? (
                                            <XIcon size={16} />
                                          ) : r.status === "no-checkout" ? (
                                            <LogOutIcon size={16} />
                                          ) : r.status === "absent" ? (
                                            <TriangleAlertIcon size={16} />
                                          ) : (
                                            <CalendarIcon size={16} />
                                          ),
                                          r.status === "completed"
                                            ? r.wasLate
                                              ? "Completado - Con atraso"
                                              : "Completado"
                                            : r.status === "in-service"
                                              ? "En servicio"
                                              : r.status === "no-checkin"
                                                ? "Completado - Sin entrada"
                                                : r.status === "no-checkout"
                                                  ? "Completado - Sin salida"
                                                  : r.status === "absent"
                                                    ? "Falta"
                                                    : "Pendiente",
                                        ]}
                                      </div>,
                                      (r.checkInTime ||
                                        r.checkOutTime ||
                                        r.status === "no-checkin" ||
                                        r.status === "no-checkout") && (
                                        <div className="flex flex-col gap-2">
                                          {[
                                            r.checkInTime ? (
                                              <div
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${r.wasLate ? "bg-amber-50 dark:bg-amber-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"}`}
                                              >
                                                {[
                                                  <div
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${r.wasLate ? "bg-amber-100 dark:bg-amber-800/50" : "bg-emerald-100 dark:bg-emerald-800/50"}`}
                                                  >
                                                    <LogInIcon
                                                      size={12}
                                                      className={
                                                        r.wasLate
                                                          ? "text-amber-600 dark:text-amber-400"
                                                          : "text-emerald-600 dark:text-emerald-400"
                                                      }
                                                    />
                                                  </div>,
                                                  <div className="text-right">
                                                    {[
                                                      <p
                                                        className={`text-[10px] font-medium uppercase tracking-wide ${r.wasLate ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
                                                      >
                                                        {r.wasLate
                                                          ? "Entrada (tarde)"
                                                          : "Entrada"}
                                                      </p>,
                                                      <p
                                                        className={`text-sm font-bold ${r.wasLate ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"}`}
                                                      >
                                                        {new Date(
                                                          r.checkInTime,
                                                        ).toLocaleTimeString(
                                                          [],
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          },
                                                        )}
                                                      </p>,
                                                    ]}
                                                  </div>,
                                                ]}
                                              </div>
                                            ) : r.status === "no-checkin" ? (
                                              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                                                {[
                                                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center">
                                                    <XIcon
                                                      size={12}
                                                      className="text-red-600 dark:text-red-400"
                                                    />
                                                  </div>,
                                                  <div className="text-right">
                                                    {[
                                                      <p className="text-[10px] text-red-600 dark:text-red-400 font-medium uppercase tracking-wide">
                                                        {"Entrada"}
                                                      </p>,
                                                      <p className="text-sm font-bold text-red-700 dark:text-red-300">
                                                        {"No marcó"}
                                                      </p>,
                                                    ]}
                                                  </div>,
                                                ]}
                                              </div>
                                            ) : null,
                                            r.checkOutTime ? (
                                              <div
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${r.wasCheckOutLate ? "bg-amber-50 dark:bg-amber-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}
                                              >
                                                {[
                                                  <div
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${r.wasCheckOutLate ? "bg-amber-100 dark:bg-amber-800/50" : "bg-blue-100 dark:bg-blue-800/50"}`}
                                                  >
                                                    <LogOutIcon
                                                      size={12}
                                                      className={
                                                        r.wasCheckOutLate
                                                          ? "text-amber-600 dark:text-amber-400"
                                                          : "text-blue-600 dark:text-blue-400"
                                                      }
                                                    />
                                                  </div>,
                                                  <div className="text-right">
                                                    {[
                                                      <p
                                                        className={`text-[10px] font-medium uppercase tracking-wide ${r.wasCheckOutLate ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}
                                                      >
                                                        {r.wasCheckOutLate
                                                          ? "Salida (tarde)"
                                                          : "Salida"}
                                                      </p>,
                                                      <p
                                                        className={`text-sm font-bold ${r.wasCheckOutLate ? "text-amber-700 dark:text-amber-300" : "text-blue-700 dark:text-blue-300"}`}
                                                      >
                                                        {new Date(
                                                          r.checkOutTime,
                                                        ).toLocaleTimeString(
                                                          [],
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          },
                                                        )}
                                                      </p>,
                                                    ]}
                                                  </div>,
                                                ]}
                                              </div>
                                            ) : r.status === "no-checkout" ? (
                                              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                                                {[
                                                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center">
                                                    <XIcon
                                                      size={12}
                                                      className="text-amber-600 dark:text-amber-400"
                                                    />
                                                  </div>,
                                                  <div className="text-right">
                                                    {[
                                                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide">
                                                        {"Salida"}
                                                      </p>,
                                                      <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                                                        {"No marcó"}
                                                      </p>,
                                                    ]}
                                                  </div>,
                                                ]}
                                              </div>
                                            ) : null,
                                          ]}
                                        </div>
                                      ),
                                    ]}
                                  </div>,
                                ]}
                              </div>
                            ),
                          },
                          r.id,
                        ),
                      )}
                    </div>,
                  ]}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              {[
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HistoryIcon size={32} className="text-gray-400" />
                </div>,
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {"No hay servicios en este período"}
                </h3>,
                <p className="text-gray-500 dark:text-slate-400">
                  {u !== "all" || m !== "all"
                    ? "Intenta ajustar los filtros para ver más resultados."
                    : "Aún no has completado ningún servicio."}
                </p>,
              ]}
            </div>
          ),
        ]}
      </div>
    )
  );
};
export { ServiceHistory };
