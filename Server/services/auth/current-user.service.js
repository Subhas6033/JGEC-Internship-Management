import {
  getRefreshCookieName,
  clearCookieConfig,
} from "../../config/cookieConfig.config.js";

import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";

import { HTTP_STATUS } from "../../config/httpConfig.config.js";

import { revokeUserSession } from "./session.service.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Authentication is required");
  }

  res.set("Cache-Control", "no-store");

  return res.status(HTTP_STATUS.SUCCESS).json(
    new APIRES(
      HTTP_STATUS.SUCCESS,
      {
        user: req.user,
      },
      "Current user fetched successfully",
    ),
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const refreshCookies = [
    {
      userModel: "Student",
      cookieName: getRefreshCookieName("Student"),
    },
    {
      userModel: "TPO",
      cookieName: getRefreshCookieName("TPO"),
    },
    {
      userModel: "SPOC",
      cookieName: getRefreshCookieName("SPOC"),
    },
    {
      userModel: "Admin",
      cookieName: getRefreshCookieName("Admin"),
    },
  ];

  const matchedCookie = refreshCookies.find(({ cookieName }) =>
    Boolean(req.cookies?.[cookieName]),
  );

  if (matchedCookie) {
    await revokeUserSession(req.cookies?.[matchedCookie.cookieName], "logout");

    res.clearCookie(matchedCookie.cookieName, clearCookieConfig);
  }

  return res
    .status(HTTP_STATUS.SUCCESS)
    .json(new APIRES(HTTP_STATUS.SUCCESS, null, "Logged out successfully"));
});

export { getCurrentUser, logoutUser };
