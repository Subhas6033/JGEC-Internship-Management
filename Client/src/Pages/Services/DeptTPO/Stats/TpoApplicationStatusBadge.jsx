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
    className: "border-blue-200 bg-blue-50 text-blue-800",
    icon: Send,
  },

  under_tpo_review: {
    label: "Under TPO Review",
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
    icon: Clock3,
  },

  update_required: {
    label: "Update Required",
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
    icon: RotateCcw,
  },

  approved_by_tpo: {
    label: "Approved by TPO",
    className: "border-green-200 bg-green-50 text-green-800",
    icon: CheckCircle2,
  },

  under_spoc_review: {
    label: "Under SPOC Review",
    className: "border-blue-200 bg-blue-50 text-blue-800",
    icon: Clock3,
  },

  approved_by_spoc: {
    label: "Approved by SPOC",
    className: "border-green-200 bg-green-50 text-green-800",
    icon: FileCheck2,
  },

  rejected: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-800",
    icon: XCircle,
  },

  withdrawn: {
    label: "Withdrawn",
    className: "border-gray-200 bg-gray-50 text-gray-800",
    icon: XCircle,
  },

  draft: {
    label: "Draft",
    className: "border-gray-200 bg-gray-50 text-gray-800",
    icon: FileCheck2,
  },

  noc_generated: {
    label: "NOC Generated",
    className: "border-green-200 bg-green-50 text-green-800",
    icon: FileCheck2,
  },
};

const TpoApplicationStatusBadge = ({ status }) => {
  const config = statusConfig[status] ?? statusConfig.submitted;
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-2.5
        py-1
        text-xs
        font-medium
        ${config.className}
      `}
    >
      <Icon className="h-3.5 w-3.5" />

      {config.label}
    </span>
  );
};

export default TpoApplicationStatusBadge;
