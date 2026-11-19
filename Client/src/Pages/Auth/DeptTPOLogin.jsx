import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../Components/Auth/Login/LoginForm";
import {
  useLoginTPO,
  useVerifyTPOOTP,
  useResendTPOOTP,
} from "../../Services/Queries/tpoAuth.quires";

const DeptTPOLogin = () => {
  const navigate = useNavigate();

  const loginMutation = useLoginTPO();
  const verifyMutation = useVerifyTPOOTP();
  const resendMutation = useResendTPOOTP();

  const [otp, setOtp] = useState({
    open: false,
    email: "",
    challengeId: "",
    role: "Department TPO",
    error: "",
  });

  // Verify credentials and initiate OTP.
  const handleLogin = async (data) => {
    const response = await loginMutation.mutateAsync({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });

    const otpChallenge = response?.otp;

    if (!otpChallenge?.challengeId) {
      throw new Error("OTP challenge was not returned by the server");
    }

    setOtp({
      open: true,
      email: otpChallenge.email || data.email,
      challengeId: otpChallenge.challengeId,
      role: "Department TPO",
      error: "",
    });
  };

  // Verify OTP and authenticate TPO.
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

      navigate("/depttpo/dashboard", {
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

  // Resend OTP.
  const handleResendOTP = async () => {
    try {
      const response = await resendMutation.mutateAsync({
        challengeId: otp.challengeId,
      });

      setOtp((previous) => ({
        ...previous,
        error: "",
        email: response?.email || previous.email,
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

  // Close OTP modal.
  const handleCloseOTP = () => {
    setOtp({
      open: false,
      email: "",
      challengeId: "",
      role: "Department TPO",
      error: "",
    });
  };

  return (
    <LoginForm
      role="Department TPO"
      portalName="JGEC"
      portalSubtitle="Internship Management Portal"
      portalDescription="Sign in to review student applications, manage internship deadlines, and forward approved applications to the central TPO."
      title="Welcome back"
      subtitle="Sign in with your college email to continue."
      emailLabel="College email"
      emailPlaceholder="name@college.edu"
      passwordLabel="Password"
      passwordPlaceholder="Enter your password"
      forgotPasswordLink="/auth/forgot-password"
      showRememberMe={false}
      signup={{
        text: "Don't have an account?",
        label: "Create account",
        to: "/auth/depttpo/signup",
      }}
      pageTitle="Department TPO Login | JGEC"
      metaDescription="Sign in to the JGEC Department TPO Portal."
      onSubmit={handleLogin}
      otp={{
        open: otp.open,
        email: otp.email,
        challengeId: otp.challengeId,
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

export default DeptTPOLogin;
