import { apiClient } from "../api/apiClient";

const STUDENT_AUTH_BASE = "/auth/students";

const registerStudent = async (studentData) => {
  const formData = new FormData();

  [
    "fullName",
    "email",
    "mobileNumber",
    "password",
    "rollNumber",
    "department",
    "guardianName",
    "guardianMobile",
  ].forEach((key) => {
    formData.append(key, studentData[key] ?? "");
  });

  if (studentData.signature instanceof File) {
    formData.append("signature", studentData.signature);
  }

  const response = await apiClient.post(
    `${STUDENT_AUTH_BASE}/register`,
    formData,
    {
      skipAuthRefresh: true,
      timeout: 60000,
    },
  );

  return response.data?.data ?? response.data;
};

const loginStudent = async ({ email, password }) => {
  const response = await apiClient.post(
    `${STUDENT_AUTH_BASE}/login`,
    {
      email: email.trim().toLowerCase(),
      password,
    },
    {
      skipAuthRefresh: true,
    },
  );

  return response.data?.data ?? response.data;
};

const verifyStudentOTP = async ({ challengeId, otp }) => {
  const response = await apiClient.post(
    `${STUDENT_AUTH_BASE}/otp/verify`,
    {
      challengeId,
      otp,
    },
    {
      skipAuthRefresh: true,
    },
  );

  return response.data?.data ?? response.data;
};

const resendStudentOTP = async ({ challengeId }) => {
  const response = await apiClient.post(
    `${STUDENT_AUTH_BASE}/otp/resend`,
    {
      challengeId,
    },
    {
      skipAuthRefresh: true,
    },
  );

  return response.data?.data ?? response.data;
};

export { registerStudent, loginStudent, verifyStudentOTP, resendStudentOTP };
