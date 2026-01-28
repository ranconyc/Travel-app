import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Globe } from "lucide-react";
import { AiFillTikTok, AiFillRedditCircle } from "react-icons/ai";

export type MediaLinksProps = {
  links: Record<string, string>; // { instagram: "url", tiktok: "url", ... }
  className?: string;
};

const ICON_SIZE = 20;

/**
 * MediaLinks - Reusable atom for displaying social media links
 *
 * @param links - Record of platform names to URLs (e.g., { instagram: "https://...", tiktok: "https://..." })
 * @param className - Optional additional classes for the container
 */
export default function MediaLinks({ links, className = "" }: MediaLinksProps) {
  const getIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();

    switch (platformLower) {
      case "facebook":
        return <Facebook size={ICON_SIZE} />;
      case "instagram":
        return <Instagram size={ICON_SIZE} />;
      case "tiktok":
        return <AiFillTikTok size={ICON_SIZE} />;
      case "reddit":
        return <AiFillRedditCircle size={ICON_SIZE} />;
      case "linkedin":
        return <Linkedin size={ICON_SIZE} />;
      case "twitter":
      case "x":
        return <Twitter size={ICON_SIZE} />;
      case "website":
      case "web":
        return <Globe size={ICON_SIZE} />;
      default:
        return <Globe size={ICON_SIZE} />; // Fallback icon
    }
  };

  const entries = Object.entries(links).filter(
    (entry) => entry[1] && entry[1].trim() !== "",
  );

  if (entries.length === 0) return null;

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="list"
      aria-label="Social media links"
    >
      {entries.map(([platform, url]) => (
        <Link
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface/30 hover:bg-surface/50 transition-colors cursor-pointer"
          aria-label={`${platform} link`}
        >
          {getIcon(platform)}
        </Link>
      ))}
    </div>
  );
}
