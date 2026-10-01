import { useMemo } from "react";
import {
  Check,
  Eye,
  EyeOff,
  FileSignature,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Input, Select } from "../Components";

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

const passwordRules = [
  {
    id: "length",
    label: "8-20 characters",
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

// Password Strength Meter Component
const PasswordStrengthMeter = ({ password }) => {
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

  if (!password) return null;

  return (
    <div className="overflow-hidden" aria-live="polite">
      <div className="mt-2 flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={[
                "h-1 flex-1 origin-left rounded-full",
                passwordState.complete
                  ? "bg-brand-700"
                  : "bg-ink-muted",
              ].join(" ")}
              style={{
                opacity:
                  index < passwordState.passedCount ? 1 : 0.25,
                transform: `scaleX(${
                  index < passwordState.passedCount ? 1 : 0.7
                })`,
                transformOrigin: "left",
              }}
            />
          ))}
        </div>

        <span
          className={[
            "shrink-0 text-[10px] font-semibold",
            passwordState.complete
              ? "text-brand-700"
              : "text-ink-muted",
          ].join(" ")}
        >
          {passwordState.label}
        </span>
      </div>
    </div>
  );
};

// Step One Fields Component
export const StepOneFields = ({ register, errors, watch }) => {
  const showPassword = false; // Will be managed by parent
  const setShowPassword = () => {}; // Will be managed by parent
  const password = watch("password");

  return (
    <div className="min-w-0 space-y-5">
      <div>
        <p className="eyebrow">Personal details</p>

        <div className="mt-3 grid min-w-0 gap-x-4 gap-y-3.5 sm:grid-cols-2">
          <Input
            label="Full name"
            placeholder="Your full name"
            startIcon={<UserRound size={15} />}
            className="border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 focus:border-brand-600 focus:ring-brand-600/15"
            error={errors.fullName?.message}
            {...register("fullName", {
              required: "Full name is required.",
              minLength: {
                value: 2,
                message: "Name must contain at least 2 characters.",
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
            className="border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 focus:border-brand-600 focus:ring-brand-600/15"
            error={errors.email?.message}
            {...register("email", {
              required: "Email address is required.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
            startIcon={
              <span
                className="flex items-center gap-2 whitespace-nowrap"
                aria-hidden="true"
              >
                <Phone size={15} />
                <span className="h-4 w-px bg-border" />
                <span className="text-xs font-semibold text-ink-muted">
                  +91
                </span>
              </span>
            }
            className="border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 focus:border-brand-600 focus:ring-brand-600/15 pl-[5.75rem]"
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
                <button
                  type="button"
                  onClick={setShowPassword}
                  className="pointer-events-auto rounded-md p-1 text-ink-muted transition-colors hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              description="Use 6-20 characters with letters and numbers."
              className="border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 focus:border-brand-600 focus:ring-brand-600/15"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password must contain at least 6 characters.",
                },
                maxLength: {
                  value: 20,
                  message: "Password cannot exceed 20 characters.",
                },
                validate: (value) =>
                  (/[A-Za-z]/.test(value) && /\d/.test(value)) ||
                  "Password must contain at least one letter and one number.",
              })}
            />

            <PasswordStrengthMeter password={password} />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <p className="eyebrow">Academic details</p>

        <div className="mt-3 grid min-w-0 gap-x-4 gap-y-3.5 sm:grid-cols-2">
          <Input
            label="Roll number"
            placeholder="e.g. 23101106033"
            className="border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 focus:border-brand-600 focus:ring-brand-600/15"
            error={errors.rollNumber?.message}
            {...register("rollNumber", {
              required: "Roll number is required.",
              minLength: {
                value: 4,
                message: "Enter a valid roll number.",
              },
              maxLength: {
                value: 30,
                message: "Roll number cannot exceed 30 characters.",
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
            className="border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 focus:border-brand-600 focus:ring-brand-600/15"
            error={errors.department?.message}
            {...register("department", {
              required: "Please select your department.",
            })}
          />
        </div>
      </div>
    </div>
  );
};

// Step Two Fields Component
export const StepTwoFields = ({
  register,
  errors,
  watch,
  handleSignatureChange,
}) => {
  const signature = watch("signature");

  return (
    <div className="min-w-0 space-y-5">
      <div>
        <p className="eyebrow">Guardian details</p>

        <div className="mt-3 grid min-w-0 gap-x-4 gap-y-3.5 sm:grid-cols-2">
          <Input
            label="Guardian name"
            placeholder="Parent / guardian full name"
            className="border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 focus:border-brand-600 focus:ring-brand-600/15"
            error={errors.gurdianName?.message}
            {...register("gurdianName", {
              required: "Guardian name is required.",
              minLength: {
                value: 2,
                message: "Guardian name must contain at least 2 characters.",
              },
              maxLength: {
                value: 80,
                message: "Guardian name cannot exceed 80 characters.",
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
            startIcon={
              <span
                className="flex items-center gap-2 whitespace-nowrap"
                aria-hidden="true"
              >
                <Phone size={15} />
                <span className="h-4 w-px bg-border" />
                <span className="text-xs font-semibold text-ink-muted">
                  +91
                </span>
              </span>
            }
            className="border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 focus:border-brand-600 focus:ring-brand-600/15 pl-[5.75rem]"
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
      </div>

      <div className="border-t border-border pt-5">
        <p className="eyebrow">Student signature</p>

        <div className="mt-3 min-w-0">
          <Input
            label="Signature"
            name="signature"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            startIcon={<FileSignature size={15} />}
            description="PNG, JPG, or WebP. Maximum recommended size: 2 MB."
            className="border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 focus:border-brand-600 focus:ring-brand-600/15"
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

                const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

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

          {signature instanceof File && !errors.signature && (
            <div className="mt-2.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white text-brand-700 shadow-sm">
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

                <div className="shrink-0 text-brand-700">
                  <Check size={15} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-cream px-4 py-2.5">
        <p className="text-[11px] font-medium text-ink">Before you continue</p>

        <p className="mt-0.5 text-[10px] leading-4 text-ink-muted">
          Make sure your academic information matches your JGEC records. You
          will be able to submit your registration after completing this step.
        </p>
      </div>
    </div>
  );
};
