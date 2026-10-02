import {
  apiClient,
  refreshAccessToken as refreshAccessTokenFromClient,
} from "../api/apiClient";

const registerStudent = async (studentData) => {
  const formData = new FormData();

  [
    "fullName",
    "email",
    "mobileNumber",
    "password",
    "rollNumber",
    "department",
    "gurdianName",
    "gurdianMobile",
  ].forEach((key) => formData.append(key, studentData[key]));

  if (studentData.signature instanceof File) {
    formData.append("signature", studentData.signature);
  }

  return apiClient.post("/auth/students/register", formData, {
    skipAuthRefresh: true,
    timeout: 60000, // includes the Cloudinary upload
  });
};

const loginStudent = async ({ email, password }) =>
  apiClient.post(
    "/auth/students/login",
    { email: email.trim().toLowerCase(), password },
    { skipAuthRefresh: true },
  );

/* Uses the same single-flight + cross-tab lock as the interceptor. */
const refreshStudentAccessToken = () => refreshAccessTokenFromClient();
const getCurrentStudent = () => apiClient.get("/auth/students/me");
const logoutStudent = () =>
  apiClient.post("/auth/students/logout", null, { skipAuthRefresh: true });

export {
  registerStudent,
  loginStudent,
  refreshStudentAccessToken,
  getCurrentStudent,
  logoutStudent,
};
