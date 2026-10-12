import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getApiData,
  getSpocApplications,
  getSpocApplicationById,
  getSpocApplicationsByOrganisation,
  acceptSpocApplication,
  sendBackSpocApplication,
  reviewSpocApplication,
  generateSpocNoc,
  generateBulkSpocNoc,
  getSpocApplicationNoc,
  downloadSpocNocPdf,
  getSpocNocs,
  downloadBlob,
} from "../../Services/Application/spocApplication.api";

const normalizeOrganisation = (organisation) => {
  if (!organisation) {
    return {
      _id: null,
      id: null,
      name: "Unknown Company",
      companyName: "Unknown Company",
      location: "Location not available",
      organisationName: "Unknown Company",
      organisationLocation: "Location not available",
      organisationMail: "",
      organisationSite: "",
    };
  }
  const id = organisation?._id ?? organisation?.id ?? null;
  const name =
    organisation?.organisationName ||
    organisation?.name ||
    organisation?.companyName ||
    "Unknown Company";
  const location =
    organisation?.organisationLocation ||
    organisation?.location ||
    organisation?.city ||
    "Location not available";
  return {
    ...organisation,
    _id: id,
    id,
    name,
    companyName: name,
    organisationName: name,
    location,
    organisationLocation: location,
  };
};

const normalizeStudent = (student) => {
  if (!student) {
    return {
      _id: null,
      id: null,
      name: "Unknown Student",
      fullName: "Unknown Student",
      email: "",
      rollNo: "N/A",
      rollNumber: "N/A",
      department: "N/A",
      departmentCode: "N/A",
    };
  }
  const department =
    typeof student?.department === "string"
      ? student.department
      : student?.department?.code || student?.department?.name || "N/A";
  const id = student?._id ?? student?.id ?? null;
  const fullName = student?.fullName || student?.name || "Unknown Student";
  const rollNumber = student?.rollNumber || student?.rollNo || "N/A";
  const departmentCode =
    student?.departmentCode ||
    (typeof student?.department === "object"
      ? student?.department?.code
      : student?.department) ||
    "N/A";
  return {
    ...student,
    _id: id,
    id,
    name: fullName,
    fullName,
    rollNo: rollNumber,
    rollNumber,
    department,
    departmentCode,
  };
};

const normalizeNoc = (noc) => {
  if (!noc) {
    return null;
  }
  const id = noc?._id ?? noc?.id ?? null;
  return {
    ...noc,
    _id: id,
    id,
    referenceNumber: noc?.referenceNumber || noc?.nocReference || "N/A",
    generatedAt: noc?.generatedAt || noc?.createdAt || null,
  };
};

// Applications Normalizers
const normalizeApplication = (application) => {
  if (!application) {
    return null;
  }

  const id =
    application?._id ?? application?.id ?? application?.applicationId ?? null;
  const organisation = normalizeOrganisation(application?.organisation);
  const student = normalizeStudent(application?.student);
  const noc = normalizeNoc(application?.noc);
  const status = application?.status;

  let displayStatus = status;

  if (status === "under_spoc_review" || status === "approved_by_tpo") {
    displayStatus = "pending";
  } else if (status === "approved_by_spoc" || status === "noc_generated") {
    displayStatus = "accepted";
  } else if (status === "rejected") {
    displayStatus = "rejected";
  } else if (status === "update_required") {
    displayStatus = "update_required";
  }

  return {
    ...application,
    _id: id,
    id,
    applicationId: id,
    organisation,
    student,
    noc,
    company: organisation?.name || "Unknown Company",
    companyName: organisation?.name || "Unknown Company",
    location: organisation?.location || "Location not available",
    studentName: student?.fullName || "Unknown Student",
    rollNumber: student?.rollNumber || "N/A",
    department: student?.department || "N/A",
    status,
    displayStatus,
  };
};

// Normalize the Collections Response
const normalizeApplicationsResponse = (data) => {
  if (Array.isArray(data)) {
    return data.map(normalizeApplication).filter(Boolean);
  }

  if (Array.isArray(data?.applications)) {
    return data.applications.map(normalizeApplication).filter(Boolean);
  }

  return [];
};

// Get the Applications
const useSpocApplications = ({ search = "", status = "all" } = {}) => {
  return useQuery({
    queryKey: ["spocApplications", search, status],
    queryFn: async () => {
      const response = await getSpocApplications({
        search,
        status,
      });
      const data = getApiData(response);
      return normalizeApplicationsResponse(data);
    },
    staleTime: 30 * 1000,
    retry: 1,
  });
};

// Get a Signle Applications
const useSpocApplication = (applicationId) => {
  return useQuery({
    queryKey: ["spocApplication", applicationId],
    queryFn: async () => {
      const response = await getSpocApplicationById(applicationId);
      const data = getApiData(response);
      return normalizeApplication(data);
    },
    enabled: Boolean(applicationId),
    staleTime: 30 * 1000,
    retry: 1,
  });
};

// Get the Applications by Organisations
const useSpocApplicationsByOrganisation = (organisationId) => {
  return useQuery({
    queryKey: ["spocApplications", "organisation", organisationId],
    queryFn: async () => {
      const response = await getSpocApplicationsByOrganisation(organisationId);
      const data = getApiData(response);
      return normalizeApplicationsResponse(data);
    },
    enabled: Boolean(organisationId),
    staleTime: 30 * 1000,
    retry: 1,
  });
};

