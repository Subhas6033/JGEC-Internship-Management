import { asyncHandler, APIERR, APIRES } from "../../utils/helper.utils.js";
import { Student } from "../../models/students.models.js";
import { uploadToCloudinary } from "../../upload/uploadOnCloudinary.upload.js";
import {
  cookieConfig,
  clearCookieConfig,
  getRefreshCookieName,
} from "../../config/cookieConfig.config.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import {
  createUserSession,
  rotateUserSession,
  revokeUserSession,
} from "../../services/auth/session.service.js";

const USER_MODEL = "Student";
const REFRESH_COOKIE_NAME = getRefreshCookieName(USER_MODEL);

// Register a Students
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
  const existingStudent = await Student.findOne({
    $or: [
      {
        email: normalizedEmail,
      },
      {
        rollNumber: normalizedRollNumber,
      },
    ],
  });

  if (existingStudent) {
    if (existingStudent.email === normalizedEmail) {
      throw new APIERR(
        HTTP_STATUS.CONFLICT,
        "Another student with this email already exists.",
      );
    }

    if (existingStudent.rollNumber === normalizedRollNumber) {
      throw new APIERR(
        HTTP_STATUS.CONFLICT,
        "Another student with this roll number already exists.",
      );
    }
  }

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
    signature: uploadedSignature.secure_url,
    gurdianName: gurdianName.trim(),
    gurdianMobile: gurdianMobile.trim(),
  });
  // Replace existing browsers sessions
  await revokeUserSession(
    req.cookies?.[REFRESH_COOKIE_NAME],
    "replaced_by_new_login",
  );
  // Create centralize authentications
  const { accessToken, refreshToken } = await createUserSession(
    student,
    USER_MODEL,
    req,
  );

  const registeredStudent = await Student.findById(student._id).select(
    "-__v -password",
  );

  return res
    .status(HTTP_STATUS.CREATED)
    .cookie(REFRESH_COOKIE_NAME, refreshToken, cookieConfig)
    .json(
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

// Login a Students
const loginStudents = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide the required fields",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const student = await Student.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!student) {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "We don't find your account with this mail. Please signup",
    );
  }

  const isPasswordCorrect = await student.isPasswordValid(password);

  if (!isPasswordCorrect) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Wrong password. Please provide the right password",
    );
  }

  // Replace current browsers sessions
  await revokeUserSession(
    req.cookies?.[REFRESH_COOKIE_NAME],
    "replaced_by_new_login",
  );

  const { accessToken, refreshToken } = await createUserSession(
    student,
    USER_MODEL,
    req,
  );
  const safeStudent = student.toObject();
  delete safeStudent.password;
  return res
    .status(HTTP_STATUS.SUCCESS)
    .cookie(REFRESH_COOKIE_NAME, refreshToken, cookieConfig)
    .json(
      new APIRES(
        HTTP_STATUS.SUCCESS,
        {
          student: safeStudent,
          accessToken,
        },
        "Successfully logged in",
      ),
    );
});

// Logout
const logoutStudent = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  await revokeUserSession(refreshToken, "logout");
  return res
    .status(HTTP_STATUS.SUCCESS)
    .clearCookie(REFRESH_COOKIE_NAME, clearCookieConfig)
    .json(new APIRES(HTTP_STATUS.SUCCESS, null, "Logged out successfully"));
});

// Refresh accessToken
const refreshAccessToken = asyncHandler(async (req, res) => {
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
  ];

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
      },
      "Access token refreshed successfully",
    ),
  );
});

// Get the current users
const getCurrentStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user?._id).select(
    "-__v -password",
  );

  if (!student) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Student not found");
  }

  res.set("Cache-Control", "no-store");

  return res.status(HTTP_STATUS.SUCCESS).json(
    new APIRES(
      HTTP_STATUS.SUCCESS,
      {
        student,
      },
      "Current student fetched successfully",
    ),
  );
});

export {
  registerStudents,
  loginStudents,
  refreshAccessToken,
  logoutStudent,
  getCurrentStudent,
};
