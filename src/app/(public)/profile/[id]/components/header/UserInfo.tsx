"use client";
import { memo } from "react";
import { useProfileUser } from "../../store/useProfileStore";
import MediaLinks from "@/components/molecules/MediaLinks";
import { Briefcase, Home as HomeIcon } from "lucide-react";
import Typography from "@/components/atoms/Typography";

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
      <Typography variant="h1" className="font-bold">
        {profileUser.name || profileUser.profile?.firstName}
      </Typography>

      <MediaLinks
        links={socialLinks}
        className="justify-center md:justify-start"
      />

      {hometown ? (
        <div className="flex items-center gap-1">
          <HomeIcon size={16} />
          <Typography variant="label">From {hometown}</Typography>
        </div>
      ) : (
        <Typography variant="label">somewhere</Typography>
      )}
    </div>
  );
}

export default memo(UserInfo);
