import { apiClient } from "../api/apiClient";

const BASE_URL = "/admin/student-management";

export const getAdminStudents = async (params = {}) => {
  const response = await apiClient.get(BASE_URL, { params });

  const body = response.data;

  console.log("Admin students API response:", body);

  // Handle the API response wrapper.
  const result = body?.data ?? body;

  // If the backend returns a direct array.
  if (Array.isArray(result)) {
    return {
      students: result,
      pagination: {
        currentPage: Number(params.page) || 1,
        limit: Number(params.limit) || 10,
        totalStudents: result.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  // If the backend returns { students, pagination }.
  if (result?.students) {
    return {
      students: result.students,
      pagination: result.pagination ?? {
        currentPage: Number(params.page) || 1,
        limit: Number(params.limit) || 10,
        totalStudents: result.students.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  console.error("Unexpected student API response:", body);

  throw new Error("Invalid student API response");
};

export const updateAdminStudent = async ({ studentId, payload }) => {
  const { data } = await apiClient.patch(`${BASE_URL}/${studentId}`, payload);

  return data.data.student;
};

export const deleteAdminStudent = async (studentId) => {
  const { data } = await apiClient.delete(`${BASE_URL}/${studentId}`);

  return data.data.student;
};
