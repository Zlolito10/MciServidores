// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { r as React, d as useParams } from "../vendor/vendor-react-BwINE3B3.js";
import { X as XIcon } from "../vendor/vendor-ui-CnvYSvQL.js";
const Modal = React.memo(
  ({
    isOpen: t,
    onClose: s,
    title: r,
    children: n,
    maxWidth: a = "max-w-md",
  }) => (
    React.useEffect(
      () => (
        t
          ? (document.body.style.overflow = "hidden")
          : (document.body.style.overflow = "unset"),
        () => {
          document.body.style.overflow = "unset";
        }
      ),
      [t],
    ),
    React.useEffect(() => {
      const l = (c) => {
        c.key === "Escape" && t && s();
      };
      return (
        t && document.addEventListener("keydown", l),
        () => {
          document.removeEventListener("keydown", l);
        }
      );
    }, [t, s]),
    t
      ? useParams.createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
            {[
              <div className="absolute inset-0" onClick={s} />,
              <div
                className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl w-full ${a} p-4 sm:p-6 shadow-2xl transition-colors relative z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150`}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {[
                  r && (
                    <div className="flex justify-between items-center mb-6">
                      {[
                        r && (
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {r}
                          </div>
                        ),
                        <button
                          onClick={s}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-auto"
                        >
                          <XIcon size={24} />
                        </button>,
                      ]}
                    </div>
                  ),
                  n,
                ]}
              </div>,
            ]}
          </div>,
          document.body,
        )
      : null
  ),
);
export { Modal };
