import { CheckCircle2, CircleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cardAnimation } from "../../../../Animations/animations";

const ProfileCompletion = ({ profileCompletion }) => {
  const percentage = profileCompletion?.percentage ?? 0;
  const completed = profileCompletion?.completed ?? 0;
  const total = profileCompletion?.total ?? 0;

  const isComplete = percentage >= 100;

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Profile</p>

          <h2 className="mt-1 font-display text-xl font-semibold text-ink">
            Profile completion
          </h2>
        </div>

        {isComplete ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <CheckCircle2 size={19} strokeWidth={2} />
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <CircleAlert size={19} strokeWidth={2} />
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <p className="font-display text-4xl font-semibold tracking-tight text-ink">
            {percentage}%
          </p>

          <p className="pb-1 text-xs text-ink-muted">
            {completed} of {total} details completed
          </p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="h-full rounded-full bg-brand-700"
          />
        </div>

        <p className="mt-4 text-sm leading-6 text-ink-muted">
          {isComplete
            ? "Your profile is complete."
            : "Complete your remaining profile details to keep your information up to date."}
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileCompletion;
