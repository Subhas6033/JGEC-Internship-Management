import mongoose from "mongoose";

import { StudentApplication } from "../../models/studentApplication.models.js";
import { Student } from "../../models/students.models.js";
import { Organisation } from "../../models/organisation.models.js";

import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";

import { createApplicationNotification } from "../students/studentNotification.service.js";

/* -------------------------------------------------------------------------- */
/* GET TPO APPLICATION BY ID                                                  */
/* -------------------------------------------------------------------------- */

const getTpoApplicationById = async ({ applicationId, user }) => {
  if (!user?._id) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Authenticated user not found");
  }

  if (!applicationId) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Application ID is required");
  }

  if (!user.department) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Department is not associated with this TPO",
    );
  }

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid application ID");
  }

  const application = await StudentApplication.findById(applicationId)
    .populate({
      path: "student",
      select:
        "fullName email mobileNumber rollNumber department signature gurdianName gurdianMobile role",
    })
    .populate({
      path: "organisation",
      select:
        "organisationName organisationSite organisationLocation organisationMail",
    })
    .lean();

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student application not found");
  }

  /* TPO can only access applications from their department. */
  if (application.student?.department !== user.department) {
    throw new APIERR(
      HTTP_STATUS.FORBIDDEN,
      "You are not authorized to access this application",
    );
  }

  return application;
};

/* -------------------------------------------------------------------------- */
/* GET TPO APPLICATIONS                                                       */
/* -------------------------------------------------------------------------- */

const getTpoApplications = async ({ user, search = "", status }) => {
  if (!user?._id) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Authenticated user not found");
  }

  if (!user.department) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Department is not associated with this TPO",
    );
  }

  const students = await Student.find({
    department: user.department,
  })
    .select("_id")
    .lean();

  const studentIds = students.map((student) => student._id);

  const filter = {
    student: {
      $in: studentIds,
    },
  };

  if (status && status !== "all") {
    filter.status = status;
  }

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");

    const matchingStudents = await Student.find({
      _id: {
        $in: studentIds,
      },
      $or: [
        {
          fullName: regex,
        },
        {
          email: regex,
        },
        {
          rollNumber: regex,
        },
        {
          department: regex,
        },
      ],
    })
      .select("_id")
      .lean();

    const matchingStudentIds = matchingStudents.map((student) => student._id);

    const matchingOrganisations = await Organisation.find({
      $or: [
        {
          organisationName: regex,
        },
        {
          organisationLocation: regex,
        },
        {
          organisationMail: regex,
        },
        {
          organisationSite: regex,
        },
      ],
    })
      .select("_id")
      .lean();

    const matchingOrganisationIds = matchingOrganisations.map(
      (organisation) => organisation._id,
    );

    filter.$or = [
      {
        student: {
          $in: matchingStudentIds,
        },
      },
      {
        organisation: {
          $in: matchingOrganisationIds,
        },
      },
      {
        designation: regex,
      },
      {
        organisationsEmployye: regex,
      },
      {
        modeOfInternship: regex,
      },
      {
        internshipType: regex,
      },
      {
        tentativeWorkLocations: regex,
      },
    ];
  }

  return StudentApplication.find(filter)
    .populate({
      path: "student",
      select:
        "fullName email mobileNumber rollNumber department signature gurdianName gurdianMobile role",
    })
    .populate({
      path: "organisation",
      select:
        "organisationName organisationSite organisationLocation organisationMail",
    })
    .sort({
      createdAt: -1,
    })
    .lean();
};

/* -------------------------------------------------------------------------- */
/* ACCEPT TPO APPLICATION                                                     */
/* -------------------------------------------------------------------------- */

const acceptStudentApplication = async ({ applicationId, tpoId }) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid application ID");
  }

  if (!mongoose.Types.ObjectId.isValid(tpoId)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid TPO ID");
  }

  const application = await StudentApplication.findById(applicationId);

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student application not found");
  }

  /*
   * TPO can accept only applications currently
   * waiting for TPO review.
   */
  if (
    application.status !== "submitted" &&
    application.status !== "under_tpo_review"
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      `Application cannot be accepted from status "${application.status}"`,
    );
  }

  /*
   * IMPORTANT:
   *
   * TPO acceptance produces approved_by_tpo.
   *
   * SPOC will now see this application.
   */
  application.status = "approved_by_tpo";

  application.tpoReviewedBy = tpoId;
  application.tpoReviewedAt = new Date();

  application.updateRequiredReason = "";
  application.updateRequiredBy = null;

  application.rejectionReason = "";
  application.rejectedBy = null;

  await application.save();

  /* ---------------------------------------------------------------------- */
  /* STUDENT NOTIFICATION                                                   */
  /* ---------------------------------------------------------------------- */

  await createApplicationNotification({
    application: application._id,
    student: application.student,
    actor: tpoId,
    actorRole: "tpo",
    type: "tpo_accepted",
  });

  return StudentApplication.findById(application._id)
    .populate("student")
    .populate("organisation");
};

/* -------------------------------------------------------------------------- */
/* SEND APPLICATION BACK                                                     */
/* -------------------------------------------------------------------------- */

const sendStudentApplicationBack = async ({ applicationId, tpoId, reason }) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid application ID");
  }

  if (!mongoose.Types.ObjectId.isValid(tpoId)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid TPO ID");
  }

  if (!reason?.trim()) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "A reason is required when sending an application back",
    );
  }

  const application = await StudentApplication.findById(applicationId);

  if (!application) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student application not found");
  }

  /*
   * TPO can send back only applications currently
   * waiting for TPO review.
   */
  if (
    application.status !== "submitted" &&
    application.status !== "under_tpo_review"
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      `Application cannot be sent back from status "${application.status}"`,
    );
  }

  application.status = "update_required";

  application.updateRequiredReason = reason.trim();

  application.updateRequiredBy = "tpo";

  application.tpoReviewedBy = tpoId;
  application.tpoReviewedAt = new Date();

  await application.save();

  /* ---------------------------------------------------------------------- */
  /* STUDENT NOTIFICATION                                                   */
  /* ---------------------------------------------------------------------- */

  await createApplicationNotification({
    application: application._id,
    student: application.student,
    actor: tpoId,
    actorRole: "tpo",
    type: "tpo_update_required",
  });

  return StudentApplication.findById(application._id)
    .populate("student")
    .populate("organisation");
};

export {
  getTpoApplications,
  getTpoApplicationById,
  acceptStudentApplication,
  sendStudentApplicationBack,
};
