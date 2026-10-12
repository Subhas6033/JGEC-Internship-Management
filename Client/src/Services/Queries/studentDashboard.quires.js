import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard } from "../Dashboard/studentDashboard.api";

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ["studentDashboard"],
    queryFn: getStudentDashboard,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
