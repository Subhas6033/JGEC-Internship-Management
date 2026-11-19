import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudentDocuments,
  updateStudentSignature,
  updateStudentResume,
  regenerateStudentNOC,
} from "../Documents/studentDocuments.api";

const studentDocumentsQueryKey = ["student-documents"];

const useStudentDocuments = () => {
  return useQuery({
    queryKey: studentDocumentsQueryKey,
    queryFn: getStudentDocuments,
  });
};

const useUpdateStudentSignature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentSignature,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentDocumentsQueryKey,
      });
    },
  });
};

const useUpdateStudentResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentResume,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentDocumentsQueryKey,
      });
    },
  });
};

const useRegenerateStudentNOC = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: regenerateStudentNOC,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentDocumentsQueryKey,
      });
    },
  });
};

export {
  useStudentDocuments,
  useUpdateStudentResume,
  useUpdateStudentSignature,
  useRegenerateStudentNOC,
};
