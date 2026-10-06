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

// Format date for excel
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

// Convert applications status into a readable text
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

// Convert one applications into excel row
const transformApplication = (application, index) => {
  const student = application?.student;
  const organisation = application?.organisation;
  const studentName =
    getValue(student, ["name", "fullName", "studentName", "user.name"]) || "";
  const studentId =
    getValue(student, [
      "studentId",
      "rollNumber",
      "registrationNumber",
      "userId",
    ]) || "";
  const studentEmail = getValue(student, ["email", "user.email"]) || "";
  const organisationName =
    getValue(organisation, ["name", "organisationName", "companyName"]) || "";
  const organisationEmail =
    getValue(organisation, ["email", "contactEmail"]) || "";
  const organisationEmployee =
    application?.organisationsEmployyee ||
    application?.organisationsEmployee ||
    "";
  const workLocations = Array.isArray(application?.tentativeWorkLocations)
    ? application.tentativeWorkLocations.join(", ")
    : application?.tentativeWorkLocations || "";
  const nocGenerated =
    application?.nocGenerated === true ||
    application?.nocStatus === "generated" ||
    application?.status === "noc_generated";
  return {
    "Sl. No.": index + 1,
    "Application ID": application?._id || "",
    "Student Name": studentName,
    "Student ID": studentId,
    "Student Email": studentEmail,
    Semester: application?.semester || "",
    Organisation: organisationName,
    "Organisation Contact": organisationEmployee,
    "Organisation Email": organisationEmail,
    Designation: application?.designation || "",
    "Internship Type": application?.internshipType || "",
    "Mode of Internship": application?.modeOfInternship || "",
    "Work Location": workLocations,
    "Tentative Start Date": formatDate(application?.tentativeStartDate),
    "Tentative End Date": formatDate(application?.tentativeEndDate),
    Status: formatStatus(application?.status),
    "Update Required Reason": application?.updateRequiredReason || "",
    "Update Required By": application?.updateRequiredBy || "",
    "NOC Generated": nocGenerated ? "Yes" : "No",
    "NOC Status": application?.nocStatus || "",
    "NOC Number": application?.nocNumber || "",
    "NOC Generated At": formatDate(application?.nocGeneratedAt),
    "Submitted At": formatDate(application?.submittedAt),
    "Created At": formatDate(application?.createdAt),
    "Updated At": formatDate(application?.updatedAt),
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
            "Student Name": "",
            "Student ID": "",
            "Student Email": "",
            Semester: "",
            Organisation: "",
            Status: "",
            "NOC Generated": "",
          },
        ];

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  // Set readable column rows
  worksheet["!cols"] = [
    { wch: 8 },
    { wch: 26 },
    { wch: 24 },
    { wch: 18 },
    { wch: 30 },
    { wch: 12 },
    { wch: 30 },
    { wch: 24 },
    { wch: 30 },
    { wch: 22 },
    { wch: 25 },
    { wch: 30 },
    { wch: 24 },
    { wch: 22 },
    { wch: 22 },
    { wch: 25 },
    { wch: 30 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];

  // Freeze the header row
  worksheet["!freeze"] = {
    xSplit: 0,
    ySplit: 1,
  };
  // Summary sheet
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
    [],
    ["Generated On", new Date().toLocaleString("en-IN")],
  ];
  const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
  summaryWorksheet["!cols"] = [{ wch: 25 }, { wch: 40 }];
  //  Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Report Summary");

  // File name generations
  const yearPart = year !== "all" ? year : "all-years";
  const semesterPart = semester !== "all" ? `sem-${semester}` : "all-semesters";
  const datePart = new Date().toISOString().slice(0, 10);
  const fileName = `TPO-Internship-Applications-${yearPart}-${semesterPart}-${datePart}.xlsx`;
  //   download
  XLSX.writeFile(workbook, fileName);
};
