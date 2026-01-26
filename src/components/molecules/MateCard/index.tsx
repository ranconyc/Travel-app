"use client";
import BaseCard from "@/components/molecules/BaseCard";
import { User } from "@/domain/user/user.schema";
import Typography from "@/components/atoms/Typography";

import ResidentOrVisitorBadge from "@/components/atoms/ResidentOrVisitorBadge";
import { useMateCard } from "./useMateCard";

export default function MateCard({
  mate,
  loggedUser,
  priority,
}: {
  mate: User & { match?: { score: number } };
  loggedUser: User;
  priority: boolean;
}) {
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
    <BaseCard
      linkHref={`/profile/${userId}`}
      image={{ src: mainImage ?? undefined, alt: name ?? undefined }}
      priority={priority}
      className="aspect-3/4! group overflow-hidden"
    >
      <div className="p-2 h-full flex flex-col justify-between relative">
        {/* Top section - Match percentage */}
        {showMatchScore && (
          <div className="w-full flex items-center justify-end">
            <div className="text-white border border-white/20 px-2 py-2 w-fit bg-black/30 backdrop-blur-md rounded-full shadow-lg">
              <div className="flex flex-col items-center justify-center gap-0">
                <Typography
                  variant="tiny"
                  className="text-white font-bold leading-none"
                >
                  {matchScore}%
                </Typography>
                <Typography
                  variant="micro"
                  className="text-white/80 font-bold uppercase leading-none mt-0.5"
                >
                  match
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/* Bottom section - User info */}
        <div className="pb-2 px-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {/* Local/Visitor Label */}
          <ResidentOrVisitorBadge isResident={isResident} />

          {/* Name and Age */}
          <Typography variant="h3" className="text-white font-bold truncate">
            {name}
          </Typography>

          {/* Persona Glimpse - Top 3 Interests */}
          {interests.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {interests.map((interest, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-white/20 backdrop-blur-md text-white px-1.5 py-0.5 rounded-md font-medium tracking-wide uppercase shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
}
