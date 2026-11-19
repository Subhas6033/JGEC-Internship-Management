import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../Components/Auth/Login/LoginForm";
import {
  useLoginStudent,
  useVerifyStudentOTP,
  useResendStudentOTP,
} from "../../Services/Queries/studentAuth.quires";

const Login = () => {
  const navigate = useNavigate();

  const loginMutation = useLoginStudent();
  const verifyMutation = useVerifyStudentOTP();
  const resendMutation = useResendStudentOTP();

  const [otp, setOtp] = useState({
    open: false,
    email: "",
    challengeId: "",
    role: "Student",
    error: "",
  });

  // Initiate student login and request OTP
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
      role: "Student",
      error: "",
    });
  };

  // Verify OTP and complete authentication
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

      navigate("/students/dashboard", {
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
      role: "Student",
      error: "",
    });
  };

  return (
    <LoginForm
      role="Student"
      portalName="JGEC"
      portalSubtitle="Internship Management Portal"
      portalDescription="Access your student account to explore internship opportunities, submit applications, and track your application status."
      title="Welcome back"
      subtitle="Sign in to your student account to continue to the internship portal."
      emailLabel="Email address"
      emailPlaceholder="Enter your email address"
      passwordLabel="Password"
      passwordPlaceholder="Enter your password"
      forgotPasswordLink="/auth/forgot-password"
      showRememberMe={true}
      signup={{
        text: "Don't have an account?",
        label: "Create student account",
        to: "/auth/signup",
      }}
      footerLinks={[
        {
          label: "Dept. TPO Login",
          to: "/auth/depttpo/login",
        },
        {
          label: "SPOC Login",
          to: "/auth/spoc/login",
        },
      ]}
      pageTitle="Student Login | JGEC"
      metaDescription="Sign in to the JGEC Student Internship Management Portal."
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

export default Login;
