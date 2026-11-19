import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LockKeyhole,
  Mail,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button, Card, Input, Toast } from "../../Components/index";
import {
  useVerifyResetPasswordTokenQuery,
  useResetPasswordMutation,
} from "../../Services/Queries/forgotPassword.queries";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  // Token received from the reset email URL
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verify reset token
  const {
    data: verifyData,
    isLoading: verifying,
    isError: verificationFailed,
  } = useVerifyResetPasswordTokenQuery(token);

  // Handle reset password
  const { mutateAsync: submitResetPassword, isPending: resetting } =
    useResetPasswordMutation();

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

  // Validate password form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit new password
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      await submitResetPassword({
        token,
        newPassword: formData.newPassword,
      });

      setSubmitted(true);

      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      setToast({
        variant: "success",
        title: "Password updated",
        message:
          "Your password has been successfully reset. You can now log in with your new password.",
      });
    } catch (error) {
      setToast({
        variant: "error",
        title: "Password reset failed",
        message:
          error?.response?.data?.message ||
          "Unable to reset your password. Please try again.",
      });
    }
  };

  // Missing token
  if (!token) {
    return (
      <ResetPasswordLayout>
        <InvalidToken />
      </ResetPasswordLayout>
    );
  }

  // Token verification loading
  if (verifying) {
    return (
      <ResetPasswordLayout>
        <div className="py-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <LockKeyhole size={27} />
          </div>

          <h2 className="text-lg font-semibold text-emerald-950">
            Verifying Reset Link
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Please wait while we verify your password reset link.
          </p>

          <div className="mx-auto mt-6 h-6 w-6 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" />
        </div>
      </ResetPasswordLayout>
    );
  }

  // Invalid or expired token
  const isTokenValid =
    verifyData?.data?.valid ??
    verifyData?.valid ??
    verifyData?.data?.isValid ??
    verifyData?.isValid ??
    true;

  if (verificationFailed || !isTokenValid) {
    return (
      <ResetPasswordLayout>
        <InvalidToken />
      </ResetPasswordLayout>
    );
  }

  return (
    <ResetPasswordLayout>
      {!submitted ? (
        <>
          {/* Header */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
              <LockKeyhole size={27} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-emerald-950">
              Create New Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your reset link is valid. Enter your new password below to secure
              your account.
            </p>
          </div>

          {/* Security Information */}
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/80 p-3.5">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-emerald-700"
            />

            <p className="text-xs leading-5 text-emerald-900">
              Choose a strong password that you haven't used previously for your
              JGEC Portal account.
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <Input
                label="New Password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                startIcon={<LockKeyhole size={18} />}
                autoComplete="new-password"
                required
                error={errors.newPassword}
              />

              {/* New Password Visibility */}
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-4 top-10 z-10 flex h-6 w-6 items-center justify-center appearance-none border-0 bg-transparent p-0 text-emerald-700 shadow-none outline-none transition-colors hover:bg-transparent hover:text-emerald-900 focus:bg-transparent focus:outline-none focus:ring-0 active:bg-transparent hover:cursor-pointer"
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
                aria-pressed={showNewPassword}
              >
                {showNewPassword ? (
                  <EyeOff size={19} strokeWidth={1.8} />
                ) : (
                  <Eye size={19} strokeWidth={1.8} />
                )}
              </button>
            </div>

            {/* Confirm New Password */}
            <div className="relative">
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your new password"
                startIcon={<LockKeyhole size={18} />}
                autoComplete="new-password"
                required
                error={errors.confirmPassword}
              />

              {/* Confirm Password Visibility */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-10 z-10 flex h-6 w-6 items-center justify-center appearance-none border-0 bg-transparent p-0 text-emerald-700 shadow-none outline-none transition-colors hover:bg-transparent hover:text-emerald-900 focus:bg-transparent focus:outline-none focus:ring-0 active:bg-transparent hover:cursor-pointer"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} strokeWidth={1.8} />
                ) : (
                  <Eye size={19} strokeWidth={1.8} />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={resetting}
              className="w-full bg-emerald-700! text-white! shadow-lg! shadow-emerald-700/20! transition-all duration-200 hover:bg-emerald-800! hover:shadow-emerald-800/25! disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </>
      ) : (
        /* Success State */
        <div className="py-4 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
            <CheckCircle2 size={32} />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-emerald-950">
            Password Reset Successful!
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your JGEC Portal password has been updated successfully. You can now
            sign in using your new password.
          </p>

          <Link to="/auth/login" className="mt-7 block">
            <Button
              size="lg"
              className="w-full bg-emerald-700! text-white! shadow-lg! shadow-emerald-700/20! transition-all hover:bg-emerald-800!"
            >
              Continue to Login
            </Button>
          </Link>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm"
          aria-live="polite"
          role="status"
        >
          <Toast
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            duration={5000}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </ResetPasswordLayout>
  );
};

// Reusable page layout
const ResetPasswordLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50/60 px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="border border-emerald-100 p-5 shadow-xl shadow-emerald-900/5 sm:p-8">
          {children}

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
      </div>
    </div>
  );
};

// Invalid or expired token screen
const InvalidToken = () => {
  return (
    <div className="py-5 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/70">
        <Mail size={29} />
      </div>

      <h2 className="text-xl font-bold text-slate-900">
        Invalid or Expired Link
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        This password reset link is invalid, expired, or has already been used.
        Please request a new password reset link.
      </p>

      <Link to="/auth/forgot-password" className="mt-7 block">
        <Button
          size="lg"
          className="w-full bg-emerald-700! text-white! hover:bg-emerald-800!"
        >
          Request New Reset Link
        </Button>
      </Link>
    </div>
  );
};

export default ResetPassword;
