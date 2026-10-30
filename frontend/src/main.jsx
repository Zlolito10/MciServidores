// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { reactDomClient as Is } from "./vendor/react-dom.js";
import { jsxRuntime } from "./vendor/jsx-runtime.js";
import { recoveryEnvironment } from "./config/environment.js";
// Current esbuild imports resolve their own chunks; legacy preload URLs are retired.
const __vite__mapDeps = () => [];
import { loadModule as xs } from "./services/module-loader.js";
import {
  a as Ls,
  b as Ks,
  r as React,
} from "./vendor/vendor-react-BwINE3B3.js";
(function () {
  const _ = document.createElement("link").relList;
  if (_ && _.supports && _.supports("modulepreload")) return;
  for (const B of document.querySelectorAll('link[rel="modulepreload"]')) h(B);
  new MutationObserver((B) => {
    for (const X of B)
      if (X.type === "childList")
        for (const nl of X.addedNodes)
          nl.tagName === "LINK" && nl.rel === "modulepreload" && h(nl);
  }).observe(document, {
    childList: !0,
    subtree: !0,
  });
  function D(B) {
    const X = {};
    return (
      B.integrity && (X.integrity = B.integrity),
      B.referrerPolicy && (X.referrerPolicy = B.referrerPolicy),
      B.crossOrigin === "use-credentials"
        ? (X.credentials = "include")
        : B.crossOrigin === "anonymous"
          ? (X.credentials = "omit")
          : (X.credentials = "same-origin"),
      X
    );
  }
  function h(B) {
    if (B.ep) return;
    B.ep = !0;
    const X = D(B);
    fetch(B.href, X);
  }
})();
(() => {
  try {
    const T = [];
    for (let _ = 0; _ < localStorage.length; _++) {
      const D = localStorage.key(_);
      if (D) {
        if (D === "token") {
          T.push(D);
          continue;
        }
        if (D.startsWith("firebase:authUser:")) {
          T.push(D);
          continue;
        }
        (D.startsWith("attendance_") ||
          D.startsWith("dashboard_") ||
          D.startsWith("serviceHistory_")) &&
          T.push(D);
      }
    }
    localStorage.getItem("recentTimes") !== null && T.push("recentTimes");
    for (const _ of T) localStorage.removeItem(_);
  } catch {}
})();
(() => {
  try {
    const T = [];
    for (let _ = 0; _ < sessionStorage.length; _++) {
      const D = sessionStorage.key(_);
      if (D) {
        if (D === "token") {
          T.push(D);
          continue;
        }
        (D.startsWith("attendance_") ||
          D.startsWith("dashboard_") ||
          D.startsWith("serviceHistory_")) &&
          T.push(D);
      }
    }
    for (const _ of T) sessionStorage.removeItem(_);
  } catch {}
})();
const Sm = "pwa_sw_version";
const gm = "pwa_app_version";
const ci = "pwa_last_update_check_ts";
const Ps = 60 * 1e3;
const ld = 300 * 1e3;
const td = 600 * 1e3;
let Gn = document.visibilityState === "visible" ? Date.now() : 0;
const ad = () => {
  const T = Date.now();
  return document.visibilityState !== "visible"
    ? Number.POSITIVE_INFINITY
    : (Gn || (Gn = T), T - Gn <= ld ? Ps : td);
};
const ud = () => {
  if (document.visibilityState !== "visible") return !1;
  try {
    const T = localStorage.getItem(ci),
      _ = T ? Number(T) : 0,
      D = Date.now(),
      h = ad();
    return !Number.isFinite(_) || _ <= 0
      ? (localStorage.setItem(ci, String(D)), !0)
      : D - _ < h
        ? !1
        : (localStorage.setItem(ci, String(D)), !0);
  } catch {
    return !1;
  }
};
const ed = async () => {
  try {
    const T = await fetch("/app-version.json", {
      cache: "no-cache",
    });
    if (!T.ok) return null;
    const _ = await T.json();
    return typeof _.version == "string" ? _.version : null;
  } catch {
    return null;
  }
};
const nd = () => {
  const T = document.querySelector('meta[name="theme-color"]');
  T && T.setAttribute("content", "#ffffff");
};
nd();
const Cn = (T) => {
  const _ = document.getElementById("pwa-update-screen");
  _ && _.classList.add("show");
};
const fd = (T) => {
  (Cn(),
    T.postMessage({
      type: "SKIP_WAITING",
    }));
};
const cd = async () => {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const D = (await navigator.serviceWorker.getRegistrations()).find((X) =>
      X.active?.scriptURL.includes("firebase-messaging-sw.js"),
    )?.active;
    if (!D) return null;
    const h = new MessageChannel(),
      B = new Promise((X) => {
        const nl = window.setTimeout(() => X(null), 1500);
        h.port1.onmessage = (Tl) => {
          (window.clearTimeout(nl), X(Tl.data?.version || null));
        };
      });
    return (
      D.postMessage(
        {
          type: "GET_VERSION",
        },
        [h.port2],
      ),
      await B
    );
  } catch {
    return null;
  }
};
const bm = async () => {
  const T = parseInt(localStorage.getItem("last_sw_check") || "0", 10),
    _ = Date.now();
  if (_ - T < 300 * 1e3) return;
  localStorage.setItem("last_sw_check", _.toString());
  const D = await cd();
  !D ||
    localStorage.getItem(Sm) === D ||
    (localStorage.setItem(Sm, D),
    Cn(),
    setTimeout(() => window.location.reload(), 500));
};
const id = async () => {
  const T = parseInt(localStorage.getItem("last_app_check") || "0", 10),
    _ = Date.now();
  if (_ - T < 300 * 1e3) return;
  localStorage.setItem("last_app_check", _.toString());
  const D = await ed();
  if (D)
    try {
      if (localStorage.getItem(gm) === D) return;
      (localStorage.setItem(gm, D),
        Cn(!0),
        setTimeout(() => window.location.reload(), 500));
    } catch {}
};
if (recoveryEnvironment.enableServiceWorker && "serviceWorker" in navigator) {
  let T = !1;
  (navigator.serviceWorker.addEventListener("controllerchange", () => {
    T ||
      ((T = !0),
      Cn(),
      setTimeout(() => {
        window.location.reload();
      }, 500));
  }),
    navigator.serviceWorker.addEventListener("message", (h) => {
      h.data && h.data.type === "SW_UPDATED" && bm();
    }));
  const _ = (h) => {
      fd(h);
    },
    D = async () => {
      if (ud())
        try {
          const h = await navigator.serviceWorker.getRegistrations();
          for (const B of h) (await B.update(), B.waiting && _(B.waiting));
          (await bm(), await id());
        } catch {}
    };
  (window.addEventListener("load", async () => {
    try {
      let h;
      ((h = (await navigator.serviceWorker.getRegistrations()).find((nl) =>
        nl.active?.scriptURL.includes("firebase-messaging-sw.js"),
      )),
        h ||
          (h = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
              updateViaCache: "none",
            },
          )));
      const X = await navigator.serviceWorker.getRegistrations();
      for (const nl of X)
        nl.addEventListener("updatefound", () => {
          const Tl = nl.installing;
          Tl &&
            Tl.addEventListener("statechange", () => {
              Tl.state === "installed" &&
                navigator.serviceWorker.controller &&
                _(Tl);
            });
        });
      D();
    } catch {}
  }),
    window.addEventListener("focus", () => {
      D();
    }),
    window.addEventListener("online", () => {
      D();
    }),
    document.addEventListener("visibilitychange", async () => {
      document.visibilityState === "visible" && ((Gn = Date.now()), D());
    }));
}
window.addEventListener("vite:preloadError", () => {
  const T = "chunk_reload";
  sessionStorage.getItem(T) ||
    (sessionStorage.setItem(T, "1"), window.location.reload());
});
const vd = async () => {
  const T = document.getElementById("root");
  if (T)
    try {
      const D = (
        await xs(
          () => import("./app/App.jsx").then((h) => h.AppModule),
          __vite__mapDeps([0, 1, 2]),
        )
      ).default;
      (Is.createRoot(T).render(
        <React.StrictMode>
          <D />
        </React.StrictMode>,
      ),
        sessionStorage.removeItem("chunk_reload"));
    } catch (error) {
      console.error("[MCI] Bootstrap failed", {
        name: error?.name,
        message: error?.message,
      });
      const D = "chunk_reload";
      if (!sessionStorage.getItem(D))
        (sessionStorage.setItem(D, "1"), window.location.reload());
      else {
        const h = document.getElementById("root");
        h &&
          (h.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:system-ui;gap:12px;"><p style="color:#666;">Se detectó una actualización. Por favor recarga la página.</p><button onclick="sessionStorage.removeItem('chunk_reload');location.reload()" style="padding:8px 24px;border-radius:8px;background:#4f46e5;color:#fff;border:none;cursor:pointer;font-size:14px;">Recargar</button></div>`);
      }
    }
};
vd();
export { jsxRuntime };
