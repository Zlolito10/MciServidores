// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { ct, b0, Wc } from "../vendor/face-api.js";
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
const Ss = [
  "https://justadudewhohacks.github.io/face-api.js/models",
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model",
  "https://unpkg.com/@vladmandic/face-api/model",
];
const C0 = 15e3;
function _0(r, t) {
  return new Promise((e, n) => {
    const o = window.setTimeout(() => {
      n(new Error("MODEL_LOAD_TIMEOUT"));
    }, t);
    r.then((a) => {
      (window.clearTimeout(o), e(a));
    }).catch((a) => {
      (window.clearTimeout(o), n(a));
    });
  });
}
let Zo = !1;
let Nr = null;
let Ds = !1;
const CameraModal = ({
  isOpen: r,
  onClose: t,
  onCapture: e,
  title: n = "Verificación Facial",
}) => {
  const o = React.useRef(null),
    a = React.useRef(null),
    i = React.useRef(null),
    s = React.useRef(null),
    u = React.useRef(null),
    c = React.useRef(0),
    l = React.useRef(!1),
    h = React.useRef(!0),
    [f, p] = React.useState(""),
    [d, m] = React.useState(!0),
    [v, g] = React.useState(Zo),
    [x, b] = React.useState(Ds),
    [y, w] = React.useState(!1),
    [C, S] = React.useState(!1),
    [k, R] = React.useState(null),
    [I, N] = React.useState("loading");
  React.useEffect(() => {
    if (Zo) {
      g(!0);
      return;
    }
    return (
      (async () => {
        if (Nr) {
          (await Nr, h.current && g(!0));
          return;
        }
        Nr = (async () => {
          const U = (() => {
              try {
                const K = localStorage.getItem("face_model_base_url");
                return typeof K == "string" && K ? K : null;
              } catch {
                return null;
              }
            })(),
            G = U ? [U, ...Ss.filter((K) => K !== U)] : Ss;
          let q = null;
          for (const K of G)
            try {
              (await _0(ct.tinyFaceDetector.loadFromUri(K), C0), (Zo = !0));
              try {
                localStorage.setItem("face_model_base_url", K);
              } catch {}
              return;
            } catch (te) {
              q = te;
            }
          throw q ?? new Error("MODEL_LOAD_FAILED");
        })();
        try {
          (await Nr, h.current && g(!0));
        } catch {
          h.current && ((Ds = !0), b(!0), g(!1));
        }
      })(),
      () => {
        h.current = !1;
      }
    );
  }, []);
  const A = React.useCallback(() => {
      (s.current && (clearInterval(s.current), (s.current = null)),
        u.current && (clearInterval(u.current), (u.current = null)),
        i.current &&
          (i.current.getTracks().forEach((M) => {
            M.stop();
          }),
          (i.current = null)),
        o.current && (o.current.srcObject = null),
        (l.current = !1),
        (c.current = 0));
    }, []),
    B = React.useCallback(async () => {
      if (h.current) {
        (m(!0),
          p(""),
          S(!1),
          R(null),
          w(!1),
          N("loading"),
          (c.current = 0),
          (l.current = !1));
        try {
          const M = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
            },
            audio: !1,
          });
          if (!h.current) {
            M.getTracks().forEach((G) => G.stop());
            return;
          }
          ((i.current = M), o.current && (o.current.srcObject = M));
          const U = () => {
            !h.current ||
              !o.current ||
              o.current
                .play()
                .then(() => {
                  h.current && (w(!0), m(!1), N("scanning"));
                })
                .catch((G) => {
                  String(G).includes("interrupted") ||
                    (console.error("[CameraModal] Error play:", G),
                    h.current &&
                      (p("Error al iniciar el video. Intenta de nuevo."),
                      m(!1)));
                });
          };
          (o.current && (o.current.oncanplay = U),
            setTimeout(() => {
              h.current &&
                d &&
                o.current?.srcObject &&
                o.current &&
                o.current
                  .play()
                  .then(() => {
                    (w(!0), m(!1), N("scanning"));
                  })
                  .catch(() => {});
            }, 3e3));
        } catch (M) {
          (console.error("[CameraModal] Error accessing camera:", M),
            h.current &&
              (p("No se pudo acceder a la cámara. Verifica los permisos."),
              m(!1)));
        }
      }
    }, []);
  (React.useEffect(
    () => (
      r && ((h.current = !0), B()),
      () => {
        (A(), (h.current = !1));
      }
    ),
    [r, B, A],
  ),
    React.useEffect(() => {
      r && (S(!1), R(null), p(""), N("loading"));
    }, [r]),
    React.useEffect(() => {
      if (!(!r || !v || x || !y || C || l.current))
        return (
          (s.current = window.setInterval(async () => {
            if (!(!o.current || l.current || !h.current))
              try {
                const M = await b0(
                  o.current,
                  new Wc({
                    inputSize: 224,
                    scoreThreshold: 0.5,
                  }),
                );
                if (!h.current) return;
                M.length > 0
                  ? ((c.current += 1),
                    c.current >= 3 &&
                      !l.current &&
                      ((l.current = !0),
                      s.current &&
                        (clearInterval(s.current), (s.current = null)),
                      S(!0),
                      N("detected"),
                      navigator.vibrate && navigator.vibrate(100)))
                  : (c.current = 0);
              } catch {}
          }, 250)),
          () => {
            s.current && (clearInterval(s.current), (s.current = null));
          }
        );
    }, [r, v, x, y, C]),
    React.useEffect(() => {
      if (!C || k !== null) return;
      let M = 3;
      return (
        R(M),
        (u.current = window.setInterval(() => {
          ((M -= 1),
            M <= 0
              ? (u.current && (clearInterval(u.current), (u.current = null)),
                R(0),
                N("capturing"),
                setTimeout(() => O(), 100))
              : (R(M), navigator.vibrate && navigator.vibrate(50)));
        }, 800)),
        () => {
          u.current && (clearInterval(u.current), (u.current = null));
        }
      );
    }, [C]));
  const O = React.useCallback(() => {
      if (!o.current || !a.current) {
        console.error("[CameraModal] No hay video/canvas ref");
        return;
      }
      const M = o.current,
        U = a.current;
      ((U.width = M.videoWidth || 640), (U.height = M.videoHeight || 480));
      const G = U.getContext("2d");
      if (G) {
        (G.translate(U.width, 0),
          G.scale(-1, 1),
          G.drawImage(M, 0, 0, U.width, U.height));
        const q = U.toDataURL("image/jpeg", 0.85);
        (navigator.vibrate && navigator.vibrate([100, 50, 100]),
          A(),
          e(q),
          t());
      }
    }, [A, e, t]),
    W = React.useCallback(() => {
      (A(), t());
    }, [A, t]);
  if (!r) return null;
  const V = () => {
      switch (I) {
        case "detected":
        case "capturing":
          return "from-green-500 to-emerald-500";
        case "scanning":
          return "from-blue-500 to-cyan-500";
        default:
          return "from-gray-500 to-gray-600";
      }
    },
    z = () => {
      switch (I) {
        case "loading":
          return "Iniciando cámara...";
        case "scanning":
          return x || !v ? "Listo para capturar" : "Buscando rostro...";
        case "detected":
          return "¡Rostro detectado!";
        case "capturing":
          return "Capturando...";
        default:
          return "";
      }
    };
  return (
    <Modal isOpen={r} onClose={W} title={n} maxWidth="max-w-3xl">
      <div className="space-y-4">
        {f && !f.toLowerCase().includes("detección facial") ? (
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
                        {f}
                      </p>,
                    ]}
                  </div>,
                ]}
              </div>,
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={B}
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
                    ref={o}
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
                  <canvas ref={a} className="hidden" />,
                  y && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[
                        <div
                          className={`absolute left-4 top-4 w-12 h-12 border-l-4 border-t-4 rounded-tl-2xl transition-colors ${C ? "border-emerald-400 animate-pulse" : I === "scanning" ? "border-blue-400 animate-pulse" : "border-blue-400"}`}
                        />,
                        <div
                          className={`absolute right-4 top-4 w-12 h-12 border-r-4 border-t-4 rounded-tr-2xl transition-colors ${C ? "border-emerald-400 animate-pulse" : I === "scanning" ? "border-blue-400 animate-pulse" : "border-blue-400"}`}
                        />,
                        <div
                          className={`absolute left-4 bottom-4 w-12 h-12 border-l-4 border-b-4 rounded-bl-2xl transition-colors ${C ? "border-emerald-400 animate-pulse" : I === "scanning" ? "border-blue-400 animate-pulse" : "border-blue-400"}`}
                        />,
                        <div
                          className={`absolute right-4 bottom-4 w-12 h-12 border-r-4 border-b-4 rounded-br-2xl transition-colors ${C ? "border-emerald-400 animate-pulse" : I === "scanning" ? "border-blue-400 animate-pulse" : "border-blue-400"}`}
                        />,
                        I === "scanning" && !C && (
                          <div className="absolute inset-x-4 top-4 bottom-4 overflow-hidden">
                            <div className="camera-scan-line absolute left-0 right-0 h-1 rounded-full bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-80" />
                          </div>
                        ),
                        C && (
                          <div className="absolute inset-0 rounded-2xl ring-4 ring-emerald-400/25 camera-detected-glow" />
                        ),
                      ]}
                    </div>
                  ),
                  d && (
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
                  C && k !== null && k > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-6 py-4 rounded-2xl bg-black/40 text-white text-6xl font-bold">
                        {k}
                      </div>
                    </div>
                  ),
                  I === "capturing" && (
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
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${V()} text-white`}
                  >
                    {[
                      I === "scanning" && (
                        <ScanIcon size={18} className="text-white" />
                      ),
                      I === "detected" && <CircleCheckIcon size={18} />,
                      I === "loading" && (
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ),
                      I === "capturing" && (
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ),
                      <span className="font-semibold text-sm">{z()}</span>,
                    ]}
                  </div>,
                  <div className="flex items-center gap-2">
                    {[
                      (x || !v) && y && !d && I !== "capturing" && (
                        <button
                          onClick={O}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                        >
                          {[<CircleCheckIcon size={16} />, "Tomar foto"]}
                        </button>
                      ),
                      <button
                        onClick={B}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white text-sm font-medium"
                      >
                        {[<RefreshCwIcon size={16} />, "Reiniciar"]}
                      </button>,
                    ]}
                  </div>,
                ]}
              </div>,
              I === "scanning" && !(x || !v) && (
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {"Coloca tu rostro frente a la cámara."}
                </p>
              ),
              (x || !v) && (
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
