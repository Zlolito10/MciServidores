// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import {
  r as React,
  d as useParams,
  u as useNavigate,
} from "../vendor/vendor-react-BwINE3B3.js";
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
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  useAuth,
  useAppDialog,
  firestoreDb,
  firebaseStorage,
  useGlobalData,
  isBffEnabled,
  bffFetch,
  normalizeMinistryName,
  hasOtherMinistries,
  getUdlvMinistryId,
  Modal,
} from "../app/App.jsx";
import { EventsGrid } from "../components/EventsGrid.jsx";
import { SelectPicker } from "../components/SelectPicker.jsx";
import {
  X as XIcon,
  w as SearchIcon,
  C as CheckIcon,
  L as LoaderCircleIcon,
  z as SendIcon,
  B as MegaphoneIcon,
  D as BellIcon,
  s as ClockIcon,
  F as ChevronUpIcon,
  x as ChevronDownIcon,
  P as PlusIcon,
  I as ImageIcon,
  r as Trash2Icon,
  J as TypeIcon,
  n as MapPinIcon,
  d as CalendarIcon,
  f as UsersIcon,
  K as StarIcon,
  N as SaveIcon,
  O as ChevronLeftIcon,
  Q as ChevronRightIcon,
  R as SparklesIcon,
  j as SettingsIcon,
  V as LayoutGridIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import { ManageMinistriesModal } from "../components/ManageMinistriesModal.jsx";
import "../vendor/vendor-pdf-Cf03QSry.js";
const RenderComponent2 = ({ isOpen: u, onClose: d, users: D, onSend: c }) => {
  const [f, P] = React.useState("📢 Notificación"),
    [p, k] = React.useState(""),
    [T, U] = React.useState(""),
    [x, M] = React.useState([]),
    [o, b] = React.useState(!1),
    v = React.useMemo(() => {
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
          (await c({
            title: f,
            message: p,
            selectedUserIds: x,
          }),
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
    ? useParams.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {[
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={d}
            />,
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
              {[
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
                  {[
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {"Notificar Usuarios Específicos"}
                    </h2>,
                    <button
                      onClick={d}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500"
                    >
                      <XIcon size={20} />
                    </button>,
                  ]}
                </div>,
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {[
                    <div className="space-y-2">
                      {[
                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                          {"Título *"}
                        </label>,
                        <div className="relative">
                          <input
                            type="text"
                            value={f}
                            onChange={(m) => P(m.target.value)}
                            className="w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none font-medium"
                            placeholder="Título de la notificación"
                          />
                        </div>,
                      ]}
                    </div>,
                    <div className="space-y-2">
                      {[
                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                          {"Mensaje *"}
                        </label>,
                        <textarea
                          value={p}
                          onChange={(m) => k(m.target.value)}
                          className="w-full p-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none h-32"
                          placeholder="Escribe el mensaje de la notificación"
                        />,
                        <div className="text-right text-xs text-gray-400">
                          {[p.length, "/300"]}
                        </div>,
                      ]}
                    </div>,
                    <div className="space-y-3">
                      {[
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                            {[
                              "Seleccionar Usuarios (",
                              x.length,
                              " seleccionados)",
                            ]}
                          </label>
                        </div>,
                        <div className="relative">
                          {[
                            <SearchIcon
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              size={18}
                            />,
                            <input
                              type="text"
                              value={T}
                              onChange={(m) => U(m.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all outline-none"
                              placeholder="Buscar por nombre o email..."
                            />,
                          ]}
                        </div>,
                        <div className="flex justify-end">
                          <button
                            onClick={j}
                            className="text-xs px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                          >
                            {x.length === v.length
                              ? "Deseleccionar todos"
                              : "Seleccionar todos"}
                          </button>
                        </div>,
                        <div className="border border-gray-200 dark:border-slate-700 rounded-xl max-h-[200px] overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar">
                          {v.length > 0 ? (
                            v.map((m) =>
                              jsxRuntime.jsxs(
                                "div",
                                {
                                  onClick: () => n(m.uid),
                                  className:
                                    "flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer border-b border-gray-100 dark:border-slate-800 last:border-0 transition-colors",
                                  children: [
                                    <div
                                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${x.includes(m.uid) ? "bg-purple-600 border-purple-600" : "border-gray-300 dark:border-slate-600"}`}
                                    >
                                      {x.includes(m.uid) && (
                                        <CheckIcon
                                          size={14}
                                          className="text-white"
                                        />
                                      )}
                                    </div>,
                                    <div className="flex-1 min-w-0">
                                      {[
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {m.displayName ||
                                            "Usuario sin nombre"}
                                        </p>,
                                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                          {m.email?.replace(
                                            /@church\.app$/i,
                                            "",
                                          )}
                                        </p>,
                                      ]}
                                    </div>,
                                  ],
                                },
                                m.uid,
                              ),
                            )
                          ) : (
                            <div className="p-4 text-center text-sm text-gray-500">
                              {"No se encontraron usuarios"}
                            </div>
                          )}
                        </div>,
                      ]}
                    </div>,
                  ]}
                </div>,
                <div className="p-6 pt-2 border-t border-transparent">
                  <button
                    onClick={z}
                    disabled={o || !f.trim() || !p.trim() || x.length === 0}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25 active:scale-95"
                  >
                    {[
                      o ? (
                        <LoaderCircleIcon className="animate-spin" size={20} />
                      ) : (
                        <SendIcon size={18} />
                      ),
                      o ? "Enviando..." : "Enviar Notificación",
                    ]}
                  </button>
                </div>,
              ]}
            </div>,
          ]}
        </div>,
        document.body,
      )
    : null;
};
const RenderComponent3 = ({ isOpen: u, onClose: d, onSend: D }) => {
  const [c, f] = React.useState("📢 Aviso General"),
    [P, p] = React.useState(""),
    [k, T] = React.useState(!1),
    U = async () => {
      if (!(!c.trim() || !P.trim())) {
        T(!0);
        try {
          (await D({
            title: c,
            message: P,
          }),
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
    ? useParams.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {[
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={d}
            />,
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
              {[
                <div className="flex items-center justify-between p-6 pb-2">
                  {[
                    <div className="flex items-center gap-3">
                      {[
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                          <MegaphoneIcon
                            size={24}
                            className="transform -rotate-12"
                          />
                        </div>,
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {"Notificar a Todos los Servidores"}
                        </h2>,
                      ]}
                    </div>,
                    <button
                      onClick={d}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500"
                    >
                      <XIcon size={20} />
                    </button>,
                  ]}
                </div>,
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {
                      "Esta notificación se enviará a todos los servidores que tengan las notificaciones activadas."
                    }
                  </p>
                </div>,
                <div className="p-6 pt-2 space-y-5">
                  {[
                    <div className="space-y-2">
                      {[
                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                          {"Título"}
                        </label>,
                        <div className="relative">
                          {[
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500">
                              <MegaphoneIcon size={18} />
                            </div>,
                            <input
                              type="text"
                              value={c}
                              onChange={(x) => f(x.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none font-medium"
                              placeholder="Título del aviso"
                            />,
                          ]}
                        </div>,
                      ]}
                    </div>,
                    <div className="space-y-2">
                      {[
                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                          {"Mensaje"}
                        </label>,
                        <textarea
                          value={P}
                          onChange={(x) => p(x.target.value)}
                          className="w-full p-4 bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none resize-none h-32"
                          placeholder="Escribe el mensaje borrar..."
                        />,
                      ]}
                    </div>,
                  ]}
                </div>,
                <div className="p-6 pt-2 border-t border-transparent flex justify-end gap-3">
                  {[
                    <button
                      onClick={d}
                      className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      {"Cancelar"}
                    </button>,
                    <button
                      onClick={U}
                      disabled={k || !c.trim() || !P.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-500/25 active:scale-95"
                    >
                      {[
                        k ? (
                          <LoaderCircleIcon
                            className="animate-spin"
                            size={18}
                          />
                        ) : (
                          <BellIcon size={18} />
                        ),
                        k ? "Enviando..." : "Enviar Notificación",
                      ]}
                    </button>,
                  ]}
                </div>,
              ]}
            </div>,
          ]}
        </div>,
        document.body,
      )
    : null;
};
const W = ({
  value: u,
  onChange: d,
  label: D,
  color: c = "indigo",
  required: f = !1,
}) => {
  const [P, p] = React.useState(!1),
    [k, T] = React.useState(u ? u.split(":")[0] : "12"),
    [U, x] = React.useState(u ? u.split(":")[1] : "00"),
    M = React.useRef(null),
    o = React.useRef(k),
    b = React.useRef(U),
    v = React.useRef(null),
    n = React.useRef(null),
    j = React.useRef(!1),
    z = React.useRef(!1);
  (React.useEffect(() => {
    if (u) {
      const [r, w] = u.split(":");
      (T(r), x(w));
    }
  }, [u]),
    React.useEffect(() => {
      ((o.current = k), (b.current = U));
    }, [k, U]),
    React.useEffect(() => {
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
  React.useEffect(
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
  return (
    <div className="relative" ref={M}>
      {[
        D && (
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              {[
                <span className={`w-2 h-2 rounded-full ${i.dot}`} />,
                D,
                f && <span className="text-red-500">{"*"}</span>,
              ]}
            </span>
          </label>
        ),
        <div
          onClick={() => p(!P)}
          className={`relative flex items-center justify-between w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2.5 cursor-pointer bg-white dark:bg-slate-700 transition-all ${i.ring} ${P ? "ring-2" : ""}`}
        >
          {[
            <span
              className={`text-sm font-medium ${u ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
            >
              {N}
            </span>,
            <ClockIcon size={16} className={i.icon} />,
          ]}
        </div>,
        P && (
          <div className="absolute z-[99999] mt-2 min-w-[250px] left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 animate-in fade-in zoom-in-95 duration-150">
            {[
              <div className="flex items-center justify-center gap-4">
                {[
                  <div className="flex flex-col items-center">
                    {[
                      <button
                        type="button"
                        {...R(O)}
                        className={`p-1.5 rounded-lg transition-colors touch-none select-none ${i.button}`}
                      >
                        <ChevronUpIcon size={20} />
                      </button>,
                      <div
                        className={`w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-xl ${i.selected}`}
                      >
                        {k}
                      </div>,
                      <button
                        type="button"
                        {...R(s)}
                        className={`p-1.5 rounded-lg transition-colors touch-none select-none ${i.button}`}
                      >
                        <ChevronDownIcon size={20} />
                      </button>,
                      <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {"Horas"}
                      </span>,
                    ]}
                  </div>,
                  <div className="text-3xl font-bold text-gray-400 dark:text-slate-500 mb-6">
                    {":"}
                  </div>,
                  <div className="flex flex-col items-center">
                    {[
                      <button
                        type="button"
                        {...R(C)}
                        className={`p-1.5 rounded-lg transition-colors touch-none select-none ${i.button}`}
                      >
                        <ChevronUpIcon size={20} />
                      </button>,
                      <div
                        className={`w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-xl ${i.selected}`}
                      >
                        {U}
                      </div>,
                      <button
                        type="button"
                        {...R(l)}
                        className={`p-1.5 rounded-lg transition-colors touch-none select-none ${i.button}`}
                      >
                        <ChevronDownIcon size={20} />
                      </button>,
                      <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {"Minutos"}
                      </span>,
                    ]}
                  </div>,
                ]}
              </div>,
              <button
                type="button"
                onClick={(r) => {
                  (r.stopPropagation(), p(!1));
                }}
                className={`w-full mt-3 py-2 rounded-lg font-medium text-white transition-colors ${c === "emerald" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-indigo-500 hover:bg-indigo-600"}`}
              >
                {"Confirmar"}
              </button>,
            ]}
          </div>
        ),
      ]}
    </div>
  );
};
const Te = {
  name: "",
  defaultTitle: "",
  defaultLocation: "",
  serviceTime: "",
  time: "",
  endTime: "",
  type: "service",
  description: "",
  imageUrl: "",
};
const RenderComponent4 = ({ isOpen: u, onClose: d }) => {
  const { userProfile: D } = useAuth(),
    c = useAppDialog(),
    [f, P] = React.useState([]),
    [p, k] = React.useState(!1),
    [T, U] = React.useState(!1),
    [x, M] = React.useState(null),
    [o, b] = React.useState(Te),
    [v, n] = React.useState(null),
    [j, z] = React.useState(""),
    m = React.useRef(null),
    [S, E] = React.useState("list"),
    $ = async () => {
      k(!0);
      try {
        const s = me(Q(firestoreDb, "event_templates"), ue("name")),
          l = (await Ue(s)).docs.map((h) => ({
            id: h.id,
            ...h.data(),
          }));
        P(l);
      } catch (s) {
        (console.error("Error fetching templates:", s),
          c.showError("Error al cargar plantillas"));
      } finally {
        k(!1);
      }
    };
  (React.useEffect(() => {
    u && ($(), E("list"));
  }, [u]),
    React.useEffect(() => {
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
        const s = x || X(Q(firestoreDb, "event_templates")).id;
        let C = o.imageUrl;
        if (v) {
          const h = Ie(
            firebaseStorage,
            `event-template-images/${s}/${Date.now()}_${v.name}`,
          );
          (await Ae(h, v), (C = await $e(h)));
        }
        const l = {
          ...o,
          imageUrl: C,
          updatedAt: de(),
          updatedBy: D?.uid,
        };
        (await Qe(X(firestoreDb, "event_templates", s), l, {
          merge: !0,
        }),
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
          (await Pe(X(firestoreDb, "event_templates", s)),
            c.showSuccess("Plantilla eliminada"),
            x === s && M(null),
            $());
        } catch (l) {
          (console.error("Error deleting template:", l),
            c.showError("Error al eliminar plantilla"));
        }
    };
  return u
    ? useParams.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {[
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={d}
            />,
            <div className="relative w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row h-[90dvh] md:h-[85vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
              {[
                <div
                  className={`${S === "list" ? "flex" : "hidden"} md:flex w-full md:w-80 h-full border-r border-gray-100 dark:border-slate-700 flex-col bg-gray-50/50 dark:bg-slate-900/50`}
                >
                  {[
                    <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                      {[
                        <button
                          onClick={d}
                          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
                        >
                          <XIcon size={20} />
                        </button>,
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white flex-1">
                          {"Plantillas"}
                        </h2>,
                        <button
                          onClick={() => {
                            (M(null), E("editor"));
                          }}
                          className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          {[<PlusIcon size={16} />, "Nueva"]}
                        </button>,
                      ]}
                    </div>,
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {p ? (
                        <div className="flex justify-center py-8">
                          <LoaderCircleIcon className="animate-spin text-gray-400" />
                        </div>
                      ) : f.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          {"No hay plantillas"}
                        </div>
                      ) : (
                        f.map((s) =>
                          jsxRuntime.jsxs(
                            "div",
                            {
                              onClick: () => {
                                (M(s.id), E("editor"));
                              },
                              className: `group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${x === s.id ? "bg-white dark:bg-slate-800 shadow-md ring-1 ring-gray-200 dark:ring-slate-700" : "hover:bg-white/60 dark:hover:bg-slate-800/60"}`,
                              children: [
                                <div
                                  className={`w-10 h-10 rounded-lg flex-shrink-0 bg-cover bg-center bg-gray-200 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 overflow-hidden ${!s.imageThumbUrl && !s.imageUrl ? "flex items-center justify-center" : ""}`}
                                  style={
                                    s.imageThumbUrl || s.imageUrl
                                      ? {
                                          backgroundImage: `url(${s.imageThumbUrl || s.imageUrl})`,
                                        }
                                      : {}
                                  }
                                >
                                  {!s.imageThumbUrl && !s.imageUrl && (
                                    <ImageIcon
                                      size={18}
                                      className="text-gray-400"
                                    />
                                  )}
                                </div>,
                                <div className="flex-1 min-w-0">
                                  {[
                                    <p
                                      className={`text-sm font-semibold truncate ${x === s.id ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-slate-300"}`}
                                    >
                                      {s.name}
                                    </p>,
                                    <p className="text-xs text-gray-500 truncate">
                                      {s.defaultTitle || "Sin título"}
                                    </p>,
                                  ]}
                                </div>,
                                <button
                                  onClick={(C) => {
                                    (C.stopPropagation(), O(s.id));
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-all"
                                >
                                  <Trash2Icon size={14} />
                                </button>,
                              ],
                            },
                            s.id,
                          ),
                        )
                      )}
                    </div>,
                  ]}
                </div>,
                <div
                  className={`${S === "editor" ? "flex" : "hidden"} md:flex flex-1 flex-col h-full bg-white dark:bg-slate-800 relative z-0`}
                >
                  {[
                    <div className="p-4 md:p-6 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
                      {[
                        <button
                          onClick={() => E("list")}
                          className="md:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-500"
                        >
                          <XIcon size={20} />
                        </button>,
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex-1">
                          {x ? "Editar Plantilla" : "Nueva Plantilla"}
                        </h3>,
                        <button
                          onClick={d}
                          className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400"
                        >
                          <XIcon size={20} />
                        </button>,
                      ]}
                    </div>,
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {[
                        <div className="space-y-2">
                          {[
                            <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                              {[
                                "Nombre de la Plantilla ",
                                <span className="text-red-500">{"*"}</span>,
                              ]}
                            </label>,
                            <input
                              type="text"
                              value={o.name}
                              onChange={(s) =>
                                b({
                                  ...o,
                                  name: s.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                              placeholder="Ej: Somos Uno (Mañana)"
                            />,
                          ]}
                        </div>,
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            <div className="space-y-2">
                              {[
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                                  {"Título por defecto"}
                                </label>,
                                <div className="relative">
                                  {[
                                    <TypeIcon
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                      size={16}
                                    />,
                                    <input
                                      type="text"
                                      value={o.defaultTitle}
                                      onChange={(s) =>
                                        b({
                                          ...o,
                                          defaultTitle: s.target.value,
                                        })
                                      }
                                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                                      placeholder="Título del evento"
                                    />,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                            <div className="space-y-2">
                              {[
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                                  {"Ubicación"}
                                </label>,
                                <div className="relative">
                                  {[
                                    <MapPinIcon
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                      size={16}
                                    />,
                                    <input
                                      type="text"
                                      value={o.defaultLocation}
                                      onChange={(s) =>
                                        b({
                                          ...o,
                                          defaultLocation: s.target.value,
                                        })
                                      }
                                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                                      placeholder="Seleccione o escriba..."
                                    />,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            <div className="space-y-1">
                              <W
                                label="Hora Servicio"
                                value={o.serviceTime}
                                onChange={(s) =>
                                  b({
                                    ...o,
                                    serviceTime: s,
                                  })
                                }
                                color="emerald"
                              />
                            </div>,
                            <div className="space-y-1">
                              <W
                                label="Inicio Evento"
                                value={o.time}
                                onChange={(s) =>
                                  b({
                                    ...o,
                                    time: s,
                                  })
                                }
                                color="indigo"
                              />
                            </div>,
                            <div className="space-y-1">
                              <W
                                label="Fin Evento"
                                value={o.endTime}
                                onChange={(s) =>
                                  b({
                                    ...o,
                                    endTime: s,
                                  })
                                }
                                color="indigo"
                              />
                            </div>,
                          ]}
                        </div>,
                        <div className="space-y-2">
                          <SelectPicker
                            label="Tipo"
                            value={o.type}
                            onChange={(s) =>
                              b({
                                ...o,
                                type: s,
                              })
                            }
                            placeholder="Seleccione un tipo..."
                            options={[
                              {
                                value: "service",
                                label: "Servicio General",
                                icon: (
                                  <CalendarIcon
                                    size={16}
                                    className="text-purple-500"
                                  />
                                ),
                              },
                              {
                                value: "meeting",
                                label: "Reunión",
                                icon: (
                                  <UsersIcon
                                    size={16}
                                    className="text-purple-500"
                                  />
                                ),
                              },
                              {
                                value: "special",
                                label: "Evento Especial",
                                icon: (
                                  <StarIcon
                                    size={16}
                                    className="text-purple-500"
                                  />
                                ),
                              },
                            ]}
                          />
                        </div>,
                        <div className="space-y-2">
                          {[
                            <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                              {"Descripción por defecto"}
                            </label>,
                            <textarea
                              value={o.description}
                              onChange={(s) =>
                                b({
                                  ...o,
                                  description: s.target.value,
                                })
                              }
                              className="w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none resize-none h-24"
                              placeholder="Descripción..."
                            />,
                          ]}
                        </div>,
                        <div className="space-y-2">
                          {[
                            <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                              {"Imagen por defecto"}
                            </label>,
                            <div
                              onClick={() => m.current?.click()}
                              className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors h-48 relative overflow-hidden group"
                            >
                              {[
                                <input
                                  type="file"
                                  ref={m}
                                  className="hidden"
                                  accept="image/png, image/jpeg, image/gif, image/webp"
                                  onChange={I}
                                />,
                                j ? (
                                  <jsxRuntime.Fragment>
                                    {[
                                      <img
                                        src={j}
                                        alt="Preview"
                                        className="absolute inset-0 w-full h-full object-cover"
                                      />,
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white font-medium flex items-center gap-2">
                                          {[
                                            <ImageIcon size={20} />,
                                            " Cambiar imagen",
                                          ]}
                                        </p>
                                      </div>,
                                    ]}
                                  </jsxRuntime.Fragment>
                                ) : (
                                  <jsxRuntime.Fragment>
                                    {[
                                      <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                                        <ImageIcon
                                          className="text-gray-400"
                                          size={24}
                                        />
                                      </div>,
                                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                        {[
                                          "Subir un archivo",
                                          <span className="text-gray-500 dark:text-slate-400">
                                            {[" ", "o arrastrar y soltar"]}
                                          </span>,
                                        ]}
                                      </p>,
                                      <p className="text-xs text-gray-400 mt-1">
                                        {"PNG, JPG, GIF hasta 5MB"}
                                      </p>,
                                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                        {"Tamaño recomendado: 800x450px (16:9)"}
                                      </p>,
                                    ]}
                                  </jsxRuntime.Fragment>
                                ),
                              ]}
                            </div>,
                          ]}
                        </div>,
                      ]}
                    </div>,
                    <div className="p-4 md:p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-2 md:gap-3 bg-gray-50/50 dark:bg-slate-900/50 md:rounded-br-2xl">
                      {[
                        x && (
                          <button
                            onClick={() => O(x)}
                            className="mr-auto text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            {[
                              <Trash2Icon size={18} />,
                              <span className="hidden md:inline">
                                {"Eliminar Plantilla"}
                              </span>,
                              <span className="md:hidden">{"Eliminar"}</span>,
                            ]}
                          </button>
                        ),
                        <button
                          onClick={() => {
                            window.innerWidth < 768 && S === "editor"
                              ? E("list")
                              : d();
                          }}
                          className="px-4 md:px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-colors shadow-sm text-sm md:text-base"
                        >
                          {[
                            <span className="md:hidden">
                              {S === "editor" ? "Volver" : "Cancelar"}
                            </span>,
                            <span className="hidden md:inline">
                              {"Cancelar"}
                            </span>,
                          ]}
                        </button>,
                        <button
                          onClick={R}
                          disabled={T}
                          className="px-4 md:px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/25 active:scale-95 text-sm md:text-base"
                        >
                          {[
                            T ? (
                              <LoaderCircleIcon
                                className="animate-spin"
                                size={18}
                              />
                            ) : (
                              <SaveIcon size={18} />
                            ),
                            <span className="hidden md:inline">
                              {x ? "Guardar Cambios" : "Guardar Plantilla"}
                            </span>,
                            <span className="md:hidden">{"Guardar"}</span>,
                          ]}
                        </button>,
                      ]}
                    </div>,
                  ]}
                </div>,
              ]}
            </div>,
          ]}
        </div>,
        document.body,
      )
    : null;
};
const vt = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const Me = [
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
const ze = (u, d, D) => {
  const c = String(d + 1).padStart(2, "0"),
    f = String(D).padStart(2, "0");
  return `${u}-${c}-${f}`;
};
const se = (u) => {
  if (!u) return null;
  const d = u.split("-").map(Number);
  return d.length !== 3
    ? null
    : {
        year: d[0],
        month: d[1] - 1,
        day: d[2],
      };
};
const RenderComponent1 = ({
  value: u,
  onChange: d,
  label: D,
  required: c = !1,
  placeholder: f = "Seleccionar fecha",
}) => {
  const [P, p] = React.useState(!1),
    k = new Date(),
    T = k.getFullYear(),
    U = k.getMonth(),
    x = k.getDate(),
    M = se(u),
    [o, b] = React.useState(M ? M.month : U),
    [v, n] = React.useState(M ? M.year : T),
    j = React.useRef(null);
  (React.useEffect(() => {
    const i = se(u);
    i && (b(i.month), n(i.year));
  }, [u]),
    React.useEffect(() => {
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
  return (
    <div className="relative" ref={j}>
      {[
        D && (
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {[D, c && <span className="text-red-500 ml-1">{"*"}</span>]}
          </label>
        ),
        <div
          onClick={() => p(!P)}
          className={`relative flex items-center justify-between w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2.5 cursor-pointer bg-white dark:bg-slate-700 transition-all focus-within:ring-indigo-500 focus-within:border-indigo-500 ${P ? "ring-2 ring-indigo-500 border-indigo-500" : ""}`}
        >
          {[
            <span
              className={`text-sm font-medium ${u ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
            >
              {u ? R(u) : f}
            </span>,
            <CalendarIcon size={16} className="text-indigo-500" />,
          ]}
        </div>,
        P && (
          <div className="absolute z-[99999] mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 animate-in fade-in zoom-in-95 duration-150 w-72">
            {[
              <div className="flex items-center justify-between mb-4">
                {[
                  <button
                    type="button"
                    onClick={(i) => {
                      (i.stopPropagation(), S());
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors"
                  >
                    <ChevronLeftIcon size={20} />
                  </button>,
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {[Me[o], " ", v]}
                  </span>,
                  <button
                    type="button"
                    onClick={(i) => {
                      (i.stopPropagation(), E());
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors"
                  >
                    <ChevronRightIcon size={20} />
                  </button>,
                ]}
              </div>,
              <div className="grid grid-cols-7 gap-1 mb-2">
                {vt.map((i) => (
                  <div
                    className="text-center text-xs font-medium text-gray-500 dark:text-slate-400 py-1"
                    key={i}
                  >
                    {i}
                  </div>
                ))}
              </div>,
              <div className="grid grid-cols-7 gap-1">
                {[
                  Array.from({
                    length: s,
                  }).map((i, N) => <div className="h-8" key={`empty-${N}`} />),
                  Array.from({
                    length: O,
                  }).map((i, N) => {
                    const r = N + 1,
                      w = h(r),
                      A = l(r);
                    return (
                      <button
                        type="button"
                        onClick={(L) => {
                          (L.stopPropagation(), $(r));
                        }}
                        className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors flex items-center justify-center mx-auto ${w ? "bg-indigo-500 text-white" : A ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
                        key={r}
                      >
                        {r}
                      </button>
                    );
                  }),
                ]}
              </div>,
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 flex justify-between">
                {[
                  <button
                    type="button"
                    onClick={(i) => {
                      (i.stopPropagation(), d(""), p(!1));
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
                  >
                    {"Limpiar"}
                  </button>,
                  <button
                    type="button"
                    onClick={(i) => {
                      (i.stopPropagation(), I());
                    }}
                    className="px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
                  >
                    {"Hoy"}
                  </button>,
                ]}
              </div>,
            ]}
          </div>
        ),
      ]}
    </div>
  );
};
const De = {
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
};
const RenderComponent5 = ({
  isOpen: u,
  onClose: d,
  onEventCreated: D,
  eventToEdit: c,
}) => {
  const { userProfile: f, user: P } = useAuth(),
    p = useAppDialog(),
    { serviceAreas: k } = useGlobalData(),
    [T, U] = React.useState([]),
    [, x] = React.useState(!1),
    [M, o] = React.useState(!1),
    [b, v] = React.useState(!1),
    [n, j] = React.useState(De),
    [z, m] = React.useState(null),
    [S, E] = React.useState(""),
    $ = React.useRef(null),
    I = !!c,
    R = async () => {
      x(!0);
      try {
        const l = me(Q(firestoreDb, "event_templates"), ue("name")),
          i = (await Ue(l)).docs.map((N) => ({
            id: N.id,
            ...N.data(),
          }));
        U(i);
      } catch (l) {
        console.error("Error fetching templates:", l);
      } finally {
        x(!1);
      }
    };
  React.useEffect(() => {
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
      const h = isBffEnabled();
      o(!0);
      try {
        let i = n.imageUrl;
        if (z)
          if (h) {
            const r = new FormData();
            r.append("file", z);
            const w = await bffFetch("/api/events/image", {
              method: "POST",
              body: r,
            });
            if (!w?.ok || !w.imageUrl)
              throw new Error("No se pudo subir la imagen del evento");
            i = w.imageUrl;
          } else {
            const r = Ie(firebaseStorage, `events/${Date.now()}_${z.name}`),
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
          const r = {
            ...N,
            updatedBy: l,
          };
          (h || (r.updatedAt = de()),
            i
              ? ((r.imageUrl = i), (r.imageThumbUrl = i))
              : n.imageUrl === "" &&
                ((r.imageUrl = ""), (r.imageThumbUrl = "")),
            h
              ? await bffFetch(`/api/events/${encodeURIComponent(c.id)}`, {
                  method: "PATCH",
                  json: r,
                })
              : await Ke(X(firestoreDb, "events", c.id), r),
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
            ? await bffFetch("/api/events", {
                method: "POST",
                json: r,
              })
            : await Xe(Q(firestoreDb, "events"), {
                ...r,
                createdAt: de(),
              }),
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
    ? useParams.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {[
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={d}
            />,
            <div className="relative w-full max-w-6xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
              {[
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                  {[
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {I ? "Editar Evento" : "Nuevo Evento"}
                    </h3>,
                    <button
                      onClick={d}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400"
                    >
                      <XIcon size={20} />
                    </button>,
                  ]}
                </div>,
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {[
                    !I && T.length > 0 && (
                      <div className="space-y-3">
                        {[
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                            {[
                              <SparklesIcon
                                size={14}
                                className="text-purple-500"
                              />,
                              "Plantillas Rápidas",
                            ]}
                          </div>,
                          <div className="flex flex-wrap gap-2">
                            {T.map((l) =>
                              jsxRuntime.jsx(
                                "button",
                                {
                                  onClick: () => O(l),
                                  className:
                                    "px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg border border-purple-100 dark:border-purple-800/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors",
                                  children: l.name,
                                },
                                l.id,
                              ),
                            )}
                          </div>,
                        ]}
                      </div>
                    ),
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {[
                        <div className="space-y-6">
                          {[
                            <div className="space-y-2">
                              {[
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                                  {"Título del Evento"}
                                </label>,
                                <input
                                  type="text"
                                  value={n.title}
                                  onChange={(l) =>
                                    j({
                                      ...n,
                                      title: l.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                                  placeholder="Ej: Somos Uno"
                                />,
                              ]}
                            </div>,
                            <div className="space-y-2">
                              <RenderComponent1
                                label="Fecha"
                                required={!0}
                                value={n.date}
                                onChange={(l) =>
                                  j({
                                    ...n,
                                    date: l,
                                  })
                                }
                              />
                            </div>,
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {[
                                <div className="space-y-1">
                                  <W
                                    label="Hora Servicio"
                                    value={n.serviceTime}
                                    onChange={(l) =>
                                      j({
                                        ...n,
                                        serviceTime: l,
                                      })
                                    }
                                    color="emerald"
                                  />
                                </div>,
                                <div className="space-y-1">
                                  <W
                                    label="Inicio de Evento *"
                                    value={n.time}
                                    onChange={(l) =>
                                      j({
                                        ...n,
                                        time: l,
                                      })
                                    }
                                    color="indigo"
                                    required={!0}
                                  />
                                </div>,
                                <div className="space-y-1">
                                  <W
                                    label="Fin de Evento"
                                    value={n.endTime}
                                    onChange={(l) =>
                                      j({
                                        ...n,
                                        endTime: l,
                                      })
                                    }
                                    color="indigo"
                                  />
                                </div>,
                              ]}
                            </div>,
                            <div className="space-y-2">
                              {[
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                                  {"Ubicación"}
                                </label>,
                                <input
                                  type="text"
                                  value={n.location}
                                  onChange={(l) =>
                                    j({
                                      ...n,
                                      location: l.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                                  placeholder="Seleccione o escriba la ubicación"
                                />,
                              ]}
                            </div>,
                            <div className="space-y-2">
                              <SelectPicker
                                label="Tipo de Evento"
                                value={n.type}
                                onChange={(l) =>
                                  j({
                                    ...n,
                                    type: l,
                                  })
                                }
                                options={[
                                  {
                                    value: "service",
                                    label: "Servicio General",
                                    icon: (
                                      <CalendarIcon
                                        size={16}
                                        className="text-purple-500"
                                      />
                                    ),
                                  },
                                  {
                                    value: "meeting",
                                    label: "Reunión",
                                    icon: (
                                      <UsersIcon
                                        size={16}
                                        className="text-purple-500"
                                      />
                                    ),
                                  },
                                  {
                                    value: "special",
                                    label: "Evento Especial",
                                    icon: (
                                      <StarIcon
                                        size={16}
                                        className="text-purple-500"
                                      />
                                    ),
                                  },
                                ]}
                              />
                            </div>,
                            <div className="space-y-2">
                              {[
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                                  {"Ministerios activos"}
                                </label>,
                                <div className="flex flex-col gap-2">
                                  {[
                                    <button
                                      type="button"
                                      onClick={() => v(!0)}
                                      className="px-4 py-2.5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
                                    >
                                      {"Seleccionar ministerios"}
                                    </button>,
                                    <div className="text-xs text-gray-500 dark:text-slate-400">
                                      {n.activeMinistries.length > 0
                                        ? `${n.activeMinistries.length} seleccionados`
                                        : "Sin selección explícita (visible para todos)"}
                                    </div>,
                                  ]}
                                </div>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                        <div className="space-y-6">
                          {[
                            <div className="space-y-2">
                              {[
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                                  {"Descripción"}
                                </label>,
                                <textarea
                                  value={n.description}
                                  onChange={(l) =>
                                    j({
                                      ...n,
                                      description: l.target.value,
                                    })
                                  }
                                  className="w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none resize-none h-32"
                                  placeholder="Detalles del evento..."
                                />,
                              ]}
                            </div>,
                            <div className="space-y-2">
                              {[
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                                  {"Imagen del Evento"}
                                </label>,
                                <div
                                  onClick={() => $.current?.click()}
                                  className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors h-48 relative overflow-hidden group"
                                >
                                  {[
                                    <input
                                      type="file"
                                      ref={$}
                                      className="hidden"
                                      accept="image/png, image/jpeg, image/gif, image/webp"
                                      onChange={s}
                                    />,
                                    S ? (
                                      <jsxRuntime.Fragment>
                                        {[
                                          <img
                                            src={S}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover"
                                          />,
                                          <button
                                            onClick={(l) => {
                                              (l.stopPropagation(),
                                                m(null),
                                                E(""),
                                                j({
                                                  ...n,
                                                  imageUrl: "",
                                                }));
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-20"
                                            title="Eliminar imagen"
                                          >
                                            <Trash2Icon size={14} />
                                          </button>,
                                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <p className="text-white font-medium flex items-center gap-2">
                                              {[
                                                <ImageIcon size={20} />,
                                                " Cambiar imagen",
                                              ]}
                                            </p>
                                          </div>,
                                        ]}
                                      </jsxRuntime.Fragment>
                                    ) : (
                                      <jsxRuntime.Fragment>
                                        {[
                                          <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                                            <ImageIcon
                                              className="text-gray-400"
                                              size={24}
                                            />
                                          </div>,
                                          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                                            {[
                                              "Click para subir imagen",
                                              <span className="text-gray-500 dark:text-slate-400">
                                                {[" ", "o arrastrar y soltar"]}
                                              </span>,
                                            ]}
                                          </p>,
                                          <p className="text-xs text-gray-400 mt-1">
                                            {"PNG, JPG, GIF hasta 5MB"}
                                          </p>,
                                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                            {
                                              "Tamaño recomendado: 800x450px (16:9)"
                                            }
                                          </p>,
                                        ]}
                                      </jsxRuntime.Fragment>
                                    ),
                                  ]}
                                </div>,
                              ]}
                            </div>,
                          ]}
                        </div>,
                      ]}
                    </div>,
                  ]}
                </div>,
                <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-900/50 rounded-b-2xl">
                  {[
                    <button
                      onClick={d}
                      className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-colors shadow-sm"
                    >
                      {"Cancelar"}
                    </button>,
                    <button
                      onClick={C}
                      disabled={M}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/25 active:scale-95"
                    >
                      {[
                        M ? (
                          <LoaderCircleIcon
                            className="animate-spin"
                            size={18}
                          />
                        ) : I ? (
                          <SaveIcon size={18} />
                        ) : (
                          <PlusIcon size={18} />
                        ),
                        I ? "Guardar Cambios" : "Crear Evento",
                      ]}
                    </button>,
                  ]}
                </div>,
              ]}
            </div>,
            <ManageMinistriesModal
              isOpen={b}
              onClose={() => v(!1)}
              areas={k}
              activeMinistries={n.activeMinistries}
              onSave={(l) => {
                (j((h) => ({
                  ...h,
                  activeMinistries: l,
                })),
                  v(!1));
              }}
            />,
          ]}
        </div>,
        document.body,
      )
    : null;
};
const oe = (u) => {
  const c = (new Date(u.getFullYear(), u.getMonth(), 1).getDay() + 6) % 7;
  return Math.ceil((u.getDate() + c) / 7);
};
const Events = () => {
  const u = useNavigate(),
    {
      userProfile: d,
      isMinistryRestricted: D,
      getAssignedMinistries: c,
    } = useAuth(),
    f = useAppDialog(),
    { users: P, serviceAreas: p } = useGlobalData(),
    [k, T] = React.useState([]),
    [U, x] = React.useState([]),
    [M, o] = React.useState(!0),
    [b, v] = React.useState(!1),
    [n, j] = React.useState(!1),
    [z, m] = React.useState(!1),
    [S, E] = React.useState(!1),
    [$, I] = React.useState({
      isOpen: !1,
      event: null,
    }),
    [R, O] = React.useState(!1),
    [s, C] = React.useState(null),
    l = P.map((a) => ({
      uid: a.id,
      displayName: a.name,
      email: a.email || "",
      photoURL: a.photoURL,
      role: a.role,
    })),
    [h, i] = React.useState(""),
    [N, r] = React.useState(new Date().getFullYear().toString()),
    [w, A] = React.useState("all"),
    [L, He] = React.useState("all"),
    [ie, fe] = React.useState("all"),
    _e =
      ["master_admin", "admin", "ministry_admin"].includes(d?.role || "") ||
      (d?.role || "").startsWith("ministry_admin_"),
    be = d?.role === "master_admin" || d?.role === "admin",
    ee = React.useMemo(() => {
      if (D()) return c();
      const a = Array.isArray(d?.areas) ? d?.areas : [];
      if (a.length === 0) return [];
      const g = new Map(p.map((y) => [normalizeMinistryName(y.name), y.id]));
      return a.map((y) => g.get(normalizeMinistryName(y))).filter(Boolean);
    }, [c, D, p, d?.areas]),
    H = React.useMemo(() => {
      if (be || hasOtherMinistries(d, p)) return k;
      const a = getUdlvMinistryId(p);
      return k.filter((g) => {
        const y = Array.isArray(g?.activeMinistries) ? g.activeMinistries : [];
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
        if (isBffEnabled()) {
          const g = await bffFetch("/api/notify/users", {
            method: "POST",
            body: JSON.stringify({
              userIds: a.selectedUserIds,
              title: a.title,
              body: a.message,
              data: {
                url: "/dashboard",
              },
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
        if (isBffEnabled()) {
          const g = await bffFetch("/api/notify/all", {
            method: "POST",
            body: JSON.stringify({
              title: a.title,
              body: a.message,
              data: {
                url: "/dashboard",
              },
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
  (React.useEffect(() => {
    o(!0);
    const a = me(Q(firestoreDb, "events"), ue("date", "desc"), Ze(25)),
      g = we(
        a,
        (y) => {
          const B = y.docs.map((q) => ({
            id: q.id,
            ...q.data(),
          }));
          (T(B), o(!1));
        },
        (y) => {
          (console.error("Error listening to events:", y), o(!1));
        },
      );
    return () => g();
  }, []),
    React.useEffect(() => {
      if (H.length === 0) {
        x([]);
        return;
      }
      const a = [];
      return (
        H.map((y) => y.id)
          .slice(0, 10)
          .forEach((y) => {
            const B = Q(firestoreDb, "events", y, "assignments"),
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
  const [ve, qe] = React.useState(!1);
  React.useEffect(() => {
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
  return (
    <div className="space-y-8">
      {[
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {[
            <div className="flex items-center gap-4">
              {[
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <CalendarIcon className="text-white" size={24} />
                </div>,
                <div>
                  {[
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {"Eventos"}
                    </h1>,
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                      {[je.length, " eventos programados"]}
                    </p>,
                  ]}
                </div>,
              ]}
            </div>,
            <div className="flex items-center gap-3">
              {[
                d?.role === "master_admin" && (
                  <button
                    onClick={() => m(!0)}
                    className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 font-medium flex items-center gap-2 transition-all shadow-sm"
                  >
                    {[<SettingsIcon size={18} />, "Plantillas"]}
                  </button>
                ),
                _e && (
                  <button
                    onClick={() => {
                      (C(null), E(!0));
                    }}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 font-medium transition-all active:scale-95"
                  >
                    {[<PlusIcon size={20} />, "Nuevo Evento"]}
                  </button>
                ),
              ]}
            </div>,
          ]}
        </div>,
        <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          {[
            <div className="flex flex-col lg:flex-row gap-2 p-2">
              {[
                <div className="flex-1 relative">
                  {[
                    <SearchIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />,
                    <input
                      type="text"
                      placeholder="Buscar eventos..."
                      value={h}
                      onChange={(a) => i(a.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                    />,
                  ]}
                </div>,
                d?.role === "master_admin" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        v(!0);
                      }}
                      className="px-4 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm shadow-fuchsia-500/20"
                    >
                      {[<UsersIcon size={18} />, "Notificar usuarios"]}
                    </button>
                  </div>
                ),
              ]}
            </div>,
            <div className="flex flex-wrap items-center gap-3 p-2 pt-0 border-t border-gray-50 dark:border-slate-700/50 mt-2">
              {[
                <div className="w-48">
                  <SelectPicker
                    value={L}
                    onChange={He}
                    options={[
                      {
                        value: "all",
                        label: "Todos los tipos",
                        icon: (
                          <LayoutGridIcon
                            size={16}
                            className="text-purple-500"
                          />
                        ),
                      },
                      {
                        value: "service",
                        label: "Servicios",
                        icon: (
                          <CalendarIcon size={16} className="text-purple-500" />
                        ),
                      },
                      {
                        value: "meeting",
                        label: "Reuniones",
                        icon: (
                          <UsersIcon size={16} className="text-purple-500" />
                        ),
                      },
                      {
                        value: "special",
                        label: "Especiales",
                        icon: (
                          <StarIcon size={16} className="text-purple-500" />
                        ),
                      },
                    ]}
                    placeholder="Tipo"
                  />
                </div>,
                <div className="w-32">
                  <SelectPicker
                    value={N}
                    onChange={r}
                    options={[
                      {
                        value: "all",
                        label: "Todos",
                        icon: (
                          <CalendarIcon size={16} className="text-purple-500" />
                        ),
                      },
                      ...ne.years.map((a) => ({
                        value: a,
                        label: a,
                        icon: (
                          <CalendarIcon size={16} className="text-purple-500" />
                        ),
                      })),
                    ]}
                    placeholder="Año"
                  />
                </div>,
                <div className="w-40">
                  <SelectPicker
                    value={w}
                    onChange={A}
                    options={[
                      {
                        value: "all",
                        label: "Todo el año",
                        icon: (
                          <CalendarIcon size={16} className="text-purple-500" />
                        ),
                      },
                      ...ne.months.map((a) => ({
                        value: a.toString(),
                        label: Ye[a],
                        icon: (
                          <CalendarIcon size={16} className="text-purple-500" />
                        ),
                      })),
                    ]}
                    placeholder="Mes"
                  />
                </div>,
                <div className="w-44">
                  <SelectPicker
                    value={ie}
                    onChange={fe}
                    options={[
                      {
                        value: "all",
                        label: "Todas las semanas",
                        icon: (
                          <CalendarIcon
                            size={16}
                            className="text-emerald-500"
                          />
                        ),
                      },
                      ...ne.weeks.map((a) => ({
                        value: a,
                        label: `Semana ${a}`,
                        icon: (
                          <CalendarIcon
                            size={16}
                            className="text-emerald-500"
                          />
                        ),
                      })),
                    ]}
                    placeholder="Semana"
                  />
                </div>,
              ]}
            </div>,
          ]}
        </div>,
        M ? (
          <div className="flex justify-center py-12">
            <LoaderCircleIcon className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <EventsGrid
            events={Je}
            assignments={U}
            navigate={u}
            variant="detailed"
            onEdit={
              d?.role === "master_admin"
                ? (a) => {
                    (C(a), E(!0));
                  }
                : void 0
            }
            onDelete={
              d?.role === "master_admin"
                ? (a) =>
                    I({
                      isOpen: !0,
                      event: a,
                    })
                : void 0
            }
          />
        ),
        <RenderComponent2
          isOpen={b}
          onClose={() => v(!1)}
          users={l}
          onSend={Be}
        />,
        <RenderComponent3 isOpen={n} onClose={() => j(!1)} onSend={Ge} />,
        <RenderComponent4 isOpen={z} onClose={() => m(!1)} />,
        <RenderComponent5
          isOpen={S}
          onClose={() => {
            (E(!1), C(null));
          }}
          onEventCreated={ye}
          eventToEdit={s}
        />,
        <Modal
          isOpen={$.isOpen}
          onClose={() =>
            I({
              isOpen: !1,
              event: null,
            })
          }
          title="Eliminar Evento"
        >
          <div className="space-y-4">
            {[
              <p className="text-gray-600 dark:text-slate-300">
                {[
                  '¿Estás seguro de que deseas eliminar el evento "',
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {$.event?.title}
                  </span>,
                  '"? Esta acción no se puede deshacer.',
                ]}
              </p>,
              <div className="flex justify-end gap-3 pt-2">
                {[
                  <button
                    onClick={() =>
                      I({
                        isOpen: !1,
                        event: null,
                      })
                    }
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    {"Cancelar"}
                  </button>,
                  <button
                    onClick={async () => {
                      const a = $.event;
                      if (a) {
                        O(!0);
                        try {
                          if (isBffEnabled()) {
                            if (
                              !(
                                await bffFetch(`/api/events/${a.id}`, {
                                  method: "DELETE",
                                })
                              )?.ok
                            )
                              throw new Error("Error deleting event via BFF");
                          } else await Pe(X(firestoreDb, "events", a.id));
                          (f.showSuccess("Evento eliminado correctamente"),
                            ye());
                        } catch (g) {
                          (console.error("Error deleting event:", g),
                            f.showError("Error al eliminar el evento"));
                        } finally {
                          (O(!1),
                            I({
                              isOpen: !1,
                              event: null,
                            }));
                        }
                      }
                    }}
                    disabled={R}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/30 flex items-center gap-2"
                  >
                    {R ? (
                      <jsxRuntime.Fragment>
                        {[
                          <LoaderCircleIcon className="w-4 h-4 animate-spin" />,
                          <span>{"Eliminando..."}</span>,
                        ]}
                      </jsxRuntime.Fragment>
                    ) : (
                      "Eliminar"
                    )}
                  </button>,
                ]}
              </div>,
            ]}
          </div>
        </Modal>,
      ]}
    </div>
  );
};
export { Events };
