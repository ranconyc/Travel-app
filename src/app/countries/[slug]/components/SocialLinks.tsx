import Link from "next/link";
// Assuming your icon library setup, e.g., Lucide or React-Icons
import { AiFillTikTok, AiFillRedditCircle } from "react-icons/ai";
import { Facebook, Instagram } from "lucide-react";
import { Country } from "@/domain/country/country.schema";
import social from "@/data/social.json";
// 1. Extract the configuration for the active platforms
const ACTIVE_SOCIALS = ["tiktok", "facebook", "reddit", "instagram"];

// 2. Map names to specific Icon components
const ICON_MAP: Record<string, React.ElementType> = {
  tiktok: AiFillTikTok,
  facebook: Facebook,
  reddit: AiFillRedditCircle,
  instagram: Instagram,
};

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

  return (
    <div className="w-full flex justify-center items-center gap-3">
      {social
        .filter((s) => ACTIVE_SOCIALS.includes(s.name))
        .map((platform) => {
          const Icon = ICON_MAP[platform.name];
          return (
            <Link
              key={platform.name}
              href={getSocialUrl(platform)}
              target="_blank"
              className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors"
              aria-label={`Visit our ${platform.name} group`}
            >
              {Icon && <Icon size={20} className="text-white" />}
            </Link>
          );
        })}
    </div>
  );
}
