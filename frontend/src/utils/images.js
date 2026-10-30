// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { resolveProtectedImage, protectedImageProxy } from "../services/private-image-client.js";
const lr = t => {
  if (!t || t.startsWith("/api/download") || t.startsWith("data:") || t.startsWith("/") || t.startsWith("./") || t.startsWith("../")) return null;
  if (t.startsWith("gs://")) {
    const r = t.slice(5),
      n = r.indexOf("/");
    return n < 0 ? null : r.slice(n + 1);
  }
  if (t.includes("firebasestorage.googleapis.com")) {
    const n = t.indexOf("/o/");
    if (n < 0) return null;
    const a = t.slice(n + 3),
      l = a.indexOf("?"),
      c = l >= 0 ? a.slice(0, l) : a;
    try {
      return decodeURIComponent(c);
    } catch {
      return c;
    }
  }
  if (t.startsWith("https://storage.googleapis.com/")) {
    const r = t.slice(31),
      n = r.indexOf("/");
    if (n < 0) return null;
    const a = r.slice(n + 1),
      l = a.indexOf("?");
    return l >= 0 ? a.slice(0, l) : a;
  }
  return !t.startsWith("http://") && !t.startsWith("https://") && t.includes("/") ? t : null;
};
const cr = t => `/api/download?path=${encodeURIComponent(t)}&inline=1`;
const dr = (t, s = 400) => {
  if (!t) return;
  {
    const n = lr(t);
    if (n) return cr(n);
  }
  if (["googleusercontent.com", "lh3.google.com", "lh4.google.com", "lh5.google.com", "lh6.google.com", "ggpht.com"].some(n => t.includes(n))) {
    let n = t.split("=")[0];
    return n = n.split("?")[0], `${n}=s${s}-c`;
  }
  return t.includes("firebasestorage.googleapis.com") && t.includes("?"), t;
};
const getAvatarUrl = t => dr(t, 128);
const compressImage = (t, s = 1200, r = 0.8) => new Promise((n, a) => {
  if (!t.type.startsWith("image/")) {
    n(t);
    return;
  }
  const l = new FileReader();
  l.readAsDataURL(t), l.onload = c => {
    const f = new Image();
    f.src = c.target?.result, f.onload = () => {
      const h = document.createElement("canvas");
      let b = f.width,
        p = f.height;
      b > s && (p = Math.round(p * s / b), b = s), h.width = b, h.height = p;
      const u = h.getContext("2d");
      if (!u) {
        n(t);
        return;
      }
      u.drawImage(f, 0, 0, b, p), h.toBlob(E => {
        if (!E) {
          n(t);
          return;
        }
        const v = new File([E], t.name, {
          type: "image/jpeg",
          lastModified: Date.now()
        });
        v.size < t.size ? n(v) : n(t);
      }, "image/jpeg", r);
    }, f.onerror = () => a(new Error("Error al cargar la imagen"));
  }, l.onerror = () => a(new Error("Error al leer el archivo"));
});
const dataUrlToBlob = t => {
  const s = String(t || "").trim();
  if (!s.startsWith("data:")) throw new Error("INVALID_DATA_URL");
  const r = s.indexOf(",");
  if (r < 0) throw new Error("INVALID_DATA_URL");
  const n = s.slice(0, r),
    a = s.slice(r + 1),
    l = /;base64/i.test(n),
    f = /^data:([^;]+)/i.exec(n)?.[1] || "application/octet-stream";
  if (!l) {
    const u = decodeURIComponent(a);
    return new Blob([u], {
      type: f
    });
  }
  const h = atob(a),
    b = h.length,
    p = new Uint8Array(b);
  for (let u = 0; u < b; u += 1) p[u] = h.charCodeAt(u);
  return new Blob([p], {
    type: f
  });
};
const Me = new Map();
const br = "mci-images-cache-v1";
const yr = async (t, s, r) => {
  try {
    const n = r.includes("?") ? "&" : "?",
      a = `${r}${n}mode=url`,
      l = await fetch(a, {
        credentials: "include"
      });
    if (!l.ok) return;
    let c = "";
    if ((l.headers.get("content-type") || "").includes("application/json")) c = (await l.json()).url;else return;
    if (!c) return;
    const h = await fetch(c, {
      mode: "cors"
    });
    if (h.ok) {
      await t.put(s, h.clone());
      const b = await h.blob();
      return URL.createObjectURL(b);
    }
    return;
  } catch (n) {
    console.warn("Fallo al descargar imagen BFF:", n);
    return;
  }
};
const vr = async (t, s, r = !1) => {
  if (!("caches" in window)) return await s();
  try {
    const n = await caches.open(br),
      a = await n.match(t);
    if (a) {
      const c = await a.blob();
      return URL.createObjectURL(c);
    }
    const l = await s();
    if (!l) return;
    if (r) return await yr(n, t, l);
    if (l.startsWith("data:") || l.startsWith("blob:")) return l;
    try {
      const c = await fetch(l, {
        mode: "cors"
      });
      if (c.ok) {
        await n.put(t, c.clone());
        const f = await c.blob();
        return URL.createObjectURL(f);
      }
    } catch (c) {
      console.warn("Fallo al cachear imagen, usando URL directa:", c);
    }
    return l;
  } catch {
    return s();
  }
};
const wr = t => {
  if (!t || t.startsWith("/api/download") || t.startsWith("data:") || t.startsWith("/") || t.startsWith("./") || t.startsWith("../")) return null;
  if (t.startsWith("gs://")) {
    const r = t.slice(5),
      n = r.indexOf("/");
    return n < 0 ? null : r.slice(n + 1);
  }
  if (t.includes("firebasestorage.googleapis.com")) {
    const n = t.indexOf("/o/");
    if (n < 0) return null;
    const a = t.slice(n + 3),
      l = a.indexOf("?"),
      c = l >= 0 ? a.slice(0, l) : a;
    try {
      return decodeURIComponent(c);
    } catch {
      return c;
    }
  }
  if (t.startsWith("https://storage.googleapis.com/")) {
    const r = t.slice(31),
      n = r.indexOf("/");
    if (n < 0) return null;
    const a = r.slice(n + 1),
      l = a.indexOf("?");
    return l >= 0 ? a.slice(0, l) : a;
  }
  return !t.startsWith("http://") && !t.startsWith("https://") && t.includes("/") ? t : null;
};
const dt = t => `/api/download?path=${encodeURIComponent(t)}&inline=1`;
const resolveCachedImageUrl = async (source, options) => {
  if (typeof source !== 'string' || !source) return source;
  return protectedImageProxy(source) ? resolveProtectedImage(source, options) : source;
};
export { lr, cr, dr, getAvatarUrl, compressImage, dataUrlToBlob, Me, br, yr, vr, wr, dt, resolveCachedImageUrl };
