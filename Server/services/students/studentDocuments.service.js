import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";
import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { StudentDocument } from "../../models/studentDocument.models.js";
import { Student } from "../../models/students.models.js";
import { NOC } from "../../models/noc.models.js";
import { StudentApplication } from "../../models/studentApplication.models.js";
import {
  uploadToCloudinary,
  cloudinary,
} from "../../upload/uploadOnCloudinary.upload.js";
import { getNocPdfStream } from "../../utils/nocStorage.utils.js";

const getStudentId = (req) => {
  return req.user?._id || req.user?.id || req.userId;
};

const validateStudent = (studentId) => {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Student authentication is required",
    );
  }
};

const STUDENT_NOC_PDF_URL = "/student-documents/noc/pdf";

export const getMyDocuments = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);

  const documents = await StudentDocument.findOne({
    student: studentId,
  }).lean();

  const applications = await StudentApplication.find({
    student: studentId,
  })
    .populate("organisation")
    .sort({
      createdAt: -1,
    })
    .lean();

  const acceptedApplication =
    applications.find(
      (application) =>
        application.status === "approved_by_spoc" ||
        application.status === "noc_generated",
    ) || null;

  let noc = null;

  if (acceptedApplication) {
    noc = await NOC.findOne({
      application: acceptedApplication._id,
      student: studentId,
    }).lean();
  }

  const uploadedDocuments = [];

  if (documents?.resume?.url) {
    uploadedDocuments.push({
      _id: "resume",
      name: "Resume",
      fileName: documents.resume.fileName,
      fileType: documents.resume.fileType,
      url: documents.resume.url,
      status: "verified",
      category: "resume",
    });
  }

  if (documents?.signature?.url) {
    uploadedDocuments.push({
      _id: "signature",
      name: "Signature",
      fileName: documents.signature.fileName,
      fileType: documents.signature.mimeType,
      url: documents.signature.url,
      status: "verified",
      category: "signature",
    });
  }

  const nocResponse = noc
    ? {
        _id: noc._id,
        nocId: noc._id,
        application: noc.application,
        referenceNumber: noc.referenceNumber,
        generatedAt: noc.generatedAt,
        academicYear: noc.academicYear,
        department: noc.department,
        status: noc.status || "generated",
        downloadUrl: STUDENT_NOC_PDF_URL,
      }
    : null;

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        documents: uploadedDocuments,
        signature: documents?.signature || null,
        resume: documents?.resume || null,
        noc: nocResponse,
        acceptedApplication: acceptedApplication
          ? {
              _id: acceptedApplication._id,
              status: acceptedApplication.status,
              organisation: acceptedApplication.organisation,
              designation: acceptedApplication.designation,
              startDate: acceptedApplication.startDate,
              endDate: acceptedApplication.endDate,
            }
          : null,
      },
      "Student documents fetched successfully",
    ),
  );
});

export const updateStudentSignature = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);

  if (!req.file) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Signature file is required");
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Signature must be a PNG or JPG image",
    );
  }

  const existing = await StudentDocument.findOne({
    student: studentId,
  });

  if (existing?.signature?.publicId) {
    await cloudinary.uploader.destroy(existing.signature.publicId, {
      resource_type: "image",
    });
  }

  const upload = await uploadToCloudinary(
    req.file.buffer,
    "image",
    `${
      process.env.CLOUDINARY_FOLDER || "jgec-internship"
    }/students/${studentId}/signature`,
    undefined,
    {
      removeSignatureBackground: true,
    },
  );

  if (!upload?.secure_url || !upload?.public_id) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Signature upload failed",
    );
  }

  const signature = {
    url: upload.secure_url,
    publicId: upload.public_id,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    uploadedAt: new Date(),
  };

  const updatedStudentDocument = await StudentDocument.findOneAndUpdate(
    {
      student: studentId,
    },
    {
      $set: {
        student: studentId,
        signature,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  await Student.findByIdAndUpdate(
    studentId,
    {
      $set: {
        signature: signature.url,
      },
    },
    {
      new: true,
    },
  );

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        signature: updatedStudentDocument.signature,
      },
      "Signature updated successfully",
    ),
  );
});

