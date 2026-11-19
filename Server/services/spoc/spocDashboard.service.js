import mongoose from "mongoose";
import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { Student } from "../../models/students.models.js";

/**
 * Get SPOC Dashboard Data
 * Aggregates statistics, applications, and analytics for SPOC dashboard
 */
const getSpocDashboard = asyncHandler(async (req, res) => {
  const spocId = req.user?._id || req.user?.id || req.userId;

  if (!spocId || !mongoose.Types.ObjectId.isValid(spocId)) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "SPOC authentication is required",
    );
  }

  // Get current date info for monthly analytics
  const now = new Date();
  const currentYear = now.getFullYear();
  const twelveMonthsAgo = new Date(currentYear - 1, now.getMonth() + 1, 1);

  // Total students count
  const totalStudents = await Student.countDocuments({
    isActive: { $ne: false },
  });

  // Total applications count (excluding drafts and withdrawn)
  const totalApplications = await StudentApplication.countDocuments({
    status: { $nin: ["draft", "withdrawn"] },
  });

  // Applications by status for SPOC
  const pendingReviewApplications = await StudentApplication.countDocuments({
    status: { $in: ["under_spoc_review", "approved_by_tpo"] },
  });

  const approvedApplications = await StudentApplication.countDocuments({
    status: { $in: ["approved_by_spoc", "noc_generated"] },
  });

  const rejectedApplications = await StudentApplication.countDocuments({
    status: "rejected",
  });

  const updateRequiredApplications = await StudentApplication.countDocuments({
    status: "update_required",
  });

  // NOCs generated count
  const nocsGenerated = await StudentApplication.countDocuments({
    status: "noc_generated",
  });

  // Unique companies/organisations
  const uniqueOrganisations = await StudentApplication.distinct(
    "organisation",
    {
      status: { $nin: ["draft", "withdrawn"] },
    },
  );
  const totalCompanies = uniqueOrganisations.length;

  // Applications Status Distributions
  const applicationStatusDistribution = await StudentApplication.aggregate([
    {
      $match: {
        status: { $nin: ["draft", "withdrawn"] },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Map status to display categories
  const statusMapping = {
    submitted: "Pending",
    under_tpo_review: "Pending",
    approved_by_tpo: "Pending",
    under_spoc_review: "Pending",
    update_required: "Update Required",
    approved_by_spoc: "Approved",
    noc_generated: "Approved",
    rejected: "Rejected",
  };

  const statusColors = {
    Approved: "#16a34a",
    Pending: "#f59e0b",
    "Update Required": "#3b82f6",
    Rejected: "#ef4444",
  };

  const statusCounts = {};
  applicationStatusDistribution.forEach((item) => {
    const displayStatus = statusMapping[item._id] || "Pending";
    statusCounts[displayStatus] =
      (statusCounts[displayStatus] || 0) + item.count;
  });

  const applicationStatus = Object.entries(statusCounts).map(
    ([label, value]) => ({
      label,
      value,
      color: statusColors[label] || "#6b7280",
    }),
  );

  // Monthly Applications Trend (Last 12 Months)
  const monthlyApplications = await StudentApplication.aggregate([
    {
      $match: {
        status: { $nin: ["draft", "withdrawn"] },
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Fill in all 12 months with data or 0
  const monthlyData = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = (now.getMonth() - 11 + i + 12) % 12;
    const year = now.getMonth() - 11 + i < 0 ? currentYear - 1 : currentYear;

    const monthData = monthlyApplications.find(
      (m) => m._id.year === year && m._id.month === monthIndex + 1,
    );

    monthlyData.push({
      month: monthNames[monthIndex],
      applications: monthData?.count || 0,
    });
  }

  // Placement Progress
  const placementStats = {
    totalStudents,
    selectedStudents: approvedApplications,
    pendingStudents: pendingReviewApplications,
    shortlistedStudents: updateRequiredApplications,
    placementRate:
      totalStudents > 0
        ? Math.round((approvedApplications / totalStudents) * 100)
        : 0,
  };

  // Recent Applications (last 5)
  const recentApplicationsRaw = await StudentApplication.find({
    status: { $nin: ["draft", "withdrawn"] },
  })
    .populate("student", "fullName rollNumber department")
    .populate("organisation", "organisationName")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentApplications = recentApplicationsRaw.map((app) => ({
    id: app._id,
    student: app.student?.fullName || "Unknown",
    rollNumber: app.student?.rollNumber || "N/A",
    company: app.organisation?.organisationName || "Unknown Company",
    role: app.designation || "N/A",
    status: statusMapping[app.status] || "Pending",
    rawStatus: app.status,
    date: app.createdAt,
  }));

  // Pending Tasks Derived from applications status
  const pendingTasks = [];

  if (pendingReviewApplications > 0) {
    pendingTasks.push({
      id: "review_applications",
      title: "Review pending applications",
      description: `${pendingReviewApplications} applications are waiting for review`,
      priority:
        pendingReviewApplications > 20
          ? "High"
          : pendingReviewApplications > 10
            ? "Medium"
            : "Low",
      count: pendingReviewApplications,
      action: "applications",
    });
  }

  if (updateRequiredApplications > 0) {
    pendingTasks.push({
      id: "verify_documents",
      title: "Verify updated documents",
      description: `${updateRequiredApplications} applications need document verification`,
      priority: "Medium",
      count: updateRequiredApplications,
      action: "applications",
    });
  }

  // Check for applications approved by SPOC but NOC not generated
  const approvedWithoutNoc = await StudentApplication.countDocuments({
    status: "approved_by_spoc",
  });

  if (approvedWithoutNoc > 0) {
    pendingTasks.push({
      id: "generate_nocs",
      title: "Generate NOCs",
      description: `${approvedWithoutNoc} approved applications need NOC generation`,
      priority: "High",
      count: approvedWithoutNoc,
      action: "nocs",
    });
  }

  // Department Stats
  const departmentStats = await StudentApplication.aggregate([
    {
      $match: {
        status: { $nin: ["draft", "withdrawn"] },
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "student",
        foreignField: "_id",
        as: "studentInfo",
      },
    },
    {
      $unwind: "$studentInfo",
    },
    {
      $group: {
        _id: "$studentInfo.department",
        total: { $sum: 1 },
        approved: {
          $sum: {
            $cond: [
              { $in: ["$status", ["approved_by_spoc", "noc_generated"]] },
              1,
              0,
            ],
          },
        },
        pending: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$status",
                  ["under_spoc_review", "approved_by_tpo", "submitted"],
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: { total: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  // Response
  const dashboard = {
    overview: {
      totalStudents,
      totalApplications,
      pendingReviews: pendingReviewApplications,
      approvedApplications,
      rejectedApplications,
      nocsGenerated,
      totalCompanies,
    },
    applicationStatus,
    monthlyApplications: monthlyData,
    placementStats,
    recentApplications,
    pendingTasks,
    departmentStats: departmentStats.map((dept) => ({
      department: dept._id || "Unknown",
      total: dept.total,
      approved: dept.approved,
      pending: dept.pending,
    })),
  };

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        dashboard,
        "SPOC dashboard fetched successfully",
      ),
    );
});

export { getSpocDashboard };
