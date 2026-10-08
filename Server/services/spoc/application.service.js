import mongoose from "mongoose";
import path from "node:path";

import { StudentApplication } from "../../models/studentApplication.models.js";
import { ApplicationReview } from "../../models/applicationReview.models.js";
import { NOC } from "../../models/noc.models.js";
import { NOCCounter } from "../../models/nocCounter.model.js";
import { Student } from "../../models/students.models.js";

/*
 * NOTE: adjust these two import paths/file names to match your project.
 * Both models must be exported as named exports `SPOC` and `TPO`.
 */
import { SPOC } from "../../models/spoc.models.js";
import { TPO } from "../../models/tpo.models.js";

import { APIERR } from "../../utils/helper.utils.js";

import { HTTP_STATUS } from "../../config/httpConfig.config.js";

import { generateNocPdf } from "../../utils/noc.utils.js";

import { saveNocPdf, deleteNocPdf } from "../../utils/nocStorage.utils.js";

/* =========================================================
   HELPERS
========================================================= */

const getDepartmentCode = (department) => {
  if (!department) {
    return "GEN";
  }

  const normalized = String(department).trim().toLowerCase();

  const departmentMap = {
    cs: "CSE",
    cse: "CSE",
    "computer science": "CSE",
    "computer science and engineering": "CSE",

    it: "IT",
    "information technology": "IT",

    ece: "ECE",
    "electronics and communication": "ECE",
    "electronics and communication engineering": "ECE",

    ee: "EE",
    eee: "EE",
    "electrical engineering": "EE",
    "electrical and electronics engineering": "EE",

    me: "ME",
    "mechanical engineering": "ME",

    ce: "CE",
    "civil engineering": "CE",

    ai: "AI",
    "artificial intelligence": "AI",

    aiml: "AIML",
    "artificial intelligence and machine learning": "AIML",

    "computer science and engineering (data science)": "CSEDS",

    ds: "DS",
    "data science": "DS",
  };

  if (departmentMap[normalized]) {
    return departmentMap[normalized];
  }

  return (
    normalized
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "")
      .slice(0, 10) || "GEN"
  );
};

const validateObjectId = (value, message = "Invalid ID") => {
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, message);
  }
};

/** Works for ObjectId, populated document or plain string. */
const idOf = (value) =>
  (value && typeof value === "object" && value._id ? value._id : value) || null;

const isValidId = (value) =>
  Boolean(value) && mongoose.Types.ObjectId.isValid(String(value));

