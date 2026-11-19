import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../Components/Auth/Login/LoginForm";
import {
  useAdminLogin,
  useVerifyAdminOTP,
  useResendAdminOTP,
} from "../../Services/Queries/adminAuth.queries";

const AdminLogin = () => {
  const navigate = useNavigate();

  const loginMutation = useAdminLogin();
  const verifyMutation = useVerifyAdminOTP();
  const resendMutation = useResendAdminOTP();

  const [otp, setOtp] = useState({
    open: false,
    email: "",
    challengeId: "",
    role: "Administrator",
    error: "",
  });

  // Initiate admin login and request OTP
  const handleLogin = async (data) => {
    const response = await loginMutation.mutateAsync({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });

    const otpChallenge = response?.otp;

    if (!otpChallenge?.challengeId) {
      throw new Error("OTP challenge was not returned by the server.");
    }

    setOtp({
      open: true,
      email: otpChallenge.email || data.email,
      challengeId: otpChallenge.challengeId,
      role: "Administrator",
      error: "",
    });
  };

  // Verify OTP and complete admin authentication
  const handleVerifyOTP = async (otpValue) => {
    try {
      await verifyMutation.mutateAsync({
        challengeId: otp.challengeId,
        otp: otpValue,
      });

      setOtp((previous) => ({
        ...previous,
        open: false,
        error: "",
      }));

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      setOtp((previous) => ({
        ...previous,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "OTP verification failed. Please try again.",
      }));

      throw error;
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      const response = await resendMutation.mutateAsync({
        challengeId: otp.challengeId,
      });

      setOtp((previous) => ({
        ...previous,
        email: response?.email || previous.email,
        error: "",
      }));

      return response;
    } catch (error) {
      setOtp((previous) => ({
        ...previous,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to resend OTP. Please try again.",
      }));

      throw error;
    }
  };

  // Close OTP modal
  const handleCloseOTP = () => {
    setOtp({
      open: false,
      email: "",
      challengeId: "",
      role: "Administrator",
      error: "",
    });
  };

  return (
    <LoginForm
      role="Administrator"
      portalName="JGEC"
      portalSubtitle="Internship Management Portal"
      portalDescription="Manage users, departments, internship activities, and portal operations from one centralized administration workspace."
      title="Welcome back"
      subtitle="Sign in with your administrator credentials to continue."
      emailLabel="Admin email"
      emailPlaceholder="admin@college.edu"
      passwordLabel="Password"
      passwordPlaceholder="Enter your password"
      forgotPasswordLink="/auth/forgot-password"
      showRememberMe={false}
      signup={{
        text: "Need to create an administrator account?",
        label: "Create account",
        to: "/auth/admin/signup",
      }}
      pageTitle="Admin Login | JGEC"
      metaDescription="Sign in to the JGEC Administration Portal."
      onSubmit={handleLogin}
      otp={{
        open: otp.open,
        email: otp.email,
        role: otp.role,

        onClose: handleCloseOTP,
        onVerify: handleVerifyOTP,
        onResend: handleResendOTP,

        isVerifying: verifyMutation.isPending,
        isResending: resendMutation.isPending,

        error: otp.error,
        resendDelay: 30,
      }}
    />
  );
};

export default AdminLogin;
