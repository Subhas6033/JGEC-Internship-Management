import {
  GraduationCap,
  UsersRound,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../Animations/animations";

const roles = [
  {
    icon: GraduationCap,
    title: "For Students",
    description:
      "Apply once, follow every approval, and receive your official NOC without lengthy follow-ups.",
    action: "Track my internship",
  },
  {
    icon: UsersRound,
    title: "For Coordinators",
    description:
      "Review applications, validate documents, and keep students moving through a clear queue.",
    action: "Review with confidence",
  },
  {
    icon: Building2,
    title: "For Administrators",
    description:
      "Approve, generate, and audit every NOC from one dependable administrative workspace.",
    action: "Stay in control",
  },
];

const RolesSection = () => {
  return (
    <section className="border-y border-border bg-cream-dark/60 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <p className="eyebrow">One connected experience</p>

          <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
            Designed around every role.
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-7 space-y-2"
        >
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <motion.article
                key={role.title}
                variants={fadeUp}
                className="
                  group
                  rounded-lg
                  border
                  border-border
                  bg-cream-soft
                  p-5
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-card
                  sm:p-6
                "
              >
                <Icon size={16} strokeWidth={1.7} className="text-brand-600" />

                <h3 className="mt-3 font-display text-lg">{role.title}</h3>

                <p className="mt-2 max-w-2xl text-[10px] leading-5 text-ink-muted sm:text-xs">
                  {role.description}
                </p>

                <span
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-1
                    text-[9px]
                    font-semibold
                    text-brand-700
                  "
                >
                  {role.action}
                  <ArrowUpRight
                    size={10}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default RolesSection;
