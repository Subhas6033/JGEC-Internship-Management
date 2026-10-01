import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { transitions } from "../Animations/animations";

/**
 * StepIndicator component
 * Displays current registration step and progress
 */
const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div
      className="mt-4 flex min-w-0 items-center"
      aria-label={`Registration step ${currentStep} of ${steps.length}`}
    >
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 items-center gap-2.5">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.04 : 1,
                }}
                transition={transitions.spring}
                className={[
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                  isActive || isCompleted
                    ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                    : "border-border bg-cream text-ink-muted",
                ].join(" ")}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isCompleted ? (
                    <motion.span
                      key="check"
                      variants={{
                        initial: { opacity: 0, scale: 0.5 },
                        animate: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.5 },
                      }}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Check size={13} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`step-${step.id}`}
                      variants={{
                        initial: { opacity: 0, scale: 0.5 },
                        animate: { opacity: 1, scale: 1 },
                      }}
                      initial="initial"
                      animate="animate"
                    >
                      {step.id}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="hidden min-w-0 sm:block">
                <p
                  className={[
                    "truncate text-[11px] font-semibold",
                    isActive || isCompleted
                      ? "text-ink"
                      : "text-ink-muted",
                  ].join(" ")}
                >
                  {step.title}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-ink-muted">
                  {step.description}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-3 h-px min-w-4 flex-1 overflow-hidden bg-border">
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: currentStep > step.id ? 1 : 0,
                  }}
                  transition={transitions.smooth}
                  style={{ originX: 0 }}
                  className="h-full origin-left bg-brand-700"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
