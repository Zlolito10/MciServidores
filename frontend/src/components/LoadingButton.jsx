// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
const RenderComponent1 = () => (
  <span
    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    aria-hidden="true"
  />
);
const LoadingButton = ({
  loading: s = !1,
  disabled: t,
  children: a,
  spinnerPosition: n = "left",
  spinner: l,
  ...i
}) => {
  const u = t || s,
    r = l ?? <RenderComponent1 />;
  return (
    <button {...i} disabled={u} aria-busy={s ? "true" : "false"}>
      <span className="inline-flex items-center justify-center gap-2">
        {[
          s && n === "left" ? r : null,
          <span>{a}</span>,
          s && n === "right" ? r : null,
        ]}
      </span>
    </button>
  );
};
export { LoadingButton };
