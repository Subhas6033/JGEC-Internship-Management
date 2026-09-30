import { Download, UserPlus, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../Components/index";
import { fadeUp, viewport } from "../../../../Animations/animations";

const StudentsHeader = () => {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <div className="flex items-center gap-2">
          <Users size={17} strokeWidth={1.8} className="text-brand-700" />

          <p className="eyebrow">Student management</p>
        </div>

        <h2 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
          Students
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          Manage registered students, academic information, and internship
          participation across the portal.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          size="md"
          className="w-full border-border text-ink hover:bg-cream sm:w-auto"
        >
          <Download size={16} strokeWidth={1.8} />
          Export
        </Button>

        <Button
          variant="primary"
          size="md"
          className="w-full bg-brand-700 hover:bg-brand-800 sm:w-auto"
        >
          <UserPlus size={16} strokeWidth={1.8} />
          Add student
        </Button>
      </div>
    </motion.section>
  );
};

export default StudentsHeader;
