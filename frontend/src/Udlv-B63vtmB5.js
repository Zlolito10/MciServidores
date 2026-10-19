import { j as e } from "./index-BU_ZgoWo.js";
import { u as Qe, r as i } from "./vendor-react-BwINE3B3.js";
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
} from "./vendor-firebase-BjYbfC3F.js";
import {
  u as Je,
  a as Ke,
  b as Xe,
  r as Ye,
  t as Ze,
  n as Te,
  e as o,
  M as ae,
} from "./App-BPrQ3EPG.js";
import {
  L as et,
  f as D,
  G as M,
  aj as Ee,
  P as he,
  Q as tt,
  S as be,
  ak as pe,
  e as je,
  d as G,
  al as re,
  r as fe,
  O as st,
  T as Ae,
  h as ve,
  t as at,
  a5 as le,
  am as rt,
} from "./vendor-ui-CnvYSvQL.js";
import "./vendor-pdf-Cf03QSry.js";
const xt = () => {
  const { userProfile: y } = Je(),
    { users: b, serviceAreas: de, loading: _e } = Ke(),
    N = Xe(),
    $e = Qe(),
    ye = i.useMemo(() => Ye(de), [de]),
    ke = y?.role === "master_admin" || y?.role === "admin",
    De = ke || Ze(y, de),
    p = ke,
    w = i.useMemo(() => {
      const t = Te(ye || "");
      return b.filter((s) =>
        (Array.isArray(s.areas) ? s.areas : []).some((a) => Te(a) === t),
      );
    }, [b, ye]),
    [H, Me] = i.useState([]),
    [F, Ue] = i.useState([]),
    [W, Re] = i.useState([]),
    [A, ie] = i.useState(null),
    [m, S] = i.useState(null),
    [j, f] = i.useState(null),
    [U, Ne] = i.useState("team"),
    [ne, we] = i.useState({}),
    [Ie, R] = i.useState({}),
    [Oe, L] = i.useState(!1),
    [Pe, Q] = i.useState(!1),
    [Fe, J] = i.useState(!1),
    [g, O] = i.useState(null),
    [n, I] = i.useState({
      name: "",
      description: "",
      docenteId: "",
      tutorId: "",
      asistentId: "",
    }),
    [K, X] = i.useState(null),
    [u, P] = i.useState({
      name: "",
      description: "",
      teacherId: "",
      studentIds: [],
    }),
    [Y, ce] = i.useState(null),
    [c, z] = i.useState({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      teacherId: "",
    }),
    [Z, oe] = i.useState(null);
  (i.useEffect(() => {
    const t = T(v(o, "udlv_courses"), me("createdAt", "desc")),
      s = T(v(o, "udlv_sections"), me("createdAt", "desc")),
      l = T(v(o, "udlv_classes"), me("createdAt", "desc")),
      a = te(t, (x) => {
        Me(x.docs.map((d) => ({ id: d.id, ...d.data() })));
      }),
      r = te(s, (x) => {
        Ue(x.docs.map((d) => ({ id: d.id, ...d.data() })));
      }),
      k = te(l, (x) => {
        Re(x.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    return () => {
      (a(), r(), k());
    };
  }, []),
    i.useEffect(() => {
      if (!j) {
        (we({}), R({}));
        return;
      }
      const t = T(v(o, "udlv_class_records"), q("classId", "==", j)),
        s = te(t, (l) => {
          const a = {};
          (l.docs.forEach((r) => {
            a[r.id] = { id: r.id, ...r.data() };
          }),
            we(a),
            R({}));
        });
      return () => s();
    }, [j]));
  const h = H.find((t) => t.id === A) || null,
    B = F.find((t) => t.id === m) || null,
    _ = W.find((t) => t.id === j) || null,
    C = i.useMemo(() => F.filter((t) => t.courseId === A), [F, A]),
    ee = i.useMemo(() => {
      const t = h?.teamIds || [];
      return b.filter((s) => t.includes(s.id));
    }, [h?.teamIds, b]),
    V = i.useMemo(
      () => (p ? !0 : !_ || !y?.uid ? !1 : _.teacherId === y.uid),
      [p, _, y?.uid],
    ),
    $ = i.useMemo(() => W.filter((t) => t.sectionId === m), [W, m]),
    Ce = i.useMemo(
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
    return e.jsxs("div", {
      className: "flex flex-col items-center justify-center py-24 gap-4",
      children: [
        e.jsx(et, { className: "w-10 h-10 animate-spin text-emerald-500" }),
        e.jsx("p", {
          className: "text-gray-500 dark:text-slate-400 text-sm",
          children: "Cargando datos...",
        }),
      ],
    });
  if (!De)
    return e.jsxs("div", {
      className: "flex flex-col items-center justify-center py-24 gap-4",
      children: [
        e.jsx("div", {
          className:
            "w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center",
          children: e.jsx(D, {
            size: 28,
            className: "text-gray-300 dark:text-slate-600",
          }),
        }),
        e.jsx("p", {
          className: "text-gray-500 dark:text-slate-400 text-sm",
          children: "No tienes acceso a esta seccion.",
        }),
      ],
    });
  const Le = async () => {
      if (!n.name.trim()) {
        N.showError("Nombre del curso es obligatorio");
        return;
      }
      const t = [n.docenteId, n.tutorId, n.asistentId].filter(Boolean),
        s = Array.from(new Set([...w.map((l) => l.id), ...t]));
      (K
        ? await ge(E(o, "udlv_courses", K.id), {
            name: n.name.trim(),
            description: n.description.trim(),
            docenteId: n.docenteId || "",
            tutorId: n.tutorId || "",
            asistentId: n.asistentId || "",
            teamIds: s,
          })
        : await ue(v(o, "udlv_courses"), {
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
        ? await ge(E(o, "udlv_sections", Y.id), {
            name: u.name.trim(),
            description: u.description.trim(),
            teacherId: u.teacherId || "",
            studentIds: u.studentIds,
          })
        : await ue(v(o, "udlv_sections"), {
            courseId: A,
            name: u.name.trim(),
            description: u.description.trim(),
            teacherId: u.teacherId || "",
            studentIds: u.studentIds,
            createdAt: new Date(),
            createdBy: y?.uid || "",
          }),
        Q(!1),
        P({ name: "", description: "", teacherId: "", studentIds: [] }),
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
        ? await ge(E(o, "udlv_classes", Z.id), {
            title: c.title.trim(),
            date: c.date,
            startTime: c.startTime || "",
            endTime: c.endTime || "",
            teacherId: c.teacherId || B?.teacherId || "",
          })
        : await ue(v(o, "udlv_classes"), {
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
        z({ title: "", date: "", startTime: "", endTime: "", teacherId: "" }),
        oe(null));
    },
    qe = async () => {
      if (!j || !V) return;
      const t = Se(o),
        s = new Date();
      (Object.entries(Ie).forEach(([l, a]) => {
        const r = `${j}_${l}`,
          k = E(o, "udlv_class_records", r);
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
          { merge: !0 },
        );
      }),
        await t.commit(),
        R({}),
        N.showSuccess("Asistencia y notas guardadas"));
    },
    xe = async (t) => {
      const s = await ze(t);
      if (s.empty) return;
      const l = Se(o);
      (s.docs.forEach((a) => l.delete(a.ref)), await l.commit());
    },
    Ge = async () => {
      if (g)
        try {
          if (g.type === "course") {
            await se(E(o, "udlv_courses", g.id));
            const t = await ze(
              T(v(o, "udlv_sections"), q("courseId", "==", g.id)),
            );
            for (const s of t.docs) {
              const l = s.id;
              (await xe(T(v(o, "udlv_classes"), q("sectionId", "==", l))),
                await se(E(o, "udlv_sections", l)));
            }
            A === g.id && (ie(null), S(null), f(null));
          }
          (g.type === "section" &&
            (await xe(T(v(o, "udlv_classes"), q("sectionId", "==", g.id))),
            await se(E(o, "udlv_sections", g.id)),
            m === g.id && (S(null), f(null))),
            g.type === "class" &&
              (await xe(
                T(v(o, "udlv_class_records"), q("classId", "==", g.id)),
              ),
              await se(E(o, "udlv_classes", g.id)),
              j === g.id && f(null)),
            O(null),
            N.showSuccess("Eliminado correctamente"));
        } catch (t) {
          (console.error(t), N.showError("No se pudo eliminar"));
        }
    },
    He = [
      { key: "team", label: "Equipo", icon: e.jsx(D, { size: 15 }) },
      { key: "sections", label: "Secciones", icon: e.jsx(je, { size: 15 }) },
      { key: "classes", label: "Clases", icon: e.jsx(G, { size: 15 }) },
      { key: "attendance", label: "Asistencia", icon: e.jsx(ve, { size: 15 }) },
      { key: "report", label: "Reporte", icon: e.jsx(le, { size: 15 }) },
    ];
  return e.jsxs("div", {
    className: "space-y-6",
    children: [
      e.jsxs("div", {
        className:
          "relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg",
        children: [
          e.jsx("div", {
            className:
              "absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl",
          }),
          e.jsx("div", {
            className:
              "absolute -bottom-8 -left-8 w-36 h-36 bg-black/10 rounded-full blur-2xl",
          }),
          e.jsxs("div", {
            className:
              "relative flex flex-col sm:flex-row sm:items-center gap-4",
            children: [
              e.jsx("div", {
                className:
                  "w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 ring-2 ring-white/30",
                children: e.jsx(M, { size: 28 }),
              }),
              e.jsxs("div", {
                className: "flex-1",
                children: [
                  e.jsx("h1", {
                    className: "text-2xl sm:text-3xl font-bold tracking-tight",
                    children: "U de la Vida",
                  }),
                  e.jsx("p", {
                    className: "text-emerald-100 text-sm mt-0.5",
                    children: "Gestion de cursos, secciones y clases",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex gap-3 sm:gap-5",
                children: [
                  e.jsxs("div", {
                    className: "text-center",
                    children: [
                      e.jsx("div", {
                        className: "text-2xl font-bold",
                        children: H.length,
                      }),
                      e.jsx("div", {
                        className:
                          "text-xs text-emerald-100 uppercase tracking-wide",
                        children: "Cursos",
                      }),
                    ],
                  }),
                  e.jsx("div", { className: "w-px bg-white/20" }),
                  e.jsxs("div", {
                    className: "text-center",
                    children: [
                      e.jsx("div", {
                        className: "text-2xl font-bold",
                        children: F.length,
                      }),
                      e.jsx("div", {
                        className:
                          "text-xs text-emerald-100 uppercase tracking-wide",
                        children: "Secciones",
                      }),
                    ],
                  }),
                  e.jsx("div", { className: "w-px bg-white/20" }),
                  e.jsxs("div", {
                    className: "text-center",
                    children: [
                      e.jsx("div", {
                        className: "text-2xl font-bold",
                        children: w.length,
                      }),
                      e.jsx("div", {
                        className:
                          "text-xs text-emerald-100 uppercase tracking-wide",
                        children: "Miembros",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      A
        ? e.jsxs("div", {
            className: "space-y-5",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  e.jsx("button", {
                    onClick: () => {
                      (ie(null), S(null), f(null));
                    },
                    className:
                      "w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors",
                    children: e.jsx(st, { size: 18 }),
                  }),
                  e.jsxs("div", {
                    className: "flex-1 min-w-0",
                    children: [
                      e.jsx("h2", {
                        className:
                          "text-xl font-bold text-gray-800 dark:text-white truncate",
                        children: h?.name,
                      }),
                      h?.description &&
                        e.jsx("p", {
                          className:
                            "text-sm text-gray-500 dark:text-slate-400 truncate",
                          children: h.description,
                        }),
                    ],
                  }),
                ],
              }),
              e.jsx("div", {
                className:
                  "flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 overflow-x-auto",
                children: He.map((t) =>
                  e.jsxs(
                    "button",
                    {
                      onClick: () => Ne(t.key),
                      className: `flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${U === t.key ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"}`,
                      children: [t.icon, " ", t.label],
                    },
                    t.key,
                  ),
                ),
              }),
              U === "team" &&
                (() => {
                  const t = b.find((r) => r.id === h?.docenteId),
                    s = b.find((r) => r.id === h?.tutorId),
                    l = b.find((r) => r.id === h?.asistentId),
                    a = [
                      {
                        label: "Docente",
                        icon: e.jsx(M, { size: 20 }),
                        user: t,
                        color: "violet",
                        gradient: "from-violet-500 to-purple-600",
                        bgLight: "bg-violet-50 dark:bg-violet-900/20",
                        textColor: "text-violet-600 dark:text-violet-400",
                      },
                      {
                        label: "Tutor",
                        icon: e.jsx(be, { size: 20 }),
                        user: s,
                        color: "blue",
                        gradient: "from-blue-500 to-indigo-600",
                        bgLight: "bg-blue-50 dark:bg-blue-900/20",
                        textColor: "text-blue-600 dark:text-blue-400",
                      },
                      {
                        label: "Asistente",
                        icon: e.jsx(pe, { size: 20 }),
                        user: l,
                        color: "amber",
                        gradient: "from-amber-500 to-orange-600",
                        bgLight: "bg-amber-50 dark:bg-amber-900/20",
                        textColor: "text-amber-600 dark:text-amber-400",
                      },
                    ];
                  return e.jsxs("div", {
                    className: "space-y-5",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsxs("h3", {
                            className:
                              "text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2",
                            children: [
                              e.jsx(M, { size: 14 }),
                              " Equipo directivo",
                            ],
                          }),
                          e.jsx("div", {
                            className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                            children: a.map((r) =>
                              e.jsxs(
                                "div",
                                {
                                  className:
                                    "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm",
                                  children: [
                                    e.jsx("div", {
                                      className: `h-1.5 bg-gradient-to-r ${r.gradient}`,
                                    }),
                                    e.jsxs("div", {
                                      className: "p-4",
                                      children: [
                                        e.jsxs("div", {
                                          className:
                                            "flex items-center gap-2 mb-3",
                                          children: [
                                            e.jsx("div", {
                                              className: `w-8 h-8 rounded-lg ${r.bgLight} flex items-center justify-center ${r.textColor}`,
                                              children: r.icon,
                                            }),
                                            e.jsx("span", {
                                              className:
                                                "text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500",
                                              children: r.label,
                                            }),
                                          ],
                                        }),
                                        r.user
                                          ? e.jsxs("div", {
                                              className:
                                                "flex items-center gap-2.5",
                                              children: [
                                                e.jsx("div", {
                                                  className: `w-10 h-10 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm`,
                                                  children:
                                                    r.user.name
                                                      ?.charAt(0)
                                                      ?.toUpperCase() || "?",
                                                }),
                                                e.jsxs("div", {
                                                  className: "min-w-0 flex-1",
                                                  children: [
                                                    e.jsx("p", {
                                                      className:
                                                        "font-semibold text-gray-800 dark:text-white text-sm truncate",
                                                      children: r.user.name,
                                                    }),
                                                    e.jsx("p", {
                                                      className: `text-[10px] font-medium ${r.textColor}`,
                                                      children: "Asignado",
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            })
                                          : e.jsxs("div", {
                                              className:
                                                "flex items-center gap-2.5 opacity-50",
                                              children: [
                                                e.jsx("div", {
                                                  className:
                                                    "w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center",
                                                  children: e.jsx(D, {
                                                    size: 16,
                                                    className:
                                                      "text-gray-300 dark:text-slate-600",
                                                  }),
                                                }),
                                                e.jsx("p", {
                                                  className:
                                                    "text-xs text-gray-400 dark:text-slate-500 italic",
                                                  children: "Sin asignar",
                                                }),
                                              ],
                                            }),
                                      ],
                                    }),
                                  ],
                                },
                                r.label,
                              ),
                            ),
                          }),
                          p &&
                            e.jsxs("button", {
                              onClick: () => {
                                (X(h),
                                  I({
                                    name: h?.name || "",
                                    description: h?.description || "",
                                    docenteId: h?.docenteId || "",
                                    tutorId: h?.tutorId || "",
                                    asistentId: h?.asistentId || "",
                                  }),
                                  L(!0));
                              },
                              className:
                                "mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors",
                              children: [
                                e.jsx(re, { size: 14 }),
                                " Editar roles del curso",
                              ],
                            }),
                        ],
                      }),
                      p &&
                        w.length === 0 &&
                        e.jsxs("div", {
                          className:
                            "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3",
                          children: [
                            e.jsx("div", {
                              className:
                                "w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0",
                              children: e.jsx(Ae, {
                                size: 20,
                                className: "text-amber-600 dark:text-amber-400",
                              }),
                            }),
                            e.jsxs("div", {
                              className: "flex-1",
                              children: [
                                e.jsx("p", {
                                  className:
                                    "font-medium text-amber-800 dark:text-amber-200 text-sm",
                                  children:
                                    "No hay usuarios con acceso a U de la Vida",
                                }),
                                e.jsx("p", {
                                  className:
                                    "text-xs text-amber-600 dark:text-amber-400 mt-0.5",
                                  children:
                                    'Asigna el ministerio "U de la Vida" a los servidores desde Ministerios',
                                }),
                                e.jsxs("button", {
                                  onClick: () => $e("/dashboard/areas"),
                                  className:
                                    "mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition-colors",
                                  children: [
                                    e.jsx(D, { size: 15 }),
                                    " Ir a Ministerios",
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                    ],
                  });
                })(),
              U === "sections" &&
                e.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between",
                      children: [
                        e.jsxs("p", {
                          className:
                            "text-sm text-gray-500 dark:text-slate-400",
                          children: [C.length, " secciones en este curso"],
                        }),
                        p &&
                          e.jsxs("button", {
                            onClick: () => {
                              (ce(null),
                                P({
                                  name: "",
                                  description: "",
                                  teacherId: "",
                                  studentIds: [],
                                }),
                                Q(!0));
                            },
                            className:
                              "flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm",
                            children: [
                              e.jsx(he, { size: 15 }),
                              " Nueva seccion",
                            ],
                          }),
                      ],
                    }),
                    C.length === 0
                      ? e.jsxs("div", {
                          className:
                            "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 py-16 flex flex-col items-center justify-center text-center select-none",
                          children: [
                            e.jsx("div", {
                              className:
                                "w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3",
                              children: e.jsx(je, {
                                size: 24,
                                className: "text-blue-300 dark:text-blue-600",
                              }),
                            }),
                            e.jsx("p", {
                              className:
                                "text-sm font-medium text-gray-400 dark:text-slate-500",
                              children: "Sin secciones",
                            }),
                            e.jsx("p", {
                              className:
                                "text-xs text-gray-300 dark:text-slate-600 mt-1",
                              children:
                                "Crea una seccion para organizar estudiantes",
                            }),
                          ],
                        })
                      : e.jsx("div", {
                          className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                          children: C.map((t) => {
                            const s = b.find((a) => a.id === t.teacherId),
                              l = m === t.id;
                            return e.jsxs(
                              "div",
                              {
                                onClick: () => {
                                  (S(t.id), f(null));
                                },
                                className: `bg-white dark:bg-slate-800 rounded-xl border p-4 cursor-pointer transition-all ${l ? "border-emerald-400 ring-1 ring-emerald-400/30 shadow-md" : "border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 shadow-sm hover:shadow-md"}`,
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "flex items-start justify-between gap-2",
                                    children: [
                                      e.jsxs("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                          e.jsx("h4", {
                                            className:
                                              "font-bold text-gray-800 dark:text-white truncate",
                                            children: t.name,
                                          }),
                                          t.description &&
                                            e.jsx("p", {
                                              className:
                                                "text-xs text-gray-400 dark:text-slate-500 mt-0.5 truncate",
                                              children: t.description,
                                            }),
                                        ],
                                      }),
                                      p &&
                                        e.jsxs("div", {
                                          className:
                                            "flex items-center gap-0.5 flex-shrink-0",
                                          children: [
                                            e.jsx("button", {
                                              onClick: (a) => {
                                                (a.stopPropagation(),
                                                  ce(t),
                                                  P({
                                                    name: t.name || "",
                                                    description:
                                                      t.description || "",
                                                    teacherId:
                                                      t.teacherId || "",
                                                    studentIds:
                                                      t.studentIds || [],
                                                  }),
                                                  Q(!0));
                                              },
                                              className:
                                                "p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg transition-colors",
                                              children: e.jsx(re, { size: 13 }),
                                            }),
                                            e.jsx("button", {
                                              onClick: (a) => {
                                                (a.stopPropagation(),
                                                  O({
                                                    type: "section",
                                                    id: t.id,
                                                    label: t.name,
                                                  }));
                                              },
                                              className:
                                                "p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors",
                                              children: e.jsx(fe, { size: 13 }),
                                            }),
                                          ],
                                        }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 dark:border-slate-700/50",
                                    children: [
                                      s
                                        ? e.jsxs("span", {
                                            className:
                                              "inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-xs font-medium rounded-full",
                                            children: [
                                              e.jsx(M, { size: 11 }),
                                              " ",
                                              s.name,
                                            ],
                                          })
                                        : e.jsx("span", {
                                            className:
                                              "text-xs text-gray-300 dark:text-slate-600 italic",
                                            children: "Sin docente",
                                          }),
                                      e.jsxs("span", {
                                        className:
                                          "flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500",
                                        children: [
                                          e.jsx(D, { size: 11 }),
                                          " ",
                                          t.studentIds?.length || 0,
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              t.id,
                            );
                          }),
                        }),
                  ],
                }),
              U === "classes" &&
                e.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    C.length > 0 &&
                      e.jsxs("div", {
                        className: "flex items-center gap-2 flex-wrap",
                        children: [
                          e.jsx("span", {
                            className:
                              "text-sm text-gray-500 dark:text-slate-400",
                            children: "Seccion:",
                          }),
                          C.map((t) =>
                            e.jsx(
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
                        ],
                      }),
                    e.jsxs("div", {
                      className: "flex items-center justify-between",
                      children: [
                        e.jsx("p", {
                          className:
                            "text-sm text-gray-500 dark:text-slate-400",
                          children: m
                            ? `${$.length} clases`
                            : "Selecciona una seccion",
                        }),
                        p &&
                          m &&
                          e.jsxs("button", {
                            onClick: () => {
                              (oe(null),
                                z({
                                  title: "",
                                  date: "",
                                  startTime: "",
                                  endTime: "",
                                  teacherId: "",
                                }),
                                J(!0));
                            },
                            className:
                              "flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm",
                            children: [e.jsx(he, { size: 15 }), " Nueva clase"],
                          }),
                      ],
                    }),
                    m
                      ? $.length === 0
                        ? e.jsxs("div", {
                            className:
                              "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 py-14 flex flex-col items-center text-center select-none",
                            children: [
                              e.jsx("div", {
                                className:
                                  "w-14 h-14 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-3",
                                children: e.jsx(G, {
                                  size: 22,
                                  className: "text-violet-300",
                                }),
                              }),
                              e.jsx("p", {
                                className:
                                  "text-sm font-medium text-gray-400 dark:text-slate-500",
                                children: "Sin clases",
                              }),
                              e.jsx("p", {
                                className:
                                  "text-xs text-gray-300 dark:text-slate-600 mt-1",
                                children:
                                  "Programa la primera clase de esta seccion",
                              }),
                            ],
                          })
                        : e.jsx("div", {
                            className: "space-y-2",
                            children: $.map((t) => {
                              const s = j === t.id,
                                l = b.find((a) => a.id === t.teacherId);
                              return e.jsxs(
                                "div",
                                {
                                  onClick: () => f(t.id),
                                  className: `bg-white dark:bg-slate-800 rounded-xl border p-4 cursor-pointer transition-all flex items-center gap-4 ${s ? "border-violet-400 ring-1 ring-violet-400/30 shadow-md" : "border-gray-100 dark:border-slate-700 hover:border-gray-200 shadow-sm hover:shadow-md"}`,
                                  children: [
                                    e.jsx("div", {
                                      className: `w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-xs font-bold ${s ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"}`,
                                      children: t.date
                                        ? e.jsxs(e.Fragment, {
                                            children: [
                                              e.jsx("span", {
                                                className:
                                                  "text-[10px] uppercase",
                                                children: new Date(
                                                  t.date + "T12:00",
                                                ).toLocaleDateString("es", {
                                                  month: "short",
                                                }),
                                              }),
                                              e.jsx("span", {
                                                className:
                                                  "text-sm leading-none",
                                                children: new Date(
                                                  t.date + "T12:00",
                                                ).getDate(),
                                              }),
                                            ],
                                          })
                                        : e.jsx(G, { size: 16 }),
                                    }),
                                    e.jsxs("div", {
                                      className: "flex-1 min-w-0",
                                      children: [
                                        e.jsx("h4", {
                                          className:
                                            "font-semibold text-gray-800 dark:text-white truncate",
                                          children: t.title,
                                        }),
                                        e.jsxs("div", {
                                          className:
                                            "flex items-center gap-2 mt-0.5 text-xs text-gray-400 dark:text-slate-500",
                                          children: [
                                            t.startTime &&
                                              e.jsxs("span", {
                                                children: [
                                                  t.startTime,
                                                  t.endTime
                                                    ? ` - ${t.endTime}`
                                                    : "",
                                                ],
                                              }),
                                            l &&
                                              e.jsxs("span", {
                                                children: ["- ", l.name],
                                              }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    p &&
                                      e.jsxs("div", {
                                        className:
                                          "flex items-center gap-0.5 flex-shrink-0",
                                        children: [
                                          e.jsx("button", {
                                            onClick: (a) => {
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
                                            },
                                            className:
                                              "p-1.5 text-gray-400 hover:text-violet-600 rounded-lg transition-colors",
                                            children: e.jsx(re, { size: 13 }),
                                          }),
                                          e.jsx("button", {
                                            onClick: (a) => {
                                              (a.stopPropagation(),
                                                O({
                                                  type: "class",
                                                  id: t.id,
                                                  label: t.title,
                                                }));
                                            },
                                            className:
                                              "p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors",
                                            children: e.jsx(fe, { size: 13 }),
                                          }),
                                        ],
                                      }),
                                  ],
                                },
                                t.id,
                              );
                            }),
                          })
                      : e.jsxs("div", {
                          className:
                            "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 py-14 flex flex-col items-center text-center select-none",
                          children: [
                            e.jsx("div", {
                              className:
                                "w-14 h-14 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-3",
                              children: e.jsx(G, {
                                size: 22,
                                className: "text-violet-300",
                              }),
                            }),
                            e.jsx("p", {
                              className:
                                "text-sm font-medium text-gray-400 dark:text-slate-500",
                              children: "Selecciona una seccion arriba",
                            }),
                          ],
                        }),
                  ],
                }),
              U === "attendance" &&
                e.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    C.length > 0 &&
                      e.jsxs("div", {
                        className: "flex items-center gap-2 flex-wrap",
                        children: [
                          e.jsx("span", {
                            className:
                              "text-sm text-gray-500 dark:text-slate-400",
                            children: "Seccion:",
                          }),
                          C.map((t) =>
                            e.jsx(
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
                        ],
                      }),
                    m &&
                      $.length > 0 &&
                      e.jsxs("div", {
                        className: "flex items-center gap-2 flex-wrap",
                        children: [
                          e.jsx("span", {
                            className:
                              "text-sm text-gray-500 dark:text-slate-400",
                            children: "Clase:",
                          }),
                          $.map((t) =>
                            e.jsx(
                              "button",
                              {
                                onClick: () => f(t.id),
                                className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${j === t.id ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200"}`,
                                children: t.title,
                              },
                              t.id,
                            ),
                          ),
                        ],
                      }),
                    e.jsxs("div", {
                      className:
                        "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm",
                      children: [
                        e.jsxs("div", {
                          className:
                            "flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/80",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-3",
                              children: [
                                e.jsx("div", {
                                  className:
                                    "w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center",
                                  children: e.jsx(ve, {
                                    size: 18,
                                    className:
                                      "text-amber-600 dark:text-amber-400",
                                  }),
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("h3", {
                                      className:
                                        "font-bold text-gray-800 dark:text-white",
                                      children: "Asistencia y notas",
                                    }),
                                    e.jsx("p", {
                                      className:
                                        "text-xs text-gray-400 dark:text-slate-500",
                                      children: _
                                        ? _.title
                                        : "Selecciona una clase",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            V &&
                              _ &&
                              e.jsxs("button", {
                                onClick: qe,
                                className:
                                  "flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm",
                                children: [e.jsx(at, { size: 15 }), " Guardar"],
                              }),
                          ],
                        }),
                        _
                          ? e.jsx("div", {
                              className: "p-4 sm:p-5",
                              children:
                                ee.length > 0
                                  ? e.jsxs(e.Fragment, {
                                      children: [
                                        e.jsxs("div", {
                                          className:
                                            "hidden lg:grid grid-cols-[1fr_140px_100px_1fr] gap-3 px-3 pb-2 mb-2 border-b border-gray-100 dark:border-slate-700",
                                          children: [
                                            e.jsx("div", {
                                              className:
                                                "text-xs font-semibold uppercase tracking-wider text-gray-400",
                                              children: "Estudiante",
                                            }),
                                            e.jsx("div", {
                                              className:
                                                "text-xs font-semibold uppercase tracking-wider text-gray-400",
                                              children: "Asistencia",
                                            }),
                                            e.jsx("div", {
                                              className:
                                                "text-xs font-semibold uppercase tracking-wider text-gray-400",
                                              children: "Nota",
                                            }),
                                            e.jsx("div", {
                                              className:
                                                "text-xs font-semibold uppercase tracking-wider text-gray-400",
                                              children: "Observaciones",
                                            }),
                                          ],
                                        }),
                                        e.jsx("div", {
                                          className: "space-y-2",
                                          children: ee.map((t) => {
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
                                            return e.jsxs(
                                              "div",
                                              {
                                                className: `grid grid-cols-1 lg:grid-cols-[1fr_140px_100px_1fr] gap-2 lg:gap-3 items-center rounded-xl p-3 transition-colors ${a === "present" ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "bg-gray-50/50 dark:bg-slate-900/20"}`,
                                                children: [
                                                  e.jsxs("div", {
                                                    className:
                                                      "flex items-center gap-2",
                                                    children: [
                                                      e.jsx("div", {
                                                        className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${a === "present" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400"}`,
                                                        children:
                                                          t.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                          "?",
                                                      }),
                                                      e.jsx("span", {
                                                        className:
                                                          "font-medium text-gray-800 dark:text-slate-100 truncate text-sm",
                                                        children: t.name,
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsxs("select", {
                                                    value: a,
                                                    disabled: !V,
                                                    onChange: (x) =>
                                                      R((d) => ({
                                                        ...d,
                                                        [t.id]: {
                                                          ...d[t.id],
                                                          attendance:
                                                            x.target.value,
                                                        },
                                                      })),
                                                    className: `px-2.5 py-2 rounded-lg border text-sm font-medium transition-colors ${a === "present" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300" : "border-gray-200 bg-white text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"}`,
                                                    children: [
                                                      e.jsx("option", {
                                                        value: "present",
                                                        children: "Presente",
                                                      }),
                                                      e.jsx("option", {
                                                        value: "absent",
                                                        children: "Ausente",
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsx("input", {
                                                    type: "number",
                                                    min: 0,
                                                    max: 10,
                                                    step: 0.1,
                                                    value: r,
                                                    disabled: !V,
                                                    onChange: (x) =>
                                                      R((d) => ({
                                                        ...d,
                                                        [t.id]: {
                                                          ...d[t.id],
                                                          score:
                                                            x.target.value ===
                                                            ""
                                                              ? void 0
                                                              : Number(
                                                                  x.target
                                                                    .value,
                                                                ),
                                                        },
                                                      })),
                                                    className:
                                                      "px-2.5 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                                                    placeholder: "0-10",
                                                  }),
                                                  e.jsx("input", {
                                                    type: "text",
                                                    value: k,
                                                    disabled: !V,
                                                    onChange: (x) =>
                                                      R((d) => ({
                                                        ...d,
                                                        [t.id]: {
                                                          ...d[t.id],
                                                          notes: x.target.value,
                                                        },
                                                      })),
                                                    className:
                                                      "px-2.5 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                                                    placeholder:
                                                      "Observaciones...",
                                                  }),
                                                ],
                                              },
                                              t.id,
                                            );
                                          }),
                                        }),
                                      ],
                                    })
                                  : e.jsxs("div", {
                                      className:
                                        "flex flex-col items-center py-10 text-center select-none",
                                      children: [
                                        e.jsx(D, {
                                          size: 28,
                                          className:
                                            "text-gray-200 dark:text-slate-700 mb-2",
                                        }),
                                        e.jsx("p", {
                                          className:
                                            "text-sm text-gray-400 dark:text-slate-500",
                                          children:
                                            "No hay miembros en el equipo",
                                        }),
                                        e.jsx("p", {
                                          className:
                                            "text-xs text-gray-300 dark:text-slate-600 mt-1",
                                          children:
                                            'Ve a la pestaña "Equipo" para agregar miembros',
                                        }),
                                      ],
                                    }),
                            })
                          : e.jsxs("div", {
                              className:
                                "flex flex-col items-center py-16 text-center select-none",
                              children: [
                                e.jsx(ve, {
                                  size: 32,
                                  className:
                                    "text-gray-200 dark:text-slate-700 mb-3",
                                }),
                                e.jsx("p", {
                                  className:
                                    "text-sm text-gray-400 dark:text-slate-500",
                                  children: "Selecciona una seccion y clase",
                                }),
                                e.jsx("p", {
                                  className:
                                    "text-xs text-gray-300 dark:text-slate-600 mt-1",
                                  children: "Para registrar asistencia y notas",
                                }),
                              ],
                            }),
                      ],
                    }),
                  ],
                }),
              U === "report" &&
                e.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    C.length > 0 &&
                      e.jsxs("div", {
                        className: "flex items-center gap-2 flex-wrap",
                        children: [
                          e.jsx("span", {
                            className:
                              "text-sm text-gray-500 dark:text-slate-400",
                            children: "Seccion:",
                          }),
                          C.map((t) =>
                            e.jsx(
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
                        ],
                      }),
                    e.jsxs("div", {
                      className:
                        "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm",
                      children: [
                        e.jsxs("div", {
                          className:
                            "flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/80",
                          children: [
                            e.jsx("div", {
                              className:
                                "w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center",
                              children: e.jsx(le, {
                                size: 18,
                                className:
                                  "text-indigo-600 dark:text-indigo-400",
                              }),
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className:
                                    "font-bold text-gray-800 dark:text-white",
                                  children: "Reporte",
                                }),
                                e.jsx("p", {
                                  className:
                                    "text-xs text-gray-400 dark:text-slate-500",
                                  children: B
                                    ? B.name
                                    : "Selecciona una seccion",
                                }),
                              ],
                            }),
                          ],
                        }),
                        B
                          ? Ce.length > 0
                            ? e.jsxs("div", {
                                className: "p-4 sm:p-5",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "hidden lg:grid grid-cols-[1fr_180px_120px] gap-3 px-3 pb-2 mb-2 border-b border-gray-100 dark:border-slate-700",
                                    children: [
                                      e.jsx("div", {
                                        className:
                                          "text-xs font-semibold uppercase tracking-wider text-gray-400",
                                        children: "Estudiante",
                                      }),
                                      e.jsx("div", {
                                        className:
                                          "text-xs font-semibold uppercase tracking-wider text-gray-400",
                                        children: "Asistencia",
                                      }),
                                      e.jsx("div", {
                                        className:
                                          "text-xs font-semibold uppercase tracking-wider text-gray-400",
                                        children: "Promedio",
                                      }),
                                    ],
                                  }),
                                  e.jsx("div", {
                                    className: "space-y-2",
                                    children: Ce.map((t) => {
                                      const s =
                                        t.total > 0
                                          ? Math.round(
                                              (t.present / t.total) * 100,
                                            )
                                          : 0;
                                      return e.jsxs(
                                        "div",
                                        {
                                          className:
                                            "grid grid-cols-1 lg:grid-cols-[1fr_180px_120px] gap-2 lg:gap-3 items-center rounded-xl p-3 bg-gray-50/50 dark:bg-slate-900/20",
                                          children: [
                                            e.jsxs("div", {
                                              className:
                                                "flex items-center gap-2",
                                              children: [
                                                e.jsx("div", {
                                                  className:
                                                    "w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0",
                                                  children:
                                                    t.name
                                                      ?.charAt(0)
                                                      ?.toUpperCase() || "?",
                                                }),
                                                e.jsx("span", {
                                                  className:
                                                    "font-medium text-gray-800 dark:text-slate-100 truncate text-sm",
                                                  children: t.name,
                                                }),
                                              ],
                                            }),
                                            e.jsx("div", {
                                              className:
                                                "flex items-center gap-2",
                                              children:
                                                t.total > 0
                                                  ? e.jsxs(e.Fragment, {
                                                      children: [
                                                        e.jsx("div", {
                                                          className:
                                                            "flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden",
                                                          children: e.jsx(
                                                            "div",
                                                            {
                                                              className: `h-full rounded-full ${s >= 80 ? "bg-emerald-500" : s >= 50 ? "bg-amber-500" : "bg-red-500"}`,
                                                              style: {
                                                                width: `${s}%`,
                                                              },
                                                            },
                                                          ),
                                                        }),
                                                        e.jsxs("span", {
                                                          className:
                                                            "text-xs font-medium text-gray-600 dark:text-slate-300 w-16 text-right",
                                                          children: [
                                                            t.present,
                                                            "/",
                                                            t.total,
                                                            " (",
                                                            s,
                                                            "%)",
                                                          ],
                                                        }),
                                                      ],
                                                    })
                                                  : e.jsx("span", {
                                                      className:
                                                        "text-xs text-gray-400 dark:text-slate-500",
                                                      children: "Sin clases",
                                                    }),
                                            }),
                                            e.jsx("div", {
                                              children:
                                                t.avgScore !== null
                                                  ? e.jsxs("div", {
                                                      className:
                                                        "flex items-center gap-1.5",
                                                      children: [
                                                        e.jsx(rt, {
                                                          size: 14,
                                                          className:
                                                            t.avgScore >= 7
                                                              ? "text-emerald-500"
                                                              : t.avgScore >= 5
                                                                ? "text-amber-500"
                                                                : "text-red-500",
                                                        }),
                                                        e.jsx("span", {
                                                          className: `text-sm font-bold ${t.avgScore >= 7 ? "text-emerald-600 dark:text-emerald-400" : t.avgScore >= 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`,
                                                          children: t.avgScore,
                                                        }),
                                                      ],
                                                    })
                                                  : e.jsx("span", {
                                                      className:
                                                        "text-xs text-gray-400 dark:text-slate-500",
                                                      children: "-",
                                                    }),
                                            }),
                                          ],
                                        },
                                        t.studentId,
                                      );
                                    }),
                                  }),
                                ],
                              })
                            : e.jsxs("div", {
                                className:
                                  "flex flex-col items-center py-14 text-center select-none",
                                children: [
                                  e.jsx(le, {
                                    size: 28,
                                    className:
                                      "text-gray-200 dark:text-slate-700 mb-2",
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "text-sm text-gray-400 dark:text-slate-500",
                                    children: "Sin datos aun",
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "text-xs text-gray-300 dark:text-slate-600 mt-1",
                                    children: "Registra asistencia primero",
                                  }),
                                ],
                              })
                          : e.jsxs("div", {
                              className:
                                "flex flex-col items-center py-16 text-center select-none",
                              children: [
                                e.jsx(le, {
                                  size: 32,
                                  className:
                                    "text-gray-200 dark:text-slate-700 mb-3",
                                }),
                                e.jsx("p", {
                                  className:
                                    "text-sm text-gray-400 dark:text-slate-500",
                                  children: "Selecciona una seccion",
                                }),
                              ],
                            }),
                      ],
                    }),
                  ],
                }),
            ],
          })
        : e.jsxs("div", {
            className: "space-y-4",
            children: [
              e.jsxs("div", {
                className: "flex items-center justify-between",
                children: [
                  e.jsxs("h2", {
                    className:
                      "text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2",
                    children: [
                      e.jsx(Ee, { size: 20, className: "text-emerald-500" }),
                      " Cursos",
                    ],
                  }),
                  p &&
                    e.jsxs("button", {
                      onClick: () => {
                        (X(null),
                          I({
                            name: "",
                            description: "",
                            docenteId: "",
                            tutorId: "",
                            asistentId: "",
                          }),
                          L(!0));
                      },
                      className:
                        "flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all",
                      children: [e.jsx(he, { size: 16 }), " Nuevo curso"],
                    }),
                ],
              }),
              H.length === 0
                ? e.jsx("div", {
                    className:
                      "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm",
                    children: e.jsxs("div", {
                      className:
                        "flex flex-col items-center justify-center py-20 select-none",
                      children: [
                        e.jsx("div", {
                          className:
                            "w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4",
                          children: e.jsx(Ee, {
                            size: 32,
                            className: "text-emerald-300 dark:text-emerald-600",
                          }),
                        }),
                        e.jsx("p", {
                          className:
                            "text-base font-medium text-gray-400 dark:text-slate-500",
                          children: "No hay cursos creados",
                        }),
                        e.jsx("p", {
                          className:
                            "text-sm text-gray-300 dark:text-slate-600 mt-1",
                          children: p
                            ? "Crea tu primer curso para comenzar"
                            : "Un administrador debe crear los cursos",
                        }),
                      ],
                    }),
                  })
                : e.jsx("div", {
                    className:
                      "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
                    children: H.map((t) => {
                      const s = F.filter((d) => d.courseId === t.id),
                        l = W.filter((d) =>
                          s.some((We) => We.id === d.sectionId),
                        ),
                        a = (t.teamIds || []).length,
                        r = b.find((d) => d.id === t.docenteId),
                        k = b.find((d) => d.id === t.tutorId),
                        x = b.find((d) => d.id === t.asistentId);
                      return e.jsxs(
                        "div",
                        {
                          className:
                            "group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer",
                          onClick: () => {
                            (ie(t.id), S(null), f(null), Ne("team"));
                          },
                          children: [
                            e.jsx("div", {
                              className:
                                "h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500",
                            }),
                            e.jsxs("div", {
                              className: "p-5",
                              children: [
                                e.jsxs("div", {
                                  className:
                                    "flex items-start justify-between gap-3",
                                  children: [
                                    e.jsxs("div", {
                                      className: "flex-1 min-w-0",
                                      children: [
                                        e.jsx("h3", {
                                          className:
                                            "font-bold text-gray-800 dark:text-white truncate text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors",
                                          children: t.name,
                                        }),
                                        t.description &&
                                          e.jsx("p", {
                                            className:
                                              "text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2",
                                            children: t.description,
                                          }),
                                      ],
                                    }),
                                    e.jsx(tt, {
                                      size: 20,
                                      className:
                                        "text-gray-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-1",
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "flex flex-wrap gap-2 mt-3",
                                  children: [
                                    r &&
                                      e.jsxs("span", {
                                        className:
                                          "inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-[11px] font-medium rounded-full",
                                        children: [
                                          e.jsx(M, { size: 10 }),
                                          " ",
                                          r.name,
                                        ],
                                      }),
                                    k &&
                                      e.jsxs("span", {
                                        className:
                                          "inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-medium rounded-full",
                                        children: [
                                          e.jsx(be, { size: 10 }),
                                          " ",
                                          k.name,
                                        ],
                                      }),
                                    x &&
                                      e.jsxs("span", {
                                        className:
                                          "inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[11px] font-medium rounded-full",
                                        children: [
                                          e.jsx(pe, { size: 10 }),
                                          " ",
                                          x.name,
                                        ],
                                      }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className:
                                    "flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-slate-700/50",
                                  children: [
                                    e.jsxs("div", {
                                      className:
                                        "flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500",
                                      children: [
                                        e.jsx(je, { size: 13 }),
                                        e.jsxs("span", {
                                          children: [s.length, " secciones"],
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className:
                                        "flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500",
                                      children: [
                                        e.jsx(G, { size: 13 }),
                                        e.jsxs("span", {
                                          children: [l.length, " clases"],
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className:
                                        "flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500",
                                      children: [
                                        e.jsx(D, { size: 13 }),
                                        e.jsxs("span", {
                                          children: [a, " miembros"],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            p &&
                              e.jsxs("div", {
                                className:
                                  "flex border-t border-gray-50 dark:border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity",
                                children: [
                                  e.jsxs("button", {
                                    onClick: (d) => {
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
                                    },
                                    className:
                                      "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors",
                                    children: [
                                      e.jsx(re, { size: 12 }),
                                      " Editar",
                                    ],
                                  }),
                                  e.jsx("div", {
                                    className:
                                      "w-px bg-gray-100 dark:bg-slate-700",
                                  }),
                                  e.jsxs("button", {
                                    onClick: (d) => {
                                      (d.stopPropagation(),
                                        O({
                                          type: "course",
                                          id: t.id,
                                          label: t.name,
                                        }));
                                    },
                                    className:
                                      "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors",
                                    children: [
                                      e.jsx(fe, { size: 12 }),
                                      " Eliminar",
                                    ],
                                  }),
                                ],
                              }),
                          ],
                        },
                        t.id,
                      );
                    }),
                  }),
            ],
          }),
      e.jsx(ae, {
        isOpen: !!g,
        onClose: () => O(null),
        title: "Confirmar eliminacion",
        maxWidth: "max-w-sm",
        children: e.jsxs("div", {
          className: "space-y-4 text-center",
          children: [
            e.jsxs("p", {
              className: "text-gray-600 dark:text-slate-300",
              children: ['Eliminar "', g?.label, '"?'],
            }),
            e.jsxs("div", {
              className: "flex justify-center gap-3",
              children: [
                e.jsx("button", {
                  onClick: () => O(null),
                  className:
                    "px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300",
                  children: "Cancelar",
                }),
                e.jsx("button", {
                  onClick: Ge,
                  className:
                    "px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white",
                  children: "Eliminar",
                }),
              ],
            }),
          ],
        }),
      }),
      e.jsx(ae, {
        isOpen: Oe,
        onClose: () => L(!1),
        title: K ? "Editar Curso" : "Nuevo Curso",
        maxWidth: "max-w-lg",
        children: e.jsxs("div", {
          className: "space-y-5",
          children: [
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                  children: "Nombre del curso *",
                }),
                e.jsx("input", {
                  type: "text",
                  value: n.name,
                  onChange: (t) => I({ ...n, name: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  placeholder: "Ej: Universidad de la Vida 2026-2",
                }),
              ],
            }),
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                  children: "Descripcion (opcional)",
                }),
                e.jsx("textarea", {
                  value: n.description,
                  onChange: (t) => I({ ...n, description: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  placeholder: "Describe el proposito del curso",
                  rows: 2,
                }),
              ],
            }),
            e.jsx("div", {
              className: "border-t border-gray-100 dark:border-slate-700 pt-1",
              children: e.jsx("p", {
                className:
                  "text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3",
                children: "Equipo directivo",
              }),
            }),
            e.jsxs("div", {
              children: [
                e.jsxs("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5",
                  children: [
                    e.jsx(M, { size: 14, className: "text-violet-500" }),
                    " Docente",
                  ],
                }),
                e.jsxs("select", {
                  value: n.docenteId,
                  onChange: (t) => I({ ...n, docenteId: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  children: [
                    e.jsx("option", { value: "", children: "Sin asignar" }),
                    w.map((t) =>
                      e.jsx("option", { value: t.id, children: t.name }, t.id),
                    ),
                  ],
                }),
              ],
            }),
            e.jsxs("div", {
              children: [
                e.jsxs("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5",
                  children: [
                    e.jsx(be, { size: 14, className: "text-blue-500" }),
                    " Tutor",
                  ],
                }),
                e.jsxs("select", {
                  value: n.tutorId,
                  onChange: (t) => I({ ...n, tutorId: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  children: [
                    e.jsx("option", { value: "", children: "Sin asignar" }),
                    w.map((t) =>
                      e.jsx("option", { value: t.id, children: t.name }, t.id),
                    ),
                  ],
                }),
              ],
            }),
            e.jsxs("div", {
              children: [
                e.jsxs("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5",
                  children: [
                    e.jsx(pe, { size: 14, className: "text-amber-500" }),
                    " Asistente",
                  ],
                }),
                e.jsxs("select", {
                  value: n.asistentId,
                  onChange: (t) => I({ ...n, asistentId: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  children: [
                    e.jsx("option", { value: "", children: "Sin asignar" }),
                    w.map((t) =>
                      e.jsx("option", { value: t.id, children: t.name }, t.id),
                    ),
                  ],
                }),
              ],
            }),
            w.length === 0 &&
              e.jsxs("div", {
                className:
                  "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2",
                children: [
                  e.jsx(Ae, {
                    size: 16,
                    className: "text-amber-500 flex-shrink-0",
                  }),
                  e.jsx("p", {
                    className: "text-xs text-amber-700 dark:text-amber-300",
                    children:
                      "No hay miembros en el ministerio de U de la Vida. Ve a Ministerios para asignar usuarios.",
                  }),
                ],
              }),
            e.jsx("button", {
              onClick: Le,
              className:
                "w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium",
              children: K ? "Actualizar" : "Crear curso",
            }),
          ],
        }),
      }),
      e.jsx(ae, {
        isOpen: Pe,
        onClose: () => Q(!1),
        title: Y ? "Editar Seccion" : "Nueva Seccion",
        maxWidth: "max-w-lg",
        children: e.jsxs("div", {
          className: "space-y-5",
          children: [
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                  children: "Nombre de la seccion",
                }),
                e.jsx("input", {
                  type: "text",
                  value: u.name,
                  onChange: (t) => P({ ...u, name: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  placeholder: "Ej: Seccion A - Lunes",
                }),
              ],
            }),
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                  children: "Descripcion (opcional)",
                }),
                e.jsx("textarea", {
                  value: u.description,
                  onChange: (t) => P({ ...u, description: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  placeholder: "Horario o detalles adicionales",
                  rows: 2,
                }),
              ],
            }),
            e.jsxs("div", {
              children: [
                e.jsxs("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5",
                  children: [
                    e.jsx(M, { size: 14, className: "text-violet-500" }),
                    " Docente",
                  ],
                }),
                e.jsxs("select", {
                  value: u.teacherId,
                  onChange: (t) => P({ ...u, teacherId: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  children: [
                    e.jsx("option", { value: "", children: "Sin asignar" }),
                    w.map((t) =>
                      e.jsx("option", { value: t.id, children: t.name }, t.id),
                    ),
                  ],
                }),
              ],
            }),
            e.jsx("button", {
              onClick: Be,
              className:
                "w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium",
              children: Y ? "Actualizar" : "Crear seccion",
            }),
          ],
        }),
      }),
      e.jsx(ae, {
        isOpen: Fe,
        onClose: () => J(!1),
        title: Z ? "Editar Clase" : "Nueva Clase",
        maxWidth: "max-w-lg",
        children: e.jsxs("div", {
          className: "space-y-4",
          children: [
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                  children: "Titulo de la clase",
                }),
                e.jsx("input", {
                  type: "text",
                  value: c.title,
                  onChange: (t) => z({ ...c, title: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  placeholder: "Ej: Clase 1 - Introduccion",
                }),
              ],
            }),
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                  children: "Fecha",
                }),
                e.jsx("input", {
                  type: "date",
                  value: c.date,
                  onChange: (t) => z({ ...c, date: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                }),
              ],
            }),
            e.jsxs("div", {
              className: "grid grid-cols-2 gap-3",
              children: [
                e.jsxs("div", {
                  children: [
                    e.jsx("label", {
                      className:
                        "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                      children: "Hora inicio",
                    }),
                    e.jsx("input", {
                      type: "time",
                      value: c.startTime,
                      onChange: (t) => z({ ...c, startTime: t.target.value }),
                      className:
                        "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("label", {
                      className:
                        "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                      children: "Hora fin",
                    }),
                    e.jsx("input", {
                      type: "time",
                      value: c.endTime,
                      onChange: (t) => z({ ...c, endTime: t.target.value }),
                      className:
                        "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className:
                    "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                  children: "Docente (opcional)",
                }),
                e.jsxs("select", {
                  value: c.teacherId,
                  onChange: (t) => z({ ...c, teacherId: t.target.value }),
                  className:
                    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm",
                  children: [
                    e.jsx("option", {
                      value: "",
                      children: "Usar docente de seccion",
                    }),
                    w.map((t) =>
                      e.jsx("option", { value: t.id, children: t.name }, t.id),
                    ),
                  ],
                }),
              ],
            }),
            e.jsx("button", {
              onClick: Ve,
              className:
                "w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium",
              children: Z ? "Actualizar" : "Crear clase",
            }),
          ],
        }),
      }),
    ],
  });
};
export { xt as Udlv };
