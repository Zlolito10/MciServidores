import { r as o } from "./vendor-react-BwINE3B3.js";
import {
  A as v,
  H as S,
  E as w,
  I as m,
  $ as h,
  K as x,
  J as p,
  T as J,
} from "./vendor-firebase-BjYbfC3F.js";
import { e as C } from "./App-BPrQ3EPG.js";
const $ = "chat_v2_",
  L = (a) => {
    const [M, d] = o.useState([]),
      [b, u] = o.useState(!1),
      [f, y] = o.useState(null),
      R = o.useRef(!1);
    return (
      o.useEffect(() => {
        if (!a) {
          y(null);
          return;
        }
        const c = v(C, "private_chats", a),
          n = S(c, (A) => {
            if (A.exists()) {
              const r = A.data();
              r.clearedAt && y(r.clearedAt);
            }
          });
        return () => n();
      }, [a]),
      o.useEffect(() => {
        if (!a) {
          d([]);
          return;
        }
        const c = `${$}${a}`,
          n = w(C, "private_chats", a, "messages");
        let r = (() => {
          try {
            const e = localStorage.getItem(c);
            if (e)
              return JSON.parse(e).map((t) => ({
                ...t,
                createdAt: t.createdAt
                  ? new J(t.createdAt.seconds, t.createdAt.nanoseconds)
                  : null,
              }));
          } catch (e) {
            console.warn("Error loading chat cache", e);
          }
          return [];
        })();
        (d(r), r.length > 0 ? (R.current = !0) : u(!0));
        let i;
        if (r.length > 0) {
          const e = r[r.length - 1];
          e.createdAt
            ? (i = m(
                n,
                p("createdAt", "asc"),
                x("createdAt", ">", e.createdAt),
                h(50),
              ))
            : (i = m(n, p("createdAt", "asc"), h(50)));
        } else i = m(n, p("createdAt", "asc"), h(50));
        const _ = S(i, (e) => {
          if (e.empty) {
            u(!1);
            return;
          }
          (d((E) => {
            const g = [];
            e.docs.forEach((s) => {
              const l = s.data();
              g.push({ id: s.id, ...l });
            });
            const t = [...E];
            (g.forEach((s) => {
              t.some((l) => l.id === s.id) || t.push(s);
            }),
              t.sort((s, l) => {
                const O = s.createdAt?.toMillis() || 0,
                  T = l.createdAt?.toMillis() || 0;
                return O - T;
              }));
            try {
              const s = t.slice(-100);
              localStorage.setItem(c, JSON.stringify(s));
            } catch {}
            return t;
          }),
            u(!1));
        });
        return () => _();
      }, [a]),
      {
        messages: o.useMemo(
          () =>
            M.filter((c) =>
              !f || !c.createdAt ? !0 : c.createdAt.toMillis() > f.toMillis(),
            ),
          [M, f],
        ),
        loading: b,
      }
    );
  };
export { L as u };
