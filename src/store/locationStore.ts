import { create } from "zustand";
import { persist } from "zustand/middleware";

type Coords = { lat: number; lng: number };

export type GeoError = {
  code:
    | "UNSUPPORTED"
    | "TIMEOUT"
    | "PERMISSION_DENIED"
    | "POSITION_UNAVAILABLE"
    | "UNKNOWN";
  message: string;
};

type LocationStore = {
  // State
  coords: Coords | null;
  lastSavedCoords: Coords | null;
  currentCityId: string | null;
  loading: boolean;
  error: GeoError | string | null;

  // Actions
  setCoords: (coords: Coords | null) => void;
  setLastSavedCoords: (coords: Coords | null) => void;
  setCurrentCity: (cityId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: GeoError | string | null) => void;
  reset: () => void;
};

const initialState = {
  coords: null,
  lastSavedCoords: null,
  currentCityId: null,
  loading: true,
  error: null,
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Actions
      setCoords: (coords) => set({ coords }),
      setLastSavedCoords: (coords) => set({ lastSavedCoords: coords }),
      setCurrentCity: (cityId) => set({ currentCityId: cityId }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: "location-storage", // localStorage key
      // Only persist coords and lastSavedCoords (same as original implementation)
      partialize: (state) => ({
        coords: state.coords,
        lastSavedCoords: state.lastSavedCoords,
      }),
    },
  ),
);
