import { useLoginStudent } from "../../Services/Queries/studentAuth.quires";

const useLogin = () => {
  const mutation = useLoginStudent();

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};

export default useLogin;
