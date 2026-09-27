import React from "react";
import { motion } from "framer-motion";

import { fadeUp, viewport } from "../../Animations/animations";

const ClaritySection = () => {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mx-auto w-full max-w-7xl px-5 sm:px-6"
      >
        <p className="eyebrow">Built for clarity</p>

        <h2
          className="
            mt-2
            max-w-lg
            font-display
            text-2xl
            leading-tight
            tracking-tight
            sm:text-3xl
          "
        >
          Everything your placement cell needs.
        </h2>
      </motion.div>
    </section>
  );
};

export default ClaritySection;
