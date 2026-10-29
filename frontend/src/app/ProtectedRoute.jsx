// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import {
  O as Outlet,
  r as React,
  c as useLocation,
  N as Navigate,
} from "../vendor/vendor-react-BwINE3B3.js";
import { useAuth } from "../auth/AuthProvider.jsx";
const De = "church_app_sync_reload";
const ProtectedRoute = () => {
  const {
      user: t,
      userProfile: s,
      loading: r,
      refreshUserProfile: n,
    } = useAuth(),
    a = useLocation(),
    l = !!t,
    c = React.useRef(!1),
    f = l && !s && !r;
  if (
    (React.useEffect(() => {
      if (!f) {
        c.current = !1;
        return;
      }
      c.current = !0;
      const p = setTimeout(() => {
          c.current &&
            (console.warn(
              "[ProtectedRoute] Sync stuck — attempting refreshUserProfile...",
            ),
            n().catch(console.error));
        }, 3e3),
        u = setTimeout(() => {
          c.current &&
            (sessionStorage.getItem(De)
              ? console.warn(
                  "[ProtectedRoute] Sync stuck after reload — already retried, giving up.",
                )
              : (console.warn(
                  "[ProtectedRoute] Sync stuck after 8s — reloading page...",
                ),
                sessionStorage.setItem(De, "1"),
                window.location.reload()));
        }, 8e3);
      return () => {
        (clearTimeout(p), clearTimeout(u));
      };
    }, [f, n]),
    React.useEffect(() => {
      s && sessionStorage.removeItem(De);
    }, [s]),
    r)
  )
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          {[
            <div className="relative">
              {[
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30" />,
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />,
              ]}
            </div>,
            <p className="text-gray-600 dark:text-slate-400 font-medium">
              {"Cargando..."}
            </p>,
          ]}
        </div>
      </div>
    );
  if (l && !s)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          {[
            <div className="relative">
              {[
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30" />,
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />,
              ]}
            </div>,
            <p className="text-gray-600 dark:text-slate-400 font-medium">
              {"Sincronizando perfil..."}
            </p>,
          ]}
        </div>
      </div>
    );
  if (!l)
    return (
      <Navigate
        to="/login"
        state={{
          from: a,
        }}
        replace={!0}
      />
    );
  const h = s?.role === "admin" || s?.role === "master_admin",
    b =
      (s?.assignedMinistries && s.assignedMinistries.length > 0) ||
      (s?.areas && s.areas.length > 0);
  if (!h && !b) {
    if (a.pathname !== "/pending-assignment")
      return <Navigate to="/pending-assignment" replace={!0} />;
  } else if (a.pathname === "/pending-assignment")
    return <Navigate to="/dashboard" replace={!0} />;
  return <Outlet />;
};
export { De, ProtectedRoute };
