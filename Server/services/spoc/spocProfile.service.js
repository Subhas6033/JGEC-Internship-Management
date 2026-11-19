import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import {
  clearCookieConfig,
  getRefreshCookieName,
} from "../../config/cookieConfig.config.js";
import { SPOC } from "../../models/spoc.models.js";
import { uploadToCloudinary } from "../../upload/uploadOnCloudinary.upload.js";
import { revokeAllUserSessions } from "../auth/session.service.js";

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;
const MAX_SIGNATURE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_SIGNATURE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const SAFE_FIELDS = "-__v -password";

const getSpocId = (req) => req.user?._id;

const findSafeSpoc = async (spocId) => {
  const spoc = await SPOC.findById(spocId).select(SAFE_FIELDS);

  if (!spoc) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "SPOC account not found");
  }

  return spoc;
};

// Get the SPOC profile
export const getMyProfile = asyncHandler(async (req, res) => {
  const spoc = await findSafeSpoc(getSpocId(req));

  res.set("Cache-Control", "no-store");

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(HTTP_STATUS.OK, { spoc }, "SPOC profile fetched successfully"),
    );
});

// Update editable profile details (name + mobile)
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { fullName, mobile } = req.body ?? {};
  const updates = {};

  if (fullName !== undefined) {
    const name = String(fullName).trim();

    if (name.length < 2 || name.length > 100) {
      throw new APIERR(
        HTTP_STATUS.BAD_REQUEST,
        "Full name must be between 2 and 100 characters",
      );
    }

    updates.fullName = name;
  }

  if (mobile !== undefined) {
    const phone = String(mobile).trim();

    if (!MOBILE_REGEX.test(phone)) {
      throw new APIERR(
        HTTP_STATUS.BAD_REQUEST,
        "Please provide a valid 10-digit mobile number",
      );
    }

    updates.mobile = phone;
  }

  if (Object.keys(updates).length === 0) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "No profile changes were provided",
    );
  }

  const spoc = await SPOC.findByIdAndUpdate(
    getSpocId(req),
    { $set: updates },
    { new: true, runValidators: true },
  ).select(SAFE_FIELDS);

  if (!spoc) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "SPOC account not found");
  }

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(HTTP_STATUS.OK, { spoc }, "Profile updated successfully"));
});

// Change password, then end every session so the SPOC signs in again
export const changeMyPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};

  if (!currentPassword || !newPassword) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Current password and new password are required",
    );
  }

  if (!PASSWORD_REGEX.test(newPassword)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Password must be 8-20 characters and include at least one letter and one number",
    );
  }

  if (currentPassword === newPassword) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "New password must be different from the current password",
    );
  }

  const spoc = await SPOC.findById(getSpocId(req)).select("+password");

  if (!spoc) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "SPOC account not found");
  }

  const isCurrentPasswordCorrect = await spoc.comparePassword(currentPassword);

  if (!isCurrentPasswordCorrect) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Current password is incorrect");
  }

  // The model's pre-save hook hashes the new password
  spoc.password = newPassword;
  await spoc.save();

  await revokeAllUserSessions(spoc._id, "SPOC", "password_changed");

  return res
    .status(HTTP_STATUS.OK)
    .clearCookie(getRefreshCookieName("SPOC"), clearCookieConfig)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        null,
        "Password changed successfully. Please sign in again.",
      ),
    );
});

// Upload / replace the SPOC signature
export const updateMySignature = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Signature file is required");
  }

  if (!ALLOWED_SIGNATURE_TYPES.includes(req.file.mimetype)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Signature must be a PNG, JPG or WEBP image",
    );
  }

  if (req.file.size > MAX_SIGNATURE_SIZE) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Signature must not exceed 2 MB");
  }

  const current = await findSafeSpoc(getSpocId(req));

  // Fixed public id => the previous signature is overwritten, no orphaned files
  const upload = await uploadToCloudinary(
    req.file.buffer,
    "image",
    `${process.env.CLOUDINARY_FOLDER || "jgec-internship"}/spoc/signatures`,
    `signature_${current.spocId}`,
    { removeSignatureBackground: true },
  );

  if (!upload?.secure_url) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Signature upload failed",
    );
  }

  const spoc = await SPOC.findByIdAndUpdate(
    current._id,
    { $set: { signature: upload.secure_url } },
    { new: true },
  ).select(SAFE_FIELDS);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(HTTP_STATUS.OK, { spoc }, "Signature updated successfully"),
    );
});
