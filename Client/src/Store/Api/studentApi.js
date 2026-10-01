import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import api from "../../Services/api";

// Define the API slice using RTK Query
export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include", // Include cookies
  }),
  endpoints: (builder) => ({
    // Student registration endpoint
    registerStudent: builder.mutation({
      query: (formData) => ({
        url: "/auth/students/register",
        method: "POST",
        body: formData,
        formData: true, // Signal that we're sending formData
      }),
      // Override the fetchBaseQuery to handle formData
      async queryFn(arg) {
        try {
          const formData = new FormData();
          Object.entries(arg).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, value);
            }
          });

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

          // If registration succeeds, save tokens
          if (response.data?.data?.accessToken) {
            localStorage.setItem(
              "accessToken",
              response.data.data.accessToken
            );
            localStorage.setItem(
              "refreshToken",
              response.data.data.refreshToken
            );
          }

          return { data: response.data };
        } catch (error) {
          return {
            error: {
              status: error.response?.status,
              data: error.response?.data || {
                message: error.message || "An error occurred",
              },
            },
          };
        }
      },
    }),

    // Student login endpoint
    loginStudent: builder.mutation({
      query: (credentials) => ({
        url: "/auth/students/login",
        method: "POST",
        body: credentials,
      }),
      async queryFn(arg) {
        try {
          const response = await api.post("/auth/students/login", arg, {
            withCredentials: true,
          });

          // Save tokens on successful login
          if (response.data?.data?.accessToken) {
            localStorage.setItem(
              "accessToken",
              response.data.data.accessToken
            );
            localStorage.setItem(
              "refreshToken",
              response.data.data.refreshToken
            );
          }

          return { data: response.data };
        } catch (error) {
          return {
            error: {
              status: error.response?.status,
              data: error.response?.data || {
                message: error.message || "An error occurred",
              },
            },
          };
        }
      },
    }),

    // Get current student profile
    getStudentProfile: builder.query({
      query: () => "/auth/students/profile",
      providesTags: ["StudentProfile"],
      async queryFn() {
        try {
          const response = await api.get("/auth/students/profile", {
            withCredentials: true,
          });
          return { data: response.data };
        } catch (error) {
          return {
            error: {
              status: error.response?.status,
              data: error.response?.data || {
                message: error.message || "An error occurred",
              },
            },
          };
        }
      },
    }),

    // Logout student
    logoutStudent: builder.mutation({
      query: () => ({
        url: "/auth/students/logout",
        method: "POST",
      }),
      async queryFn() {
        try {
          const response = await api.post("/auth/students/logout", {}, {
            withCredentials: true,
          });

          // Clear tokens on logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          return { data: response.data };
        } catch (error) {
          // Clear tokens even if logout fails (network error, etc.)
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          return {
            error: {
              status: error.response?.status,
              data: error.response?.data || {
                message: error.message || "An error occurred",
              },
            },
          };
        }
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useRegisterStudentMutation,
  useLoginStudentMutation,
  useGetStudentProfileQuery,
  useLogoutStudentMutation,
} = studentApi;

// Export reducer for store configuration
export default studentApi.reducer;
