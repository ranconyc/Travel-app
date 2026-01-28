"use client";
import { memo } from "react";
import { useProfileUser } from "../../store/useProfileStore";
import MediaLinks from "@/components/molecules/MediaLinks";
import { Briefcase, Home as HomeIcon } from "lucide-react";

function UserInfo() {
  const profileUser = useProfileUser();

  if (!profileUser) return null;

  // Identity info is now on the profile directly
  const occupation = profileUser.profile?.occupation;
  const hometown = profileUser.profile?.homeBaseCity?.name;

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
      <h1 className="text-h2 font-bold text-txt-main">
        {profileUser.profile?.firstName || profileUser.name}
      </h1>

      <MediaLinks
        links={socialLinks}
        className="justify-center md:justify-start"
      />

      {(occupation || hometown) && (
        <div className="flex items-center justify-center gap-4 text-sm text-secondary">
          {occupation && (
            <div className="flex items-center gap-1">
              <Briefcase size={16} />
              <span>{occupation}</span>
            </div>
          )}
          {hometown && (
            <div className="flex items-center gap-1">
              <HomeIcon size={16} />
              <span>From {hometown}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(UserInfo);
