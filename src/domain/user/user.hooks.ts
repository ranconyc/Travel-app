import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  saveInterests,
  saveVisitedCountries,
  saveTravelPersona,
  generateBio,
  deleteAccountAction, // Changed from deleteAccount
  updateUserLocationAction,
  updateUserRoleAction,
  getAllUsersAction,
  getAuthenticatedUserAction,
} from "@/domain/user/user.actions";
import { useEffect, useRef } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import { useUser } from "@/app/providers/UserProvider";
import { hasGeolocation } from "@/domain/shared/utils/env";
import { getDistance } from "@/domain/shared/utils/geo";
import { useRouter } from "next/navigation";
import { useLocationStore } from "@/store/locationStore";
import { useAppStore } from "@/store/appStore";
import { User } from "@/domain/user/user.schema";
import { PersonaFormValues } from "@/domain/persona/persona.schema";
import {
  SaveInterestsFormValues,
  SaveTravelFormValues,
  SavePersonaFormValues,
  BioInput,
  GeoPoint,
} from "@/domain/user/user.schema";

import { CompleteProfileFormValues as CompleteProfileFormValuesType } from "@/domain/user/completeProfile.schema";
import { ActionResponse } from "@/types/actions";
import { DetectedCity } from "@/domain/city/city.schema";

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
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Automate draft cleanup
      useAppStore.getState().clearDraft();
    },
  });
}

export function useSaveInterests() {
  const queryClient = useQueryClient();

  // Need to import SaveInterestsFormValues from user.schema
  // It seems user.actions.ts imports it from "@/domain/user/user.schema"

  return useMutation<{ userId: string }, Error, SaveInterestsFormValues>({
    mutationFn: async (values) => {
      const res = await saveInterests(values);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "interests"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      // Automate draft cleanup
      useAppStore.getState().clearDraft();
    },
  });
}

export function useSaveVisitedCountries() {
  const queryClient = useQueryClient();

  return useMutation<{ userId: string }, Error, SaveTravelFormValues>({
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

  return useMutation<{ userId: string }, Error, SavePersonaFormValues>({
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

export function useDeleteAccount() {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const res = await deleteAccountAction({});
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

export type UseGeoOptions = {
  persistToDb?: boolean;
  distanceThresholdKm?: number;
  debounceMs?: number;
  initialUser?: User | null;
  refreshOnUpdate?: boolean;
};

/**
 * Helper to normalize different GeoPoint shapes into {lat, lng}
 */
function parseGeoPoint(
  loc: GeoPoint | { lat: number; lng: number } | null | unknown,
): { lat: number; lng: number } | null {
  if (!loc || typeof loc !== "object") return null;

  try {
    // Handle Prisma/GeoJSON Point: { type: "Point", coordinates: [lng, lat] }
    if (
      "type" in loc &&
      loc.type === "Point" &&
      "coordinates" in loc &&
      Array.isArray(loc.coordinates)
    ) {
      const [lng, lat] = loc.coordinates;
      if (typeof lat === "number" && typeof lng === "number") {
        return { lat, lng };
      }
    }

    // Handle direct coords: { lat, lng }
    if (
      "lat" in loc &&
      "lng" in loc &&
      typeof loc.lat === "number" &&
      typeof loc.lng === "number"
    ) {
      return { lat: loc.lat, lng: loc.lng };
    }
  } catch (err) {
    console.error("[parseGeoPoint] Failed to parse location", err);
  }

  return null;
}

export function useGeo(options: UseGeoOptions = {}) {
  const {
    persistToDb = false,
    distanceThresholdKm = 1,
    debounceMs = 30000,
    initialUser,
    refreshOnUpdate = false,
  } = options;

  const router = useRouter();
  const user = useUser();
  const {
    getFinalLocation,
    setBrowserLocation,
    setDbLocation,
    lastSavedCoords,
    setLastSavedCoords,
    loading,
    setLoading,
    error,
    setError,
  } = useLocationStore();

  // Get computed final location
  const coords = getFinalLocation();

  const lastSaveTimeRef = useRef<number>(0);
  const isSavingRef = useRef(false);
  const initializedRef = useRef(false);

  // Refs for timeout protection to avoid dependency noise
  const coordsRef = useRef(coords);
  const loadingRef = useRef(loading);

  useEffect(() => {
    coordsRef.current = coords;
    loadingRef.current = loading;
  }, [coords, loading]);

  // 1. Initialization Effect: Runs once to sync initialUser state to store
  useEffect(() => {
    if (initializedRef.current || coords || !initialUser?.currentLocation)
      return;

    const initialCoords = parseGeoPoint(initialUser.currentLocation);
    if (initialCoords) {
      // Initialize from DB location (user's saved location)
      setDbLocation(initialCoords);
      setLastSavedCoords(initialCoords);
      setLoading(false);
      initializedRef.current = true;
    }
  }, [
    initialUser?.currentLocation,
    coords,
    setDbLocation,
    setLastSavedCoords,
    setLoading,
  ]);

  // 2. Tracking Effect: Manages browser geolocation watch with timeout protection
  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    if (!hasGeolocation()) {
      setError({ code: "UNSUPPORTED", message: "Geolocation not supported" });
      setLoading(false);
      return;
    }

    let watchId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    // Timeout protection: Stop loading if browser doesn't respond in 15s
    timeoutId = setTimeout(() => {
      // Use refs to get current state without triggering effect re-run
      if (loadingRef.current && !coordsRef.current) {
        setLoading(false);
        setError({
          code: "TIMEOUT",
          message: "Location request timed out",
        });
      }
    }, 15000);

    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (timeoutId) clearTimeout(timeoutId);
          setBrowserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          if (timeoutId) clearTimeout(timeoutId);
          setError({ code: "PERMISSION_DENIED", message: err.message });
          setLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error("[useGeo] Geolocation failed", err);
      setLoading(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [user?.id, setBrowserLocation, setError, setLoading]);

  // 3. Persistence Sync: Smart DB synchronization
  useEffect(() => {
    const userId = user?.id;
    if (!persistToDb || !coords || !userId || isSavingRef.current) return;

    const syncToDb = async () => {
      const now = Date.now();
      const timeSinceLastSave = now - lastSaveTimeRef.current;

      // Throttle Check
      if (timeSinceLastSave < debounceMs) return;

      // Distance Threshold Check
      if (lastSavedCoords) {
        const dist = getDistance(
          lastSavedCoords.lat,
          lastSavedCoords.lng,
          coords.lat,
          coords.lng,
          "KM",
        );
        if (dist < Math.max(distanceThresholdKm, 0.01)) return;
      }

      isSavingRef.current = true;
      try {
        await updateUserLocationAction(coords);
        lastSaveTimeRef.current = now;
        setLastSavedCoords(coords);

        if (refreshOnUpdate) {
          router.refresh();
        }
      } catch (err) {
        console.error("[useGeo] Persistence failed", err);
      } finally {
        isSavingRef.current = false;
      }
    };

    syncToDb();
  }, [
    coords,
    persistToDb,
    user?.id,
    lastSavedCoords,
    distanceThresholdKm,
    debounceMs,
    setLastSavedCoords,
    refreshOnUpdate,
    router,
  ]);

  // Atomic Design Ready state
  const isLocating = loading && !coords;

  return { coords, error, loading, isLocating };
}

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
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!initialUser,
  });
}
