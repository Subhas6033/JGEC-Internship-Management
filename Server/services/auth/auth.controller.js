import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { Student } from "../../models/students.models.js";
import { uploadToCloudinary } from "../../upload/uploadOnCloudinary.upload.js";
import { cookieConfig } from "../../config/cookieConfig.config.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Student.findById(userId);
    if (!user) {
      throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // Hash refresh token before storing it
    const hashedRefreshToken = await user.hashRefreshToken(refreshToken);
    user.refreshToken = hashedRefreshToken;
    await user.save({
      validateBeforeSave: false,
    });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("Error while generating the tokens:", error);
    throw error;
  }
};

const registerStudents = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    mobileNumber,
    password,
    rollNumber,
    department,
    gurdianName,
    gurdianMobile,
  } = req.body;

  if (
    [
      fullName,
      email,
      mobileNumber,
      password,
      rollNumber,
      department,
      gurdianName,
      gurdianMobile,
    ].some(
      (value) => !value || (typeof value === "string" && value.trim() === ""),
    )
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide all the required fields",
    );
  }

  if (!req.file) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Signature file is required");
  }

  const signatureFile = req.file;
  // Minimum and maximum signature file size
  const MIN_SIGNATURE_SIZE = 30 * 1024;
  const MAX_SIGNATURE_SIZE = 100 * 1024;

  if (
    signatureFile.size < MIN_SIGNATURE_SIZE ||
    signatureFile.size > MAX_SIGNATURE_SIZE
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Signature file size must be between 30 KB and 100 KB",
    );
  }

  const allowedSignatureTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedSignatureTypes.includes(signatureFile.mimetype)) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Signature must be a JPG, JPEG, PNG or WEBP image",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedRollNumber = rollNumber.trim();
  // Check if the students already exist or not
  const isStudentExist = await Student.findOne({
    $or: [
      {
        email: normalizedEmail,
      },
      {
        rollNumber: normalizedRollNumber,
      },
    ],
  });

  if (isStudentExist) {
    if (isStudentExist.email === normalizedEmail) {
      throw new APIERR(
        HTTP_STATUS.CONFLICT,
        "Another student with this email already exists.",
      );
    }

    if (isStudentExist.rollNumber === normalizedRollNumber) {
      throw new APIERR(
        HTTP_STATUS.CONFLICT,
        "Another student with this roll number already exists.",
      );
    }
  }

  // Upload signature on cloudinary
  let uploadedSignature;

  try {
    uploadedSignature = await uploadToCloudinary(
      signatureFile.buffer,
      "image",
      "jgec-internship/students/signatures",
      `signature_${normalizedRollNumber}`,
    );
  } catch (error) {
    console.error("Signature upload failed:", error);

    throw new APIERR(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to upload signature. Please try again.",
    );
  }

  const student = await Student.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    mobileNumber: mobileNumber.trim(),
    password,
    rollNumber: normalizedRollNumber,
    department,
    // Store Cloudinary URL
    signature: uploadedSignature.secure_url,
    gurdianName: gurdianName.trim(),
    gurdianMobile: gurdianMobile.trim(),
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    student._id,
  );

  const registeredStudent = await Student.findById(student._id).select(
    "-__v -password -refreshToken",
  );

  res.cookie("refreshToken", refreshToken, cookieConfig);

  return res.status(HTTP_STATUS.CREATED).json(
    new APIRES(
      HTTP_STATUS.CREATED,
      {
        student: registeredStudent,
        accessToken,
      },
      "Student registered successfully",
    ),
  );
});

const loginStudents = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide the required fields",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find if the students exist or not
  const isStudentExist = await Student.findOne({
    email: normalizedEmail,
  }).select("+password");
  if (!isStudentExist) {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      `We don't find your account with this mail. Please signup`,
    );
  }

  // Compare the password
  const isPasswordCorrect = await isStudentExist.isPasswordValid(password);
  if (!isPasswordCorrect) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      `Wrong Password!!! Please provide the right password`,
    );
  }

  const student = await Student.findOne({ email: normalizedEmail }).select(
    "-__v -password -refreshToken",
  );

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    student._id,
  );

  return res
    .status(HTTP_STATUS.SUCCESS)
    .cookie("refreshToken", refreshToken, cookieConfig)
    .json(
      new APIRES(
        HTTP_STATUS.SUCCESS,
        { student, accessToken },
        `Successfully logged in`,
      ),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Refresh token is required");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  const student = await Student.findById(decodedToken._id).select(
    "+refreshToken",
  );

  if (!student) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Student not found");
  }

  if (!student.refreshToken) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Refresh token is no longer valid. Please login again.",
    );
  }

  // Compare incoming refresh token with the hashed token stored in DB
  const isRefreshTokenValid = await bcrypt.compare(
    incomingRefreshToken,
    student.refreshToken,
  );

  if (!isRefreshTokenValid) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid refresh token. Please login again.",
    );
  }

  // Generate new tokens
  const accessToken = student.generateAccessToken();
  const newRefreshToken = student.generateRefreshToken();

  // Hash the new refresh token before storing it
  const hashedRefreshToken = await student.hashRefreshToken(newRefreshToken);
  student.refreshToken = hashedRefreshToken;
  await student.save({
    validateBeforeSave: false,
  });

  return res
    .status(HTTP_STATUS.SUCCESS)
    .cookie("refreshToken", newRefreshToken, cookieConfig)
    .json(
      new APIRES(
        HTTP_STATUS.SUCCESS,
        {
          accessToken,
        },
        "Access token refreshed successfully",
      ),
    );
});

const logoutStudent = asyncHandler(async (req, res) => {
  await Student.findByIdAndUpdate(req.student._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  return res
    .status(HTTP_STATUS.SUCCESS)
    .clearCookie("refreshToken", cookieConfig)
    .json(new APIRES(HTTP_STATUS.SUCCESS, null, "Logged out successfully"));
});

export { registerStudents, loginStudents, refreshAccessToken, logoutStudent };
