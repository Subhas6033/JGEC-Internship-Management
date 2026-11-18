import {
  Building2,
  CheckCircle2,
  GraduationCap,
  BriefcaseBusiness,
  FileCheck2,
} from "lucide-react";
import { Card } from "../../../../Components/index";
import { Reveal, Item } from "./MotionBlocks";
import {
  staggerFast,
  sectionAnimation,
} from "../../../../Animations/animations";

const activityIcons = {
  company: Building2,
  organisation: Building2,
  success: CheckCircle2,
  student: GraduationCap,
  internship: BriefcaseBusiness,
  noc: FileCheck2,
};

const MAX_ITEMS = 5;

const formatTime = (date) => {
  if (!date) return "Recently";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const RecentActivities = ({ data = [] }) => {
  const activities = Array.isArray(data)
    ? [...data]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.time || 0).getTime() -
            new Date(a.createdAt || a.time || 0).getTime(),
        )
        .slice(0, MAX_ITEMS)
    : [];

  return (
    <Card>
      <Card.Header>
        <Card.Title>Recent Activities</Card.Title>
        <p className="text-sm text-ink-muted">
          Latest {MAX_ITEMS} updates across the portal
        </p>
      </Card.Header>

      <Card.Content>
        {activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">
            No recent activities available.
          </p>
        ) : (
          <Reveal as="ul" variants={staggerFast} className="space-y-5">
            {activities.map((activity, index) => {
              const Icon =
                activityIcons[activity.type?.toLowerCase()] || CheckCircle2;

              return (
                <Item
                  as="li"
                  variants={sectionAnimation}
                  key={
                    activity._id || `${activity.type || "activity"}-${index}`
                  }
                  className="flex gap-3"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream-soft text-brand-700">
                    <Icon size={19} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      {activity.title || "Activity update"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-ink-muted">
                      {activity.description || "An update was recorded."}
                    </p>
                    <p className="mt-1.5 text-[11px] text-ink-muted">
                      {formatTime(activity.createdAt || activity.time)}
                    </p>
                  </div>
                </Item>
              );
            })}
          </Reveal>
        )}
      </Card.Content>
    </Card>
  );
};

export default RecentActivities;
