import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setAuth, setAuthLoading } from "../Store/Slice/authSlice";
import { apiClient, refreshAccessToken } from "../Services/api/apiClient";
import Loading from "./Loader/Loading";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreAuthentication = async () => {
      dispatch(setAuthLoading());

      try {
        const refreshResult = await refreshAccessToken();

        if (!refreshResult?.accessToken) {
          throw new Error("Access token was not returned");
        }

        const response = await apiClient.get("/auth/me");

        console.log("AUTH ME RESPONSE:", response);

        const user = response?.data?.user;

        console.log("AUTH ME USER:", user);

        if (!user?._id) {
          throw new Error("Authenticated user was not returned");
        }

        if (!isMounted) {
          return;
        }

        dispatch(
          setAuth({
            user,
            accessToken: refreshResult.accessToken,
          }),
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        dispatch(clearUser());
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    restoreAuthentication();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (isCheckingAuth) {
    return <Loading message="Verifying authentication..." />;
  }

  return children;
};

export default AuthBootstrap;
