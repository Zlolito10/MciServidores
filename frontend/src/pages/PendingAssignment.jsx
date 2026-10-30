// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  u as useNavigate,
  r as React,
} from "../vendor/vendor-react-BwINE3B3.js";
import {
  useAuth,
  OptimizedImage,
  getAvatarUrl,
  firestoreDb,
} from "../app/App.jsx";
import { N as w, E as y, D as N } from "../vendor/vendor-firebase-BjYbfC3F.js";
import { LoadingButton } from "../components/LoadingButton.jsx";
import { useOptimizedChat } from "../hooks/useOptimizedChat.js";
import {
  ap as MessageSquareIcon,
  A as ArrowRightIcon,
  k as LogOutIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
const PendingAssignment = () => {
  const { user: r, userProfile: a, logout: m } = useAuth(),
    d = useNavigate(),
    { messages: l } = useOptimizedChat(r?.uid || null),
    [n, o] = React.useState(""),
    [g, c] = React.useState(!1),
    x = React.useRef(null);
  (React.useEffect(() => {
    const s = a?.role === "admin" || a?.role === "master_admin",
      t =
        (a?.assignedMinistries && a.assignedMinistries.length > 0) ||
        (a?.areas && a.areas.length > 0);
    (s || t) && d("/dashboard");
  }, [a, d]),
    React.useEffect(() => {
      setTimeout(
        () =>
          x.current?.scrollIntoView({
            behavior: "smooth",
          }),
        100,
      );
    }, [l]));
  const u = async (s) => {
      if ((s.preventDefault(), !(!n.trim() || !r))) {
        c(!0);
        try {
          (await w(y(firestoreDb, "private_chats", r.uid, "messages"), {
            text: n.trim(),
            senderId: r.uid,
            senderName: a?.name || r.displayName || "Usuario",
            createdAt: N(),
            isAdmin: !1,
          }),
            o(""));
        } catch (t) {
          console.error("Error sending message:", t);
        } finally {
          c(!1);
        }
      }
    },
    h = async () => {
      (await m(), d("/login"));
    };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[85vh] border border-gray-100 dark:border-slate-700">
        {[
          <div className="p-6 bg-indigo-600 text-white text-center relative overflow-hidden">
            {[
              <div className="relative z-10">
                {[
                  <h1 className="text-2xl font-bold mb-1">{"Bienvenido"}</h1>,
                  <p className="text-indigo-100 text-sm mb-4 opacity-90">
                    {"Estamos validando tu cuenta."}
                  </p>,
                ]}
              </div>,
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 -translate-y-10" />,
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 translate-y-8" />,
            ]}
          </div>,
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-900/50 space-y-3">
            {[
              l.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-slate-500 gap-3">
                  {[
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                      <MessageSquareIcon className="w-6 h-6 opacity-50" />
                    </div>,
                    <p className="text-sm">
                      {"Envía un mensaje para comenzar..."}
                    </p>,
                  ]}
                </div>
              ) : (
                l.map((s) => {
                  const t = s.senderId === r?.uid;
                  return jsxRuntime.jsx(
                    "div",
                    {
                      className: `flex w-full ${t ? "justify-end" : "justify-start"}`,
                      children: (
                        <div
                          className={`flex max-w-[85%] ${t ? "flex-row-reverse" : "flex-row"} items-end gap-2`}
                        >
                          {[
                            !t &&
                              (s.senderPhotoURL ? (
                                <OptimizedImage
                                  src={getAvatarUrl(s.senderPhotoURL) || ""}
                                  alt="Admin"
                                  className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex-shrink-0 object-cover"
                                  fallbackIcon={
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                      {"AD"}
                                    </span>
                                  }
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex-shrink-0 flex items-center justify-center">
                                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                    {"AD"}
                                  </span>
                                </div>
                              )),
                            <div
                              className={`px-4 py-2.5 text-sm shadow-sm break-words relative group ${t ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm" : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-sm"}`}
                            >
                              {[
                                !t && (
                                  <p className="text-[10px] font-bold text-indigo-500 mb-0.5">
                                    {"Administrador"}
                                  </p>
                                ),
                                <p className="leading-relaxed">{s.text}</p>,
                                <p
                                  className={`text-[9px] mt-1 text-right opacity-70 ${t ? "text-indigo-100" : "text-gray-400"}`}
                                >
                                  {s.createdAt?.toDate
                                    ? s.createdAt
                                        .toDate()
                                        .toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                    : ""}
                                </p>,
                              ]}
                            </div>,
                          ]}
                        </div>
                      ),
                    },
                    s.id,
                  );
                })
              ),
              <div ref={x} />,
            ]}
          </div>,
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
            {[
              <form onSubmit={u} className="flex items-end gap-2">
                {[
                  <div className="flex-1 bg-gray-100 dark:bg-slate-900 rounded-2xl px-4 py-2">
                    <input
                      type="text"
                      value={n}
                      onChange={(s) => o(s.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="w-full bg-transparent focus:outline-none text-sm dark:text-white"
                    />
                  </div>,
                  <LoadingButton
                    type="submit"
                    loading={g}
                    disabled={!n.trim()}
                    className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-colors disabled:opacity-50 disabled:shadow-none"
                  >
                    <ArrowRightIcon className="w-5 h-5 ml-0.5" />
                  </LoadingButton>,
                ]}
              </form>,
              <div className="flex justify-center mt-3 mb-1">
                <button
                  onClick={h}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  {[<LogOutIcon className="w-3 h-3" />, "Cerrar sesión"]}
                </button>
              </div>,
            ]}
          </div>,
        ]}
      </div>
    </div>
  );
};
export { PendingAssignment };
