import { Avatar } from "@/app/component/common/Avatar";
import { ProfileUser } from "../types";

export const UserLink = ({ user }: { user: ProfileUser }) => {
  const fullName =
    (user.profile?.firstName || "") + " " + (user.profile?.lastName || "");
  const avatarImage = user.images?.find((img) => img.isMain)?.url || user.image;

  return (
    <a
      href={`/profile/${user.id}`}
      className="bg-gray-200 flex items-center gap-2 p-4 rounded-md"
    >
      {avatarImage && <Avatar size={36} image={avatarImage} />}
      {fullName}
    </a>
  );
};
