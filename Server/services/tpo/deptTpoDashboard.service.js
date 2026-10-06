import { StudentApplication } from "../../models/studentApplication.models.js";
import { Student } from "../../models/students.models.js";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";

const getDeptTpoDashboard = async ({ user }) => {
  // Reject dashboard access when authentication context is missing.
  if (!user?._id) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Authenticated user not found");
  }

  const department = user?.department;

  // Department scope is required to prevent cross-department dashboard data.
  if (!department) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Department is not associated with this TPO",
    );
  }

  const departmentFilter = {
    "studentData.department": department,
  };

  const [
    totalStudents,
    applicationStats,
    monthlyTrend,
    companyStats,
    pendingApplications,
  ] = await Promise.all([
    // Total students belonging to the authenticated TPO department.
    Student.countDocuments({
      department,
    }),

    // Aggregate application counts by status for the department.
    StudentApplication.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $unwind: "$studentData",
      },
      {
        $match: departmentFilter,
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    // Build the monthly application trend for the department.
    StudentApplication.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $unwind: "$studentData",
      },
      {
        $match: departmentFilter,
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          applications: {
            $sum: 1,
          },
          approvedByTpo: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "approved_by_tpo"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $limit: 12,
      },
    ]),

    // Aggregate application distribution across organisations.
    StudentApplication.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $unwind: "$studentData",
      },
      {
        $match: departmentFilter,
      },
      {
        $group: {
          _id: "$organisation",
          applications: {
            $sum: 1,
          },
          approvedByTpo: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "approved_by_tpo"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          applications: -1,
        },
      },
      {
        $limit: 8,
      },
      {
        $lookup: {
          from: "organisations",
          localField: "_id",
          foreignField: "_id",
          as: "organisationData",
        },
      },
      {
        $unwind: {
          path: "$organisationData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: "$organisationData.organisationName",
          applications: 1,
          approvedByTpo: 1,
        },
      },
    ]),

    // Return applications requiring TPO action, including update-required states.
    StudentApplication.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $unwind: "$studentData",
      },
      {
        $match: {
          ...departmentFilter,
          status: {
            $in: ["submitted", "under_tpo_review", "update_required"],
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "organisations",
          localField: "organisation",
          foreignField: "_id",
          as: "organisationData",
        },
      },
      {
        $unwind: {
          path: "$organisationData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          updateRequiredReason: 1,
          updateRequiredBy: 1,
          designation: 1,
          tentativeStartDate: 1,
          tentativeEndDate: 1,
          modeOfInternship: 1,
          internshipType: 1,
          createdAt: 1,
          student: {
            _id: "$studentData._id",
            fullName: "$studentData.fullName",
            rollNumber: "$studentData.rollNumber",
            email: "$studentData.email",
            department: "$studentData.department",
          },
          organisation: {
            _id: "$organisationData._id",
            name: "$organisationData.organisationName",
          },
        },
      },
    ]),
  ]);

  const statusMap = applicationStats.reduce((result, item) => {
    result[item._id] = item.count;
    return result;
  }, {});

  const totalApplications = applicationStats.reduce(
    (total, item) => total + item.count,
    0,
  );

  const submitted = statusMap.submitted ?? 0;
  const underTpoReview = statusMap.under_tpo_review ?? 0;
  const updateRequired = statusMap.update_required ?? 0;
  const approvedByTpo = statusMap.approved_by_tpo ?? 0;
  const underSpocReview = statusMap.under_spoc_review ?? 0;
  const approvedBySpoc = statusMap.approved_by_spoc ?? 0;
  const rejected = statusMap.rejected ?? 0;
  const withdrawn = statusMap.withdrawn ?? 0;

  // All submitted, TPO-review, and update-required applications need attention.
  const pendingApprovals = submitted + underTpoReview + updateRequired;

  const placementRate =
    totalApplications > 0
      ? Number(((approvedBySpoc / totalApplications) * 100).toFixed(1))
      : 0;

  // Progress tracks applications that have reached a terminal or approval stage.
  const applicationProgress =
    totalApplications > 0
      ? Math.round(
          ((approvedByTpo + approvedBySpoc + rejected + withdrawn) /
            totalApplications) *
            100,
        )
      : 0;

  const trend = monthlyTrend.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    applications: item.applications,
    accepted: item.approvedByTpo,
  }));

  const companies = companyStats.map((item) => ({
    companyId: item._id,
    name: item.name || "Unknown organisation",
    applications: item.applications,
    accepted: item.approvedByTpo,
  }));

  return {
    stats: {
      totalStudents,
      activeInternships: approvedBySpoc,
      pendingApprovals,
      placementRate,
    },

    applications: {
      total: totalApplications,
      pending: pendingApprovals,
      accepted: approvedByTpo,
      rejected,
      returned: updateRequired,
    },

    trend,
    companies,

    progress: {
      applications: applicationProgress,
      nocVerification:
        approvedByTpo > 0
          ? Math.round((approvedBySpoc / approvedByTpo) * 100)
          : 0,
      companyVerification: approvedBySpoc > 0 ? 100 : 0,
      joiningConfirmation: 0,
    },

    pendingApplications,
    recentActivity: [],
    upcoming: [],

    analytics: {
      submitted,
      underTpoReview,
      updateRequired,
      approvedByTpo,
      underSpocReview,
      approvedBySpoc,
      rejected,
      withdrawn,
    },
  };
};

export { getDeptTpoDashboard };
