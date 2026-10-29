// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { useCamera } from "../hooks/useCamera.js";
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import { Modal } from "../app/App.jsx";
import {
  o as CircleAlertIcon,
  ae as RefreshCwIcon,
  l as CircleCheckIcon,
  as as ScanIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import "../vendor/vendor-pdf-Cf03QSry.js";
import "../vendor/vendor-firebase-BjYbfC3F.js";
const CameraModal = ({
  isOpen: isOpen,
  onClose: onClose,
  onCapture: onCapture,
  title = "Verificación Facial",
}) => {
  const {
    videoRef,
    canvasRef,
    error,
    isStarting,
    modelsReady,
    manualMode,
    videoReady,
    faceDetected,
    countdown,
    phase,
    startCamera,
    capturePhoto,
    closeCamera,
  } = useCamera({
    isOpen,
    onClose,
    onCapture,
  });
  if (!isOpen) return null;
  const statusGradient = () => {
      switch (phase) {
        case "detected":
        case "capturing":
          return "from-green-500 to-emerald-500";
        case "scanning":
          return "from-blue-500 to-cyan-500";
        default:
          return "from-gray-500 to-gray-600";
      }
    },
    statusLabel = () => {
      switch (phase) {
        case "loading":
          return "Iniciando cámara...";
        case "scanning":
          return manualMode || !modelsReady
            ? "Listo para capturar"
            : "Buscando rostro...";
        case "detected":
          return "¡Rostro detectado!";
        case "capturing":
          return "Capturando...";
        default:
          return "";
      }
    };
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeCamera}
      title={title}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {error && !error.toLowerCase().includes("detección facial") ? (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 p-4">
            {[
              <div className="flex items-start gap-3">
                {[
                  <div className="mt-0.5">
                    <CircleAlertIcon size={22} className="text-red-500" />
                  </div>,
                  <div className="flex-1">
                    {[
                      <p className="font-semibold text-red-700 dark:text-red-200">
                        {"Error de cámara"}
                      </p>,
                      <p className="text-sm text-red-700/80 dark:text-red-200/80">
                        {error}
                      </p>,
                    ]}
                  </div>,
                ]}
              </div>,
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white font-medium"
                >
                  {[<RefreshCwIcon size={16} />, "Reintentar"]}
                </button>
              </div>,
            ]}
          </div>
        ) : (
          <div className="space-y-3">
            {[
              <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 aspect-[4/3] sm:aspect-video">
                {[
                  <video
                    ref={videoRef}
                    autoPlay={!0}
                    playsInline={!0}
                    muted={!0}
                    disablePictureInPicture={!0}
                    className="absolute inset-0 w-full h-full object-contain object-center"
                    style={{
                      transform: "scaleX(-1)",
                      objectPosition: "center",
                    }}
                  />,
                  <canvas ref={canvasRef} className="hidden" />,
                  videoReady && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        <div
                          className={`absolute left-4 top-4 w-12 h-12 border-l-4 border-t-4 rounded-tl-2xl transition-colors ${faceDetected ? "border-emerald-400 animate-pulse" : phase === "scanning" ? "border-blue-400 animate-pulse" : "border-blue-400"}`}
                        />,
                        <div
                          className={`absolute right-4 top-4 w-12 h-12 border-r-4 border-t-4 rounded-tr-2xl transition-colors ${faceDetected ? "border-emerald-400 animate-pulse" : phase === "scanning" ? "border-blue-400 animate-pulse" : "border-blue-400"}`}
                        />,
                        <div
                          className={`absolute left-4 bottom-4 w-12 h-12 border-l-4 border-b-4 rounded-bl-2xl transition-colors ${faceDetected ? "border-emerald-400 animate-pulse" : phase === "scanning" ? "border-blue-400 animate-pulse" : "border-blue-400"}`}
                        />,
                        <div
                          className={`absolute right-4 bottom-4 w-12 h-12 border-r-4 border-b-4 rounded-br-2xl transition-colors ${faceDetected ? "border-emerald-400 animate-pulse" : phase === "scanning" ? "border-blue-400 animate-pulse" : "border-blue-400"}`}
                        />,
                        phase === "scanning" && !faceDetected && (
                          <div className="absolute inset-x-4 top-4 bottom-4 overflow-hidden">
                            <div className="camera-scan-line absolute left-0 right-0 h-1 rounded-full bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-80" />
                          </div>
                        ),
                        faceDetected && (
                          <div className="absolute inset-0 rounded-2xl ring-4 ring-emerald-400/25 camera-detected-glow" />
                        ),
                      ]}
                    </div>
                  ),
                  isStarting && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white">
                        {[
                          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />,
                          <span className="text-sm font-medium">
                            {"Iniciando cámara..."}
                          </span>,
                        ]}
                      </div>
                    </div>
                  ),
                  faceDetected && countdown !== null && countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-6 py-4 rounded-2xl bg-black/40 text-white text-6xl font-bold">
                        {countdown}
                      </div>
                    </div>
                  ),
                  phase === "capturing" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/40 text-white font-semibold">
                        {[<CircleCheckIcon size={18} />, "Capturando..."]}
                      </div>
                    </div>
                  ),
                ]}
              </div>,
              <style>{`
              @keyframes cameraScan {
                0% { transform: translateY(-10%); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(110%); opacity: 0; }
              }
              .camera-scan-line {
                animation: cameraScan 1.8s ease-in-out infinite;
              }

              @keyframes detectedGlow {
                0% { box-shadow: 0 0 0 rgba(16, 185, 129, 0.0); }
                50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.18); }
                100% { box-shadow: 0 0 0 rgba(16, 185, 129, 0.0); }
              }
              .camera-detected-glow {
                animation: detectedGlow 1.4s ease-in-out infinite;
              }
            `}</style>,
              <div className="flex items-center justify-between gap-3">
                {[
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${statusGradient()} text-white`}
                  >
                    {[
                      phase === "scanning" && (
                        <ScanIcon size={18} className="text-white" />
                      ),
                      phase === "detected" && <CircleCheckIcon size={18} />,
                      phase === "loading" && (
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ),
                      phase === "capturing" && (
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ),
                      <span className="font-semibold text-sm">
                        {statusLabel()}
                      </span>,
                    ]}
                  </div>,
                  <div className="flex items-center gap-2">
                    {[
                      (manualMode || !modelsReady) &&
                        videoReady &&
                        !isStarting &&
                        phase !== "capturing" && (
                          <button
                            onClick={capturePhoto}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                          >
                            {[<CircleCheckIcon size={16} />, "Tomar foto"]}
                          </button>
                        ),
                      <button
                        onClick={startCamera}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white text-sm font-medium"
                      >
                        {[<RefreshCwIcon size={16} />, "Reiniciar"]}
                      </button>,
                    ]}
                  </div>,
                ]}
              </div>,
              phase === "scanning" && !(manualMode || !modelsReady) && (
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {"Coloca tu rostro frente a la cámara."}
                </p>
              ),
              (manualMode || !modelsReady) && (
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {"Modo manual: presiona “Tomar foto”."}
                </p>
              ),
            ]}
          </div>
        )}
      </div>
    </Modal>
  );
};
export { CameraModal };
