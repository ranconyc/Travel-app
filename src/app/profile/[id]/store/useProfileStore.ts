"use client";

import { create } from "zustand";
import { User } from "@/domain/user/user.schema";

interface ProfileState {
  profileUser: User | null;
  loggedUser: User | null;
  isMyProfile: boolean;
  friendship: {
    status: string;
    requesterId: string;
    addresseeId: string;
  } | null;
  initialized: boolean;
  isProfileModalOpen: boolean;
  isQRCodeModalOpen: boolean;
  actions: {
    initialize: (data: Partial<ProfileState>) => void;
    setFriendship: (friendship: ProfileState["friendship"]) => void;
    setProfileModalOpen: (open: boolean) => void;
    setQRCodeModalOpen: (open: boolean) => void;
  };
}

export const useProfileStore = create<ProfileState>((set) => ({
  profileUser: null,
  loggedUser: null,
  isMyProfile: false,
  friendship: null,
  initialized: false,
  isProfileModalOpen: false,
  isQRCodeModalOpen: false,
  actions: {
    initialize: (data) =>
      set((state) => ({
        ...state,
        ...data,
        initialized: true,
      })),
    setFriendship: (friendship) => set({ friendship }),
    setProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
    setQRCodeModalOpen: (open) => set({ isQRCodeModalOpen: open }),
  },
}));

export const useProfileUser = () =>
  useProfileStore((state) => state.profileUser);
export const useLoggedUser = () => useProfileStore((state) => state.loggedUser);
export const useIsMyProfile = () =>
  useProfileStore((state) => state.isMyProfile);
export const useFriendship = () => useProfileStore((state) => state.friendship);
export const useIsProfileModalOpen = () =>
  useProfileStore((state) => state.isProfileModalOpen);
export const useIsQRCodeModalOpen = () =>
  useProfileStore((state) => state.isQRCodeModalOpen);
export const useProfileActions = () =>
  useProfileStore((state) => state.actions);
