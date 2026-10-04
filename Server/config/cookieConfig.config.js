const isProd = process.env.NODE_ENV === "production";

export const REFRESH_COOKIE_NAME = "student_refresh_token";

export const clearCookieConfig = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  // The cookie is only sent to auth routes. clearCookie must use the same path.
  path: "/api/v1/auth/students",
};

export const cookieConfig = {
  ...clearCookieConfig,
  maxAge:
    (Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7) * 24 * 60 * 60 * 1000,
};
