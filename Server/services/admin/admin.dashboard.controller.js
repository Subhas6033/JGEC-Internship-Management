import { asyncHandler, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { getAdminDashboard } from "../../services/admin/admin.dashboard.service.js";

export const getAdminDashboardController = asyncHandler(async (req, res) => {
  const { academicSession, dateRange } = req.query;

  const dashboard = await getAdminDashboard({
    academicSession,
    dateRange,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        dashboard,
        "Admin dashboard data fetched successfully",
      ),
    );
});
