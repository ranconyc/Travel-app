"use client";

import { memo } from "react";
import { useProfileUser } from "../../store/useProfileStore";
import SocialMediaLink from "./socialMediaLink";

function SocialMediaLinks() {
  const profileUser = useProfileUser();
  // Cast socials to array since it's stored as Json in Prisma
  const socials = (profileUser?.profile?.socials || []) as Array<{
    platform: string;
    url: string;
  }>;

  if (!socials.length) return null;

  return (
    <div
      className="flex items-center gap-2"
      role="list"
      aria-label="Social media links"
    >
      {socials.map((social: { platform: string; url: string }) => (
        <SocialMediaLink
          key={social.url}
          platform={social.platform as "instagram" | "tiktok"}
          url={social.url}
        />
      ))}
    </div>
  );
}

export default memo(SocialMediaLinks);
