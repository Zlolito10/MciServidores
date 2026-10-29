// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import { A as v, H as S, E as w, I as m, $ as h, K as x, J as p, T as J } from "../vendor/vendor-firebase-BjYbfC3F.js";
import { firestoreDb } from "../app/App.jsx";
const $ = "chat_v2_";
const useOptimizedChat = a => {
  const [M, d] = React.useState([]),
    [b, u] = React.useState(!1),
    [f, y] = React.useState(null),
    R = React.useRef(!1);
  return React.useEffect(() => {
    if (!a) {
      y(null);
      return;
    }
    const c = v(firestoreDb, "private_chats", a),
      n = S(c, A => {
        if (A.exists()) {
          const r = A.data();
          r.clearedAt && y(r.clearedAt);
        }
      });
    return () => n();
  }, [a]), React.useEffect(() => {
    if (!a) {
      d([]);
      return;
    }
    const c = `${$}${a}`,
      n = w(firestoreDb, "private_chats", a, "messages");
    let r = (() => {
      try {
        const e = localStorage.getItem(c);
        if (e) return JSON.parse(e).map(t => ({
          ...t,
          createdAt: t.createdAt ? new J(t.createdAt.seconds, t.createdAt.nanoseconds) : null
        }));
      } catch (e) {
        console.warn("Error loading chat cache", e);
      }
      return [];
    })();
    d(r), r.length > 0 ? R.current = !0 : u(!0);
    let i;
    if (r.length > 0) {
      const e = r[r.length - 1];
      e.createdAt ? i = m(n, p("createdAt", "asc"), x("createdAt", ">", e.createdAt), h(50)) : i = m(n, p("createdAt", "asc"), h(50));
    } else i = m(n, p("createdAt", "asc"), h(50));
    const _ = S(i, e => {
      if (e.empty) {
        u(!1);
        return;
      }
      d(E => {
        const g = [];
        e.docs.forEach(s => {
          const l = s.data();
          g.push({
            id: s.id,
            ...l
          });
        });
        const t = [...E];
        g.forEach(s => {
          t.some(l => l.id === s.id) || t.push(s);
        }), t.sort((s, l) => {
          const O = s.createdAt?.toMillis() || 0,
            T = l.createdAt?.toMillis() || 0;
          return O - T;
        });
        try {
          const s = t.slice(-100);
          localStorage.setItem(c, JSON.stringify(s));
        } catch {}
        return t;
      }), u(!1);
    });
    return () => _();
  }, [a]), {
    messages: React.useMemo(() => M.filter(c => !f || !c.createdAt ? !0 : c.createdAt.toMillis() > f.toMillis()), [M, f]),
    loading: b
  };
};
export { useOptimizedChat };
