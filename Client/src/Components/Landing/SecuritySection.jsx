import { LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, viewport } from "../../Animations/animations";

const SecuritySection = () => {
  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="
            overflow-hidden
            rounded-lg
            bg-brand-800
            px-5
            py-7
            text-white
            sm:px-7
            sm:py-8
          "
        >
          {/* Icon + title in same line */}
          <div className="flex items-center gap-2">
            <LockKeyhole
              size={18}
              strokeWidth={1.5}
              className="shrink-0 text-brand-100"
            />

            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-brand-200">
              Trust and security
            </p>
          </div>

          <h2 className="mt-2 font-display text-xl sm:text-2xl">
            A reliable record for every approval.
          </h2>

          <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/70 sm:text-xs">
            Role-based access, complete activity history, secure documentation,
            and dependable notifications keep every approval accountable.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SecuritySection;
