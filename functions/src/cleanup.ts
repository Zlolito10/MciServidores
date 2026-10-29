import { PassThrough } from "node:stream";
import { createHash } from "node:crypto";

/** Archive first, then delete; dependency injection keeps the scheduled operation testable. */
export async function archiveOldEventFiles(options: { bucket: any; drive: any; folderId: string; now?: Date; maxAgeDays?: number; logger?: Pick<Console, "info" | "warn"> }) {
  const { bucket, drive, folderId, now = new Date(), maxAgeDays = 14, logger = console } = options;
  const result = { archived: 0, deleted: 0, skipped: 0, errors: 0 };
  if (!folderId || folderId === "YOUR_DRIVE_FOLDER_ID_HERE" || !drive) return result;
  if (!Number.isFinite(now.getTime()) || !Number.isFinite(maxAgeDays) || maxAgeDays <= 0) throw new Error("INVALID_ARCHIVE_AGE_WINDOW");
  // The real adapter checks identity, destination and declared write capability
  // before any Storage listing/download. The demo adapter has no external Drive.
  if (typeof drive.prepareArchive === "function") await drive.prepareArchive(folderId);
  const cutoff = now.getTime() - maxAgeDays * 86400000;
  const [files] = await bucket.getFiles({ prefix: "events/" });
  for (const file of files) {
    if (!file.name.startsWith("events/")) { result.skipped++; continue; }
    try {
      const [metadata] = await file.getMetadata();
      const created = new Date(metadata.timeCreated);
      if (!Number.isFinite(created.getTime()) || created.getTime() >= cutoff) { result.skipped++; continue; }
      // Guard the final delete against another upload replacing this object
      // while Drive is receiving its archive. GCS generation IDs are strings.
      const generation = String(metadata.generation || "");
      if (!/^[1-9][0-9]*$/.test(generation)) throw new Error("STORAGE_GENERATION_UNAVAILABLE");
      const [bytes] = await file.download();
      const md5Checksum = createHash("md5").update(bytes).digest("hex");
      const body = new PassThrough(); body.end(bytes);
      const response = await drive.files.create({
        supportsAllDrives: true,
        fields: "id,size,md5Checksum",
        requestBody: { name: file.name.split("/").pop(), parents: [folderId], description: `Respaldo automático Church App. Ruta original: ${file.name}. Fecha: ${created.toISOString()}` },
        media: { mimeType: metadata.contentType || "application/octet-stream", body },
      });
      if (!response?.data?.id) throw new Error("DRIVE_ARCHIVE_NOT_CONFIRMED");
      if (String(response.data.size) !== String(bytes.length) || response.data.md5Checksum !== md5Checksum) throw new Error("DRIVE_ARCHIVE_BYTES_NOT_CONFIRMED");
      result.archived++;
      await file.delete({ ifGenerationMatch: generation }); result.deleted++;
    } catch (error) { result.errors++; logger.warn("[Cleanup] Archive/delete failed", { name: file.name, code: (error as any)?.code || "ARCHIVE_FAILED" }); }
  }
  logger.info("[Cleanup] Completed", result);
  return result;
}
