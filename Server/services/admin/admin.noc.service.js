import { StudentApplication } from "../../models/studentApplication.models.js";
import { NOC } from "../../models/noc.models.js";
import { Student } from "../../models/students.models.js";
import { Organisation } from "../../models/organisation.models.js";
import { APIERR } from "../../utils/helper.utils.js";
import { sendNocMails } from "../../utils/Mail/mail.utils.js";
import { publishEvent } from "../notification/notification.service.js";
import {
  NOTIFICATION_ROLES,
  NOTIFICATION_TYPES as T,
} from "../../config/notification.config.js";

// Application statuses the admin NOC screen works with.
const PENDING_STATUS = "pending_admin_approval";
const SENT_STATUS = "noc_generated";

// Maps the UI status filter to application statuses.
//   sent    -> approved and dispatched
//   pending -> waiting for the admin
//   failed  -> a failed dispatch never changes the application status, so
//              those records are still "pending" in the database. The UI
//              marks them as Failed for the session and filters them there.
//   (none)  -> everything the screen can show
const STATUS_FILTER_MAP = {
  sent: [SENT_STATUS],
  pending: [PENDING_STATUS],
  failed: [PENDING_STATUS],
};

/**
 * Get NOCs for the admin screen (pending approval and already sent).
 * Pass `status` = sent | pending | failed to narrow the list.
 */
export const getPendingNOCs = async ({
  page = 1,
  limit = 10,
  search = "",
  department = "",
  status = "",
}) => {
  const skip = (page - 1) * limit;

  const statuses = STATUS_FILTER_MAP[String(status || "").toLowerCase()] || [
    PENDING_STATUS,
    SENT_STATUS,
  ];

  const applicationFilter = { status: { $in: statuses } };

  // Get applications with their student, organisation and NOC
  let applications = await StudentApplication.find(applicationFilter)
    .populate("student", "fullName rollNumber email department semester")
    .populate("organisation", "organisationName organisationLocation")
    .populate("noc")
    .sort({ nocGeneratedAt: -1 })
    .lean();

  // Filter by department if provided
  if (department) {
    applications = applications.filter(
      (app) => app.student?.department === department,
    );
  }

  // Filter by search if provided
  if (search) {
    const searchLower = String(search).toLowerCase();
    applications = applications.filter(
      (app) =>
        app.student?.fullName?.toLowerCase().includes(searchLower) ||
        app.student?.rollNumber?.toLowerCase().includes(searchLower) ||
        app.student?.email?.toLowerCase().includes(searchLower) ||
        app.organisation?.organisationName?.toLowerCase().includes(searchLower),
    );
  }

  const total = applications.length;
  const paginatedApplications = applications.slice(skip, skip + limit);

  return {
    applications: paginatedApplications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get single NOC details for admin review (pending or already sent)
 */
export const getNOCDetails = async (applicationId) => {
  const application = await StudentApplication.findById(applicationId)
    .populate("student")
    .populate("organisation")
    .populate("noc")
    .lean();

  if (!application) {
    throw new APIERR(404, "Application not found");
  }

  if (![PENDING_STATUS, SENT_STATUS].includes(application.status)) {
    throw new APIERR(400, "NOC is not available for review");
  }

  return application;
};

/**
 * Admin approves and sends NOC to student
 */
export const approveAndSendNOC = async (applicationId, adminId) => {
  const application = await StudentApplication.findById(applicationId)
    .populate("student")
    .populate("organisation")
    .populate("noc");

  if (!application) {
    throw new APIERR(404, "Application not found");
  }

  if (application.status !== PENDING_STATUS) {
    throw new APIERR(
      400,
      "NOC is not pending approval. Current status: " + application.status,
    );
  }

  const noc = application.noc;

  if (!noc) {
    throw new APIERR(404, "NOC record not found");
  }

  // Update application status to noc_generated
  application.status = SENT_STATUS;
  await application.save();

  // Update NOC status
  noc.status = "generated";
  await noc.save();

  // Send email to student with NOC attached
  const student = application.student;
  const organisation = application.organisation;

  if (student?.email) {
    const mailData = {
      to: student.email,
      studentName: student.fullName || "Student",
      organisationName: organisation?.organisationName || "the organisation",
      referenceNumber: noc.referenceNumber,
      nocId: noc._id,
      applicationId: application._id,
    };

    sendNocMails([mailData])
      .then(({ sent, failed }) => {
        console.info(
          `NOC approval mail: ${sent} sent, ${failed.length} failed.`,
        );
      })
      .catch((error) => {
        console.error("NOC approval mail dispatch failed:", error);
      });
  }

  // Send notification to student
  if (student?._id) {
    await publishEvent({
      role: NOTIFICATION_ROLES.STUDENT,
      type: T.NOC_GENERATED,
      recipient: student._id,
      title: "NOC Approved & Sent",
      message: `Your NOC (${noc.referenceNumber}) has been approved and sent to your email.`,
      metadata: {
        applicationId: application._id,
        nocId: noc._id,
        referenceNumber: noc.referenceNumber,
      },
    });
  }

  return {
    application,
    noc,
    message: "NOC approved and sent to student successfully",
  };
};

/**
 * Bulk approve and send NOCs
 */
export const bulkApproveAndSendNOCs = async (applicationIds, adminId) => {
  const results = {
    success: [],
    failed: [],
  };

  for (const applicationId of applicationIds) {
    try {
      const result = await approveAndSendNOC(applicationId, adminId);
      results.success.push({
        applicationId,
        referenceNumber: result.noc.referenceNumber,
      });
    } catch (error) {
      results.failed.push({
        applicationId,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Get NOC statistics for admin dashboard
 */
export const getNOCStats = async () => {
  const [pendingCount, approvedTodayCount, totalGeneratedCount] =
    await Promise.all([
      StudentApplication.countDocuments({ status: PENDING_STATUS }),
      StudentApplication.countDocuments({
        status: SENT_STATUS,
        nocGeneratedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }),
      StudentApplication.countDocuments({ status: SENT_STATUS }),
    ]);

  return {
    pendingApproval: pendingCount,
    approvedToday: approvedTodayCount,
    totalGenerated: totalGeneratedCount,
  };
};
