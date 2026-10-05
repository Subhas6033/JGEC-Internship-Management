import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectStatus,
  selectUser,
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

const AuthRoute = ({ children }) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectStatus);
  if (status === "loading") {
    return <Loading message="Verifying authentication..." />;
  }
  if (isAuthenticated && user) {
    const from = location.state?.from?.pathname;
    return <Navigate to={from || getRoleDashboard(user.role)} replace />;
  }
  return children;
};

export default AuthRoute;
