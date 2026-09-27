import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { fadeUp, viewport } from "../../Animations/animations";

const CTASection = () => {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="
          mx-auto
          w-[calc(100%-2.5rem)]
          max-w-5xl
          rounded-lg
          border
          border-border
          bg-cream-soft
          px-5
          py-10
          text-center
          shadow-card
          sm:px-10
          sm:py-12
        "
      >
        <p className="eyebrow">Ready to begin?</p>

        <h2
          className="
            mx-auto
            mt-3
            max-w-lg
            font-display
            text-2xl
            leading-tight
            tracking-tight
            sm:text-3xl
          "
        >
          Move your internship approval forward.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-[10px] leading-5 text-ink-muted sm:text-xs">
          Start your application and keep every step of your NOC journey in one
          place.
        </p>

        <Link
          to="/apply"
          className="
            mt-6
            inline-flex
            min-h-10
            cursor-pointer
            items-center
            justify-center
            gap-2
            rounded-md
            bg-brand-700
            px-5
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
          Apply for NOC
          <ArrowUpRight size={14} />
        </Link>
      </motion.div>
    </section>
  );
};

export default CTASection;
