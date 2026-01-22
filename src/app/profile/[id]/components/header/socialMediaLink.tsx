import { Facebook, FacebookIcon, Instagram } from "lucide-react";
import Link from "next/link";
import {
  AiFillLinkedin,
  AiFillRedditCircle,
  AiFillTikTok,
  AiOutlineWhatsApp,
} from "react-icons/ai";

export default function SocialMediaLink({
  platform,
  url,
}: {
  platform: string;
  url: string;
}) {
  const getIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return <AiOutlineWhatsApp size={20} />;
      case "facebook":
        return <FacebookIcon size={20} />;
      case "instagram":
        return <Instagram size={20} />;
      case "tiktok":
        return <AiFillTikTok size={20} />;
      case "reddit":
        return <AiFillRedditCircle size={20} />;
      case "linkedin":
        return <AiFillLinkedin size={20} />;
      default:
        return null;
    }
  };
  return (
    <Link
      href={url}
      target="_blank"
      className="w-5 h-5 cursor-pointer bg-surface/30 p-3"
    >
      {getIcon(platform)}
    </Link>
  );
}
