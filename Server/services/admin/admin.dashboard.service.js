import { Student } from "../../models/students.models.js";
import { Organisation } from "../../models/organisation.models.js";
import { TPO } from "../../models/tpo.models.js";
import { SPOC } from "../../models/spoc.models.js";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { NOC } from "../../models/noc.models.js";

// These are the final approval stages in your StudentApplication schema.
const FINAL_APPROVAL_STATUSES = ["approved_by_spoc", "noc_generated"];

const PENDING_NOC_APPLICATION_STATUS = "approved_by_spoc";

const getAcademicSessionDates = (session) => {
  if (!session || !/^\d{4}-\d{4}$/.test(session)) {
    return null;
  }

  const [startYear, endYear] = session.split("-").map(Number);

  if (endYear !== startYear + 1) {
    return null;
  }

  return {
    startDate: new Date(Date.UTC(startYear, 6, 1)),
    endDate: new Date(Date.UTC(endYear, 6, 1)),
  };
};

const getDateRange = (range = "12-months") => {
  const endDate = new Date();
  const startDate = new Date(endDate);

  switch (range) {
    case "30-days":
      startDate.setDate(startDate.getDate() - 30);
      break;

    case "90-days":
      startDate.setDate(startDate.getDate() - 90);
      break;

    case "12-months":
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
// Overview statistics
// -----------------------------------------------------------------------------

const getOverviewStats = async (dateFilter) => {
  const applicationDateFilter = getApplicationDateFilter(dateFilter);

  const [
    totalStudents,
    totalOrganisations,
    totalTPOs,
    totalSPOCs,
    totalApplications,
    pendingNOCs,
    selectedApplications,
  ] = await Promise.all([
    Student.countDocuments({}),

    Organisation.countDocuments({}),

    TPO.countDocuments({}),

    SPOC.countDocuments({}),

    StudentApplication.countDocuments(applicationDateFilter),

    // An application approved by SPOC is awaiting NOC generation.
    StudentApplication.countDocuments({
      ...applicationDateFilter,
      status: PENDING_NOC_APPLICATION_STATUS,
      noc: null,
    }),

    StudentApplication.countDocuments({
      ...applicationDateFilter,
      status: { $in: FINAL_APPROVAL_STATUSES },
    }),
  ]);

  return {
    totalStudents,
    totalOrganisations,
    totalCompanies: totalOrganisations,
    totalTPOs,
    totalSPOCs,
    totalApplications,
    pendingNOCs,
    selectedApplications,
  };
};

// -----------------------------------------------------------------------------
// Monthly application and final-approval analytics
// -----------------------------------------------------------------------------

const getInternshipAnalytics = async (dateFilter) => {
  return StudentApplication.aggregate([
    {
      $match: getApplicationDateFilter(dateFilter),
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        applications: { $sum: 1 },
        selections: {
          $sum: {
            $cond: [{ $in: ["$status", FINAL_APPROVAL_STATUSES] }, 1, 0],
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
      $project: {
        _id: 0,
        month: {
          $dateToString: {
            format: "%b",
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
              },
            },
          },
        },
        year: "$_id.year",
        applications: 1,
        selections: 1,
      },
    },
  ]);
};

// -----------------------------------------------------------------------------
// Department-wise student overview
// -----------------------------------------------------------------------------

const getDepartmentOverview = async (dateFilter) => {
  const [students, selectedApplications] = await Promise.all([
    Student.find({}).select("_id department").lean(),

    StudentApplication.find({
      ...getApplicationDateFilter(dateFilter),
      status: { $in: FINAL_APPROVAL_STATUSES },
    })
      .select("student")
      .lean(),
  ]);

  const selectedStudentIds = new Set(
    selectedApplications
      .map((application) => application.student?.toString())
      .filter(Boolean),
  );

  const departments = new Map();

  for (const student of students) {
    const departmentName = student.department || "Unassigned";

    if (!departments.has(departmentName)) {
      departments.set(departmentName, {
        name: departmentName,
        students: 0,
        selected: 0,
      });
    }

    const department = departments.get(departmentName);

    department.students += 1;

    if (selectedStudentIds.has(student._id.toString())) {
      department.selected += 1;
    }
  }

  return Array.from(departments.values()).sort(
    (a, b) => b.students - a.students,
  );
};

// -----------------------------------------------------------------------------
// Applications awaiting NOC generation
// -----------------------------------------------------------------------------

const getPendingNOCs = async () => {
  const applications = await StudentApplication.find({
    status: PENDING_NOC_APPLICATION_STATUS,
    noc: null,
  })
    .populate("student", "fullName rollNumber department")
    .populate("organisation", "organisationName")
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();

  return applications.map((application) => ({
    _id: application._id,
    applicationId: application._id,

    student: application.student?.fullName || "Unknown Student",

    studentId: application.student?.rollNumber || "N/A",

    department: application.student?.department || "N/A",

    organisation: application.organisation?.organisationName || "N/A",

    submittedAt: application.createdAt,
    status: application.status,
  }));
};

// -----------------------------------------------------------------------------
// Recent activities
// -----------------------------------------------------------------------------

const getRecentActivities = async () => {
  const [applications, nocs, organisations] = await Promise.all([
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

    Organisation.find({}).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const applicationActivities = applications.map((application) => ({
    _id: application._id,
    type: "internship",
    title: "New internship application",
    description: `${
      application.student?.fullName || "A student"
    } submitted an application to ${
      application.organisation?.organisationName || "an organisation"
    }.`,
    status: application.status,
    createdAt: application.createdAt,
  }));

  const nocActivities = nocs.map((noc) => ({
    _id: noc._id,
    type: "success",
    title: noc.status === "revoked" ? "NOC revoked" : "NOC generated",
    description: `NOC for ${noc.student?.fullName || "a student"} at ${
      noc.organisation?.organisationName || "an organisation"
    } was ${noc.status}.`,
    status: noc.status,
    createdAt: noc.createdAt,
  }));

  const organisationActivities = organisations.map((organisation) => ({
    _id: organisation._id,
    type: "company",
    title: "Organisation registered",
    description: `${
      organisation.organisationName || "An organisation"
    } was added to the portal.`,
    createdAt: organisation.createdAt,
  }));

  return [...applicationActivities, ...nocActivities, ...organisationActivities]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);
};

// -----------------------------------------------------------------------------
// Main dashboard service
// -----------------------------------------------------------------------------

export const getAdminDashboard = async ({
  academicSession,
  dateRange = "12-months",
} = {}) => {
  const sessionDates = getAcademicSessionDates(academicSession);

  const dateFilter = sessionDates || getDateRange(dateRange);

  const [
    overview,
    internshipAnalytics,
    departmentOverview,
    pendingNOCs,
    recentActivities,
  ] = await Promise.all([
    getOverviewStats(dateFilter),
    getInternshipAnalytics(dateFilter),
    getDepartmentOverview(dateFilter),
    getPendingNOCs(),
    getRecentActivities(),
  ]);

  return {
    overview,
    internshipAnalytics,
    departmentOverview,
    pendingNOCs,
    recentActivities,
    filters: {
      academicSession: sessionDates ? academicSession : null,
      dateRange,
    },
  };
};
