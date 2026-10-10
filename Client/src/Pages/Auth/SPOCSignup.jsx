import { useState, useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button, Card, Input, Select } from "../../Components";
import {
  pageAnimation,
  staggerContainer,
  fadeUp,
} from "../../Animations/animations";
import { useSpocRegistration } from "../../Services/Queries/spocAuth.queries";

const SPOCSignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    document.title = "SPOC Signup | JGEC Internship Management Portal";

    const description =
      "Sign up to the JGEC Internship Management Portal as a SPOC.";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.content = description;
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      spocId: "",
      email: "",
      mobile: "",
      department: "",
      password: "",
      confirmPassword: "",
    },
  });
  const password = watch("password");
  const { mutateAsync: registerSpoc, isPending } = useSpocRegistration();
  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: data.fullName.trim(),
        spocId: data.spocId.trim(),
        email: data.email.trim().toLowerCase(),
        mobile: data.mobile.trim(),
        department: data.department,
        password: data.password,
      };
      await registerSpoc(payload);
      navigate("/auth/spoc/login", {
        replace: true,
        state: {
          message: "SPOC account created successfully. Please sign in.",
        },
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to create SPOC account.";
      setError("root", {
        type: "server",
        message,
      });
    }
  };

  const departmentOptions = [
    {
      value: "CE",
      label: "Civil Engineering",
    },
    {
      value: "EE",
      label: "Electrical Engineering",
    },
    {
      value: "ME",
      label: "Mechanical Engineering",
    },
    {
      value: "CSE",
      label: "Computer Science & Engineering",
    },
    {
      value: "ECE",
      label: "Electronics & Communication Engineering",
    },
    {
      value: "IT",
      label: "Information Technology",
    },
  ];

  const inputClass =
    "border-border bg-(--color-cream-soft) text-ink " +
    "focus:border-(--color-brand-500) " +
    "focus:ring-(--color-brand-500)/20";

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-5 sm:px-6 lg:px-8">
        <motion.div
          variants={pageAnimation}
          initial="hidden"
          animate="visible"
          className="grid w-full overflow-hidden rounded-2xl border border-border bg-(--color-surface) shadow-(--shadow-card) lg:grid-cols-[0.85fr_1.15fr]"
        >
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

          <div className="flex items-center p-5 sm:p-7 lg:p-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mx-auto w-full max-w-2xl"
            >
              <motion.div variants={fadeUp} className="mb-6 px-1 sm:px-2">
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
                  Register as a Single Point of Contact.
                </p>
              </motion.div>

              <Card className="border-border bg-(--color-surface) shadow-none">
                <Card.Content className="mt-5 p-6 sm:p-7">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <div className="grid gap-5 sm:grid-cols-2">
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
                        className={inputClass}
                      />

                      <Input
                        label="SPOC ID"
                        placeholder="Enter SPOC ID"
                        startIcon={
                          <BadgeCheck className="h-4 w-4 text-ink-muted" />
                        }
                        required
                        error={errors.spocId?.message}
                        {...register("spocId", {
                          required: "SPOC ID is required",
                          minLength: {
                            value: 2,
                            message: "Enter a valid SPOC ID",
                          },
                        })}
                        className={inputClass}
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
                        className={inputClass}
                      />

                      <Input
                        label="Mobile number"
                        type="tel"
                        placeholder="10-digit mobile number"
                        startIcon={<Phone className="h-4 w-4 text-ink-muted" />}
                        required
                        error={errors.mobile?.message}
                        {...register("mobile", {
                          required: "Mobile number is required",
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message: "Enter a valid 10-digit number",
                          },
                        })}
                        className={inputClass}
                      />

                      <div className="sm:col-span-2">
                        <Select
                          label="Department"
                          required
                          options={departmentOptions}
                          placeholder="Select your department"
                          error={errors.department?.message}
                          {...register("department", {
                            required: "Department is required",
                          })}
                        />
                      </div>

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
                        className={inputClass}
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
                        className={inputClass}
                      />
                    </div>

                    {errors.root?.message && (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errors.root.message}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || isPending}
                      className="h-11 w-full bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-600"
                    >
                      {isSubmitting || isPending
                        ? "Creating account..."
                        : "Create SPOC account"}

                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </Card.Content>
              </Card>

              <p className="mt-5 text-center text-sm text-ink-muted">
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
