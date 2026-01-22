"use client";

import { create } from "zustand";
import { User } from "@/domain/user/user.schema";

interface ProfileState {
  profileUser: User | null;
  loggedUser: User | null;
  isMyProfile: boolean;
  friendship: { status: string; requesterId: string } | null;
  initialized: boolean;
  isInterestsModalOpen: boolean;
  actions: {
    initialize: (data: Partial<ProfileState>) => void;
    setFriendship: (friendship: ProfileState["friendship"]) => void;
    setInterestsModalOpen: (open: boolean) => void;
  };
}

export const useProfileStore = create<ProfileState>((set) => ({
  profileUser: null,
  loggedUser: null,
  isMyProfile: false,
  friendship: null,
  initialized: false,
  isInterestsModalOpen: false,
  actions: {
    initialize: (data) =>
      set((state) => ({
        ...state,
        ...data,
        initialized: true,
      })),
    setFriendship: (friendship) => set({ friendship }),
    setInterestsModalOpen: (open) => set({ isInterestsModalOpen: open }),
  },
}));

export const useProfileUser = () =>
  useProfileStore((state) => state.profileUser);
export const useLoggedUser = () => useProfileStore((state) => state.loggedUser);
export const useIsMyProfile = () =>
  useProfileStore((state) => state.isMyProfile);
export const useFriendship = () => useProfileStore((state) => state.friendship);
export const useIsInterestsModalOpen = () =>
  useProfileStore((state) => state.isInterestsModalOpen);
export const useProfileActions = () =>
  useProfileStore((state) => state.actions);
