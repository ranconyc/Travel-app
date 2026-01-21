import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  saveInterests,
  saveVisitedCountries,
  saveTravelPersona,
  generateBio,
  deleteAccountAction, // Changed from deleteAccount
  updateUserLocationAction,
  updateUserRoleAction,
} from "@/domain/user/user.actions";
import {
  SaveInterestsFormValues,
  SaveTravelFormValues,
  SavePersonaFormValues,
  BioInput,
} from "@/domain/user/user.schema";

import { CompleteProfileFormValues as CompleteProfileFormValuesType } from "@/domain/user/completeProfile.schema";
import { ActionResponse } from "@/types/actions";
import { DetectedCity } from "@/types/city";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CompleteProfileFormValuesType>({
    mutationFn: async (values) => {
      const res = await updateProfile(values);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useSaveInterests() {
  const queryClient = useQueryClient();

  // Need to import SaveInterestsFormValues from user.schema
  // It seems user.actions.ts imports it from "@/domain/user/user.schema"

  return useMutation<{ userId: string }, Error, any>({
    mutationFn: async (values) => {
      const res = await saveInterests(values);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "interests"] });
    },
  });
}

export function useSaveVisitedCountries() {
  const queryClient = useQueryClient();

  return useMutation<{ userId: string }, Error, any>({
    mutationFn: async (values) => {
      const res = await saveVisitedCountries(values);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "travel"] });
    },
  });
}

export function useSaveTravelPersona() {
  const queryClient = useQueryClient();

  return useMutation<{ userId: string }, Error, any>({
    mutationFn: async (values) => {
      const res = await saveTravelPersona(values);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "persona"] });
    },
  });
}

export function useGenerateBio() {
  // generateBio returns specific object, not standard ActionResponse
  return useMutation<any, Error, BioInput>({
    mutationFn: async (values) => {
      const res = await generateBio(values);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
  });
}

export function useDeleteAccount() {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const res = await deleteAccountAction(undefined);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
  });
}

export function useUpdateUserLocation() {
  const queryClient = useQueryClient();

  return useMutation<
    ActionResponse<{ detected: DetectedCity }>,
    Error,
    { lat: number; lng: number }
  >({
    mutationFn: async (coords) => {
      return await updateUserLocationAction(coords);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "location"] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { userId: string; role: "USER" | "ADMIN" }>({
    mutationFn: async ({ userId, role }) => {
      const res = await updateUserRoleAction({ userId, role });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
