"use client";
import { getAge } from "@/app/_utils/age";
import StatusIndicator from "../../StatusIndicator";
import BaseCard from "../BaseCard";
import { AvatarList } from "../../AvatarList";
import { User } from "@/domain/user/user.schema";
import { useSocket } from "@/lib/socket/socket-context";

const ResidentOrVisitorBadge = ({ isResident }: { isResident: boolean }) => (
  <div
    className={`${
      isResident ? "bg-blue-500" : "bg-yellow-500"
    } text-white px-2 py-1 rounded-full text-xs capitalize w-fit`}
  >
    {isResident ? "local" : "visitor"}
  </div>
);

const LocationBadge = ({ location }: { location: string }) => (
  <div className="text-white text-sm">{location}</div>
);

export default function MateCard({
  mate,
  loggedUser,
  priority,
}: {
  mate: User;
  loggedUser: User;
  priority: boolean;
}) {
  const { id: userId, image, name, currentCity: location, birthday } = mate;
  const isResident =
    !!mate.currentCityId &&
    !!mate.homeBaseCityId &&
    mate.currentCityId === mate.homeBaseCityId;

  const { isUserOnline } = useSocket();
  const isOnline = isUserOnline(userId);

  return (
    <BaseCard
      linkHref={`/profile/${userId}`}
      image={{ src: image, alt: name }}
      priority={priority}
    >
      <div className="h-full flex flex-col justify-between">
        {loggedUser?.id === userId ? (
          <h1 className="text-white">this is you</h1>
        ) : (
          <AvatarList
            list={[
              { id: userId, image: image, name: name },
              {
                id: loggedUser?.id,
                image: loggedUser?.image,
                name: loggedUser?.name,
              },
            ]}
            matchPercentage={56}
            showMatch
          />
        )}
        <div>
          <div className="flex items-center gap-2">
            <StatusIndicator isOnline={isOnline} />
            <LocationBadge
              location={
                typeof location === "string"
                  ? location
                  : location?.name || "Location not set"
              }
            />
            <ResidentOrVisitorBadge isResident={isResident} />
          </div>
          <h3 className="text-white font-bold leading-tight text-[clamp(18px,2.8vw,24px)] line-clamp-2 mt-2">
            {mate.name}
            {birthday && `, ${getAge(birthday)}`}
          </h3>
        </div>
      </div>
    </BaseCard>
  );
}
