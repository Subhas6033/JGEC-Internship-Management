// Pages/Services/Admin/NOC/adminNoc.utils.js
//
// Converts whatever the backend returns (NOC documents or applications with a
// populated student / organisation / noc) into the flat row shape that
// NOCTable, NOCPreview and NOCStatus already use.

// Options for the status filter dropdown (replaces the one that lived in
// adminNoc.data.js). Values match the statuses used by NOCStatus.
export const nocStatusOptions = [
  { label: "All Status", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Sent", value: "Sent" },
  { label: "Failed", value: "Failed" },
];

const first = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const idOf = (value) =>
  (value && typeof value === "object" && value._id ? value._id : value) || null;

const asObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

const mapStatus = (item, noc) => {
  // The application status is the source of truth when it is available:
  //   noc_generated          -> approved and sent
  //   pending_admin_approval -> waiting for the admin
  if (item?.status === "noc_generated") return "Sent";

  const raw = String(
    first(
      noc?.dispatchStatus,
      noc?.emailStatus,
      noc?.status,
      item?.nocStatus,
      item?.status,
      "",
    ),
  ).toLowerCase();

  if (/fail|error/.test(raw)) {
    return "Failed";
  }

  if (item?.status === "pending_admin_approval") {
    return "Pending";
  }

  if (
    /sent|dispatch|deliver/.test(raw) ||
    first(noc?.sentAt, noc?.dispatchedAt, item?.nocSentAt)
  ) {
    return "Sent";
  }

  return "Pending";
};

// Pulls the array out of { nocs | applications | data | items | results }
// (also handles the nested { data: { applications: [...] } } shape).
export const extractNocList = (payload) => {
  if (Array.isArray(payload)) return payload;

  const sources = [payload, payload?.data];

  for (const source of sources) {
    const list = [
      source?.nocs,
      source?.applications,
      source?.data,
      source?.items,
      source?.results,
    ].find(Array.isArray);

    if (list) return list;
  }

  return [];
};

export const extractTotal = (payload, fallback = 0) =>
  Number(
    first(
      payload?.pagination?.total,
      payload?.pagination?.totalItems,
      payload?.data?.pagination?.total,
      payload?.total,
      fallback,
    ),
  ) || fallback;

export const normalizeNoc = (item) => {
  if (!item || typeof item !== "object") return null;

  // A NOC document has a reference number and points to its application.
  const isNocDoc = Boolean(item.referenceNumber && item.application);

  const noc = isNocDoc
    ? item
    : item.noc && typeof item.noc === "object"
      ? item.noc
      : null;

  const application = isNocDoc ? asObject(item.application) : item;

  const student = asObject(first(item.student, application.student));
  const organisation = asObject(
    first(item.organisation, application.organisation),
  );

  const applicationId = isNocDoc ? idOf(item.application) : item._id;

  const rawUrl = first(
    noc?.documentUrl,
    noc?.pdfUrl,
    item.documentUrl,
    item.pdfUrl,
    noc?.fileUrl,
  );

  return {
    _id: applicationId ? String(applicationId) : "",
    nocId: noc?._id ? String(noc._id) : "",
    referenceNumber: first(noc?.referenceNumber, item.referenceNumber, ""),
    studentName: first(student.fullName, student.name, "—"),
    rollNumber: first(student.rollNumber, student.rollNo, "—"),
    email: first(student.email, student.emailId, ""),
    company: first(organisation.organisationName, organisation.name, "—"),
    internshipRole: first(
      application.designation,
      application.internshipDesignation,
      "—",
    ),
    department: first(
      student.department,
      application.department,
      noc?.department,
      "—",
    ),
    generatedAt: formatDate(
      first(noc?.generatedAt, application.nocGeneratedAt, item.generatedAt),
    ),
    startDate: formatDate(
      first(application.tentativeStartDate, application.startDate),
    ),
    endDate: formatDate(
      first(application.tentativeEndDate, application.endDate),
    ),
    // Only absolute URLs can be shown inside the preview iframe.
    documentUrl:
      typeof rawUrl === "string" && /^https?:\/\//i.test(rawUrl) ? rawUrl : "",
    status: mapStatus(item, noc),
  };
};

// Fills gaps in a list row with the richer data returned by the details API.
export const mergeNoc = (base, extra) => {
  if (!base) return null;
  if (!extra) return base;

  const merged = { ...base };

  Object.entries(extra).forEach(([key, value]) => {
    if (key === "_id" || key === "status") return;
    if (value && value !== "—") merged[key] = value;
  });

  return merged;
};

// The backend (getNOCStats) returns:
//   { pendingApproval, approvedToday, totalGenerated }
//   pendingApproval -> applications waiting for the admin
//   totalGenerated  -> applications whose NOC is approved and sent
//                      (status "noc_generated")
// The cards need pending / sent / failed / total, so they are derived here.
export const normalizeStats = (payload, nocs = []) => {
  const count = (status) => nocs.filter((noc) => noc.status === status).length;
  const toNumber = (value) => Number(value) || 0;

  const pending = toNumber(
    first(
      payload?.pending,
      payload?.pendingApproval,
      payload?.pendingNocs,
      count("Pending"),
    ),
  );

  const sent = toNumber(
    first(
      payload?.sent,
      payload?.sentNocs,
      payload?.totalGenerated,
      count("Sent"),
    ),
  );

  const failed = toNumber(
    first(payload?.failed, payload?.failedNocs, count("Failed")),
  );

  // Total = every NOC that is waiting or already sent.
  const total = toNumber(
    first(payload?.total, payload?.totalNocs, pending + sent),
  );

  return { total, pending, sent, failed };
};
