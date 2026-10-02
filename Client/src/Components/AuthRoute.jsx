import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectStatus } from "../Store/Slice/authSlice";
import Loading from "./Loader/Loading";

const AuthRoute = ({ children }) => {
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectStatus);

  if (status === "loading") {
    return <Loading message="Verifying authentication..." />;
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname;

    return <Navigate to={from || "/students/dashboard"} replace />;
  }

  return children;
};

export default AuthRoute;
