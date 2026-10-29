// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import {
  l as CircleCheckIcon,
  T as TriangleAlertIcon,
  m as CircleDotIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import { Modal } from "../components/Modal.jsx";
const AppDialogContext = React.createContext(null);
function AppDialogProvider({ children: t }) {
  const [s, r] = React.useState({
      isOpen: !1,
      type: "info",
      title: "",
      message: "",
    }),
    [n, a] = React.useState({
      isOpen: !1,
      title: "",
      message: "",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      confirmColor: "indigo",
    }),
    l = React.useRef(null),
    c = React.useCallback(({ type: _, title: k, message: y }) => {
      r({
        isOpen: !0,
        type: _,
        title: k,
        message: y,
      });
    }, []),
    f = React.useCallback(
      (_, k = "Error") => {
        c({
          type: "error",
          title: k,
          message: _,
        });
      },
      [c],
    ),
    h = React.useCallback(
      (_, k = "Información") => {
        c({
          type: "info",
          title: k,
          message: _,
        });
      },
      [c],
    ),
    b = React.useCallback(
      (_, k = "Listo") => {
        c({
          type: "success",
          title: k,
          message: _,
        });
      },
      [c],
    ),
    p = React.useCallback(
      ({
        title: _,
        message: k,
        confirmText: y,
        cancelText: L,
        confirmColor: T,
      }) => (
        a({
          isOpen: !0,
          title: _,
          message: k,
          confirmText: y ?? "Confirmar",
          cancelText: L ?? "Cancelar",
          confirmColor: T ?? "indigo",
        }),
        new Promise((A) => {
          l.current = A;
        })
      ),
      [],
    ),
    u = React.useMemo(
      () => ({
        showMessage: c,
        showError: f,
        showInfo: h,
        showSuccess: b,
        confirm: p,
      }),
      [c, f, h, b, p],
    ),
    E = () => {
      r((_) => ({
        ..._,
        isOpen: !1,
      }));
    },
    v = (_) => {
      a((y) => ({
        ...y,
        isOpen: !1,
      }));
      const k = l.current;
      ((l.current = null), k && k(_));
    };
  return (
    <AppDialogContext.Provider value={u}>
      {[
        t,
        <Modal isOpen={s.isOpen} onClose={E} title="" maxWidth="max-w-md">
          <div className="text-center py-4">
            {[
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${s.type === "success" ? "bg-green-100 dark:bg-green-900/30" : s.type === "error" ? "bg-red-100 dark:bg-red-900/30" : "bg-indigo-100 dark:bg-indigo-900/30"}`}
              >
                {s.type === "success" ? (
                  <CircleCheckIcon size={32} className="text-green-600" />
                ) : s.type === "error" ? (
                  <TriangleAlertIcon size={32} className="text-red-500" />
                ) : (
                  <CircleDotIcon size={32} className="text-indigo-600" />
                )}
              </div>,
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {s.title}
              </h3>,
              <p className="text-gray-600 dark:text-slate-300 mb-6 whitespace-pre-line">
                {s.message}
              </p>,
              <button
                onClick={E}
                className={`px-6 py-2 rounded-lg font-medium transition-colors text-white ${s.type === "success" ? "bg-green-600 hover:bg-green-700" : s.type === "error" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                {"Aceptar"}
              </button>,
            ]}
          </div>
        </Modal>,
        <Modal
          isOpen={n.isOpen}
          onClose={() => v(!1)}
          title={n.title}
          maxWidth="max-w-sm"
        >
          <div className="space-y-6">
            {[
              <p className="text-gray-600 dark:text-slate-300 text-center whitespace-pre-line">
                {n.message}
              </p>,
              <div className="flex justify-center gap-3">
                {[
                  <button
                    type="button"
                    onClick={() => v(!1)}
                    className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors"
                  >
                    {n.cancelText}
                  </button>,
                  <button
                    type="button"
                    onClick={() => v(!0)}
                    className={`px-5 py-2.5 rounded-lg text-white font-medium transition-colors ${n.confirmColor === "green" ? "bg-green-600 hover:bg-green-700" : n.confirmColor === "red" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  >
                    {n.confirmText}
                  </button>,
                ]}
              </div>,
            ]}
          </div>
        </Modal>,
      ]}
    </AppDialogContext.Provider>
  );
}
function useAppDialog() {
  const t = React.useContext(AppDialogContext);
  if (!t) throw new Error("useAppDialog must be used within AppDialogProvider");
  return t;
}
export { AppDialogContext, AppDialogProvider, useAppDialog };
