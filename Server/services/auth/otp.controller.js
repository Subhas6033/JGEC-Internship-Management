import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import {
  cookieConfig,
  getRefreshCookieName,
} from "../../config/cookieConfig.config.js";
import {
  resendLoginOTP,
  verifyLoginOTP,
} from "../../services/auth/otp.service.js";

// Create Role Specific OTP Handlers
const createOTPHandlers = (userModel, responseKey) => {
  // Verify the incoming OTP and introduce a new sessions
  const verifyOTP = asyncHandler(async (req, res) => {
    const { challengeId, otp } = req.body;

    if (!challengeId || !otp) {
      throw new APIERR(
        HTTP_STATUS.BAD_REQUEST,
        "Challenge ID and OTP are required",
      );
    }

    const result = await verifyLoginOTP({
      challengeId,
      otp,
      userModel,
      req,
    });

    const refreshCookieName = getRefreshCookieName(userModel);

    // Remove password from returned user data.
    const user = result.user?.toObject
      ? result.user.toObject()
      : { ...result.user };

    delete user.password;
    delete user.refreshToken;

    return res
      .status(HTTP_STATUS.SUCCESS)
      .cookie(refreshCookieName, result.refreshToken, cookieConfig)
      .set("Cache-Control", "no-store")
      .json(
        new APIRES(
          HTTP_STATUS.SUCCESS,
          {
            [responseKey]: user,
            accessToken: result.accessToken,
          },
          "OTP verified. Login successful",
        ),
      );
  });

  // Resend OTP Handlers
  const resendOTP = asyncHandler(async (req, res) => {
    const { challengeId } = req.body;

    if (!challengeId) {
      throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Challenge ID is required");
    }

    const result = await resendLoginOTP({
      challengeId,
      userModel,
    });

    return res
      .status(HTTP_STATUS.SUCCESS)
      .set("Cache-Control", "no-store")
      .json(
        new APIRES(
          HTTP_STATUS.SUCCESS,
          result,
          "Verification code resent successfully",
        ),
      );
  });

  return {
    verifyOTP,
    resendOTP,
  };
};

// Role Specific OTP Controllers
const studentOTP = createOTPHandlers("Student", "student");
const tpoOTP = createOTPHandlers("TPO", "tpo");
const spocOTP = createOTPHandlers("SPOC", "spoc");
const adminOTP = createOTPHandlers("Admin", "admin");

export { createOTPHandlers, studentOTP, tpoOTP, spocOTP, adminOTP };
