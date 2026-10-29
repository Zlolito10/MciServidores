// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import {
  x as ChevronDownIcon,
  C as CheckIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
const SelectPicker = ({
  value: t,
  onChange: x,
  options: l,
  label: c,
  placeholder: m = "Seleccionar...",
}) => {
  const [s, a] = React.useState(!1),
    i = React.useRef(null);
  React.useEffect(() => {
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
  return (
    <div className="relative" ref={i}>
      {[
        c && (
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {c}
          </label>
        ),
        <div
          onClick={() => a(!s)}
          className={`relative flex items-center justify-between w-full rounded-xl border px-4 py-2 cursor-pointer transition-all ${s || (t && t !== "all") ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300"}`}
        >
          {[
            <span
              className={`text-sm font-medium flex items-center gap-2 ${t && t !== "all" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-slate-300"}`}
            >
              {[n?.icon, g]}
            </span>,
            <ChevronDownIcon
              size={14}
              className={`transition-transform ${s || (t && t !== "all") ? "text-indigo-500" : "text-gray-400"} ${s ? "rotate-180" : ""}`}
            />,
          ]}
        </div>,
        s && (
          <div className="absolute z-[40] mt-2 min-w-[180px] w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-indigo-500/10 border border-gray-100 dark:border-slate-700 py-1.5 animate-in fade-in zoom-in-95 duration-200">
            {l.map((e) =>
              jsxRuntime.jsxs(
                "button",
                {
                  type: "button",
                  onClick: (o) => {
                    (o.stopPropagation(), x(e.value), a(!1));
                  },
                  className: `w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors ${t === e.value ? "bg-indigo-50/80 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"}`,
                  children: [
                    <span className="flex items-center gap-2">
                      {[e.icon, e.label]}
                    </span>,
                    t === e.value && (
                      <CheckIcon
                        size={16}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    ),
                  ],
                },
                e.value,
              ),
            )}
          </div>
        ),
      ]}
    </div>
  );
};
export { SelectPicker };
