import { Avatar } from "@/app/components/common/Avatar";
import { useProfileUser } from "../../store/useProfileStore";

const Badge = ({ title }: { title: string }) => (
  <div className="px-3 py-1 bg-brand font-bold text-[10px] tracking-widest text-white border uppercase border-brand  rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 shadow-sm z-10">
    <h2 className="text-xs">{title}</h2>
  </div>
);

export default function ProfileAvatar() {
  const profileUser = useProfileUser();

  if (!profileUser) return null;

  const avatarUrl = profileUser.avatarUrl || "/public/placeholder-avatar.jpg";
  const isMyCity =
    profileUser.currentCityId === profileUser.profile?.homeBaseCityId;

  return (
    <div className="relative">
      <Avatar
        image={avatarUrl}
        name={profileUser.name || "User"}
        size={150}
        variant="square"
        border
      />
      <Badge title={isMyCity ? "local" : "visitor"} />
    </div>
  );
}
