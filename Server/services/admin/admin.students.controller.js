import { asyncHandler, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";

import {
  updateStudent,
  deleteStudent,
  getAllStudents,
} from "./admin.students.service.js";

const getAllStudentDetails = asyncHandler(async (req, res) => {
  const result = await getAllStudents(req.query);

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(HTTP_STATUS.OK, result, "Students fetched successfully"));
});

const updateStudentDetails = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await updateStudent(studentId, req.body);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        { student },
        "Student details updated successfully",
      ),
    );
});

const deleteStudentAccount = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await deleteStudent(studentId);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(HTTP_STATUS.OK, { student }, "Student deleted successfully"),
    );
});

export { getAllStudentDetails, updateStudentDetails, deleteStudentAccount };
