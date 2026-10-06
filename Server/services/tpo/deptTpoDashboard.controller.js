import { asyncHandler, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { getDeptTpoDashboard } from "./deptTpoDashboard.service.js";

const getDeptTpoDashboardController = asyncHandler(async (req, res) => {
  const dashboard = await getDeptTpoDashboard({
    user: req.user,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        dashboard,
        "Department TPO dashboard fetched successfully",
      ),
    );
});

export { getDeptTpoDashboardController };
