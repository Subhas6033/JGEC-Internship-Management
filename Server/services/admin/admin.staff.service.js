import crypto from "crypto";
import mongoose from "mongoose";
import { TPO } from "../../models/tpo.models.js";
import { SPOC } from "../../models/spoc.models.js";
import { APIERR } from "../../utils/helper.utils.js";

const ROLE_CONFIG = {
  TPO: { Model: TPO, idField: "tpoId" },
  SPOC: { Model: SPOC, idField: "spocId" },
};

// Mongoose validation / duplicate-key errors -> APIERR, so the global
// error handler (or asyncHandler) never has to know about Mongoose.
const withDbErrors = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new APIERR(
        400,
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      );
    }
    if (error.code === 11000) {
      throw new APIERR(409, "Duplicate value already exists.");
    }
    throw error;
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateTemporaryPassword = () =>
  crypto.randomBytes(9).toString("base64url"); // 12 chars, satisfies min length for both models

// Normalises a DB document into the shape the existing frontend components expect.
const toStaffDto = (doc, role) => ({
  _id: doc._id,
  name: doc.fullName,
  employeeId: role === "TPO" ? doc.tpoId : doc.spocId,
  email: doc.email,
  phone: doc.mobile,
  department: doc.department,
  role,
  status: doc.isActive ? "Active" : "Inactive",
  joinedAt: doc.createdAt.toISOString().split("T")[0],
});

// Same normalisation, but as an aggregation $project stage (password is never projected).
const projectStage = (role) => ({
  $project: {
    _id: 1,
    name: "$fullName",
    employeeId: role === "TPO" ? "$tpoId" : "$spocId",
    email: 1,
    phone: "$mobile",
    department: 1,
    role: { $literal: role },
    status: { $cond: ["$isActive", "Active", "Inactive"] },
    joinedAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    createdAt: 1,
  },
});

const findStaffById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new APIERR(400, "Invalid staff id.");
  }

  const tpo = await TPO.findById(id);
  if (tpo) return { doc: tpo, role: "TPO" };

  const spoc = await SPOC.findById(id);
  if (spoc) return { doc: spoc, role: "SPOC" };

  throw new APIERR(404, "Staff member not found.");
};

const assertEmailAvailable = async (email, excludeId) => {
  const filter = { email: email.toLowerCase() };
  if (excludeId) filter._id = { $ne: excludeId };

  const [inTpo, inSpoc] = await Promise.all([
    TPO.exists(filter),
    SPOC.exists(filter),
  ]);

  if (inTpo || inSpoc) {
    throw new APIERR(409, "This email is already registered.");
  }
};

const assertEmployeeIdAvailable = async (role, employeeId, excludeId) => {
  const { Model, idField } = ROLE_CONFIG[role];
  const filter = { [idField]: employeeId.toUpperCase() };
  if (excludeId) filter._id = { $ne: excludeId };

  if (await Model.exists(filter)) {
    throw new APIERR(409, `This ${role} ID is already registered.`);
  }
};

const listStaff = async ({
  page = 1,
  limit = 10,
  search = "",
  role = "All",
  status = "All",
}) => {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  const match = {};

  if (search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    match.$or = [
      { name: regex },
      { employeeId: regex },
      { email: regex },
      { department: regex },
    ];
  }

  if (status === "Active" || status === "Inactive") {
    match.status = status;
  }

  let pipeline;
  let Base;

  if (role === "TPO") {
    Base = TPO;
    pipeline = [projectStage("TPO")];
  } else if (role === "SPOC") {
    Base = SPOC;
    pipeline = [projectStage("SPOC")];
  } else {
    Base = TPO;
    pipeline = [
      projectStage("TPO"),
      {
        $unionWith: {
          coll: SPOC.collection.name,
          pipeline: [projectStage("SPOC")],
        },
      },
    ];
  }

  pipeline.push(
    { $match: match },
    { $sort: { createdAt: -1, _id: -1 } },
    {
      $facet: {
        data: [
          { $skip: (safePage - 1) * safeLimit },
          { $limit: safeLimit },
          { $project: { createdAt: 0 } },
        ],
        total: [{ $count: "count" }],
      },
    },
  );

  const [result] = await Base.aggregate(pipeline);
  const total = result?.total?.[0]?.count ?? 0;

  return {
    data: result?.data ?? [],
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
};

const getStaffStats = async () => {
  const [totalTpos, totalSpocs, activeTpos, activeSpocs] = await Promise.all([
    TPO.countDocuments(),
    SPOC.countDocuments(),
    TPO.countDocuments({ isActive: true }),
    SPOC.countDocuments({ isActive: true }),
  ]);

  return {
    totalStaff: totalTpos + totalSpocs,
    totalTpos,
    totalSpocs,
    activeStaff: activeTpos + activeSpocs,
  };
};

const createStaff = async ({
  name,
  employeeId,
  email,
  phone,
  department,
  role,
}) => {
  if (!ROLE_CONFIG[role]) {
    throw new APIERR(400, "Role must be either TPO or SPOC.");
  }
  if (!name || !employeeId || !email || !phone || !department) {
    throw new APIERR(400, "All fields are required.");
  }

  const { Model, idField } = ROLE_CONFIG[role];

  await assertEmailAvailable(email);
  await assertEmployeeIdAvailable(role, employeeId);

  // The form has no password field, so a one-time temporary password is generated.
  const temporaryPassword = generateTemporaryPassword();

  const doc = await withDbErrors(() =>
    Model.create({
      fullName: name,
      email,
      mobile: phone,
      department,
      [idField]: employeeId,
      password: temporaryPassword,
    }),
  );

  return { staff: toStaffDto(doc, role), temporaryPassword };
};

const updateStaff = async (id, payload) => {
  const { doc, role } = await findStaffById(id);
  const { idField } = ROLE_CONFIG[role];

  if (payload.role && payload.role !== role) {
    throw new APIERR(
      400,
      "Role cannot be changed. Create a new account for the other role.",
    );
  }

  if (payload.email && payload.email.toLowerCase() !== doc.email) {
    await assertEmailAvailable(payload.email, doc._id);
  }

  if (payload.employeeId && payload.employeeId.toUpperCase() !== doc[idField]) {
    await assertEmployeeIdAvailable(role, payload.employeeId, doc._id);
  }

  if (payload.name) doc.fullName = payload.name;
  if (payload.email) doc.email = payload.email;
  if (payload.phone) doc.mobile = payload.phone;
  if (payload.department) doc.department = payload.department;
  if (payload.employeeId) doc[idField] = payload.employeeId;

  await withDbErrors(() => doc.save());

  return toStaffDto(doc, role);
};

const toggleStaffStatus = async (id) => {
  const { doc, role } = await findStaffById(id);

  doc.isActive = !doc.isActive;
  await withDbErrors(() => doc.save());

  return toStaffDto(doc, role);
};

export {
  listStaff,
  getStaffStats,
  createStaff,
  updateStaff,
  toggleStaffStatus,
};
