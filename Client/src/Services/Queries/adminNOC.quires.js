import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  approveAndSendNoc,
  bulkApproveAndSendNocs,
  fetchNocDetails,
  fetchNocStats,
  fetchPendingNocs,
} from "../admin/adminNOC.api";

// Query keys only contain primitives so they always serialize safely.
const adminNocKeys = {
  all: ["admin-noc"],
  list: (params) => ["admin-noc", "list", params],
  stats: () => ["admin-noc", "stats"],
  details: (applicationId) => ["admin-noc", "details", applicationId],
};

// List of generated NOCs waiting for the admin
const useAdminNocs = (params = {}) =>
  useQuery({
    queryKey: adminNocKeys.list(params),
    queryFn: () => fetchPendingNocs(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

// Dashboard counters
const useAdminNocStats = () =>
  useQuery({
    queryKey: adminNocKeys.stats(),
    queryFn: fetchNocStats,
    staleTime: 30 * 1000,
  });

// Single NOC (used by the preview modal)
const useAdminNocDetails = (applicationId, { enabled = true } = {}) =>
  useQuery({
    queryKey: adminNocKeys.details(applicationId),
    queryFn: () => fetchNocDetails(applicationId),
    enabled: Boolean(applicationId) && enabled,
    staleTime: 60 * 1000,
  });

// Approve + email a single NOC
const useApproveAndSendNoc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId) => approveAndSendNoc(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNocKeys.all });
    },
  });
};

// Approve + email many NOCs
const useBulkApproveAndSendNocs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationIds) => bulkApproveAndSendNocs(applicationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNocKeys.all });
    },
  });
};

export {
  useAdminNocs,
  useAdminNocStats,
  useApproveAndSendNoc,
  useBulkApproveAndSendNocs,
  useAdminNocDetails,
};
