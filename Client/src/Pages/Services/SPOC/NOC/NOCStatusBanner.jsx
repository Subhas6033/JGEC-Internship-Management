import { motion } from "framer-motion";
import { CheckCircle2, FileClock } from "lucide-react";
import { Card } from "../../../../Components/index";
import { fadeUp } from "../../../../Animations/animations";

const NocStatusBanner = ({ pendingCount, loading }) => {
  if (loading) {
    return (
      <motion.section variants={fadeUp} className="mt-6 w-full min-w-0">
        <Card className="border-border bg-surface shadow-none">
          <Card.Content className="p-4 sm:p-5">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
              <div className="size-9 shrink-0 animate-pulse rounded-lg bg-ink-muted/15" />
              <div className="min-w-0 space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-ink-muted/15" />
                <div className="h-3 w-72 animate-pulse rounded bg-ink-muted/15" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.section>
    );
  }

  const hasPending = pendingCount > 0;
  const Icon = hasPending ? FileClock : CheckCircle2;

  const tone = hasPending
    ? {
        card: "border-amber-300/70 bg-gradient-to-r from-amber-50 to-amber-50/50",
        icon: "bg-amber-100 text-amber-600",
        title: "text-amber-900",
        text: "text-amber-700",
      }
    : {
        card: "border-brand-300/70 bg-gradient-to-r from-brand-50 to-brand-50/50",
        icon: "bg-brand-100 text-brand-600",
        title: "text-brand-900",
        text: "text-brand-700",
      };

  return (
    <motion.section variants={fadeUp} className="mt-6 w-full min-w-0">
      <Card className={`shadow-none transition-shadow duration-200 ${tone.card}`}>
        <Card.Content className="p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 ${tone.icon}`}
            >
              <Icon size={18} aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className={`text-sm font-semibold ${tone.title}`}>
                {hasPending
                  ? `${pendingCount} ${pendingCount === 1 ? "application is" : "applications are"} awaiting NOC generation`
                  : "All approved applications have NOCs"}
              </p>
              <p className={`mt-1 text-xs leading-relaxed sm:text-sm ${tone.text}`}>
                {hasPending
                  ? "Generate NOCs for approved applications so students can proceed with their internships."
                  : "New approved applications will appear here for NOC generation."}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.section>
  );
};

export default NocStatusBanner;
