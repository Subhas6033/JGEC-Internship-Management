import { FileWarning, Clock3, MessageCircleWarning } from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../Animations/animations";

const problems = [
  {
    icon: FileWarning,
    title: "Scattered documents",
    description:
      "Important internship records are difficult to find and verify.",
  },
  {
    icon: Clock3,
    title: "Unclear timelines",
    description: "Students are often unsure where their request stands next.",
  },
  {
    icon: MessageCircleWarning,
    title: "Manual follow-ups",
    description:
      "Coordinators spend time answering status and approval questions.",
  },
];

const ProblemsSection = () => {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">The old way</p>

          <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
            Approvals should not disappear into paperwork.
          </h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-6 space-y-2"
        >
          {problems.map((problem) => {
            const Icon = problem.icon;

            return (
              <motion.div
                key={problem.title}
                variants={fadeUp}
                className="
                  rounded-lg
                  border
                  border-border
                  bg-cream-soft
                  p-4
                  transition-shadow
                  duration-200
                  hover:shadow-card
                "
              >
                <Icon size={14} strokeWidth={1.8} className="text-brand-600" />

                <h3 className="mt-2 text-md font-semibold text-ink">
                  {problem.title}
                </h3>

                <p className="mt-1 text-[12px] leading-5 text-ink-muted">
                  {problem.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemsSection;
