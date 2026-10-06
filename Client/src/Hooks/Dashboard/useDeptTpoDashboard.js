import { useQuery } from "@tanstack/react-query";
import { getDeptTpoDashboard } from "../../Services/Dashboard/deptTpoDashboardApi";

const useDeptTpoDashboard = () => {
  return useQuery({
    queryKey: ["dept-tpo", "dashboard"],
    queryFn: getDeptTpoDashboard,

    staleTime: 60 * 1000,

    refetchOnWindowFocus: false,
  });
};

export { useDeptTpoDashboard };
