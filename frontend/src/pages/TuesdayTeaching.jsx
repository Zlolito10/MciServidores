// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { jsxRuntime } from "../vendor/jsx-runtime.js";
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import {
  useAppDialog,
  useAuth,
  useGlobalData,
  firestoreDb,
  onSnapshot,
  getAvatarUrl,
  OptimizedImage,
} from "../app/App.jsx";
import {
  L as LoaderCircleIcon,
  f as UsersIcon,
  R as SparklesIcon,
  ag as CalendarDaysIcon,
  ah as UmbrellaIcon,
  C as CheckIcon,
  s as ClockIcon,
  w as SearchIcon,
  a5 as ChartColumnIcon,
  p as ShieldCheckIcon,
  v as CircleXIcon,
  l as CircleCheckIcon,
} from "../vendor/vendor-ui-CnvYSvQL.js";
import {
  I as B,
  J as Le,
  E as U,
  K as I,
  B as $e,
  A as se,
  R as Me,
} from "../vendor/vendor-firebase-BjYbfC3F.js";
import "../vendor/vendor-pdf-Cf03QSry.js";
const Be = {
  present: {
    label: "Presente",
    icon: <CircleCheckIcon size={15} />,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
  },
  absent: {
    label: "Ausente",
    icon: <CircleXIcon size={15} />,
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  },
  justified: {
    label: "Justificado",
    icon: <ShieldCheckIcon size={15} />,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  },
};
const Ue = (d) => {
  const x = d.getFullYear(),
    n = String(d.getMonth() + 1).padStart(2, "0"),
    m = String(d.getDate()).padStart(2, "0");
  return `${x}-${n}-${m}`;
};
const oe = (d) => {
  const [x, n, m] = d.split("-").map(Number);
  return new Date(x, n - 1, m);
};
const Ie = () => {
  const d = new Date(),
    n = (2 - d.getDay() + 7) % 7,
    m = new Date(d);
  return (m.setDate(d.getDate() + n), Ue(m));
};
const ae = (d) => oe(d).getDay() === 2;
const re = (d) =>
  oe(d).toLocaleDateString("es-EC", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
const de = (d) => d.slice(0, 7);
const le = (d) =>
  d
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("") || "?";
const TuesdayTeaching = () => {
  const d = useAppDialog(),
    { user: x, userProfile: n, loading: m, hasPermission: ie } = useAuth(),
    { users: F, serviceAreas: _, loading: ne } = useGlobalData(),
    [g, P] = React.useState([]),
    [y, K] = React.useState({}),
    [q, J] = React.useState([]),
    [o, O] = React.useState(Ie),
    [G, D] = React.useState("Tiempo de ensenanza"),
    [u, v] = React.useState("normal"),
    [V, z] = React.useState(""),
    [E, ce] = React.useState(""),
    [w, xe] = React.useState("all"),
    [A, me] = React.useState(!1),
    [R, N] = React.useState({}),
    [W, Q] = React.useState(!1),
    [ge, S] = React.useState(!0),
    f = n?.role || "",
    c =
      f === "master_admin" ||
      f === "admin" ||
      f === "ministry_admin" ||
      f === "ministry_subadmin" ||
      f.startsWith("ministry_admin_") ||
      f.startsWith("ministry_subadmin_"),
    b = c || ie("view_reports"),
    h = !!x?.getIdToken;
  (React.useEffect(() => {
    if (!b || !h) {
      P([]);
      return;
    }
    const t = B(U(firestoreDb, "teaching_sessions"), Le("date", "desc")),
      s = onSnapshot(t, (a) => {
        P(
          a.docs.map((r) => ({
            id: r.id,
            ...r.data(),
          })),
        );
      });
    return () => s();
  }, [b, h]),
    React.useEffect(() => {
      const t = g.find((s) => s.date === o);
      if (!t) {
        (D("Tiempo de ensenanza"), v("normal"), z(""));
        return;
      }
      (D(t.title || "Tiempo de ensenanza"),
        v(t.status || "normal"),
        z(t.notes || ""));
    }, [o, g]),
    React.useEffect(() => {
      if (!b || !h) {
        (K({}), N({}), S(!1));
        return;
      }
      S(!0);
      const t = B(
          U(firestoreDb, "teaching_attendance_records"),
          I("date", "==", o),
        ),
        s = onSnapshot(
          t,
          (a) => {
            const r = {};
            (a.docs.forEach((i) => {
              const k = i.data();
              r[k.userId] = {
                id: i.id,
                ...k,
              };
            }),
              K(r),
              N({}),
              S(!1));
          },
          () => {
            (S(!1),
              d.showError("No se pudo cargar la asistencia de este martes"));
          },
        );
      return () => s();
    }, [b, d, h, o]),
    React.useEffect(() => {
      if (!b || !h) {
        J([]);
        return;
      }
      const [t, s] = o.split("-").map(Number),
        a = `${o.slice(0, 7)}-01`,
        r = new Date(t, s, 0).getDate(),
        i = `${o.slice(0, 7)}-${String(r).padStart(2, "0")}`,
        k = B(
          U(firestoreDb, "teaching_attendance_records"),
          I("date", ">=", a),
          I("date", "<=", i),
        ),
        ye = onSnapshot(k, (fe) => {
          J(
            fe.docs.map((Z) => ({
              id: Z.id,
              ...Z.data(),
            })),
          );
        });
      return () => ye();
    }, [b, h, o]));
  const T = React.useMemo(() => g.find((t) => t.date === o) || null, [g, o]),
    p = React.useMemo(() => {
      const t = new Set(_.map((s) => s.id));
      return F.filter((s) =>
        (!A && s.status === "Inactivo") ||
        !(Array.isArray(s.areas) ? s.areas : []).some((i) => t.has(i))
          ? !1
          : !!(s.id && s.name),
      ).sort((s, a) => (s.name || "").localeCompare(a.name || ""));
    }, [F, _, A]),
    C = React.useMemo(() => {
      const t = E.trim().toLowerCase();
      return p.filter((s) => {
        const a = Array.isArray(s.areas) ? s.areas : [];
        return w !== "all" && !a.includes(w)
          ? !1
          : t
            ? (s.name || "").toLowerCase().includes(t) ||
              (s.email || "").toLowerCase().includes(t)
            : !0;
      });
    }, [p, w, E]),
    X = (t) => {
      const s = R[t];
      if (s) return s;
      const a = y[t];
      return {
        status: a?.status || "absent",
        notes: a?.notes || "",
      };
    },
    ue = (t, s) => {
      N((a) => ({
        ...a,
        [t]: {
          status: s,
          notes: a[t]?.notes ?? y[t]?.notes ?? "",
        },
      }));
    },
    be = (t, s) => {
      N((a) => ({
        ...a,
        [t]: {
          status: a[t]?.status ?? y[t]?.status ?? "absent",
          notes: s,
        },
      }));
    },
    L = React.useMemo(() => {
      const t = {
        present: 0,
        absent: 0,
        justified: 0,
      };
      return (
        p.forEach((s) => {
          const a = R[s.id]?.status || y[s.id]?.status;
          t[a || "absent"] += 1;
        }),
        t
      );
    }, [p, R, y]),
    Y = React.useMemo(() => {
      const t = de(o),
        s = g.filter((r) => de(r.date) === t && r.status !== "holiday"),
        a = {};
      return (
        p.forEach((r) => {
          a[r.id] = {
            name: r.name,
            present: 0,
            justified: 0,
            total: s.length,
          };
        }),
        q.forEach((r) => {
          a[r.userId] &&
            (r.status === "present" && (a[r.userId].present += 1),
            r.status === "justified" && (a[r.userId].justified += 1));
        }),
        Object.entries(a)
          .map(([r, i]) => ({
            userId: r,
            ...i,
          }))
          .sort((r, i) => r.name.localeCompare(i.name))
      );
    }, [p, q, o, g]),
    he = (t) => {
      O(t);
    },
    pe = async () => {
      if (c) {
        if (!ae(o)) {
          d.showError("La fecha debe ser martes");
          return;
        }
        Q(!0);
        try {
          const t = new Date();
          if (
            (await $e(
              se(firestoreDb, "teaching_sessions", o),
              {
                date: o,
                title: G.trim() || "Tiempo de ensenanza",
                status: u,
                notes: V.trim(),
                updatedAt: t,
                updatedBy: n?.uid || "",
                createdAt: T?.createdAt || t,
                createdBy: T?.createdBy || n?.uid || "",
              },
              {
                merge: !0,
              },
            ),
            u === "normal")
          ) {
            const s = Me(firestoreDb);
            (p.forEach((a) => {
              const r = X(a.id),
                i = se(
                  firestoreDb,
                  "teaching_attendance_records",
                  `${o}_${a.id}`,
                );
              s.set(
                i,
                {
                  date: o,
                  userId: a.id,
                  userName: a.name,
                  userPhoto: a.photoThumbURL || a.photoURL || "",
                  status: r.status,
                  notes: r.notes.trim(),
                  updatedAt: t,
                  updatedBy: n?.uid || "",
                },
                {
                  merge: !0,
                },
              );
            }),
              await s.commit());
          }
          d.showSuccess("Listado de martes guardado");
        } catch (t) {
          (console.error(t), d.showError("No se pudo guardar el listado"));
        } finally {
          Q(!1);
        }
      }
    },
    H = (t) => {
      const s = {};
      (C.forEach((a) => {
        s[a.id] = {
          status: t,
          notes: y[a.id]?.notes || "",
        };
      }),
        N((a) => ({
          ...a,
          ...s,
        })));
    };
  return m || !h || ne ? (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      {[
        <LoaderCircleIcon className="w-10 h-10 animate-spin text-sky-500" />,
        <p className="text-gray-500 dark:text-slate-400 text-sm">
          {"Cargando miembros..."}
        </p>,
      ]}
    </div>
  ) : b ? (
    <div className="space-y-6">
      {[
        <section className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            {[
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 flex items-center justify-center">
                <SparklesIcon size={28} />
              </div>,
              <div className="flex-1">
                {[
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {"Ensenanza de martes"}
                  </h1>,
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    {
                      "Listado semanal de miembros y servidores con feriados y justificaciones."
                    }
                  </p>,
                ]}
              </div>,
              <div className="grid grid-cols-3 gap-2 sm:gap-3 min-w-full lg:min-w-[360px]">
                {[
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
                    {[
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {L.present}
                      </div>,
                      <div className="text-xs text-emerald-700/70 dark:text-emerald-300/70">
                        {"Presentes"}
                      </div>,
                    ]}
                  </div>,
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3 text-center">
                    {[
                      <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        {L.justified}
                      </div>,
                      <div className="text-xs text-amber-700/70 dark:text-amber-300/70">
                        {"Justificados"}
                      </div>,
                    ]}
                  </div>,
                  <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-3 text-center">
                    {[
                      <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {L.absent}
                      </div>,
                      <div className="text-xs text-red-700/70 dark:text-red-300/70">
                        {"Ausentes"}
                      </div>,
                    ]}
                  </div>,
                ]}
              </div>,
            ]}
          </div>
        </section>,
        <section className="grid grid-cols-1 xl:grid-cols-[330px_1fr] gap-5">
          {[
            <aside className="space-y-4">
              {[
                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                  {[
                    <label className="block text-xs font-semibold uppercase text-gray-400 dark:text-slate-500 mb-2">
                      {"Fecha del martes"}
                    </label>,
                    <input
                      type="date"
                      value={o}
                      onChange={(t) => he(t.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    />,
                    !ae(o) && (
                      <div className="mt-3 text-xs text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl px-3 py-2">
                        {
                          "Esta seccion esta pensada para los martes. Escoge una fecha de martes para guardar."
                        }
                      </div>
                    ),
                    <div className="mt-4 space-y-3">
                      {[
                        <input
                          type="text"
                          value={G}
                          disabled={!c}
                          onChange={(t) => D(t.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white disabled:opacity-70"
                          placeholder="Titulo del tiempo"
                        />,
                        <textarea
                          value={V}
                          disabled={!c}
                          onChange={(t) => z(t.target.value)}
                          rows={3}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white disabled:opacity-70"
                          placeholder="Notas generales, motivo del feriado o detalle"
                        />,
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            <button
                              type="button"
                              disabled={!c}
                              onClick={() => v("normal")}
                              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium ${u === "normal" ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800" : "bg-white text-gray-600 border-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"} disabled:opacity-60`}
                            >
                              {[<CalendarDaysIcon size={16} />, " Normal"]}
                            </button>,
                            <button
                              type="button"
                              disabled={!c}
                              onClick={() => v("holiday")}
                              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium ${u === "holiday" ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800" : "bg-white text-gray-600 border-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"} disabled:opacity-60`}
                            >
                              {[<UmbrellaIcon size={16} />, " Feriado"]}
                            </button>,
                          ]}
                        </div>,
                      ]}
                    </div>,
                    c && (
                      <button
                        type="button"
                        onClick={pe}
                        disabled={W}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium disabled:opacity-60"
                      >
                        {[
                          W ? (
                            <LoaderCircleIcon
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckIcon size={17} />
                          ),
                          T ? "Guardar cambios" : "Crear martes",
                        ]}
                      </button>
                    ),
                  ]}
                </div>,
                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                  {[
                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {[
                        <ClockIcon size={18} className="text-sky-500" />,
                        "Martes registrados",
                      ]}
                    </h2>,
                    <div className="mt-3 space-y-2 max-h-[360px] overflow-y-auto">
                      {g.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-slate-500 py-4">
                          {"Aun no hay martes guardados."}
                        </p>
                      ) : (
                        g.map((t) =>
                          jsxRuntime.jsxs(
                            "button",
                            {
                              onClick: () => O(t.date),
                              className: `w-full text-left p-3 rounded-xl border transition-colors ${o === t.date ? "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-900/20" : "border-gray-100 bg-gray-50/60 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:bg-slate-900"}`,
                              children: [
                                <div className="flex items-center justify-between gap-2">
                                  {[
                                    <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                                      {t.date}
                                    </span>,
                                    t.status === "holiday" && (
                                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                                        {"Feriado"}
                                      </span>
                                    ),
                                  ]}
                                </div>,
                                <p className="text-xs text-gray-500 dark:text-slate-400 capitalize mt-1 truncate">
                                  {re(t.date)}
                                </p>,
                              ],
                            },
                            t.id,
                          ),
                        )
                      )}
                    </div>,
                  ]}
                </div>,
              ]}
            </aside>,
            <div className="space-y-5">
              {[
                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                  {[
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                      {[
                        <div className="flex-1">
                          {[
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                              {re(o)}
                            </h2>,
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                              {u === "holiday"
                                ? "Dia marcado como feriado o justificado general."
                                : `${C.length} personas en el listado.`}
                            </p>,
                          ]}
                        </div>,
                        u === "normal" && c && (
                          <div className="flex flex-wrap gap-2">
                            {[
                              <button
                                type="button"
                                onClick={() => H("present")}
                                className="px-3 py-2 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 text-sm font-medium dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
                              >
                                {"Todos presentes"}
                              </button>,
                              <button
                                type="button"
                                onClick={() => H("absent")}
                                className="px-3 py-2 rounded-xl border border-red-200 text-red-700 bg-red-50 text-sm font-medium dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
                              >
                                {"Todos ausentes"}
                              </button>,
                            ]}
                          </div>
                        ),
                      ]}
                    </div>,
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_220px_170px] gap-3">
                      {[
                        <div className="relative">
                          {[
                            <SearchIcon
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />,
                            <input
                              value={E}
                              onChange={(t) => ce(t.target.value)}
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                              placeholder="Buscar miembro o servidor"
                            />,
                          ]}
                        </div>,
                        <select
                          value={w}
                          onChange={(t) => xe(t.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        >
                          {[
                            <option value="all">
                              {"Todos los ministerios"}
                            </option>,
                            _.map((t) =>
                              jsxRuntime.jsx(
                                "option",
                                {
                                  value: t.id,
                                  children: t.name,
                                },
                                t.id,
                              ),
                            ),
                          ]}
                        </select>,
                        <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm text-gray-600 dark:text-slate-300">
                          {[
                            <input
                              type="checkbox"
                              checked={A}
                              onChange={(t) => me(t.target.checked)}
                              className="w-4 h-4"
                            />,
                            "Ver inactivos",
                          ]}
                        </label>,
                      ]}
                    </div>,
                  ]}
                </div>,
                u === "holiday" ? (
                  <div className="bg-white dark:bg-slate-800 border border-violet-100 dark:border-violet-800 rounded-2xl p-10 text-center shadow-sm">
                    {[
                      <UmbrellaIcon
                        size={42}
                        className="mx-auto text-violet-500 mb-3"
                      />,
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {"Este martes no requiere listado individual"}
                      </h3>,
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
                        {
                          "Queda guardado como feriado o dia justificado general. Las ausencias no se contaran contra los miembros para esta fecha."
                        }
                      </p>,
                    ]}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                    {ge ? (
                      <div className="flex items-center justify-center py-20">
                        <LoaderCircleIcon className="w-8 h-8 animate-spin text-sky-500" />
                      </div>
                    ) : C.length === 0 ? (
                      <div className="flex flex-col items-center py-20 text-center">
                        {[
                          <UsersIcon
                            size={32}
                            className="text-gray-300 mb-3"
                          />,
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {"No hay personas para mostrar con estos filtros."}
                          </p>,
                        ]}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 dark:divide-slate-700">
                        {C.map((t) => {
                          const s = X(t.id),
                            a = getAvatarUrl(t.photoThumbURL || t.photoURL);
                          return jsxRuntime.jsxs(
                            "div",
                            {
                              className:
                                "grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px_240px] gap-3 p-4 items-center",
                              children: [
                                <div className="flex items-center gap-3 min-w-0">
                                  {[
                                    a ? (
                                      <OptimizedImage
                                        src={a}
                                        alt={t.name}
                                        className="w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 flex-shrink-0"
                                        imgClassName="object-cover"
                                        fallbackIcon={
                                          <div className="w-full h-full rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-sm">
                                            {le(t.name)}
                                          </div>
                                        }
                                      />
                                    ) : (
                                      <div className="w-11 h-11 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-sm">
                                        {le(t.name)}
                                      </div>
                                    ),
                                    <div className="min-w-0">
                                      {[
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                                          {t.name}
                                        </p>,
                                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                          {t.status || "Activo"}
                                        </p>,
                                      ]}
                                    </div>,
                                  ]}
                                </div>,
                                <div className="grid grid-cols-3 gap-2">
                                  {["present", "absent", "justified"].map(
                                    (r) => {
                                      const i = Be[r],
                                        k = s.status === r;
                                      return (
                                        <button
                                          type="button"
                                          disabled={!c}
                                          onClick={() => ue(t.id, r)}
                                          className={`inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${k ? i.className : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-900"} disabled:opacity-70`}
                                          key={r}
                                        >
                                          {[
                                            i.icon,
                                            <span className="hidden sm:inline">
                                              {i.label}
                                            </span>,
                                          ]}
                                        </button>
                                      );
                                    },
                                  )}
                                </div>,
                                <input
                                  value={s.notes}
                                  disabled={!c}
                                  onChange={(r) => be(t.id, r.target.value)}
                                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white disabled:opacity-70"
                                  placeholder="Nota o motivo"
                                />,
                              ],
                            },
                            t.id,
                          );
                        })}
                      </div>
                    )}
                  </div>
                ),
                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                  {[
                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {[
                        <ChartColumnIcon size={18} className="text-sky-500" />,
                        "Resumen del mes",
                      ]}
                    </h2>,
                    <div className="mt-3 grid gap-2">
                      {[
                        Y.slice(0, 8).map((t) => {
                          const s = t.present + t.justified,
                            a =
                              t.total > 0 ? Math.round((s / t.total) * 100) : 0;
                          return jsxRuntime.jsxs(
                            "div",
                            {
                              className:
                                "grid grid-cols-[minmax(0,1fr)_90px] sm:grid-cols-[minmax(0,1fr)_180px_90px] gap-3 items-center rounded-xl bg-gray-50 dark:bg-slate-900/40 px-3 py-2.5",
                              children: [
                                <span className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">
                                  {t.name}
                                </span>,
                                <div className="hidden sm:block h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-sky-500"
                                    style={{
                                      width: `${a}%`,
                                    }}
                                  />
                                </div>,
                                <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 text-right">
                                  {[s, "/", t.total, " (", a, "%)"]}
                                </span>,
                              ],
                            },
                            t.userId,
                          );
                        }),
                        Y.length === 0 && (
                          <p className="text-sm text-gray-400 dark:text-slate-500 py-4">
                            {"Sin datos para este mes."}
                          </p>
                        ),
                      ]}
                    </div>,
                  ]}
                </div>,
              ]}
            </div>,
          ]}
        </section>,
      ]}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      {[
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          <UsersIcon size={28} className="text-gray-300 dark:text-slate-600" />
        </div>,
        <p className="text-gray-500 dark:text-slate-400 text-sm">
          {"No tienes acceso a esta seccion."}
        </p>,
      ]}
    </div>
  );
};
export { TuesdayTeaching, TuesdayTeaching as default };
