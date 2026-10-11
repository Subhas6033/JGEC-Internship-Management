import mongoose from "mongoose";
import path from "node:path";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { ApplicationReview } from "../../models/applicationReview.models.js";
import { NOC } from "../../models/noc.models.js";
import { NOCCounter } from "../../models/nocCounter.model.js";
import { Student } from "../../models/students.models.js";
import { SPOC } from "../../models/spoc.models.js";
import { TPO } from "../../models/tpo.models.js";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { generateNocPdf } from "../../services/noc/noc.service.js";
import { saveNocPdf, deleteNocPdf } from "../../utils/nocStorage.utils.js";
import { sendNocMails } from "../../utils/Mail/mail.utils.js";
import { publishEvent } from "../notification/notification.service.js";
import {
  NOTIFICATION_ROLES,
  NOTIFICATION_TYPES as T,
} from "../../config/notification.config.js";

// Helper functions
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

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const buildNocFileName = (referenceNumber) =>
  `NOC-${String(referenceNumber).replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

const toAbsolutePath = (filePath) =>
  path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

const studentNameOf = (student) => firstValue(student?.fullName, student?.name);

const organisationNameOf = (application) =>
  firstValue(
    application?.organisation?.organisationName,
    application?.organisation?.name,
  );

// NOTIFICATIONS & NOC MAILS
const REVIEW_EVENTS = {
  [NOTIFICATION_ROLES.TPO]: {
    approve: T.TPO_ACCEPTED,
    reject: T.TPO_REJECTED,
    send_back: T.TPO_UPDATE_REQUIRED,
  },
  [NOTIFICATION_ROLES.SPOC]: {
    approve: T.SPOC_ACCEPTED,
    reject: T.SPOC_REJECTED,
    send_back: T.SPOC_UPDATE_REQUIRED,
  },
};

/**
 * Notifies the student about a review decision. A TPO approval also
 * forwards the application to the SPOCs of the student's department.
 */
const notifyReviewOutcome = async ({
  application,
  reviewerId,
  role,
  decision,
  reason,
}) => {
  const studentId = idOf(application.student);

  const student = await Student.findById(studentId)
    .select("fullName name department")
    .lean();

  const base = {
    application: application._id,
    actor: { id: reviewerId, role },
    context: { studentName: studentNameOf(student), reason: reason?.trim() },
  };

  await publishEvent({
    ...base,
    type: REVIEW_EVENTS[role][decision],
    recipientIds: [studentId],
  });

  if (role === NOTIFICATION_ROLES.TPO && decision === "approve") {
    await publishEvent({
      ...base,
      type: T.APPLICATION_FORWARDED,
      department: getDepartmentCode(
        firstValue(student?.department, application.department),
      ),
    });
  }
};

/**
 * Collects the notifications and emails produced by a generated NOC.
 * They are dispatched only after the DB transaction commits, so users are
 * never told about a NOC that was rolled back.
 */
const collectNocDelivery = (
  postCommit,
  { items, referenceNumber, generatedBy, pdfBuffer, fileName, summarize },
) => {
  const actor = { id: generatedBy, role: NOTIFICATION_ROLES.SPOC };

  items.forEach(({ application, student }) => {
    const organisationName = organisationNameOf(application);
    const studentName = studentNameOf(student);

    postCommit.events.push({
      type: T.NOC_GENERATED,
      application: application._id,
      actor,
      recipientIds: [student._id],
      context: { studentName, organisationName, referenceNumber },
    });

    const to = firstValue(student.email, student.emailId);

    if (to) {
      postCommit.mails.push({
        to,
        studentName,
        organisationName,
        referenceNumber,
        fileName,
        pdfBuffer,
      });
    }
  });

  if (summarize) {
    postCommit.events.push({
      type: T.NOC_BATCH_GENERATED,
      actor,
      recipientIds: [generatedBy],
      context: {
        count: items.length,
        referenceNumber,
        organisationName: organisationNameOf(items[0].application),
      },
    });
  }
};

/**
 * Notifications are awaited (cheap DB writes). Emails are sent in the
 * background so large batches do not delay the HTTP response; failures are
 * logged and never affect the generated NOCs.
 */
const dispatchPostCommit = async ({ events, mails }) => {
  await Promise.all(events.map((event) => publishEvent(event)));

  if (!mails.length) return;

  sendNocMails(mails)
    .then(({ sent, failed }) => {
      console.info(`NOC mail: ${sent} sent, ${failed.length} failed.`);

      failed.forEach(({ to, error }) =>
        console.error(`NOC mail to ${to} failed: ${error}`),
      );
    })
    .catch((error) => console.error("NOC mail dispatch failed:", error));
};

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

/**
 * Builds ONE PDF for a group of applications (same organisation,
 * same department).
 *
 * generateNocPdf already renders one table row per entry of
 * `application.students`, so the students are passed there. The first
 * application of the group supplies the organisation, designation,
 * internship dates and TPO.
 */
const buildBulkNocPdfBuffer = async ({
  items, // [{ application, student }]
  referenceNumber,
  generatedAt,
  academicYear,
  department,
  spocIds = [],
}) => {
  const applicationsData = items.map(({ application, student }) => {
    const applicationData =
      typeof application.toObject === "function"
        ? application.toObject()
        : { ...application };

    /* plain (lean) student keeps gurdianName / gurdianMobile */
    applicationData.student = student;

    return applicationData;
  });

  const students = applicationsData.map((data) => data.student);
  const primary = applicationsData[0];
  /* generateNocPdf reads application.students for the table rows */
  primary.students = students;

  const { spoc, tpo } = await resolveSignatories({
    application: primary,
    department,
    spocIds: [
      ...spocIds,
      ...applicationsData.map((data) => data.spocReviewedBy),
    ],
  });

  return generateNocPdf({
    noc: {
      referenceNumber,
      generatedAt,
      academicYear,
      department,
      student: students[0],
      organisation: primary.organisation,
    },
    application: primary,
    spoc,
    tpo,
  });
};

// CREATE the NOC REFERENCE NUMBERS
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

// Get Applications
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

// TPO Applications
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

// SPOC Applications
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

// Get SPOC applications by the Organisations
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

// TPO Review
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

  await notifyReviewOutcome({
    application,
    reviewerId,
    role: NOTIFICATION_ROLES.TPO,
    decision: normalizedDecision,
    reason,
  });

  return application;
};

// SPOC Review
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
  await notifyReviewOutcome({
    application,
    reviewerId,
    role: NOTIFICATION_ROLES.SPOC,
    decision: normalizedDecision,
    reason,
  });

  return application;
};

// Resubmit the applications
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

  const student = await Student.findById(studentId)
    .select("fullName name")
    .lean();

  await publishEvent({
    type: T.APPLICATION_SUBMITTED,
    application: application._id,
    actor: { id: studentId, role: NOTIFICATION_ROLES.STUDENT },
    context: { studentName: studentNameOf(student) },
  });

  return application;
};

// Generate the NOC
export const generateNoc = async ({ applicationId, generatedBy }) => {
  validateObjectId(applicationId, "Invalid application ID");
  validateObjectId(generatedBy, "Invalid SPOC user ID");

  const session = await mongoose.startSession();
  const postCommit = { events: [], mails: [] };

  let generatedNoc = null;

  /*
   * A transaction callback can be retried.
   * Retain every uploaded Drive ID so abandoned uploads can be cleaned up.
   */
  const savedDriveFileIds = new Set();

  const cleanupOrphanDriveFiles = async () => {
    for (const driveFileId of savedDriveFileIds) {
      try {
        const referencedNoc = await NOC.exists({ driveFileId });

        if (!referencedNoc) {
          await deleteNocPdf(driveFileId);
        }
      } catch (deleteError) {
        console.error(
          "Failed to clean up orphan Google Drive NOC PDF:",
          driveFileId,
          deleteError,
        );
      }
    }
  };

  try {
    await session.withTransaction(async () => {
      // Clear transaction-dependent notification data before each attempt.
      postCommit.events.length = 0;
      postCommit.mails.length = 0;

      generatedNoc = null;

      // Get the application.
      const application = await StudentApplication.findById(applicationId)
        .populate("student")
        .populate("organisation")
        .session(session);

      if (!application) {
        throw new APIERR(HTTP_STATUS.NOT_FOUND, "Application not found");
      }

      // If an NOC already exists, return it without generating another.
      if (application.noc) {
        const existingNoc = await NOC.findById(application.noc).session(
          session,
        );

        if (existingNoc) {
          generatedNoc = existingNoc;
          return;
        }
      }

      // Preserve the existing status validation.
      if (application.status !== "approved_by_spoc") {
        throw new APIERR(
          HTTP_STATUS.BAD_REQUEST,
          "NOC can only be generated for an application approved by SPOC",
        );
      }

      /*
       * Get the student as a plain object.
       * This preserves non-schema fields such as gurdianName
       * and gurdianMobile.
       */
      const student = await Student.findById(
        application.student?._id || application.student,
      )
        .session(session)
        .lean();

      if (!student) {
        throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student not found");
      }

      // Department.
      const department = student.department || application.department;

      if (!department) {
        throw new APIERR(
          HTTP_STATUS.BAD_REQUEST,
          "Student department is required to generate NOC",
        );
      }

      // Reference number.
      const referenceNumber = await createNocReference({
        department,
        session,
      });

      const academicYear = new Date().getFullYear();
      const generatedAt = new Date();

      // Generate the PDF.
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

      // File name.
      const fileName = buildNocFileName(referenceNumber);

      // Save the PDF in Google Drive instead of the local server.
      const savedFile = await saveNocPdf({
        pdfBuffer,
        academicYear,
        department: getDepartmentCode(department),
        fileName,
      });

      if (
        savedFile.storageProvider !== "google_drive" ||
        !savedFile.driveFileId
      ) {
        throw new APIERR(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Failed to store NOC PDF in Google Drive",
        );
      }

      savedDriveFileIds.add(savedFile.driveFileId);

      // Keep the existing backend download endpoint.
      const fileUrl = `/applications/spoc/${application._id}/noc/pdf`;

      // Create the NOC record.
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

            // Google Drive storage metadata.
            storageProvider: savedFile.storageProvider,
            driveFileId: savedFile.driveFileId,

            fileName: savedFile.fileName,

            // Compatibility field only; this is not a local path.
            filePath: savedFile.driveFileId,

            fileUrl,
            fileMimeType: savedFile.mimeType,
            fileSize: savedFile.fileSize,
            status: "generated",
          },
        ],
        { session },
      );

      // Update the application exactly as before.
      await StudentApplication.updateOne(
        { _id: application._id },
        {
          $set: {
            status: "noc_generated",
            noc: noc._id,
            nocGeneratedAt: generatedAt,
          },
        },
        { session },
      );

      // Preserve the existing post-commit notification workflow.
      collectNocDelivery(postCommit, {
        items: [{ application, student }],
        referenceNumber,
        generatedBy,
        pdfBuffer,
        fileName: savedFile.fileName,
        summarize: false,
      });

      generatedNoc = noc;
    });

    /*
     * MongoDB has committed successfully.
     * Remove only Drive files that were uploaded during a failed retry
     * and are not referenced by any NOC.
     */
    await cleanupOrphanDriveFiles();

    await dispatchPostCommit(postCommit);

    return generatedNoc;
  } catch (error) {
    // Preserve Drive files referenced by existing NOC records.
    await cleanupOrphanDriveFiles();

    throw error;
  } finally {
    await session.endSession();
  }
};

/**
 * Generates NOCs for many SPOC-approved applications at once.
 *
 * Applications are grouped by ORGANISATION + DEPARTMENT. Every group
 * gets:
 *   - its own reference number (TNP/JGEC/INT/<year>/<DEPT>/<seq>)
 *   - ONE PDF listing all students of that group
 *   - one NOC record per application (all sharing the same reference
 *     number and PDF file), so the existing
 *     /applications/spoc/:applicationId/noc/pdf route keeps working.
 *   - one notification per student, one summary notification for the
 *     generating SPOC and one email (with the NOC PDF attached) per student
 *
 * Example (all applied to organisation X):
 *   A-CSE, B-CSE, C-IT, D-CSE, E-IT
 *     C, E     -> TNP/JGEC/INT/2026/IT/001
 *     A, B, D  -> TNP/JGEC/INT/2026/CSE/005
 *
 * Applications that cannot be processed (already generated, wrong
 * status, student/department missing) are returned in `skipped`
 * instead of failing the whole batch.
 */
export const generateBulkNoc = async ({ applicationIds, generatedBy }) => {
  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "applicationIds must be a non-empty array",
    );
  }

  validateObjectId(generatedBy, "Invalid SPOC user ID");

  const uniqueIds = [...new Set(applicationIds.map(String))];

  uniqueIds.forEach((id) =>
    validateObjectId(id, `Invalid application ID: ${id}`),
  );

  const session = await mongoose.startSession();

  // Store Drive IDs, not filesystem paths.
  // Do not clear this set when MongoDB retries its transaction callback.
  const savedDriveFileIds = new Set();

  const postCommit = { events: [], mails: [] };

  let result = null;

  /*
   * Delete only Drive files that are not referenced by any NOC.
   * A bulk PDF can be shared by multiple NOC records.
   */
  const cleanupOrphanDriveFiles = async () => {
    for (const driveFileId of savedDriveFileIds) {
      try {
        const referencedNoc = await NOC.exists({ driveFileId });

        if (!referencedNoc) {
          await deleteNocPdf(driveFileId);
        }
      } catch (deleteError) {
        console.error(
          "Failed to clean up orphan Google Drive NOC PDF:",
          driveFileId,
          deleteError,
        );
      }
    }
  };

  try {
    await session.withTransaction(async () => {
      /*
       * MongoDB may retry this callback.
       * Reset transaction-dependent data, but preserve uploaded Drive IDs
       * so PDFs from failed attempts can be cleaned up safely afterward.
       */
      postCommit.events.length = 0;
      postCommit.mails.length = 0;

      const groupsResult = [];
      const skipped = [];

      // Get the applications.
      const applications = await StudentApplication.find({
        _id: { $in: uniqueIds },
      })
        .populate("student")
        .populate("organisation")
        .session(session);

      const foundIds = new Set(
        applications.map((application) => String(application._id)),
      );

      for (const id of uniqueIds) {
        if (!foundIds.has(id)) {
          skipped.push({
            applicationId: id,
            reason: "Application not found",
          });
        }
      }

      // Filter eligible applications.
      const eligible = [];

      for (const application of applications) {
        if (application.noc) {
          skipped.push({
            applicationId: String(application._id),
            reason: "NOC already generated",
          });

          continue;
        }

        if (application.status !== "approved_by_spoc") {
          skipped.push({
            applicationId: String(application._id),
            reason: `Application status is ${application.status}`,
          });

          continue;
        }

        eligible.push(application);
      }

      /*
       * Get students as plain objects.
       * This preserves non-schema fields such as gurdianName
       * and gurdianMobile.
       */
      const students = await Student.find({
        _id: {
          $in: eligible
            .map((application) => idOf(application.student))
            .filter(isValidId),
        },
      })
        .session(session)
        .lean();

      const studentMap = new Map(
        students.map((student) => [String(student._id), student]),
      );

      // Group by organisation and department.
      const groups = new Map();

      for (const application of eligible) {
        const student = studentMap.get(String(idOf(application.student)));

        if (!student) {
          skipped.push({
            applicationId: String(application._id),
            reason: "Student not found",
          });

          continue;
        }

        const department = student.department || application.department;

        if (!department) {
          skipped.push({
            applicationId: String(application._id),
            reason: "Student department is required to generate NOC",
          });

          continue;
        }

        const organisationId = String(idOf(application.organisation));

        const departmentCode = getDepartmentCode(department);
        const key = `${organisationId}|${departmentCode}`;

        if (!groups.has(key)) {
          groups.set(key, {
            organisationId,
            departmentCode,
            department,
            items: [],
          });
        }

        groups.get(key).items.push({ application, student });
      }

      // One NOC reference and one PDF per group.
      for (const group of groups.values()) {
        const referenceNumber = await createNocReference({
          department: group.department,
          session,
        });

        const academicYear = new Date().getFullYear();
        const generatedAt = new Date();

        const pdfBuffer = await buildBulkNocPdfBuffer({
          items: group.items,
          referenceNumber,
          generatedAt,
          academicYear,
          department: group.department,
          spocIds: [generatedBy],
        });

        if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
          throw new APIERR(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            "Failed to generate bulk NOC PDF",
          );
        }

        // Save the PDF in Google Drive.
        const savedFile = await saveNocPdf({
          pdfBuffer,
          academicYear,
          department: group.departmentCode,
          fileName: buildNocFileName(referenceNumber),
        });

        if (
          savedFile.storageProvider !== "google_drive" ||
          !savedFile.driveFileId
        ) {
          throw new APIERR(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            "Failed to store bulk NOC PDF in Google Drive",
          );
        }

        savedDriveFileIds.add(savedFile.driveFileId);

        /*
         * Create one NOC document per application.
         * All documents in this group share the same PDF and reference.
         */
        const nocDocs = await NOC.create(
          group.items.map(({ application, student }) => ({
            application: application._id,
            student: student._id,
            organisation: idOf(application.organisation),
            referenceNumber,
            generatedBy,
            generatedAt,
            academicYear,
            department: group.department,

            // Google Drive storage metadata.
            storageProvider: savedFile.storageProvider,
            driveFileId: savedFile.driveFileId,

            fileName: savedFile.fileName,

            // Retained for compatibility with existing code.
            // This is a Drive file ID, not a local filesystem path.
            filePath: savedFile.driveFileId,

            // Downloads must continue through your authenticated backend.
            fileUrl: `/applications/spoc/${application._id}/noc/pdf`,

            fileMimeType: savedFile.mimeType,
            fileSize: savedFile.fileSize,
            status: "generated",
          })),
          {
            session,
            ordered: true,
          },
        );

        // Update application status and NOC reference.
        await StudentApplication.bulkWrite(
          nocDocs.map((noc) => ({
            updateOne: {
              filter: { _id: noc.application },
              update: {
                $set: {
                  status: "noc_generated",
                  noc: noc._id,
                  nocGeneratedAt: generatedAt,
                },
              },
            },
          })),
          { session },
        );

        // Preserve the existing post-commit notification workflow.
        collectNocDelivery(postCommit, {
          items: group.items,
          referenceNumber,
          generatedBy,
          pdfBuffer,
          fileName: savedFile.fileName,
          summarize: true,
        });

        groupsResult.push({
          referenceNumber,
          department: group.departmentCode,
          organisation: group.organisationId,
          applicationIds: nocDocs.map((noc) => String(noc.application)),
          nocs: nocDocs,
        });
      }

      result = { groups: groupsResult, skipped };
    });

    /*
     * Transaction committed. Any file uploaded during a transaction retry
     * but not referenced by an NOC is now safe to clean up.
     */
    await cleanupOrphanDriveFiles();

    await dispatchPostCommit(postCommit);

    return result;
  } catch (error) {
    /*
     * Clean up only files that have no NOC references.
     * Never delete a Drive file still referenced by another NOC.
     */
    await cleanupOrphanDriveFiles();

    throw error;
  } finally {
    await session.endSession();
  }
};

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
  validateObjectId(generatedBy, "Invalid SPOC user ID");

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

  const department =
    noc.department || student.department || application.department;

  if (!department) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Student department is required to regenerate NOC",
    );
  }

  const pdfBuffer = await buildNocPdfBuffer({
    application,
    student,
    referenceNumber: noc.referenceNumber,
    generatedAt: noc.generatedAt,
    academicYear: noc.academicYear,
    department,
    spocIds: [noc.generatedBy, generatedBy].filter(Boolean),
  });

  if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to regenerate NOC PDF",
    );
  }

  // Preserve the existing reference number and file naming convention.
  const savedFile = await saveNocPdf({
    pdfBuffer,
    academicYear: noc.academicYear,
    department: getDepartmentCode(department),
    fileName: buildNocFileName(noc.referenceNumber),
  });

  if (savedFile.storageProvider !== "google_drive" || !savedFile.driveFileId) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to store regenerated NOC PDF in Google Drive",
    );
  }

  // Keep the previous file metadata in case saving the NOC record fails.
  const previousStorageProvider = noc.storageProvider;
  const previousDriveFileId = noc.driveFileId;
  const previousFilePath = noc.filePath;

  // Update the existing NOC record; do not create a new NOC.
  noc.storageProvider = savedFile.storageProvider;
  noc.driveFileId = savedFile.driveFileId;
  noc.fileName = savedFile.fileName;

  // Compatibility only: filePath now holds the Drive ID.
  noc.filePath = savedFile.driveFileId;

  noc.fileUrl = `/applications/spoc/${application._id}/noc/pdf`;
  noc.fileMimeType = savedFile.mimeType;
  noc.fileSize = savedFile.fileSize;

  try {
    await noc.save();
  } catch (error) {
    // The new Drive file is not referenced if saving the record failed.
    try {
      const referencedNoc = await NOC.exists({
        driveFileId: savedFile.driveFileId,
      });

      if (!referencedNoc) {
        await deleteNocPdf(savedFile.driveFileId);
      }
    } catch (cleanupError) {
      console.error("Failed to clean up regenerated NOC PDF:", cleanupError);
    }

    throw error;
  }

  /*
   * Delete the old Drive file only when no other NOC references it.
   * This is important because bulk NOCs can share one PDF.
   */
  if (
    previousStorageProvider === "google_drive" &&
    previousDriveFileId &&
    previousDriveFileId !== savedFile.driveFileId
  ) {
    try {
      const referencedNoc = await NOC.exists({
        driveFileId: previousDriveFileId,
      });

      if (!referencedNoc) {
        await deleteNocPdf(previousDriveFileId);
      }
    } catch (deleteError) {
      console.error(
        "Old Google Drive NOC PDF could not be removed:",
        deleteError.message,
      );
    }
  } else if (previousStorageProvider === "local" && previousFilePath) {
    /*
     * If you still support legacy local files, delete them through your
     * existing local-file cleanup utility. Do not pass a local path to
     * the Google Drive deleteNocPdf() function.
     */
  }

  return noc;
};

// Get the NOC
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

// Get all the SPOC NOCs
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

// Get the applications Review History
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
