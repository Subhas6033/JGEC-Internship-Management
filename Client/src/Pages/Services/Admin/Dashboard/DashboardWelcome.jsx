import { ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../Components/index";
import { fadeUp, viewport } from "../../../../Animations/animations";

const DashboardWelcome = () => {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p className="eyebrow">Portal overview</p>

        <h2 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
          Good afternoon, Admin
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          Monitor students, companies, applications, and department activities
          from one central dashboard.
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        className="w-full bg-brand-700 hover:bg-brand-800 sm:w-auto"
      >
        <ClipboardCheck size={16} strokeWidth={1.8} />
        Review approvals
      </Button>
    </motion.section>
  );
};

export default DashboardWelcome;
