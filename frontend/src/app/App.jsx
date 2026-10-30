// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { loadModule as S } from "../services/module-loader.js";
import {
  O as Outlet,
  r as React,
  N as Navigate,
  B as BrowserRouter,
  e as Routes,
  f as Route,
} from "../vendor/vendor-react-BwINE3B3.js";
import { __vite__mapDeps } from "./runtime.jsx";
import { AuthProvider } from "../auth/AuthProvider.jsx";
import { GlobalDataProvider } from "../data/GlobalDataProvider.jsx";
import { AppDialogProvider } from "../dialogs/AppDialogProvider.jsx";
import { LoginPage } from "../pages/Login.jsx";
import { RegisterPage } from "../pages/Register.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { DashboardLayout } from "./DashboardLayout.jsx";
export { BffError } from "./runtime.jsx";
export { Modal } from "../components/Modal.jsx";
export { OptimizedImage } from "../components/OptimizedImage.jsx";
export { useGlobalData } from "../data/GlobalDataProvider.jsx";
export { useAppDialog } from "../dialogs/AppDialogProvider.jsx";
export { useChangeFeed } from "./runtime.jsx";
export { firebaseAuth } from "../firebase/client.js";
export { firestoreDb } from "../firebase/client.js";
export { bffFetch } from "./runtime.jsx";
export { getAvatarUrl } from "../utils/images.js";
export { isStrictBffAuth } from "./runtime.jsx";
export { isBffEnabled } from "./runtime.jsx";
export { dataUrlToBlob } from "../utils/images.js";
export { compressImage } from "../utils/images.js";
export { hasOtherMinistries } from "../utils/ministries.js";
export { getUdlvMinistryId } from "../utils/ministries.js";
export { normalizeMinistryName } from "../utils/ministries.js";
export { isHybridAuthEnabled } from "./runtime.jsx";
export { resolveCachedImageUrl } from "../utils/images.js";
export { onSnapshot } from "./runtime.jsx";
export { getUdlvMinistryName } from "../utils/ministries.js";
export { firebaseStorage } from "../firebase/client.js";
export { hasUdlvAccess } from "../utils/ministries.js";
export { useAuth } from "../auth/AuthProvider.jsx";
export { firebaseApp } from "../firebase/client.js";
const PublicAuthLayout = () => (
  <div className="min-h-screen bg-white font-sans text-gray-900">
    <Outlet />
  </div>
);
function lazyWithReload(t) {
  return React.lazy(() =>
    t().catch(() => {
      const s = "chunk_reload";
      return (
        sessionStorage.getItem(s) ||
          (sessionStorage.setItem(s, "1"), window.location.reload()),
        new Promise(() => {})
      );
    }),
  );
}
class ChunkErrorBoundary extends React.Component {
  constructor(s) {
    (super(s),
      (this.state = {
        hasError: !1,
      }));
  }
  static getDerivedStateFromError() {
    return {
      hasError: !0,
    };
  }
  componentDidCatch() {
    const s = "chunk_reload";
    sessionStorage.getItem(s) ||
      (sessionStorage.setItem(s, "1"), window.location.reload());
  }
  render() {
    return this.state.hasError ? (
      <div className="flex flex-col items-center justify-center h-screen gap-3 font-sans">
        {[
          <p className="text-gray-500">{"Se detectó una actualización."}</p>,
          <button
            onClick={() => {
              (sessionStorage.removeItem("chunk_reload"),
                window.location.reload());
            }}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            {"Recargar"}
          </button>,
        ]}
      </div>
    ) : (
      this.props.children
    );
  }
}
const DashboardPage = lazyWithReload(() =>
  S(
    () => import("../pages/Dashboard.jsx"),
    __vite__mapDeps([7, 4, 2, 8, 9, 5, 3, 10, 11, 12, 6]),
  ).then((t) => ({
    default: t.Dashboard,
  })),
);
const VolunteersPage = lazyWithReload(() =>
  S(
    () => import("../pages/Volunteers.jsx"),
    __vite__mapDeps([18, 4, 2, 9, 5, 6]),
  ).then((t) => ({
    default: t.Volunteers,
  })),
);
const EventsPage = lazyWithReload(() =>
  S(
    () => import("../pages/Events.jsx"),
    __vite__mapDeps([13, 4, 2, 11, 5, 14, 15, 6]),
  ).then((t) => ({
    default: t.Events,
  })),
);
const EventDetailsPage = lazyWithReload(() =>
  S(
    () => import("../pages/EventDetails.jsx"),
    __vite__mapDeps([16, 4, 2, 15, 5, 14, 9, 8, 10, 6]),
  ).then((t) => ({
    default: t.EventDetails,
  })),
);
const ServiceAreasPage = lazyWithReload(() =>
  S(
    () => import("../pages/ServiceAreas.jsx"),
    __vite__mapDeps([17, 4, 2, 5, 6]),
  ).then((t) => ({
    default: t.ServiceAreas,
  })),
);
const RolesPage = lazyWithReload(() =>
  S(
    () => import("../pages/Roles.jsx"),
    __vite__mapDeps([19, 4, 2, 9, 5, 6]),
  ).then((t) => ({
    default: t.Roles,
  })),
);
const SettingsPage = lazyWithReload(() =>
  S(
    () => import("../pages/Settings.jsx"),
    __vite__mapDeps([24, 4, 2, 1, 3, 5, 6]),
  ).then((t) => ({
    default: t.Settings,
  })),
);
const AttendancePage = lazyWithReload(() =>
  S(
    () => import("../pages/Attendance.jsx"),
    __vite__mapDeps([20, 4, 2, 8, 14, 5, 12, 6]),
  ).then((t) => ({
    default: t.Attendance,
  })),
);
const TuesdayTeachingPage = lazyWithReload(() =>
  S(
    () => import("../pages/TuesdayTeaching.jsx"),
    __vite__mapDeps([21, 4, 2, 5, 6]),
  ).then((t) => ({
    default: t.TuesdayTeaching,
  })),
);
const ServiceHistoryPage = lazyWithReload(() =>
  S(
    () => import("../pages/ServiceHistory.jsx"),
    __vite__mapDeps([23, 4, 2, 8, 9, 5, 6]),
  ).then((t) => ({
    default: t.ServiceHistory,
  })),
);
const UdlvPage = lazyWithReload(() =>
  S(() => import("../pages/Udlv.jsx"), __vite__mapDeps([22, 4, 2, 5, 6])).then(
    (t) => ({
      default: t.Udlv,
    }),
  ),
);
const AppHistoryPage = lazyWithReload(() =>
  S(
    () => import("../pages/AppHistory.jsx"),
    __vite__mapDeps([25, 4, 2, 5, 6]),
  ).then((t) => ({
    default: t.AppHistory,
  })),
);
const PendingAssignmentPage = lazyWithReload(() =>
  S(
    () => import("../pages/PendingAssignment.jsx"),
    __vite__mapDeps([26, 4, 2, 12, 27, 5, 6]),
  ).then((t) => ({
    default: t.PendingAssignment,
  })),
);
const PendingRequestsPage = lazyWithReload(() =>
  S(
    () => import("../pages/PendingRequests.jsx"),
    __vite__mapDeps([28, 4, 2, 12, 15, 5, 27, 6]),
  ).then((t) => ({
    default: t.PendingRequests,
  })),
);
const PageLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      {[
        <div className="relative">
          {[
            <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30" />,
            <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />,
          ]}
        </div>,
        <p className="text-gray-500 dark:text-slate-400 text-sm animate-pulse">
          {"Cargando..."}
        </p>,
      ]}
    </div>
  </div>
);
function App() {
  return (
    <ChunkErrorBoundary>
      <AuthProvider>
        <GlobalDataProvider>
          <AppDialogProvider>
            <BrowserRouter>
              <Routes>
                {[
                  <Route element={<PublicAuthLayout />}>
                    {[
                      <Route path="/login" element={<LoginPage />} />,
                      <Route path="/register" element={<RegisterPage />} />,
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace={!0} />}
                      />,
                    ]}
                  </Route>,
                  <Route element={<ProtectedRoute />}>
                    {[
                      <Route
                        path="/pending-assignment"
                        element={
                          <React.Suspense fallback={<PageLoadingSpinner />}>
                            <PendingAssignmentPage />
                          </React.Suspense>
                        }
                      />,
                      <Route path="/dashboard" element={<DashboardLayout />}>
                        {[
                          <Route
                            index={!0}
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <DashboardPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="events"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <EventsPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="events/:id"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <EventDetailsPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="areas"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <ServiceAreasPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="volunteers"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <VolunteersPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="roles"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <RolesPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="requests"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <PendingRequestsPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="attendance"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <AttendancePage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="tuesday-teaching"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <TuesdayTeachingPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="udlv"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <UdlvPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="my-history"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <ServiceHistoryPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="settings"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <SettingsPage />
                              </React.Suspense>
                            }
                          />,
                          <Route
                            path="app-history"
                            element={
                              <React.Suspense fallback={<PageLoadingSpinner />}>
                                <AppHistoryPage />
                              </React.Suspense>
                            }
                          />,
                        ]}
                      </Route>,
                    ]}
                  </Route>,
                ]}
              </Routes>
            </BrowserRouter>
          </AppDialogProvider>
        </GlobalDataProvider>
      </AuthProvider>
    </ChunkErrorBoundary>
  );
}
const AppModule = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      default: App,
    },
    Symbol.toStringTag,
    {
      value: "Module",
    },
  ),
);
export {
  PublicAuthLayout,
  lazyWithReload,
  ChunkErrorBoundary,
  DashboardPage,
  VolunteersPage,
  EventsPage,
  EventDetailsPage,
  ServiceAreasPage,
  RolesPage,
  SettingsPage,
  AttendancePage,
  TuesdayTeachingPage,
  ServiceHistoryPage,
  UdlvPage,
  AppHistoryPage,
  PendingAssignmentPage,
  PendingRequestsPage,
  PageLoadingSpinner,
  App,
  AppModule,
};
