import {
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
  FileCheck2,
  Send,
} from "lucide-react";

const statusConfig = {
  submitted: {
    label: "Submitted",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Send,
  },
  under_tpo_review: {
    label: "Under TPO Review",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock3,
  },
  update_required: {
    label: "Update Required",
    className: "bg-orange-50 text-orange-700 ring-orange-200",
    icon: RotateCcw,
  },
  approved_by_tpo: {
    label: "Approved by TPO",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  under_spoc_review: {
    label: "Under SPOC Review",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: Clock3,
  },
  approved_by_spoc: {
    label: "Approved by SPOC",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: FileCheck2,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-red-200",
    icon: XCircle,
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-cream-dark text-ink-muted ring-border",
    icon: XCircle,
  },
  draft: {
    label: "Draft",
    className: "bg-cream-dark text-ink-muted ring-border",
    icon: FileCheck2,
  },
  noc_generated: {
    label: "NOC Generated",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: FileCheck2,
  },
};

const TpoApplicationStatusBadge = ({ status }) => {
  const config = statusConfig[status] ?? {
    label: String(status || "Unknown")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    className: "bg-cream-dark text-ink-muted ring-border",
    icon: FileCheck2,
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex w-fit max-w-full items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {config.label}
    </span>
  );
};

export default TpoApplicationStatusBadge;
