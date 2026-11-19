import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../Store/Slice/authSlice";
import {
  getSpocProfile,
  updateSpocProfile,
  changeSpocPassword,
  updateSpocSignature,
} from "../Profile/spocProfile.api";

export const spocProfileKeys = {
  profile: ["spoc", "profile"],
  // Same key used by useCurrentSpoc (spocAuth.queries.js) so the navbar refreshes too
  currentUser: ["auth", "me"],
};

/**
 * Single place that keeps every SPOC profile consumer in sync
 * (Redux user, profile query, navbar "current user" query).
 */
const useSyncSpocProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return (spoc) => {
    if (!spoc) return;

    dispatch(setUser(spoc));
    queryClient.setQueryData(spocProfileKeys.profile, { spoc });
    queryClient.invalidateQueries({ queryKey: spocProfileKeys.currentUser });
  };
};

// Read the SPOC profile (falls back to the Redux user while loading)
export const useSpocProfile = () => {
  const reduxUser = useSelector(selectUser);

  const query = useQuery({
    queryKey: spocProfileKeys.profile,
    queryFn: getSpocProfile,
    select: (data) => data?.spoc ?? null,
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    spoc: query.data ?? reduxUser ?? null,
  };
};

// Update name / mobile
export const useUpdateSpocProfile = () => {
  const syncProfile = useSyncSpocProfile();

  return useMutation({
    mutationFn: updateSpocProfile,
    onSuccess: (data) => syncProfile(data?.spoc),
  });
};

// Upload / replace signature
export const useUpdateSpocSignature = () => {
  const syncProfile = useSyncSpocProfile();

  return useMutation({
    mutationFn: updateSpocSignature,
    onSuccess: (data) => syncProfile(data?.spoc),
  });
};

// Change password (server revokes all sessions; the page signs the user out)
export const useChangeSpocPassword = () => {
  return useMutation({
    mutationFn: changeSpocPassword,
  });
};
