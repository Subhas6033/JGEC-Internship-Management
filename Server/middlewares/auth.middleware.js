import jwt from "jsonwebtoken";

import { APIERR } from "../utils/helper.utils.js";
import { HTTP_STATUS } from "../config/httpConfig.config.js";

const verifyStudentJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(
      new APIERR(HTTP_STATUS.UNAUTHORIZED, "Access token is required"),
    );
  }

  const accessToken = authorization.substring(7).trim();

  if (!accessToken) {
    return next(
      new APIERR(HTTP_STATUS.UNAUTHORIZED, "Access token is required"),
    );
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      {
        issuer: process.env.ACCESS_TOKEN_ISSUER,
        audience: process.env.ACCESS_TOKEN_AUDIENCE,
      },
    );

    req.student = {
      _id: decodedToken.sub,
      role: decodedToken.role,
      name: decodedToken.name,
      email: decodedToken.email,
    };

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new APIERR(HTTP_STATUS.UNAUTHORIZED, "Access token expired"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new APIERR(HTTP_STATUS.UNAUTHORIZED, "Invalid access token"));
    }

    return next(new APIERR(HTTP_STATUS.UNAUTHORIZED, "Authentication failed"));
  }
};

export { verifyStudentJWT };
