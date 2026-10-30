/** Public-to-members directory. Full profiles and their cache remain private. */
const directoryStrings: Record<string, number> = {
  name: 200, username: 120, photoURL: 2048, photoThumbURL: 2048, role: 160,
};

export function userDirectoryEntry(id: string, data: any): any {
  const entry: any = { id, uid: id };
  if (!data || typeof data !== "object" || Array.isArray(data)) return entry;
  for (const [field, maximum] of Object.entries(directoryStrings)) {
    if (typeof data[field] === "string") entry[field] = data[field].slice(0, maximum);
  }
  if (Array.isArray(data.areas)) entry.areas = [...new Set(data.areas.filter((value: unknown) => typeof value === "string" && value.length <= 160))].slice(0, 50);
  // Event assignment pickers need role eligibility within each named ministry.
  // Copy only the role-id arrays; never arbitrary nested permission/profile data.
  if (data.ministryRoles && typeof data.ministryRoles === "object" && !Array.isArray(data.ministryRoles)) {
    const ministryRoles: Record<string, string[]> = {};
    for (const [area, roles] of Object.entries(data.ministryRoles).slice(0, 50)) {
      if (!area || area.length > 160 || ["__proto__", "prototype", "constructor"].includes(area) || !Array.isArray(roles)) continue;
      ministryRoles[area] = [...new Set(roles.filter((role: unknown): role is string => typeof role === "string" && role.length > 0 && role.length <= 160))].slice(0, 50);
    }
    entry.ministryRoles = ministryRoles;
  }
  if (typeof data.isAssigned === "boolean") entry.isAssigned = data.isAssigned;
  return entry;
}

export function sanitizeUserDirectory(items: any[]): any[] {
  return items.filter(item => item && typeof item.id === "string" && item.id && !/[\/\x00-\x1f]/.test(item.id))
    .map(item => userDirectoryEntry(item.id, item));
}

/** Read current source inside the transaction: an old trigger cannot resurrect a deleted profile. */
export async function syncUserDirectory({ db, userId, timestamp }: { db: any; userId: string; timestamp: any }): Promise<void> {
  const source = db.collection("users").doc(userId);
  const target = db.collection("user_directory").doc(userId);
  const cache = db.collection("app_cache").doc("user_directory");
  await db.runTransaction(async (transaction: any) => {
    const [profile, currentTarget, currentCache] = await Promise.all([transaction.get(source), transaction.get(target), transaction.get(cache)]);
    const projection = profile.exists ? userDirectoryEntry(userId, profile.data()) : null;
    const items = sanitizeUserDirectory(Array.isArray(currentCache.data()?.items) ? currentCache.data().items : []);
    const nextItems = items.filter(item => item.id !== userId);
    if (projection) nextItems.push(projection);
    nextItems.sort((a, b) => a.id.localeCompare(b.id));
    if (projection && (!currentTarget.exists || JSON.stringify(currentTarget.data()) !== JSON.stringify(projection))) transaction.set(target, projection);
    else if (!projection && currentTarget.exists) transaction.delete(target);
    // A missing cache stays missing until the read path builds a complete cache.
    // Never publish one changed user as if it were the complete directory.
    if (currentCache.exists && JSON.stringify(currentCache.data()?.items) !== JSON.stringify(nextItems)) {
      transaction.set(cache, { items: nextItems, schemaVersion: 1, updatedAt: timestamp });
    }
  });
}

/** The web and HTTP registration paths enforce the same ten-device ceiling. */
export async function registerDeviceToken(db: any, uid: string, token: string, timestamp: any): Promise<void> {
  const ref = db.collection("userTokens").doc(uid);
  await db.runTransaction(async (transaction: any) => {
    const snapshot = await transaction.get(ref);
    const raw = snapshot.data()?.tokens;
    const tokens = [...new Set((Array.isArray(raw) ? raw : []).filter((value: unknown): value is string => typeof value === "string" && value.length > 0 && value.length <= 4096))];
    if (!tokens.includes(token)) {
      if (tokens.length >= 10) throw Object.assign(new Error("DEVICE_LIMIT_REACHED"), { status: 409 });
      tokens.push(token);
    }
    transaction.set(ref, { userId: uid, tokens, updatedAt: timestamp }, { merge: true });
  });
}
