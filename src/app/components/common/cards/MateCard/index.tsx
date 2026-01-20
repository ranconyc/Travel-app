"use client";
import { getAge } from "@/app/_utils/age";
import StatusIndicator from "@/app/components/common/StatusIndicator";
import BaseCard from "@/app/components/common/cards/BaseCard";
import { AvatarList } from "@/app/components/common/AvatarList";
import { User } from "@/domain/user/user.schema";
import { useSocket } from "@/lib/socket/socket-context";

const ResidentOrVisitorBadge = ({ isResident }: { isResident: boolean }) => (
  <div
    className={`${
      isResident ? "bg-orange-500" : "bg-yellow-500"
    } text-white px-3 py-1 rounded text-xs font-semibold uppercase w-fit`}
  >
    {isResident ? "Local" : "Visitor"}
  </div>
);

const LocationBadge = ({ location }: { location: string }) => (
  <div className="flex items-center gap-1 text-white text-xs">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
    <span>{location}</span>
  </div>
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
  const { id: userId, avatarUrl, name, currentCity: location, match } = mate;
  const birthday = mate.profile?.birthday;
  const mainImage =
    mate.media?.find((img: any) => img.category === "AVATAR")?.url || avatarUrl;

  const isResident =
    !!mate.currentCityId &&
    !!mate.profile?.homeBaseCityId &&
    mate.currentCityId === mate.profile.homeBaseCityId;

  const { isUserOnline } = useSocket();
  const isOnline = isUserOnline(userId);

  const firstName =
    mate.profile?.firstName || mate.name?.split(" ")[0] || mate.name;
  const lastName = mate.profile?.lastName || mate.name?.split(" ")[1] || "";
  const age = birthday ? getAge(birthday.toISOString()) : null;

  return (
    <BaseCard
      linkHref={`/profile/${userId}`}
      image={{ src: mainImage ?? undefined, alt: name ?? undefined }}
      priority={priority}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      <div className="relative h-full flex flex-col justify-between p-4">
        {/* Top section - Match percentage */}
        {loggedUser?.id !== userId && (
          <div className="flex justify-end">
            <AvatarList
              list={[{ ...mate }, { ...loggedUser }]}
              matchPercentage={match?.score || 0}
              showMatch
            />
          </div>
        )}

        {/* Bottom section - User info */}
        <div className="space-y-2">
          {/* Status and Location Badge */}
          {!isResident && location && (
            <LocationBadge
              location={
                typeof location === "string" ? location : location?.name || ""
              }
            />
          )}

          {/* Local/Visitor Badge */}
          <ResidentOrVisitorBadge isResident={isResident} />

          {/* Name and Age */}
          <div className="flex items-baseline gap-2">
            <h3 className="text-white font-bold text-xl leading-tight">
              {firstName}
              {lastName && ` ${lastName}`}
            </h3>
            {isOnline && <StatusIndicator isOnline={isOnline} />}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
