// Aggregation helpers for the TPO statistics charts.
// Status values are the existing backend values

export const STATUS_META = {
  submitted: { label: "Submitted", color: "#f59e0b" },
  under_tpo_review: { label: "Under TPO review", color: "#fbbf24" },
  update_required: { label: "Update required", color: "#fb923c" },
  approved_by_tpo: { label: "Approved by TPO", color: "#059669" },
  under_spoc_review: { label: "Under SPOC review", color: "#8b5cf6" },
  approved_by_spoc: { label: "Approved by SPOC", color: "#3b82f6" },
  noc_generated: { label: "NOC generated", color: "#0ea5e9" },
  rejected: { label: "Rejected", color: "#ef4444" },
  withdrawn: { label: "Withdrawn", color: "#a8a29e" },
  draft: { label: "Draft", color: "#d6d3d1" },
};

export const CATEGORY = {
  pending: { label: "Pending review", color: "#f59e0b" },
  approved: { label: "Approved by TPO", color: "#059669" },
  spoc: { label: "SPOC stage", color: "#8b5cf6" },
  rejected: { label: "Rejected", color: "#ef4444" },
  other: { label: "Other", color: "#a8a29e" },
};

export const getCategory = (status) => {
  if (["submitted", "under_tpo_review", "update_required"].includes(status))
    return "pending";
  if (status === "approved_by_tpo") return "approved";
  if (
    ["under_spoc_review", "approved_by_spoc", "noc_generated"].includes(status)
  )
    return "spoc";
  if (status === "rejected") return "rejected";
  return "other";
};

const isNoc = (a) =>
  a?.nocGenerated === true ||
  a?.nocStatus === "generated" ||
  a?.status === "noc_generated";

const countStatus = (list, status) =>
  list.filter((a) => a?.status === status).length;

// Same shape as the original statistics object.
export const computeStatistics = (applications = []) => {
  const list = Array.isArray(applications) ? applications : [];
  return {
    total: list.length,
    submitted: countStatus(list, "submitted"),
    underTpoReview: countStatus(list, "under_tpo_review"),
    updateRequired: countStatus(list, "update_required"),
    approvedByTpo: countStatus(list, "approved_by_tpo"),
    underSpocReview: countStatus(list, "under_spoc_review"),
    approvedBySpoc: countStatus(list, "approved_by_spoc"),
    rejected: countStatus(list, "rejected"),
    withdrawn: countStatus(list, "withdrawn"),
    nocGenerated: list.filter(isNoc).length,
  };
};

export const statusDistribution = (applications = []) => {
  const counts = new Map();
  applications.forEach((a) =>
    counts.set(a?.status, (counts.get(a?.status) || 0) + 1),
  );
  const rows = Object.entries(STATUS_META)
    .filter(([key]) => counts.get(key))
    .map(([key, meta]) => ({
      key,
      label: meta.label,
      color: meta.color,
      value: counts.get(key),
    }));
  const known = new Set(Object.keys(STATUS_META));
  const unknown = [...counts]
    .filter(([key]) => !known.has(key))
    .reduce((s, [, v]) => s + v, 0);
  if (unknown > 0)
    rows.push({
      key: "other",
      label: "Other",
      color: "#a8a29e",
      value: unknown,
    });
  return rows;
};

// Applications per month (by createdAt). Fills empty months, keeps the latest `maxMonths`.
export const monthlySeries = (applications = [], maxMonths = 12) => {
  const buckets = new Map();
  applications.forEach((a) => {
    const d = new Date(a?.createdAt);
    if (Number.isNaN(d.getTime())) return;
    const key = d.getFullYear() * 12 + d.getMonth();
    buckets.set(key, (buckets.get(key) || 0) + 1);
  });
  if (buckets.size === 0) return [];
  const keys = [...buckets.keys()];
  const min = Math.min(...keys);
  const max = Math.max(...keys);
  const start = Math.max(min, max - maxMonths + 1);
  const series = [];
  for (let key = start; key <= max; key += 1) {
    const date = new Date(Math.floor(key / 12), key % 12, 1);
    series.push({
      key,
      label: date.toLocaleDateString("en-IN", { month: "short" }),
      sublabel: date.toLocaleDateString("en-IN", { year: "2-digit" }),
      title: date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
      value: buckets.get(key) || 0,
    });
  }
  return series;
};

export const semesterSeries = (applications = []) =>
  Array.from({ length: 8 }, (_, i) => ({
    key: String(i + 1),
    label: `S${i + 1}`,
    title: `Semester ${i + 1}`,
    value: applications.filter((a) => String(a?.semester) === String(i + 1))
      .length,
  }));

const titleCase = (v) =>
  String(v)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Generic "count by" -> rows sorted by value, with a single-colour segment.
export const countBy = (
  applications,
  getter,
  { top = 6, color = "#166534", fallback = "Not specified" } = {},
) => {
  const map = new Map();
  applications.forEach((a) => {
    const raw = getter(a);
    const label = raw ? titleCase(raw) : fallback;
    map.set(label, (map.get(label) || 0) + 1);
  });
  return [...map]
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([label, value]) => ({
      key: label,
      label,
      total: value,
      segments: [{ key: label, value, color }],
    }));
};

// Top organisations with a stacked status-category breakdown.
export const organisationBreakdown = (applications = [], top = 6) => {
  const map = new Map();
  applications.forEach((a) => {
    const org = a?.organisation || {};
    const name = org.organisationName || org.name || "Organisation unavailable";
    const id = org._id || name;
    if (!map.has(id))
      map.set(id, {
        key: id,
        label: name,
        sublabel: org.organisationLocation || org.location || "",
        counts: {},
        total: 0,
      });
    const row = map.get(id);
    const cat = getCategory(a?.status);
    row.counts[cat] = (row.counts[cat] || 0) + 1;
    row.total += 1;
  });
  return [...map.values()]
    .sort((a, b) => b.total - a.total)
    .slice(0, top)
    .map((row) => ({
      ...row,
      segments: Object.keys(CATEGORY)
        .filter((k) => row.counts[k])
        .map((k) => ({
          key: k,
          value: row.counts[k],
          color: CATEGORY[k].color,
          label: CATEGORY[k].label,
        })),
    }));
};

export const departmentRows = (applications = []) =>
  countBy(applications, (a) => a?.student?.department, {
    top: 6,
    color: "#0f766e",
    fallback: "Unspecified",
  });
