import React from "react";
import { Building2, Clock3, User } from "lucide-react";
import SummaryCard from "./SummaryCard";

const DashboardSummary = ({
  organisationCount,
  studentCount,
  pendingCount,
}) => (
  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
    <SummaryCard
      icon={<Building2 size={19} />}
      title="Organisations"
      value={organisationCount}
    />

    <SummaryCard
      icon={<User size={19} />}
      title="Students"
      value={studentCount}
    />

    <SummaryCard
      icon={<Clock3 size={19} />}
      title="Pending Review"
      value={pendingCount}
    />
  </div>
);

export default DashboardSummary;
