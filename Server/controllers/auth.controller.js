import { asyncHandler, APIERR, APIRES } from "../utils/helper.utils.js";
import { Student } from "../models/students.models.js";
import { cookieConfig } from "../config/cookieConfig.config.js";
import { HTTP_STATUS } from "../config/httpConfig.config.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Student.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    await user.hashRefreshToken(refreshToken);
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Err While Generating the Tokens", error);
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
    signature,
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
      signature,
      gurdianName,
      gurdianMobile,
    ].some((val) => !val || val.trim() === "")
  ) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "Please provide the required fields",
    );
  }

  // Find if the students already exist or not
  const isStudentExist = await Student.findOne({ email });
  if (isStudentExist)
    throw new APIERR(
      HTTP_STATUS.CONFLICT,
      "Another students with this mail already exists.",
    );
});

export { registerStudents };
