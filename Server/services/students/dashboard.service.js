import mongoose from "mongoose";
import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { Student } from "../../models/students.models.js";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { StudentDocument } from "../../models/studentDocument.models.js";

const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Student authentication is required",
    );
  }

  // Student details
  const student = await Student.findById(studentId).select(
    "fullName email mobileNumber rollNumber department signature guardianName guardianMobile",
  );

  if (!student) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  // Uploaded documents
  const studentDocuments = await StudentDocument.findOne({
    student: studentId,
  }).lean();

  const hasUploadedFile = (file) => Boolean(file?.url);
  const signatureUploaded = hasUploadedFile(studentDocuments?.signature);
  const resumeUploaded = hasUploadedFile(studentDocuments?.resume);
  const uploadedDocuments = [];

  if (signatureUploaded) {
    uploadedDocuments.push({
      id: "signature",
      name: "Signature",
      category: "signature",
      fileName: studentDocuments.signature.fileName,
      mimeType: studentDocuments.signature.mimeType,
      url: studentDocuments.signature.url,
      uploadedAt: studentDocuments.signature.uploadedAt,
      status: "uploaded",
    });
  }

  if (resumeUploaded) {
    uploadedDocuments.push({
      id: "resume",
      name: "Resume",
      category: "resume",
      fileName: studentDocuments.resume.fileName,
      mimeType: studentDocuments.resume.mimeType,
      url: studentDocuments.resume.url,
      uploadedAt: studentDocuments.resume.uploadedAt,
      status: "uploaded",
    });
  }

  const requiredDocuments = [
    {
      id: "signature",
      name: "Signature",
      category: "signature",
      required: true,
      uploaded: signatureUploaded,
      status: signatureUploaded ? "uploaded" : "missing",
      file: signatureUploaded
        ? {
            fileName: studentDocuments.signature.fileName,
            mimeType: studentDocuments.signature.mimeType,
            url: studentDocuments.signature.url,
            uploadedAt: studentDocuments.signature.uploadedAt,
          }
        : null,
    },
    {
      id: "resume",
      name: "Resume",
      category: "resume",
      required: true,
      uploaded: resumeUploaded,
      status: resumeUploaded ? "uploaded" : "missing",
      file: resumeUploaded
        ? {
            fileName: studentDocuments.resume.fileName,
            mimeType: studentDocuments.resume.mimeType,
            url: studentDocuments.resume.url,
            uploadedAt: studentDocuments.resume.uploadedAt,
          }
        : null,
    },
  ];

  const totalDocuments = requiredDocuments.length;
  const uploadedDocumentsCount = uploadedDocuments.length;

  // Student applications
  const applications = await StudentApplication.find({
    student: studentId,
  })
    .populate(
      "organisation",
      "organisationName organisationSite organisationLocation",
    )
    .sort({ createdAt: -1 })
    .lean();

  const getStatus = (application) =>
    String(application?.status || "")
      .trim()
      .toLowerCase();

  // Application statistics
  const totalApplications = applications.length;
  const approvedStatuses = ["approved_by_spoc", "noc_generated"];
  const approvedApplications = applications.filter((application) =>
    approvedStatuses.includes(getStatus(application)),
  ).length;

  const pendingStatuses = [
    "submitted",
    "under_tpo_review",
    "approved_by_tpo",
    "under_spoc_review",
    "update_required",
  ];

  const pendingApplications = applications.filter((application) =>
    pendingStatuses.includes(getStatus(application)),
  ).length;

  const rejectedApplications = applications.filter(
    (application) => getStatus(application) === "rejected",
  ).length;

  const withdrawnApplications = applications.filter(
    (application) => getStatus(application) === "withdrawn",
  ).length;

  // Current application
  const activeStatuses = [
    "submitted",
    "under_tpo_review",
    "approved_by_tpo",
    "under_spoc_review",
    "approved_by_spoc",
    "update_required",
  ];

  const activeApplication =
    applications.find((application) =>
      activeStatuses.includes(getStatus(application)),
    ) ||
    applications[0] ||
    null;

  // Application tracking
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
        "noc_generated",
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
        "noc_generated",
      ].includes(status)
    ) {
      steps[1].status = status === "under_tpo_review" ? "current" : "completed";
    }

    if (
      ["under_spoc_review", "approved_by_spoc", "noc_generated"].includes(
        status,
      )
    ) {
      steps[2].status =
        status === "under_spoc_review" ? "current" : "completed";
    }

    if (status === "approved_by_tpo") {
      steps[2].status = "current";
    }

    if (["approved_by_spoc", "noc_generated"].includes(status)) {
      steps[3].status = "completed";
    }

    if (status === "update_required") {
      steps[0].status = "completed";
      steps[1].status = "current";
    }

    if (status === "rejected" || status === "withdrawn") {
      steps[0].status = "completed";
    }

    if (status === "noc_generated") {
      steps.forEach((step) => {
        step.status = "completed";
      });
    }

    return steps;
  };

  const currentApplication = activeApplication
    ? {
        id: activeApplication._id,
        company:
          activeApplication.organisation?.organisationName || "Organisation",
        role: activeApplication.designation,
        status: getStatus(activeApplication),
        steps: getApplicationSteps(getStatus(activeApplication)),
      }
    : null;

  // Recent applications
  const recentApplications = applications.slice(0, 5).map((application) => ({
    id: application._id,
    company: application.organisation?.organisationName || "Organisation",
    role: application.designation,
    date: application.createdAt,
    status: getStatus(application),
  }));

  // Profile completion
  const profileFields = [
    student.fullName,
    student.email,
    student.mobileNumber,
    student.rollNumber,
    student.department,
    student.signature || studentDocuments?.signature?.url,
    student.guardianName,
    student.guardianMobile,
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

  // Dashboard response
  const dashboard = {
    student: {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      mobileNumber: student.mobileNumber,
      rollNumber: student.rollNumber,
      department: student.department,
      guardianName: student.guardianName,
      guardianMobile: student.guardianMobile,
    },

    stats: {
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      withdrawnApplications,
      documents: uploadedDocumentsCount,
      totalRequiredDocuments: totalDocuments,
    },

    currentApplication,
    recentApplications,
    profileCompletion: {
      percentage: profileCompletion,
      completed: completedProfileFields,
      total: totalProfileFields,
    },

    documents: uploadedDocuments,
    requiredDocuments,
    signature: studentDocuments?.signature || null,
    resume: studentDocuments?.resume || null,
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