const buildNocFileName = (referenceNumber) =>
  `NOC-${String(referenceNumber).replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

const toAbsolutePath = (filePath) =>
  path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

/* =========================================================
   RESOLVE SPOC + TPO FOR THE NOC
========================================================= */

/**
 * SPOC:
 *   1. SPOC who reviewed the application / generated the NOC,
 *      but only if (s)he belongs to the student's department
 *   2. Active SPOC of the student's department
 *   3. Any reviewer/generator SPOC found (department mismatch)
 *
 * TPO:
 *   1. TPO who reviewed the application (application.tpoReviewedBy)
 *   2. Any active TPO
 *
 * reviewedBy fields on the application are plain ObjectIds (their
 * schema ref is "User"), so they are looked up manually here instead
 * of using populate().
 */
const resolveSignatories = async ({
  application,
  department,
  spocIds = [],
}) => {
  const departmentCode = getDepartmentCode(department);

  /* ------------------------------ SPOC ------------------------------ */

  const candidateIds = [
    ...new Set(
      [idOf(application.spocReviewedBy), ...spocIds.map(idOf)]
        .filter(isValidId)
        .map(String),
    ),
  ];

  let spoc = null;
  let mismatchedSpoc = null;

  for (const id of candidateIds) {
    const found = await SPOC.findById(id).lean();

    if (!found) continue;

    if (getDepartmentCode(found.department) === departmentCode) {
      spoc = found;
      break;
    }

    if (!mismatchedSpoc) {
      mismatchedSpoc = found;
    }
  }

  if (!spoc) {
    spoc = await SPOC.findOne({
      department: departmentCode,
      isActive: true,
    }).lean();
  }

  if (!spoc) {
    spoc = mismatchedSpoc;
  }

  /* ------------------------------- TPO ------------------------------ */

  let tpo = null;

  const tpoId = idOf(application.tpoReviewedBy);

  if (isValidId(tpoId)) {
    tpo = await TPO.findById(String(tpoId)).lean();
  }

  if (!tpo) {
    tpo = await TPO.findOne({ isActive: true }).sort({ createdAt: 1 }).lean();
  }

  if (!spoc) console.warn("NOC: SPOC could not be resolved");
  if (!tpo) console.warn("NOC: TPO could not be resolved");

  return { spoc, tpo };
};

/* =========================================================
   BUILD NOC PDF
========================================================= */

/**
 * Builds the PDF using PLAIN objects.
 *
 * Mongoose documents hide any field that is not in the schema. The
 * student collection stores the guardian details as `gurdianName` /
 * `gurdianMobile`, so a Mongoose document returns undefined for them,
 * while a plain object exposes them.
 */
const buildNocPdfBuffer = async ({
  application,
  student,
  referenceNumber,
  generatedAt,
  academicYear,
  department,
  spocIds = [],
}) => {
  const applicationData =
    typeof application.toObject === "function"
      ? application.toObject()
      : { ...application };

  const studentData =
    typeof student.toObject === "function" ? student.toObject() : student;

  applicationData.student = studentData;

  const { spoc, tpo } = await resolveSignatories({
    application: applicationData,
    department,
    spocIds,
  });

  return generateNocPdf({
    noc: {
      referenceNumber,
      generatedAt,
      academicYear,
      department,
      student: studentData,
      organisation: applicationData.organisation,
    },

    application: applicationData,

    spoc,

    tpo,
  });
};

/* =========================================================
   CREATE NOC REFERENCE
========================================================= */

const createNocReference = async ({ department, session }) => {
  const year = new Date().getFullYear();

  const departmentCode = getDepartmentCode(department);

  const counter = await NOCCounter.findOneAndUpdate(
    {
      year,
      department: departmentCode,
    },
    {
      $inc: {
        sequence: 1,
      },

      $setOnInsert: {
        year,
        department: departmentCode,
      },
    },
    {
      new: true,
      upsert: true,
      session,
      setDefaultsOnInsert: true,
    },
  );

  if (!counter) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to create NOC reference counter",
    );
  }

  const sequence = String(counter.sequence).padStart(3, "0");

  return `TNP/JGEC/INT/${year}/${departmentCode}/${sequence}`;
};

/* =========================================================
   GET APPLICATION
========================================================= */

export const getApplication = async (applicationId) => {
  validateObjectId(applicationId, "Invalid application ID");

  const application = await StudentApplication.findById(applicationId)
    .populate("student")
    .populate("organisation")
    .populate("noc");

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Application not found");
  }

  return application;
};

/* =========================================================
   TPO APPLICATIONS
========================================================= */

export const getTpoApplications = async () => {
  return StudentApplication.find({
    status: {
      $in: [
        "submitted",
        "under_tpo_review",
        "update_required",
        "approved_by_tpo",
        "approved_by_spoc",
        "noc_generated",
        "rejected",
      ],
    },
  })
    .populate("student")
    .populate("organisation")
    .populate("noc")
    .sort({
      createdAt: -1,
    });
};

/* =========================================================
   SPOC APPLICATIONS
========================================================= */

export const getSpocApplications = async () => {
  return StudentApplication.find({
    status: {
      $in: [
        "approved_by_tpo",
        "under_spoc_review",
        "approved_by_spoc",
        "noc_generated",
        "rejected",
      ],
    },
  })
    .populate("student")
    .populate("organisation")
    .populate("noc")
    .sort({
      createdAt: -1,
    });
};

/* =========================================================
   SPOC APPLICATIONS BY ORGANISATION
========================================================= */

export const getSpocApplicationsByOrganisation = async (organisationId) => {
  validateObjectId(organisationId, "Invalid organisation ID");

  return StudentApplication.find({
    organisation: organisationId,

    status: {
      $in: [
        "approved_by_tpo",
        "under_spoc_review",
        "approved_by_spoc",
        "noc_generated",
        "rejected",
      ],
    },
  })
    .populate("student")
    .populate("organisation")
    .populate("noc")
    .sort({
      createdAt: -1,
    });
};

/* =========================================================
   TPO REVIEW
========================================================= */

export const reviewByTpo = async ({
  applicationId,
  reviewerId,
  decision,
  reason = "",
}) => {
  validateObjectId(applicationId, "Invalid application ID");

  validateObjectId(reviewerId, "Invalid TPO user ID");

  const normalizedDecision = String(decision || "")
    .trim()
    .toLowerCase();

  if (!["approve", "reject", "send_back"].includes(normalizedDecision)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid TPO decision");
  }

  const application = await StudentApplication.findById(applicationId);

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Application not found");
  }

  if (
    !["submitted", "under_tpo_review", "update_required"].includes(
      application.status,
    )
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      `Application cannot be reviewed from status: ${application.status}`,
    );
  }

  let newStatus;

  if (normalizedDecision === "approve") {
    newStatus = "approved_by_tpo";
  } else if (normalizedDecision === "reject") {
    newStatus = "rejected";
  } else {
    newStatus = "update_required";
  }

  application.status = newStatus;

  /*
   * tpoReviewedBy / tpoReviewedAt are defined in the schema, so they
   * are assigned directly (hasOwnProperty is unreliable on Mongoose
   * documents).
   */
  application.tpoReviewedBy = reviewerId;

  application.tpoReviewedAt = new Date();

  if (
    reason?.trim() &&
    Object.prototype.hasOwnProperty.call(application, "tpoReviewReason")
  ) {
    application.tpoReviewReason = reason.trim();
  }

  await application.save();

  return application;
};

/* =========================================================
   SPOC REVIEW
========================================================= */

export const reviewBySpoc = async ({
  applicationId,
  reviewerId,
  decision,
  reason = "",
}) => {
  validateObjectId(applicationId, "Invalid application ID");

  validateObjectId(reviewerId, "Invalid SPOC user ID");

  const normalizedDecision = String(decision || "")
    .trim()
    .toLowerCase();

  if (!["approve", "reject", "send_back"].includes(normalizedDecision)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid SPOC decision");
  }

  const application = await StudentApplication.findById(applicationId);

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Application not found");
  }

  if (!["approved_by_tpo", "under_spoc_review"].includes(application.status)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      `Application cannot be reviewed from status: ${application.status}`,
    );
  }

  let newStatus;

  if (normalizedDecision === "approve") {
    newStatus = "approved_by_spoc";
  } else if (normalizedDecision === "reject") {
    newStatus = "rejected";
  } else {
    newStatus = "update_required";
  }

  application.status = newStatus;

  /*
   * spocReviewedBy / spocReviewedAt are defined in the schema, so they
   * are assigned directly (this is why spocReviewedBy stayed null).
   */
  application.spocReviewedBy = reviewerId;

  application.spocReviewedAt = new Date();

  if (
    reason?.trim() &&
    Object.prototype.hasOwnProperty.call(application, "spocReviewReason")
  ) {
    application.spocReviewReason = reason.trim();
  }

  await application.save();

  return application;
};

/* =========================================================
   RESUBMIT APPLICATION
========================================================= */

export const resubmitApplication = async ({ applicationId, studentId }) => {
  validateObjectId(applicationId, "Invalid application ID");

  validateObjectId(studentId, "Invalid student ID");

  const application = await StudentApplication.findOne({
    _id: applicationId,
    student: studentId,
  });

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Application not found");
  }

  if (application.status !== "update_required") {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Only applications requiring updates can be resubmitted",
    );
  }

  application.status = "submitted";

  await application.save();

  return application;
};

/* =========================================================
   GENERATE NOC
========================================================= */

export const generateNoc = async ({ applicationId, generatedBy }) => {
  validateObjectId(applicationId, "Invalid application ID");

  validateObjectId(generatedBy, "Invalid SPOC user ID");

  const session = await mongoose.startSession();

  let generatedNoc = null;
  let savedFilePath = null;

  try {
    await session.withTransaction(async () => {
      /* --------------------------------------------------
           GET APPLICATION
        -------------------------------------------------- */

      const application = await StudentApplication.findById(applicationId)
        .populate("student")
        .populate("organisation")
        .session(session);

      if (!application) {
        throw new APIERR(HTTP_STATUS.NOT_FOUND, "Application not found");
      }

      /* --------------------------------------------------
           ALREADY GENERATED
        -------------------------------------------------- */

      if (application.noc) {
        const existingNoc = await NOC.findById(application.noc).session(
          session,
        );

        if (existingNoc) {
          generatedNoc = existingNoc;

          return;
        }
      }

      /* --------------------------------------------------
           STATUS CHECK
        -------------------------------------------------- */

      if (application.status !== "approved_by_spoc") {
        throw new APIERR(
          HTTP_STATUS.BAD_REQUEST,
          "NOC can only be generated for an application approved by SPOC",
        );
      }

      /* --------------------------------------------------
           GET STUDENT (plain object, keeps non-schema fields
           such as gurdianName / gurdianMobile)
        -------------------------------------------------- */

      const student = await Student.findById(
        application.student?._id || application.student,
      )
        .session(session)
        .lean();

      if (!student) {
        throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student not found");
      }

      /* --------------------------------------------------
           DEPARTMENT
        -------------------------------------------------- */

      const department = student.department || application.department;

      if (!department) {
        throw new APIERR(
          HTTP_STATUS.BAD_REQUEST,
          "Student department is required to generate NOC",
        );
      }

      /* --------------------------------------------------
           REFERENCE NUMBER
        -------------------------------------------------- */

      const referenceNumber = await createNocReference({
        department,
        session,
      });

      const academicYear = new Date().getFullYear();

      const generatedAt = new Date();

      /* --------------------------------------------------
           GENERATE PDF
        -------------------------------------------------- */

      const pdfBuffer = await buildNocPdfBuffer({
        application,
        student,
        referenceNumber,
        generatedAt,
        academicYear,
        department,
        spocIds: [generatedBy],
      });

      if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
        throw new APIERR(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Failed to generate NOC PDF",
        );
      }

      /* --------------------------------------------------
           FILE NAME
        -------------------------------------------------- */

      const fileName = buildNocFileName(referenceNumber);

      /* --------------------------------------------------
           SAVE PDF ON SERVER
        -------------------------------------------------- */

      const savedFile = await saveNocPdf({
        pdfBuffer,
        academicYear,
        department: getDepartmentCode(department),
        fileName,
      });

      savedFilePath = savedFile.absoluteFilePath;

      /* --------------------------------------------------
           BACKEND FILE URL
        -------------------------------------------------- */

      const fileUrl = `/applications/spoc/${application._id}/noc/pdf`;

      /* --------------------------------------------------
           CREATE NOC RECORD
        -------------------------------------------------- */

      const [noc] = await NOC.create(
        [
          {
            application: application._id,

            student: student._id,

            organisation:
              application.organisation?._id || application.organisation,

            referenceNumber,

            generatedBy,

            generatedAt,

            academicYear,

            department,

            fileName: savedFile.fileName,

            filePath: savedFile.relativeFilePath,

            fileUrl,

            fileMimeType: savedFile.mimeType,

            fileSize: savedFile.fileSize,

            status: "generated",
          },
        ],
        {
          session,
        },
      );

      /* --------------------------------------------------
           UPDATE APPLICATION
        -------------------------------------------------- */

      await StudentApplication.updateOne(
        {
          _id: application._id,
        },

        {
          $set: {
            status: "noc_generated",
            noc: noc._id,
            nocGeneratedAt: generatedAt,
          },
        },

        {
          session,
        },
      );

      generatedNoc = noc;
    });

    return generatedNoc;
  } catch (error) {
    /*
     * MongoDB transaction failed after the PDF
     * was successfully written.
     *
     * Remove the orphan PDF.
     */

    if (savedFilePath) {
      try {
        await deleteNocPdf(savedFilePath);
      } catch (deleteError) {
        console.error("Failed to remove orphan NOC PDF:", deleteError);
      }
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

/* =========================================================
   REGENERATE NOC
========================================================= */

/**
 * Re-creates the PDF of an ALREADY generated NOC.
 *
 * - keeps the same reference number, date and NOC record
 * - re-resolves SPOC / TPO and re-reads the student data
 * - overwrites the stored PDF file
 *
 * Use it for NOCs that were generated before the signatory fix.
 */
export const regenerateNoc = async ({ applicationId, generatedBy }) => {
  validateObjectId(applicationId, "Invalid application ID");

  const application = await StudentApplication.findById(applicationId)
    .populate("student")
    .populate("organisation");

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Application not found");
  }

  const noc = await NOC.findOne({ application: applicationId });

  if (!noc) {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "NOC has not been generated for this application yet",
    );
  }

  const student = await Student.findById(
    application.student?._id || application.student,
  ).lean();

  if (!student) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  const department = noc.department || student.department;

  const pdfBuffer = await buildNocPdfBuffer({
    application,
    student,
    referenceNumber: noc.referenceNumber,
    generatedAt: noc.generatedAt,
    academicYear: noc.academicYear,
    department,
    spocIds: [noc.generatedBy, generatedBy],
  });

  if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to regenerate NOC PDF",
    );
  }

  /* Remove the old file (ignore if it is already gone) */
  if (noc.filePath) {
    try {
      await deleteNocPdf(toAbsolutePath(noc.filePath));
    } catch (deleteError) {
      console.error("Old NOC PDF could not be removed:", deleteError.message);
    }
  }

  const savedFile = await saveNocPdf({
    pdfBuffer,
    academicYear: noc.academicYear,
    department: getDepartmentCode(department),
    fileName: buildNocFileName(noc.referenceNumber),
  });

  noc.fileName = savedFile.fileName;
  noc.filePath = savedFile.relativeFilePath;
  noc.fileMimeType = savedFile.mimeType;
  noc.fileSize = savedFile.fileSize;

  await noc.save();

  return noc;
};

/* =========================================================
   GET NOC
========================================================= */

export const getNocByApplication = async (applicationId) => {
  validateObjectId(applicationId, "Invalid application ID");

  const noc = await NOC.findOne({
    application: applicationId,
  })
    .populate("student")
    .populate("organisation");

  if (!noc) {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "NOC not found for this application",
    );
  }

  return noc;
};

/* =========================================================
   GET ALL SPOC NOCS
========================================================= */

export const getSpocNocs = async () => {
  return NOC.find({
    status: "generated",
  })
    .populate("student")
    .populate("organisation")
    .sort({
      generatedAt: -1,
    });
};

/* =========================================================
   REVIEW HISTORY
========================================================= */

export const getApplicationReviews = async (applicationId) => {
  validateObjectId(applicationId, "Invalid application ID");

  return ApplicationReview.find({
    application: applicationId,
  })
    .sort({
      createdAt: -1,
    })
    .lean();
};
