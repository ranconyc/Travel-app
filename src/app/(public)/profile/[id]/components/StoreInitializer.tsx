"use client";

import { useEffect } from "react";
import { useProfileActions } from "../store/useProfileStore";
import { User } from "@/domain/user/user.schema";
import { MatchResult } from "@/domain/match/match.schema";

interface StoreInitializerProps {
  profileUser: User;
  loggedUser: User | null;
  matchResult: MatchResult | null;
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
  matchResult,
  isMyProfile,
  friendship,
}: StoreInitializerProps) {
  const { initialize } = useProfileActions();

  useEffect(() => {
    initialize({
      profileUser,
      loggedUser,
      matchResult,
      isMyProfile,
      friendship,
    });
  }, [
    profileUser,
    loggedUser,
    matchResult,
    isMyProfile,
    friendship,
    initialize,
  ]);

  return null;
}
