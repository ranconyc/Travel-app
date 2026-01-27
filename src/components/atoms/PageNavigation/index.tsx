"use client";

import { Shield, Heart, Instagram, MapPin, Clock, Calendar, Users, FacebookIcon } from "lucide-react";
import { AiFillTikTok } from "react-icons/ai";
import { AiFillRedditCircle } from "react-icons/ai";
import Button from "@/components/atoms/Button";
import social from "@/data/social.json";
import { useState } from "react";

interface PageNavigationProps {
  showBack?: boolean;
  showActions?: boolean;
  showSocial?: boolean;
  title?: string;
  locationName?: string;
  className?: string;
}

export default function PageNavigation({
  showBack = true,
  showActions = true,
  showSocial = false,
  title,
  locationName,
  className = "",
}: PageNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for backdrop
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  const actionButtons = [
    { Icon: Shield, label: "Safety" },
    { Icon: Heart, label: "Favorites" },
  ];

  const socialButtons = [
    { Icon: AiFillTikTok, label: "TikTok", url: (name: string) => `${social.filter((s) => s.name === "tiktok")[0].groupsURL}${name}` },
    { Icon: FacebookIcon, label: "Facebook", url: (name: string) => `${social.filter((s) => s.name === "facebook")[0].groupsURL}${name}` },
    { Icon: AiFillRedditCircle, label: "Reddit", url: (name: string) => `${social.filter((s) => s.name === "reddit")[0].groupsURL}${name} travel` },
    { Icon: Instagram, label: "Instagram", url: (name: string) => `${social.filter((s) => s.name === "instagram")[0].groupsURL}${name}` },
  ];

  return (
    <nav
      className={`sticky top-0 bg-main fixed top-0 left-0 right-0 z-50 p-md flex items-center justify-between transition-all duration-300 ${
        isScrolled ? "bg-main/95 backdrop-blur-md shadow-lg" : ""
      } ${className}`}
    >
      {/* Back Button */}
      {showBack && (
        <Button
          variant="back"
          className="bg-gray-800/50 backdrop-blur-md hover:bg-gray-800"
        />
      )}

      {/* Title/Location */}
      {(title || locationName) && (
        <div className="flex flex-col items-center">
          {locationName && (
            <span className="text-xs text-txt-sec uppercase tracking-wider">
              {locationName}
            </span>
          )}
          {title && (
            <span className="text-sm font-medium text-txt-main">
              {title}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-3">
          {actionButtons.map(({ Icon, label }, idx) => (
            <button
              key={idx}
              aria-label={label}
              className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Icon size={20} className="text-white" />
            </button>
          ))}
        </div>
      )}

      {/* Social Buttons */}
      {showSocial && locationName && (
        <div className="flex items-center gap-2">
          {socialButtons.map(({ Icon, label, url }, idx) => (
            <a
              key={idx}
              href={url(locationName)}
              target="_blank"
              aria-label={label}
              className="w-8 h-8 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Icon size={16} className="text-white" />
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
