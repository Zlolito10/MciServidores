import { j as e } from "./index-BU_ZgoWo.js";
import { r } from "./vendor-react-BwINE3B3.js";
import {
  u as q,
  b as G,
  a as F,
  e as o,
  O as J,
  g as K,
} from "./App-BPrQ3EPG.js";
import {
  A as c,
  H as U,
  B as Q,
  D as C,
  N as V,
  E as W,
  S as X,
  M as Y,
} from "./vendor-firebase-BjYbfC3F.js";
import { L as Z } from "./LoadingButton-DoDnirDC.js";
import { M as ee } from "./ManageMinistriesModal-BO1rzanM.js";
import { u as se } from "./useOptimizedChat-D_A1-F_L.js";
import {
  w as te,
  t as re,
  ar as ae,
  r as le,
  s as ne,
  z as ie,
  f as oe,
} from "./vendor-ui-CnvYSvQL.js";
import "./vendor-pdf-Cf03QSry.js";
const R = (u) => {
    const d = String(u || "").trim();
    if (!d) return "?";
    const l = d.split(/\s+/).filter(Boolean),
      m = l[0]?.[0] || "?",
      f = l.length > 1 ? l[l.length - 1]?.[0] : "";
    return `${m}${f}`.toUpperCase();
  },
  ye = () => {
    const { user: u, userProfile: d } = q(),
      l = G(),
      { serviceAreas: m, reload: f, removePendingUser: D } = F(),
      [a, p] = r.useState(null),
      [b, y] = r.useState([]),
      [j, k] = r.useState([]),
      [x, A] = r.useState(""),
      [L, S] = r.useState(!1),
      [$, v] = r.useState(!0),
      [i, P] = r.useState(null),
      [E, M] = r.useState(!1),
      [g, w] = r.useState(null),
      h = r.useRef(null),
      T = r.useRef(null),
      { messages: N } = se(a);
    r.useEffect(() => {
      const s = c(o, "system", "pending_users");
      v(!0);
      const t = U(
        s,
        (n) => {
          if (n.exists()) {
            const H = n.data()?.users || [];
            y(H.reverse());
          } else y([]);
          v(!1);
        },
        (n) => {
          (console.error("Error reading pending users:", n), v(!1));
        },
      );
      return () => t();
    }, []);
    const B = (s) => {
      (y((t) => t.filter((n) => n.id !== s)), D(s));
    };
    (r.useEffect(() => {
      g?.clearedAt
        ? k(
            N.filter(
              (s) => s.createdAt && g.clearedAt && s.createdAt > g.clearedAt,
            ),
          )
        : k(N);
    }, [N, g]),
      r.useEffect(() => {
        setTimeout(I, 100);
      }, [j]),
      r.useEffect(() => {
        if (!a) {
          w(null);
          return;
        }
        const s = c(o, "private_chats", a),
          t = U(s, (n) => {
            n.exists() ? w(n.data()) : w(null);
          });
        return () => {
          t();
        };
      }, [a]));
    const I = () => {
        h.current &&
          h.current.scrollTo({
            top: h.current.scrollHeight,
            behavior: "smooth",
          });
      },
      O = async (s) => {
        if ((s.preventDefault(), !(!x.trim() || !a))) {
          S(!0);
          try {
            (await V(W(o, "private_chats", a, "messages"), {
              text: x.trim(),
              senderId: u?.uid || "admin_system",
              senderName: d?.name || "Administrador",
              senderPhotoURL: d?.photoURL || null,
              createdAt: C(),
              isAdmin: !0,
            }),
              A(""));
          } catch (t) {
            (console.error("Error sending message:", t),
              l.showError("Error enviando mensaje"));
          } finally {
            S(!1);
          }
        }
      },
      _ = async () => {
        if (
          !(
            !a ||
            !(await l.confirm({
              title: "Eliminar historial",
              message:
                "¿Estás seguro de eliminar todo el historial de este chat? Esta acción no se puede deshacer.",
              confirmText: "Eliminar",
              cancelText: "Cancelar",
              confirmColor: "red",
            }))
          )
        )
          try {
            const t = c(o, "private_chats", a);
            (await Q(t, { clearedAt: C() }, { merge: !0 }),
              l.showSuccess("Historial eliminado correctamente."));
          } catch (t) {
            (console.error("Error deleting chat:", t),
              l.showError("Error al eliminar chat."));
          }
      },
      z = async (s) => {
        if (i)
          try {
            const t = c(o, "users", i.id);
            (await X(t, { areas: s, isAssigned: s.length > 0 }),
              await Y(c(o, "pending_assignments", i.id)),
              B(i.id),
              a === i.id && p(null),
              l.showSuccess(`${i.name} aceptado y asignado.`),
              M(!1),
              P(null),
              await f());
          } catch (t) {
            (console.error(t), l.showError("Error al asignar areas."));
          }
      };
    return e.jsxs("div", {
      className:
        "flex h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700",
      children: [
        e.jsxs("div", {
          className: `w-full md:w-80 border-r border-gray-100 dark:border-slate-700 flex flex-col ${a ? "hidden md:flex" : "flex"}`,
          children: [
            e.jsxs("div", {
              className: "p-4 border-b border-gray-100 dark:border-slate-700",
              children: [
                e.jsx("h2", {
                  className: "font-bold text-gray-900 dark:text-white mb-2",
                  children: "Solicitudes Pendientes",
                }),
                e.jsxs("div", {
                  className: "relative",
                  children: [
                    e.jsx(te, {
                      className:
                        "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4",
                    }),
                    e.jsx("input", {
                      type: "text",
                      placeholder: "Buscar...",
                      className:
                        "w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white",
                    }),
                  ],
                }),
              ],
            }),
            e.jsx("div", {
              className: "flex-1 overflow-y-auto",
              children: $
                ? e.jsx("div", {
                    className: "p-8 text-center text-gray-400",
                    children: "Cargando...",
                  })
                : b.length === 0
                  ? e.jsxs("div", {
                      className:
                        "p-8 text-center text-gray-400 flex flex-col items-center gap-2",
                      children: [
                        e.jsx(re, { className: "w-8 h-8 opacity-50" }),
                        e.jsx("p", {
                          children: "No hay solicitues pendientes",
                        }),
                      ],
                    })
                  : b.map((s) =>
                      e.jsxs(
                        "button",
                        {
                          onClick: () => p(s.id),
                          className: `w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-50 dark:border-slate-700/50 ${a === s.id ? "bg-indigo-50 dark:bg-indigo-900/20" : ""}`,
                          children: [
                            s.photoURL
                              ? e.jsx(J, {
                                  src: K(s.photoURL) || "",
                                  alt: s.name,
                                  className:
                                    "w-10 h-10 min-w-[2.5rem] rounded-full bg-gray-200 dark:bg-slate-700 object-cover",
                                  fallbackIcon: e.jsx("span", {
                                    className:
                                      "flex w-full h-full items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-slate-700",
                                    children: R(s.name),
                                  }),
                                })
                              : e.jsx("div", {
                                  className:
                                    "w-10 h-10 min-w-[2.5rem] rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-gray-300",
                                  children: R(s.name),
                                }),
                            e.jsxs("div", {
                              className: "text-left flex-1 min-w-0",
                              children: [
                                e.jsx("h3", {
                                  className:
                                    "font-medium text-gray-900 dark:text-white truncate",
                                  children: s.name,
                                }),
                                e.jsx("p", {
                                  className:
                                    "text-xs text-gray-500 dark:text-slate-400 truncate",
                                  children: s.email?.replace(
                                    /@church\.app$/i,
                                    "",
                                  ),
                                }),
                              ],
                            }),
                          ],
                        },
                        s.id,
                      ),
                    ),
            }),
          ],
        }),
        e.jsx("div", {
          className: `flex-1 flex flex-col ${a ? "flex" : "hidden md:flex"}`,
          children: a
            ? e.jsxs(e.Fragment, {
                children: [
                  e.jsxs("div", {
                    className:
                      "p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("button", {
                            onClick: () => p(null),
                            className:
                              "md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-slate-400",
                            children: e.jsx(ae, { className: "w-5 h-5" }),
                          }),
                          e.jsx("div", {
                            children: (() => {
                              const s = b.find((t) => t.id === a);
                              return e.jsx("h3", {
                                className:
                                  "font-bold text-gray-900 dark:text-white",
                                children: s?.name,
                              });
                            })(),
                          }),
                        ],
                      }),
                      e.jsx("div", {
                        className: "flex items-center gap-2",
                        children: e.jsx("button", {
                          onClick: _,
                          className:
                            "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors",
                          title: "Borrar historial de chat",
                          children: e.jsx(le, { className: "w-5 h-5" }),
                        }),
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    ref: h,
                    className:
                      "flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-900/50 space-y-4",
                    children: [
                      j.length === 0
                        ? e.jsxs("div", {
                            className:
                              "text-center text-gray-400 my-10 text-sm",
                            children: [
                              e.jsx(ne, {
                                className: "w-8 h-8 mx-auto mb-2 opacity-50",
                              }),
                              "El historial de chat aparecerá aquí",
                            ],
                          })
                        : j.map((s) =>
                            e.jsxs(
                              "div",
                              {
                                className: `flex flex-col ${s.isAdmin ? "items-end" : "items-start"}`,
                                children: [
                                  e.jsx("div", {
                                    className: `max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${s.isAdmin ? "bg-indigo-600 text-white rounded-br-none" : "bg-white dark:bg-slate-700 text-gray-800 dark:text-white rounded-bl-none border border-gray-100 dark:border-slate-600"}`,
                                    children: e.jsx("p", { children: s.text }),
                                  }),
                                  e.jsxs("span", {
                                    className:
                                      "text-[10px] text-gray-400 mt-1 px-1",
                                    children: [
                                      s.isAdmin ? "Admin" : s.senderName,
                                      " •",
                                      " ",
                                      s.createdAt?.toDate
                                        ? s.createdAt
                                            .toDate()
                                            .toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })
                                        : "...",
                                    ],
                                  }),
                                ],
                              },
                              s.id,
                            ),
                          ),
                      e.jsx("div", { ref: T }),
                    ],
                  }),
                  e.jsx("div", {
                    className:
                      "p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700",
                    children: e.jsxs("form", {
                      onSubmit: O,
                      className: "flex gap-2",
                      children: [
                        e.jsx("input", {
                          type: "text",
                          value: x,
                          onChange: (s) => A(s.target.value),
                          placeholder: "Escribe una respuesta...",
                          className:
                            "flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white",
                        }),
                        e.jsx(Z, {
                          type: "submit",
                          loading: L,
                          disabled: !x.trim(),
                          className:
                            "px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors",
                          children: e.jsx(ie, { className: "w-5 h-5" }),
                        }),
                      ],
                    }),
                  }),
                ],
              })
            : e.jsxs("div", {
                className:
                  "flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 p-8",
                children: [
                  e.jsx("div", {
                    className:
                      "w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4",
                    children: e.jsx(oe, {
                      className: "w-8 h-8 text-gray-300 dark:text-slate-600",
                    }),
                  }),
                  e.jsx("p", {
                    children:
                      "Selecciona un usuario de la lista para ver el chat",
                  }),
                ],
              }),
        }),
        E &&
          i &&
          e.jsx(ee, {
            isOpen: E,
            onClose: () => M(!1),
            areas: m ? m.map((s) => ({ ...s, roles: s.roles || [] })) : [],
            activeMinistries: [],
            onSave: z,
          }),
      ],
    });
  };
export { ye as PendingRequests };
