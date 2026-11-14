import { Users, UserCheck, UserX, Building2 } from "lucide-react";

import { Card } from "../../../../Components/index";

const iconMap = {
  users: Users,
  "user-check": UserCheck,
  "user-x": UserX,
  "building-2": Building2,
};

const StudentStatCard = ({ stat }) => {
  const Icon = iconMap[stat.icon] || Users;

  return (
    <Card className="border-border bg-cream-soft p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-muted">{stat.title}</p>

          <h3 className="mt-2 text-2xl font-bold text-ink">{stat.value}</h3>

          <p className="mt-1 text-xs text-ink-muted">{stat.description}</p>
        </div>

        <div className="rounded-xl bg-white p-3 text-brand-600">
          <Icon size={21} />
        </div>
      </div>
    </Card>
  );
};

export default StudentStatCard;
