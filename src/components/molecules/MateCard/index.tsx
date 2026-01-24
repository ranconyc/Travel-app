"use client";
import BaseCard from "@/components/molecules/BaseCard";
import { AvatarList } from "@/components/molecules/AvatarList";
import { User } from "@/domain/user/user.schema";
import { useSocket } from "@/lib/socket/socket-context";

const ResidentOrVisitorLabel = ({ isResident }: { isResident: boolean }) => (
  <span
    className={`${
      isResident ? "text-[#f97316]" : "text-[#facc15]"
    } text-xs font-bold uppercase tracking-wider block mb-0.5`}
  >
    {isResident ? "Local" : "Visitor"}
  </span>
);

export default function MateCard({
  mate,
  loggedUser,
  priority,
}: {
  mate: User & { match?: { score: number } };
  loggedUser: User;
  priority: boolean;
}) {
  const { id: userId, avatarUrl, match } = mate;
  const mainImage =
    mate.media?.find(
      (img: { category: string; url: string }) => img.category === "AVATAR",
    )?.url || avatarUrl;

  const isResident =
    !!mate.currentCityId &&
    !!mate.profile?.homeBaseCityId &&
    mate.currentCityId === mate.profile.homeBaseCityId;

  const name =
    (mate?.name &&
      mate.profile?.firstName &&
      mate.profile?.lastName &&
      `${mate.profile.firstName} ${mate.profile.lastName}`) ||
    mate.profile?.firstName;

  return (
    <BaseCard
      linkHref={`/profile/${userId}`}
      image={{ src: mainImage ?? undefined, alt: name ?? undefined }}
      priority={priority}
      className="!aspect-[3/4]"
    >
      <div className="p-2 h-full flex flex-col justify-between relative">
        {/* Top section - Match percentage */}
        {loggedUser?.id !== userId && (
          <div className="w-full flex items-center justify-end">
            <div className="text-white border border-surface/30 px-2 py-2 w-fit bg-surface/40 backdrop-blur-sm  rounded-full">
              <div className="flex flex-col items-center justify-center gap-0.5">
                <h1 className="text-[12px] font-bold leading-[1.1]">
                  {match?.score}%
                </h1>
                <h2 className="text-[8px] font-bold uppercase leading-none">
                  match
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* Bottom section - User info */}
        <div className="pb-1 px-1">
          {/* Local/Visitor Label */}
          <ResidentOrVisitorLabel isResident={isResident} />

          {/* Name and Age */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-white font-bold text-md leading-tight tracking-tight">
              {name}
            </h3>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
