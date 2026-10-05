import { APIERR, asyncHandler } from "../utils/helper.utils.js";
import { HTTP_STATUS } from "../config/httpConfig.config.js";
import { normalizeRole } from "../config/auth.config.js";

const requireRole = (...allowedRoles) => {
  const normalizedAllowedRoles = allowedRoles
    .map(normalizeRole)
    .filter(Boolean);
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new APIERR(HTTP_STATUS.UNAUTHORIZED, "Authentication is required");
    }
    const userRole = normalizeRole(req.user.role);
    if (!userRole) {
      throw new APIERR(HTTP_STATUS.FORBIDDEN, "Invalid user role");
    }
    if (!normalizedAllowedRoles.includes(userRole)) {
      throw new APIERR(
        HTTP_STATUS.FORBIDDEN,
        "You are not authorized to access this resource",
      );
    }
    return next();
  });
};

export { requireRole };
