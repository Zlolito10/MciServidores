// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import { OptimizedImage, firebaseStorage } from "../app/App.jsx";
import { O as U, U as M, Q as I } from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  d as CalendarIcon,
  s as ClockIcon,
  n as MapPinIcon,
  y as SquarePenIcon,
  r as Trash2Icon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
const $ = (i) => {
  if (typeof i == "string") return i;
  if (Array.isArray(i)) {
    const d = i.find((n) => typeof n == "string" && n.trim());
    return typeof d == "string" ? d : "";
  }
  if (i && typeof i == "object") {
    const d = i,
      h = [d.url, d.href, d.downloadURL, d.downloadUrl].find(
        (c) => typeof c == "string" && c.trim(),
      );
    return typeof h == "string" ? h : "";
  }
  return "";
};
const EventsGrid = ({
  events: i,
  assignments: d,
  navigate: n,
  variant: h = "simple",
  onEdit: c,
  onDelete: f,
}) => {
  const [j, v] = React.useState({}),
    k = React.useRef(new Set()),
    [C, N] = React.useState({});
  return (
    React.useEffect(() => {
      let r = !1;
      return (
        (async () => {
          const p = i
            .filter(
              (o) =>
                !!o.id &&
                !j[o.id] &&
                !(typeof o.imageUrl == "string" && o.imageUrl) &&
                !(typeof o.imageThumbUrl == "string" && o.imageThumbUrl),
            )
            .slice(0, 3);
          if (p.length !== 0) {
            for (const o of p)
              if (!k.current.has(o.id)) {
                k.current.add(o.id);
                try {
                  const m = U(firebaseStorage, `event-images/${o.id}`),
                    x = await M(m);
                  if (r) return;
                  const u =
                    x.items.find((s) => s.name.startsWith("migrated_")) ||
                    x.items.find((s) => s.name.startsWith("original_")) ||
                    x.items.find((s) => !s.name.startsWith("thumb_")) ||
                    x.items[0];
                  if (!u) continue;
                  const t = await I(u);
                  if (r) return;
                  v((s) => ({
                    ...s,
                    [o.id]: t,
                  }));
                } catch {}
              }
          }
        })(),
        () => {
          r = !0;
        }
      );
    }, [i, j]),
    (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {i.length > 0 ? (
          i.map((r, g) => {
            const p = j[r.id] || r?.coverUrl || r.imageUrl || r.imageThumbUrl,
              m = $(p),
              x = C[r.id] || "contain",
              u = new Date(r.date + "T" + (r.time || "00:00"));
            return h === "detailed"
              ? jsxRuntime.jsxs(
                  "div",
                  {
                    onClick: () => n(`/dashboard/events/${r.id}`),
                    className:
                      "group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer",
                    children: [
                      <div className="w-full aspect-video bg-gray-100 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center">
                        {[
                          m ? (
                            <OptimizedImage
                              src={m}
                              alt={r.title}
                              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                              imgClassName={
                                x === "cover"
                                  ? "object-cover"
                                  : "object-contain"
                              }
                              eager={g < 4}
                              fetchPriority={g < 2 ? "high" : "auto"}
                              onImageLoad={({ width: t, height: s }) => {
                                if (!t || !s) return;
                                const l = t / s >= 1.7 ? "cover" : "contain";
                                N((a) =>
                                  a[r.id] === l
                                    ? a
                                    : {
                                        ...a,
                                        [r.id]: l,
                                      },
                                );
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 dark:text-slate-500 flex flex-col items-center">
                              <svg
                                className="w-12 h-12 mb-2 opacity-30"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          ),
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm capitalize border border-indigo-500/50">
                              {r.type === "service" ? "Servicio" : r.type}
                            </span>
                          </div>,
                        ]}
                      </div>,
                      <div className="p-5 flex-1 flex flex-col gap-4">
                        {[
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                            {r.title}
                          </h3>,
                          <div className="space-y-3 flex-1">
                            {[
                              <div className="flex items-start gap-3 text-sm">
                                {[
                                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <CalendarIcon size={18} />
                                  </div>,
                                  <div className="py-1.5">
                                    <span className="font-medium text-gray-700 dark:text-slate-200 capitalize">
                                      {u.toLocaleDateString("es-ES", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </span>
                                  </div>,
                                ]}
                              </div>,
                              <div className="flex items-start gap-3 text-sm">
                                {[
                                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                    <ClockIcon size={18} />
                                  </div>,
                                  <div className="py-1.5 flex flex-col gap-1 text-gray-600 dark:text-slate-400">
                                    {[
                                      r.serviceTime && (
                                        <span>
                                          {["Servicio: ", r.serviceTime]}
                                        </span>
                                      ),
                                      <span>
                                        {["Inicio de evento: ", r.time]}
                                      </span>,
                                      r.endTime && (
                                        <span>
                                          {["Fin de evento: ", r.endTime]}
                                        </span>
                                      ),
                                    ]}
                                  </div>,
                                ]}
                              </div>,
                              r.location && (
                                <div className="flex items-start gap-3 text-sm">
                                  {[
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                                      <MapPinIcon size={18} />
                                    </div>,
                                    <div className="py-1.5">
                                      <span className="text-gray-700 dark:text-slate-300">
                                        {r.location}
                                      </span>
                                    </div>,
                                  ]}
                                </div>
                              ),
                            ]}
                          </div>,
                          (c || f) && (
                            <div
                              className={`grid ${c && f ? "grid-cols-2" : "grid-cols-1"} gap-3 pt-4 border-t border-gray-100 dark:border-slate-700/50`}
                            >
                              {[
                                c && (
                                  <button
                                    onClick={(t) => {
                                      (t.stopPropagation(), c?.(r));
                                    }}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-semibold transition-colors"
                                  >
                                    {[<SquarePenIcon size={16} />, "Editar"]}
                                  </button>
                                ),
                                f && (
                                  <button
                                    onClick={(t) => {
                                      (t.stopPropagation(), f?.(r));
                                    }}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl text-sm font-semibold transition-colors"
                                  >
                                    {[<Trash2Icon size={16} />, "Eliminar"]}
                                  </button>
                                ),
                              ]}
                            </div>
                          ),
                        ]}
                      </div>,
                    ],
                  },
                  r.id,
                )
              : jsxRuntime.jsxs(
                  "div",
                  {
                    role: "button",
                    tabIndex: 0,
                    onClick: () => n(`/dashboard/events/${r.id}`),
                    onKeyDown: (t) => {
                      (t.key === "Enter" || t.key === " ") &&
                        (t.preventDefault(), n(`/dashboard/events/${r.id}`));
                    },
                    className:
                      "group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900",
                    children: [
                      <div className="w-full aspect-video bg-gray-100 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center">
                        {[
                          m ? (
                            <OptimizedImage
                              src={m}
                              alt={r.title}
                              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                              imgClassName={
                                x === "cover"
                                  ? "object-cover"
                                  : "object-contain"
                              }
                              eager={g < 4}
                              fetchPriority={g < 2 ? "high" : "auto"}
                              onImageLoad={({ width: t, height: s }) => {
                                if (!t || !s) return;
                                const l = t / s >= 1.7 ? "cover" : "contain";
                                N((a) =>
                                  a[r.id] === l
                                    ? a
                                    : {
                                        ...a,
                                        [r.id]: l,
                                      },
                                );
                              }}
                              fallbackIcon={
                                <div className="text-gray-400 dark:text-slate-500 flex flex-col items-center">
                                  <svg
                                    className="w-12 h-12 mb-2 opacity-50"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              }
                            />
                          ) : (
                            <div className="text-gray-400 dark:text-slate-500 flex flex-col items-center">
                              <svg
                                className="w-12 h-12 mb-2 opacity-30"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          ),
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            {[
                              r.status === "completed" && (
                                <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                                  {"Completado"}
                                </span>
                              ),
                              r.status === "cancelled" && (
                                <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                                  {"Cancelado"}
                                </span>
                              ),
                            ]}
                          </div>,
                          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 border border-white/20">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              {new Date(
                                r.date + "T" + (r.time || "00:00"),
                              ).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>,
                        ]}
                      </div>,
                      <div className="p-5 flex-1 flex flex-col">
                        {[
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {r.title}
                          </h3>,
                          <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                            {r.description || "Sin descripción"}
                          </p>,
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700/50 mt-auto">
                            {[
                              <div className="flex -space-x-2">
                                <div className="flex -space-x-2 overflow-hidden py-0.5 px-0.5">
                                  {(() => {
                                    const t = (d || []).filter(
                                      (a) => a.eventId === r.id,
                                    );
                                    if (t.length === 0)
                                      return (
                                        <div className="text-xs text-gray-400 dark:text-slate-500 italic">
                                          {"Sin asignar"}
                                        </div>
                                      );
                                    const s = 3,
                                      y = t.slice(0, s),
                                      l = t.length - s;
                                    return (
                                      <jsxRuntime.Fragment>
                                        {[
                                          y.map((a, L) => {
                                            const z = (a.userName || "?")
                                              .charAt(0)
                                              .toUpperCase();
                                            return jsxRuntime.jsx(
                                              "div",
                                              {
                                                className:
                                                  "w-7 h-7 rounded-full bg-indigo-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300 ring-2 ring-transparent relative z-0 hover:z-10 hover:scale-110 transition-all",
                                                title: a.roleName
                                                  ? `${a.roleName}: ${a.userName}`
                                                  : a.userName,
                                                children: z,
                                              },
                                              a.id || L,
                                            );
                                          }),
                                          l > 0 && (
                                            <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-medium text-gray-500 dark:text-slate-400 relative z-0">
                                              {["+", l]}
                                            </div>
                                          ),
                                        ]}
                                      </jsxRuntime.Fragment>
                                    );
                                  })()}
                                </div>
                              </div>,
                              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                {[
                                  "Ver detalles",
                                  <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path
                                      d="M5 12h14M12 5l7 7-7 7"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>,
                                ]}
                              </span>,
                            ]}
                          </div>,
                        ]}
                      </div>,
                    ],
                  },
                  r.id,
                );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-dashed border-gray-300 dark:border-slate-700">
            {[
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <svg
                  className="w-8 h-8 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>,
              <p className="text-gray-500 dark:text-slate-400 font-medium">
                {"No hay eventos programados"}
              </p>,
            ]}
          </div>
        )}
      </div>
    )
  );
};
export { EventsGrid };
