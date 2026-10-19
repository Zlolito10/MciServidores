import { j as e } from "./index-BU_ZgoWo.js";
import { r as t, d as le, u as We } from "./vendor-react-BwINE3B3.js";
import {
  I as me,
  E as Q,
  J as ue,
  w as Ue,
  M as Pe,
  A as X,
  O as Ie,
  P as Ae,
  Q as $e,
  D as de,
  B as Qe,
  S as Ke,
  N as Xe,
  L as Ze,
  H as we,
} from "./vendor-firebase-BjYbfC3F.js";
import {
  u as xe,
  b as ge,
  e as _,
  s as Re,
  a as Oe,
  i as ae,
  f as Y,
  n as ke,
  l as et,
  m as tt,
  M as st,
} from "./App-BPrQ3EPG.js";
import { E as at } from "./EventsGrid-BNb5ngU2.js";
import { S as J } from "./SelectPicker-D1mnbmt-.js";
import {
  X as V,
  w as Le,
  C as rt,
  L as G,
  z as lt,
  B as Se,
  D as it,
  s as nt,
  F as Ee,
  x as Ce,
  P as pe,
  I as Z,
  r as ce,
  J as ot,
  n as dt,
  d as F,
  f as re,
  K as he,
  N as Fe,
  O as ct,
  Q as mt,
  R as ut,
  j as xt,
  V as gt,
} from "./vendor-ui-CnvYSvQL.js";
import { M as pt } from "./ManageMinistriesModal-BO1rzanM.js";
import "./vendor-pdf-Cf03QSry.js";
const ht = ({ isOpen: u, onClose: d, users: D, onSend: c }) => {
    const [f, P] = t.useState("📢 Notificación"),
      [p, k] = t.useState(""),
      [T, U] = t.useState(""),
      [x, M] = t.useState([]),
      [o, b] = t.useState(!1),
      v = t.useMemo(() => {
        if (!T) return D;
        const m = T.toLowerCase();
        return D.filter(
          (S) =>
            (S.displayName || "").toLowerCase().includes(m) ||
            (S.email || "").toLowerCase().includes(m),
        );
      }, [D, T]),
      n = (m) => {
        M((S) => (S.includes(m) ? S.filter((E) => E !== m) : [...S, m]));
      },
      j = () => {
        x.length === v.length ? M([]) : M(v.map((m) => m.uid));
      },
      z = async () => {
        if (!(!f.trim() || !p.trim() || x.length === 0)) {
          b(!0);
          try {
            (await c({ title: f, message: p, selectedUserIds: x }),
              d(),
              k(""),
              M([]));
          } catch (m) {
            console.error("Error sending:", m);
          } finally {
            b(!1);
          }
        }
      };
    return u
      ? le.createPortal(
          e.jsxs("div", {
            className:
              "fixed inset-0 z-[9999] flex items-center justify-center p-4",
            children: [
              e.jsx("div", {
                className:
                  "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
                onClick: d,
              }),
              e.jsxs("div", {
                className:
                  "relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200",
                children: [
                  e.jsxs("div", {
                    className:
                      "flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700",
                    children: [
                      e.jsx("h2", {
                        className:
                          "text-xl font-bold text-gray-900 dark:text-white",
                        children: "Notificar Usuarios Específicos",
                      }),
                      e.jsx("button", {
                        onClick: d,
                        className:
                          "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500",
                        children: e.jsx(V, { size: 20 }),
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex-1 overflow-y-auto p-6 space-y-6",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx("label", {
                            className:
                              "text-sm font-semibold text-gray-700 dark:text-slate-300",
                            children: "Título *",
                          }),
                          e.jsx("div", {
                            className: "relative",
                            children: e.jsx("input", {
                              type: "text",
                              value: f,
                              onChange: (m) => P(m.target.value),
                              className:
                                "w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none font-medium",
                              placeholder: "Título de la notificación",
                            }),
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx("label", {
                            className:
                              "text-sm font-semibold text-gray-700 dark:text-slate-300",
                            children: "Mensaje *",
                          }),
                          e.jsx("textarea", {
                            value: p,
                            onChange: (m) => k(m.target.value),
                            className:
                              "w-full p-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none h-32",
                            placeholder:
                              "Escribe el mensaje de la notificación",
                          }),
                          e.jsxs("div", {
                            className: "text-right text-xs text-gray-400",
                            children: [p.length, "/300"],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsx("div", {
                            className: "flex items-center justify-between",
                            children: e.jsxs("label", {
                              className:
                                "text-sm font-semibold text-gray-700 dark:text-slate-300",
                              children: [
                                "Seleccionar Usuarios (",
                                x.length,
                                " seleccionados)",
                              ],
                            }),
                          }),
                          e.jsxs("div", {
                            className: "relative",
                            children: [
                              e.jsx(Le, {
                                className:
                                  "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                                size: 18,
                              }),
                              e.jsx("input", {
                                type: "text",
                                value: T,
                                onChange: (m) => U(m.target.value),
                                className:
                                  "w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all outline-none",
                                placeholder: "Buscar por nombre o email...",
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "flex justify-end",
                            children: e.jsx("button", {
                              onClick: j,
                              className:
                                "text-xs px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors",
                              children:
                                x.length === v.length
                                  ? "Deseleccionar todos"
                                  : "Seleccionar todos",
                            }),
                          }),
                          e.jsx("div", {
                            className:
                              "border border-gray-200 dark:border-slate-700 rounded-xl max-h-[200px] overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar",
                            children:
                              v.length > 0
                                ? v.map((m) =>
                                    e.jsxs(
                                      "div",
                                      {
                                        onClick: () => n(m.uid),
                                        className:
                                          "flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer border-b border-gray-100 dark:border-slate-800 last:border-0 transition-colors",
                                        children: [
                                          e.jsx("div", {
                                            className: `w-5 h-5 rounded border flex items-center justify-center transition-colors ${x.includes(m.uid) ? "bg-purple-600 border-purple-600" : "border-gray-300 dark:border-slate-600"}`,
                                            children:
                                              x.includes(m.uid) &&
                                              e.jsx(rt, {
                                                size: 14,
                                                className: "text-white",
                                              }),
                                          }),
                                          e.jsxs("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                              e.jsx("p", {
                                                className:
                                                  "text-sm font-medium text-gray-900 dark:text-white truncate",
                                                children:
                                                  m.displayName ||
                                                  "Usuario sin nombre",
                                              }),
                                              e.jsx("p", {
                                                className:
                                                  "text-xs text-gray-500 dark:text-slate-400 truncate",
                                                children: m.email?.replace(
                                                  /@church\.app$/i,
                                                  "",
                                                ),
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      m.uid,
                                    ),
                                  )
                                : e.jsx("div", {
                                    className:
                                      "p-4 text-center text-sm text-gray-500",
                                    children: "No se encontraron usuarios",
                                  }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "p-6 pt-2 border-t border-transparent",
                    children: e.jsxs("button", {
                      onClick: z,
                      disabled: o || !f.trim() || !p.trim() || x.length === 0,
                      className:
                        "w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25 active:scale-95",
                      children: [
                        o
                          ? e.jsx(G, { className: "animate-spin", size: 20 })
                          : e.jsx(lt, { size: 18 }),
                        o ? "Enviando..." : "Enviar Notificación",
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
          document.body,
        )
      : null;
  },
  ft = ({ isOpen: u, onClose: d, onSend: D }) => {
    const [c, f] = t.useState("📢 Aviso General"),
      [P, p] = t.useState(""),
      [k, T] = t.useState(!1),
      U = async () => {
        if (!(!c.trim() || !P.trim())) {
          T(!0);
          try {
            (await D({ title: c, message: P }),
              d(),
              p(""),
              f("📢 Aviso General"));
          } catch (x) {
            console.error("Error sending:", x);
          } finally {
            T(!1);
          }
        }
      };
    return u
      ? le.createPortal(
          e.jsxs("div", {
            className:
              "fixed inset-0 z-[9999] flex items-center justify-center p-4",
            children: [
              e.jsx("div", {
                className:
                  "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
                onClick: d,
              }),
              e.jsxs("div", {
                className:
                  "relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between p-6 pb-2",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("div", {
                            className:
                              "p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400",
                            children: e.jsx(Se, {
                              size: 24,
                              className: "transform -rotate-12",
                            }),
                          }),
                          e.jsx("h2", {
                            className:
                              "text-xl font-bold text-gray-900 dark:text-white",
                            children: "Notificar a Todos los Servidores",
                          }),
                        ],
                      }),
                      e.jsx("button", {
                        onClick: d,
                        className:
                          "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500",
                        children: e.jsx(V, { size: 20 }),
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "px-6 pb-4",
                    children: e.jsx("p", {
                      className: "text-sm text-gray-500 dark:text-gray-400",
                      children:
                        "Esta notificación se enviará a todos los servidores que tengan las notificaciones activadas.",
                    }),
                  }),
                  e.jsxs("div", {
                    className: "p-6 pt-2 space-y-5",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx("label", {
                            className:
                              "text-sm font-semibold text-gray-700 dark:text-slate-300",
                            children: "Título",
                          }),
                          e.jsxs("div", {
                            className: "relative",
                            children: [
                              e.jsx("div", {
                                className:
                                  "absolute left-4 top-1/2 -translate-y-1/2 text-pink-500",
                                children: e.jsx(Se, { size: 18 }),
                              }),
                              e.jsx("input", {
                                type: "text",
                                value: c,
                                onChange: (x) => f(x.target.value),
                                className:
                                  "w-full pl-11 pr-4 py-3 bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none font-medium",
                                placeholder: "Título del aviso",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx("label", {
                            className:
                              "text-sm font-semibold text-gray-700 dark:text-slate-300",
                            children: "Mensaje",
                          }),
                          e.jsx("textarea", {
                            value: P,
                            onChange: (x) => p(x.target.value),
                            className:
                              "w-full p-4 bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none resize-none h-32",
                            placeholder: "Escribe el mensaje borrar...",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className:
                      "p-6 pt-2 border-t border-transparent flex justify-end gap-3",
                    children: [
                      e.jsx("button", {
                        onClick: d,
                        className:
                          "px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors",
                        children: "Cancelar",
                      }),
                      e.jsxs("button", {
                        onClick: U,
                        disabled: k || !c.trim() || !P.trim(),
                        className:
                          "px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-500/25 active:scale-95",
                        children: [
                          k
                            ? e.jsx(G, { className: "animate-spin", size: 18 })
                            : e.jsx(it, { size: 18 }),
                          k ? "Enviando..." : "Enviar Notificación",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          document.body,
        )
      : null;
  },
  W = ({
    value: u,
    onChange: d,
    label: D,
    color: c = "indigo",
    required: f = !1,
  }) => {
    const [P, p] = t.useState(!1),
      [k, T] = t.useState(u ? u.split(":")[0] : "12"),
      [U, x] = t.useState(u ? u.split(":")[1] : "00"),
      M = t.useRef(null),
      o = t.useRef(k),
      b = t.useRef(U),
      v = t.useRef(null),
      n = t.useRef(null),
      j = t.useRef(!1),
      z = t.useRef(!1);
    (t.useEffect(() => {
      if (u) {
        const [r, w] = u.split(":");
        (T(r), x(w));
      }
    }, [u]),
      t.useEffect(() => {
        ((o.current = k), (b.current = U));
      }, [k, U]),
      t.useEffect(() => {
        const r = (w) => {
          M.current && !M.current.contains(w.target) && p(!1);
        };
        return (
          document.addEventListener("mousedown", r),
          () => document.removeEventListener("mousedown", r)
        );
      }, []));
    const m = (r, w) => {
        (T(r), x(w), d(`${r}:${w}`));
      },
      S = (r) => r.toString().padStart(2, "0"),
      E = () => {
        (v.current && (window.clearTimeout(v.current), (v.current = null)),
          n.current && (window.clearInterval(n.current), (n.current = null)));
      },
      $ = (r) => {
        z.current ||
          ((z.current = !0),
          E(),
          (j.current = !1),
          (v.current = window.setTimeout(() => {
            ((j.current = !0), r(), (n.current = window.setInterval(r, 90)));
          }, 350)));
      },
      I = () => {
        (E(), (z.current = !1));
      },
      R = (r) => {
        const w = () => {
          if (!z.current) return;
          const A = j.current;
          (I(), A || r());
        };
        return {
          onPointerDown: (A) => {
            (A.preventDefault(), !z.current && $(r));
          },
          onPointerUp: (A) => {
            (A.preventDefault(), w());
          },
          onPointerLeave: () => {
            z.current && I();
          },
          onPointerCancel: () => {
            z.current && I();
          },
          onContextMenu: (A) => {
            A.preventDefault();
          },
        };
      },
      O = () => {
        const r = parseInt(o.current),
          w = r >= 23 ? 0 : r + 1;
        m(S(w), b.current);
      },
      s = () => {
        const r = parseInt(o.current),
          w = r <= 0 ? 23 : r - 1;
        m(S(w), b.current);
      },
      C = () => {
        const r = parseInt(o.current),
          w = parseInt(b.current);
        let A = r,
          L = w + 1;
        (L > 59 && ((L = 0), (A = r >= 23 ? 0 : r + 1)), m(S(A), S(L)));
      },
      l = () => {
        const r = parseInt(o.current),
          w = parseInt(b.current);
        let A = r,
          L = w - 1;
        (L < 0 && ((L = 59), (A = r <= 0 ? 23 : r - 1)), m(S(A), S(L)));
      };
    t.useEffect(
      () => () => {
        E();
      },
      [],
    );
    const i = {
        emerald: {
          dot: "bg-emerald-500",
          icon: "text-emerald-500",
          ring: "focus-within:ring-emerald-500 focus-within:border-emerald-500",
          button:
            "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
          selected: "bg-emerald-500 text-white",
          hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
        },
        indigo: {
          dot: "bg-indigo-500",
          icon: "text-indigo-500",
          ring: "focus-within:ring-indigo-500 focus-within:border-indigo-500",
          button:
            "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
          selected: "bg-indigo-500 text-white",
          hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
        },
      }[c],
      N = u ? `${k}:${U}` : "--:--";
    return e.jsxs("div", {
      className: "relative",
      ref: M,
      children: [
        D &&
          e.jsx("label", {
            className:
              "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
            children: e.jsxs("span", {
              className: "flex items-center gap-1.5",
              children: [
                e.jsx("span", { className: `w-2 h-2 rounded-full ${i.dot}` }),
                D,
                f &&
                  e.jsx("span", { className: "text-red-500", children: "*" }),
              ],
            }),
          }),
        e.jsxs("div", {
          onClick: () => p(!P),
          className: `relative flex items-center justify-between w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2.5 cursor-pointer bg-white dark:bg-slate-700 transition-all ${i.ring} ${P ? "ring-2" : ""}`,
          children: [
            e.jsx("span", {
              className: `text-sm font-medium ${u ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-500"}`,
              children: N,
            }),
            e.jsx(nt, { size: 16, className: i.icon }),
          ],
        }),
        P &&
          e.jsxs("div", {
            className:
              "absolute z-[99999] mt-2 min-w-[250px] left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 animate-in fade-in zoom-in-95 duration-150",
            children: [
              e.jsxs("div", {
                className: "flex items-center justify-center gap-4",
                children: [
                  e.jsxs("div", {
                    className: "flex flex-col items-center",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        ...R(O),
                        className: `p-1.5 rounded-lg transition-colors touch-none select-none ${i.button}`,
                        children: e.jsx(Ee, { size: 20 }),
                      }),
                      e.jsx("div", {
                        className: `w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-xl ${i.selected}`,
                        children: k,
                      }),
                      e.jsx("button", {
                        type: "button",
                        ...R(s),
                        className: `p-1.5 rounded-lg transition-colors touch-none select-none ${i.button}`,
                        children: e.jsx(Ce, { size: 20 }),
                      }),
                      e.jsx("span", {
                        className:
                          "text-xs text-gray-500 dark:text-slate-400 mt-1",
                        children: "Horas",
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className:
                      "text-3xl font-bold text-gray-400 dark:text-slate-500 mb-6",
                    children: ":",
                  }),
                  e.jsxs("div", {
                    className: "flex flex-col items-center",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        ...R(C),
                        className: `p-1.5 rounded-lg transition-colors touch-none select-none ${i.button}`,
                        children: e.jsx(Ee, { size: 20 }),
                      }),
                      e.jsx("div", {
                        className: `w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-xl ${i.selected}`,
                        children: U,
                      }),
                      e.jsx("button", {
                        type: "button",
                        ...R(l),
                        className: `p-1.5 rounded-lg transition-colors touch-none select-none ${i.button}`,
                        children: e.jsx(Ce, { size: 20 }),
                      }),
                      e.jsx("span", {
                        className:
                          "text-xs text-gray-500 dark:text-slate-400 mt-1",
                        children: "Minutos",
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx("button", {
                type: "button",
                onClick: (r) => {
                  (r.stopPropagation(), p(!1));
                },
                className: `w-full mt-3 py-2 rounded-lg font-medium text-white transition-colors ${c === "emerald" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-indigo-500 hover:bg-indigo-600"}`,
                children: "Confirmar",
              }),
            ],
          }),
      ],
    });
  },
  Te = {
    name: "",
    defaultTitle: "",
    defaultLocation: "",
    serviceTime: "",
    time: "",
    endTime: "",
    type: "service",
    description: "",
    imageUrl: "",
  },
  bt = ({ isOpen: u, onClose: d }) => {
    const { userProfile: D } = xe(),
      c = ge(),
      [f, P] = t.useState([]),
      [p, k] = t.useState(!1),
      [T, U] = t.useState(!1),
      [x, M] = t.useState(null),
      [o, b] = t.useState(Te),
      [v, n] = t.useState(null),
      [j, z] = t.useState(""),
      m = t.useRef(null),
      [S, E] = t.useState("list"),
      $ = async () => {
        k(!0);
        try {
          const s = me(Q(_, "event_templates"), ue("name")),
            l = (await Ue(s)).docs.map((h) => ({ id: h.id, ...h.data() }));
          P(l);
        } catch (s) {
          (console.error("Error fetching templates:", s),
            c.showError("Error al cargar plantillas"));
        } finally {
          k(!1);
        }
      };
    (t.useEffect(() => {
      u && ($(), E("list"));
    }, [u]),
      t.useEffect(() => {
        if (x) {
          const s = f.find((C) => C.id === x);
          s &&
            (b({
              name: s.name || "",
              defaultTitle: s.defaultTitle || "",
              defaultLocation: s.defaultLocation || "",
              serviceTime: s.serviceTime || "",
              time: s.time || "",
              endTime: s.endTime || "",
              type: s.type || "service",
              description: s.description || "",
              imageUrl: s.imageUrl || "",
            }),
            z(s.imageUrl || ""),
            n(null));
        } else (b(Te), z(""), n(null));
      }, [x, f]));
    const I = (s) => {
        if (s.target.files?.[0]) {
          const C = s.target.files[0];
          (n(C), z(URL.createObjectURL(C)));
        }
      },
      R = async () => {
        if (!o.name.trim()) {
          c.showError("El nombre de la plantilla es obligatorio");
          return;
        }
        U(!0);
        try {
          const s = x || X(Q(_, "event_templates")).id;
          let C = o.imageUrl;
          if (v) {
            const h = Ie(
              Re,
              `event-template-images/${s}/${Date.now()}_${v.name}`,
            );
            (await Ae(h, v), (C = await $e(h)));
          }
          const l = { ...o, imageUrl: C, updatedAt: de(), updatedBy: D?.uid };
          (await Qe(X(_, "event_templates", s), l, { merge: !0 }),
            E("list"),
            c.showSuccess("Plantilla guardada correctamente"),
            await $(),
            x || M(s));
        } catch (s) {
          (console.error("Error saving template:", s),
            c.showError("Error al guardar plantilla"));
        } finally {
          U(!1);
        }
      },
      O = async (s) => {
        if (
          await c.confirm({
            title: "Eliminar Plantilla",
            message: "¿Estás seguro de que quieres eliminar esta plantilla?",
            confirmText: "Eliminar",
            confirmColor: "red",
          })
        )
          try {
            (await Pe(X(_, "event_templates", s)),
              c.showSuccess("Plantilla eliminada"),
              x === s && M(null),
              $());
          } catch (l) {
            (console.error("Error deleting template:", l),
              c.showError("Error al eliminar plantilla"));
          }
      };
    return u
      ? le.createPortal(
          e.jsxs("div", {
            className:
              "fixed inset-0 z-[9999] flex items-center justify-center p-4",
            children: [
              e.jsx("div", {
                className:
                  "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
                onClick: d,
              }),
              e.jsxs("div", {
                className:
                  "relative w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row h-[90dvh] md:h-[85vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden",
                children: [
                  e.jsxs("div", {
                    className: `${S === "list" ? "flex" : "hidden"} md:flex w-full md:w-80 h-full border-r border-gray-100 dark:border-slate-700 flex-col bg-gray-50/50 dark:bg-slate-900/50`,
                    children: [
                      e.jsxs("div", {
                        className:
                          "p-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2",
                        children: [
                          e.jsx("button", {
                            onClick: d,
                            className:
                              "md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full",
                            children: e.jsx(V, { size: 20 }),
                          }),
                          e.jsx("h2", {
                            className:
                              "font-bold text-lg text-gray-900 dark:text-white flex-1",
                            children: "Plantillas",
                          }),
                          e.jsxs("button", {
                            onClick: () => {
                              (M(null), E("editor"));
                            },
                            className:
                              "text-sm text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors",
                            children: [e.jsx(pe, { size: 16 }), "Nueva"],
                          }),
                        ],
                      }),
                      e.jsx("div", {
                        className: "flex-1 overflow-y-auto p-3 space-y-2",
                        children: p
                          ? e.jsx("div", {
                              className: "flex justify-center py-8",
                              children: e.jsx(G, {
                                className: "animate-spin text-gray-400",
                              }),
                            })
                          : f.length === 0
                            ? e.jsx("div", {
                                className:
                                  "text-center py-8 text-gray-400 text-sm",
                                children: "No hay plantillas",
                              })
                            : f.map((s) =>
                                e.jsxs(
                                  "div",
                                  {
                                    onClick: () => {
                                      (M(s.id), E("editor"));
                                    },
                                    className: `group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${x === s.id ? "bg-white dark:bg-slate-800 shadow-md ring-1 ring-gray-200 dark:ring-slate-700" : "hover:bg-white/60 dark:hover:bg-slate-800/60"}`,
                                    children: [
                                      e.jsx("div", {
                                        className: `w-10 h-10 rounded-lg flex-shrink-0 bg-cover bg-center bg-gray-200 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 overflow-hidden ${!s.imageThumbUrl && !s.imageUrl ? "flex items-center justify-center" : ""}`,
                                        style:
                                          s.imageThumbUrl || s.imageUrl
                                            ? {
                                                backgroundImage: `url(${s.imageThumbUrl || s.imageUrl})`,
                                              }
                                            : {},
                                        children:
                                          !s.imageThumbUrl &&
                                          !s.imageUrl &&
                                          e.jsx(Z, {
                                            size: 18,
                                            className: "text-gray-400",
                                          }),
                                      }),
                                      e.jsxs("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                          e.jsx("p", {
                                            className: `text-sm font-semibold truncate ${x === s.id ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-slate-300"}`,
                                            children: s.name,
                                          }),
                                          e.jsx("p", {
                                            className:
                                              "text-xs text-gray-500 truncate",
                                            children:
                                              s.defaultTitle || "Sin título",
                                          }),
                                        ],
                                      }),
                                      e.jsx("button", {
                                        onClick: (C) => {
                                          (C.stopPropagation(), O(s.id));
                                        },
                                        className:
                                          "p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-all",
                                        children: e.jsx(ce, { size: 14 }),
                                      }),
                                    ],
                                  },
                                  s.id,
                                ),
                              ),
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: `${S === "editor" ? "flex" : "hidden"} md:flex flex-1 flex-col h-full bg-white dark:bg-slate-800 relative z-0`,
                    children: [
                      e.jsxs("div", {
                        className:
                          "p-4 md:p-6 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3",
                        children: [
                          e.jsx("button", {
                            onClick: () => E("list"),
                            className:
                              "md:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-500",
                            children: e.jsx(V, { size: 20 }),
                          }),
                          e.jsx("h3", {
                            className:
                              "text-lg md:text-xl font-bold text-gray-900 dark:text-white flex-1",
                            children: x
                              ? "Editar Plantilla"
                              : "Nueva Plantilla",
                          }),
                          e.jsx("button", {
                            onClick: d,
                            className:
                              "hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400",
                            children: e.jsx(V, { size: 20 }),
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex-1 overflow-y-auto p-6 space-y-6",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsxs("label", {
                                className:
                                  "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                children: [
                                  "Nombre de la Plantilla ",
                                  e.jsx("span", {
                                    className: "text-red-500",
                                    children: "*",
                                  }),
                                ],
                              }),
                              e.jsx("input", {
                                type: "text",
                                value: o.name,
                                onChange: (s) =>
                                  b({ ...o, name: s.target.value }),
                                className:
                                  "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none",
                                placeholder: "Ej: Somos Uno (Mañana)",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("label", {
                                    className:
                                      "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                    children: "Título por defecto",
                                  }),
                                  e.jsxs("div", {
                                    className: "relative",
                                    children: [
                                      e.jsx(ot, {
                                        className:
                                          "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                                        size: 16,
                                      }),
                                      e.jsx("input", {
                                        type: "text",
                                        value: o.defaultTitle,
                                        onChange: (s) =>
                                          b({
                                            ...o,
                                            defaultTitle: s.target.value,
                                          }),
                                        className:
                                          "w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none",
                                        placeholder: "Título del evento",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("label", {
                                    className:
                                      "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                    children: "Ubicación",
                                  }),
                                  e.jsxs("div", {
                                    className: "relative",
                                    children: [
                                      e.jsx(dt, {
                                        className:
                                          "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                                        size: 16,
                                      }),
                                      e.jsx("input", {
                                        type: "text",
                                        value: o.defaultLocation,
                                        onChange: (s) =>
                                          b({
                                            ...o,
                                            defaultLocation: s.target.value,
                                          }),
                                        className:
                                          "w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none",
                                        placeholder: "Seleccione o escriba...",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                            children: [
                              e.jsx("div", {
                                className: "space-y-1",
                                children: e.jsx(W, {
                                  label: "Hora Servicio",
                                  value: o.serviceTime,
                                  onChange: (s) => b({ ...o, serviceTime: s }),
                                  color: "emerald",
                                }),
                              }),
                              e.jsx("div", {
                                className: "space-y-1",
                                children: e.jsx(W, {
                                  label: "Inicio Evento",
                                  value: o.time,
                                  onChange: (s) => b({ ...o, time: s }),
                                  color: "indigo",
                                }),
                              }),
                              e.jsx("div", {
                                className: "space-y-1",
                                children: e.jsx(W, {
                                  label: "Fin Evento",
                                  value: o.endTime,
                                  onChange: (s) => b({ ...o, endTime: s }),
                                  color: "indigo",
                                }),
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "space-y-2",
                            children: e.jsx(J, {
                              label: "Tipo",
                              value: o.type,
                              onChange: (s) => b({ ...o, type: s }),
                              placeholder: "Seleccione un tipo...",
                              options: [
                                {
                                  value: "service",
                                  label: "Servicio General",
                                  icon: e.jsx(F, {
                                    size: 16,
                                    className: "text-purple-500",
                                  }),
                                },
                                {
                                  value: "meeting",
                                  label: "Reunión",
                                  icon: e.jsx(re, {
                                    size: 16,
                                    className: "text-purple-500",
                                  }),
                                },
                                {
                                  value: "special",
                                  label: "Evento Especial",
                                  icon: e.jsx(he, {
                                    size: 16,
                                    className: "text-purple-500",
                                  }),
                                },
                              ],
                            }),
                          }),
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx("label", {
                                className:
                                  "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                children: "Descripción por defecto",
                              }),
                              e.jsx("textarea", {
                                value: o.description,
                                onChange: (s) =>
                                  b({ ...o, description: s.target.value }),
                                className:
                                  "w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none resize-none h-24",
                                placeholder: "Descripción...",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx("label", {
                                className:
                                  "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                children: "Imagen por defecto",
                              }),
                              e.jsxs("div", {
                                onClick: () => m.current?.click(),
                                className:
                                  "border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors h-48 relative overflow-hidden group",
                                children: [
                                  e.jsx("input", {
                                    type: "file",
                                    ref: m,
                                    className: "hidden",
                                    accept:
                                      "image/png, image/jpeg, image/gif, image/webp",
                                    onChange: I,
                                  }),
                                  j
                                    ? e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx("img", {
                                            src: j,
                                            alt: "Preview",
                                            className:
                                              "absolute inset-0 w-full h-full object-cover",
                                          }),
                                          e.jsx("div", {
                                            className:
                                              "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                                            children: e.jsxs("p", {
                                              className:
                                                "text-white font-medium flex items-center gap-2",
                                              children: [
                                                e.jsx(Z, { size: 20 }),
                                                " Cambiar imagen",
                                              ],
                                            }),
                                          }),
                                        ],
                                      })
                                    : e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx("div", {
                                            className:
                                              "w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3",
                                            children: e.jsx(Z, {
                                              className: "text-gray-400",
                                              size: 24,
                                            }),
                                          }),
                                          e.jsxs("p", {
                                            className:
                                              "text-sm text-purple-600 dark:text-purple-400 font-medium",
                                            children: [
                                              "Subir un archivo",
                                              e.jsxs("span", {
                                                className:
                                                  "text-gray-500 dark:text-slate-400",
                                                children: [
                                                  " ",
                                                  "o arrastrar y soltar",
                                                ],
                                              }),
                                            ],
                                          }),
                                          e.jsx("p", {
                                            className:
                                              "text-xs text-gray-400 mt-1",
                                            children: "PNG, JPG, GIF hasta 5MB",
                                          }),
                                          e.jsx("p", {
                                            className:
                                              "text-xs text-gray-400 mt-0.5 flex items-center gap-1",
                                            children:
                                              "Tamaño recomendado: 800x450px (16:9)",
                                          }),
                                        ],
                                      }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className:
                          "p-4 md:p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-2 md:gap-3 bg-gray-50/50 dark:bg-slate-900/50 md:rounded-br-2xl",
                        children: [
                          x &&
                            e.jsxs("button", {
                              onClick: () => O(x),
                              className:
                                "mr-auto text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20",
                              children: [
                                e.jsx(ce, { size: 18 }),
                                e.jsx("span", {
                                  className: "hidden md:inline",
                                  children: "Eliminar Plantilla",
                                }),
                                e.jsx("span", {
                                  className: "md:hidden",
                                  children: "Eliminar",
                                }),
                              ],
                            }),
                          e.jsxs("button", {
                            onClick: () => {
                              window.innerWidth < 768 && S === "editor"
                                ? E("list")
                                : d();
                            },
                            className:
                              "px-4 md:px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-colors shadow-sm text-sm md:text-base",
                            children: [
                              e.jsx("span", {
                                className: "md:hidden",
                                children:
                                  S === "editor" ? "Volver" : "Cancelar",
                              }),
                              e.jsx("span", {
                                className: "hidden md:inline",
                                children: "Cancelar",
                              }),
                            ],
                          }),
                          e.jsxs("button", {
                            onClick: R,
                            disabled: T,
                            className:
                              "px-4 md:px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/25 active:scale-95 text-sm md:text-base",
                            children: [
                              T
                                ? e.jsx(G, {
                                    className: "animate-spin",
                                    size: 18,
                                  })
                                : e.jsx(Fe, { size: 18 }),
                              e.jsx("span", {
                                className: "hidden md:inline",
                                children: x
                                  ? "Guardar Cambios"
                                  : "Guardar Plantilla",
                              }),
                              e.jsx("span", {
                                className: "md:hidden",
                                children: "Guardar",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          document.body,
        )
      : null;
  },
  vt = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
  Me = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  ze = (u, d, D) => {
    const c = String(d + 1).padStart(2, "0"),
      f = String(D).padStart(2, "0");
    return `${u}-${c}-${f}`;
  },
  se = (u) => {
    if (!u) return null;
    const d = u.split("-").map(Number);
    return d.length !== 3 ? null : { year: d[0], month: d[1] - 1, day: d[2] };
  },
  yt = ({
    value: u,
    onChange: d,
    label: D,
    required: c = !1,
    placeholder: f = "Seleccionar fecha",
  }) => {
    const [P, p] = t.useState(!1),
      k = new Date(),
      T = k.getFullYear(),
      U = k.getMonth(),
      x = k.getDate(),
      M = se(u),
      [o, b] = t.useState(M ? M.month : U),
      [v, n] = t.useState(M ? M.year : T),
      j = t.useRef(null);
    (t.useEffect(() => {
      const i = se(u);
      i && (b(i.month), n(i.year));
    }, [u]),
      t.useEffect(() => {
        const i = (N) => {
          j.current && !j.current.contains(N.target) && p(!1);
        };
        return (
          document.addEventListener("mousedown", i),
          () => document.removeEventListener("mousedown", i)
        );
      }, []));
    const z = (i, N) => new Date(N, i + 1, 0).getDate(),
      m = (i, N) => {
        const r = new Date(N, i, 1).getDay();
        return r === 0 ? 6 : r - 1;
      },
      S = () => {
        o === 0 ? (b(11), n(v - 1)) : b(o - 1);
      },
      E = () => {
        o === 11 ? (b(0), n(v + 1)) : b(o + 1);
      },
      $ = (i) => {
        const N = ze(v, o, i);
        (d(N), p(!1));
      },
      I = () => {
        const i = ze(T, U, x);
        (d(i), b(U), n(T), p(!1));
      },
      R = (i) => {
        const N = se(i);
        return N ? `${N.day} ${Me[N.month].substring(0, 3)} ${N.year}` : "";
      },
      O = z(o, v),
      s = m(o, v),
      C = se(u),
      l = (i) => i === x && o === U && v === T,
      h = (i) => (C ? i === C.day && o === C.month && v === C.year : !1);
    return e.jsxs("div", {
      className: "relative",
      ref: j,
      children: [
        D &&
          e.jsxs("label", {
            className:
              "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1",
            children: [
              D,
              c &&
                e.jsx("span", {
                  className: "text-red-500 ml-1",
                  children: "*",
                }),
            ],
          }),
        e.jsxs("div", {
          onClick: () => p(!P),
          className: `relative flex items-center justify-between w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2.5 cursor-pointer bg-white dark:bg-slate-700 transition-all focus-within:ring-indigo-500 focus-within:border-indigo-500 ${P ? "ring-2 ring-indigo-500 border-indigo-500" : ""}`,
          children: [
            e.jsx("span", {
              className: `text-sm font-medium ${u ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-500"}`,
              children: u ? R(u) : f,
            }),
            e.jsx(F, { size: 16, className: "text-indigo-500" }),
          ],
        }),
        P &&
          e.jsxs("div", {
            className:
              "absolute z-[99999] mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 animate-in fade-in zoom-in-95 duration-150 w-72",
            children: [
              e.jsxs("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                  e.jsx("button", {
                    type: "button",
                    onClick: (i) => {
                      (i.stopPropagation(), S());
                    },
                    className:
                      "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors",
                    children: e.jsx(ct, { size: 20 }),
                  }),
                  e.jsxs("span", {
                    className:
                      "text-sm font-semibold text-gray-900 dark:text-white",
                    children: [Me[o], " ", v],
                  }),
                  e.jsx("button", {
                    type: "button",
                    onClick: (i) => {
                      (i.stopPropagation(), E());
                    },
                    className:
                      "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors",
                    children: e.jsx(mt, { size: 20 }),
                  }),
                ],
              }),
              e.jsx("div", {
                className: "grid grid-cols-7 gap-1 mb-2",
                children: vt.map((i) =>
                  e.jsx(
                    "div",
                    {
                      className:
                        "text-center text-xs font-medium text-gray-500 dark:text-slate-400 py-1",
                      children: i,
                    },
                    i,
                  ),
                ),
              }),
              e.jsxs("div", {
                className: "grid grid-cols-7 gap-1",
                children: [
                  Array.from({ length: s }).map((i, N) =>
                    e.jsx("div", { className: "h-8" }, `empty-${N}`),
                  ),
                  Array.from({ length: O }).map((i, N) => {
                    const r = N + 1,
                      w = h(r),
                      A = l(r);
                    return e.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (L) => {
                          (L.stopPropagation(), $(r));
                        },
                        className: `h-8 w-8 rounded-lg text-sm font-medium transition-colors flex items-center justify-center mx-auto ${w ? "bg-indigo-500 text-white" : A ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"}`,
                        children: r,
                      },
                      r,
                    );
                  }),
                ],
              }),
              e.jsxs("div", {
                className:
                  "mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 flex justify-between",
                children: [
                  e.jsx("button", {
                    type: "button",
                    onClick: (i) => {
                      (i.stopPropagation(), d(""), p(!1));
                    },
                    className:
                      "px-3 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors",
                    children: "Limpiar",
                  }),
                  e.jsx("button", {
                    type: "button",
                    onClick: (i) => {
                      (i.stopPropagation(), I());
                    },
                    className:
                      "px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium",
                    children: "Hoy",
                  }),
                ],
              }),
            ],
          }),
      ],
    });
  },
  De = {
    title: "",
    date: "",
    location: "",
    serviceTime: "",
    time: "",
    endTime: "",
    type: "service",
    description: "",
    imageUrl: "",
    activeMinistries: [],
  },
  jt = ({ isOpen: u, onClose: d, onEventCreated: D, eventToEdit: c }) => {
    const { userProfile: f, user: P } = xe(),
      p = ge(),
      { serviceAreas: k } = Oe(),
      [T, U] = t.useState([]),
      [, x] = t.useState(!1),
      [M, o] = t.useState(!1),
      [b, v] = t.useState(!1),
      [n, j] = t.useState(De),
      [z, m] = t.useState(null),
      [S, E] = t.useState(""),
      $ = t.useRef(null),
      I = !!c,
      R = async () => {
        x(!0);
        try {
          const l = me(Q(_, "event_templates"), ue("name")),
            i = (await Ue(l)).docs.map((N) => ({ id: N.id, ...N.data() }));
          U(i);
        } catch (l) {
          console.error("Error fetching templates:", l);
        } finally {
          x(!1);
        }
      };
    t.useEffect(() => {
      u &&
        (c
          ? (j({
              title: c.title || "",
              date: c.date || "",
              location: c.location || "",
              serviceTime: c.serviceTime || "",
              time: c.time || "",
              endTime: c.endTime || "",
              type: c.type || "service",
              description: c.description || "",
              imageUrl: c.imageUrl || "",
              activeMinistries: Array.isArray(c.activeMinistries)
                ? c.activeMinistries
                : [],
            }),
            E(c.imageUrl || ""),
            m(null))
          : (R(), j(De), E(""), m(null)));
    }, [u, c]);
    const O = (l) => {
        (j((h) => ({
          ...h,
          title: l.defaultTitle || h.title,
          location: l.defaultLocation || h.location,
          serviceTime: l.serviceTime || h.serviceTime,
          time: l.time || h.time,
          endTime: l.endTime || h.endTime,
          type: l.type || h.type,
          description: l.description || h.description,
          imageUrl: l.imageUrl || h.imageUrl,
        })),
          l.imageUrl && (E(l.imageUrl), m(null)));
      },
      s = (l) => {
        if (l.target.files?.[0]) {
          const h = l.target.files[0];
          (m(h), E(URL.createObjectURL(h)));
        }
      },
      C = async () => {
        if (!n.title.trim()) {
          p.showError("El título del evento es obligatorio");
          return;
        }
        if (!n.date) {
          p.showError("La fecha del evento es obligatoria");
          return;
        }
        if (!n.time) {
          p.showError("La hora de inicio es obligatoria");
          return;
        }
        const l = f?.uid || P?.uid;
        if (!l) {
          p.showError(
            "No se pudo obtener el usuario actual. Intenta iniciar sesión nuevamente.",
          );
          return;
        }
        const h = ae();
        o(!0);
        try {
          let i = n.imageUrl;
          if (z)
            if (h) {
              const r = new FormData();
              r.append("file", z);
              const w = await Y("/api/events/image", {
                method: "POST",
                body: r,
              });
              if (!w?.ok || !w.imageUrl)
                throw new Error("No se pudo subir la imagen del evento");
              i = w.imageUrl;
            } else {
              const r = Ie(Re, `events/${Date.now()}_${z.name}`),
                w = await Ae(r, z);
              i = await $e(w.ref);
            }
          const N = {
            title: n.title,
            date: n.date,
            location: n.location || "",
            serviceTime: n.serviceTime || "",
            time: n.time,
            endTime: n.endTime || "",
            type: n.type || "service",
            description: n.description || "",
            activeMinistries: Array.isArray(n.activeMinistries)
              ? n.activeMinistries
              : [],
          };
          if (I && c) {
            const r = { ...N, updatedBy: l };
            (h || (r.updatedAt = de()),
              i
                ? ((r.imageUrl = i), (r.imageThumbUrl = i))
                : n.imageUrl === "" &&
                  ((r.imageUrl = ""), (r.imageThumbUrl = "")),
              h
                ? await Y(`/api/events/${encodeURIComponent(c.id)}`, {
                    method: "PATCH",
                    json: r,
                  })
                : await Ke(X(_, "events", c.id), r),
              p.showSuccess("Evento actualizado correctamente"));
          } else {
            const r = {
              ...N,
              imageUrl: i || "",
              imageThumbUrl: i || "",
              status: "scheduled",
              createdBy: l,
            };
            (h
              ? await Y("/api/events", { method: "POST", json: r })
              : await Xe(Q(_, "events"), { ...r, createdAt: de() }),
              p.showSuccess("Evento creado correctamente"));
          }
          (D?.(), d());
        } catch (i) {
          (console.error("Error saving event:", i),
            p.showError("Error al guardar evento"));
        } finally {
          o(!1);
        }
      };
    return u
      ? le.createPortal(
          e.jsxs("div", {
            className:
              "fixed inset-0 z-[9999] flex items-center justify-center p-4",
            children: [
              e.jsx("div", {
                className:
                  "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
                onClick: d,
              }),
              e.jsxs("div", {
                className:
                  "relative w-full max-w-6xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200",
                children: [
                  e.jsxs("div", {
                    className:
                      "p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between",
                    children: [
                      e.jsx("h3", {
                        className:
                          "text-xl font-bold text-gray-900 dark:text-white",
                        children: I ? "Editar Evento" : "Nuevo Evento",
                      }),
                      e.jsx("button", {
                        onClick: d,
                        className:
                          "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400",
                        children: e.jsx(V, { size: 20 }),
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex-1 overflow-y-auto p-6 space-y-8",
                    children: [
                      !I &&
                        T.length > 0 &&
                        e.jsxs("div", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("div", {
                              className:
                                "flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider",
                              children: [
                                e.jsx(ut, {
                                  size: 14,
                                  className: "text-purple-500",
                                }),
                                "Plantillas Rápidas",
                              ],
                            }),
                            e.jsx("div", {
                              className: "flex flex-wrap gap-2",
                              children: T.map((l) =>
                                e.jsx(
                                  "button",
                                  {
                                    onClick: () => O(l),
                                    className:
                                      "px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg border border-purple-100 dark:border-purple-800/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors",
                                    children: l.name,
                                  },
                                  l.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                      e.jsxs("div", {
                        className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-6",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("label", {
                                    className:
                                      "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                    children: "Título del Evento",
                                  }),
                                  e.jsx("input", {
                                    type: "text",
                                    value: n.title,
                                    onChange: (l) =>
                                      j({ ...n, title: l.target.value }),
                                    className:
                                      "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none",
                                    placeholder: "Ej: Somos Uno",
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className: "space-y-2",
                                children: e.jsx(yt, {
                                  label: "Fecha",
                                  required: !0,
                                  value: n.date,
                                  onChange: (l) => j({ ...n, date: l }),
                                }),
                              }),
                              e.jsxs("div", {
                                className:
                                  "grid grid-cols-1 sm:grid-cols-3 gap-3",
                                children: [
                                  e.jsx("div", {
                                    className: "space-y-1",
                                    children: e.jsx(W, {
                                      label: "Hora Servicio",
                                      value: n.serviceTime,
                                      onChange: (l) =>
                                        j({ ...n, serviceTime: l }),
                                      color: "emerald",
                                    }),
                                  }),
                                  e.jsx("div", {
                                    className: "space-y-1",
                                    children: e.jsx(W, {
                                      label: "Inicio de Evento *",
                                      value: n.time,
                                      onChange: (l) => j({ ...n, time: l }),
                                      color: "indigo",
                                      required: !0,
                                    }),
                                  }),
                                  e.jsx("div", {
                                    className: "space-y-1",
                                    children: e.jsx(W, {
                                      label: "Fin de Evento",
                                      value: n.endTime,
                                      onChange: (l) => j({ ...n, endTime: l }),
                                      color: "indigo",
                                    }),
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("label", {
                                    className:
                                      "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                    children: "Ubicación",
                                  }),
                                  e.jsx("input", {
                                    type: "text",
                                    value: n.location,
                                    onChange: (l) =>
                                      j({ ...n, location: l.target.value }),
                                    className:
                                      "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none",
                                    placeholder:
                                      "Seleccione o escriba la ubicación",
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className: "space-y-2",
                                children: e.jsx(J, {
                                  label: "Tipo de Evento",
                                  value: n.type,
                                  onChange: (l) => j({ ...n, type: l }),
                                  options: [
                                    {
                                      value: "service",
                                      label: "Servicio General",
                                      icon: e.jsx(F, {
                                        size: 16,
                                        className: "text-purple-500",
                                      }),
                                    },
                                    {
                                      value: "meeting",
                                      label: "Reunión",
                                      icon: e.jsx(re, {
                                        size: 16,
                                        className: "text-purple-500",
                                      }),
                                    },
                                    {
                                      value: "special",
                                      label: "Evento Especial",
                                      icon: e.jsx(he, {
                                        size: 16,
                                        className: "text-purple-500",
                                      }),
                                    },
                                  ],
                                }),
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("label", {
                                    className:
                                      "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                    children: "Ministerios activos",
                                  }),
                                  e.jsxs("div", {
                                    className: "flex flex-col gap-2",
                                    children: [
                                      e.jsx("button", {
                                        type: "button",
                                        onClick: () => v(!0),
                                        className:
                                          "px-4 py-2.5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left",
                                        children: "Seleccionar ministerios",
                                      }),
                                      e.jsx("div", {
                                        className:
                                          "text-xs text-gray-500 dark:text-slate-400",
                                        children:
                                          n.activeMinistries.length > 0
                                            ? `${n.activeMinistries.length} seleccionados`
                                            : "Sin selección explícita (visible para todos)",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-6",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("label", {
                                    className:
                                      "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                    children: "Descripción",
                                  }),
                                  e.jsx("textarea", {
                                    value: n.description,
                                    onChange: (l) =>
                                      j({ ...n, description: l.target.value }),
                                    className:
                                      "w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none resize-none h-32",
                                    placeholder: "Detalles del evento...",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("label", {
                                    className:
                                      "text-sm font-semibold text-gray-700 dark:text-slate-300",
                                    children: "Imagen del Evento",
                                  }),
                                  e.jsxs("div", {
                                    onClick: () => $.current?.click(),
                                    className:
                                      "border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors h-48 relative overflow-hidden group",
                                    children: [
                                      e.jsx("input", {
                                        type: "file",
                                        ref: $,
                                        className: "hidden",
                                        accept:
                                          "image/png, image/jpeg, image/gif, image/webp",
                                        onChange: s,
                                      }),
                                      S
                                        ? e.jsxs(e.Fragment, {
                                            children: [
                                              e.jsx("img", {
                                                src: S,
                                                alt: "Preview",
                                                className:
                                                  "absolute inset-0 w-full h-full object-cover",
                                              }),
                                              e.jsx("button", {
                                                onClick: (l) => {
                                                  (l.stopPropagation(),
                                                    m(null),
                                                    E(""),
                                                    j({ ...n, imageUrl: "" }));
                                                },
                                                className:
                                                  "absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-20",
                                                title: "Eliminar imagen",
                                                children: e.jsx(ce, {
                                                  size: 14,
                                                }),
                                              }),
                                              e.jsx("div", {
                                                className:
                                                  "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                                                children: e.jsxs("p", {
                                                  className:
                                                    "text-white font-medium flex items-center gap-2",
                                                  children: [
                                                    e.jsx(Z, { size: 20 }),
                                                    " Cambiar imagen",
                                                  ],
                                                }),
                                              }),
                                            ],
                                          })
                                        : e.jsxs(e.Fragment, {
                                            children: [
                                              e.jsx("div", {
                                                className:
                                                  "w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3",
                                                children: e.jsx(Z, {
                                                  className: "text-gray-400",
                                                  size: 24,
                                                }),
                                              }),
                                              e.jsxs("p", {
                                                className:
                                                  "text-sm text-gray-500 dark:text-slate-400 font-medium",
                                                children: [
                                                  "Click para subir imagen",
                                                  e.jsxs("span", {
                                                    className:
                                                      "text-gray-500 dark:text-slate-400",
                                                    children: [
                                                      " ",
                                                      "o arrastrar y soltar",
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              e.jsx("p", {
                                                className:
                                                  "text-xs text-gray-400 mt-1",
                                                children:
                                                  "PNG, JPG, GIF hasta 5MB",
                                              }),
                                              e.jsx("p", {
                                                className:
                                                  "text-xs text-gray-400 mt-0.5 flex items-center gap-1",
                                                children:
                                                  "Tamaño recomendado: 800x450px (16:9)",
                                              }),
                                            ],
                                          }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className:
                      "p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-900/50 rounded-b-2xl",
                    children: [
                      e.jsx("button", {
                        onClick: d,
                        className:
                          "px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-colors shadow-sm",
                        children: "Cancelar",
                      }),
                      e.jsxs("button", {
                        onClick: C,
                        disabled: M,
                        className:
                          "px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/25 active:scale-95",
                        children: [
                          M
                            ? e.jsx(G, { className: "animate-spin", size: 18 })
                            : I
                              ? e.jsx(Fe, { size: 18 })
                              : e.jsx(pe, { size: 18 }),
                          I ? "Guardar Cambios" : "Crear Evento",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx(pt, {
                isOpen: b,
                onClose: () => v(!1),
                areas: k,
                activeMinistries: n.activeMinistries,
                onSave: (l) => {
                  (j((h) => ({ ...h, activeMinistries: l })), v(!1));
                },
              }),
            ],
          }),
          document.body,
        )
      : null;
  },
  oe = (u) => {
    const c = (new Date(u.getFullYear(), u.getMonth(), 1).getDay() + 6) % 7;
    return Math.ceil((u.getDate() + c) / 7);
  },
  Ut = () => {
    const u = We(),
      {
        userProfile: d,
        isMinistryRestricted: D,
        getAssignedMinistries: c,
      } = xe(),
      f = ge(),
      { users: P, serviceAreas: p } = Oe(),
      [k, T] = t.useState([]),
      [U, x] = t.useState([]),
      [M, o] = t.useState(!0),
      [b, v] = t.useState(!1),
      [n, j] = t.useState(!1),
      [z, m] = t.useState(!1),
      [S, E] = t.useState(!1),
      [$, I] = t.useState({ isOpen: !1, event: null }),
      [R, O] = t.useState(!1),
      [s, C] = t.useState(null),
      l = P.map((a) => ({
        uid: a.id,
        displayName: a.name,
        email: a.email || "",
        photoURL: a.photoURL,
        role: a.role,
      })),
      [h, i] = t.useState(""),
      [N, r] = t.useState(new Date().getFullYear().toString()),
      [w, A] = t.useState("all"),
      [L, He] = t.useState("all"),
      [ie, fe] = t.useState("all"),
      _e =
        ["master_admin", "admin", "ministry_admin"].includes(d?.role || "") ||
        (d?.role || "").startsWith("ministry_admin_"),
      be = d?.role === "master_admin" || d?.role === "admin",
      ee = t.useMemo(() => {
        if (D()) return c();
        const a = Array.isArray(d?.areas) ? d?.areas : [];
        if (a.length === 0) return [];
        const g = new Map(p.map((y) => [ke(y.name), y.id]));
        return a.map((y) => g.get(ke(y))).filter(Boolean);
      }, [c, D, p, d?.areas]),
      H = t.useMemo(() => {
        if (be || et(d, p)) return k;
        const a = tt(p);
        return k.filter((g) => {
          const y = Array.isArray(g?.activeMinistries)
            ? g.activeMinistries
            : [];
          return y.length === 0
            ? !0
            : a && ee.includes(a)
              ? y.includes(a)
              : ee.length === 0
                ? !1
                : y.some((B) => ee.includes(B));
        });
      }, [k, be, p, ee, d]),
      Be = async (a) => {
        try {
          if (ae()) {
            const g = await Y("/api/notify/users", {
              method: "POST",
              body: JSON.stringify({
                userIds: a.selectedUserIds,
                title: a.title,
                body: a.message,
                data: { url: "/dashboard" },
              }),
            });
            g && g.success
              ? f.showSuccess(`Notificación enviada a ${g.sent} usuarios`)
              : f.showError("Hubo un error al enviar las notificaciones.");
          } else
            (console.log("Simulating notification in dev mode"),
              await new Promise((g) => setTimeout(g, 1e3)),
              f.showSuccess(
                `Notificación simulada a ${a.selectedUserIds.length} usuarios (BFF disabled)`,
              ));
        } catch (g) {
          (console.error("Error sending user notifications:", g),
            f.showError("Error al enviar notificaciones."));
        }
      },
      Ge = async (a) => {
        try {
          if (ae()) {
            const g = await Y("/api/notify/all", {
              method: "POST",
              body: JSON.stringify({
                title: a.title,
                body: a.message,
                data: { url: "/dashboard" },
              }),
            });
            g && g.success
              ? f.showSuccess("Notificación masiva enviada correctamente.")
              : f.showError("Hubo un error al enviar la notificación masiva.");
          } else
            (console.log("Simulating broadcast in dev mode"),
              await new Promise((g) => setTimeout(g, 1e3)),
              f.showSuccess("Notificación masiva simulada (BFF disabled)"));
        } catch (g) {
          (console.error("Error sending notify all:", g),
            f.showError("Error al enviar notificación masiva."));
        }
      };
    (t.useEffect(() => {
      o(!0);
      const a = me(Q(_, "events"), ue("date", "desc"), Ze(25)),
        g = we(
          a,
          (y) => {
            const B = y.docs.map((q) => ({ id: q.id, ...q.data() }));
            (T(B), o(!1));
          },
          (y) => {
            (console.error("Error listening to events:", y), o(!1));
          },
        );
      return () => g();
    }, []),
      t.useEffect(() => {
        if (H.length === 0) {
          x([]);
          return;
        }
        const a = [];
        return (
          H.map((y) => y.id)
            .slice(0, 10)
            .forEach((y) => {
              const B = Q(_, "events", y, "assignments"),
                q = we(
                  B,
                  (K) => {
                    const Ne = K.docs.map((te) => ({
                      id: te.id,
                      eventId: y,
                      ...te.data(),
                    }));
                    x((te) => [...te.filter((Ve) => Ve.eventId !== y), ...Ne]);
                  },
                  (K) => {
                    console.warn(`Error listening assignments for ${y}`, K);
                  },
                );
              a.push(q);
            }),
          () => {
            a.forEach((y) => y());
          }
        );
      }, [H]));
    const [ve, qe] = t.useState(!1);
    t.useEffect(() => {
      if (H.length > 0 && !ve) {
        const a = H[0];
        if (a && a.date) {
          const g = new Date(a.date + "T12:00:00");
          (r(g.getFullYear().toString()), A(g.getMonth().toString()));
          const y = oe(g).toString();
          fe(y);
        }
        qe(!0);
      }
    }, [H, ve]);
    const ye = () => {},
      je = H.filter((a) => {
        const g = (a.title || "").toLowerCase().includes(h.toLowerCase()),
          y = new Date(a.date + "T" + (a.time || "00:00")),
          B = N === "all" || y.getFullYear().toString() === N,
          q = w === "all" || y.getMonth().toString() === w,
          K = oe(y).toString();
        return g && B && q && (ie === "all" || K === ie);
      }),
      Je = [...je].sort((a, g) => {
        const y = new Date(a.date + "T" + (a.time || "00:00")).getTime();
        return new Date(g.date + "T" + (g.time || "00:00")).getTime() - y;
      }),
      ne = {
        years: Array.from(new Set(H.map((a) => a.date?.split("-")[0])))
          .filter(Boolean)
          .sort()
          .reverse(),
        months: Array.from(
          new Set(H.map((a) => new Date(a.date + "T12:00:00").getMonth())),
        ).sort((a, g) => a - g),
        weeks: Array.from(
          new Set(
            H.map((a) => {
              const g = new Date(a.date + "T12:00:00");
              return oe(g).toString();
            }),
          ),
        ).sort(),
      },
      Ye = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
    return e.jsxs("div", {
      className: "space-y-8",
      children: [
        e.jsxs("div", {
          className:
            "flex flex-col md:flex-row md:items-center justify-between gap-6",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-4",
              children: [
                e.jsx("div", {
                  className:
                    "w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20",
                  children: e.jsx(F, { className: "text-white", size: 24 }),
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h1", {
                      className:
                        "text-2xl font-bold text-gray-900 dark:text-white",
                      children: "Eventos",
                    }),
                    e.jsxs("p", {
                      className: "text-gray-500 dark:text-slate-400 text-sm",
                      children: [je.length, " eventos programados"],
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                d?.role === "master_admin" &&
                  e.jsxs("button", {
                    onClick: () => m(!0),
                    className:
                      "px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 font-medium flex items-center gap-2 transition-all shadow-sm",
                    children: [e.jsx(xt, { size: 18 }), "Plantillas"],
                  }),
                _e &&
                  e.jsxs("button", {
                    onClick: () => {
                      (C(null), E(!0));
                    },
                    className:
                      "px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 font-medium transition-all active:scale-95",
                    children: [e.jsx(pe, { size: 20 }), "Nuevo Evento"],
                  }),
              ],
            }),
          ],
        }),
        e.jsxs("div", {
          className:
            "bg-white dark:bg-slate-800 p-2 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm",
          children: [
            e.jsxs("div", {
              className: "flex flex-col lg:flex-row gap-2 p-2",
              children: [
                e.jsxs("div", {
                  className: "flex-1 relative",
                  children: [
                    e.jsx(Le, {
                      className:
                        "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
                      size: 20,
                    }),
                    e.jsx("input", {
                      type: "text",
                      placeholder: "Buscar eventos...",
                      value: h,
                      onChange: (a) => i(a.target.value),
                      className:
                        "w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none",
                    }),
                  ],
                }),
                d?.role === "master_admin" &&
                  e.jsx("div", {
                    className: "flex flex-wrap gap-2",
                    children: e.jsxs("button", {
                      onClick: () => {
                        v(!0);
                      },
                      className:
                        "px-4 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm shadow-fuchsia-500/20",
                      children: [e.jsx(re, { size: 18 }), "Notificar usuarios"],
                    }),
                  }),
              ],
            }),
            e.jsxs("div", {
              className:
                "flex flex-wrap items-center gap-3 p-2 pt-0 border-t border-gray-50 dark:border-slate-700/50 mt-2",
              children: [
                e.jsx("div", {
                  className: "w-48",
                  children: e.jsx(J, {
                    value: L,
                    onChange: He,
                    options: [
                      {
                        value: "all",
                        label: "Todos los tipos",
                        icon: e.jsx(gt, {
                          size: 16,
                          className: "text-purple-500",
                        }),
                      },
                      {
                        value: "service",
                        label: "Servicios",
                        icon: e.jsx(F, {
                          size: 16,
                          className: "text-purple-500",
                        }),
                      },
                      {
                        value: "meeting",
                        label: "Reuniones",
                        icon: e.jsx(re, {
                          size: 16,
                          className: "text-purple-500",
                        }),
                      },
                      {
                        value: "special",
                        label: "Especiales",
                        icon: e.jsx(he, {
                          size: 16,
                          className: "text-purple-500",
                        }),
                      },
                    ],
                    placeholder: "Tipo",
                  }),
                }),
                e.jsx("div", {
                  className: "w-32",
                  children: e.jsx(J, {
                    value: N,
                    onChange: r,
                    options: [
                      {
                        value: "all",
                        label: "Todos",
                        icon: e.jsx(F, {
                          size: 16,
                          className: "text-purple-500",
                        }),
                      },
                      ...ne.years.map((a) => ({
                        value: a,
                        label: a,
                        icon: e.jsx(F, {
                          size: 16,
                          className: "text-purple-500",
                        }),
                      })),
                    ],
                    placeholder: "Año",
                  }),
                }),
                e.jsx("div", {
                  className: "w-40",
                  children: e.jsx(J, {
                    value: w,
                    onChange: A,
                    options: [
                      {
                        value: "all",
                        label: "Todo el año",
                        icon: e.jsx(F, {
                          size: 16,
                          className: "text-purple-500",
                        }),
                      },
                      ...ne.months.map((a) => ({
                        value: a.toString(),
                        label: Ye[a],
                        icon: e.jsx(F, {
                          size: 16,
                          className: "text-purple-500",
                        }),
                      })),
                    ],
                    placeholder: "Mes",
                  }),
                }),
                e.jsx("div", {
                  className: "w-44",
                  children: e.jsx(J, {
                    value: ie,
                    onChange: fe,
                    options: [
                      {
                        value: "all",
                        label: "Todas las semanas",
                        icon: e.jsx(F, {
                          size: 16,
                          className: "text-emerald-500",
                        }),
                      },
                      ...ne.weeks.map((a) => ({
                        value: a,
                        label: `Semana ${a}`,
                        icon: e.jsx(F, {
                          size: 16,
                          className: "text-emerald-500",
                        }),
                      })),
                    ],
                    placeholder: "Semana",
                  }),
                }),
              ],
            }),
          ],
        }),
        M
          ? e.jsx("div", {
              className: "flex justify-center py-12",
              children: e.jsx(G, {
                className: "w-8 h-8 animate-spin text-indigo-600",
              }),
            })
          : e.jsx(at, {
              events: Je,
              assignments: U,
              navigate: u,
              variant: "detailed",
              onEdit:
                d?.role === "master_admin"
                  ? (a) => {
                      (C(a), E(!0));
                    }
                  : void 0,
              onDelete:
                d?.role === "master_admin"
                  ? (a) => I({ isOpen: !0, event: a })
                  : void 0,
            }),
        e.jsx(ht, { isOpen: b, onClose: () => v(!1), users: l, onSend: Be }),
        e.jsx(ft, { isOpen: n, onClose: () => j(!1), onSend: Ge }),
        e.jsx(bt, { isOpen: z, onClose: () => m(!1) }),
        e.jsx(jt, {
          isOpen: S,
          onClose: () => {
            (E(!1), C(null));
          },
          onEventCreated: ye,
          eventToEdit: s,
        }),
        e.jsx(st, {
          isOpen: $.isOpen,
          onClose: () => I({ isOpen: !1, event: null }),
          title: "Eliminar Evento",
          children: e.jsxs("div", {
            className: "space-y-4",
            children: [
              e.jsxs("p", {
                className: "text-gray-600 dark:text-slate-300",
                children: [
                  '¿Estás seguro de que deseas eliminar el evento "',
                  e.jsx("span", {
                    className: "font-semibold text-gray-900 dark:text-white",
                    children: $.event?.title,
                  }),
                  '"? Esta acción no se puede deshacer.',
                ],
              }),
              e.jsxs("div", {
                className: "flex justify-end gap-3 pt-2",
                children: [
                  e.jsx("button", {
                    onClick: () => I({ isOpen: !1, event: null }),
                    className:
                      "px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors",
                    children: "Cancelar",
                  }),
                  e.jsx("button", {
                    onClick: async () => {
                      const a = $.event;
                      if (a) {
                        O(!0);
                        try {
                          if (ae()) {
                            if (
                              !(
                                await Y(`/api/events/${a.id}`, {
                                  method: "DELETE",
                                })
                              )?.ok
                            )
                              throw new Error("Error deleting event via BFF");
                          } else await Pe(X(_, "events", a.id));
                          (f.showSuccess("Evento eliminado correctamente"),
                            ye());
                        } catch (g) {
                          (console.error("Error deleting event:", g),
                            f.showError("Error al eliminar el evento"));
                        } finally {
                          (O(!1), I({ isOpen: !1, event: null }));
                        }
                      }
                    },
                    disabled: R,
                    className:
                      "px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/30 flex items-center gap-2",
                    children: R
                      ? e.jsxs(e.Fragment, {
                          children: [
                            e.jsx(G, { className: "w-4 h-4 animate-spin" }),
                            e.jsx("span", { children: "Eliminando..." }),
                          ],
                        })
                      : "Eliminar",
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    });
  };
export { Ut as Events };
