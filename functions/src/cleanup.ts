import { PassThrough } from "node:stream";

/** Archive first, then delete; dependency injection keeps the scheduled operation testable. */
export async function archiveOldEventFiles(options: { bucket: any; drive: any; folderId: string; now?: Date; maxAgeDays?: number; logger?: Pick<Console, "info" | "warn"> }) {
  const { bucket, drive, folderId, now = new Date(), maxAgeDays = 14, logger = console } = options;
  const result = { archived: 0, deleted: 0, skipped: 0, errors: 0 };
  if (!folderId || folderId === "YOUR_DRIVE_FOLDER_ID_HERE" || !drive) return result;
  const cutoff = now.getTime() - maxAgeDays * 86400000;
  const [files] = await bucket.getFiles();
  for (const file of files) {
    if (!file.name.startsWith("events/")) { result.skipped++; continue; }
    try {
      const [metadata] = await file.getMetadata();
      const created = new Date(metadata.timeCreated);
      if (!Number.isFinite(created.getTime()) || created.getTime() >= cutoff) { result.skipped++; continue; }
      const [bytes] = await file.download();
      const body = new PassThrough(); body.end(bytes);
      const response = await drive.files.create({
        requestBody: { name: file.name.split("/").pop(), parents: [folderId], description: `Respaldo automático Church App. Ruta original: ${file.name}. Fecha: ${created.toISOString()}` },
        media: { mimeType: metadata.contentType || "application/octet-stream", body },
      });
      if (!response?.data?.id) throw new Error("DRIVE_ARCHIVE_NOT_CONFIRMED");
      result.archived++;
      await file.delete(); result.deleted++;
    } catch (error) { result.errors++; logger.warn("[Cleanup] Archive/delete failed", { name: file.name, code: (error as any)?.code || "ARCHIVE_FAILED" }); }
  }
  logger.info("[Cleanup] Completed", result);
  return result;
}
