import { r as i } from "./vendor-react-BwINE3B3.js";
import { u as R, i as I } from "./App-BPrQ3EPG.js";
import {
  i as y,
  g as O,
  a as D,
  o as U,
  b as W,
  c as v,
  r as q,
  s as k,
  d as x,
} from "./notifications-BEtI2pcG.js";
const G = () => {
  const { user: C, userProfile: h } = R(),
    n = I() ? h?.uid : C?.uid,
    A = !0,
    m = h?.preferences?.notifications !== !1,
    a = m,
    [l, w] = i.useState(() => y()),
    [r, N] = i.useState(() => O()),
    [p, c] = i.useState(!1),
    [P, g] = i.useState(!1),
    [T, s] = i.useState(null),
    [S, d] = i.useState(null),
    E = i.useRef(0),
    b = i.useRef(null);
  (i.useEffect(() => {
    let e = !1;
    const t = y();
    if ((w(t), s(null), !m)) {
      (c(!1), s("Notificaciones desactivadas en tu perfil"));
      return;
    }
    const f =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === !0;
    if (!t) {
      const o = /iPad|iPhone|iPod/.test(navigator.userAgent),
        u = /Android/.test(navigator.userAgent);
      o
        ? s(
            f
              ? "Las notificaciones requieren iOS 16.4+ para PWA"
              : "Las notificaciones en iOS requieren que la app esté instalada como PWA",
          )
        : u &&
          !("PushManager" in window) &&
          s(
            "Tu navegador Android no soporta notificaciones push. Prueba con Chrome",
          );
    }
    return (
      t &&
        (async () => {
          try {
            const o = await D();
            if (e) return;
            o ||
              (w(!1),
              c(!1),
              s(
                "Firebase Messaging (FCM) no está soportado en este navegador. En iPhone/iPad (Safari) normalmente no funciona; prueba Android/Chrome o implementa Web Push sin FCM.",
              ));
          } catch {}
        })(),
      t && r === "granted" && c(!0),
      () => {
        e = !0;
      }
    );
  }, [r, A, m]),
    i.useEffect(() => {
      (async () => {
        if (a && !(!n || !l || r !== "granted" || b.current === n))
          try {
            const t = await v();
            t && (await k(n, t), d(t), c(!0), (b.current = n));
          } catch {}
      })();
    }, [n, l, r, a]),
    i.useEffect(() => {
      n || (b.current = null);
    }, [n]),
    i.useEffect(() => {
      if (!p || !n) return;
      const e = U((t) => {
        const f = (t.data?.type || "").toUpperCase(),
          o =
            t.data?.title ||
            t.data?.body ||
            t.notification?.title ||
            t.notification?.body;
        if (f === "DATA_CHANGED" && !o) {
          console.log(
            "[useNotifications] 🤫 Ignoring foreground silent message",
          );
          return;
        }
        const u = t.data?.title || t.notification?.title || "Notificación",
          M = t.data?.body || t.notification?.body || "";
        Notification.permission === "granted" &&
          x(u, {
            body: M,
            icon: "/mci-logo.png",
            tag: "foreground-notification",
            data: t.data,
          });
      });
      return () => {
        e && e();
      };
    }, [p, n]),
    i.useEffect(() => {
      if (!n || !l || r !== "granted" || !a) return;
      const e = async () => {
          const o = Date.now();
          if (!(o - E.current < 360 * 60 * 1e3))
            try {
              const u = await v();
              u && (await k(n, u), d(u), (E.current = o));
            } catch {}
        },
        t = () => {
          document.visibilityState === "visible" && e();
        },
        f = () => {
          e();
        };
      return (
        document.addEventListener("visibilitychange", t),
        window.addEventListener("online", f),
        e(),
        () => {
          (document.removeEventListener("visibilitychange", t),
            window.removeEventListener("online", f));
        }
      );
    }, [n, l, r, a]));
  const F = i.useCallback(async () => {
      if (!n)
        return (s("Debes iniciar sesión para activar notificaciones"), !1);
      (g(!0), s(null));
      try {
        const e = await W(n);
        return e.success && e.token
          ? (c(!0), N("granted"), d(e.token), !0)
          : (s(e.error || "Error desconocido"), !1);
      } catch (e) {
        return (s(String(e)), !1);
      } finally {
        g(!1);
      }
    }, [n, a]),
    L = i.useCallback(async () => {
      if (n) {
        if (!a) {
          (c(!1), d(null));
          return;
        }
        g(!0);
        try {
          const e = S || (await v());
          (e && (await q(n, e)), c(!1), d(null));
        } catch {
        } finally {
          g(!1);
        }
      }
    }, [n, S, a]);
  return {
    isSupported: l,
    permission: r,
    isEnabled: p,
    isLoading: P,
    error: T,
    enableNotifications: F,
    disableNotifications: L,
  };
};
export { G as u };
