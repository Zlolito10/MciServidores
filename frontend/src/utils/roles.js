// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
const NO_ROLE_ID = "__NO_ROLE__";
const e = "Sin rol";
function isUnassignedRole(t) {
  if (t == null) return !0;
  const r = t.trim();
  return !r || r === NO_ROLE_ID || r.toLowerCase() === e.toLowerCase();
}
function normalizeRoleId(t) {
  return isUnassignedRole(t) ? "" : t.trim();
}
export { NO_ROLE_ID, normalizeRoleId, isUnassignedRole };
