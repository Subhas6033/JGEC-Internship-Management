import { Router } from "express";
import multer from "multer";
import {
  registerStudents,
  loginStudents,
} from "../services/auth/auth.service.js";
import {
  tpoLogin,
  tpoRegistrations,
} from "../services/auth/tpo.auth.service.js";
import {
  spocRegistration,
  spocLogin,
} from "../services/auth/spoc.auth.controller.js";
import {
  adminLogin,
  adminRegistration,
} from "../services/auth/admin.auth.controller.js";
import {
  studentOTP,
  tpoOTP,
  spocOTP,
  adminOTP,
} from "../services/auth/otp.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../services/auth/tokenRotation.service.js";
import {
  getCurrentUser,
  logoutUser,
} from "../services/auth/current-user.service.js";
import {
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../services/auth/passwordReset.controller.js";

const authRoutes = Router();
// Multer Configurations for File uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    // Maximum signature file size: 100 KB
    fileSize: 100 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, JPEG, PNG and WEBP signature images are allowed"),
        false,
      );
    }

    cb(null, true);
  },
});

// Students Auth Routes
authRoutes
  .post("/students/register", upload.single("signature"), registerStudents)
  .post("/students/login", loginStudents)
  .post("/students/otp/verify", studentOTP.verifyOTP)
  .post("/students/otp/resend", studentOTP.resendOTP)
  // TPO Auth Routes
  .post("/tpo/register", tpoRegistrations)
  .post("/tpo/login", tpoLogin)
  .post("/tpo/otp/verify", tpoOTP.verifyOTP)
  .post("/tpo/otp/resend", tpoOTP.resendOTP)
  // SPOC Auth Routes
  .post("/spoc/register", spocRegistration)
  .post("/spoc/login", spocLogin)
  .post("/spoc/otp/verify", spocOTP.verifyOTP)
  .post("/spoc/otp/resend", spocOTP.resendOTP)
  // Admin Auth Routes
  .post("/admin/register", adminRegistration)
  .post("/admin/login", adminLogin)
  .post("/admin/otp/verify", adminOTP.verifyOTP)
  .post("/admin/otp/resend", adminOTP.resendOTP)

  /*
  Centralize Routes for Token Rotations, logout, forgot-password and get the Current Users
  */

  // Refresh token rotation
  .post("/refresh-token", refreshAccessToken)
  // Get currently authenticated user
  .get("/me", authenticateUser, getCurrentUser)
  // Centralized logout
  .post("/logout", logoutUser)
  // Centralize forgot-password
  .post("/forgot-password", forgotPassword)
  .post("/verify-reset-token", verifyResetToken)
  .post("/reset-password", resetPassword);

export { authRoutes };
