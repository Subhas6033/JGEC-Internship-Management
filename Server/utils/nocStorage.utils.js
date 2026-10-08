import fs from "node:fs/promises";
import path from "node:path";

/**
 * ------------------------------------------------------------
 * NOC STORAGE DIRECTORY
 * ------------------------------------------------------------
 *
 * PDFs will be stored like:
 *
 * Server/
 *   uploads/
 *     nocs/
 *       2026/
 *         IT/
 *           NOC-TNP_JGEC_INT_2026_IT_001.pdf
 *
 * process.cwd() points to the backend project root.
 */

const NOC_STORAGE_ROOT = path.join(process.cwd(), "uploads", "nocs");

/**
 * ------------------------------------------------------------
 * DEPARTMENT DIRECTORY
 * ------------------------------------------------------------
 */

const getDepartmentDirectory = (department) => {
  const safeDepartment = String(department || "GEN")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");

  return safeDepartment || "GEN";
};

/**
 * ------------------------------------------------------------
 * SAVE NOC PDF
 * ------------------------------------------------------------
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

  const departmentDirectory = getDepartmentDirectory(department);

  const yearDirectory = String(academicYear);

  /*
   * Prevent path traversal through fileName.
   */

  const safeFileName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");

  const directoryPath = path.join(
    NOC_STORAGE_ROOT,
    yearDirectory,
    departmentDirectory,
  );

  /*
   * Create directory if it does not exist.
   */

  await fs.mkdir(directoryPath, {
    recursive: true,
  });

  const absoluteFilePath = path.join(directoryPath, safeFileName);

  /*
   * Make sure the generated path is actually
   * inside our NOC storage directory.
   */

  const resolvedRoot = path.resolve(NOC_STORAGE_ROOT);
  const resolvedFile = path.resolve(absoluteFilePath);

  if (!resolvedFile.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error("Invalid NOC file path");
  }

  /*
   * Write PDF to server.
   */

  await fs.writeFile(absoluteFilePath, pdfBuffer);

  /*
   * Path stored in MongoDB.
   *
   * Always use "/" instead of Windows "\"
   * so the value remains portable.
   */

  const relativeFilePath = path
    .relative(process.cwd(), absoluteFilePath)
    .split(path.sep)
    .join("/");

  return {
    absoluteFilePath,
    relativeFilePath,
    fileName: safeFileName,
    fileSize: pdfBuffer.length,
    mimeType: "application/pdf",
  };
};

/**
 * ------------------------------------------------------------
 * DELETE NOC PDF
 * ------------------------------------------------------------
 */

export const deleteNocPdf = async (filePath) => {
  if (!filePath) {
    return;
  }

  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    /*
     * File may already be deleted.
     */

    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

/**
 * ------------------------------------------------------------
 * CHECK NOC PDF
 * ------------------------------------------------------------
 */

export const nocPdfExists = async (filePath) => {
  if (!filePath) {
    return false;
  }

  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
};
