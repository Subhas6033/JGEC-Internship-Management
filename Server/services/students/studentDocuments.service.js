import mongoose from "mongoose";

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

/**
 * ==========================================================================
 * HELPERS
 * ==========================================================================
 */

/**
 * Get authenticated student ID.
 *
 * Supports both:
 * req.user._id
 * req.user.id
 */
const getStudentId = (req) => {
  return req.user?._id || req.user?.id;
};

/**
 * Validate authenticated student.
 */
const validateStudent = (studentId) => {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Student authentication is required",
    );
  }
};

/**
 * ==========================================================================
 * GET MY DOCUMENTS
 * ==========================================================================
 *
 * GET /students/documents
 *
 * This endpoint:
 *
 * - Fetches uploaded resume
 * - Fetches uploaded signature
 * - Fetches the latest accepted internship
 * - Fetches an already-generated NOC
 *
 * IMPORTANT:
 *
 * This endpoint NEVER generates an NOC.
 *
 * NOC generation is handled by the SPOC after:
 *
 * approved_by_spoc
 *
 * and the application becomes:
 *
 * noc_generated
 */
export const getMyDocuments = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);

  /**
   * ------------------------------------------------------------------------
   * Get student documents
   * ------------------------------------------------------------------------
   */

  const documents = await StudentDocument.findOne({
    student: studentId,
  }).lean();

  /**
   * ------------------------------------------------------------------------
   * Get student applications
   * ------------------------------------------------------------------------
   */

  const applications = await StudentApplication.find({
    student: studentId,
  })
    .populate("organisation")
    .sort({
      createdAt: -1,
    })
    .lean();

  /**
   * ------------------------------------------------------------------------
   * Find latest accepted / NOC application
   * ------------------------------------------------------------------------
   *
   * approved_by_spoc
   *     -> Application accepted by SPOC
   *
   * noc_generated
   *     -> NOC has already been generated
   */

  const acceptedApplication =
    applications.find(
      (application) =>
        application.status === "approved_by_spoc" ||
        application.status === "noc_generated",
    ) || null;

  /**
   * ------------------------------------------------------------------------
   * Get existing NOC
   * ------------------------------------------------------------------------
   *
   * IMPORTANT:
   *
   * We only READ the NOC here.
   *
   * We do NOT generate one automatically.
   */

  let noc = null;

  if (acceptedApplication) {
    noc = await NOC.findOne({
      application: acceptedApplication._id,
      student: studentId,
    }).lean();
  }

  /**
   * ------------------------------------------------------------------------
   * Prepare uploaded documents
   * ------------------------------------------------------------------------
   */

  const uploadedDocuments = [];

  /**
   * Resume
   */

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

  /**
   * Signature
   */

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

  /**
   * ------------------------------------------------------------------------
   * Prepare NOC response
   * ------------------------------------------------------------------------
   */

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

        /**
         * PDF is generated dynamically.
         *
         * There is no need to store the PDF in Cloudinary.
         */

        downloadUrl: `/applications/spoc/${acceptedApplication?._id}/noc/pdf`,
      }
    : null;

  /**
   * ------------------------------------------------------------------------
   * Response
   * ------------------------------------------------------------------------
   */

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

/**
 * ==========================================================================
 * UPDATE STUDENT SIGNATURE
 * ==========================================================================
 *
 * PATCH /students/documents/signature
 */
export const updateStudentSignature = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);

  /**
   * ----------------------------------------------------------------------
   * File validation
   * ----------------------------------------------------------------------
   */

  if (!req.file) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Signature file is required");
  }

  /**
   * Allowed signature formats.
   */

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Signature must be a PNG or JPG image",
    );
  }

  /**
   * ----------------------------------------------------------------------
   * Existing document
   * ----------------------------------------------------------------------
   */

  const existing = await StudentDocument.findOne({
    student: studentId,
  });

  /**
   * ----------------------------------------------------------------------
   * Delete old signature from Cloudinary
   * ----------------------------------------------------------------------
   */

  if (existing?.signature?.publicId) {
    await cloudinary.uploader.destroy(existing.signature.publicId, {
      resource_type: "image",
    });
  }

  /**
   * ----------------------------------------------------------------------
   * Upload new signature
   * ----------------------------------------------------------------------
   */

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

  /**
   * ----------------------------------------------------------------------
   * Validate Cloudinary response
   * ----------------------------------------------------------------------
   */

  if (!upload?.secure_url || !upload?.public_id) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Signature upload failed",
    );
  }

  /**
   * ----------------------------------------------------------------------
   * Signature object
   * ----------------------------------------------------------------------
   */

  const signature = {
    url: upload.secure_url,

    publicId: upload.public_id,

    fileName: req.file.originalname,

    mimeType: req.file.mimetype,

    uploadedAt: new Date(),
  };

  /**
   * ----------------------------------------------------------------------
   * Update student documents
   * ----------------------------------------------------------------------
   */

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

  /**
   * ----------------------------------------------------------------------
   * Keep student.signature synchronized
   * ----------------------------------------------------------------------
   */

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

  /**
   * ----------------------------------------------------------------------
   * Response
   * ----------------------------------------------------------------------
   */

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

