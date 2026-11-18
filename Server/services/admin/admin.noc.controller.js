import * as adminNocService from "./admin.noc.service.js";
import { asyncHandler, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";

// Get pending NOCs for admin approval
export const getPendingNOCs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", department = "" } = req.query;

  const result = await adminNocService.getPendingNOCs({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    search,
    department,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(200, result, "Pending NOCs fetched successfully"));
});

// Get single NOC details for admin review
export const getNOCDetails = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const application = await adminNocService.getNOCDetails(applicationId);

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(200, application, "NOC details fetched successfully"));
});

// Approve and send NOC to student
export const approveAndSendNOC = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const adminId = req.user._id;

  const result = await adminNocService.approveAndSendNOC(applicationId, adminId);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(200, result, "NOC approved and sent to student successfully")
    );
});

// Bulk approve and send NOCs
export const bulkApproveAndSendNOCs = asyncHandler(async (req, res) => {
  const { applicationIds } = req.body;
  const adminId = req.user._id;

  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(
        new APIRES(
          HTTP_STATUS.BAD_REQUEST,
          null,
          "applicationIds must be a non-empty array"
        )
      );
  }

  const result = await adminNocService.bulkApproveAndSendNOCs(
    applicationIds,
    adminId
  );

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(200, result, "Bulk NOC approval completed"));
});

// Get NOC statistics for admin dashboard
export const getNOCStats = asyncHandler(async (req, res) => {
  const stats = await adminNocService.getNOCStats();

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(200, stats, "NOC stats fetched successfully"));
});