import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button, Card, Input } from "../../Components";
import {
  cardAnimation,
  transitions,
  viewport,
} from "../../Animations/animations";
import useLogin from "../../Hooks/Auth/useLogin";
import { setAuth } from "../../Store/Slice/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { login, isLoading, error: loginError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setApiError("");

    try {
      const response = await login({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      const student = response?.data?.student;
      const accessToken = response?.data?.accessToken;

      if (!student || !accessToken) {
        throw new Error("Invalid login response from server.");
      }

      dispatch(
        setAuth({
          user: student,
          accessToken,
        }),
      );

      navigate("/students/dashboard", {
        replace: true,
      });
    } catch (error) {
      setApiError(error?.message || "Login failed. Please try again.");
    }
  };

  const displayedError = apiError || loginError?.message || "";

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={cardAnimation}
      transition={transitions.normal}
      className="
        relative flex min-h-dvh w-full
        items-center justify-center
        overflow-x-clip
        bg-cream
        px-4 py-6
        sm:px-6
      "
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute -left-32 -top-32
            h-72 w-72 rounded-full
            bg-brand-700/5 blur-3xl
          "
        />
        <div
          className="
            absolute -bottom-32 -right-32
            h-80 w-80 rounded-full
            bg-brand-700/5 blur-3xl
          "
        />
      </div>

      <motion.div
        variants={cardAnimation}
        viewport={viewport}
        className="relative z-10 w-full max-w-md"
      >
        <Card
          className="
            w-full overflow-hidden
            rounded-2xl
            border-border/80
            bg-cream-soft/95
            shadow-card
            backdrop-blur-sm
          "
        >
          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <div className="mb-7">
              <Card.Title className="text-2xl font-semibold tracking-tight text-ink">
                Welcome back
              </Card.Title>

              <Card.Description className="mt-2 text-sm leading-6 text-ink-muted">
                Sign in to your student account to continue to the internship
                portal.
              </Card.Description>
            </div>

            {displayedError && (
              <div
                className="
                  mb-5
                  rounded-lg
                  border border-red-200
                  bg-red-50
                  px-3.5 py-3
                  text-sm
                  text-red-600
                "
                role="alert"
              >
                {displayedError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <Input
                id="email"
                type="email"
                label="Email address"
                placeholder="Enter your email address"
                autoComplete="email"
                required
                startIcon={<Mail size={17} strokeWidth={1.8} />}
                error={errors?.email?.message}
                {...register("email", {
                  required: "Email address is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address.",
                  },
                })}
              />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                startIcon={<LockKeyhole size={17} strokeWidth={1.8} />}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="
                      flex h-8 w-8 items-center justify-center
                      rounded-md
                      text-ink-muted
                      transition-colors
                      hover:bg-black/5
                      hover:text-ink
                      focus:outline-none
                      focus:ring-2
                      focus:ring-brand-700/20
                    "
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} strokeWidth={1.8} />
                    ) : (
                      <Eye size={17} strokeWidth={1.8} />
                    )}
                  </button>
                }
                error={errors?.password?.message}
                {...register("password", {
                  required: "Password is required.",
                })}
              />

              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="
                      h-4 w-4
                      rounded
                      border-border
                      accent-brand-700
                      focus:ring-2
                      focus:ring-brand-700/20
                    "
                    {...register("rememberMe")}
                  />

                  <span className="text-xs font-medium text-ink-muted">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/auth/forgot-password"
                  className="
                    text-xs font-semibold
                    text-brand-700
                    transition-colors
                    hover:text-brand-800
                    hover:underline
                    underline-offset-4
                  "
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="
                  w-full
                  justify-center
                  gap-2
                "
              >
                {isLoading ? "Signing in..." : "Sign in"}

                {!isLoading && <ArrowRight size={17} strokeWidth={2} />}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />

              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Other access
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-2.5">
              <Link
                to="/auth/signup"
                className="
                  flex w-full items-center justify-center
                  gap-2 rounded-lg
                  border border-border
                  bg-transparent
                  px-4 py-2.5
                  text-sm font-semibold
                  text-ink
                  transition-all duration-150
                  hover:border-brand-700/30
                  hover:bg-brand-700/5
                  hover:text-brand-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-brand-700/20
                "
              >
                Create student account
                <ArrowRight size={16} strokeWidth={1.9} />
              </Link>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/auth/depttpo/login"
                  className="
                    flex items-center justify-center
                    rounded-lg
                    border border-border
                    bg-transparent
                    px-3 py-2.5
                    text-center text-xs font-semibold
                    text-ink-muted
                    transition-all duration-150
                    hover:border-brand-700/30
                    hover:bg-brand-700/5
                    hover:text-brand-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-brand-700/20
                  "
                >
                  Dept. TPO Login
                </Link>

                <Link
                  to="/auth/spoc/login"
                  className="
                    flex items-center justify-center
                    rounded-lg
                    border border-border
                    bg-transparent
                    px-3 py-2.5
                    text-center text-xs font-semibold
                    text-ink-muted
                    transition-all duration-150
                    hover:border-brand-700/30
                    hover:bg-brand-700/5
                    hover:text-brand-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-brand-700/20
                  "
                >
                  SPOC Login
                </Link>
              </div>
            </div>
          </div>

          <div
            className="
              border-t border-border/70
              bg-black/1.5
              px-5 py-3.5
              text-center
              sm:px-7
            "
          >
            <p className="text-[11px] leading-5 text-ink-muted">
              Student access is restricted to registered JGEC students.
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.section>
  );
};

export default Login;
