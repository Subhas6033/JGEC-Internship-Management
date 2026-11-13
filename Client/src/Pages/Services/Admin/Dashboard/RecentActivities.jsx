import {
  Building2,
  CheckCircle2,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";

import { Card } from "../../../../Components/index";

import { recentActivities } from "./dashboard.data";

const activityIcons = {
  company: Building2,
  success: CheckCircle2,
  student: GraduationCap,
  internship: BriefcaseBusiness,
};

const RecentActivities = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Recent Activities</Card.Title>
        <p className="text-sm text-ink-muted">
          Latest updates across the portal
        </p>
      </Card.Header>

      <Card.Content>
        <div className="space-y-5">
          {recentActivities.map((activity, index) => {
            const Icon = activityIcons[activity.type];

            return (
              <div key={index} className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream-soft text-brand-700">
                  <Icon size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-ink-muted">
                    {activity.description}
                  </p>

                  <p className="mt-1.5 text-[11px] text-ink-muted">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
};

export default RecentActivities;
