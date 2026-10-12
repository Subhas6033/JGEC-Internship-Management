export const getApplicationId = (application) =>
  application?.applicationId ||
  application?.id ||
  application?._id ||
  application?.application?._id;

export const getStudentName = (application) => {
  const student = application?.student;

  return (
    student?.fullName ||
    student?.name ||
    application?.studentName ||
    "Unknown Student"
  );
};

export const getStudentEmail = (application) => {
  const student = application?.student;

  return (
    student?.email || student?.collegeEmail || application?.studentEmail || "—"
  );
};

export const getRollNumber = (application) => {
  const student = application?.student;

  return (
    student?.rollNumber ||
    student?.roll ||
    application?.rollNumber ||
    application?.roll ||
    "—"
  );
};

export const getDepartment = (application) => {
  const student = application?.student;

  return (
    student?.department?.name ||
    student?.department?.code ||
    student?.department ||
    application?.department?.name ||
    application?.department?.code ||
    application?.department ||
    "—"
  );
};

export const getOrganisation = (application) => {
  const organisation = application?.organisation;

  return {
    id:
      organisation?._id ||
      organisation?.id ||
      application?.organisationId ||
      "unknown",
    name:
      organisation?.name ||
      organisation?.organisationName ||
      application?.organisationName ||
      application?.companyName ||
      application?.company ||
      "Organisation",
    location:
      organisation?.location ||
      organisation?.city ||
      application?.organisationLocation ||
      "—",
    email: organisation?.email || application?.organisationEmail || "—",
    phone:
      organisation?.phone ||
      organisation?.contactNumber ||
      application?.organisationPhone ||
      "—",
  };
};

export const getValue = (value, fallback = "—") => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return fallback;
  }

  return value;
};

export const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getStatusLabel = (status) => {
  const labels = {
    draft: "Draft",
    submitted: "Submitted",
    under_tpo_review: "Under TPO Review",
    update_required: "Update Required",
    approved_by_tpo: "Pending SPOC",
    under_spoc_review: "Pending SPOC",
    approved_by_spoc: "Approved",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    noc_generated: "NOC Generated",
  };

  return labels[status] || status || "Unknown";
};

export const getStatusClass = (status) => {
  switch (status) {
    case "approved_by_tpo":
    case "under_spoc_review":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "approved_by_spoc":
    case "noc_generated":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    case "update_required":
      return "border-orange-200 bg-orange-50 text-orange-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export const isPendingForSpoc = (application) =>
  application?.status === "approved_by_tpo" ||
  application?.status === "under_spoc_review";

export const isAcceptedCandidate = (application) =>
  application?.status === "approved_by_spoc";

export const getAcceptedApplications = (organisation) =>
  (organisation?.applications || []).filter(isAcceptedCandidate);
