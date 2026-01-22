"use client";

import Button from "@/app/components/common/Button";
import {
  ShieldUser,
  UserRoundPlus,
  Settings,
  UserRoundX,
  UserRoundCheck,
  Loader2,
} from "lucide-react";
import { Avatar } from "@/app/components/common/Avatar";
import { useFriendshipAction } from "@/domain/friendship/friendship.hooks";
import { useRouter } from "next/navigation";
import SocialMediaLink from "./socialMediaLink";
import {
  useProfileUser,
  useIsMyProfile,
  useFriendship,
  useLoggedUser,
} from "../../store/useProfileStore";

const ProfileSettingsButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="icon"
      onClick={() => router.push("/profile/edit")}
      icon={<Settings size={20} />}
    />
  );
};
const Badge = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-2 py-1 bg-surface border border-brand font-bold text-[10px] uppercase tracking-wider text-brand rounded-full absolute -bottom-3 left-1/2 -translate-x-1/2 shadow-sm z-10">
      {children}
    </div>
  );
};

const FriendshipButton = () => {
  const profileUser = useProfileUser();
  const loggedUser = useLoggedUser();
  const friendship = useFriendship();
  const router = useRouter();

  const { handleFriendshipAction, isLoading, isSentByMe } = useFriendshipAction(
    {
      profileUserId: profileUser?.id ?? "",
      loggedUserId: loggedUser?.id,
      friendship,
    },
  );

  if (!profileUser) return null;

  const onAction = async () => {
    await handleFriendshipAction();
    router.refresh();
  };

  const renderFriendshipIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-5 h-5 animate-spin" />;
    }

    if (friendship?.status === "PENDING") {
      // Show different icons based on who sent the request
      if (isSentByMe) {
        return <UserRoundX size={20} />;
      } else {
        return <UserRoundCheck size={20} />;
      }
    }

    if (friendship?.status === "ACCEPTED") {
      return <ShieldUser size={20} />;
    }

    if (friendship?.status === "DENIED") {
      return <span className="text-xs text-secondary">Denied</span>;
    }

    // No friendship - show add friend
    return <UserRoundPlus size={20} />;
  };

  return (
    <Button
      size="sm"
      variant="icon"
      role="button"
      onClick={onAction}
      aria-disabled={isLoading}
      icon={renderFriendshipIcon()}
    />
  );
};

const SocialMediaButton = () => {
  const profileUser = useProfileUser();
  if (!profileUser?.profile?.socials?.length) return null;

  return (
    <div className="flex items-center gap-2">
      {profileUser.profile.socials.map(
        (social: { platform: string; url: string }) => (
          <SocialMediaLink
            key={social?.url}
            platform={social?.platform as "instagram" | "tiktok"}
            url={social?.url}
          />
        ),
      )}
    </div>
  );
};

const TopNav = () => {
  const isMyProfile = useIsMyProfile();
  return (
    <nav className="p-4 pt-8 flex items-center justify-between gap-2 sticky top-0 left-0 right-0 bg-app-bg z-40">
      <Button variant="back" />
      {isMyProfile ? <ProfileSettingsButton /> : <FriendshipButton />}
    </nav>
  );
};

export function ProfileHeader() {
  const profileUser = useProfileUser();
  if (!profileUser) return null;
  return (
    <div>
      <TopNav />
      <div className="w-full flex items-center justify-center gap-2">
        {profileUser?.profile?.socials && <SocialMediaButton />}
      </div>
      <div className="pt-4 flex flex-col gap-6 items-center">
        <div className="relative">
          <Avatar
            image={
              profileUser.avatarUrl ||
              "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
            }
            name={profileUser.name || "User"}
            size={128}
            variant="square"
            border
          />
          <Badge>Visitor</Badge>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {profileUser.profile?.firstName
              ? `${profileUser.profile.firstName} ${
                  profileUser.profile.lastName || ""
                }`.trim()
              : profileUser.name}
          </h1>
          {profileUser.currentCity && (
            <p className="text-xs">
              {profileUser.currentCity?.name || "user location"},
              {profileUser.currentCity?.country?.name ===
              "United States of America"
                ? "USA"
                : profileUser.currentCity?.country?.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
