import mongoose from "mongoose";
import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { Student } from "../../models/students.models.js";
import { StudentApplication } from "../../models/studentApplication.models.js";

const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.student?._id;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Student authentication is required",
    );
  }

  const student = await Student.findById(studentId).select(
    "fullName email mobileNumber rollNumber department signature gurdianName gurdianMobile",
  );

  if (!student) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  const applications = await StudentApplication.find({
    student: studentId,
  })
    .populate(
      "organisation",
      "organisationName organisationSite organisationLocation",
    )
    .sort({ createdAt: -1 })
    .lean();

  // Applications Statistics
  const totalApplications = applications.length;

  const approvedApplications = applications.filter(
    (application) =>
      application.status === "approved_by_tpo" ||
      application.status === "under_spoc_review" ||
      application.status === "approved_by_spoc",
  ).length;

  const pendingApplications = applications.filter((application) =>
    [
      "submitted",
      "under_tpo_review",
      "approved_by_tpo",
      "under_spoc_review",
    ].includes(application.status),
  ).length;

  const rejectedApplications = applications.filter(
    (application) => application.status === "rejected",
  ).length;

  const withdrawnApplications = applications.filter(
    (application) => application.status === "withdrawn",
  ).length;

  /*
   * -------------------------------------------------------
   * CURRENT APPLICATION
   * -------------------------------------------------------
   *
   * Prefer an application which is currently in the workflow.
   * If there is none, use the latest application.
   */

  const activeApplication =
    applications.find((application) =>
      [
        "submitted",
        "under_tpo_review",
        "approved_by_tpo",
        "under_spoc_review",
        "approved_by_spoc",
        "update_required",
      ].includes(application.status),
    ) ||
    applications[0] ||
    null;

  const getApplicationSteps = (status) => {
    const steps = [
      {
        id: "submitted",
        label: "Application submitted",
        status: "pending",
      },
      {
        id: "tpo_review",
        label: "TPO review",
        status: "pending",
      },
      {
        id: "spoc_review",
        label: "SPOC review",
        status: "pending",
      },
      {
        id: "approved",
        label: "Application approved",
        status: "pending",
      },
    ];

    if (status === "draft") {
      return steps;
    }

    if (
      [
        "submitted",
        "under_tpo_review",
        "approved_by_tpo",
        "under_spoc_review",
        "approved_by_spoc",
      ].includes(status)
    ) {
      steps[0].status = "completed";
    }

    if (
      [
        "under_tpo_review",
        "approved_by_tpo",
        "under_spoc_review",
        "approved_by_spoc",
      ].includes(status)
    ) {
      steps[1].status = status === "under_tpo_review" ? "current" : "completed";
    }

    if (["under_spoc_review", "approved_by_spoc"].includes(status)) {
      steps[2].status =
        status === "under_spoc_review" ? "current" : "completed";
    }

    if (status === "approved_by_spoc") {
      steps[3].status = "completed";
    }

    if (status === "approved_by_tpo") {
      steps[2].status = "current";
    }

    if (status === "update_required") {
      steps[0].status = "completed";
      steps[1].status = "current";
    }

    if (status === "rejected") {
      steps[0].status = "completed";
    }

    if (status === "withdrawn") {
      steps[0].status = "completed";
    }

    return steps;
  };

  const currentApplication = activeApplication
    ? {
        id: activeApplication._id,
        company:
          activeApplication.organisation?.organisationName || "Organisation",
        role: activeApplication.designation,
        status: activeApplication.status,
        steps: getApplicationSteps(activeApplication.status),
      }
    : null;

  /*
   * -------------------------------------------------------
   * RECENT APPLICATIONS
   * -------------------------------------------------------
   */

  const recentApplications = applications.slice(0, 5).map((application) => ({
    id: application._id,
    company: application.organisation?.organisationName || "Organisation",
    role: application.designation,
    date: application.createdAt,
    status: application.status,
  }));

  /*
   * -------------------------------------------------------
   * PROFILE COMPLETION
   * -------------------------------------------------------
   *
   * Based on the fields currently available in Student model.
   */

  const profileFields = [
    student.fullName,
    student.email,
    student.mobileNumber,
    student.rollNumber,
    student.department,
    student.signature,
    student.gurdianName,
    student.gurdianMobile,
  ];

  const completedProfileFields = profileFields.filter(
    (field) =>
      field !== undefined && field !== null && String(field).trim() !== "",
  ).length;

  const totalProfileFields = profileFields.length;

  const profileCompletion =
    totalProfileFields === 0
      ? 0
      : Math.round((completedProfileFields / totalProfileFields) * 100);

  /*
   * -------------------------------------------------------
   * RESPONSE
   * -------------------------------------------------------
   */

  const dashboard = {
    student: {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      rollNumber: student.rollNumber,
      department: student.department,
    },

    stats: {
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      withdrawnApplications,
    },

    currentApplication,

    recentApplications,

    profileCompletion: {
      percentage: profileCompletion,
      completed: completedProfileFields,
      total: totalProfileFields,
    },

    /*
     * These will be connected when the corresponding
     * backend models/services are implemented.
     */
    requiredDocuments: [],
    recentNotifications: [],
    upcomingDeadlines: [],
  };

  return res
    .status(HTTP_STATUS.SUCCESS)
    .json(
      new APIRES(
        HTTP_STATUS.SUCCESS,
        dashboard,
        "Student dashboard fetched successfully",
      ),
    );
});

export { getStudentDashboard };
