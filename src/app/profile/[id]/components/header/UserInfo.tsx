"use client";
import { memo } from "react";
import { useProfileUser } from "../../store/useProfileStore";
import SocialMediaLinks from "./SocialMediaLinks";
import { personaService } from "@/domain/persona/persona.service";

function UserInfo() {
  const profileUser = useProfileUser();

  if (!profileUser) return null;

  const persona = personaService.fromUser(profileUser);
  const { identity } = persona;

  const locationText = profileUser.currentCity
    ? `${profileUser.currentCity.name}, ${
        profileUser.currentCity.country?.name === "United States of America"
          ? "USA"
          : profileUser.currentCity.country?.name
      }`
    : identity.hometown;

  return (
    <div className="text-center space-y-sm">
      <h1 className="text-h2 font-bold text-txt-main">{identity.firstName}</h1>

      {Array.isArray(profileUser.profile?.socials) &&
        (profileUser.profile?.socials as unknown[]).length > 0 && (
          <div className="w-full flex items-center justify-center gap-xs">
            <SocialMediaLinks />
          </div>
        )}

      {locationText && (
        <p className="text-upheader text-secondary italic">{locationText}</p>
      )}
    </div>
  );
}

export default memo(UserInfo);
