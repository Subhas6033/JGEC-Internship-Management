import mongoose from "mongoose";
import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { StudentApplication } from "../../models/studentApplication.models.js";
import { Organisation } from "../../models/organisation.models.js";

const submitStudentApplication = asyncHandler(async (req, res) => {
  const studentId = req.student?._id;

  if (!studentId) {
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

  //   Required fields validations
  if (
    semester === undefined ||
    !organisation ||
    !organisationsEmployye?.trim() ||
    !designation?.trim() ||
    !tentativeStartDate ||
    !tentativeEndDate ||
    !tentativeWorkLocations ||
    !modeOfInternship ||
    !internshipType
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide all required application fields",
    );
  }

  // Validate organisation ID
  if (!mongoose.Types.ObjectId.isValid(organisation)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid organisation");
  }

  // Validate semester
  const parsedSemester = Number(semester);

  if (
    !Number.isInteger(parsedSemester) ||
    parsedSemester < 1 ||
    parsedSemester > 8
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Semester must be between 1 and 8",
    );
  }

  //  Validate tentative work locations
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
      "At least one valid tentative work location is required",
    );
  }

  // Validate internship mode
  const allowedInternshipModes = ["onsite", "remote", "hybrid"];

  if (!allowedInternshipModes.includes(modeOfInternship)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid internship mode");
  }

  // Validate the internship types
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

  // Validate internship date
  const startDate = new Date(tentativeStartDate);
  const endDate = new Date(tentativeEndDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide valid internship dates",
    );
  }

  if (endDate < startDate) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Internship end date cannot be before start date",
    );
  }

  /*
   * Verify that the organisation exists.
   *
   * Organisation information comes from the backend.
   * The student does not control organisation details.
   */
  const organisationExists = await Organisation.findById(organisation);

  if (!organisationExists) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Organisation not found");
  }

  /*
   * Check whether the student already has an active
   * application for this organisation.
   *
   * approved_by_spoc is also considered active because
   * the NOC still has to be generated/admin reviewed.
   */
  const existingApplication = await StudentApplication.findOne({
    student: studentId,
    organisation,
    status: {
      $in: [
        "submitted",
        "under_tpo_review",
        "approved_by_tpo",
        "under_spoc_review",
        "approved_by_spoc",
      ],
    },
  });

  if (existingApplication) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "You already have an active application for this organisation",
    );
  }

  /*
   * If the application was sent back by TPO/SPOC for correction,
   * update the existing application and submit it again.
   */
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

    updateRequiredApplication.description = description?.trim() || "";

    /*
     * Once the student resubmits the corrected application,
     * it starts the review workflow again.
     */
    updateRequiredApplication.status = "submitted";

    /*
     * Remove the old update request reason.
     */
    updateRequiredApplication.updateRequiredReason = "";

    application = await updateRequiredApplication.save();
  } else {
    /*
     * Create a completely new application.
     */
    application = await StudentApplication.create({
      student: studentId,
      semester: parsedSemester,
      organisation,
      organisationsEmployye: organisationsEmployye.trim(),
      designation: designation.trim(),
      tentativeStartDate: startDate,
      tentativeEndDate: endDate,
      tentativeWorkLocations: cleanedWorkLocations,
      internshipType,
      modeOfInternship,
      description: description?.trim() || "",
      status: "submitted",
    });
  }

  /*
   * Populate the application for the response.
   *
   * Student signature is included because it will be required
   * later when generating the NOC.
   */
  const populatedApplication = await StudentApplication.findById(
    application._id,
  )
    .populate(
      "organisation",
      "organisationName organisationSite organisationLocation organisationMail",
    )
    .populate(
      "student",
      "fullName email mobileNumber rollNumber department signature",
    );

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new APIRES(
        HTTP_STATUS.CREATED,
        populatedApplication,
        "Internship application submitted successfully",
      ),
    );
});

export { submitStudentApplication };
