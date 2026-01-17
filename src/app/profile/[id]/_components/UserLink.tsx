import { Avatar } from "@/app/components/common/Avatar";
import { ProfileUser } from "@/types/user";

export const UserLink = ({ user }: { user: ProfileUser }) => {
  const fullName =
    (user.profile?.firstName || "") + " " + (user.profile?.lastName || "");
  const avatarImage =
    user.media?.find((img: { category: string }) => img.category === "AVATAR")
      ?.url || user.avatarUrl;

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
