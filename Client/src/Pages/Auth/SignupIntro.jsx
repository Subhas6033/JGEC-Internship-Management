import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const SignupIntro = ({ apiError }) => {
  const points = [
    "Use your official college email address.",
    "Enter your roll number exactly as issued by JGEC.",
    "Upload a clear image of your signature.",
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        flex
        min-w-0
        flex-col
        justify-center
        lg:max-h-full
      "
    >
      {/* Logo */}

      <div
        className="
          flex
          size-11
          items-center
          justify-center
          rounded-xl
          border
          border-border
          bg-cream-soft
          shadow-sm
        "
      >
        <img
          src="/jgecLogo.png"
          alt="JGEC"
          className="
            size-8
            object-contain
          "
        />
      </div>

      {/* Eyebrow */}

      <p
        className="
          eyebrow
          mt-5
        "
      >
        Student access
      </p>

      {/* Heading */}

      <h1
        className="
          mt-2.5
          max-w-xl
          font-display
          text-3xl
          font-semibold
          leading-tight
          tracking-tight
          text-ink
          sm:text-4xl
        "
      >
        Create your internship portal account.
      </h1>

      {/* Description */}

      <p
        className="
          mt-3
          max-w-lg
          text-sm
          leading-5
          text-ink-muted
        "
      >
        Create your JGEC internship profile with your academic, contact,
        guardian, and signature details.
      </p>

      {/* Points */}

      <div
        className="
          mt-5
          space-y-2.5
        "
      >
        {points.map((point) => (
          <div
            key={point}
            className="
              flex
              items-start
              gap-2.5
              text-xs
              text-ink-muted
            "
          >
            <span
              className="
                mt-0.5
                flex
                size-4
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-brand-100
                text-brand-700
              "
            >
              <Check size={10} />
            </span>

            <span>{point}</span>
          </div>
        ))}
      </div>

      {/* Sign in */}

      <p
        className="
          mt-5
          text-xs
          text-ink-muted
        "
      >
        Already registered?{" "}
        <Link
          to="/auth/login"
          className="
            font-semibold
            text-brand-700
            transition-colors
            hover:text-brand-800
          "
        >
          Sign in
        </Link>
      </p>

      {/* Backend Error */}

      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -5,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              mt-5
              max-w-lg
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
            "
            role="alert"
          >
            <p
              className="
                text-xs
                font-semibold
                text-red-800
              "
            >
              Registration failed
            </p>

            <p
              className="
                mt-1
                wrap-break-word
                text-xs
                leading-5
                text-red-700
              "
            >
              {apiError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SignupIntro;
