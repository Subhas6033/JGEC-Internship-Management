import mongoose from "mongoose";

import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";

import { HTTP_STATUS } from "../../config/httpConfig.config.js";

import { StudentApplication } from "../../models/studentApplication.models.js";
import { Organisation } from "../../models/organisation.models.js";

const buildApplicationTimeline = (application) => {
  const status = application.status || "submitted";

  const submittedDate = application.createdAt || application.updatedAt || null;

  const updatedDate = application.updatedAt || application.createdAt || null;

  const formatDate = (date) => {
    if (!date) {
      return null;
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const reviewStarted = [
    "under_tpo_review",
    "approved_by_tpo",
    "under_spoc_review",
    "approved_by_spoc",
    "update_required",
    "rejected",
  ].includes(status);

  const decisionCompleted = ["approved_by_spoc", "rejected"].includes(status);

  return [
    {
      title: "Application submitted",
      description:
        "Your internship application has been submitted successfully.",
      completed: true,
      current: status === "submitted",
      date: formatDate(submittedDate),
    },
    {
      title: "Application under review",
      description:
        status === "update_required"
          ? "Your application requires changes before it can continue."
          : "Your application is being reviewed by the concerned department.",
      completed: reviewStarted,
      current: [
        "under_tpo_review",
        "approved_by_tpo",
        "under_spoc_review",
        "update_required",
      ].includes(status),
      date: reviewStarted ? formatDate(updatedDate) : null,
    },
    {
      title: "Final decision",
      description:
        status === "approved_by_spoc"
          ? "Your internship application has been approved."
          : status === "rejected"
            ? "Your internship application has been rejected."
            : status === "update_required"
              ? "Please update your application and submit it again."
              : "A final decision will appear here once the review is complete.",
      completed: decisionCompleted,
      current: decisionCompleted,
      date: decisionCompleted ? formatDate(updatedDate) : null,
    },
  ];
};

const submitStudentApplication = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Student authentication is required",
    );
  }

  const {
    semester,
    organisation,
    organisationsEmployye,
    designation,
    tentativeStartDate,
    tentativeEndDate,
    tentativeWorkLocations,
    modeOfInternship,
    internshipType,
    description,
  } = req.body;

  if (semester === undefined || semester === null || semester === "") {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Semester is required");
  }

  const parsedSemester = Number(semester);

  if (
    !Number.isInteger(parsedSemester) ||
    parsedSemester < 1 ||
    parsedSemester > 8
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Semester must be an integer between 1 and 8",
    );
  }

  if (!organisation) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Organisation is required");
  }

  if (!mongoose.Types.ObjectId.isValid(organisation)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid organisation");
  }

  const organisationExists = await Organisation.findById(organisation);

  if (!organisationExists) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Organisation not found");
  }

  if (!organisationsEmployye || !organisationsEmployye.trim()) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Organisation employee/contact name is required",
    );
  }

  if (!designation || !designation.trim()) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Designation is required");
  }

  if (
    !Array.isArray(tentativeWorkLocations) ||
    tentativeWorkLocations.length === 0
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "At least one tentative work location is required",
    );
  }

  const cleanedWorkLocations = tentativeWorkLocations
    .map((location) => String(location).trim())
    .filter(Boolean);

  if (cleanedWorkLocations.length === 0) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "At least one valid work location is required",
    );
  }

  const allowedModes = ["onsite", "remote", "hybrid"];

  if (!allowedModes.includes(modeOfInternship)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid mode of internship");
  }

  const allowedInternshipTypes = [
    "summer",
    "winter",
    "semester",
    "fulltime",
    "others",
  ];

  if (!allowedInternshipTypes.includes(internshipType)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid internship type");
  }

  if (!tentativeStartDate || !tentativeEndDate) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Internship start date and end date are required",
    );
  }

  const startDate = new Date(tentativeStartDate);
  const endDate = new Date(tentativeEndDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid internship dates");
  }

  if (endDate < startDate) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Internship end date cannot be before start date",
    );
  }

  const activeStatuses = [
    "submitted",
    "under_tpo_review",
    "approved_by_tpo",
    "under_spoc_review",
    "approved_by_spoc",
  ];

  const existingActiveApplication = await StudentApplication.findOne({
    student: studentId,
    organisation,
    status: {
      $in: activeStatuses,
    },
  });

  if (existingActiveApplication) {
    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      "You already have an active application for this organisation",
    );
  }

  const updateRequiredApplication = await StudentApplication.findOne({
    student: studentId,
    organisation,
    status: "update_required",
  });

  let application;

  if (updateRequiredApplication) {
    updateRequiredApplication.semester = parsedSemester;

    updateRequiredApplication.organisationsEmployye =
      organisationsEmployye.trim();

    updateRequiredApplication.designation = designation.trim();

    updateRequiredApplication.tentativeStartDate = startDate;

    updateRequiredApplication.tentativeEndDate = endDate;

    updateRequiredApplication.tentativeWorkLocations = cleanedWorkLocations;

    updateRequiredApplication.modeOfInternship = modeOfInternship;

    updateRequiredApplication.internshipType = internshipType;

    updateRequiredApplication.description = description?.trim() || "";

    updateRequiredApplication.status = "submitted";

    updateRequiredApplication.updateRequiredReason = "";

    updateRequiredApplication.updateRequiredBy = null;

    application = await updateRequiredApplication.save();
  } else {
    application = await StudentApplication.create({
      student: studentId,

      semester: parsedSemester,

      organisation,

      organisationsEmployye: organisationsEmployye.trim(),

      designation: designation.trim(),

      tentativeStartDate: startDate,

      tentativeEndDate: endDate,

      tentativeWorkLocations: cleanedWorkLocations,

      modeOfInternship,

      internshipType,

      description: description?.trim() || "",

      status: "submitted",

      updateRequiredReason: "",

      updateRequiredBy: null,
    });
  }

  await application.populate([
    {
      path: "organisation",
    },
    {
      path: "student",
    },
  ]);

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new APIRES(
        HTTP_STATUS.CREATED,
        application,
        updateRequiredApplication
          ? "Student application resubmitted successfully"
          : "Student application submitted successfully",
      ),
    );
});

