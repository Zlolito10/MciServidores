import { j as e } from "./index-BU_ZgoWo.js";
import { r as g } from "./vendor-react-BwINE3B3.js";
import { M as p } from "./App-BPrQ3EPG.js";
import { f as h, C as f, L as y } from "./vendor-ui-CnvYSvQL.js";
function C({
  isOpen: i,
  onClose: b,
  areas: s,
  activeMinistries: l,
  onSave: k,
}) {
  const [n, x] = g.useState([]),
    [a, c] = g.useState(!1);
  g.useEffect(() => {
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
  return e.jsx(p, {
    isOpen: i,
    onClose: b,
    title: "",
    children: e.jsxs("div", {
      className: "space-y-6",
      children: [
        e.jsxs("div", {
          className: "text-center",
          children: [
            e.jsx("div", {
              className:
                "w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg",
              children: e.jsx(h, { size: 32 }),
            }),
            e.jsx("h2", {
              className: "text-xl font-bold text-gray-900 dark:text-white",
              children: "Gestionar Ministerios",
            }),
            e.jsx("p", {
              className: "text-sm text-gray-500 dark:text-slate-400 mt-1",
              children: "Selecciona los ministerios que participarán",
            }),
          ],
        }),
        e.jsx("div", {
          className: "flex justify-center",
          children: e.jsx("div", {
            className:
              "inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-full",
            children: e.jsxs("span", {
              className: "text-sm text-gray-600 dark:text-slate-300",
              children: [
                e.jsx("span", {
                  className: "font-bold text-indigo-600 dark:text-indigo-400",
                  children: n.length,
                }),
                " ",
                "de ",
                s.length,
                " seleccionados",
              ],
            }),
          }),
        }),
        e.jsx("div", {
          className:
            "grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto p-1",
          children: s.map((r, d) => {
            const t = m[d % m.length],
              o = n.includes(r.id);
            return e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(r.id),
                className: `relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${o ? `${t.light} ${t.border} shadow-md` : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"}`,
                children: [
                  e.jsx("div", {
                    className: `w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0 bg-gradient-to-br ${t.bg}`,
                    children: e.jsx(h, { size: 18 }),
                  }),
                  e.jsx("span", {
                    className: `font-semibold flex-1 text-left ${o ? t.text : "text-gray-700 dark:text-slate-300"}`,
                    children: r.name,
                  }),
                  e.jsx("div", {
                    className: `w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${o ? `bg-gradient-to-br ${t.bg} text-white` : "bg-gray-200 dark:bg-slate-600"}`,
                    children: o && e.jsx(f, { size: 14, strokeWidth: 3 }),
                  }),
                ],
              },
              r.id,
            );
          }),
        }),
        e.jsxs("div", {
          className:
            "flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700",
          children: [
            e.jsx("button", {
              onClick: b,
              disabled: a,
              className:
                "px-5 py-2.5 text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              children: "Cancelar",
            }),
            e.jsxs("button", {
              onClick: async () => {
                if (!a) {
                  c(!0);
                  try {
                    await k(n);
                  } catch (r) {
                    (console.error(r), c(!1));
                  }
                }
              },
              disabled: a,
              className:
                "px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none",
              children: [
                a
                  ? e.jsx(y, { size: 18, className: "animate-spin" })
                  : e.jsx(f, { size: 18 }),
                a ? "Guardando..." : "Guardar Cambios",
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
export { C as M };
