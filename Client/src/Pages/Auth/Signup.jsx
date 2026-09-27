import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  FileSignature,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input, Select } from "../../Components";
import {
  cardAnimation,
  checkAnimation,
  formItemAnimation,
  hoverLiftSmall,
  iconPop,
  introAnimation,
  motionProps,
  sectionAnimation,
  stepAnimation,
  tapScaleSmall,
  transitions,
} from "../../Animations/animations";

const departmentOptions = [
  {
    label: "Computer Science & Engineering",
    value: "CSE",
  },
  {
    label: "Electronics & Communication Engineering",
    value: "ECE",
  },
  {
    label: "Electrical Engineering",
    value: "EE",
  },
  {
    label: "Mechanical Engineering",
    value: "ME",
  },
  {
    label: "Civil Engineering",
    value: "CE",
  },
  {
    label: "Information Technology",
    value: "IT",
  },
];

const steps = [
  {
    id: 1,
    title: "Account & academic",
    description: "Basic and academic information",
  },
  {
    id: 2,
    title: "Guardian & signature",
    description: "Complete your registration",
  },
];

const inputClassName =
  "border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 " +
  "focus:border-brand-600 focus:ring-brand-600/15";

const mobileInputClassName = `${inputClassName} pl-[5.75rem]`;

const getStepOneFields = () => [
  "fullName",
  "email",
  "mobileNumber",
  "password",
  "rollNumber",
  "department",
];

const getStepTwoFields = () => ["signature", "gurdianName", "gurdianMobile"];

const passwordRules = [
  {
    id: "length",
    label: "8–20 characters",
    test: (value) => value.length >= 8 && value.length <= 20,
  },
  {
    id: "letter",
    label: "At least one letter",
    test: (value) => /[A-Za-z]/.test(value),
  },
  {
    id: "number",
    label: "At least one number",
    test: (value) => /\d/.test(value),
  },
];

const mobilePrefix = "+91";

const normalizeMobileNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");

  if (!digits) return "";

  return `${mobilePrefix}${digits}`;
};

