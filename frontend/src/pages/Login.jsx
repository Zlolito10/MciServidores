// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { loadModule as S } from "../services/module-loader.js";
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  r as React,
  u as useNavigate,
  c as useLocation,
} from "../vendor/vendor-react-BwINE3B3.js";
import {
  L as LoaderCircleIcon,
  U as UserIcon,
  a as LockIcon,
  E as EyeOffIcon,
  b as EyeIcon,
  C as CheckIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import {
  isBffEnabled,
  isStrictBffAuth,
  bffFetch,
  Y,
  isHybridAuthEnabled,
} from "../app/runtime.jsx";
import { authReady, firebaseAuth, googleProvider } from "../firebase/client.js";
const LoginPage = () => {
  const logoPath = "/mci-logo-pagina.png",
    [logoFailed, setLogoFailed] = React.useState(!1),
    versionedLogoSrc = (() => {
      try {
        const d = localStorage.getItem("pwa_app_version");
        if (!d) return logoPath;
        const w = logoPath.includes("?") ? "&" : "?";
        return `${logoPath}${w}v=${encodeURIComponent(d)}`;
      } catch {
        return logoPath;
      }
    })(),
    [username, setUsername] = React.useState(""),
    [password, setPassword] = React.useState(""),
    [showPassword, setShowPassword] = React.useState(!1),
    [error, setError] = React.useState(""),
    [isSubmitting, setSubmitting] = React.useState(!1),
    [isGoogleSubmitting, setGoogleSubmitting] = React.useState(!1),
    navigate = useNavigate(),
    location = useLocation(),
    {
      user: user,
      userProfile: userProfile,
      refreshUserProfile: refreshUserProfile,
    } = useAuth(),
    [infoMessage, setInfoMessage] = React.useState(
      location.state?.message || "",
    );
  (React.useEffect(
    () => (
      document.documentElement.classList.add("login-no-scroll"),
      document.body.classList.add("login-no-scroll"),
      () => {
        (document.documentElement.classList.remove("login-no-scroll"),
          document.body.classList.remove("login-no-scroll"));
      }
    ),
    [],
  ),
    React.useEffect(() => {
      (isBffEnabled() ? !!userProfile : !!user) && navigate("/dashboard");
    }, [user, userProfile, navigate]));
  const handlePasswordLogin = async (d) => {
      (d.preventDefault(), setError(""), setInfoMessage(""), setSubmitting(!0));
      try {
        if (isBffEnabled() && isStrictBffAuth()) {
          const w = username.trim().toLowerCase();
          if (!w || w.includes(" ")) {
            setError(
              "Usuario inválido. Usa un usuario sin espacios (ej: nombre.apellido).",
            );
            return;
          }
          const j = await bffFetch("/api/passwordLogin", {
            method: "POST",
            json: {
              username: w,
              password: password,
            },
          });
          if (
            (Y(typeof j?.csrfToken == "string" ? j.csrfToken : null),
            !(await bffFetch("/api/me"))?.ok)
          ) {
            setError(
              "No se pudo crear la sesión (cookie). Revisa si el navegador/PWA bloquea cookies y vuelve a intentar.",
            );
            return;
          }
          await refreshUserProfile();
        } else {
          await authReady;
          const w = `${username}@church.app`,
            { signInWithEmailAndPassword: j } = await S(async () => {
              const { signInWithEmailAndPassword: U } =
                await import("../vendor/vendor-firebase-BjYbfC3F.js").then(
                  (C) => C.a9,
                );
              return {
                signInWithEmailAndPassword: U,
              };
            }, []),
            R = await j(firebaseAuth, w, password);
          if (isBffEnabled() || isHybridAuthEnabled())
            try {
              const U = await R.user.getIdToken(),
                C = await bffFetch("/api/sessionLogin", {
                  method: "POST",
                  json: {
                    idToken: U,
                  },
                });
              (Y(typeof C?.csrfToken == "string" ? C.csrfToken : null),
                await refreshUserProfile());
            } catch {}
        }
        navigate("/dashboard");
      } catch (w) {
        (console.error(w),
          w.code === "auth/invalid-credential"
            ? setError(
                "Credenciales incorrectas. Verifica tu usuario y contraseña.",
              )
            : w.code === "auth/too-many-requests"
              ? setError("Demasiados intentos fallidos. Intenta más tarde.")
              : setError("Error al iniciar sesión. Intenta nuevamente."));
      } finally {
        setSubmitting(!1);
      }
    },
    handleGoogleLogin = async () => {
      (setGoogleSubmitting(!0), setError(""), setInfoMessage(""));
      try {
        if (isBffEnabled() && isStrictBffAuth()) {
          setError(
            "En modo seguro (BFF estricto) el inicio con Google está deshabilitado.",
          );
          return;
        }
        (await authReady,
          googleProvider.setCustomParameters({
            prompt: "select_account",
          }));
        const { signInWithPopup: d } = await S(async () => {
            const { signInWithPopup: j } =
              await import("../vendor/vendor-firebase-BjYbfC3F.js").then(
                (R) => R.a9,
              );
            return {
              signInWithPopup: j,
            };
          }, []),
          w = await d(firebaseAuth, googleProvider);
        if (isBffEnabled())
          try {
            const j = await w.user.getIdToken(),
              R = await bffFetch("/api/sessionLogin", {
                method: "POST",
                json: {
                  idToken: j,
                },
              });
            if (
              (Y(typeof R?.csrfToken == "string" ? R.csrfToken : null),
              !(await bffFetch("/api/me"))?.ok)
            ) {
              setError(
                "No se pudo crear la sesión (cookie). Revisa si el navegador/PWA bloquea cookies y vuelve a intentar.",
              );
              return;
            }
            await refreshUserProfile();
          } catch {
            setError(
              "No se pudo crear la sesión (cookie). Revisa si el navegador/PWA bloquea cookies y vuelve a intentar.",
            );
            return;
          }
        navigate("/dashboard");
      } catch (d) {
        (console.error(d),
          d.code === "auth/popup-closed-by-user" ||
          d.code === "auth/cancelled-popup-request"
            ? setError("Inicio de sesión cancelado. Inténtalo de nuevo.")
            : d.code === "auth/popup-blocked"
              ? setError(
                  "El navegador bloqueó la ventana emergente. Permite popups para este sitio.",
                )
              : d.code === "auth/operation-not-supported-in-this-environment"
                ? setError(
                    "Este entorno no soporta popups de Google. Abre la app en el navegador (no PWA) para iniciar sesión.",
                  )
                : setError(
                    "Error al conectar con Google. Inténtalo de nuevo.",
                  ));
      } finally {
        setGoogleSubmitting(!1);
      }
    };
  return isSubmitting || isGoogleSubmitting ? (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-900 flex items-start justify-center pt-[20vh] z-50">
      <div className="text-center">
        {[
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl p-4 sm:p-5 animate-pulse gpu-accelerated">
            {logoFailed ? (
              <span className="text-xs font-bold text-slate-700">{"MCI"}</span>
            ) : (
              <img
                src={versionedLogoSrc}
                alt="MCI Logo"
                className="w-full h-full object-contain gpu-accelerated"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={() => setLogoFailed(!0)}
              />
            )}
          </div>,
          <div className="flex items-center justify-center mb-5">
            {[
              <LoaderCircleIcon
                className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                style={{
                  animation: "spin 1s linear infinite",
                }}
              />,
              <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>,
            ]}
          </div>,
          <p className="text-white text-lg sm:text-xl font-semibold animate-pulse">
            {isGoogleSubmitting
              ? "Conectando con Google..."
              : "Iniciando sesión..."}
          </p>,
          <p className="text-blue-200 text-sm sm:text-base mt-2">
            {"Por favor espera"}
          </p>,
        ]}
      </div>
    </div>
  ) : (
    <div className="flex h-screen max-h-screen bg-white overflow-hidden fixed inset-0 touch-none">
      {[
        <div className="lg:hidden fixed top-0 left-0 right-0 h-[env(safe-area-inset-top)] bg-white z-50" />,
        <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-900 items-center justify-center p-12 overflow-hidden">
          {[
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />,
            <div className="relative z-10 text-center text-white">
              {[
                <h2 className="text-3xl font-light mb-6">{"Bienvenido a"}</h2>,
                <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl p-5 gpu-accelerated">
                  {logoFailed ? (
                    <span className="text-base font-bold text-slate-700">
                      {"MCI"}
                    </span>
                  ) : (
                    <img
                      src={versionedLogoSrc}
                      alt="MCI Logo"
                      className="w-full h-full object-contain gpu-accelerated"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onError={() => setLogoFailed(!0)}
                    />
                  )}
                </div>,
                <h1 className="text-5xl font-bold tracking-tight mb-4">
                  {"MCI Servidores"}
                </h1>,
                <p className="text-blue-100 text-lg max-w-md mx-auto font-light">
                  {"Plataforma de gestión de eventos y equipos ministeriales."}
                </p>,
              ]}
            </div>,
            <div className="absolute top-0 right-0 bottom-0 w-24 pointer-events-none translate-x-[1px]">
              {[
                <svg
                  className="h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {[
                    <path
                      d="M0 0 C 40 20 60 80 100 100 L 100 0 Z"
                      fill="white"
                    />,
                    <path
                      d="M0 100 C 40 80 60 20 100 0 L 100 100 Z"
                      fill="white"
                    />,
                  ]}
                </svg>,
                <svg
                  className="absolute inset-y-0 right-0 h-full w-full text-white"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <path d="M0 0 C 50 0 50 100 100 100 V 0 Z" />
                </svg>,
              ]}
            </div>,
          ]}
        </div>,
        <div className="w-full lg:w-1/2 flex flex-col lg:justify-center fixed inset-0 lg:relative lg:inset-auto overflow-hidden touch-none">
          {[
            <div className="lg:hidden bg-gradient-to-br from-blue-600 to-blue-900 pt-[max(1.5rem,env(safe-area-inset-top))] pb-12 px-6 text-center text-white rounded-b-[2rem] flex-shrink-0">
              {[
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-2xl p-2.5 gpu-accelerated">
                  {logoFailed ? (
                    <span className="text-xs font-bold text-slate-700">
                      {"MCI"}
                    </span>
                  ) : (
                    <img
                      src={versionedLogoSrc}
                      alt="MCI Logo"
                      className="w-full h-full object-contain gpu-accelerated"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onError={() => setLogoFailed(!0)}
                    />
                  )}
                </div>,
                <h1 className="text-lg font-bold">{"MCI Servidores"}</h1>,
              ]}
            </div>,
            <div className="flex-1 flex items-center justify-center px-6 -mt-6 lg:mt-0 overflow-hidden">
              <div className="w-full max-w-sm bg-white rounded-3xl lg:rounded-none p-5 lg:p-0 shadow-2xl lg:shadow-none">
                {[
                  <div className="text-center mb-3">
                    {[
                      <h2 className="text-lg font-bold text-gray-800">
                        {"Iniciar Sesión"}
                      </h2>,
                      <p className="text-gray-500 text-sm">
                        {"Ingresa a tu cuenta"}
                      </p>,
                    ]}
                  </div>,
                  <form onSubmit={handlePasswordLogin} className="space-y-3">
                    {[
                      <div className="space-y-3">
                        {[
                          <div>
                            {[
                              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
                                {"Usuario"}
                              </label>,
                              <div className="relative">
                                {[
                                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon size={18} />
                                  </div>,
                                  <input
                                    type="text"
                                    value={username}
                                    onChange={(d) =>
                                      setUsername(d.target.value)
                                    }
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 pl-7 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-colors text-base"
                                    placeholder="nombre.apellido"
                                    required={!0}
                                  />,
                                ]}
                              </div>,
                            ]}
                          </div>,
                          <div>
                            {[
                              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
                                {"Contraseña"}
                              </label>,
                              <div className="relative">
                                {[
                                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                                    <LockIcon size={18} />
                                  </div>,
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(d) =>
                                      setPassword(d.target.value)
                                    }
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 pl-7 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-colors text-base"
                                    placeholder="••••••••"
                                    required={!0}
                                  />,
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                                  >
                                    {showPassword ? (
                                      <EyeOffIcon size={18} />
                                    ) : (
                                      <EyeIcon size={18} />
                                    )}
                                  </button>,
                                ]}
                              </div>,
                            ]}
                          </div>,
                        ]}
                      </div>,
                      infoMessage && (
                        <div className="rounded-lg bg-green-50 p-2 text-sm text-green-600 border border-green-100 flex items-center gap-2">
                          {[<CheckIcon size={16} />, infoMessage]}
                        </div>
                      ),
                      error && (
                        <div className="rounded-lg bg-red-50 p-2 text-sm text-red-600 border border-red-100 flex items-center gap-2">
                          {[
                            <span className="block w-1.5 h-1.5 rounded-full bg-red-600" />,
                            error,
                          ]}
                        </div>
                      ),
                      <div className="space-y-2 pt-1">
                        {[
                          <button
                            type="submit"
                            disabled={isSubmitting || isGoogleSubmitting}
                            className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-white font-semibold shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                          >
                            {isSubmitting ? (
                              <jsxRuntime.Fragment>
                                {[
                                  <LoaderCircleIcon
                                    size={16}
                                    className="animate-spin"
                                  />,
                                  <span>{"Iniciando..."}</span>,
                                ]}
                              </jsxRuntime.Fragment>
                            ) : (
                              "Iniciar Sesión"
                            )}
                          </button>,
                          <div className="flex items-center gap-2">
                            {[
                              <div className="h-px flex-1 bg-gray-200" />,
                              <span className="text-[10px] text-gray-400 uppercase">
                                {"O continúa con"}
                              </span>,
                              <div className="h-px flex-1 bg-gray-200" />,
                            ]}
                          </div>,
                          <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isSubmitting || isGoogleSubmitting}
                            className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-70 text-sm"
                          >
                            {isGoogleSubmitting ? (
                              <jsxRuntime.Fragment>
                                {[
                                  <LoaderCircleIcon
                                    size={16}
                                    className="animate-spin"
                                  />,
                                  <span>{"Conectando..."}</span>,
                                ]}
                              </jsxRuntime.Fragment>
                            ) : (
                              <jsxRuntime.Fragment>
                                {[
                                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    {[
                                      <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                      />,
                                      <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                      />,
                                      <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                      />,
                                      <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                      />,
                                    ]}
                                  </svg>,
                                  "Google",
                                ]}
                              </jsxRuntime.Fragment>
                            )}
                          </button>,
                        ]}
                      </div>,
                    ]}
                  </form>,
                  <p className="mt-4 text-center text-sm text-gray-500">
                    {[
                      "¿No tienes cuenta?",
                      " ",
                      <a
                        href="/register"
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        {"Regístrate"}
                      </a>,
                    ]}
                  </p>,
                ]}
              </div>
            </div>,
          ]}
        </div>,
      ]}
    </div>
  );
};
export { LoginPage };
