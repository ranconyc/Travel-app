import MediaLinks from "@/components/molecules/MediaLinks";
import social from "@/data/social.json";

// Active platforms for country discovery
const ACTIVE_SOCIALS = ["tiktok", "facebook", "reddit", "instagram"];

interface SocialPlatform {
  name: string;
  groupsURL: string;
}

export default function SocialLinks({ query }: { query: string }) {
  // Helper to build the URL based on platform-specific requirements
  const getSocialUrl = (platform: SocialPlatform) => {
    const suffix = platform.name === "reddit" ? " travel" : "";
    return `${platform.groupsURL}${query}${suffix}`;
  };

  // Transform to MediaLinks format
  const socialLinks: Record<string, string> = {};
  social
    .filter((s) => ACTIVE_SOCIALS.includes(s.name))
    .forEach((platform) => {
      socialLinks[platform.name] = getSocialUrl(platform);
    });

  return <MediaLinks links={socialLinks} className="justify-center" />;
}
