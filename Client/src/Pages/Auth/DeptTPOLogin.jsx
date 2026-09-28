import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../../Components/index";

const DeptTPOLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "College email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid college email.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Connect your login API here.
      await new Promise((resolve) => setTimeout(resolve, 700));

      navigate("/depttpo/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border bg-white shadow-card lg:grid-cols-[1fr_1.05fr]">
          {/* Branding */}
          <section className="hidden bg-brand-700 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                <LockKeyhole size={22} strokeWidth={1.8} />
              </div>

              <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                Internship Management Portal
              </p>

              <h1 className="mt-3 max-w-md text-3xl font-semibold leading-tight">
                Department TPO Portal
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
                Sign in to review student applications, manage internship
                deadlines, and forward approved applications to the central TPO.
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-5">
              <p className="text-xs leading-5 text-white/65">
                Access is restricted to registered Department TPO coordinators.
              </p>
            </div>
          </section>

          {/* Login form */}
          <section className="flex items-center p-5 sm:p-8 xl:p-10">
            <div className="mx-auto w-full max-w-md">
              <div>
                <p className="eyebrow">Department TPO</p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Sign in with your college email to continue.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
                noValidate
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    College email
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    />

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@college.edu"
                      autoComplete="email"
                      className="pl-10"
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-ink"
                    >
                      Password
                    </label>

                    <Link
                      to="/auth/dept-tpo/forgot-password"
                      className="text-xs font-medium text-brand-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="pl-10 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink focus:outline-none"
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
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full justify-center"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}

                  {!isSubmitting && <ArrowRight size={16} strokeWidth={1.8} />}
                </Button>
              </form>

              <div className="mt-7 border-t border-border pt-5 text-center">
                <p className="text-sm text-ink-muted">
                  Don't have an account?{" "}
                  <Link
                    to="/auth/depttpo/signup"
                    className="font-medium text-brand-700 hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DeptTPOLogin;
