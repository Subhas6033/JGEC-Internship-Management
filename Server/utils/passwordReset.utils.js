import crypto from "crypto";

export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashPasswordResetToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const PASSWORD_RESET_EXPIRY_MINUTES = 20;

export const getPasswordResetExpiry = () => {
  return new Date(Date.now() + PASSWORD_RESET_EXPIRY_MINUTES * 60 * 1000);
};
