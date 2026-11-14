import { StudentApplication } from "../../models/studentApplication.models.js";
import { Student } from "../../models/students.models.js";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";

const getDeptTpoDashboard = async ({ user }) => {
  // Validate authentication.
  if (!user?._id) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Authenticated user not found");
  }

  const department = user?.department;

  // Prevent access to another department's dashboard.
  if (!department) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Department is not associated with this TPO",
    );
  }

  // Department filter applied after joining student details.
  const departmentFilter = {
    "studentData.department": department,
  };

  // Common student lookup.
  const studentLookup = {
    $lookup: {
      from: "students",
      localField: "student",
      foreignField: "_id",
      as: "studentData",
    },
  };

  const departmentMatch = {
    $match: departmentFilter,
  };

  // Common department-scoped aggregation stages.
  const departmentStages = [
    studentLookup,
    {
      $unwind: "$studentData",
    },
    departmentMatch,
  ];

  const [
    totalStudents,
    applicationStats,
    monthlyTrend,
    companyStats,
    pendingApplications,
    recentActivityData,
    placedStudentData,
  ] = await Promise.all([
    // Total students in the department.
    Student.countDocuments({
      department,
    }),

    // Application counts grouped by status.
    StudentApplication.aggregate([
      ...departmentStages,
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    // Monthly application trend.
    StudentApplication.aggregate([
      ...departmentStages,
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
          accepted: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "noc_generated"],
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
    ]),

    // Organisation-wise application distribution.
    StudentApplication.aggregate([
      ...departmentStages,
      {
        $group: {
          _id: "$organisation",
          applications: {
            $sum: 1,
          },
          accepted: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "noc_generated"],
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
          accepted: 1,
        },
      },
    ]),

    // Applications requiring TPO action.
    StudentApplication.aggregate([
      ...departmentStages,
      {
        $match: {
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

    // Recent application activity.
    // Fetch the latest five applications belonging to this department.
    StudentApplication.aggregate([
      ...departmentStages,
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
          createdAt: 1,
          updatedAt: 1,
          designation: 1,

          student: {
            _id: "$studentData._id",
            fullName: "$studentData.fullName",
            rollNumber: "$studentData.rollNumber",
          },

          organisation: {
            _id: "$organisationData._id",
            name: {
              $ifNull: [
                "$organisationData.organisationName",
                "Unknown organisation",
              ],
            },
          },
        },
      },
    ]),

    // Count unique students with an NOC-generated application.
    // This avoids counting the same student multiple times.
    StudentApplication.aggregate([
      ...departmentStages,
      {
        $match: {
          status: "noc_generated",
        },
      },
      {
        $group: {
          _id: "$student",
        },
      },
      {
        $count: "total",
      },
    ]),
  ]);

  // Applications Status Counts
  const statusMap = applicationStats.reduce((result, item) => {
    result[item._id] = item.count ?? 0;
    return result;
  }, {});

  const totalApplications = applicationStats.reduce(
    (total, item) => total + (item.count ?? 0),
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
  const nocGenerated = statusMap.noc_generated ?? 0;

  // Applications currently requiring TPO action.
  const pendingApprovals = submitted + underTpoReview + updateRequired;

  // Applications that have moved beyond TPO-pending stages.
  const progressedApplications = Math.max(
    0,
    totalApplications - pendingApprovals,
  );

  // Placement Rate
  // Unique students who have received an NOC.
  const placedStudents = placedStudentData[0]?.total ?? 0;

  // NOC-based placement rate.
  // This is a proxy until actual joining/placement confirmation is tracked.
  const placementRate =
    totalStudents > 0
      ? Number(Math.min(100, (placedStudents / totalStudents) * 100).toFixed(1))
      : 0;

  // Department Workflow Progress
  const applicationProgress =
    totalApplications > 0
      ? Math.round((progressedApplications / totalApplications) * 100)
      : 0;

  const nocVerification =
    totalApplications > 0
      ? Math.round((nocGenerated / totalApplications) * 100)
      : 0;

  const companyVerification =
    totalApplications > 0
      ? Math.round(
          ((underSpocReview + approvedBySpoc + nocGenerated) /
            totalApplications) *
            100,
        )
      : 0;

  // Joining confirmation is not yet available in the current workflow.
  const joiningConfirmation = 0;

  // Monthly Applications Trend
  const trend = monthlyTrend.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    applications: item.applications ?? 0,
    accepted: item.accepted ?? 0,
  }));

  // Organisations Wise applications Distributions
  const companies = companyStats.map((item) => ({
    companyId: item._id,
    name: item.name || "Unknown organisation",
    applications: item.applications ?? 0,
    accepted: item.accepted ?? 0,
  }));

  // Recent Activities
  const activityLabels = {
    submitted: "submitted an application",
    under_tpo_review: "application is under TPO review",
    update_required: "application requires an update",
    approved_by_tpo: "application approved by TPO",
    under_spoc_review: "application is under SPOC review",
    approved_by_spoc: "application approved by SPOC",
    noc_generated: "NOC generated for application",
    rejected: "application rejected",
    withdrawn: "application withdrawn",
  };

  const recentActivity = recentActivityData.map((item) => {
    const studentName = item.student?.fullName || "A student";
    const organisationName = item.organisation?.name || "an organisation";
    const action = activityLabels[item.status] || "updated an application";

    return {
      _id: item._id,
      title: `${studentName} ${action}`,
      description: `${organisationName} · ${
        item.designation || "Internship application"
      }`,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,

      student: item.student,
      organisation: item.organisation,
    };
  });

  // Final Dashboard Responses
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
      accepted: nocGenerated,
      rejected,
      returned: updateRequired,
    },

    trend,

    companies,

    progress: {
      applications: applicationProgress,
      nocVerification,
      companyVerification,
      joiningConfirmation,
    },

    pendingApplications,

    recentActivity,

    // Upcoming items remain empty until their data source is implemented.
    upcoming: [],

    analytics: {
      submitted,
      underTpoReview,
      updateRequired,
      approvedByTpo,
      underSpocReview,
      approvedBySpoc,
      nocGenerated,
      rejected,
      withdrawn,
    },
  };
};

export { getDeptTpoDashboard };
