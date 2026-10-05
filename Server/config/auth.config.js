export const USER_ROLES = {
  STUDENT: "student",
  TPO: "TPO",
  SPOC: "spoc",
  ADMIN: "admin",
};

export const USER_MODELS = {
  student: "Student",
  TPO: "TPO",
  spoc: "SPOC",
  admin: "Admin",
};

export const SUPPORTED_USER_MODELS = new Set([
  "Student",
  "TPO",
  "SPOC",
  "Admin",
]);

export const normalizeRole = (role) => {
  if (!role) return null;
  const roleMap = {
    student: "student",
    STUDENT: "student",
    TPO: "TPO",
    tpo: "TPO",
    spoc: "spoc",
    SPOC: "spoc",
    admin: "admin",
    ADMIN: "admin",
  };

  return roleMap[role] || null;
};

export const roleFromModel = (userModel) => {
  const modelRoleMap = {
    Student: "student",
    TPO: "TPO",
    SPOC: "spoc",
    Admin: "admin",
  };

  return modelRoleMap[userModel] || null;
};
