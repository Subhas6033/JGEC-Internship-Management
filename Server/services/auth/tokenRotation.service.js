import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import {
  getRefreshCookieName,
  cookieConfig,
  clearCookieConfig,
} from "../../config/cookieConfig.config.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { rotateUserSession } from "./session.service.js";

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshCookies = ["Student", "TPO", "SPOC", "Admin"].map(
    (userModel) => ({
      userModel,
      cookieName: getRefreshCookieName(userModel),
    }),
  );
  const matchedCookie = refreshCookies.find(({ cookieName }) =>
    Boolean(req.cookies?.[cookieName]),
  );
  if (!matchedCookie) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Refresh token is required");
  }
  const { userModel, cookieName } = matchedCookie;
  const incomingRefreshToken = req.cookies[cookieName];
  let result;

  try {
    result = await rotateUserSession(incomingRefreshToken, req, userModel);
  } catch (error) {
    const status = error?.statusCode ?? error?.status;
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      res.clearCookie(cookieName, clearCookieConfig);
    }
    throw error;
  }
  res.set("Cache-Control", "no-store");
  if (result?.refreshToken) {
    res.cookie(cookieName, result.refreshToken, cookieConfig);
  }
  return res.status(HTTP_STATUS.SUCCESS).json(
    new APIRES(
      HTTP_STATUS.SUCCESS,
      {
        accessToken: result.accessToken,
        userModel,
        user: result.user,
      },
      "Access token refreshed successfully",
    ),
  );
});
