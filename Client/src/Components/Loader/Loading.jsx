import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const Loader = ({
  fullScreen = true,
  message = "Loading Internship Portal",
}) => {
  return (
    <div
      className={[
        "flex items-center justify-center",
        fullScreen
          ? "fixed inset-0 z-9999 min-h-screen bg-cream"
          : "min-h-60 w-full bg-cream",
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center">
        {/* Loader Mark */}
        <div className="relative flex size-20 items-center justify-center">
          {/* Outer rotating ring */}
          <motion.div
            className="
              absolute inset-0
              rounded-full
              border-2
              border-brand-200
              border-t-brand-700
            "
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner soft surface */}
          <div
            className="
              flex size-14
              items-center justify-center
              rounded-full
              border
              border-border
              bg-cream-soft
              shadow-sm
            "
          >
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.85, 1, 0.85],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <GraduationCap
                size={25}
                strokeWidth={1.8}
                className="text-brand-700"
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-5 text-center">
          <p
            className="
              font-display
              text-base
              font-semibold
              tracking-[-0.01em]
              text-ink
            "
          >
            JGEC Internship NOC Management Portal
          </p>

          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span className="text-[10px] font-medium text-ink-muted">
              {message}
            </span>

            {/* Animated dots */}
            <span className="flex gap-0.5">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  className="size-1 rounded-full bg-brand-500"
                  animate={{
                    opacity: [0.25, 1, 0.25],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: index * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </span>
          </div>
        </div>

        {/* Small brand indicator */}
        <div className="mt-4 flex items-center gap-2">
          <span className="h-px w-8 bg-border" />

          <span
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-brand-700
            "
          >
            JGEC
          </span>

          <span className="h-px w-8 bg-border" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
