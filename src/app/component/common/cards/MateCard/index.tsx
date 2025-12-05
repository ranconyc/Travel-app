import { getAge } from "@/app/_utils/age";
import StatusIndicator from "../../StatusIndicator";
import BaseCard from "../BaseCard";
import { AvatarList } from "../../AvatarList";
import { User } from "@/domain/user/user.schema";

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
  mate: any;
  loggedUser: User;
  priority: boolean;
}) {
  const { userId, image, name, isOnline, location, isResident, birthday } =
    mate;

  return (
    <BaseCard
      linkHref={`/profile/${userId}`}
      image={{ src: image, alt: name }}
      priority={priority}
    >
      <div className="h-full flex flex-col justify-between">
        <AvatarList
          list={[
            { id: userId, image: image, name: name },
            {
              id: loggedUser?.id === userId ? "ddddd" : loggedUser?.id,
              image: loggedUser?.image,
              name: loggedUser?.name,
            },
          ]}
          matchPercentage={56}
          showMatch
        />
        <div>
          <div className="flex items-center gap-2">
            <StatusIndicator isOnline={isOnline} />
            <LocationBadge location={location} />
            <ResidentOrVisitorBadge isResident={isResident} />
          </div>
          <h3 className="text-white font-bold leading-tight text-[clamp(18px,2.8vw,24px)] line-clamp-2 mt-2">
            {mate.name}, {getAge(birthday)}
          </h3>
        </div>
      </div>
    </BaseCard>
  );
}
