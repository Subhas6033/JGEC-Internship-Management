import { apiClient } from "../api/apiClient";
const STUDENT_DOCUMENTS_ENDPOINT = "/student/documents";

export const getStudentDocuments = async () => {
  const response = await apiClient.get(STUDENT_DOCUMENTS_ENDPOINT);
  return response?.data ?? response;
};

export const updateStudentSignature = async (file) => {
  const formData = new FormData();
  formData.append("signature", file);
  const response = await apiClient.put(
    `${STUDENT_DOCUMENTS_ENDPOINT}/signature`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response?.data ?? response;
};

export const updateStudentResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const response = await apiClient.put(
    `${STUDENT_DOCUMENTS_ENDPOINT}/resume`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response?.data ?? response;
};

export const regenerateStudentNOC = async () => {
  const response = await apiClient.post(
    `${STUDENT_DOCUMENTS_ENDPOINT}/noc/regenerate`,
  );
  return response?.data ?? response;
};
