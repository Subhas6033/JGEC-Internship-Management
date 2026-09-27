import { ArrowLeft, Home, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../Components/index";
import {
  fadeUp,
  hoverLiftSmall,
  pageEnter,
  tapScaleSmall,
} from "../../Animations/animations";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-cream px-5 py-16 text-ink sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          size-88
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-brand-100/50
          blur-3xl
          sm:size-120
        "
      />

      <div className="relative mx-auto w-full max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageEnter}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            variants={fadeUp}
            className="
              mx-auto
              flex
              size-16
              items-center
              justify-center
              rounded-2xl
              border
              border-brand-200
              bg-brand-50
              text-brand-700
              sm:size-20
            "
          >
            <SearchX
              aria-hidden="true"
              className="size-7 sm:size-9"
              strokeWidth={1.7}
            />
          </motion.div>

          {/* 404 */}
          <motion.p
            variants={fadeUp}
            className="
              mt-8
              font-display
              text-8xl
              font-semibold
              leading-none
              tracking-[-0.07em]
              text-brand-700
              sm:text-9xl
            "
          >
            404
          </motion.p>

          {/* Eyebrow */}
          <motion.p variants={fadeUp} className="eyebrow mt-6">
            Page not found
          </motion.p>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="
              mx-auto
              mt-3
              max-w-2xl
              font-display
              text-3xl
              font-medium
              leading-tight
              tracking-[-0.03em]
              text-ink
              sm:text-4xl
              lg:text-5xl
            "
          >
            This page took a wrong turn.
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="
              mx-auto
              mt-5
              max-w-lg
              text-sm
              leading-6
              text-ink-muted
              sm:text-[15px]
            "
          >
            The page you're looking for doesn't exist, may have moved, or the
            address may have been entered incorrectly.
          </motion.p>

          {/* Actions */}
          <motion.div
            variants={fadeUp}
            className="
              mt-8
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
            "
          >
            <motion.div whileHover={hoverLiftSmall} whileTap={tapScaleSmall}>
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="
                  h-11
                  w-full
                  border-0
                  bg-brand-700
                  px-5
                  text-sm
                  text-white
                  shadow-sm
                  hover:bg-brand-800
                  focus-visible:ring-brand-600
                  sm:w-auto
                "
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Go back
              </Button>
            </motion.div>

            <motion.div whileHover={hoverLiftSmall} whileTap={tapScaleSmall}>
              <Link to="/">
                <Button
                  type="button"
                  variant="outline"
                  className="
                    h-11
                    w-full
                    border-border
                    bg-transparent
                    px-5
                    text-sm
                    text-ink
                    hover:bg-cream-dark
                    focus-visible:ring-brand-600
                    sm:w-auto
                  "
                >
                  <Home aria-hidden="true" className="size-4" />
                  Back to home
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Portal hint */}
          <motion.div
            variants={fadeUp}
            className="
              mx-auto
              mt-10
              flex
              max-w-md
              items-center
              justify-center
              gap-2
              border-t
              border-border
              pt-6
              text-[10px]
              uppercase
              tracking-[0.14em]
              text-ink-muted
            "
          >
            <span className="size-1.5 rounded-full bg-brand-500" />
            JGEC Internship Management Portal
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFound;
