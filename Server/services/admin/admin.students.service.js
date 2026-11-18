import mongoose from "mongoose";
import { Student } from "../../models/students.models.js";
import { APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";

const ALLOWED_UPDATE_FIELDS = [
  "fullName",
  "email",
  "mobileNumber",
  "rollNumber",
  "department",
  "signature",
  "guardianName",
  "guardianMobile",
];

// Escape special regex characters in search input.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Update student details.
 * Password and role cannot be changed through this service.
 */
const updateStudent = async (studentId, updateData) => {
  if (!mongoose.isValidObjectId(studentId)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid student ID");
  }

  const filteredData = {};

  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(updateData, field)) {
      filteredData[field] = updateData[field];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw new APIERR(
      HTTP_STATUS.BAD_REQUEST,
      "No valid student fields provided for update",
    );
  }

  // Normalize email before updating.
  if (filteredData.email) {
    filteredData.email = filteredData.email.trim().toLowerCase();
  }

  const updatedStudent = await Student.findByIdAndUpdate(
    studentId,
    { $set: filteredData },
    {
      new: true,
      runValidators: true,
      context: "query",
    },
  ).select("-password");

  if (!updatedStudent) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  return updatedStudent;
};

/**
 * Permanently delete a student.
 */
const deleteStudent = async (studentId) => {
  if (!mongoose.isValidObjectId(studentId)) {
    throw new APIERR(HTTP_STATUS.BAD_REQUEST, "Invalid student ID");
  }

  const deletedStudent = await Student.findByIdAndDelete(studentId);

  if (!deletedStudent) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  return {
    _id: deletedStudent._id,
    fullName: deletedStudent.fullName,
    rollNumber: deletedStudent.rollNumber,
  };
};

/**
 * Get all students with pagination and search.
 */
const getAllStudents = async (query = {}) => {
  let { page = 1, limit = 10, search = "", department } = query;

  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

  const filter = {};

  // Search by name, email, roll number or mobile number.
  if (search.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), "i");

    filter.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
      { rollNumber: searchRegex },
      { mobileNumber: searchRegex },
    ];
  }

  // Filter students by department.
  if (department) {
    filter.department = department.toUpperCase();
  }

  const skip = (page - 1) * limit;

  const [students, totalStudents] = await Promise.all([
    Student.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Student.countDocuments(filter),
  ]);

  return {
    students,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      totalStudents,
      limit,
      hasNextPage: page * limit < totalStudents,
      hasPrevPage: page > 1,
    },
  };
};

export { updateStudent, deleteStudent, getAllStudents };
