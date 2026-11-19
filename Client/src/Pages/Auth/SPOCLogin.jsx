import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginForm } from "../../Components/Auth/Login/LoginForm";
import { useSpocLogin } from "../../Services/Queries/spocAuth.queries";
import { useVerifyOTP, useResendOTP } from "../../Services/Queries/otp.queries";
import { setAuth } from "../../Store/Slice/authSlice";

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? response;
};

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.data?.message ||
    error?.message ||
    fallback
  );
};

const SPOCLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otpState, setOtpState] = useState({
    open: false,
    email: "",
    challengeId: "",
    error: "",
  });

  const { mutateAsync: loginSpoc, isPending: isLoggingIn } = useSpocLogin();
  const { mutateAsync: verifyOTP, isPending: isVerifying } = useVerifyOTP();
  const { mutateAsync: resendOTP, isPending: isResending } = useResendOTP();

  // Login and request OTP.
  const onSubmit = async (data, { setError }) => {
    try {
      const challenge = await loginSpoc({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (!challenge?.challengeId) {
        throw new Error(
          "Invalid login response. OTP challenge was not received.",
        );
      }

      setOtpState({
        open: true,
        email: challenge.maskedEmail || data.email.trim().toLowerCase(),
        challengeId: challenge.challengeId,
        error: "",
      });
    } catch (error) {
      setError("root", {
        type: "server",
        message: getErrorMessage(error, "Unable to sign in. Please try again."),
      });
    }
  };

  // Verify OTP and complete authentication.
  const verifySpocOTP = async (otp) => {
    setOtpState((prev) => ({
      ...prev,
      error: "",
    }));

    try {
      const response = await verifyOTP({
        challengeId: otpState.challengeId,
        otp,
      });

      const data = getResponseData(response);

      const spoc = data?.spoc;
      const accessToken = data?.accessToken;

      if (!spoc?._id || !accessToken) {
        throw new Error(
          "Invalid OTP verification response. SPOC authentication data is missing.",
        );
      }

      // Authentication happens only after successful OTP verification.
      dispatch(
        setAuth({
          user: spoc,
          accessToken,
        }),
      );

      setOtpState({
        open: false,
        email: "",
        challengeId: "",
        error: "",
      });

      navigate("/spoc/dashboard", {
        replace: true,
      });

      return response;
    } catch (error) {
      setOtpState((prev) => ({
        ...prev,
        error: getErrorMessage(error, "Invalid or expired OTP."),
      }));

      throw error;
    }
  };

  // Resend OTP.
  const resendSpocOTP = async () => {
    setOtpState((prev) => ({
      ...prev,
      error: "",
    }));

    try {
      const response = await resendOTP({
        challengeId: otpState.challengeId,
      });

      return response;
    } catch (error) {
      setOtpState((prev) => ({
        ...prev,
        error: getErrorMessage(
          error,
          "Unable to resend OTP. Please try again.",
        ),
      }));

      throw error;
    }
  };

  // Close OTP modal.
  const closeOTPModal = () => {
    if (isVerifying || isResending) return;

    setOtpState((prev) => ({
      ...prev,
      open: false,
      error: "",
    }));
  };

  return (
    <LoginForm
      role="SPOC"
      title="Sign in to your account"
      subtitle="Enter your SPOC credentials to continue."
      portalDescription="Sign in to manage internship coordination and placement activities at JGEC."
      pageTitle="SPOC Login | JGEC Internship Management Portal"
      signup={{
        text: "Don't have a SPOC account?",
        label: "Create account",
        to: "/auth/spoc/signup",
      }}
      footerLinks={[
        {
          label: "Student Login",
          to: "/auth/login",
        },
        {
          label: "DeptTPO Login",
          to: "/auth/depttpo/login",
        },
      ]}
      onSubmit={onSubmit}
      otp={{
        ...otpState,
        role: "SPOC",
        onClose: closeOTPModal,
        onVerify: verifySpocOTP,
        onResend: resendSpocOTP,
        isVerifying,
        isResending,
        resendDelay: 30,
      }}
    />
  );
};

export default SPOCLogin;
