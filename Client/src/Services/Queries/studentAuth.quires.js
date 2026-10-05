import { useMutation } from "@tanstack/react-query";
import {
  loginStudent,
  registerStudent,
} from "../../Services/Auth/studentAuth.api";

const useRegisterStudent = () => {
  return useMutation({
    mutationFn: registerStudent,
  });
};

const useLoginStudent = () => {
  return useMutation({
    mutationFn: loginStudent,
  });
};

export { useRegisterStudent, useLoginStudent };
