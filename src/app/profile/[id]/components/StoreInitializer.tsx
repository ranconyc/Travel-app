"use client";

import { useEffect } from "react";
import { useProfileActions } from "../store/useProfileStore";
import { User } from "@/domain/user/user.schema";

interface StoreInitializerProps {
  profileUser: User;
  loggedUser: User | null;
  isMyProfile: boolean;
  friendship: {
    status: string;
    requesterId: string;
    addresseeId: string;
  } | null;
}

export default function StoreInitializer({
  profileUser,
  loggedUser,
  isMyProfile,
  friendship,
}: StoreInitializerProps) {
  const { initialize } = useProfileActions();

  useEffect(() => {
    initialize({
      profileUser,
      loggedUser,
      isMyProfile,
      friendship,
    });
  }, [profileUser, loggedUser, isMyProfile, friendship, initialize]);

  return null;
}
