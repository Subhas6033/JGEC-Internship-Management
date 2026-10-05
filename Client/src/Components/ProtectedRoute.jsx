import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  selectStatus,
} from "../Store/Slice/authSlice";
import Loading from "./Loader/Loading";

const getRoleDashboard = (role) => {
  switch (role?.toLowerCase()) {
    case "student":
      return "/students/dashboard";

    case "tpo":
      return "/depttpo/dashboard";

    case "spoc":
      return "/spoc/dashboard";

    case "admin":
      return "/admin/dashboard";

    default:
      return "/auth/login";
  }
};

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireRole = false,
}) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectStatus);
  if (status === "loading") {
    return <Loading message="Verifying authentication..." />;
  }
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (requireRole) {
    const userRole = user?.role?.toLowerCase();
    if (!userRole) {
      return <Navigate to="/auth/login" replace />;
    }
    const normalizedAllowedRoles = Array.isArray(allowedRoles)
      ? allowedRoles.map((role) => role.toLowerCase())
      : [];

    if (
      normalizedAllowedRoles.length === 0 ||
      !normalizedAllowedRoles.includes(userRole)
    ) {
      return <Navigate to={getRoleDashboard(userRole)} replace />;
    }
  }
  return children;
};

export default ProtectedRoute;
