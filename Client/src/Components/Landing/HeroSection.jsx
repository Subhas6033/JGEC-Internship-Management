import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApprovalPreview from "./ApprovalPreview";
import { heroContainer, heroItem } from "../../Animations/animations";

const HeroSection = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-b
        border-border
        bg-cream
      "
    >
      <div
        className="
          mx-auto
          grid
          min-h-150
          w-full
          max-w-7xl
          items-center
          gap-16
          px-5
          py-20
          sm:px-6
          lg:grid-cols-[0.9fr_1.1fr]
          lg:px-8
          lg:py-24
        "
      >
        {/* Copy */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroContainer}
          className="relative z-10 max-w-xl"
        >
          <motion.div variants={heroItem}>
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-border
                bg-cream-soft
                px-3
                py-1.5
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-brand-700
              "
            >
              <span className="size-1.5 rounded-full bg-brand-500" />
              Internship management portal
            </span>
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="
              mt-5
              max-w-150
              font-display
              text-4xl
              leading-[0.98]
              tracking-[-0.035em]
              text-ink
              sm:text-5xl
              lg:text-[3.7rem]
            "
          >
            Your Internship NOC,
            <br />
            Without the Paperwork.
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="
              mt-5
              max-w-md
              text-sm
              leading-6
              text-ink-muted
              sm:text-[15px]
            "
          >
            Submit your internship request, move through TPO and administration
            approval, and receive your official NOC — all from one streamlined
            portal.
          </motion.p>

          <motion.div
            variants={heroItem}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/students/applications/new"
              className="
                inline-flex
                min-h-10
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-md
                bg-brand-700
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-brand-800
                hover:shadow-md
                active:translate-y-px
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand-600
                focus-visible:ring-offset-2
              "
            >
              Start Application
              <ArrowUpRight size={14} />
            </Link>

            <a
              href="#how-it-works"
              className="
                inline-flex
                min-h-10
                cursor-pointer
                items-center
                justify-center
                rounded-md
                border
                border-border
                bg-cream-soft
                px-4
                py-2.5
                text-xs
                font-medium
                text-ink
                transition-colors
                duration-200
                hover:bg-cream-dark
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand-600
                focus-visible:ring-offset-2
              "
            >
              See How It Works
            </a>
          </motion.div>

          <motion.div
            variants={heroItem}
            className="mt-6 flex items-center gap-2 text-[10px] text-ink-muted"
          >
            <CheckCircle2 size={13} className="text-brand-600" />
            Secure, traceable, and built for placement cells.
          </motion.div>
        </motion.div>

        {/* Preview */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <ApprovalPreview />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
