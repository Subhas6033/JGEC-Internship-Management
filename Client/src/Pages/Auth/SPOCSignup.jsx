import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import { Button, Card, Input } from "../../Components";
import {
  pageAnimation,
  staggerContainer,
  fadeUp,
} from "../../Animations/animations";

const SPOCSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      employeeId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    console.log("SPOC signup:", data);

    // API integration can be added here.
    // Example:
    // await axios.post("/api/spoc/register", data);
  };

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-5 sm:px-6 lg:px-8">
        <motion.div
          variants={pageAnimation}
          initial="hidden"
          animate="visible"
          className="grid w-full overflow-hidden rounded-2xl border border-border bg-(--color-surface) shadow-(--shadow-card) lg:grid-cols-[0.85fr_1.15fr]"
        >
          {/* Left section */}
          <div className="hidden bg-brand-900 p-8 text-(--color-cream-soft) lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <img
                  src="/jgecLogo.png"
                  alt="JGEC"
                  className="h-11 w-11 rounded-full bg-(--color-cream-soft) object-contain p-1.5"
                />

                <div>
                  <p className="font-display text-xl font-semibold">JGEC</p>
                  <p className="text-xs text-brand-200">
                    Internship Management Portal
                  </p>
                </div>
              </div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-300">
                SPOC Access
              </p>

              <h1 className="max-w-md font-display text-4xl leading-tight">
                Create your SPOC account.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-brand-100">
                Manage internship activities, coordinate placement operations,
                and connect students with opportunities through the JGEC portal.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Manage internship activities",
                "Coordinate with companies",
                "Track student placements",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-brand-100"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-700">
                    <BadgeCheck className="h-3.5 w-3.5 text-brand-200" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Signup form */}
          <div className="flex items-center p-5 sm:p-7 lg:p-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mx-auto w-full max-w-2xl"
            >
              <motion.div variants={fadeUp} className="mb-5">
                <div className="mb-3 flex items-center gap-3 lg:hidden">
                  <img
                    src="/jgecLogo.png"
                    alt="JGEC"
                    className="h-9 w-9 object-contain"
                  />

                  <div>
                    <p className="font-display text-lg font-semibold">JGEC</p>
                    <p className="text-[10px] text-ink-muted">
                      Internship Management Portal
                    </p>
                  </div>
                </div>

                <p className="eyebrow mb-1">SPOC Registration</p>

                <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                  Create your account
                </h2>

                <p className="mt-1.5 text-sm text-ink-muted">
                  Register as a Training & Placement Officer.
                </p>
              </motion.div>

              <Card className="border-border bg-(--color-surface) shadow-none">
                <Card.Content className="p-5 sm:p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Full name"
                        placeholder="Enter your full name"
                        startIcon={
                          <UserRound className="h-4 w-4 text-ink-muted" />
                        }
                        required
                        error={errors.fullName?.message}
                        {...register("fullName", {
                          required: "Full name is required",
                          minLength: {
                            value: 3,
                            message: "Enter at least 3 characters",
                          },
                        })}
                        className="border-border bg-(--color-cream-soft) text-ink focus:border-(--color-brand-500) focus:ring-(--color-brand-500)/20"
                      />

                      <Input
                        label="Employee ID"
                        placeholder="Enter employee ID"
                        startIcon={
                          <BadgeCheck className="h-4 w-4 text-ink-muted" />
                        }
                        required
                        error={errors.employeeId?.message}
                        {...register("employeeId", {
                          required: "Employee ID is required",
                          minLength: {
                            value: 2,
                            message: "Enter a valid employee ID",
                          },
                        })}
                        className="border-border bg-(--color-cream-soft) text-ink focus:border-(--color-brand-500) focus:ring-(--color-brand-500)/20"
                      />

                      <Input
                        label="Official email"
                        type="email"
                        placeholder="name@jgec.ac.in"
                        startIcon={<Mail className="h-4 w-4 text-ink-muted" />}
                        required
                        error={errors.email?.message}
                        {...register("email", {
                          required: "Official email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                          },
                        })}
                        className="border-border bg-(--color-cream-soft) text-ink focus:border-(--color-brand-500) focus:ring-(--color-brand-500)/20"
                      />

                      <Input
                        label="Mobile number"
                        type="tel"
                        placeholder="10-digit mobile number"
                        startIcon={<Phone className="h-4 w-4 text-ink-muted" />}
                        required
                        error={errors.mobileNumber?.message}
                        {...register("mobileNumber", {
                          required: "Mobile number is required",
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message: "Enter a valid 10-digit number",
                          },
                        })}
                        className="border-border bg-(--color-cream-soft) text-ink focus:border-(--color-brand-500) focus:ring-(--color-brand-500)/20"
                      />

                      <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
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
                        error={errors.password?.message}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          maxLength: {
                            value: 20,
                            message: "Password must be at most 20 characters",
                          },
                          pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                            message: "Use at least one letter and one number",
                          },
                        })}
                        className="border-border bg-(--color-cream-soft) text-ink focus:border-(--color-brand-500) focus:ring-(--color-brand-500)/20"
                      />

                      <Input
                        label="Confirm password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        startIcon={
                          <LockKeyhole className="h-4 w-4 text-ink-muted" />
                        }
                        endIcon={
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((value) => !value)
                            }
                            className="pointer-events-auto rounded p-1 text-ink-muted transition-colors hover:text-brand-700"
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                        required
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                        className="border-border bg-(--color-cream-soft) text-ink focus:border-(--color-brand-500) focus:ring-(--color-brand-500)/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="h-11 w-full bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-600"
                    >
                      {isSubmitting
                        ? "Creating account..."
                        : "Create SPOC account"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </Card.Content>
              </Card>

              <p className="mt-4 text-center text-sm text-ink-muted">
                Already have a SPOC account?{" "}
                <Link
                  to="/auth/spoc/login"
                  className="font-semibold text-brand-700 hover:text-brand-900"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default SPOCSignup;
