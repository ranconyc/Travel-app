"use client";

import { useEffect, useState } from "react";
import { Shield, Heart, Instagram, FacebookIcon } from "lucide-react";
import { AiFillTikTok, AiFillRedditCircle } from "react-icons/ai";
import Button from "@/components/atoms/Button";
import Typography from "@/components/atoms/Typography";
import social from "@/data/social.json";

interface PageNavigationProps {
  showBack?: boolean;
  /** Pass custom content for the right side. Defaults to action buttons if not provided. */
  rightContent?: React.ReactNode;
  showSocial?: boolean;
  title?: string;
  locationName?: string;
  className?: string;
}

export default function PageNavigation({
  showBack = true,
  rightContent,
  showSocial = false,
  title,
  locationName,
  className = "",
}: PageNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Fix: Use useEffect for scroll listener to avoid memory leak
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const actionButtons = [
    { Icon: Shield, label: "Safety" },
    { Icon: Heart, label: "Favorites" },
  ];

  const socialButtons = [
    {
      Icon: AiFillTikTok,
      label: "TikTok",
      url: (name: string) =>
        `${social.find((s) => s.name === "tiktok")?.groupsURL}${name}`,
    },
    {
      Icon: FacebookIcon,
      label: "Facebook",
      url: (name: string) =>
        `${social.find((s) => s.name === "facebook")?.groupsURL}${name}`,
    },
    {
      Icon: AiFillRedditCircle,
      label: "Reddit",
      url: (name: string) =>
        `${social.find((s) => s.name === "reddit")?.groupsURL}${name} travel`,
    },
    {
      Icon: Instagram,
      label: "Instagram",
      url: (name: string) =>
        `${social.find((s) => s.name === "instagram")?.groupsURL}${name}`,
    },
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-sticky p-md flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "bg-surface/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      } ${className}`}
    >
      {/* Back Button */}
      {showBack && <Button variant="back" />}

      {/* Title/Location */}
      {(title || locationName) && (
        <div className="flex flex-col items-center">
          {locationName && (
            <Typography variant="micro" color="sec">
              {locationName}
            </Typography>
          )}
          {title && (
            <Typography variant="ui" weight="medium" color="main">
              {title}
            </Typography>
          )}
        </div>
      )}

      {/* Right Content - Custom or Default Action Buttons */}
      {rightContent ?? (
        <div className="flex items-center gap-sm">
          {actionButtons.map(({ Icon, label }) => (
            <Button
              key={label}
              variant="icon"
              aria-label={label}
              icon={<Icon size={20} />}
            />
          ))}
        </div>
      )}

      {/* Social Buttons */}
      {showSocial && locationName && (
        <div className="flex items-center gap-xs">
          {socialButtons.map(({ Icon, label, url }) => (
            <Button
              key={label}
              variant="icon"
              aria-label={label}
              href={url(locationName)}
              target="_blank"
              className="w-8 h-8"
              icon={<Icon size={16} />}
            />
          ))}
        </div>
      )}
    </nav>
  );
}
