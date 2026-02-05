import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  saveInterests,
  saveVisitedCountries,
  generateBio,
  deleteAccountAction, // Changed from deleteAccount
  updateUserLocationAction,
  updateUserRoleAction,
  getAllUsersAction,
  getAuthenticatedUserAction,
  completeOnboarding,
  completeIdentityOnboarding,
} from "@/domain/user/user.actions";
import { useEffect } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import { useAppStore } from "@/store/appStore";
import { User } from "@/domain/user/user.schema";
import { PersonaFormValues } from "@/domain/persona/persona.schema";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";
import { BioInput } from "@/domain/user/user.schema";

import { createMutationHook } from "@/lib/hooks/useMutationHook";

export const useUpdateProfile = createMutationHook(updateProfile, {
  invalidateKeys: [["user", "profile"], ["user", "me"], ["users"]],
  onSuccess: () => {
    useAppStore.getState().clearDraft();
  },
});

export const useSaveInterests = createMutationHook(saveInterests, {
  invalidateKeys: [
    ["user", "interests"],
    ["user", "me"],
  ],
  onSuccess: () => {
    useAppStore.getState().clearDraft();
  },
});

export const useSaveVisitedCountries = createMutationHook(
  saveVisitedCountries,
  {
    invalidateKeys: [["user", "travel"]],
  },
);

export function useGenerateBio() {
  // generateBio returns specific object, not standard ActionResponse exactly in names?
  // checking it... actually it returns success/data/error too usually.
  return useMutation<
    { options: { id: string; label: string; text: string }[] },
    Error,
    BioInput
  >({
    mutationFn: async (values) => {
      const res = await generateBio(values);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
  });
}

export const useDeleteAccount = createMutationHook(deleteAccountAction);

export const useUpdateUserLocation = createMutationHook(
  updateUserLocationAction,
  {
    invalidateKeys: [
      ["user", "location"],
      ["user", "me"],
    ],
  },
);

export const useUpdateUserRole = createMutationHook(updateUserRoleAction, {
  invalidateKeys: [["users"]],
});

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    {
      interests: string[];
      budget: string;
      travelRhythm: string;
    }
  >({
    mutationFn: async (values) => {
      const res = await completeOnboarding(values);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["user", "persona"] });
      queryClient.invalidateQueries({ queryKey: ["user", "interests"] });
    },
  });
}

export function useCompleteIdentityOnboarding() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, OnboardingIdentityFormValues>(
    {
      mutationFn: async (values) => {
        const res = await completeIdentityOnboarding(values);
        if (!res.success) {
          throw new Error(res.error);
        }
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      },
    },
  );
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getAllUsersAction({});
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Syncs form state with global appStore onboarding draft.
 * Handles initialization from store and real-time updates.
 */
export function useProfileDraft<TFormValues extends FieldValues>(
  methods: UseFormReturn<TFormValues>,
) {
  const { reset, watch } = methods;
  const onboardingDraft = useAppStore((state) => state.onboardingDraft);
  const updateDraft = useAppStore((state) => state.updateDraft);
  const clearStoreDraft = useAppStore((state) => state.clearDraft);
  const isDraftDirty = useAppStore((state) => state.isDraftDirty);

  // Initialize from store on mount if store has data
  useEffect(() => {
    if (onboardingDraft && !isDraftDirty) {
      reset(onboardingDraft as unknown as TFormValues);
    }
  }, [reset, onboardingDraft, isDraftDirty]);

  // Sync TO store on every change
  useEffect(() => {
    const subscription = watch((value) => {
      // Cast to any because the hook is generic but store expects PersonaFormValues
      updateDraft(value as unknown as Partial<PersonaFormValues>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateDraft]);

  const clearDraft = () => {
    clearStoreDraft();
  };

  return { clearDraft, isDraftDirty };
}

export * from "./useGeo";

type LanguageItem = {
  code: string;
  name: string;
  flag?: string;
};

export function useLanguages() {
  return useQuery<LanguageItem[]>({
    queryKey: ["languages"],
    queryFn: async () => {
      const { default: languagesData } = await import("@/data/languages.json");
      return languagesData as LanguageItem[];
    },
    staleTime: Infinity,
  });
}

export function useAuthenticatedUser(initialUser: User | null) {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const result = await getAuthenticatedUserAction({});
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data as User;
    },
    initialData: initialUser || undefined,
    staleTime: 1000 * 30, // 30 seconds
    enabled: !!initialUser,
  });
}
