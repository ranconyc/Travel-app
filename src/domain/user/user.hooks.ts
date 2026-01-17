import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  saveInterests,
  saveVisitedCountries,
  saveTravelPersona,
  generateBio,
  deleteAccount,
  updateUserLocationAction,
  updateUserRoleAction,
  UpdateProfileResult,
  SaveInterestsResult,
  SaveTravelResult,
} from "@/domain/user/user.actions";
import {
  SaveInterestsFormValues,
  SaveTravelFormValues,
  SavePersonaFormValues,
  BioInput,
} from "@/domain/user/user.schema";

import { CompleteProfileFormValues as CompleteProfileFormValuesType } from "@/domain/user/completeProfile.schema";
import { UseMutationResult } from "@tanstack/react-query";
import { ActionResponse } from "@/types/actions";
import { DetectedCity } from "@/types/city";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResult, Error, CompleteProfileFormValuesType>(
    {
      mutationFn: async (values) => {
        return await updateProfile(values);
      },
      onSuccess: (res) => {
        if (res.success) {
          queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }
      },
    },
  );
}

export function useSaveInterests() {
  const queryClient = useQueryClient();

  // Need to import SaveInterestsFormValues from user.schema
  // It seems user.actions.ts imports it from "@/domain/user/user.schema"

  return useMutation<SaveInterestsResult, Error, any>({
    mutationFn: async (values) => {
      return await saveInterests(values);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["user", "interests"] });
      }
    },
  });
}

export function useSaveVisitedCountries() {
  const queryClient = useQueryClient();

  return useMutation<SaveTravelResult, Error, any>({
    mutationFn: async (values) => {
      return await saveVisitedCountries(values);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["user", "travel"] });
      }
    },
  });
}

export function useSaveTravelPersona() {
  const queryClient = useQueryClient();

  return useMutation<SaveTravelResult, Error, any>({
    mutationFn: async (values) => {
      return await saveTravelPersona(values);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["user", "persona"] });
      }
    },
  });
}

export function useGenerateBio() {
  // generateBio returns specific object, not standard ActionResponse
  return useMutation<any, Error, BioInput>({
    mutationFn: async (values) => {
      return await generateBio(values);
    },
  });
}

export function useDeleteAccount() {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      return await deleteAccount();
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
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["user", "location"] });
      }
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; error?: string },
    Error,
    { userId: string; role: "USER" | "ADMIN" }
  >({
    mutationFn: async ({ userId, role }) => {
      return await updateUserRoleAction(userId, role);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
  });
}
