// Maintained event cards based on the published MCI layout and data contract.
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import { OptimizedImage } from "./OptimizedImage.jsx";
import {
  d as CalendarIcon,
  s as ClockIcon,
  n as MapPinIcon,
  y as SquarePenIcon,
  r as Trash2Icon,
} from "../vendor/vendor-ui-CnvYSvQL.js";

const imageReference = (value) => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(imageReference).find(Boolean) || "";
  if (value && typeof value === "object") {
    return [value.url, value.href, value.downloadURL, value.downloadUrl].map(imageReference).find(Boolean) || "";
  }
  return "";
};

const EventActions = ({ event, onEdit, onDelete }) => {
  const menu = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const close = (returnFocus = false) => {
    if (!menu.current) return;
    menu.current.open = false;
    setOpen(false);
    if (returnFocus) menu.current.querySelector("summary")?.focus();
  };
  React.useEffect(() => {
    if (!open) return;
    const outside = (click) => {
      if (menu.current && !menu.current.contains(click.target)) close();
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return (
    <details
      ref={menu}
      className="mci-event-menu"
      onToggle={(toggle) => setOpen(toggle.currentTarget.open)}
      onKeyDown={(key) => {
        if (key.key === "Escape") {
          key.preventDefault();
          key.stopPropagation();
          close(true);
        }
      }}
      onBlur={(blur) => {
        if (blur.relatedTarget && !blur.currentTarget.contains(blur.relatedTarget)) close();
      }}
    >
      <summary aria-label={`Administrar ${event.title}`}>Administrar</summary>
      <div className="mci-event-menu-items">
        {onEdit && <button type="button" onClick={() => { close(true); onEdit(event); }}><SquarePenIcon size={16} />Editar</button>}
        {onDelete && <button type="button" className="mci-event-delete" onClick={() => { close(true); onDelete(event); }}><Trash2Icon size={16} />Eliminar</button>}
      </div>
    </details>
  );
};

const EventsGrid = ({ events, assignments, navigate, variant = "simple", onEdit, onDelete }) => {
  const openEvent = (event, id) => {
    // Preserve normal link behavior for new tabs, copy-link and modified clicks.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(`/dashboard/events/${id}`);
  };
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {events.length ? events.map((event) => {
        const cover = [event.imageThumbUrl, event.coverUrl, event.imageUrl].map(imageReference).find(Boolean) || "";
        const date = new Date(event.date + "T" + (event.time || "00:00"));
        const formattedDate = Number.isNaN(date.getTime()) ? event.date : date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
        const assigned = (assignments || []).filter((item) => item.eventId === event.id);
        const type = event.type === "service" ? "Servicio" : event.type;
        return (
          <article key={event.id} className={`mci-event-card${cover ? "" : " mci-event-card--compact"}`}>
            {cover && (
              <div className="mci-event-cover">
                <OptimizedImage src={cover} alt={event.title} className="w-full h-full" imgClassName="object-contain" />
              </div>
            )}
            <div className="mci-event-compact-heading">
              {type && <span className="mci-event-type">{type}</span>}
              {event.status === "completed" && <span className="mci-event-status">Completado</span>}
              {event.status === "cancelled" && <span className="mci-event-status mci-event-status--cancelled">Cancelado</span>}
            </div>
            <div className="mci-event-content">
              <h3 className="mci-event-title"><a href={`/dashboard/events/${event.id}`} onClick={(click) => openEvent(click, event.id)}>{event.title}</a></h3>
              <dl className="mci-event-facts">
                <div><dt><CalendarIcon size={17} /><span className="sr-only">Fecha</span></dt><dd>{formattedDate}</dd></div>
                <div><dt><ClockIcon size={17} /><span className="sr-only">Horario</span></dt><dd>{event.time || "Sin horario"}{event.endTime ? ` – ${event.endTime}` : ""}{event.serviceTime && event.serviceTime !== event.time && <span className="mci-event-service-time">Servicio: {event.serviceTime}</span>}</dd></div>
                {event.location && <div><dt><MapPinIcon size={17} /><span className="sr-only">Lugar</span></dt><dd>{event.location}</dd></div>}
              </dl>
              {variant !== "detailed" && <p className="mci-event-description">{event.description || "Sin descripción"}</p>}
              {variant !== "detailed" && (
                <div className="mci-event-assignees" aria-label={`${assigned.length} personas asignadas`}>
                  {assigned.length ? <>
                    {assigned.slice(0, 3).map((person, personIndex) => <span key={person.id || personIndex} className="mci-event-avatar" title={person.roleName ? `${person.roleName}: ${person.userName || "Servidor"}` : person.userName || "Servidor"}>{(person.userName || "?").charAt(0).toUpperCase()}</span>)}
                    <span>{assigned.length} {assigned.length === 1 ? "persona asignada" : "personas asignadas"}</span>
                  </> : <span>Sin asignar</span>}
                </div>
              )}
              <div className="mci-event-actions">
                <a className="mci-event-details" href={`/dashboard/events/${event.id}`} onClick={(click) => openEvent(click, event.id)}>Ver detalles<span aria-hidden="true"> →</span></a>
                {(onEdit || onDelete) && <EventActions event={event} onEdit={onEdit} onDelete={onDelete} />}
              </div>
            </div>
          </article>
        );
      }) : (
        <div className="mci-events-empty col-span-1 md:col-span-2 lg:col-span-3">
          <CalendarIcon size={28} />
          <p>No hay eventos en este periodo</p>
          <span>Prueba otra fecha o cambia los filtros.</span>
        </div>
      )}
    </div>
  );
};
export { EventsGrid };
