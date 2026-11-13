import { CheckCircle2, Clock3 } from "lucide-react";
import { Card } from "../../../../Components";

const ProgressRow = ({ label, value }) => {
  const percentage = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-ink">{label}</span>

        <span className="text-xs font-semibold text-ink-muted">
          {percentage}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-dark">
        <div
          className="
            h-full
            rounded-full
            bg-brand-700
            transition-all
            duration-500
          "
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

const DepartmentProgress = ({ progress = {} }) => {
  const items = [
    {
      label: "Internship applications",
      value: progress?.applications ?? 0,
    },
    {
      label: "Generated NOC",
      value: progress?.nocVerification ?? 0,
    },
  ];

  const upcomingFeatures = [
    {
      label: "Joining confirmation",
      description:
        "Track and confirm student joining status once the feature is available.",
    },
  ];

  const average =
    items.length > 0
      ? Math.round(
          items.reduce(
            (sum, item) =>
              sum + Math.min(100, Math.max(0, Number(item.value) || 0)),
            0,
          ) / items.length,
        )
      : 0;

  return (
    <Card className="border-border bg-cream-soft shadow-card">
      <Card.Header>
        <div>
          <p className="eyebrow">Department progress</p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
            Internship cycle {new Date().getFullYear()}
          </h2>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Current completion across the department workflow for the{" "}
            {new Date().getFullYear()} internship cycle.
          </p>
        </div>
      </Card.Header>

      <Card.Content className="space-y-6">
        {/* Active workflow progress */}
        {items.map((item) => (
          <ProgressRow key={item.label} label={item.label} value={item.value} />
        ))}

        {/* Overall cycle progress */}
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700">
              <CheckCircle2 size={17} strokeWidth={1.8} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-brand-900">
                  Cycle progress
                </p>

                <span className="text-sm font-semibold text-brand-700">
                  {average}%
                </span>
              </div>

              <p className="mt-1 text-xs leading-5 text-brand-700">
                Overall progress across the currently available departmental
                internship workflow.
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-brand-700 transition-all duration-500"
                  style={{
                    width: `${average}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming features */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-ink">Upcoming features</p>

            <p className="mt-1 text-xs text-ink-muted">
              More tools to support the internship workflow are coming soon.
            </p>
          </div>

          {upcomingFeatures.map((feature) => (
            <div
              key={feature.label}
              className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-white/60 p-4"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cream-soft text-ink-muted">
                <Clock3 size={17} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {feature.label}
                  </p>

                  <span className="rounded-full bg-cream-soft px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                    Coming soon
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-ink-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

export default DepartmentProgress;
