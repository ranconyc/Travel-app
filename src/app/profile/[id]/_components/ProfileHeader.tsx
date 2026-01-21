"use client";

import Button from "@/app/components/common/Button";
import {
  Linkedin,
  ShieldUser,
  UserRoundPlus,
  Settings,
  UserRoundX,
  UserRoundCheck,
  Loader2,
} from "lucide-react";
import Link from "next/link";

import { useFriendshipAction } from "@/domain/friendship/friendship.hooks";
import { useRouter } from "next/navigation";
import { User } from "@/domain/user/user.schema";
import SocialMediaLink from "./socialMediaLink";
import Image from "next/image";

const ProfileSettingsButton = () => {
  return (
    <Button
      variant="icon"
      iconPosition="right"
      icon={
        <Link href="/profile/edit">
          <Settings size={20} />
        </Link>
      }
    />
  );
};
const Badge = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-2 py-1 bg-surface border border-brand font-bold  text-brand rounded-full absolute -bottom-3 left-1/2 -translate-x-1/2">
      {children}
    </div>
  );
};

const Avatar = ({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) => {
  return (
    <div className="w-32 h-32 relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover rounded-3xl"
      />
      <Badge>Visitor</Badge>
    </div>
  );
};

const FriendshipButton = ({
  profileUser,
  loggedUser,
  friendship,
}: {
  friendship: { status: string; requesterId: string } | null;
  loggedUser?: { id: string } | null;
  profileUser: User;
}) => {
  const router = useRouter();

  const { handleFriendshipAction, isLoading, isSentByMe } = useFriendshipAction(
    {
      profileUserId: profileUser.id,
      loggedUserId: loggedUser?.id,
      friendship,
    },
  );

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

const SocialMediaButton = ({ profileUser }: { profileUser: User }) => {
  return (
    <Button
      variant="icon"
      iconPosition="right"
      icon={profileUser?.profile?.socials.map(
        (social: { platform: string; url: string }) => (
          <SocialMediaLink
            key={social?.url}
            platform={social?.platform}
            url={social?.url}
          />
        ),
      )}
    />
  );
};

const TopNav = ({
  isYourProfile,
  profileUser,
  loggedUser,
  friendship,
}: {
  isYourProfile: boolean;
  profileUser: User;
  loggedUser: User;
  friendship: { status: string; requesterId: string } | null;
}) => {
  return (
    <nav className="p-4 pt-8 flex items-center justify-between gap-2 sticky top-0 left-0 right-0 bg-app-bg z-40">
      <Button variant="back" />
      {isYourProfile ? (
        <ProfileSettingsButton />
      ) : (
        <FriendshipButton
          profileUser={profileUser}
          loggedUser={loggedUser}
          friendship={friendship}
        />
      )}
    </nav>
  );
};

export function ProfileHeader({
  isYourProfile,
  loggedUser,
  profileUser,
  friendship,
}: {
  friendship: { status: string; requesterId: string } | null;
  isYourProfile: boolean;
  loggedUser?: { id: string } | null;
  profileUser: User;
}) {
  return (
    <div>
      <TopNav
        isYourProfile={isYourProfile}
        profileUser={profileUser}
        loggedUser={loggedUser}
        friendship={friendship}
      />
      <div className="w-full flex items-center justify-center gap-2">
        {profileUser?.profile?.socials && (
          <SocialMediaButton profileUser={profileUser} />
        )}
      </div>
      <div className="pt-4 flex flex-col gap-6 items-center">
        <Avatar
          src={
            profileUser.avatarUrl ||
            "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
          }
          alt={profileUser.name || "User"}
          width={128}
          height={128}
        />
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
