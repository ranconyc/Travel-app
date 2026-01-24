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
} from "@/domain/user/user.actions";
import { useEffect, useRef } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import { useUser } from "@/app/providers/UserProvider";
import { hasGeolocation } from "@/app/_utils/env";
import { getDistance } from "@/app/_utils/geo";
import { useRouter } from "next/navigation";
import { useLocationStore } from "@/store/locationStore";
import { User } from "@/domain/user/user.schema";
import {
  SaveInterestsFormValues,
  SaveTravelFormValues,
  SavePersonaFormValues,
  BioInput,
  GeoPoint,
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

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getAllUsersAction(undefined);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

const STORAGE_KEY_PREFIX = "profile.v1.user-";

export function useProfileDraft<TFormValues extends FieldValues>(
  methods: UseFormReturn<TFormValues>,
  userId: string,
) {
  const { reset, watch } = methods;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + userId);
      if (!raw) return;

      const parsed = JSON.parse(raw);

      if (parsed.homeBase && typeof parsed.homeBase !== "string") {
        parsed.homeBase = String(parsed.homeBase);
      }

      const draft = parsed as TFormValues;

      const hasData = Object.values(draft).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0),
      );

      if (hasData) {
        reset(draft);
      }
    } catch (e) {
      console.error("Failed to load profile draft", e);
    }
  }, [reset, userId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const subscription = watch((value) => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY_PREFIX + userId,
          JSON.stringify(value),
        );
      } catch (e) {
        console.error("Failed to save profile draft", e);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, userId]);

  const clearDraft = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY_PREFIX + userId);
    } catch (e) {
      console.error("Failed to clear profile draft", e);
    }
  };

  return { clearDraft };
}

export type UseGeoOptions = {
  persistToDb?: boolean;
  distanceThresholdKm?: number;
  debounceMs?: number;
  initialUser?: User | null;
  refreshOnUpdate?: boolean;
};

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
    coords,
    lastSavedCoords,
    loading,
    error,
    setCoords,
    setLastSavedCoords,
    setLoading,
    setError,
  } = useLocationStore();

  const lastSaveTimeRef = useRef<number>(0);
  const isSavingRef = useRef(false);
  const lastSavedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // save last saved coords to ref
  useEffect(() => {
    if (lastSavedCoords && !lastSavedCoordsRef.current) {
      lastSavedCoordsRef.current = lastSavedCoords;
    }
  }, [lastSavedCoords]);

  // set coords from initial user
  useEffect(() => {
    if (!coords && initialUser?.currentLocation) {
      try {
        const loc = initialUser?.currentLocation as
          | GeoPoint
          | { lat: number; lng: number }
          | null;

        if (loc && typeof loc === "object") {
          if (
            "type" in loc &&
            loc.type === "Point" &&
            "coordinates" in loc &&
            Array.isArray(loc.coordinates)
          ) {
            const [lng, lat] = loc.coordinates;
            if (typeof lat === "number" && typeof lng === "number") {
              const initialCoords = { lat, lng };
              setCoords(initialCoords);
              setLastSavedCoords(initialCoords);
              lastSavedCoordsRef.current = initialCoords;
              setLoading(false);
            }
          } else if (
            "lat" in loc &&
            "lng" in loc &&
            typeof loc.lat === "number" &&
            typeof loc.lng === "number"
          ) {
            const initialCoords = { lat: loc.lat, lng: loc.lng };
            setCoords(initialCoords);
            setLastSavedCoords(initialCoords);
            lastSavedCoordsRef.current = initialCoords;
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Failed to parse initial user location", err);
      }
    }
  }, [initialUser, coords, setCoords, setLastSavedCoords, setLoading]);

  // get coords from browser
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!hasGeolocation()) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    const onSuccess = (pos: GeolocationPosition) => {
      const newCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setCoords(newCoords);
      setLoading(false);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(err.message);
      setLoading(false);
    };

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [user, setCoords, setError, setLoading]);

  // save coords to db
  useEffect(() => {
    if (!persistToDb || !coords || !user?.id) return;

    const attemptSave = async () => {
      const now = Date.now();

      console.log("[useGeo] attemptSave check", {
        coords,
        persistToDb,
        hasUser: !!user?.id,
      });

      if (now - lastSaveTimeRef.current < debounceMs) {
        console.log(
          "[useGeo] Debounced",
          (debounceMs - (now - lastSaveTimeRef.current)) / 1000,
          "s remaining",
        );
        return;
      }

      let shouldSave = false;
      const lastSaved = lastSavedCoordsRef.current;
      console.log("lastSavedCoordsRef.current gor here ", lastSaved);

      if (!lastSaved) {
        shouldSave = true;
      } else {
        const distKm = getDistance(
          lastSaved.lat,
          lastSaved.lng,
          coords.lat,
          coords.lng,
          "KM",
        );

        if (distKm >= Math.max(distanceThresholdKm, 0.01)) {
          shouldSave = true;
        }
      }

      if (shouldSave && !isSavingRef.current) {
        isSavingRef.current = true;
        try {
          console.log("[useGeo] Calling updateUserLocationAction...", coords);
          const result = await updateUserLocationAction(coords);
          console.log("[useGeo] Action result:", result);

          lastSavedCoordsRef.current = coords;
          lastSaveTimeRef.current = now;
          setLastSavedCoords(coords);

          if (refreshOnUpdate) {
            router.refresh();
          }
        } catch (err) {
          console.error("Failed to update user location:", err);
        } finally {
          isSavingRef.current = false;
        }
      }
    };

    attemptSave();
  }, [
    coords,
    persistToDb,
    user?.id,
    distanceThresholdKm,
    debounceMs,
    setLastSavedCoords,
    refreshOnUpdate,
    router,
  ]);

  return { coords, error, loading };
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
