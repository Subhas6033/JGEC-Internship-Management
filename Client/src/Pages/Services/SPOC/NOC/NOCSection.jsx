import { motion } from "framer-motion";
import { fadeUp } from "../../../../Animations/animations";

const NocSection = ({ title, description, meta, children, loading }) => (
  <motion.section
    variants={fadeUp}
    className="mt-6 w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow-card) sm:mt-7"
  >
    <div className="flex w-full min-w-0 flex-col gap-3 border-b border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
      <div className="min-w-0">
        <h2 className="text-lg font-bold leading-tight tracking-tight text-ink sm:text-xl">
          {title}
        </h2>
        <p className="mt-1.5 text-xs leading-5 text-ink-muted sm:text-sm">
          {description}
        </p>
      </div>

      {!loading && (
        <p className="w-fit shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {meta}
        </p>
      )}
    </div>

    <div className="p-3 sm:p-4">{children}</div>
  </motion.section>
);

export default NocSection;
