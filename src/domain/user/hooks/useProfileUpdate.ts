"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "@/domain/user/user.actions";
import { useUser } from "@/app/providers/UserProvider";
import { useAppStore } from "@/store/appStore";

import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";

/**
 * useProfileUpdate - Encapsulates profile update orchestration.
 * Consolidates the update action, handles loading states, and manages navigation side-effects.
 */
export function useProfileUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const user = useUser();

  const handleUpdate = useCallback(
    async (data: CompleteProfileFormValues) => {
      setIsUpdating(true);
      try {
        const result = await updateProfile(data);
        if (result.success) {
          toast.success("Profile updated successfully");
          useAppStore.getState().clearDraft();
          router.refresh();
          return true;
        } else {
          toast.error(result.error || "Failed to update profile");
          return false;
        }
      } catch (error) {
        console.error("[useProfileUpdate] Unhandled error:", error);
        toast.error("An unexpected error occurred while saving profile.");
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [router],
  );

  return {
    isUpdating,
    handleUpdate,
    user,
  };
}
