import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/domain/user/user.schema";

type Coords = { lat: number; lng: number };

interface AppState {
  // Authentication State
  user: User | null;

  // Geolocation State
  coords: Coords | null;
  browserCoords: Coords | null;
  dbCoords: Coords | null;
  isLocationLoading: boolean;
  locationError: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setBrowserCoords: (coords: Coords | null) => void;
  setDbCoords: (coords: Coords | null) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  coords: null,
  browserCoords: null,
  dbCoords: null,
  isLocationLoading: false,
  locationError: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setBrowserCoords: (browserCoords) => {
        set({
          browserCoords,
          coords: browserCoords || get().dbCoords,
        });
      },

      setDbCoords: (dbCoords) => {
        set({
          dbCoords,
          coords: get().browserCoords || dbCoords,
        });
      },

      setLocationLoading: (isLocationLoading) => set({ isLocationLoading }),
      setLocationError: (locationError) => set({ locationError }),

      reset: () => set(initialState),
    }),
    {
      name: "travel-app-storage",
      partialize: (state) => ({
        // We only persist coordinates to keep session continuity
        browserCoords: state.browserCoords,
        dbCoords: state.dbCoords,
        coords: state.coords,
      }),
    },
  ),
);
