// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
const Ct = "U de la Vida";
const normalizeMinistryName = t => String(t || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, " ").trim();
const pr = t => {
  const s = normalizeMinistryName(t);
  return s.includes("u de la vida") || s === normalizeMinistryName(Ct);
};
const St = (t = []) => t.find(s => pr(s.name));
const getUdlvMinistryId = (t = []) => St(t)?.id || null;
const getUdlvMinistryName = (t = []) => St(t)?.name || Ct;
const hasUdlvAccess = (t, s = []) => {
  if (!t) return !1;
  const r = getUdlvMinistryId(s),
    n = getUdlvMinistryName(s),
    a = Array.isArray(t.assignedMinistries) ? t.assignedMinistries : [],
    l = Array.isArray(t.areas) ? t.areas : [];
  return (r ? a.includes(r) : !1) || l.some(c => normalizeMinistryName(c) === normalizeMinistryName(n));
};
const hasOtherMinistries = (t, s = []) => {
  if (!t) return !1;
  const r = getUdlvMinistryId(s),
    n = getUdlvMinistryName(s),
    a = Array.isArray(t.assignedMinistries) ? t.assignedMinistries : [],
    l = Array.isArray(t.areas) ? t.areas : [],
    c = r ? a.some(h => h && h !== r) : a.length > 0,
    f = l.some(h => h && normalizeMinistryName(h) !== normalizeMinistryName(n));
  return c || f;
};
export { Ct, normalizeMinistryName, pr, St, getUdlvMinistryId, getUdlvMinistryName, hasUdlvAccess, hasOtherMinistries };
