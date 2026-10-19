import { j as e } from "./index-BU_ZgoWo.js";
import { r as o } from "./vendor-react-BwINE3B3.js";
import {
  a as Z,
  u as ee,
  b as se,
  c as ae,
  O as te,
  M as z,
  i as h,
  d as re,
  f as g,
  e as v,
  j as ie,
  k as ne,
} from "./App-BPrQ3EPG.js";
import {
  w as oe,
  E as B,
  M as le,
  A as C,
  O as de,
  k as ce,
  P as me,
  Q as ge,
  S as pe,
  N as xe,
  v as F,
  B as G,
} from "./vendor-firebase-BjYbfC3F.js";
import {
  e as W,
  P as q,
  y as ue,
  r as H,
  T as he,
  L as K,
  a4 as fe,
} from "./vendor-ui-CnvYSvQL.js";
import "./vendor-pdf-Cf03QSry.js";
const be = ce(),
  U = async (d, r) => {
    const n = `ministry_admin_${d}`,
      l = `ministry_subadmin_${d}`;
    if (h()) {
      const k = (await g(`/api/roles/${encodeURIComponent(n)}`)).exists,
        N = (await g(`/api/roles/${encodeURIComponent(l)}`)).exists,
        p = [];
      (k ||
        p.push(
          g(`/api/roles/${encodeURIComponent(n)}`, {
            method: "PUT",
            json: {
              id: n,
              name: `Admin de ${r}`,
              description: `Gestión completa del ministerio de ${r}.`,
              permissions: [
                "view_dashboard",
                "view_events",
                "manage_ministry_events",
                "manage_ministry_users",
                "view_ministry_reports",
                "view_ministry_attendance",
              ],
              isSystem: !1,
              ministryId: d,
              ministryName: r,
              roleType: "ministry_admin",
            },
          }),
        ),
        N ||
          p.push(
            g(`/api/roles/${encodeURIComponent(l)}`, {
              method: "PUT",
              json: {
                id: l,
                name: `Sub-Admin de ${r}`,
                description: `Apoyo en la gestión del ministerio de ${r}.`,
                permissions: [
                  "view_dashboard",
                  "view_events",
                  "view_ministry_reports",
                  "view_ministry_attendance",
                ],
                isSystem: !1,
                ministryId: d,
                ministryName: r,
                roleType: "ministry_subadmin",
              },
            }),
          ),
        p.length > 0 && (await Promise.all(p)));
      return;
    }
    const c = C(v, "roles", n),
      y = C(v, "roles", l),
      E = await F(c),
      j = await F(y),
      f = [];
    (E.exists() ||
      f.push(
        G(c, {
          id: n,
          name: `Admin de ${r}`,
          description: `Gestión completa del ministerio de ${r}.`,
          permissions: [
            "view_dashboard",
            "view_events",
            "manage_ministry_events",
            "manage_ministry_users",
            "view_ministry_reports",
            "view_ministry_attendance",
          ],
          isSystem: !1,
          ministryId: d,
          ministryName: r,
          roleType: "ministry_admin",
          createdAt: new Date(),
        }),
      ),
      j.exists() ||
        f.push(
          G(y, {
            id: l,
            name: `Sub-Admin de ${r}`,
            description: `Apoyo en la gestión del ministerio de ${r}.`,
            permissions: [
              "view_dashboard",
              "view_events",
              "view_ministry_reports",
              "view_ministry_attendance",
            ],
            isSystem: !1,
            ministryId: d,
            ministryName: r,
            roleType: "ministry_subadmin",
            createdAt: new Date(),
          }),
        ),
      f.length > 0 && (await Promise.all(f)));
  },
  _e = () => {
    const [d, r] = o.useState(!1),
      [n, l] = o.useState([]),
      { serviceAreas: c, reload: y } = Z(),
      [E, j] = o.useState(!0),
      { user: f, userProfile: k, loading: N } = ee(),
      p = se(),
      [t, m] = o.useState({
        name: "",
        description: "",
        roles: [],
        imageURL: "",
      }),
      [x, A] = o.useState(null),
      L = o.useRef(null),
      [S, I] = o.useState(!1),
      [M, $] = o.useState(!1),
      [b, _] = o.useState({ isOpen: !1, areaId: null, areaName: "" }),
      D = async () => {
        if (c.length > 0) {
          (l(c), j(!1));
          return;
        }
        if (!(!h() && !re.currentUser))
          try {
            const s = h()
              ? (await g("/api/service_areas", { bypassCache: !0 })).items
              : (await oe(B(v, "service_areas"))).docs.map((a) => ({
                  id: a.id,
                  ...a.data(),
                }));
            l(s);
          } catch (s) {
            console.error("Error fetching areas:", s);
          } finally {
            j(!1);
          }
      };
    (o.useEffect(() => {
      c.length > 0 ? (l(c), j(!1)) : N || D();
      const s = (a) => {
        if (a.data?.type === "DATA_CHANGED") {
          const i = a.data.resources || [],
            u = ["service_areas"];
          i.some((w) => u.includes(w)) &&
            (console.log(
              "[ServiceAreas] 📲 Push detectó cambios - refrescando...",
            ),
            y());
        }
      };
      return (
        navigator.serviceWorker?.addEventListener("message", s),
        () => {
          navigator.serviceWorker?.removeEventListener("message", s);
        }
      );
    }, [N, f, c]),
      ae({
        enabled: h(),
        resources: ["service_areas"],
        onChange: () => {
          y();
        },
        debounceMs: 600,
      }),
      o.useEffect(() => {
        (async () => {
          if (n.length !== 0)
            for (const a of n)
              try {
                await U(a.id, a.name);
              } catch (i) {
                console.error(`Error creando roles para ${a.name}:`, i);
              }
        })();
      }, [n]));
    const Q = (s) => {
        const a = s.target.files?.[0];
        if (a) {
          const i = new FileReader();
          ((i.onloadend = () => {
            m((u) => ({ ...u, imageURL: i.result }));
          }),
            i.readAsDataURL(a));
        }
      },
      J = async (s) => {
        (s.preventDefault(), I(!0));
        try {
          let a = t.imageURL;
          if (t.imageURL && t.imageURL.startsWith("data:")) {
            const i = await ie(t.imageURL),
              u = new File([i], "ministry.jpg", { type: "image/jpeg" }),
              R = await ne(u, 800, 0.85),
              w = `events/ministry_${x || "new"}_${Date.now()}.jpg`,
              P = de(be, w);
            (await me(P, R, {
              contentType: "image/jpeg",
              cacheControl: "public,max-age=31536000,immutable",
            }),
              (a = await ge(P)));
          }
          if (x)
            h()
              ? await g(`/api/service_areas/${encodeURIComponent(x)}`, {
                  method: "PUT",
                  json: {
                    name: t.name,
                    description: t.description,
                    roles: t.roles,
                    imageURL: a,
                  },
                })
              : await pe(C(v, "service_areas", x), {
                  name: t.name,
                  description: t.description,
                  roles: t.roles,
                  imageURL: a,
                });
          else if (h()) {
            const i = await g("/api/service_areas", {
              method: "POST",
              json: {
                name: t.name,
                description: t.description,
                roles: t.roles,
                imageURL: a,
              },
            });
            await U(i.id, t.name);
          } else {
            const i = await xe(B(v, "service_areas"), {
              name: t.name,
              description: t.description,
              roles: t.roles,
              imageURL: a,
              createdAt: new Date(),
            });
            await U(i.id, t.name);
          }
          (r(!1), T(), D());
        } catch (a) {
          (console.error("Error saving area:", a),
            p.showError("Error al guardar el ministerio"));
        } finally {
          I(!1);
        }
      },
      V = async () => {
        if (!(!b.areaId || !n.find((a) => a.id === b.areaId))) {
          $(!0);
          try {
            (h()
              ? await g(`/api/service_areas/${encodeURIComponent(b.areaId)}`, {
                  method: "DELETE",
                })
              : await le(C(v, "service_areas", b.areaId)),
              D(),
              _({ isOpen: !1, areaId: null, areaName: "" }));
          } catch (a) {
            (console.error("Error deleting area:", a),
              p.showError("Error al eliminar el ministerio"));
          } finally {
            $(!1);
          }
        }
      },
      X = (s) => {
        _({ isOpen: !0, areaId: s.id, areaName: s.name });
      },
      Y = (s) => {
        (m({
          name: s.name,
          description: s.description,
          roles: s.roles || [],
          imageURL: s.imageURL || s.imageUrl || "",
        }),
          A(s.id),
          r(!0));
      },
      T = () => {
        (m({ name: "", description: "", roles: [], imageURL: "" }), A(null));
      },
      O = k?.role === "master_admin" || k?.role === "admin";
    return e.jsxs("div", {
      className: "space-y-6",
      children: [
        e.jsxs("div", {
          className:
            "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-4",
              children: [
                e.jsx("div", {
                  className:
                    "w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg",
                  children: e.jsx(W, { size: 24 }),
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h1", {
                      className:
                        "text-2xl font-bold text-gray-900 dark:text-white",
                      children: "Ministerios",
                    }),
                    e.jsxs("p", {
                      className: "text-gray-500 dark:text-slate-400 text-sm",
                      children: [n.length, " ministerios activos"],
                    }),
                  ],
                }),
              ],
            }),
            O &&
              e.jsxs("button", {
                onClick: () => {
                  (T(), r(!0));
                },
                className:
                  "px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2",
                children: [e.jsx(q, { size: 20 }), "Nuevo Ministerio"],
              }),
          ],
        }),
        E
          ? e.jsx("div", {
              className:
                "grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              children: [1, 2, 3, 4, 5, 6].map((s) =>
                e.jsxs(
                  "div",
                  {
                    className:
                      "bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-pulse",
                    children: [
                      e.jsx("div", {
                        className: "h-48 bg-gray-200 dark:bg-slate-700",
                      }),
                      e.jsxs("div", {
                        className: "p-6 space-y-3",
                        children: [
                          e.jsx("div", {
                            className:
                              "h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4",
                          }),
                          e.jsx("div", {
                            className:
                              "h-4 bg-gray-200 dark:bg-slate-700 rounded w-full",
                          }),
                          e.jsx("div", {
                            className:
                              "h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3",
                          }),
                        ],
                      }),
                    ],
                  },
                  s,
                ),
              ),
            })
          : e.jsx("div", {
              className:
                "grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
              children: n.map((s, a) => {
                const i = [
                    { bg: "from-indigo-500 to-purple-600", light: "indigo" },
                    { bg: "from-emerald-500 to-teal-600", light: "emerald" },
                    { bg: "from-orange-500 to-red-500", light: "orange" },
                    { bg: "from-pink-500 to-rose-600", light: "pink" },
                    { bg: "from-cyan-500 to-blue-600", light: "cyan" },
                    { bg: "from-amber-500 to-yellow-500", light: "amber" },
                  ],
                  u = i[a % i.length];
                return e.jsxs(
                  "div",
                  {
                    className:
                      "bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden group",
                    children: [
                      e.jsxs("div", {
                        className: "h-32 sm:h-40 w-full relative",
                        children: [
                          s.imageURL
                            ? e.jsx(te, {
                                src: s.imageURL,
                                alt: s.name,
                                className: "w-full h-full card-image",
                              })
                            : e.jsx("div", {
                                className: `w-full h-full bg-gradient-to-br ${u.bg} flex items-center justify-center`,
                                children: e.jsx(W, {
                                  size: 48,
                                  className: "text-white/30",
                                }),
                              }),
                          e.jsx("div", {
                            className:
                              "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                          }),
                          e.jsx("div", {
                            className: "absolute bottom-0 left-0 right-0 p-4",
                            children: e.jsx("h3", {
                              className:
                                "text-xl font-bold text-white drop-shadow-lg",
                              children: s.name,
                            }),
                          }),
                          O &&
                            e.jsxs("div", {
                              className:
                                "absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                              children: [
                                e.jsx("button", {
                                  onClick: () => Y(s),
                                  className:
                                    "p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors",
                                  title: "Editar",
                                  children: e.jsx(ue, { size: 16 }),
                                }),
                                e.jsx("button", {
                                  onClick: () => X(s),
                                  className:
                                    "p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-red-500/80 transition-colors",
                                  title: "Eliminar",
                                  children: e.jsx(H, { size: 16 }),
                                }),
                              ],
                            }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "p-4",
                        children: [
                          s.description &&
                            e.jsx("p", {
                              className:
                                "text-gray-500 dark:text-slate-400 text-sm mb-3 line-clamp-2",
                              children: s.description,
                            }),
                          s.roles &&
                            s.roles.length > 0 &&
                            e.jsxs("div", {
                              children: [
                                e.jsxs("p", {
                                  className:
                                    "text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2",
                                  children: [s.roles.length, " Roles"],
                                }),
                                e.jsxs("div", {
                                  className: "flex flex-wrap gap-1.5",
                                  children: [
                                    s.roles
                                      .slice(0, 4)
                                      .map((R, w) =>
                                        e.jsx(
                                          "span",
                                          {
                                            className:
                                              "px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs rounded-lg",
                                            children: R,
                                          },
                                          w,
                                        ),
                                      ),
                                    s.roles.length > 4 &&
                                      e.jsxs("span", {
                                        className:
                                          "px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-lg font-medium",
                                        children: [
                                          "+",
                                          s.roles.length - 4,
                                          " más",
                                        ],
                                      }),
                                  ],
                                }),
                              ],
                            }),
                          (!s.roles || s.roles.length === 0) &&
                            !s.description &&
                            e.jsx("p", {
                              className:
                                "text-sm text-gray-400 dark:text-slate-500 italic",
                              children: "Sin descripción ni roles",
                            }),
                        ],
                      }),
                    ],
                  },
                  s.id,
                );
              }),
            }),
        e.jsx(z, {
          isOpen: b.isOpen,
          onClose: () => _({ isOpen: !1, areaId: null, areaName: "" }),
          title: "Eliminar Ministerio",
          maxWidth: "max-w-sm",
          children: e.jsxs("div", {
            className: "text-center",
            children: [
              e.jsx("div", {
                className:
                  "w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4",
                children: e.jsx(he, { size: 32, className: "text-red-500" }),
              }),
              e.jsxs("h3", {
                className:
                  "text-lg font-semibold text-gray-900 dark:text-white mb-2",
                children: ['¿Eliminar "', b.areaName, '"?'],
              }),
              e.jsx("p", {
                className: "text-gray-500 dark:text-slate-400 text-sm mb-6",
                children:
                  "Esta acción no se puede deshacer. El ministerio y todas sus configuraciones serán eliminados permanentemente.",
              }),
              e.jsxs("div", {
                className: "flex gap-3 justify-center",
                children: [
                  e.jsx("button", {
                    onClick: () =>
                      _({ isOpen: !1, areaId: null, areaName: "" }),
                    className:
                      "px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors",
                    children: "Cancelar",
                  }),
                  e.jsx("button", {
                    onClick: V,
                    disabled: M,
                    className:
                      "px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                    children: M
                      ? e.jsxs(e.Fragment, {
                          children: [
                            e.jsx(K, { size: 16, className: "animate-spin" }),
                            "Eliminando...",
                          ],
                        })
                      : "Sí, eliminar",
                  }),
                ],
              }),
            ],
          }),
        }),
        e.jsx(z, {
          isOpen: d,
          onClose: () => r(!1),
          title: x ? "Editar Ministerio" : "Nuevo Ministerio",
          maxWidth: "max-w-lg",
          children: e.jsxs("form", {
            onSubmit: J,
            className: "space-y-4",
            children: [
              e.jsx("div", {
                className: "flex justify-center mb-6",
                children: e.jsxs("div", {
                  className: "relative group cursor-pointer",
                  onClick: () => L.current?.click(),
                  children: [
                    e.jsx("div", {
                      className:
                        "w-full h-48 w-full rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-indigo-500 transition-colors",
                      children: t.imageURL
                        ? e.jsx("img", {
                            src: t.imageURL,
                            alt: "Preview",
                            className:
                              "w-full h-full object-contain bg-gray-50 dark:bg-slate-800",
                          })
                        : e.jsxs("div", {
                            className:
                              "flex flex-col items-center text-gray-400 dark:text-slate-500",
                            children: [
                              e.jsx(fe, { size: 32, className: "mb-2" }),
                              e.jsx("span", {
                                className: "text-sm",
                                children: "Subir imagen",
                              }),
                            ],
                          }),
                    }),
                    e.jsx("input", {
                      type: "file",
                      ref: L,
                      className: "hidden",
                      accept: "image/*",
                      onChange: Q,
                    }),
                  ],
                }),
              }),
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className:
                      "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                    children: "Nombre del Ministerio",
                  }),
                  e.jsx("input", {
                    type: "text",
                    required: !0,
                    value: t.name,
                    onChange: (s) => m({ ...t, name: s.target.value }),
                    className:
                      "w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition-colors",
                    placeholder: "Ej: Alabanza",
                  }),
                ],
              }),
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className:
                      "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
                    children: "Descripción",
                  }),
                  e.jsx("textarea", {
                    rows: 3,
                    value: t.description,
                    onChange: (s) => m({ ...t, description: s.target.value }),
                    className:
                      "w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition-colors",
                    placeholder:
                      "Descripción breve de las responsabilidades...",
                  }),
                ],
              }),
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className:
                      "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2",
                    children: "Roles del Ministerio",
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2 mb-3",
                    children: [
                      e.jsx("input", {
                        type: "text",
                        id: "role-input",
                        className:
                          "flex-1 rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition-colors",
                        placeholder: "Escribe un rol (ej: Batería)",
                        onKeyDown: (s) => {
                          if (s.key === "Enter") {
                            s.preventDefault();
                            const a = s.target.value.trim();
                            a &&
                              !t.roles.includes(a) &&
                              (m({ ...t, roles: [...t.roles, a] }),
                              (s.target.value = ""));
                          }
                        },
                      }),
                      e.jsx("button", {
                        type: "button",
                        onClick: () => {
                          const s = document.getElementById("role-input"),
                            a = s.value.trim();
                          a &&
                            !t.roles.includes(a) &&
                            (m({ ...t, roles: [...t.roles, a] }),
                            (s.value = ""));
                        },
                        className:
                          "px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors",
                        children: e.jsx(q, { size: 20 }),
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex flex-wrap gap-2 min-h-[40px] p-1",
                    children: [
                      t.roles.map((s, a) =>
                        e.jsxs(
                          "div",
                          {
                            className:
                              "flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full text-sm border border-gray-200 dark:border-slate-600",
                            children: [
                              e.jsx("span", { children: s }),
                              e.jsx("button", {
                                type: "button",
                                onClick: () =>
                                  m({
                                    ...t,
                                    roles: t.roles.filter((i) => i !== s),
                                  }),
                                className:
                                  "p-0.5 hover:text-red-500 rounded-full transition-colors",
                                children: e.jsx(H, { size: 14 }),
                              }),
                            ],
                          },
                          a,
                        ),
                      ),
                      t.roles.length === 0 &&
                        e.jsx("p", {
                          className:
                            "text-sm text-gray-400 italic w-full text-center py-2",
                          children: "No hay roles definidos aún.",
                        }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "pt-4 flex justify-end gap-3",
                children: [
                  e.jsx("button", {
                    type: "button",
                    onClick: () => r(!1),
                    className:
                      "px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors",
                    children: "Cancelar",
                  }),
                  e.jsx("button", {
                    type: "submit",
                    disabled: S,
                    className:
                      "px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                    children: S
                      ? e.jsxs(e.Fragment, {
                          children: [
                            e.jsx(K, { size: 16, className: "animate-spin" }),
                            x ? "Guardando..." : "Creando...",
                          ],
                        })
                      : x
                        ? "Guardar Cambios"
                        : "Crear Ministerio",
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    });
  };
export { _e as ServiceAreas };
