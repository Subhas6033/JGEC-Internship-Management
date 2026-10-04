import { CheckCircle2, Clock3, FileCheck2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  cardAnimation,
  staggerContainer,
} from "../../../../Animations/animations";

const ApplicationProgress = ({ application }) => {
  if (!application) {
    return (
      <motion.div
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-border bg-white p-5 shadow-sm"
      >
        <div>
          <p className="eyebrow">Application progress</p>

          <h2 className="mt-1 font-display text-xl font-semibold text-ink">
            No active application
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-muted">
            You currently do not have an active internship application.
          </p>
        </div>
      </motion.div>
    );
  }

  const getStepIcon = (status) => {
    if (status === "completed") {
      return <CheckCircle2 size={18} strokeWidth={2} />;
    }

    if (status === "current") {
      return <Clock3 size={18} strokeWidth={2} />;
    }

    return <FileCheck2 size={18} strokeWidth={1.8} />;
  };

  const getStepClasses = (status) => {
    if (status === "completed") {
      return {
        wrapper: "bg-brand-50 border-brand-200",
        icon: "bg-brand-700 text-white",
        title: "text-ink",
        line: "bg-brand-700",
      };
    }

    if (status === "current") {
      return {
        wrapper: "bg-amber-50 border-amber-200",
        icon: "bg-amber-500 text-white",
        title: "text-ink",
        line: "bg-border",
      };
    }

    return {
      wrapper: "bg-surface-muted border-border",
      icon: "bg-white text-ink-muted border border-border",
      title: "text-ink-muted",
      line: "bg-border",
    };
  };

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Application progress</p>

          <h2 className="mt-1 font-display text-xl font-semibold text-ink">
            {application.company}
          </h2>

          <p className="mt-1 text-sm text-ink-muted">{application.role}</p>
        </div>

        {application.status === "rejected" && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            <XCircle size={14} strokeWidth={2} />
            Rejected
          </span>
        )}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-6"
      >
        {application.steps?.map((step, index) => {
          const classes = getStepClasses(step.status);
          const isLast = index === application.steps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${classes.icon}`}
                >
                  {getStepIcon(step.status)}
                </div>

                {!isLast && (
                  <div
                    className={`h-full min-h-8 w-px ${
                      step.status === "completed" ? "bg-brand-700" : "bg-border"
                    }`}
                  />
                )}
              </div>

              <div
                className={`mb-4 flex-1 rounded-lg border px-4 py-3 ${classes.wrapper}`}
              >
                <p className={`text-sm font-semibold ${classes.title}`}>
                  {step.label}
                </p>

                {step.status === "current" && (
                  <p className="mt-1 text-xs text-amber-700">
                    Currently under review
                  </p>
                )}

                {step.status === "completed" && (
                  <p className="mt-1 text-xs text-brand-700">Completed</p>
                )}

                {step.status === "pending" && (
                  <p className="mt-1 text-xs text-ink-muted">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default ApplicationProgress;
