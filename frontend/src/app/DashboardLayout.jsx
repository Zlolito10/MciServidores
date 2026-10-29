// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { _ as S } from "../vendor/vendor-pdf-Cf03QSry.js";
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  O as Outlet,
  r as React,
  u as useNavigate,
  c as useLocation,
  R as re,
} from "../vendor/vendor-react-BwINE3B3.js";
import {
  c as LayoutDashboardIcon,
  H as HistoryIcon,
  d as CalendarIcon,
  e as LayersIcon,
  f as UsersIcon,
  g as UserPlusIcon,
  h as ClipboardListIcon,
  i as CalendarCheckIcon,
  G as GraduationCapIcon,
  S as ShieldIcon,
  j as SettingsIcon,
  k as LogOutIcon,
  M as MenuIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { useGlobalData } from "../data/GlobalDataProvider.jsx";
import { _r, isBffEnabled, __vite__mapDeps, Lt } from "./runtime.jsx";
import { hasUdlvAccess } from "../utils/ministries.js";
import { getAvatarUrl } from "../utils/images.js";
import { OptimizedImage } from "../components/OptimizedImage.jsx";
const DashboardLayout = React.memo(() => {
  const t = "/mci-logo-pagina.png",
    [s, r] = re.useState(!1),
    [n, a] = re.useState(!1),
    [l, c] = re.useState(!1),
    [f, h] = re.useState(""),
    b = useLocation(),
    p = useNavigate(),
    { userProfile: u, hasPermission: E } = useAuth(),
    { roles: v, loading: _, serviceAreas: k } = useGlobalData(),
    y = (
      <React.Suspense fallback={null}>
        <_r />
      </React.Suspense>
    );
  (re.useEffect(() => {
    r(!1);
  }, [b.pathname]),
    re.useEffect(() => {
      if (!u?.role) return;
      const g = u.role;
      if (g === "master_admin") {
        h("Master Admin");
        return;
      }
      if (g === "admin") {
        h("Administrador");
        return;
      }
      if (g === "user") {
        h("Servidor");
        return;
      }
      if (_) return;
      const d = v.find((w) => w.id === g);
      h(d ? d.name : g.replace(/_/g, " "));
    }, [u?.role, v, _]));
  const { logout: L } = useAuth(),
    T = React.useCallback(async () => {
      try {
        (await L(), p("/login"));
      } catch (g) {
        console.error("Error signing out:", g);
      }
    }, [L, p]),
    A = React.useCallback(() => {
      r(!1);
    }, []),
    N = React.useMemo(
      () => [
        {
          icon: LayoutDashboardIcon,
          label: "Panel Principal",
          path: "/dashboard",
          permission: "view_dashboard",
        },
        {
          icon: HistoryIcon,
          label: "Mi Historial",
          path: "/dashboard/my-history",
          permission: "view_dashboard",
          hideForAdmin: !0,
        },
        {
          icon: CalendarIcon,
          label: "Eventos",
          path: "/dashboard/events",
          permission: "view_events",
        },
        {
          icon: LayersIcon,
          label: "Ministerios",
          path: "/dashboard/areas",
          permission: "manage_services",
        },
        {
          icon: UsersIcon,
          label: "Servidores",
          path: "/dashboard/volunteers",
          permission: "manage_users",
        },
        {
          icon: UserPlusIcon,
          label: "Solicitudes",
          path: "/dashboard/requests",
          permission: "master_admin_only",
        },
        {
          icon: ClipboardListIcon,
          label: "Asistencias",
          path: "/dashboard/attendance",
          permission: "view_reports",
        },
        {
          icon: CalendarCheckIcon,
          label: "Ensenanza martes",
          path: "/dashboard/tuesday-teaching",
          permission: "view_reports",
        },
        {
          icon: GraduationCapIcon,
          label: "U de la Vida",
          path: "/dashboard/udlv",
          permission: "udlv_only",
        },
        {
          icon: ShieldIcon,
          label: "Roles y Permisos",
          path: "/dashboard/roles",
          permission: "manage_roles",
        },
        {
          icon: SettingsIcon,
          label: "Configuración",
          path: "/dashboard/settings",
          permission: "view_dashboard",
        },
      ],
      [],
    ),
    I = React.useMemo(() => {
      const g = u?.role === "master_admin" || u?.role === "admin",
        d = u?.role === "master_admin",
        w =
          u?.role === "master_admin" ||
          u?.role === "admin" ||
          hasUdlvAccess(u, k);
      return N.filter((j) =>
        j.permission === "master_admin_only"
          ? d
          : j.permission === "udlv_only"
            ? w
            : (!isBffEnabled() &&
                  !g &&
                  [
                    "manage_services",
                    "manage_users",
                    "manage_roles",
                    "manage_events",
                  ].includes(j.permission)) ||
                (j.hideForAdmin && g) ||
                (j.masterOnly && !d)
              ? !1
              : E(j.permission),
      );
    }, [N, u, E, k]),
    i = React.useCallback((g) => {
      const d = {
          "/dashboard": () =>
            S(
              () => import("../pages/Dashboard.jsx"),
              __vite__mapDeps([7, 4, 2, 8, 9, 5, 3, 10, 11, 12, 6]),
            ),
          "/dashboard/events": () =>
            S(
              () => import("../pages/Events.jsx"),
              __vite__mapDeps([13, 4, 2, 11, 5, 14, 15, 6]),
            ),
          "/dashboard/events/:id": () =>
            S(
              () => import("../pages/EventDetails.jsx"),
              __vite__mapDeps([16, 4, 2, 15, 5, 14, 9, 8, 10, 6]),
            ),
          "/dashboard/areas": () =>
            S(
              () => import("../pages/ServiceAreas.jsx"),
              __vite__mapDeps([17, 4, 2, 5, 6]),
            ),
          "/dashboard/volunteers": () =>
            S(
              () => import("../pages/Volunteers.jsx"),
              __vite__mapDeps([18, 4, 2, 9, 5, 6]),
            ),
          "/dashboard/roles": () =>
            S(
              () => import("../pages/Roles.jsx"),
              __vite__mapDeps([19, 4, 2, 9, 5, 6]),
            ),
          "/dashboard/attendance": () =>
            S(
              () => import("../pages/Attendance.jsx"),
              __vite__mapDeps([20, 4, 2, 8, 14, 5, 12, 6]),
            ),
          "/dashboard/tuesday-teaching": () =>
            S(
              () => import("../pages/TuesdayTeaching.jsx"),
              __vite__mapDeps([21, 4, 2, 5, 6]),
            ),
          "/dashboard/udlv": () =>
            S(
              () => import("../pages/Udlv.jsx"),
              __vite__mapDeps([22, 4, 2, 5, 6]),
            ),
          "/dashboard/my-history": () =>
            S(
              () => import("../pages/ServiceHistory.jsx"),
              __vite__mapDeps([23, 4, 2, 8, 9, 5, 6]),
            ),
          "/dashboard/settings": () =>
            S(
              () => import("../pages/Settings.jsx"),
              __vite__mapDeps([24, 4, 2, 1, 3, 5, 6]),
            ),
          "/dashboard/app-history": () =>
            S(
              () => import("../pages/AppHistory.jsx"),
              __vite__mapDeps([25, 4, 2, 5, 6]),
            ),
        },
        w = d[g]
          ? g
          : g.startsWith("/dashboard/events/")
            ? "/dashboard/events/:id"
            : g,
        j = d[w];
      j && j().catch(() => {});
    }, []);
  re.useEffect(() => {
    u?.preferences?.darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [u?.preferences?.darkMode]);
  const m = getAvatarUrl(u?.photoThumbURL || u?.photoURL);
  return (
    <div className="min-h-screen bg-transparent flex">
      {[
        y,
        <div
          className="fixed inset-0 bg-white lg:bg-gray-50"
          style={{
            zIndex: -1,
            pointerEvents: "none",
          }}
        />,
        <div className="fixed top-0 left-0 right-0 h-[env(safe-area-inset-top)] bg-white z-50 pointer-events-none lg:hidden" />,
        s && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={A}
          />
        ),
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex flex-col ${s ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:z-0`}
          style={{
            transition: "transform 0.2s ease-out",
            willChange: "transform",
          }}
        >
          {[
            <div
              className="lg:hidden flex-shrink-0"
              style={{
                height: "env(safe-area-inset-top, 0px)",
              }}
            />,
            <div className="flex h-28 lg:h-48 items-center justify-center px-2 py-3 lg:py-6 gpu-accelerated flex-shrink-0">
              {l ? (
                <div className="w-full h-full px-2 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-700">
                    {"MCI"}
                  </span>
                </div>
              ) : (
                <img
                  src={t}
                  alt="MCI Logo"
                  className="w-full h-full px-2 object-contain gpu-accelerated"
                  loading="eager"
                  decoding="async"
                  onError={() => c(!0)}
                />
              )}
            </div>,
            <nav className="p-3 lg:p-4 space-y-1 lg:space-y-2 flex-1 overflow-y-auto min-h-0">
              {I.map((g) => {
                const d = b.pathname === g.path;
                return jsxRuntime.jsx(
                  Lt,
                  {
                    item: g,
                    isActive: d,
                    onClick: A,
                    onPrefetch: () => i(g.path),
                  },
                  g.path,
                );
              })}
            </nav>,
            <div className="flex-shrink-0 p-3 lg:p-4 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={T}
                className="flex w-full items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                {[
                  <LogOutIcon size={20} />,
                  <span className="font-medium">{"Cerrar Sesión"}</span>,
                ]}
              </button>
            </div>,
          ]}
        </aside>,
        <div className="flex-1 flex flex-col min-w-0 min-h-0 w-full">
          {[
            <header
              className="bg-white dark:bg-slate-800 flex items-center justify-between px-3 lg:px-8 transition-colors border-b border-gray-100 dark:border-slate-700 sticky top-0 z-20 min-h-[4rem] lg:min-h-[5rem]"
              style={{
                paddingTop: "env(safe-area-inset-top, 0px)",
              }}
            >
              {[
                <button
                  onClick={() => r(!0)}
                  className="lg:hidden p-2 -ml-1 text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <MenuIcon size={24} />
                </button>,
                <div className="flex items-center gap-2 lg:gap-4 ml-auto">
                  <div className="relative">
                    {[
                      <button
                        onClick={() => a(!n)}
                        className="flex items-center gap-2 lg:gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 p-1.5 lg:p-2 rounded-xl transition-colors focus:outline-none"
                      >
                        {[
                          <div className="text-right hidden sm:block">
                            {[
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] lg:max-w-none">
                                {u?.name || "Servidor"}
                              </p>,
                              <p className="text-xs text-gray-500 dark:text-slate-400 capitalize truncate max-w-[120px] lg:max-w-none">
                                {f || "Cargando..."}
                              </p>,
                            ]}
                          </div>,
                          <div
                            className={`avatar-container h-10 w-10 lg:h-12 lg:w-12 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm lg:text-base overflow-hidden ring-2 ring-white dark:ring-slate-700 shadow-md ${m ? "" : "bg-indigo-100 dark:bg-indigo-900/50"} gpu-accelerated`}
                          >
                            {m ? (
                              <OptimizedImage
                                src={m}
                                alt={u?.name || "Avatar"}
                                className="w-full h-full"
                                imgClassName="object-cover w-full h-full"
                                eager={!0}
                                fallbackIcon={
                                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold">
                                    {u?.name?.charAt(0).toUpperCase() || "U"}
                                  </div>
                                }
                              />
                            ) : (
                              u?.name?.charAt(0).toUpperCase() || "U"
                            )}
                          </div>,
                        ]}
                      </button>,
                      n && (
                        <jsxRuntime.Fragment>
                          {[
                            <div
                              className="fixed inset-0 z-[9990]"
                              onClick={() => a(!1)}
                            />,
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 py-1 z-[9991]">
                              {[
                                <button
                                  onClick={() => {
                                    (p("/dashboard/settings"), a(!1));
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                  {[
                                    <SettingsIcon size={16} />,
                                    "Configuración",
                                  ]}
                                </button>,
                                <button
                                  onClick={() => {
                                    (T(), a(!1));
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                >
                                  {[<LogOutIcon size={16} />, "Cerrar Sesión"]}
                                </button>,
                              ]}
                            </div>,
                          ]}
                        </jsxRuntime.Fragment>
                      ),
                    ]}
                  </div>
                </div>,
              ]}
            </header>,
            <main
              className="flex-1 p-4 lg:p-8 pb-28 overflow-y-auto overflow-x-hidden"
              style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
                minHeight: 0,
                paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6rem)",
                willChange: "auto",
                transform: "translateZ(0)",
                contain: "layout style",
              }}
            >
              <Outlet />
            </main>,
          ]}
        </div>,
      ]}
    </div>
  );
});
DashboardLayout.displayName = "DashboardLayout";
export { DashboardLayout };
