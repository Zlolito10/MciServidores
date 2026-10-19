const n = "__NO_ROLE__",
  e = "Sin rol";
function i(t) {
  if (t == null) return !0;
  const r = t.trim();
  return !r || r === n || r.toLowerCase() === e.toLowerCase();
}
function o(t) {
  return i(t) ? "" : t.trim();
}
export { n as N, o as f, i };
