import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button, Card, Input } from "../../index";
import { OTPVerificationModal } from "../OTP/OTPVerificationModal";
import {
  pageAnimation,
  staggerContainer,
  fadeUp,
} from "../../../Animations/animations";

const LoginForm = ({
  role = "User",
  portalName = "JGEC",
  portalSubtitle = "Internship Management Portal",
  portalDescription = "Sign in to access the JGEC Internship Management Portal.",

  title = "Sign in to your account",
  subtitle = "Enter your credentials to continue.",

  emailLabel = "Official email",
  emailPlaceholder = "name@jgec.ac.in",

  passwordLabel = "Password",
  passwordPlaceholder = "Enter your password",

  forgotPasswordLink = "/auth/forgot-password",
  showRememberMe = true,

  signup = null,
  footerLinks = [],

  pageTitle = "Login | JGEC Internship Management Portal",
  metaDescription = "Sign in to the JGEC Internship Management Portal.",

  // Parent handles login API.
  onSubmit,

  // OTP configuration supplied by parent.
  otp = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Update document metadata.
  useEffect(() => {
    document.title = pageTitle;

    let metaDescriptionTag = document.querySelector('meta[name="description"]');

    if (!metaDescriptionTag) {
      metaDescriptionTag = document.createElement("meta");
      metaDescriptionTag.name = "description";
      document.head.appendChild(metaDescriptionTag);
    }

    metaDescriptionTag.content = metaDescription;
  }, [pageTitle, metaDescription]);

  const inputClass =
    "border-border bg-(--color-cream-soft) " +
    "text-ink " +
    "focus:border-(--color-brand-500) " +
    "focus:ring-(--color-brand-500)/20";

  // Parent handles authentication and OTP initiation.
  const submitHandler = async (data) => {
    clearErrors("root");

    try {
      await onSubmit(data, { setError });
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to sign in. Please try again.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          variants={pageAnimation}
          initial="hidden"
          animate="visible"
          className="grid w-full overflow-hidden rounded-2xl border border-border bg-(--color-surface) shadow-(--shadow-card) lg:grid-cols-2"
        >
          {/* Desktop Branding Section */}

          <div className="hidden bg-brand-900 p-10 text-(--color-cream-soft) lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/jgecLogo.png"
                  alt="JGEC"
                  className="h-11 w-11 rounded-full bg-(--color-cream-soft) object-contain p-1.5"
                />

                <div>
                  <p className="font-display text-xl font-semibold">
                    {portalName}
                  </p>

                  <p className="text-xs text-brand-200">{portalSubtitle}</p>
                </div>
              </div>

              <div className="mt-20 max-w-md">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-300">
                  {role} Portal
                </p>

                <h1 className="font-display text-4xl leading-tight">
                  Welcome back.
                </h1>

                <p className="mt-5 text-sm leading-6 text-brand-100">
                  {portalDescription}
                </p>
              </div>
            </div>

            <p className="text-xs text-brand-300">
              Training & Placement Office
            </p>
          </div>

          {/* Login Form Section */}

          <div className="flex items-center p-5 sm:p-8 lg:p-12">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mx-auto w-full max-w-md"
            >
              {/* Heading */}

              <motion.div variants={fadeUp} className="mb-7">
                <div className="mb-4 flex items-center gap-3 lg:hidden">
                  <img
                    src="/jgecLogo.png"
                    alt="JGEC"
                    className="h-9 w-9 object-contain"
                  />

                  <div>
                    <p className="font-display text-lg font-semibold">
                      {portalName}
                    </p>

                    <p className="text-[10px] text-ink-muted">
                      {portalSubtitle}
                    </p>
                  </div>
                </div>

                <p className="eyebrow mb-1">{role} Login</p>

                <h2 className="font-display text-3xl font-semibold">{title}</h2>

                <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
              </motion.div>

              {/* Form Card */}

              <Card className="border-border bg-(--color-surface) shadow-none">
                <Card.Content className="mt-5 p-5 sm:p-6">
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="space-y-5"
                  >
                    {/* Email */}

                    <Input
                      label={emailLabel}
                      type="email"
                      placeholder={emailPlaceholder}
                      startIcon={<Mail className="h-4 w-4 text-ink-muted" />}
                      required
                      error={errors?.email?.message}
                      {...register("email", {
                        required: "Official email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      className={inputClass}
                    />

                    {/* Password */}

                    <Input
                      label={passwordLabel}
                      type={showPassword ? "text" : "password"}
                      placeholder={passwordPlaceholder}
                      startIcon={
                        <LockKeyhole className="h-4 w-4 text-ink-muted" />
                      }
                      endIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="pointer-events-auto rounded p-1 text-ink-muted transition-colors hover:text-brand-700"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                      required
                      error={errors?.password?.message}
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className={inputClass}
                    />

                    {/* Remember Me / Forgot Password */}

                    <div className="flex items-center justify-between gap-3">
                      {showRememberMe && (
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border accent-brand-600"
                            {...register("rememberMe")}
                          />
                          Remember me
                        </label>
                      )}

                      {forgotPasswordLink && (
                        <Link
                          to={forgotPasswordLink}
                          className="text-sm font-medium text-brand-700 hover:text-brand-900"
                        >
                          Forgot password?
                        </Link>
                      )}
                    </div>

                    {/* Server Error */}

                    {errors?.root?.message && (
                      <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        {errors.root.message}
                      </div>
                    )}

                    {/* Submit Button */}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="h-11 w-full bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-600"
                    >
                      {isSubmitting ? "Signing in..." : "Sign in"}

                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </Card.Content>
              </Card>

              {/* Signup Link */}

              {signup && (
                <p className="mt-5 text-center text-sm text-ink-muted">
                  {signup.text}{" "}
                  <Link
                    to={signup.to}
                    className="font-semibold text-brand-700 hover:text-brand-900"
                  >
                    {signup.label}
                  </Link>
                </p>
              )}

              {/* Other Login Pages */}

              {footerLinks.length > 0 && (
                <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-ink-muted">
                  {footerLinks.map((item, index) => (
                    <span key={item.to} className="flex items-center gap-4">
                      {index > 0 && <span className="text-border">•</span>}

                      <Link
                        to={item.to}
                        className="transition-colors hover:text-brand-700"
                      >
                        {item.label}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Centralized OTP Verification Modal */}

      {otp && (
        <OTPVerificationModal
          open={Boolean(otp.open)}
          email={otp.email}
          role={otp.role || role}
          onClose={otp.onClose}
          onVerify={otp.onVerify}
          onResend={otp.onResend}
          isVerifying={Boolean(otp.isVerifying)}
          isResending={Boolean(otp.isResending)}
          error={otp.error || ""}
          resendDelay={otp.resendDelay ?? 30}
        />
      )}
    </main>
  );
};

export { LoginForm };
