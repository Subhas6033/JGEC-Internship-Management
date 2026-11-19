const FALLBACK = "N/A";

const extractApplications = (data) =>
  Array.isArray(data) ? data : (data?.applications ?? []);

const formatDate = (value) => {
  if (!value) return FALLBACK;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return FALLBACK;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const mapApplication = (application) => {
  const organisation = application.organisation ?? {};
  const student = application.student ?? {};
  const noc = application.noc ?? {};

  const referenceNumber =
    noc.referenceNumber || application.nocReference || FALLBACK;

  return {
    id: application._id,
    studentId: student._id || student.id || application._id,
    studentName: student.fullName || student.name || "Unknown Student",
    rollNumber: student.rollNumber || student.rollNo || FALLBACK,
    department: student.department || student.departmentCode || FALLBACK,
    company:
      organisation.organisationName ||
      organisation.name ||
      organisation.companyName ||
      "Unknown Company",
    location:
      organisation.organisationLocation ||
      organisation.location ||
      organisation.city ||
      "Location not available",
    referenceNumber,
    fileName:
      noc.fileName ||
      `NOC-${referenceNumber === FALLBACK ? application._id : referenceNumber}.pdf`,
    approvedAt: application.approvedAt || application.updatedAt || null,
    generatedAt:
      noc.generatedAt ||
      noc.createdAt ||
      application.nocGeneratedAt ||
      application.updatedAt ||
      null,
  };
};

const toNocRecords = (data, status) =>
  extractApplications(data)
    .filter((application) => application.status === status)
    .map(mapApplication);

const openPdfInNewTab = (blob) => {
  const pdf =
    blob.type === "application/pdf"
      ? blob
      : new Blob([blob], { type: "application/pdf" });

  const url = URL.createObjectURL(pdf);
  const link = document.createElement("a");

  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  document.body.appendChild(link);
  link.click();
  link.remove();

  // The new tab needs the URL to stay valid while the PDF loads.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

export {
  formatDate,
  getErrorMessage,
  mapApplication,
  openPdfInNewTab,
  toNocRecords,
};
