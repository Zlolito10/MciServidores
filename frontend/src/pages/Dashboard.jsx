// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/CameraModal-BwvRT9Xn.js",
      "assets/index-BU_ZgoWo.js",
      "assets/vendor-react-BwINE3B3.js",
      "assets/App-BPrQ3EPG.js",
      "assets/vendor-ui-CnvYSvQL.js",
      "assets/index-B05fqWAG.css",
    ]),
) => i.map((i) => d[i]);
import { _ as ct } from "../vendor/vendor-pdf-Cf03QSry.js";
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  u as useNavigate,
  r as React,
} from "../vendor/vendor-react-BwINE3B3.js";
import { normalizeRoleId } from "../utils/roles.js";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import {
  Modal,
  useAuth,
  useGlobalData,
  useAppDialog,
  useChangeFeed,
  firebaseAuth,
  firestoreDb,
  isBffEnabled,
  OptimizedImage,
  bffFetch,
  getAvatarUrl,
  isStrictBffAuth,
  dataUrlToBlob,
  compressImage,
  firebaseStorage,
} from "../app/App.jsx";
import {
  n as MapPinIcon,
  o as CircleAlertIcon,
  p as ShieldCheckIcon,
  q as SmileIcon,
  r as Trash2Icon,
  A as ArrowRightIcon,
  P as PlusIcon,
  g as UserPlusIcon,
  d as CalendarIcon,
  s as ClockIcon,
  t as CircleCheckBigIcon,
  u as LogInIcon,
  k as LogOutIcon,
  v as CircleXIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import { o as Jt } from "../services/notifications.js";
import { optimisticAssignments } from "../services/optimisticAssignments.js";
import { EventsGrid } from "../components/EventsGrid.jsx";
import {
  H as Be,
  I as Ae,
  J as st,
  K as je,
  E as fe,
  L as Xt,
  T as at,
  v as Yt,
  A as Ge,
  M as es,
  N as ts,
  O as ss,
  P as as,
  Q as rs,
  w as rt,
  R as ns,
  B as nt,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import { LoadingButton } from "../components/LoadingButton.jsx";
const RenderComponent4 = ({
  isOpen: a,
  mode: l,
  isLoading: m,
  onClose: k,
  onContinue: y,
}) => {
  const N = l === "prompt";
  return (
    <Modal
      isOpen={a}
      onClose={k}
      title={N ? "Permitir ubicación" : "Ubicación desactivada"}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {[
          <div className="flex items-start gap-3">
            {[
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                {N ? (
                  <MapPinIcon
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                ) : (
                  <CircleAlertIcon
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                )}
              </div>,
              <div className="space-y-1">
                {[
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {N
                      ? "Necesitamos tu ubicación para registrar asistencia."
                      : "No podemos obtener tu ubicación."}
                  </p>,
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {N
                      ? "Al continuar, tu navegador mostrará el aviso de permisos. Selecciona “Permitir” para poder hacer check-in/check-out."
                      : "Activa permisos de ubicación para este sitio en tu navegador (Configuración del navegador → Privacidad/Permisos → Ubicación)."}
                  </p>,
                ]}
              </div>,
            ]}
          </div>,
          <div className="flex items-start gap-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
            {[
              <div className="w-10 h-10 rounded-xl bg-white/70 dark:bg-slate-800/60 flex items-center justify-center flex-shrink-0">
                <ShieldCheckIcon
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>,
              <div>
                {[
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {"Privacidad"}
                  </p>,
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {"La ubicación se guarda junto al registro de asistencia."}
                  </p>,
                ]}
              </div>,
            ]}
          </div>,
          <div className="flex justify-end gap-3">
            {[
              <button
                type="button"
                onClick={k}
                className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                disabled={m}
              >
                {N ? "Cancelar" : "Entendido"}
              </button>,
              N && (
                <button
                  type="button"
                  onClick={y}
                  disabled={m}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {m ? "Solicitando..." : "Continuar"}
                </button>
              ),
            ]}
          </div>,
        ]}
      </div>
    </Modal>
  );
};
const ds = async () => {
  const a = navigator?.permissions;
  if (!a?.query) return "prompt";
  try {
    const l = await a.query({
        name: "geolocation",
      }),
      m = String(l?.state || "prompt");
    return m === "granted" || m === "denied" || m === "prompt" ? m : "prompt";
  } catch {
    return "prompt";
  }
};
const ot = async () => {
  if (!("geolocation" in navigator))
    throw new Error("Este dispositivo no soporta geolocalización");
  const a = await new Promise((l, m) => {
    navigator.geolocation.getCurrentPosition(l, m, {
      enableHighAccuracy: !0,
      timeout: 12e3,
      maximumAge: 0,
    });
  });
  return {
    lat: a.coords.latitude,
    lng: a.coords.longitude,
    accuracyMeters:
      typeof a.coords.accuracy == "number" ? a.coords.accuracy : null,
    timestampMs: a.timestamp,
  };
};
const RenderComponent5 = React.lazy(() =>
  ct(
    () => import("../components/CameraModal.jsx"),
    __vite__mapDeps([0, 1, 2, 3, 4, 5]),
  ).then((a) => ({
    default: a.CameraModal,
  })),
);
const it = () =>
  ct(
    () => import("../components/CameraModal.jsx"),
    __vite__mapDeps([0, 1, 2, 3, 4, 5]),
  );
const Ie = 500;
const cs = 12e4;
const ms = 3e4;
const us = (a) => {
  const l = String(a?.name || "").toLowerCase(),
    m = String(a?.message || a || "").toLowerCase();
  return (
    l.includes("abort") ||
    l.includes("timeout") ||
    m.includes("abort") ||
    m.includes("timeout") ||
    m.includes("networkerror") ||
    m.includes("network request failed") ||
    m.includes("failed to fetch")
  );
};
const dt = (a) => {
  const l = String(a || "");
  try {
    const m = Intl;
    if (m?.Segmenter) {
      const k = new m.Segmenter("es", {
        granularity: "grapheme",
      });
      let y = 0;
      for (const N of k.segment(l)) y += 1;
      return y;
    }
  } catch {}
  return Array.from(l).length;
};
const xs = (a, l) => {
  const m = String(a || "");
  try {
    const k = Intl;
    if (k?.Segmenter) {
      const y = new k.Segmenter("es", {
        granularity: "grapheme",
      });
      let N = "",
        D = 0;
      for (const I of y.segment(m)) {
        if (D >= l) break;
        ((N += I.segment), (D += 1));
      }
      return N;
    }
  } catch {}
  return Array.from(m).slice(0, l).join("");
};
const hs = (a) => {
  const l = String(a || "").trim();
  if (!l) return "?";
  const m = l.split(/\s+/).filter(Boolean),
    k = m[0]?.[0] || "?",
    y = m.length > 1 ? m[1]?.[0] : "";
  return `${k}${y}`.toUpperCase();
};
const RenderComponent1 = ({ src: a, alt: l, initials: m }) => {
  const k = getAvatarUrl(a);
  return k ? (
    <OptimizedImage
      src={k}
      alt={l}
      className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700 flex-shrink-0"
      imgClassName="object-cover"
      eager={!0}
      fallbackIcon={
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-slate-700">
          <span className="text-xs font-bold text-gray-700 dark:text-slate-200 select-none">
            {m}
          </span>
        </div>
      }
    />
  ) : (
    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700 flex-shrink-0 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full">
        <span className="text-xs font-bold text-gray-700 dark:text-slate-200 select-none">
          {m}
        </span>
      </div>
    </div>
  );
};
const Oe = [
  {
    key: "like",
    emoji: "👍",
  },
  {
    key: "love",
    emoji: "❤️",
  },
  {
    key: "laugh",
    emoji: "😂",
  },
  {
    key: "pray",
    emoji: "🙏",
  },
  {
    key: "wow",
    emoji: "😮",
  },
  {
    key: "sad",
    emoji: "😢",
  },
];
const He = (a, l) => {
  if (!a) return "";
  const [m, k, y] = a.split("-").map(Number);
  return new Date(m, k - 1, y).toLocaleDateString("es-ES", l);
};
const gs = (a) => {
  if (!a) return "";
  const [, , l] = a.split("-").map(Number);
  return l;
};
const Ve = (a) => {
  const l = new Date(a),
    m = l.getDay(),
    k = l.getDate() - m + (m === 0 ? -6 : 1);
  return (l.setDate(k), l.setHours(0, 0, 0, 0), l);
};
const gt = (a) => {
  const l = Ve(a),
    m = new Date(l);
  return (m.setDate(m.getDate() + 6), m.setHours(23, 59, 59, 999), m);
};
const fs = (a) => {
  if (!a.checkOutTime) return !0;
  const l = new Date(),
    m = new Date(a.checkOutTime),
    k = new Date(l.getTime() - 2880 * 60 * 1e3);
  if (m < k) return !1;
  const [y, N, D] = a.eventDate.split("-").map(Number),
    I = new Date(y, N - 1, D),
    M = Ve(l),
    K = gt(l);
  return I >= M && I <= K;
};
const ps = (a) => {
  const [l, m, k] = a.split("-").map(Number),
    y = new Date(l, m - 1, k),
    N = new Date(),
    D = Ve(N),
    I = gt(N);
  return y >= D && y <= I;
};
const Re = (a, l, m, k, y) => {
  const N = (O, T) => {
      const [$, ae, F] = O.split("-").map(Number);
      if (!T) return new Date($, ae - 1, F, 23, 59);
      const [re, te] = T.split(":").map(Number);
      return new Date($, ae - 1, F, re, te);
    },
    D = () => {
      if (y === "completed") return !0;
      if (!a || !k) return !1;
      const O = N(a, k),
        T = new Date(O.getTime() + 7200 * 1e3);
      return new Date() >= T;
    };
  if (!a || (!l && !m))
    return {
      isOpen: !1,
      message: "Fecha/hora no disponible",
      isLate: !1,
      isCheckOutLate: !1,
      canCheckIn: !1,
      canCheckOut: !1,
      phase: "closed",
    };
  if (D())
    return {
      isOpen: !1,
      message: "Evento completado",
      isLate: !0,
      isCheckOutLate: !0,
      canCheckIn: !1,
      canCheckOut: !1,
      phase: "closed",
    };
  const I = N(a, m || l),
    M = new Date(I.getTime() - 10800 * 1e3),
    K = N(a, k || m || l),
    q = new Date(K.getTime() + 10800 * 1e3),
    o = new Date(I.getTime() - 1800 * 1e3),
    ee = new Date(K.getTime() + 5400 * 1e3),
    P = new Date();
  if (P < M) {
    const O = M.getTime() - P.getTime(),
      T = Math.floor(O / (1e3 * 60 * 60)),
      $ = Math.floor((O % (1e3 * 60 * 60)) / (1e3 * 60));
    return {
      isOpen: !1,
      message: T > 0 ? `Abre en ${T}h ${$}m` : `Abre en ${$} min`,
      isLate: !1,
      isCheckOutLate: !1,
      canCheckIn: !1,
      canCheckOut: !1,
      phase: "before-service",
    };
  }
  if (P >= q)
    return {
      isOpen: !1,
      message: "Registro cerrado",
      isLate: !0,
      isCheckOutLate: !0,
      canCheckIn: !1,
      canCheckOut: !1,
      phase: "closed",
    };
  if (P < I) {
    const O = P >= o;
    return {
      isOpen: !0,
      message: O ? "Atraso (previo al evento)" : "Registro abierto",
      isLate: O,
      isCheckOutLate: !1,
      canCheckIn: !0,
      canCheckOut: !1,
      phase: "check-in-open",
    };
  }
  if (P < K)
    return {
      isOpen: !1,
      message: "Evento en curso",
      isLate: !1,
      isCheckOutLate: !1,
      canCheckIn: !1,
      canCheckOut: !1,
      phase: "event-started",
    };
  const G = P >= ee;
  return {
    isOpen: !0,
    message: G ? "Atraso (salida tardía)" : "Registrar salida",
    isLate: !1,
    isCheckOutLate: G,
    canCheckIn: !1,
    canCheckOut: !0,
    phase: "event-ended",
  };
};
const Dashboard = () => {
  const { user: a, userProfile: l } = useAuth(),
    { users: m } = useGlobalData(),
    k = useNavigate(),
    y = useAppDialog(),
    [N, D] = React.useState([]),
    [I, M] = React.useState([]),
    [K, q] = React.useState(!0),
    [o, ee] = React.useState([]),
    [P, G] = React.useState(!0),
    [O, T] = React.useState(null),
    [$, ae] = React.useState(!1),
    [F, re] = React.useState(""),
    [te, Ne] = React.useState(!1),
    Se = dt(F),
    [le, pe] = React.useState({}),
    [Pe, s] = React.useState(null),
    [p, S] = React.useState(null),
    [v, g] = React.useState(null),
    L = React.useRef(null),
    ce = React.useRef(null),
    J = React.useRef(!0),
    W = React.useRef(null),
    B = React.useRef(null),
    ne = React.useRef(!1),
    [Q, w] = React.useState(null),
    [Z, _] = React.useState({}),
    se = 10080 * 60 * 1e3,
    V = (t) => {
      try {
        if (!t) return null;
        if (typeof t == "number" && Number.isFinite(t)) return t;
        if (typeof t?.toMillis == "function") return t.toMillis();
        if (typeof t?.toDate == "function")
          return t.toDate()?.getTime?.() ?? null;
        if (typeof t == "object") {
          const r = t.seconds ?? t._seconds,
            n = t.nanoseconds ?? t._nanoseconds,
            i =
              typeof r == "number" ? r : typeof r == "string" ? Number(r) : NaN,
            f = typeof n == "number" ? n : typeof n == "string" ? Number(n) : 0;
          if (Number.isFinite(i)) {
            const x = i * 1e3 + Math.floor((Number.isFinite(f) ? f : 0) / 1e6);
            return Number.isFinite(x) ? x : null;
          }
        }
        if (typeof t == "string") {
          const r = Date.parse(t);
          return Number.isFinite(r) ? r : null;
        }
        return null;
      } catch {
        return null;
      }
    },
    U = (t) => {
      const r = Date.now() - se;
      return t
        .map((n) => ({
          c: n,
          ms: V(n.createdAt),
        }))
        .filter((n) => (n.ms ?? 0) >= r)
        .sort((n, i) => (n.ms ?? 0) - (i.ms ?? 0))
        .map((n) => n.c);
    },
    E = () => {
      L.current && (window.clearTimeout(L.current), (L.current = null));
    },
    Te = (t) => {
      s((r) => (r === t ? null : t));
    },
    be = (t) => {
      (E(),
        (L.current = window.setTimeout(() => {
          Te(t);
        }, 520)));
    },
    pt = () => ({}),
    bt = (t) => {};
  React.useEffect(() => {
    _(pt());
  }, []);
  const kt = async (t) => {
    if (vt) return;
    const n = Array.from(new Set(t.filter((x) => !!x))).filter(
      (x) => !Z[x] || le[x] === void 0,
    );
    if (n.length === 0) return;
    const i = [],
      f = [];
    if (
      (n.forEach((x) => {
        const c = m.find((u) => u.id === x);
        if (c) {
          const u = c.name || "",
            d = c.photoThumbURL || c.photoURL || "";
          f.push([x, u, d]);
        } else i.push(x);
      }),
      f.length > 0 &&
        (_((x) => {
          const c = {
            ...x,
          };
          for (const [u, d] of f) d && (c[u] = d);
          return c;
        }),
        pe((x) => {
          const c = {
            ...x,
          };
          for (const [u, , d] of f) c[u] = d;
          return c;
        })),
      i.length > 0)
    )
      try {
        const x = await Promise.all(
          i.map(async (c) => {
            try {
              const u = await Yt(Ge(firestoreDb, "users", c)),
                d = u.exists() ? u.data() : null,
                b =
                  d && typeof d.name == "string" && d.name.trim()
                    ? d.name.trim()
                    : "",
                R =
                  d && typeof d.photoThumbURL == "string"
                    ? d.photoThumbURL
                    : d && typeof d.photoURL == "string"
                      ? d.photoURL
                      : "";
              return [c, b, R];
            } catch {
              return [c, "", ""];
            }
          }),
        );
        (_((c) => {
          const u = {
            ...c,
          };
          for (const [d, b] of x) d && b && !u[d] && (u[d] = b);
          return (bt(u), u);
        }),
          pe((c) => {
            const u = {
              ...c,
            };
            for (const [d, , b] of x) d && b && !u[d] && (u[d] = b);
            return u;
          }));
      } catch {}
  };
  React.useEffect(() => {
    const t = () => {
      ee((n) => {
        const i = U(n);
        return (i.length, n.length, i);
      });
    };
    t();
    const r = window.setInterval(t, 60 * 1e3);
    return () => window.clearInterval(r);
  }, []);
  const [ue, Ze] = React.useState([]),
    [Me, Ce] = React.useState([]),
    De = React.useRef(0),
    _e = React.useRef(!1),
    Ke = React.useRef(""),
    Le = React.useRef(null),
    z = isBffEnabled(),
    vt = isBffEnabled() && isStrictBffAuth(),
    { boost: wt } = useChangeFeed({
      enabled: z,
      resources: ["events", "assignments", "comments"],
      onChange: () => {
        (console.log(
          "[Dashboard] 🔄 ChangeFeed detectó cambios - refrescando...",
        ),
          Le.current?.());
      },
      debounceMs: 5e3,
    }),
    yt = () => {
      try {
        wt(12e3);
      } catch {}
      Le.current?.();
    },
    jt = (t) => {
      const r = String(a?.uid || "");
      r &&
        D((n) =>
          n.map((i) => {
            if (
              !i ||
              String(i?.eventId || "") !== t.eventId ||
              String(i?.userId || "") !== r
            )
              return i;
            const f = {
              ...i,
              [t.type === "check-in" ? "checkInTime" : "checkOutTime"]:
                t.attendanceTimeIso,
              attendanceStatus: t.attendanceStatus,
              ...(t.type === "check-in"
                ? {
                    wasLate: !!t.wasLate,
                  }
                : {
                    wasCheckOutLate: !!t.wasCheckOutLate,
                  }),
            };
            return (
              t.location &&
                (f[
                  t.type === "check-in" ? "checkInLocation" : "checkOutLocation"
                ] = t.location),
              f
            );
          }),
        );
    },
    Nt = async (t) => {
      const r = await bffFetch(
          "/api/dashboard",
          t?.bypassCache
            ? {
                cache: "no-cache",
              }
            : void 0,
        ),
        n = Array.isArray(r?.upcomingEvents) ? r.upcomingEvents : [],
        i = Array.isArray(r?.assignments) ? r.assignments : [];
      (Ze(n), M(n), Ce(i));
    },
    Ue = async (t) => {
      const r = await bffFetch(
          "/api/comments/recent",
          t?.bypassCache
            ? {
                cache: "no-cache",
              }
            : void 0,
        ),
        n = Array.isArray(r?.comments) ? r.comments : null;
      if (!n) {
        (T("No se pudieron cargar los comentarios"), G(!1));
        return;
      }
      const i = n.map((x) => ({
          id: String(x?.id || ""),
          text: String(x?.text || ""),
          authorId: String(x?.authorId || ""),
          authorName: String(x?.authorName || "Servidor"),
          authorPhotoURL:
            typeof x?.authorPhotoURL == "string" && x.authorPhotoURL.trim()
              ? x.authorPhotoURL
              : void 0,
          createdAt: x?.createdAt,
          reactions:
            x?.reactions && typeof x.reactions == "object"
              ? x.reactions
              : void 0,
        })),
        f = U(i);
      (ee(f), G(!1), T(null), ae(!0));
    },
    St = async (t) => {
      (await Nt(t), await Ue(t));
    };
  (React.useEffect(() => {
    if (!a) return;
    if (z) {
      let c = !1;
      const u = String(a?.uid || ""),
        d = !!u && Ke.current !== u;
      d && ((Ke.current = u), (De.current = 0));
      const b = async (j) => {
        const A = !!j?.force,
          xe = j?.showSpinner !== !1,
          Ee = typeof j?.bypassCache == "boolean" ? j.bypassCache : A,
          H = !!j?.isAutoRefresh;
        if (c || _e.current) return;
        const X = Date.now();
        if (!(!A && !H && X - De.current < 3e3)) {
          ((_e.current = !0), xe && (q(!0), G(!0)));
          try {
            (await St({
              bypassCache: Ee,
            }),
              (De.current = Date.now()));
            try {
              window.localStorage.removeItem("cem_dashboard_dirty_ts");
            } catch {}
          } catch {
            c || T("No se pudieron cargar los comentarios");
          } finally {
            ((_e.current = !1), !c && xe && (q(!1), G(!1)));
          }
        }
      };
      let R = !1;
      try {
        const j = window.localStorage.getItem("cem_dashboard_dirty_ts"),
          A = j ? Number(j) : 0;
        Number.isFinite(A) && A > De.current && (R = !0);
      } catch {}
      (b({
        force: d || R,
        showSpinner: d,
        bypassCache: R ? !0 : void 0,
      }),
        (Le.current = () =>
          void b({
            force: !0,
            showSpinner: !1,
            bypassCache: !0,
            isAutoRefresh: !0,
          })));
      const C = (j) => {
        if (j.data?.type === "DATA_CHANGED") {
          let A = j.data.resources || [];
          if (typeof A == "string")
            try {
              A = JSON.parse(A);
            } catch {
              A = [];
            }
          (Array.isArray(A) || (A = []),
            console.log(
              `[Dashboard] 📲 Push notification - recursos: ${A.join(", ")}`,
            ));
          const xe = ["events", "assignments", "comments"];
          if (A.some((H) => xe.includes(H))) {
            console.log(
              "[Dashboard] ✅ Push detectó cambio relevante - refrescando...",
            );
            const H = j.data?.operation === "delete";
            if (
              (console.log(
                `[Dashboard] ✅ Push detectó cambio relevante (${H ? "DELETE" : "UPDATE"})`,
              ),
              j.data?.assignment)
            )
              try {
                const X = JSON.parse(j.data.assignment);
                (D((ve) =>
                  ve.some((he) => he.id === X.id)
                    ? ve.map((he) =>
                        he.id === X.id
                          ? {
                              ...he,
                              ...X,
                              attendanceStatus:
                                he.attendanceStatus || "pending",
                            }
                          : he,
                      )
                    : [
                        ...ve,
                        {
                          ...X,
                          attendanceStatus: "pending",
                        },
                      ],
                ),
                  console.log(
                    "[Dashboard] ⚡ Injecting assignment from payload (Zero Latency)",
                  ));
                return;
              } catch (X) {
                console.error("Error parsing assignment payload", X);
              }
            else if (H && j.data?.assignmentId) {
              (D((X) => X.filter((ve) => ve.id !== j.data.assignmentId)),
                console.log(
                  "[Dashboard] ⚡ Removing assignment via payload (Zero Latency)",
                ));
              return;
            }
            H
              ? b({
                  force: !0,
                  showSpinner: !1,
                  bypassCache: !0,
                  isAutoRefresh: !0,
                })
              : setTimeout(() => {
                  b({
                    force: !0,
                    showSpinner: !1,
                    bypassCache: !0,
                    isAutoRefresh: !0,
                  });
                }, 2e3);
          }
        }
      };
      navigator.serviceWorker?.addEventListener("message", C);
      const oe = Jt((j) => {
        (console.log("[Dashboard] 🚨 Foreground message received via SDK:", j),
          j.data?.type === "DATA_CHANGED" &&
            C({
              data: j.data,
            }));
      });
      let Fe = null,
        ke = 0;
      const It = () => {
        (console.log("[Dashboard] 🔄 Iniciando polling fallback cada 60s"),
          (Fe = window.setInterval(async () => {
            if (document.visibilityState === "visible")
              try {
                const j = await bffFetch("/api/changes/meta", {
                    cache: "no-store",
                  }),
                  A = j?.resources?.events || 0,
                  xe = j?.resources?.assignments || 0,
                  Ee = j?.resources?.comments || 0,
                  H = A + xe + Ee;
                ke === 0
                  ? ((ke = H),
                    console.log("[Dashboard] 📊 Baseline ChangeMeta rev:", H))
                  : H > ke &&
                    (console.log(
                      `[Dashboard] ✅ Cambios detectados (${ke} → ${H}) - recargando...`,
                    ),
                    (ke = H),
                    b({
                      force: !0,
                      showSpinner: !1,
                      bypassCache: !0,
                      isAutoRefresh: !0,
                    }));
              } catch (j) {
                console.warn("[Dashboard] ⚠️ Error verificando cambios:", j);
              }
          }, 6e4)));
      };
      window.matchMedia("(display-mode: standalone)").matches && It();
      const Qe = () =>
          void b({
            force: !0,
            showSpinner: !1,
            bypassCache: !1,
          }),
        Xe = () =>
          void b({
            force: !0,
            showSpinner: !1,
            bypassCache: !1,
          }),
        Ye = () => {
          document.visibilityState === "visible" &&
            b({
              force: !0,
              showSpinner: !1,
              bypassCache: !1,
            });
        };
      return (
        window.addEventListener("focus", Qe),
        window.addEventListener("online", Xe),
        document.addEventListener("visibilitychange", Ye),
        () => {
          ((c = !0),
            (Le.current = null),
            Fe !== null && window.clearInterval(Fe),
            navigator.serviceWorker?.removeEventListener("message", C),
            oe && oe(),
            window.removeEventListener("focus", Qe),
            window.removeEventListener("online", Xe),
            document.removeEventListener("visibilitychange", Ye));
        }
      );
    }
    if (!z && !firebaseAuth.currentUser) return;
    z || q(!0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const r = new Date(t);
    r.setDate(r.getDate() + 14);
    const n = t.toISOString().split("T")[0],
      i = r.toISOString().split("T")[0],
      f = z
        ? () => {
            z && q(!1);
          }
        : Be(
            Ae(
              fe(firestoreDb, "events"),
              je("date", ">=", n),
              je("date", "<=", i),
              st("date", "asc"),
            ),
            (c) => {
              const u = c.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              }));
              (Ze(u), M(u), q(!1));
            },
            (c) => {
              (console.error("Error listening to events:", c), q(!1));
            },
          ),
      x = optimisticAssignments.updates.subscribe((c) => {
        const u = c.filter((d) => d.userId === a.uid);
        u.length !== 0 &&
          D((d) => {
            const b = [...d];
            let R = !1;
            return (
              u.forEach((C) => {
                b.some((oe) => oe.id === C.id) ||
                  (b.push({
                    id: C.id,
                    eventId: C.eventId,
                    userId: C.userId,
                    eventTitle: C.eventTitle,
                    eventDate: C.eventDate,
                    eventTime: C.eventTime,
                    eventLocation: "",
                    areaName: C.areaName,
                    roleName: C.roleName,
                    attendanceStatus: "pending",
                  }),
                  (R = !0));
              }),
              R ? b : d
            );
          });
      });
    return () => {
      (f(), x.unsubscribe());
    };
  }, [a, z]),
    React.useEffect(() => {
      if (z || !a) return;
      if (ue.length === 0) {
        Ce([]);
        return;
      }
      const t = [],
        r = new Map(),
        n = () => {
          const i = Array.from(r.values()).flat();
          Ce(i);
        };
      return (
        ue.forEach((i) => {
          const f = Ae(
              fe(firestoreDb, "events", i.id, "assignments"),
              je("userId", "==", a.uid),
            ),
            x = Be(f, (c) => {
              const u = c.docs.map((d) => ({
                id: d.id,
                eventId: i.id,
                ...d.data(),
              }));
              (u.length > 0 ? r.set(i.id, u) : r.delete(i.id), n());
            });
          t.push(x);
        }),
        () => {
          (t.forEach((i) => i()), Ce([]));
        }
      );
    }, [a, ue, z]),
    React.useEffect(() => {
      a &&
        o.length !== 0 &&
        m.length !== 0 &&
        pe((t) => {
          let r = !1;
          const n = {
            ...t,
          };
          return (
            o.forEach((i) => {
              if (!i.authorId) return;
              const f = m.find((c) => c.id === i.authorId);
              if (!f) return;
              const x = f.photoThumbURL || f.photoURL || "";
              n[i.authorId] !== x && ((n[i.authorId] = x), (r = !0));
            }),
            r ? n : t
          );
        });
    }, [a, o, m]),
    React.useEffect(() => {
      if (!a || z || !firebaseAuth.currentUser) return;
      const t = Date.now() - se;
      (G(!0), T(null));
      const r = Ae(
          fe(firestoreDb, "comments"),
          je("createdAt", ">=", at.fromMillis(t)),
          st("createdAt", "desc"),
          Xt(50),
        ),
        n = Be(
          r,
          (i) => {
            const x = i.docs
              .map((u) => {
                const d = u.data(),
                  b =
                    d.reactions && typeof d.reactions == "object"
                      ? d.reactions
                      : void 0;
                return {
                  id: u.id,
                  text: String(d.text || ""),
                  authorId: String(d.authorId || ""),
                  authorName: String(d.authorName || "Servidor"),
                  authorPhotoURL:
                    typeof d.authorPhotoURL == "string"
                      ? d.authorPhotoURL
                      : void 0,
                  createdAt: d.createdAt,
                  reactions: b,
                };
              })
              .slice();
            x.sort((u, d) => {
              const b = V(u.createdAt) ?? 0,
                R = V(d.createdAt) ?? 0;
              return b - R;
            });
            const c = U(x);
            (ee(c), G(!1), ae(!0));
          },
          (i) => {
            console.error("Error listening to comments:", i);
            const f = i?.code;
            (T(
              f === "permission-denied"
                ? "Sin permisos para ver comentarios. Despliega las reglas de Firestore."
                : "No se pudieron cargar los comentarios",
            ),
              G(!1));
          },
        );
      return () => n();
    }, [a, z]));
  const Je = async () => {
      if (!a) return;
      const t = F.trim();
      if (t) {
        if (dt(t) > Ie) {
          y.showError(`El comentario no puede exceder ${Ie} caracteres`);
          return;
        }
        Ne(!0);
        try {
          if (z)
            (await bffFetch("/api/comments", {
              method: "POST",
              json: {
                text: t,
              },
            }),
              re(""),
              await Ue({
                bypassCache: !0,
              }));
          else {
            const r = l?.name || a.displayName || a.email || "Servidor",
              n = l?.photoThumbURL || l?.photoURL || a.photoURL || void 0;
            (await ts(fe(firestoreDb, "comments"), {
              text: t,
              authorId: a.uid,
              authorName: r,
              ...(n
                ? {
                    authorPhotoURL: n,
                  }
                : {}),
              createdAt: at.now(),
            }),
              re(""));
          }
        } catch (r) {
          (console.error("Error posting comment:", r),
            r?.code === "permission-denied"
              ? y.showError(
                  "Sin permisos para publicar. Despliega las reglas de Firestore.",
                )
              : y.showError("No se pudo publicar el comentario"));
        } finally {
          Ne(!1);
        }
      }
    },
    Tt = (t) => {
      try {
        const r = V(t),
          n = r ? new Date(r) : t?.toDate ? t.toDate() : null;
        return n
          ? n.toLocaleString("es-ES", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";
      } catch {
        return "";
      }
    },
    Ct = () => {
      B.current?.scrollIntoView({
        block: "end",
      });
    };
  React.useEffect(() => {
    if (P) return;
    const t = o.length ? o[o.length - 1] : null,
      r = t?.id ?? null;
    if (
      !(!ne.current || J.current || (!!a && !!t && t.authorId === a.uid)) ||
      (r && W.current === r)
    )
      return;
    const i = window.setTimeout(() => {
      (Ct(), (ne.current = !0), (W.current = r));
    }, 0);
    return () => window.clearTimeout(i);
  }, [P, o.length, a]);
  const ze = (t, r) => {
      const i = (t.reactions || {})[r];
      return Array.isArray(i) ? i.filter((f) => typeof f == "string") : [];
    },
    Dt = async (t, r) => {
      if (!(!a && !isBffEnabled()) && !p && Oe.some((n) => n.key === r)) {
        S(t);
        try {
          const i =
              (isBffEnabled()
                ? await bffFetch("/api/comments/react", {
                    method: "POST",
                    json: {
                      commentId: t,
                      reaction: r,
                      action: "toggle",
                    },
                  })
                : await (async () => {
                    const x = a;
                    if (!x || typeof x.getIdToken != "function")
                      throw new Error("MISSING_FIREBASE_USER");
                    const c = await x.getIdToken(),
                      u = await fetch("/comments/react", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${c}`,
                        },
                        body: JSON.stringify({
                          commentId: t,
                          reaction: r,
                          action: "toggle",
                        }),
                      });
                    if (!u.ok) {
                      const d = await u.text().catch(() => "");
                      throw new Error(d || `HTTP ${u.status}`);
                    }
                    return await u.json().catch(() => null);
                  })()
              )?.action === "added"
                ? "added"
                : "removed",
            f = (isBffEnabled() ? l?.uid : a?.uid) || "";
          if (!f) throw new Error("MISSING_UID");
          (ee((x) =>
            x.map((c) => {
              if (c.id !== t) return c;
              const u = {
                  ...(c.reactions || {}),
                },
                d = u[r],
                b = Array.isArray(d)
                  ? d.filter((oe) => typeof oe == "string")
                  : [],
                R = b.includes(f);
              let C;
              return (
                i === "added"
                  ? (C = R ? b : [...b, f])
                  : (C = R ? b.filter((oe) => oe !== f) : b),
                (u[r] = C),
                {
                  ...c,
                  reactions: u,
                }
              );
            }),
          ),
            s(null));
        } catch (n) {
          (console.error("Error toggling reaction:", n),
            y.showError("No se pudo reaccionar al comentario"));
        } finally {
          S(null);
        }
      }
    },
    Lt = async (t) => {
      if (
        !(
          !a ||
          v ||
          !(
            t.authorId === a.uid ||
            l?.role === "master_admin" ||
            l?.role === "admin"
          ) ||
          !(await y.confirm({
            title: "Eliminar mensaje",
            message: "¿Seguro que deseas eliminar este mensaje?",
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            confirmColor: "red",
          }))
        )
      ) {
        g(t.id);
        try {
          (z
            ? (await bffFetch(`/api/comments/${encodeURIComponent(t.id)}`, {
                method: "DELETE",
                json: {},
              }),
              await Ue({
                bypassCache: !0,
              }))
            : await es(Ge(firestoreDb, "comments", t.id)),
            s(null),
            w(null));
        } catch (i) {
          (console.error("Error deleting comment:", i),
            i?.code === "permission-denied"
              ? y.showError(
                  "Sin permisos para eliminar. Despliega las reglas de Firestore.",
                )
              : y.showError("No se pudo eliminar el mensaje"));
        } finally {
          g(null);
        }
      }
    };
  React.useEffect(() => {
    if (ue.length === 0 && Me.length === 0) return;
    const t = Me.filter((r) => !a?.uid || r.userId === a.uid)
      .map((r) => {
        const n = ue.find((i) => i.id === r.eventId);
        return n
          ? {
              ...r,
              eventTitle: n.title,
              eventDate: n.date,
              eventTime: n.time,
              eventServiceTime: n.serviceTime,
              eventEndTime: n.endTime,
              eventLocation: n.location || "Ubicación pendiente",
              eventStatus: n.status,
            }
          : null;
      })
      .filter(Boolean);
    (t.sort(
      (r, n) =>
        new Date(r.eventDate).getTime() - new Date(n.eventDate).getTime(),
    ),
      D(t));
  }, [ue, Me]);
  const Et = () => {
      const t = new Date().getHours();
      return t < 12
        ? "Buenos días"
        : t < 18
          ? "Buenas tardes"
          : "Buenas noches";
    },
    $e = l?.role === "master_admin" || l?.role === "admin";
  return (
    <div className="space-y-8">
      {[
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white">
          {[
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400" />,
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:32px_32px]" />,
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />,
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {[
                  <div>
                    {[
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-3">
                        {[
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />,
                          "Panel principal",
                        ]}
                      </div>,
                      <h1 className="text-2xl md:text-3xl font-semibold mb-1.5 tracking-tight">
                        {[
                          Et(),
                          ",",
                          " ",
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                            {l?.name?.split(" ")[0] || "Servidor"}
                          </span>,
                        ]}
                      </h1>,
                      <p className="text-slate-400 text-sm">
                        {$e
                          ? "Gestiona eventos y equipo ministerial"
                          : "Tus próximas asignaciones te esperan"}
                      </p>,
                    ]}
                  </div>,
                  <div className="hidden md:flex items-center gap-3">
                    <div className="text-right px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                      {[
                        <p className="text-3xl font-bold text-white leading-none">
                          {new Date().getDate()}
                        </p>,
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                          {[
                            new Date().toLocaleDateString("es-ES", {
                              month: "short",
                            }),
                            " ",
                            new Date().getFullYear(),
                          ]}
                        </p>,
                      ]}
                    </div>
                  </div>,
                ]}
              </div>
            </div>,
          ]}
        </div>,
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          {[
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between gap-3">
                {[
                  <div>
                    {[
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {"Comentarios"}
                      </h2>,
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {"Escribe un comentario para que todos lo vean"}
                      </p>,
                    ]}
                  </div>,
                  <div className="text-xs text-gray-500 dark:text-slate-400 tabular-nums">
                    {[Se, "/", Ie, " caracteres"]}
                  </div>,
                ]}
              </div>
            </div>,
            <div className="flex flex-col h-[60vh] min-h-[320px] overflow-hidden">
              {[
                <div
                  ref={ce}
                  onScroll={() => {
                    const t = ce.current;
                    if (!t) return;
                    const r = t.scrollHeight - t.scrollTop - t.clientHeight;
                    J.current = r < 120;
                  }}
                  className="flex-1 overflow-y-auto overscroll-auto p-5 sm:p-6 bg-gray-50/60 dark:bg-slate-900/20"
                >
                  {P || (!$ && !O && o.length === 0) ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((t) => (
                        <div
                          className="flex items-end gap-2 animate-pulse"
                          key={t}
                        >
                          {[
                            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700 flex-shrink-0" />,
                            <div className="flex-1 max-w-[70%]">
                              {[
                                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2" />,
                                <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded-2xl rounded-tl-none border border-gray-100 dark:border-slate-800" />,
                              ]}
                            </div>,
                          ]}
                        </div>
                      ))}
                    </div>
                  ) : O ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {O}
                    </div>
                  ) : o.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 select-none">
                      {[
                        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-indigo-300 dark:text-indigo-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                            />
                          </svg>
                        </div>,
                        <p className="text-sm font-medium text-gray-400 dark:text-slate-500">
                          {"Aún no hay comentarios"}
                        </p>,
                        <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">
                          {"¡Sé el primero en escribir!"}
                        </p>,
                      ]}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[
                        o.map((t) => {
                          const r = !!a && t.authorId === a.uid,
                            n = Pe === t.id,
                            i = hs(t.authorName),
                            f = le[t.authorId] || t.authorPhotoURL,
                            x =
                              l?.photoThumbURL ||
                              l?.photoURL ||
                              a?.photoURL ||
                              f;
                          return jsxRuntime.jsx(
                            "div",
                            {
                              className: `flex ${r ? "justify-end" : "justify-start"}`,
                              children: (
                                <div className="flex items-end gap-2 max-w-[90%]">
                                  {[
                                    r ? null : (
                                      <div className="flex-shrink-0">
                                        <RenderComponent1
                                          src={f}
                                          alt={t.authorName}
                                          initials={i}
                                        />
                                      </div>
                                    ),
                                    <div
                                      className={`px-4 py-3 text-sm whitespace-pre-wrap break-words shadow-md ${r ? "bg-blue-600 text-white rounded-2xl rounded-tr-none" : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-none border border-gray-100 dark:border-slate-700"} max-w-[85%]`}
                                      onPointerDown={() => be(t.id)}
                                      onPointerUp={E}
                                      onPointerCancel={E}
                                      onPointerLeave={E}
                                      onTouchStart={() => be(t.id)}
                                      onTouchEnd={E}
                                      onTouchCancel={E}
                                      onTouchMove={E}
                                      onMouseDown={() => be(t.id)}
                                      onMouseUp={E}
                                      onMouseLeave={E}
                                      onContextMenu={(c) => {
                                        (c.preventDefault(), Te(t.id));
                                      }}
                                    >
                                      {[
                                        !r && (
                                          <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-0.5 leading-tight">
                                            {t.authorName}
                                          </div>
                                        ),
                                        <div
                                          className={
                                            r
                                              ? "text-white/95"
                                              : "text-gray-800 dark:text-gray-100"
                                          }
                                        >
                                          {t.text}
                                        </div>,
                                        <div className="mt-1" />,
                                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                          {Oe.map((c) => {
                                            const u = ze(t, c.key),
                                              d = u.length;
                                            if (d <= 0) return null;
                                            const b = !!a && u.includes(a.uid);
                                            return jsxRuntime.jsxs(
                                              "button",
                                              {
                                                type: "button",
                                                onClick: () => {
                                                  (w((R) =>
                                                    R?.commentId === t.id &&
                                                    R?.reactionKey === c.key
                                                      ? null
                                                      : {
                                                          commentId: t.id,
                                                          reactionKey: c.key,
                                                        },
                                                  ),
                                                    kt(u));
                                                },
                                                disabled: p === t.id,
                                                className: `px-2 py-1 rounded-full border text-xs flex items-center gap-1 ${b ? "bg-white/70 dark:bg-slate-800 border-indigo-200 dark:border-indigo-700" : "bg-white/60 dark:bg-slate-900/30 border-gray-200 dark:border-slate-700"}`,
                                                children: [
                                                  <span>{c.emoji}</span>,
                                                  <span className="text-gray-700 dark:text-slate-200">
                                                    {d}
                                                  </span>,
                                                ],
                                              },
                                              c.key,
                                            );
                                          })}
                                        </div>,
                                        n ? (
                                          <div className="mt-2 space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                              {Oe.map((c) => {
                                                const u = ze(t, c.key),
                                                  d = !!a && u.includes(a.uid);
                                                return jsxRuntime.jsx(
                                                  "button",
                                                  {
                                                    type: "button",
                                                    onClick: () =>
                                                      Dt(t.id, c.key),
                                                    disabled: p === t.id,
                                                    className: `w-9 h-9 rounded-full border flex items-center justify-center text-lg ${d ? "bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-700" : "bg-white/60 dark:bg-slate-900/30 border-gray-200 dark:border-slate-700"}`,
                                                    title: c.key,
                                                    children: c.emoji,
                                                  },
                                                  c.key,
                                                );
                                              })}
                                            </div>
                                          </div>
                                        ) : null,
                                        <div className="mt-1 flex items-center justify-between gap-2">
                                          {[
                                            <div className="flex items-center gap-1">
                                              {[
                                                <button
                                                  type="button"
                                                  onClick={(c) => {
                                                    (c.stopPropagation(),
                                                      Te(t.id));
                                                  }}
                                                  disabled={p === t.id}
                                                  className={`p-1 -ml-1 rounded-full transition-colors ${r ? "hover:bg-white/20 text-white/70 hover:text-white" : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"}`}
                                                  title="Reaccionar"
                                                >
                                                  <SmileIcon size={16} />
                                                </button>,
                                                (r || $e) && (
                                                  <button
                                                    type="button"
                                                    onClick={(c) => {
                                                      (c.stopPropagation(),
                                                        Lt(t));
                                                    }}
                                                    disabled={
                                                      v === t.id || p === t.id
                                                    }
                                                    className={`p-1 rounded-full transition-colors ${r ? "hover:bg-white/20 text-white/70 hover:text-white" : "hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"}`}
                                                    title="Eliminar"
                                                  >
                                                    <Trash2Icon size={16} />
                                                  </button>
                                                ),
                                              ]}
                                            </div>,
                                            <div
                                              className={`text-[10px] ${r ? "text-white/80" : "text-gray-500 dark:text-slate-400"}`}
                                            >
                                              {Tt(t.createdAt)}
                                            </div>,
                                          ]}
                                        </div>,
                                      ]}
                                    </div>,
                                    r ? (
                                      <div className="flex-shrink-0">
                                        <RenderComponent1
                                          src={x}
                                          alt={t.authorName}
                                          initials={i}
                                        />
                                      </div>
                                    ) : null,
                                  ]}
                                </div>
                              ),
                            },
                            t.id,
                          );
                        }),
                        <div ref={B} />,
                      ]}
                    </div>
                  )}
                </div>,
                <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <div className="flex items-end gap-2">
                    {[
                      <div className="flex-1 relative bg-gray-100 dark:bg-slate-900 rounded-3xl">
                        <textarea
                          value={F}
                          onChange={(t) => re(xs(t.target.value, Ie))}
                          onKeyDown={(t) => {
                            t.key === "Enter" &&
                              !t.shiftKey &&
                              (t.preventDefault(), Je());
                          }}
                          rows={1}
                          placeholder="Escribe un comentario..."
                          className="w-full min-h-[44px] max-h-32 py-2.5 px-4 bg-transparent resize-none text-base leading-relaxed text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none"
                          disabled={te}
                        />
                      </div>,
                      <LoadingButton
                        onClick={Je}
                        loading={te}
                        disabled={!F.trim() || te}
                        className="w-11 h-11 mb-px shrink-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center transition-all disabled:opacity-50 disabled:shadow-none"
                        title="Enviar"
                        aria-label="Enviar"
                      >
                        <ArrowRightIcon
                          size={20}
                          className="ml-0.5"
                          aria-hidden="true"
                        />
                      </LoadingButton>,
                    ]}
                  </div>
                </div>,
              ]}
            </div>,
          ]}
        </div>,
        K ? (
          <LoadingSpinner text="Cargando dashboard..." />
        ) : $e ? (
          <RenderComponent2 events={I} navigate={k} assignments={N} />
        ) : (
          <RenderComponent3
            assignments={N}
            events={I}
            navigate={k}
            bffRefresh={z ? yt : null}
            onOptimisticAttendance={jt}
          />
        ),
        <Modal
          isOpen={!!Q}
          onClose={() => w(null)}
          title={
            <div className="flex items-center gap-2">
              {[
                <span className="text-2xl">
                  {Q && Oe.find((t) => t.key === Q.reactionKey)?.emoji}
                </span>,
                <span>{"Reacciones"}</span>,
              ]}
            </div>
          }
          maxWidth="max-w-xs"
        >
          <div className="max-h-80 overflow-y-auto overflow-x-hidden -mx-6 px-6 no-scrollbar">
            {Q &&
              (() => {
                const t = o.find((n) => n.id === Q.commentId);
                if (!t) return null;
                const r = ze(t, Q.reactionKey);
                return (
                  <div className="flex flex-col gap-3 py-1">
                    {r.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center">
                        {"No hay reacciones."}
                      </p>
                    ) : (
                      r.map((n) => {
                        const i = a && n === a.uid ? "Tú" : Z[n] || "Usuario",
                          f = le[n],
                          x = i.slice(0, 2).toUpperCase();
                        return (
                          <div className="flex items-center gap-3" key={n}>
                            {[
                              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-slate-600">
                                {f ? (
                                  <OptimizedImage
                                    src={f}
                                    alt={i}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-slate-400 font-bold text-xs">
                                    {x}
                                  </div>
                                )}
                              </div>,
                              <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                {i}
                              </span>,
                            ]}
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })()}
          </div>
        </Modal>,
      ]}
    </div>
  );
};
const RenderComponent2 = ({ events: a, navigate: l, assignments: m }) => {
  const k = m.length > 0;
  return (
    <div className="space-y-8">
      {[
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            <button
              onClick={() => l("/dashboard/events")}
              className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 text-center group"
            >
              {[
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full group-hover:scale-110 transition-transform">
                  <PlusIcon size={24} />
                </div>,
                <span className="font-medium text-gray-900 dark:text-white">
                  {"Crear Evento"}
                </span>,
              ]}
            </button>,
            <button
              onClick={() => l("/dashboard/volunteers")}
              className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 text-center group"
            >
              {[
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full group-hover:scale-110 transition-transform">
                  <UserPlusIcon size={24} />
                </div>,
                <span className="font-medium text-gray-900 dark:text-white">
                  {"Gestionar Equipo"}
                </span>,
              ]}
            </button>,
          ]}
        </div>,
        k ? (
          <RenderComponent3
            assignments={m}
            events={a}
            navigate={l}
            hideEventsGrid={!0}
          />
        ) : null,
        <div>
          {[
            <div className="flex items-center justify-between mb-6">
              {[
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {"Próximos Eventos"}
                </h2>,
                <button
                  onClick={() => l("/dashboard/events")}
                  className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-all border border-indigo-200 dark:border-indigo-800 hover:border-indigo-600 dark:hover:border-indigo-500"
                >
                  {["Ver todos ", <ArrowRightIcon size={16} />]}
                </button>,
              ]}
            </div>,
            <EventsGrid
              events={a}
              assignments={m}
              navigate={l}
              variant="detailed"
            />,
          ]}
        </div>,
      ]}
    </div>
  );
};
const RenderComponent3 = ({
  assignments: a,
  events: l,
  navigate: m,
  bffRefresh: k,
  onOptimisticAttendance: y,
  hideEventsGrid: N = !1,
}) => {
  const D = useAppDialog(),
    I = a.filter((s) =>
      !!s.checkInTime && !!s.checkOutTime
        ? fs(s)
        : ps(s.eventDate) || new Date(s.eventDate) > new Date(),
    ),
    M = (() => {
      if (I.length > 0) return I;
      const s = new Date();
      return (
        s.setHours(0, 0, 0, 0),
        a.filter((p) => {
          if (!p.eventDate) return !1;
          const [S, v, g] = p.eventDate.split("-").map(Number),
            L = new Date(S, (v || 1) - 1, g || 1);
          return (L.setHours(0, 0, 0, 0), L >= s);
        })
      );
    })(),
    K = M.filter((s) =>
      s.checkOutTime || s.attendanceStatus === "completed"
        ? !1
        : (s.checkInTime && !s.checkOutTime) ||
            (!s.checkInTime && !s.checkOutTime)
          ? !0
          : !s.attendanceStatus || s.attendanceStatus === "pending",
    ),
    q = (s) => {
      const p = (S) => {
        const v = S?.eventDate,
          g = S?.eventServiceTime || S?.eventTime || "00:00",
          [L, ce, J] = String(v || "")
            .split("-")
            .map(Number),
          [W, B] = String(g).split(":").map(Number);
        return new Date(L || 1970, (ce || 1) - 1, J || 1, W || 0, B || 0);
      };
      return s.slice().sort((S, v) => p(S).getTime() - p(v).getTime());
    },
    o = (() => {
      const s = M.filter(
        (p) =>
          !(
            !p ||
            p.checkOutTime ||
            Re(
              p.eventDate,
              p.eventServiceTime,
              p.eventTime,
              p.eventEndTime,
              p.eventStatus,
            ).phase === "closed"
          ),
      );
      return s.length > 0
        ? q(s)[0]
        : K.length > 0
          ? q(K)[0]
          : M.length > 0
            ? q(M)[0]
            : null;
    })(),
    [ee, P] = React.useState(!1),
    [G, O] = React.useState(!1),
    [T, $] = React.useState(null),
    [ae, F] = React.useState({
      isOpen: !1,
      mode: "prompt",
    }),
    [re, te] = React.useState(null),
    [Ne, Se] = React.useState(!1),
    le = async (s, p, S) => {
      it().catch(() => {});
      const v = await ds();
      if (v === "denied") {
        (te({
          assignmentId: s,
          eventId: p,
          type: S,
        }),
          F({
            isOpen: !0,
            mode: "denied",
          }));
        return;
      }
      if (v === "granted") {
        ($({
          assignmentId: s,
          eventId: p,
          type: S,
        }),
          P(!0));
        return;
      }
      (te({
        assignmentId: s,
        eventId: p,
        type: S,
      }),
        F({
          isOpen: !0,
          mode: "prompt",
        }));
    },
    pe = async () => {
      if (re) {
        (it().catch(() => {}), Se(!0));
        try {
          (await ot(),
            F({
              isOpen: !1,
              mode: "prompt",
            }),
            $(re),
            P(!0));
        } catch (s) {
          (console.error("Error obteniendo ubicación:", s),
            F({
              isOpen: !0,
              mode: "denied",
            }));
        } finally {
          Se(!1);
        }
      }
    },
    Pe = async (s) => {
      if (!T) return;
      O(!0);
      const { assignmentId: p, eventId: S, type: v } = T;
      try {
        const g = await ot(),
          L = dataUrlToBlob(s),
          ce = new File([L], `${v}_${Date.now()}.jpg`, {
            type: "image/jpeg",
          }),
          J = await compressImage(ce, 900, 0.72),
          W = a.find((w) => w.id === p && w.eventId === S);
        let B = !1,
          ne = !1;
        if (W) {
          const w = Re(
            W.eventDate,
            W.eventServiceTime,
            W.eventTime,
            W.eventEndTime,
            W.eventStatus,
          );
          v === "check-in" ? (B = w.isLate) : (ne = w.isCheckOutLate);
        }
        let Q;
        if (isBffEnabled()) {
          const w = new FormData();
          w.set("type", v);
          const Z = new Date().toISOString(),
            _ = v === "check-in" ? (B ? "late" : "present") : "completed";
          (w.set("attendanceTimeIso", Z),
            w.set("attendanceStatus", _),
            w.set("wasLate", B ? "1" : "0"),
            w.set("wasCheckOutLate", ne ? "1" : "0"),
            w.set("lat", String(g.lat)),
            w.set("lng", String(g.lng)),
            typeof g.accuracyMeters == "number" &&
              w.set("accuracyMeters", String(g.accuracyMeters)),
            w.set("capturedAtMs", String(g.timestampMs)),
            w.set("file", J, J.name));
          const se = `/api/events/${encodeURIComponent(S)}/assignments/${encodeURIComponent(p)}/attendance`;
          let V = null;
          try {
            V = await bffFetch(`${se}/photo`, {
              method: "POST",
              body: w,
              timeoutMs: cs,
            });
          } catch (E) {
            if (!us(E)) throw E;
            (console.warn(
              "[Dashboard] Attendance photo upload timed out; marking without photo",
              E,
            ),
              await bffFetch(se, {
                method: "POST",
                json: {
                  type: v,
                  attendanceTimeIso: Z,
                  attendanceStatus: _,
                  wasLate: B,
                  wasCheckOutLate: ne,
                  location: {
                    lat: g.lat,
                    lng: g.lng,
                    ...(typeof g.accuracyMeters == "number"
                      ? {
                          accuracyMeters: g.accuracyMeters,
                        }
                      : {}),
                    capturedAtMs: g.timestampMs,
                  },
                },
                timeoutMs: ms,
              }),
              D.showInfo(
                "Tu asistencia fue registrada, pero la foto no se pudo subir por conexión lenta. Puedes continuar.",
                "Asistencia registrada",
              ));
          }
          const U = V?.photoPath;
          Q = U || "";
        } else {
          const w = Date.now(),
            Z = ss(firebaseStorage, `attendance/${S}/${p}/${v}_${w}.jpg`);
          (await as(Z, J), (Q = await rs(Z)));
        }
        if (!isBffEnabled()) {
          const w = Ge(firestoreDb, "events", S, "assignments", p),
            Z = new Date().toISOString(),
            _ = {
              [v === "check-in" ? "checkInTime" : "checkOutTime"]: Z,
              [v === "check-in" ? "checkInPhoto" : "checkOutPhoto"]: Q,
              [v === "check-in" ? "checkInLocation" : "checkOutLocation"]: {
                lat: g.lat,
                lng: g.lng,
                accuracyMeters: g.accuracyMeters,
                capturedAt: new Date(g.timestampMs).toISOString(),
              },
            };
          (v === "check-in"
            ? (_.attendanceStatus = B ? "late" : "present")
            : (_.attendanceStatus = "completed"),
            v === "check-in" ? (_.wasLate = B) : (_.wasCheckOutLate = ne));
          const se = W?.userId;
          if (se) {
            let V = [];
            try {
              V = (
                await rt(
                  Ae(
                    fe(firestoreDb, "events", S, "assignments"),
                    je("userId", "==", se),
                  ),
                )
              ).docs;
            } catch (U) {
              const E = String(U?.message || "");
              if (U?.code === "failed-precondition" || E.includes("index"))
                V = (
                  await rt(fe(firestoreDb, "events", S, "assignments"))
                ).docs.filter((be) => be.data()?.userId === se);
              else throw U;
            }
            if (V.length) {
              const U = ns(firestoreDb);
              (V.forEach((E) => {
                U.set(E.ref, _, {
                  merge: !0,
                });
              }),
                await U.commit());
            } else
              await nt(w, _, {
                merge: !0,
              });
          } else
            await nt(w, _, {
              merge: !0,
            });
        }
        if (isBffEnabled()) {
          try {
            const w = new Date().toISOString();
            y?.({
              eventId: S,
              type: v,
              attendanceTimeIso: w,
              attendanceStatus:
                v === "check-in" ? (B ? "late" : "present") : "completed",
              wasLate: B,
              wasCheckOutLate: ne,
              location: {
                lat: g.lat,
                lng: g.lng,
                ...(typeof g.accuracyMeters == "number"
                  ? {
                      accuracyMeters: g.accuracyMeters,
                    }
                  : {}),
                capturedAt: new Date(g.timestampMs).toISOString(),
              },
            });
          } catch {}
          k?.();
        }
        $(null);
      } catch (g) {
        console.error(`Error performing ${v}:`, g);
        const L = String(g?.message || g),
          J =
            L.toLowerCase().includes("timeout") ||
            L.toLowerCase().includes("abort")
              ? "Tiempo de espera agotado. Revisa tu conexión e intenta nuevamente."
              : L;
        D.showError(
          `No se pudo registrar ${v === "check-in" ? "entrada" : "salida"}.
${J}`,
          "Error",
        );
      } finally {
        O(!1);
      }
    };
  return (
    <div className="space-y-12">
      {[
        <RenderComponent4
          isOpen={ae.isOpen}
          mode={ae.mode}
          isLoading={Ne}
          onClose={() => {
            (F((s) => ({
              ...s,
              isOpen: !1,
            })),
              te(null));
          }}
          onContinue={pe}
        />,
        ee && (
          <React.Suspense fallback={null}>
            <RenderComponent5
              isOpen={ee}
              onClose={() => {
                (P(!1), $(null));
              }}
              onCapture={Pe}
              title={
                T?.type === "check-in"
                  ? "Registrar Entrada"
                  : "Registrar Salida"
              }
            />
          </React.Suspense>
        ),
        G && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
              {[
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />,
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {"Guardando asistencia..."}
                </p>,
              ]}
            </div>
          </div>
        ),
        o &&
          (() => {
            const s = Re(
              o.eventDate,
              o.eventServiceTime,
              o.eventTime,
              o.eventEndTime,
              o.eventStatus,
            );
            return (
              <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 dark:border-slate-700">
                {[
                  <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />,
                  <div className="p-6 md:p-8">
                    {[
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3">
                          {[
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                              <CalendarIcon
                                size={24}
                                className="text-indigo-600 dark:text-indigo-400"
                              />
                            </div>,
                            <div className="space-y-1">
                              {[
                                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
                                  {"Próximo Servicio"}
                                </p>,
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                  {o.eventTitle}
                                </h2>,
                                <div className="inline-flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-200 bg-indigo-50/70 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                                  {[
                                    <MapPinIcon size={12} />,
                                    o.eventLocation || "Sin ubicación",
                                  ]}
                                </div>,
                              ]}
                            </div>,
                          ]}
                        </div>
                      </div>,
                      <div className="grid md:grid-cols-12 gap-6 items-stretch">
                        {[
                          <div className="md:col-span-7 flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                              <div className="flex items-center gap-4">
                                {[
                                  <div className="text-center min-w-[72px] rounded-xl bg-white/60 dark:bg-slate-800/60 py-2 shadow-inner">
                                    {[
                                      <p className="text-4xl font-bold text-gray-900 dark:text-white leading-none">
                                        {new Date(
                                          o.eventDate + "T00:00:00",
                                        ).getDate()}
                                      </p>,
                                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 uppercase mt-1">
                                        {He(o.eventDate, {
                                          month: "short",
                                        })}
                                      </p>,
                                    ]}
                                  </div>,
                                  <div className="flex-1 space-y-1">
                                    {[
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                        {He(o.eventDate, {
                                          weekday: "long",
                                        })}
                                      </p>,
                                      <div className="flex flex-wrap gap-2">
                                        {[
                                          o.eventServiceTime && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                                              {[
                                                <ClockIcon size={12} />,
                                                " Servicio:",
                                                " ",
                                                o.eventServiceTime,
                                              ]}
                                            </span>
                                          ),
                                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                                            {[
                                              <ClockIcon size={12} />,
                                              " Evento:",
                                              " ",
                                              o.eventTime,
                                              o.eventEndTime && (
                                                <span className="ml-1">
                                                  {["– ", o.eventEndTime]}
                                                </span>
                                              ),
                                            ]}
                                          </span>,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                ]}
                              </div>
                            </div>
                          </div>,
                          <div className="md:col-span-5 flex flex-col gap-4">
                            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 h-full flex flex-col justify-center">
                              {[
                                <p className="text-[10px] font-semibold text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-wider mb-1">
                                  {"Tu Asignación"}
                                </p>,
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {normalizeRoleId(o.roleName)}
                                </p>,
                                <p className="text-sm text-gray-600 dark:text-slate-300">
                                  {o.areaName}
                                </p>,
                              ]}
                            </div>
                          </div>,
                        ]}
                      </div>,
                      <div className="mt-6 flex flex-col items-center">
                        {[
                          o.checkInTime && o.checkOutTime ? (
                            <jsxRuntime.Fragment>
                              {[
                                <div
                                  className={`w-full max-w-md py-3 font-semibold rounded-xl text-center flex items-center justify-center gap-2 border ${o.wasLate || o.wasCheckOutLate ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"}`}
                                >
                                  {[
                                    <CircleCheckBigIcon size={18} />,
                                    o.wasLate || o.wasCheckOutLate
                                      ? "Servicio Completado (con atraso)"
                                      : "Servicio Completado",
                                  ]}
                                </div>,
                                <div className="flex items-center gap-4 mt-3">
                                  {[
                                    o.checkInTime && (
                                      <div
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${o.wasLate ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"}`}
                                      >
                                        {[
                                          <LogInIcon size={14} />,
                                          new Date(
                                            o.checkInTime,
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }),
                                          o.wasLate && " ⚠️",
                                        ]}
                                      </div>
                                    ),
                                    o.checkOutTime && (
                                      <div
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${o.wasCheckOutLate ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"}`}
                                      >
                                        {[
                                          <LogOutIcon size={14} />,
                                          new Date(
                                            o.checkOutTime,
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }),
                                          o.wasCheckOutLate && " ⚠️",
                                        ]}
                                      </div>
                                    ),
                                  ]}
                                </div>,
                              ]}
                            </jsxRuntime.Fragment>
                          ) : !o.checkInTime && o.checkOutTime ? (
                            <div className="w-full max-w-md py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-semibold rounded-xl text-center flex items-center justify-center gap-2 border border-amber-200 dark:border-amber-800/50">
                              {[
                                <CircleCheckBigIcon size={18} />,
                                "Salida registrada (sin entrada)",
                              ]}
                            </div>
                          ) : !o.checkInTime && !o.checkOutTime ? (
                            s.canCheckIn ? (
                              <button
                                onClick={() => le(o.id, o.eventId, "check-in")}
                                className="w-full max-w-md py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                              >
                                {[<LogInIcon size={18} />, "Registrar Entrada"]}
                              </button>
                            ) : s.phase === "event-started" ? (
                              <div className="w-full max-w-md py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium rounded-xl text-center text-sm border border-amber-200 dark:border-amber-800/50">
                                {[
                                  <p className="font-semibold">
                                    {"Evento en curso"}
                                  </p>,
                                  <p className="text-xs mt-1 opacity-80">
                                    {
                                      "No registraste entrada - podrás marcar salida al finalizar"
                                    }
                                  </p>,
                                ]}
                              </div>
                            ) : s.canCheckOut ? (
                              <div className="w-full max-w-md flex flex-col gap-2">
                                {[
                                  <p className="text-xs text-amber-600 dark:text-amber-400 text-center font-medium">
                                    {"⚠️ No registraste entrada"}
                                  </p>,
                                  <button
                                    onClick={() =>
                                      le(o.id, o.eventId, "check-out")
                                    }
                                    className="w-full py-3 bg-gray-800 hover:bg-gray-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                  >
                                    {[
                                      <LogOutIcon size={18} />,
                                      "Registrar Salida",
                                    ]}
                                  </button>,
                                ]}
                              </div>
                            ) : s.phase === "closed" ? (
                              <div className="w-full max-w-md py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-semibold rounded-xl text-center flex items-center justify-center gap-2 border border-red-200 dark:border-red-800/50">
                                {[
                                  <CircleXIcon size={18} />,
                                  "Falta - No registraste asistencia",
                                ]}
                              </div>
                            ) : (
                              <div className="w-full max-w-md py-3 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 font-medium rounded-xl text-center text-sm">
                                {s.message}
                              </div>
                            )
                          ) : s.phase === "event-started" ? (
                            <div className="w-full max-w-md py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium rounded-xl text-center border border-blue-200 dark:border-blue-800/50">
                              {[
                                <p className="font-semibold flex items-center justify-center gap-2">
                                  {[
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />,
                                    "Evento en curso",
                                  ]}
                                </p>,
                                <p className="text-xs mt-1 opacity-80">
                                  {"Podrás marcar salida al finalizar"}
                                </p>,
                              ]}
                            </div>
                          ) : s.canCheckOut ? (
                            <button
                              onClick={() => le(o.id, o.eventId, "check-out")}
                              className="w-full max-w-md py-3 bg-gray-800 hover:bg-gray-900 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              {[<LogOutIcon size={18} />, "Registrar Salida"]}
                            </button>
                          ) : s.phase === "closed" ? (
                            <jsxRuntime.Fragment>
                              {[
                                <div className="w-full max-w-md py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-semibold rounded-xl text-center flex items-center justify-center gap-2 border border-amber-200 dark:border-amber-800/50">
                                  {[
                                    <CircleCheckBigIcon size={18} />,
                                    "Completado - Sin salida",
                                  ]}
                                </div>,
                                <div className="flex items-center gap-4 mt-3">
                                  {[
                                    o.checkInTime && (
                                      <div
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${o.wasLate ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"}`}
                                      >
                                        {[
                                          <LogInIcon size={14} />,
                                          new Date(
                                            o.checkInTime,
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }),
                                          o.wasLate && " (tarde)",
                                        ]}
                                      </div>
                                    ),
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                      {[
                                        <LogOutIcon size={14} />,
                                        "❌ Sin salida",
                                      ]}
                                    </div>,
                                  ]}
                                </div>,
                              ]}
                            </jsxRuntime.Fragment>
                          ) : (
                            <div className="w-full max-w-md py-3 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 font-medium rounded-xl text-center text-sm">
                              {s.message}
                            </div>
                          ),
                          <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                            {[
                              <div
                                className={`w-2 h-2 rounded-full ${s.phase === "event-started" ? "bg-blue-500 animate-pulse" : s.phase === "event-ended" && !o.checkOutTime ? "bg-emerald-500 animate-pulse" : s.isOpen ? (s.isLate ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse") : "bg-gray-400"}`}
                              />,
                              <span
                                className={`${s.phase === "event-started" ? "text-blue-600 dark:text-blue-400" : s.phase === "event-ended" && !o.checkOutTime ? "text-emerald-600 dark:text-emerald-400" : s.isOpen ? (s.isLate ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400") : "text-gray-600 dark:text-slate-300"}`}
                              >
                                {s.phase === "event-started" && o.checkInTime
                                  ? "Evento en curso · Entrada registrada"
                                  : s.phase === "event-ended" &&
                                      !o.checkOutTime &&
                                      o.checkInTime
                                    ? "Evento finalizado · Marca tu salida"
                                    : s.message}
                              </span>,
                            ]}
                          </div>,
                        ]}
                      </div>,
                    ]}
                  </div>,
                ]}
              </div>
            );
          })(),
        M.length > 0 && (
          <div>
            {[
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {"Tu Calendario de Esta Semana"}
              </h3>,
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                {
                  "Servicios de lunes a domingo. Los completados desaparecen después de 2 días."
                }
              </p>,
              <div className="grid gap-4">
                {M.map((s, p) => {
                  const S =
                      s.attendanceStatus === "present" ||
                      !!s.checkInTime ||
                      !!s.checkOutTime,
                    v =
                      s.attendanceStatus === "completed" ||
                      (!!s.checkInTime && !!s.checkOutTime) ||
                      (!s.checkInTime && !!s.checkOutTime),
                    g = Re(
                      s.eventDate,
                      s.eventServiceTime,
                      s.eventTime,
                      s.eventEndTime,
                      s.eventStatus,
                    ),
                    L = g.isOpen
                      ? g.isLate
                        ? "border-amber-200/70 dark:border-amber-500/40"
                        : "border-emerald-200/70 dark:border-emerald-500/40"
                      : "border-gray-100 dark:border-slate-700";
                  return (
                    <div
                      className={`bg-white dark:bg-slate-800 rounded-2xl border ${L} p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5`}
                      key={`assign_${s.eventId || "evt"}_${s.id || p}_${s.areaId || s.areaName || "area"}_${s.roleId || s.roleName || "role"}_${p}`}
                    >
                      {[
                        <div className="flex flex-col md:flex-row md:items-center gap-5">
                          {[
                            <div className="flex-shrink-0 flex md:flex-col items-center justify-center gap-2 md:gap-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl p-4 md:w-24 md:h-24 text-center">
                              {[
                                <span className="text-xs font-bold uppercase tracking-wide">
                                  {He(s.eventDate, {
                                    month: "short",
                                  })}
                                </span>,
                                <span className="text-3xl font-bold">
                                  {gs(s.eventDate)}
                                </span>,
                              ]}
                            </div>,
                            <div className="flex-1 min-w-0">
                              {[
                                <div className="flex items-center gap-2 mb-2">
                                  {[
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
                                      {s.areaName}
                                    </span>,
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                      {s.roleName}
                                    </span>,
                                  ]}
                                </div>,
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                  {s.eventTitle}
                                </h4>,
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
                                  {[
                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full font-semibold text-indigo-700 dark:text-indigo-200">
                                      {[
                                        <ClockIcon size={14} />,
                                        " ",
                                        s.eventTime,
                                      ]}
                                    </span>,
                                    s.eventServiceTime && (
                                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full font-semibold text-emerald-700 dark:text-emerald-200">
                                        {[
                                          <ClockIcon size={14} />,
                                          " Servicio:",
                                          " ",
                                          s.eventServiceTime,
                                        ]}
                                      </span>
                                    ),
                                    s.eventEndTime && (
                                      <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full font-semibold text-amber-700 dark:text-amber-200">
                                        {[
                                          <ClockIcon size={14} />,
                                          " Fin: ",
                                          s.eventEndTime,
                                        ]}
                                      </span>
                                    ),
                                    <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
                                      {[
                                        <MapPinIcon size={14} />,
                                        " ",
                                        s.eventLocation,
                                      ]}
                                    </span>,
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${g.isOpen ? (g.isLate ? "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border-amber-200/70 dark:border-amber-700/60" : "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border-emerald-200/70 dark:border-emerald-700/60") : "bg-gray-50 text-gray-700 dark:bg-slate-800/60 dark:text-slate-200 border-gray-200 dark:border-slate-700"}`}
                                      title="Estado de ventana de asistencia"
                                    >
                                      {[<ClockIcon size={12} />, g.message]}
                                    </span>,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                          {v ? (
                            <jsxRuntime.Fragment>
                              {[
                                !s.checkInTime && s.checkOutTime ? (
                                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-700/50">
                                    {[
                                      <CircleCheckBigIcon size={16} />,
                                      "Sin entrada",
                                    ]}
                                  </span>
                                ) : s.wasLate || s.wasCheckOutLate ? (
                                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-700/50">
                                    {[
                                      <CircleCheckBigIcon size={16} />,
                                      "Completado con atraso",
                                    ]}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/50">
                                    {[
                                      <CircleCheckBigIcon size={16} />,
                                      "Completado",
                                    ]}
                                  </span>
                                ),
                                <div className="flex items-center gap-2">
                                  {[
                                    s.checkInTime && (
                                      <div
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${s.wasLate ? "bg-amber-50 dark:bg-amber-900/30 shadow-[0_8px_22px_-12px_rgba(245,158,11,0.8)]" : "bg-emerald-50 dark:bg-emerald-900/30 shadow-[0_8px_22px_-12px_rgba(16,185,129,0.8)]"}`}
                                      >
                                        {[
                                          <LogInIcon
                                            size={14}
                                            className={
                                              s.wasLate
                                                ? "text-amber-600 dark:text-amber-400"
                                                : "text-emerald-600 dark:text-emerald-400"
                                            }
                                          />,
                                          <span
                                            className={`text-sm font-semibold ${s.wasLate ? "text-amber-700 dark:text-amber-200" : "text-emerald-700 dark:text-emerald-200"}`}
                                          >
                                            {[
                                              new Date(
                                                s.checkInTime,
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              }),
                                              s.wasLate && " ⚠️",
                                            ]}
                                          </span>,
                                        ]}
                                      </div>
                                    ),
                                    s.checkOutTime && (
                                      <div
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${s.wasCheckOutLate ? "bg-amber-50 dark:bg-amber-900/30 shadow-[0_8px_22px_-12px_rgba(245,158,11,0.8)]" : "bg-blue-50 dark:bg-blue-900/30 shadow-[0_8px_22px_-12px_rgba(59,130,246,0.8)]"}`}
                                      >
                                        {[
                                          <LogOutIcon
                                            size={14}
                                            className={
                                              s.wasCheckOutLate
                                                ? "text-amber-600 dark:text-amber-400"
                                                : "text-blue-600 dark:text-blue-400"
                                            }
                                          />,
                                          <span
                                            className={`text-sm font-semibold ${s.wasCheckOutLate ? "text-amber-700 dark:text-amber-200" : "text-blue-700 dark:text-blue-200"}`}
                                          >
                                            {[
                                              new Date(
                                                s.checkOutTime,
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              }),
                                              s.wasCheckOutLate && " ⚠️",
                                            ]}
                                          </span>,
                                        ]}
                                      </div>
                                    ),
                                  ]}
                                </div>,
                              ]}
                            </jsxRuntime.Fragment>
                          ) : S ? (
                            <jsxRuntime.Fragment>
                              {[
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/50">
                                  {[
                                    <CircleCheckBigIcon size={16} />,
                                    "En Servicio",
                                  ]}
                                </span>,
                                s.checkInTime && (
                                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full shadow-[0_8px_22px_-12px_rgba(16,185,129,0.8)]">
                                    {[
                                      <LogInIcon
                                        size={14}
                                        className="text-emerald-600 dark:text-emerald-400"
                                      />,
                                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                                        {new Date(
                                          s.checkInTime,
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>,
                                    ]}
                                  </div>
                                ),
                              ]}
                            </jsxRuntime.Fragment>
                          ) : g.phase === "closed" ? (
                            <jsxRuntime.Fragment>
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200/60 dark:border-red-700/50">
                                {[<CircleXIcon size={16} />, "Falta"]}
                              </span>
                            </jsxRuntime.Fragment>
                          ) : (
                            <jsxRuntime.Fragment>
                              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 border border-gray-200/60 dark:border-slate-600/50">
                                {"Próximamente"}
                              </span>
                            </jsxRuntime.Fragment>
                          )}
                        </div>,
                      ]}
                    </div>
                  );
                })}
              </div>,
            ]}
          </div>
        ),
        !N && (
          <div>
            {[
              <div className="flex items-center justify-between mb-6">
                {[
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {"Próximos Eventos"}
                  </h2>,
                  <button
                    onClick={() => m("/dashboard/events")}
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-all border border-indigo-200 dark:border-indigo-800 hover:border-indigo-600 dark:hover:border-indigo-500"
                  >
                    {["Ver todos ", <ArrowRightIcon size={16} />]}
                  </button>,
                ]}
              </div>,
              <EventsGrid
                events={l}
                assignments={a}
                navigate={m}
                variant="detailed"
              />,
            ]}
          </div>
        ),
      ]}
    </div>
  );
};
export { Dashboard };
