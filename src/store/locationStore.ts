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

export type LocationSource = "manual" | "browser" | "db" | null;

interface LocationState {
  // 1. Raw Sources (Priority: Manual > Browser > DB)
  dbCoords: Coords | null; // From User Profile
  browserCoords: Coords | null; // From Navigator API
  manualCoords: Coords | null; // From Search/Selection

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
  setManualLocation: (coords: Coords, city: string) => void;

  // 6. Legacy actions (for backward compatibility during migration)
  setDbCoords: (coords: Coords | null) => void;
  setBrowserCoords: (coords: Coords | null) => void;
  setCoords: (coords: Coords | null) => void;
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

const initialState: Omit<LocationState, "getFinalLocation" | "getLocationSource"> = {
  // Raw sources
  dbCoords: null,
  browserCoords: null,
  manualCoords: null,

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
 * Computes the final location based on priority: Manual > Browser > DB
 */
function computeFinalLocation(
  manualCoords: Coords | null,
  browserCoords: Coords | null,
  dbCoords: Coords | null,
): { coords: Coords | null; source: LocationSource } {
  if (manualCoords) {
    return { coords: manualCoords, source: "manual" };
  }
  if (browserCoords) {
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
          state.manualCoords,
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
          state.manualCoords,
          coords,
          state.dbCoords,
        );
        set({
          browserCoords: coords,
          coords: finalCoords,
          locationSource: source,
        });
      },

      setManualLocation: (coords: Coords, city: string) => {
        const { coords: finalCoords, source } = computeFinalLocation(
          coords,
          get().browserCoords,
          get().dbCoords,
        );
        set({
          manualCoords: coords,
          currentCity: city,
          coords: finalCoords,
          locationSource: source,
        });
      },

      // Computed selectors
      getFinalLocation: () => {
        const state = get();
        return computeFinalLocation(
          state.manualCoords,
          state.browserCoords,
          state.dbCoords,
        ).coords;
      },

      getLocationSource: () => {
        const state = get();
        return computeFinalLocation(
          state.manualCoords,
          state.browserCoords,
          state.dbCoords,
        ).source;
      },

      // Legacy actions (for backward compatibility)
      setDbCoords: (dbCoords: Coords | null) => {
        if (dbCoords) {
          get().setDbLocation(dbCoords);
        } else {
          const state = get();
          const { coords: finalCoords, source } = computeFinalLocation(
            state.manualCoords,
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
            state.manualCoords,
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
        // Legacy: Direct setter - treat as manual if provided
        if (coords) {
          get().setManualLocation(coords, get().currentCity || "");
        } else {
          // Clear manual, recompute from other sources
          const state = get();
          const { coords: finalCoords, source } = computeFinalLocation(
            null,
            state.browserCoords,
            state.dbCoords,
          );
          set({
            manualCoords: null,
            coords: finalCoords,
            locationSource: source,
          });
        }
      },

      setLastSavedCoords: (coords: Coords | null) =>
        set({ lastSavedCoords: coords }),

      setCurrentCity: (cityId: string | null) =>
        set({ currentCityId: cityId }),

      setLoading: (loading: boolean) => set({ loading }),
      setLocationLoading: (isLocationLoading) =>
        set({ isLocationLoading }),
      setError: (error: GeoError | string | null) => set({ error }),
      setLocationError: (locationError: string | null) =>
        set({ locationError }),

      reset: () => set(initialState),
    }),
    {
      name: "location-storage",
      // Persist manual preference only (coords is computed, don't persist)
      partialize: (state) => ({
        manualCoords: state.manualCoords, // Persist user's manual selection
        currentCity: state.currentCity,
        currentCityId: state.currentCityId,
        lastSavedCoords: state.lastSavedCoords,
        // Don't persist coords - it's computed and should be recalculated on hydration
        // Don't persist browser/db coords - they should be fetched fresh
      }),
    },
  ),
);
