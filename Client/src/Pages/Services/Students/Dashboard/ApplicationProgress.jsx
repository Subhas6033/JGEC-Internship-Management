import { Check, Circle, Clock3 } from "lucide-react";
import { Card } from "../../../../Components/index";
import { currentApplication } from "./dashboard.data";

const ApplicationProgress = () => {
  return (
    <Card className="border-border bg-cream-soft p-5 shadow-card">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-ink-muted">
          Current application
        </p>

        <h2 className="text-lg font-semibold text-ink">
          {currentApplication.company}
        </h2>

        <p className="text-sm text-ink-muted">{currentApplication.role}</p>
      </div>

      <div className="mt-6 space-y-5">
        {currentApplication.steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                {isCompleted ? (
                  <Check size={14} className="text-brand-700" strokeWidth={2} />
                ) : isCurrent ? (
                  <Clock3
                    size={14}
                    className="text-brand-700"
                    strokeWidth={2}
                  />
                ) : (
                  <Circle
                    size={12}
                    className="text-ink-muted"
                    strokeWidth={1.5}
                  />
                )}

                {index < currentApplication.steps.length - 1 && (
                  <span className="absolute left-1/2 top-7 h-5 w-px -translate-x-1/2 bg-border" />
                )}
              </div>

              <div className="min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? "text-brand-700" : "text-ink"
                  }`}
                >
                  {step.label}
                </p>

                {isCurrent && (
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Currently being reviewed
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ApplicationProgress;