const getMyStudentApplications = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Student authentication is required",
    );
  }

  const {
    search = "",
    status = "all",
    type = "all",
    sort = "newest",
  } = req.query;

  const baseMatch = {
    student: new mongoose.Types.ObjectId(studentId),
  };

  if (status && status !== "all") {
    baseMatch.status = status;
  }

  if (type && type !== "all") {
    baseMatch.internshipType = type;
  }

  const searchText = search.trim();

  const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const searchRegex = searchText ? new RegExp(escapedSearch, "i") : null;

  const pipeline = [
    {
      $match: baseMatch,
    },
    {
      $lookup: {
        from: "organisations",
        localField: "organisation",
        foreignField: "_id",
        as: "organisation",
      },
    },
    {
      $unwind: {
        path: "$organisation",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (searchRegex) {
    pipeline.push({
      $match: {
        $or: [
          {
            designation: searchRegex,
          },
          {
            organisationsEmployye: searchRegex,
          },
          {
            "organisation.organisationName": searchRegex,
          },
          {
            "organisation.organisationMail": searchRegex,
          },
          {
            "organisation.organisationLocation": searchRegex,
          },
        ],
      },
    });
  }

  if (sort === "oldest") {
    pipeline.push({
      $sort: {
        createdAt: 1,
      },
    });
  } else if (sort === "company") {
    pipeline.push({
      $sort: {
        "organisation.organisationName": 1,
        createdAt: -1,
      },
    });
  } else {
    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });
  }

  pipeline.push({
    $project: {
      _id: 1,

      student: 1,

      semester: 1,

      organisationsEmployye: 1,

      designation: 1,

      tentativeStartDate: 1,

      tentativeEndDate: 1,

      tentativeWorkLocations: 1,

      modeOfInternship: 1,

      internshipType: 1,

      description: 1,

      status: 1,

      createdAt: 1,

      updatedAt: 1,

      updateRequiredReason: 1,

      updateRequiredBy: 1,

      organisation: {
        _id: "$organisation._id",

        organisationName: "$organisation.organisationName",

        organisationSite: "$organisation.organisationSite",

        organisationMail: "$organisation.organisationMail",

        organisationLocation: "$organisation.organisationLocation",
      },
    },
  });

  const applications = await StudentApplication.aggregate(pipeline);

  const formattedApplications = applications.map((application) => ({
    id: application._id.toString(),

    company:
      application.organisation?.organisationName || "Unknown organisation",

    role: application.designation || "Internship",

    status: application.status || "submitted",

    type: application.internshipType || "",

    submittedAt: application.createdAt || null,

    location:
      application.tentativeWorkLocations?.[0] ||
      application.organisation?.organisationLocation ||
      "Not specified",

    workLocations: application.tentativeWorkLocations || [],

    mode: application.modeOfInternship || "Not specified",

    employee: application.organisationsEmployye || "",

    semester: application.semester,

    designation: application.designation,

    startDate: application.tentativeStartDate,

    endDate: application.tentativeEndDate,

    description: application.description || "",

    updateRequiredReason:
      application.status === "update_required"
        ? application.updateRequiredReason || ""
        : "",

    updateRequiredBy:
      application.status === "update_required"
        ? application.updateRequiredBy || null
        : null,

    organisation: application.organisation
      ? {
          id: application.organisation._id,

          name: application.organisation.organisationName,

          website: application.organisation.organisationSite,

          email: application.organisation.organisationMail,

          location: application.organisation.organisationLocation,
        }
      : null,

    timeline: buildApplicationTimeline(application),
  }));

  const statsResult = await StudentApplication.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
      },
    },
    {
      $group: {
        _id: null,

        total: {
          $sum: 1,
        },

        pending: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$status",
                  [
                    "submitted",
                    "under_tpo_review",
                    "approved_by_tpo",
                    "under_spoc_review",
                  ],
                ],
              },
              1,
              0,
            ],
          },
        },

        approved: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "approved_by_spoc"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const stats = statsResult[0] || {
    total: 0,
    pending: 0,
    approved: 0,
  };

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        applications: formattedApplications,

        stats: {
          total: stats.total,

          pending: stats.pending,

          approved: stats.approved,
        },
      },
      "Student applications fetched successfully",
    ),
  );
});

export { submitStudentApplication, getMyStudentApplications };
