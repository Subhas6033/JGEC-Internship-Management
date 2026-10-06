import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileCheck2,
} from "lucide-react";
import { Card } from "../../../../Components";

const TpoApplicationStats = ({ statistics }) => {
  const stats = [
    {
      label: "Total Applications",
      value: statistics.total,
      icon: ClipboardList,
      iconClass: "text-blue-600",
    },
    {
      label: "Pending Review",
      value: statistics.submitted + statistics.underTpoReview,
      icon: Clock3,
      iconClass: "text-yellow-600",
    },
    {
      label: "Approved by TPO",
      value: statistics.approvedByTpo,
      icon: CheckCircle2,
      iconClass: "text-green-600",
    },
    {
      label: "Approved by SPOC",
      value: statistics.approvedBySpoc,
      icon: FileCheck2,
      iconClass: "text-green-600",
    },
    {
      label: "Rejected",
      value: statistics.rejected,
      icon: XCircle,
      iconClass: "text-red-600",
    },
    {
      label: "Update Required",
      value: statistics.updateRequired,
      icon: RotateCcw,
      iconClass: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label}>
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-sm text-ink-muted">{item.label}</p>

                <p className="mt-1 text-2xl font-semibold text-ink">
                  {item.value}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream-soft">
                <Icon className={`h-5 w-5 ${item.iconClass}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TpoApplicationStats;
