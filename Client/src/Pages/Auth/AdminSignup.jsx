import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../../Components/index";

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  adminKey: "",
  password: "",
  confirmPassword: "",
};

const AdminSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
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

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required.";
    } else if (form.name.trim().length < 3) {
      nextErrors.name = "Enter a valid full name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Admin email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      nextErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!form.adminKey.trim()) {
      nextErrors.adminKey = "Administrator authorization key is required.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
      // Connect admin signup API here.
      await new Promise((resolve) => setTimeout(resolve, 700));

      navigate("/auth/admin/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border bg-white shadow-card lg:grid-cols-[0.9fr_1.1fr]">
          {/* Branding panel */}
          <section className="hidden bg-brand-700 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div>
              <div className="flex size-11 items-center justify-center rounded-full bg-white">
                <img src="/jgecLogo.png" alt="JGEC logo" />
              </div>

              <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                Internship Management Portal
              </p>

              <h1 className="mt-3 max-w-md text-3xl font-semibold leading-tight">
                Create an administrator account.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
                Register an authorized administrator to manage the internship
                management portal and its institutional workflows.
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-5">
              <p className="text-xs leading-5 text-white/65">
                Administrator registration requires an authorized portal
                registration key.
              </p>
            </div>
          </section>

          {/* Signup form */}
          <section className="p-5 sm:p-8 xl:p-10">
            <div className="mx-auto w-full max-w-xl">
              <div>
                <p className="eyebrow">Portal Administration</p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Create account
                </h2>

                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Enter your details to register as a portal administrator.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
                noValidate
              >
                {/* Full name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Full name
                  </label>

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    startIcon={<UserRound size={17} strokeWidth={1.8} />}
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email + Mobile */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-ink"
                    >
                      Admin email
                    </label>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@college.edu"
                      autoComplete="email"
                      startIcon={<Mail size={17} strokeWidth={1.8} />}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="mb-1.5 block text-sm font-medium text-ink"
                    >
                      Mobile number
                    </label>

                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      startIcon={<Phone size={17} strokeWidth={1.8} />}
                    />

                    {errors.mobile && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                {/* Admin authorization key */}
                <div>
                  <label
                    htmlFor="adminKey"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Administrator authorization key
                  </label>

                  <Input
                    id="adminKey"
                    name="adminKey"
                    type={showAdminKey ? "text" : "password"}
                    value={form.adminKey}
                    onChange={handleChange}
                    placeholder="Enter authorization key"
                    autoComplete="off"
                    startIcon={<KeyRound size={17} strokeWidth={1.8} />}
                    endIcon={
                      <button
                        type="button"
                        onClick={() => setShowAdminKey((value) => !value)}
                        className="pointer-events-auto text-ink-muted transition hover:text-ink focus:outline-none"
                        aria-label={
                          showAdminKey
                            ? "Hide authorization key"
                            : "Show authorization key"
                        }
                      >
                        {showAdminKey ? (
                          <EyeOff size={17} strokeWidth={1.8} />
                        ) : (
                          <Eye size={17} strokeWidth={1.8} />
                        )}
                      </button>
                    }
                  />

                  {errors.adminKey && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.adminKey}
                    </p>
                  )}
                </div>

                {/* Passwords */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium text-ink"
                    >
                      Password
                    </label>

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      startIcon={<LockKeyhole size={17} strokeWidth={1.8} />}
                      endIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="pointer-events-auto text-ink-muted transition hover:text-ink focus:outline-none"
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
                    />

                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1.5 block text-sm font-medium text-ink"
                    >
                      Confirm password
                    </label>

                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      startIcon={<LockKeyhole size={17} strokeWidth={1.8} />}
                      endIcon={
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((value) => !value)
                          }
                          className="pointer-events-auto text-ink-muted transition hover:text-ink focus:outline-none"
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} strokeWidth={1.8} />
                          ) : (
                            <Eye size={17} strokeWidth={1.8} />
                          )}
                        </button>
                      }
                    />

                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full justify-center"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}

                  {!isSubmitting && <ArrowRight size={16} strokeWidth={1.8} />}
                </Button>
              </form>

              <div className="mt-6 border-t border-border pt-5 text-center">
                <p className="text-sm text-ink-muted">
                  Already have an administrator account?{" "}
                  <Link
                    to="/auth/admin/login"
                    className="font-medium text-brand-700 hover:underline"
                  >
                    Sign in
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

export default AdminSignup;
