import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudentDocuments,
  updateStudentSignature,
  updateStudentResume,
  regenerateStudentNOC,
} from "../Documents/studentDocuments.api";

export const studentDocumentsQueryKey = ["student-documents"];

export const useStudentDocuments = () => {
  return useQuery({
    queryKey: studentDocumentsQueryKey,
    queryFn: getStudentDocuments,
  });
};

export const useUpdateStudentSignature = () => {
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

export const useUpdateStudentResume = () => {
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

export const useRegenerateStudentNOC = () => {
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
