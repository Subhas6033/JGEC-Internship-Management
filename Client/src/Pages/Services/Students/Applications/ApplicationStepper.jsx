import { Check } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    id: 1,
    title: "Student Details",
    description: "Your academic information",
  },
  {
    id: 2,
    title: "Company Details",
    description: "Organisation information",
  },
  {
    id: 3,
    title: "Internship Details",
    description: "Duration and location",
  },
];

const ApplicationStepper = ({ currentStep }) => {
  return (
    <div
      className="
        w-full
        rounded-xl
        border border-border
        bg-cream-soft
        p-3
        shadow-card
        sm:p-4
        lg:p-5
      "
    >
      <div className="relative grid grid-cols-3 gap-2 sm:gap-4">
        {/* Connector line */}
        <div
          className="
            pointer-events-none
            absolute
            left-[16.67%]
            right-[16.67%]
            top-4
            h-px
            bg-border
            sm:top-4
          "
          aria-hidden="true"
        >
          <motion.div
            initial={false}
            animate={{
              width:
                currentStep <= 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full bg-brand-700"
          />
        </div>

        {steps.map((step) => {
          const completed = currentStep > step.id;
          const active = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="
                relative
                z-10
                flex
                min-w-0
                flex-col
                items-center
                text-center
              "
            >
              {/* Step indicator */}
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1.05 : 1,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className={[
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  "border text-xs font-semibold",
                  "transition-colors duration-200",
                  completed || active
                    ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                    : "border-border bg-cream text-ink-muted",
                ].join(" ")}
              >
                {completed ? (
                  <Check size={15} strokeWidth={2.2} aria-hidden="true" />
                ) : (
                  step.id
                )}
              </motion.div>

              {/* Step content */}
              <div className="mt-2 min-w-0 px-1 sm:mt-2.5">
                <p
                  className={[
                    "truncate text-[11px] font-semibold sm:text-sm",
                    active || completed ? "text-ink" : "text-ink-muted",
                  ].join(" ")}
                >
                  {step.title}
                </p>

                <p
                  className={[
                    "mt-0.5 hidden text-[10px] leading-4 sm:block",
                    active ? "text-brand-700" : "text-ink-muted",
                  ].join(" ")}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationStepper;
