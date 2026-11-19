import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Building2,
  FileCheck2,
} from "lucide-react";
import StatCard from "./StatCard";

const StatsOverview = ({ data }) => {
  const overview = data?.overview || {};

  const dashboardStats = [
    {
      title: "Total Students",
      value: overview.totalStudents ?? 0,
      change: null,
      description: "Registered students",
      icon: Users,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Applications",
      value: overview.totalApplications ?? 0,
      change: null,
      description: "Total submitted applications",
      icon: FileText,
      iconClass: "bg-purple-100 text-purple-600",
    },
    {
      title: "Pending Reviews",
      value: overview.pendingReviews ?? 0,
      change: null,
      description: "Require your attention",
      icon: Clock,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Approved",
      value: overview.approvedApplications ?? 0,
      change: null,
      description: "Successfully approved",
      icon: CheckCircle2,
      iconClass: "bg-green-100 text-green-600",
    },
    {
      title: "Organisations",
      value: overview.totalCompanies ?? 0,
      change: null,
      description: "Registered organisations",
      icon: Building2,
      iconClass: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "NOCs Generated",
      value: overview.nocsGenerated ?? 0,
      change: null,
      description: "Certificates issued",
      icon: FileCheck2,
      iconClass: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ink">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Your college placement summary
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default StatsOverview;
