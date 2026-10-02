import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  selectStatus,
} from "../Store/Slice/authSlice";
import Loading from "./Loader/Loading";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireRole = false,
}) => {
  const location = useLocation();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectStatus);

  // Authentication is still being restored
  if (status === "loading") {
    return <Loading message="Verifying authentication..." />;
  }

  // User is not authenticated
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

  // Role-based authorization
  if (requireRole) {
    const userRole = user?.role;

    // Authenticated user does not have a role
    if (!userRole) {
      return <Navigate to="/auth/login" replace />;
    }

    // User has a role but it is not allowed for this route
    if (
      !Array.isArray(allowedRoles) ||
      allowedRoles.length === 0 ||
      !allowedRoles.includes(userRole)
    ) {
      switch (userRole) {
        case "student":
          return <Navigate to="/students/dashboard" replace />;

        case "tpo":
          return <Navigate to="/depttpo/dashboard" replace />;

        case "admin":
          return <Navigate to="/admin/dashboard" replace />;

        case "spoc":
          return <Navigate to="/spoc/dashboard" replace />;

        default:
          return <Navigate to="/auth/login" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
