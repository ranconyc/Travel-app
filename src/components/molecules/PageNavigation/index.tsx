"use client";

import { useEffect, useState } from "react";
import { Instagram, FacebookIcon, ChevronLeft } from "lucide-react";
import { AiFillTikTok, AiFillRedditCircle } from "react-icons/ai";
import Button from "@/components/atoms/Button";
import Typography from "@/components/atoms/Typography";
import social from "@/data/social.json";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageNavigationProps {
  showBack?: boolean;
  /** Pass custom content for the right side. Defaults to action buttons if not provided. */
  rightContent?: React.ReactNode;
  showSocial?: boolean;
  title?: string;
  locationName?: string;
  heroImageSrc?: string | null;
  badge?: React.ReactNode;
  type?: "country" | "city" | "place";
  className?: string;
}

export default function PageNavigation({
  showBack = true,
  rightContent,
  showSocial = false,
  title,
  locationName,
  heroImageSrc,
  badge,
  type = "country",
  className = "",
}: PageNavigationProps) {
  const [scrollY, setScrollY] = useState(0);
  const isScrolled = scrollY > 20;

  // Collapse threshold
  const COLLAPSE_THRESHOLD = 300;
  const isCollapsed = scrollY > COLLAPSE_THRESHOLD;

  // Fix: Use useEffect for scroll listener to avoid memory leak
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socialButtons = [
    {
      Icon: AiFillTikTok,
      label: "TikTok",
      url: (name: string) =>
        `${social.find((s) => s.name === "tiktok")?.groupsURL}${encodeURIComponent(name.replace(/#/g, ""))}`,
    },
    {
      Icon: FacebookIcon,
      label: "Facebook",
      url: (name: string) =>
        `${social.find((s) => s.name === "facebook")?.groupsURL}${encodeURIComponent(name.replace(/#/g, ""))}`,
    },
    {
      Icon: AiFillRedditCircle,
      label: "Reddit",
      url: (name: string) =>
        `${social.find((s) => s.name === "reddit")?.groupsURL}${encodeURIComponent(name.replace(/#/g, "") + " travel")}`,
    },
    {
      Icon: Instagram,
      label: "Instagram",
      url: (name: string) => {
        const sanitized = name.replace(/#/g, "");
        let suffix = "";
        if (type === "country") {
          suffix = " travel";
        } else if (type === "city") {
          suffix = " guide";
        }
        return `${social.find((s) => s.name === "instagram")?.groupsURL}${encodeURIComponent(sanitized + suffix)}`;
      },
    },
  ];

  return (
    <>
      {/* Immersive Hero Section (Collapsible) */}
      {heroImageSrc && (
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <motion.div
            style={{
              scale: Math.max(1, 1 + scrollY / 1000),
              opacity: Math.max(0, 1 - scrollY / (COLLAPSE_THRESHOLD * 1.5)),
            }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={heroImageSrc}
              alt={title || "Hero"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-bg-main" />
          </motion.div>

          {/* Floating Content over Hero */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 z-10 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1 - scrollY / COLLAPSE_THRESHOLD, y: 0 }}
            >
              {badge}
              <h1 className="text-display-xl font-black text-white drop-shadow-lg mt-4 leading-tight">
                {title}
              </h1>
              <p className="text-xl font-medium text-white/90 drop-shadow-md">
                {locationName}
              </p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Sticky Top Bar */}
      <nav
        className={cn(
          "sticky top-0 left-0 right-0 z-sticky p-md flex items-center justify-between transition-all duration-300",
          isScrolled
            ? "bg-surface/80 backdrop-blur-2xl shadow-soft border-b border-white/10"
            : "bg-transparent",
          className,
        )}
      >
        <div className="flex items-center gap-md">
          {showBack && (
            <Button
              variant="icon"
              aria-label="Go back"
              className={cn(
                "w-10 h-10 rounded-full",
                !isScrolled && !heroImageSrc
                  ? "bg-surface shadow-sm"
                  : isScrolled
                    ? "bg-transparent"
                    : "bg-white/20 backdrop-blur-md text-white border-white/20",
              )}
              onClick={() => window.history.back()}
              icon={<ChevronLeft size={20} />}
            />
          )}

          {/* Title shows only when scrolled/collapsed */}
          <AnimatePresence>
            {(isCollapsed || (!heroImageSrc && isScrolled)) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <Typography
                  variant="ui"
                  weight="bold"
                  className="leading-tight"
                >
                  {title}
                </Typography>
                <Typography
                  variant="micro"
                  color="sec"
                  className="leading-tight"
                >
                  {locationName}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-sm">
          {rightContent}

          {showSocial && locationName && (
            <div className="flex items-center gap-xs ml-2 border-l border-border pl-2">
              {socialButtons.slice(0, 4).map(({ Icon, label, url }) => (
                <Button
                  key={label}
                  variant="icon"
                  aria-label={label}
                  href={url(locationName)}
                  target="_blank"
                  className={cn(
                    "w-8 h-8",
                    !isScrolled && heroImageSrc
                      ? "bg-white/20 backdrop-blur-md text-white border-white/20"
                      : "",
                  )}
                  icon={<Icon size={16} />}
                />
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
