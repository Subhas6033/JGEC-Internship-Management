import * as analyticsService from "./admin.analytics.service.js";
import { asyncHandler, APIRES } from "../../utils/helper.utils.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const { period = "12m" } = req.query;

  const validPeriods = ["30d", "90d", "12m"];
  const selectedPeriod = validPeriods.includes(period) ? period : "12m";

  const result = await analyticsService.getAdminAnalytics(selectedPeriod);

  return res
    .status(200)
    .json(new APIRES(200, result, "Analytics data fetched successfully"));
});