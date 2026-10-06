import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button, Card, Input } from "../../Components";
import {
  pageAnimation,
  staggerContainer,
  fadeUp,
} from "../../Animations/animations";
import { useSpocLogin } from "../../Services/Queries/spocAuth.queries";

const SPOCLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const { mutateAsync: loginSpoc } = useSpocLogin();
  const onSubmit = async (data) => {
    try {
      await loginSpoc({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      navigate("/spoc/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "SPOC login failed:",
        error?.response?.data?.message || error?.message,
      );
    }
  };

  const inputClass =
    "border-border bg-(--color-cream-soft) " +
    "text-ink " +
    "focus:border-(--color-brand-500) " +
    "focus:ring-(--color-brand-500)/20";

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          variants={pageAnimation}
          initial="hidden"
          animate="visible"
          className="grid w-full overflow-hidden rounded-2xl border border-border bg-(--color-surface) shadow-(--shadow-card) lg:grid-cols-2"
        >
          {/* Brand panel */}
          <div className="hidden bg-brand-900 p-10 text-(--color-cream-soft) lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
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

              <div className="mt-20 max-w-md">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-300">
                  SPOC Portal
                </p>

                <h1 className="font-display text-4xl leading-tight">
                  Welcome back.
                </h1>

                <p className="mt-5 text-sm leading-6 text-brand-100">
                  Sign in to manage internship coordination and placement
                  activities at JGEC.
                </p>
              </div>
            </div>

            <p className="text-xs text-brand-300">
              Training &amp; Placement Office
            </p>
          </div>

          {/* Login */}
          <div className="flex items-center p-5 sm:p-8 lg:p-12">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mx-auto w-full max-w-md"
            >
              <motion.div variants={fadeUp} className="mb-7">
                <div className="mb-4 flex items-center gap-3 lg:hidden">
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

                <p className="eyebrow mb-1">SPOC Login</p>

                <h2 className="font-display text-3xl font-semibold">
                  Sign in to your account
                </h2>

                <p className="mt-2 text-sm text-ink-muted">
                  Enter your SPOC credentials to continue.
                </p>
              </motion.div>

              <Card className="border-border bg-(--color-surface) shadow-none">
                <Card.Content className="mt-5 p-5 sm:p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email */}
                    <Input
                      label="Official email"
                      type="email"
                      placeholder="name@jgec.ac.in"
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
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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

                    {/* Remember / Forgot */}
                    <div className="flex items-center justify-between gap-3">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-border accent-brand-600"
                          {...register("rememberMe")}
                        />
                        Remember me
                      </label>

                      <Link
                        to="/auth/forgot-password"
                        className="text-sm font-medium text-brand-700 hover:text-brand-900"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit */}
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

              {/* Signup */}
              <p className="mt-5 text-center text-sm text-ink-muted">
                Don't have a SPOC account?{" "}
                <Link
                  to="/auth/spoc/signup"
                  className="font-semibold text-brand-700 hover:text-brand-900"
                >
                  Create account
                </Link>
              </p>

              {/* Other portals */}
              <div className="mt-5 flex justify-center gap-4 text-xs text-ink-muted">
                <Link
                  to="/auth/login"
                  className="transition-colors hover:text-brand-700"
                >
                  Student Login
                </Link>

                <span className="text-border">•</span>

                <Link
                  to="/auth/depttpo/login"
                  className="transition-colors hover:text-brand-700"
                >
                  DeptTPO Login
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default SPOCLogin;
