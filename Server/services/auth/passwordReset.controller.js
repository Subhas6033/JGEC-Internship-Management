import {
  requestPasswordReset,
  resetUserPassword,
  verifyPasswordResetToken,
} from "./passwordReset.service.js";
import { asyncHandler, APIRES } from "../../utils/helper.utils.js";

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  const result = await requestPasswordReset({
    email,
    role,
  });

  return res.status(200).json(new APIRES(200, null, result.message));
});

const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const isValid = await verifyPasswordResetToken(token);

  return res
    .status(200)
    .json(
      new APIRES(
        200,
        { valid: isValid },
        isValid
          ? "Password reset link is valid."
          : "Invalid or expired password reset link.",
      ),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const result = await resetUserPassword({
    token,
    newPassword,
  });

  return res.status(200).json(new APIRES(200, null, result.message));
});

export { forgotPassword, verifyResetToken, resetPassword };
