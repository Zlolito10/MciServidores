// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { PrivateImage } from "../components/PrivateImage.jsx";
import { releaseProtectedImage } from "../services/private-image-client.js";
import {
  assignmentPrivacyKey,
  assignmentManagedAreas,
  watchAssignmentView,
  prepareAssignmentView,
} from "../services/assignment-client.js";
import {
  sendNotification,
  getCommandAuthor,
} from "../services/notification-client.js";
import { extractEmulatorStoragePath } from "../utils/storage-path.js";
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  g as Ds,
  u as useNavigate,
  r as React,
} from "../vendor/vendor-react-BwINE3B3.js";
import {
  useAuth,
  useGlobalData,
  useAppDialog,
  useChangeFeed,
  hasOtherMinistries,
  isBffEnabled,
  firestoreDb,
  OptimizedImage,
  getAvatarUrl,
  Modal,
  isHybridAuthEnabled,
  firebaseStorage,
  resolveCachedImageUrl,
  bffFetch,
} from "../app/App.jsx";
import {
  A,
  E as j,
  H as lt,
  Q as Ft,
  O as dt,
  S as Oe,
  R as ct,
  w as M,
  I as de,
  K as ye,
  J as ce,
  M as mt,
  B as Ws,
  L as xt,
  N as me,
  P as Gs,
  V as Vs,
  D as qs,
  U as Hs,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import { ManageMinistriesModal } from "../components/ManageMinistriesModal.jsx";
import { SelectPicker } from "../components/SelectPicker.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import {
  NO_ROLE_ID,
  isUnassignedRole,
  normalizeRoleId,
} from "../utils/roles.js";
import { optimisticAssignments } from "../services/optimisticAssignments.js";
import {
  I as ImageIcon,
  O as ChevronLeftIcon,
  W as ChurchIcon,
  f as UsersIcon,
  K as StarIcon,
  m as CircleDotIcon,
  s as ClockIcon,
  l as CircleCheckIcon,
  L as LoaderCircleIcon,
  d as CalendarIcon,
  n as MapPinIcon,
  Y as MusicIcon,
  Z as FileTextIcon,
  t as CircleCheckBigIcon,
  _ as CopyIcon,
  P as PlusIcon,
  r as Trash2Icon,
  D as BellIcon,
  $ as DownloadIcon,
  a0 as ExternalLinkIcon,
  F as ChevronUpIcon,
  x as ChevronDownIcon,
  y as SquarePenIcon,
  a1 as FileIcon,
  a2 as UploadIcon,
  a3 as LinkIcon,
  T as TriangleAlertIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
const RenderComponent1 = ({
  users: l,
  area: Pe,
  role: Z,
  roleAssignments: z,
  onAssign: Q,
}) => {
  const [ee, ue] = React.useState(!1),
    ge = React.useRef(null);
  React.useEffect(() => {
    const E = (O) => {
      ge.current && !ge.current.contains(O.target) && ue(!1);
    };
    return (
      document.addEventListener("mousedown", E),
      () => document.removeEventListener("mousedown", E)
    );
  }, []);
  const R = l.filter((E) => {
    const O = Z.trim().toLowerCase(),
      x =
        O === "pastor" ||
        O === "pastora" ||
        O.startsWith("pastor ") ||
        O.startsWith("pastora ");
    if (z.some((te) => te.userId === E.id)) return !1;
    if (E.role === "master_admin" || E.role === "admin") return !0;
    if (!E.areas?.includes(Pe.name)) return !1;
    const we = E.ministryRoles?.[Pe.name];
    return we && we.length > 0 ? (x ? !0 : !!Z && we.includes(Z)) : !0;
  });
  return (
    <div className="relative" ref={ge}>
      {[
        <button
          onClick={() => ue(!ee)}
          className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white transition-colors flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-500"
        >
          {[
            <span className="text-gray-500 dark:text-slate-400">
              {"+ Asignar persona..."}
            </span>,
            <ChevronDownIcon
              size={14}
              className={`text-gray-400 transition-transform ${ee ? "rotate-180" : ""}`}
            />,
          ]}
        </button>,
        ee && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-lg z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
            {R.length > 0 ? (
              R.map((E) =>
                jsxRuntime.jsx(
                  "button",
                  {
                    onClick: () => {
                      (Q(E.id), ue(!1));
                    },
                    className:
                      "w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors",
                    children: E.name,
                  },
                  E.id,
                ),
              )
            ) : (
              <div className="px-3 py-2 text-xs text-gray-400 text-center">
                {"No hay usuarios disponibles"}
              </div>
            )}
          </div>
        ),
      ]}
    </div>
  );
};
const EventDetails = () => {
  const { id: l } = Ds(),
    Pe = useNavigate(),
    {
      user: Z,
      userProfile: z,
      isMinistryRestricted: Q,
      getAssignedMinistries: ee,
    } = useAuth(),
    { users: ue, serviceAreas: ge } = useGlobalData(),
    R = useAppDialog(),
    E = z?.role === "master_admin" || z?.role === "admin",
    O =
      z?.role === "ministry_admin" ||
      z?.role === "ministry_subadmin" ||
      z?.role?.startsWith("ministry_admin_") ||
      z?.role?.startsWith("ministry_subadmin_"),
    [x, he] = React.useState(null),
    [we, te] = React.useState(null),
    V = React.useMemo(
      () =>
        ge.map((t) => ({
          ...t,
          roles: t.roles || [],
        })),
      [ge],
    ),
    pt = React.useMemo(
      () =>
        ue.map((t) => ({
          id: t.id,
          name: t.name,
          email: t.email || "",
          photoURL: t.photoURL,
          photoThumbURL: t.photoThumbURL,
          role: t.role,
          areas: t.areas,
          ministryRoles: t.ministryRoles,
        })),
      [ue],
    ),
    [q, Fe] = React.useState([]),
    [_r, Ue] = React.useState(!0),
    _e = React.useRef(null),
    { boost: Br } = useChangeFeed({
      enabled: isBffEnabled(),
      resources: [
        "events",
        "assignments",
        "comments",
        "attendance",
        "repertoire",
        "materials",
        "service_areas",
        "users",
      ],
      onChange: () => {
        _e.current?.();
      },
      debounceMs: 800,
    }),
    F = () => {
      try {
        window.localStorage.setItem(
          "cem_dashboard_dirty_ts",
          String(Date.now()),
        );
      } catch {}
      (Br(12e3), _e.current?.());
    },
    Gt = (t) => {
      const emulatorPath = extractEmulatorStoragePath(t);
      if (emulatorPath) return emulatorPath;
      if (!t || t.startsWith("/api/download") || t.startsWith("data:"))
        return null;
      if (t.startsWith("gs://")) {
        const s = t.slice(5),
          i = s.indexOf("/");
        return i < 0 ? null : s.slice(i + 1);
      }
      if (t.includes("firebasestorage.googleapis.com")) {
        const i = t.indexOf("/o/");
        if (i < 0) return null;
        const a = t.slice(i + 3),
          o = a.indexOf("?"),
          n = o >= 0 ? a.slice(0, o) : a;
        try {
          return decodeURIComponent(n);
        } catch {
          return n;
        }
      }
      if (t.startsWith("https://storage.googleapis.com/")) {
        const s = t.slice(31),
          i = s.indexOf("/");
        if (i < 0) return null;
        const a = s.slice(i + 1),
          o = a.indexOf("?");
        return o >= 0 ? a.slice(0, o) : a;
      }
      return !t.startsWith("http://") &&
        !t.startsWith("https://") &&
        !t.startsWith("blob:") &&
        !t.startsWith("/") &&
        t.includes("/")
        ? t
        : null;
    },
    Wr = (t) => `/api/download?path=${encodeURIComponent(t)}&inline=1`;
  React.useEffect(() => {
    Fe([]);
  }, [assignmentPrivacyKey(z)]);
  React.useEffect(() => {
    let t = !1;
    return (
      (async () => {
        const s = x?.imageUrl;
        if (!s) {
          t || te(null);
          return;
        }
        if (s.startsWith("data:")) {
          t || te(s);
          return;
        }
        const i = s.includes("firebasestorage.googleapis.com"),
          a = s.startsWith("gs://"),
          o =
            !s.startsWith("http://") &&
            !s.startsWith("https://") &&
            !s.startsWith("data:");
        if (a || i || o)
          try {
            if (isHybridAuthEnabled()) {
              const d = Gt(s) || s,
                p = Wr(d);
              t || te(p);
              return;
            }
            const n = await Ft(dt(firebaseStorage, s));
            t || te(n);
            return;
          } catch {}
        t || te(s);
      })(),
      () => {
        t = !0;
      }
    );
  }, [x?.imageUrl, assignmentPrivacyKey(z)]);
  const re = assignmentManagedAreas(z),
    H = React.useMemo(
      () =>
        E
          ? !0
          : O
            ? x?.activeMinistries && x.activeMinistries.length > 0
              ? x.activeMinistries.some((t) => re.includes(t))
              : V.length > 0
                ? V.some((t) => re.includes(t.id))
                : O
            : !1,
      [E, O, x?.activeMinistries, V, re],
    ),
    Gr = React.useMemo(() => {
      if (E || hasOtherMinistries(z, V)) return !0;
      const t = Array.isArray(x?.activeMinistries) ? x.activeMinistries : [];
      if (t.length === 0) return !0;
      const r = O ? re : Array.isArray(z?.areas) ? z?.areas : [];
      return r.length === 0 ? !1 : t.some((s) => r.includes(s));
    }, [E, O, re, z?.areas, x?.activeMinistries]),
    ft = (t) => (E ? !0 : O ? re.includes(t) : !1),
    $ = E,
    [K, Be] = React.useState("assignments"),
    [Vr, We] = React.useState(!1),
    [S, Ge] = React.useState([]),
    [bt, Ne] = React.useState(!1),
    [P, yt] = React.useState(null),
    [vt, se] = React.useState([]),
    [Ee, ae] = React.useState(""),
    [Ve, qe] = React.useState({
      isOpen: !1,
      songId: null,
      songTitle: "",
    }),
    [X, kt] = React.useState([]),
    [Y, Se] = React.useState(!1),
    [k, jt] = React.useState(null),
    [pe, He] = React.useState(null),
    [Vt, Ke] = React.useState(""),
    [wt, qt] = React.useState(!1),
    [Ce, Re] = React.useState([]),
    [qr, Ht] = React.useState(!1),
    [Xe, Ye] = React.useState({
      isOpen: !1,
      materialId: null,
      materialTitle: "",
    }),
    [Kt, Xt] = React.useState(!1),
    [Yt, Jt] = React.useState(!1),
    [Zt, Qt] = React.useState(!1),
    [er, tr] = React.useState(!1),
    [rr, sr] = React.useState(!1),
    [ar, ir] = React.useState(!1),
    [Nt, nr] = React.useState(null),
    [Et, or] = React.useState(null),
    [lr, St] = React.useState(null),
    [Hr, Ie] = React.useState(!1),
    [Kr, Ae] = React.useState(!1),
    [Je, fe] = React.useState([]),
    [dr, Ze] = React.useState(!1),
    [T, Qe] = React.useState(""),
    [et, cr] = React.useState(!1),
    [tt, mr] = React.useState(!1),
    [xr, ur] = React.useState(!1),
    [gr, hr] = React.useState(!1),
    [Ct, pr] = React.useState(null),
    Rt = React.useRef(!1),
    It = React.useRef(!1),
    U = React.useRef(null),
    fr = React.useRef(""),
    [Xr, Me] = React.useState(!1),
    [br, At] = React.useState([]),
    [Yr, yr] = React.useState(!1),
    [_, vr] = React.useState(""),
    [rt, kr] = React.useState(!1),
    [jr, wr] = React.useState(!1),
    [Nr, Er] = React.useState(!1),
    [ie, Mt] = React.useState({
      isOpen: !1,
      type: "info",
      title: "",
      message: "",
    }),
    w = (t, r, s) => {
      Mt({
        isOpen: !0,
        type: t,
        title: r,
        message: s,
      });
    },
    Jr = (t) => {
      let r = 0;
      for (let s = 0; s < t.length; s += 1)
        ((r = (r << 5) - r + t.charCodeAt(s)), (r |= 0));
      return String(r);
    },
    Sr = () => {
      const t = S.map((s) => ({
          id: s.id,
          title: s.title || "",
          key: s.key || "",
          link: s.link || "",
          notes: s.notes || "",
          order: typeof s.order == "number" ? s.order : null,
        })).sort((s, i) => s.id.localeCompare(i.id)),
        r = X.map((s) => ({
          id: s.id,
          title: s.title || "",
          type: s.type,
          url: s.url || "",
          songId: s.songId || null,
          songTitle: s.songTitle || null,
          filename: s.filename || null,
        })).sort((s, i) => s.id.localeCompare(i.id));
      return Jr(
        JSON.stringify({
          rep: t,
          mats: r,
        }),
      );
    },
    Zr = async (t) => {
      if (!l || isBffEnabled()) return;
      const r = Sr(),
        s = [];
      (s.push({
        ref: A(firestoreDb, "events", l, "autoBackups", t),
        data: {
          createdAt: new Date(),
          type: "auto",
          eventId: l,
          repertoireCount: S.length,
          materialsCount: X.length,
          fingerprint: r,
        },
      }),
        S.forEach((a) => {
          s.push({
            ref: A(
              firestoreDb,
              "events",
              l,
              "autoBackups",
              t,
              "repertoire",
              a.id,
            ),
            data: {
              title: a.title || "",
              key: a.key || "",
              link: a.link || "",
              notes: a.notes || "",
              order: typeof a.order == "number" ? a.order : null,
              _backupAt: new Date(),
            },
          });
        }),
        X.forEach((a) => {
          const o = {
            ...a,
            title: a.title || "",
            url: a.url || "",
            type: a.type === "file" ? "file" : "link",
            createdAt: a.createdAt ?? new Date(),
            _backupAt: new Date(),
          };
          s.push({
            ref: A(
              firestoreDb,
              "events",
              l,
              "autoBackups",
              t,
              "materials",
              a.id,
            ),
            data: o,
          });
        }));
      const i = 450;
      for (let a = 0; a < s.length; a += i) {
        const o = ct(firestoreDb);
        (s.slice(a, a + i).forEach((n) => {
          o.set(n.ref, n.data, {
            merge: !0,
          });
        }),
          await o.commit());
      }
      fr.current = r;
    },
    [be, Cr] = React.useState(null),
    [Tt, ne] = React.useState(""),
    [Qr, oe] = React.useState(!1),
    es = (t) =>
      t.startsWith("http://") ||
      t.startsWith("https://") ||
      t.startsWith("data:") ||
      t.startsWith("blob:") ||
      t.startsWith("/"),
    st = (source) => {
      const value = String(source ?? "").trim();
      Cr(value || null);
      ne("");
      oe(!!value);
    },
    ts = () => {
      (Cr(null), ne(""), oe(!1));
    },
    [I, Te] = React.useState(null),
    [Dt, Rr] = React.useState(""),
    [rs, at] = React.useState(!1),
    [ss, zt] = React.useState(!1);
  React.useEffect(() => {
    const controller = new AbortController();
    let resolved;
    ne("");
    oe(!!be);
    if (be)
      resolveCachedImageUrl(be, {
        signal: controller.signal,
      })
        .then((url) => {
          if (controller.signal.aborted) releaseProtectedImage(url);
          else {
            resolved = url;
            ne(url || "");
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) ne("");
        })
        .finally(() => {
          if (!controller.signal.aborted) oe(false);
        });
    return () => {
      controller.abort();
      releaseProtectedImage(resolved);
    };
  }, [be, assignmentPrivacyKey(z)]);
  const as = (t, r) => {
    const i = r - 0.0025,
      a = r + 0.0025,
      o = t + 0.0025,
      n = t - 0.0025;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(`${i},${n},${a},${o}`)}&layer=mapnik&marker=${encodeURIComponent(`${t},${r}`)}`;
  };
  React.useEffect(() => {
    if (!I) {
      (Rr(""), at(!1), zt(!1));
      return;
    }
    (at(!0), zt(!1));
    const t = as(I.lat, I.lng),
      r = window.setTimeout(() => {
        Rr(t);
      }, 0);
    return () => {
      window.clearTimeout(r);
    };
  }, [I?.lat, I?.lng, I?.title, assignmentPrivacyKey(z)]);
  const Ir = (t) => {
      const r = t.getFullYear(),
        s = String(t.getMonth() + 1).padStart(2, "0"),
        i = String(t.getDate()).padStart(2, "0");
      return `${r}-${s}-${i}`;
    },
    Ot = (t) => {
      const r = new Date(`${t}T00:00:00`),
        i = (r.getDay() + 6) % 7,
        a = new Date(r);
      a.setDate(r.getDate() - i);
      const o = new Date(a);
      return (
        o.setDate(a.getDate() + 6),
        {
          start: Ir(a),
          end: Ir(o),
        }
      );
    },
    Lt = async (t, r) => {
      const s = [],
        i = (n) => {
          const [d, p] = n.split("-").slice(0, 2);
          d &&
            p &&
            !s.find((u) => u.year === d && u.month === p) &&
            s.push({
              year: d,
              month: p,
            });
        };
      (i(t), i(r));
      const a = [];
      for (const { year: n, month: d } of s) {
        const p = await bffFetch(
          `/api/events?year=${encodeURIComponent(n)}&month=${encodeURIComponent(d)}`,
        );
        (Array.isArray(p?.items) ? p.items : [])
          .filter((m) => m.date >= t && m.date <= r)
          .forEach((m) => a.push(m));
      }
      const o = new Map();
      return (
        a.forEach((n) => {
          o.has(n.id) || o.set(n.id, n);
        }),
        Array.from(o.values()).sort((n, d) => n.date.localeCompare(d.date))
      );
    },
    is = async () => {
      if (x) {
        (Ie(!0), Qe(""), fe([]), Ze(!0));
        try {
          const { start: t, end: r } = Ot(x.date);
          if (isBffEnabled()) {
            const s = await Lt(t, r);
            fe(s);
          } else {
            const s = j(firestoreDb, "events"),
              i = de(
                s,
                ye("date", ">=", t),
                ye("date", "<=", r),
                ce("date", "asc"),
              );
            let o = (await M(i)).docs.map((n) => ({
              id: n.id,
              ...n.data(),
            }));
            if (Q()) {
              const n = assignmentManagedAreas(z);
              n.length > 0 &&
                (o = o.filter((d) => {
                  const p = d.activeMinistries || [];
                  return p.length === 0 ? !0 : p.some((u) => n.includes(u));
                }));
            }
            fe(o);
          }
        } catch (t) {
          (console.error("Error loading week events:", t),
            w(
              "error",
              "No se pudo cargar",
              t?.message || "No se pudieron cargar los eventos de la semana.",
            ),
            Ie(!1));
        } finally {
          Ze(!1);
        }
      }
    },
    ns = async () => {
      if (x) {
        (Ae(!0), Qe(""), fe([]), Ze(!0));
        try {
          const { start: t, end: r } = Ot(x.date);
          if (isBffEnabled()) {
            const s = await Lt(t, r);
            fe(s);
          } else {
            const s = j(firestoreDb, "events"),
              i = de(
                s,
                ye("date", ">=", t),
                ye("date", "<=", r),
                ce("date", "asc"),
              );
            let o = (await M(i)).docs.map((n) => ({
              id: n.id,
              ...n.data(),
            }));
            if (Q()) {
              const n = assignmentManagedAreas(z);
              n.length > 0 &&
                (o = o.filter((d) => {
                  const p = d.activeMinistries || [];
                  return p.length === 0 ? !0 : p.some((u) => n.includes(u));
                }));
            }
            fe(o);
          }
        } catch (t) {
          (console.error("Error loading week events:", t),
            w(
              "error",
              "No se pudo cargar",
              t?.message || "No se pudieron cargar los eventos de la semana.",
            ),
            Ae(!1));
        } finally {
          Ze(!1);
        }
      }
    },
    os = async () => {
      if (!(!l || !T) && T !== l) {
        mr(!0);
        try {
          if (isBffEnabled())
            (await bffFetch("/api/commands", {
              method: "POST",
              json: {
                type: "REPLICATE_ASSIGNMENTS",
                sourceEventId: T,
                targetEventId: l,
              },
            }),
              F());
          else {
            const t = j(firestoreDb, "commands");
            await me(t, {
              type: "REPLICATE_ASSIGNMENTS",
              sourceEventId: T,
              targetEventId: l,
              createdAt: qs(),
              createdBy: getCommandAuthor(),
            });
          }
          (w("success", "Éxito", "Asignaciones replicadas correctamente"),
            Ae(!1));
        } catch (t) {
          (console.error("Error replicating assignments:", t),
            w("error", "Error", "No se pudieron replicar."));
        } finally {
          mr(!1);
        }
      }
    },
    ls = async () => {
      if (!(!l || !T) && T !== l) {
        cr(!0);
        try {
          try {
            let t = [];
            if (isBffEnabled()) {
              const r = await bffFetch(`/api/events/${T}/repertoire`);
              r.repertoire && Array.isArray(r.repertoire) && (t = r.repertoire);
            } else {
              const r = j(firestoreDb, "events", T, "repertoire");
              t = (await M(r)).docs.map((i) => ({
                id: i.id,
                ...i.data(),
              }));
            }
            t.length > 0 &&
              (t.sort((r, s) => {
                const i =
                    typeof r.order == "number"
                      ? r.order
                      : Number.MAX_SAFE_INTEGER,
                  a =
                    typeof s.order == "number"
                      ? s.order
                      : Number.MAX_SAFE_INTEGER;
                return i !== a
                  ? i - a
                  : (r.title || "").localeCompare(s.title || "");
              }),
              Ge(t));
          } catch (t) {
            console.warn("Optimistic replication failed", t);
          }
          if (isBffEnabled())
            (await bffFetch("/api/commands", {
              method: "POST",
              json: {
                type: "REPLICATE_REPERTOIRE",
                sourceEventId: T,
                targetEventId: l,
              },
            }),
              F());
          else {
            const t = j(firestoreDb, "commands");
            await me(t, {
              type: "REPLICATE_REPERTOIRE",
              sourceEventId: T,
              targetEventId: l,
              createdAt: new Date(),
              createdBy: getCommandAuthor(),
            });
          }
          (Ie(!1),
            w(
              "success",
              "Replicación Iniciada",
              "El proceso se está ejecutando en segundo plano.",
            ));
        } catch (t) {
          (console.error("Error replicating repertoire:", t),
            w(
              "error",
              "Error",
              t?.message || "No se pudo iniciar la replicación.",
            ));
        } finally {
          cr(!1);
        }
      }
    },
    ds = async () => {
      if (!l || !x) return;
      ur(true);
      try {
        await sendNotification("/api/notify/repertoire", {
          eventId: l,
        });
        w(
          "success",
          "Notificación enviada",
          "Se notificó a los servidores asignados sobre el repertorio.",
        );
      } catch (error) {
        w(
          "error",
          "Error enviando notificación",
          error?.message || "Error de red",
        );
      } finally {
        ur(false);
      }
    },
    cs = async () => {
      if (l) {
        if (!$) {
          w(
            "error",
            "Sin permisos",
            "No tienes permisos para recuperar el repertorio.",
          );
          return;
        }
        hr(!0);
        try {
          const [t, r] = await Promise.all([
              M(
                de(
                  j(firestoreDb, "events", l, "replicateBackups"),
                  ce("createdAt", "desc"),
                  xt(10),
                ),
              ).catch(async () =>
                M(j(firestoreDb, "events", l, "replicateBackups")),
              ),
              M(
                de(
                  j(firestoreDb, "events", l, "autoBackups"),
                  ce("createdAt", "desc"),
                  xt(10),
                ),
              ).catch(async () =>
                M(j(firestoreDb, "events", l, "autoBackups")),
              ),
            ]),
            s = (n) => {
              if (!n) return 0;
              if (typeof n?.toMillis == "function") return n.toMillis();
              if (n instanceof Date) return n.getTime();
              const d = new Date(n);
              return isNaN(d.getTime()) ? 0 : d.getTime();
            },
            a = [
              ...t.docs.map((n) => ({
                col: "replicateBackups",
                doc: n,
              })),
              ...r.docs.map((n) => ({
                col: "autoBackups",
                doc: n,
              })),
            ]
              .filter(({ doc: n }) => {
                const d = n.data()?.type;
                return d === "repertoire" || d === "auto";
              })
              .sort((n, d) => {
                const p = s(n.doc.data()?.createdAt) || 0,
                  u = s(d.doc.data()?.createdAt) || 0;
                return u !== p
                  ? u - p
                  : String(d.doc.id).localeCompare(String(n.doc.id));
              })[0];
          if (!a) {
            w(
              "info",
              "Sin respaldos",
              "No se encontró ningún respaldo de repertorio para este evento.",
            );
            return;
          }
          const o = a.doc.id;
          (await me(j(firestoreDb, "commands"), {
            type: "RESTORE_REPERTOIRE",
            eventId: l,
            backupId: o,
            collection: a.col,
            createdAt: new Date(),
            createdBy: getCommandAuthor(),
            status: "pending",
          }),
            w(
              "success",
              "Restauración iniciada",
              "El repertorio se está recuperando en segundo plano.",
            ));
        } catch (t) {
          if (
            (console.error("Error restoring repertoire from backup:", t),
            t?.code === "permission-denied")
          ) {
            w(
              "error",
              "Permiso denegado",
              "No tienes permisos para leer los respaldos. Necesitas ser admin.",
            );
            return;
          }
          w(
            "error",
            "Error recuperando repertorio",
            t?.message || "Ocurrió un error recuperando el repertorio.",
          );
        } finally {
          hr(!1);
        }
      }
    },
    ms = async () => {
      if (x) {
        (Me(!0), vr(""), At([]), yr(!0));
        try {
          const { start: t, end: r } = Ot(x.date);
          if (isBffEnabled()) {
            const s = await Lt(t, r);
            At(s);
          } else {
            const s = j(firestoreDb, "events"),
              i = de(
                s,
                ye("date", ">=", t),
                ye("date", "<=", r),
                ce("date", "asc"),
              ),
              a = await M(i);
            At(
              a.docs.map((o) => ({
                id: o.id,
                ...o.data(),
              })),
            );
          }
        } catch (t) {
          (console.error("Error loading week events (materials):", t),
            w(
              "error",
              "No se pudo cargar",
              t?.message || "No se pudieron cargar los eventos de la semana.",
            ),
            Me(!1));
        } finally {
          yr(!1);
        }
      }
    },
    xs = async () => {
      if (!(!l || !_) && _ !== l) {
        kr(!0);
        try {
          try {
            let t = [];
            if (isBffEnabled()) {
              const r = await bffFetch(`/api/events/${_}/materials`);
              r.materials && Array.isArray(r.materials) && (t = r.materials);
            } else {
              const r = j(firestoreDb, "events", _, "materials");
              t = (await M(r)).docs.map((i) => ({
                id: i.id,
                ...i.data(),
              }));
            }
            t.length > 0 && kt(t);
          } catch (t) {
            console.warn("Optimistic replication failed (materials)", t);
          }
          if (isBffEnabled())
            (await bffFetch("/api/commands", {
              method: "POST",
              json: {
                type: "REPLICATE_MATERIALS",
                sourceEventId: _,
                targetEventId: l,
              },
            }),
              F());
          else {
            const t = j(firestoreDb, "commands");
            await me(t, {
              type: "REPLICATE_MATERIALS",
              sourceEventId: _,
              targetEventId: l,
              createdAt: new Date(),
              createdBy: getCommandAuthor(),
            });
          }
          (Me(!1),
            w(
              "success",
              "Replicación Iniciada",
              "El proceso de materiales se está ejecutando en segundo plano.",
            ));
        } catch (t) {
          (console.error("Error replicating materials:", t),
            w(
              "error",
              "Error",
              t?.message || "No se pudo iniciar la replicación.",
            ));
        } finally {
          kr(!1);
        }
      }
    },
    us = async () => {
      if (!l || !x) return;
      wr(true);
      try {
        await sendNotification("/api/notify/materials", {
          eventId: l,
        });
        w(
          "success",
          "Notificación enviada",
          "Se notificó a los servidores asignados sobre los materiales.",
        );
      } catch (error) {
        w(
          "error",
          "Error enviando notificación",
          error?.message || "Error de red",
        );
      } finally {
        wr(false);
      }
    },
    gs = async () => {
      if (!l)
        return {
          created: 0,
          skipped: 0,
          filesFound: 0,
        };
      if (isBffEnabled())
        return {
          created: 0,
          skipped: 0,
          filesFound: 0,
        };
      const t = dt(firebaseStorage, `events/${l}/materials`),
        r = await Hs(t),
        s = r.items.length;
      if (s === 0)
        return {
          created: 0,
          skipped: 0,
          filesFound: s,
        };
      const i = await M(j(firestoreDb, "events", l, "materials")),
        a = new Set(),
        o = new Set();
      i.docs.forEach((m) => {
        const f = m.data(),
          g = typeof f?.filename == "string" ? f.filename : null,
          b = typeof f?.url == "string" ? f.url : null;
        (g && a.add(g), b && o.add(b));
      });
      let n = 0;
      const d = [];
      for (const m of r.items) {
        if (a.has(m.name)) {
          n += 1;
          continue;
        }
        const f = await Ft(m);
        if (o.has(f)) {
          n += 1;
          continue;
        }
        d.push({
          filename: m.name,
          url: f,
        });
      }
      if (d.length === 0)
        return {
          created: 0,
          skipped: n,
          filesFound: s,
        };
      const p = 450;
      let u = 0;
      for (let m = 0; m < d.length; m += p) {
        const f = d.slice(m, m + p),
          g = ct(firestoreDb);
        (f.forEach(({ filename: b, url: y }) => {
          const D = b.replace(/\.[^/.]+$/, ""),
            L = A(firestoreDb, "events", l, "materials", b);
          g.set(
            L,
            {
              title: D,
              type: "file",
              filename: b,
              url: y,
              createdAt: new Date(),
            },
            {
              merge: !0,
            },
          );
        }),
          await g.commit(),
          (u += f.length));
      }
      return {
        created: u,
        skipped: n,
        filesFound: s,
      };
    },
    hs = async () => {
      if (!l)
        return {
          restored: 0,
          status: "no-backups",
        };
      if (isBffEnabled())
        return {
          restored: 0,
          status: "no-backups",
        };
      try {
        const [t, r, s] = await Promise.all([
            M(
              de(
                j(firestoreDb, "events", l, "replicateBackups"),
                ce("createdAt", "desc"),
                xt(10),
              ),
            ).catch(async () =>
              M(j(firestoreDb, "events", l, "replicateBackups")),
            ),
            M(
              de(
                j(firestoreDb, "events", l, "autoBackups"),
                ce("createdAt", "desc"),
                xt(10),
              ),
            ).catch(async () => M(j(firestoreDb, "events", l, "autoBackups"))),
            M(j(firestoreDb, "events", l, "materials")),
          ]),
          i = (g) => {
            if (!g) return 0;
            if (typeof g?.toMillis == "function") return g.toMillis();
            if (g instanceof Date) return g.getTime();
            const b = new Date(g);
            return isNaN(b.getTime()) ? 0 : b.getTime();
          },
          o = [
            ...t.docs.map((g) => ({
              col: "replicateBackups",
              doc: g,
            })),
            ...r.docs.map((g) => ({
              col: "autoBackups",
              doc: g,
            })),
          ]
            .filter(({ doc: g }) => {
              const b = g.data()?.type;
              return b === "materials" || b === "auto";
            })
            .sort((g, b) => {
              const y = i(g.doc.data()?.createdAt) || 0,
                D = i(b.doc.data()?.createdAt) || 0;
              return D !== y
                ? D - y
                : String(b.doc.id).localeCompare(String(g.doc.id));
            })[0];
        if (!o)
          return {
            restored: 0,
            status: "no-backups",
          };
        const n = j(firestoreDb, "events", l, o.col, o.doc.id, "materials"),
          d = await M(n);
        if (d.empty)
          return {
            restored: 0,
            status: "backup-empty",
          };
        const p = new Set(s.docs.map((g) => g.id)),
          u = d.docs.filter((g) => !p.has(g.id));
        if (u.length === 0)
          return {
            restored: 0,
            status: "nothing-missing",
          };
        const m = 450;
        let f = 0;
        for (let g = 0; g < u.length; g += m) {
          const b = u.slice(g, g + m),
            y = ct(firestoreDb);
          (b.forEach((D) => {
            const L = D.data();
            y.set(
              A(firestoreDb, "events", l, "materials", D.id),
              {
                ...L,
                title: L.title || "",
                type: L.type === "file" ? "file" : "link",
                url: L.url || "",
                createdAt: L.createdAt ?? new Date(),
              },
              {
                merge: !0,
              },
            );
          }),
            await y.commit(),
            (f += b.length));
        }
        return {
          restored: f,
          status: "ok",
        };
      } catch (t) {
        return (
          console.error("Error restoring materials from backup:", t),
          t?.code === "permission-denied"
            ? {
                restored: 0,
                status: "permission-denied",
              }
            : {
                restored: 0,
                status: "no-backups",
              }
        );
      } finally {
      }
    },
    ps = async () => {
      if (l) {
        if (!$) {
          w(
            "error",
            "Sin permisos",
            "No tienes permisos para recuperar materiales.",
          );
          return;
        }
        if (isBffEnabled()) {
          w(
            "error",
            "No disponible en modo seguro",
            "En modo seguro (BFF) la recuperación de materiales aún no está disponible.",
          );
          return;
        }
        Er(!0);
        try {
          const t = await hs(),
            r = isBffEnabled()
              ? {
                  created: 0,
                  skipped: 0,
                  filesFound: 0,
                }
              : await gs(),
            s = t.restored || 0,
            i = r.created || 0,
            a = r.skipped || 0,
            o = r.filesFound || 0;
          if (s === 0 && i === 0) {
            const d = [];
            (t.status === "permission-denied"
              ? d.push(
                  "No se pudieron leer los respaldos por permisos (debes ser admin).",
                )
              : t.status === "no-backups"
                ? d.push("No se encontró ningún respaldo de materiales.")
                : t.status === "backup-empty"
                  ? d.push("El respaldo existe, pero está vacío.")
                  : t.status === "nothing-missing" &&
                    d.push(
                      "Los materiales ya contienen lo del último respaldo.",
                    ),
              o === 0
                ? isBffEnabled()
                  ? d.push(
                      "En modo seguro (BFF) no se leen archivos directamente desde Storage en el navegador.",
                    )
                  : d.push(
                      "No se encontraron archivos en Storage para este evento.",
                    )
                : d.push(
                    "No hubo archivos nuevos en Storage para recrear (o fueron detectados como duplicados).",
                  ),
              w("info", "Nada que recuperar", d.filter(Boolean).join(" ")));
            return;
          }
          const n = [];
          (t.status === "permission-denied"
            ? n.push("Respaldo: sin permisos.")
            : n.push(`Respaldo: ${s} restaurados.`),
            n.push(`Storage: ${i} restaurados${a ? ` (${a} omitidos)` : ""}.`),
            w("success", "Materiales recuperados", n.join(" ")));
        } catch (t) {
          (console.error("Error restoring materials:", t),
            w(
              "error",
              "Error recuperando materiales",
              t?.message || "Ocurrió un error recuperando materiales.",
            ));
        } finally {
          Er(!1);
        }
      }
    };
  (React.useEffect(() => {
    if (!l) return;
    if ((Ue(!0), isBffEnabled())) {
      let u = !1,
        m = !1,
        f = 0;
      const g = async (B) => {
        const De = !!B?.force,
          it = B?.showSpinner !== !1,
          Mr = typeof B?.bypassCache == "boolean" ? B.bypassCache : De;
        try {
          if (u || m) return;
          const ze = Date.now();
          if (!De && ze - f < 3e4) return;
          ((m = !0), it && Ue(!0));
          const [le] = await Promise.all([
            bffFetch(
              `/api/events/${encodeURIComponent(l)}/details`,
              Mr
                ? {
                    cache: "no-store",
                  }
                : void 0,
            ),
          ]);
          if (u) return;
          (he(le.event),
            Fe(
              prepareAssignmentView(
                Array.isArray(le.assignments) ? le.assignments : [],
                z,
                ue,
                ge,
              ),
            ));
          const Tr = Array.isArray(le.repertoire) ? le.repertoire : [];
          (Tr.sort(($t, Pt) => {
            const Dr =
                typeof $t.order == "number"
                  ? $t.order
                  : Number.MAX_SAFE_INTEGER,
              zr =
                typeof Pt.order == "number"
                  ? Pt.order
                  : Number.MAX_SAFE_INTEGER;
            return Dr !== zr
              ? Dr - zr
              : ($t.title || "").localeCompare(Pt.title || "");
          }),
            Ge(Tr),
            (Rt.current = !0),
            kt(Array.isArray(le.materials) ? le.materials : []),
            (It.current = !0),
            (f = Date.now()));
        } catch (ze) {
          if (u) return;
          console.error("Error fetching data (BFF):", ze);
        } finally {
          ((m = !1), !u && it && Ue(!1));
        }
      };
      (g({
        force: !0,
        showSpinner: !0,
        bypassCache: !0,
      }),
        (_e.current = () =>
          void g({
            force: !0,
            showSpinner: !1,
            bypassCache: !0,
          })));
      const b = (B) => {
        if (B.data?.type === "DATA_CHANGED") {
          const De = B.data.resources || [];
          console.log(
            `[EventDetails] 📲 Push notification received - recursos: ${De.join(", ")}`,
          );
          const it = [
            "events",
            "assignments",
            "comments",
            "attendance",
            "repertoire",
            "materials",
            "service_areas",
            "users",
          ];
          De.some((ze) => it.includes(ze)) &&
            (console.log("[EventDetails] ✅ Cambio relevante - refrescando..."),
            g({
              force: !0,
              showSpinner: !1,
              bypassCache: !0,
            }));
        }
      };
      navigator.serviceWorker?.addEventListener("message", b);
      const y = () =>
          void g({
            force: !0,
            showSpinner: !1,
            bypassCache: !0,
          }),
        D = () =>
          void g({
            force: !0,
            showSpinner: !1,
            bypassCache: !0,
          }),
        L = () => {
          document.visibilityState === "visible" &&
            g({
              force: !0,
              showSpinner: !1,
              bypassCache: !0,
            });
        };
      return (
        window.addEventListener("focus", y),
        window.addEventListener("online", D),
        document.addEventListener("visibilitychange", L),
        () => {
          ((u = !0),
            (_e.current = null),
            navigator.serviceWorker?.removeEventListener("message", b),
            window.removeEventListener("focus", y),
            window.removeEventListener("online", D),
            document.removeEventListener("visibilitychange", L),
            U.current && (window.clearTimeout(U.current), (U.current = null)));
        }
      );
    }
    const t = A(firestoreDb, "events", l),
      r = j(firestoreDb, "events", l, "assignments"),
      s = j(firestoreDb, "events", l, "repertoire"),
      i = j(firestoreDb, "events", l, "materials"),
      a = lt(
        t,
        async (u) => {
          if (!u.exists()) {
            he(null);
            return;
          }
          const m = {
            id: u.id,
            ...u.data(),
          };
          he(m);
          const f = m.serviceTime || m.time || "23:59",
            g = new Date(m.date + "T" + f + ":00"),
            b = new Date(),
            y = new Date(g.getTime() + 480 * 60 * 1e3);
          if (b > y && m.status !== "completed")
            try {
              await Oe(t, {
                status: "completed",
              });
            } catch (D) {
              console.error("Error auto-completing event:", D);
            }
        },
        (u) => {
          console.error("Error listening to event:", u);
        },
      ),
      o = watchAssignmentView(
        r,
        z,
        (rows) => Fe(prepareAssignmentView(rows, z, ue, ge)),
        (error) =>
          console.error("Error listening to authorized assignment view", error),
      ),
      n = lt(
        s,
        (u) => {
          const m = u.docs.map((f) => ({
            id: f.id,
            ...f.data(),
          }));
          (m.sort((f, g) => {
            const b =
                typeof f.order == "number" ? f.order : Number.MAX_SAFE_INTEGER,
              y =
                typeof g.order == "number" ? g.order : Number.MAX_SAFE_INTEGER;
            return b !== y
              ? b - y
              : (f.title || "").localeCompare(g.title || "");
          }),
            Ge(m),
            (Rt.current = !0));
        },
        (u) => {
          console.error("Error listening to repertoire:", u);
        },
      ),
      d = lt(
        i,
        (u) => {
          (kt(
            u.docs.map((m) => ({
              id: m.id,
              ...m.data(),
            })),
          ),
            (It.current = !0));
        },
        (u) => {
          console.error("Error listening to materials:", u);
        },
      );
    return (
      (async () => {
        Ue(!1);
      })(),
      () => {
        (U.current && (window.clearTimeout(U.current), (U.current = null)),
          a(),
          o(),
          n(),
          d());
      }
    );
  }, [l, assignmentPrivacyKey(z), ue, ge]),
    React.useEffect(() => {
      if (!l || isBffEnabled() || !$ || !Rt.current || !It.current) return;
      const t = Sr();
      t &&
        t !== fr.current &&
        (U.current && (window.clearTimeout(U.current), (U.current = null)),
        (U.current = window.setTimeout(() => {
          const r = new Date().toISOString();
          Zr(r).catch((s) => {
            console.error("[AutoBackup] error", s);
          });
        }, 4e3)));
    }, [l, $, S, X, assignmentPrivacyKey(z), ue, ge]));
  const fs = async (t, r, s, i) => {
      if (!l || !i) return;
      if (!ft(t)) {
        R.showError("No puedes modificar asignaciones de otros ministerios.");
        return;
      }
      const a = pt.find((d) => d.id === i);
      if (!a) return;
      const o = `${t}_${s.replace(/\s+/g, "_")}_${i}`,
        n = {
          id: o,
          areaId: t,
          areaName: r,
          roleName: s,
          userId: i,
          userName: a.name,
          userPhoto: a.photoURL || null,
        };
      try {
        isBffEnabled()
          ? (await bffFetch(
              `/api/events/${encodeURIComponent(l)}/assignments/${encodeURIComponent(o)}`,
              {
                method: "PUT",
                json: n,
              },
            ),
            Fe((d) => (d.some((p) => p.id === o) ? d : [...d, n])),
            optimisticAssignments.add({
              ...n,
              eventId: l,
              eventTitle: x?.title || "",
              eventDate: x?.date || "",
              eventTime: x?.time || "",
            }),
            F())
          : await Ws(A(firestoreDb, "events", l, "assignments", o), n);
      } catch (d) {
        (console.error("Error saving assignment:", d),
          R.showError("Error al asignar usuario"));
      }
    },
    bs = async (t) => {
      if (!l) {
        console.error("Event ID is undefined! Cannot remove assignment.");
        return;
      }
      const r = q.find((s) => s.id === t);
      if (r && !ft(r.areaId)) {
        R.showError("No puedes modificar asignaciones de otros ministerios.");
        return;
      }
      if (Nt !== t) {
        nr(t);
        try {
          isBffEnabled()
            ? (await bffFetch(
                `/api/events/${encodeURIComponent(l)}/assignments/${encodeURIComponent(t)}`,
                {
                  method: "DELETE",
                },
              ),
              Fe((s) => s.filter((i) => i.id !== t)),
              F())
            : await mt(A(firestoreDb, "events", l, "assignments", t));
        } catch (s) {
          (console.error("Error removing assignment:", s),
            R.showError(`Error al remover asignación: ${String(s)}`));
        } finally {
          nr(null);
        }
      }
    },
    ys = async (t) => {
      if ((t.preventDefault(), !l)) return;
      const r = new FormData(t.currentTarget),
        s = {
          title: r.get("title"),
          key: vt.join("+"),
          link: r.get("link"),
          ref1: r.get("ref1"),
          link2: r.get("link2"),
          ref2: r.get("ref2"),
          notes: r.get("notes"),
        };
      Xt(!0);
      try {
        if (isBffEnabled()) {
          if (P)
            await bffFetch(
              `/api/events/${encodeURIComponent(l)}/repertoire/${encodeURIComponent(P.id)}`,
              {
                method: "PATCH",
                json: s,
              },
            );
          else {
            const i = S.reduce((a, o) => {
              const n = typeof o.order == "number" ? o.order : -1;
              return Math.max(a, n);
            }, -1);
            await bffFetch(`/api/events/${encodeURIComponent(l)}/repertoire`, {
              method: "POST",
              json: {
                ...s,
                order: i + 1,
              },
            });
          }
          F();
        } else if (P)
          await Oe(A(firestoreDb, "events", l, "repertoire", P.id), s);
        else {
          const i = S.reduce((a, o) => {
            const n = typeof o.order == "number" ? o.order : -1;
            return Math.max(a, n);
          }, -1);
          await me(j(firestoreDb, "events", l, "repertoire"), {
            ...s,
            order: i + 1,
          });
        }
        (Ne(!1), yt(null), se([]), ae(""));
      } catch (i) {
        (console.error("Error saving song:", i),
          R.showError("Error al guardar canción"));
      } finally {
        Xt(!1);
      }
    },
    Ar = async (t, r) => {
      if (!l || !$ || Ct) return;
      const s = S.findIndex((n) => n.id === t),
        i = r === "up" ? s - 1 : s + 1;
      if (s < 0 || i < 0 || i >= S.length) return;
      const a = S[s],
        o = S[i];
      pr(t);
      try {
        const n = S.some((d) => typeof d.order != "number");
        if (isBffEnabled()) {
          const d = n
            ? S.map((p, u) => {
                const m = p.id === a.id ? i : p.id === o.id ? s : u;
                return {
                  id: p.id,
                  order: m,
                };
              })
            : [
                {
                  id: a.id,
                  order: typeof o.order == "number" ? o.order : i,
                },
                {
                  id: o.id,
                  order: typeof a.order == "number" ? a.order : s,
                },
              ];
          (await bffFetch(
            `/api/events/${encodeURIComponent(l)}/repertoire/reorder`,
            {
              method: "POST",
              json: {
                items: d,
              },
            },
          ),
            F());
        } else {
          const d = ct(firestoreDb);
          if (n)
            S.forEach((p, u) => {
              const m = p.id === a.id ? i : p.id === o.id ? s : u;
              d.set(
                A(firestoreDb, "events", l, "repertoire", p.id),
                {
                  order: m,
                },
                {
                  merge: !0,
                },
              );
            });
          else {
            const p = typeof a.order == "number" ? a.order : s,
              u = typeof o.order == "number" ? o.order : i;
            (d.set(
              A(firestoreDb, "events", l, "repertoire", a.id),
              {
                order: u,
              },
              {
                merge: !0,
              },
            ),
              d.set(
                A(firestoreDb, "events", l, "repertoire", o.id),
                {
                  order: p,
                },
                {
                  merge: !0,
                },
              ));
          }
          await d.commit();
        }
      } catch (n) {
        (console.error("Error moving song:", n),
          w(
            "error",
            "No se pudo ordenar",
            "Ocurrió un error moviendo la canción.",
          ));
      } finally {
        pr(null);
      }
    },
    vs = async (t) => {
      if (l) {
        Jt(!0);
        try {
          (isBffEnabled()
            ? (await bffFetch(
                `/api/events/${encodeURIComponent(l)}/repertoire/${encodeURIComponent(t)}`,
                {
                  method: "DELETE",
                },
              ),
              F())
            : await mt(A(firestoreDb, "events", l, "repertoire", t)),
            Ge((r) => r.filter((s) => s.id !== t)),
            qe({
              isOpen: !1,
              songId: null,
              songTitle: "",
            }));
        } catch (r) {
          console.error("Error deleting song:", r);
        } finally {
          Jt(!1);
        }
      }
    },
    ks = (t) => {
      qe({
        isOpen: !0,
        songId: t.id,
        songTitle: t.title,
      });
    },
    js = (t) => {
      yt(t);
      const r =
        typeof t.key == "string"
          ? t.key
              .split("+")
              .map((s) => s.trim())
              .filter((s) => s)
          : Array.isArray(t.key)
            ? t.key.map((s) => String(s).trim()).filter((s) => s)
            : [];
      (se(r), ae(""), Ne(!0));
    },
    ws = async (t) => {
      if ((t.preventDefault(), !l)) return;
      const r = new FormData(t.currentTarget),
        s = r.get("title"),
        i = r.get("songId"),
        a = pe,
        o = !!(a && a.size > 0),
        n = o ? "file" : k ? k.type : "link";
      let d = "",
        p = "";
      Qt(!0);
      try {
        if (isBffEnabled()) {
          const u = (i && S.find((m) => m.id === i)?.title) || "";
          if (n === "file") {
            if (o && a) {
              const m = new FormData();
              (m.set("title", s || ""),
                i && m.set("songId", i),
                u && m.set("songTitle", u),
                k?.id && m.set("materialId", k.id),
                m.set("file", a, a.name),
                await bffFetch(
                  `/api/events/${encodeURIComponent(l)}/materials/upload`,
                  {
                    method: "POST",
                    body: m,
                  },
                ));
            } else if (k)
              await bffFetch(
                `/api/events/${encodeURIComponent(l)}/materials/${encodeURIComponent(k.id)}`,
                {
                  method: "PATCH",
                  json: {
                    title: s,
                    songId: i || null,
                    songTitle: u || null,
                  },
                },
              );
            else {
              R.showError("Selecciona un archivo para subir.");
              return;
            }
          } else {
            d = r.get("url") || "";
            const m = {
              title: s,
              type: "link",
              url: d,
              filename: "",
              songId: i || null,
              songTitle: u || null,
            };
            k
              ? await bffFetch(
                  `/api/events/${encodeURIComponent(l)}/materials/${encodeURIComponent(k.id)}`,
                  {
                    method: "PATCH",
                    json: m,
                  },
                )
              : await bffFetch(
                  `/api/events/${encodeURIComponent(l)}/materials`,
                  {
                    method: "POST",
                    json: m,
                  },
                );
          }
          F();
        } else {
          if (n === "file") {
            if (o && a) {
              const m = dt(firebaseStorage, `events/${l}/materials/${a.name}`);
              (await Gs(m, a, {
                contentDisposition: `attachment; filename="${a.name}"`,
              }),
                (d = await Ft(m)),
                (p = a.name));
            } else k && ((d = k.url || ""), (p = k.filename || ""));
          } else d = r.get("url") || "";
          const u = {
            title: s,
            type: n,
            url: d,
            filename: p,
            songId: i || null,
            songTitle: i ? S.find((m) => m.id === i)?.title : null,
            createdAt: k?.createdAt ?? new Date(),
          };
          if (k) {
            if (
              (await Oe(A(firestoreDb, "events", l, "materials", k.id), u),
              o && k.type === "file" && k.filename && k.filename !== p)
            )
              try {
                const m = dt(
                  firebaseStorage,
                  `events/${l}/materials/${k.filename}`,
                );
                await Vs(m);
              } catch {}
          } else await me(j(firestoreDb, "events", l, "materials"), u);
        }
        (Se(!1), jt(null), He(null));
      } catch (u) {
        (console.error("Error saving material:", u),
          R.showError("Error al guardar material"));
      } finally {
        Qt(!1);
      }
    },
    Ns = async (t) => {
      if (l) {
        tr(!0);
        try {
          (isBffEnabled()
            ? (await bffFetch(
                `/api/events/${encodeURIComponent(l)}/materials/${encodeURIComponent(t)}`,
                {
                  method: "DELETE",
                },
              ),
              F())
            : await mt(A(firestoreDb, "events", l, "materials", t)),
            Ye({
              isOpen: !1,
              materialId: null,
              materialTitle: "",
            }));
        } catch (r) {
          console.error("Error deleting material:", r);
        } finally {
          tr(!1);
        }
      }
    },
    Es = (t) => {
      Ye({
        isOpen: !0,
        materialId: t.id,
        materialTitle: t.title,
      });
    },
    Ss = (t) => {
      (jt(t), Ke(t.songId || ""), Se(!0));
    },
    Cs = async (t) => {
      if (l)
        try {
          (isBffEnabled()
            ? await bffFetch(`/api/events/${encodeURIComponent(l)}`, {
                method: "PATCH",
                json: {
                  activeMinistries: t,
                },
              })
            : await Oe(A(firestoreDb, "events", l), {
                activeMinistries: t,
              }),
            he((r) =>
              r
                ? {
                    ...r,
                    activeMinistries: t,
                  }
                : null,
            ),
            We(!1));
        } catch (r) {
          (console.error("Error updating ministries:", r),
            R.showError("Error al actualizar ministerios"));
        }
    },
    Rs = async () => {
      if (!(!l || !x)) {
        sr(!0);
        try {
          (isBffEnabled()
            ? await bffFetch(`/api/events/${encodeURIComponent(l)}`, {
                method: "PATCH",
                json: {
                  status: "completed",
                },
              })
            : await Oe(A(firestoreDb, "events", l), {
                status: "completed",
              }),
            he((t) =>
              t
                ? {
                    ...t,
                    status: "completed",
                  }
                : null,
            ));
        } catch (t) {
          (console.error("Error completing event:", t),
            R.showError("Error al completar el evento"));
        } finally {
          sr(!1);
        }
      }
    },
    Is = async () => {
      Ht(!0);
      try {
        if (isBffEnabled()) {
          const t = await bffFetch("/api/materials_library");
          Re(Array.isArray(t?.items) ? t.items : []);
        } else {
          const r = (await M(j(firestoreDb, "materials_library"))).docs.map(
            (s) => ({
              id: s.id,
              ...s.data(),
            }),
          );
          Re(r);
        }
      } catch (t) {
        console.error("Error fetching library items:", t);
      } finally {
        Ht(!1);
      }
    };
  React.useEffect(() => {
    (wt || Y) && Is();
  }, [wt, Y, assignmentPrivacyKey(z)]);
  const As = async (t) => {
      t.preventDefault();
      const r = new FormData(t.currentTarget),
        s = r.get("title"),
        i = r.get("url");
      if (s) {
        ir(!0);
        try {
          const a = {
            title: s,
            url: i || "",
            createdAt: new Date(),
          };
          if (isBffEnabled()) {
            const o = await bffFetch("/api/materials_library", {
                method: "POST",
                json: {
                  title: s,
                  url: i || "",
                },
              }),
              n = o?.item
                ? {
                    id: o.id,
                    ...o.item,
                  }
                : {
                    id: o.id,
                    ...a,
                  };
            Re((d) => [...d, n]);
          } else {
            const o = await me(j(firestoreDb, "materials_library"), a);
            Re((n) => [
              ...n,
              {
                id: o.id,
                ...a,
              },
            ]);
          }
          t.target.reset();
        } catch (a) {
          (console.error("Error creating library item:", a),
            R.showError("Error al guardar en la biblioteca"));
        } finally {
          ir(!1);
        }
      }
    },
    Ms = async (t) => {
      if (!Et) {
        or(t);
        try {
          (isBffEnabled()
            ? await bffFetch(
                `/api/materials_library/${encodeURIComponent(t)}`,
                {
                  method: "DELETE",
                },
              )
            : await mt(A(firestoreDb, "materials_library", t)),
            Re((r) => r.filter((s) => s.id !== t)));
        } catch (r) {
          (console.error("Error deleting library item:", r),
            R.showError("Error al eliminar de la biblioteca"));
        } finally {
          or(null);
        }
      }
    },
    Ts = async (t) => {
      St(t.id);
      const r = Gt(t.url) || t.url,
        s = t.filename || "archivo",
        i =
          r &&
          !r.startsWith("http://") &&
          !r.startsWith("https://") &&
          !r.startsWith("data:");
      (console.log("[MaterialDownload] URL Original:", t.url),
        console.log("[MaterialDownload] Path Extraído:", r),
        console.log("[MaterialDownload] Es interno (Smart Download):", i));
      try {
        if (i) {
          const n = `/api/download-material?path=${encodeURIComponent(r)}&filename=${encodeURIComponent(s)}`;
          try {
            if (
              (
                await fetch(n, {
                  method: "HEAD",
                })
              ).status === 404
            ) {
              ((await R.confirm({
                title: "Archivo Archivado",
                message:
                  "Este archivo tiene más de 14 días y fue movido automáticamente a Google Drive para ahorrar espacio. ¿Desea abrir la carpeta de respaldos?",
                confirmText: "Ir a Drive",
                cancelText: "Cancelar",
                confirmColor: "indigo",
              })) &&
                window.open(
                  "https://drive.google.com/drive/folders/1d2k7PKav0bCPfGZng6tDqAhIhqT_0mqp",
                  "_blank",
                ),
                St(null));
              return;
            }
          } catch {}
          const d = document.createElement("a");
          ((d.href = n),
            (d.download = s),
            document.body.appendChild(d),
            d.click(),
            document.body.removeChild(d));
        } else
          window.open(t.url, "_blank") ||
            R.showInfo(
              "Por favor permite los pop-ups para descargar el archivo.",
              "Pop-up bloqueado",
            );
      } catch (a) {
        (console.error("Error downloading file:", a),
          R.showError(
            a.message || "No se pudo descargar el archivo. Intenta más tarde.",
          ));
      } finally {
        St(null);
      }
    };
  return _r ? (
    <LoadingSpinner text="Cargando evento..." />
  ) : x ? (
    Gr ? (
      <div className="space-y-6">
        {[
          <ManageMinistriesModal
            isOpen={Vr}
            onClose={() => We(!1)}
            areas={V}
            activeMinistries={x?.activeMinistries}
            onSave={Cs}
          />,
          x.imageUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
              <OptimizedImage
                src={we || x.imageUrl}
                alt={x.title}
                className="w-full h-64 md:h-80"
                imgClassName="object-cover"
                fallbackIcon={
                  <ImageIcon
                    size={72}
                    strokeWidth={1}
                    className="text-gray-300 dark:text-slate-600"
                  />
                }
              />
            </div>
          ),
          <div className="mb-8">
            {[
              <div className="flex items-center justify-between mb-6">
                {[
                  <button
                    onClick={() => Pe("/dashboard/events")}
                    className="p-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-xl transition-colors group"
                  >
                    <ChevronLeftIcon
                      size={24}
                      className="text-red-600 dark:text-red-400"
                    />
                  </button>,
                  <div className="flex items-center gap-2">
                    {[
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${x.type === "service" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" : x.type === "meeting" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : x.type === "special" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"}`}
                      >
                        {x.type === "service" ? (
                          <jsxRuntime.Fragment>
                            {[<ChurchIcon size={14} />, " Servicio"]}
                          </jsxRuntime.Fragment>
                        ) : x.type === "meeting" ? (
                          <jsxRuntime.Fragment>
                            {[<UsersIcon size={14} />, " Reunión"]}
                          </jsxRuntime.Fragment>
                        ) : x.type === "special" ? (
                          <jsxRuntime.Fragment>
                            {[<StarIcon size={14} />, " Especial"]}
                          </jsxRuntime.Fragment>
                        ) : (
                          <jsxRuntime.Fragment>
                            {[<CircleDotIcon size={14} />, " ", x.type]}
                          </jsxRuntime.Fragment>
                        )}
                      </span>,
                      (() => {
                        const t = x.status === "completed",
                          r = x.serviceTime || x.time || "23:59",
                          s = new Date(x.date + "T" + r + ":00"),
                          i = new Date(),
                          a = new Date(s.getTime() - 7200 * 1e3),
                          o = new Date(s.getTime() + 480 * 60 * 1e3),
                          n = !t && i < a,
                          d = !t && i >= a && i <= o;
                        return (
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${n ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : d ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}
                          >
                            {n ? (
                              <jsxRuntime.Fragment>
                                {[<CircleDotIcon size={14} />, " Próximo"]}
                              </jsxRuntime.Fragment>
                            ) : d ? (
                              <jsxRuntime.Fragment>
                                {[<ClockIcon size={14} />, " En Curso"]}
                              </jsxRuntime.Fragment>
                            ) : (
                              <jsxRuntime.Fragment>
                                {[<CircleCheckIcon size={14} />, " Finalizado"]}
                              </jsxRuntime.Fragment>
                            )}
                          </span>
                        );
                      })(),
                    ]}
                  </div>,
                ]}
              </div>,
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5">
                {x.title}
              </h1>,
              z?.role === "admin" && x.status !== "completed" && (
                <button
                  onClick={Rs}
                  disabled={rr}
                  className="mb-5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rr ? (
                    <jsxRuntime.Fragment>
                      {[
                        <LoaderCircleIcon size={16} className="animate-spin" />,
                        "Completando...",
                      ]}
                    </jsxRuntime.Fragment>
                  ) : (
                    <jsxRuntime.Fragment>
                      {[
                        <CircleCheckIcon size={16} />,
                        "Marcar como Completado",
                      ]}
                    </jsxRuntime.Fragment>
                  )}
                </button>
              ),
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-3 lg:p-4 shadow-sm">
                {[
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      <div className="flex items-center gap-3">
                        {[
                          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                            <CalendarIcon
                              size={20}
                              className="text-indigo-600 dark:text-indigo-400"
                            />
                          </div>,
                          <div>
                            {[
                              <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                                {"Fecha"}
                              </p>,
                              <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                {new Date(
                                  x.date + "T00:00:00",
                                ).toLocaleDateString("es-ES", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                })}
                              </p>,
                            ]}
                          </div>,
                        ]}
                      </div>,
                      <div className="flex items-center gap-3">
                        {[
                          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                            <ClockIcon
                              size={20}
                              className="text-emerald-600 dark:text-emerald-400"
                            />
                          </div>,
                          <div>
                            {[
                              <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                                {"Horario"}
                              </p>,
                              <div className="text-sm font-semibold text-gray-900 dark:text-white space-y-0.5">
                                {[
                                  x.serviceTime && (
                                    <p className="flex items-center gap-1.5">
                                      {[
                                        <span className="text-emerald-600 dark:text-emerald-400">
                                          {"Servicio:"}
                                        </span>,
                                        " ",
                                        x.serviceTime,
                                      ]}
                                    </p>
                                  ),
                                  <p className="flex items-center gap-1.5">
                                    {[
                                      <span className="text-indigo-600 dark:text-indigo-400">
                                        {"Inicio de evento:"}
                                      </span>,
                                      " ",
                                      x.time,
                                    ]}
                                  </p>,
                                  x.endTime && (
                                    <p className="flex items-center gap-1.5">
                                      {[
                                        <span className="text-indigo-600 dark:text-indigo-400">
                                          {"Fin de evento:"}
                                        </span>,
                                        " ",
                                        x.endTime,
                                      ]}
                                    </p>
                                  ),
                                ]}
                              </div>,
                            ]}
                          </div>,
                        ]}
                      </div>,
                      <div className="flex items-center gap-3">
                        {[
                          <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <MapPinIcon
                              size={20}
                              className="text-purple-600 dark:text-purple-400"
                            />
                          </div>,
                          <div>
                            {[
                              <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                                {"Ubicación"}
                              </p>,
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {x.location}
                              </p>,
                            ]}
                          </div>,
                        ]}
                      </div>,
                    ]}
                  </div>,
                  x.description && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {x.description}
                      </p>
                    </div>
                  ),
                ]}
              </div>,
            ]}
          </div>,
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-sm border border-gray-100 dark:border-slate-700 mb-6 flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              <button
                onClick={() => Be("assignments")}
                className={`px-3 sm:px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${K === "assignments" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
              >
                {[<UsersIcon size={16} />, "Asignaciones"]}
              </button>,
              <button
                onClick={() => Be("repertoire")}
                className={`px-3 sm:px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${K === "repertoire" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
              >
                {[<MusicIcon size={16} />, "Repertorio"]}
              </button>,
              <button
                onClick={() => Be("materials")}
                className={`px-3 sm:px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${K === "materials" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
              >
                {[<FileTextIcon size={16} />, "Materiales"]}
              </button>,
              H && (
                <button
                  onClick={() => Be("attendance")}
                  className={`px-3 sm:px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${K === "attendance" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
                >
                  {[<CircleCheckBigIcon size={16} />, "Asistencia"]}
                </button>
              ),
            ]}
          </div>,
          <div className="min-h-[400px]">
            {[
              K === "assignments" && (
                <div className="space-y-6">
                  {[
                    <div className="flex items-center justify-between">
                      {[
                        <div className="flex items-center gap-3">
                          {[
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                              <UsersIcon size={20} />
                            </div>,
                            <div>
                              {[
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {"Ministerios Activos"}
                                </h2>,
                                <span className="text-sm text-gray-500 dark:text-slate-400">
                                  {[
                                    V.filter(
                                      (t) =>
                                        !x?.activeMinistries ||
                                        x.activeMinistries.includes(t.id),
                                    ).length,
                                    " ",
                                    "ministerios",
                                  ]}
                                </span>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        E && (
                          <div className="flex items-center gap-2">
                            {[
                              <button
                                onClick={ns}
                                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                                title="Replicar asignaciones desde otro evento de la semana"
                              >
                                {[
                                  <CopyIcon size={16} />,
                                  <span className="hidden sm:inline">
                                    {"Replicar"}
                                  </span>,
                                ]}
                              </button>,
                              <button
                                onClick={() => We(!0)}
                                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                              >
                                {[
                                  <PlusIcon size={16} />,
                                  <span className="hidden sm:inline">
                                    {"Gestionar"}
                                  </span>,
                                ]}
                              </button>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {V.filter(
                        (t) =>
                          !x?.activeMinistries ||
                          x.activeMinistries.includes(t.id),
                      )
                        .filter((t) =>
                          H ? !0 : q.some((r) => r.areaId === t.id),
                        )
                        .map((t, r) => {
                          const s = [
                              {
                                bg: "from-indigo-500 to-purple-600",
                                light: "indigo",
                                ring: "ring-indigo-500/20",
                              },
                              {
                                bg: "from-emerald-500 to-teal-600",
                                light: "emerald",
                                ring: "ring-emerald-500/20",
                              },
                              {
                                bg: "from-orange-500 to-red-500",
                                light: "orange",
                                ring: "ring-orange-500/20",
                              },
                              {
                                bg: "from-pink-500 to-rose-600",
                                light: "pink",
                                ring: "ring-pink-500/20",
                              },
                              {
                                bg: "from-cyan-500 to-blue-600",
                                light: "cyan",
                                ring: "ring-cyan-500/20",
                              },
                              {
                                bg: "from-amber-500 to-yellow-500",
                                light: "amber",
                                ring: "ring-amber-500/20",
                              },
                            ],
                            i = s[r % s.length],
                            a = q.filter((f) => f.areaId === t.id).length,
                            o = ft(t.id),
                            n = (t.roles?.length || 0) > 0,
                            d = t.roles?.length || 0,
                            p = n ? t.roles : [NO_ROLE_ID],
                            u = H
                              ? d
                              : t.roles?.filter((f) =>
                                  q.some(
                                    (g) =>
                                      g.areaId === t.id && g.roleName === f,
                                  ),
                                ).length || 0,
                            m = H ? d : u;
                          return jsxRuntime.jsxs(
                            "div",
                            {
                              className:
                                "bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md",
                              children: [
                                <div
                                  className={`relative p-3 bg-gradient-to-r ${i.bg} text-white`}
                                >
                                  {[
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />,
                                    <div className="relative flex justify-between items-start">
                                      {[
                                        <div>
                                          {[
                                            <h3 className="text-base font-bold">
                                              {t.name}
                                            </h3>,
                                            <p className="text-white/80 text-xs mt-0.5">
                                              {n ? (
                                                <jsxRuntime.Fragment>
                                                  {[
                                                    a,
                                                    " de ",
                                                    m,
                                                    " roles asignados",
                                                  ]}
                                                </jsxRuntime.Fragment>
                                              ) : (
                                                <jsxRuntime.Fragment>
                                                  {[
                                                    a,
                                                    " asignado",
                                                    a === 1 ? "" : "s",
                                                  ]}
                                                </jsxRuntime.Fragment>
                                              )}
                                            </p>,
                                          ]}
                                        </div>,
                                        <div className="flex items-center gap-2">
                                          <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                                            {n ? `${m} Roles` : "Sin roles"}
                                          </span>
                                        </div>,
                                      ]}
                                    </div>,
                                    <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-white rounded-full transition-all duration-500"
                                        style={{
                                          width: `${n ? (m > 0 ? (a / m) * 100 : 0) : a > 0 ? 100 : 0}%`,
                                        }}
                                      />
                                    </div>,
                                  ]}
                                </div>,
                                <div className="p-3 divide-y divide-gray-100 dark:divide-slate-700">
                                  {p
                                    ?.filter((f) =>
                                      H
                                        ? !0
                                        : q.filter(
                                            (b) =>
                                              b.areaId === t.id &&
                                              (f === NO_ROLE_ID
                                                ? isUnassignedRole(b.roleName)
                                                : b.roleName === f),
                                          ).length > 0,
                                    )
                                    .map((f, g) => {
                                      const b = q.filter(
                                        (y) =>
                                          y.areaId === t.id &&
                                          (f === NO_ROLE_ID
                                            ? isUnassignedRole(y.roleName)
                                            : y.roleName === f),
                                      );
                                      return (
                                        <div
                                          className="py-2.5 first:pt-0 last:pb-0"
                                          key={g}
                                        >
                                          {[
                                            n && (
                                              <div className="flex items-center justify-between mb-2">
                                                {[
                                                  <div className="flex items-center gap-1.5">
                                                    {[
                                                      <div
                                                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${i.bg}`}
                                                      />,
                                                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                                                        {f}
                                                      </p>,
                                                    ]}
                                                  </div>,
                                                  b.length > 0 && (
                                                    <span className="text-xs text-gray-500 dark:text-slate-400">
                                                      {[
                                                        b.length,
                                                        " asignado",
                                                        b.length > 1 ? "s" : "",
                                                      ]}
                                                    </span>
                                                  ),
                                                ]}
                                              </div>
                                            ),
                                            <div
                                              className={`space-y-1.5 ${n ? "ml-3" : ""}`}
                                            >
                                              {[
                                                b.length === 0 &&
                                                  (!H || !o) && (
                                                    <p className="text-sm text-gray-400 dark:text-slate-500 italic">
                                                      {"Sin asignar"}
                                                    </p>
                                                  ),
                                                b.map((y) =>
                                                  jsxRuntime.jsxs(
                                                    "div",
                                                    {
                                                      className: `group flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 hover:border-${i.light}-200 dark:hover:border-${i.light}-800 transition-all`,
                                                      children: [
                                                        <div className="flex items-center gap-2">
                                                          {[
                                                            (() => {
                                                              const D = pt.find(
                                                                  (B) =>
                                                                    B.id ===
                                                                    y.userId,
                                                                ),
                                                                L =
                                                                  getAvatarUrl(
                                                                    D?.photoThumbURL ||
                                                                      D?.photoURL ||
                                                                      y.userPhoto ||
                                                                      void 0,
                                                                  );
                                                              return L ? (
                                                                <OptimizedImage
                                                                  src={L}
                                                                  alt={
                                                                    y.userName
                                                                  }
                                                                  className={`w-8 h-8 rounded-lg ring-2 ${i.ring} avatar-image`}
                                                                />
                                                              ) : (
                                                                <div
                                                                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${i.bg} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
                                                                >
                                                                  {(
                                                                    y.userName ||
                                                                    "?"
                                                                  )
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                                </div>
                                                              );
                                                            })(),
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                              {y.userName}
                                                            </p>,
                                                          ]}
                                                        </div>,
                                                        o && (
                                                          <button
                                                            onClick={() => {
                                                              bs(y.id);
                                                            }}
                                                            disabled={
                                                              Nt === y.id
                                                            }
                                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                                            title="Remover asignación"
                                                          >
                                                            {Nt === y.id ? (
                                                              <LoaderCircleIcon
                                                                size={16}
                                                                className="animate-spin"
                                                              />
                                                            ) : (
                                                              <Trash2Icon
                                                                size={16}
                                                              />
                                                            )}
                                                          </button>
                                                        ),
                                                      ],
                                                    },
                                                    y.id,
                                                  ),
                                                ),
                                              ]}
                                            </div>,
                                            o && (
                                              <div
                                                className={`mt-3 ${n ? "ml-4" : ""}`}
                                              >
                                                <RenderComponent1
                                                  users={pt}
                                                  area={t}
                                                  role={f}
                                                  roleAssignments={b}
                                                  onAssign={(y) =>
                                                    fs(t.id, t.name, f, y)
                                                  }
                                                />
                                              </div>
                                            ),
                                          ]}
                                        </div>
                                      );
                                    })}
                                </div>,
                              ],
                            },
                            t.id,
                          );
                        })}
                    </div>,
                    V.filter(
                      (t) =>
                        !x?.activeMinistries ||
                        x.activeMinistries.includes(t.id),
                    ).length === 0 && (
                      <div className="text-center py-16 px-4">
                        <div className="max-w-md mx-auto">
                          {[
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                              <UsersIcon
                                size={40}
                                className="text-gray-400 dark:text-slate-500"
                              />
                            </div>,
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {"No hay ministerios activos"}
                            </h3>,
                            <p className="text-gray-500 dark:text-slate-400 mb-6">
                              {[
                                "Este evento aún no tiene ministerios asignados.",
                                " ",
                                H
                                  ? 'Haz clic en "Gestionar Ministerios" para comenzar a asignar equipos.'
                                  : "Contacta a un administrador para activar los ministerios necesarios.",
                              ]}
                            </p>,
                            E && (
                              <button
                                onClick={() => We(!0)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                              >
                                {[
                                  <PlusIcon size={20} />,
                                  "Gestionar Ministerios",
                                ]}
                              </button>
                            ),
                          ]}
                        </div>
                      </div>
                    ),
                  ]}
                </div>
              ),
              K === "repertoire" && (
                <div className="space-y-6">
                  {[
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {[
                        <div className="flex items-center gap-3 min-w-0">
                          {[
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
                              <MusicIcon size={20} />
                            </div>,
                            <div>
                              {[
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {"Repertorio Musical"}
                                </h2>,
                                <span className="text-sm text-gray-500 dark:text-slate-400">
                                  {[
                                    S.length,
                                    " ",
                                    S.length === 1 ? "canción" : "canciones",
                                  ]}
                                </span>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        $ && !bt && (
                          <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
                            {[
                              <button
                                onClick={is}
                                className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 text-sm"
                                title="Replicar repertorio desde otro evento de la semana"
                              >
                                {[<CopyIcon size={16} />, "Replicar"]}
                              </button>,
                              <button
                                onClick={ds}
                                disabled={xr}
                                className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Notificar a todos los asignados sobre el repertorio"
                              >
                                {[
                                  xr ? (
                                    <LoaderCircleIcon
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <BellIcon size={16} />
                                  ),
                                  "Notificar",
                                ]}
                              </button>,
                              <button
                                onClick={cs}
                                disabled={gr}
                                className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Recuperar canciones desde el último respaldo (replicateBackups)"
                              >
                                {[
                                  gr ? (
                                    <LoaderCircleIcon
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <DownloadIcon size={16} />
                                  ),
                                  "Recuperar",
                                ]}
                              </button>,
                              <button
                                onClick={() => {
                                  (se([]), ae(""), Ne(!0));
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                              >
                                {[<PlusIcon size={16} />, "Agregar"]}
                              </button>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                    bt && (
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 animate-fade-in">
                        {[
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            {P ? "Editar Canción" : "Nueva Canción"}
                          </h3>,
                          <form onSubmit={ys} className="space-y-4">
                            {[
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {[
                                  <div>
                                    {[
                                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                        {"Título"}
                                      </label>,
                                      <input
                                        name="title"
                                        defaultValue={P?.title}
                                        required={!0}
                                        className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Nombre de la canción"
                                      />,
                                    ]}
                                  </div>,
                                  <div>
                                    {[
                                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                        {"Tonalidad"}
                                      </label>,
                                      <div className="space-y-2">
                                        {[
                                          <div className="flex gap-2">
                                            {[
                                              <input
                                                type="text"
                                                value={Ee}
                                                onChange={(t) =>
                                                  ae(t.target.value)
                                                }
                                                onKeyDown={(t) => {
                                                  t.key === "Enter" &&
                                                    (t.preventDefault(),
                                                    Ee.trim() &&
                                                      (se((r) => [
                                                        ...r,
                                                        Ee.trim(),
                                                      ]),
                                                      ae("")));
                                                }}
                                                className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Ej: G, F#m, Am"
                                              />,
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  Ee.trim() &&
                                                    (se((t) => [
                                                      ...t,
                                                      Ee.trim(),
                                                    ]),
                                                    ae(""));
                                                }}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                                              >
                                                {[
                                                  <PlusIcon size={16} />,
                                                  "Agregar",
                                                ]}
                                              </button>,
                                            ]}
                                          </div>,
                                          vt.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                              {vt.map((t, r) => (
                                                <span
                                                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
                                                  key={r}
                                                >
                                                  {[
                                                    t,
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        se((s) =>
                                                          s.filter(
                                                            (i, a) => a !== r,
                                                          ),
                                                        )
                                                      }
                                                      className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"
                                                    >
                                                      {"×"}
                                                    </button>,
                                                  ]}
                                                </span>
                                              ))}
                                            </div>
                                          ),
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                ]}
                              </div>,
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {[
                                  <div className="space-y-2">
                                    {[
                                      <div>
                                        {[
                                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                            {"Enlace 1 (YouTube/Spotify)"}
                                          </label>,
                                          <input
                                            name="link"
                                            defaultValue={P?.link}
                                            type="url"
                                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="https://..."
                                          />,
                                        ]}
                                      </div>,
                                      <div>
                                        {[
                                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                            {"Referencia del enlace 1"}
                                          </label>,
                                          <input
                                            name="ref1"
                                            defaultValue={P?.ref1}
                                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Ej: Versión en español"
                                          />,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                  <div className="space-y-2">
                                    {[
                                      <div>
                                        {[
                                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                            {"Enlace 2 (opcional)"}
                                          </label>,
                                          <input
                                            name="link2"
                                            defaultValue={P?.link2}
                                            type="url"
                                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="https://..."
                                          />,
                                        ]}
                                      </div>,
                                      <div>
                                        {[
                                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                            {"Referencia del enlace 2"}
                                          </label>,
                                          <input
                                            name="ref2"
                                            defaultValue={P?.ref2}
                                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Ej: Versión en inglés"
                                          />,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                ]}
                              </div>,
                              <div>
                                {[
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                    {"Notas"}
                                  </label>,
                                  <textarea
                                    name="notes"
                                    defaultValue={P?.notes}
                                    rows={3}
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Detalles adicionales..."
                                  />,
                                ]}
                              </div>,
                              <div className="flex justify-end gap-3 pt-2">
                                {[
                                  <button
                                    type="button"
                                    onClick={() => {
                                      (Ne(!1), yt(null));
                                    }}
                                    className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  >
                                    {"Cancelar"}
                                  </button>,
                                  <button
                                    type="submit"
                                    disabled={Kt}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    {Kt ? (
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
                                      "Guardar"
                                    )}
                                  </button>,
                                ]}
                              </div>,
                            ]}
                          </form>,
                        ]}
                      </div>
                    ),
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                      {S.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-slate-700">
                          {S.map((t, r) =>
                            jsxRuntime.jsx(
                              "div",
                              {
                                className:
                                  "p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group",
                                children: (
                                  <div className="flex items-start gap-4">
                                    {[
                                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none">
                                        {r + 1}
                                      </div>,
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                          {[
                                            <div>
                                              {[
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                  {t.title}
                                                </h3>,
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                  {(() => {
                                                    const i = (
                                                      typeof t.key == "string"
                                                        ? t.key.split(",")
                                                        : Array.isArray(t.key)
                                                          ? t.key
                                                          : []
                                                    )
                                                      .map((a) =>
                                                        String(a).trim(),
                                                      )
                                                      .filter((a) => a);
                                                    return i.length > 0 ? (
                                                      i.map((a, o) => (
                                                        <span
                                                          className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-bold"
                                                          key={o}
                                                        >
                                                          {a}
                                                        </span>
                                                      ))
                                                    ) : (
                                                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 rounded-lg text-xs">
                                                        {"Sin tonalidad"}
                                                      </span>
                                                    );
                                                  })()}
                                                </div>,
                                                (t.link || t.link2) && (
                                                  <div className="flex flex-wrap gap-3 mt-2">
                                                    {[
                                                      t.link && (
                                                        <a
                                                          href={t.link}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                                        >
                                                          {[
                                                            <ExternalLinkIcon
                                                              size={14}
                                                            />,
                                                            t.ref1 ||
                                                              "Enlace 1",
                                                          ]}
                                                        </a>
                                                      ),
                                                      t.link2 && (
                                                        <a
                                                          href={t.link2}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                                                        >
                                                          {[
                                                            <ExternalLinkIcon
                                                              size={14}
                                                            />,
                                                            t.ref2 ||
                                                              "Enlace 2",
                                                          ]}
                                                        </a>
                                                      ),
                                                    ]}
                                                  </div>
                                                ),
                                                t.notes && (
                                                  <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600/50">
                                                    {[
                                                      <FileTextIcon
                                                        size={14}
                                                        className="text-gray-400 dark:text-slate-500 mt-0.5 flex-shrink-0"
                                                      />,
                                                      <p className="text-sm text-gray-600 dark:text-slate-300 whitespace-pre-line">
                                                        {t.notes}
                                                      </p>,
                                                    ]}
                                                  </div>
                                                ),
                                              ]}
                                            </div>,
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                              {[
                                                $ && (
                                                  <div className="flex flex-col gap-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {[
                                                      <button
                                                        onClick={() =>
                                                          Ar(t.id, "up")
                                                        }
                                                        disabled={
                                                          Ct !== null || r === 0
                                                        }
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Mover arriba"
                                                      >
                                                        <ChevronUpIcon
                                                          size={16}
                                                        />
                                                      </button>,
                                                      <button
                                                        onClick={() =>
                                                          Ar(t.id, "down")
                                                        }
                                                        disabled={
                                                          Ct !== null ||
                                                          r === S.length - 1
                                                        }
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Mover abajo"
                                                      >
                                                        <ChevronDownIcon
                                                          size={16}
                                                        />
                                                      </button>,
                                                    ]}
                                                  </div>
                                                ),
                                                t.link && !t.ref1 && (
                                                  <a
                                                    href={t.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
                                                    title="Enlace 1"
                                                  >
                                                    <ExternalLinkIcon
                                                      size={18}
                                                    />
                                                  </a>
                                                ),
                                                t.link2 && !t.ref2 && (
                                                  <a
                                                    href={t.link2}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                                                    title="Enlace 2"
                                                  >
                                                    <ExternalLinkIcon
                                                      size={18}
                                                    />
                                                  </a>
                                                ),
                                                $ && (
                                                  <jsxRuntime.Fragment>
                                                    {[
                                                      <button
                                                        onClick={() => js(t)}
                                                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Editar"
                                                      >
                                                        <SquarePenIcon
                                                          size={18}
                                                        />
                                                      </button>,
                                                      <button
                                                        onClick={() => ks(t)}
                                                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Eliminar"
                                                      >
                                                        <Trash2Icon size={18} />
                                                      </button>,
                                                    ]}
                                                  </jsxRuntime.Fragment>
                                                ),
                                              ]}
                                            </div>,
                                          ]}
                                        </div>
                                      </div>,
                                    ]}
                                  </div>
                                ),
                              },
                              t.id,
                            ),
                          )}
                        </div>
                      ) : (
                        !bt && (
                          <div className="text-center py-16 px-4">
                            {[
                              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <MusicIcon
                                  size={36}
                                  className="text-indigo-500 dark:text-indigo-400"
                                />
                              </div>,
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {"Sin repertorio"}
                              </h3>,
                              <p className="text-gray-500 dark:text-slate-400 mb-4">
                                {"Aún no hay canciones agregadas a este evento"}
                              </p>,
                              $ && (
                                <button
                                  onClick={() => {
                                    (se([]), ae(""), Ne(!0));
                                  }}
                                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                                >
                                  {[
                                    <PlusIcon size={18} />,
                                    "Agregar primera canción",
                                  ]}
                                </button>
                              ),
                            ]}
                          </div>
                        )
                      )}
                    </div>,
                  ]}
                </div>
              ),
              K === "materials" && (
                <div className="space-y-6">
                  {[
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {[
                        <div className="flex items-center gap-3 min-w-0">
                          {[
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md">
                              <FileTextIcon size={20} />
                            </div>,
                            <div>
                              {[
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {"Materiales"}
                                </h2>,
                                <span className="text-sm text-gray-500 dark:text-slate-400">
                                  {[
                                    X.length,
                                    " material",
                                    X.length !== 1 ? "es" : "",
                                  ]}
                                </span>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        $ && (
                          <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
                            {[
                              <button
                                onClick={ms}
                                disabled={Y}
                                className="px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Replicar materiales desde otro evento de la semana"
                              >
                                {[
                                  <CopyIcon size={16} />,
                                  <span className="hidden sm:inline">
                                    {"Replicar"}
                                  </span>,
                                ]}
                              </button>,
                              <button
                                onClick={us}
                                disabled={jr || Y}
                                className="px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Notificar a todos los asignados sobre los materiales"
                              >
                                {[
                                  jr ? (
                                    <LoaderCircleIcon
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <BellIcon size={16} />
                                  ),
                                  <span className="hidden sm:inline">
                                    {"Notificar"}
                                  </span>,
                                ]}
                              </button>,
                              <button
                                onClick={ps}
                                disabled={Nr || Y}
                                className="px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Recupera materiales desde el último respaldo y desde Storage"
                              >
                                {[
                                  Nr ? (
                                    <LoaderCircleIcon
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <DownloadIcon size={16} />
                                  ),
                                  <span className="hidden sm:inline">
                                    {"Recuperar"}
                                  </span>,
                                ]}
                              </button>,
                              !Y && (
                                <button
                                  onClick={() => {
                                    (Ke(""), Se(!0));
                                  }}
                                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                                >
                                  {[
                                    <PlusIcon size={16} />,
                                    <span>{"Agregar"}</span>,
                                  ]}
                                </button>
                              ),
                              <button
                                onClick={() => qt(!0)}
                                className="p-2 text-gray-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                                title="Gestionar Biblioteca"
                              >
                                <FileTextIcon size={20} />
                              </button>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                    Y && (
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 animate-fade-in">
                        {[
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            {k ? "Editar Material" : "Nuevo Material"}
                          </h3>,
                          <form onSubmit={ws} className="space-y-4">
                            {[
                              <div>
                                {[
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                    {"Material"}
                                  </label>,
                                  <input
                                    name="title"
                                    list="library-suggestions"
                                    defaultValue={k?.title}
                                    required={!0}
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Nombre del material"
                                    onChange={(t) => {
                                      const r = Ce.find(
                                        (s) => s.title === t.target.value,
                                      );
                                      if (r && r.url) {
                                        const s =
                                          document.querySelector(
                                            'input[name="url"]',
                                          );
                                        s && (s.value = r.url);
                                      }
                                    }}
                                  />,
                                  <datalist id="library-suggestions">
                                    {Ce.map((t) =>
                                      jsxRuntime.jsx(
                                        "option",
                                        {
                                          value: t.title,
                                        },
                                        t.id,
                                      ),
                                    )}
                                  </datalist>,
                                ]}
                              </div>,
                              <div>
                                {[
                                  <SelectPicker
                                    label="Canción Relacionada (Opcional)"
                                    value={Vt}
                                    onChange={Ke}
                                    placeholder="Ninguna"
                                    options={[
                                      {
                                        value: "",
                                        label: "Ninguna",
                                        icon: (
                                          <MusicIcon
                                            size={16}
                                            className="text-gray-400"
                                          />
                                        ),
                                      },
                                      ...S.map((t) => ({
                                        value: t.id,
                                        label: t.title,
                                        icon: (
                                          <MusicIcon
                                            size={16}
                                            className="text-indigo-500"
                                          />
                                        ),
                                      })),
                                    ]}
                                  />,
                                  <input
                                    type="hidden"
                                    name="songId"
                                    value={Vt}
                                  />,
                                ]}
                              </div>,
                              <div>
                                {[
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                    {"Contenido"}
                                  </label>,
                                  <div className="space-y-2">
                                    {[
                                      <input
                                        name="url"
                                        defaultValue={
                                          k?.type === "link" ? k.url : ""
                                        }
                                        type="url"
                                        className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="https://..."
                                      />,
                                      <div className="text-center text-sm text-gray-400">
                                        {"- O -"}
                                      </div>,
                                      k?.type === "file" && !pe && (
                                        <div className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 mb-2">
                                          {[
                                            <FileIcon
                                              size={16}
                                              className="text-indigo-600 dark:text-indigo-400"
                                            />,
                                            <span className="text-sm text-indigo-700 dark:text-indigo-300 truncate">
                                              {[
                                                "Archivo actual:",
                                                " ",
                                                k.filename || "Sin nombre",
                                              ]}
                                            </span>,
                                          ]}
                                        </div>
                                      ),
                                      <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer relative min-h-[120px] flex items-center justify-center">
                                        {pe ? (
                                          <div className="flex flex-col items-center gap-2 w-full">
                                            {[
                                              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                <FileIcon size={28} />
                                              </div>,
                                              <p className="text-sm font-medium text-gray-700 dark:text-slate-300 truncate max-w-full px-4">
                                                {pe.name}
                                              </p>,
                                              <p className="text-xs text-gray-400">
                                                {[
                                                  (pe.size / 1024).toFixed(1),
                                                  " KB",
                                                ]}
                                              </p>,
                                              <button
                                                type="button"
                                                onClick={(t) => {
                                                  (t.stopPropagation(),
                                                    He(null));
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                                title="Eliminar archivo"
                                              >
                                                <Trash2Icon size={16} />
                                              </button>,
                                            ]}
                                          </div>
                                        ) : (
                                          <jsxRuntime.Fragment>
                                            {[
                                              <input
                                                type="file"
                                                name="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(t) => {
                                                  const r = t.currentTarget,
                                                    s = r.files?.[0];
                                                  if (s) {
                                                    if (((r.value = ""), pe)) {
                                                      R.showInfo(
                                                        "Ya seleccionaste un archivo. Para elegir otro, elimina el archivo seleccionado (botón rojo) y vuelve a escoger.",
                                                        "Solo un archivo",
                                                      );
                                                      return;
                                                    }
                                                    if (
                                                      k?.type === "file" &&
                                                      k.filename
                                                    ) {
                                                      (async () =>
                                                        (await R.confirm({
                                                          title:
                                                            "Reemplazar archivo",
                                                          message: `Este material ya tiene un archivo (${k.filename}).

¿Deseas reemplazarlo por ${s.name}?
El archivo anterior se eliminará al guardar.`,
                                                          confirmText:
                                                            "Reemplazar",
                                                          confirmColor: "red",
                                                        })) && He(s))();
                                                      return;
                                                    }
                                                    He(s);
                                                  }
                                                }}
                                              />,
                                              <div className="flex flex-col items-center gap-2">
                                                {[
                                                  <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                                                    <UploadIcon className="h-6 w-6 text-gray-400" />
                                                  </div>,
                                                  <p className="text-sm text-gray-500 dark:text-slate-400">
                                                    {k?.type === "file"
                                                      ? "Click para reemplazar archivo"
                                                      : "Click para subir archivo"}
                                                  </p>,
                                                  <p className="text-xs text-gray-400">
                                                    {"PDF, DOC, JPG, PNG..."}
                                                  </p>,
                                                ]}
                                              </div>,
                                            ]}
                                          </jsxRuntime.Fragment>
                                        )}
                                      </div>,
                                    ]}
                                  </div>,
                                ]}
                              </div>,
                              <div className="flex justify-end gap-3 pt-2">
                                {[
                                  <button
                                    type="button"
                                    onClick={() => {
                                      (Se(!1), jt(null));
                                    }}
                                    className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  >
                                    {"Cancelar"}
                                  </button>,
                                  <button
                                    type="submit"
                                    disabled={Zt}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    {Zt ? (
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
                                      "Guardar"
                                    )}
                                  </button>,
                                ]}
                              </div>,
                            ]}
                          </form>,
                        ]}
                      </div>
                    ),
                    <div className="grid gap-4">
                      {X.map((t) =>
                        jsxRuntime.jsx(
                          "div",
                          {
                            className:
                              "relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-lg hover:scale-[1.01]",
                            children: (
                              <div className="flex items-center gap-4">
                                {[
                                  <div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${t.type === "file" ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white" : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"}`}
                                  >
                                    {t.type === "file" ? (
                                      <FileIcon size={24} />
                                    ) : (
                                      <LinkIcon size={24} />
                                    )}
                                  </div>,
                                  <div className="flex-1 min-w-0">
                                    {[
                                      <h3 className="font-bold text-gray-900 dark:text-white text-lg break-words pr-1">
                                        {t.title}
                                      </h3>,
                                      t.songTitle && (
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                            {[
                                              <MusicIcon size={10} />,
                                              t.songTitle,
                                            ]}
                                          </span>
                                        </div>
                                      ),
                                      <div className="flex items-center gap-2 mt-2">
                                        <span
                                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.type === "file" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"}`}
                                        >
                                          {t.type === "file"
                                            ? "Archivo"
                                            : "Enlace"}
                                        </span>
                                      </div>,
                                    ]}
                                  </div>,
                                  t.type === "file" ? (
                                    <button
                                      onClick={() => Ts(t)}
                                      disabled={lr === t.id}
                                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100"
                                    >
                                      {lr === t.id ? (
                                        <jsxRuntime.Fragment>
                                          {[
                                            <LoaderCircleIcon
                                              size={16}
                                              className="animate-spin"
                                            />,
                                            <span className="hidden sm:inline">
                                              {"Descargando..."}
                                            </span>,
                                          ]}
                                        </jsxRuntime.Fragment>
                                      ) : (
                                        <jsxRuntime.Fragment>
                                          {[
                                            <DownloadIcon size={16} />,
                                            <span className="hidden sm:inline">
                                              {"Descargar"}
                                            </span>,
                                          ]}
                                        </jsxRuntime.Fragment>
                                      )}
                                    </button>
                                  ) : (
                                    <a
                                      href={t.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
                                    >
                                      {[
                                        <ExternalLinkIcon size={16} />,
                                        <span className="hidden sm:inline">
                                          {"Abrir"}
                                        </span>,
                                      ]}
                                    </a>
                                  ),
                                  $ && (
                                    <div className="flex items-center gap-1">
                                      {[
                                        <button
                                          onClick={() => Ss(t)}
                                          className="p-2 text-gray-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-white/50 dark:bg-slate-800/50 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all"
                                          title="Editar"
                                        >
                                          <SquarePenIcon size={16} />
                                        </button>,
                                        <button
                                          onClick={() => Es(t)}
                                          className="p-2 text-gray-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-white/50 dark:bg-slate-800/50 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all"
                                          title="Eliminar"
                                        >
                                          <Trash2Icon size={16} />
                                        </button>,
                                      ]}
                                    </div>
                                  ),
                                ]}
                              </div>
                            ),
                          },
                          t.id,
                        ),
                      )}
                    </div>,
                    X.length === 0 && !Y && (
                      <div className="text-center py-16">
                        {[
                          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center">
                            <FileTextIcon
                              size={40}
                              className="text-emerald-400"
                            />
                          </div>,
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">
                            {"Sin materiales"}
                          </h3>,
                          <p className="text-gray-500 dark:text-slate-400 text-sm">
                            {"No hay materiales adjuntos a este evento"}
                          </p>,
                          $ && (
                            <button
                              onClick={() => {
                                (Ke(""), Se(!0));
                              }}
                              className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                            >
                              {[
                                <PlusIcon size={16} className="inline mr-2" />,
                                "Agregar primer material",
                              ]}
                            </button>
                          ),
                        ]}
                      </div>
                    ),
                    <Modal
                      isOpen={wt}
                      onClose={() => qt(!1)}
                      title="Biblioteca de Materiales"
                      maxWidth="max-w-2xl"
                    >
                      <div className="space-y-6">
                        {[
                          <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                            {[
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                {"Agregar Nuevo Material a la Biblioteca"}
                              </h4>,
                              <form onSubmit={As} className="space-y-3">
                                {[
                                  <div>
                                    <input
                                      name="title"
                                      required={!0}
                                      className="w-full p-2 text-sm rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                      placeholder="Nombre del material (Ej: Guía de Alabanza)"
                                    />
                                  </div>,
                                  <button
                                    type="submit"
                                    disabled={ar}
                                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {ar ? (
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
                                      <jsxRuntime.Fragment>
                                        {[
                                          <PlusIcon size={16} />,
                                          "Guardar en Biblioteca",
                                        ]}
                                      </jsxRuntime.Fragment>
                                    )}
                                  </button>,
                                ]}
                              </form>,
                            ]}
                          </div>,
                          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {[
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-slate-800 py-2">
                                {["Materiales Guardados (", Ce.length, ")"]}
                              </h4>,
                              qr ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                  {[
                                    <div className="relative mb-3">
                                      {[
                                        <div className="w-8 h-8 rounded-full border-3 border-indigo-100 dark:border-indigo-900/30" />,
                                        <div className="absolute inset-0 w-8 h-8 rounded-full border-3 border-transparent border-t-indigo-500 animate-spin" />,
                                      ]}
                                    </div>,
                                    <span className="text-sm animate-pulse">
                                      {"Cargando biblioteca..."}
                                    </span>,
                                  ]}
                                </div>
                              ) : Ce.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-lg">
                                  {[
                                    <FileTextIcon
                                      size={32}
                                      className="mx-auto mb-2 opacity-20"
                                    />,
                                    <p className="text-sm">
                                      {"La biblioteca está vacía"}
                                    </p>,
                                  ]}
                                </div>
                              ) : (
                                Ce.map((t) =>
                                  jsxRuntime.jsxs(
                                    "div",
                                    {
                                      className:
                                        "group flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors",
                                      children: [
                                        <div className="flex items-center gap-3 overflow-hidden">
                                          {[
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                              <FileTextIcon size={16} />
                                            </div>,
                                            <div className="min-w-0">
                                              {[
                                                <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                  {t.title}
                                                </h5>,
                                                t.url && (
                                                  <a
                                                    href={t.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-indigo-500 hover:underline truncate block"
                                                  >
                                                    {"Ver enlace"}
                                                  </a>
                                                ),
                                              ]}
                                            </div>,
                                          ]}
                                        </div>,
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                          {H && (
                                            <button
                                              onClick={() => Ms(t.id)}
                                              disabled={Et === t.id}
                                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                              title="Eliminar de biblioteca"
                                            >
                                              {Et === t.id ? (
                                                <LoaderCircleIcon
                                                  size={14}
                                                  className="animate-spin"
                                                />
                                              ) : (
                                                <Trash2Icon size={14} />
                                              )}
                                            </button>
                                          )}
                                        </div>,
                                      ],
                                    },
                                    t.id,
                                  ),
                                )
                              ),
                            ]}
                          </div>,
                        ]}
                      </div>
                    </Modal>,
                  ]}
                </div>
              ),
              K === "attendance" && (
                <div className="space-y-6">
                  {(() => {
                    const t = (
                      Q() ? q.filter((r) => re.includes(r.areaId)) : q
                    ).filter((row) => row.attendanceVisible === true);
                    return (
                      <jsxRuntime.Fragment>
                        {[
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {[
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                                  <CircleCheckBigIcon size={20} />
                                </div>,
                                <div>
                                  {[
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                      {"Control de Asistencia"}
                                    </h2>,
                                    <span className="text-sm text-gray-500 dark:text-slate-400">
                                      {[
                                        t.filter(
                                          (r) =>
                                            r.checkInTime || r.checkOutTime,
                                        ).length,
                                        " ",
                                        "de ",
                                        t.length,
                                        " presentes",
                                      ]}
                                    </span>,
                                  ]}
                                </div>,
                              ]}
                            </div>
                          </div>,
                          <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                {[
                                  <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-slate-700">
                                      {[
                                        <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                          {"Servidor"}
                                        </th>,
                                        <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                          {"Rol"}
                                        </th>,
                                        <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wider text-center">
                                          {"Entrada"}
                                        </th>,
                                        <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wider text-center">
                                          {"Salida"}
                                        </th>,
                                        <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wider text-center">
                                          {"Estado"}
                                        </th>,
                                      ]}
                                    </tr>
                                  </thead>,
                                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {t.length === 0 ? (
                                      <tr>
                                        <td
                                          colSpan={5}
                                          className="px-6 py-12 text-center"
                                        >
                                          <div className="flex flex-col items-center">
                                            {[
                                              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                                                <CircleCheckBigIcon
                                                  size={32}
                                                  className="text-gray-300 dark:text-slate-500"
                                                />
                                              </div>,
                                              <p className="text-gray-500 dark:text-slate-400 font-medium">
                                                {"No hay asignaciones"}
                                              </p>,
                                              <p className="text-sm text-gray-400 dark:text-slate-500">
                                                {Q()
                                                  ? "No hay voluntarios de tu ministerio asignados"
                                                  : "Agrega voluntarios para ver su asistencia"}
                                              </p>,
                                            ]}
                                          </div>
                                        </td>
                                      </tr>
                                    ) : (
                                      t.map((r, s) => {
                                        const a = (() => {
                                          const o = new Date(),
                                            n =
                                              x.serviceTime ||
                                              x.time ||
                                              "23:59",
                                            d = new Date(
                                              x.date + "T" + n + ":00",
                                            ),
                                            p = new Date(
                                              d.getTime() + 480 * 60 * 1e3,
                                            ),
                                            u =
                                              x.status === "completed" || o > p;
                                          return !r.checkInTime &&
                                            r.checkOutTime
                                            ? {
                                                label: "Sin entrada",
                                                bg: "bg-amber-100 dark:bg-amber-900/30",
                                                text: "text-amber-700 dark:text-amber-400",
                                              }
                                            : r.checkInTime && !r.checkOutTime
                                              ? {
                                                  label: "Sin salida",
                                                  bg: "bg-amber-100 dark:bg-amber-900/30",
                                                  text: "text-amber-700 dark:text-amber-400",
                                                }
                                              : r.checkInTime && r.checkOutTime
                                                ? {
                                                    label: "Presente",
                                                    bg: "bg-green-100 dark:bg-green-900/30",
                                                    text: "text-green-700 dark:text-green-400",
                                                  }
                                                : u
                                                  ? {
                                                      label: "Ausente",
                                                      bg: "bg-red-100 dark:bg-red-900/30",
                                                      text: "text-red-700 dark:text-red-400",
                                                    }
                                                  : {
                                                      label: "Pendiente",
                                                      bg: "bg-gray-100 dark:bg-slate-700",
                                                      text: "text-gray-600 dark:text-slate-400",
                                                    };
                                        })();
                                        return jsxRuntime.jsxs(
                                          "tr",
                                          {
                                            className: `hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${s % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50/50 dark:bg-slate-800/50"}`,
                                            children: [
                                              <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                  {[
                                                    r.userPhoto ? (
                                                      <OptimizedImage
                                                        src={r.userPhoto}
                                                        alt={r.userName}
                                                        className="w-10 h-10 rounded-full shadow-md avatar-image"
                                                      />
                                                    ) : (
                                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                        {r.userName
                                                          .charAt(0)
                                                          .toUpperCase()}
                                                      </div>
                                                    ),
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                      {r.userName}
                                                    </span>,
                                                  ]}
                                                </div>
                                              </td>,
                                              <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                                                  {(() => {
                                                    const o = normalizeRoleId(
                                                      r.roleName,
                                                    );
                                                    return o
                                                      ? `${r.areaName} - ${o}`
                                                      : r.areaName;
                                                  })()}
                                                </span>
                                              </td>,
                                              <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                  {[
                                                    <span
                                                      className={`font-semibold ${r.checkInTime ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
                                                    >
                                                      {r.checkInTime
                                                        ? new Date(
                                                            r.checkInTime,
                                                          ).toLocaleTimeString(
                                                            [],
                                                            {
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                            },
                                                          )
                                                        : "—"}
                                                    </span>,
                                                    r.checkInPhoto && (
                                                      <button
                                                        onClick={() =>
                                                          st(r.checkInPhoto)
                                                        }
                                                        className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                        title="Ver foto de entrada"
                                                      >
                                                        <ImageIcon size={16} />
                                                      </button>
                                                    ),
                                                    r.checkInLocation && (
                                                      <button
                                                        onClick={() =>
                                                          Te({
                                                            title:
                                                              "Ubicación de entrada",
                                                            lat: r
                                                              .checkInLocation
                                                              .lat,
                                                            lng: r
                                                              .checkInLocation
                                                              .lng,
                                                            accuracyMeters:
                                                              r.checkInLocation
                                                                .accuracyMeters ??
                                                              void 0,
                                                            capturedAt:
                                                              r.checkInLocation
                                                                .capturedAt,
                                                          })
                                                        }
                                                        className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                        title="Ver ubicación de entrada"
                                                      >
                                                        <MapPinIcon size={16} />
                                                      </button>
                                                    ),
                                                  ]}
                                                </div>
                                              </td>,
                                              <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                  {[
                                                    <span
                                                      className={`font-semibold ${r.checkOutTime ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
                                                    >
                                                      {r.checkOutTime
                                                        ? new Date(
                                                            r.checkOutTime,
                                                          ).toLocaleTimeString(
                                                            [],
                                                            {
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                            },
                                                          )
                                                        : "—"}
                                                    </span>,
                                                    r.checkOutPhoto && (
                                                      <button
                                                        onClick={() =>
                                                          st(r.checkOutPhoto)
                                                        }
                                                        className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                        title="Ver foto de salida"
                                                      >
                                                        <ImageIcon size={16} />
                                                      </button>
                                                    ),
                                                    r.checkOutLocation && (
                                                      <button
                                                        onClick={() =>
                                                          Te({
                                                            title:
                                                              "Ubicación de salida",
                                                            lat: r
                                                              .checkOutLocation
                                                              .lat,
                                                            lng: r
                                                              .checkOutLocation
                                                              .lng,
                                                            accuracyMeters:
                                                              r.checkOutLocation
                                                                .accuracyMeters ??
                                                              void 0,
                                                            capturedAt:
                                                              r.checkOutLocation
                                                                .capturedAt,
                                                          })
                                                        }
                                                        className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                        title="Ver ubicación de salida"
                                                      >
                                                        <MapPinIcon size={16} />
                                                      </button>
                                                    ),
                                                  ]}
                                                </div>
                                              </td>,
                                              <td className="px-6 py-4 text-center">
                                                <span
                                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${a.bg} ${a.text}`}
                                                >
                                                  {a.label}
                                                </span>
                                              </td>,
                                            ],
                                          },
                                          r.id,
                                        );
                                      })
                                    )}
                                  </tbody>,
                                ]}
                              </table>
                            </div>
                          </div>,
                          <div className="md:hidden space-y-4">
                            {t.length === 0 ? (
                              <div className="bg-white dark:bg-slate-800 rounded-2xl py-12 px-4 text-center border border-gray-100 dark:border-slate-700 shadow-sm">
                                <div className="flex flex-col items-center">
                                  {[
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                                      <CircleCheckBigIcon
                                        size={32}
                                        className="text-gray-300 dark:text-slate-500"
                                      />
                                    </div>,
                                    <p className="text-gray-500 dark:text-slate-400 font-medium">
                                      {"No hay asignaciones"}
                                    </p>,
                                    <p className="text-sm text-gray-400 dark:text-slate-500 text-balance mt-1">
                                      {Q()
                                        ? "No hay voluntarios de tu ministerio asignados"
                                        : "Agrega voluntarios para ver su asistencia"}
                                    </p>,
                                  ]}
                                </div>
                              </div>
                            ) : (
                              t.map((r) => {
                                const i = (() => {
                                  const a = new Date(),
                                    o = x.serviceTime || x.time || "23:59",
                                    n = new Date(x.date + "T" + o + ":00"),
                                    d = new Date(n.getTime() + 480 * 60 * 1e3),
                                    p = x.status === "completed" || a > d;
                                  return !r.checkInTime && r.checkOutTime
                                    ? {
                                        label: "Sin entrada",
                                        bg: "bg-amber-100 dark:bg-amber-900/30",
                                        text: "text-amber-700 dark:text-amber-400",
                                      }
                                    : r.checkInTime && !r.checkOutTime
                                      ? {
                                          label: "Sin salida",
                                          bg: "bg-amber-100 dark:bg-amber-900/30",
                                          text: "text-amber-700 dark:text-amber-400",
                                        }
                                      : r.checkInTime && r.checkOutTime
                                        ? {
                                            label: "Presente",
                                            bg: "bg-green-100 dark:bg-green-900/30",
                                            text: "text-green-700 dark:text-green-400",
                                          }
                                        : p
                                          ? {
                                              label: "Ausente",
                                              bg: "bg-red-100 dark:bg-red-900/30",
                                              text: "text-red-700 dark:text-red-400",
                                            }
                                          : {
                                              label: "Pendiente",
                                              bg: "bg-gray-100 dark:bg-slate-700",
                                              text: "text-gray-600 dark:text-slate-400",
                                            };
                                })();
                                return jsxRuntime.jsxs(
                                  "div",
                                  {
                                    className:
                                      "bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 relative overflow-hidden",
                                    children: [
                                      <div
                                        className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg ${i.bg} ${i.text}`}
                                      >
                                        {i.label}
                                      </div>,
                                      <div className="flex gap-4">
                                        {[
                                          r.userPhoto ? (
                                            <OptimizedImage
                                              src={r.userPhoto}
                                              alt={r.userName}
                                              className="w-12 h-12 rounded-xl shadow-sm object-cover"
                                            />
                                          ) : (
                                            <div className="min-w-[48px] h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                              {r.userName
                                                .charAt(0)
                                                .toUpperCase()}
                                            </div>
                                          ),
                                          <div className="flex-1 min-w-0 pt-0.5">
                                            {[
                                              <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                                {r.userName}
                                              </h3>,
                                              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium truncate">
                                                {(() => {
                                                  const a = normalizeRoleId(
                                                    r.roleName,
                                                  );
                                                  return a
                                                    ? `${r.areaName} - ${a}`
                                                    : r.areaName;
                                                })()}
                                              </p>,
                                            ]}
                                          </div>,
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
                                                  <span
                                                    className={`text-sm font-bold ${r.checkInTime ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-slate-600"}`}
                                                  >
                                                    {r.checkInTime
                                                      ? new Date(
                                                          r.checkInTime,
                                                        ).toLocaleTimeString(
                                                          [],
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          },
                                                        )
                                                      : "--:--"}
                                                  </span>,
                                                  <div className="flex -space-x-1">
                                                    {[
                                                      r.checkInPhoto && (
                                                        <button
                                                          onClick={() =>
                                                            st(r.checkInPhoto)
                                                          }
                                                          className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-transparent hover:border-indigo-200 transition-colors"
                                                        >
                                                          <ImageIcon
                                                            size={12}
                                                          />
                                                        </button>
                                                      ),
                                                      r.checkInLocation && (
                                                        <button
                                                          onClick={() =>
                                                            Te({
                                                              title:
                                                                "Ubicación de entrada",
                                                              lat: r
                                                                .checkInLocation
                                                                .lat,
                                                              lng: r
                                                                .checkInLocation
                                                                .lng,
                                                              accuracyMeters:
                                                                r
                                                                  .checkInLocation
                                                                  .accuracyMeters ??
                                                                void 0,
                                                              capturedAt:
                                                                r
                                                                  .checkInLocation
                                                                  .capturedAt,
                                                            })
                                                          }
                                                          className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-transparent hover:border-emerald-200 transition-colors"
                                                        >
                                                          <MapPinIcon
                                                            size={12}
                                                          />
                                                        </button>
                                                      ),
                                                    ]}
                                                  </div>,
                                                ]}
                                              </div>,
                                            ]}
                                          </div>,
                                          <div className="space-y-1">
                                            {[
                                              <span className="text-xs text-gray-500 dark:text-slate-400 block font-medium">
                                                {"SALIDA"}
                                              </span>,
                                              <div className="flex items-center gap-2">
                                                {[
                                                  <span
                                                    className={`text-sm font-bold ${r.checkOutTime ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-slate-600"}`}
                                                  >
                                                    {r.checkOutTime
                                                      ? new Date(
                                                          r.checkOutTime,
                                                        ).toLocaleTimeString(
                                                          [],
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          },
                                                        )
                                                      : "--:--"}
                                                  </span>,
                                                  <div className="flex -space-x-1">
                                                    {[
                                                      r.checkOutPhoto && (
                                                        <button
                                                          onClick={() =>
                                                            st(r.checkOutPhoto)
                                                          }
                                                          className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-transparent hover:border-indigo-200 transition-colors"
                                                        >
                                                          <ImageIcon
                                                            size={12}
                                                          />
                                                        </button>
                                                      ),
                                                      r.checkOutLocation && (
                                                        <button
                                                          onClick={() =>
                                                            Te({
                                                              title:
                                                                "Ubicación de salida",
                                                              lat: r
                                                                .checkOutLocation
                                                                .lat,
                                                              lng: r
                                                                .checkOutLocation
                                                                .lng,
                                                              accuracyMeters:
                                                                r
                                                                  .checkOutLocation
                                                                  .accuracyMeters ??
                                                                void 0,
                                                              capturedAt:
                                                                r
                                                                  .checkOutLocation
                                                                  .capturedAt,
                                                            })
                                                          }
                                                          className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-transparent hover:border-emerald-200 transition-colors"
                                                        >
                                                          <MapPinIcon
                                                            size={12}
                                                          />
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
                                    ],
                                  },
                                  r.id,
                                );
                              })
                            )}
                          </div>,
                        ]}
                      </jsxRuntime.Fragment>
                    );
                  })()}
                </div>
              ),
            ]}
          </div>,
          <Modal
            isOpen={Ve.isOpen}
            onClose={() =>
              qe({
                isOpen: !1,
                songId: null,
                songTitle: "",
              })
            }
            title=""
            maxWidth="max-w-md"
          >
            <div className="text-center py-4">
              {[
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Trash2Icon size={32} className="text-red-500" />
                </div>,
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {"Eliminar Canción"}
                </h3>,
                <p className="text-gray-500 dark:text-slate-400 mb-2">
                  {"¿Estás seguro de eliminar esta canción?"}
                </p>,
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {['"', Ve.songTitle, '"']}
                </p>,
                <div className="flex gap-3 justify-center">
                  {[
                    <button
                      onClick={() =>
                        qe({
                          isOpen: !1,
                          songId: null,
                          songTitle: "",
                        })
                      }
                      className="px-6 py-2.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
                    >
                      {"Cancelar"}
                    </button>,
                    <button
                      onClick={() => Ve.songId && vs(Ve.songId)}
                      disabled={Yt}
                      className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {Yt ? (
                        <jsxRuntime.Fragment>
                          {[
                            <LoaderCircleIcon
                              size={18}
                              className="animate-spin"
                            />,
                            "Eliminando...",
                          ]}
                        </jsxRuntime.Fragment>
                      ) : (
                        <jsxRuntime.Fragment>
                          {[<Trash2Icon size={18} />, "Eliminar"]}
                        </jsxRuntime.Fragment>
                      )}
                    </button>,
                  ]}
                </div>,
              ]}
            </div>
          </Modal>,
          <Modal
            isOpen={Xe.isOpen}
            onClose={() =>
              Ye({
                isOpen: !1,
                materialId: null,
                materialTitle: "",
              })
            }
            title=""
            maxWidth="max-w-md"
          >
            <div className="text-center py-4">
              {[
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Trash2Icon size={32} className="text-red-500" />
                </div>,
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {"Eliminar Material"}
                </h3>,
                <p className="text-gray-500 dark:text-slate-400 mb-2">
                  {"¿Estás seguro de eliminar este material?"}
                </p>,
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {['"', Xe.materialTitle, '"']}
                </p>,
                <div className="flex gap-3 justify-center">
                  {[
                    <button
                      onClick={() =>
                        Ye({
                          isOpen: !1,
                          materialId: null,
                          materialTitle: "",
                        })
                      }
                      className="px-6 py-2.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
                    >
                      {"Cancelar"}
                    </button>,
                    <button
                      onClick={() => Xe.materialId && Ns(Xe.materialId)}
                      disabled={er}
                      className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {er ? (
                        <jsxRuntime.Fragment>
                          {[
                            <LoaderCircleIcon
                              size={18}
                              className="animate-spin"
                            />,
                            "Eliminando...",
                          ]}
                        </jsxRuntime.Fragment>
                      ) : (
                        <jsxRuntime.Fragment>
                          {[<Trash2Icon size={18} />, "Eliminar"]}
                        </jsxRuntime.Fragment>
                      )}
                    </button>,
                  ]}
                </div>,
              ]}
            </div>
          </Modal>,
          <Modal
            isOpen={!!be}
            onClose={ts}
            title="Evidencia de Asistencia"
            maxWidth="max-w-lg"
          >
            {be && (
              <div className="space-y-4">
                {[
                  <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-900">
                    {Qr ? (
                      <div className="w-full h-[240px] flex items-center justify-center text-gray-500 dark:text-slate-400">
                        <LoaderCircleIcon size={20} className="animate-spin" />
                      </div>
                    ) : Tt ? (
                      <PrivateImage
                        src={Tt}
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
                      href={Tt || undefined}
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
            isOpen={!!I}
            onClose={() => Te(null)}
            title={I?.title ?? "Ubicación"}
            maxWidth="max-w-2xl"
          >
            {I && (
              <div className="space-y-4">
                {[
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900">
                    {[
                      rs && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center text-gray-500 dark:text-slate-400">
                          <LoaderCircleIcon
                            size={20}
                            className="animate-spin"
                          />
                        </div>
                      ),
                      ss ? (
                        <div className="w-full h-[320px] flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">
                          {"No se pudo cargar el mapa."}
                        </div>
                      ) : Dt ? (
                        <iframe
                          title={I.title}
                          src={Dt}
                          className="w-full h-[320px]"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onLoad={() => at(!1)}
                          onError={() => {
                            (at(!1), zt(!0));
                          }}
                          key={Dt}
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
                          I.lat.toFixed(6),
                          ", ",
                          I.lng.toFixed(6),
                        ]}
                      </div>,
                      typeof I.accuracyMeters == "number" && (
                        <div>
                          {[
                            <span className="font-semibold">
                              {"Precisión aprox.:"}
                            </span>,
                            " ",
                            Math.round(I.accuracyMeters),
                            " m",
                          ]}
                        </div>
                      ),
                      I.capturedAt && (
                        <div>
                          {[
                            <span className="font-semibold">
                              {"Capturado:"}
                            </span>,
                            " ",
                            new Date(I.capturedAt).toLocaleString(),
                          ]}
                        </div>
                      ),
                    ]}
                  </div>,
                  <div className="flex justify-end">
                    <a
                      href={`https://www.google.com/maps?q=${encodeURIComponent(`${I.lat},${I.lng}`)}`}
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
            isOpen={Hr}
            onClose={() => !et && Ie(!1)}
            title="Replicar repertorio"
            maxWidth="max-w-2xl"
          >
            <div className="space-y-4">
              {[
                <div className="text-sm text-gray-600 dark:text-slate-300">
                  {
                    "Selecciona un evento de esta semana (lunes a domingo) para copiar su repertorio. Esto reemplazará el repertorio actual de este evento."
                  }
                </div>,
                dr ? (
                  <div className="flex items-center justify-center py-10 text-gray-500 dark:text-slate-400">
                    {[
                      <LoaderCircleIcon
                        size={18}
                        className="animate-spin mr-2"
                      />,
                      "Cargando eventos...",
                    ]}
                  </div>
                ) : Je.length === 0 ? (
                  <div className="py-10 text-center text-gray-500 dark:text-slate-400">
                    {"No hay eventos en esta semana."}
                  </div>
                ) : (
                  <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2">
                    {Je.map((t) => {
                      const r = t.id === l,
                        s = r;
                      return jsxRuntime.jsxs(
                        "label",
                        {
                          className: `flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${s ? "border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 opacity-60 cursor-not-allowed" : T === t.id ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40"}`,
                          children: [
                            <input
                              type="radio"
                              name="sourceEvent"
                              value={t.id}
                              disabled={s}
                              checked={T === t.id}
                              onChange={() => Qe(t.id)}
                              className="mt-1"
                            />,
                            <div className="min-w-0">
                              {[
                                <div className="font-semibold text-gray-900 dark:text-white truncate">
                                  {[t.title, r ? " (este evento)" : ""]}
                                </div>,
                                <div className="text-sm text-gray-600 dark:text-slate-300">
                                  {[
                                    t.date,
                                    t.serviceTime || t.time
                                      ? ` • ${t.serviceTime || t.time}`
                                      : "",
                                    t.location ? ` • ${t.location}` : "",
                                  ]}
                                </div>,
                              ]}
                            </div>,
                          ],
                        },
                        t.id,
                      );
                    })}
                  </div>
                ),
                <div className="flex justify-end gap-3 pt-2">
                  {[
                    <button
                      onClick={() => Ie(!1)}
                      disabled={et}
                      className="px-5 py-2.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {"Cancelar"}
                    </button>,
                    <button
                      onClick={ls}
                      disabled={!T || et}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {et ? (
                        <jsxRuntime.Fragment>
                          {[
                            <LoaderCircleIcon
                              size={18}
                              className="animate-spin"
                            />,
                            "Copiando...",
                          ]}
                        </jsxRuntime.Fragment>
                      ) : (
                        <jsxRuntime.Fragment>
                          {[<CopyIcon size={18} />, "Copiar repertorio"]}
                        </jsxRuntime.Fragment>
                      )}
                    </button>,
                  ]}
                </div>,
              ]}
            </div>
          </Modal>,
          <Modal
            isOpen={Kr}
            onClose={() => !tt && Ae(!1)}
            title="Replicar asignaciones"
            maxWidth="max-w-2xl"
          >
            <div className="space-y-4">
              {[
                <div className="text-sm text-gray-600 dark:text-slate-300">
                  {
                    "Selecciona un evento de esta semana (lunes a domingo) para copiar sus asignaciones. Esto reemplazará las asignaciones actuales de este evento."
                  }
                </div>,
                dr ? (
                  <div className="flex items-center justify-center py-10 text-gray-500 dark:text-slate-400">
                    {[
                      <LoaderCircleIcon
                        size={18}
                        className="animate-spin mr-2"
                      />,
                      "Cargando eventos...",
                    ]}
                  </div>
                ) : Je.length === 0 ? (
                  <div className="py-10 text-center text-gray-500 dark:text-slate-400">
                    {"No hay eventos en esta semana."}
                  </div>
                ) : (
                  <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2">
                    {Je.map((t) => {
                      const r = t.id === l,
                        s = r;
                      return jsxRuntime.jsxs(
                        "label",
                        {
                          className: `flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${s ? "border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 opacity-60 cursor-not-allowed" : T === t.id ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40"}`,
                          children: [
                            <input
                              type="radio"
                              name="sourceEvent"
                              value={t.id}
                              disabled={s}
                              checked={T === t.id}
                              onChange={() => Qe(t.id)}
                              className="mt-1"
                            />,
                            <div className="min-w-0">
                              {[
                                <div className="font-semibold text-gray-900 dark:text-white truncate">
                                  {[t.title, r ? " (este evento)" : ""]}
                                </div>,
                                <div className="text-sm text-gray-600 dark:text-slate-300">
                                  {[
                                    t.date,
                                    t.time ? ` • ${t.time}` : "",
                                    t.location ? ` • ${t.location}` : "",
                                  ]}
                                </div>,
                              ]}
                            </div>,
                          ],
                        },
                        t.id,
                      );
                    })}
                  </div>
                ),
                <div className="flex justify-end gap-3 pt-2">
                  {[
                    <button
                      onClick={() => Ae(!1)}
                      disabled={tt}
                      className="px-5 py-2.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {"Cancelar"}
                    </button>,
                    <button
                      onClick={os}
                      disabled={!T || tt}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tt ? (
                        <jsxRuntime.Fragment>
                          {[
                            <LoaderCircleIcon
                              size={18}
                              className="animate-spin"
                            />,
                            "Copiando...",
                          ]}
                        </jsxRuntime.Fragment>
                      ) : (
                        <jsxRuntime.Fragment>
                          {[<CopyIcon size={18} />, "Copiar asignaciones"]}
                        </jsxRuntime.Fragment>
                      )}
                    </button>,
                  ]}
                </div>,
              ]}
            </div>
          </Modal>,
          <Modal
            isOpen={Xr}
            onClose={() => !rt && Me(!1)}
            title="Replicar materiales"
            maxWidth="max-w-2xl"
          >
            <div className="space-y-4">
              {[
                <div className="text-sm text-gray-600 dark:text-slate-300">
                  {
                    "Selecciona un evento de esta semana (lunes a domingo) para copiar sus materiales. Esto reemplazará los materiales actuales de este evento."
                  }
                </div>,
                Yr ? (
                  <div className="flex items-center justify-center py-10 text-gray-500 dark:text-slate-400">
                    {[
                      <LoaderCircleIcon
                        size={18}
                        className="animate-spin mr-2"
                      />,
                      "Cargando eventos...",
                    ]}
                  </div>
                ) : br.length === 0 ? (
                  <div className="py-10 text-center text-gray-500 dark:text-slate-400">
                    {"No hay eventos en esta semana."}
                  </div>
                ) : (
                  <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2">
                    {br.map((t) => {
                      const r = t.id === l,
                        s = r;
                      return jsxRuntime.jsxs(
                        "label",
                        {
                          className: `flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${s ? "border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 opacity-60 cursor-not-allowed" : _ === t.id ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40"}`,
                          children: [
                            <input
                              type="radio"
                              name="sourceEventMaterials"
                              value={t.id}
                              disabled={s}
                              checked={_ === t.id}
                              onChange={() => vr(t.id)}
                              className="mt-1"
                            />,
                            <div className="min-w-0">
                              {[
                                <div className="font-semibold text-gray-900 dark:text-white truncate">
                                  {[t.title, r ? " (este evento)" : ""]}
                                </div>,
                                <div className="text-sm text-gray-600 dark:text-slate-300">
                                  {[
                                    t.date,
                                    t.serviceTime || t.time
                                      ? ` • ${t.serviceTime || t.time}`
                                      : "",
                                    t.location ? ` • ${t.location}` : "",
                                  ]}
                                </div>,
                              ]}
                            </div>,
                          ],
                        },
                        t.id,
                      );
                    })}
                  </div>
                ),
                <div className="flex justify-end gap-3 pt-2">
                  {[
                    <button
                      onClick={() => Me(!1)}
                      disabled={rt}
                      className="px-5 py-2.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {"Cancelar"}
                    </button>,
                    <button
                      onClick={xs}
                      disabled={!_ || rt}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {rt ? (
                        <jsxRuntime.Fragment>
                          {[
                            <LoaderCircleIcon
                              size={18}
                              className="animate-spin"
                            />,
                            "Copiando...",
                          ]}
                        </jsxRuntime.Fragment>
                      ) : (
                        <jsxRuntime.Fragment>
                          {[<CopyIcon size={18} />, "Copiar materiales"]}
                        </jsxRuntime.Fragment>
                      )}
                    </button>,
                  ]}
                </div>,
              ]}
            </div>
          </Modal>,
          <Modal
            isOpen={ie.isOpen}
            onClose={() =>
              Mt((t) => ({
                ...t,
                isOpen: !1,
              }))
            }
            title=""
            maxWidth="max-w-md"
          >
            <div className="text-center py-4">
              {[
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${ie.type === "success" ? "bg-green-100 dark:bg-green-900/30" : ie.type === "error" ? "bg-red-100 dark:bg-red-900/30" : "bg-indigo-100 dark:bg-indigo-900/30"}`}
                >
                  {ie.type === "success" ? (
                    <CircleCheckIcon size={32} className="text-green-600" />
                  ) : ie.type === "error" ? (
                    <TriangleAlertIcon size={32} className="text-red-500" />
                  ) : (
                    <CircleDotIcon size={32} className="text-indigo-600" />
                  )}
                </div>,
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {ie.title}
                </h3>,
                <p className="text-gray-600 dark:text-slate-300 mb-6">
                  {ie.message}
                </p>,
                <div className="flex justify-center">
                  <button
                    onClick={() =>
                      Mt((t) => ({
                        ...t,
                        isOpen: !1,
                      }))
                    }
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    {"Entendido"}
                  </button>
                </div>,
              ]}
            </div>
          </Modal>,
        ]}
      </div>
    ) : (
      <div className="p-8 text-center text-gray-600 dark:text-slate-300">
        {"No tienes acceso a este evento."}
      </div>
    )
  ) : (
    <div className="p-8 text-center">{"Evento no encontrado"}</div>
  );
};
export { EventDetails };
