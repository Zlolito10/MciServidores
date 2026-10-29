// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import {
  v as Ee,
  x as is,
  y as ls,
  z as cs,
  A as ne,
  B as oe,
  D as ds,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  Te,
  Y,
  isBffEnabled,
  isStrictBffAuth,
  bffFetch,
  onSnapshot,
  Ws,
  Hs,
} from "../app/runtime.jsx";
import { firestoreDb, firebaseAuth, authReady } from "../firebase/client.js";
const fallbackRolePermissions = (t) =>
  t === "master_admin"
    ? [
        "view_dashboard",
        "manage_users",
        "manage_roles",
        "manage_events",
        "view_events",
        "manage_services",
        "view_reports",
      ]
    : t === "admin"
      ? [
          "view_dashboard",
          "manage_events",
          "view_events",
          "manage_services",
          "view_reports",
        ]
      : t === "user"
        ? ["view_dashboard", "view_events"]
        : [];
const AuthContext = React.createContext({
  user: null,
  userProfile: null,
  loading: !0,
  refreshUserProfile: async () => {},
  updateLocalUserProfile: () => {},
  logout: async () => {},
  hasPermission: () => !1,
  isMinistryRestricted: () => !1,
  getAssignedMinistries: () => [],
});
const useAuth = () => React.useContext(AuthContext);
const AuthProvider = ({ children: t }) => {
  const s = React.useMemo(() => {
      try {
        const i = localStorage.getItem(Te);
        if (i) {
          const m = JSON.parse(i);
          if (m && m.uid) return m;
        }
      } catch {}
      return null;
    }, []),
    [r, n] = React.useState(
      s
        ? {
            uid: s.uid,
            email: s.email,
            displayName: s.name,
            photoURL: s.photoURL,
          }
        : null,
    ),
    [a, l] = React.useState(s),
    c = React.useRef(a);
  React.useEffect(() => {
    c.current = a;
  }, [a]);
  const f =
      s &&
      !["admin", "master_admin"].includes(s.role) &&
      !s.assignedMinistries?.length &&
      !s.areas?.length,
    [h, b] = React.useState(!s || !!f),
    p = React.useRef(!1),
    u = React.useRef(!1);
  React.useEffect(() => {
    a
      ? localStorage.setItem(Te, JSON.stringify(a))
      : !h && !r && localStorage.removeItem(Te);
  }, [a, h, r]);
  const E = React.useCallback((i) => {
      if (!i || typeof i.uid != "string" || !i.uid) {
        ((u.current = !1), n(null), l(null));
        return;
      }
      ((u.current = !0),
        n({
          uid: i.uid,
          email: typeof i.email == "string" ? i.email : null,
          displayName: typeof i.name == "string" ? i.name : null,
          photoURL: typeof i.photoURL == "string" ? i.photoURL : null,
        }));
      const m = {
        uid: i.uid,
        email: typeof i.email == "string" ? i.email : "",
        name: typeof i.name == "string" ? i.name : "Servidor",
        role: typeof i.role == "string" ? i.role : "user",
        photoURL: typeof i.photoURL == "string" ? i.photoURL : void 0,
        photoThumbURL:
          typeof i.photoThumbURL == "string" ? i.photoThumbURL : void 0,
        assignedMinistries: Array.isArray(i.assignedMinistries)
          ? i.assignedMinistries
          : [],
        areas: Array.isArray(i.areas) ? i.areas : [],
        permissions: Array.isArray(i.permissions) ? i.permissions : [],
        createdAt: new Date(),
      };
      l((g) => {
        const d =
            !["admin", "master_admin"].includes(m.role) &&
            !m.assignedMinistries?.length &&
            !m.areas?.length,
          w =
            g &&
            ((g.assignedMinistries && g.assignedMinistries.length > 0) ||
              (g.areas && g.areas.length > 0) ||
              ["admin", "master_admin"].includes(g.role));
        return d && w
          ? (console.warn(
              "[Auth] Ignoring session restore downgrade (cookie has less data than cache).",
            ),
            g)
          : m;
      });
    }, []),
    v = React.useCallback((i) => {
      !i ||
        typeof i != "object" ||
        (l((m) => {
          if (!m) return m;
          const g = i.preferences
            ? {
                ...(m.preferences || {}),
                ...i.preferences,
              }
            : m.preferences;
          return {
            ...m,
            ...i,
            uid: m.uid,
            preferences: g,
          };
        }),
        n((m) => {
          if (!m || typeof m?.getIdToken == "function") return m;
          const d = {
            ...m,
          };
          return (
            typeof i.name == "string" && (d.displayName = i.name),
            typeof i.photoURL == "string" && (d.photoURL = i.photoURL),
            d
          );
        }));
    }, []),
    _ = async (i) => {
      try {
        const m = await Ee(ne(firestoreDb, "roles", i));
        if (m.exists()) {
          const g = m.data().permissions;
          if (Array.isArray(g)) return g;
        }
      } catch (m) {
        console.error("Error fetching role permissions:", m);
      }
      return fallbackRolePermissions(i);
    },
    k = async (i) => {
      try {
        const m = ne(firestoreDb, "users", i),
          g = await Ee(m);
        if (g.exists()) {
          const d = {
              uid: i,
              ...g.data(),
            },
            w = firebaseAuth.currentUser?.photoURL || void 0,
            j =
              typeof d.photoURL == "string" &&
              d.photoURL.includes("googleusercontent.com");
          w &&
            typeof w == "string" &&
            (!d.photoURL || (j && d.photoURL !== w)) &&
            (await oe(
              m,
              {
                photoURL: w,
              },
              {
                merge: !0,
              },
            ),
            (d.photoURL = w));
          const U = firebaseAuth.currentUser?.displayName,
            C = firebaseAuth.currentUser?.email,
            H = {};
          let x = !1;
          (!d.name && U && ((H.name = U), (d.name = U), (x = !0)),
            !d.email && C && ((H.email = C), (d.email = C), (x = !0)),
            x &&
              (await oe(m, H, {
                merge: !0,
              })));
        } else {
          const d = {
            uid: i,
            email: firebaseAuth.currentUser?.email || "",
            name:
              firebaseAuth.currentUser?.displayName ||
              firebaseAuth.currentUser?.email?.split("@")[0] ||
              "Servidor",
            role: "user",
            createdAt: new Date(),
          };
          (firebaseAuth.currentUser?.photoURL &&
            (d.photoURL = firebaseAuth.currentUser.photoURL),
            await Promise.all([
              oe(m, d),
              oe(ne(firestoreDb, "pending_assignments", i), {
                uid: i,
                name: d.name,
                email: d.email,
                photoURL: d.photoURL || null,
                createdAt: ds(),
                role: "user",
              }),
            ]));
        }
      } catch (m) {
        console.error("Error fetching user profile:", m);
      }
    };
  (React.useEffect(() => {
    let i = null,
      m = null,
      g = null,
      d = null,
      w = !1;
    const j = (C) => {
        try {
          const x = String(document.cookie || "").split(";");
          for (const P of x) {
            const z = P.indexOf("=");
            if (z <= 0) continue;
            const $ = P.slice(0, z).trim(),
              xe = P.slice(z + 1).trim();
            if ($ === C) return decodeURIComponent(xe);
          }
        } catch {}
        return null;
      },
      R = async () => {
        if ((await authReady, w)) return null;
        const C = j("XSRF-TOKEN");
        if ((C && Y(C), isBffEnabled() && isStrictBffAuth())) {
          try {
            const x = await bffFetch(`/api/me?t=${Date.now()}`);
            E(x?.user);
          } catch {
            (n(null), l(null));
          } finally {
            b(!1);
          }
          return null;
        }
        try {
          if (!firebaseAuth.currentUser) {
            const x = await bffFetch(`/api/me?t=${Date.now()}`);
            if (w) return null;
            if (x?.user && typeof x.user.uid == "string" && x.user.uid) {
              E(x.user);
              try {
                const P = await bffFetch("/api/session/refresh", {
                  method: "POST",
                });
                P.token && (await ls(firebaseAuth, P.token));
              } catch (P) {
                console.error("[Auth] Hybrid restore failed:", P);
              }
            }
          }
        } catch (x) {
          console.error("❌ [Auth] Error probing session cookie:", x);
        }
        return cs(firebaseAuth, async (x) => {
          if (x && (n(x), c.current || b(!0), !u.current))
            try {
              if ((await bffFetch("/api/me")).ok) u.current = !0;
              else {
                console.log("[Auth] Restaurando cookie __session faltante...");
                const F = await x.getIdToken();
                (await bffFetch("/api/sessionLogin", {
                  method: "POST",
                  json: {
                    idToken: F,
                  },
                }),
                  (u.current = !0));
              }
            } catch (V) {
              console.warn("[Auth] Falló sincronización de cookie:", V);
            }
          if (!x) {
            if (p.current) {
              try {
                const V = j("XSRF-TOKEN");
                (V && Y(V),
                  await bffFetch("/api/sessionLogout", {
                    method: "POST",
                    json: {},
                  }));
              } catch {
              } finally {
                (Y(null), (u.current = !1));
              }
              p.current = !1;
            }
            (i && (i(), (i = null)),
              m && (m(), (m = null)),
              (g = null),
              u.current || (n(null), l(null)),
              b(!1));
            return;
          }
          try {
            const V = await x.getIdToken(),
              F = await bffFetch("/api/sessionLogin", {
                method: "POST",
                json: {
                  idToken: V,
                },
              });
            (Y(typeof F.csrfToken == "string" ? F.csrfToken : null),
              F?.ok && (u.current = !0));
          } catch {
            Y(null);
          }
          k(x.uid).catch(console.error);
          const P = ne(firestoreDb, "users", x.uid);
          i && (i(), (i = null));
          let z = 0;
          const $ = 2,
            xe = () => ({
              uid: x.uid,
              email: x.email || "",
              name: x.displayName || x.email?.split("@")[0] || "Servidor",
              role: "user",
              createdAt: new Date(),
            });
          (d && clearTimeout(d),
            (d = setTimeout(() => {
              c.current ||
                (console.warn(
                  "[Auth] Profile still null after safety timeout - creating fallback",
                ),
                l(xe()),
                b(!1));
            }, 8e3)),
            (i = onSnapshot(
              P,
              async (V) => {
                if (!V.exists()) {
                  (z++,
                    console.warn(
                      `[Auth] User profile doc missing (attempt ${z}/${$})`,
                    ),
                    z >= $ &&
                      (d && (clearTimeout(d), (d = null)), l(xe()), b(!1)));
                  return;
                }
                ((z = 0), d && (clearTimeout(d), (d = null)));
                const F = {
                    uid: V.id,
                    ...V.data(),
                  },
                  be = F.role || "user";
                if (g !== be) {
                  ((g = be), m && (m(), (m = null)));
                  const Z = ne(firestoreDb, "roles", be);
                  m = onSnapshot(
                    Z,
                    (se) => {
                      const ye =
                        se.exists() && Array.isArray(se.data()?.permissions)
                          ? se.data().permissions
                          : fallbackRolePermissions(be);
                      l(
                        (de) =>
                          de && {
                            ...de,
                            permissions: ye,
                          },
                      );
                    },
                    (se) => {
                      console.error("Error listening to role permissions:", se);
                    },
                  );
                }
                try {
                  const Z = firebaseAuth.currentUser?.photoURL || void 0;
                  Z &&
                    !F.photoURL &&
                    (await oe(
                      P,
                      {
                        photoURL: Z,
                      },
                      {
                        merge: !0,
                      },
                    ),
                    (F.photoURL = Z));
                } catch (Z) {
                  console.error("Error syncing auth photoURL:", Z);
                }
                try {
                  const Z = await _(F.role),
                    se = {
                      ...F,
                      permissions: Z,
                    },
                    ye =
                      !["admin", "master_admin"].includes(F.role) &&
                      !F.assignedMinistries?.length &&
                      !F.areas?.length,
                    de = V.metadata.fromCache,
                    ae = c.current;
                  if (
                    ae &&
                    ((ae.assignedMinistries &&
                      ae.assignedMinistries.length > 0) ||
                      (ae.areas && ae.areas.length > 0) ||
                      ["admin", "master_admin"].includes(ae.role)) &&
                    ye &&
                    de
                  ) {
                    console.warn(
                      "[Auth] Ignoring stale pending cache update to prevent flicker",
                    );
                    return;
                  }
                  if ((l(se), ye)) {
                    b(!0);
                    const Mt = 2500;
                    (console.log(
                      "[Auth] User looks pending - enforcing safety delay...",
                    ),
                      setTimeout(() => {
                        const ve = c.current;
                        !ve ||
                        (!["admin", "master_admin"].includes(ve.role) &&
                          !ve.assignedMinistries?.length &&
                          !ve.areas?.length)
                          ? (console.log(
                              "[Auth] Safety delay over - confirming Pending state.",
                            ),
                            b(!1))
                          : (console.log(
                              "[Auth] Safety delay over - User recovered.",
                            ),
                            b(!1));
                      }, Mt));
                  } else
                    (console.log(
                      "[Auth] User assigned - unlocking UI immediately.",
                    ),
                      b(!1));
                } catch (Z) {
                  (console.error("Error computing permissions:", Z),
                    l({
                      ...F,
                      permissions: [],
                    }),
                    b(!1));
                }
              },
              (V) => {
                (console.error("Error listening to user profile:", V), b(!1));
              },
            )));
        });
      };
    let U = null;
    return (
      R().then((C) => {
        C && (U = C);
      }),
      () => {
        ((w = !0), d && clearTimeout(d), i && i(), m && m(), U && U());
      }
    );
  }, [E]),
    React.useEffect(() => {
      !r ||
        !a ||
        (Ws({
          uid: r.uid,
          email: a.email,
          role: a.role,
        }),
        Hs({
          uid: r.uid,
          email: a.email,
          role: a.role,
        }));
    }, [r, a]));
  const y = React.useCallback(async () => {
      if (isBffEnabled()) {
        try {
          const i = `__t=${Date.now().toString(36)}`,
            m = await bffFetch(`/api/me?${i}`);
          if (m?.user) {
            E(m.user);
            return;
          }
        } catch {}
        if (isStrictBffAuth()) {
          ((u.current = !1), n(null), l(null));
          return;
        }
        r && r.uid && (await k(r.uid));
        return;
      }
      r && r.uid && (await k(r.uid));
    }, [r, E]),
    L = React.useCallback(async () => {
      p.current = !0;
      try {
        const m = ((g) => {
          try {
            const w = String(document.cookie || "").split(";");
            for (const j of w) {
              const R = j.indexOf("=");
              if (R <= 0) continue;
              const U = j.slice(0, R).trim(),
                C = j.slice(R + 1).trim();
              if (U === g) return decodeURIComponent(C);
            }
          } catch {}
          return null;
        })("XSRF-TOKEN");
        (m && Y(m),
          await bffFetch("/api/sessionLogout", {
            method: "POST",
            json: {},
          }));
      } catch (i) {
        console.warn("Backend logout failed (non-critical):", i);
      } finally {
        (Y(null), (u.current = !1), (p.current = !1));
      }
      try {
        await is(firebaseAuth);
      } catch (i) {
        (console.error("Firebase signOut failed:", i), n(null), l(null));
      }
    }, []),
    T = React.useCallback(
      (i) => (!a || !a.permissions ? !1 : a.permissions.includes(i)),
      [a],
    ),
    A = React.useCallback(() => {
      if (!a) return !1;
      const i = a.role;
      return (
        i === "ministry_admin" ||
        i === "ministry_subadmin" ||
        i.startsWith("ministry_admin_") ||
        i.startsWith("ministry_subadmin_")
      );
    }, [a]),
    N = React.useCallback(() => {
      if (!a) return [];
      if (a.assignedMinistries && a.assignedMinistries.length > 0)
        return a.assignedMinistries;
      const i = a.role;
      return i.startsWith("ministry_admin_") ||
        i.startsWith("ministry_subadmin_")
        ? [i.replace("ministry_admin_", "").replace("ministry_subadmin_", "")]
        : [];
    }, [a]),
    I = React.useMemo(
      () => ({
        user: r,
        userProfile: a,
        loading: h,
        refreshUserProfile: y,
        updateLocalUserProfile: v,
        logout: L,
        hasPermission: T,
        isMinistryRestricted: A,
        getAssignedMinistries: N,
      }),
      [r, a, h, y, v, L, T, A, N],
    );
  return <AuthContext.Provider value={I}>{t}</AuthContext.Provider>;
};
export { fallbackRolePermissions, AuthContext, useAuth, AuthProvider };
