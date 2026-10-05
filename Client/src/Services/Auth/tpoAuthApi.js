import { apiClient } from "../api/apiClient";

const registerTPO = async (tpoData) =>
  apiClient.post("/auth/tpo/register", tpoData, {
    skipAuthRefresh: true,
  });

const loginTPO = async ({ email, password }) =>
  apiClient.post(
    "/auth/tpo/login",
    {
      email: email.trim().toLowerCase(),
      password,
    },
    {
      skipAuthRefresh: true,
    },
  );

export { registerTPO, loginTPO };
