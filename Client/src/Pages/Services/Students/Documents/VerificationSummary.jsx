import { CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const VerificationSummary = ({ applicationAccepted, nocGenerated }) => {
  const steps = [
    {
      _id: "spoc-approval",
      title: "SPOC approval",
      description: applicationAccepted
        ? "Your internship application has been accepted by the SPOC."
        : "Your internship application is waiting for SPOC acceptance.",
      status: applicationAccepted ? "completed" : "pending",
    },
    {
      _id: "noc-generation",
      title: "NOC generation",
      description: nocGenerated
        ? "Your No Objection Certificate has been generated."
        : applicationAccepted
          ? "Your NOC is being generated."
          : "NOC generation starts after SPOC acceptance.",
      status: nocGenerated ? "completed" : "pending",
    },
  ];

  const completedCount = steps.filter(
    (step) => step.status === "completed",
  ).length;

  const allCompleted = completedCount === steps.length;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-success" />

            <h2 className="font-semibold text-foreground">Internship status</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Track your SPOC approval and NOC generation status.
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
            allCompleted
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}
        >
          {completedCount}/{steps.length} completed
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => {
          const completed = step.status === "completed";

          return (
            <motion.div
              key={step._id}
              initial={{
                opacity: 0,
                x: -8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              className="relative flex gap-3"
            >
              {index !== steps.length - 1 && (
                <div className="absolute left-2.25 top-6 h-[calc(100%+8px)] w-px bg-border" />
              )}

              <div className="relative z-10 shrink-0">
                {completed ? (
                  <CheckCircle2 size={19} className="text-success" />
                ) : (
                  <Circle size={19} className="text-muted-foreground" />
                )}
              </div>

              <div className="pb-1">
                <p className="text-sm font-medium text-foreground">
                  {step.title}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationSummary;
