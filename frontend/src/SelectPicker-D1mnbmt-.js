import { j as r } from "./index-BU_ZgoWo.js";
import { r as d } from "./vendor-react-BwINE3B3.js";
import { x as f, C as b } from "./vendor-ui-CnvYSvQL.js";
const h = ({
  value: t,
  onChange: x,
  options: l,
  label: c,
  placeholder: m = "Seleccionar...",
}) => {
  const [s, a] = d.useState(!1),
    i = d.useRef(null);
  d.useEffect(() => {
    const e = (o) => {
      i.current && !i.current.contains(o.target) && a(!1);
    };
    return (
      document.addEventListener("mousedown", e),
      () => document.removeEventListener("mousedown", e)
    );
  }, []);
  const n = l.find((e) => e.value === t),
    g = n ? n.label : m;
  return r.jsxs("div", {
    className: "relative",
    ref: i,
    children: [
      c &&
        r.jsx("label", {
          className:
            "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
          children: c,
        }),
      r.jsxs("div", {
        onClick: () => a(!s),
        className: `relative flex items-center justify-between w-full rounded-xl border px-4 py-2 cursor-pointer transition-all ${s || (t && t !== "all") ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300"}`,
        children: [
          r.jsxs("span", {
            className: `text-sm font-medium flex items-center gap-2 ${t && t !== "all" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-slate-300"}`,
            children: [n?.icon, g],
          }),
          r.jsx(f, {
            size: 14,
            className: `transition-transform ${s || (t && t !== "all") ? "text-indigo-500" : "text-gray-400"} ${s ? "rotate-180" : ""}`,
          }),
        ],
      }),
      s &&
        r.jsx("div", {
          className:
            "absolute z-[40] mt-2 min-w-[180px] w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-indigo-500/10 border border-gray-100 dark:border-slate-700 py-1.5 animate-in fade-in zoom-in-95 duration-200",
          children: l.map((e) =>
            r.jsxs(
              "button",
              {
                type: "button",
                onClick: (o) => {
                  (o.stopPropagation(), x(e.value), a(!1));
                },
                className: `w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors ${t === e.value ? "bg-indigo-50/80 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"}`,
                children: [
                  r.jsxs("span", {
                    className: "flex items-center gap-2",
                    children: [e.icon, e.label],
                  }),
                  t === e.value &&
                    r.jsx(b, {
                      size: 16,
                      className: "text-indigo-600 dark:text-indigo-400",
                    }),
                ],
              },
              e.value,
            ),
          ),
        }),
    ],
  });
};
export { h as S };
