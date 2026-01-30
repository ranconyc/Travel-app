import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Coords = { lat: number; lng: number };

export type GeoError = {
  code:
    | "UNSUPPORTED"
    | "TIMEOUT"
    | "PERMISSION_DENIED"
    | "POSITION_UNAVAILABLE"
    | "UNKNOWN";
  message: string;
};

export type LocationSource = "browser" | "db" | null;

interface LocationState {
  // 1. Raw Sources (Priority: Browser > DB)
  dbCoords: Coords | null; // From User Profile
  browserCoords: Coords | null; // From Navigator API

  // 2. Metadata
  currentCity: string | null; // City ID or name
  currentCityId: string | null; // City ID for DB reference
  locationSource: LocationSource; // Which source is currently active

  // 3. Legacy/Compatibility (deprecated - use getFinalLocation instead)
  coords: Coords | null; // Computed - kept for backward compatibility
  lastSavedCoords: Coords | null; // Last coordinates saved to DB

  // 4. Loading and error states
  loading: boolean;
  isLocationLoading: boolean;
  error: GeoError | string | null;
  locationError: string | null;

  // 5. Actions - Source-specific setters
  setDbLocation: (coords: Coords, city?: string) => void;
  setBrowserLocation: (coords: Coords) => void;

  // 6. Legacy actions (for backward compatibility during migration)
  setDbCoords: (coords: Coords | null) => void;
  setBrowserCoords: (coords: Coords | null) => void;
  setCoords: (coords: Coords | null) => void; // Now behaves as generic setter or reset
  setLastSavedCoords: (coords: Coords | null) => void;
  setCurrentCity: (cityId: string | null) => void;

  // 7. Loading/error actions
  setLoading: (loading: boolean) => void;
  setLocationLoading: (loading: boolean) => void;
  setError: (error: GeoError | string | null) => void;
  setLocationError: (error: string | null) => void;

  // 8. Computed Selector (The "Truth")
  getFinalLocation: () => Coords | null;
  getLocationSource: () => LocationSource;

  // 9. Reset
  reset: () => void;
}

const initialState: Omit<
  LocationState,
  | "setDbLocation"
  | "setBrowserLocation"
  | "setDbCoords"
  | "setBrowserCoords"
  | "setCoords"
  | "setLastSavedCoords"
  | "setCurrentCity"
  | "setLoading"
  | "setLocationLoading"
  | "setError"
  | "setLocationError"
  | "getFinalLocation"
  | "getLocationSource"
  | "reset"
> = {
  // Raw sources
  dbCoords: null,
  browserCoords: null,

  // Metadata
  currentCity: null,
  currentCityId: null,
  locationSource: null,

  // Legacy
  coords: null,
  lastSavedCoords: null,

  // Loading/error
  loading: true,
  isLocationLoading: false,
  error: null,
  locationError: null,
};

/**
 * Calculates distance between two points in km (Haversine formula)
 */
function getDistance(c1: Coords, c2: Coords): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (c2.lat - c1.lat) * (Math.PI / 180);
  const dLng = (c2.lng - c1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(c1.lat * (Math.PI / 180)) *
      Math.cos(c2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/**
 * Computes the final location based on priority: Browser > DB
 * Implements "Sticky Location": If Browser is very close to DB (< 10km),
 * prefer DB coords to prevent cache misses/refetches.
 */
function computeFinalLocation(
  browserCoords: Coords | null,
  dbCoords: Coords | null,
): { coords: Coords | null; source: LocationSource } {
  if (browserCoords) {
    if (dbCoords) {
      const dist = getDistance(browserCoords, dbCoords);
      // If GPS is within 10km of DB location, stick to DB location
      // to avoid React Query cache misses (different keys).
      if (dist < 10) {
        return { coords: dbCoords, source: "db" };
      }
    }
    return { coords: browserCoords, source: "browser" };
  }
  if (dbCoords) {
    return { coords: dbCoords, source: "db" };
  }
  return { coords: null, source: null };
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // New unified actions with priority logic
      setDbLocation: (coords: Coords, city?: string) => {
        const state = get();
        const { coords: finalCoords, source } = computeFinalLocation(
          state.browserCoords,
          coords,
        );
        set({
          dbCoords: coords,
          currentCity: city || state.currentCity,
          coords: finalCoords,
          locationSource: source,
        });
      },

      setBrowserLocation: (coords: Coords) => {
        const state = get();
        const { coords: finalCoords, source } = computeFinalLocation(
          coords,
          state.dbCoords,
        );
        set({
          browserCoords: coords,
          coords: finalCoords,
          locationSource: source,
        });
      },

      // Computed selectors
      getFinalLocation: () => {
        const state = get();
        return computeFinalLocation(state.browserCoords, state.dbCoords).coords;
      },

      getLocationSource: () => {
        const state = get();
        return computeFinalLocation(state.browserCoords, state.dbCoords).source;
      },

      // Legacy actions (for backward compatibility)
      setDbCoords: (dbCoords: Coords | null) => {
        if (dbCoords) {
          get().setDbLocation(dbCoords);
        } else {
          const state = get();
          const { coords: finalCoords, source } = computeFinalLocation(
            state.browserCoords,
            null,
          );
          set({
            dbCoords: null,
            coords: finalCoords,
            locationSource: source,
          });
        }
      },

      setBrowserCoords: (browserCoords: Coords | null) => {
        if (browserCoords) {
          get().setBrowserLocation(browserCoords);
        } else {
          const state = get();
          const { coords: finalCoords, source } = computeFinalLocation(
            null,
            state.dbCoords,
          );
          set({
            browserCoords: null,
            coords: finalCoords,
            locationSource: source,
          });
        }
      },

      setCoords: (coords: Coords | null) => {
        // Legacy: setCoords usually implied manual override.
        // With manual override removed, this might be ambiguous.
        // We will assume it's attempting to set DB location or just ignored.
        // For safety, let's treat it as a reset if null, or ignore if provided (as we enforce GPS).
        // Alternatively, it could update DB location if we consider that "manual" update.
        // BUT user said "100% relay on GPS".
        // Let's just recompute.
        if (!coords) {
          const state = get();
          const { coords: finalCoords, source } = computeFinalLocation(
            state.browserCoords,
            state.dbCoords,
          );
          set({
            coords: finalCoords,
            locationSource: source,
          });
        }
        // If coords provided, we do nothing as we don't support manual override anymore.
      },

      setLastSavedCoords: (coords: Coords | null) =>
        set({ lastSavedCoords: coords }),

      setCurrentCity: (cityId: string | null) => set({ currentCityId: cityId }),

      setLoading: (loading: boolean) => set({ loading }),
      setLocationLoading: (isLocationLoading) => set({ isLocationLoading }),
      setError: (error: GeoError | string | null) => set({ error }),
      setLocationError: (locationError: string | null) =>
        set({ locationError }),

      reset: () => set(initialState),
    }),
    {
      name: "location-storage",
      partialize: (state) => ({
        // Manual coords removed
        currentCity: state.currentCity,
        currentCityId: state.currentCityId,
        lastSavedCoords: state.lastSavedCoords,
      }),
    },
  ),
);
