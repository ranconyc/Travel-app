import MediaLinks from "@/components/molecules/MediaLinks";
import social from "@/data/social.json";

// Active platforms for country discovery
const ACTIVE_SOCIALS = ["tiktok", "facebook", "reddit", "instagram"];

interface SocialPlatform {
  name: string;
  groupsURL: string;
}

export default function SocialLinks({
  query,
  type = "country",
}: {
  query: string;
  type?: "country" | "city" | "place";
}) {
  // Helper to build the URL based on platform-specific requirements
  const getSocialUrl = (platform: SocialPlatform) => {
    // Sanitize query by removing hashtags (fix for %23 issues)
    const sanitizedQuery = query.replace(/#/g, "");

    let suffix = "";
    if (platform.name === "reddit") {
      suffix = " travel";
    } else if (platform.name === "instagram") {
      if (type === "country") {
        suffix = " travel";
      } else if (type === "city") {
        suffix = " guide";
      }
    }

    return `${platform.groupsURL}${encodeURIComponent(sanitizedQuery + suffix)}`;
  };

  // Transform to MediaLinks format
  const socialLinks: Record<string, string> = {};

  // 1. Add Google Maps first (or wherever you prefer)
  const sanitizedQuery = query.replace(/#/g, "");
  socialLinks["googlemaps"] =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sanitizedQuery)}`;

  // 2. Add other social platforms
  social
    .filter((s) => ACTIVE_SOCIALS.includes(s.name))
    .forEach((platform) => {
      socialLinks[platform.name] = getSocialUrl(platform);
    });

  return <MediaLinks links={socialLinks} className="justify-center" />;
}
