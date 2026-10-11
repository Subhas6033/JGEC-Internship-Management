import { google } from "googleapis";
import { Readable } from "node:stream";

const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
const PDF_MIME_TYPE = "application/pdf";

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const oauth2Client = new google.auth.OAuth2(
  getRequiredEnv("GOOGLE_CLIENT_ID"),
  getRequiredEnv("GOOGLE_CLIENT_SECRET"),
  getRequiredEnv("GOOGLE_REDIRECT_URI"),
);

oauth2Client.setCredentials({
  refresh_token: getRequiredEnv("GOOGLE_REFRESH_TOKEN"),
});

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const getRootFolderId = () => getRequiredEnv("GOOGLE_NOC_ROOT_FOLDER_ID");

const sanitizeDepartment = (department) => {
  const value = String(department || "GEN")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");

  return value || "GEN";
};

const sanitizeFolderName = (value) => {
  const result = String(value ?? "")
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

  if (!result || result === "." || result === "..") {
    throw new Error("Invalid Google Drive folder name");
  }

  return result;
};

const sanitizeFileName = (fileName) => {
  let result = String(fileName ?? "")
    .split(/[\\/]/)
    .pop()
    .replace(/[\x00-\x1F<>:"/\\|?*]/g, "_")
    .trim();

  if (!result || result === "." || result === "..") {
    throw new Error("A valid NOC filename is required");
  }

  if (!result.toLowerCase().endsWith(".pdf")) {
    result += ".pdf";
  }

  return result;
};

const escapeDriveQuery = (value) =>
  String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

async function getOrCreateFolder(name, parentId) {
  const safeName = sanitizeFolderName(name);

  // Paginate to avoid missing a folder if the result list is long.
  let pageToken;

  do {
    const response = await drive.files.list({
      q: [
        `name = '${escapeDriveQuery(safeName)}'`,
        `mimeType = '${FOLDER_MIME_TYPE}'`,
        "trashed = false",
        `'${escapeDriveQuery(parentId)}' in parents`,
      ].join(" and "),
      pageSize: 100,
      pageToken,
      spaces: "drive",
      fields: "nextPageToken,files(id,name,mimeType,parents)",
    });

    const folder = response.data.files?.[0];

    if (folder?.id) {
      return folder.id;
    }

    pageToken = response.data.nextPageToken;
  } while (pageToken);

  const created = await drive.files.create({
    requestBody: {
      name: safeName,
      mimeType: FOLDER_MIME_TYPE,
      parents: [parentId],
    },
    fields: "id,name",
  });

  if (!created.data.id) {
    throw new Error(`Could not create Google Drive folder: ${safeName}`);
  }

  return created.data.id;
}

/**
 * Store the generated PDF in:
 * My Drive/JGEC-NOCs/<year>/<department>/<filename>.pdf
 *
 * filePath is retained for compatibility with the existing NOC model,
 * but now contains a Drive file ID, not a local path.
 */
export const saveNocPdf = async ({
  pdfBuffer,
  academicYear,
  department,
  fileName,
}) => {
  if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
    throw new Error("A valid PDF buffer is required");
  }

  if (pdfBuffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new Error("The supplied buffer is not a valid PDF");
  }

  const year = Number(academicYear);

  if (!Number.isInteger(year) || year < 2000 || year > 9999) {
    throw new Error("A valid four-digit academic year is required");
  }

  const safeDepartment = sanitizeDepartment(department);
  const safeFileName = sanitizeFileName(fileName);

  const rootFolderId = getRootFolderId();

  const yearFolderId = await getOrCreateFolder(String(year), rootFolderId);

  const departmentFolderId = await getOrCreateFolder(
    safeDepartment,
    yearFolderId,
  );

  const uploaded = await drive.files.create({
    requestBody: {
      name: safeFileName,
      mimeType: PDF_MIME_TYPE,
      parents: [departmentFolderId],
    },
    media: {
      mimeType: PDF_MIME_TYPE,
      body: Readable.from(pdfBuffer),
    },
    fields: "id,name,mimeType,size,createdTime",
  });

  const driveFileId = uploaded.data.id;

  if (!driveFileId) {
    throw new Error("Google Drive upload did not return a file ID");
  }

  return {
    storageProvider: "google_drive",
    driveFileId,

    // Compatibility fields. filePath is no longer a filesystem path.
    filePath: driveFileId,
    relativeFilePath: driveFileId,
    absoluteFilePath: null,

    fileName: uploaded.data.name || safeFileName,
    fileUrl: null,
    fileSize: Number(uploaded.data.size ?? pdfBuffer.length),
    mimeType: PDF_MIME_TYPE,
    createdAt: uploaded.data.createdTime
      ? new Date(uploaded.data.createdTime)
      : new Date(),
  };
};

/**
 * Stream a private PDF from Google Drive.
 * Use this from your authenticated backend download route.
 */
export const getNocPdfStream = async (driveFileId) => {
  if (!driveFileId) {
    throw new Error("Google Drive file ID is required");
  }

  const response = await drive.files.get(
    {
      fileId: driveFileId,
      alt: "media",
    },
    {
      responseType: "stream",
    },
  );

  return response.data;
};

/**
 * Delete the PDF from Google Drive.
 *
 * For older local NOCs, keep a separate legacy local-file deletion
 * function and select it using storageProvider.
 */
export const deleteNocPdf = async (driveFileId) => {
  if (!driveFileId) {
    return;
  }

  await drive.files.delete({
    fileId: driveFileId,
  });
};

/**
 * Check whether a Drive PDF exists and is not in the trash.
 */
export const nocPdfExists = async (driveFileId) => {
  if (!driveFileId) {
    return false;
  }

  try {
    const response = await drive.files.get({
      fileId: driveFileId,
      fields: "id,mimeType,trashed",
    });

    return (
      response.data.mimeType === PDF_MIME_TYPE && response.data.trashed !== true
    );
  } catch (error) {
    if ([404, 410].includes(error.code) || error.response?.status === 404) {
      return false;
    }

    // Authentication and network errors must not be reported as
    // "file does not exist".
    throw error;
  }
};
