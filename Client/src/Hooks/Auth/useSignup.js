import { useMutation } from "@tanstack/react-query";
import api from "../../Services/api";

/**
 * Custom hook for student registration
 * Handles API call and error state management
 */
const useSignup = () => {
  return useMutation({
    mutationKey: ["registerStudent"],
    mutationFn: async (formData) => {
      try {
        const response = await api.post(
          "/auth/students/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        return response.data;
      } catch (error) {
        // Extract error message from backend response
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Registration failed. Please try again.";
        throw new Error(errorMessage);
      }
    },
    // Optimistic update - save tokens immediately
    onSuccess: (data) => {
      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }
    },
  });
};

export default useSignup;
