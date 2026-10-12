import { Building2, Clock3, UserRound } from "lucide-react";
import { SummaryCard } from "./DetailComponents";

export default function ApplicationSummary({
  studentName,
  organisationName,
  statusLabel,
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        icon={<UserRound size={19} />}
        title="Student"
        value={studentName}
      />
      <SummaryCard
        icon={<Building2 size={19} />}
        title="Organisation"
        value={organisationName}
      />
      <SummaryCard
        icon={<Clock3 size={19} />}
        title="Status"
        value={statusLabel}
      />
    </div>
  );
}
