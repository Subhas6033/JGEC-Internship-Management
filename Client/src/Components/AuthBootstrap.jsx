import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setAuth, setAuthLoading } from "../Store/Slice/authSlice";
import {
  getCurrentStudent,
  refreshStudentAccessToken,
} from "../Services/Auth/studentAuth.api";
import Loading from "./Loader/Loading";
import { store } from "../Store/index";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreAuthentication = async () => {
      dispatch(setAuthLoading());

      try {
        /*
         * After a page reload the access token (kept only in Redux memory)
         * is gone, so /me would always fail with 401 first.
         *
         * Refresh up front instead. Single-flight makes React StrictMode's
         * double effect run safe: both calls share ONE refresh request.
         */
        if (!store.getState().auth.accessToken) {
          await refreshStudentAccessToken();
        }

        const studentResponse = await getCurrentStudent();
        const student = studentResponse?.data?.student;
        if (!student) {
          throw new Error("Student information was not returned");
        }

        if (!isMounted) {
          return;
        }

        dispatch(
          setAuth({
            user: student,
            accessToken: store.getState().auth.accessToken,
          }),
        );
      } catch (error) {
        // A visitor who has never logged in lands here (refresh -> 401). That is expected.
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
