import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { normalizeRole } from "../../config/auth.config.js";
import {
  cloudinary,
  uploadToCloudinary,
} from "../../upload/uploadOnCloudinary.upload.js";
import { TPO } from "../../models/tpo.models.js";
import { SPOC } from "../../models/spoc.models.js";
import { Admin } from "../../models/admin.model.js";

// Centralized role-to-model mapping
const USER_MODELS = {
  TPO,
  SPOC,
  ADMIN: Admin,
};

// Update profile for TPO, SPOC and Admin
const updateProfile = asyncHandler(async (req, res) => {
  const { role, fullName, email, mobileNumber } = req.body;

  // Validate role
  if (!role || typeof role !== "string") {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "User role is required");
  }

  const normalizedRole = role.trim().toUpperCase();

  // Verify authenticated user's role
  if (normalizedRole !== req.user.role?.toUpperCase()) {
    throw new APIERR(
      HTTP_STATUS.FORBIDDEN,
      "You are not authorized to update this profile",
    );
  }

  // Find model according to role
  const UserModel = USER_MODELS[normalizedRole];

  if (!UserModel) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Profile update is not supported for this role",
    );
  }

  // Validate required fields
  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof mobileNumber !== "string" ||
    !fullName.trim() ||
    !email.trim() ||
    !mobileNumber.trim()
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide full name, email and mobile number",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = mobileNumber.trim();

  // Validate full name
  if (fullName.trim().length < 2 || fullName.trim().length > 100) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Full name must be between 2 and 100 characters",
    );
  }

  // Validate email format
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide a valid email address",
    );
  }

  // Validate Indian mobile number
  if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide a valid 10-digit mobile number",
    );
  }

  // Find authenticated user
  const user = await UserModel.findById(req.user._id);

  if (!user) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "User account not found");
  }

  // Check email uniqueness within the selected role model
  const existingEmail = await UserModel.findOne({
    email: normalizedEmail,
    _id: { $ne: user._id },
  });

  if (existingEmail) {
    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists",
    );
  }

  // Update profile fields
  user.fullName = fullName.trim();
  user.email = normalizedEmail;

  // TPO and SPOC schemas use mobile
  // Admin schema should also be checked for its mobile field
  if (UserModel.schema.path("mobile")) {
    user.mobile = normalizedMobile;
  } else if (UserModel.schema.path("mobileNumber")) {
    user.mobileNumber = normalizedMobile;
  } else {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Mobile field is not configured in the user model",
    );
  }

  await user.save();

  // Fetch updated user without sensitive fields
  const updatedUser = await UserModel.findById(user._id)
    .select("-password -__v")
    .lean();

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        user: updatedUser,
      },
      "Profile updated successfully",
    ),
  );
});

// Update signature for the TPO,SPOC and Admin

const updateUserSignature = asyncHandler(async (req, res) => {
  // Verify authenticated user
  if (!req.user?._id || !req.user?.role) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Authentication is required");
  }

  //  Identify user model using authenticated role
  const role = String(req.user.role).trim().toUpperCase();
  const UserModel = USER_MODELS[role];

  if (!UserModel) {
    throw new APIERR(
      HTTP_STATUS.FORBIDDEN,
      "You are not authorized to upload a signature",
    );
  }

  //  Validate uploaded file
  if (!req.file) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Signature file is required");
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Signature must be a PNG or JPG image",
    );
  }

  if (!req.file.buffer) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid signature file");
  }

  //  Find authenticated user
  const user = await UserModel.findById(req.user._id);

  if (!user) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  //  Upload signature to Cloudinary
  const folder = `${
    process.env.CLOUDINARY_FOLDER || "jgec-internship"
  }/${role.toLowerCase()}/${user._id}/signature`;

  const upload = await uploadToCloudinary(
    req.file.buffer,
    "image",
    folder,
    undefined,
    {
      removeSignatureBackground: true,
    },
  );

  if (!upload?.secure_url || !upload?.public_id) {
    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Signature upload failed",
    );
  }

  //  Preserve previous Cloudinary public ID
  const previousPublicId = user.signaturePublicId;

  const signature = {
    url: upload.secure_url,
    publicId: upload.public_id,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    uploadedAt: new Date(),
  };

  try {
    //  Update user signature
    user.signature = signature.url;
    user.signaturePublicId = signature.publicId;

    await user.save();
  } catch (error) {
    // Delete newly uploaded image if database update fails
    await cloudinary.uploader
      .destroy(upload.public_id, {
        resource_type: "image",
      })
      .catch(() => {});

    throw error;
  }

  //  Delete previous signature after successful update
  if (previousPublicId) {
    await cloudinary.uploader
      .destroy(previousPublicId, {
        resource_type: "image",
      })
      .catch((error) => {
        console.error("Previous signature cleanup failed:", error);
      });
  }

  //  Return response
  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        signature: {
          url: signature.url,
          fileName: signature.fileName,
          mimeType: signature.mimeType,
          uploadedAt: signature.uploadedAt,
        },
      },
      "Signature updated successfully",
    ),
  );
});

export { updateProfile, updateUserSignature };
