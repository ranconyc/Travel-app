"use client";

import { memo } from "react";

import { useIsMyProfile } from "../../store/useProfileStore";
import Button from "@/app/components/common/Button";
import ProfileSettingsButton from "./ProfileSettingsButton";
import FriendshipButton from "./FriendshipButton";
import QRCodeButton from "./QRCodeButton";

function TopNav() {
  const isMyProfile = useIsMyProfile();

  return (
    <nav
      className="p-4 pt-8 flex items-center justify-between gap-2 sticky top-0 left-0 right-0 bg-app-bg z-40"
      aria-label="Profile navigation"
    >
      <Button variant="back" aria-label="Go back" />
      {isMyProfile ? (
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Profile actions"
        >
          <QRCodeButton />
          <ProfileSettingsButton />
        </div>
      ) : (
        <FriendshipButton />
      )}
    </nav>
  );
}

export default memo(TopNav);
