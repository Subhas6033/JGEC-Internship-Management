import { asyncHandler, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { cookieConfig } from "../../config/cookieConfig.config.js";
import { registerAdmin, loginAdmin } from "./admin.auth.service.js";

const adminRegistration = asyncHandler(async (req, res) => {
  const admin = await registerAdmin(req.body);

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new APIRES(
        HTTP_STATUS.CREATED,
        { admin },
        "Administrator account created successfully",
      ),
    );
});

const adminLogin = asyncHandler(async (req, res) => {
  const { admin, accessToken, refreshToken, refreshCookieName } =
    await loginAdmin(req.body, req);

  res.set("Cache-Control", "no-store");

  return res
    .status(HTTP_STATUS.SUCCESS)
    .cookie(refreshCookieName, refreshToken, cookieConfig)
    .json(
      new APIRES(
        HTTP_STATUS.SUCCESS,
        { admin, accessToken },
        "Successfully logged in",
      ),
    );
});

export { adminRegistration, adminLogin };
