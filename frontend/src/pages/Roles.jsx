// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import {
  w as W,
  E as I,
  v as O,
  A as l,
  B as D,
  S as ie,
  N as oe,
  M as w,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  useAppDialog,
  useGlobalData,
  useChangeFeed,
  bffFetch,
  isBffEnabled,
  firestoreDb,
  Modal,
} from "../app/App.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import {
  S as ShieldIcon,
  b as EyeIcon,
  f as UsersIcon,
  a as LockIcon,
  d as CalendarIcon,
  e as LayersIcon,
  a5 as ChartColumnIcon,
  y as SquarePenIcon,
  r as Trash2Icon,
  C as CheckIcon,
  L as LoaderCircleIcon,
  T as TriangleAlertIcon,
  U as UserIcon,
  a6 as UserCogIcon,
  a7 as CrownIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
const N = [
  {
    id: "view_dashboard",
    label: "Ver Panel Principal",
    icon: EyeIcon,
  },
  {
    id: "manage_users",
    label: "Gestionar Servidores (Crear/Editar/Borrar)",
    icon: UsersIcon,
  },
  {
    id: "manage_roles",
    label: "Gestionar Roles y Permisos",
    icon: LockIcon,
  },
  {
    id: "manage_events",
    label: "Gestionar Eventos",
    icon: CalendarIcon,
  },
  {
    id: "view_events",
    label: "Ver Eventos (Solo lectura)",
    icon: EyeIcon,
  },
  {
    id: "manage_services",
    label: "Gestionar Ministerios",
    icon: LayersIcon,
  },
  {
    id: "view_reports",
    label: "Ver Reportes",
    icon: ChartColumnIcon,
  },
  {
    id: "manage_ministry_events",
    label: "Gestionar Eventos de su Ministerio",
    icon: CalendarIcon,
  },
  {
    id: "manage_ministry_users",
    label: "Gestionar Servidores de su Ministerio",
    icon: UsersIcon,
  },
  {
    id: "view_ministry_reports",
    label: "Ver Reportes de su Ministerio",
    icon: ChartColumnIcon,
  },
  {
    id: "view_ministry_attendance",
    label: "Ver Asistencias de su Ministerio",
    icon: EyeIcon,
  },
];
const Roles = () => {
  const P = useAppDialog(),
    { roles: f, serviceAreas: K } = useGlobalData(),
    [p, u] = React.useState([]),
    [Q, E] = React.useState(!0),
    [X, M] = React.useState(!1),
    [g, R] = React.useState(null),
    [n, j] = React.useState({
      isOpen: !1,
      roleId: null,
      roleName: "",
    }),
    [m, h] = React.useState({
      name: "",
      description: "",
      permissions: [],
    }),
    [U, T] = React.useState(!1),
    [z, B] = React.useState(!1),
    x = async () => {
      if (f.length > 0) {
        (u(f), E(!1));
        return;
      }
      try {
        const s = isBffEnabled()
          ? (await bffFetch("/api/roles")).items
          : (await W(I(firestoreDb, "roles"))).docs.map((r) => ({
              id: r.id,
              ...r.data(),
            }));
        s.length === 0 ? await Y() : u(s);
      } catch (s) {
        console.error("Error fetching roles:", s);
      } finally {
        E(!1);
      }
    };
  React.useEffect(() => {
    f.length > 0 ? (u(f), E(!1)) : x();
  }, [f]);
  const Y = async () => {
    const s = [
      {
        id: "master_admin",
        name: "Master Admin",
        description: "Acceso total al sistema. No se puede eliminar.",
        permissions: N.map((r) => r.id),
        isSystem: !0,
      },
      {
        id: "admin",
        name: "Administrador",
        description: "Gestión de eventos y ministerios.",
        permissions: [
          "view_dashboard",
          "manage_events",
          "view_events",
          "manage_services",
          "view_reports",
        ],
        isSystem: !1,
      },
      {
        id: "user",
        name: "Servidor",
        description: "Acceso básico para ver eventos.",
        permissions: ["view_dashboard", "view_events"],
        isSystem: !1,
      },
    ];
    try {
      if (isBffEnabled())
        await Promise.all(
          s.map((r) =>
            bffFetch(`/api/roles/${encodeURIComponent(r.id)}`, {
              method: "PUT",
              json: r,
            }),
          ),
        );
      else {
        const r = s.map((t) => D(l(firestoreDb, "roles", t.id), t));
        await Promise.all(r);
      }
      await x();
    } catch (r) {
      console.error("Error initializing default roles:", r);
    }
  };
  (React.useEffect(() => {
    (x(), C());
    const s = (r) => {
      if (r.data?.type === "DATA_CHANGED") {
        const t = r.data.resources || [],
          a = ["roles", "service_areas"];
        t.some((v) => a.includes(v)) &&
          (console.log("[Roles] 📲 Push detectó cambios - refrescando..."),
          x(),
          C());
      }
    };
    return (
      navigator.serviceWorker?.addEventListener("message", s),
      () => {
        navigator.serviceWorker?.removeEventListener("message", s);
      }
    );
  }, []),
    useChangeFeed({
      enabled: isBffEnabled(),
      resources: ["roles", "service_areas"],
      onChange: () => {
        (x(), C());
      },
      debounceMs: 1200,
    }));
  const C = async () => {
      try {
        let s = K;
        (!s || s.length === 0) &&
          (s = isBffEnabled()
            ? (await bffFetch("/api/service_areas")).items
            : (await W(I(firestoreDb, "service_areas"))).docs.map((r) => ({
                id: r.id,
                ...r.data(),
              })));
        for (const r of s) {
          const t = `ministry_admin_${r.id}`,
            a = `ministry_subadmin_${r.id}`,
            y = isBffEnabled()
              ? (await bffFetch(`/api/roles/${encodeURIComponent(t)}`)).exists
              : (await O(l(firestoreDb, "roles", t))).exists(),
            v = isBffEnabled()
              ? (await bffFetch(`/api/roles/${encodeURIComponent(a)}`)).exists
              : (await O(l(firestoreDb, "roles", a))).exists(),
            b = r.name || "Ministerio";
          if (!y) {
            const k = {
              id: t,
              name: `Admin de ${b}`,
              description: `Gestión completa del ministerio de ${b}.`,
              permissions: [
                "view_dashboard",
                "view_events",
                "manage_ministry_events",
                "manage_ministry_users",
                "view_ministry_reports",
                "view_ministry_attendance",
              ],
              isSystem: !1,
              ministryId: r.id,
              ministryName: b,
              roleType: "ministry_admin",
            };
            isBffEnabled()
              ? await bffFetch(`/api/roles/${encodeURIComponent(t)}`, {
                  method: "PUT",
                  json: k,
                })
              : await D(l(firestoreDb, "roles", t), {
                  ...k,
                  createdAt: new Date(),
                });
          }
          if (!v) {
            const k = {
              id: a,
              name: `Sub-Admin de ${b}`,
              description: `Apoyo en la gestión del ministerio de ${b}.`,
              permissions: [
                "view_dashboard",
                "view_events",
                "view_ministry_reports",
                "view_ministry_attendance",
              ],
              isSystem: !1,
              ministryId: r.id,
              ministryName: b,
              roleType: "ministry_subadmin",
            };
            isBffEnabled()
              ? await bffFetch(`/api/roles/${encodeURIComponent(a)}`, {
                  method: "PUT",
                  json: k,
                })
              : await D(l(firestoreDb, "roles", a), {
                  ...k,
                  createdAt: new Date(),
                });
          }
        }
        x();
      } catch (s) {
        console.error("Error syncing ministry roles:", s);
      }
    },
    Z = async (s) => {
      (s.preventDefault(), T(!0));
      try {
        (g
          ? isBffEnabled()
            ? await bffFetch(`/api/roles/${encodeURIComponent(g.id)}`, {
                method: "PUT",
                json: m,
              })
            : await ie(l(firestoreDb, "roles", g.id), m)
          : isBffEnabled()
            ? await bffFetch("/api/roles", {
                method: "POST",
                json: {
                  ...m,
                  isSystem: !1,
                },
              })
            : await oe(I(firestoreDb, "roles"), {
                ...m,
                createdAt: new Date(),
                isSystem: !1,
              }),
          await x(),
          S());
      } catch (r) {
        (console.error("Error saving role:", r),
          P.showError("Error al guardar el rol"));
      } finally {
        T(!1);
      }
    },
    ee = async () => {
      if (n.roleId) {
        B(!0);
        try {
          const s = n.roleId;
          if (s.startsWith("ministry_admin_")) {
            const t = `ministry_subadmin_${s.replace("ministry_admin_", "")}`;
            (isBffEnabled()
              ? (await bffFetch(`/api/roles/${encodeURIComponent(s)}`, {
                  method: "DELETE",
                }),
                await bffFetch(`/api/roles/${encodeURIComponent(t)}`, {
                  method: "DELETE",
                }))
              : (await w(l(firestoreDb, "roles", s)),
                await w(l(firestoreDb, "roles", t))),
              u(p.filter((a) => a.id !== s && a.id !== t)));
          } else if (s.startsWith("ministry_subadmin_")) {
            const t = `ministry_admin_${s.replace("ministry_subadmin_", "")}`;
            (isBffEnabled()
              ? (await bffFetch(`/api/roles/${encodeURIComponent(s)}`, {
                  method: "DELETE",
                }),
                await bffFetch(`/api/roles/${encodeURIComponent(t)}`, {
                  method: "DELETE",
                }))
              : (await w(l(firestoreDb, "roles", s)),
                await w(l(firestoreDb, "roles", t))),
              u(p.filter((a) => a.id !== s && a.id !== t)));
          } else
            (isBffEnabled()
              ? await bffFetch(`/api/roles/${encodeURIComponent(s)}`, {
                  method: "DELETE",
                })
              : await w(l(firestoreDb, "roles", s)),
              u(p.filter((r) => r.id !== s)));
          j({
            isOpen: !1,
            roleId: null,
            roleName: "",
          });
        } catch (s) {
          (console.error("Error deleting role:", s),
            P.showError("Error al eliminar el rol"));
        } finally {
          B(!1);
        }
      }
    },
    se = (s) => {
      j({
        isOpen: !0,
        roleId: s.id,
        roleName: s.name,
      });
    },
    re = (s) => {
      (s
        ? (R(s),
          h({
            name: s.name,
            description: s.description || "",
            permissions: s.permissions || [],
          }))
        : (R(null),
          h({
            name: "",
            description: "",
            permissions: [],
          })),
        M(!0));
    },
    S = () => {
      (M(!1),
        R(null),
        h({
          name: "",
          description: "",
          permissions: [],
        }));
    },
    te = (s) => {
      h((r) => {
        const t = r.permissions.includes(s)
          ? r.permissions.filter((a) => a !== s)
          : [...r.permissions, s];
        return {
          ...r,
          permissions: t,
        };
      });
    };
  if (Q) return <LoadingSpinner text="Cargando roles..." />;
  const ae = (s) => {
    if (s.startsWith("ministry_admin_"))
      return {
        icon: LayersIcon,
        gradient: "from-teal-500 to-cyan-600",
        bgLight: "bg-gradient-to-br from-teal-50 to-cyan-50",
        bgDark:
          "dark:bg-gradient-to-br dark:from-teal-900/20 dark:to-cyan-900/20",
        iconBg: "bg-gradient-to-br from-teal-500 to-cyan-600",
        border: "border-teal-200 dark:border-teal-800/50",
        badge:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
      };
    if (s.startsWith("ministry_subadmin_"))
      return {
        icon: UsersIcon,
        gradient: "from-rose-500 to-pink-600",
        bgLight: "bg-gradient-to-br from-rose-50 to-pink-50",
        bgDark:
          "dark:bg-gradient-to-br dark:from-rose-900/20 dark:to-pink-900/20",
        iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
        border: "border-rose-200 dark:border-rose-800/50",
        badge:
          "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
      };
    switch (s) {
      case "master_admin":
        return {
          icon: CrownIcon,
          gradient: "from-amber-500 to-orange-600",
          bgLight: "bg-gradient-to-br from-amber-50 to-orange-50",
          bgDark:
            "dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-orange-900/20",
          iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
          border: "border-amber-200 dark:border-amber-800/50",
          badge:
            "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        };
      case "admin":
        return {
          icon: UserCogIcon,
          gradient: "from-indigo-500 to-purple-600",
          bgLight: "bg-gradient-to-br from-indigo-50 to-purple-50",
          bgDark:
            "dark:bg-gradient-to-br dark:from-indigo-900/20 dark:to-purple-900/20",
          iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
          border: "border-indigo-200 dark:border-indigo-800/50",
          badge:
            "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
        };
      case "ministry_admin":
        return {
          icon: LayersIcon,
          gradient: "from-blue-500 to-cyan-600",
          bgLight: "bg-gradient-to-br from-blue-50 to-cyan-50",
          bgDark:
            "dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-cyan-900/20",
          iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
          border: "border-blue-200 dark:border-blue-800/50",
          badge:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        };
      case "ministry_subadmin":
        return {
          icon: UsersIcon,
          gradient: "from-violet-500 to-fuchsia-600",
          bgLight: "bg-gradient-to-br from-violet-50 to-fuchsia-50",
          bgDark:
            "dark:bg-gradient-to-br dark:from-violet-900/20 dark:to-fuchsia-900/20",
          iconBg: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
          border: "border-violet-200 dark:border-violet-800/50",
          badge:
            "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
        };
      default:
        return {
          icon: UserIcon,
          gradient: "from-emerald-500 to-teal-600",
          bgLight: "bg-gradient-to-br from-emerald-50 to-teal-50",
          bgDark:
            "dark:bg-gradient-to-br dark:from-emerald-900/20 dark:to-teal-900/20",
          iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
          border: "border-emerald-200 dark:border-emerald-800/50",
          badge:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        };
    }
  };
  return (
    <div className="space-y-8">
      {[
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl border border-slate-700/50">
          {[
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />,
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-4">
              {[
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />,
                "Roles y Permisos",
              ]}
            </div>,
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {[
                  <div className="p-3 bg-slate-700/50 backdrop-blur-sm rounded-xl border border-slate-600/50">
                    <ShieldIcon size={32} className="text-emerald-400" />
                  </div>,
                  <div>
                    {[
                      <h1 className="text-2xl sm:text-3xl font-bold">
                        {"Gestión de Roles"}
                      </h1>,
                      <p className="text-slate-400 mt-1">
                        {"Define roles y sus permisos específicos"}
                      </p>,
                    ]}
                  </div>,
                ]}
              </div>
            </div>,
            <div className="relative mt-6 grid grid-cols-3 gap-2 sm:gap-4">
              {[
                <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-slate-600/30">
                  {[
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {p.length}
                    </div>,
                    <div className="text-xs sm:text-sm text-slate-400">
                      {"Roles Totales"}
                    </div>,
                  ]}
                </div>,
                <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-slate-600/30">
                  {[
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {p.filter((s) => s.isSystem).length}
                    </div>,
                    <div className="text-xs sm:text-sm text-slate-400">
                      {"Roles Sistema"}
                    </div>,
                  ]}
                </div>,
                <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-slate-600/30">
                  {[
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {N.length}
                    </div>,
                    <div className="text-xs sm:text-sm text-slate-400 truncate">
                      {"Permisos"}
                    </div>,
                  ]}
                </div>,
              ]}
            </div>,
          ]}
        </div>,
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {p.map((s) => {
            const r = ae(s.id),
              RenderComponent1 = r.icon;
            return jsxRuntime.jsxs(
              "div",
              {
                className: `relative overflow-hidden ${r.bgLight} ${r.bgDark} rounded-2xl border-2 ${r.border} p-6 shadow-sm hover:shadow-lg transition-all duration-300 group`,
                children: [
                  <div
                    className={`absolute -right-8 -top-8 w-32 h-32 ${r.iconBg} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}
                  />,
                  <div className="relative">
                    {[
                      <div className="flex justify-between items-start mb-4">
                        {[
                          <div className="flex items-center gap-3">
                            {[
                              <div
                                className={`p-3 ${r.iconBg} rounded-xl text-white shadow-lg`}
                              >
                                <RenderComponent1 size={24} />
                              </div>,
                              <div>
                                {[
                                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {s.name}
                                  </h3>,
                                  <div className="flex items-center gap-2 mt-1">
                                    {[
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.badge}`}
                                      >
                                        {[
                                          s.permissions?.length || 0,
                                          " permisos",
                                        ]}
                                      </span>,
                                      s.isSystem && (
                                        <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-slate-300 rounded-full font-medium">
                                          {"Sistema"}
                                        </span>
                                      ),
                                    ]}
                                  </div>,
                                ]}
                              </div>,
                            ]}
                          </div>,
                          !s.isSystem && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {[
                                <button
                                  onClick={() => re(s)}
                                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all shadow-sm"
                                >
                                  <SquarePenIcon size={18} />
                                </button>,
                                <button
                                  onClick={() => se(s)}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all shadow-sm"
                                >
                                  <Trash2Icon size={18} />
                                </button>,
                              ]}
                            </div>
                          ),
                        ]}
                      </div>,
                      <p className="text-sm text-gray-600 dark:text-slate-300 mb-4 min-h-[40px]">
                        {s.description || "Sin descripción"}
                      </p>,
                      <div className="space-y-2">
                        {[
                          <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                            {"Permisos incluidos"}
                          </div>,
                          <div className="flex flex-wrap gap-2">
                            {[
                              s.permissions?.slice(0, 3).map((a) => {
                                const y = N.find((b) => b.id === a),
                                  RenderComponent2 = y?.icon || ShieldIcon;
                                return (
                                  <span
                                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg shadow-sm border border-gray-100 dark:border-slate-600"
                                    key={a}
                                  >
                                    {[
                                      <RenderComponent2
                                        size={12}
                                        className="text-gray-400"
                                      />,
                                      y?.label || a,
                                    ]}
                                  </span>
                                );
                              }),
                              (s.permissions?.length || 0) > 3 && (
                                <span className="inline-flex items-center text-xs px-2.5 py-1.5 bg-white dark:bg-slate-700 text-gray-500 dark:text-slate-400 rounded-lg shadow-sm border border-gray-100 dark:border-slate-600 font-medium">
                                  {["+", s.permissions.length - 3, " más"]}
                                </span>
                              ),
                            ]}
                          </div>,
                        ]}
                      </div>,
                    ]}
                  </div>,
                ],
              },
              s.id,
            );
          })}
        </div>,
        <Modal
          isOpen={X}
          onClose={S}
          title={g ? "Editar Rol" : "Nuevo Rol"}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={Z} className="space-y-6">
            {[
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                {[
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                    <ShieldIcon size={24} />
                  </div>,
                  <div className="flex-1">
                    {[
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {g ? "Modificar rol existente" : "Crear nuevo rol"}
                      </h3>,
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {g
                          ? "Actualiza los permisos y descripción"
                          : "Define un nombre y selecciona los permisos"}
                      </p>,
                    ]}
                  </div>,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                    {"Nombre del Rol"}
                  </label>,
                  <input
                    type="text"
                    value={m.name}
                    onChange={(s) =>
                      h({
                        ...m,
                        name: s.target.value,
                      })
                    }
                    placeholder="Ej: Coordinador, Líder de área..."
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-slate-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                    required={!0}
                  />,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                    {"Descripción"}
                  </label>,
                  <textarea
                    value={m.description}
                    onChange={(s) =>
                      h({
                        ...m,
                        description: s.target.value,
                      })
                    }
                    placeholder="Describe las responsabilidades de este rol..."
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-slate-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all resize-none"
                    rows={3}
                  />,
                ]}
              </div>,
              <div>
                {[
                  <div className="flex items-center justify-between mb-3">
                    {[
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                        {"Permisos"}
                      </label>,
                      <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-full font-medium">
                        {[m.permissions.length, " seleccionados"]}
                      </span>,
                    ]}
                  </div>,
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {N.map((s) => {
                      const r = m.permissions.includes(s.id),
                        RenderComponent3 = s.icon;
                      return jsxRuntime.jsxs(
                        "div",
                        {
                          onClick: () => te(s.id),
                          className: `flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${r ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md" : "border-gray-200 dark:border-slate-600 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-slate-700"}`,
                          children: [
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${r ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg" : "bg-gray-100 dark:bg-slate-600 text-gray-400 dark:text-slate-400"}`}
                            >
                              <RenderComponent3 size={20} />
                            </div>,
                            <span
                              className={`text-sm font-medium flex-1 ${r ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-slate-300"}`}
                            >
                              {s.label}
                            </span>,
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${r ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300 dark:border-slate-500"}`}
                            >
                              {r && <CheckIcon size={14} />}
                            </div>,
                          ],
                        },
                        s.id,
                      );
                    })}
                  </div>,
                ]}
              </div>,
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                {[
                  <button
                    type="button"
                    onClick={S}
                    className="px-5 py-2.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
                  >
                    {"Cancelar"}
                  </button>,
                  <button
                    type="submit"
                    disabled={U}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {U ? (
                      <jsxRuntime.Fragment>
                        {[
                          <LoaderCircleIcon
                            size={18}
                            className="animate-spin"
                          />,
                          g ? "Guardando..." : "Creando...",
                        ]}
                      </jsxRuntime.Fragment>
                    ) : g ? (
                      "Guardar Cambios"
                    ) : (
                      "Crear Rol"
                    )}
                  </button>,
                ]}
              </div>,
            ]}
          </form>
        </Modal>,
        <Modal
          isOpen={n.isOpen}
          onClose={() =>
            j({
              isOpen: !1,
              roleId: null,
              roleName: "",
            })
          }
          title=""
        >
          <div className="text-center py-4">
            {[
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <TriangleAlertIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>,
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {n.roleId?.startsWith("ministry_admin_") ||
                n.roleId?.startsWith("ministry_subadmin_")
                  ? "Eliminar Roles de Ministerio"
                  : "Eliminar Rol"}
              </h3>,
              <p className="text-gray-600 dark:text-slate-400 mb-2">
                {n.roleId?.startsWith("ministry_admin_") ||
                n.roleId?.startsWith("ministry_subadmin_")
                  ? "¿Estás seguro de que deseas eliminar los roles de ministerio?"
                  : "¿Estás seguro de que deseas eliminar el rol"}
              </p>,
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {n.roleId?.startsWith("ministry_admin_") ||
                n.roleId?.startsWith("ministry_subadmin_")
                  ? (() => {
                      const s = n.roleName
                        .replace("Admin de ", "")
                        .replace("Sub-Admin de ", "");
                      return `"Admin de ${s}" y "Sub-Admin de ${s}"`;
                    })()
                  : `"${n.roleName}"?`}
              </p>,
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg mb-6">
                {[
                  <TriangleAlertIcon className="inline w-4 h-4 mr-1" />,
                  n.roleId?.startsWith("ministry_admin_") ||
                  n.roleId?.startsWith("ministry_subadmin_")
                    ? "Esta acción eliminará AMBOS roles (Admin y Sub-Admin) del ministerio. Los usuarios con estos roles perderán sus permisos."
                    : "Esta acción no se puede deshacer. Los usuarios con este rol perderán sus permisos.",
                ]}
              </p>,
              <div className="flex justify-center gap-3">
                {[
                  <button
                    onClick={() =>
                      j({
                        isOpen: !1,
                        roleId: null,
                        roleName: "",
                      })
                    }
                    className="px-6 py-2.5 text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors"
                  >
                    {"Cancelar"}
                  </button>,
                  <button
                    onClick={ee}
                    disabled={z}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {z ? (
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
                        {[<Trash2Icon size={18} />, "Sí, Eliminar"]}
                      </jsxRuntime.Fragment>
                    )}
                  </button>,
                ]}
              </div>,
            ]}
          </div>
        </Modal>,
      ]}
    </div>
  );
};
export { Roles };
