import { Router } from "express";
import multer from "multer";
import {
  registerStudents,
  loginStudents,
  refreshAccessToken,
  logoutStudent,
  getCurrentStudent,
} from "../services/auth/auth.service.js";
import { verifyStudentJWT } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";

const authRoutes = Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    // Max. Signature file Size
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

authRoutes
  .post("/students/register", upload.single("signature"), registerStudents)
  .post("/students/login", loginStudents)
  .post("/students/refresh-token", refreshAccessToken)
  .post("/students/logout", verifyStudentJWT, logoutStudent)
  .get("/students/me", verifyStudentJWT, getCurrentStudent);

export { authRoutes };