// Accept the applications
const useAcceptSpocApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId) => {
      const response = await acceptSpocApplication(applicationId);
      return getApiData(response);
    },
    onSuccess: (_data, applicationId) => {
      queryClient.invalidateQueries({
        queryKey: ["spocApplication", applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spocApplications"],
      });
    },
  });
};

// Send Back the Applications to the Students
const useSendBackSpocApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ applicationId, reason }) => {
      const response = await sendBackSpocApplication(applicationId, reason);
      return getApiData(response);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["spocApplication", variables.applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spocApplications"],
      });
    },
  });
};

// Generic SPOC Reviews
const useReviewSpocApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ applicationId, decision, reason }) => {
      const response = await reviewSpocApplication(applicationId, {
        decision,
        reason,
      });
      return getApiData(response);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["spocApplication", variables.applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spocApplications"],
      });
    },
  });
};

// Get applications NOC
const useSpocApplicationNoc = (applicationId, options = {}) => {
  return useQuery({
    queryKey: ["spocApplicationNoc", applicationId],
    queryFn: async () => {
      const response = await getSpocApplicationNoc(applicationId);
      const data = getApiData(response);
      return normalizeNoc(data);
    },
    enabled: Boolean(applicationId) && (options.enabled ?? true),
    staleTime: 60 * 1000,
    retry: 1,
  });
};

// Generate Single NOCs
const useGenerateSpocNoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId) => {
      const response = await generateSpocNoc(applicationId);
      return getApiData(response);
    },
    onSuccess: (_data, applicationId) => {
      queryClient.invalidateQueries({
        queryKey: ["spocApplication", applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spocApplicationNoc", applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spocApplications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["spocNocs"],
      });
    },
  });
};

// Generate the Bulk NOCs
const useGenerateBulkSpocNoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationIds) => {
      if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
        throw new Error("Select at least one application");
      }
      const response = await generateBulkSpocNoc(applicationIds);
      const data = getApiData(response);
      if (!data) {
        return null;
      }
      return {
        ...data,
        groups: Array.isArray(data?.groups)
          ? data.groups.map((group) => ({
              ...group,
              referenceNumber: group?.referenceNumber || "N/A",
              department: group?.department || "N/A",
              organisation: normalizeOrganisation(group?.organisation),
              applicationIds: Array.isArray(group?.applicationIds)
                ? group.applicationIds
                : [],
              downloadUrls: Array.isArray(group?.downloadUrls)
                ? group.downloadUrls
                : [],
              nocs: Array.isArray(group?.nocs)
                ? group.nocs.map(normalizeNoc).filter(Boolean)
                : [],
            }))
          : [],
        skipped: Array.isArray(data?.skipped) ? data.skipped : [],
      };
    },

    onSuccess: (data) => {
      /**
       * Refresh application lists.
       */
      queryClient.invalidateQueries({
        queryKey: ["spocApplications"],
      });

      /**
       * Refresh all NOCs.
       */
      queryClient.invalidateQueries({
        queryKey: ["spocNocs"],
      });

      /**
       * Refresh every application involved
       * in the bulk operation.
       */
      const applicationIds =
        data?.groups?.flatMap((group) => group?.applicationIds || []) || [];

      applicationIds.forEach((applicationId) => {
        queryClient.invalidateQueries({
          queryKey: ["spocApplication", applicationId],
        });

        queryClient.invalidateQueries({
          queryKey: ["spocApplicationNoc", applicationId],
        });
      });
    },
  });
};

// Download the NOC PDF
const useDownloadSpocNoc = () => {
  return useMutation({
    mutationFn: async ({ applicationId, filename }) => {
      const response = await downloadSpocNocPdf(applicationId);
      const blob = response?.data instanceof Blob ? response.data : response;
      downloadBlob(blob, filename || `NOC-${applicationId}.pdf`);
      return blob;
    },
  });
};

// Get all the NOCs
const useSpocNocs = () => {
  return useQuery({
    queryKey: ["spocNocs"],
    queryFn: async () => {
      const response = await getSpocNocs();
      const data = getApiData(response);
      if (Array.isArray(data)) {
        return data.map(normalizeNoc).filter(Boolean);
      }
      if (Array.isArray(data?.nocs)) {
        return data.nocs.map(normalizeNoc).filter(Boolean);
      }
      return [];
    },
    staleTime: 60 * 1000,
    retry: 1,
  });
};

// View NOC PDF
const useViewSpocNoc = () => {
  return useMutation({
    mutationFn: async (applicationId) => {
      if (!applicationId) {
        throw new Error("Application ID is required");
      }
      const response = await downloadSpocNocPdf(applicationId);
      const blob = response?.data instanceof Blob ? response.data : response;
      if (!(blob instanceof Blob)) {
        throw new Error("Invalid NOC PDF response");
      }
      return blob;
    },
  });
};

export {
  useSpocApplications,
  useSpocApplication,
  useSpocApplicationsByOrganisation,
  useAcceptSpocApplication,
  useSendBackSpocApplication,
  useReviewSpocApplication,
  useSpocApplicationNoc,
  useGenerateSpocNoc,
  useGenerateBulkSpocNoc,
  useDownloadSpocNoc,
  useSpocNocs,
  useViewSpocNoc,
};
