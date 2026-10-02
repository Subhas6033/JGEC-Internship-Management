import {
  Eye,
  EyeOff,
  FileSignature,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { Input, Select } from "./index";

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

const inputClassName = `
  h-12
  border-border
  bg-cream-soft
  text-ink
  placeholder:text-ink-muted/60
  focus:border-brand-600
  focus:ring-brand-600/15
`;

const StepOneFields = ({
  register,
  errors,
  watch,
  showPassword,
  setShowPassword,
}) => {
  const password = watch("password") || "";

  const passwordHasLowercase = /[a-z]/.test(password);

  const passwordHasUppercase = /[A-Z]/.test(password);

  const passwordHasNumber = /\d/.test(password);

  const passwordHasSpecial = /[@$!%*?&]/.test(password);

  const passwordHasLength = password.length >= 6 && password.length <= 20;

  return (
    <div className="space-y-6">
      {/* PERSONAL DETAILS */}

      <section>
        <p className="eyebrow">Personal details</p>

        <div
          className="
            mt-4
            grid
            gap-4
            sm:grid-cols-2
          "
        >
          {/* Full Name */}

          <Input
            label="Full name"
            placeholder="Your full name"
            icon={UserRound}
            className={inputClassName}
            {...register("fullName", {
              required: "Full name is required.",
              maxLength: {
                value: 50,
                message: "Full name cannot exceed 50 characters.",
              },
            })}
            error={errors.fullName?.message}
          />

          {/* Email */}

          <Input
            label="Email address"
            type="email"
            placeholder="you@jgec.ac.in"
            icon={Mail}
            className={inputClassName}
            {...register("email", {
              required: "Email address is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address.",
              },
            })}
            error={errors.email?.message}
          />

          {/* Mobile */}

          <Input
            label="Mobile number"
            type="tel"
            placeholder="98765 43210"
            icon={Phone}
            className={inputClassName}
            {...register("mobileNumber", {
              required: "Mobile number is required.",
              validate: (value) => {
                const digits = value.replace(/\D/g, "");

                return (
                  /^[6-9]\d{9}$/.test(digits) ||
                  "Enter a valid 10-digit mobile number."
                );
              },
            })}
            error={errors.mobileNumber?.message}
          />

          {/* Password */}

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              icon={LockKeyhole}
              className={inputClassName}
              {...register("password", {
                required: "Password is required.",
                validate: {
                  length: (value) =>
                    (value.length >= 6 && value.length <= 20) ||
                    "Password must be 6–20 characters.",

                  lowercase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain a lowercase letter.",

                  uppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain an uppercase letter.",

                  number: (value) =>
                    /\d/.test(value) || "Password must contain a number.",

                  special: (value) =>
                    /[@$!%*?&]/.test(value) ||
                    "Password must contain a special character.",
                },
              })}
              error={errors.password?.message}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="
                absolute
                right-3
                top-[2.35rem]
                flex
                size-8
                items-center
                justify-center
                rounded-md
                text-ink-muted
                transition-colors
                hover:bg-cream-dark
                hover:text-ink
              "
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </section>

      {/* ACADEMIC DETAILS */}

      <section
        className="
          border-t
          border-border
          pt-5
        "
      >
        <p className="eyebrow">Academic details</p>

        <div
          className="
            mt-4
            grid
            gap-4
            sm:grid-cols-2
          "
        >
          {/* Roll number */}

          <Input
            label="Roll number"
            placeholder="e.g. 23101106033"
            className={inputClassName}
            {...register("rollNumber", {
              required: "Roll number is required.",
            })}
            error={errors.rollNumber?.message}
          />

          {/* Department */}

          <Select
            label="Department"
            options={departmentOptions}
            className={inputClassName}
            {...register("department", {
              required: "Please select your department.",
            })}
            error={errors.department?.message}
          />
        </div>
      </section>
    </div>
  );
};

const StepTwoFields = ({ register, errors, watch, handleSignatureChange }) => {
  const signature = watch("signature");

  return (
    <div className="space-y-6">
      {/* GUARDIAN DETAILS */}

      <section>
        <p className="eyebrow">Guardian details</p>

        <div
          className="
            mt-4
            grid
            gap-4
            sm:grid-cols-2
          "
        >
          <Input
            label="Guardian name"
            placeholder="Enter guardian name"
            icon={UserRound}
            className={inputClassName}
            {...register("gurdianName", {
              required: "Guardian name is required.",
            })}
            error={errors.gurdianName?.message}
          />

          <Input
            label="Guardian mobile"
            type="tel"
            placeholder="98765 43210"
            icon={Phone}
            className={inputClassName}
            {...register("gurdianMobile", {
              required: "Guardian mobile number is required.",
              validate: (value) => {
                const digits = value.replace(/\D/g, "");

                return (
                  /^[6-9]\d{9}$/.test(digits) ||
                  "Enter a valid 10-digit mobile number."
                );
              },
            })}
            error={errors.gurdianMobile?.message}
          />
        </div>
      </section>

      {/* SIGNATURE */}

      <section
        className="
          border-t
          border-border
          pt-5
        "
      >
        <p className="eyebrow">Signature</p>

        <label
          htmlFor="signature"
          className="
            mt-4
            flex
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-border
            bg-cream
            px-5
            py-8
            text-center
            transition-colors
            hover:border-brand-400
            hover:bg-brand-50/40
          "
        >
          <div
            className="
              flex
              size-11
              items-center
              justify-center
              rounded-xl
              bg-brand-50
              text-brand-700
            "
          >
            <FileSignature size={21} />
          </div>

          <p
            className="
              mt-3
              text-sm
              font-semibold
              text-ink
            "
          >
            {signature instanceof File
              ? signature.name
              : "Upload your signature"}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-ink-muted
            "
          >
            JPG, JPEG, PNG or WEBP · 30KB–100KB
          </p>

          <input
            id="signature"
            type="file"
            accept="
              image/jpeg,
              image/png,
              image/webp
            "
            className="hidden"
            onChange={handleSignatureChange}
          />
        </label>

        {errors.signature && (
          <p
            className="
              mt-1.5
              text-xs
              text-red-600
            "
          >
            {errors.signature.message}
          </p>
        )}
      </section>
    </div>
  );
};

export { StepOneFields, StepTwoFields };
