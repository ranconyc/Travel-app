"use client";
import { memo } from "react";
import { useProfileUser } from "../../store/useProfileStore";
import SocialMediaLinks from "./SocialMediaLinks";

function UserInfo() {
  const profileUser = useProfileUser();

  if (!profileUser) return null;

  const displayName = profileUser.profile?.firstName
    ? `${profileUser.profile.firstName} ${profileUser.profile.lastName || ""}`.trim()
    : profileUser.name;

  const locationText = profileUser.currentCity
    ? `${profileUser.currentCity.name}, ${
        profileUser.currentCity.country?.name === "United States of America"
          ? "USA"
          : profileUser.currentCity.country?.name
      }`
    : null;

  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-bold">{displayName}</h1>

      {profileUser.profile?.socials?.length > 0 && (
        <div className="w-full flex items-center justify-center gap-2">
          <SocialMediaLinks />
        </div>
      )}

      {locationText && (
        <p className="text-xs text-muted-foreground">{locationText}</p>
      )}
    </div>
  );
}

export default memo(UserInfo);
