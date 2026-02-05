"use client";

import { memo } from "react";
import Card from "@/components/molecules/Card";
import { User } from "@/domain/user/user.schema";
import Typography from "@/components/atoms/Typography";
import Badge from "@/components/atoms/Badge";
import { useMateCard } from "./useMateCard";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface MateCardProps {
  mate: User & { match?: { score: number } };
  loggedUser: User;
  priority: boolean;
  className?: string;
}

// Internal variants for sub-elements if they get reused or complex
const matchScoreVariants = cva(
  "text-white border border-white/20 px-2 py-2 w-fit bg-black/30 backdrop-blur-md rounded-full shadow-lg transition-transform hover:scale-105",
);

const interestBadgeVariants = cva(
  "text-[10px] bg-white/20 backdrop-blur-md text-white px-1.5 py-0.5 rounded-md font-medium tracking-wide uppercase shadow-sm whitespace-nowrap",
);

const MateCard = memo(function MateCard({
  mate,
  loggedUser,
  priority,
  className,
}: MateCardProps) {
  const {
    userId,
    mainImage,
    isResident,
    name,
    interests,
    showMatchScore,
    matchScore,
  } = useMateCard({ mate, loggedUser });

  return (
    <Card
      variant="image"
      linkHref={`/profile/${userId}`}
      image={{
        src: mainImage ?? undefined,
        alt: name ?? "Profile image",
        priority,
      }}
      priority={priority}
      gradient="bg-gradient-to-t from-black/70 via-black/40 to-transparent"
      className={cn("h-full", className)}
    >
      <div className="p-mdlg h-full flex flex-col justify-between relative">
        {/* Top Section: Match Score */}
        <div className="w-full flex items-center justify-end min-h-[44px]">
          {showMatchScore && (
            <div className={matchScoreVariants()}>
              <div className="flex flex-col items-center justify-center gap-0">
                <Typography
                  variant="tiny"
                  className="text-white font-bold leading-none"
                >
                  {matchScore}%
                </Typography>
                <Typography
                  variant="micro"
                  color="inverse"
                  weight="bold"
                  className="leading-none mt-0.5"
                >
                  match
                </Typography>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Info */}
        <div className="pb-2 px-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <Badge
            variant="default"
            className={cn(
              "text-image text-micro font-bold mb-1",
              isResident ? "bg-brand-warm" : "bg-brand-success",
            )}
          >
            {isResident ? "Local" : "Visitor"}
          </Badge>

          <Typography
            variant="h3"
            weight="bold"
            color="inverse"
            className="truncate"
          >
            {name}
          </Typography>

          {interests.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {interests.slice(0, 3).map((interest, i) => (
                <span key={i} className={interestBadgeVariants()}>
                  {interest}
                </span>
              ))}
              {interests.length > 3 && (
                <span className={interestBadgeVariants()}>
                  +{interests.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});

export default MateCard;
