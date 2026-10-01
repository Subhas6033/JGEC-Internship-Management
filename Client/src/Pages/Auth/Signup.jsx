import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  StepIndicator,
  StepOneFields,
  StepTwoFields,
} from "../../Components";
import { normalizeMobileNumber } from "../../Utils/normalizeMobileNumber";
import {
  cardAnimation,
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
import useSignup from "../../Hooks/Auth/useSignup";
import { useDispatch } from "react-redux";
import { setUser } from "../../Store/Slice/authSlice";

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

const Signup = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: registerStudent, isPending, error } = useSignup();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
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

  // signature is watched but used only in StepTwoFields component

  const scrollToTop = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const validateStepOne = async () => {
    const isValid = await trigger([
      "fullName",
      "email",
      "mobileNumber",
      "password",
      "rollNumber",
      "department",
    ]);

    if (!isValid) return;

    setDirection(1);
    setStep(2);
    scrollToTop();
  };

  const goBack = () => {
    setDirection(-1);
    setStep(1);
    scrollToTop();
  };

  const validateStepTwo = async () => {
    const isValid = await trigger([
      "gurdianName",
      "gurdianMobile",
      "signature",
    ]);

    if (!isValid) return;

    handleSubmit(onSubmit)();
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

    try {
      const response = await registerStudent(formData).unwrap();

      if (response?.data?.student) {
        dispatch(setUser(response.data.student));
        navigate("/students/dashboard", { replace: true });
      }
    } catch {
      // Error is handled by the mutation's onError
    }
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    setValue("signature", file, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const hasErrorsInCurrentStep = (() => {
    const stepOneFields = [
      "fullName",
      "email",
      "mobileNumber",
      "password",
      "rollNumber",
      "department",
    ];
    const stepTwoFields = ["gurdianName", "gurdianMobile", "signature"];

    const fields = step === 1 ? stepOneFields : stepTwoFields;
    return fields.some((field) => errors[field]);
  })();

  const mobileStartIcon = (
    <span
      className="flex items-center gap-2 whitespace-nowrap"
      aria-hidden="true"
    >
      <svg
        size={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
      <span className="h-4 w-px border-border" />
      <span className="text-xs font-semibold text-ink-muted">+91</span>
    </span>
  );

  return (
    <motion.section
      {...motionProps}
      variants={cardAnimation}
      className="relative flex min-h-dvh w-full overflow-x-clip bg-cream px-4 py-4 sm:px-6 sm:py-5 lg:h-dvh lg:min-h-0 lg:overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          className="absolute -left-24 -top-24 size-64 rounded-full bg-brand-100/30 blur-3xl sm:-left-32 sm:-top-32 sm:size-72"
          animate={{ x: [0, 14, 0], y: [0, 10, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 size-64 rounded-full bg-brand-100/20 blur-3xl sm:-bottom-32 sm:-right-32 sm:size-72"
          animate={{ x: [0, -14, 0], y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-1/2 top-1/4 size-40 -translate-x-1/2 rounded-full bg-brand-100/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl min-w-0 flex-1 gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        {/* Left side - Info */}
        <motion.div
          variants={introAnimation}
          className="min-w-0 lg:max-h-[calc(100dvh-2.5rem)] lg:overflow-hidden"
        >
          <motion.div
            whileHover={hoverLiftSmall}
            whileTap={tapScaleSmall}
            transition={transitions.spring}
            onClick={() => navigate("/")}
            className="flex size-11 items-center justify-center rounded-xl border border-border bg-cream-soft/90 shadow-sm backdrop-blur-sm hover:cursor-pointer"
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
            className="mt-2.5 max-w-md font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl"
          >
            Create your internship portal account.
          </motion.h1>

          <motion.p
            variants={formItemAnimation}
            custom={2}
            className="mt-3 max-w-md text-sm leading-5 text-ink-muted"
          >
            Create your JGEC internship profile with your academic, contact,
            guardian, and signature details.
          </motion.p>

          {/* Error message display */}
          {error && (
            <motion.div
              variants={formItemAnimation}
              custom={3}
              initial="hidden"
              animate="visible"
              className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] leading-4 text-red-800"
            >
              <p className="font-semibold">Registration Failed</p>
              <p className="mt-0.5">
                {error.message ||
                  "An error occurred during registration. Please try again."}
              </p>
            </motion.div>
          )}

          <motion.div variants={sectionAnimation} className="mt-5 space-y-2.5">
            {[
              "Use your official college email address.",
              "Enter your roll number exactly as issued by JGEC.",
              "Upload a clear image of your signature.",
            ].map((item, index) => (
              <motion.div
                key={item}
                variants={formItemAnimation}
                custom={index + 1}
                whileHover={hoverLiftSmall}
                className="flex min-w-0 items-start gap-2.5 text-xs text-ink-muted"
              >
                <motion.span
                  variants={iconPop}
                  className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700"
                >
                  <svg
                    size={10}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
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
              className="font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          variants={cardAnimation}
          className="min-w-0 lg:max-h-[calc(100dvh-2.5rem)]"
        >
          <Card className="w-full min-w-0 overflow-hidden rounded-2xl border-border/80 bg-cream-soft/95 shadow-card backdrop-blur-sm">
            <Card.Header className="border-b border-border px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <Card.Title className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                    Student registration
                  </Card.Title>
                  <Card.Description className="mt-1.5 max-w-2xl text-xs leading-5 text-ink-muted sm:text-sm">
                    Complete the registration process by providing the required
                    details carefully.
                  </Card.Description>

                  <div className="mt-2.5 flex items-start gap-2.5 rounded-lg border border-amber-200/80 bg-amber-50/70 px-3 py-2 text-[10px] leading-4 text-amber-800 sm:text-[11px]">
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

                <div className="hidden shrink-0 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-700 sm:block">
                  Step {step}/2
                </div>
              </div>

              <StepIndicator currentStep={step} steps={steps} />

              <div className="mt-3 sm:hidden">
                <div className="flex items-center justify-between text-[10px] text-ink-muted">
                  <span>Step {step} of 2</span>
                  <span>{step === 1 ? "50%" : "100%"}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
                  <motion.div
                    initial={false}
                    animate={{ width: step === 1 ? "50%" : "100%" }}
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
                      <StepOneFields
                        register={register}
                        errors={errors}
                        trigger={trigger}
                        watch={watch}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        mobileStartIcon={mobileStartIcon}
                      />
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
                      <StepTwoFields
                        register={register}
                        errors={errors}
                        watch={watch}
                        handleSignatureChange={handleSignatureChange}
                        mobileStartIcon={mobileStartIcon}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card.Content>

              <Card.Footer className="flex-col gap-3 border-t border-border px-5 py-3.5 sm:px-6">
                <div className="flex w-full min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
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
                        disabled={isPending}
                        className="w-full sm:w-auto"
                      >
                        <svg
                          size={15}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M19 12H5m7 7l-7-7 7-7" />
                        </svg>
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
                        className="w-full rounded-lg bg-brand-700 text-white shadow-sm hover:bg-brand-800 focus-visible:ring-brand-600 sm:w-auto m-2"
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
                          <svg
                            size={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
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
                        disabled={isPending}
                        className="w-full rounded-lg bg-brand-700 text-white shadow-sm hover:bg-brand-800 focus-visible:ring-brand-600 sm:w-auto m-2"
                      >
                        <span>
                          {isPending ? "Creating account..." : "Create account"}
                        </span>
                        {isPending ? (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="flex"
                          >
                            <Check className="size-5" />
                          </motion.span>
                        ) : (
                          <svg
                            size={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
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
                    ) : error ? (
                      <motion.p
                        key="api-error"
                        {...motionProps}
                        variants={formItemAnimation}
                        className="text-center text-[10px] text-red-600"
                      >
                        {error.message ||
                          "Registration failed. Please try again."}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="normal-state"
                        {...motionProps}
                        variants={formItemAnimation}
                        className="text-center text-[10px] leading-4 text-ink-muted"
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
