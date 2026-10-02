import { apiClient } from "../api/apiClient";

const registerStudent = async (studentData) => {
  const formData = new FormData();

  formData.append("fullName", studentData.fullName);
  formData.append("email", studentData.email);
  formData.append("mobileNumber", studentData.mobileNumber);
  formData.append("password", studentData.password);
  formData.append("rollNumber", studentData.rollNumber);
  formData.append("department", studentData.department);
  formData.append("gurdianName", studentData.gurdianName);
  formData.append("gurdianMobile", studentData.gurdianMobile);

  if (studentData.signature instanceof File) {
    formData.append("signature", studentData.signature);
  }

  return apiClient("/auth/students/register", {
    method: "POST",
    body: formData,
  });
};

export { registerStudent };
