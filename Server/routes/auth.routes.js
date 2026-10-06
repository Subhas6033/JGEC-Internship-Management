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
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../services/auth/tokenRotation.service.js";
import {
  getCurrentUser,
  logoutUser,
} from "../services/auth/current-user.service.js";

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
  // STUDENTS ROUTES
  .post("/students/register", upload.single("signature"), registerStudents)
  .post("/students/login", loginStudents)
  // TPO ROUTES
  .post("/tpo/register", tpoRegistrations)
  .post("/tpo/login", tpoLogin)

  // SPOC ROUTES
  .post("/spoc/register", spocRegistration)
  .post("/spoc/login", spocLogin)

  // Centralize Token Rotations
  .post("/refresh-token", refreshAccessToken)

  // Centralize get users
  .get("/me", authenticateUser, getCurrentUser)

  // Centralize logout users
  .post("/logout", logoutUser);

export { authRoutes };
