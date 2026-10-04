import { useRegisterStudent } from "../../Services/Queries/studentAuth.quires";

const useSignup = () => {
  const mutation = useRegisterStudent();

  return {
    signup: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};

export default useSignup;
