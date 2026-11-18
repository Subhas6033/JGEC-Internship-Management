// Serves the NOC PDF (stored in Google Drive) to the admin preview.
// Put getNOCDocument in adminNoc.service.js and the controller in your admin
// NOC controller (or keep this file and import from it).

import fs from "fs";
import path from "path";
import { pipeline } from "node:stream/promises";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { APIERR } from "../../utils/helper.utils.js";

// CHANGE THIS IMPORT to the file that exports getNocPdfStream
// (the Google Drive storage utility).
import { getNocPdfStream } from "../../utils/nocStorage.utils.js";

const PENDING_STATUS = "pending_admin_approval";
const SENT_STATUS = "noc_generated";

const first = (...values) =>
  values.find((v) => v !== undefined && v !== null && v !== "");

/**
 * Finds the PDF of an application and returns a readable stream.
 * - New NOCs: Google Drive file ID (storageProvider "google_drive")
 * - Older NOCs: local file path
 */
export const getNOCDocument = async (applicationId) => {
  const application = await StudentApplication.findById(applicationId)
    .populate("noc")
    .lean();

  if (!application) {
    throw new APIERR(404, "Application not found");
  }

  if (![PENDING_STATUS, SENT_STATUS].includes(application.status)) {
    throw new APIERR(400, "NOC is not available for review");
  }

  const noc = application.noc;

  if (!noc) {
    throw new APIERR(404, "NOC record not found");
  }

  const fileName = `NOC-${noc.referenceNumber || applicationId}.pdf`.replace(
    /[^\w.\-]+/g,
    "_",
  );

  // 1. Google Drive. filePath holds the Drive file ID for these NOCs.
  const driveFileId =
    noc.driveFileId ||
    (noc.storageProvider === "google_drive"
      ? first(noc.filePath, noc.relativeFilePath)
      : null);

  if (driveFileId) {
    try {
      const stream = await getNocPdfStream(driveFileId);
      return { stream, fileName };
    } catch (error) {
      if (
        [403, 404, 410].includes(error?.code) ||
        error?.response?.status === 404
      ) {
        throw new APIERR(404, "NOC document was not found in Google Drive");
      }

      console.error("NOC Drive download failed:", error);
      throw new APIERR(502, "Unable to fetch the NOC document");
    }
  }

  // 2. Legacy local file (NOCs created before the Drive migration)
  const location = first(noc.absoluteFilePath, noc.filePath, noc.pdfPath);

  if (typeof location === "string" && location) {
    const absolute = path.isAbsolute(location)
      ? location
      : path.resolve(process.cwd(), location.replace(/^[/\\]+/, ""));

    try {
      await fs.promises.access(absolute);
      return { stream: fs.createReadStream(absolute), fileName };
    } catch {
      throw new APIERR(404, "NOC document file was not found on the server");
    }
  }

  throw new APIERR(404, "NOC document has not been stored for this NOC");
};

/**
 * GET /admin/noc/:applicationId/document
 */
export const getNOCDocumentController = async (req, res, next) => {
  try {
    const { stream, fileName } = await getNOCDocument(req.params.applicationId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });

    await pipeline(stream, res);
  } catch (error) {
    // Once streaming has started the headers are gone, so just close.
    if (res.headersSent) {
      return res.destroy(error);
    }

    return next(error);
  }
};

// Route (next to the existing /admin/noc routes, same admin auth middleware):
//   router.get("/:applicationId/document", getNOCDocumentController);
