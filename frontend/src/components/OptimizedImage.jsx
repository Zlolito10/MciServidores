// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import { resolveCachedImageUrl } from "../utils/images.js";
const OptimizedImage = ({
  src: t,
  fullSrc: s,
  alt: r,
  className: n = "",
  placeholderClassName: a = "",
  fallbackIcon: l,
  loading: c = "lazy",
  eager: f = !1,
  fetchPriority: h,
  imgClassName: b = "object-cover",
  onImageLoad: p,
}) => {
  const [u, E] = React.useState(t),
    [v, _] = React.useState(s),
    [k, y] = React.useState(!1),
    [L, T] = React.useState(!1),
    [A, N] = React.useState(!1),
    [I, i] = React.useState(!1),
    [m, g] = React.useState(f),
    d = React.useRef(null),
    w = React.useRef(null),
    j = React.useRef(null),
    R =
      typeof window < "u" &&
      ((typeof window.matchMedia == "function" &&
        window.matchMedia("(display-mode: standalone)").matches) ||
        (typeof navigator < "u" && navigator.standalone === !0));
  (React.useEffect(() => {
    let x = !1;
    return (
      y(!1),
      T(!1),
      N(!1),
      i(!1),
      (async () => {
        if (!t) {
          x || (E(""), N(!0), y(!0));
          return;
        }
        const z = await resolveCachedImageUrl(t),
          $ = s ? await resolveCachedImageUrl(s) : void 0;
        x || (E(z), _($));
      })(),
      () => {
        x = !0;
      }
    );
  }, [t, s]),
    React.useEffect(() => {
      if (f || R || typeof IntersectionObserver > "u") {
        g(!0);
        return;
      }
      const x = new IntersectionObserver(
        ([P]) => {
          P.isIntersecting && (g(!0), x.disconnect());
        },
        {
          rootMargin: "100px",
          threshold: 0.1,
        },
      );
      return (d.current && x.observe(d.current), () => x.disconnect());
    }, []),
    React.useEffect(() => {
      (y(!1), T(!1), N(!1), i(!1), (f || R) && g(!0));
    }, [t, s, u, v, f]),
    React.useEffect(() => {
      if (!m) return;
      const x = () => {
        const $ = w.current;
        return $ && $.complete ? ($.naturalWidth > 0 ? y(!0) : N(!0), !0) : !1;
      };
      if (x()) return;
      const P = setInterval(() => {
          x() && clearInterval(P);
        }, 100),
        z = setTimeout(() => clearInterval(P), 2e3);
      return () => {
        (clearInterval(P), clearTimeout(z));
      };
    }, [u, m]),
    React.useEffect(() => {
      if (!m || !v) return;
      const x = () => {
        const $ = j.current;
        return $ && $.complete ? ($.naturalWidth > 0 ? T(!0) : i(!0), !0) : !1;
      };
      if (x()) return;
      const P = setInterval(() => {
          x() && clearInterval(P);
        }, 100),
        z = setTimeout(() => clearInterval(P), 2e3);
      return () => {
        (clearInterval(P), clearTimeout(z));
      };
    }, [v, m]));
  const U = k || L,
    C = A && (!v || I),
    H = !!v && !I;
  return (
    <div ref={d} className={`relative overflow-hidden ${n}`}>
      {[
        !U && !C && (
          <div
            className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 animate-pulse ${a}`}
          />
        ),
        C && l && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700">
            {l}
          </div>
        ),
        m && !!u && !C && (
          <jsxRuntime.Fragment>
            {[
              <img
                ref={w}
                src={u}
                alt={r}
                className={`absolute inset-0 w-full h-full ${b} transition-opacity duration-300 card-image ${f || (k && !A) ? (L ? "opacity-0" : "opacity-100") : "opacity-0"}`}
                onLoad={(x) => {
                  (y(!0),
                    p &&
                      x.currentTarget.naturalWidth &&
                      x.currentTarget.naturalHeight &&
                      p({
                        width: x.currentTarget.naturalWidth,
                        height: x.currentTarget.naturalHeight,
                      }));
                }}
                onError={() => N(!0)}
                loading={c}
                decoding="async"
                {...(h
                  ? {
                      fetchPriority: h,
                    }
                  : null)}
              />,
              H && (
                <img
                  ref={j}
                  src={v}
                  alt={r}
                  className={`absolute inset-0 w-full h-full ${b} transition-opacity duration-300 card-image ${L ? "opacity-100" : "opacity-0"}`}
                  onLoad={(x) => {
                    (T(!0),
                      p &&
                        x.currentTarget.naturalWidth &&
                        x.currentTarget.naturalHeight &&
                        p({
                          width: x.currentTarget.naturalWidth,
                          height: x.currentTarget.naturalHeight,
                        }));
                  }}
                  onError={() => i(!0)}
                  loading={c}
                  decoding="async"
                />
              ),
            ]}
          </jsxRuntime.Fragment>
        ),
      ]}
    </div>
  );
};
export { OptimizedImage };
