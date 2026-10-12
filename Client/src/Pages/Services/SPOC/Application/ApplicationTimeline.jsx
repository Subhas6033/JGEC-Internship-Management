import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { DetailsCard } from "./DetailComponents";

export default function ApplicationTimeline({ application }) {
  const events = [
    {
      label: "Application submitted",
      date: application.createdAt,
      completed: Boolean(application.createdAt),
    },
    {
      label: "TPO review",
      date: application.tpoReviewedAt,
      completed:
        Boolean(application.tpoReviewedAt) ||
        [
          "approved_by_tpo",
          "under_spoc_review",
          "approved_by_spoc",
          "noc_generated",
        ].includes(application.status),
    },
    {
      label: "SPOC review",
      date: application.spocReviewedAt,
      completed:
        Boolean(application.spocReviewedAt) ||
        ["approved_by_spoc", "noc_generated"].includes(application.status),
    },
    {
      label: "NOC generated",
      date: application.nocGeneratedAt,
      completed: application.status === "noc_generated",
    },
  ];

  const formatDate = (value) => {
    if (!value) return "Awaiting update";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <DetailsCard
      icon={<Clock3 size={20} />}
      title="Application Timeline"
      description="Progress through the application review process."
    >
      <div className="space-y-0">
        {events.map((event, index) => (
          <div key={event.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              {event.completed ? (
                <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
              ) : (
                <Circle size={20} className="shrink-0 text-slate-300" />
              )}
              {index < events.length - 1 && (
                <div className="my-1 min-h-8 w-px flex-1 bg-slate-200" />
              )}
            </div>
            <div className="pb-5">
              <p className="text-sm font-semibold text-slate-800">
                {event.label}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(event.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DetailsCard>
  );
}
