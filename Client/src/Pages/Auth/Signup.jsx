import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import SignupIntro from "./SignupIntro";
import SignupCard from "./SignupCard";
import useSignup from "../../Hooks/Auth/useSignup";
import { setAuth } from "../../Store/Slice/authSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const { signup, isLoading, error } = useSignup();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      rollNumber: "",
      department: "",
      gurdianName: "",
      gurdianMobile: "",
      signature: null,
    },
  });

  const goToStepTwo = async () => {
    setApiError("");

    const fields = [
      "fullName",
      "email",
      "mobileNumber",
      "password",
      "rollNumber",
      "department",
    ];

    const isValid = await trigger(fields);

    if (!isValid) {
      return;
    }

    setDirection(1);
    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToStepOne = () => {
    if (isLoading) {
      return;
    }

    setApiError("");
    setDirection(-1);
    setStep(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files?.[0] || null;

    setValue("signature", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const submitRegistration = async (data) => {
    setApiError("");

    const studentData = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      mobileNumber: data.mobileNumber,
      password: data.password,
      rollNumber: data.rollNumber.trim(),
      department: data.department,
      gurdianName: data.gurdianName.trim(),
      gurdianMobile: data.gurdianMobile,
      signature: data.signature instanceof File ? data.signature : null,
    };

    try {
      const response = await signup(studentData);

      const student = response?.data?.student;
      const accessToken = response?.data?.accessToken;

      dispatch(
        setAuth({
          user: student,
          accessToken,
        }),
      );

      navigate("/students/dashboard", {
        replace: true,
      });
    } catch (submitError) {
      setApiError(
        submitError?.message || "Registration failed. Please try again.",
      );
    }
  };

  const submitStepTwo = async () => {
    setApiError("");

    const signature = watch("signature");

    if (!(signature instanceof File)) {
      setApiError("Signature is required.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(signature.type)) {
      setApiError("Only JPG, JPEG, PNG or WEBP images are allowed.");
      return;
    }

    const minSize = 30 * 1024;
    const maxSize = 100 * 1024;

    if (signature.size < minSize) {
      setApiError("Signature must be at least 30KB.");
      return;
    }

    if (signature.size > maxSize) {
      setApiError("Signature must not exceed 100KB.");
      return;
    }

    await handleSubmit(
      async (data) => {
        await submitRegistration(data);
      },
      (formErrors) => {
        const firstError = Object.values(formErrors)[0];
        if (firstError?.message) {
          setApiError(firstError.message);
        }
      },
    )();
  };

  const displayedError = apiError || error?.message || "";

  return (
    <div
      className="
        min-h-screen
        bg-cream
        lg:h-dvh
        lg:overflow-hidden
      "
    >
      <div
        className="
          mx-auto grid
          min-h-screen
          w-full
          max-w-6xl
          items-center
          gap-5
          px-4
          py-5
          sm:px-6
          lg:h-full
          lg:min-h-0
          lg:px-8
          lg:py-4
          lg:grid-cols-[0.78fr_1.22fr]
        "
      >
        <SignupIntro apiError={displayedError} />

        <SignupCard
          step={step}
          direction={direction}
          register={register}
          errors={errors}
          watch={watch}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleSignatureChange={handleSignatureChange}
          goToStepTwo={goToStepTwo}
          goToStepOne={goToStepOne}
          submitStepTwo={submitStepTwo}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Signup;