/**
 * ==========================================================================
 * UPDATE STUDENT RESUME
 * ==========================================================================
 *
 * PATCH /students/documents/resume
 */
export const updateStudentResume = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);

  /**
   * ----------------------------------------------------------------------
   * File validation
   * ----------------------------------------------------------------------
   */

  if (!req.file) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Resume file is required");
  }

  /**
   * Allowed resume formats.
   */

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

  /**
   * ----------------------------------------------------------------------
   * Existing document
   * ----------------------------------------------------------------------
   */

  const existing = await StudentDocument.findOne({
    student: studentId,
  });

  /**
   * ----------------------------------------------------------------------
   * Delete old resume
   * ----------------------------------------------------------------------
   */

  if (existing?.resume?.publicId) {
    await cloudinary.v2.uploader.destroy(
      existing.resume.publicId,

      {
        resource_type: "raw",
      },
    );
  }

  /**
   * ----------------------------------------------------------------------
   * Upload new resume
   * ----------------------------------------------------------------------
   */

  const upload = await uploadToCloudinary(
    req.file.buffer,

    "raw",

    `${
      process.env.CLOUDINARY_FOLDER || "jgec-internship"
    }/students/${studentId}/resume`,
  );

  /**
   * ----------------------------------------------------------------------
   * Validate Cloudinary response
   * ----------------------------------------------------------------------
   */

  if (!upload?.secure_url || !upload?.public_id) {
    throw new APIERR(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Resume upload failed");
  }

  /**
   * ----------------------------------------------------------------------
   * Resume object
   * ----------------------------------------------------------------------
   */

  const resume = {
    url: upload.secure_url,

    publicId: upload.public_id,

    fileName: req.file.originalname,

    fileType: req.file.mimetype,

    uploadedAt: new Date(),
  };

  /**
   * ----------------------------------------------------------------------
   * Update document
   * ----------------------------------------------------------------------
   */

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

  /**
   * ----------------------------------------------------------------------
   * Response
   * ----------------------------------------------------------------------
   */

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

/**
 * ==========================================================================
 * GET MY NOC
 * ==========================================================================
 *
 * GET /students/documents/noc
 *
 * IMPORTANT:
 *
 * The student does NOT generate the NOC.
 *
 * The SPOC generates the NOC after:
 *
 * approved_by_spoc
 *
 * This endpoint only retrieves the already-generated NOC.
 */
export const getMyNOC = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);

  /**
   * ----------------------------------------------------------------------
   * Find latest application with generated NOC
   * ----------------------------------------------------------------------
   */

  const application = await StudentApplication.findOne({
    student: studentId,

    status: "noc_generated",
  })
    .populate("organisation")
    .sort({
      updatedAt: -1,
    })
    .lean();

  /**
   * ----------------------------------------------------------------------
   * No generated NOC
   * ----------------------------------------------------------------------
   */

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "No generated NOC found");
  }

  /**
   * ----------------------------------------------------------------------
   * Find NOC
   * ----------------------------------------------------------------------
   */

  const noc = await NOC.findOne({
    application: application._id,

    student: studentId,
  }).lean();

  if (!noc) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "NOC record not found");
  }

  /**
   * ----------------------------------------------------------------------
   * Response
   * ----------------------------------------------------------------------
   */

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

          /**
           * Dynamic PDF endpoint.
           */

          downloadUrl: `/applications/spoc/${application._id}/noc/pdf`,
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
