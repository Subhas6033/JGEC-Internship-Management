import { Admin } from "../../../models/admin.model.js";

const findAdminByEmail = (email, includePassword = false) => {
  const query = Admin.findOne({ email });
  return includePassword ? query.select("+password") : query;
};

const findAdminById = (adminId) =>
  Admin.findById(adminId).select("-password -__v");

const createAdmin = (payload) => Admin.create(payload);

const updateAdminLastLogin = async (adminId) =>
  Admin.findByIdAndUpdate(
    adminId,
    { $set: { lastLoginAt: new Date() } },
    { new: true },
  ).select("-password -__v");

export { findAdminByEmail, findAdminById, createAdmin, updateAdminLastLogin };