export const updateStudentResume = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);

  if (!req.file) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Resume file is required");
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Resume must be PDF, DOC or DOCX",
    );
  }

  const existing = await StudentDocument.findOne({
    student: studentId,
  });

  if (existing?.resume?.publicId) {
    await cloudinary.v2.uploader.destroy(existing.resume.publicId, {
      resource_type: "raw",
    });
  }

  const upload = await uploadToCloudinary(
    req.file.buffer,
    "raw",
    `${
      process.env.CLOUDINARY_FOLDER || "jgec-internship"
    }/students/${studentId}/resume`,
  );

  if (!upload?.secure_url || !upload?.public_id) {
    throw new APIERR(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Resume upload failed");
  }

  const resume = {
    url: upload.secure_url,
    publicId: upload.public_id,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    uploadedAt: new Date(),
  };

  const document = await StudentDocument.findOneAndUpdate(
    {
      student: studentId,
    },
    {
      $set: {
        student: studentId,
        resume,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        resume: document.resume,
      },
      "Resume updated successfully",
    ),
  );
});

export const getMyNOC = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);

  const application = await StudentApplication.findOne({
    student: studentId,
    status: "noc_generated",
  })
    .populate("organisation")
    .sort({
      updatedAt: -1,
    })
    .lean();

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "No generated NOC found");
  }

  const noc = await NOC.findOne({
    application: application._id,
    student: studentId,
  }).lean();

  if (!noc) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "NOC record not found");
  }

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        noc: {
          _id: noc._id,
          nocId: noc._id,
          application: noc.application,
          student: noc.student,
          organisation: noc.organisation,
          referenceNumber: noc.referenceNumber,
          generatedAt: noc.generatedAt,
          academicYear: noc.academicYear,
          department: noc.department,
          status: noc.status || "generated",
          downloadUrl: STUDENT_NOC_PDF_URL,
        },
        applicationId: application._id,
        applicationStatus: application.status,
        organisation: application.organisation,
        designation: application.designation,
        startDate: application.startDate,
        endDate: application.endDate,
      },
      "NOC fetched successfully",
    ),
  );
});

export const downloadMyNOC = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);

  const application = await StudentApplication.findOne({
    student: studentId,
    status: "noc_generated",
  })
    .sort({
      updatedAt: -1,
    })
    .lean();

  if (!application) {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "No generated NOC found for this student",
    );
  }

  const noc = await NOC.findOne({
    application: application._id,
    student: studentId,
  }).lean();

  if (!noc) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "NOC not found for this student");
  }

  if (noc.status !== "generated") {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "NOC PDF is not available");
  }

  const fileName = path
    .basename(noc.fileName || "NOC.pdf")
    .replace(/["\r\n]/g, "_");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
  res.setHeader("Cache-Control", "private, no-store");

  if (noc.storageProvider === "google_drive" || noc.driveFileId) {
    const driveFileId = noc.driveFileId || noc.filePath;

    if (!driveFileId) {
      throw new APIERR(
        HTTP_STATUS.NOT_FOUND,
        "Google Drive file ID not found for this NOC",
      );
    }

    const pdfStream = await getNocPdfStream(driveFileId);

    pdfStream.on("error", (error) => {
      console.error("Google Drive student NOC streaming error:", error);

      if (!res.headersSent) {
        res.status(500).end("Failed to retrieve NOC PDF");
      } else {
        res.destroy(error);
      }
    });

    return pdfStream.pipe(res);
  }

  if (!noc.filePath) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "NOC PDF file path not found");
  }

  const absoluteFilePath = path.isAbsolute(noc.filePath)
    ? noc.filePath
    : path.resolve(process.cwd(), noc.filePath);

  try {
    await fs.access(absoluteFilePath);
  } catch {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "NOC PDF file does not exist on the server",
    );
  }

  return res.sendFile(absoluteFilePath);
});
