import { j as e } from "./index-BU_ZgoWo.js";
const a = ({ text: r = "Cargando..." }) =>
  e.jsxs("div", {
    className: "flex flex-col items-center justify-center min-h-[400px] gap-4",
    children: [
      e.jsxs("div", {
        className: "relative",
        children: [
          e.jsx("div", {
            className:
              "w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30",
          }),
          e.jsx("div", {
            className:
              "absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin",
          }),
        ],
      }),
      e.jsx("p", {
        className: "text-gray-600 dark:text-slate-400 font-medium",
        children: r,
      }),
    ],
  });
export { a as P };
