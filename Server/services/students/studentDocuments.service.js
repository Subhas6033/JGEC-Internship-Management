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

// Helper Functions

const getStudentId = (req) => {
  return req.user?._id || req.user?.id;
};

// Validate the authenticated studetns
const validateStudent = (studentId) => {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Student authentication is required",
    );
  }
};

// Get the Student Documents
export const getMyDocuments = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);
  // Get Documents
  const documents = await StudentDocument.findOne({
    student: studentId,
  }).lean();

  // Get Student Applications
  const applications = await StudentApplication.find({
    student: studentId,
  })
    .populate("organisation")
    .sort({
      createdAt: -1,
    })
    .lean();
  // Find the latest accepted Applications
  const acceptedApplication =
    applications.find(
      (application) =>
        application.status === "approved_by_spoc" ||
        application.status === "noc_generated",
    ) || null;

  // Get the latest generated NOC
  let noc = null;

  if (acceptedApplication) {
    noc = await NOC.findOne({
      application: acceptedApplication._id,
      student: studentId,
    }).lean();
  }
  // Prepare for documents uploads
  const uploadedDocuments = [];
  // Resume
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
  // Signatures
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
  // Prepare NOC response
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
        // PDF Generated Dynamically no need to store in Cloudinary
        downloadUrl: `/applications/spoc/${acceptedApplication?._id}/noc/pdf`,
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

// Update Student Signatures
export const updateStudentSignature = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);
  // Validate the Files
  if (!req.file) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Signature file is required");
  }
  // Allowed Signature formats
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Signature must be a PNG or JPG image",
    );
  }
  // Get the existing documents
  const existing = await StudentDocument.findOne({
    student: studentId,
  });

  // Delete the old documents from the Cloudinary
  if (existing?.signature?.publicId) {
    await cloudinary.uploader.destroy(existing.signature.publicId, {
      resource_type: "image",
    });
  }
  // Upload the new Signature on CLoudinary
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
  // Validate the Cloudinary Response
  if (!upload?.secure_url || !upload?.public_id) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Signature upload failed",
    );
  }

  // Prepare the Signature Object
  const signature = {
    url: upload.secure_url,
    publicId: upload.public_id,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    uploadedAt: new Date(),
  };

  // Update the Student Documents in DB
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
  // Keep the Student Signature Syncronized so that from the next applications it will use the updated Signatures
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

// Update the Student Resumes
export const updateStudentResume = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);
  // Validate the Files before storing
  if (!req.file) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Resume file is required");
  }
  // Allowed Resume Formats
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
  // Get the existing Resumes
  const existing = await StudentDocument.findOne({
    student: studentId,
  });
  // Delete the existing resume
  if (existing?.resume?.publicId) {
    await cloudinary.v2.uploader.destroy(existing.resume.publicId, {
      resource_type: "raw",
    });
  }

  // Upload the new Resume
  const upload = await uploadToCloudinary(
    req.file.buffer,
    "raw",
    `${
      process.env.CLOUDINARY_FOLDER || "jgec-internship"
    }/students/${studentId}/resume`,
  );
  // Validate the Cloudinary Response
  if (!upload?.secure_url || !upload?.public_id) {
    throw new APIERR(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Resume upload failed");
  }

  // Prepare the Resume Object to store in DB
  const resume = {
    url: upload.secure_url,
    publicId: upload.public_id,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    uploadedAt: new Date(),
  };
  // Update the Document Details in DB
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

// Get the Generated NOCs
export const getMyNOC = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);

  validateStudent(studentId);
  // Find the latest Applications with the Generated NOC Status
  const application = await StudentApplication.findOne({
    student: studentId,
    status: "noc_generated",
  })
    .populate("organisation")
    .sort({
      updatedAt: -1,
    })
    .lean();
  // If no response found
  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "No generated NOC found");
  }
  // if NOC found
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
          // Dynamic PDF Endpoint
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
