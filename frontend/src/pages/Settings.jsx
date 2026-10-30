// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { sendNotification } from "../services/notification-client.js";
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  u as useNavigate,
  r as React,
} from "../vendor/vendor-react-BwINE3B3.js";
import {
  useAuth,
  useGlobalData,
  isBffEnabled,
  firestoreDb,
  onSnapshot,
  OptimizedImage,
  bffFetch,
  Modal,
  compressImage,
  firebaseStorage,
  BffError,
  isStrictBffAuth,
} from "../app/App.jsx";
import {
  A as w,
  S as J,
  O as Xe,
  P as Ke,
  Q as Ye,
  W as Ze,
  v as je,
  M as ve,
  X as ea,
  B as ye,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import { useNotifications } from "../hooks/useNotifications.js";
import {
  a8 as Settings2Icon,
  U as UserIcon,
  a4 as CameraIcon,
  a9 as MailIcon,
  S as ShieldIcon,
  C as CheckIcon,
  N as SaveIcon,
  a as LockIcon,
  T as TriangleAlertIcon,
  D as BellIcon,
  aa as BellRingIcon,
  ab as BellOffIcon,
  L as LoaderCircleIcon,
  ac as CircleQuestionMarkIcon,
  ad as SmartphoneIcon,
  ae as RefreshCwIcon,
  E as EyeOffIcon,
  b as EyeIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import "../vendor/vendor-pdf-Cf03QSry.js";
import "../services/notifications.js";
const Settings = () => {
  const {
      user: d,
      userProfile: l,
      refreshUserProfile: ee,
      updateLocalUserProfile: N,
      logout: L,
    } = useAuth(),
    { roles: ae } = useGlobalData(),
    R = useNavigate(),
    [h, te] = React.useState(l?.name || ""),
    [k] = React.useState(l?.email || ""),
    [F, U] = React.useState(l?.photoURL || ""),
    [Ce, Ee] = React.useState("-"),
    [Pe, m] = React.useState("");
  (React.useEffect(() => {
    isBffEnabled() && (U(l?.photoURL || ""), !h && l?.name && te(l.name));
  }, [l?.photoURL, l?.name]),
    React.useEffect(() => {
      const a = l?.role;
      if (!a) {
        m("");
        return;
      }
      if (a === "master_admin") {
        m("Master Admin");
        return;
      }
      if (a === "admin") {
        m("Administrador");
        return;
      }
      if (a === "user") {
        m("Servidor");
        return;
      }
      const t = w(firestoreDb, "roles", a),
        r = a.replace(/_/g, " "),
        n = ae.find((x) => x.id === a);
      if (n) {
        m(n.name);
        return;
      }
      if (isBffEnabled()) {
        m(r);
        return;
      }
      return onSnapshot(
        t,
        (x) => {
          if (!x.exists()) {
            m(r);
            return;
          }
          const g = x.data()?.name;
          m(typeof g == "string" && g.trim().length > 0 ? g : r);
        },
        () => {
          m(r);
        },
      );
    }, [l?.role, ae]),
    React.useEffect(() => {
      (async () => {
        try {
          const t = await fetch("/app-version.json", {
            cache: "no-store",
          });
          if (!t.ok) return;
          const r = await t.json();
          typeof r.version == "string" && Ee(`v${r.version}`);
        } catch {}
      })();
    }, []));
  const {
      isSupported: S,
      permission: ze,
      isEnabled: se,
      isLoading: A,
      error: M,
      enableNotifications: Le,
      disableNotifications: Re,
    } = useNotifications(),
    C = l?.preferences?.notifications !== !1,
    [$, O] = React.useState(!1),
    [B, T] = React.useState(null),
    [q, re] = React.useState(!1),
    [ie, oe] = React.useState(!1),
    [ne, de] = React.useState(""),
    le = React.useRef(null),
    [Ue, E] = React.useState(!1),
    [s, j] = React.useState({
      new: "",
      confirm: "",
    }),
    [_, Ae] = React.useState(!1),
    [W, Te] = React.useState(!1),
    [ce, u] = React.useState(""),
    [xe, p] = React.useState(""),
    [me, ue] = React.useState(!1),
    [De, P] = React.useState(!1),
    [D, H] = React.useState(!1),
    [ge, f] = React.useState(""),
    Ie = async () => {
      if (!d) return;
      if ((H(!0), f(""), isBffEnabled()))
        try {
          await bffFetch("/api/users/me/delete", {
            method: "POST",
            json: {},
          });
          try {
            await L();
          } catch {}
          (P(!1), R("/login"));
          return;
        } catch (i) {
          const x =
            i instanceof BffError
              ? i?.data?.error || `Error (status ${i.status})`
              : i?.message;
          f(x || "No se pudo eliminar la cuenta. Inténtalo de nuevo.");
        } finally {
          H(!1);
        }
      const a = w(firestoreDb, "users", d.uid),
        t = w(firestoreDb, "userTokens", d.uid);
      let r = null,
        n = null;
      try {
        const i = await je(a);
        i.exists() && (r = i.data());
      } catch {}
      try {
        const i = await je(t);
        i.exists() && (n = i.data());
      } catch {}
      try {
        if (isBffEnabled() && isStrictBffAuth())
          throw new Error(
            "Eliminar cuenta no está disponible en modo seguro (BFF estricto).",
          );
        const i = d;
        if (!i || typeof i.getIdToken != "function")
          throw new Error("MISSING_FIREBASE_USER");
        (await ve(t).catch(() => {}), await ea(i), await ve(a).catch(() => {}));
        try {
          await L();
        } catch {}
        (P(!1), R("/login"));
      } catch (i) {
        (n &&
          (await ye(t, n, {
            merge: !0,
          }).catch(() => {})),
          r &&
            (await ye(a, r, {
              merge: !0,
            }).catch(() => {})),
          (isBffEnabled() && isStrictBffAuth()) ||
          i?.message?.includes("modo seguro")
            ? f("Esta acción está deshabilitada en modo seguro (BFF estricto).")
            : i?.code === "auth/requires-recent-login"
              ? f(
                  "Por seguridad, vuelve a iniciar sesión y vuelve a intentar eliminar tu cuenta.",
                )
              : f(
                  i?.message ||
                    "No se pudo eliminar la cuenta. Inténtalo de nuevo.",
                ));
      } finally {
        H(!1);
      }
    },
    Fe = async () => {
      O(true);
      T(null);
      const resolveUserId = () => (isBffEnabled() ? l?.uid : d?.uid) || d?.uid;
      let userId = resolveUserId();
      if (!userId && isBffEnabled()) {
        try {
          await ee();
        } catch {}
        userId = resolveUserId();
      }
      if (!userId) {
        T({
          type: "error",
          text: "Debes iniciar sesión para enviar una prueba.",
        });
        O(false);
        return;
      }
      try {
        await sendNotification("/api/notify/user", {
          userId,
          title: "Notificación de prueba",
          body: "¡Las notificaciones funcionan correctamente!",
        });
        T({
          type: "success",
          text: "Enviada. Revisa tu dispositivo.",
        });
      } catch (error) {
        T({
          type: "error",
          text: error?.data?.error || error?.message || "Error de red",
        });
      } finally {
        O(false);
      }
    },
    [G, he] = React.useState(!1),
    [I, v] = React.useState(null),
    Me = async () => {
      if (!("serviceWorker" in navigator)) {
        v({
          type: "error",
          text: "Service Worker no soportado",
        });
        return;
      }
      (he(!0), v(null));
      try {
        const a = await navigator.serviceWorker.ready;
        (await a.update(),
          a.waiting
            ? v({
                type: "success",
                text: "¡Nueva versión encontrada! Instalando...",
              })
            : (v({
                type: "info",
                text: "La aplicación está actualizada",
              }),
              setTimeout(() => v(null), 3e3)));
      } catch (a) {
        (console.error("Error checking update:", a),
          v({
            type: "error",
            text: "Error al buscar actualizaciones",
          }));
      } finally {
        he(!1);
      }
    },
    [z, V] = React.useState(null),
    $e = (a) => {
      const t = a.target.files?.[0];
      if (t) {
        V(t);
        const r = new FileReader();
        ((r.onloadend = () => {
          U(r.result);
        }),
          r.readAsDataURL(t));
      }
    },
    Oe = async (a) => {
      if ((a.preventDefault(), !!d)) {
        (re(!0), de(""));
        try {
          if (isBffEnabled()) {
            if (z) {
              const t = await compressImage(z, 512, 0.82),
                r = new FormData();
              r.append("file", t, t.name);
              const n = await bffFetch("/api/users/me/photo", {
                method: "POST",
                body: r,
              });
              (typeof n?.photoURL == "string" &&
                n.photoURL &&
                (U(n.photoURL),
                N({
                  photoURL: n.photoURL,
                  photoThumbURL: n.photoURL,
                })),
                V(null));
            }
            (await bffFetch("/api/users/me", {
              method: "PATCH",
              json: {
                name: h,
              },
            }),
              N({
                name: h,
              }));
          } else {
            let t = F;
            if (z) {
              const r = await compressImage(z, 512, 0.82),
                n = Xe(
                  firebaseStorage,
                  `profile-photos/${d.uid}/${Date.now()}_${z.name}`,
                );
              (await Ke(n, r, {
                contentType: r.type || "image/jpeg",
                cacheControl: "public,max-age=31536000,immutable",
              }),
                (t = await Ye(n)),
                V(null));
            }
            (await J(w(firestoreDb, "users", d.uid), {
              name: h,
              photoURL: t,
            }),
              U(t),
              N({
                name: h,
                photoURL: t,
                photoThumbURL: t,
              }));
          }
          (await ee(), oe(!0), setTimeout(() => oe(!1), 2e3));
        } catch (t) {
          (console.error("Error updating profile:", t),
            de("Error al guardar los cambios. Inténtalo de nuevo."));
        } finally {
          re(!1);
        }
      }
    },
    Be = async (a) => {
      if ((a.preventDefault(), u(""), p(""), s.new.length < 6)) {
        u("La nueva contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (s.new !== s.confirm) {
        u("Las contraseñas nuevas no coinciden");
        return;
      }
      if (d) {
        ue(!0);
        try {
          if (isBffEnabled()) {
            (await bffFetch("/api/users/me/password", {
              method: "POST",
              json: {
                newPassword: s.new,
              },
            }),
              p("Contraseña actualizada exitosamente"),
              setTimeout(async () => {
                (E(!1),
                  j({
                    new: "",
                    confirm: "",
                  }),
                  p(""));
                try {
                  (await L(),
                    R("/login", {
                      state: {
                        message: "Ingresa con tu nueva contraseña",
                      },
                    }));
                } catch (r) {
                  console.error("Logout error", r);
                }
              }, 2e3));
            return;
          }
          const t = d;
          if (!t || typeof t.getIdToken != "function")
            throw new Error("MISSING_FIREBASE_USER");
          (await Ze(t, s.new),
            p("Contraseña actualizada exitosamente"),
            setTimeout(async () => {
              (E(!1),
                j({
                  new: "",
                  confirm: "",
                }),
                p(""));
              try {
                (await L(),
                  R("/login", {
                    state: {
                      message: "Ingresa con tu nueva contraseña",
                    },
                  }));
              } catch (r) {
                console.error("Logout error", r);
              }
            }, 2e3));
        } catch (t) {
          (console.error("Error changing password:", t),
            t instanceof BffError
              ? u(
                  t?.data?.error ||
                    `Error al cambiar contraseña (status ${t.status})`,
                )
              : t.code === "auth/requires-recent-login"
                ? u(
                    "Por seguridad, debes volver a iniciar sesión para cambiar tu contraseña.",
                  )
                : u("Error al cambiar la contraseña. Inténtalo de nuevo."));
        } finally {
          ue(!1);
        }
      }
    },
    qe = (a) =>
      a
        .split(" ")
        .map((t) => t[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {[
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-4">
            {[
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <Settings2Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>,
              <div>
                {[
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {"Configuración"}
                  </h1>,
                  <p className="text-gray-500 dark:text-slate-400">
                    {"Personaliza tu cuenta y preferencias"}
                  </p>,
                ]}
              </div>,
            ]}
          </div>
        </div>,
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          {[
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
              {[
                <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    {[
                      <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl">
                        <UserIcon size={20} />
                      </div>,
                      <div>
                        {[
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {"Perfil"}
                          </h2>,
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {"Tu información personal"}
                          </p>,
                        ]}
                      </div>,
                    ]}
                  </div>
                </div>,
                <form onSubmit={Oe} className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                    {[
                      <div className="flex flex-col items-center mx-auto md:mx-0">
                        {[
                          <div className="relative group">
                            {[
                              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white dark:ring-slate-700">
                                {F ? (
                                  <OptimizedImage
                                    src={F}
                                    alt="Profile"
                                    className="w-full h-full large-avatar"
                                    eager={!0}
                                    loading="eager"
                                    fetchPriority="high"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">
                                      {qe(h || "U")}
                                    </span>
                                  </div>
                                )}
                              </div>,
                              <button
                                type="button"
                                onClick={() => le.current?.click()}
                                disabled={q}
                                className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                title="Cambiar foto"
                              >
                                <CameraIcon size={18} />
                              </button>,
                              <input
                                type="file"
                                ref={le}
                                className="hidden"
                                accept="image/*"
                                onChange={$e}
                              />,
                            ]}
                          </div>,
                          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400 text-center">
                            {[
                              "Haz clic para cambiar",
                              <br />,
                              "tu foto de perfil",
                            ]}
                          </p>,
                        ]}
                      </div>,
                      <div className="flex-1 space-y-5">
                        {[
                          <div>
                            {[
                              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                {[<UserIcon size={16} />, "Nombre Completo"]}
                              </label>,
                              <input
                                type="text"
                                value={h}
                                onChange={(a) => te(a.target.value)}
                                className="w-full rounded-xl border-2 border-gray-200 dark:border-slate-600 px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-700 dark:text-white transition-all"
                                placeholder="Tu nombre completo"
                              />,
                            ]}
                          </div>,
                          k.includes("@") &&
                            !k.toLowerCase().endsWith("@church.app") && (
                              <div>
                                {[
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    {[
                                      <MailIcon size={16} />,
                                      "Correo Electrónico",
                                    ]}
                                  </label>,
                                  <div className="flex items-center gap-2">
                                    {[
                                      <input
                                        type="text"
                                        value={k}
                                        disabled={!0}
                                        className="flex-1 rounded-xl border-2 border-gray-100 dark:border-slate-700 px-4 py-3 bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400"
                                      />,
                                      <span className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 text-white rounded-xl text-xs font-bold shadow-md">
                                        {[
                                          <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            {[
                                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />,
                                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />,
                                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />,
                                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />,
                                            ]}
                                          </svg>,
                                          "Google",
                                        ]}
                                      </span>,
                                    ]}
                                  </div>,
                                ]}
                              </div>
                            ),
                          k.toLowerCase().endsWith("@church.app") && (
                            <div>
                              {[
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                  {[<UserIcon size={16} />, "Usuario"]}
                                </label>,
                                <input
                                  type="text"
                                  value={k.replace(/@church\.app$/i, "")}
                                  disabled={!0}
                                  className="w-full rounded-xl border-2 border-gray-100 dark:border-slate-700 px-4 py-3 bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400"
                                />,
                              ]}
                            </div>
                          ),
                          <div>
                            {[
                              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                {[<ShieldIcon size={16} />, "Rol"]}
                              </label>,
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const a = l?.role,
                                    n =
                                      a === "master_admin"
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                                        : !!a &&
                                            a !== "user" &&
                                            a !== "master_admin"
                                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                          : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
                                    i = Pe || (a ? a.replace(/_/g, " ") : "-");
                                  return (
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium ${n}`}
                                    >
                                      {i}
                                    </span>
                                  );
                                })()}
                              </div>,
                            ]}
                          </div>,
                          <button
                            type="submit"
                            disabled={q}
                            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 ${ie ? "bg-green-500" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/25"} disabled:opacity-50`}
                          >
                            {ie ? (
                              <jsxRuntime.Fragment>
                                {[<CheckIcon size={20} />, "¡Guardado!"]}
                              </jsxRuntime.Fragment>
                            ) : q ? (
                              <jsxRuntime.Fragment>
                                {[
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />,
                                  "Guardando...",
                                ]}
                              </jsxRuntime.Fragment>
                            ) : (
                              <jsxRuntime.Fragment>
                                {[<SaveIcon size={20} />, "Guardar Cambios"]}
                              </jsxRuntime.Fragment>
                            )}
                          </button>,
                          ne && (
                            <div className="text-sm text-red-600 dark:text-red-400">
                              {ne}
                            </div>
                          ),
                        ]}
                      </div>,
                    ]}
                  </div>
                </form>,
              ]}
            </div>,
            <div className="space-y-6">
              {[
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  {[
                    <div className="p-5 border-b border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        {[
                          <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl">
                            <ShieldIcon size={20} />
                          </div>,
                          <div>
                            {[
                              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {"Seguridad"}
                              </h2>,
                              <p className="text-sm text-gray-500 dark:text-slate-400">
                                {"Protege tu cuenta"}
                              </p>,
                            ]}
                          </div>,
                        ]}
                      </div>
                    </div>,
                    <div className="p-5">
                      <button
                        onClick={() => E(!0)}
                        className="w-full group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-200"
                      >
                        {[
                          <div className="p-2 bg-gray-100 dark:bg-slate-700 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 rounded-lg transition-colors">
                            <LockIcon
                              size={20}
                              className="text-gray-600 dark:text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                            />
                          </div>,
                          <div className="flex-1 text-left">
                            {[
                              <p className="font-medium text-gray-900 dark:text-white">
                                {"Cambiar Contraseña"}
                              </p>,
                              <p className="text-sm text-gray-500 dark:text-slate-400">
                                {"Mínimo 6 caracteres"}
                              </p>,
                            ]}
                          </div>,
                          <div className="text-gray-400 group-hover:text-green-500 transition-colors">
                            {"→"}
                          </div>,
                        ]}
                      </button>
                    </div>,
                  ]}
                </div>,
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900/40 shadow-sm overflow-hidden">
                  {[
                    <div className="p-5 border-b border-red-100 dark:border-red-900/40 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10">
                      <div className="flex items-center gap-3">
                        {[
                          <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl">
                            <TriangleAlertIcon size={20} />
                          </div>,
                          <div>
                            {[
                              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {"Cuenta"}
                              </h2>,
                              <p className="text-sm text-gray-500 dark:text-slate-400">
                                {"Acciones irreversibles"}
                              </p>,
                            ]}
                          </div>,
                        ]}
                      </div>
                    </div>,
                    <div className="p-5 space-y-3">
                      {[
                        <p className="text-sm text-gray-600 dark:text-slate-300">
                          {
                            "Eliminar tu cuenta borrará tu acceso a la aplicación."
                          }
                        </p>,
                        <button
                          onClick={() => {
                            (f(""), P(!0));
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50"
                        >
                          {[
                            <TriangleAlertIcon size={18} />,
                            "Eliminar mi cuenta",
                          ]}
                        </button>,
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {
                            "Esta acción puede requerir que vuelvas a iniciar sesión."
                          }
                        </p>,
                      ]}
                    </div>,
                  ]}
                </div>,
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  {[
                    <div className="p-5 border-b border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        {[
                          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-xl">
                            <BellIcon size={20} />
                          </div>,
                          <div>
                            {[
                              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {"Notificaciones Push"}
                              </h2>,
                              <p className="text-sm text-gray-500 dark:text-slate-400">
                                {"Recibe alertas en tu dispositivo"}
                              </p>,
                            ]}
                          </div>,
                        ]}
                      </div>
                    </div>,
                    <div className="p-5 space-y-4">
                      {[
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                          {[
                            <div className="flex items-center gap-3">
                              {[
                                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm">
                                  {C ? (
                                    <BellRingIcon
                                      size={18}
                                      className="text-green-500"
                                    />
                                  ) : (
                                    <BellOffIcon
                                      size={18}
                                      className="text-gray-400"
                                    />
                                  )}
                                </div>,
                                <div>
                                  {[
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {"Notificaciones Push"}
                                    </p>,
                                    <p className="text-sm text-gray-500 dark:text-slate-400">
                                      {S
                                        ? C
                                          ? "Recibirás notificaciones de eventos"
                                          : "Activa para recibir alertas"
                                        : "No soportado en este navegador/dispositivo"}
                                    </p>,
                                    M && (
                                      <p className="text-xs text-red-500 mt-1">
                                        {M}
                                      </p>
                                    ),
                                    !S && !M && (
                                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                        {
                                          "💡 En iPhone/iPad: instala la app como PWA (Compartir → Agregar a pantalla de inicio) y requiere iOS 16.4+"
                                        }
                                      </p>
                                    ),
                                  ]}
                                </div>,
                              ]}
                            </div>,
                            S && (
                              <button
                                onClick={async () => {
                                  if (C)
                                    try {
                                      await Re();
                                    } finally {
                                      (N({
                                        preferences: {
                                          notifications: !1,
                                        },
                                      }),
                                        isBffEnabled()
                                          ? await bffFetch("/api/users/me", {
                                              method: "PATCH",
                                              json: {
                                                preferences: {
                                                  notifications: !1,
                                                },
                                              },
                                            })
                                          : d?.uid &&
                                            (await J(
                                              w(firestoreDb, "users", d.uid),
                                              {
                                                "preferences.notifications": !1,
                                              },
                                            )));
                                    }
                                  else {
                                    if (!(await Le())) return;
                                    (N({
                                      preferences: {
                                        notifications: !0,
                                      },
                                    }),
                                      isBffEnabled()
                                        ? await bffFetch("/api/users/me", {
                                            method: "PATCH",
                                            json: {
                                              preferences: {
                                                notifications: !0,
                                              },
                                            },
                                          })
                                        : d?.uid &&
                                          (await J(
                                            w(firestoreDb, "users", d.uid),
                                            {
                                              "preferences.notifications": !0,
                                            },
                                          )));
                                  }
                                }}
                                disabled={A}
                                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${C ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gray-300 dark:bg-slate-600"} ${A ? "opacity-50" : ""}`}
                              >
                                {A ? (
                                  <LoaderCircleIcon
                                    size={16}
                                    className="absolute left-1/2 -translate-x-1/2 text-white animate-spin"
                                  />
                                ) : (
                                  <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${C ? "translate-x-7" : "translate-x-1"}`}
                                  />
                                )}
                              </button>
                            ),
                          ]}
                        </div>,
                        S && ze === "denied" && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                              {
                                "⚠️ Has bloqueado las notificaciones. Para activarlas, ve a la configuración de tu navegador y permite notificaciones para este sitio."
                              }
                            </p>
                          </div>
                        ),
                        S && (
                          <div className="flex flex-col gap-2">
                            {[
                              <button
                                type="button"
                                onClick={Fe}
                                disabled={A || $ || !se}
                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all ${se ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"} ${$ ? "opacity-70" : ""}`}
                              >
                                {$ ? (
                                  <jsxRuntime.Fragment>
                                    {[
                                      <LoaderCircleIcon
                                        size={16}
                                        className="animate-spin"
                                      />,
                                      "Enviando prueba...",
                                    ]}
                                  </jsxRuntime.Fragment>
                                ) : (
                                  "Enviar notificación de prueba"
                                )}
                              </button>,
                              B && (
                                <p
                                  className={`text-sm ${B.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                                >
                                  {B.text}
                                </p>
                              ),
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                  ]}
                </div>,
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 p-5">
                  <div className="flex items-start gap-3">
                    {[
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                        <CircleQuestionMarkIcon
                          size={18}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                      </div>,
                      <div>
                        {[
                          <p className="font-medium text-indigo-900 dark:text-indigo-300">
                            {"¿Necesitas ayuda?"}
                          </p>,
                          <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                            {
                              "Contacta al administrador para cambios en tu rol o ministerios asignados."
                            }
                          </p>,
                        ]}
                      </div>,
                    ]}
                  </div>
                </div>,
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  {[
                    <div className="p-5 border-b border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        {[
                          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl">
                            <SmartphoneIcon size={20} />
                          </div>,
                          <div>
                            {[
                              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {"Aplicación"}
                              </h2>,
                              <p className="text-sm text-gray-500 dark:text-slate-400">
                                {"Versión y actualizaciones"}
                              </p>,
                            ]}
                          </div>,
                        ]}
                      </div>
                    </div>,
                    <div className="p-5 space-y-4">
                      {[
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                          {[
                            <div>
                              {[
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {"Versión"}
                                </p>,
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                  {Ce}
                                </p>,
                              ]}
                            </div>,
                            <button
                              onClick={Me}
                              disabled={G}
                              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors disabled:opacity-50"
                            >
                              {[
                                <RefreshCwIcon
                                  size={16}
                                  className={G ? "animate-spin" : ""}
                                />,
                                G ? "Buscando..." : "Buscar actualizaciones",
                              ]}
                            </button>,
                          ]}
                        </div>,
                        I && (
                          <p
                            className={`text-sm text-center ${I.type === "success" ? "text-green-600" : I.type === "error" ? "text-red-500" : "text-blue-500"}`}
                          >
                            {I.text}
                          </p>
                        ),
                      ]}
                    </div>,
                  ]}
                </div>,
              ]}
            </div>,
          ]}
        </div>,
        <Modal
          isOpen={Ue}
          onClose={() => {
            (E(!1),
              u(""),
              p(""),
              j({
                new: "",
                confirm: "",
              }));
          }}
          title="Cambiar Contraseña"
          maxWidth="max-w-md"
        >
          <form onSubmit={Be} className="space-y-5">
            {[
              ce && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800">
                  {ce}
                </div>
              ),
              xe && (
                <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-xl border border-green-100 dark:border-green-800 flex items-center gap-2">
                  {[<CheckIcon size={18} />, xe]}
                </div>
              ),
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {"Nueva Contraseña"}
                  </label>,
                  <div className="relative">
                    {[
                      <input
                        type={_ ? "text" : "password"}
                        required={!0}
                        value={s.new}
                        onChange={(a) =>
                          j({
                            ...s,
                            new: a.target.value,
                          })
                        }
                        className="w-full rounded-xl border-2 border-gray-200 dark:border-slate-600 px-4 py-3 pr-12 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-700 dark:text-white transition-all"
                      />,
                      <button
                        type="button"
                        onClick={() => Ae(!_)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                      >
                        {_ ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>,
                    ]}
                  </div>,
                  s.new && (
                    <div className="mt-2 flex items-center gap-2">
                      {[
                        <div
                          className={`h-1 flex-1 rounded-full ${s.new.length >= 6 ? "bg-green-500" : "bg-red-300"}`}
                        />,
                        <div
                          className={`h-1 flex-1 rounded-full ${s.new.length >= 8 ? "bg-green-500" : "bg-gray-200 dark:bg-slate-600"}`}
                        />,
                        <div
                          className={`h-1 flex-1 rounded-full ${s.new.length >= 10 ? "bg-green-500" : "bg-gray-200 dark:bg-slate-600"}`}
                        />,
                        <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">
                          {s.new.length < 6
                            ? "Muy corta"
                            : s.new.length < 8
                              ? "Débil"
                              : s.new.length < 10
                                ? "Buena"
                                : "Fuerte"}
                        </span>,
                      ]}
                    </div>
                  ),
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {"Confirmar Nueva Contraseña"}
                  </label>,
                  <div className="relative">
                    {[
                      <input
                        type={W ? "text" : "password"}
                        required={!0}
                        value={s.confirm}
                        onChange={(a) =>
                          j({
                            ...s,
                            confirm: a.target.value,
                          })
                        }
                        className={`w-full rounded-xl border-2 px-4 py-3 pr-12 focus:outline-none focus:ring-4 dark:bg-slate-700 dark:text-white transition-all ${s.confirm && s.confirm !== s.new ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : s.confirm && s.confirm === s.new ? "border-green-300 focus:border-green-500 focus:ring-green-500/10" : "border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/10"}`}
                      />,
                      <button
                        type="button"
                        onClick={() => Te(!W)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                      >
                        {W ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>,
                    ]}
                  </div>,
                  s.confirm && s.confirm !== s.new && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      {"Las contraseñas no coinciden"}
                    </p>
                  ),
                  s.confirm && s.confirm === s.new && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      {[<CheckIcon size={14} />, " Las contraseñas coinciden"]}
                    </p>
                  ),
                ]}
              </div>,
              <div className="pt-4 flex gap-3">
                {[
                  <button
                    type="button"
                    onClick={() => {
                      (E(!1),
                        u(""),
                        p(""),
                        j({
                          new: "",
                          confirm: "",
                        }));
                    }}
                    className="flex-1 px-4 py-3 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors border-2 border-gray-200 dark:border-slate-600"
                  >
                    {"Cancelar"}
                  </button>,
                  <button
                    type="submit"
                    disabled={me || !s.new || !s.confirm || s.new !== s.confirm}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {me ? (
                      <jsxRuntime.Fragment>
                        {[
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />,
                          "Actualizando...",
                        ]}
                      </jsxRuntime.Fragment>
                    ) : (
                      <jsxRuntime.Fragment>
                        {[<LockIcon size={18} />, "Actualizar"]}
                      </jsxRuntime.Fragment>
                    )}
                  </button>,
                ]}
              </div>,
            ]}
          </form>
        </Modal>,
        <Modal
          isOpen={De}
          onClose={() => {
            D || (P(!1), f(""));
          }}
          title="Eliminar cuenta"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            {[
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-xl border border-red-100 dark:border-red-800">
                {"Esta acción es irreversible."}
              </div>,
              ge && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-sm rounded-xl border border-orange-100 dark:border-orange-800/50">
                  {ge}
                </div>
              ),
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {
                  "¿Seguro que deseas eliminar tu cuenta? Se cerrará tu sesión y ya no podrás acceder."
                }
              </p>,
              <div className="flex gap-3">
                {[
                  <button
                    type="button"
                    onClick={() => P(!1)}
                    disabled={D}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    {"Cancelar"}
                  </button>,
                  <button
                    type="button"
                    onClick={Ie}
                    disabled={D}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {D ? (
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
                        {[<TriangleAlertIcon size={18} />, "Eliminar"]}
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
export { Settings };
