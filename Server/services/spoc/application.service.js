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
import { generateNocPdf } from "../../utils/noc.utils.js";
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
  let savedFilePath = null;

  try {
    await session.withTransaction(async () => {
      /* a transaction callback can be retried - start clean */
      postCommit.events.length = 0;
      postCommit.mails.length = 0;
      // Get the Applications
      const application = await StudentApplication.findById(applicationId)
        .populate("student")
        .populate("organisation")
        .session(session);

      if (!application) {
        throw new APIERR(HTTP_STATUS.NOT_FOUND, "Application not found");
      }
      // Already Generated
      if (application.noc) {
        const existingNoc = await NOC.findById(application.noc).session(
          session,
        );

        if (existingNoc) {
          generatedNoc = existingNoc;

          return;
        }
      }
      // Status Check
      if (application.status !== "approved_by_spoc") {
        throw new APIERR(
          HTTP_STATUS.BAD_REQUEST,
          "NOC can only be generated for an application approved by SPOC",
        );
      }

      /* 
      GET STUDENT (plain object, keeps non-schema fields
      such as gurdianName / gurdianMobile)
      */

      const student = await Student.findById(
        application.student?._id || application.student,
      )
        .session(session)
        .lean();

      if (!student) {
        throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student not found");
      }
      // Department
      const department = student.department || application.department;

      if (!department) {
        throw new APIERR(
          HTTP_STATUS.BAD_REQUEST,
          "Student department is required to generate NOC",
        );
      }
      // Reference Number
      const referenceNumber = await createNocReference({
        department,
        session,
      });

      const academicYear = new Date().getFullYear();
      const generatedAt = new Date();
      // Generated PDF
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
      // File Name
      const fileName = buildNocFileName(referenceNumber);
      // Save PDF on the Server
      const savedFile = await saveNocPdf({
        pdfBuffer,
        academicYear,
        department: getDepartmentCode(department),
        fileName,
      });
      savedFilePath = savedFile.absoluteFilePath;
      // Backend File URL
      const fileUrl = `/applications/spoc/${application._id}/noc/pdf`;
      // Create the NOC Record
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
      // Update the Applications
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

    await dispatchPostCommit(postCommit);

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
  const savedFilePaths = [];
  const postCommit = { events: [], mails: [] };
  let result = null;

  try {
    await session.withTransaction(async () => {
      /* a transaction callback can be retried - start clean */
      savedFilePaths.length = 0;
      postCommit.events.length = 0;
      postCommit.mails.length = 0;
      const groupsResult = [];
      const skipped = [];
      // Get the applications
      const applications = await StudentApplication.find({
        _id: { $in: uniqueIds },
      })
        .populate("student")
        .populate("organisation")
        .session(session);
      const foundIds = new Set(applications.map((a) => String(a._id)));
      for (const id of uniqueIds) {
        if (!foundIds.has(id)) {
          skipped.push({
            applicationId: id,
            reason: "Application not found",
          });
        }
      }
      // Filter out the elligible applications
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

      /* --------------------------------------------------
           GET STUDENTS (plain objects, keeps non-schema
           fields such as gurdianName / gurdianMobile)
        -------------------------------------------------- */

      const students = await Student.find({
        _id: {
          $in: eligible.map((a) => idOf(a.student)).filter(isValidId),
        },
      })
        .session(session)
        .lean();

      const studentMap = new Map(students.map((s) => [String(s._id), s]));
      // Group by Organisations & Department
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
      // One NOC refrence per Groups
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

        const savedFile = await saveNocPdf({
          pdfBuffer,
          academicYear,
          department: group.departmentCode,
          fileName: buildNocFileName(referenceNumber),
        });

        savedFilePaths.push(savedFile.absoluteFilePath);

        /* one NOC record per application, same reference + file */
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
            fileName: savedFile.fileName,
            filePath: savedFile.relativeFilePath,
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

    await dispatchPostCommit(postCommit);

    return result;
  } catch (error) {
    /*
     * MongoDB transaction failed after one or more PDFs were written.
     *
     * Remove every orphan PDF.
     */

    for (const filePath of savedFilePaths) {
      try {
        await deleteNocPdf(filePath);
      } catch (deleteError) {
        console.error("Failed to remove orphan NOC PDF:", deleteError);
      }
    }

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