const Signup = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      rollNumber: "",
      department: "",
      signature: null,
      gurdianName: "",
      gurdianMobile: "",
    },
  });

  const password = watch("password");
  const signature = watch("signature");

  const passwordState = useMemo(() => {
    const value = password || "";

    const rules = passwordRules.map((rule) => ({
      ...rule,
      passed: rule.test(value),
    }));

    const passedCount = rules.filter((rule) => rule.passed).length;

    let label = "Not started";

    if (value) {
      if (passedCount === rules.length) {
        label = "Strong";
      } else if (passedCount === 2) {
        label = "Good";
      } else {
        label = "Needs improvement";
      }
    }

    return {
      rules,
      passedCount,
      percentage: (passedCount / rules.length) * 100,
      label,
      complete: passedCount === rules.length,
    };
  }, [password]);

  const hasErrorsInCurrentStep = useMemo(() => {
    const fields = step === 1 ? getStepOneFields() : getStepTwoFields();

    return fields.some((field) => errors[field]);
  }, [errors, step]);

  const scrollToTop = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const validateStepOne = async () => {
    const isValid = await trigger(getStepOneFields());

    if (!isValid) return;

    setDirection(1);
    setStep(2);
    scrollToTop();
  };

  const goBack = () => {
    if (isSubmitting) return;

    setDirection(-1);
    setStep(1);
    scrollToTop();
  };

  const validateStepTwo = async () => {
    const isValid = await trigger(getStepTwoFields());

    if (!isValid) return;

    await handleSubmit(onSubmit)();
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("fullName", data.fullName.trim());
    formData.append("email", data.email.trim().toLowerCase());

    formData.append("mobileNumber", normalizeMobileNumber(data.mobileNumber));

    formData.append("password", data.password);
    formData.append("rollNumber", data.rollNumber.trim());
    formData.append("department", data.department);
    formData.append("gurdianName", data.gurdianName.trim());

    formData.append("gurdianMobile", normalizeMobileNumber(data.gurdianMobile));

    if (data.signature instanceof File) {
      formData.append("signature", data.signature);
    }

    /*
      API integration:
      await axios.post("/api/students/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    */
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    setValue("signature", file, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const mobileStartIcon = (
    <span
      className="
        flex items-center gap-2
        whitespace-nowrap
      "
      aria-hidden="true"
    >
      <Phone size={15} />

      <span className="h-4 w-px bg-border" />

      <span className="text-xs font-semibold text-ink-muted">+91</span>
    </span>
  );

  return (
    <motion.section
      {...motionProps}
      variants={cardAnimation}
      className="
        relative flex min-h-dvh w-full
        overflow-x-clip bg-cream
        px-4 py-4
        sm:px-6 sm:py-5
        lg:h-dvh lg:min-h-0 lg:overflow-hidden
      "
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          className="
            absolute -left-24 -top-24
            size-64 rounded-full
            bg-brand-100/30 blur-3xl
            sm:-left-32 sm:-top-32 sm:size-72
          "
          animate={{
            x: [0, 14, 0],
            y: [0, 10, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="
            absolute -bottom-24 -right-24
            size-64 rounded-full
            bg-brand-100/20 blur-3xl
            sm:-bottom-32 sm:-right-32 sm:size-72
          "
          animate={{
            x: [0, -14, 0],
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div
          className="
            absolute left-1/2 top-1/4
            size-40 -translate-x-1/2
            rounded-full bg-brand-100/10 blur-3xl
          "
        />
      </div>

      <div
        className="
          relative z-10 mx-auto grid w-full max-w-6xl
          min-w-0 flex-1 gap-5
          lg:grid-cols-[0.78fr_1.22fr]
          lg:items-center
        "
      >
        <motion.div
          variants={introAnimation}
          className="
            min-w-0
            lg:max-h-[calc(100dvh-2.5rem)]
            lg:overflow-hidden
          "
        >
          <motion.div
            whileHover={hoverLiftSmall}
            whileTap={tapScaleSmall}
            transition={transitions.spring}
            onClick={() => navigate("/")}
            className="
              flex size-11
              items-center justify-center
              rounded-xl border border-border
              bg-cream-soft/90
              shadow-sm backdrop-blur-sm
              hover:cursor-pointer
            "
          >
            <img
              src="/jgecLogo.png"
              alt="JGEC"
              className="size-8 object-contain"
            />
          </motion.div>

          <motion.p
            variants={formItemAnimation}
            custom={0}
            className="eyebrow mt-5"
          >
            Student access
          </motion.p>

          <motion.h1
            variants={formItemAnimation}
            custom={1}
            className="
              mt-2.5 max-w-md
              font-display text-3xl font-semibold
              leading-tight tracking-tight text-ink
              sm:text-4xl
            "
          >
            Create your internship portal account.
          </motion.h1>

          <motion.p
            variants={formItemAnimation}
            custom={2}
            className="
              mt-3 max-w-md
              text-sm leading-5 text-ink-muted
            "
          >
            Create your JGEC internship profile with your academic, contact,
            guardian, and signature details.
          </motion.p>

          <motion.div variants={sectionAnimation} className="mt-5 space-y-2.5">
            {[
              "Use your official college email address.",
              "Enter your roll number exactly as issued by JGEC.",
              "Upload a clear image of your signature.",
            ].map((item, index) => (
              <motion.div
                key={item}
                variants={formItemAnimation}
                custom={index}
                whileHover={hoverLiftSmall}
                className="
                  flex min-w-0
                  items-start gap-2.5
                  text-xs text-ink-muted
                "
              >
                <motion.span
                  variants={iconPop}
                  className="
                    mt-0.5 flex size-4 shrink-0
                    items-center justify-center
                    rounded-full bg-brand-100
                    text-brand-700
                  "
                >
                  <Check size={10} strokeWidth={2.5} />
                </motion.span>

                <span className="min-w-0">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={formItemAnimation}
            custom={4}
            className="mt-5 text-xs text-ink-muted"
          >
            Already registered?{" "}
            <Link
              to="/auth/login"
              className="
                font-semibold text-brand-700
                transition-colors
                hover:text-brand-800
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand-600
                focus-visible:ring-offset-2
              "
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>

        <motion.div
          variants={cardAnimation}
          className="
            min-w-0
            lg:max-h-[calc(100dvh-2.5rem)]
          "
        >
          <Card
            className="
              w-full min-w-0
              overflow-hidden
              rounded-2xl
              border-border/80
              bg-cream-soft/95
              shadow-card
              backdrop-blur-sm
            "
          >
            <Card.Header
              className="
                border-b border-border
                px-5 py-4
                sm:px-6 sm:py-5
              "
            >
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <Card.Title
                    className="
                      text-lg font-semibold
                      tracking-tight text-ink
                      sm:text-xl
                    "
                  >
                    Student registration
                  </Card.Title>

                  <Card.Description
                    className="
                      mt-1.5 max-w-2xl
                      text-xs leading-5 text-ink-muted
                      sm:text-sm
                    "
                  >
                    Complete the registration process by providing the required
                    details carefully.
                  </Card.Description>

                  <div
                    className="
                      mt-2.5 flex items-start gap-2
                      rounded-lg border border-amber-200/80
                      bg-amber-50/70 px-3 py-2
                      text-[10px] leading-4 text-amber-800
                      sm:text-[11px]
                    "
                  >
                    <span className="mt-0.5 shrink-0 font-semibold">
                      Important:
                    </span>

                    <span>
                      Please review your information carefully before
                      submitting. Some registration details cannot be changed
                      after account creation.
                    </span>
                  </div>
                </div>

                <div
                  className="
                    hidden shrink-0 rounded-full
                    border border-brand-200
                    bg-brand-50 px-3 py-1
                    text-[10px] font-semibold
                    uppercase tracking-wider
                    text-brand-700
                    sm:block
                  "
                >
                  Step {step}/2
                </div>
              </div>

              <div
                className="mt-4 flex min-w-0 items-center"
                aria-label={`Registration step ${step} of 2`}
              >
                {steps.map((item, index) => {
                  const isActive = step === item.id;
                  const isCompleted = step > item.id;

                  return (
                    <div
                      key={item.id}
                      className="flex min-w-0 flex-1 items-center"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isActive ? 1.04 : 1,
                          }}
                          transition={transitions.spring}
                          className={[
                            "flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                            isActive || isCompleted
                              ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                              : "border-border bg-cream text-ink-muted",
                          ].join(" ")}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isCompleted ? (
                              <motion.span
                                key="check"
                                variants={checkAnimation}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                              >
                                <Check size={13} />
                              </motion.span>
                            ) : (
                              <motion.span
                                key={`step-${item.id}`}
                                variants={iconPop}
                                initial="initial"
                                animate="animate"
                              >
                                {item.id}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <div className="hidden min-w-0 sm:block">
                          <p
                            className={[
                              "truncate text-[11px] font-semibold",
                              isActive || isCompleted
                                ? "text-ink"
                                : "text-ink-muted",
                            ].join(" ")}
                          >
                            {item.title}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-ink-muted">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {index < steps.length - 1 && (
                        <div className="mx-3 h-px min-w-4 flex-1 overflow-hidden bg-border">
                          <motion.div
                            initial={false}
                            animate={{
                              scaleX: step > item.id ? 1 : 0,
                            }}
                            transition={transitions.smooth}
                            style={{ originX: 0 }}
                            className="h-full origin-left bg-brand-700"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 sm:hidden">
                <div className="flex items-center justify-between text-[10px] text-ink-muted">
                  <span>Step {step} of 2</span>
                  <span>{step === 1 ? "50%" : "100%"}</span>
                </div>

                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
                  <motion.div
                    initial={false}
                    animate={{
                      width: step === 1 ? "50%" : "100%",
                    }}
                    transition={transitions.smooth}
                    className="h-full rounded-full bg-brand-700"
                  />
                </div>
              </div>
            </Card.Header>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Card.Content className="min-w-0 px-5 py-4 sm:px-6 sm:py-5">
                <AnimatePresence mode="wait" custom={direction} initial>
                  {step === 1 && (
                    <motion.div
                      key="step-one"
                      custom={direction}
                      variants={stepAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="min-w-0 space-y-5"
                    >
                      <motion.div variants={sectionAnimation}>
                        <p className="eyebrow">Personal details</p>

                        <div
                          className="
                            mt-3 grid min-w-0
                            gap-x-4 gap-y-3.5
                            sm:grid-cols-2
                          "
                        >
                          <Input
                            label="Full name"
                            placeholder="Your full name"
                            startIcon={<UserRound size={15} />}
                            className={inputClassName}
                            error={errors.fullName?.message}
                            {...register("fullName", {
                              required: "Full name is required.",
                              minLength: {
                                value: 2,
                                message:
                                  "Name must contain at least 2 characters.",
                              },
                              maxLength: {
                                value: 80,
                                message: "Name cannot exceed 80 characters.",
                              },
                              validate: (value) =>
                                /^[A-Za-z\s.'-]+$/.test(value.trim()) ||
                                "Please enter a valid name.",
                            })}
                          />

                          <Input
                            label="Email address"
                            type="email"
                            placeholder="you@jgec.ac.in"
                            startIcon={<Mail size={15} />}
                            description="Use your official college email."
                            className={inputClassName}
                            error={errors.email?.message}
                            {...register("email", {
                              required: "Email address is required.",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Enter a valid email address.",
                              },
                            })}
                          />

                          <Input
                            label="Mobile number"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            placeholder="98765 43210"
                            startIcon={mobileStartIcon}
                            className={mobileInputClassName}
                            error={errors.mobileNumber?.message}
                            {...register("mobileNumber", {
                              required: "Mobile number is required.",
                              setValueAs: (value) =>
                                value.replace(/\D/g, "").slice(0, 10),
                              validate: (value) =>
                                /^[6-9]\d{9}$/.test(value) ||
                                "Enter a valid 10-digit Indian mobile number.",
                            })}
                          />

                          <div className="min-w-0">
                            <Input
                              label="Password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              startIcon={<LockKeyhole size={15} />}
                              endIcon={
                                <motion.button
                                  type="button"
                                  whileTap={tapScaleSmall}
                                  onClick={() =>
                                    setShowPassword((visible) => !visible)
                                  }
                                  className="
                                    pointer-events-auto
                                    rounded-md p-1
                                    text-ink-muted
                                    transition-colors
                                    hover:text-ink
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-brand-600
                                  "
                                  aria-label={
                                    showPassword
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                >
                                  <AnimatePresence mode="wait" initial={false}>
                                    {showPassword ? (
                                      <motion.span
                                        key="eye-off"
                                        variants={iconPop}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        className="flex"
                                      >
                                        <EyeOff size={15} />
                                      </motion.span>
                                    ) : (
                                      <motion.span
                                        key="eye"
                                        variants={iconPop}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        className="flex"
                                      >
                                        <Eye size={15} />
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </motion.button>
                              }
                              description="Use 6–20 characters with letters and numbers."
                              className={inputClassName}
                              error={errors.password?.message}
                              {...register("password", {
                                required: "Password is required.",
                                minLength: {
                                  value: 6,
                                  message:
                                    "Password must contain at least 6 characters.",
                                },
                                maxLength: {
                                  value: 20,
                                  message:
                                    "Password cannot exceed 20 characters.",
                                },
                                validate: (value) =>
                                  (/[A-Za-z]/.test(value) &&
                                    /\d/.test(value)) ||
                                  "Password must contain at least one letter and one number.",
                              })}
                            />

                            <AnimatePresence initial={false}>
                              {password && (
                                <motion.div
                                  initial={{
                                    opacity: 0,
                                    height: 0,
                                    y: -4,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    height: "auto",
                                    y: 0,
                                  }}
                                  exit={{
                                    opacity: 0,
                                    height: 0,
                                    y: -4,
                                  }}
                                  transition={transitions.fast}
                                  className="overflow-hidden"
                                  aria-live="polite"
                                >
                                  <div className="mt-2 flex items-center gap-2">
                                    <div className="flex flex-1 gap-1">
                                      {[0, 1, 2].map((index) => (
                                        <motion.div
                                          key={index}
                                          initial={false}
                                          animate={{
                                            opacity:
                                              index < passwordState.passedCount
                                                ? 1
                                                : 0.25,
                                            scaleX:
                                              index < passwordState.passedCount
                                                ? 1
                                                : 0.7,
                                          }}
                                          transition={transitions.fast}
                                          className={[
                                            "h-1 flex-1 origin-left rounded-full",
                                            passwordState.complete
                                              ? "bg-brand-700"
                                              : "bg-ink-muted",
                                          ].join(" ")}
                                        />
                                      ))}
                                    </div>

                                    <motion.span
                                      key={passwordState.label}
                                      initial={{
                                        opacity: 0,
                                        y: -2,
                                      }}
                                      animate={{
                                        opacity: 1,
                                        y: 0,
                                      }}
                                      transition={transitions.fast}
                                      className={[
                                        "shrink-0 text-[10px] font-semibold",
                                        passwordState.complete
                                          ? "text-brand-700"
                                          : "text-ink-muted",
                                      ].join(" ")}
                                    >
                                      {passwordState.label}
                                    </motion.span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        variants={sectionAnimation}
                        className="border-t border-border pt-5"
                      >
                        <p className="eyebrow">Academic details</p>

                        <div
                          className="
                            mt-3 grid min-w-0
                            gap-x-4 gap-y-3.5
                            sm:grid-cols-2
                          "
                        >
                          <Input
                            label="Roll number"
                            placeholder="e.g. 23101106033"
                            className={inputClassName}
                            error={errors.rollNumber?.message}
                            {...register("rollNumber", {
                              required: "Roll number is required.",
                              minLength: {
                                value: 4,
                                message: "Enter a valid roll number.",
                              },
                              maxLength: {
                                value: 30,
                                message:
                                  "Roll number cannot exceed 30 characters.",
                              },
                              validate: (value) =>
                                /^[A-Za-z0-9-]+$/.test(value.trim()) ||
                                "Use only letters, numbers, and hyphens.",
                            })}
                          />

                          <Select
                            label="Department"
                            options={departmentOptions}
                            placeholder="Select your department"
                            className={inputClassName}
                            error={errors.department?.message}
                            {...register("department", {
                              required: "Please select your department.",
                            })}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step-two"
                      custom={direction}
                      variants={stepAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="min-w-0 space-y-5"
                    >
                      <motion.div variants={sectionAnimation}>
                        <p className="eyebrow">Guardian details</p>

                        <div
                          className="
                            mt-3 grid min-w-0
                            gap-x-4 gap-y-3.5
                            sm:grid-cols-2
                          "
                        >
                          <Input
                            label="Guardian name"
                            placeholder="Parent / guardian full name"
                            className={inputClassName}
                            error={errors.gurdianName?.message}
                            {...register("gurdianName", {
                              required: "Guardian name is required.",
                              minLength: {
                                value: 2,
                                message:
                                  "Guardian name must contain at least 2 characters.",
                              },
                              maxLength: {
                                value: 80,
                                message:
                                  "Guardian name cannot exceed 80 characters.",
                              },
                              validate: (value) =>
                                /^[A-Za-z\s.'-]+$/.test(value.trim()) ||
                                "Please enter a valid name.",
                            })}
                          />

                          <Input
                            label="Guardian mobile"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            placeholder="98765 43210"
                            startIcon={mobileStartIcon}
                            className={mobileInputClassName}
                            error={errors.gurdianMobile?.message}
                            {...register("gurdianMobile", {
                              required: "Guardian mobile number is required.",
                              setValueAs: (value) =>
                                value.replace(/\D/g, "").slice(0, 10),
                              validate: (value) =>
                                /^[6-9]\d{9}$/.test(value) ||
                                "Enter a valid 10-digit Indian mobile number.",
                            })}
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        variants={sectionAnimation}
                        className="border-t border-border pt-5"
                      >
                        <p className="eyebrow">Student signature</p>

                        <div className="mt-3 min-w-0">
                          <Input
                            label="Signature"
                            name="signature"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            startIcon={<FileSignature size={15} />}
                            description="PNG, JPG, or WebP. Maximum recommended size: 2 MB."
                            className={inputClassName}
                            error={errors.signature?.message}
                            onChange={handleSignatureChange}
                          />

                          <input
                            type="hidden"
                            {...register("signature", {
                              validate: (file) => {
                                if (!file) {
                                  return "Please upload your signature.";
                                }

                                if (!(file instanceof File)) {
                                  return "Please select a valid signature file.";
                                }

                                const allowedTypes = [
                                  "image/png",
                                  "image/jpeg",
                                  "image/webp",
                                ];

                                if (!allowedTypes.includes(file.type)) {
                                  return "Only PNG, JPG, and WebP images are allowed.";
                                }

                                if (file.size > 2 * 1024 * 1024) {
                                  return "Signature image must be smaller than 2 MB.";
                                }

                                return true;
                              },
                            })}
                          />

                          <AnimatePresence initial={false}>
                            {signature instanceof File && !errors.signature && (
                              <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={formItemAnimation}
                                className="mt-2.5 overflow-hidden"
                              >
                                <div
                                  className="
                                      flex min-w-0 items-center gap-2.5
                                      rounded-xl border border-brand-200
                                      bg-brand-50 px-3 py-2
                                    "
                                >
                                  <div
                                    className="
                                        flex size-7 shrink-0
                                        items-center justify-center
                                        rounded-md bg-white
                                        text-brand-700 shadow-sm
                                      "
                                  >
                                    <FileSignature size={14} />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[11px] font-medium text-brand-900">
                                      {signature.name}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-brand-700">
                                      {(signature.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>

                                  <motion.div
                                    variants={checkAnimation}
                                    initial="initial"
                                    animate="animate"
                                    className="shrink-0 text-brand-700"
                                  >
                                    <Check size={15} />
                                  </motion.div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      <motion.div
                        variants={sectionAnimation}
                        className="
                          rounded-xl border border-border
                          bg-cream px-4 py-2.5
                        "
                      >
                        <p className="text-[11px] font-medium text-ink">
                          Before you continue
                        </p>

                        <p className="mt-0.5 text-[10px] leading-4 text-ink-muted">
                          Make sure your academic information matches your JGEC
                          records. You will be able to submit your registration
                          after completing this step.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card.Content>

              <Card.Footer
                className="
                  flex-col gap-3
                  border-t border-border
                  px-5 py-3.5
                  sm:px-6
                "
              >
                <div
                  className="
                    flex w-full min-w-0
                    flex-col-reverse gap-2.5
                    sm:flex-row sm:items-center
                    sm:justify-between
                  "
                >
                  {step === 2 ? (
                    <motion.div
                      whileHover={hoverLiftSmall}
                      whileTap={tapScaleSmall}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        <ArrowLeft size={15} />
                        <span>Back</span>
                      </Button>
                    </motion.div>
                  ) : (
                    <div />
                  )}

                  {step === 1 ? (
                    <motion.div
                      whileHover={hoverLiftSmall}
                      whileTap={tapScaleSmall}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        type="button"
                        size="lg"
                        onClick={validateStepOne}
                        className="
                          w-full rounded-lg
                          bg-brand-700 text-white
                          shadow-sm
                          hover:bg-brand-800
                          focus-visible:ring-brand-600
                          sm:w-auto m-2
                        "
                      >
                        <span>Continue</span>

                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            repeatDelay: 1.5,
                            ease: "easeInOut",
                          }}
                          className="flex"
                        >
                          <ArrowRight size={16} aria-hidden="true" />
                        </motion.span>
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={hoverLiftSmall}
                      whileTap={tapScaleSmall}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        type="button"
                        size="lg"
                        onClick={validateStepTwo}
                        disabled={isSubmitting}
                        className="
                          w-full rounded-lg
                          bg-brand-700 text-white
                          shadow-sm
                          hover:bg-brand-800
                          focus-visible:ring-brand-600
                          sm:w-auto m-2
                        "
                      >
                        <span>
                          {isSubmitting
                            ? "Creating account..."
                            : "Create account"}
                        </span>

                        {isSubmitting ? (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="flex"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="32 20"
                              />
                            </svg>
                          </motion.span>
                        ) : (
                          <Check size={16} aria-hidden="true" />
                        )}
                      </Button>
                    </motion.div>
                  )}
                </div>

                <div className="flex min-h-4 w-full items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {hasErrorsInCurrentStep ? (
                      <motion.p
                        key="error-state"
                        {...motionProps}
                        variants={formItemAnimation}
                        className="text-center text-[10px] text-red-600"
                      >
                        Please review the highlighted fields before continuing.
                      </motion.p>
                    ) : (
                      <motion.p
                        key="normal-state"
                        {...motionProps}
                        variants={formItemAnimation}
                        className="
                          text-center text-[10px]
                          leading-4 text-ink-muted
                        "
                      >
                        By creating your account, you confirm that the
                        information provided is accurate.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </Card.Footer>
            </form>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Signup;
