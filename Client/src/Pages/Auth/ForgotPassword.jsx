import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, LockKeyhole, ArrowLeft } from "lucide-react";
import { Button, Card, Input, Select, Toast } from "../../Components/index";
import { useForgotPasswordMutation } from "../../Services/Queries/forgotPassword.queries";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "TPO", label: "Department TPO" },
  { value: "SPOC", label: "SPOC" },
  { value: "admin", label: "Admin" },
];

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync: sendResetLink, isPending: loading } =
    useForgotPasswordMutation();

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.role) {
      newErrors.role = "Please select your account role.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit forgot password request
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      await sendResetLink({
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
      });

      setSubmitted(true);

      setToast({
        variant: "success",
        title: "Request submitted",
        message:
          "If an account matches the provided details, password reset instructions will be sent to its registered email.",
      });
    } catch (error) {
      setToast({
        variant: "error",
        title: "Request failed",
        message:
          error?.response?.data?.message ||
          "Unable to process your request. Please try again later.",
      });
    }
  };

  // Reset form
  const handleTryAnotherAccount = () => {
    setSubmitted(false);

    setFormData({
      email: "",
      role: "",
    });

    setErrors({});
    setToast(null);
  };

  return (
    <div className="min-h-screen bg-emerald-50/60 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="p-5 sm:p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5">
          {/* Header */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
              <LockKeyhole size={27} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-emerald-950">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter your registered email address and account role. We will send
              password reset instructions if your account matches.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Role */}
              <Select
                label="Account Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                placeholder="Select your account role"
                required
                error={errors.role}
              />

              {/* Email */}
              <Input
                label="Registered Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your registered email"
                startIcon={<Mail size={18} />}
                required
                error={errors.email}
                autoComplete="email"
              />

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-emerald-700! hover:bg-emerald-800! text-white! shadow-lg! shadow-emerald-700/20! transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Sending Request..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
                <Mail size={27} />
              </div>

              <h2 className="text-lg font-semibold text-emerald-950">
                Check Your Email
              </h2>

              <p className="text-sm leading-6 text-slate-600">
                If an account matches your submitted details, you will receive
                password reset instructions. Please check your inbox and spam
                folder.
              </p>

              <Button
                variant="outline"
                className="w-full border-emerald-200! text-emerald-700! hover:bg-emerald-50!"
                onClick={handleTryAnotherAccount}
              >
                Try Another Account
              </Button>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-7 border-t border-emerald-100 pt-5">
            <Link
              to="/auth/login"
              className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-900"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </Card>

        {/* Toast */}
        {toast && (
          <div className="fixed right-4 top-4 z-50">
            <Toast
              variant={toast.variant}
              title={toast.title}
              message={toast.message}
              duration={5000}
              onClose={() => setToast(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
