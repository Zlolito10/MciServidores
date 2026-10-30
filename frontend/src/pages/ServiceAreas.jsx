// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import {
  useGlobalData,
  useAuth,
  useAppDialog,
  useChangeFeed,
  OptimizedImage,
  Modal,
  isBffEnabled,
  firebaseAuth,
  bffFetch,
  firestoreDb,
  dataUrlToBlob,
  compressImage,
} from "../app/App.jsx";
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
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import {
  e as LayersIcon,
  P as PlusIcon,
  y as SquarePenIcon,
  r as Trash2Icon,
  T as TriangleAlertIcon,
  L as LoaderCircleIcon,
  a4 as CameraIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
const be = ce();
const U = async (d, r) => {
  const n = `ministry_admin_${d}`,
    l = `ministry_subadmin_${d}`;
  if (isBffEnabled()) {
    const k = (await bffFetch(`/api/roles/${encodeURIComponent(n)}`)).exists,
      N = (await bffFetch(`/api/roles/${encodeURIComponent(l)}`)).exists,
      p = [];
    (k ||
      p.push(
        bffFetch(`/api/roles/${encodeURIComponent(n)}`, {
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
          bffFetch(`/api/roles/${encodeURIComponent(l)}`, {
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
  const c = C(firestoreDb, "roles", n),
    y = C(firestoreDb, "roles", l),
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
};
const ServiceAreas = () => {
  const [d, r] = React.useState(!1),
    [n, l] = React.useState([]),
    { serviceAreas: c, reload: y } = useGlobalData(),
    [E, j] = React.useState(!0),
    { user: f, userProfile: k, loading: N } = useAuth(),
    p = useAppDialog(),
    [t, m] = React.useState({
      name: "",
      description: "",
      roles: [],
      imageURL: "",
    }),
    [x, A] = React.useState(null),
    L = React.useRef(null),
    [S, I] = React.useState(!1),
    [M, $] = React.useState(!1),
    [b, _] = React.useState({
      isOpen: !1,
      areaId: null,
      areaName: "",
    }),
    D = async () => {
      if (c.length > 0) {
        (l(c), j(!1));
        return;
      }
      if (!(!isBffEnabled() && !firebaseAuth.currentUser))
        try {
          const s = isBffEnabled()
            ? (
                await bffFetch("/api/service_areas", {
                  bypassCache: !0,
                })
              ).items
            : (await oe(B(firestoreDb, "service_areas"))).docs.map((a) => ({
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
  (React.useEffect(() => {
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
    useChangeFeed({
      enabled: isBffEnabled(),
      resources: ["service_areas"],
      onChange: () => {
        y();
      },
      debounceMs: 600,
    }),
    React.useEffect(() => {
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
          m((u) => ({
            ...u,
            imageURL: i.result,
          }));
        }),
          i.readAsDataURL(a));
      }
    },
    J = async (s) => {
      (s.preventDefault(), I(!0));
      try {
        let a = t.imageURL;
        if (t.imageURL && t.imageURL.startsWith("data:")) {
          const i = await dataUrlToBlob(t.imageURL),
            u = new File([i], "ministry.jpg", {
              type: "image/jpeg",
            }),
            R = await compressImage(u, 800, 0.85),
            w = `events/ministry_${x || "new"}_${Date.now()}.jpg`,
            P = de(be, w);
          (await me(P, R, {
            contentType: "image/jpeg",
            cacheControl: "public,max-age=31536000,immutable",
          }),
            (a = await ge(P)));
        }
        if (x)
          isBffEnabled()
            ? await bffFetch(`/api/service_areas/${encodeURIComponent(x)}`, {
                method: "PUT",
                json: {
                  name: t.name,
                  description: t.description,
                  roles: t.roles,
                  imageURL: a,
                },
              })
            : await pe(C(firestoreDb, "service_areas", x), {
                name: t.name,
                description: t.description,
                roles: t.roles,
                imageURL: a,
              });
        else if (isBffEnabled()) {
          const i = await bffFetch("/api/service_areas", {
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
          const i = await xe(B(firestoreDb, "service_areas"), {
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
          (isBffEnabled()
            ? await bffFetch(
                `/api/service_areas/${encodeURIComponent(b.areaId)}`,
                {
                  method: "DELETE",
                },
              )
            : await le(C(firestoreDb, "service_areas", b.areaId)),
            D(),
            _({
              isOpen: !1,
              areaId: null,
              areaName: "",
            }));
        } catch (a) {
          (console.error("Error deleting area:", a),
            p.showError("Error al eliminar el ministerio"));
        } finally {
          $(!1);
        }
      }
    },
    X = (s) => {
      _({
        isOpen: !0,
        areaId: s.id,
        areaName: s.name,
      });
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
      (m({
        name: "",
        description: "",
        roles: [],
        imageURL: "",
      }),
        A(null));
    },
    O = k?.role === "master_admin" || k?.role === "admin";
  return (
    <div className="space-y-6">
      {[
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {[
            <div className="flex items-center gap-4">
              {[
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <LayersIcon size={24} />
                </div>,
                <div>
                  {[
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {"Ministerios"}
                    </h1>,
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                      {[n.length, " ministerios activos"]}
                    </p>,
                  ]}
                </div>,
              ]}
            </div>,
            O && (
              <button
                onClick={() => {
                  (T(), r(!0));
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                {[<PlusIcon size={20} />, "Nuevo Ministerio"]}
              </button>
            ),
          ]}
        </div>,
        E ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-pulse"
                key={s}
              >
                {[
                  <div className="h-48 bg-gray-200 dark:bg-slate-700" />,
                  <div className="p-6 space-y-3">
                    {[
                      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />,
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />,
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />,
                    ]}
                  </div>,
                ]}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {n.map((s, a) => {
              const i = [
                  {
                    bg: "from-indigo-500 to-purple-600",
                    light: "indigo",
                  },
                  {
                    bg: "from-emerald-500 to-teal-600",
                    light: "emerald",
                  },
                  {
                    bg: "from-orange-500 to-red-500",
                    light: "orange",
                  },
                  {
                    bg: "from-pink-500 to-rose-600",
                    light: "pink",
                  },
                  {
                    bg: "from-cyan-500 to-blue-600",
                    light: "cyan",
                  },
                  {
                    bg: "from-amber-500 to-yellow-500",
                    light: "amber",
                  },
                ],
                u = i[a % i.length];
              return jsxRuntime.jsxs(
                "div",
                {
                  className:
                    "bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden group",
                  children: [
                    <div className="h-32 sm:h-40 w-full relative">
                      {[
                        s.imageURL ? (
                          <OptimizedImage
                            src={s.imageURL}
                            alt={s.name}
                            className="w-full h-full card-image"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${u.bg} flex items-center justify-center`}
                          >
                            <LayersIcon size={48} className="text-white/30" />
                          </div>
                        ),
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />,
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold text-white drop-shadow-lg">
                            {s.name}
                          </h3>
                        </div>,
                        O && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {[
                              <button
                                onClick={() => Y(s)}
                                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                                title="Editar"
                              >
                                <SquarePenIcon size={16} />
                              </button>,
                              <button
                                onClick={() => X(s)}
                                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-red-500/80 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2Icon size={16} />
                              </button>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                    <div className="p-4">
                      {[
                        s.description && (
                          <p className="text-gray-500 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                            {s.description}
                          </p>
                        ),
                        s.roles && s.roles.length > 0 && (
                          <div>
                            {[
                              <p className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">
                                {[s.roles.length, " Roles"]}
                              </p>,
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  s.roles.slice(0, 4).map((R, w) => (
                                    <span
                                      className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs rounded-lg"
                                      key={w}
                                    >
                                      {R}
                                    </span>
                                  )),
                                  s.roles.length > 4 && (
                                    <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-lg font-medium">
                                      {["+", s.roles.length - 4, " más"]}
                                    </span>
                                  ),
                                ]}
                              </div>,
                            ]}
                          </div>
                        ),
                        (!s.roles || s.roles.length === 0) &&
                          !s.description && (
                            <p className="text-sm text-gray-400 dark:text-slate-500 italic">
                              {"Sin descripción ni roles"}
                            </p>
                          ),
                      ]}
                    </div>,
                  ],
                },
                s.id,
              );
            })}
          </div>
        ),
        <Modal
          isOpen={b.isOpen}
          onClose={() =>
            _({
              isOpen: !1,
              areaId: null,
              areaName: "",
            })
          }
          title="Eliminar Ministerio"
          maxWidth="max-w-sm"
        >
          <div className="text-center">
            {[
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TriangleAlertIcon size={32} className="text-red-500" />
              </div>,
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {['¿Eliminar "', b.areaName, '"?']}
              </h3>,
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                {
                  "Esta acción no se puede deshacer. El ministerio y todas sus configuraciones serán eliminados permanentemente."
                }
              </p>,
              <div className="flex gap-3 justify-center">
                {[
                  <button
                    onClick={() =>
                      _({
                        isOpen: !1,
                        areaId: null,
                        areaName: "",
                      })
                    }
                    className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                  >
                    {"Cancelar"}
                  </button>,
                  <button
                    onClick={V}
                    disabled={M}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {M ? (
                      <jsxRuntime.Fragment>
                        {[
                          <LoaderCircleIcon
                            size={16}
                            className="animate-spin"
                          />,
                          "Eliminando...",
                        ]}
                      </jsxRuntime.Fragment>
                    ) : (
                      "Sí, eliminar"
                    )}
                  </button>,
                ]}
              </div>,
            ]}
          </div>
        </Modal>,
        <Modal
          isOpen={d}
          onClose={() => r(!1)}
          title={x ? "Editar Ministerio" : "Nuevo Ministerio"}
          maxWidth="max-w-lg"
        >
          <form onSubmit={J} className="space-y-4">
            {[
              <div className="flex justify-center mb-6">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => L.current?.click()}
                >
                  {[
                    <div className="w-full h-48 w-full rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-indigo-500 transition-colors">
                      {t.imageURL ? (
                        <img
                          src={t.imageURL}
                          alt="Preview"
                          className="w-full h-full object-contain bg-gray-50 dark:bg-slate-800"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 dark:text-slate-500">
                          {[
                            <CameraIcon size={32} className="mb-2" />,
                            <span className="text-sm">{"Subir imagen"}</span>,
                          ]}
                        </div>
                      )}
                    </div>,
                    <input
                      type="file"
                      ref={L}
                      className="hidden"
                      accept="image/*"
                      onChange={Q}
                    />,
                  ]}
                </div>
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {"Nombre del Ministerio"}
                  </label>,
                  <input
                    type="text"
                    required={!0}
                    value={t.name}
                    onChange={(s) =>
                      m({
                        ...t,
                        name: s.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition-colors"
                    placeholder="Ej: Alabanza"
                  />,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {"Descripción"}
                  </label>,
                  <textarea
                    rows={3}
                    value={t.description}
                    onChange={(s) =>
                      m({
                        ...t,
                        description: s.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition-colors"
                    placeholder="Descripción breve de las responsabilidades..."
                  />,
                ]}
              </div>,
              <div>
                {[
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {"Roles del Ministerio"}
                  </label>,
                  <div className="flex gap-2 mb-3">
                    {[
                      <input
                        type="text"
                        id="role-input"
                        className="flex-1 rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition-colors"
                        placeholder="Escribe un rol (ej: Batería)"
                        onKeyDown={(s) => {
                          if (s.key === "Enter") {
                            s.preventDefault();
                            const a = s.target.value.trim();
                            a &&
                              !t.roles.includes(a) &&
                              (m({
                                ...t,
                                roles: [...t.roles, a],
                              }),
                              (s.target.value = ""));
                          }
                        }}
                      />,
                      <button
                        type="button"
                        onClick={() => {
                          const s = document.getElementById("role-input"),
                            a = s.value.trim();
                          a &&
                            !t.roles.includes(a) &&
                            (m({
                              ...t,
                              roles: [...t.roles, a],
                            }),
                            (s.value = ""));
                        }}
                        className="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        <PlusIcon size={20} />
                      </button>,
                    ]}
                  </div>,
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-1">
                    {[
                      t.roles.map((s, a) => (
                        <div
                          className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full text-sm border border-gray-200 dark:border-slate-600"
                          key={a}
                        >
                          {[
                            <span>{s}</span>,
                            <button
                              type="button"
                              onClick={() =>
                                m({
                                  ...t,
                                  roles: t.roles.filter((i) => i !== s),
                                })
                              }
                              className="p-0.5 hover:text-red-500 rounded-full transition-colors"
                            >
                              <Trash2Icon size={14} />
                            </button>,
                          ]}
                        </div>
                      )),
                      t.roles.length === 0 && (
                        <p className="text-sm text-gray-400 italic w-full text-center py-2">
                          {"No hay roles definidos aún."}
                        </p>
                      ),
                    ]}
                  </div>,
                ]}
              </div>,
              <div className="pt-4 flex justify-end gap-3">
                {[
                  <button
                    type="button"
                    onClick={() => r(!1)}
                    className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                  >
                    {"Cancelar"}
                  </button>,
                  <button
                    type="submit"
                    disabled={S}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {S ? (
                      <jsxRuntime.Fragment>
                        {[
                          <LoaderCircleIcon
                            size={16}
                            className="animate-spin"
                          />,
                          x ? "Guardando..." : "Creando...",
                        ]}
                      </jsxRuntime.Fragment>
                    ) : x ? (
                      "Guardar Cambios"
                    ) : (
                      "Crear Ministerio"
                    )}
                  </button>,
                ]}
              </div>,
            ]}
          </form>
        </Modal>,
      ]}
    </div>
  );
};
export { ServiceAreas };
