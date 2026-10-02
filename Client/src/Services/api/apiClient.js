const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5850/api/v1";

class APIError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);

    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

const apiClient = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    credentials: "include",

    headers: {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),

      ...(options.headers || {}),
    },
  });

  let data = null;

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new APIError(
      data?.message || "Something went wrong. Please try again.",
      response.status,
      data,
    );
  }

  return data;
};

export { apiClient, APIError };
