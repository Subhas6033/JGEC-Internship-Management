import {
  Bell,
  BriefcaseBusiness,
  FileCheck2,
  FileText,
  ShieldCheck,
} from "lucide-react";

const categoryConfig = {
  application: {
    label: "Application",
    icon: Bell,
    className: "bg-primary/10 text-primary",
  },

  verification: {
    label: "Verification",
    icon: ShieldCheck,
    className: "bg-success/10 text-success",
  },

  document: {
    label: "Document",
    icon: FileText,
    className: "bg-warning/10 text-warning",
  },

  internship: {
    label: "Internship",
    icon: BriefcaseBusiness,
    className: "bg-info/10 text-info",
  },
};

const NotificationBadge = ({ category }) => {
  const config = categoryConfig[category] || categoryConfig.application;

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

export default NotificationBadge;
