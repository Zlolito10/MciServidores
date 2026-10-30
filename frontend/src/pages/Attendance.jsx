// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { PrivateImage } from "../components/PrivateImage.jsx";
import { releaseProtectedImage } from "../services/private-image-client.js";
import {
  assignmentPrivacyKey,
  assignmentManagedAreas,
  readScopedAssignments,
  watchScopedAssignments,
  trackedAssignmentCollection as de,
  trackedAssignmentQuery as we,
  trackedAssignmentWhere as ie,
} from "../services/assignment-client.js";
import { _ as Fa } from "../vendor/vendor-pdf-Cf03QSry.js";
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import {
  H as gt,
  L as Pa,
  J as ta,
  A as Xe,
  w as ye,
  S as Mt,
  M as Sn,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  useAuth,
  useAppDialog,
  useGlobalData,
  isBffEnabled,
  bffFetch,
  firestoreDb,
  useChangeFeed,
  OptimizedImage,
  Modal,
  resolveCachedImageUrl,
} from "../app/App.jsx";
import { normalizeRoleId } from "../utils/roles.js";
import { SelectPicker } from "../components/SelectPicker.jsx";
import {
  d as CalendarIcon,
  O as ChevronLeftIcon,
  Q as ChevronRightIcon,
  Z as FileTextIcon,
  x as ChevronDownIcon,
  f as UsersIcon,
  w as SearchIcon,
  H as HistoryIcon,
  y as SquarePenIcon,
  r as Trash2Icon,
  af as RotateCcwIcon,
  C as CheckIcon,
  s as ClockIcon,
  I as ImageIcon,
  n as MapPinIcon,
  X as XIcon,
  h as ClipboardListIcon,
  $ as DownloadIcon,
  L as LoaderCircleIcon,
  T as TriangleAlertIcon,
  t as CircleCheckBigIcon,
  v as CircleXIcon,
  a0 as ExternalLinkIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import { LoadingButton } from "../components/LoadingButton.jsx";
const An = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const Ga = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const ft = (m, k, p) => {
  const P = String(k + 1).padStart(2, "0"),
    w = String(p).padStart(2, "0");
  return `${m}-${P}-${w}`;
};
const Gt = (m) => {
  if (!m) return null;
  const k = m.split("-").map(Number);
  return k.length !== 3
    ? null
    : {
        year: k[0],
        month: k[1] - 1,
        day: k[2],
      };
};
const aa = (m, k) => (m < k ? -1 : m > k ? 1 : 0);
const On = ({
  startDate: m,
  endDate: k,
  onStartDateChange: p,
  onEndDateChange: P,
  enabledDates: w,
  disabled: Z = !1,
}) => {
  const [ee, oe] = React.useState(!1),
    [be, ne] = React.useState(!1),
    V = new Date(),
    he = V.getFullYear(),
    D = V.getMonth(),
    Ue = V.getDate(),
    Oe = Gt(m),
    [xe, G] = React.useState(Oe ? Oe.month : D),
    [ae, pt] = React.useState(Oe ? Oe.year : he),
    vt = React.useRef(null);
  (React.useEffect(() => {
    const S = Gt(m);
    S && (G(S.month), pt(S.year));
  }, [m]),
    React.useEffect(() => {
      const S = ($) => {
        vt.current && !vt.current.contains($.target) && (oe(!1), ne(!1));
      };
      return (
        document.addEventListener("mousedown", S),
        () => document.removeEventListener("mousedown", S)
      );
    }, []));
  const Ee = (S, $) => new Date($, S + 1, 0).getDate(),
    qt = (S, $) => {
      const pe = new Date($, S, 1).getDay();
      return pe === 0 ? 6 : pe - 1;
    },
    Jt = () => {
      xe === 0 ? (G(11), pt(ae - 1)) : G(xe - 1);
    },
    _e = () => {
      xe === 11 ? (G(0), pt(ae + 1)) : G(xe + 1);
    },
    Qt = (S) => {
      const $ = ft(ae, xe, S);
      (w && !w.has($)) ||
        (be
          ? (m && aa($, m) < 0 ? (p($), P(m)) : P($), ne(!1), oe(!1))
          : (p($), ne(!0)));
    },
    yt = (S) => {
      const $ = Gt(S);
      return $ ? `${$.day} ${Ga[$.month].substring(0, 3)} ${$.year}` : "";
    },
    re = Ee(xe, ae),
    _ = qt(xe, ae),
    le = Gt(m),
    F = Gt(k),
    Rt = (S) => S === Ue && xe === D && ae === he,
    He = (S) => (le ? S === le.day && xe === le.month && ae === le.year : !1),
    Lt = (S) => (F ? S === F.day && xe === F.month && ae === F.year : !1),
    me = (S) => {
      if (!m || !k) return !1;
      const $ = ft(ae, xe, S);
      return aa($, m) > 0 && aa($, k) < 0;
    },
    Kt = () => {
      (p(""), P(""), ne(!1));
    },
    js = () => {
      const S = new Date(),
        $ = new Date();
      ($.setDate($.getDate() - 7),
        p(ft($.getFullYear(), $.getMonth(), $.getDate())),
        P(ft(S.getFullYear(), S.getMonth(), S.getDate())),
        oe(!1));
    },
    Xt = () => {
      const S = new Date(),
        $ = new Date();
      ($.setMonth($.getMonth() - 1),
        p(ft($.getFullYear(), $.getMonth(), $.getDate())),
        P(ft(S.getFullYear(), S.getMonth(), S.getDate())),
        oe(!1));
    };
  return (
    <div className="relative" ref={vt}>
      {[
        <div
          onClick={() => {
            Z || (oe(!ee), ee || ne(!1));
          }}
          className={`relative flex items-center gap-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 px-4 py-2.5 bg-white dark:bg-slate-700 transition-all min-w-[280px] ${Z ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500"} ${ee ? "ring-2 ring-indigo-500 border-indigo-500" : ""}`}
        >
          {[
            <CalendarIcon
              size={18}
              className="text-indigo-500 flex-shrink-0"
            />,
            <div className="flex items-center gap-2 flex-1">
              {[
                <span
                  className={`text-sm font-medium min-w-[85px] ${m ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
                >
                  {m ? yt(m) : "Fecha inicio"}
                </span>,
                <span className="text-gray-300 dark:text-slate-500">
                  {"—"}
                </span>,
                <span
                  className={`text-sm font-medium min-w-[85px] ${k ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
                >
                  {k ? yt(k) : "Fecha fin"}
                </span>,
              ]}
            </div>,
          ]}
        </div>,
        ee && !Z && (
          <div className="absolute z-50 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 animate-in fade-in zoom-in-95 duration-150 left-0">
            {[
              <div className="mb-3 pb-3 border-b border-gray-100 dark:border-slate-700">
                <p className="text-xs text-center text-gray-500 dark:text-slate-400">
                  {be ? "Selecciona fecha final" : "Selecciona fecha inicial"}
                </p>
              </div>,
              <div className="flex items-center justify-between mb-4">
                {[
                  <button
                    type="button"
                    onClick={(S) => {
                      (S.stopPropagation(), Jt());
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors"
                  >
                    <ChevronLeftIcon size={20} />
                  </button>,
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {[Ga[xe], " ", ae]}
                  </span>,
                  <button
                    type="button"
                    onClick={(S) => {
                      (S.stopPropagation(), _e());
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors"
                  >
                    <ChevronRightIcon size={20} />
                  </button>,
                ]}
              </div>,
              <div className="grid grid-cols-7 gap-1 mb-2">
                {An.map((S) => (
                  <div
                    className="text-center text-xs font-medium text-gray-500 dark:text-slate-400 py-1 w-9"
                    key={S}
                  >
                    {S}
                  </div>
                ))}
              </div>,
              <div className="grid grid-cols-7 gap-1">
                {[
                  Array.from({
                    length: _,
                  }).map((S, $) => (
                    <div className="h-9 w-9" key={`empty-${$}`} />
                  )),
                  Array.from({
                    length: re,
                  }).map((S, $) => {
                    const pe = $ + 1,
                      te = He(pe),
                      $e = Lt(pe),
                      zt = me(pe),
                      Re = ft(ae, xe, pe),
                      kt = w ? w.has(Re) : !0;
                    return (
                      <button
                        type="button"
                        onClick={(Nt) => {
                          (Nt.stopPropagation(), Qt(pe));
                        }}
                        disabled={!kt}
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${kt ? (te || $e ? "bg-indigo-500 text-white" : zt ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" : Rt(pe) ? "ring-2 ring-indigo-300 dark:ring-indigo-600 text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700") : "text-gray-300 dark:text-slate-600 cursor-not-allowed"}`}
                        key={pe}
                      >
                        {pe}
                      </button>
                    );
                  }),
                ]}
              </div>,
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700">
                {[
                  <div className="flex gap-2 mb-3">
                    {[
                      <button
                        type="button"
                        onClick={(S) => {
                          (S.stopPropagation(), js());
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        {"Última semana"}
                      </button>,
                      <button
                        type="button"
                        onClick={(S) => {
                          (S.stopPropagation(), Xt());
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        {"Último mes"}
                      </button>,
                    ]}
                  </div>,
                  <button
                    type="button"
                    onClick={(S) => {
                      (S.stopPropagation(), Kt());
                    }}
                    className="w-full px-3 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
                  >
                    {"Limpiar"}
                  </button>,
                ]}
              </div>,
            ]}
          </div>
        ),
      ]}
    </div>
  );
};
const $n = 300 * 1e3;
const Rn = 200;
const Ka = new Map();
const Ln = (m) => {
  try {
    const k = Ka.get(m);
    return !k || typeof k.ts != "number" ? null : k;
  } catch {
    return null;
  }
};
const zn = (m, k) => {
  try {
    Ka.set(m, {
      ts: Date.now(),
      value: k,
    });
  } catch {}
};
const B = (...m) => {};
const ys = async () => {
  const [{ default: m }, { default: k }] = await Promise.all([
    Fa(() => import("../vendor/vendor-pdf-Cf03QSry.js").then((p) => p.j), []),
    Fa(() => import("../vendor/vendor-pdf-Cf03QSry.js").then((p) => p.b), []),
  ]);
  return {
    jsPDF: m,
    autoTable: k,
  };
};
const Fn = (m) => {
  const k = m,
    p = k?.code,
    P = String(k?.message || "");
  return (
    p === "failed-precondition" ||
    (P.includes("requires a") && P.includes("index"))
  );
};
const ks = async (eventId, userId, privacyProfile) => {
  const snapshot = await readScopedAssignments(
    we(
      de(firestoreDb, "events", eventId, "assignments"),
      ie("userId", "==", userId),
    ),
    privacyProfile,
  );
  return snapshot.docs;
};
const Ae = (m, k) => {
  if (!m) return new Date(NaN);
  const [p, P, w] = m.split("-").map(Number);
  if (!k) return new Date(p, P - 1, w, 23, 59);
  const [Z, ee] = k.split(":").map(Number);
  return new Date(p, P - 1, w, Z || 0, ee || 0);
};
const Ns = (m) => {
  const [k, p] = m.split("-"),
    P = Number(k),
    w = Number(p);
  if (!Number.isFinite(P) || !Number.isFinite(w) || w < 1 || w > 12)
    return {
      start: "0000-01-01",
      end: "9999-12-31",
    };
  const Z = `${String(P).padStart(4, "0")}-${String(w).padStart(2, "0")}-01`,
    ee = new Date(P, w, 0).getDate(),
    oe = `${String(P).padStart(4, "0")}-${String(w).padStart(2, "0")}-${String(ee).padStart(2, "0")}`;
  return {
    start: Z,
    end: oe,
  };
};
const Pn = (m, k, p, P) => {
  const w = Ae(m, P || p || k);
  return new Date(w.getTime() + 10800 * 1e3);
};
const rt = (m, k, p, P) => {
  if (!m || !k) return !1;
  const w = new Date(m),
    Z = w.getHours(),
    ee = w.getMinutes(),
    oe = Z * 60 + ee,
    be = P || p;
  if (!be) return !1;
  const [ne, V] = be.split(":").map(Number),
    D = ne * 60 + V - 30;
  return oe >= D;
};
const bt = (m, k, p, P, w) => {
  if (!m || !k) return !1;
  const Z = new Date(m),
    ee = Z.getHours(),
    oe = Z.getMinutes(),
    be = ee * 60 + oe,
    ne = p || P || w;
  if (!ne) return !1;
  const [V, he] = ne.split(":").map(Number),
    Ue = V * 60 + he + 90;
  return be >= Ue;
};
const qa = (m, k, p, P) => {
  if (!m || (!k && !p))
    return {
      isOpen: !1,
      message: "Fecha/hora no disponible",
      isLate: !1,
    };
  const w = Ae(m, p || k),
    Z = new Date(w.getTime() - 10800 * 1e3),
    ee = Ae(m, P || p || k),
    oe = new Date(w.getTime() - 1800 * 1e3),
    be = new Date(ee.getTime() + 5400 * 1e3),
    ne = new Date(ee.getTime() + 10800 * 1e3),
    V = new Date();
  if (V < Z) {
    const he = Z.getTime() - V.getTime(),
      D = Math.floor(he / (1e3 * 60 * 60)),
      Ue = Math.floor((he % (1e3 * 60 * 60)) / (1e3 * 60));
    return {
      isOpen: !1,
      message: D > 0 ? `Abre en ${D}h ${Ue}m` : `Abre en ${Ue} min`,
      isLate: !1,
    };
  }
  return V >= ne
    ? {
        isOpen: !1,
        message: "Registro cerrado",
        isLate: !0,
      }
    : V < oe
      ? {
          isOpen: !0,
          message: "Registro abierto",
          isLate: !1,
        }
      : V < w
        ? {
            isOpen: !0,
            message: "Atraso (previo al evento)",
            isLate: !0,
          }
        : V <= be
          ? {
              isOpen: !0,
              message: "Registro abierto",
              isLate: !1,
            }
          : {
              isOpen: !0,
              message: "Atraso (posterior al evento)",
              isLate: !0,
            };
};
const ws = (m, k, p, P) => {
  if (P === "completed") return !0;
  const w = k || p;
  if (w && m) {
    const [Z, ee, oe] = m.split("-").map(Number),
      [be, ne] = w.split(":").map(Number),
      V = new Date(Z, ee - 1, oe, be, ne),
      he = new Date(V.getTime() + 7200 * 1e3);
    return new Date() > he;
  }
  return !1;
};
const Attendance = () => {
  const [m, k] = React.useState("people"),
    [p, P] = React.useState(() => new Date().toISOString().slice(0, 7)),
    [w, Z] = React.useState(() => new Date().toISOString().slice(0, 7)),
    [ee, oe] = React.useState(!1),
    [be, ne] = React.useState(!1),
    [V, he] = React.useState(new Date().getFullYear()),
    [D, Ue] = React.useState(() => new Set()),
    [Oe, xe] = React.useState(() => new Set()),
    G = React.useMemo(() => {
      if (D.size === 0) return [];
      const e = new Set();
      for (const a of D) {
        const s = Number(a.slice(0, 4));
        Number.isFinite(s) && e.add(s);
      }
      return Array.from(e).sort((a, s) => a - s);
    }, [D]),
    ae = React.useMemo(() => new Set(G), [G]),
    pt = (e) => {
      for (let a = G.length - 1; a >= 0; a--) {
        const s = G[a];
        if (s < e) return s;
      }
      return null;
    },
    vt = (e) => {
      for (let a = 0; a < G.length; a++) {
        const s = G[a];
        if (s > e) return s;
      }
      return null;
    },
    Ee = G.length > 0,
    qt = Ee ? pt(V) : V - 1,
    Jt = Ee ? vt(V) : V + 1,
    [_e, Qt] = React.useState([]),
    {
      user: yt,
      userProfile: re,
      isMinistryRestricted: _,
      getAssignedMinistries: le,
    } = useAuth(),
    F = useAppDialog(),
    { users: Rt, serviceAreas: He } = useGlobalData(),
    Lt = re?.role === "master_admin",
    me = (() => {
      const e = re?.role || "";
      return (
        e === "master_admin" ||
        e === "admin" ||
        e === "ministry_admin" ||
        e === "ministry_subadmin" ||
        e.startsWith("ministry_admin_") ||
        e.startsWith("ministry_subadmin_")
      );
    })(),
    Kt = (e) => Lt || yt?.uid === e,
    [js, Xt] = React.useState([]),
    [S, $] = React.useState(!0),
    pe = React.useMemo(() => {
      const e = p <= w ? p : w,
        a = p <= w ? w : p;
      return `${e}__${a}`;
    }, [p, w]),
    te = React.useMemo(() => {
      const e = p <= w ? p : w,
        a = p <= w ? w : p,
        { start: s } = Ns(e),
        { end: n } = Ns(a);
      return {
        from: e,
        to: a,
        startDate: s,
        endDate: n,
      };
    }, [p, w]),
    [$e, zt] = React.useState(() => {
      const { start: e } = Ns(new Date().toISOString().slice(0, 7));
      return e;
    }),
    [Re, kt] = React.useState(() => {
      const { end: e } = Ns(new Date().toISOString().slice(0, 7));
      return e;
    }),
    [Nt, Xa] = React.useState(""),
    [na, Za] = React.useState(""),
    [wt, ra] = React.useState(null),
    [Ss, ot] = React.useState(""),
    [en, lt] = React.useState(!1),
    tn = (e) =>
      e.startsWith("http://") ||
      e.startsWith("https://") ||
      e.startsWith("data:") ||
      e.startsWith("blob:") ||
      e.startsWith("/"),
    Ze = (source) => {
      const value = String(source ?? "").trim();
      ra(value || null);
      ot("");
      lt(!!value);
    },
    sn = () => {
      (ra(null), ot(""), lt(!1));
    };
  React.useEffect(() => {
    const controller = new AbortController();
    let resolved;
    ot("");
    lt(!!wt);
    if (wt)
      resolveCachedImageUrl(wt, {
        signal: controller.signal,
      })
        .then((url) => {
          if (controller.signal.aborted) releaseProtectedImage(url);
          else {
            resolved = url;
            ot(url || "");
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) ot("");
        })
        .finally(() => {
          if (!controller.signal.aborted) lt(false);
        });
    return () => {
      controller.abort();
      releaseProtectedImage(resolved);
    };
  }, [wt, assignmentPrivacyKey(re)]);
  const [ue, We] = React.useState(null),
    [Ts, ia] = React.useState(""),
    [an, Zt] = React.useState(!1),
    [nn, Ds] = React.useState(!1),
    [Is, oa] = React.useState(!1),
    [Cs, la] = React.useState(!1),
    [Es, ca] = React.useState(!1),
    [Ms, da] = React.useState(!1),
    rn = (e, a) => {
      const n = a - 0.0025,
        r = a + 0.0025,
        i = e + 0.0025,
        d = e - 0.0025;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(`${n},${d},${r},${i}`)}&layer=mapnik&marker=${encodeURIComponent(`${e},${a}`)}`;
    };
  React.useEffect(() => {
    if (!ue) {
      (ia(""), Zt(!1), Ds(!1));
      return;
    }
    (Zt(!0), Ds(!1));
    const e = rn(ue.lat, ue.lng),
      a = window.setTimeout(() => {
        ia(e);
      }, 0);
    return () => {
      window.clearTimeout(a);
    };
  }, [ue?.lat, ue?.lng, ue?.title, assignmentPrivacyKey(re)]);
  const [je, on] = React.useState("all"),
    [ln, cn] = React.useState(new Map()),
    [fe, dn] = React.useState([]),
    [ct, ma] = React.useState("all"),
    [As, es] = React.useState(!1),
    [Os, $s] = React.useState(!1),
    [mn, jt] = React.useState({}),
    [Ft, Rs] = React.useState(null),
    [et, ua] = React.useState(null),
    [dt, ts] = React.useState({
      name: "",
      status: "Activo",
      areas: [],
    }),
    [ha, ga] = React.useState(!1),
    [Ls, ss] = React.useState(!1),
    [mt, zs] = React.useState("all"),
    [ut, Pt] = React.useState("all"),
    [ke, Fs] = React.useState(() => new Date().getFullYear()),
    [Le, as] = React.useState(() => new Date().getMonth() + 1),
    [Ye, xa] = React.useState(1),
    [Se, Ps] = React.useState(() => new Date().getFullYear()),
    [Be, ns] = React.useState(() => new Date().getMonth() + 1),
    [tt, un] = React.useState(""),
    [hn, Us] = React.useState(!1),
    [fa, ba] = React.useState(""),
    [Te, _s] = React.useState(() => new Date().getFullYear()),
    [Ve, rs] = React.useState(() => new Date().getMonth() + 1),
    [Ge, is] = React.useState(""),
    [De, Hs] = React.useState(() => new Date().getFullYear()),
    [qe, os] = React.useState(() => new Date().getMonth() + 1),
    pa = React.useRef(m);
  React.useEffect(() => {
    Qt([]);
    jt({});
    Xt([]);
  }, [assignmentPrivacyKey(re)]);
  React.useEffect(() => {
    const e = pa.current;
    if (((pa.current = m), m !== "reports" || e === "reports")) return;
    const [a, s] = te.to.split("-"),
      n = Number(a),
      r = Number(s);
    (Number.isFinite(n) && Fs(n),
      Number.isFinite(r) && as(r),
      Number.isFinite(n) && Ps(n),
      Number.isFinite(r) && ns(r),
      Number.isFinite(n) && _s(n),
      Number.isFinite(r) && rs(r),
      Number.isFinite(n) && Hs(n),
      Number.isFinite(r) && os(r));
  }, [m, te.to, assignmentPrivacyKey(re)]);
  const ls = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    cs = (e, a) => {
      const s = [],
        n = new Date(e, a - 1, 1),
        r = new Date(e, a, 0);
      let i = new Date(n);
      const d = i.getDay(),
        g = d === 0 ? -6 : 1 - d;
      i.setDate(i.getDate() + g);
      let b = 1;
      for (; i <= r; ) {
        const c = new Date(i),
          x = new Date(i);
        if ((x.setDate(x.getDate() + 6), x >= n && c <= r)) {
          const v = c < n ? n : c,
            y = x > r ? r : x,
            h = v.getDate(),
            A = y.getDate(),
            O =
              b === 1
                ? "1era"
                : b === 2
                  ? "2da"
                  : b === 3
                    ? "3era"
                    : b === 4
                      ? "4ta"
                      : "5ta";
          s.push({
            weekNum: b,
            start: h,
            end: A,
            label: `${O} Semana (${h}-${A})`,
          });
        }
        if ((i.setDate(i.getDate() + 7), b++, b > 6)) break;
      }
      return s;
    },
    Ws = React.useMemo(
      () => (G.length > 0 ? G : [new Date().getFullYear()]),
      [G],
    ),
    Ys = React.useMemo(
      () => (G.length > 0 ? G : [new Date().getFullYear()]),
      [G],
    ),
    St = React.useMemo(() => {
      if (D.size === 0)
        return Array.from(
          {
            length: 12,
          },
          (s, n) => n + 1,
        );
      const e = new Set(),
        a = `${String(ke).padStart(4, "0")}-`;
      for (const s of D) {
        if (!s.startsWith(a)) continue;
        const n = Number(s.slice(5, 7));
        Number.isFinite(n) && n >= 1 && n <= 12 && e.add(n);
      }
      return Array.from(e).sort((s, n) => s - n);
    }, [D, ke]),
    Tt = React.useMemo(() => {
      if (D.size === 0)
        return Array.from(
          {
            length: 12,
          },
          (s, n) => n + 1,
        );
      const e = new Set(),
        a = `${String(Se).padStart(4, "0")}-`;
      for (const s of D) {
        if (!s.startsWith(a)) continue;
        const n = Number(s.slice(5, 7));
        Number.isFinite(n) && n >= 1 && n <= 12 && e.add(n);
      }
      return Array.from(e).sort((s, n) => s - n);
    }, [D, Se]),
    Bs = React.useMemo(
      () => (G.length > 0 ? G : [new Date().getFullYear()]),
      [G],
    ),
    Vs = React.useMemo(
      () => (G.length > 0 ? G : [new Date().getFullYear()]),
      [G],
    ),
    Dt = React.useMemo(() => {
      if (D.size === 0)
        return Array.from(
          {
            length: 12,
          },
          (s, n) => n + 1,
        );
      const e = new Set(),
        a = `${String(Te).padStart(4, "0")}-`;
      for (const s of D) {
        if (!s.startsWith(a)) continue;
        const n = Number(s.slice(5, 7));
        Number.isFinite(n) && n >= 1 && n <= 12 && e.add(n);
      }
      return Array.from(e).sort((s, n) => s - n);
    }, [D, Te]),
    It = React.useMemo(() => {
      if (D.size === 0)
        return Array.from(
          {
            length: 12,
          },
          (s, n) => n + 1,
        );
      const e = new Set(),
        a = `${String(De).padStart(4, "0")}-`;
      for (const s of D) {
        if (!s.startsWith(a)) continue;
        const n = Number(s.slice(5, 7));
        Number.isFinite(n) && n >= 1 && n <= 12 && e.add(n);
      }
      return Array.from(e).sort((s, n) => s - n);
    }, [D, De]),
    Ct = React.useMemo(() => {
      const e = cs(ke, Le);
      if (Oe.size === 0) return e;
      const a = `${String(ke).padStart(4, "0")}-${String(Le).padStart(2, "0")}-`,
        s = new Set();
      for (const n of Oe) {
        if (!n.startsWith(a)) continue;
        const r = Number(n.slice(8, 10));
        Number.isFinite(r) && s.add(r);
      }
      return s.size === 0
        ? []
        : e.filter((n) => {
            for (const r of s) if (r >= n.start && r <= n.end) return !0;
            return !1;
          });
    }, [Oe, ke, Le]);
  (React.useEffect(() => {
    if (D.size !== 0) {
      if (!ae.has(ke)) {
        const e = Ws.at(-1);
        e && Fs(e);
        return;
      }
      if (St.length > 0 && !St.includes(Le)) {
        as(St[St.length - 1]);
        return;
      }
      Ct.length > 0 && !Ct.some((e) => e.weekNum === Ye) && xa(Ct[0].weekNum);
    }
  }, [D, ae, Ws, St, Ct, ke, Le, Ye, assignmentPrivacyKey(re)]),
    React.useEffect(() => {
      if (D.size !== 0) {
        if (!ae.has(Se)) {
          const e = Ys.at(-1);
          e && Ps(e);
          return;
        }
        Tt.length > 0 && !Tt.includes(Be) && ns(Tt[Tt.length - 1]);
      }
    }, [D, ae, Ys, Tt, Se, Be, assignmentPrivacyKey(re)]),
    React.useEffect(() => {
      if (D.size !== 0) {
        if (!ae.has(Te)) {
          const e = Bs.at(-1);
          e && _s(e);
          return;
        }
        Dt.length > 0 && !Dt.includes(Ve) && rs(Dt[Dt.length - 1]);
      }
    }, [D, ae, Bs, Dt, Te, Ve, assignmentPrivacyKey(re)]),
    React.useEffect(() => {
      if (D.size !== 0) {
        if (!ae.has(De)) {
          const e = Vs.at(-1);
          e && Hs(e);
          return;
        }
        It.length > 0 && !It.includes(qe) && os(It[It.length - 1]);
      }
    }, [D, ae, Vs, It, De, qe, assignmentPrivacyKey(re)]),
    React.useEffect(() => {
      const e = _() ? assignmentManagedAreas(re) : [],
        a = e.length > 0 ? fe.filter((s) => e.includes(s.id)) : fe;
      if (a.length === 0) {
        Ge && is("");
        return;
      }
      if (!Ge) {
        is(a[0].id);
        return;
      }
      e.length > 0 && !e.includes(Ge) && is(a[0].id);
    }, [fe, Ge, _, le, assignmentPrivacyKey(re)]));
  const [I, va] = React.useState(null),
    [Q, st] = React.useState({
      checkInTime: "",
      checkOutTime: "",
    }),
    [ya, ka] = React.useState(!1),
    [Na, ds] = React.useState(!1),
    [wa, ms] = React.useState(!1),
    [ja, us] = React.useState(!1),
    [Sa, hs] = React.useState(!1),
    [ht, Ta] = React.useState({
      isOpen: !1,
      title: "",
      message: "",
      onConfirm: () => {},
      confirmText: "Confirmar",
      confirmColor: "indigo",
    }),
    [Et, Gs] = React.useState(!1),
    Ut = (e, a, s, n = "Confirmar", r = "indigo") => {
      (Gs(!1),
        Ta({
          isOpen: !0,
          title: e,
          message: a,
          onConfirm: s,
          confirmText: n,
          confirmColor: r,
        }));
    },
    Ne = (e) => {
      (Et && !e?.force) ||
        Ta((a) => ({
          ...a,
          isOpen: !1,
        }));
    };
  (React.useEffect(() => {
    dn(
      He.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    );
  }, [He, assignmentPrivacyKey(re)]),
    React.useEffect(() => {
      const e = new Map();
      (Rt.forEach((a) => {
        const s = a?.photoURL || a?.photoThumbURL;
        s && e.set(a.id, s);
      }),
        cn(e));
    }, [Rt, assignmentPrivacyKey(re)]),
    React.useEffect(() => {
      m === "people" && Ie();
    }, [m, pe, assignmentPrivacyKey(re)]),
    React.useEffect(() => {
      if (isBffEnabled()) {
        (async () => {
          try {
            const a = await bffFetch("/api/events?limit=500"),
              s = Array.isArray(a?.items) ? a.items : [],
              n = new Set(),
              r = new Set();
            for (const i of s) {
              const d = String(i?.date || "").trim();
              /^\d{4}-\d{2}-\d{2}$/.test(d) && (r.add(d), n.add(d.slice(0, 7)));
            }
            (Ue(n), xe(r));
          } catch {}
        })();
        return;
      }
      const e = watchScopedAssignments(
        we(de(firestoreDb, "events"), ta("date", "desc"), Pa(500)),
        re,
        (a) => {
          const s = new Set(),
            n = new Set();
          for (const r of a.docs) {
            const i = r.data(),
              d = String(i?.date || "").trim();
            /^\d{4}-\d{2}-\d{2}$/.test(d) && (n.add(d), s.add(d.slice(0, 7)));
          }
          (Ue(s), xe(n));
        },
        () => {},
      );
      return () => {
        e();
      };
    }, [assignmentPrivacyKey(re)]),
    React.useEffect(() => {
      if (D.size === 0) return;
      const e = Array.from(D).sort().at(-1);
      if (!e) return;
      const a = D.has(p),
        s = D.has(w);
      (a && s) || (P(e), Z(e));
    }, [D, p, w, assignmentPrivacyKey(re)]));
  const qs = React.useMemo(() => {
    const e = new Set();
    for (const a of Oe) a >= te.startDate && a <= te.endDate && e.add(a);
    return e;
  }, [Oe, te.startDate, te.endDate]);
  React.useEffect(() => {
    const e = Array.from(qs).sort();
    if (e.length > 0) {
      (zt(e[0]), kt(e[e.length - 1]));
      return;
    }
    (zt(te.startDate), kt(te.endDate));
  }, [te.startDate, te.endDate, qs, assignmentPrivacyKey(re)]);
  const Da = React.useRef(0);
  React.useEffect(() => {
    if (m !== "people" || isBffEnabled()) return;
    const e = () => {
        const n = Date.now();
        n - Da.current < 3e4 ||
          ((Da.current = n),
          Ie({
            force: !0,
          }));
      },
      a = () => {
        document.visibilityState === "visible" && e();
      },
      s = watchScopedAssignments(
        Xe(firestoreDb, "meta", "attendanceSync"),
        re,
        (n) => {
          (B("attendanceSync(marker)", {
            view: m,
            visible: document.visibilityState === "visible",
            version: n.data()?.version,
            updatedAt: n.data()?.updatedAt,
          }),
            e());
        },
        () => {},
      );
    return (
      window.addEventListener("focus", e),
      window.addEventListener("online", e),
      document.addEventListener("visibilitychange", a),
      () => {
        (window.removeEventListener("focus", e),
          window.removeEventListener("online", e),
          document.removeEventListener("visibilitychange", a),
          s());
      }
    );
  }, [m, pe, assignmentPrivacyKey(re)]);
  const Ia = React.useRef(0);
  (useChangeFeed({
    enabled: isBffEnabled(),
    resources: [
      "attendance",
      "events",
      "users",
      "service_areas",
      "assignments",
    ],
    onChange: () => {
      Ie({
        force: !0,
        silent: !0,
      });
    },
  }),
    React.useEffect(() => {
      if (isBffEnabled() || m !== "people" || !te.startDate || !te.endDate)
        return;
      const e = te.startDate,
        a = te.endDate,
        s = _() ? assignmentManagedAreas(re) : [],
        n =
          s.length > 0
            ? fe.filter((x) => s.includes(x.id)).map((x) => x.name)
            : [],
        r = (x) => {
          const v = Date.now();
          v - Ia.current < 3e3 ||
            ((Ia.current = v),
            Ie({
              force: !0,
            }));
        },
        i = new Map(),
        d = new Map(),
        g = de(firestoreDb, "events"),
        b = we(g, ie("date", ">=", e), ie("date", "<=", a)),
        c = watchScopedAssignments(
          b,
          re,
          (x) => {
            const v = new Set();
            for (const y of x.docs) {
              const h = y.data();
              if (_() && s.length > 0) {
                const U = h.activeMinistries || [];
                if (!U.some((L) => s.includes(L)) && U.length > 0) continue;
              }
              if ((v.add(y.id), i.has(y.id))) continue;
              const A = de(firestoreDb, "events", y.id, "assignments"),
                O = watchScopedAssignments(
                  A,
                  re,
                  (U) => {
                    (_() &&
                      n.length > 0 &&
                      !U.docs.some((L) => {
                        const K = L.data();
                        return n.includes(K?.areaName);
                      })) ||
                      r();
                  },
                  () => {},
                );
              (i.set(y.id, O), d.set(y.id, O));
            }
            for (const [y, h] of i.entries())
              v.has(y) || (h(), i.delete(y), d.delete(y));
            r();
          },
          () => {},
        );
      return () => {
        c();
        for (const x of i.values()) x();
        for (const x of d.values()) x();
      };
    }, [m, te.startDate, te.endDate, fe, _, le, assignmentPrivacyKey(re)]));
  const Ie = async (e) => {
      const a = !!e?.silent;
      a || $(!0);
      try {
        const s = _() ? assignmentManagedAreas(re) : [],
          n =
            assignmentPrivacyKey(re) +
            `attendance_peopleStats_${te.from}_${te.to}_min_${s.slice().sort().join("-") || "all"}`,
          r = Ln(n);
        if (!e?.force && r && Date.now() - r.ts < $n) {
          (Qt(r.value.userStats), jt(r.value.assignmentsByUser), a || $(!1));
          return;
        }
        let i = [];
        s.length > 0 &&
          (i = He.filter((h) => s.includes(h.id)).map((h) => h.name));
        let d = Rt.map((h) => {
          const A = h.areas || [];
          return {
            ...h,
            areas: A,
          };
        });
        _() &&
          i.length > 0 &&
          (d = d.filter((h) => h.areas && h.areas.some((A) => i.includes(A))));
        const g = te.startDate,
          b = te.endDate;
        let c = [];
        if (isBffEnabled()) {
          const h = await bffFetch(
            `/api/attendance/events?startDate=${encodeURIComponent(g)}&endDate=${encodeURIComponent(b)}`,
          );
          c = Array.isArray(h?.events) ? h.events : [];
        } else
          c = (
            await readScopedAssignments(
              we(
                de(firestoreDb, "events"),
                ie("date", ">=", g),
                ie("date", "<=", b),
                ta("date", "desc"),
                Pa(Rn),
              ),
              re,
            )
          ).docs.map((A) => ({
            id: A.id,
            ...A.data(),
          }));
        const x = [],
          v = {};
        if (isBffEnabled()) {
          const h = c.map((R) => R.id).join(","),
            A = await bffFetch(
              `/api/attendance/peopleStatsData?startDate=${encodeURIComponent(g)}&endDate=${encodeURIComponent(b)}&eventIds=${encodeURIComponent(h)}`,
            ),
            O = Array.isArray(A?.assignments) ? A.assignments : [],
            U = new Map(c.map((R) => [R.id, R]));
          for (const R of O) {
            const L = U.get(String(R.eventId));
            if (!L) continue;
            const K = {
              ...R,
              eventTitle: L.title || "Evento sin título",
              eventDate: L.date || "",
              eventTime: L.time || "",
              eventStatus: L.status,
              serviceTime: L.serviceTime || "",
              endTime: L.endTime || "",
            };
            x.push(K);
            const ge = String(R.userId || "");
            ge && (v[ge] || (v[ge] = []), v[ge].push(K));
          }
        } else {
          const h = c.map(async (O) => {
              try {
                const U = await readScopedAssignments(
                  de(firestoreDb, "events", O.id, "assignments"),
                  re,
                );
                return {
                  eventData: O,
                  snap: U,
                };
              } catch (U) {
                return (
                  console.error(
                    `Error fetching assignments for event ${O.id}:`,
                    U,
                  ),
                  {
                    eventData: O,
                    snap: null,
                  }
                );
              }
            }),
            A = await Promise.all(h);
          for (const { eventData: O, snap: U } of A)
            U &&
              U.docs.forEach((R) => {
                const K = {
                  ...R.data(),
                  id: R.id,
                  eventId: O.id,
                  eventTitle: O.title || "Evento sin título",
                  eventDate: O.date || "",
                  eventTime: O.time || "",
                  eventStatus: O.status,
                  serviceTime: O.serviceTime || "",
                  endTime: O.endTime || "",
                };
                (x.push(K),
                  v[K.userId] || (v[K.userId] = []),
                  v[K.userId].push(K));
              });
        }
        (Object.keys(v).forEach((h) => {
          v[h].sort(
            (A, O) =>
              new Date(O.eventDate).getTime() - new Date(A.eventDate).getTime(),
          );
        }),
          jt(v));
        const y = d.map((h) => {
          const A = x.filter((l) => l.userId === h.id),
            U = (() => {
              const l = new Map();
              for (const T of A) {
                const N = T.eventId || `${T.eventDate}|${T.eventTitle}`,
                  E = l.get(N);
                E ? E.push(T) : l.set(N, [T]);
              }
              return Array.from(l.values()).map((T) => {
                const N = T[0],
                  E = T.map((f) => f.checkInTime)
                    .filter(Boolean)
                    .sort(
                      (f, j) => new Date(f).getTime() - new Date(j).getTime(),
                    )[0],
                  u = T.map((f) => f.checkOutTime)
                    .filter(Boolean)
                    .sort(
                      (f, j) => new Date(j).getTime() - new Date(f).getTime(),
                    )[0];
                return {
                  ...N,
                  checkInTime: E,
                  checkOutTime: u,
                };
              });
            })().filter((l) => l.eventDate >= g && l.eventDate <= b);
          let R = 0;
          U.forEach((l) => {
            const T = ws(l.eventDate, l.endTime, l.eventTime, l.eventStatus),
              N = Ae(l.eventDate, l.eventTime || l.serviceTime),
              E = !!l.checkOutTime,
              u = new Date() > N,
              f = E || T;
            (l.checkInTime
              ? rt(l.checkInTime, l.eventDate, l.serviceTime, l.eventTime) &&
                (R += 0.25)
              : (f || u) && (R += 0.5),
              !l.checkOutTime && T
                ? (R += 0.5)
                : l.checkOutTime &&
                  bt(
                    l.checkOutTime,
                    l.eventDate,
                    l.endTime,
                    l.eventTime,
                    l.serviceTime,
                  ) &&
                  (R += 0.25));
          });
          const L = R,
            K = L >= 10,
            ge = U.filter((l) => l.checkInTime || l.checkOutTime).length,
            W = U.filter((l) => {
              if (l.eventStatus === "completed")
                return !l.checkInTime && !l.checkOutTime;
              if (l.eventStatus === "active") return !1;
              const T = Pn(l.eventDate, l.serviceTime, l.eventTime, l.endTime);
              return new Date() > T && !l.checkInTime && !l.checkOutTime;
            }).length;
          return {
            ...h,
            presentCount: ge,
            absentCount: W,
            strikes: L,
            isInactive: K,
          };
        });
        (Qt(y),
          zn(n, {
            userStats: y.map((h) => ({
              id: h.id,
              uid: h.uid ?? h.id,
              name: h.name,
              areas: h.areas,
              role: h.role,
              status: h.status,
              presentCount: h.presentCount,
              absentCount: h.absentCount,
              strikes: h.strikes,
              isInactive: h.isInactive,
            })),
            assignmentsByUser: v,
          }));
      } catch (s) {
        console.error("Error fetching stats:", s);
      } finally {
        a || $(!1);
      }
    },
    Ca = (e) => {
      Ut(
        "Reactivar Servidor",
        "¿Estás seguro de reactivar a este servidor? Esto reiniciará sus strikes.",
        async () => {
          try {
            (await Mt(Xe(firestoreDb, "users", e), {
              strikesResetDate: new Date().toISOString(),
            }),
              await Ie({
                force: !0,
              }),
              Ne({
                force: !0,
              }));
          } catch (a) {
            (console.error("Error reactivating user:", a),
              F.showError("Error al reactivar usuario"));
          }
        },
        "Reactivar",
        "green",
      );
    },
    Ea = (e) => {
      B("openEditUserModal", {
        actorRole: re?.role,
        actorUid: e?.uid,
        targetUserId: e?.id,
        allowed: Kt(e?.id),
      });
      const a = Array.isArray(e.areas)
        ? e.areas.map((s) => {
            const n = fe.find((r) => r.id === s);
            return n ? n.name : s;
          })
        : [];
      (ua(e),
        ts({
          name: e.name || "",
          status: e.status || (e.isInactive ? "Inactivo" : "Activo"),
          areas: a,
        }));
    },
    Js = () => {
      (ua(null),
        ts({
          name: "",
          status: "Activo",
          areas: [],
        }));
    },
    gn = async (e) => {
      if ((e.preventDefault(), !!et)) {
        ga(!0);
        try {
          if (
            (B("handleEditUserSubmit(start)", {
              actorRole: re?.role,
              actorUid: yt?.uid,
              targetUserId: et.id,
              status: dt.status,
            }),
            !Kt(et.id))
          ) {
            F.showError(
              `Permiso denegado. Tu rol es "${re?.role || ""}". Solo master_admin puede editar otros servidores.`,
              "No puedes editar este servidor",
            );
            return;
          }
          (await Mt(Xe(firestoreDb, "users", et.id), {
            status: dt.status,
          }),
            B("handleEditUserSubmit(success)", {
              targetUserId: et.id,
              status: dt.status,
            }),
            await Ie({
              force: !0,
            }),
            Js());
        } catch (a) {
          (console.error("Error updating user:", a),
            B("handleEditUserSubmit(error)", {
              actorRole: re?.role,
              actorUid: yt?.uid,
              targetUserId: et?.id,
              error: a,
            }),
            a?.code === "permission-denied"
              ? F.showError(
                  `Firestore rechazó el cambio (permission-denied). Reglas actuales: solo el mismo usuario o master_admin puede editar /users. Tu rol: "${re?.role || ""}".`,
                  "Permiso denegado",
                )
              : F.showError("Error al actualizar el servidor"));
        } finally {
          ga(!1);
        }
      }
    },
    Ma = (e, a) => {
      Ut(
        "Eliminar Servidor",
        `¿Seguro que deseas eliminar a ${a}? Esta acción no se puede deshacer.`,
        async () => {
          try {
            (await Sn(Xe(firestoreDb, "users", e)),
              await Ie({
                force: !0,
              }),
              Ne({
                force: !0,
              }));
          } catch (s) {
            (console.error("Error deleting user:", s),
              F.showError("Error al eliminar al servidor"));
          }
        },
        "Eliminar",
        "red",
      );
    },
    Aa = (e) => {
      (B("openEditRecordModal", {
        role: re?.role,
        canManageAttendance: me,
        eventId: e.eventId,
        assignmentId: e.id,
        userId: e.userId,
        eventDate: e.eventDate,
        checkInTime: e.checkInTime,
        checkOutTime: e.checkOutTime,
      }),
        va(e),
        st({
          checkInTime: e.checkInTime || "",
          checkOutTime: e.checkOutTime || "",
        }));
    },
    Qs = () => {
      (va(null),
        st({
          checkInTime: "",
          checkOutTime: "",
        }));
    },
    xn = async (e) => {
      if ((e.preventDefault(), !!I)) {
        ka(!0);
        try {
          if (
            (B("handleEditRecordSubmit(start)", {
              role: re?.role,
              canManageAttendance: me,
              eventId: I.eventId,
              assignmentId: I.id,
              userId: I.userId,
              form: Q,
            }),
            !me)
          ) {
            F.showError(
              `Permiso denegado. Tu rol actual es "${re?.role || ""}".`,
              "No puedes editar asistencias",
            );
            return;
          }
          const a = Q.checkInTime
              ? rt(Q.checkInTime, I.eventDate, I.serviceTime, I.eventTime)
              : !1,
            s = Q.checkOutTime
              ? bt(
                  Q.checkOutTime,
                  I.eventDate,
                  I.endTime,
                  I.eventTime,
                  I.serviceTime,
                )
              : !1,
            n = {
              checkInTime: Q.checkInTime || null,
              checkOutTime: Q.checkOutTime || null,
              wasLate: a,
              wasCheckOutLate: s,
            },
            r = await ks(I.eventId, I.userId, re);
          if (
            (B("handleEditRecordSubmit(docsToUpdate)", {
              count: r.length,
              ids: r.map((i) => i.id),
            }),
            r.length === 0)
          ) {
            F.showError(
              "No se encontraron asignaciones para este usuario en este evento (0 docs). Esto suele pasar si la asignación fue eliminada o el historial está desfasado.",
              "No se pudo guardar",
            );
            return;
          }
          (await Promise.all(
            r.map((i) =>
              Mt(Xe(firestoreDb, "events", I.eventId, "assignments", i.id), n),
            ),
          ),
            B("handleEditRecordSubmit(success)", {
              eventId: I.eventId,
              userId: I.userId,
              updateData: n,
            }),
            jt((i) => {
              const d = I.userId,
                b = (i[d] || []).map((c) =>
                  c.userId === I.userId && c.eventId === I.eventId
                    ? {
                        ...c,
                        checkInTime: Q.checkInTime || void 0,
                        checkOutTime: Q.checkOutTime || void 0,
                        wasLate: a,
                        wasCheckOutLate: s,
                      }
                    : c,
                );
              return {
                ...i,
                [d]: b,
              };
            }),
            await Promise.all([
              Ie({
                force: !0,
              }),
              at(),
            ]),
            Qs());
        } catch (a) {
          (console.error("Error updating attendance record:", a),
            B("handleEditRecordSubmit(error)", {
              role: re?.role,
              eventId: I?.eventId,
              userId: I?.userId,
              error: a,
            }),
            a?.code === "permission-denied"
              ? F.showError(
                  `Firestore rechazó el cambio (permission-denied). Verifica que tu usuario en Firestore tenga role "admin" o sea un ministry admin. Rol actual: "${re?.role || ""}".`,
                  "Permiso denegado",
                )
              : F.showError("Error al actualizar el registro de asistencia"));
        } finally {
          ka(!1);
        }
      }
    },
    fn = (e) => {
      (B("handleMarkPresent(click)", {
        role: re?.role,
        canManageAttendance: me,
        eventId: e.eventId,
        assignmentId: e.id,
        userId: e.userId,
      }),
        Ut(
          "Marcar Asistencia",
          "¿Marcar este registro como asistencia? Se registrará entrada y salida.",
          async () => {
            try {
              if (
                (B("handleMarkPresent(confirm)", {
                  eventId: e.eventId,
                  userId: e.userId,
                }),
                !me)
              ) {
                (F.showError(
                  "No tienes permisos para modificar asistencias.",
                  "Permiso denegado",
                ),
                  Ne({
                    force: !0,
                  }));
                return;
              }
              const a = Ae(e.eventDate, e.serviceTime || e.eventTime),
                s = Ae(e.eventDate, e.endTime || e.eventTime || e.serviceTime),
                n = Number.isNaN(a.getTime())
                  ? new Date().toISOString()
                  : new Date(a.getTime() + 60 * 1e3).toISOString(),
                r = Number.isNaN(s.getTime())
                  ? new Date().toISOString()
                  : new Date(s.getTime() + 60 * 1e3).toISOString(),
                i = rt(n, e.eventDate, e.serviceTime, e.eventTime),
                d = bt(r, e.eventDate, e.endTime, e.eventTime, e.serviceTime),
                g = {
                  checkInTime: n,
                  checkOutTime: r,
                  wasLate: i,
                  wasCheckOutLate: d,
                },
                b = await ks(e.eventId, e.userId, re);
              if (
                (B("handleMarkPresent(docsToUpdate)", {
                  count: b.length,
                  ids: b.map((c) => c.id),
                  updateData: g,
                }),
                b.length === 0)
              ) {
                (F.showError(
                  "No se encontraron asignaciones para este usuario en este evento (0 docs).",
                  "No se pudo marcar",
                ),
                  Ne({
                    force: !0,
                  }));
                return;
              }
              (await Promise.all(
                b.map((c) =>
                  Mt(
                    Xe(firestoreDb, "events", e.eventId, "assignments", c.id),
                    g,
                  ),
                ),
              ),
                B("handleMarkPresent(success)", {
                  eventId: e.eventId,
                  userId: e.userId,
                }),
                jt((c) => {
                  const x = e.userId,
                    y = (c[x] || []).map((h) =>
                      h.userId === e.userId && h.eventId === e.eventId
                        ? {
                            ...h,
                            checkInTime: n,
                            checkOutTime: r,
                            wasLate: i,
                            wasCheckOutLate: d,
                          }
                        : h,
                    );
                  return {
                    ...c,
                    [x]: y,
                  };
                }),
                await Promise.all([
                  Ie({
                    force: !0,
                  }),
                  at(),
                ]),
                Ne({
                  force: !0,
                }));
            } catch (a) {
              (console.error("Error marking present:", a),
                B("handleMarkPresent(error)", {
                  role: re?.role,
                  eventId: e.eventId,
                  userId: e.userId,
                  error: a,
                }),
                F.showError("Error al marcar asistencia"));
            }
          },
          "Marcar Asistencia",
          "green",
        ));
    },
    bn = (e) => {
      (B("handleCompleteAttendance(click)", {
        role: re?.role,
        canManageAttendance: me,
        eventId: e.eventId,
        assignmentId: e.id,
        userId: e.userId,
        checkInTime: e.checkInTime,
        checkOutTime: e.checkOutTime,
      }),
        Ut(
          "Completar Asistencia",
          "¿Completar la asistencia? Solo se agregará lo que falta (entrada o salida).",
          async () => {
            try {
              if (
                (B("handleCompleteAttendance(confirm)", {
                  eventId: e.eventId,
                  userId: e.userId,
                }),
                !me)
              ) {
                (F.showError(
                  "No tienes permisos para modificar asistencias.",
                  "Permiso denegado",
                ),
                  Ne({
                    force: !0,
                  }));
                return;
              }
              const a = Ae(e.eventDate, e.serviceTime || e.eventTime),
                s = Ae(e.eventDate, e.endTime || e.eventTime || e.serviceTime),
                n = new Date().toISOString(),
                r = Number.isNaN(a.getTime())
                  ? n
                  : new Date(a.getTime() + 60 * 1e3).toISOString(),
                i = Number.isNaN(s.getTime())
                  ? n
                  : new Date(s.getTime() + 60 * 1e3).toISOString(),
                d = e.checkInTime || r,
                g = e.checkOutTime || i,
                b = rt(d, e.eventDate, e.serviceTime, e.eventTime),
                c = bt(g, e.eventDate, e.endTime, e.eventTime, e.serviceTime),
                x = {
                  checkInTime: d,
                  checkOutTime: g,
                  wasLate: b,
                  wasCheckOutLate: c,
                },
                v = await ks(e.eventId, e.userId, re);
              if (
                (B("handleCompleteAttendance(docsToUpdate)", {
                  count: v.length,
                  ids: v.map((y) => y.id),
                  updateData: x,
                }),
                v.length === 0)
              ) {
                (F.showError(
                  "No se encontraron asignaciones para este usuario en este evento (0 docs).",
                  "No se pudo completar",
                ),
                  Ne({
                    force: !0,
                  }));
                return;
              }
              (await Promise.all(
                v.map((y) =>
                  Mt(
                    Xe(firestoreDb, "events", e.eventId, "assignments", y.id),
                    x,
                  ),
                ),
              ),
                jt((y) => {
                  const h = e.userId,
                    O = (y[h] || []).map((U) =>
                      U.userId === e.userId && U.eventId === e.eventId
                        ? {
                            ...U,
                            checkInTime: d,
                            checkOutTime: g,
                            wasLate: b,
                            wasCheckOutLate: c,
                          }
                        : U,
                    );
                  return {
                    ...y,
                    [h]: O,
                  };
                }),
                await Promise.all([
                  Ie({
                    force: !0,
                  }),
                  at(),
                ]),
                Ne({
                  force: !0,
                }));
            } catch (a) {
              (console.error("Error completing attendance:", a),
                B("handleCompleteAttendance(error)", {
                  role: re?.role,
                  eventId: e.eventId,
                  userId: e.userId,
                  error: a,
                }),
                F.showError("Error al completar asistencia"));
            }
          },
          "Completar",
          "green",
        ));
    },
    pn = (e) => {
      (B("handleMarkAbsent(click)", {
        role: re?.role,
        canManageAttendance: me,
        eventId: e.eventId,
        assignmentId: e.id,
        userId: e.userId,
      }),
        Ut(
          "Marcar Falta",
          "¿Marcar este registro como falta? Se eliminará el check-in, check-out y fotos.",
          async () => {
            try {
              if (
                (B("handleMarkAbsent(confirm)", {
                  eventId: e.eventId,
                  userId: e.userId,
                }),
                !me)
              ) {
                (F.showError(
                  "No tienes permisos para modificar asistencias.",
                  "Permiso denegado",
                ),
                  Ne({
                    force: !0,
                  }));
                return;
              }
              const a = {
                  checkInTime: null,
                  checkOutTime: null,
                  checkInPhoto: null,
                  checkOutPhoto: null,
                  wasLate: null,
                  wasCheckOutLate: null,
                },
                s = await ks(e.eventId, e.userId, re);
              if (
                (B("handleMarkAbsent(docsToUpdate)", {
                  count: s.length,
                  ids: s.map((n) => n.id),
                  updateData: a,
                }),
                s.length === 0)
              ) {
                (F.showError(
                  "No se encontraron asignaciones para este usuario en este evento (0 docs).",
                  "No se pudo marcar",
                ),
                  Ne({
                    force: !0,
                  }));
                return;
              }
              (await Promise.all(
                s.map((n) =>
                  Mt(
                    Xe(firestoreDb, "events", e.eventId, "assignments", n.id),
                    a,
                  ),
                ),
              ),
                B("handleMarkAbsent(success)", {
                  eventId: e.eventId,
                  userId: e.userId,
                }),
                jt((n) => {
                  const r = e.userId,
                    d = (n[r] || []).map((g) =>
                      g.userId === e.userId && g.eventId === e.eventId
                        ? {
                            ...g,
                            checkInTime: void 0,
                            checkOutTime: void 0,
                            checkInPhoto: void 0,
                            checkOutPhoto: void 0,
                            wasLate: void 0,
                            wasCheckOutLate: void 0,
                          }
                        : g,
                    );
                  return {
                    ...n,
                    [r]: d,
                  };
                }),
                await Promise.all([
                  Ie({
                    force: !0,
                  }),
                  at(),
                ]),
                Ne({
                  force: !0,
                }));
            } catch (a) {
              (console.error("Error marking absent:", a),
                B("handleMarkAbsent(error)", {
                  role: re?.role,
                  eventId: e.eventId,
                  userId: e.userId,
                  error: a,
                }),
                F.showError("Error al marcar falta"));
            }
          },
          "Marcar Falta",
          "red",
        ));
    },
    at = async (e) => {
      const a = !!e?.silent;
      a || $(!0);
      try {
        const s = _() ? assignmentManagedAreas(re) : [];
        let n = [];
        if (s.length > 0)
          if (isBffEnabled()) {
            const c = await bffFetch("/api/service_areas");
            n = (Array.isArray(c?.items) ? c.items : [])
              .filter((v) => s.includes(String(v?.id)))
              .map((v) => String(v?.name || ""))
              .filter(Boolean);
          } else n = He.filter((c) => s.includes(c.id)).map((c) => c.name);
        if (isBffEnabled()) {
          const c = await bffFetch(
              `/api/attendance/events?startDate=${encodeURIComponent($e)}&endDate=${encodeURIComponent(Re)}`,
            ),
            x = Array.isArray(c?.events) ? c.events : [],
            v = x.map((R) => R.id).join(","),
            y = await bffFetch(
              `/api/attendance/records?startDate=${encodeURIComponent($e)}&endDate=${encodeURIComponent(Re)}&eventIds=${encodeURIComponent(v)}`,
            ),
            h = Array.isArray(y?.records) ? y.records : [],
            A = new Map(x.map((R) => [R.id, R])),
            O = h
              .map((R) => {
                const L = A.get(String(R.eventId));
                return L
                  ? {
                      ...R,
                      eventTitle: L.title || "Evento sin título",
                      eventDate: L.date || "",
                      eventTime: L.time || "",
                      eventStatus: L.status,
                      serviceTime: L.serviceTime || "",
                      endTime: L.endTime || "",
                    }
                  : null;
              })
              .filter(Boolean),
            U =
              _() && n.length > 0
                ? O.filter((R) => n.includes(String(R?.areaName || "")))
                : O;
          Xt(U);
          return;
        }
        const r = de(firestoreDb, "events"),
          i = we(r, ie("date", ">=", $e), ie("date", "<=", Re)),
          d = await readScopedAssignments(i, re),
          g = new Map();
        d.docs.forEach((c) => {
          g.set(c.id, {
            ...c.data(),
            id: c.id,
          });
        });
        const b = [];
        for (const c of d.docs) {
          const x = c.data();
          if (_() && s.length > 0) {
            const h = x.activeMinistries || [];
            if (!h.some((O) => s.includes(O)) && h.length > 0) continue;
          }
          const v = de(firestoreDb, "events", c.id, "assignments");
          (await readScopedAssignments(v, re)).docs.forEach((h) => {
            const A = h.data();
            (_() && n.length > 0 && !n.includes(A.areaName)) ||
              b.push({
                ...A,
                id: h.id,
                eventId: c.id,
                eventTitle: x.title,
                eventDate: x.date,
                eventTime: x.time || "",
                serviceTime: x.serviceTime || "",
                endTime: x.endTime || "",
              });
          });
        }
        (b.sort(
          (c, x) =>
            new Date(x.eventDate).getTime() - new Date(c.eventDate).getTime(),
        ),
          Xt(b));
      } catch (s) {
        console.error("Error fetching attendance:", s);
      } finally {
        a || $(!1);
      }
    };
  React.useEffect(() => (at(), () => {}), [$e, Re, assignmentPrivacyKey(re)]);
  const Ks = React.useRef(!1);
  useChangeFeed({
    enabled: isBffEnabled(),
    resources: [
      "attendance",
      "events",
      "users",
      "service_areas",
      "assignments",
    ],
    onChange: () => {
      document.visibilityState === "visible" &&
        (S ||
          Ks.current ||
          ((Ks.current = !0),
          Promise.resolve()
            .then(async () => {
              if (m === "people") {
                await Ie({
                  force: !0,
                  silent: !0,
                });
                return;
              }
              await at({
                silent: !0,
              });
            })
            .finally(() => {
              Ks.current = !1;
            })));
    },
    debounceMs: 900,
  });
  const Oa = React.useRef(0);
  React.useEffect(() => {
    if ((m !== "events" && m !== "reports") || isBffEnabled()) return;
    const e = _() ? assignmentManagedAreas(re) : [],
      a =
        e.length > 0
          ? fe.filter((g) => e.includes(g.id)).map((g) => g.name)
          : [],
      s = (g) => {
        const b = Date.now();
        b - Oa.current < 2e3 || ((Oa.current = b), at());
      },
      n = new Map(),
      r = de(firestoreDb, "events"),
      i = we(r, ie("date", ">=", $e), ie("date", "<=", Re)),
      d = watchScopedAssignments(
        i,
        re,
        (g) => {
          const b = new Set();
          for (const c of g.docs) {
            const x = c.data();
            if (_() && e.length > 0) {
              const h = x.activeMinistries || [];
              if (!h.some((O) => e.includes(O)) && h.length > 0) continue;
            }
            if ((b.add(c.id), n.has(c.id))) continue;
            const v = de(firestoreDb, "events", c.id, "assignments"),
              y = watchScopedAssignments(
                v,
                re,
                (h) => {
                  (_() &&
                    a.length > 0 &&
                    !h.docs.some((O) => {
                      const U = O.data();
                      return a.includes(U?.areaName);
                    })) ||
                    s();
                },
                () => {},
              );
            n.set(c.id, y);
          }
          for (const [c, x] of n.entries()) b.has(c) || (x(), n.delete(c));
          s();
        },
        () => {},
      );
    return () => {
      d();
      for (const g of n.values()) g();
    };
  }, [m, $e, Re, fe, _, le, assignmentPrivacyKey(re)]);
  const $a = React.useRef(0);
  React.useEffect(() => {
    if ((m !== "events" && m !== "reports") || isBffEnabled()) return;
    const e = () => {
        const s = Date.now();
        s - $a.current < 3e4 || (($a.current = s), at());
      },
      a = watchScopedAssignments(
        Xe(firestoreDb, "meta", "attendanceSync"),
        re,
        (s) => {
          (B("attendanceSync(marker)", {
            view: m,
            visible: document.visibilityState === "visible",
            version: s.data()?.version,
            updatedAt: s.data()?.updatedAt,
          }),
            e());
        },
        () => {},
      );
    return () => a();
  }, [m, $e, Re, _, le, assignmentPrivacyKey(re)]);
  const Je = (e) => {
      const a = ws(e.eventDate, e.endTime, e.eventTime, e.eventStatus);
      if (e.checkInTime && e.checkOutTime) {
        const n =
            e.wasLate ??
            rt(e.checkInTime, e.eventDate, e.serviceTime, e.eventTime),
          r =
            e.wasCheckOutLate ??
            bt(
              e.checkOutTime,
              e.eventDate,
              e.endTime,
              e.eventTime,
              e.serviceTime,
            );
        return n || r
          ? {
              label: "Atraso",
              color: "bg-amber-100 text-amber-700",
            }
          : {
              label: "Presente",
              color: "bg-green-100 text-green-700",
            };
      }
      if (e.checkInTime && !e.checkOutTime && a)
        return {
          label: "Sin salida",
          color: "bg-amber-100 text-amber-700",
        };
      if (e.checkInTime && !e.checkOutTime)
        return (e.wasLate ??
          rt(e.checkInTime, e.eventDate, e.serviceTime, e.eventTime))
          ? {
              label: "Atraso",
              color: "bg-amber-100 text-amber-700",
            }
          : {
              label: "Presente",
              color: "bg-green-100 text-green-700",
            };
      if (!e.checkInTime && e.checkOutTime)
        return {
          label: "Sin entrada",
          color: "bg-amber-100 text-amber-700",
        };
      if (a)
        return {
          label: "Ausente",
          color: "bg-red-100 text-red-700",
        };
      const s = qa(e.eventDate, e.serviceTime, e.eventTime, e.endTime);
      return !s.isOpen && s.message === "Registro cerrado"
        ? {
            label: "Ausente",
            color: "bg-red-100 text-red-700",
          }
        : {
            label: "Pendiente",
            color: "bg-gray-100 text-gray-700",
          };
    },
    Ra = js.filter((e) => {
      if (
        !(
          e.userName.toLowerCase().includes(Nt.toLowerCase()) ||
          e.eventTitle.toLowerCase().includes(Nt.toLowerCase()) ||
          e.areaName.toLowerCase().includes(Nt.toLowerCase())
        )
      )
        return !1;
      if (je === "all") return !0;
      const s = Je(e);
      return je === "present"
        ? s.label === "Presente"
        : je === "absent"
          ? s.label === "Ausente"
          : je === "pending"
            ? s.label === "Pendiente" ||
              s.label === "Sin entrada" ||
              s.label === "Sin salida"
            : !0;
    }),
    ze = (e) =>
      e
        ? new Date(e).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
    vn = async () => {
      if (Is) return;
      oa(!0);
      let e, a;
      try {
        try {
          ({ jsPDF: e, autoTable: a } = await ys());
        } catch {
          F.showError(
            "No se pudo cargar el generador de PDF. Intenta de nuevo.",
          );
          return;
        }
        const s = new e({
            orientation: "landscape",
          }),
          n = s.internal.pageSize.getWidth(),
          r = Ct.find((l) => l.weekNum === Ye);
        if (!r) {
          F.showInfo(
            "Por favor selecciona una semana válida",
            "Semana inválida",
          );
          return;
        }
        const i = r.start,
          d = r.end,
          g = `${ke}-${String(Le).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
          b = `${ke}-${String(Le).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
          c = _() ? assignmentManagedAreas(re) : [];
        let x = [];
        c.length > 0 &&
          (x = He.filter((l) => c.includes(l.id)).map((l) => l.name));
        const v = await readScopedAssignments(
            we(
              de(firestoreDb, "events"),
              ie("date", ">=", g),
              ie("date", "<=", b),
            ),
            re,
          ),
          y = [],
          h = new Set();
        for (const l of v.docs) {
          const T = l.data(),
            N = String(T?.date || "").trim();
          if (!/^\d{4}-\d{2}-\d{2}$/.test(N)) continue;
          if (_() && c.length > 0) {
            const f = T.activeMinistries || [];
            if (!f.some((H) => c.includes(H)) && f.length > 0) continue;
          }
          h.add(N);
          let E = de(firestoreDb, "events", l.id, "assignments");
          (_() &&
            c.length > 0 &&
            c.length <= 10 &&
            (E = we(E, ie("areaId", "in", c))),
            (await readScopedAssignments(E, re)).docs.forEach((f) => {
              const j = f.data();
              (_() && x.length > 0 && !x.includes(j.areaName)) ||
                y.push({
                  ...j,
                  id: f.id,
                  eventId: l.id,
                  eventTitle: T.title || "Evento sin título",
                  eventDate: N,
                  eventTime: T.time || "",
                  eventStatus: T.status,
                  serviceTime: T.serviceTime || "",
                  endTime: T.endTime || "",
                });
            }));
        }
        const A = Array.from(h).sort();
        if (A.length === 0 || y.length === 0) {
          F.showInfo(
            "No hay datos para la semana seleccionada.",
            "Sin registros",
          );
          return;
        }
        const U = new Date(ke, Le - 1, 1)
            .toLocaleDateString("es-ES", {
              month: "long",
            })
            .toUpperCase(),
          R =
            Ye === 1
              ? "1era"
              : Ye === 2
                ? "2da"
                : Ye === 3
                  ? "3era"
                  : Ye === 4
                    ? "4ta"
                    : "5ta";
        (s.setFillColor(30, 30, 30),
          s.rect(0, 0, n, 28, "F"),
          s.setTextColor(255, 255, 255),
          s.setFontSize(18),
          s.setFont("helvetica", "bold"),
          s.text("R E P O R T E   D E   A S I S T E N C I A", n / 2, 12, {
            align: "center",
          }),
          s.setFontSize(12),
          s.setFont("helvetica", "normal"),
          s.text("S E R V I D O R E S", n / 2, 22, {
            align: "center",
          }),
          s.setFillColor(50, 50, 50),
          s.rect(0, 28, n, 14, "F"),
          s.setFontSize(9),
          s.setTextColor(200, 150, 100),
          s.text(`${R}`, n / 2, 34, {
            align: "center",
          }),
          s.setFontSize(10),
          s.text(`SEMANA DE ${U} ${ke}`, n / 2, 40, {
            align: "center",
          }));
        const L = {};
        y.forEach((l) => {
          const T = l.areaName || "SIN ASIGNAR";
          (L[T] || (L[T] = []), L[T].push(l));
        });
        const K = [];
        Object.entries(L).forEach(([l, T]) => {
          const N = [
            {
              content: l.toUpperCase(),
              colSpan: 1 + A.length * 3,
              styles: {
                fillColor: [30, 30, 30],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center",
              },
            },
          ];
          (K.push(N),
            [...new Set(T.map((u) => u.userName))].forEach((u) => {
              const f = T.filter((H) => H.userName === u),
                j = [u];
              (A.forEach((H) => {
                const M = f.find((C) => C.eventDate === H);
                if (M) {
                  const C = M.checkInTime
                      ? new Date(M.checkInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : M.checkOutTime
                        ? "-"
                        : "Falta",
                    X = M.checkInTime
                      ? {}
                      : M.checkOutTime
                        ? {
                            fillColor: [254, 243, 199],
                            textColor: [180, 83, 9],
                          }
                        : {
                            fillColor: [254, 226, 226],
                            textColor: [220, 38, 38],
                          };
                  j.push({
                    content: C,
                    styles: X,
                  });
                  const q = M.checkOutTime
                      ? new Date(M.checkOutTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : M.checkInTime
                        ? "-"
                        : "Falta",
                    se = M.checkOutTime
                      ? {}
                      : M.checkInTime
                        ? {
                            fillColor: [254, 243, 199],
                            textColor: [180, 83, 9],
                          }
                        : {
                            fillColor: [254, 226, 226],
                            textColor: [220, 38, 38],
                          };
                  j.push({
                    content: q,
                    styles: se,
                  });
                  const z = Je(M).label,
                    J =
                      z === "Ausente"
                        ? {
                            fillColor: [220, 38, 38],
                            textColor: [255, 255, 255],
                            fontStyle: "bold",
                          }
                        : z === "Presente"
                          ? {
                              fillColor: [220, 252, 231],
                              textColor: [22, 101, 52],
                              fontStyle: "bold",
                            }
                          : z === "Atraso" ||
                              z === "Sin entrada" ||
                              z === "Sin salida"
                            ? {
                                fillColor: [254, 243, 199],
                                textColor: [180, 83, 9],
                                fontStyle: "bold",
                              }
                            : {
                                fillColor: [240, 240, 240],
                                textColor: [75, 85, 99],
                                fontStyle: "bold",
                              };
                  j.push({
                    content: z,
                    styles: J,
                  });
                } else
                  (j.push({
                    content: "-",
                    styles: {
                      fillColor: [240, 240, 240],
                      textColor: [150, 150, 150],
                      fontSize: 7,
                    },
                  }),
                    j.push({
                      content: "-",
                      styles: {
                        fillColor: [240, 240, 240],
                        textColor: [150, 150, 150],
                        fontSize: 7,
                      },
                    }),
                    j.push({
                      content: "No sirvió",
                      styles: {
                        fillColor: [240, 240, 240],
                        textColor: [150, 150, 150],
                        fontSize: 7,
                      },
                    }));
              }),
                K.push(j));
            }));
        });
        const ge = [
          {
            content: "NOMBRES",
            styles: {
              fillColor: [50, 50, 50],
            },
          },
        ];
        (A.forEach((l) => {
          const T = new Date(l + "T00:00:00"),
            N = T.toLocaleDateString("es-ES", {
              weekday: "short",
            }).toUpperCase(),
            E = T.getDate(),
            u = T.toLocaleDateString("es-ES", {
              month: "short",
            }).toUpperCase();
          (ge.push({
            content: `ENTRADA
${N} ${E}/${u}`,
            styles: {
              fillColor: [50, 50, 50],
              fontSize: 6,
              halign: "center",
            },
          }),
            ge.push({
              content: `SALIDA
${N} ${E}/${u}`,
              styles: {
                fillColor: [50, 50, 50],
                fontSize: 6,
                halign: "center",
              },
            }),
            ge.push({
              content: `ESTADO
${N} ${E}/${u}`,
              styles: {
                fillColor: [50, 50, 50],
                fontSize: 6,
                halign: "center",
              },
            }));
        }),
          a(s, {
            head: [ge],
            body: K,
            startY: 45,
            theme: "grid",
            styles: {
              fontSize: 9,
              cellPadding: 3,
              lineColor: [200, 200, 200],
              lineWidth: 0.1,
              halign: "center",
              valign: "middle",
            },
            headStyles: {
              fillColor: [50, 50, 50],
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 8,
            },
            columnStyles: {
              0: {
                halign: "left",
                cellWidth: 40,
              },
            },
          }));
        const W = [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ];
        s.save(`reporte_asistencia_${ke}_${W[Le - 1]}_semana${Ye}.pdf`);
      } finally {
        oa(!1);
      }
    },
    yn = async () => {
      if (Cs) return;
      la(!0);
      let e, a;
      try {
        try {
          ({ jsPDF: e, autoTable: a } = await ys());
        } catch {
          F.showError(
            "No se pudo cargar el generador de PDF. Intenta de nuevo.",
          );
          return;
        }
        const s = new e({
            orientation: "landscape",
          }),
          n = s.internal.pageSize.getWidth(),
          r = `${Se}-${String(Be).padStart(2, "0")}-01`,
          i = new Date(Se, Be, 0).getDate(),
          d = `${Se}-${String(Be).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
          g = _() ? assignmentManagedAreas(re) : [];
        let b = [];
        g.length > 0 &&
          (b = He.filter((W) => g.includes(W.id)).map((W) => W.name));
        const c = await readScopedAssignments(
            we(
              de(firestoreDb, "events"),
              ie("date", ">=", r),
              ie("date", "<=", d),
            ),
            re,
          ),
          x = [],
          v = new Set();
        for (const W of c.docs) {
          const l = W.data(),
            T = String(l?.date || "").trim();
          if (!/^\d{4}-\d{2}-\d{2}$/.test(T)) continue;
          if (_() && g.length > 0) {
            const u = l.activeMinistries || [];
            if (!u.some((j) => g.includes(j)) && u.length > 0) continue;
          }
          v.add(T);
          let N = de(firestoreDb, "events", W.id, "assignments");
          (_() &&
            g.length > 0 &&
            g.length <= 10 &&
            (N = we(N, ie("areaId", "in", g))),
            (await readScopedAssignments(N, re)).docs.forEach((u) => {
              const f = u.data();
              (_() && b.length > 0 && !b.includes(f.areaName)) ||
                x.push({
                  ...f,
                  id: u.id,
                  eventId: W.id,
                  eventTitle: l.title || "Evento sin título",
                  eventDate: T,
                  eventTime: l.time || "",
                  eventStatus: l.status,
                  serviceTime: l.serviceTime || "",
                  endTime: l.endTime || "",
                });
            }));
        }
        const y = Array.from(v).sort();
        if (y.length === 0 || x.length === 0) {
          F.showInfo("No hay datos para el mes seleccionado.", "Sin registros");
          return;
        }
        const A = new Date(Se, Be - 1, 1)
          .toLocaleDateString("es-ES", {
            month: "long",
          })
          .toUpperCase();
        (s.setFillColor(30, 30, 30),
          s.rect(0, 0, n, 28, "F"),
          s.setTextColor(255, 255, 255),
          s.setFontSize(18),
          s.setFont("helvetica", "bold"),
          s.text("R E P O R T E   D E   A S I S T E N C I A", n / 2, 12, {
            align: "center",
          }),
          s.setFontSize(12),
          s.setFont("helvetica", "normal"),
          s.text("S E R V I D O R E S", n / 2, 22, {
            align: "center",
          }),
          s.setFillColor(50, 50, 50),
          s.rect(0, 28, n, 14, "F"),
          s.setFontSize(10),
          s.setTextColor(200, 150, 100),
          s.text(`MES DE ${A} ${Se}`, n / 2, 38, {
            align: "center",
          }));
        const O = cs(Se, Be),
          U = new Set();
        for (const W of y) {
          const l = Number(W.slice(8, 10));
          Number.isFinite(l) && U.add(l);
        }
        const R = O.filter((W) => {
            for (const l of U) if (l >= W.start && l <= W.end) return !0;
            return !1;
          }),
          L = {};
        x.forEach((W) => {
          const l = W.areaName || "SIN ASIGNAR";
          (L[l] || (L[l] = []), L[l].push(W));
        });
        let K = 45;
        R.forEach((W) => {
          const l = y.filter((u) => {
            const f = Number(u.slice(8, 10));
            return Number.isFinite(f) && f >= W.start && f <= W.end;
          });
          if (l.length === 0) return;
          const T = [];
          (T.push([
            {
              content: `SEMANA ${W.weekNum}`,
              colSpan: 1 + l.length * 3,
              styles: {
                fillColor: [50, 50, 50],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center",
              },
            },
          ]),
            Object.entries(L).forEach(([u, f]) => {
              const j = f.filter((C) => C.eventDate && l.includes(C.eventDate));
              if (j.length === 0) return;
              const H = [
                {
                  content: u.toUpperCase(),
                  colSpan: 1 + l.length * 3,
                  styles: {
                    fillColor: [30, 30, 30],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                    halign: "center",
                  },
                },
              ];
              (T.push(H),
                [...new Set(j.map((C) => C.userName))].forEach((C) => {
                  const X = j.filter((se) => se.userName === C),
                    q = [C];
                  (l.forEach((se) => {
                    const z = X.find((ve) => ve.eventDate === se);
                    if (z) {
                      const ve = z.checkInTime
                          ? new Date(z.checkInTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : z.checkOutTime
                            ? "-"
                            : "Falta",
                        J = z.checkInTime
                          ? {}
                          : z.checkOutTime
                            ? {
                                fillColor: [254, 243, 199],
                                textColor: [180, 83, 9],
                              }
                            : {
                                fillColor: [254, 226, 226],
                                textColor: [220, 38, 38],
                              };
                      q.push({
                        content: ve,
                        styles: J,
                      });
                      const Qe = z.checkOutTime
                          ? new Date(z.checkOutTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : z.checkInTime
                            ? "-"
                            : "Falta",
                        Ke = z.checkOutTime
                          ? {}
                          : z.checkInTime
                            ? {
                                fillColor: [254, 243, 199],
                                textColor: [180, 83, 9],
                              }
                            : {
                                fillColor: [254, 226, 226],
                                textColor: [220, 38, 38],
                              };
                      q.push({
                        content: Qe,
                        styles: Ke,
                      });
                      const ce = Je(z).label,
                        Fe =
                          ce === "Ausente"
                            ? {
                                fillColor: [220, 38, 38],
                                textColor: [255, 255, 255],
                                fontStyle: "bold",
                              }
                            : ce === "Presente"
                              ? {
                                  fillColor: [220, 252, 231],
                                  textColor: [22, 101, 52],
                                  fontStyle: "bold",
                                }
                              : ce === "Atraso" ||
                                  ce === "Sin entrada" ||
                                  ce === "Sin salida"
                                ? {
                                    fillColor: [254, 243, 199],
                                    textColor: [180, 83, 9],
                                    fontStyle: "bold",
                                  }
                                : {
                                    fillColor: [240, 240, 240],
                                    textColor: [75, 85, 99],
                                    fontStyle: "bold",
                                  };
                      q.push({
                        content: ce,
                        styles: Fe,
                      });
                    } else
                      (q.push({
                        content: "-",
                        styles: {
                          fillColor: [240, 240, 240],
                          textColor: [150, 150, 150],
                          fontSize: 7,
                        },
                      }),
                        q.push({
                          content: "-",
                          styles: {
                            fillColor: [240, 240, 240],
                            textColor: [150, 150, 150],
                            fontSize: 7,
                          },
                        }),
                        q.push({
                          content: "No sirvió",
                          styles: {
                            fillColor: [240, 240, 240],
                            textColor: [150, 150, 150],
                            fontSize: 7,
                          },
                        }));
                  }),
                    T.push(q));
                }));
            }));
          const N = [
            {
              content: "NOMBRES",
              styles: {
                fillColor: [50, 50, 50],
              },
            },
          ];
          (l.forEach((u) => {
            const f = new Date(u + "T00:00:00"),
              j = f
                .toLocaleDateString("es-ES", {
                  weekday: "short",
                })
                .toUpperCase(),
              H = f.getDate(),
              M = f
                .toLocaleDateString("es-ES", {
                  month: "short",
                })
                .toUpperCase();
            (N.push({
              content: `ENTRADA
${j} ${H}/${M}`,
              styles: {
                fillColor: [50, 50, 50],
                fontSize: 6,
                halign: "center",
              },
            }),
              N.push({
                content: `SALIDA
${j} ${H}/${M}`,
                styles: {
                  fillColor: [50, 50, 50],
                  fontSize: 6,
                  halign: "center",
                },
              }),
              N.push({
                content: `ESTADO
${j} ${H}/${M}`,
                styles: {
                  fillColor: [50, 50, 50],
                  fontSize: 6,
                  halign: "center",
                },
              }));
          }),
            a(s, {
              head: [N],
              body: T,
              startY: K,
              theme: "grid",
              styles: {
                fontSize: 9,
                cellPadding: 3,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
                halign: "center",
                valign: "middle",
              },
              headStyles: {
                fillColor: [50, 50, 50],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 8,
              },
              columnStyles: {
                0: {
                  halign: "left",
                  cellWidth: 40,
                },
              },
            }),
            (K = (s.lastAutoTable?.finalY || K) + 8));
        });
        const ge = [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ];
        s.save(`reporte_asistencia_${Se}_${ge[Be - 1]}.pdf`);
      } finally {
        la(!1);
      }
    },
    kn = async () => {
      if (Es) return;
      if (!tt) {
        F.showInfo(
          "Selecciona un servidor para generar el reporte.",
          "Servidor requerido",
        );
        return;
      }
      ca(!0);
      let e, a;
      try {
        try {
          ({ jsPDF: e, autoTable: a } = await ys());
        } catch {
          F.showError(
            "No se pudo cargar el generador de PDF. Intenta de nuevo.",
          );
          return;
        }
        const s = _e.find((u) => u.id === tt),
          n = String(s?.name || "Servidor"),
          r = new e({
            orientation: "landscape",
          }),
          i = r.internal.pageSize.getWidth(),
          d = `${Te}-${String(Ve).padStart(2, "0")}-01`,
          g = new Date(Te, Ve, 0).getDate(),
          b = `${Te}-${String(Ve).padStart(2, "0")}-${String(g).padStart(2, "0")}`,
          c = _() ? assignmentManagedAreas(re) : [];
        let x = [];
        c.length > 0 &&
          (x = He.filter((u) => c.includes(u.id)).map((u) => u.name));
        const v = await readScopedAssignments(
            we(
              de(firestoreDb, "events"),
              ie("date", ">=", d),
              ie("date", "<=", b),
              ta("date", "desc"),
            ),
            re,
          ),
          y = [];
        for (const u of v.docs) {
          const f = u.data(),
            j = String(f?.date || "").trim();
          if (!/^\d{4}-\d{2}-\d{2}$/.test(j)) continue;
          if (_() && c.length > 0) {
            const M = f.activeMinistries || [];
            if (!M.some((X) => c.includes(X)) && M.length > 0) continue;
          }
          (
            await readScopedAssignments(
              we(
                de(firestoreDb, "events", u.id, "assignments"),
                ie("userId", "==", tt),
              ),
              re,
            )
          ).docs.forEach((M) => {
            const C = M.data();
            (_() && x.length > 0 && !x.includes(C.areaName)) ||
              y.push({
                ...C,
                id: M.id,
                eventId: u.id,
                eventTitle: f.title || "Evento sin título",
                eventDate: j,
                eventTime: f.time || "",
                eventStatus: f.status,
                serviceTime: f.serviceTime || "",
                endTime: f.endTime || "",
              });
          });
        }
        if (y.length === 0) {
          F.showInfo(
            "No hay datos para el servidor y mes seleccionados.",
            "Sin registros",
          );
          return;
        }
        const A = new Date(Te, Ve - 1, 1)
          .toLocaleDateString("es-ES", {
            month: "long",
          })
          .toUpperCase();
        (r.setFillColor(30, 30, 30),
          r.rect(0, 0, i, 28, "F"),
          r.setTextColor(255, 255, 255),
          r.setFontSize(18),
          r.setFont("helvetica", "bold"),
          r.text("R E P O R T E   D E   A S I S T E N C I A", i / 2, 12, {
            align: "center",
          }),
          r.setFontSize(12),
          r.setFont("helvetica", "normal"),
          r.text("S E R V I D O R", i / 2, 22, {
            align: "center",
          }),
          r.setFillColor(50, 50, 50),
          r.rect(0, 28, i, 14, "F"),
          r.setTextColor(200, 150, 100),
          r.setFont("helvetica", "bold"),
          r.setFontSize(10),
          r.text(`MES DE ${A} ${Te}`, i / 2, 36, {
            align: "center",
          }),
          r.setFont("helvetica", "normal"),
          r.setFontSize(9),
          r.text(String(n).toUpperCase(), i / 2, 41, {
            align: "center",
          }));
        const O = new Map();
        for (const u of y) {
          const f = `${u.areaName || "SIN ASIGNAR"}__${u.eventDate}`,
            j = O.get(f);
          j ? j.push(u) : O.set(f, [u]);
        }
        const U = Array.from(O.values()).map((u) => {
            const f = u[0],
              j = u
                .map((M) => M.checkInTime)
                .filter(Boolean)
                .sort(
                  (M, C) => new Date(M).getTime() - new Date(C).getTime(),
                )[0],
              H = u
                .map((M) => M.checkOutTime)
                .filter(Boolean)
                .sort(
                  (M, C) => new Date(C).getTime() - new Date(M).getTime(),
                )[0];
            return {
              ...f,
              checkInTime: j,
              checkOutTime: H,
            };
          }),
          R = {};
        U.forEach((u) => {
          const f = u.areaName || "SIN ASIGNAR";
          (R[f] || (R[f] = []), R[f].push(u));
        });
        const L = Object.entries(R)
          .map(([u, f]) => {
            const j = Array.from(
                new Set(f.map((M) => String(M.eventDate || ""))),
              )
                .filter((M) => /^\d{4}-\d{2}-\d{2}$/.test(M))
                .sort(),
              H = new Map();
            for (const M of f) M.eventDate && H.set(M.eventDate, M);
            return {
              ministry: u,
              dates: j,
              byDate: H,
            };
          })
          .filter((u) => u.dates.length > 0);
        if (L.length === 0) {
          F.showInfo(
            "No hay datos para el servidor y mes seleccionados.",
            "Sin registros",
          );
          return;
        }
        const K = cs(Te, Ve),
          ge = Array.from(new Set(y.map((u) => String(u.eventDate || ""))))
            .filter((u) => /^\d{4}-\d{2}-\d{2}$/.test(u))
            .sort(),
          W = new Set();
        for (const u of ge) {
          const f = Number(u.slice(8, 10));
          Number.isFinite(f) && W.add(f);
        }
        const l = K.filter((u) => {
          for (const f of W) if (f >= u.start && f <= u.end) return !0;
          return !1;
        });
        let T = 48;
        for (const u of l)
          for (const f of L) {
            const { ministry: j, dates: H, byDate: M } = f,
              C = H.filter((ve) => {
                const J = Number(ve.slice(8, 10));
                return Number.isFinite(J) && J >= u.start && J <= u.end;
              });
            if (C.length === 0) continue;
            const X = [
              {
                content: "NOMBRES",
                styles: {
                  fillColor: [50, 50, 50],
                },
              },
            ];
            C.forEach((ve) => {
              const J = new Date(ve + "T00:00:00"),
                Qe = J.toLocaleDateString("es-ES", {
                  weekday: "short",
                }).toUpperCase(),
                Ke = J.getDate(),
                ce = J.toLocaleDateString("es-ES", {
                  month: "short",
                }).toUpperCase();
              (X.push({
                content: `ENTRADA
${Qe} ${Ke}/${ce}`,
                styles: {
                  fillColor: [50, 50, 50],
                  fontSize: 6,
                  halign: "center",
                },
              }),
                X.push({
                  content: `SALIDA
${Qe} ${Ke}/${ce}`,
                  styles: {
                    fillColor: [50, 50, 50],
                    fontSize: 6,
                    halign: "center",
                  },
                }),
                X.push({
                  content: `ESTADO
${Qe} ${Ke}/${ce}`,
                  styles: {
                    fillColor: [50, 50, 50],
                    fontSize: 6,
                    halign: "center",
                  },
                }));
            });
            const q = [];
            (q.push([
              {
                content: `SEMANA ${u.weekNum}`,
                colSpan: 1 + C.length * 3,
                styles: {
                  fillColor: [50, 50, 50],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  halign: "center",
                },
              },
            ]),
              q.push([
                {
                  content: j.toUpperCase(),
                  colSpan: 1 + C.length * 3,
                  styles: {
                    fillColor: [30, 30, 30],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                    halign: "center",
                  },
                },
              ]));
            const se = [n];
            (C.forEach((ve) => {
              const J = M.get(ve);
              if (!J) {
                (se.push({
                  content: "-",
                }),
                  se.push({
                    content: "-",
                  }),
                  se.push({
                    content: "-",
                  }));
                return;
              }
              const Qe = J.checkInTime
                  ? new Date(J.checkInTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : J.checkOutTime
                    ? "-"
                    : "Falta",
                Ke = J.checkInTime
                  ? {}
                  : J.checkOutTime
                    ? {
                        fillColor: [254, 243, 199],
                        textColor: [180, 83, 9],
                      }
                    : {
                        fillColor: [254, 226, 226],
                        textColor: [220, 38, 38],
                      };
              se.push({
                content: Qe,
                styles: Ke,
              });
              const ce = J.checkOutTime
                  ? new Date(J.checkOutTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : J.checkInTime
                    ? "-"
                    : "Falta",
                ea = J.checkOutTime
                  ? {}
                  : J.checkInTime
                    ? {
                        fillColor: [254, 243, 199],
                        textColor: [180, 83, 9],
                      }
                    : {
                        fillColor: [254, 226, 226],
                        textColor: [220, 38, 38],
                      };
              se.push({
                content: ce,
                styles: ea,
              });
              const Fe = Je(J).label,
                jn =
                  Fe === "Ausente"
                    ? {
                        fillColor: [220, 38, 38],
                        textColor: [255, 255, 255],
                        fontStyle: "bold",
                      }
                    : Fe === "Presente"
                      ? {
                          fillColor: [220, 252, 231],
                          textColor: [22, 101, 52],
                          fontStyle: "bold",
                        }
                      : Fe === "Atraso" ||
                          Fe === "Sin entrada" ||
                          Fe === "Sin salida"
                        ? {
                            fillColor: [254, 243, 199],
                            textColor: [180, 83, 9],
                            fontStyle: "bold",
                          }
                        : {
                            fillColor: [240, 240, 240],
                            textColor: [75, 85, 99],
                            fontStyle: "bold",
                          };
              se.push({
                content: Fe,
                styles: jn,
              });
            }),
              q.push(se),
              a(r, {
                head: [X],
                body: q,
                startY: T,
                theme: "grid",
                styles: {
                  fontSize: 9,
                  cellPadding: 3,
                  lineColor: [200, 200, 200],
                  lineWidth: 0.1,
                  halign: "center",
                  valign: "middle",
                },
                headStyles: {
                  fillColor: [50, 50, 50],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 8,
                },
                columnStyles: {
                  0: {
                    halign: "left",
                    cellWidth: 40,
                  },
                },
              }),
              (T = (r.lastAutoTable?.finalY || T) + 6));
          }
        const N = n
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_\-]/g, "")
            .slice(0, 40),
          E = [
            "enero",
            "febrero",
            "marzo",
            "abril",
            "mayo",
            "junio",
            "julio",
            "agosto",
            "septiembre",
            "octubre",
            "noviembre",
            "diciembre",
          ];
        r.save(`reporte_mensual_${N || "servidor"}_${Te}_${E[Ve - 1]}.pdf`);
      } finally {
        ca(!1);
      }
    },
    Nn = async () => {
      if (Ms) return;
      if (!Ge) {
        F.showInfo(
          "Selecciona un ministerio para generar el reporte.",
          "Ministerio requerido",
        );
        return;
      }
      const e = _() ? assignmentManagedAreas(re) : [];
      if (e.length > 0 && !e.includes(Ge)) {
        F.showInfo(
          "No tienes permiso para generar reportes de este ministerio.",
          "Sin permisos",
        );
        return;
      }
      da(!0);
      let a, s;
      try {
        try {
          ({ jsPDF: a, autoTable: s } = await ys());
        } catch {
          F.showError(
            "No se pudo cargar el generador de PDF. Intenta de nuevo.",
          );
          return;
        }
        const n = fe.find((N) => N.id === Ge),
          r = String(n?.name || "Ministerio"),
          i = new a({
            orientation: "landscape",
          }),
          d = i.internal.pageSize.getWidth(),
          g = `${De}-${String(qe).padStart(2, "0")}-01`,
          b = new Date(De, qe, 0).getDate(),
          c = `${De}-${String(qe).padStart(2, "0")}-${String(b).padStart(2, "0")}`,
          x = await readScopedAssignments(
            we(
              de(firestoreDb, "events"),
              ie("date", ">=", g),
              ie("date", "<=", c),
            ),
            re,
          ),
          v = [],
          y = new Set();
        for (const N of x.docs) {
          const E = N.data(),
            u = String(E?.date || "").trim();
          if (!/^\d{4}-\d{2}-\d{2}$/.test(u)) continue;
          const f = E.activeMinistries || [];
          if (Array.isArray(f) && f.length > 0 && !f.includes(Ge)) continue;
          (
            await readScopedAssignments(
              de(firestoreDb, "events", N.id, "assignments"),
              re,
            )
          ).docs.forEach((H) => {
            const M = H.data();
            String(M.areaName || "") === r &&
              (y.add(u),
              v.push({
                ...M,
                id: H.id,
                eventId: N.id,
                eventTitle: E.title || "Evento sin título",
                eventDate: u,
                eventTime: E.time || "",
                eventStatus: E.status,
                serviceTime: E.serviceTime || "",
                endTime: E.endTime || "",
              }));
          });
        }
        const h = Array.from(y).sort();
        if (h.length === 0 || v.length === 0) {
          F.showInfo(
            "No hay datos para el ministerio y mes seleccionados.",
            "Sin registros",
          );
          return;
        }
        const A = new Map();
        for (const N of v) {
          const E = `${String(N.userId || N.userName || "")}__${String(N.eventDate || "")}`,
            u = A.get(E);
          u ? u.push(N) : A.set(E, [N]);
        }
        const O = Array.from(A.values()).map((N) => {
            const E = N[0],
              u = N.map((j) => j.checkInTime)
                .filter(Boolean)
                .sort(
                  (j, H) => new Date(j).getTime() - new Date(H).getTime(),
                )[0],
              f = N.map((j) => j.checkOutTime)
                .filter(Boolean)
                .sort(
                  (j, H) => new Date(H).getTime() - new Date(j).getTime(),
                )[0];
            return {
              ...E,
              checkInTime: u,
              checkOutTime: f,
            };
          }),
          R = new Date(De, qe - 1, 1)
            .toLocaleDateString("es-ES", {
              month: "long",
            })
            .toUpperCase();
        (i.setFillColor(30, 30, 30),
          i.rect(0, 0, d, 28, "F"),
          i.setTextColor(255, 255, 255),
          i.setFontSize(18),
          i.setFont("helvetica", "bold"),
          i.text("R E P O R T E   D E   A S I S T E N C I A", d / 2, 12, {
            align: "center",
          }),
          i.setFontSize(12),
          i.setFont("helvetica", "normal"),
          i.text("M I N I S T E R I O", d / 2, 22, {
            align: "center",
          }),
          i.setFillColor(50, 50, 50),
          i.rect(0, 28, d, 14, "F"),
          i.setTextColor(200, 150, 100),
          i.setFont("helvetica", "bold"),
          i.setFontSize(10),
          i.text(`MES DE ${R} ${De}`, d / 2, 36, {
            align: "center",
          }),
          i.setFont("helvetica", "normal"),
          i.setFontSize(9),
          i.text(String(r).toUpperCase(), d / 2, 41, {
            align: "center",
          }));
        const L = cs(De, qe),
          K = new Set();
        for (const N of h) {
          const E = Number(N.slice(8, 10));
          Number.isFinite(E) && K.add(E);
        }
        const ge = L.filter((N) => {
          for (const E of K) if (E >= N.start && E <= N.end) return !0;
          return !1;
        });
        let W = 45;
        for (const N of ge) {
          const E = h.filter((C) => {
            const X = Number(C.slice(8, 10));
            return Number.isFinite(X) && X >= N.start && X <= N.end;
          });
          if (E.length === 0) continue;
          const u = O.filter((C) => C.eventDate && E.includes(C.eventDate));
          if (u.length === 0) continue;
          const f = [];
          (f.push([
            {
              content: `SEMANA ${N.weekNum}`,
              colSpan: 1 + E.length * 3,
              styles: {
                fillColor: [50, 50, 50],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center",
              },
            },
          ]),
            f.push([
              {
                content: String(r).toUpperCase(),
                colSpan: 1 + E.length * 3,
                styles: {
                  fillColor: [30, 30, 30],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  halign: "center",
                },
              },
            ]));
          const j = Array.from(
            new Map(
              u
                .filter((C) => C.userId || C.userName)
                .map((C) => [
                  String(C.userId || C.userName),
                  String(C.userName || "(Sin nombre)"),
                ]),
            ).entries(),
          )
            .map(([C, X]) => ({
              id: C,
              name: X,
            }))
            .sort((C, X) => C.name.localeCompare(X.name));
          for (const C of j) {
            const X = u.filter(
                (se) => String(se.userId || se.userName) === C.id,
              ),
              q = [C.name];
            for (const se of E) {
              const z = X.find((ve) => ve.eventDate === se);
              if (z) {
                const ve = z.checkInTime
                    ? new Date(z.checkInTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : z.checkOutTime
                      ? "-"
                      : "Falta",
                  J = z.checkInTime
                    ? {}
                    : z.checkOutTime
                      ? {
                          fillColor: [254, 243, 199],
                          textColor: [180, 83, 9],
                        }
                      : {
                          fillColor: [254, 226, 226],
                          textColor: [220, 38, 38],
                        };
                q.push({
                  content: ve,
                  styles: J,
                });
                const Qe = z.checkOutTime
                    ? new Date(z.checkOutTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : z.checkInTime
                      ? "-"
                      : "Falta",
                  Ke = z.checkOutTime
                    ? {}
                    : z.checkInTime
                      ? {
                          fillColor: [254, 243, 199],
                          textColor: [180, 83, 9],
                        }
                      : {
                          fillColor: [254, 226, 226],
                          textColor: [220, 38, 38],
                        };
                q.push({
                  content: Qe,
                  styles: Ke,
                });
                const ce = Je(z).label,
                  Fe =
                    ce === "Ausente"
                      ? {
                          fillColor: [220, 38, 38],
                          textColor: [255, 255, 255],
                          fontStyle: "bold",
                        }
                      : ce === "Presente"
                        ? {
                            fillColor: [220, 252, 231],
                            textColor: [22, 101, 52],
                            fontStyle: "bold",
                          }
                        : ce === "Atraso" ||
                            ce === "Sin entrada" ||
                            ce === "Sin salida"
                          ? {
                              fillColor: [254, 243, 199],
                              textColor: [180, 83, 9],
                              fontStyle: "bold",
                            }
                          : {
                              fillColor: [240, 240, 240],
                              textColor: [75, 85, 99],
                              fontStyle: "bold",
                            };
                q.push({
                  content: ce,
                  styles: Fe,
                });
              } else
                (q.push({
                  content: "-",
                  styles: {
                    fillColor: [240, 240, 240],
                    textColor: [150, 150, 150],
                    fontSize: 7,
                  },
                }),
                  q.push({
                    content: "-",
                    styles: {
                      fillColor: [240, 240, 240],
                      textColor: [150, 150, 150],
                      fontSize: 7,
                    },
                  }),
                  q.push({
                    content: "No sirvió",
                    styles: {
                      fillColor: [240, 240, 240],
                      textColor: [150, 150, 150],
                      fontSize: 7,
                    },
                  }));
            }
            f.push(q);
          }
          const H = [
            {
              content: "NOMBRES",
              styles: {
                fillColor: [50, 50, 50],
              },
            },
          ];
          (E.forEach((C) => {
            const X = new Date(C + "T00:00:00"),
              q = X.toLocaleDateString("es-ES", {
                weekday: "short",
              }).toUpperCase(),
              se = X.getDate(),
              z = X.toLocaleDateString("es-ES", {
                month: "short",
              }).toUpperCase();
            (H.push({
              content: `ENTRADA
${q} ${se}/${z}`,
              styles: {
                fillColor: [50, 50, 50],
                fontSize: 6,
                halign: "center",
              },
            }),
              H.push({
                content: `SALIDA
${q} ${se}/${z}`,
                styles: {
                  fillColor: [50, 50, 50],
                  fontSize: 6,
                  halign: "center",
                },
              }),
              H.push({
                content: `ESTADO
${q} ${se}/${z}`,
                styles: {
                  fillColor: [50, 50, 50],
                  fontSize: 6,
                  halign: "center",
                },
              }));
          }),
            s(i, {
              head: [H],
              body: f,
              startY: W,
              theme: "grid",
              styles: {
                fontSize: 9,
                cellPadding: 3,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
                halign: "center",
                valign: "middle",
              },
              headStyles: {
                fillColor: [50, 50, 50],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 8,
              },
              columnStyles: {
                0: {
                  halign: "left",
                  cellWidth: 40,
                },
              },
            }),
            (W = (i.lastAutoTable?.finalY || W) + 8));
        }
        const l = String(r)
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_\-]/g, "")
            .slice(0, 40),
          T = [
            "enero",
            "febrero",
            "marzo",
            "abril",
            "mayo",
            "junio",
            "julio",
            "agosto",
            "septiembre",
            "octubre",
            "noviembre",
            "diciembre",
          ];
        i.save(
          `reporte_mensual_ministerio_${l || "ministerio"}_${De}_${T[qe - 1]}.pdf`,
        );
      } finally {
        da(!1);
      }
    },
    La = (e) => {
      const [a, s, n] = e.split("-").map(Number),
        i = new Date(a, s - 1, 1).getDay();
      return Math.ceil((n + i) / 7);
    },
    _t = Ft ? mn[Ft] || [] : [],
    gs = _t.filter((e) => {
      if (!e.eventDate) return !0;
      const [a, s] = e.eventDate.split("-");
      return !(
        (mt !== "all" && `${a}-${s}` !== mt) ||
        (ut !== "all" && La(e.eventDate).toString() !== ut)
      );
    }),
    wn = [
      ...new Set(
        _t
          .filter((e) => e.eventDate)
          .map((e) => {
            const [a, s] = e.eventDate.split("-");
            return `${a}-${s}`;
          }),
      ),
    ]
      .sort()
      .reverse(),
    Xs = React.useMemo(() => {
      const e = _t.filter((n) => n.eventDate),
        a =
          mt === "all"
            ? e
            : e.filter((n) => {
                const [r, i] = n.eventDate.split("-");
                return `${r}-${i}` === mt;
              }),
        s = new Set();
      for (const n of a) {
        const r = String(n.eventDate || "");
        if (!r) continue;
        const i = La(r);
        Number.isFinite(i) && s.add(i);
      }
      return Array.from(s).sort((n, r) => n - r);
    }, [_t, mt]);
  React.useEffect(() => {
    ut !== "all" && (Xs.includes(Number(ut)) || Pt("all"));
  }, [Xs, ut, assignmentPrivacyKey(re)]);
  const za = Ft ? _e.find((e) => e.id === Ft) : null,
    Zs = (() => {
      const e = new Map();
      for (const a of gs) {
        const s = a.eventId || `${a.eventDate}|${a.eventTitle}`,
          n = e.get(s);
        n ? n.push(a) : e.set(s, [a]);
      }
      return Array.from(e.values()).map((a) => {
        const s = a[0],
          n = a
            .map((i) => i.checkInTime)
            .filter(Boolean)
            .sort((i, d) => new Date(i).getTime() - new Date(d).getTime())[0],
          r = a
            .map((i) => i.checkOutTime)
            .filter(Boolean)
            .sort((i, d) => new Date(d).getTime() - new Date(i).getTime())[0];
        return {
          ...s,
          checkInTime: n,
          checkOutTime: r,
        };
      });
    })().reduce(
      (e, a) => {
        const s = Je(a).label;
        return (
          a.checkInTime || a.checkOutTime
            ? (e.present += 1)
            : s === "Ausente"
              ? (e.absent += 1)
              : (e.pending += 1),
          e
        );
      },
      {
        present: 0,
        absent: 0,
        pending: 0,
      },
    );
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {[
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {[
              <div>
                {[
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {"Reporte de Asistencias"}
                  </h1>,
                  <p className="text-gray-500 dark:text-slate-400 mt-1">
                    {"Gestión y control de asistencia."}
                  </p>,
                ]}
              </div>,
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
                {[
                  <button
                    onClick={() => k("people")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${m === "people" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"}`}
                  >
                    {"Listado de Personas"}
                  </button>,
                  <button
                    onClick={() => k("events")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${m === "events" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"}`}
                  >
                    {"Historial de Eventos"}
                  </button>,
                  <button
                    onClick={() => k("reports")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${m === "reports" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"}`}
                  >
                    {[<FileTextIcon size={16} />, "Reportes"]}
                  </button>,
                ]}
              </div>,
            ]}
          </div>,
          m === "people" && (
            <div className="space-y-4">
              {[
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
                  {[
                    <div className="relative">
                      {[
                        <button
                          onClick={() => {
                            if (!ee) {
                              const a = parseInt(p.split("-")[0]);
                              if (Ee && !ae.has(a)) {
                                const s = G.at(-1);
                                he(s ?? a);
                              } else he(a);
                              ne(!1);
                            }
                            const e = !ee;
                            (oe(e), e || ne(!1));
                          }}
                          className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm w-full sm:w-fit sm:min-w-[220px] justify-between transition-colors hover:border-gray-200 dark:hover:border-slate-600"
                        >
                          {[
                            <div className="flex items-center gap-2">
                              {[
                                <CalendarIcon
                                  size={20}
                                  className="text-gray-400"
                                />,
                                <span className="font-medium text-gray-700 dark:text-white capitalize">
                                  {p === w
                                    ? new Date(
                                        p + "-01T00:00:00",
                                      ).toLocaleDateString("es-ES", {
                                        month: "long",
                                        year: "numeric",
                                      })
                                    : `${new Date(
                                        p + "-01T00:00:00",
                                      ).toLocaleDateString("es-ES", {
                                        month: "short",
                                        year: "numeric",
                                      })} — ${new Date(
                                        w + "-01T00:00:00",
                                      ).toLocaleDateString("es-ES", {
                                        month: "short",
                                        year: "numeric",
                                      })}`}
                                </span>,
                              ]}
                            </div>,
                            <ChevronDownIcon
                              size={16}
                              className={`text-gray-400 transition-transform ${ee ? "rotate-180" : ""}`}
                            />,
                          ]}
                        </button>,
                        ee && (
                          <jsxRuntime.Fragment>
                            {[
                              <div
                                className="fixed inset-0 z-[9990]"
                                onClick={() => {
                                  (oe(!1), ne(!1));
                                }}
                              />,
                              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-lg z-[9991] overflow-hidden p-4 animate-in fade-in zoom-in-95 duration-100">
                                {[
                                  <div className="mb-3 pb-3 border-b border-gray-100 dark:border-slate-700">
                                    <p className="text-xs text-center text-gray-500 dark:text-slate-400">
                                      {be
                                        ? "Selecciona mes final"
                                        : "Selecciona mes inicial"}
                                    </p>
                                  </div>,
                                  <div className="flex items-center justify-between mb-4">
                                    {[
                                      <button
                                        onClick={() => {
                                          if (!Ee) {
                                            he((a) => a - 1);
                                            return;
                                          }
                                          const e = pt(V);
                                          e !== null && he(e);
                                        }}
                                        disabled={Ee && qt === null}
                                        className={`p-1 rounded-full text-gray-500 ${Ee && qt === null ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-slate-700"}`}
                                      >
                                        <ChevronLeftIcon size={20} />
                                      </button>,
                                      <span className="font-bold text-gray-900 dark:text-white">
                                        {V}
                                      </span>,
                                      <button
                                        onClick={() => {
                                          if (!Ee) {
                                            he((a) => a + 1);
                                            return;
                                          }
                                          const e = vt(V);
                                          e !== null && he(e);
                                        }}
                                        disabled={Ee && Jt === null}
                                        className={`p-1 rounded-full text-gray-500 ${Ee && Jt === null ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-slate-700"}`}
                                      >
                                        <ChevronRightIcon size={20} />
                                      </button>,
                                    ]}
                                  </div>,
                                  <div className="grid grid-cols-3 gap-2">
                                    {Array.from(
                                      {
                                        length: 12,
                                      },
                                      (e, a) => {
                                        const s = new Date(V, a),
                                          n = (a + 1)
                                            .toString()
                                            .padStart(2, "0"),
                                          r = `${V}-${n}`,
                                          i = p <= w ? p : w,
                                          d = p <= w ? w : p,
                                          g = r >= i && r <= d,
                                          b = r === i,
                                          c = r === d,
                                          x =
                                            new Date()
                                              .toISOString()
                                              .slice(0, 7) === r,
                                          v = D.size === 0 ? !0 : D.has(r);
                                        return (
                                          <button
                                            onClick={() => {
                                              if (!v) return;
                                              if (!be) {
                                                (P(r), Z(r), ne(!0));
                                                return;
                                              }
                                              const y = p <= r ? p : r,
                                                h = p <= r ? r : p;
                                              (P(y), Z(h), ne(!1), oe(!1));
                                            }}
                                            disabled={!v}
                                            className={`py-2 text-sm rounded-lg transition-colors capitalize ${b || c ? "bg-indigo-600 text-white shadow-sm" : g || x ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" : v ? "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700" : "text-gray-300 dark:text-slate-600 cursor-not-allowed"}`}
                                            key={a}
                                          >
                                            {s
                                              .toLocaleDateString("es-ES", {
                                                month: "short",
                                              })
                                              .replace(".", "")}
                                          </button>
                                        );
                                      },
                                    )}
                                  </div>,
                                ]}
                              </div>,
                            ]}
                          </jsxRuntime.Fragment>
                        ),
                      ]}
                    </div>,
                    <div className="relative">
                      {[
                        <button
                          onClick={() => es(!As)}
                          className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm w-full sm:w-fit sm:min-w-[200px] justify-between transition-colors hover:border-gray-200 dark:hover:border-slate-600"
                        >
                          {[
                            <div className="flex items-center gap-2">
                              {[
                                <UsersIcon
                                  size={20}
                                  className="text-gray-400"
                                />,
                                <span className="font-medium text-gray-700 dark:text-white">
                                  {ct === "all"
                                    ? "Todos los Ministerios"
                                    : fe.find((e) => e.id === ct)?.name ||
                                      "Seleccionar"}
                                </span>,
                              ]}
                            </div>,
                            <ChevronDownIcon
                              size={16}
                              className={`text-gray-400 transition-transform ${As ? "rotate-180" : ""}`}
                            />,
                          ]}
                        </button>,
                        As && (
                          <jsxRuntime.Fragment>
                            {[
                              <div
                                className="fixed inset-0 z-[9990]"
                                onClick={() => es(!1)}
                              />,
                              <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-lg z-[9991] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                                {[
                                  <button
                                    onClick={() => {
                                      (ma("all"), es(!1));
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${ct === "all" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-medium" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                                  >
                                    {"Todos los Ministerios"}
                                  </button>,
                                  fe.map((e) =>
                                    jsxRuntime.jsx(
                                      "button",
                                      {
                                        onClick: () => {
                                          (ma(e.id), es(!1));
                                        },
                                        className: `w-full text-left px-4 py-2.5 text-sm transition-colors ${ct === e.id ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-medium" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"}`,
                                        children: e.name,
                                      },
                                      e.id,
                                    ),
                                  ),
                                ]}
                              </div>,
                            ]}
                          </jsxRuntime.Fragment>
                        ),
                      ]}
                    </div>,
                    <div className="flex-1 relative w-full sm:min-w-[280px]">
                      {[
                        <SearchIcon
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />,
                        <input
                          type="text"
                          placeholder="Buscar por nombre o correo..."
                          value={na}
                          onChange={(e) => Za(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                        />,
                      ]}
                    </div>,
                  ]}
                </div>,
                <div className="space-y-4 max-w-2xl lg:max-w-none mx-auto">
                  {S ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700">
                      <div className="flex flex-col items-center gap-4">
                        {[
                          <div className="relative">
                            {[
                              <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30" />,
                              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />,
                            ]}
                          </div>,
                          <p className="animate-pulse">
                            {"Cargando estadísticas..."}
                          </p>,
                        ]}
                      </div>
                    </div>
                  ) : _e.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700">
                      {[
                        <UsersIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-slate-600" />,
                        <p>{"No hay servidores registrados."}</p>,
                      ]}
                    </div>
                  ) : (
                    _e
                      .filter((e) => {
                        if (ct === "all") return !0;
                        const a = Array.isArray(e.areas) ? e.areas : [],
                          s = fe.find((r) => r.id === ct),
                          n = s ? s.name : "";
                        return a.includes(ct) || (n && a.includes(n));
                      })
                      .filter((e) => {
                        const a = na.trim().toLowerCase();
                        if (!a) return !0;
                        const s = String(e.name || "").toLowerCase(),
                          n = String(e.email || "").toLowerCase();
                        return s.includes(a) || n.includes(a);
                      })
                      .sort((e, a) => {
                        const s = Number(e.strikes || 0),
                          n = Number(a.strikes || 0);
                        if (n !== s) return n - s;
                        const r = Number(e.presentCount || 0),
                          i = Number(a.presentCount || 0);
                        if (i !== r) return i - r;
                        const d = String(e.name || ""),
                          g = String(a.name || "");
                        return d.localeCompare(g, "es", {
                          sensitivity: "base",
                        });
                      })
                      .map((e) => {
                        const a = Array.isArray(e.areas)
                            ? e.areas
                                .map((d) => {
                                  const g = fe.find((b) => b.id === d);
                                  return g ? g.name : d;
                                })
                                .filter(Boolean)
                                .join(", ")
                            : "Sin ministerio",
                          s = Math.min((e.strikes / 10) * 100, 100),
                          n = e.status === "Inactivo" || e.isInactive,
                          r = n ? "Inactivo" : "Activo",
                          i = n
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
                        return jsxRuntime.jsxs(
                          "div",
                          {
                            className:
                              "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden",
                            children: [
                              <div className="hidden md:block p-5">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                  {[
                                    <div className="flex items-center gap-4 flex-1">
                                      {[
                                        <div className="relative">
                                          {[
                                            e.photoURL || e.photoThumbURL ? (
                                              <OptimizedImage
                                                src={
                                                  e.photoURL || e.photoThumbURL
                                                }
                                                alt={e.name}
                                                className="w-14 h-14 rounded-2xl ring-2 ring-white dark:ring-slate-700 shadow-sm"
                                                imgClassName="object-cover"
                                              />
                                            ) : (
                                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                                                {e.name.charAt(0).toUpperCase()}
                                              </div>
                                            ),
                                            <div
                                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${n ? "bg-red-500" : "bg-green-500"}`}
                                            />,
                                          ]}
                                        </div>,
                                        <div className="flex-1 min-w-0">
                                          {[
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                                              {e.name}
                                            </h3>,
                                            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium truncate">
                                              {a}
                                            </p>,
                                            <div className="flex items-center gap-2 mt-1">
                                              <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${i}`}
                                              >
                                                {r}
                                              </span>
                                            </div>,
                                          ]}
                                        </div>,
                                      ]}
                                    </div>,
                                    <div className="flex items-center gap-6">
                                      {[
                                        <div className="text-center">
                                          {[
                                            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-1">
                                              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                                {e.presentCount}
                                              </span>
                                            </div>,
                                            <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium">
                                              {"Asist."}
                                            </p>,
                                          ]}
                                        </div>,
                                        <div className="text-center">
                                          {[
                                            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-1">
                                              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                                {e.absentCount}
                                              </span>
                                            </div>,
                                            <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium">
                                              {"Faltas"}
                                            </p>,
                                          ]}
                                        </div>,
                                        <div className="text-center min-w-[80px]">
                                          {[
                                            <div className="relative w-full h-12 flex flex-col items-center justify-center">
                                              {[
                                                <span
                                                  className={`text-xl font-bold ${e.strikes >= 10 ? "text-red-600 dark:text-red-400" : e.strikes >= 5 ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-slate-300"}`}
                                                >
                                                  {e.strikes.toFixed(2)}
                                                </span>,
                                                <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                                                  <div
                                                    className={`h-full rounded-full transition-all ${e.strikes >= 10 ? "bg-red-500" : e.strikes >= 5 ? "bg-amber-500" : "bg-green-500"}`}
                                                    style={{
                                                      width: `${s}%`,
                                                    }}
                                                  />
                                                </div>,
                                              ]}
                                            </div>,
                                            <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-medium">
                                              {"Strikes"}
                                            </p>,
                                          ]}
                                        </div>,
                                        Lt && (
                                          <div className="flex items-center gap-2 pl-4 border-l border-gray-100 dark:border-slate-700">
                                            {[
                                              <button
                                                onClick={() => Rs(e.id)}
                                                className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
                                                title="Ver historial"
                                              >
                                                <HistoryIcon size={18} />
                                              </button>,
                                              <button
                                                onClick={() => Ea(e)}
                                                className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                                                title="Editar servidor"
                                              >
                                                <SquarePenIcon size={18} />
                                              </button>,
                                              <button
                                                onClick={() => Ma(e.id, e.name)}
                                                className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                title="Eliminar servidor"
                                              >
                                                <Trash2Icon size={18} />
                                              </button>,
                                              e.isInactive && (
                                                <button
                                                  onClick={() => Ca(e.id)}
                                                  className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                                  title="Reactivar servidor"
                                                >
                                                  <RotateCcwIcon size={18} />
                                                </button>
                                              ),
                                            ]}
                                          </div>
                                        ),
                                      ]}
                                    </div>,
                                  ]}
                                </div>
                              </div>,
                              <div className="md:hidden relative">
                                {[
                                  <div
                                    className={`absolute top-0 right-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl ${i}`}
                                  >
                                    {r}
                                  </div>,
                                  <div className="p-4 flex gap-4 pr-16">
                                    {[
                                      e.photoURL || e.photoThumbURL ? (
                                        <OptimizedImage
                                          src={e.photoURL || e.photoThumbURL}
                                          alt={e.name}
                                          className="w-14 h-14 rounded-xl shadow-sm object-cover"
                                        />
                                      ) : (
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                          {e.name.charAt(0).toUpperCase()}
                                        </div>
                                      ),
                                      <div className="flex-1 min-w-0 py-1">
                                        {[
                                          <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                                            {e.name}
                                          </h3>,
                                          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium truncate">
                                            {a}
                                          </p>,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                  <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-slate-700 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                                    {[
                                      <div className="py-3 px-2 flex flex-col items-center">
                                        {[
                                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                            {e.presentCount}
                                          </span>,
                                          <span className="text-[10px] uppercase text-gray-500 dark:text-slate-400 font-medium">
                                            {"Asist."}
                                          </span>,
                                        ]}
                                      </div>,
                                      <div className="py-3 px-2 flex flex-col items-center">
                                        {[
                                          <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                            {e.absentCount}
                                          </span>,
                                          <span className="text-[10px] uppercase text-gray-500 dark:text-slate-400 font-medium">
                                            {"Faltas"}
                                          </span>,
                                        ]}
                                      </div>,
                                      <div className="py-3 px-2 flex flex-col items-center justify-center">
                                        {[
                                          <span
                                            className={`text-lg font-bold ${e.strikes >= 10 ? "text-red-600 dark:text-red-400" : e.strikes >= 5 ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-slate-300"}`}
                                          >
                                            {e.strikes.toFixed(1)}
                                          </span>,
                                          <div className="w-16 h-1 bg-gray-200 dark:bg-slate-700 rounded-full my-1 overflow-hidden">
                                            <div
                                              className={`h-full rounded-full transition-all ${e.strikes >= 10 ? "bg-red-500" : e.strikes >= 5 ? "bg-amber-500" : "bg-green-500"}`}
                                              style={{
                                                width: `${s}%`,
                                              }}
                                            />
                                          </div>,
                                          <span className="text-[10px] uppercase text-gray-500 dark:text-slate-400 font-medium">
                                            {"Strikes"}
                                          </span>,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                  Lt && (
                                    <div className="flex justify-between p-2 gap-2 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                                      {[
                                        <button
                                          onClick={() => Rs(e.id)}
                                          className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
                                        >
                                          {[
                                            <HistoryIcon
                                              size={20}
                                              className="mb-0.5"
                                            />,
                                            <span className="textxs font-medium">
                                              {"Historial"}
                                            </span>,
                                          ]}
                                        </button>,
                                        <button
                                          onClick={() => Ea(e)}
                                          className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95 transition-all"
                                        >
                                          {[
                                            <SquarePenIcon
                                              size={20}
                                              className="mb-0.5"
                                            />,
                                            <span className="text-[10px] font-medium">
                                              {"Editar"}
                                            </span>,
                                          ]}
                                        </button>,
                                        <button
                                          onClick={() => Ma(e.id, e.name)}
                                          className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all"
                                        >
                                          {[
                                            <Trash2Icon
                                              size={20}
                                              className="mb-0.5"
                                            />,
                                            <span className="text-[10px] font-medium">
                                              {"Eliminar"}
                                            </span>,
                                          ]}
                                        </button>,
                                        e.isInactive && (
                                          <button
                                            onClick={() => Ca(e.id)}
                                            className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 active:scale-95 transition-all"
                                          >
                                            {[
                                              <RotateCcwIcon
                                                size={20}
                                                className="mb-0.5"
                                              />,
                                              <span className="text-[10px] font-medium">
                                                {"Reactivar"}
                                              </span>,
                                            ]}
                                          </button>
                                        ),
                                      ]}
                                    </div>
                                  ),
                                ]}
                              </div>,
                            ],
                          },
                          e.id,
                        );
                      })
                  )}
                </div>,
              ]}
            </div>
          ),
          m === "events" && (
            <jsxRuntime.Fragment>
              {[
                <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-3 sm:gap-4 overflow-visible">
                  {[
                    <div className="flex-1 relative">
                      {[
                        <SearchIcon
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />,
                        <input
                          type="text"
                          placeholder="Buscar por servidor, evento o ministerio..."
                          value={Nt}
                          onChange={(e) => Xa(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                        />,
                      ]}
                    </div>,
                    <div className="flex flex-wrap gap-3 items-center overflow-visible">
                      {[
                        <div className="relative">
                          {[
                            <button
                              onClick={() => $s(!Os)}
                              className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-white hover:border-indigo-400 dark:hover:border-indigo-500 transition-all min-w-[160px]"
                            >
                              {[
                                <div className="flex items-center gap-2">
                                  {[
                                    <div
                                      className={`w-2.5 h-2.5 rounded-full ${je === "all" ? "bg-gray-400" : je === "present" ? "bg-green-500" : je === "absent" ? "bg-red-500" : "bg-amber-500"}`}
                                    />,
                                    <span className="font-medium text-sm">
                                      {je === "all"
                                        ? "Todos"
                                        : je === "present"
                                          ? "Presentes"
                                          : je === "absent"
                                            ? "Ausentes"
                                            : "Pendientes"}
                                    </span>,
                                  ]}
                                </div>,
                                <ChevronDownIcon
                                  className={`text-gray-400 transition-transform duration-200 ${Os ? "rotate-180" : ""}`}
                                  size={16}
                                />,
                              ]}
                            </button>,
                            Os && (
                              <jsxRuntime.Fragment>
                                {[
                                  <div
                                    className="fixed inset-0 z-[9990]"
                                    onClick={() => $s(!1)}
                                  />,
                                  <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg z-[9991] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {[
                                      {
                                        value: "all",
                                        label: "Todos los Estados",
                                        color: "bg-gray-400",
                                      },
                                      {
                                        value: "present",
                                        label: "Presentes",
                                        color: "bg-green-500",
                                      },
                                      {
                                        value: "absent",
                                        label: "Ausentes",
                                        color: "bg-red-500",
                                      },
                                      {
                                        value: "pending",
                                        label: "Pendientes",
                                        color: "bg-amber-500",
                                      },
                                    ].map((e) =>
                                      jsxRuntime.jsxs(
                                        "button",
                                        {
                                          onClick: () => {
                                            (on(e.value), $s(!1));
                                          },
                                          className: `w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${je === e.value ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"}`,
                                          children: [
                                            <div
                                              className={`w-3 h-3 rounded-full ${e.color}`}
                                            />,
                                            <span className="font-medium">
                                              {e.label}
                                            </span>,
                                            je === e.value && (
                                              <CheckIcon
                                                size={16}
                                                className="ml-auto text-indigo-600 dark:text-indigo-400"
                                              />
                                            ),
                                          ],
                                        },
                                        e.value,
                                      ),
                                    )}
                                  </div>,
                                ]}
                              </jsxRuntime.Fragment>
                            ),
                          ]}
                        </div>,
                        <On
                          startDate={$e}
                          endDate={Re}
                          onStartDateChange={zt}
                          onEndDateChange={kt}
                          enabledDates={qs}
                          disabled={!0}
                        />,
                      ]}
                    </div>,
                  ]}
                </div>,
                <div className="space-y-3">
                  {S ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-slate-700">
                      <div className="flex flex-col items-center gap-4">
                        {[
                          <div className="relative">
                            {[
                              <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30" />,
                              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />,
                            ]}
                          </div>,
                          <p className="text-gray-500 dark:text-slate-400 animate-pulse">
                            {"Cargando datos..."}
                          </p>,
                        ]}
                      </div>
                    </div>
                  ) : Ra.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-slate-700">
                      {[
                        <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-slate-600" />,
                        <p className="text-gray-500 dark:text-slate-400">
                          {"No se encontraron registros."}
                        </p>,
                      ]}
                    </div>
                  ) : (
                    Ra.map((e, a) => {
                      const s = Je(e),
                        n =
                          s.label === "Presente"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : s.label === "Ausente"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
                        r = e.userPhoto || ln.get(e.userId);
                      return (
                        <div
                          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                          key={`${e.eventId}-${e.id}-${a}`}
                        >
                          {[
                            <div className="hidden md:block p-5">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {[
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {[
                                      <div className="relative flex-shrink-0">
                                        {r ? (
                                          <OptimizedImage
                                            src={r}
                                            alt={e.userName}
                                            className="w-12 h-12 rounded-xl ring-2 ring-white dark:ring-slate-700 shadow-sm"
                                            imgClassName="object-cover"
                                          />
                                        ) : (
                                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                            {e.userName.charAt(0).toUpperCase()}
                                          </div>
                                        )}
                                      </div>,
                                      <div className="flex-1 min-w-0">
                                        {[
                                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {e.userName}
                                          </h3>,
                                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                                            {[
                                              <CalendarIcon
                                                size={14}
                                                className="flex-shrink-0"
                                              />,
                                              <span className="truncate">
                                                {e.eventTitle}
                                              </span>,
                                              <span className="text-gray-300 dark:text-slate-600">
                                                {"•"}
                                              </span>,
                                              <span className="flex-shrink-0">
                                                {e.eventDate}
                                              </span>,
                                            ]}
                                          </div>,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                  <div className="flex-shrink-0">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                      {(() => {
                                        const i = normalizeRoleId(e.roleName);
                                        return i
                                          ? `${e.areaName} - ${i}`
                                          : e.areaName;
                                      })()}
                                    </span>
                                  </div>,
                                  <div className="flex items-center gap-4 flex-shrink-0">
                                    {[
                                      <div className="text-center min-w-[80px]">
                                        {[
                                          <div
                                            className={`flex items-center justify-center gap-1.5 ${e.checkInTime ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-slate-500"}`}
                                          >
                                            {[
                                              <ClockIcon size={16} />,
                                              <span className="font-semibold">
                                                {ze(e.checkInTime)}
                                              </span>,
                                            ]}
                                          </div>,
                                          <div className="flex items-center justify-center gap-1 mt-1">
                                            {[
                                              <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500">
                                                {"Entrada"}
                                              </p>,
                                              e.checkInPhoto ? (
                                                <button
                                                  onClick={() =>
                                                    Ze(e.checkInPhoto)
                                                  }
                                                  className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                  title="Ver foto de entrada"
                                                >
                                                  <ImageIcon size={14} />
                                                </button>
                                              ) : (
                                                <span
                                                  className="p-1 text-gray-300 dark:text-slate-600"
                                                  title="Sin foto"
                                                >
                                                  <ImageIcon size={14} />
                                                </span>
                                              ),
                                              e.checkInLocation && (
                                                <button
                                                  onClick={() =>
                                                    We({
                                                      title:
                                                        "Ubicación de entrada",
                                                      lat: e.checkInLocation
                                                        .lat,
                                                      lng: e.checkInLocation
                                                        .lng,
                                                      accuracyMeters:
                                                        e.checkInLocation
                                                          .accuracyMeters ??
                                                        void 0,
                                                      capturedAt:
                                                        e.checkInLocation
                                                          .capturedAt,
                                                    })
                                                  }
                                                  className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                  title="Ver ubicación de entrada"
                                                >
                                                  <MapPinIcon size={14} />
                                                </button>
                                              ),
                                            ]}
                                          </div>,
                                        ]}
                                      </div>,
                                      <div className="w-px h-10 bg-gray-200 dark:bg-slate-700" />,
                                      <div className="text-center min-w-[80px]">
                                        {[
                                          <div
                                            className={`flex items-center justify-center gap-1.5 ${e.checkOutTime ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"}`}
                                          >
                                            {[
                                              <ClockIcon size={16} />,
                                              <span className="font-semibold">
                                                {ze(e.checkOutTime)}
                                              </span>,
                                            ]}
                                          </div>,
                                          <div className="flex items-center justify-center gap-1 mt-1">
                                            {[
                                              <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500">
                                                {"Salida"}
                                              </p>,
                                              e.checkOutPhoto ? (
                                                <button
                                                  onClick={() =>
                                                    Ze(e.checkOutPhoto)
                                                  }
                                                  className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                  title="Ver foto de salida"
                                                >
                                                  <ImageIcon size={14} />
                                                </button>
                                              ) : (
                                                <span
                                                  className="p-1 text-gray-300 dark:text-slate-600"
                                                  title="Sin foto"
                                                >
                                                  <ImageIcon size={14} />
                                                </span>
                                              ),
                                              e.checkOutLocation && (
                                                <button
                                                  onClick={() =>
                                                    We({
                                                      title:
                                                        "Ubicación de salida",
                                                      lat: e.checkOutLocation
                                                        .lat,
                                                      lng: e.checkOutLocation
                                                        .lng,
                                                      accuracyMeters:
                                                        e.checkOutLocation
                                                          .accuracyMeters ??
                                                        void 0,
                                                      capturedAt:
                                                        e.checkOutLocation
                                                          .capturedAt,
                                                    })
                                                  }
                                                  className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                  title="Ver ubicación de salida"
                                                >
                                                  <MapPinIcon size={14} />
                                                </button>
                                              ),
                                            ]}
                                          </div>,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                  <div className="flex-shrink-0">
                                    <span
                                      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold ${s.label === "Presente" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : s.label === "Ausente" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"}`}
                                    >
                                      {[
                                        s.label === "Presente" && (
                                          <CheckIcon
                                            size={14}
                                            className="mr-1"
                                          />
                                        ),
                                        s.label === "Ausente" && (
                                          <XIcon size={14} className="mr-1" />
                                        ),
                                        s.label,
                                      ]}
                                    </span>
                                  </div>,
                                ]}
                              </div>
                            </div>,
                            <div className="md:hidden relative">
                              {[
                                <div
                                  className={`absolute top-0 right-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl ${n}`}
                                >
                                  {s.label}
                                </div>,
                                <div className="p-4 flex gap-4 pr-16">
                                  {[
                                    r ? (
                                      <OptimizedImage
                                        src={r}
                                        alt={e.userName}
                                        className="w-14 h-14 rounded-xl shadow-sm object-cover"
                                      />
                                    ) : (
                                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                        {e.userName.charAt(0).toUpperCase()}
                                      </div>
                                    ),
                                    <div className="flex-1 min-w-0 py-1">
                                      {[
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                                          {e.userName}
                                        </h3>,
                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
                                          {[
                                            <CalendarIcon
                                              size={12}
                                              className="flex-shrink-0"
                                            />,
                                            <span className="truncate">
                                              {e.eventTitle}
                                            </span>,
                                            <span className="text-gray-300 dark:text-gray-600">
                                              {"•"}
                                            </span>,
                                            <span className="flex-shrink-0">
                                              {e.eventDate}
                                            </span>,
                                          ]}
                                        </div>,
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 truncate">
                                          {(() => {
                                            const i = normalizeRoleId(
                                              e.roleName,
                                            );
                                            return i
                                              ? `${e.areaName} - ${i}`
                                              : e.areaName;
                                          })()}
                                        </p>,
                                      ]}
                                    </div>,
                                  ]}
                                </div>,
                                <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-slate-700 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                                  {[
                                    <div className="p-3 flex flex-col items-center justify-center gap-1">
                                      {[
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                                          {"ENTRADA"}
                                        </span>,
                                        <span
                                          className={`text-sm font-bold ${e.checkInTime ? "text-green-600 dark:text-green-400" : "text-gray-300 dark:text-slate-600"}`}
                                        >
                                          {ze(e.checkInTime) || "--:--"}
                                        </span>,
                                        <div className="flex gap-2 mt-1">
                                          {[
                                            e.checkInPhoto && (
                                              <button
                                                onClick={() =>
                                                  Ze(e.checkInPhoto)
                                                }
                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                              >
                                                <ImageIcon size={12} />
                                              </button>
                                            ),
                                            e.checkInLocation && (
                                              <button
                                                onClick={() =>
                                                  We({
                                                    title:
                                                      "Ubicación de entrada",
                                                    lat: e.checkInLocation.lat,
                                                    lng: e.checkInLocation.lng,
                                                    accuracyMeters:
                                                      e.checkInLocation
                                                        .accuracyMeters ??
                                                      void 0,
                                                    capturedAt:
                                                      e.checkInLocation
                                                        .capturedAt,
                                                  })
                                                }
                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                              >
                                                <MapPinIcon size={12} />
                                              </button>
                                            ),
                                          ]}
                                        </div>,
                                      ]}
                                    </div>,
                                    <div className="p-3 flex flex-col items-center justify-center gap-1">
                                      {[
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                                          {"SALIDA"}
                                        </span>,
                                        <span
                                          className={`text-sm font-bold ${e.checkOutTime ? "text-blue-600 dark:text-blue-400" : "text-gray-300 dark:text-slate-600"}`}
                                        >
                                          {ze(e.checkOutTime) || "--:--"}
                                        </span>,
                                        <div className="flex gap-2 mt-1">
                                          {[
                                            e.checkOutPhoto && (
                                              <button
                                                onClick={() =>
                                                  Ze(e.checkOutPhoto)
                                                }
                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                              >
                                                <ImageIcon size={12} />
                                              </button>
                                            ),
                                            e.checkOutLocation && (
                                              <button
                                                onClick={() =>
                                                  We({
                                                    title:
                                                      "Ubicación de salida",
                                                    lat: e.checkOutLocation.lat,
                                                    lng: e.checkOutLocation.lng,
                                                    accuracyMeters:
                                                      e.checkOutLocation
                                                        .accuracyMeters ??
                                                      void 0,
                                                    capturedAt:
                                                      e.checkOutLocation
                                                        .capturedAt,
                                                  })
                                                }
                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                              >
                                                <MapPinIcon size={12} />
                                              </button>
                                            ),
                                          ]}
                                        </div>,
                                      ]}
                                    </div>,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                          ]}
                        </div>
                      );
                    })
                  )}
                </div>,
              ]}
            </jsxRuntime.Fragment>
          ),
          m === "reports" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {[
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 sm:p-6 hover:shadow-lg transition-all group">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {[
                        <div className="p-3 rounded-xl bg-gray-800 dark:bg-gray-900 text-white group-hover:scale-110 transition-transform">
                          <ClipboardListIcon size={24} />
                        </div>,
                        <div className="flex-1">
                          {[
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {"Reporte Semanal"}
                            </h3>,
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                              {
                                "Check-in y Check-out por ministerio con marcas rojas en ausencias."
                              }
                            </p>,
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                              {[
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Año"}
                                    </label>,
                                    <SelectPicker
                                      value={ke.toString()}
                                      onChange={(e) => {
                                        const a = Number(e);
                                        if ((Fs(a), D.size > 0)) {
                                          const s = `${String(a).padStart(4, "0")}-`,
                                            n = Array.from(D)
                                              .filter((r) => r.startsWith(s))
                                              .map((r) => Number(r.slice(5, 7)))
                                              .filter(
                                                (r) =>
                                                  Number.isFinite(r) &&
                                                  r >= 1 &&
                                                  r <= 12,
                                              )
                                              .sort((r, i) => r - i);
                                          n.length > 0 && as(n[n.length - 1]);
                                        }
                                      }}
                                      options={Ws.map((e) => ({
                                        value: e.toString(),
                                        label: e.toString(),
                                      }))}
                                      placeholder="Año"
                                    />,
                                  ]}
                                </div>,
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Mes"}
                                    </label>,
                                    <SelectPicker
                                      value={Le.toString()}
                                      onChange={(e) => {
                                        as(Number(e));
                                      }}
                                      options={St.map((e) => ({
                                        value: e.toString(),
                                        label: ls[e - 1] || `Mes ${e}`,
                                      }))}
                                      placeholder="Mes"
                                    />,
                                  ]}
                                </div>,
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Semana"}
                                    </label>,
                                    <SelectPicker
                                      value={Ye.toString()}
                                      onChange={(e) => xa(Number(e))}
                                      options={Ct.map((e) => ({
                                        value: e.weekNum.toString(),
                                        label: e.label,
                                      }))}
                                      placeholder="Semana"
                                    />,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                            <LoadingButton
                              onClick={vn}
                              loading={Is}
                              className="flex items-center gap-2 px-4 py-3 sm:py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium transition-colors w-full sm:w-auto justify-center disabled:opacity-60"
                            >
                              {Is ? (
                                "Generando..."
                              ) : (
                                <jsxRuntime.Fragment>
                                  {[
                                    <DownloadIcon size={16} />,
                                    "Descargar PDF",
                                  ]}
                                </jsxRuntime.Fragment>
                              )}
                            </LoadingButton>,
                          ]}
                        </div>,
                      ]}
                    </div>
                  </div>,
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 sm:p-6 hover:shadow-lg transition-all group">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {[
                        <div className="p-3 rounded-xl bg-gray-800 dark:bg-gray-900 text-white group-hover:scale-110 transition-transform">
                          <ClipboardListIcon size={24} />
                        </div>,
                        <div className="flex-1">
                          {[
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {"Reporte Mensual"}
                            </h3>,
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                              {
                                "Check-in y Check-out por ministerio durante todo el mes."
                              }
                            </p>,
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {[
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Año"}
                                    </label>,
                                    <SelectPicker
                                      value={Se.toString()}
                                      onChange={(e) => {
                                        const a = Number(e);
                                        if ((Ps(a), D.size > 0)) {
                                          const s = `${String(a).padStart(4, "0")}-`,
                                            n = Array.from(D)
                                              .filter((r) => r.startsWith(s))
                                              .map((r) => Number(r.slice(5, 7)))
                                              .filter(
                                                (r) =>
                                                  Number.isFinite(r) &&
                                                  r >= 1 &&
                                                  r <= 12,
                                              )
                                              .sort((r, i) => r - i);
                                          n.length > 0 && ns(n[n.length - 1]);
                                        }
                                      }}
                                      options={Ys.map((e) => ({
                                        value: e.toString(),
                                        label: e.toString(),
                                      }))}
                                      placeholder="Año"
                                    />,
                                  ]}
                                </div>,
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Mes"}
                                    </label>,
                                    <SelectPicker
                                      value={Be.toString()}
                                      onChange={(e) => ns(Number(e))}
                                      options={Tt.map((e) => ({
                                        value: e.toString(),
                                        label: ls[e - 1] || `Mes ${e}`,
                                      }))}
                                      placeholder="Mes"
                                    />,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                            <LoadingButton
                              onClick={yn}
                              loading={Cs}
                              className="flex items-center gap-2 px-4 py-3 sm:py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium transition-colors w-full sm:w-auto justify-center disabled:opacity-60"
                            >
                              {Cs ? (
                                "Generando..."
                              ) : (
                                <jsxRuntime.Fragment>
                                  {[
                                    <DownloadIcon size={16} />,
                                    "Descargar PDF",
                                  ]}
                                </jsxRuntime.Fragment>
                              )}
                            </LoadingButton>,
                          ]}
                        </div>,
                      ]}
                    </div>
                  </div>,
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 sm:p-6 hover:shadow-lg transition-all group">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {[
                        <div className="p-3 rounded-xl bg-gray-800 dark:bg-gray-900 text-white group-hover:scale-110 transition-transform">
                          <ClipboardListIcon size={24} />
                        </div>,
                        <div className="flex-1">
                          {[
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {"Reporte Mensual por Servidor"}
                            </h3>,
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                              {
                                "Descarga el historial mensual de un servidor específico."
                              }
                            </p>,
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                              {[
                                <div className="sm:col-span-2">
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Servidor"}
                                    </label>,
                                    <button
                                      onClick={() => {
                                        (ba(""), Us(!0));
                                      }}
                                      className="w-full text-left px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-white flex items-center justify-between hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                                    >
                                      {[
                                        <span className="truncate">
                                          {tt
                                            ? _e.find(
                                                (e) => String(e.id) === tt,
                                              )?.name || "Servidor seleccionado"
                                            : "Seleccionar servidor"}
                                        </span>,
                                        <ChevronDownIcon
                                          size={16}
                                          className="text-gray-400 flex-shrink-0 ml-2"
                                        />,
                                      ]}
                                    </button>,
                                  ]}
                                </div>,
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Año"}
                                    </label>,
                                    <SelectPicker
                                      value={Te.toString()}
                                      onChange={(e) => {
                                        const a = Number(e);
                                        if ((_s(a), D.size > 0)) {
                                          const s = `${String(a).padStart(4, "0")}-`,
                                            n = Array.from(D)
                                              .filter((r) => r.startsWith(s))
                                              .map((r) => Number(r.slice(5, 7)))
                                              .filter(
                                                (r) =>
                                                  Number.isFinite(r) &&
                                                  r >= 1 &&
                                                  r <= 12,
                                              )
                                              .sort((r, i) => r - i);
                                          n.length > 0 && rs(n[n.length - 1]);
                                        }
                                      }}
                                      options={Bs.map((e) => ({
                                        value: e.toString(),
                                        label: e.toString(),
                                      }))}
                                      placeholder="Año"
                                    />,
                                  ]}
                                </div>,
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Mes"}
                                    </label>,
                                    <SelectPicker
                                      value={Ve.toString()}
                                      onChange={(e) => rs(Number(e))}
                                      options={Dt.map((e) => ({
                                        value: e.toString(),
                                        label: ls[e - 1] || `Mes ${e}`,
                                      }))}
                                      placeholder="Mes"
                                    />,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                            <LoadingButton
                              onClick={kn}
                              loading={Es}
                              className="flex items-center gap-2 px-4 py-3 sm:py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium transition-colors w-full sm:w-auto justify-center disabled:opacity-60"
                            >
                              {Es ? (
                                "Generando..."
                              ) : (
                                <jsxRuntime.Fragment>
                                  {[
                                    <DownloadIcon size={16} />,
                                    "Descargar PDF",
                                  ]}
                                </jsxRuntime.Fragment>
                              )}
                            </LoadingButton>,
                          ]}
                        </div>,
                      ]}
                    </div>
                  </div>,
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 sm:p-6 hover:shadow-lg transition-all group">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {[
                        <div className="p-3 rounded-xl bg-gray-800 dark:bg-gray-900 text-white group-hover:scale-110 transition-transform">
                          <ClipboardListIcon size={24} />
                        </div>,
                        <div className="flex-1">
                          {[
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {"Reporte Mensual por Ministerio"}
                            </h3>,
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                              {
                                "Descarga el historial mensual de un ministerio específico."
                              }
                            </p>,
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                              {[
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Ministerio"}
                                    </label>,
                                    <SelectPicker
                                      value={Ge}
                                      onChange={(e) => is(e)}
                                      options={(_()
                                        ? fe.filter((e) =>
                                            assignmentManagedAreas(re).includes(
                                              e.id,
                                            ),
                                          )
                                        : fe
                                      )
                                        .slice()
                                        .sort((e, a) =>
                                          String(e.name || "").localeCompare(
                                            String(a.name || ""),
                                          ),
                                        )
                                        .map((e) => ({
                                          value: String(e.id),
                                          label: String(
                                            e.name || "(Sin nombre)",
                                          ),
                                        }))}
                                      placeholder="Ministerio"
                                    />,
                                  ]}
                                </div>,
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Año"}
                                    </label>,
                                    <SelectPicker
                                      value={De.toString()}
                                      onChange={(e) => {
                                        const a = Number(e);
                                        if ((Hs(a), D.size > 0)) {
                                          const s = `${String(a).padStart(4, "0")}-`,
                                            n = Array.from(D)
                                              .filter((r) => r.startsWith(s))
                                              .map((r) => Number(r.slice(5, 7)))
                                              .filter(
                                                (r) =>
                                                  Number.isFinite(r) &&
                                                  r >= 1 &&
                                                  r <= 12,
                                              )
                                              .sort((r, i) => r - i);
                                          n.length > 0 && os(n[n.length - 1]);
                                        }
                                      }}
                                      options={Vs.map((e) => ({
                                        value: e.toString(),
                                        label: e.toString(),
                                      }))}
                                      placeholder="Año"
                                    />,
                                  ]}
                                </div>,
                                <div>
                                  {[
                                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                                      {"Mes"}
                                    </label>,
                                    <SelectPicker
                                      value={qe.toString()}
                                      onChange={(e) => os(Number(e))}
                                      options={It.map((e) => ({
                                        value: e.toString(),
                                        label: ls[e - 1] || `Mes ${e}`,
                                      }))}
                                      placeholder="Mes"
                                    />,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                            <LoadingButton
                              onClick={Nn}
                              loading={Ms}
                              className="flex items-center gap-2 px-4 py-3 sm:py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium transition-colors w-full sm:w-auto justify-center disabled:opacity-60"
                            >
                              {Ms ? (
                                "Generando..."
                              ) : (
                                <jsxRuntime.Fragment>
                                  {[
                                    <DownloadIcon size={16} />,
                                    "Descargar PDF",
                                  ]}
                                </jsxRuntime.Fragment>
                              )}
                            </LoadingButton>,
                          ]}
                        </div>,
                      ]}
                    </div>
                  </div>,
                ]}
              </div>
            </div>
          ),
          <Modal
            isOpen={!!et}
            onClose={Js}
            title="Editar Servidor"
            maxWidth="max-w-sm"
          >
            {et && (
              <form className="space-y-4" onSubmit={gn}>
                {[
                  <div>
                    {[
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                        {"Estado"}
                      </label>,
                      <div className="relative">
                        {[
                          <button
                            type="button"
                            onClick={() => ss(!Ls)}
                            className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-slate-600 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 bg-white cursor-pointer text-left"
                          >
                            {[
                              <span
                                className={`${dt.status === "Activo" ? "text-green-600" : "text-red-600"} font-medium`}
                              >
                                {dt.status}
                              </span>,
                              <ChevronDownIcon
                                size={18}
                                className={`text-gray-400 transition-transform ${Ls ? "rotate-180" : ""}`}
                              />,
                            ]}
                          </button>,
                          Ls && (
                            <jsxRuntime.Fragment>
                              {[
                                <div
                                  className="fixed inset-0 z-[9990]"
                                  onClick={() => ss(!1)}
                                />,
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 shadow-lg z-[9991] overflow-hidden">
                                  {[
                                    <button
                                      type="button"
                                      onClick={() => {
                                        (ts((e) => ({
                                          ...e,
                                          status: "Activo",
                                        })),
                                          ss(!1));
                                      }}
                                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${dt.status === "Activo" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                                    >
                                      {[
                                        <span className="w-2 h-2 rounded-full bg-green-500" />,
                                        "Activo",
                                      ]}
                                    </button>,
                                    <button
                                      type="button"
                                      onClick={() => {
                                        (ts((e) => ({
                                          ...e,
                                          status: "Inactivo",
                                        })),
                                          ss(!1));
                                      }}
                                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${dt.status === "Inactivo" ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                                    >
                                      {[
                                        <span className="w-2 h-2 rounded-full bg-red-500" />,
                                        "Inactivo",
                                      ]}
                                    </button>,
                                  ]}
                                </div>,
                              ]}
                            </jsxRuntime.Fragment>
                          ),
                        ]}
                      </div>,
                    ]}
                  </div>,
                  <div className="flex justify-end gap-3 pt-2">
                    {[
                      <button
                        type="button"
                        onClick={Js}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        {"Cancelar"}
                      </button>,
                      <button
                        type="submit"
                        disabled={ha}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2"
                      >
                        {ha ? (
                          <jsxRuntime.Fragment>
                            {[
                              <LoaderCircleIcon
                                size={16}
                                className="animate-spin"
                              />,
                              "Guardando...",
                            ]}
                          </jsxRuntime.Fragment>
                        ) : (
                          "Guardar cambios"
                        )}
                      </button>,
                    ]}
                  </div>,
                ]}
              </form>
            )}
          </Modal>,
          <Modal
            isOpen={!!Ft}
            onClose={() => {
              (Rs(null), zs("all"), Pt("all"));
            }}
            title={za ? `Historial de ${za.name}` : "Historial de Asistencia"}
            maxWidth="max-w-4xl"
          >
            {[
              <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                {[
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    {"Filtrar:"}
                  </span>,
                  <SelectPicker
                    value={mt}
                    onChange={(e) => {
                      (zs(e), Pt("all"));
                    }}
                    options={[
                      {
                        value: "all",
                        label: "Todos los meses",
                      },
                      ...wn.map((e) => {
                        const [a, s] = e.split("-"),
                          n = new Date(parseInt(a), parseInt(s) - 1, 1);
                        return {
                          value: e,
                          label: n.toLocaleDateString("es-ES", {
                            month: "long",
                            year: "numeric",
                          }),
                        };
                      }),
                    ]}
                  />,
                  <SelectPicker
                    value={ut}
                    onChange={(e) => Pt(e)}
                    options={[
                      {
                        value: "all",
                        label: "Todas las semanas",
                      },
                      ...Xs.map((e) => ({
                        value: String(e),
                        label: `Semana ${e}`,
                      })),
                    ]}
                  />,
                  (mt !== "all" || ut !== "all") && (
                    <button
                      onClick={() => {
                        (zs("all"), Pt("all"));
                      }}
                      className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                    >
                      {[<XIcon size={14} />, "Limpiar"]}
                    </button>
                  ),
                ]}
              </div>,
              _t.length === 0 ? (
                <div className="text-center py-8">
                  {[
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                      <CalendarIcon size={28} className="text-gray-400" />
                    </div>,
                    <p className="text-gray-500 dark:text-slate-400">
                      {"Aún no hay registros de asistencia para este servidor."}
                    </p>,
                  ]}
                </div>
              ) : gs.length === 0 ? (
                <div className="text-center py-8">
                  {[
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                      <CalendarIcon size={28} className="text-gray-400" />
                    </div>,
                    <p className="text-gray-500 dark:text-slate-400">
                      {"No hay registros para los filtros seleccionados."}
                    </p>,
                  ]}
                </div>
              ) : (
                <div className="space-y-5">
                  {[
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {[
                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-900/10 rounded-xl p-3 md:p-4 border border-green-200/50 dark:border-green-800/50">
                          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                            {[
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
                                <CheckIcon
                                  size={16}
                                  className="text-white md:w-5 md:h-5"
                                />
                              </div>,
                              <div className="min-w-0">
                                {[
                                  <p className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400 leading-none mb-0.5 md:mb-0">
                                    {Zs.present}
                                  </p>,
                                  <p className="text-[10px] md:text-xs text-green-600/70 dark:text-green-500 font-medium truncate">
                                    {"Asistencias"}
                                  </p>,
                                ]}
                              </div>,
                            ]}
                          </div>
                        </div>,
                        <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-900/10 rounded-xl p-3 md:p-4 border border-red-200/50 dark:border-red-800/50">
                          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                            {[
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
                                <XIcon
                                  size={16}
                                  className="text-white md:w-5 md:h-5"
                                />
                              </div>,
                              <div className="min-w-0">
                                {[
                                  <p className="text-xl md:text-2xl font-bold text-red-700 dark:text-red-400 leading-none mb-0.5 md:mb-0">
                                    {Zs.absent}
                                  </p>,
                                  <p className="text-[10px] md:text-xs text-red-600/70 dark:text-red-500 font-medium truncate">
                                    {"Faltas"}
                                  </p>,
                                ]}
                              </div>,
                            ]}
                          </div>
                        </div>,
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-900/10 rounded-xl p-3 md:p-4 border border-amber-200/50 dark:border-amber-800/50">
                          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                            {[
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                                <CalendarIcon
                                  size={16}
                                  className="text-white md:w-5 md:h-5"
                                />
                              </div>,
                              <div className="min-w-0">
                                {[
                                  <p className="text-xl md:text-2xl font-bold text-amber-700 dark:text-amber-400 leading-none mb-0.5 md:mb-0">
                                    {Zs.pending}
                                  </p>,
                                  <p className="text-[10px] md:text-xs text-amber-600/70 dark:text-amber-500 font-medium truncate">
                                    {"Pendientes"}
                                  </p>,
                                ]}
                              </div>,
                            ]}
                          </div>
                        </div>,
                      ]}
                    </div>,
                    <div className="hidden md:block rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                      <div className="max-h-[50vh] overflow-y-auto">
                        <table className="w-full text-left text-sm">
                          {[
                            <thead className="sticky top-0">
                              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                                {[
                                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                                    {"Fecha"}
                                  </th>,
                                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                                    {"Evento"}
                                  </th>,
                                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                                    {"Rol"}
                                  </th>,
                                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                                    {"Entrada"}
                                  </th>,
                                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                                    {"Salida"}
                                  </th>,
                                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                                    {"Estado"}
                                  </th>,
                                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300 text-xs uppercase tracking-wider text-center">
                                    {"Acciones"}
                                  </th>,
                                ]}
                              </tr>
                            </thead>,
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-800/50">
                              {gs.map((e) => {
                                const a = Je(e);
                                return (
                                  <tr
                                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                                    key={`${e.eventId}-${e.id}`}
                                  >
                                    {[
                                      <td className="px-4 py-3">
                                        <span className="text-gray-900 dark:text-white font-medium">
                                          {e.eventDate || "-"}
                                        </span>
                                      </td>,
                                      <td className="px-4 py-3">
                                        <span className="font-medium text-gray-800 dark:text-white">
                                          {e.eventTitle}
                                        </span>
                                      </td>,
                                      <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                                        {(() => {
                                          const s = normalizeRoleId(e.roleName);
                                          return s
                                            ? `${e.areaName} - ${s}`
                                            : e.areaName;
                                        })()}
                                      </td>,
                                      <td className="px-4 py-3">
                                        {e.checkInTime ? (
                                          (() => {
                                            const s = rt(
                                              e.checkInTime,
                                              e.eventDate,
                                              e.serviceTime,
                                              e.eventTime,
                                            );
                                            return (
                                              <div className="flex items-center gap-2">
                                                {[
                                                  s ? (
                                                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                                      {[
                                                        <TriangleAlertIcon
                                                          size={14}
                                                        />,
                                                        ze(e.checkInTime),
                                                      ]}
                                                    </span>
                                                  ) : (
                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                                      {[
                                                        <CircleCheckBigIcon
                                                          size={14}
                                                        />,
                                                        ze(e.checkInTime),
                                                      ]}
                                                    </span>
                                                  ),
                                                  e.checkInPhoto && (
                                                    <button
                                                      onClick={() =>
                                                        Ze(e.checkInPhoto)
                                                      }
                                                      className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                                      title="Ver foto de entrada"
                                                    >
                                                      <ImageIcon size={14} />
                                                    </button>
                                                  ),
                                                  e.checkInLocation && (
                                                    <button
                                                      onClick={() =>
                                                        We({
                                                          title:
                                                            "Ubicación de entrada",
                                                          lat: e.checkInLocation
                                                            .lat,
                                                          lng: e.checkInLocation
                                                            .lng,
                                                          accuracyMeters:
                                                            e.checkInLocation
                                                              .accuracyMeters ??
                                                            void 0,
                                                          capturedAt:
                                                            e.checkInLocation
                                                              .capturedAt,
                                                        })
                                                      }
                                                      className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                                      title="Ver ubicación de entrada"
                                                    >
                                                      <MapPinIcon size={14} />
                                                    </button>
                                                  ),
                                                ]}
                                              </div>
                                            );
                                          })()
                                        ) : e.checkOutTime ? (
                                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                            {[
                                              <TriangleAlertIcon size={14} />,
                                              "Sin entrada",
                                            ]}
                                          </span>
                                        ) : ws(
                                            e.eventDate,
                                            e.endTime,
                                            e.eventTime,
                                            e.eventStatus,
                                          ) ? (
                                          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                                            {[
                                              <CircleXIcon size={14} />,
                                              "Falta",
                                            ]}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 dark:text-slate-500">
                                            {"-"}
                                          </span>
                                        )}
                                      </td>,
                                      <td className="px-4 py-3">
                                        {e.checkOutTime ? (
                                          (() => {
                                            const s = bt(
                                              e.checkOutTime,
                                              e.eventDate,
                                              e.endTime,
                                              e.eventTime,
                                              e.serviceTime,
                                            );
                                            return (
                                              <div className="flex items-center gap-2">
                                                {[
                                                  s ? (
                                                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                                      {[
                                                        <TriangleAlertIcon
                                                          size={14}
                                                        />,
                                                        ze(e.checkOutTime),
                                                      ]}
                                                    </span>
                                                  ) : (
                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                                      {[
                                                        <CircleCheckBigIcon
                                                          size={14}
                                                        />,
                                                        ze(e.checkOutTime),
                                                      ]}
                                                    </span>
                                                  ),
                                                  e.checkOutPhoto && (
                                                    <button
                                                      onClick={() =>
                                                        Ze(e.checkOutPhoto)
                                                      }
                                                      className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                                      title="Ver foto de salida"
                                                    >
                                                      <ImageIcon size={14} />
                                                    </button>
                                                  ),
                                                  e.checkOutLocation && (
                                                    <button
                                                      onClick={() =>
                                                        We({
                                                          title:
                                                            "Ubicación de salida",
                                                          lat: e
                                                            .checkOutLocation
                                                            .lat,
                                                          lng: e
                                                            .checkOutLocation
                                                            .lng,
                                                          accuracyMeters:
                                                            e.checkOutLocation
                                                              .accuracyMeters ??
                                                            void 0,
                                                          capturedAt:
                                                            e.checkOutLocation
                                                              .capturedAt,
                                                        })
                                                      }
                                                      className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                                      title="Ver ubicación de salida"
                                                    >
                                                      <MapPinIcon size={14} />
                                                    </button>
                                                  ),
                                                ]}
                                              </div>
                                            );
                                          })()
                                        ) : e.checkInTime ? (
                                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                            {[
                                              <TriangleAlertIcon size={14} />,
                                              "Sin salida",
                                            ]}
                                          </span>
                                        ) : ws(
                                            e.eventDate,
                                            e.endTime,
                                            e.eventTime,
                                            e.eventStatus,
                                          ) ? (
                                          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                                            {[
                                              <CircleXIcon size={14} />,
                                              "Falta",
                                            ]}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 dark:text-slate-500">
                                            {"-"}
                                          </span>
                                        )}
                                      </td>,
                                      <td className="px-4 py-3">
                                        <span
                                          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${a.label === "Presente" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : a.label === "Ausente" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"}`}
                                        >
                                          {a.label}
                                        </span>
                                      </td>,
                                      <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                          {[
                                            <button
                                              type="button"
                                              onClick={() => Aa(e)}
                                              className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
                                              title="Editar registro"
                                              disabled={!me}
                                            >
                                              <SquarePenIcon size={16} />
                                            </button>,
                                            a.label === "Ausente" ||
                                            a.label === "Pendiente" ? (
                                              <button
                                                type="button"
                                                onClick={() => fn(e)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 dark:hover:text-green-400 transition-colors"
                                                title="Marcar como presente"
                                                disabled={!me}
                                              >
                                                <CheckIcon size={16} />
                                              </button>
                                            ) : a.label === "Sin entrada" ||
                                              a.label === "Sin salida" ? (
                                              <button
                                                type="button"
                                                onClick={() => bn(e)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 dark:hover:text-green-400 transition-colors"
                                                title="Completar asistencia"
                                                disabled={!me}
                                              >
                                                <CheckIcon size={16} />
                                              </button>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => pn(e)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                                                title="Quitar asistencia"
                                                disabled={!me}
                                              >
                                                <XIcon size={16} />
                                              </button>
                                            ),
                                          ]}
                                        </div>
                                      </td>,
                                    ]}
                                  </tr>
                                );
                              })}
                            </tbody>,
                          ]}
                        </table>
                      </div>
                    </div>,
                    <div className="md:hidden space-y-4">
                      {gs.map((e) => {
                        const a = Je(e);
                        return (
                          <div
                            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 relative overflow-hidden"
                            key={`${e.eventId}-${e.id}`}
                          >
                            {[
                              <div
                                className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg ${a.label === "Presente" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : a.label === "Ausente" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"}`}
                              >
                                {a.label}
                              </div>,
                              <div className="pt-2">
                                {[
                                  <div className="flex items-start justify-between mb-1 pr-16 bg-transparent">
                                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                      {e.eventDate}
                                    </span>
                                  </div>,
                                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                    {e.eventTitle}
                                  </h3>,
                                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                                    {(() => {
                                      const s = normalizeRoleId(e.roleName);
                                      return s
                                        ? `${e.areaName} - ${s}`
                                        : e.areaName;
                                    })()}
                                  </p>,
                                ]}
                              </div>,
                              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                                {[
                                  <div className="space-y-1">
                                    {[
                                      <span className="text-xs text-gray-500 dark:text-slate-400 block font-medium">
                                        {"ENTRADA"}
                                      </span>,
                                      <div className="flex items-center gap-2">
                                        {[
                                          e.checkInTime ? (
                                            <span
                                              className={`text-sm font-bold ${rt(e.checkInTime, e.eventDate, e.serviceTime, e.eventTime) ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}`}
                                            >
                                              {ze(e.checkInTime)}
                                            </span>
                                          ) : (
                                            <span className="text-sm font-bold text-gray-300 dark:text-slate-600">
                                              {"--:--"}
                                            </span>
                                          ),
                                          <div className="flex -space-x-1">
                                            {[
                                              e.checkInPhoto && (
                                                <button
                                                  onClick={() =>
                                                    Ze(e.checkInPhoto)
                                                  }
                                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-transparent hover:border-indigo-200 transition-colors"
                                                >
                                                  <ImageIcon size={12} />
                                                </button>
                                              ),
                                              e.checkInLocation && (
                                                <button
                                                  onClick={() =>
                                                    We({
                                                      title:
                                                        "Ubicación de entrada",
                                                      lat: e.checkInLocation
                                                        .lat,
                                                      lng: e.checkInLocation
                                                        .lng,
                                                      accuracyMeters:
                                                        e.checkInLocation
                                                          .accuracyMeters ??
                                                        void 0,
                                                      capturedAt:
                                                        e.checkInLocation
                                                          .capturedAt,
                                                    })
                                                  }
                                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-transparent hover:border-emerald-200 transition-colors"
                                                >
                                                  <MapPinIcon size={12} />
                                                </button>
                                              ),
                                            ]}
                                          </div>,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                  <div className="space-y-1 relative">
                                    {[
                                      <span className="text-xs text-gray-500 dark:text-slate-400 block font-medium">
                                        {"SALIDA"}
                                      </span>,
                                      <div className="flex items-center gap-2">
                                        {[
                                          e.checkOutTime ? (
                                            <span
                                              className={`text-sm font-bold ${bt(e.checkOutTime, e.eventDate, e.endTime, e.eventTime, e.serviceTime) ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}`}
                                            >
                                              {ze(e.checkOutTime)}
                                            </span>
                                          ) : (
                                            <span className="text-sm font-bold text-gray-300 dark:text-slate-600">
                                              {"--:--"}
                                            </span>
                                          ),
                                          <div className="flex -space-x-1">
                                            {[
                                              e.checkOutPhoto && (
                                                <button
                                                  onClick={() =>
                                                    Ze(e.checkOutPhoto)
                                                  }
                                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-transparent hover:border-indigo-200 transition-colors"
                                                >
                                                  <ImageIcon size={12} />
                                                </button>
                                              ),
                                              e.checkOutLocation && (
                                                <button
                                                  onClick={() =>
                                                    We({
                                                      title:
                                                        "Ubicación de salida",
                                                      lat: e.checkOutLocation
                                                        .lat,
                                                      lng: e.checkOutLocation
                                                        .lng,
                                                      accuracyMeters:
                                                        e.checkOutLocation
                                                          .accuracyMeters ??
                                                        void 0,
                                                      capturedAt:
                                                        e.checkOutLocation
                                                          .capturedAt,
                                                    })
                                                  }
                                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-transparent hover:border-emerald-200 transition-colors"
                                                >
                                                  <MapPinIcon size={12} />
                                                </button>
                                              ),
                                            ]}
                                          </div>,
                                        ]}
                                      </div>,
                                      <div className="absolute -top-3 -right-1 flex gap-1">
                                        {me && (
                                          <button
                                            onClick={() => Aa(e)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                            title="Editar"
                                          >
                                            <SquarePenIcon size={16} />
                                          </button>
                                        )}
                                      </div>,
                                    ]}
                                  </div>,
                                ]}
                              </div>,
                            ]}
                          </div>
                        );
                      })}
                    </div>,
                  ]}
                </div>
              ),
            ]}
          </Modal>,
          <Modal
            isOpen={!!I}
            onClose={Qs}
            title="Editar Registro de Asistencia"
            maxWidth="max-w-md"
          >
            {I &&
              (() => {
                const e = qa(
                    I.eventDate,
                    I.serviceTime,
                    I.eventTime,
                    I.endTime,
                  ),
                  a = e.isOpen || me,
                  s = () => {
                    const d = Ae(I.eventDate, I.serviceTime || I.eventTime),
                      g = Ae(I.eventDate, I.eventTime || I.serviceTime);
                    if (Number.isNaN(d.getTime()) || Number.isNaN(g.getTime()))
                      return Array.from(
                        {
                          length: 24,
                        },
                        (v, y) => y,
                      );
                    const b = Math.max(0, d.getHours()),
                      c = Math.min(23, g.getHours()),
                      x = [];
                    for (let v = b; v <= c; v++) x.push(v);
                    return x.length
                      ? x
                      : Array.from(
                          {
                            length: 24,
                          },
                          (v, y) => y,
                        );
                  },
                  n = () => {
                    const d = Ae(I.eventDate, I.endTime || I.eventTime),
                      g = new Date(d.getTime() + 7200 * 1e3);
                    if (Number.isNaN(d.getTime()) || Number.isNaN(g.getTime()))
                      return Array.from(
                        {
                          length: 24,
                        },
                        (v, y) => y,
                      );
                    const b = Math.max(0, d.getHours()),
                      c = Math.min(23, g.getHours()),
                      x = [];
                    for (let v = b; v <= c; v++) x.push(v);
                    return x.length
                      ? x
                      : Array.from(
                          {
                            length: 24,
                          },
                          (v, y) => y,
                        );
                  },
                  r = s(),
                  i = n();
                return (
                  <form className="space-y-4 pb-32" onSubmit={xn}>
                    {[
                      <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                        {[
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {"Evento"}
                          </p>,
                          <p className="font-medium text-gray-900 dark:text-white">
                            {I.eventTitle}
                          </p>,
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                            {[I.eventDate, " - ", I.eventTime]}
                          </p>,
                        ]}
                      </div>,
                      !e.isOpen && !me && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center gap-2">
                          {[
                            <ClockIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />,
                            <div>
                              {[
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                  {"Ventana de registro cerrada"}
                                </p>,
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                  {[
                                    e.message,
                                    " • Abre en la hora de servicio (o evento), últimos 30m antes del inicio y de +1h a +3h post-fin cuentan como atraso, luego se cierra",
                                  ]}
                                </p>,
                              ]}
                            </div>,
                          ]}
                        </div>
                      ),
                      <div className="space-y-3">
                        {[
                          <label className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-200">
                            {[
                              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <ClockIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>,
                              "Hora de entrada (Check-in)",
                            ]}
                          </label>,
                          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                            <div className="flex items-center justify-center gap-3">
                              {[
                                <div className="text-center relative">
                                  {[
                                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">
                                      {"Hora"}
                                    </label>,
                                    <button
                                      type="button"
                                      disabled={!a}
                                      onClick={() => {
                                        (ds(!Na), ms(!1));
                                      }}
                                      className="w-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-slate-600 py-3 bg-white dark:bg-slate-800 dark:text-white transition-colors hover:border-green-400 focus:outline-none focus:border-green-500 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-slate-600"
                                    >
                                      {Q.checkInTime
                                        ? String(
                                            new Date(Q.checkInTime).getHours(),
                                          ).padStart(2, "0")
                                        : "HH"}
                                    </button>,
                                    Na && (
                                      <jsxRuntime.Fragment>
                                        {[
                                          <div
                                            className="fixed inset-0 z-[9990]"
                                            onClick={() => ds(!1)}
                                          />,
                                          <div className="absolute top-full left-0 mt-1 w-16 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl border-2 border-green-400 shadow-lg z-[9991]">
                                            {r.map((d) => (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const g = I?.eventDate
                                                      ? new Date(I.eventDate)
                                                      : new Date(),
                                                    b = Q.checkInTime
                                                      ? new Date(Q.checkInTime)
                                                      : g;
                                                  (b.setHours(d),
                                                    st((c) => ({
                                                      ...c,
                                                      checkInTime:
                                                        b.toISOString(),
                                                    })),
                                                    ds(!1));
                                                }}
                                                className="w-full py-2 text-center text-lg font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-white transition-colors"
                                                key={d}
                                              >
                                                {String(d).padStart(2, "0")}
                                              </button>
                                            ))}
                                          </div>,
                                        ]}
                                      </jsxRuntime.Fragment>
                                    ),
                                  ]}
                                </div>,
                                <span className="text-gray-400 dark:text-slate-500 text-3xl font-bold">
                                  {":"}
                                </span>,
                                <div className="text-center relative">
                                  {[
                                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">
                                      {"Min"}
                                    </label>,
                                    <button
                                      type="button"
                                      disabled={!a}
                                      onClick={() => {
                                        (ms(!wa), ds(!1));
                                      }}
                                      className="w-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-slate-600 py-3 bg-white dark:bg-slate-800 dark:text-white transition-colors hover:border-green-400 focus:outline-none focus:border-green-500 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-slate-600"
                                    >
                                      {Q.checkInTime
                                        ? String(
                                            new Date(
                                              Q.checkInTime,
                                            ).getMinutes(),
                                          ).padStart(2, "0")
                                        : "MM"}
                                    </button>,
                                    wa && (
                                      <jsxRuntime.Fragment>
                                        {[
                                          <div
                                            className="fixed inset-0 z-[9990]"
                                            onClick={() => ms(!1)}
                                          />,
                                          <div className="absolute top-full left-0 mt-1 w-16 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl border-2 border-green-400 shadow-lg z-[9991]">
                                            {Array.from(
                                              {
                                                length: 60,
                                              },
                                              (d, g) => (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const b = I?.eventDate
                                                        ? new Date(I.eventDate)
                                                        : new Date(),
                                                      c = Q.checkInTime
                                                        ? new Date(
                                                            Q.checkInTime,
                                                          )
                                                        : b;
                                                    (c.setMinutes(g),
                                                      st((x) => ({
                                                        ...x,
                                                        checkInTime:
                                                          c.toISOString(),
                                                      })),
                                                      ms(!1));
                                                  }}
                                                  className="w-full py-2 text-center text-lg font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-white transition-colors"
                                                  key={g}
                                                >
                                                  {String(g).padStart(2, "0")}
                                                </button>
                                              ),
                                            )}
                                          </div>,
                                        ]}
                                      </jsxRuntime.Fragment>
                                    ),
                                  ]}
                                </div>,
                                <button
                                  type="button"
                                  disabled={!a}
                                  onClick={() =>
                                    st((d) => ({
                                      ...d,
                                      checkInTime: "",
                                    }))
                                  }
                                  className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Limpiar"
                                >
                                  <XIcon className="w-5 h-5" />
                                </button>,
                              ]}
                            </div>
                          </div>,
                        ]}
                      </div>,
                      <div className="space-y-3 overflow-visible">
                        {[
                          <label className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-200">
                            {[
                              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <ClockIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>,
                              "Hora de salida (Check-out)",
                            ]}
                          </label>,
                          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700 overflow-visible">
                            <div className="flex items-center justify-center gap-3">
                              {[
                                <div className="text-center relative">
                                  {[
                                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">
                                      {"Hora"}
                                    </label>,
                                    <button
                                      type="button"
                                      disabled={!a}
                                      onClick={() => {
                                        (us(!ja), hs(!1));
                                      }}
                                      className="w-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-slate-600 py-3 bg-white dark:bg-slate-800 dark:text-white transition-colors hover:border-blue-400 focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-slate-600"
                                    >
                                      {Q.checkOutTime
                                        ? String(
                                            new Date(Q.checkOutTime).getHours(),
                                          ).padStart(2, "0")
                                        : "HH"}
                                    </button>,
                                    ja && (
                                      <jsxRuntime.Fragment>
                                        {[
                                          <div
                                            className="fixed inset-0 z-[99999]"
                                            onClick={() => us(!1)}
                                          />,
                                          <div className="absolute top-full left-0 mt-1 w-16 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-400 shadow-xl z-[100000]">
                                            {i.map((d) => (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const g = I?.eventDate
                                                      ? new Date(I.eventDate)
                                                      : new Date(),
                                                    b = Q.checkOutTime
                                                      ? new Date(Q.checkOutTime)
                                                      : g;
                                                  (b.setHours(d),
                                                    st((c) => ({
                                                      ...c,
                                                      checkOutTime:
                                                        b.toISOString(),
                                                    })),
                                                    us(!1));
                                                }}
                                                className="w-full py-2 text-center text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-white transition-colors"
                                                key={d}
                                              >
                                                {String(d).padStart(2, "0")}
                                              </button>
                                            ))}
                                          </div>,
                                        ]}
                                      </jsxRuntime.Fragment>
                                    ),
                                  ]}
                                </div>,
                                <span className="text-gray-400 dark:text-slate-500 text-3xl font-bold">
                                  {":"}
                                </span>,
                                <div className="text-center relative">
                                  {[
                                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">
                                      {"Min"}
                                    </label>,
                                    <button
                                      type="button"
                                      disabled={!a}
                                      onClick={() => {
                                        (hs(!Sa), us(!1));
                                      }}
                                      className="w-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-slate-600 py-3 bg-white dark:bg-slate-800 dark:text-white transition-colors hover:border-blue-400 focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-slate-600"
                                    >
                                      {Q.checkOutTime
                                        ? String(
                                            new Date(
                                              Q.checkOutTime,
                                            ).getMinutes(),
                                          ).padStart(2, "0")
                                        : "MM"}
                                    </button>,
                                    Sa && (
                                      <jsxRuntime.Fragment>
                                        {[
                                          <div
                                            className="fixed inset-0 z-[99999]"
                                            onClick={() => hs(!1)}
                                          />,
                                          <div className="absolute top-full left-0 mt-1 w-16 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-400 shadow-xl z-[100000]">
                                            {Array.from(
                                              {
                                                length: 60,
                                              },
                                              (d, g) => (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const b = I?.eventDate
                                                        ? new Date(I.eventDate)
                                                        : new Date(),
                                                      c = Q.checkOutTime
                                                        ? new Date(
                                                            Q.checkOutTime,
                                                          )
                                                        : b;
                                                    (c.setMinutes(g),
                                                      st((x) => ({
                                                        ...x,
                                                        checkOutTime:
                                                          c.toISOString(),
                                                      })),
                                                      hs(!1));
                                                  }}
                                                  className="w-full py-2 text-center text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-white transition-colors"
                                                  key={g}
                                                >
                                                  {String(g).padStart(2, "0")}
                                                </button>
                                              ),
                                            )}
                                          </div>,
                                        ]}
                                      </jsxRuntime.Fragment>
                                    ),
                                  ]}
                                </div>,
                                <button
                                  type="button"
                                  disabled={!a}
                                  onClick={() =>
                                    st((d) => ({
                                      ...d,
                                      checkOutTime: "",
                                    }))
                                  }
                                  className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Limpiar"
                                >
                                  <XIcon className="w-5 h-5" />
                                </button>,
                              ]}
                            </div>
                          </div>,
                        ]}
                      </div>,
                      <div className="flex justify-center gap-3 pt-2">
                        {[
                          <button
                            type="button"
                            onClick={Qs}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                          >
                            {"Cancelar"}
                          </button>,
                          <button
                            type="submit"
                            disabled={ya || !a}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {ya ? (
                              <jsxRuntime.Fragment>
                                {[
                                  <LoaderCircleIcon
                                    size={16}
                                    className="animate-spin"
                                  />,
                                  "Guardando...",
                                ]}
                              </jsxRuntime.Fragment>
                            ) : (
                              "Guardar cambios"
                            )}
                          </button>,
                        ]}
                      </div>,
                    ]}
                  </form>
                );
              })()}
          </Modal>,
          <Modal
            isOpen={!!wt}
            onClose={sn}
            title="Evidencia de Asistencia"
            maxWidth="max-w-lg"
          >
            {wt && (
              <div className="space-y-4">
                {[
                  <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-900">
                    {en ? (
                      <div className="w-full h-[240px] flex items-center justify-center text-gray-500 dark:text-slate-400">
                        <LoaderCircleIcon size={20} className="animate-spin" />
                      </div>
                    ) : Ss ? (
                      <PrivateImage
                        src={Ss}
                        alt="Evidencia"
                        className="w-full h-auto max-h-[60vh] object-contain gpu-accelerated"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                      />
                    ) : (
                      <div className="w-full h-[240px] flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">
                        {"No se pudo cargar la evidencia."}
                      </div>
                    )}
                  </div>,
                  <div className="flex justify-end">
                    <a
                      href={Ss || undefined}
                      download="evidencia.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {[<DownloadIcon size={18} />, "Descargar"]}
                    </a>
                  </div>,
                ]}
              </div>
            )}
          </Modal>,
          <Modal
            isOpen={!!ue}
            onClose={() => We(null)}
            title={ue?.title ?? "Ubicación"}
            maxWidth="max-w-2xl"
          >
            {ue && (
              <div className="space-y-4">
                {[
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900">
                    {[
                      an && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center text-gray-500 dark:text-slate-400">
                          <LoaderCircleIcon
                            size={20}
                            className="animate-spin"
                          />
                        </div>
                      ),
                      nn ? (
                        <div className="w-full h-[320px] flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">
                          {"No se pudo cargar el mapa."}
                        </div>
                      ) : Ts ? (
                        <iframe
                          title={ue.title}
                          src={Ts}
                          className="w-full h-[320px]"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onLoad={() => Zt(!1)}
                          onError={() => {
                            (Zt(!1), Ds(!0));
                          }}
                          key={Ts}
                        />
                      ) : (
                        <div className="w-full h-[320px]" />
                      ),
                    ]}
                  </div>,
                  <div className="text-sm text-gray-700 dark:text-slate-200 space-y-1">
                    {[
                      <div>
                        {[
                          <span className="font-semibold">
                            {"Coordenadas:"}
                          </span>,
                          " ",
                          ue.lat.toFixed(6),
                          ", ",
                          ue.lng.toFixed(6),
                        ]}
                      </div>,
                      typeof ue.accuracyMeters == "number" && (
                        <div>
                          {[
                            <span className="font-semibold">
                              {"Precisión aprox.:"}
                            </span>,
                            " ",
                            Math.round(ue.accuracyMeters),
                            " m",
                          ]}
                        </div>
                      ),
                      ue.capturedAt && (
                        <div>
                          {[
                            <span className="font-semibold">
                              {"Capturado:"}
                            </span>,
                            " ",
                            new Date(ue.capturedAt).toLocaleString(),
                          ]}
                        </div>
                      ),
                    ]}
                  </div>,
                  <div className="flex justify-end">
                    <a
                      href={`https://www.google.com/maps?q=${encodeURIComponent(`${ue.lat},${ue.lng}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {[<ExternalLinkIcon size={18} />, "Abrir en Maps"]}
                    </a>
                  </div>,
                ]}
              </div>
            )}
          </Modal>,
          <Modal
            isOpen={hn}
            onClose={() => Us(!1)}
            title="Seleccionar Servidor"
            maxWidth="max-w-md"
          >
            <div className="space-y-4">
              {[
                <div className="relative">
                  {[
                    <SearchIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />,
                    <input
                      type="text"
                      placeholder="Buscar por nombre..."
                      value={fa}
                      onChange={(e) => ba(e.target.value)}
                      autoFocus={!0}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                    />,
                  ]}
                </div>,
                <div className="max-h-[60vh] overflow-y-auto space-y-2 p-2">
                  {[
                    _e
                      .filter((e) => {
                        const a = fa.toLowerCase();
                        return (e.name || "").toLowerCase().includes(a);
                      })
                      .sort((e, a) =>
                        (e.name || "").localeCompare(a.name || ""),
                      )
                      .map((e) =>
                        jsxRuntime.jsxs(
                          "button",
                          {
                            onClick: () => {
                              (un(String(e.id)), Us(!1));
                            },
                            className: `w-full flex items-center gap-3 p-3 rounded-xl transition-all border-2 ${tt === String(e.id) ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-400 shadow-sm" : "border-transparent hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300"}`,
                            children: [
                              e.photoURL || e.photoThumbURL ? (
                                <OptimizedImage
                                  src={e.photoURL || e.photoThumbURL}
                                  alt={e.name}
                                  className="w-10 h-10 rounded-full flex-shrink-0"
                                  imgClassName="object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                  {e.name.charAt(0).toUpperCase()}
                                </div>
                              ),
                              <span
                                className={`font-medium text-left truncate flex-1 ${tt === String(e.id) ? "text-indigo-900 dark:text-indigo-100" : "text-gray-900 dark:text-white"}`}
                              >
                                {e.name}
                              </span>,
                              tt === String(e.id) && (
                                <CheckIcon
                                  size={20}
                                  className="text-indigo-600 dark:text-indigo-400"
                                />
                              ),
                            ],
                          },
                          e.id,
                        ),
                      ),
                    _e.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        {"No hay servidores disponibles."}
                      </p>
                    ),
                  ]}
                </div>,
              ]}
            </div>
          </Modal>,
          <Modal
            isOpen={ht.isOpen}
            onClose={Ne}
            title={ht.title}
            maxWidth="max-w-sm"
          >
            <div className="space-y-6">
              {[
                <p className="text-gray-600 dark:text-slate-300 text-center">
                  {ht.message}
                </p>,
                <div className="flex justify-center gap-3">
                  {[
                    <button
                      type="button"
                      onClick={() => Ne()}
                      disabled={Et}
                      className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors"
                    >
                      {"Cancelar"}
                    </button>,
                    <button
                      type="button"
                      disabled={Et}
                      onClick={async () => {
                        if (!Et) {
                          Gs(!0);
                          try {
                            await ht.onConfirm();
                          } finally {
                            Gs(!1);
                          }
                        }
                      }}
                      className={`px-5 py-2.5 rounded-lg text-white font-medium transition-colors ${ht.confirmColor === "green" ? "bg-green-600 hover:bg-green-700" : ht.confirmColor === "red" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"} ${Et ? "opacity-70" : ""}`}
                    >
                      {Et ? (
                        <span className="inline-flex items-center gap-2">
                          {[
                            <LoaderCircleIcon
                              size={16}
                              className="animate-spin"
                            />,
                            "Procesando...",
                          ]}
                        </span>
                      ) : (
                        ht.confirmText
                      )}
                    </button>,
                  ]}
                </div>,
              ]}
            </div>
          </Modal>,
        ]}
      </div>
    </div>
  );
};
export { Attendance, Attendance as default };
