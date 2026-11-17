import * as departmentService from "./admin.department.service.js";
import { asyncHandler, APIRES } from "../../utils/helper.utils.js";

export const getDepartments = asyncHandler(async (_req, res) => {
  const result = await departmentService.listDepartments();

  return res
    .status(200)
    .json(new APIRES(200, result, "Departments fetched successfully"));
});
