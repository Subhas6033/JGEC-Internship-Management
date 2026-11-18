import * as staffService from "./admin.staff.service.js";
import { asyncHandler, APIRES } from "../../utils/helper.utils.js";

const getStaff = asyncHandler(async (req, res) => {
  const { page, limit, search, role, status } = req.query;

  const result = await staffService.listStaff({
    page,
    limit,
    search: search ?? "",
    role,
    status,
  });
  return res
    .status(200)
    .json(
      new APIRES(
        200,
        { staff: result.data, pagination: result.pagination },
        "Staff fetched successfully",
      ),
    );
});

const getStaffStats = asyncHandler(async (_req, res) => {
  const stats = await staffService.getStaffStats();

  return res
    .status(200)
    .json(new APIRES(200, stats, "Staff stats fetched successfully"));
});

const createStaff = asyncHandler(async (req, res) => {
  const { staff, temporaryPassword } = await staffService.createStaff(req.body);

  return res
    .status(201)
    .json(
      new APIRES(
        201,
        { staff, temporaryPassword },
        `${staff.role} created successfully`,
      ),
    );
});

const updateStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.updateStaff(req.params.id, req.body);

  return res
    .status(200)
    .json(new APIRES(200, { staff }, "Staff updated successfully"));
});

const toggleStaffStatus = asyncHandler(async (req, res) => {
  const staff = await staffService.toggleStaffStatus(req.params.id);

  return res
    .status(200)
    .json(
      new APIRES(
        200,
        { staff },
        `Account ${staff.status.toLowerCase()} successfully`,
      ),
    );
});

export { getStaff, getStaffStats, createStaff, updateStaff, toggleStaffStatus };
