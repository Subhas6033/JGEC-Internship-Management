import { CheckCircle2, LockKeyhole } from "lucide-react";

const statusConfig = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border border-success/20",
  },

  locked: {
    label: "Read only",
    icon: LockKeyhole,
    className: "bg-muted text-muted-foreground border border-border",
  },
};

const DocumentStatusBadge = ({ status = "verified" }) => {
  const config = statusConfig[status] || statusConfig.verified;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
};

export default DocumentStatusBadge;
