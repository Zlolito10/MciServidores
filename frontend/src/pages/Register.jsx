// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { loadModule as S } from "../services/module-loader.js";
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  r as React,
  u as useNavigate,
  L as Link,
} from "../vendor/vendor-react-BwINE3B3.js";
import { A as ne, B as oe } from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  L as LoaderCircleIcon,
  U as UserIcon,
  a as LockIcon,
  E as EyeOffIcon,
  b as EyeIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { authReady, firebaseAuth, firestoreDb } from "../firebase/client.js";
const RegisterPage = () => {
  const logoPath = "/mci-logo-pagina.png",
    [logoFailed, setLogoFailed] = React.useState(!1),
    versionedLogoSrc = (() => {
      try {
        const A = localStorage.getItem("pwa_app_version");
        if (!A) return logoPath;
        const N = logoPath.includes("?") ? "&" : "?";
        return `${logoPath}${N}v=${encodeURIComponent(A)}`;
      } catch {
        return logoPath;
      }
    })(),
    [fullName, setFullName] = React.useState(""),
    [username, setUsername] = React.useState(""),
    [password, setPassword] = React.useState(""),
    [showPassword, setShowPassword] = React.useState(!1),
    [error, setError] = React.useState(""),
    [isSubmitting, setSubmitting] = React.useState(!1),
    navigate = useNavigate(),
    { user: user } = useAuth();
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
      user && navigate("/dashboard");
    }, [user, navigate]));
  const handleRegister = async (A) => {
    (A.preventDefault(), setError(""), setSubmitting(!0));
    try {
      await authReady;
      let N = "user";
      const I = username.trim().toLowerCase();
      if (!I || I.includes(" ")) {
        setError(
          "Usuario inválido. Usa un usuario sin espacios (ej: nombre.apellido). ",
        );
        return;
      }
      const i = `${I}@church.app`,
        { createUserWithEmailAndPassword: m } = await S(async () => {
          const { createUserWithEmailAndPassword: d } =
            await import("../vendor/vendor-firebase-BjYbfC3F.js").then(
              (w) => w.a9,
            );
          return {
            createUserWithEmailAndPassword: d,
          };
        }, []),
        g = await m(firebaseAuth, i, password);
      (await oe(ne(firestoreDb, "users", g.user.uid), {
        uid: g.user.uid,
        name: fullName,
        email: i,
        username: I,
        role: N,
        createdAt: new Date(),
      }),
        navigate("/dashboard"));
    } catch (N) {
      (console.error(N),
        N.code === "auth/email-already-in-use"
          ? setError("Este usuario ya está registrado.")
          : N.code === "auth/weak-password"
            ? setError("La contraseña debe tener al menos 6 caracteres.")
            : N.code === "auth/invalid-email"
              ? setError(
                  "Usuario inválido. Verifica el formato (ej: nombre.apellido).",
                )
              : N.code === "auth/too-many-requests"
                ? setError("Demasiados intentos. Intenta más tarde.")
                : setError("Error al registrarse. Intenta nuevamente."));
    } finally {
      setSubmitting(!1);
    }
  };
  return isSubmitting ? (
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
            {"Creando tu cuenta..."}
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
                <h2 className="text-3xl font-light mb-6">{"Únete a"}</h2>,
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
                  {"Regístrate para comenzar a servir y gestionar eventos."}
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
                <h1 className="text-lg font-bold">{"Crear Cuenta"}</h1>,
              ]}
            </div>,
            <div className="flex-1 flex items-center justify-center px-6 -mt-6 lg:mt-0 overflow-hidden">
              <div className="w-full max-w-sm bg-white rounded-3xl lg:rounded-none p-5 lg:p-0 shadow-2xl lg:shadow-none">
                {[
                  <div className="text-center mb-3">
                    {[
                      <h2 className="text-lg font-bold text-gray-800">
                        {"Regístrate"}
                      </h2>,
                      <p className="text-gray-500 text-sm">
                        {"Completa tus datos para crear una cuenta"}
                      </p>,
                    ]}
                  </div>,
                  <form onSubmit={handleRegister} className="space-y-3">
                    {[
                      <div className="space-y-3">
                        {[
                          <div>
                            {[
                              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
                                {"Nombre Completo"}
                              </label>,
                              <div className="relative">
                                {[
                                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon size={18} />
                                  </div>,
                                  <input
                                    type="text"
                                    value={fullName}
                                    onChange={(A) =>
                                      setFullName(A.target.value)
                                    }
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 pl-7 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-colors text-base"
                                    placeholder="Juan Pérez"
                                    required={!0}
                                  />,
                                ]}
                              </div>,
                            ]}
                          </div>,
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
                                    onChange={(A) =>
                                      setUsername(A.target.value)
                                    }
                                    className="block w-full border-b-2 border-gray-200 bg-transparent py-2 pl-7 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-colors text-base"
                                    placeholder="juan.perez"
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
                                    onChange={(A) =>
                                      setPassword(A.target.value)
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
                      error && (
                        <div className="rounded-lg bg-red-50 p-2 text-sm text-red-600 border border-red-100 flex items-center gap-2">
                          {[
                            <span className="block w-1.5 h-1.5 rounded-full bg-red-600" />,
                            error,
                          ]}
                        </div>
                      ),
                      <div className="space-y-2 pt-1">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-white font-semibold shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                        >
                          {isSubmitting ? (
                            <jsxRuntime.Fragment>
                              {[
                                <LoaderCircleIcon
                                  size={16}
                                  className="animate-spin"
                                />,
                                <span>{"Creando..."}</span>,
                              ]}
                            </jsxRuntime.Fragment>
                          ) : (
                            "Crear Cuenta"
                          )}
                        </button>
                      </div>,
                    ]}
                  </form>,
                  <p className="mt-4 text-center text-sm text-gray-500">
                    {[
                      "¿Ya tienes cuenta?",
                      " ",
                      <Link
                        to="/login"
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        {"Inicia Sesión"}
                      </Link>,
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
export { RegisterPage };
