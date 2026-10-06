import { CheckCircle2 } from "lucide-react";
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
      value: progress.applications ?? 0,
    },
    {
      label: "NOC verification",
      value: progress.nocVerification ?? 0,
    },
    {
      label: "Company verification",
      value: progress.companyVerification ?? 0,
    },
    {
      label: "Joining confirmation",
      value: progress.joiningConfirmation ?? 0,
    },
  ];

  const average =
    items.length > 0
      ? Math.round(
          items.reduce((sum, item) => sum + Number(item.value || 0), 0) /
            items.length,
        )
      : 0;

  return (
    <Card className="border-border bg-cream-soft shadow-card">
      <Card.Header>
        <div>
          <p className="eyebrow">Department progress</p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
            Internship cycle
          </h2>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Current completion across the department workflow.
          </p>
        </div>
      </Card.Header>

      <Card.Content className="space-y-6">
        {items.map((item) => (
          <ProgressRow key={item.label} label={item.label} value={item.value} />
        ))}

        <div
          className="
            rounded-lg
            border
            border-brand-200
            bg-brand-50
            p-4
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white
                text-brand-700
              "
            >
              <CheckCircle2 size={17} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-brand-900">
                  Cycle progress
                </p>

                <span className="text-sm font-semibold text-brand-700">
                  {average}%
                </span>
              </div>

              <p className="mt-1 text-xs leading-5 text-brand-700">
                Overall progress across the current departmental internship
                workflow.
              </p>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default DepartmentProgress;
