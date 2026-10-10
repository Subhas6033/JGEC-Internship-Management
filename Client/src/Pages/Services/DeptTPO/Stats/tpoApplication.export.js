import * as XLSX from "xlsx";

// Safely get a nested value
const getValue = (object, paths = []) => {
  for (const path of paths) {
    const value = path
      .split(".")
      .reduce((current, key) => current?.[key], object);
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return "";
};

// Format date for Excel
const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Format date and time for Excel
const formatDateTime = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Format application status
const formatStatus = (status) => {
  if (!status) {
    return "";
  }

  const statusMap = {
    draft: "Draft",
    submitted: "Submitted",
    under_tpo_review: "Under TPO Review",
    update_required: "Update Required",
    approved_by_tpo: "Approved by TPO",
    under_spoc_review: "Under SPOC Review",
    approved_by_spoc: "Approved by SPOC",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    noc_generated: "NOC Generated",
  };

  return (
    statusMap[status] ||
    String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
};

// Format internship mode
const formatInternshipMode = (mode) => {
  if (!mode) {
    return "";
  }

  const modeMap = {
    onsite: "Onsite",
    remote: "Remote",
    hybrid: "Hybrid",
  };

  return (
    modeMap[mode] ||
    String(mode)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
};

// Format internship type
const formatInternshipType = (type) => {
  if (!type) {
    return "";
  }

  return String(type)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

// Convert one application into Excel row
const transformApplication = (application, index) => {
  const student = application?.student || {};
  const organisation = application?.organisation || {};
  const noc = application?.noc || {};
  // Student Informations
  const studentId =
    student?._id ||
    getValue(student, ["studentId", "userId", "registrationNumber"]) ||
    "";
  const studentName =
    getValue(student, ["fullName", "name", "studentName", "user.name"]) || "";
  const studentEmail = getValue(student, ["email", "user.email"]) || "";
  const studentMobile =
    getValue(student, ["mobileNumber", "mobile", "phoneNumber", "phone"]) || "";
  const studentRollNumber = student?.rollNumber || "";
  const studentDepartment = student?.department || "";
  const studentSignature = student?.signature || "";
  const studentGuardianName =
    getValue(student, ["guardianName", "gurdianName"]) || "";
  const studentGuardianMobile =
    getValue(student, ["guardianMobile", "gurdianMobile"]) || "";
  const studentRole = student?.role || "";

  // Organisations Informations
  const organisationId = organisation?._id || "";
  const organisationName = organisation?.organisationName || "";
  const organisationLocation = organisation?.organisationLocation || "";
  const organisationMail = organisation?.organisationMail || "";
  const organisationSite = organisation?.organisationSite || "";
  // Applications Informations
  const workLocations = Array.isArray(application?.tentativeWorkLocations)
    ? application.tentativeWorkLocations.join(", ")
    : application?.tentativeWorkLocations || "";
  const nocGenerated =
    application?.status === "noc_generated" ||
    application?.nocGenerated === true ||
    application?.nocStatus === "generated" ||
    noc?.status === "generated";
  // NOC Informations
  const nocId = noc?._id || "";
  const nocApplicationId = noc?.application || "";
  const nocStudentId = noc?.student || "";
  const nocOrganisationId = noc?.organisation || "";
  const nocReferenceNumber = noc?.referenceNumber || "";
  const nocGeneratedBy = noc?.generatedBy || "";
  const nocAcademicYear = noc?.academicYear ?? "";
  const nocDepartment = noc?.department || "";
  const nocFileName = noc?.fileName || "";
  const nocFilePath = noc?.filePath || "";
  const nocFileUrl = noc?.fileUrl || "";
  const nocFileMimeType = noc?.fileMimeType || "";
  const nocFileSize = noc?.fileSize ?? "";

  /*
   * Older NOC records can contain Cloudinary fields.
   * Keep them in the Excel export because they exist
   * in the actual API response.
   */
  const nocFilePublicId = noc?.filePublicId || "";
  const nocFileResourceType = noc?.fileResourceType || "";
  const nocStatus = noc?.status || "";
  const nocRevokedAt = noc?.revokedAt || "";
  const nocRevokeReason = noc?.revokeReason || "";

  return {
    // Basic Applications informations
    "Sl. No.": index + 1,
    "Application ID": application?._id || "",
    "Application Version": application?.__v ?? "",
    // Students Informations
    "Student ID": studentId,
    "Student Name": studentName,
    "Student Email": studentEmail,
    "Student Mobile Number": studentMobile,
    "Student Roll Number": studentRollNumber,
    "Student Department": studentDepartment,
    "Student Signature": studentSignature,
    "Student Guardian Name": studentGuardianName,
    "Student Guardian Mobile": studentGuardianMobile,
    "Student Role": studentRole,
    "Student Created At": formatDateTime(student?.createdAt),
    "Student Updated At": formatDateTime(student?.updatedAt),
    "Student Version": student?.__v ?? "",
    // Academci Informations
    Semester: application?.semester ?? "",
    // Organisations informations
    "Organisation ID": organisationId,
    "Organisation Name": organisationName,
    "Organisation Location": organisationLocation,
    "Organisation Email": organisationMail,
    "Organisation Website": organisationSite,
    "Organisation Version": organisation?.__v ?? "",
    "Organisation Created At": formatDateTime(organisation?.createdAt),
    "Organisation Updated At": formatDateTime(organisation?.updatedAt),
    // Internship Informations
    "Organisation Employee":
      application?.organisationsEmployye ||
      application?.organisationsEmployee ||
      "",
    Designation: application?.designation || "",
    "Tentative Start Date": formatDate(application?.tentativeStartDate),
    "Tentative Start Date & Time": formatDateTime(
      application?.tentativeStartDate,
    ),
    "Tentative End Date": formatDate(application?.tentativeEndDate),
    "Tentative End Date & Time": formatDateTime(application?.tentativeEndDate),
    "Work Locations": workLocations,
    "Mode of Internship": formatInternshipMode(application?.modeOfInternship),
    "Internship Type": formatInternshipType(application?.internshipType),
    Description: application?.description || "",
    // Applications Status
    Status: formatStatus(application?.status),
    "Raw Status": application?.status || "",
    "Update Required Reason": application?.updateRequiredReason || "",
    "Update Required By": application?.updateRequiredBy || "",
    "Rejection Reason": application?.rejectionReason || "",
    "Rejected By": application?.rejectedBy || "",
    // TPO review
    "TPO Reviewed By": application?.tpoReviewedBy || "",
    "TPO Reviewed At": formatDateTime(application?.tpoReviewedAt),
    // SPOC Review
    "SPOC Reviewed By": application?.spocReviewedBy || "",
    "SPOC Reviewed At": formatDateTime(application?.spocReviewedAt),
    // NOC applications Status
    "NOC Generated": nocGenerated ? "Yes" : "No",
    "NOC Generated At": formatDateTime(application?.nocGeneratedAt),
    // NOC Details
    "NOC ID": nocId,
    "NOC Application ID": nocApplicationId,
    "NOC Student ID": nocStudentId,
    "NOC Organisation ID": nocOrganisationId,
    "NOC Reference Number": nocReferenceNumber,
    "NOC Generated By": nocGeneratedBy,
    "NOC Generated At": formatDateTime(
      noc?.generatedAt || application?.nocGeneratedAt,
    ),
    "NOC Academic Year": nocAcademicYear,
    "NOC Department": nocDepartment,
    // Local Storage Details
    "NOC File Name": nocFileName,
    "NOC File Path": nocFilePath,
    "NOC File URL": nocFileUrl,
    "NOC File MIME Type": nocFileMimeType,
    "NOC File Size (Bytes)": nocFileSize,
    // Legacy NOC Cloudinary Storage
    "NOC File Public ID": nocFilePublicId,
    "NOC File Resource Type": nocFileResourceType,
    // NOC Status
    "NOC Status": nocStatus,
    "NOC Revoked At": formatDateTime(nocRevokedAt),
    "NOC Revoke Reason": nocRevokeReason,
    // NOC DB MetaData
    "NOC Created At": formatDateTime(noc?.createdAt),
    "NOC Updated At": formatDateTime(noc?.updatedAt),
    "NOC Version": noc?.__v ?? "",
    // Applications DB MetaData
    "Application Created At": formatDateTime(application?.createdAt),
    "Application Updated At": formatDateTime(application?.updatedAt),
  };
};

/**
 * Download TPO application data as Excel.
 *
 * The exported data is the data currently visible
 * after search/year/semester/status filtering.
 */
export const downloadTpoApplicationsExcel = ({
  applications = [],
  year = "all",
  semester = "all",
  status = "all",
  search = "",
}) => {
  if (!Array.isArray(applications)) {
    throw new Error("Invalid application data");
  }
  const rows = applications.map(transformApplication);
  const worksheetData =
    rows.length > 0
      ? rows
      : [
          {
            "Sl. No.": "",
            "Application ID": "",
            "Student ID": "",
            "Student Name": "",
            "Student Email": "",
            "Student Mobile Number": "",
            "Student Roll Number": "",
            "Student Department": "",
            Semester: "",
            "Organisation ID": "",
            "Organisation Name": "",
            "Organisation Location": "",
            "Organisation Email": "",
            "Organisation Website": "",
            Designation: "",
            "Internship Type": "",
            "Mode of Internship": "",
            "Work Locations": "",
            Status: "",
            "NOC Generated": "",
            "NOC ID": "",
            "NOC Reference Number": "",
            "NOC File Name": "",
            "NOC File Path": "",
            "NOC File URL": "",
            "NOC File MIME Type": "",
            "NOC File Size (Bytes)": "",
          },
        ];

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  // Set the Cloumns Width
  worksheet["!cols"] = [
    { wch: 8 }, // Sl. No.
    { wch: 30 }, // Application ID
    { wch: 30 }, // Student ID
    { wch: 25 }, // Student Name
    { wch: 35 }, // Student Email
    { wch: 22 }, // Student Mobile
    { wch: 22 }, // Student Roll Number
    { wch: 20 }, // Student Department
    { wch: 12 }, // Semester
    { wch: 30 }, // Student Signature
    { wch: 25 }, // Guardian Name
    { wch: 25 }, // Guardian Mobile
    { wch: 18 }, // Student Role
    { wch: 25 }, // Student Created
    { wch: 25 }, // Student Updated
    { wch: 16 }, // Student Version
    { wch: 14 }, // Semester
    { wch: 30 }, // Organisation ID
    { wch: 40 }, // Organisation Name
    { wch: 30 }, // Organisation Location
    { wch: 35 }, // Organisation Email
    { wch: 45 }, // Organisation Website
    { wch: 18 }, // Organisation Version
    { wch: 25 }, // Organisation Created
    { wch: 25 }, // Organisation Updated
    { wch: 28 }, // Organisation Employee
    { wch: 25 }, // Designation
    { wch: 22 }, // Start Date
    { wch: 30 }, // Start Date Time
    { wch: 22 }, // End Date
    { wch: 30 }, // End Date Time
    { wch: 35 }, // Work Locations
    { wch: 22 }, // Mode
    { wch: 22 }, // Internship Type
    { wch: 50 }, // Description
    { wch: 25 }, // Status
    { wch: 25 }, // Raw Status
    { wch: 40 }, // Update Reason
    { wch: 25 }, // Update By
    { wch: 40 }, // Rejection Reason
    { wch: 25 }, // Rejected By
    { wch: 30 }, // TPO Reviewed By
    { wch: 28 }, // TPO Reviewed At
    { wch: 30 }, // SPOC Reviewed By
    { wch: 28 }, // SPOC Reviewed At
    { wch: 18 }, // NOC Generated
    { wch: 28 }, // NOC Generated At
    { wch: 30 }, // NOC ID
    { wch: 30 }, // NOC Application ID
    { wch: 30 }, // NOC Student ID
    { wch: 32 }, // NOC Organisation ID
    { wch: 35 }, // NOC Reference
    { wch: 30 }, // NOC Generated By
    { wch: 28 }, // NOC Generated At
    { wch: 18 }, // Academic Year
    { wch: 20 }, // NOC Department
    { wch: 45 }, // NOC File Name
    { wch: 70 }, // NOC File Path
    { wch: 70 }, // NOC File URL
    { wch: 28 }, // MIME Type
    { wch: 22 }, // File Size
    { wch: 55 }, // Public ID
    { wch: 22 }, // Resource Type
    { wch: 22 }, // NOC Status
    { wch: 28 }, // Revoked At
    { wch: 40 }, // Revoke Reason
    { wch: 28 }, // NOC Created
    { wch: 28 }, // NOC Updated
    { wch: 16 }, // NOC Version
    { wch: 28 }, // Application Created
    { wch: 28 }, // Application Updated
  ];

  // Freeze the Header
  worksheet["!freeze"] = {
    xSplit: 0,
    ySplit: 1,
  };
  // Summary Sheet in other tab
  const nocGeneratedCount = applications.filter(
    (application) =>
      application?.status === "noc_generated" ||
      application?.noc?.status === "generated",
  ).length;

  const tpoApprovedCount = applications.filter(
    (application) => application?.status === "approved_by_tpo",
  ).length;

  const spocApprovedCount = applications.filter(
    (application) => application?.status === "approved_by_spoc",
  ).length;

  const rejectedCount = applications.filter(
    (application) => application?.status === "rejected",
  ).length;

  const summaryData = [
    ["TPO Internship Application Report"],
    [],
    ["Filter", "Selected Value"],
    ["Year", year === "all" ? "All Years" : year],
    ["Semester", semester === "all" ? "All Semesters" : `Semester ${semester}`],
    ["Status", status === "all" ? "All Statuses" : formatStatus(status)],
    ["Search", search || "None"],
    [],
    ["Total Applications", applications.length],
    ["NOC Generated Applications", nocGeneratedCount],
    ["Approved by TPO", tpoApprovedCount],
    ["Approved by SPOC", spocApprovedCount],
    ["Rejected Applications", rejectedCount],
    [],
    ["Generated On", new Date().toLocaleString("en-IN")],
  ];

  const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
  summaryWorksheet["!cols"] = [{ wch: 35 }, { wch: 50 }];
  // Create the Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Report Summary");
  // Generate the File Name
  const yearPart = year !== "all" ? year : "all-years";
  const semesterPart = semester !== "all" ? `sem-${semester}` : "all-semesters";
  const datePart = new Date().toISOString().slice(0, 10);
  const fileName = `TPO-Internship-Applications-${yearPart}-${semesterPart}-${datePart}.xlsx`;
  // Download the excel file
  XLSX.writeFile(workbook, fileName);
};
