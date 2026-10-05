import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  IdCardLanyard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Select } from "../../Components/index";
import { useRegisterTPO } from "../../Hooks/Auth/useTPOAuth";

const departments = [
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

const initialForm = {
  fullName: "",
  email: "",
  mobile: "",
  department: "",
  tpoId: "",
  password: "",
};

const DeptTPOSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showTpoId, setShowTpoId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerMutation = useRegisterTPO();

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

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Name is required.";
    } else if (form.fullName.trim().length < 3) {
      nextErrors.fullName = "Enter a valid name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "College email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid college email.";
    }

    if (!form.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      nextErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!form.department) {
      nextErrors.department = "Select your department.";
    }

    if (!form.tpoId.trim()) {
      nextErrors.tpoId = "TPO ID is required.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
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
      await registerMutation.mutateAsync({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        department: form.department,
        tpoId: form.tpoId.trim().toUpperCase(),
        password: form.password,
      });

      navigate("/auth/depttpo/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Unable to create your account.";

      setErrors({
        submit: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border bg-white shadow-card lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden bg-brand-700 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div>
              <div className="flex size-11 items-center justify-center rounded-full bg-white">
                <img src="/jgecLogo.png" alt="college logo" />
              </div>

              <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                Department TPO
              </p>

              <h1 className="mt-3 max-w-md text-3xl font-semibold leading-tight">
                Create your Department TPO account.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
                Register your department coordinator account to review, manage,
                and process student internship applications.
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-5">
              <p className="text-xs leading-5 text-white/65">
                Use your official college email address to create your
                Department TPO account.
              </p>
            </div>
          </section>

          <section className="p-5 sm:p-8 xl:p-10">
            <div className="mx-auto w-full max-w-xl">
              <div>
                <p className="eyebrow">Department TPO</p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Create account
                </h2>

                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Enter your details to register as a department TPO.
                </p>
              </div>

              {errors.submit && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errors.submit}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
                noValidate
              >
                <div>
                  <Input
                    label="Full Name"
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    startIcon={<UserRound size={17} strokeWidth={1.8} />}
                  />

                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Input
                      label="College email"
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@college.edu"
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
                    <Input
                      label="Mobile number"
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
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

                <div>
                  <Select
                    label="Department"
                    id="department"
                    name="department"
                    required
                    value={form.department}
                    onChange={handleChange}
                    options={departments}
                    placeholder="Select your department"
                  />

                  {errors.department && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Input
                      label="TPO ID"
                      id="tpoId"
                      name="tpoId"
                      required
                      type={showTpoId ? "text" : "password"}
                      value={form.tpoId}
                      onChange={handleChange}
                      placeholder="Enter your TPO ID"
                      autoComplete="username"
                      startIcon={<IdCardLanyard size={17} strokeWidth={1.8} />}
                      endIcon={
                        <button
                          type="button"
                          onClick={() => setShowTpoId((value) => !value)}
                          className="text-ink-muted transition hover:text-ink focus:outline-none"
                          aria-label={showTpoId ? "Hide TPO ID" : "Show TPO ID"}
                        >
                          {showTpoId ? (
                            <EyeOff size={17} strokeWidth={1.8} />
                          ) : (
                            <Eye size={17} strokeWidth={1.8} />
                          )}
                        </button>
                      }
                    />

                    {errors.tpoId && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.tpoId}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Password"
                      id="password"
                      name="password"
                      required
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
                          className="text-ink-muted transition hover:text-ink focus:outline-none"
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
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting || registerMutation.isPending}
                  className="w-full justify-center"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}

                  {!isSubmitting && <ArrowRight size={16} strokeWidth={1.8} />}
                </Button>
              </form>

              <div className="mt-6 border-t border-border pt-5 text-center">
                <p className="text-sm text-ink-muted">
                  Already have a Department TPO account?{" "}
                  <Link
                    to="/auth/depttpo/login"
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

export default DeptTPOSignup;
