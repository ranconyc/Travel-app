import { Avatar } from "@/app/components/common/Avatar";
import { useProfileUser } from "../../store/useProfileStore";
import Badge from "@/app/components/common/Badge";

export default function ProfileAvatar() {
  const profileUser = useProfileUser();

  if (!profileUser) return null;

  const avatarUrl =
    profileUser.avatarUrl ||
    "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png";

  return (
    <div className="relative">
      <Avatar
        image={avatarUrl}
        name={profileUser.name || "User"}
        size={150}
        variant="square"
        border
      />
      <Badge>
        <h2 className="text-sm">Visitor</h2>
      </Badge>
    </div>
  );
}
