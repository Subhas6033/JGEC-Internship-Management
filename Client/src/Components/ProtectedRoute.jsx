import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectAccessToken } from "../Store/Slice/authSlice";
import { selectStatus } from "../Store/Slice/authSlice";
import Loading from "./Loader/Loading";

/**
 * ProtectedRoute component
 * Wraps protected routes and ensures user is authenticated
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {Array} props.allowedRoles - Optional array of allowed roles (e.g., ['student', 'tpo', 'admin'])
 * @param {Boolean} props.requireRole - If true, requires role matching (default: false)
 */
const ProtectedRoute = ({ children, allowedRoles, requireRole = false }) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const status = useSelector(selectStatus);

  // Check if user is authenticated
  const isAuthenticated = !!user || !!accessToken;

  // If status is loading (initial app load), show loading
  if (status === "loading") {
    return <Loading message="Verifying authentication..." />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  // If role-based access is required
  if (requireRole && allowedRoles && user?.role) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect based on user's role
      switch (user.role) {
        case "student":
          return <Navigate to="/students/dashboard" replace />;
        case "tpo":
          return <Navigate to="/depttpo/dashboard" replace />;
        case "admin":
          return <Navigate to="/admin/dashboard" replace />;
        default:
          return <Navigate to="/auth/login" replace />;
      }
    }
  }

  // User is authenticated and authorized, render children
  return children;
};

export default ProtectedRoute;
