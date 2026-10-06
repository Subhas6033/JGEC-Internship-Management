import mongoose from "mongoose";
import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { StudentDocument } from "../../models/studentDocument.models.js";
import { StudentNOC } from "../../models/studentNoc.models.js";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { generateNOCForApplication } from "../noc/noc.service.js";
import {
  uploadToCloudinary,
  cloudinary,
} from "../../upload/uploadOnCloudinary.upload.js";

const getStudentId = (req) => req.user?._id;

const validateStudent = (studentId) => {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Student authentication is required",
    );
  }
};

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

  const acceptedApplication = applications.find(
    (application) =>
      application.status === "approved_by_spoc" ||
      application.status === "accepted",
  );

  let noc = null;

  if (acceptedApplication) {
    noc = await StudentNOC.findOne({
      application: acceptedApplication._id,
      student: studentId,
    }).lean();

    if (!noc) {
      try {
        noc = await generateNOCForApplication(acceptedApplication._id);
      } catch (error) {
        console.error("NOC generation failed:", error.message);
      }
    }
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
      fileType: documents.signature.fileType,
      url: documents.signature.url,
      status: "verified",
      category: "signature",
    });
  }

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        documents: uploadedDocuments,
        signature: documents?.signature || null,
        resume: documents?.resume || null,
        noc: noc
          ? {
              _id: noc._id,
              nocId: noc.nocId,
              fileName: noc.fileName,
              url: noc.url,
              generatedAt: noc.generatedAt,
              version: noc.version,
            }
          : null,
        acceptedApplication: acceptedApplication
          ? {
              _id: acceptedApplication._id,
              status: acceptedApplication.status,
              organisation: acceptedApplication.organisation,
              designation: acceptedApplication.designation,
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

  /*
   * Keep the existing Cloudinary deletion logic.
   * This only removes the old signature.
   */
  const existing = await StudentDocument.findOne({
    student: studentId,
  });

  if (existing?.signature?.publicId) {
    await cloudinary.v2.uploader.destroy(existing.signature.publicId, {
      resource_type: "image",
    });
  }

  /*
   * Upload using the project's existing
   * uploadToCloudinary helper.
   */
  const upload = await uploadToCloudinary(
    req.file.buffer,
    "image",
    `${
      process.env.CLOUDINARY_FOLDER || "jgec-internship"
    }/students/${studentId}/signature`,
  );

  const signature = {
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
        signature,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        signature: document.signature,
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

  /*
   * Keep the existing Cloudinary deletion logic.
   * This only removes the old resume.
   */
  const existing = await StudentDocument.findOne({
    student: studentId,
  });

  if (existing?.resume?.publicId) {
    await cloudinary.v2.uploader.destroy(existing.resume.publicId, {
      resource_type: "raw",
    });
  }

  /*
   * Upload using the project's existing
   * uploadToCloudinary helper.
   */
  const upload = await uploadToCloudinary(
    req.file.buffer,
    "raw",
    `${
      process.env.CLOUDINARY_FOLDER || "jgec-internship"
    }/students/${studentId}/resume`,
  );

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

export const regenerateMyNOC = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  validateStudent(studentId);
  const application = await StudentApplication.findOne({
    student: studentId,
    status: {
      $in: ["approved_by_spoc", "accepted"],
    },
  }).sort({
    updatedAt: -1,
  });
  if (!application) {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "No accepted internship application found",
    );
  }
  const noc = await generateNOCForApplication(application._id);
  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        noc,
      },
      "NOC regenerated successfully",
    ),
  );
});
