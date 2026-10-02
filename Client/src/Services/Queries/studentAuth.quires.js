import { useMutation } from "@tanstack/react-query";
import { registerStudent } from "../Auth/studentAuth.api";

const useRegisterStudent = () => {
  return useMutation({
    mutationFn: registerStudent,
  });
};

export { useRegisterStudent };
