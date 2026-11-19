import { motion } from "framer-motion";
import { CheckCircle2, FileClock } from "lucide-react";
import { Card } from "../../../../Components/index";
import { fadeUp } from "../../../../Animations/animations";

const NocStatusBanner = ({ pendingCount }) => {
  const hasPending = pendingCount > 0;
  const Icon = hasPending ? FileClock : CheckCircle2;

  const tone = hasPending
    ? {
        card: "border-amber-200 bg-amber-50",
        icon: "bg-amber-100 text-amber-700",
        title: "text-amber-900",
        text: "text-amber-700",
      }
    : {
        card: "border-brand-200 bg-brand-50",
        icon: "bg-brand-100 text-brand-700",
        title: "text-brand-900",
        text: "text-brand-700",
      };

  return (
    <motion.section variants={fadeUp} className="mt-6 w-full min-w-0">
      <Card className={`shadow-none ${tone.card}`}>
        <Card.Content className="p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
            >
              <Icon size={18} aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className={`text-sm font-semibold ${tone.title}`}>
                {hasPending
                  ? `${pendingCount} ${pendingCount === 1 ? "application is" : "applications are"} awaiting NOC generation`
                  : "All approved applications have NOCs"}
              </p>
              <p className={`mt-1 text-xs leading-5 sm:text-sm ${tone.text}`}>
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
