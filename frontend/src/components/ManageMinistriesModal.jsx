// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import { Modal } from "../app/App.jsx";
import {
  f as UsersIcon,
  C as CheckIcon,
  L as LoaderCircleIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
function ManageMinistriesModal({
  isOpen: i,
  onClose: b,
  areas: s,
  activeMinistries: l,
  onSave: k,
}) {
  const [n, x] = React.useState([]),
    [a, c] = React.useState(!1);
  React.useEffect(() => {
    i && (c(!1), x(l !== void 0 ? l : s.map((r) => r.id)));
  }, [i, l, s]);
  const u = (r) => {
      x((d) => (d.includes(r) ? d.filter((t) => t !== r) : [...d, r]));
    },
    m = [
      {
        bg: "from-indigo-500 to-purple-600",
        light: "bg-indigo-50 dark:bg-indigo-900/20",
        border: "border-indigo-200 dark:border-indigo-800",
        text: "text-indigo-700 dark:text-indigo-300",
      },
      {
        bg: "from-emerald-500 to-teal-600",
        light: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-300",
      },
      {
        bg: "from-orange-500 to-red-500",
        light: "bg-orange-50 dark:bg-orange-900/20",
        border: "border-orange-200 dark:border-orange-800",
        text: "text-orange-700 dark:text-orange-300",
      },
      {
        bg: "from-pink-500 to-rose-600",
        light: "bg-pink-50 dark:bg-pink-900/20",
        border: "border-pink-200 dark:border-pink-800",
        text: "text-pink-700 dark:text-pink-300",
      },
      {
        bg: "from-cyan-500 to-blue-600",
        light: "bg-cyan-50 dark:bg-cyan-900/20",
        border: "border-cyan-200 dark:border-cyan-800",
        text: "text-cyan-700 dark:text-cyan-300",
      },
      {
        bg: "from-amber-500 to-yellow-500",
        light: "bg-amber-50 dark:bg-amber-900/20",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-300",
      },
    ];
  return (
    <Modal isOpen={i} onClose={b} title="">
      <div className="space-y-6">
        {[
          <div className="text-center">
            {[
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <UsersIcon size={32} />
              </div>,
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {"Gestionar Ministerios"}
              </h2>,
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                {"Selecciona los ministerios que participarán"}
              </p>,
            ]}
          </div>,
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-full">
              <span className="text-sm text-gray-600 dark:text-slate-300">
                {[
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {n.length}
                  </span>,
                  " ",
                  "de ",
                  s.length,
                  " seleccionados",
                ]}
              </span>
            </div>
          </div>,
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto p-1">
            {s.map((r, d) => {
              const t = m[d % m.length],
                o = n.includes(r.id);
              return jsxRuntime.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => u(r.id),
                  className: `relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${o ? `${t.light} ${t.border} shadow-md` : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"}`,
                  children: [
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0 bg-gradient-to-br ${t.bg}`}
                    >
                      <UsersIcon size={18} />
                    </div>,
                    <span
                      className={`font-semibold flex-1 text-left ${o ? t.text : "text-gray-700 dark:text-slate-300"}`}
                    >
                      {r.name}
                    </span>,
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${o ? `bg-gradient-to-br ${t.bg} text-white` : "bg-gray-200 dark:bg-slate-600"}`}
                    >
                      {o && <CheckIcon size={14} strokeWidth={3} />}
                    </div>,
                  ],
                },
                r.id,
              );
            })}
          </div>,
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
            {[
              <button
                onClick={b}
                disabled={a}
                className="px-5 py-2.5 text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {"Cancelar"}
              </button>,
              <button
                onClick={async () => {
                  if (!a) {
                    c(!0);
                    try {
                      await k(n);
                    } catch (r) {
                      (console.error(r), c(!1));
                    }
                  }
                }}
                disabled={a}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {[
                  a ? (
                    <LoaderCircleIcon size={18} className="animate-spin" />
                  ) : (
                    <CheckIcon size={18} />
                  ),
                  a ? "Guardando..." : "Guardar Cambios",
                ]}
              </button>,
            ]}
          </div>,
        ]}
      </div>
    </Modal>
  );
}
export { ManageMinistriesModal };
