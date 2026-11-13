import { Building2, CheckCircle2, Building, GraduationCap } from "lucide-react";

import { Card } from "../../../../Components/index";

const iconMap = {
  Building2,
  CheckCircle2,
  Building,
  GraduationCap,
};

const DepartmentStatCard = ({ stat }) => {
  const Icon = iconMap[stat.icon] || Building2;

  return (
    <Card className="min-w-0 border border-border bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-muted">{stat.title}</p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink">
            {stat.value}
          </h3>

          <p className="mt-1 text-xs text-ink-muted">{stat.description}</p>
        </div>

        <div className="shrink-0 rounded-xl bg-cream-soft p-3 text-brand-600">
          <Icon size={21} />
        </div>
      </div>
    </Card>
  );
};

export default DepartmentStatCard;
