import { Avatar } from "@/app/component/common/Avatar";
import { ProfileUser } from "../types";

export const UserLink = ({ user }: { user: ProfileUser }) => {
  const fullName = user.firstName + " " + user.lastName;
  return (
    <a
      href={`/profile/${user.id}`}
      className="bg-gray-200 flex items-center gap-2 p-4 rounded-md"
    >
      {user.image && <Avatar size={36} image={user.image} />}
      {fullName}
    </a>
  );
};
