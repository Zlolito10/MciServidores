// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  u as useNavigate,
  r as React,
} from "../vendor/vendor-react-BwINE3B3.js";
import {
  I as T,
  J as me,
  E as v,
  H as te,
  K as q,
  R as Se,
  A as E,
  M as se,
  w as ze,
  S as ge,
  N as ue,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  useAuth,
  useGlobalData,
  useAppDialog,
  getUdlvMinistryName,
  hasUdlvAccess,
  normalizeMinistryName,
  firestoreDb,
  Modal,
} from "../app/App.jsx";
import {
  L as LoaderCircleIcon,
  f as UsersIcon,
  G as GraduationCapIcon,
  aj as BookOpenIcon,
  P as PlusIcon,
  Q as ChevronRightIcon,
  S as ShieldIcon,
  ak as UserCheckIcon,
  e as LayersIcon,
  d as CalendarIcon,
  al as PencilIcon,
  r as Trash2Icon,
  O as ChevronLeftIcon,
  T as TriangleAlertIcon,
  h as ClipboardListIcon,
  t as CircleCheckBigIcon,
  a5 as ChartColumnIcon,
  am as AwardIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import "../vendor/vendor-pdf-Cf03QSry.js";
const Udlv = () => {
  const { userProfile: y } = useAuth(),
    { users: b, serviceAreas: de, loading: _e } = useGlobalData(),
    N = useAppDialog(),
    $e = useNavigate(),
    ye = React.useMemo(() => getUdlvMinistryName(de), [de]),
    ke = y?.role === "master_admin" || y?.role === "admin",
    De = ke || hasUdlvAccess(y, de),
    p = ke,
    w = React.useMemo(() => {
      const t = normalizeMinistryName(ye || "");
      return b.filter((s) =>
        (Array.isArray(s.areas) ? s.areas : []).some(
          (a) => normalizeMinistryName(a) === t,
        ),
      );
    }, [b, ye]),
    [H, Me] = React.useState([]),
    [F, Ue] = React.useState([]),
    [W, Re] = React.useState([]),
    [A, ie] = React.useState(null),
    [m, S] = React.useState(null),
    [j, f] = React.useState(null),
    [U, Ne] = React.useState("team"),
    [ne, we] = React.useState({}),
    [Ie, R] = React.useState({}),
    [Oe, L] = React.useState(!1),
    [Pe, Q] = React.useState(!1),
    [Fe, J] = React.useState(!1),
    [g, O] = React.useState(null),
    [n, I] = React.useState({
      name: "",
      description: "",
      docenteId: "",
      tutorId: "",
      asistentId: "",
    }),
    [K, X] = React.useState(null),
    [u, P] = React.useState({
      name: "",
      description: "",
      teacherId: "",
      studentIds: [],
    }),
    [Y, ce] = React.useState(null),
    [c, z] = React.useState({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      teacherId: "",
    }),
    [Z, oe] = React.useState(null);
  (React.useEffect(() => {
    const t = T(v(firestoreDb, "udlv_courses"), me("createdAt", "desc")),
      s = T(v(firestoreDb, "udlv_sections"), me("createdAt", "desc")),
      l = T(v(firestoreDb, "udlv_classes"), me("createdAt", "desc")),
      a = te(t, (x) => {
        Me(
          x.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        );
      }),
      r = te(s, (x) => {
        Ue(
          x.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        );
      }),
      k = te(l, (x) => {
        Re(
          x.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        );
      });
    return () => {
      (a(), r(), k());
    };
  }, []),
    React.useEffect(() => {
      if (!j) {
        (we({}), R({}));
        return;
      }
      const t = T(v(firestoreDb, "udlv_class_records"), q("classId", "==", j)),
        s = te(t, (l) => {
          const a = {};
          (l.docs.forEach((r) => {
            a[r.id] = {
              id: r.id,
              ...r.data(),
            };
          }),
            we(a),
            R({}));
        });
      return () => s();
    }, [j]));
  const h = H.find((t) => t.id === A) || null,
    B = F.find((t) => t.id === m) || null,
    _ = W.find((t) => t.id === j) || null,
    C = React.useMemo(() => F.filter((t) => t.courseId === A), [F, A]),
    ee = React.useMemo(() => {
      const t = h?.teamIds || [];
      return b.filter((s) => t.includes(s.id));
    }, [h?.teamIds, b]),
    V = React.useMemo(
      () => (p ? !0 : !_ || !y?.uid ? !1 : _.teacherId === y.uid),
      [p, _, y?.uid],
    ),
    $ = React.useMemo(() => W.filter((t) => t.sectionId === m), [W, m]),
    Ce = React.useMemo(
      () =>
        m
          ? ee.map((t) => {
              let s = 0,
                l = 0,
                a = 0,
                r = 0;
              return (
                $.forEach((k) => {
                  const x = ne[`${k.id}_${t.id}`];
                  x &&
                    ((l += 1),
                    x.attendance === "present" && (s += 1),
                    typeof x.score == "number" && ((a += x.score), (r += 1)));
                }),
                {
                  studentId: t.id,
                  name: t.name,
                  present: s,
                  total: l,
                  avgScore: r > 0 ? Number((a / r).toFixed(2)) : null,
                }
              );
            })
          : [],
      [ne, $, ee, m],
    );
  if (_e)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        {[
          <LoaderCircleIcon className="w-10 h-10 animate-spin text-emerald-500" />,
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            {"Cargando datos..."}
          </p>,
        ]}
      </div>
    );
  if (!De)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        {[
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <UsersIcon
              size={28}
              className="text-gray-300 dark:text-slate-600"
            />
          </div>,
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            {"No tienes acceso a esta seccion."}
          </p>,
        ]}
      </div>
    );
  const Le = async () => {
      if (!n.name.trim()) {
        N.showError("Nombre del curso es obligatorio");
        return;
      }
      const t = [n.docenteId, n.tutorId, n.asistentId].filter(Boolean),
        s = Array.from(new Set([...w.map((l) => l.id), ...t]));
      (K
        ? await ge(E(firestoreDb, "udlv_courses", K.id), {
            name: n.name.trim(),
            description: n.description.trim(),
            docenteId: n.docenteId || "",
            tutorId: n.tutorId || "",
            asistentId: n.asistentId || "",
            teamIds: s,
          })
        : await ue(v(firestoreDb, "udlv_courses"), {
            name: n.name.trim(),
            description: n.description.trim(),
            docenteId: n.docenteId || "",
            tutorId: n.tutorId || "",
            asistentId: n.asistentId || "",
            teamIds: s,
            createdAt: new Date(),
            createdBy: y?.uid || "",
          }),
        L(!1),
        I({
          name: "",
          description: "",
          docenteId: "",
          tutorId: "",
          asistentId: "",
        }),
        X(null));
    },
    Be = async () => {
      if (!A) {
        N.showError("Selecciona un curso");
        return;
      }
      if (!u.name.trim()) {
        N.showError("Nombre de la seccion es obligatorio");
        return;
      }
      (Y
        ? await ge(E(firestoreDb, "udlv_sections", Y.id), {
            name: u.name.trim(),
            description: u.description.trim(),
            teacherId: u.teacherId || "",
            studentIds: u.studentIds,
          })
        : await ue(v(firestoreDb, "udlv_sections"), {
            courseId: A,
            name: u.name.trim(),
            description: u.description.trim(),
            teacherId: u.teacherId || "",
            studentIds: u.studentIds,
            createdAt: new Date(),
            createdBy: y?.uid || "",
          }),
        Q(!1),
        P({
          name: "",
          description: "",
          teacherId: "",
          studentIds: [],
        }),
        ce(null));
    },
    Ve = async () => {
      if (!m) {
        N.showError("Selecciona una seccion");
        return;
      }
      if (!c.title.trim()) {
        N.showError("Titulo de la clase es obligatorio");
        return;
      }
      if (!c.date) {
        N.showError("Fecha de la clase es obligatoria");
        return;
      }
      (Z
        ? await ge(E(firestoreDb, "udlv_classes", Z.id), {
            title: c.title.trim(),
            date: c.date,
            startTime: c.startTime || "",
            endTime: c.endTime || "",
            teacherId: c.teacherId || B?.teacherId || "",
          })
        : await ue(v(firestoreDb, "udlv_classes"), {
            sectionId: m,
            title: c.title.trim(),
            date: c.date,
            startTime: c.startTime || "",
            endTime: c.endTime || "",
            teacherId: c.teacherId || B?.teacherId || "",
            createdAt: new Date(),
            createdBy: y?.uid || "",
          }),
        J(!1),
        z({
          title: "",
          date: "",
          startTime: "",
          endTime: "",
          teacherId: "",
        }),
        oe(null));
    },
    qe = async () => {
      if (!j || !V) return;
      const t = Se(firestoreDb),
        s = new Date();
      (Object.entries(Ie).forEach(([l, a]) => {
        const r = `${j}_${l}`,
          k = E(firestoreDb, "udlv_class_records", r);
        t.set(
          k,
          {
            classId: j,
            studentId: l,
            attendance: a.attendance || "absent",
            score: typeof a.score == "number" ? a.score : null,
            notes: a.notes || "",
            updatedAt: s,
            updatedBy: y?.uid || "",
          },
          {
            merge: !0,
          },
        );
      }),
        await t.commit(),
        R({}),
        N.showSuccess("Asistencia y notas guardadas"));
    },
    xe = async (t) => {
      const s = await ze(t);
      if (s.empty) return;
      const l = Se(firestoreDb);
      (s.docs.forEach((a) => l.delete(a.ref)), await l.commit());
    },
    Ge = async () => {
      if (g)
        try {
          if (g.type === "course") {
            await se(E(firestoreDb, "udlv_courses", g.id));
            const t = await ze(
              T(v(firestoreDb, "udlv_sections"), q("courseId", "==", g.id)),
            );
            for (const s of t.docs) {
              const l = s.id;
              (await xe(
                T(v(firestoreDb, "udlv_classes"), q("sectionId", "==", l)),
              ),
                await se(E(firestoreDb, "udlv_sections", l)));
            }
            A === g.id && (ie(null), S(null), f(null));
          }
          (g.type === "section" &&
            (await xe(
              T(v(firestoreDb, "udlv_classes"), q("sectionId", "==", g.id)),
            ),
            await se(E(firestoreDb, "udlv_sections", g.id)),
            m === g.id && (S(null), f(null))),
            g.type === "class" &&
              (await xe(
                T(
                  v(firestoreDb, "udlv_class_records"),
                  q("classId", "==", g.id),
                ),
              ),
              await se(E(firestoreDb, "udlv_classes", g.id)),
              j === g.id && f(null)),
            O(null),
            N.showSuccess("Eliminado correctamente"));
        } catch (t) {
          (console.error(t), N.showError("No se pudo eliminar"));
        }
    },
    He = [
      {
        key: "team",
        label: "Equipo",
        icon: <UsersIcon size={15} />,
      },
      {
        key: "sections",
        label: "Secciones",
        icon: <LayersIcon size={15} />,
      },
      {
        key: "classes",
        label: "Clases",
        icon: <CalendarIcon size={15} />,
      },
      {
        key: "attendance",
        label: "Asistencia",
        icon: <ClipboardListIcon size={15} />,
      },
      {
        key: "report",
        label: "Reporte",
        icon: <ChartColumnIcon size={15} />,
      },
    ];
  return (
    <div className="space-y-6">
      {[
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          {[
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />,
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-black/10 rounded-full blur-2xl" />,
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
              {[
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 ring-2 ring-white/30">
                  <GraduationCapIcon size={28} />
                </div>,
                <div className="flex-1">
                  {[
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {"U de la Vida"}
                    </h1>,
                    <p className="text-emerald-100 text-sm mt-0.5">
                      {"Gestion de cursos, secciones y clases"}
                    </p>,
                  ]}
                </div>,
                <div className="flex gap-3 sm:gap-5">
                  {[
                    <div className="text-center">
                      {[
                        <div className="text-2xl font-bold">{H.length}</div>,
                        <div className="text-xs text-emerald-100 uppercase tracking-wide">
                          {"Cursos"}
                        </div>,
                      ]}
                    </div>,
                    <div className="w-px bg-white/20" />,
                    <div className="text-center">
                      {[
                        <div className="text-2xl font-bold">{F.length}</div>,
                        <div className="text-xs text-emerald-100 uppercase tracking-wide">
                          {"Secciones"}
                        </div>,
                      ]}
                    </div>,
                    <div className="w-px bg-white/20" />,
                    <div className="text-center">
                      {[
                        <div className="text-2xl font-bold">{w.length}</div>,
                        <div className="text-xs text-emerald-100 uppercase tracking-wide">
                          {"Miembros"}
                        </div>,
                      ]}
                    </div>,
                  ]}
                </div>,
              ]}
            </div>,
          ]}
        </div>,
        A ? (
          <div className="space-y-5">
            {[
              <div className="flex items-center gap-3">
                {[
                  <button
                    onClick={() => {
                      (ie(null), S(null), f(null));
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ChevronLeftIcon size={18} />
                  </button>,
                  <div className="flex-1 min-w-0">
                    {[
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate">
                        {h?.name}
                      </h2>,
                      h?.description && (
                        <p className="text-sm text-gray-500 dark:text-slate-400 truncate">
                          {h.description}
                        </p>
                      ),
                    ]}
                  </div>,
                ]}
              </div>,
              <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 overflow-x-auto">
                {He.map((t) =>
                  jsxRuntime.jsxs(
                    "button",
                    {
                      onClick: () => Ne(t.key),
                      className: `flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${U === t.key ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"}`,
                      children: [t.icon, " ", t.label],
                    },
                    t.key,
                  ),
                )}
              </div>,
              U === "team" &&
                (() => {
                  const t = b.find((r) => r.id === h?.docenteId),
                    s = b.find((r) => r.id === h?.tutorId),
                    l = b.find((r) => r.id === h?.asistentId),
                    a = [
                      {
                        label: "Docente",
                        icon: <GraduationCapIcon size={20} />,
                        user: t,
                        color: "violet",
                        gradient: "from-violet-500 to-purple-600",
                        bgLight: "bg-violet-50 dark:bg-violet-900/20",
                        textColor: "text-violet-600 dark:text-violet-400",
                      },
                      {
                        label: "Tutor",
                        icon: <ShieldIcon size={20} />,
                        user: s,
                        color: "blue",
                        gradient: "from-blue-500 to-indigo-600",
                        bgLight: "bg-blue-50 dark:bg-blue-900/20",
                        textColor: "text-blue-600 dark:text-blue-400",
                      },
                      {
                        label: "Asistente",
                        icon: <UserCheckIcon size={20} />,
                        user: l,
                        color: "amber",
                        gradient: "from-amber-500 to-orange-600",
                        bgLight: "bg-amber-50 dark:bg-amber-900/20",
                        textColor: "text-amber-600 dark:text-amber-400",
                      },
                    ];
                  return (
                    <div className="space-y-5">
                      {[
                        <div>
                          {[
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              {[
                                <GraduationCapIcon size={14} />,
                                " Equipo directivo",
                              ]}
                            </h3>,
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {a.map((r) =>
                                jsxRuntime.jsxs(
                                  "div",
                                  {
                                    className:
                                      "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm",
                                    children: [
                                      <div
                                        className={`h-1.5 bg-gradient-to-r ${r.gradient}`}
                                      />,
                                      <div className="p-4">
                                        {[
                                          <div className="flex items-center gap-2 mb-3">
                                            {[
                                              <div
                                                className={`w-8 h-8 rounded-lg ${r.bgLight} flex items-center justify-center ${r.textColor}`}
                                              >
                                                {r.icon}
                                              </div>,
                                              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                                                {r.label}
                                              </span>,
                                            ]}
                                          </div>,
                                          r.user ? (
                                            <div className="flex items-center gap-2.5">
                                              {[
                                                <div
                                                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                                                >
                                                  {r.user.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "?"}
                                                </div>,
                                                <div className="min-w-0 flex-1">
                                                  {[
                                                    <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                                                      {r.user.name}
                                                    </p>,
                                                    <p
                                                      className={`text-[10px] font-medium ${r.textColor}`}
                                                    >
                                                      {"Asignado"}
                                                    </p>,
                                                  ]}
                                                </div>,
                                              ]}
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-2.5 opacity-50">
                                              {[
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                                  <UsersIcon
                                                    size={16}
                                                    className="text-gray-300 dark:text-slate-600"
                                                  />
                                                </div>,
                                                <p className="text-xs text-gray-400 dark:text-slate-500 italic">
                                                  {"Sin asignar"}
                                                </p>,
                                              ]}
                                            </div>
                                          ),
                                        ]}
                                      </div>,
                                    ],
                                  },
                                  r.label,
                                ),
                              )}
                            </div>,
                            p && (
                              <button
                                onClick={() => {
                                  (X(h),
                                    I({
                                      name: h?.name || "",
                                      description: h?.description || "",
                                      docenteId: h?.docenteId || "",
                                      tutorId: h?.tutorId || "",
                                      asistentId: h?.asistentId || "",
                                    }),
                                    L(!0));
                                }}
                                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"
                              >
                                {[
                                  <PencilIcon size={14} />,
                                  " Editar roles del curso",
                                ]}
                              </button>
                            ),
                          ]}
                        </div>,
                        p && w.length === 0 && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                            {[
                              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                <TriangleAlertIcon
                                  size={20}
                                  className="text-amber-600 dark:text-amber-400"
                                />
                              </div>,
                              <div className="flex-1">
                                {[
                                  <p className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                                    {
                                      "No hay usuarios con acceso a U de la Vida"
                                    }
                                  </p>,
                                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                                    {
                                      'Asigna el ministerio "U de la Vida" a los servidores desde Ministerios'
                                    }
                                  </p>,
                                  <button
                                    onClick={() => $e("/dashboard/areas")}
                                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition-colors"
                                  >
                                    {[
                                      <UsersIcon size={15} />,
                                      " Ir a Ministerios",
                                    ]}
                                  </button>,
                                ]}
                              </div>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>
                  );
                })(),
              U === "sections" && (
                <div className="space-y-4">
                  {[
                    <div className="flex items-center justify-between">
                      {[
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {[C.length, " secciones en este curso"]}
                        </p>,
                        p && (
                          <button
                            onClick={() => {
                              (ce(null),
                                P({
                                  name: "",
                                  description: "",
                                  teacherId: "",
                                  studentIds: [],
                                }),
                                Q(!0));
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm"
                          >
                            {[<PlusIcon size={15} />, " Nueva seccion"]}
                          </button>
                        ),
                      ]}
                    </div>,
                    C.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 py-16 flex flex-col items-center justify-center text-center select-none">
                        {[
                          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                            <LayersIcon
                              size={24}
                              className="text-blue-300 dark:text-blue-600"
                            />
                          </div>,
                          <p className="text-sm font-medium text-gray-400 dark:text-slate-500">
                            {"Sin secciones"}
                          </p>,
                          <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">
                            {"Crea una seccion para organizar estudiantes"}
                          </p>,
                        ]}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {C.map((t) => {
                          const s = b.find((a) => a.id === t.teacherId),
                            l = m === t.id;
                          return jsxRuntime.jsxs(
                            "div",
                            {
                              onClick: () => {
                                (S(t.id), f(null));
                              },
                              className: `bg-white dark:bg-slate-800 rounded-xl border p-4 cursor-pointer transition-all ${l ? "border-emerald-400 ring-1 ring-emerald-400/30 shadow-md" : "border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 shadow-sm hover:shadow-md"}`,
                              children: [
                                <div className="flex items-start justify-between gap-2">
                                  {[
                                    <div className="min-w-0 flex-1">
                                      {[
                                        <h4 className="font-bold text-gray-800 dark:text-white truncate">
                                          {t.name}
                                        </h4>,
                                        t.description && (
                                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 truncate">
                                            {t.description}
                                          </p>
                                        ),
                                      ]}
                                    </div>,
                                    p && (
                                      <div className="flex items-center gap-0.5 flex-shrink-0">
                                        {[
                                          <button
                                            onClick={(a) => {
                                              (a.stopPropagation(),
                                                ce(t),
                                                P({
                                                  name: t.name || "",
                                                  description:
                                                    t.description || "",
                                                  teacherId: t.teacherId || "",
                                                  studentIds:
                                                    t.studentIds || [],
                                                }),
                                                Q(!0));
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg transition-colors"
                                          >
                                            <PencilIcon size={13} />
                                          </button>,
                                          <button
                                            onClick={(a) => {
                                              (a.stopPropagation(),
                                                O({
                                                  type: "section",
                                                  id: t.id,
                                                  label: t.name,
                                                }));
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                          >
                                            <Trash2Icon size={13} />
                                          </button>,
                                        ]}
                                      </div>
                                    ),
                                  ]}
                                </div>,
                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 dark:border-slate-700/50">
                                  {[
                                    s ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-xs font-medium rounded-full">
                                        {[
                                          <GraduationCapIcon size={11} />,
                                          " ",
                                          s.name,
                                        ]}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-300 dark:text-slate-600 italic">
                                        {"Sin docente"}
                                      </span>
                                    ),
                                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
                                      {[
                                        <UsersIcon size={11} />,
                                        " ",
                                        t.studentIds?.length || 0,
                                      ]}
                                    </span>,
                                  ]}
                                </div>,
                              ],
                            },
                            t.id,
                          );
                        })}
                      </div>
                    ),
                  ]}
                </div>
              ),
              U === "classes" && (
                <div className="space-y-4">
                  {[
                    C.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          <span className="text-sm text-gray-500 dark:text-slate-400">
                            {"Seccion:"}
                          </span>,
                          C.map((t) =>
                            jsxRuntime.jsx(
                              "button",
                              {
                                onClick: () => {
                                  (S(t.id), f(null));
                                },
                                className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${m === t.id ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"}`,
                                children: t.name,
                              },
                              t.id,
                            ),
                          ),
                        ]}
                      </div>
                    ),
                    <div className="flex items-center justify-between">
                      {[
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {m ? `${$.length} clases` : "Selecciona una seccion"}
                        </p>,
                        p && m && (
                          <button
                            onClick={() => {
                              (oe(null),
                                z({
                                  title: "",
                                  date: "",
                                  startTime: "",
                                  endTime: "",
                                  teacherId: "",
                                }),
                                J(!0));
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm"
                          >
                            {[<PlusIcon size={15} />, " Nueva clase"]}
                          </button>
                        ),
                      ]}
                    </div>,
                    m ? (
                      $.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 py-14 flex flex-col items-center text-center select-none">
                          {[
                            <div className="w-14 h-14 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-3">
                              <CalendarIcon
                                size={22}
                                className="text-violet-300"
                              />
                            </div>,
                            <p className="text-sm font-medium text-gray-400 dark:text-slate-500">
                              {"Sin clases"}
                            </p>,
                            <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">
                              {"Programa la primera clase de esta seccion"}
                            </p>,
                          ]}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {$.map((t) => {
                            const s = j === t.id,
                              l = b.find((a) => a.id === t.teacherId);
                            return jsxRuntime.jsxs(
                              "div",
                              {
                                onClick: () => f(t.id),
                                className: `bg-white dark:bg-slate-800 rounded-xl border p-4 cursor-pointer transition-all flex items-center gap-4 ${s ? "border-violet-400 ring-1 ring-violet-400/30 shadow-md" : "border-gray-100 dark:border-slate-700 hover:border-gray-200 shadow-sm hover:shadow-md"}`,
                                children: [
                                  <div
                                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-xs font-bold ${s ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"}`}
                                  >
                                    {t.date ? (
                                      <jsxRuntime.Fragment>
                                        {[
                                          <span className="text-[10px] uppercase">
                                            {new Date(
                                              t.date + "T12:00",
                                            ).toLocaleDateString("es", {
                                              month: "short",
                                            })}
                                          </span>,
                                          <span className="text-sm leading-none">
                                            {new Date(
                                              t.date + "T12:00",
                                            ).getDate()}
                                          </span>,
                                        ]}
                                      </jsxRuntime.Fragment>
                                    ) : (
                                      <CalendarIcon size={16} />
                                    )}
                                  </div>,
                                  <div className="flex-1 min-w-0">
                                    {[
                                      <h4 className="font-semibold text-gray-800 dark:text-white truncate">
                                        {t.title}
                                      </h4>,
                                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 dark:text-slate-500">
                                        {[
                                          t.startTime && (
                                            <span>
                                              {[
                                                t.startTime,
                                                t.endTime
                                                  ? ` - ${t.endTime}`
                                                  : "",
                                              ]}
                                            </span>
                                          ),
                                          l && <span>{["- ", l.name]}</span>,
                                        ]}
                                      </div>,
                                    ]}
                                  </div>,
                                  p && (
                                    <div className="flex items-center gap-0.5 flex-shrink-0">
                                      {[
                                        <button
                                          onClick={(a) => {
                                            (a.stopPropagation(),
                                              oe(t),
                                              z({
                                                title: t.title || "",
                                                date: t.date || "",
                                                startTime: t.startTime || "",
                                                endTime: t.endTime || "",
                                                teacherId: t.teacherId || "",
                                              }),
                                              J(!0));
                                          }}
                                          className="p-1.5 text-gray-400 hover:text-violet-600 rounded-lg transition-colors"
                                        >
                                          <PencilIcon size={13} />
                                        </button>,
                                        <button
                                          onClick={(a) => {
                                            (a.stopPropagation(),
                                              O({
                                                type: "class",
                                                id: t.id,
                                                label: t.title,
                                              }));
                                          }}
                                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                        >
                                          <Trash2Icon size={13} />
                                        </button>,
                                      ]}
                                    </div>
                                  ),
                                ],
                              },
                              t.id,
                            );
                          })}
                        </div>
                      )
                    ) : (
                      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 py-14 flex flex-col items-center text-center select-none">
                        {[
                          <div className="w-14 h-14 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-3">
                            <CalendarIcon
                              size={22}
                              className="text-violet-300"
                            />
                          </div>,
                          <p className="text-sm font-medium text-gray-400 dark:text-slate-500">
                            {"Selecciona una seccion arriba"}
                          </p>,
                        ]}
                      </div>
                    ),
                  ]}
                </div>
              ),
              U === "attendance" && (
                <div className="space-y-4">
                  {[
                    C.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          <span className="text-sm text-gray-500 dark:text-slate-400">
                            {"Seccion:"}
                          </span>,
                          C.map((t) =>
                            jsxRuntime.jsx(
                              "button",
                              {
                                onClick: () => {
                                  (S(t.id), f(null));
                                },
                                className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${m === t.id ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200"}`,
                                children: t.name,
                              },
                              t.id,
                            ),
                          ),
                        ]}
                      </div>
                    ),
                    m && $.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          <span className="text-sm text-gray-500 dark:text-slate-400">
                            {"Clase:"}
                          </span>,
                          $.map((t) =>
                            jsxRuntime.jsx(
                              "button",
                              {
                                onClick: () => f(t.id),
                                className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${j === t.id ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200"}`,
                                children: t.title,
                              },
                              t.id,
                            ),
                          ),
                        ]}
                      </div>
                    ),
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
                      {[
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/80">
                          {[
                            <div className="flex items-center gap-3">
                              {[
                                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                  <ClipboardListIcon
                                    size={18}
                                    className="text-amber-600 dark:text-amber-400"
                                  />
                                </div>,
                                <div>
                                  {[
                                    <h3 className="font-bold text-gray-800 dark:text-white">
                                      {"Asistencia y notas"}
                                    </h3>,
                                    <p className="text-xs text-gray-400 dark:text-slate-500">
                                      {_ ? _.title : "Selecciona una clase"}
                                    </p>,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                            V && _ && (
                              <button
                                onClick={qe}
                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm"
                              >
                                {[<CircleCheckBigIcon size={15} />, " Guardar"]}
                              </button>
                            ),
                          ]}
                        </div>,
                        _ ? (
                          <div className="p-4 sm:p-5">
                            {ee.length > 0 ? (
                              <jsxRuntime.Fragment>
                                {[
                                  <div className="hidden lg:grid grid-cols-[1fr_140px_100px_1fr] gap-3 px-3 pb-2 mb-2 border-b border-gray-100 dark:border-slate-700">
                                    {[
                                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {"Estudiante"}
                                      </div>,
                                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {"Asistencia"}
                                      </div>,
                                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {"Nota"}
                                      </div>,
                                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {"Observaciones"}
                                      </div>,
                                    ]}
                                  </div>,
                                  <div className="space-y-2">
                                    {ee.map((t) => {
                                      const s = ne[`${j}_${t.id}`],
                                        l = Ie[t.id] || {},
                                        a =
                                          l.attendance ||
                                          s?.attendance ||
                                          "absent",
                                        r =
                                          l.score ??
                                          (typeof s?.score == "number"
                                            ? s?.score
                                            : ""),
                                        k = l.notes ?? s?.notes ?? "";
                                      return jsxRuntime.jsxs(
                                        "div",
                                        {
                                          className: `grid grid-cols-1 lg:grid-cols-[1fr_140px_100px_1fr] gap-2 lg:gap-3 items-center rounded-xl p-3 transition-colors ${a === "present" ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "bg-gray-50/50 dark:bg-slate-900/20"}`,
                                          children: [
                                            <div className="flex items-center gap-2">
                                              {[
                                                <div
                                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${a === "present" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400"}`}
                                                >
                                                  {t.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "?"}
                                                </div>,
                                                <span className="font-medium text-gray-800 dark:text-slate-100 truncate text-sm">
                                                  {t.name}
                                                </span>,
                                              ]}
                                            </div>,
                                            <select
                                              value={a}
                                              disabled={!V}
                                              onChange={(x) =>
                                                R((d) => ({
                                                  ...d,
                                                  [t.id]: {
                                                    ...d[t.id],
                                                    attendance: x.target.value,
                                                  },
                                                }))
                                              }
                                              className={`px-2.5 py-2 rounded-lg border text-sm font-medium transition-colors ${a === "present" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300" : "border-gray-200 bg-white text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}
                                            >
                                              {[
                                                <option value="present">
                                                  {"Presente"}
                                                </option>,
                                                <option value="absent">
                                                  {"Ausente"}
                                                </option>,
                                              ]}
                                            </select>,
                                            <input
                                              type="number"
                                              min={0}
                                              max={10}
                                              step={0.1}
                                              value={r}
                                              disabled={!V}
                                              onChange={(x) =>
                                                R((d) => ({
                                                  ...d,
                                                  [t.id]: {
                                                    ...d[t.id],
                                                    score:
                                                      x.target.value === ""
                                                        ? void 0
                                                        : Number(
                                                            x.target.value,
                                                          ),
                                                  },
                                                }))
                                              }
                                              className="px-2.5 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                                              placeholder="0-10"
                                            />,
                                            <input
                                              type="text"
                                              value={k}
                                              disabled={!V}
                                              onChange={(x) =>
                                                R((d) => ({
                                                  ...d,
                                                  [t.id]: {
                                                    ...d[t.id],
                                                    notes: x.target.value,
                                                  },
                                                }))
                                              }
                                              className="px-2.5 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                                              placeholder="Observaciones..."
                                            />,
                                          ],
                                        },
                                        t.id,
                                      );
                                    })}
                                  </div>,
                                ]}
                              </jsxRuntime.Fragment>
                            ) : (
                              <div className="flex flex-col items-center py-10 text-center select-none">
                                {[
                                  <UsersIcon
                                    size={28}
                                    className="text-gray-200 dark:text-slate-700 mb-2"
                                  />,
                                  <p className="text-sm text-gray-400 dark:text-slate-500">
                                    {"No hay miembros en el equipo"}
                                  </p>,
                                  <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">
                                    {
                                      'Ve a la pestaña "Equipo" para agregar miembros'
                                    }
                                  </p>,
                                ]}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-16 text-center select-none">
                            {[
                              <ClipboardListIcon
                                size={32}
                                className="text-gray-200 dark:text-slate-700 mb-3"
                              />,
                              <p className="text-sm text-gray-400 dark:text-slate-500">
                                {"Selecciona una seccion y clase"}
                              </p>,
                              <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">
                                {"Para registrar asistencia y notas"}
                              </p>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                  ]}
                </div>
              ),
              U === "report" && (
                <div className="space-y-4">
                  {[
                    C.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          <span className="text-sm text-gray-500 dark:text-slate-400">
                            {"Seccion:"}
                          </span>,
                          C.map((t) =>
                            jsxRuntime.jsx(
                              "button",
                              {
                                onClick: () => {
                                  (S(t.id), f(null));
                                },
                                className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${m === t.id ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200"}`,
                                children: t.name,
                              },
                              t.id,
                            ),
                          ),
                        ]}
                      </div>
                    ),
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
                      {[
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/80">
                          {[
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <ChartColumnIcon
                                size={18}
                                className="text-indigo-600 dark:text-indigo-400"
                              />
                            </div>,
                            <div>
                              {[
                                <h3 className="font-bold text-gray-800 dark:text-white">
                                  {"Reporte"}
                                </h3>,
                                <p className="text-xs text-gray-400 dark:text-slate-500">
                                  {B ? B.name : "Selecciona una seccion"}
                                </p>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        B ? (
                          Ce.length > 0 ? (
                            <div className="p-4 sm:p-5">
                              {[
                                <div className="hidden lg:grid grid-cols-[1fr_180px_120px] gap-3 px-3 pb-2 mb-2 border-b border-gray-100 dark:border-slate-700">
                                  {[
                                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                      {"Estudiante"}
                                    </div>,
                                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                      {"Asistencia"}
                                    </div>,
                                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                      {"Promedio"}
                                    </div>,
                                  ]}
                                </div>,
                                <div className="space-y-2">
                                  {Ce.map((t) => {
                                    const s =
                                      t.total > 0
                                        ? Math.round(
                                            (t.present / t.total) * 100,
                                          )
                                        : 0;
                                    return jsxRuntime.jsxs(
                                      "div",
                                      {
                                        className:
                                          "grid grid-cols-1 lg:grid-cols-[1fr_180px_120px] gap-2 lg:gap-3 items-center rounded-xl p-3 bg-gray-50/50 dark:bg-slate-900/20",
                                        children: [
                                          <div className="flex items-center gap-2">
                                            {[
                                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0">
                                                {t.name
                                                  ?.charAt(0)
                                                  ?.toUpperCase() || "?"}
                                              </div>,
                                              <span className="font-medium text-gray-800 dark:text-slate-100 truncate text-sm">
                                                {t.name}
                                              </span>,
                                            ]}
                                          </div>,
                                          <div className="flex items-center gap-2">
                                            {t.total > 0 ? (
                                              <jsxRuntime.Fragment>
                                                {[
                                                  <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                      className={`h-full rounded-full ${s >= 80 ? "bg-emerald-500" : s >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                                                      style={{
                                                        width: `${s}%`,
                                                      }}
                                                    />
                                                  </div>,
                                                  <span className="text-xs font-medium text-gray-600 dark:text-slate-300 w-16 text-right">
                                                    {[
                                                      t.present,
                                                      "/",
                                                      t.total,
                                                      " (",
                                                      s,
                                                      "%)",
                                                    ]}
                                                  </span>,
                                                ]}
                                              </jsxRuntime.Fragment>
                                            ) : (
                                              <span className="text-xs text-gray-400 dark:text-slate-500">
                                                {"Sin clases"}
                                              </span>
                                            )}
                                          </div>,
                                          <div>
                                            {t.avgScore !== null ? (
                                              <div className="flex items-center gap-1.5">
                                                {[
                                                  <AwardIcon
                                                    size={14}
                                                    className={
                                                      t.avgScore >= 7
                                                        ? "text-emerald-500"
                                                        : t.avgScore >= 5
                                                          ? "text-amber-500"
                                                          : "text-red-500"
                                                    }
                                                  />,
                                                  <span
                                                    className={`text-sm font-bold ${t.avgScore >= 7 ? "text-emerald-600 dark:text-emerald-400" : t.avgScore >= 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}
                                                  >
                                                    {t.avgScore}
                                                  </span>,
                                                ]}
                                              </div>
                                            ) : (
                                              <span className="text-xs text-gray-400 dark:text-slate-500">
                                                {"-"}
                                              </span>
                                            )}
                                          </div>,
                                        ],
                                      },
                                      t.studentId,
                                    );
                                  })}
                                </div>,
                              ]}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-14 text-center select-none">
                              {[
                                <ChartColumnIcon
                                  size={28}
                                  className="text-gray-200 dark:text-slate-700 mb-2"
                                />,
                                <p className="text-sm text-gray-400 dark:text-slate-500">
                                  {"Sin datos aun"}
                                </p>,
                                <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">
                                  {"Registra asistencia primero"}
                                </p>,
                              ]}
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col items-center py-16 text-center select-none">
                            {[
                              <ChartColumnIcon
                                size={32}
                                className="text-gray-200 dark:text-slate-700 mb-3"
                              />,
                              <p className="text-sm text-gray-400 dark:text-slate-500">
                                {"Selecciona una seccion"}
                              </p>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                  ]}
                </div>
              ),
            ]}
          </div>
        ) : (
          <div className="space-y-4">
            {[
              <div className="flex items-center justify-between">
                {[
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    {[
                      <BookOpenIcon size={20} className="text-emerald-500" />,
                      " Cursos",
                    ]}
                  </h2>,
                  p && (
                    <button
                      onClick={() => {
                        (X(null),
                          I({
                            name: "",
                            description: "",
                            docenteId: "",
                            tutorId: "",
                            asistentId: "",
                          }),
                          L(!0));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all"
                    >
                      {[<PlusIcon size={16} />, " Nuevo curso"]}
                    </button>
                  ),
                ]}
              </div>,
              H.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex flex-col items-center justify-center py-20 select-none">
                    {[
                      <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                        <BookOpenIcon
                          size={32}
                          className="text-emerald-300 dark:text-emerald-600"
                        />
                      </div>,
                      <p className="text-base font-medium text-gray-400 dark:text-slate-500">
                        {"No hay cursos creados"}
                      </p>,
                      <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">
                        {p
                          ? "Crea tu primer curso para comenzar"
                          : "Un administrador debe crear los cursos"}
                      </p>,
                    ]}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {H.map((t) => {
                    const s = F.filter((d) => d.courseId === t.id),
                      l = W.filter((d) =>
                        s.some((We) => We.id === d.sectionId),
                      ),
                      a = (t.teamIds || []).length,
                      r = b.find((d) => d.id === t.docenteId),
                      k = b.find((d) => d.id === t.tutorId),
                      x = b.find((d) => d.id === t.asistentId);
                    return jsxRuntime.jsxs(
                      "div",
                      {
                        className:
                          "group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer",
                        onClick: () => {
                          (ie(t.id), S(null), f(null), Ne("team"));
                        },
                        children: [
                          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />,
                          <div className="p-5">
                            {[
                              <div className="flex items-start justify-between gap-3">
                                {[
                                  <div className="flex-1 min-w-0">
                                    {[
                                      <h3 className="font-bold text-gray-800 dark:text-white truncate text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {t.name}
                                      </h3>,
                                      t.description && (
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
                                          {t.description}
                                        </p>
                                      ),
                                    ]}
                                  </div>,
                                  <ChevronRightIcon
                                    size={20}
                                    className="text-gray-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-1"
                                  />,
                                ]}
                              </div>,
                              <div className="flex flex-wrap gap-2 mt-3">
                                {[
                                  r && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-[11px] font-medium rounded-full">
                                      {[
                                        <GraduationCapIcon size={10} />,
                                        " ",
                                        r.name,
                                      ]}
                                    </span>
                                  ),
                                  k && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-medium rounded-full">
                                      {[<ShieldIcon size={10} />, " ", k.name]}
                                    </span>
                                  ),
                                  x && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[11px] font-medium rounded-full">
                                      {[
                                        <UserCheckIcon size={10} />,
                                        " ",
                                        x.name,
                                      ]}
                                    </span>
                                  ),
                                ]}
                              </div>,
                              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-slate-700/50">
                                {[
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                                    {[
                                      <LayersIcon size={13} />,
                                      <span>{[s.length, " secciones"]}</span>,
                                    ]}
                                  </div>,
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                                    {[
                                      <CalendarIcon size={13} />,
                                      <span>{[l.length, " clases"]}</span>,
                                    ]}
                                  </div>,
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
                                    {[
                                      <UsersIcon size={13} />,
                                      <span>{[a, " miembros"]}</span>,
                                    ]}
                                  </div>,
                                ]}
                              </div>,
                            ]}
                          </div>,
                          p && (
                            <div className="flex border-t border-gray-50 dark:border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                              {[
                                <button
                                  onClick={(d) => {
                                    (d.stopPropagation(),
                                      X(t),
                                      I({
                                        name: t.name || "",
                                        description: t.description || "",
                                        docenteId: t.docenteId || "",
                                        tutorId: t.tutorId || "",
                                        asistentId: t.asistentId || "",
                                      }),
                                      L(!0));
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors"
                                >
                                  {[<PencilIcon size={12} />, " Editar"]}
                                </button>,
                                <div className="w-px bg-gray-100 dark:bg-slate-700" />,
                                <button
                                  onClick={(d) => {
                                    (d.stopPropagation(),
                                      O({
                                        type: "course",
                                        id: t.id,
                                        label: t.name,
                                      }));
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors"
                                >
                                  {[<Trash2Icon size={12} />, " Eliminar"]}
                                </button>,
                              ]}
                            </div>
                          ),
                        ],
                      },
                      t.id,
                    );
                  })}
                </div>
              ),
            ]}
          </div>
        ),
        <Modal
          isOpen={!!g}
          onClose={() => O(null)}
          title="Confirmar eliminacion"
          maxWidth="max-w-sm"
        >
          <div className="space-y-4 text-center">
            {[
              <p className="text-gray-600 dark:text-slate-300">
                {['Eliminar "', g?.label, '"?']}
              </p>,
              <div className="flex justify-center gap-3">
                {[
                  <button
                    onClick={() => O(null)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300"
                  >
                    {"Cancelar"}
                  </button>,
                  <button
                    onClick={Ge}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                  >
                    {"Eliminar"}
                  </button>,
                ]}
              </div>,
            ]}
          </div>
        </Modal>,
        <Modal
          isOpen={Oe}
          onClose={() => L(!1)}
          title={K ? "Editar Curso" : "Nuevo Curso"}
          maxWidth="max-w-lg"
        >
          <div className="space-y-5">
            {[
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {"Nombre del curso *"}
                  </label>,
                  <input
                    type="text"
                    value={n.name}
                    onChange={(t) =>
                      I({
                        ...n,
                        name: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    placeholder="Ej: Universidad de la Vida 2026-2"
                  />,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {"Descripcion (opcional)"}
                  </label>,
                  <textarea
                    value={n.description}
                    onChange={(t) =>
                      I({
                        ...n,
                        description: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    placeholder="Describe el proposito del curso"
                    rows={2}
                  />,
                ]}
              </div>,
              <div className="border-t border-gray-100 dark:border-slate-700 pt-1">
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  {"Equipo directivo"}
                </p>
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    {[
                      <GraduationCapIcon
                        size={14}
                        className="text-violet-500"
                      />,
                      " Docente",
                    ]}
                  </label>,
                  <select
                    value={n.docenteId}
                    onChange={(t) =>
                      I({
                        ...n,
                        docenteId: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  >
                    {[
                      <option value="">{"Sin asignar"}</option>,
                      w.map((t) =>
                        jsxRuntime.jsx(
                          "option",
                          {
                            value: t.id,
                            children: t.name,
                          },
                          t.id,
                        ),
                      ),
                    ]}
                  </select>,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    {[
                      <ShieldIcon size={14} className="text-blue-500" />,
                      " Tutor",
                    ]}
                  </label>,
                  <select
                    value={n.tutorId}
                    onChange={(t) =>
                      I({
                        ...n,
                        tutorId: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  >
                    {[
                      <option value="">{"Sin asignar"}</option>,
                      w.map((t) =>
                        jsxRuntime.jsx(
                          "option",
                          {
                            value: t.id,
                            children: t.name,
                          },
                          t.id,
                        ),
                      ),
                    ]}
                  </select>,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    {[
                      <UserCheckIcon size={14} className="text-amber-500" />,
                      " Asistente",
                    ]}
                  </label>,
                  <select
                    value={n.asistentId}
                    onChange={(t) =>
                      I({
                        ...n,
                        asistentId: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  >
                    {[
                      <option value="">{"Sin asignar"}</option>,
                      w.map((t) =>
                        jsxRuntime.jsx(
                          "option",
                          {
                            value: t.id,
                            children: t.name,
                          },
                          t.id,
                        ),
                      ),
                    ]}
                  </select>,
                ]}
              </div>,
              w.length === 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2">
                  {[
                    <TriangleAlertIcon
                      size={16}
                      className="text-amber-500 flex-shrink-0"
                    />,
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {
                        "No hay miembros en el ministerio de U de la Vida. Ve a Ministerios para asignar usuarios."
                      }
                    </p>,
                  ]}
                </div>
              ),
              <button
                onClick={Le}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium"
              >
                {K ? "Actualizar" : "Crear curso"}
              </button>,
            ]}
          </div>
        </Modal>,
        <Modal
          isOpen={Pe}
          onClose={() => Q(!1)}
          title={Y ? "Editar Seccion" : "Nueva Seccion"}
          maxWidth="max-w-lg"
        >
          <div className="space-y-5">
            {[
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {"Nombre de la seccion"}
                  </label>,
                  <input
                    type="text"
                    value={u.name}
                    onChange={(t) =>
                      P({
                        ...u,
                        name: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    placeholder="Ej: Seccion A - Lunes"
                  />,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {"Descripcion (opcional)"}
                  </label>,
                  <textarea
                    value={u.description}
                    onChange={(t) =>
                      P({
                        ...u,
                        description: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    placeholder="Horario o detalles adicionales"
                    rows={2}
                  />,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    {[
                      <GraduationCapIcon
                        size={14}
                        className="text-violet-500"
                      />,
                      " Docente",
                    ]}
                  </label>,
                  <select
                    value={u.teacherId}
                    onChange={(t) =>
                      P({
                        ...u,
                        teacherId: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  >
                    {[
                      <option value="">{"Sin asignar"}</option>,
                      w.map((t) =>
                        jsxRuntime.jsx(
                          "option",
                          {
                            value: t.id,
                            children: t.name,
                          },
                          t.id,
                        ),
                      ),
                    ]}
                  </select>,
                ]}
              </div>,
              <button
                onClick={Be}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium"
              >
                {Y ? "Actualizar" : "Crear seccion"}
              </button>,
            ]}
          </div>
        </Modal>,
        <Modal
          isOpen={Fe}
          onClose={() => J(!1)}
          title={Z ? "Editar Clase" : "Nueva Clase"}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            {[
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {"Titulo de la clase"}
                  </label>,
                  <input
                    type="text"
                    value={c.title}
                    onChange={(t) =>
                      z({
                        ...c,
                        title: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    placeholder="Ej: Clase 1 - Introduccion"
                  />,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {"Fecha"}
                  </label>,
                  <input
                    type="date"
                    value={c.date}
                    onChange={(t) =>
                      z({
                        ...c,
                        date: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  />,
                ]}
              </div>,
              <div className="grid grid-cols-2 gap-3">
                {[
                  <div>
                    {[
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        {"Hora inicio"}
                      </label>,
                      <input
                        type="time"
                        value={c.startTime}
                        onChange={(t) =>
                          z({
                            ...c,
                            startTime: t.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                      />,
                    ]}
                  </div>,
                  <div>
                    {[
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        {"Hora fin"}
                      </label>,
                      <input
                        type="time"
                        value={c.endTime}
                        onChange={(t) =>
                          z({
                            ...c,
                            endTime: t.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                      />,
                    ]}
                  </div>,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {"Docente (opcional)"}
                  </label>,
                  <select
                    value={c.teacherId}
                    onChange={(t) =>
                      z({
                        ...c,
                        teacherId: t.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  >
                    {[
                      <option value="">{"Usar docente de seccion"}</option>,
                      w.map((t) =>
                        jsxRuntime.jsx(
                          "option",
                          {
                            value: t.id,
                            children: t.name,
                          },
                          t.id,
                        ),
                      ),
                    ]}
                  </select>,
                ]}
              </div>,
              <button
                onClick={Ve}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium"
              >
                {Z ? "Actualizar" : "Crear clase"}
              </button>,
            ]}
          </div>
        </Modal>,
      ]}
    </div>
  );
};
export { Udlv };
