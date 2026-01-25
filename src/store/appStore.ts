import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/domain/user/user.schema";
import { PersonaFormValues } from "@/domain/persona/persona.schema";

interface AppState {
  // Authentication State
  user: User | null;

  // Onboarding/Persona State
  onboardingDraft: Partial<PersonaFormValues> | null;
  isDraftDirty: boolean;
  draftUpdatedAt: number | null;
  
  // Messaging State
  unreadCount: number;

  // Actions
  setUser: (user: User | null) => void;
  setUnreadCount: (count: number) => void;

  // Draft Actions
  updateDraft: (update: Partial<PersonaFormValues>) => void;
  clearDraft: () => void;
  resolveConflict: (remoteUser: User) => "merged" | "remote_won" | "draft_won";

  reset: () => void;
}

const initialState = {
  user: null,
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
        // Only persist draft state (location moved to locationStore)
        onboardingDraft: state.onboardingDraft,
        isDraftDirty: state.isDraftDirty,
        draftUpdatedAt: state.draftUpdatedAt,
      }),
    },
  ),
);
