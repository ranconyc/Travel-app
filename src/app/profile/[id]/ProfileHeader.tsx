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

import {
  useSendFriendRequest,
  useCancelFriendRequest,
  useAcceptFriendRequest,
  useRemoveFriend,
} from "@/domain/friendship/friendship.hooks";
import { useRouter } from "next/navigation";
import SocialMediaLink from "./_components/socialMediaLink";
import { User } from "@/domain/user/user.schema";

export const ProfileHeader = ({
  isYourProfile,
  loggedUser,
  profileUser,
  friendship,
}: {
  friendship: { status: string; requesterId: string } | null;
  isYourProfile: boolean;
  loggedUser?: { id: string } | null;
  profileUser: User;
}) => {
  const router = useRouter();

  // Friendship mutations
  const sendRequest = useSendFriendRequest();
  const cancelRequest = useCancelFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const removeFriend = useRemoveFriend();

  const isLoading =
    sendRequest.isPending ||
    cancelRequest.isPending ||
    acceptRequest.isPending ||
    removeFriend.isPending;

  // Determine if the logged user sent the request
  const isSentByMe = friendship?.requesterId === loggedUser?.id;

  const handleFriendshipAction = async () => {
    if (!loggedUser?.id || isYourProfile) return;

    try {
      if (friendship?.status === "PENDING") {
        // If I sent the request, cancel it
        if (isSentByMe) {
          await cancelRequest.mutateAsync({
            targetUserId: profileUser.id,
            currentUserId: loggedUser.id,
          });
        } else {
          // If I received the request, accept it
          await acceptRequest.mutateAsync({
            targetUserId: profileUser.id,
            currentUserId: loggedUser.id,
          });
        }
      } else if (friendship?.status === "ACCEPTED") {
        // Remove friend
        await removeFriend.mutateAsync({
          targetUserId: profileUser.id,
          currentUserId: loggedUser.id,
        });
      } else {
        // Send friend request
        await sendRequest.mutateAsync({
          targetUserId: profileUser.id,
          currentUserId: loggedUser.id,
        });
      }
      router.refresh();
    } catch (error) {
      console.error("Friendship action failed:", error);
    }
  };

  const renderFriendshipIcon = () => {
    if (isYourProfile) {
      return (
        <Link href="/profile/edit">
          <Settings className="w-5 h-5" />
        </Link>
      );
    }

    if (isLoading) {
      return <Loader2 className="w-5 h-5 animate-spin" />;
    }

    if (friendship?.status === "PENDING") {
      // Show different icons based on who sent the request
      if (isSentByMe) {
        return <UserRoundX className="w-5 h-5" />;
      } else {
        return <UserRoundCheck className="w-5 h-5" />;
      }
    }

    if (friendship?.status === "ACCEPTED") {
      return <ShieldUser className="w-5 h-5" />;
    }

    if (friendship?.status === "DENIED") {
      return <span className="text-xs text-secondary">Denied</span>;
    }

    // No friendship - show add friend
    return <UserRoundPlus className="w-5 h-5" />;
  };

  return (
    <div className="p-4 pt-8 flex items-center justify-between gap-2 sticky top-0 left-0 right-0 bg-app-bg z-40">
      <Button variant="back" />
      <div className="flex items-center justify-between gap-2">
        {profileUser?.profile?.socials && (
          <button className="p-3 bg-surface rounded-full cursor-pointer hover:bg-surface-hover transition-colors">
            {profileUser?.profile?.socials.map(
              (social: { platform: string; url: string }) => (
                <SocialMediaLink
                  key={social?.url}
                  platform={social?.platform}
                  url={social?.url}
                />
              ),
            )}
          </button>
        )}

        <div
          className={`p-3 bg-surface rounded-full transition-colors ${
            !isYourProfile && !isLoading
              ? "cursor-pointer hover:bg-surface-hover"
              : isLoading
                ? "cursor-wait"
                : ""
          }`}
        >
          <button
            role="button"
            onClick={handleFriendshipAction}
            className="flex items-center justify-center"
            aria-disabled={isLoading || isYourProfile}
          >
            {renderFriendshipIcon()}
          </button>
        </div>
      </div>
    </div>
  );
};
