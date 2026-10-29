// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
const LoadingSpinner = ({ text: r = "Cargando..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    {[
      <div className="relative">
        {[
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30" />,
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />,
        ]}
      </div>,
      <p className="text-gray-600 dark:text-slate-400 font-medium">{r}</p>,
    ]}
  </div>
);
export { LoadingSpinner };
