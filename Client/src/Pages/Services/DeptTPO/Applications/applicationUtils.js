// Shared helpers for the Department TPO applications module.
// Status values are the existing backend values — never rename them.

export const PENDING_STATUSES = [
  "submitted",
  "under_tpo_review",
  "update_required",
];
// Statuses where the Department TPO can act (same rule as the details page).
export const REVIEWABLE_STATUSES = ["submitted", "under_tpo_review"];
export const APPROVED_STATUSES = ["approved_by_tpo"];
export const REJECTED_STATUSES = ["rejected"];
export const SPOC_STATUSES = [
  "under_spoc_review",
  "approved_by_spoc",
  "noc_generated",
];

export const FALLBACK_ORG_ID = "unknown-organisation";

export const STATUS_GROUPS = {
  pending: { label: "Pending review", statuses: PENDING_STATUSES },
  approved: { label: "Approved by TPO", statuses: APPROVED_STATUSES },
  rejected: { label: "Rejected", statuses: REJECTED_STATUSES },
  spoc: { label: "Forwarded to SPOC", statuses: SPOC_STATUSES },
};

export const STATUS_CONFIG = {
  submitted: {
    label: "Submitted",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  under_tpo_review: {
    label: "Under TPO review",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  update_required: {
    label: "Update required",
    className: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  approved_by_tpo: {
    label: "Approved by TPO",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  under_spoc_review: {
    label: "Under SPOC review",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  approved_by_spoc: {
    label: "Approved by SPOC",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  noc_generated: {
    label: "NOC generated",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-cream-dark text-ink-muted ring-border",
  },
  draft: {
    label: "Draft",
    className: "bg-cream-dark text-ink-muted ring-border",
  },
};

export const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || {
    label: String(status || "Unknown")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    className: "bg-cream-dark text-ink-muted ring-border",
  };

export const getStudent = (application) =>
  application?.student || application?._student || {};

export const getOrganisation = (application) => {
  const org =
    application?._organisation ||
    application?.organisation ||
    application?.company;
  return org && typeof org === "object" ? org : null;
};

// Group by the real organisation ID; applications without any organisation
// info go into ONE visible fallback group instead of disappearing.
export const getOrganisationId = (application) => {
  const org = getOrganisation(application);
  const raw = application?.organisation;
  return (
    org?._id ||
    (typeof raw === "string" ? raw : null) ||
    application?.organisationId ||
    application?._organisationId ||
    FALLBACK_ORG_ID
  );
};

export const getOrganisationName = (organisation) =>
  organisation?.organisationName ||
  organisation?.name ||
  organisation?.companyName ||
  "Organisation details unavailable";

export const getOrganisationLocation = (organisation) =>
  organisation?.organisationLocation || organisation?.location || "";

export const getSubmittedAt = (application) =>
  application?.submittedAt || application?.createdAt;

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getInitials = (name, fallback = "ST") => {
  if (!name) return fallback;
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export const countByStatus = (applications = []) => {
  const list = Array.isArray(applications) ? applications : [];
  const inGroup = (key) =>
    list.filter((a) => STATUS_GROUPS[key].statuses.includes(a?.status)).length;
  const pending = inGroup("pending");
  const approved = inGroup("approved");
  const rejected = inGroup("rejected");
  const spoc = inGroup("spoc");
  return {
    total: list.length,
    pending,
    approved,
    rejected,
    spoc,
    other: list.length - pending - approved - rejected - spoc,
  };
};

export const groupByOrganisation = (applications = []) => {
  const groups = new Map();
  (Array.isArray(applications) ? applications : []).forEach((application) => {
    const id = getOrganisationId(application);
    if (!groups.has(id)) {
      const organisation = getOrganisation(application);
      groups.set(id, {
        id,
        organisation,
        name: getOrganisationName(organisation),
        location: getOrganisationLocation(organisation),
        applications: [],
      });
    } else if (!groups.get(id).organisation) {
      // A later application may carry the populated organisation object.
      const organisation = getOrganisation(application);
      if (organisation) {
        Object.assign(groups.get(id), {
          organisation,
          name: getOrganisationName(organisation),
          location: getOrganisationLocation(organisation),
        });
      }
    }
    groups.get(id).applications.push(application);
  });
  return Array.from(groups.values()).map((group) => ({
    ...group,
    counts: countByStatus(group.applications),
  }));
};

const STOP_WORDS = new Set(["of", "the", "and", "for", "&"]);

// "Indian Institute of Technology Delhi" -> "ID": first + last significant word.
export const getOrgInitials = (name) => {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()));
  if (words.length === 0) return "OR";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const ORG_TONES = [
  "bg-brand-100 text-brand-700",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800",
  "bg-teal-100 text-teal-800",
  "bg-rose-100 text-rose-800",
];

// Same organisation always gets the same tint, so groups are tell-apart-able at a glance.
export const getOrgTone = (key) => {
  const str = String(key || "");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1)
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return ORG_TONES[hash % ORG_TONES.length];
};
