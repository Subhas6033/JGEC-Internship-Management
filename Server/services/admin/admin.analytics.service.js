import { Student } from "../../models/students.models.js";
import { Organisation } from "../../models/organisation.models.js";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { NOC } from "../../models/noc.models.js";

// Final approval stages
const FINAL_APPROVAL_STATUSES = ["approved_by_spoc", "noc_generated"];

const getDateRange = (period = "12m") => {
  const endDate = new Date();
  const startDate = new Date(endDate);

  switch (period) {
    case "30d":
      startDate.setDate(startDate.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(startDate.getDate() - 90);
      break;
    case "12m":
    default:
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  return { startDate, endDate };
};

const getApplicationDateFilter = ({ startDate, endDate }) => ({
  createdAt: {
    $gte: startDate,
    $lt: endDate,
  },
});

// -----------------------------------------------------------------------------
// Summary statistics
// -----------------------------------------------------------------------------

const getAnalyticsSummary = async ({ startDate, endDate }, prevDateRange) => {
  const currentFilter = getApplicationDateFilter({ startDate, endDate });

  // Calculate previous period for comparison
  const prevStart = new Date(startDate);
  const prevEnd = new Date(startDate);
  const periodDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  prevStart.setDate(prevStart.getDate() - periodDays);
  const prevFilter = getApplicationDateFilter({
    startDate: prevStart,
    endDate: prevEnd,
  });

  const [
    totalStudents,
    applications,
    prevApplications,
    selectedApplications,
    activeDrives,
  ] = await Promise.all([
    Student.countDocuments({}),

    StudentApplication.countDocuments(currentFilter),
    StudentApplication.countDocuments(prevFilter),

    StudentApplication.countDocuments({
      ...currentFilter,
      status: { $in: FINAL_APPROVAL_STATUSES },
    }),

    Organisation.countDocuments({ isActive: true }),
  ]);

  const placementRate =
    totalStudents > 0
      ? ((selectedApplications / totalStudents) * 100).toFixed(1)
      : "0.0";

  const applicationChange =
    prevApplications > 0
      ? (((applications - prevApplications) / prevApplications) * 100).toFixed(
          1,
        )
      : "0.0";

  return {
    totalStudents,
    applications,
    placementRate: parseFloat(placementRate),
    activeDrives,
    studentChange: "+0%",
    applicationChange: `${applicationChange >= 0 ? "+" : ""}${applicationChange}%`,
    placementChange: "+0%",
    driveChange: "+0",
  };
};

// -----------------------------------------------------------------------------
// Application trend data
// -----------------------------------------------------------------------------

const getApplicationTrend = async ({ startDate, endDate }, period) => {
  const filter = getApplicationDateFilter({ startDate, endDate });

  let groupBy;
  switch (period) {
    case "30d":
      // Group by week
      groupBy = {
        year: { $year: "$createdAt" },
        week: { $week: "$createdAt" },
      };
      break;
    case "90d":
      // Group by month
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
      break;
    case "12m":
    default:
      // Group by month
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
      break;
  }

  const results = await StudentApplication.aggregate([
    { $match: filter },
    {
      $group: {
        _id: groupBy,
        applications: { $sum: 1 },
        approved: {
          $sum: {
            $cond: [{ $in: ["$status", FINAL_APPROVAL_STATUSES] }, 1, 0],
          },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
  ]);

  // Format labels based on period
  const months = [
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

  if (period === "30d") {
    return {
      labels: results.map((_, i) => `Week ${i + 1}`),
      applications: results.map((r) => r.applications),
      approved: results.map((r) => r.approved),
    };
  }

  return {
    labels: results.map((r) => months[r._id.month - 1]),
    applications: results.map((r) => r.applications),
    approved: results.map((r) => r.approved),
  };
};

// -----------------------------------------------------------------------------
// Application status distribution
// -----------------------------------------------------------------------------

const getApplicationStatus = async ({ startDate, endDate }) => {
  const filter = getApplicationDateFilter({ startDate, endDate });

  const results = await StudentApplication.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusMap = {
    pending: "Pending",
    submitted: "Submitted",
    under_review: "Under Review",
    approved_by_tpo: "Approved by TPO",
    approved_by_spoc: "Approved by SPOC",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    noc_generated: "Approved",
  };

  const labels = [];
  const values = [];

  // Maintain consistent order
  const order = [
    "approved_by_spoc",
    "noc_generated",
    "pending",
    "submitted",
    "under_review",
    "approved_by_tpo",
    "rejected",
    "withdrawn",
  ];

  for (const status of order) {
    const found = results.find((r) => r._id === status);
    if (found && found.count > 0) {
      labels.push(statusMap[status] || status);
      values.push(found.count);
    }
  }

  // Add any statuses not in our order
  for (const result of results) {
    if (!order.includes(result._id)) {
      labels.push(statusMap[result._id] || result._id);
      values.push(result.count);
    }
  }

  return { labels, values };
};

// -----------------------------------------------------------------------------
// Department distribution
// -----------------------------------------------------------------------------

const getDepartmentDistribution = async ({ startDate, endDate }) => {
  const filter = getApplicationDateFilter({ startDate, endDate });

  const results = await StudentApplication.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "students",
        localField: "student",
        foreignField: "_id",
        as: "studentData",
      },
    },
    { $unwind: { path: "$studentData", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$studentData.department",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const DEPARTMENT_NAMES = {
    CSE: "CSE",
    ECE: "ECE",
    EE: "EE",
    ME: "ME",
    CE: "CE",
    IT: "IT",
  };

  return {
    labels: results.map((r) => DEPARTMENT_NAMES[r._id] || r._id || "Other"),
    values: results.map((r) => r.count),
  };
};

// -----------------------------------------------------------------------------
// Drive performance (top companies)
// -----------------------------------------------------------------------------

const getDrivePerformance = async ({ startDate, endDate }) => {
  const filter = getApplicationDateFilter({ startDate, endDate });

  const results = await StudentApplication.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "organisations",
        localField: "organisation",
        foreignField: "_id",
        as: "orgData",
      },
    },
    { $unwind: { path: "$orgData", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$organisation",
        organisationName: { $first: "$orgData.organisationName" },
        applications: { $sum: 1 },
        selected: {
          $sum: {
            $cond: [{ $in: ["$status", FINAL_APPROVAL_STATUSES] }, 1, 0],
          },
        },
      },
    },
    { $sort: { applications: -1 } },
    { $limit: 5 },
  ]);

  return {
    labels: results.map((r) => r.organisationName || "Unknown"),
    applications: results.map((r) => r.applications),
    selected: results.map((r) => r.selected),
  };
};

// -----------------------------------------------------------------------------
// Recent activities
// -----------------------------------------------------------------------------

const getRecentActivitiesData = async () => {
  const [applications, nocs] = await Promise.all([
    StudentApplication.find({})
      .populate("student", "fullName")
      .populate("organisation", "organisationName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    NOC.find({})
      .populate("student", "fullName")
      .populate("organisation", "organisationName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const activities = [];

  applications.forEach((app) => {
    activities.push({
      _id: app._id,
      activity: "New internship application",
      description: `${app.student?.fullName || "A student"} applied to ${app.organisation?.organisationName || "an organisation"}.`,
      category: "Applications",
      date: app.createdAt,
      status:
        app.status === "approved_by_spoc" || app.status === "noc_generated"
          ? "Completed"
          : "Pending",
    });
  });

  nocs.forEach((noc) => {
    activities.push({
      _id: noc._id,
      activity: noc.status === "revoked" ? "NOC revoked" : "NOC generated",
      description: `NOC for ${noc.student?.fullName || "a student"}`,
      category: "NOC",
      date: noc.createdAt,
      status: noc.status === "revoked" ? "Revoked" : "Completed",
    });
  });

  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};

// -----------------------------------------------------------------------------
// Main analytics service
// -----------------------------------------------------------------------------

export const getAdminAnalytics = async (period = "12m") => {
  const dateRange = getDateRange(period);

  // Calculate previous period for comparison
  const prevStart = new Date(dateRange.startDate);
  const prevEnd = new Date(dateRange.startDate);
  const periodDays = Math.round(
    (dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24),
  );
  prevStart.setDate(prevStart.getDate() - periodDays);
  const prevDateRange = { startDate: prevStart, endDate: prevEnd };

  const [
    summary,
    applicationTrend,
    applicationStatus,
    departmentDistribution,
    drivePerformance,
    recentActivities,
  ] = await Promise.all([
    getAnalyticsSummary(dateRange, prevDateRange),
    getApplicationTrend(dateRange, period),
    getApplicationStatus(dateRange),
    getDepartmentDistribution(dateRange),
    getDrivePerformance(dateRange),
    getRecentActivitiesData(),
  ]);

  // Format recent activities for display
  const formattedActivities = recentActivities.map((activity) => {
    const dateObj = activity.date ? new Date(activity.date) : new Date();
    const isValidDate = !isNaN(dateObj.getTime());

    return {
      ...activity,
      date: isValidDate
        ? dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
    };
  });

  return {
    summary,
    applicationTrend,
    applicationStatus,
    departmentDistribution,
    drivePerformance,
    recentActivities: formattedActivities,
  };
};
