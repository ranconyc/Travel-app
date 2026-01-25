import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/domain/user/user.schema";
import { PersonaFormValues } from "@/features/persona/types/form";

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

  // Onboarding/Persona State
  onboardingDraft: Partial<PersonaFormValues> | null;
  isDraftDirty: boolean;
  draftUpdatedAt: number | null;
  // Messaging State
  unreadCount: number;

  // Actions
  setUser: (user: User | null) => void;
  setUnreadCount: (count: number) => void;
  setBrowserCoords: (coords: Coords | null) => void;
  setDbCoords: (coords: Coords | null) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;

  // Draft Actions
  updateDraft: (update: Partial<PersonaFormValues>) => void;
  clearDraft: () => void;
  resolveConflict: (remoteUser: User) => "merged" | "remote_won" | "draft_won";

  reset: () => void;
}

const initialState = {
  user: null,
  coords: null,
  browserCoords: null,
  dbCoords: null,
  isLocationLoading: false,
  locationError: null,
  onboardingDraft: null,
  isDraftDirty: false,
  draftUpdatedAt: null,
  unreadCount: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setUnreadCount: (unreadCount) => set({ unreadCount }),

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

      updateDraft: (update) => {
        const current = get().onboardingDraft || {};
        set({
          onboardingDraft: { ...current, ...update },
          isDraftDirty: true,
          draftUpdatedAt: Date.now(),
        });
      },

      clearDraft: () =>
        set({
          onboardingDraft: null,
          isDraftDirty: false,
          draftUpdatedAt: null,
        }),

      resolveConflict: (remoteUser) => {
        const { onboardingDraft, isDraftDirty, draftUpdatedAt } = get();
        if (!isDraftDirty || !onboardingDraft || !draftUpdatedAt)
          return "remote_won";

        const remoteUpdatedAt = remoteUser.profile?.updatedAt
          ? new Date(remoteUser.profile.updatedAt).getTime()
          : 0;

        // If remote is newer than our draft start/update
        if (remoteUpdatedAt > draftUpdatedAt) {
          console.log("Remote changes are newer, discarding draft");
          set({ onboardingDraft: null, isDraftDirty: false });
          return "remote_won";
        }

        // If draft is newer, we could keep it.
        // For now, let's say "draft_won" but in a real app we might show a diff.
        return "draft_won";
      },

      reset: () => set(initialState),
    }),
    {
      name: "travel-app-storage",
      partialize: (state) => ({
        // Persist coordinates and draft state
        browserCoords: state.browserCoords,
        dbCoords: state.dbCoords,
        coords: state.coords,
        onboardingDraft: state.onboardingDraft,
        isDraftDirty: state.isDraftDirty,
        draftUpdatedAt: state.draftUpdatedAt,
      }),
    },
  ),
);
