import { Users, GraduationCap, FileCheck2, UserRoundCheck } from "lucide-react";
import StatCard from "./StatCard";

const DashboardStats = ({ stats }) => {
  const items = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      description: "Students under your department",
      icon: Users,
      tone: "brand",
    },

    {
      label: "Active Internships",
      value: stats.activeInternships,
      description: "Currently in progress",
      icon: GraduationCap,
      tone: "info",
    },

    {
      label: "Pending Approvals",
      value: stats.pendingApprovals,
      description: "Applications need review",
      icon: FileCheck2,
      tone: "warning",
    },

    {
      label: "Placement Rate",
      value: `${stats.placementRate}%`,
      description: "Students placed this cycle",
      icon: UserRoundCheck,
      tone: "success",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
};

export default DashboardStats;
