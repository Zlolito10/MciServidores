import { j as e } from "./index-BU_ZgoWo.js";
const c = () =>
    e.jsx("span", {
      className:
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
      "aria-hidden": "true",
    }),
  d = ({
    loading: s = !1,
    disabled: t,
    children: a,
    spinnerPosition: n = "left",
    spinner: l,
    ...i
  }) => {
    const u = t || s,
      r = l ?? e.jsx(c, {});
    return e.jsx("button", {
      ...i,
      disabled: u,
      "aria-busy": s ? "true" : "false",
      children: e.jsxs("span", {
        className: "inline-flex items-center justify-center gap-2",
        children: [
          s && n === "left" ? r : null,
          e.jsx("span", { children: a }),
          s && n === "right" ? r : null,
        ],
      }),
    });
  };
export { d as L };
