const isProduction = process.env.NODE_ENV === "production";

export const getRefreshCookieName = (userModel) => {
  const cookieNames = {
    Student: "studentRefreshToken",
    TPO: "tpoRefreshToken",
    SPOC: "spocRefreshToken",
    Admin: "adminRefreshToken",
  };
  const cookieName = cookieNames[userModel];
  if (!cookieName) {
    throw new Error(`Unsupported authentication model: ${userModel}`);
  }
  return cookieName;
};

export const cookieConfig = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  path: "/",
};

export const clearCookieConfig = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  path: "/",
};
