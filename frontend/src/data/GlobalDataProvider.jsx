// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import {
  v as Ee,
  w as ft,
  A as ne,
  E as us,
  F as ms,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import { isBffEnabled, bffFetch, useChangeFeed } from "../app/runtime.jsx";
import { firebaseAuth, firestoreDb } from "../firebase/client.js";
const GlobalDataContext = React.createContext(void 0);
const useGlobalData = () => {
  const t = React.useContext(GlobalDataContext);
  if (!t)
    throw new Error("useGlobalData must be used within GlobalDataProvider");
  return t;
};
const GlobalDataProvider = ({ children: t }) => {
  const [s, r] = React.useState([]),
    [n, a] = React.useState([]),
    [l, c] = React.useState([]),
    [f, h] = React.useState([]),
    [b, p] = React.useState(!0),
    { user: u, userProfile: E, loading: v } = useAuth(),
    _ = React.useCallback((N) => {
      h((I) => I.filter((i) => i.id !== N));
    }, []),
    k = u?.uid,
    y = E?.role,
    L = E?.assignedMinistries,
    T = JSON.stringify(L || []),
    A = React.useCallback(async () => {
      if (!isBffEnabled() && !k) {
        (r([]), a([]), c([]), h([]), p(!1));
        return;
      }
      p(!0);
      try {
        const N = y === "admin" || y === "master_admin",
          I =
            y === "master_admin" ||
            y === "admin" ||
            (y && y.includes("admin")) ||
            (Array.isArray(L) && L.length > 0);
        if (isBffEnabled()) {
          const [i, m, g] = await Promise.all([
              I
                ? bffFetch("/api/users")
                : Promise.resolve({
                    ok: !0,
                    items: [],
                  }),
              bffFetch("/api/roles"),
              bffFetch("/api/service_areas", {
                bypassCache: !0,
              }),
            ]),
            d = Array.isArray(i?.items) ? i.items : [];
          if (
            (r(d),
            a(Array.isArray(m?.items) ? m.items : []),
            c(Array.isArray(g?.items) ? g.items : []),
            N)
          ) {
            const w = d.filter(
              (j) =>
                (j.role === "user" || !j.role) &&
                (j.isAssigned === !1 || j.isAssigned === void 0) &&
                (!j.areas || j.areas.length === 0),
            );
            h(w);
          }
        } else {
          if (!firebaseAuth.currentUser) {
            console.log(
              "[GlobalData] Esperando inicialización completa de Firebase Auth...",
            );
            return;
          }
          const i = async (j) => {
              try {
                const C = ne(firestoreDb, "app_cache", j),
                  H = await Ee(C);
                if (H.exists()) {
                  const x = H.data();
                  if (Array.isArray(x?.items)) return x.items;
                }
              } catch (C) {
                console.warn(`[GlobalData] AppCache miss for ${j}`, C);
              }
              const R = us(firestoreDb, j);
              try {
                const C = await ms(R);
                if (!C.empty)
                  return C.docs.map((H) => ({
                    id: H.id,
                    ...H.data(),
                  }));
              } catch {}
              return (await ft(R)).docs.map((C) => ({
                id: C.id,
                ...C.data(),
              }));
            },
            [m, g, d] = await Promise.all([
              I ? i(N ? "users" : "user_directory") : Promise.resolve([]),
              i("roles"),
              i("service_areas"),
            ]),
            w = m;
          if ((r(w), a(g), c(d), N)) {
            const j = w.filter(
              (R) =>
                (R.role === "user" || !R.role) &&
                (R.isAssigned === !1 || R.isAssigned === void 0) &&
                (!R.areas || R.areas.length === 0),
            );
            h(j);
          } else h([]);
        }
      } catch (N) {
        console.error("Error loading global data:", N);
      } finally {
        p(!1);
      }
    }, [k, u, y, T]);
  return (
    React.useEffect(() => {
      if (v) return;
      A();
      const N = (I) => {
        if (I.data?.type === "DATA_CHANGED") {
          const i = I.data.resources || [],
            m = ["users", "roles", "service_areas"];
          i.some((d) => m.includes(d)) &&
            (console.log(
              "[GlobalData] 📲 Push detectó cambios - recargando datos globales...",
            ),
            A());
        }
      };
      return (
        navigator.serviceWorker?.addEventListener("message", N),
        () => {
          navigator.serviceWorker?.removeEventListener("message", N);
        }
      );
    }, [v, A]),
    useChangeFeed({
      enabled: isBffEnabled(),
      resources: ["users", "roles", "service_areas"],
      onChange: () => {
        (console.log(
          "[GlobalData] 🔄 ChangeFeed detectó cambios - recargando...",
        ),
          A());
      },
      debounceMs: 1e3,
    }),
    (
      <GlobalDataContext.Provider
        value={{
          users: s,
          roles: n,
          serviceAreas: l,
          pendingUsers: f,
          loading: b,
          reload: A,
          removePendingUser: _,
        }}
      >
        {t}
      </GlobalDataContext.Provider>
    )
  );
};
export { GlobalDataContext, useGlobalData, GlobalDataProvider };
