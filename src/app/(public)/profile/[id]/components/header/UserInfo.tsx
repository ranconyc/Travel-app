"use client";
import { memo } from "react";
import { useProfileUser } from "../../store/useProfileStore";
import MediaLinks from "@/components/molecules/MediaLinks";
import Typography from "@/components/atoms/Typography";

function UserInfo() {
  const profileUser = useProfileUser();

  if (!profileUser) return null;

  // Identity info is now on the profile directly
  const occupation = profileUser.profile?.occupation;
  const city = profileUser.profile?.homeBaseCity;

  // Format location: City, State (US/CA) or City, Country
  const countryCode = city?.country?.code;
  const stateCode = city?.state?.code;
  const countryName = city?.country?.name;

  const locationParts = [city?.name];

  if ((countryCode === "US" || countryCode === "CA") && stateCode) {
    locationParts.push(stateCode);
  } else if (countryName && city?.name !== countryName) {
    locationParts.push(countryName);
  }

  const hometown = locationParts.filter(Boolean).join(", ");

  // Transform socials array to Record<string, string> for MediaLinks
  const socialsArray = (profileUser?.profile?.socials || []) as Array<{
    platform: string;
    url: string;
  }>;
  const socialLinks = socialsArray.reduce(
    (acc, social) => {
      if (social.platform && social.url) {
        acc[social.platform.toLowerCase()] = social.url;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div className="text-center space-y-sm">
      <Typography variant="h1" className="font-bold">
        {profileUser.name || profileUser.profile?.firstName}
      </Typography>

      <MediaLinks
        links={socialLinks}
        className="justify-center md:justify-start"
      />

      <div className="flex flex-col items-center gap-1">
        {occupation && <Typography variant="label">{occupation}</Typography>}

        {hometown ? (
          <Typography variant="label">From {hometown}</Typography>
        ) : (
          <Typography variant="label">somewhere</Typography>
        )}
      </div>
    </div>
  );
}

export default memo(UserInfo);
