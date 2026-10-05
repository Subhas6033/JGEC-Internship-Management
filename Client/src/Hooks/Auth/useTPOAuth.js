import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setAuth } from "../../Store/Slice/authSlice";
import { loginTPO, registerTPO } from "../../Services/Auth/tpoAuthApi";

const useRegisterTPO = () => {
  return useMutation({
    mutationFn: registerTPO,
  });
};

const useLoginTPO = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginTPO,

    onSuccess: (response) => {
      const data = response?.data;
      const user = data?.tpo;
      const accessToken = data?.accessToken;

      if (!user) {
        throw new Error("Authenticated TPO was not returned");
      }

      if (!accessToken) {
        throw new Error("Access token was not returned");
      }

      dispatch(
        setAuth({
          user,
          accessToken,
        }),
      );
    },
  });
};

export { useRegisterTPO, useLoginTPO };
