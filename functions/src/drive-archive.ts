type Environment = NodeJS.ProcessEnv;
type ArchiveIdentity = "service-account" | "user-oauth";

function failure(code: string): Error { return Object.assign(new Error(code), { code }); }

export function archiveFolderId(fallback: string, env: Environment = process.env): string {
  const id = (env.MCI_DRIVE_ARCHIVE_FOLDER_ID || fallback).trim();
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(id)) throw failure("INVALID_DRIVE_ARCHIVE_FOLDER_ID");
  return id;
}

/** Validate the archive destination using metadata only, before reading Storage objects. */
export async function prepareDriveArchive(options: { drive: any; folderId: string; identity: ArchiveIdentity }) {
  const folderId = archiveFolderId(options.folderId, {});
  let data: any;
  try {
    ({ data } = await options.drive.files.get({ fileId: folderId, supportsAllDrives: true,
      fields: "id,mimeType,trashed,driveId,capabilities(canAddChildren)" }));
  } catch { throw failure("DRIVE_ARCHIVE_FOLDER_UNAVAILABLE"); }
  if (data?.mimeType !== "application/vnd.google-apps.folder" || data.trashed) throw failure("DRIVE_ARCHIVE_DESTINATION_INVALID");
  if (data.capabilities?.canAddChildren !== true) throw failure("DRIVE_ARCHIVE_FOLDER_NOT_WRITABLE");
  // Sharing a personal My Drive folder does not give a service account storage
  // quota or ownership. A service account must write to a shared drive.
  if (options.identity === "service-account" && !data.driveId) throw failure("DRIVE_SERVICE_ACCOUNT_REQUIRES_SHARED_DRIVE");
  return { identity: options.identity, sharedDrive: !!data.driveId, canAddChildren: true };
}

/** ADC service account + shared drive, or explicitly provided offline user OAuth. */
export function createArchiveDriveClient(google: any, env: Environment = process.env): any {
  const mode = env.MCI_DRIVE_AUTH_MODE || "adc";
  const oauthValues = [env.MCI_DRIVE_OAUTH_CLIENT_ID, env.MCI_DRIVE_OAUTH_CLIENT_SECRET, env.MCI_DRIVE_OAUTH_REFRESH_TOKEN];
  if (!["adc", "oauth"].includes(mode)) throw failure("INVALID_DRIVE_AUTH_MODE");
  let auth: any;
  if (mode === "oauth") {
    if (oauthValues.some(value => typeof value !== "string" || !value.trim())) throw failure("DRIVE_OAUTH_CONFIGURATION_INCOMPLETE");
    auth = new google.auth.OAuth2(oauthValues[0], oauthValues[1]);
    auth.setCredentials({ refresh_token: oauthValues[2] });
  } else {
    if (oauthValues.some(Boolean)) throw failure("DRIVE_OAUTH_MODE_NOT_ENABLED");
    auth = new google.auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/drive"] });
  }
  const drive = google.drive({ version: "v3", auth });
  const prepared = new Map<string, Promise<any>>();
  const prepareArchive = async (folderId: string) => {
    const key = archiveFolderId(folderId, {});
    if (!prepared.has(key)) {
      prepared.set(key, (async () => {
        let identity: ArchiveIdentity = "user-oauth";
        if (mode === "adc") {
          let email: string;
          try { email = (await auth.getCredentials()).client_email || ""; }
          catch { throw failure("DRIVE_ADC_IDENTITY_UNAVAILABLE"); }
          if (!email.endsWith(".gserviceaccount.com")) throw failure("DRIVE_ADC_IDENTITY_UNVERIFIED_USE_EXPLICIT_OAUTH");
          identity = "service-account";
        }
        return prepareDriveArchive({ drive, folderId: key, identity });
      })());
    }
    try { return await prepared.get(key); }
    catch (error) { prepared.delete(key); throw error; }
  };
  const create = drive.files.create.bind(drive.files);
  // Guard direct create calls as well as the scheduled cleanup's preflight.
  drive.files.create = async (request: any) => {
    const parents = request.requestBody?.parents;
    if (!Array.isArray(parents) || parents.length !== 1) throw failure("DRIVE_ARCHIVE_PARENT_REQUIRED");
    await prepareArchive(parents[0]);
    return create({ ...request, supportsAllDrives: true });
  };
  drive.prepareArchive = prepareArchive;
  return drive;
}
