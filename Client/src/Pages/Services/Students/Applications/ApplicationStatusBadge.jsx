import { CheckCircle2, Clock3, CircleDashed, XCircle } from "lucide-react";

const statusConfig = {
  submitted: {
    label: "Submitted",
    icon: CircleDashed,
    className: "bg-cream-dark text-ink",
  },

  under_review: {
    label: "Under review",
    icon: Clock3,
    className: "bg-info/10 text-info",
  },

  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-brand-50 text-brand-700",
  },

  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-danger/10 text-danger",
  },
};

const ApplicationStatusBadge = ({ status }) => {
  const config = statusConfig[status] ?? statusConfig.submitted;

  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-semibold
        ${config.className}
      `}
    >
      <Icon size={13} strokeWidth={1.9} />
      {config.label}
    </span>
  );
};

export default ApplicationStatusBadge;
