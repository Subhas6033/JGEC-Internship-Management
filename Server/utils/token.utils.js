import crypto from "crypto";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const ACCESS_TOKEN_ISSUER = process.env.ACCESS_TOKEN_ISSUER;
const ACCESS_TOKEN_AUDIENCE = process.env.ACCESS_TOKEN_AUDIENCE;

export const generateAccessToken = (user) => {
  if (!user?._id) {
    throw new Error("Cannot generate access token without user ID");
  }
  if (!user?.role) {
    throw new Error("Cannot generate access token without user role");
  }
  const payload = {
    sub: user._id.toString(),
    role: user.role,
  };
  const options = {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
  if (ACCESS_TOKEN_ISSUER) {
    options.issuer = ACCESS_TOKEN_ISSUER;
  }
  if (ACCESS_TOKEN_AUDIENCE) {
    options.audience = ACCESS_TOKEN_AUDIENCE;
  }
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
};

export const generateRefreshSecret = () => {
  return crypto.randomBytes(64).toString("base64url");
};

export const hashRefreshSecret = (secret) => {
  return crypto.createHash("sha256").update(secret).digest("hex");
};

export const compareTokenHashes = (incomingHash, storedHash) => {
  if (!incomingHash || !storedHash) {
    return false;
  }
  const incoming = Buffer.from(incomingHash, "hex");
  const stored = Buffer.from(storedHash, "hex");
  if (incoming.length !== stored.length) {
    return false;
  }
  return crypto.timingSafeEqual(incoming, stored);
};

export const generateTokenFamilyId = () => {
  return crypto.randomUUID();
};
