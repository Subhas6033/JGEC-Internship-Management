import jwt from "jsonwebtoken";
import { asyncHandler, APIERR } from "../utils/helper.utils.js";
import { HTTP_STATUS } from "../config/httpConfig.config.js";
import { Student } from "../models/students.models.js";

export const verifyStudentJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Access token is required");
  }

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Access token is required");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid or expired access token",
    );
  }

  const student = await Student.findById(decodedToken._id).select(
    "-password -refreshToken -__v",
  );

  if (!student) {
    throw new APIERR(
      HTTP_STATUS.UNAUTHORIZED,
      "Student associated with this token no longer exists",
    );
  }

  req.student = student;
  next();
});
