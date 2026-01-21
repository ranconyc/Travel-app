"use client";

import { User } from "@/domain/user/user.schema";
import { ProfileUser } from "@/types/user";
import Button from "@/app/components/common/Button";
import { useFriendshipStatus } from "@/app/_hooks/useFriendship";
import { useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequestAction,
  cancelFriendRequestAction,
  denyFriendRequestAction,
  sendFriendRequestAction,
} from "@/domain/friendship/friendship.actions";
import { AvatarList } from "@/app/components/common/AvatarList";

const SimilaritiesSection = () => (
  <div className="grid grid-cols-3 gap-2 text-xs">
    <div className="bg-gray-800 p-2 rounded-lg">
      <p className="opacity-70 mb-1">Speak</p>
      <div className="flex gap-1">
        <span>🇺🇸</span>
        <span>🇫🇷</span>
      </div>
    </div>
    <div className="bg-gray-800 p-2 rounded-lg ">
      <div className="flex justify-between">
        <p className="opacity-70 mb-1">Visited</p>
        <span className="opacity-50">3</span>
      </div>
      <p className="truncate">Bangkok, Phuket, Siem Reap</p>
    </div>
    <div className="bg-gray-800 p-2 rounded-lg ">
      <div className="flex justify-between">
        <p className="opacity-70 mb-1">Interests</p>
        <span className="opacity-50">3</span>
      </div>
      <p className="truncate">foodie, markets, nightlife</p>
    </div>
  </div>
);

type Props = {
  friendStatus: "NONE" | "PENDING" | "ACCEPTED" | "BLOCKED" | "DENIED";
  isRequester: boolean;
  profileUser: ProfileUser;
  handleConnect: () => void;
  handleCancel: () => void;
  handleAccept: () => void;
  handleDecline: () => void;
};
function RequestSection({
  profileUser,
  friendStatus,
  isRequester,
  handleConnect,
  handleCancel,
  handleAccept,
  handleDecline,
}: Props) {
  if (friendStatus === "PENDING" && isRequester) {
    return (
      <>
        <p className="text-sm opacity-80 mb-6">
          Connect to unlock shared interests
        </p>
        {
          <Button className="w-full" variant="dark" onClick={handleCancel}>
            Cancel Request
          </Button>
        }
      </>
    );
  } else if (friendStatus === "PENDING" && !isRequester) {
    return (
      <>
        <SimilaritiesSection />;
        <div>
          <p className="mb-4">
            {profileUser.profile?.firstName} wants to become a friend with you
          </p>

          <div className="flex gap-4 mb-6">
            <Button onClick={handleAccept} variant="teal" className="flex-1">
              Accept Request
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline-white"
              className="flex-1"
            >
              Decline
            </Button>
          </div>
        </div>
      </>
    );
  } else if (friendStatus === "ACCEPTED") {
    return <SimilaritiesSection />;
  } else {
    return (
      <>
        <p className="text-sm opacity-80 mb-6">
          Connect to unlock shared interests
        </p>
        {
          <Button className="w-full" variant="teal" onClick={handleConnect}>
            Connect with {profileUser.profile?.firstName}
          </Button>
        }
      </>
    );
  }
}
export const MatchSection = ({
  profileUser,
  loggedUser,
}: {
  profileUser: ProfileUser;
  loggedUser: User;
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useFriendshipStatus(
    loggedUser?.id,
    profileUser?.id,
  );

  const friendStatus = data?.status || "NONE";
  const requesterId = data?.requesterId;
  const isRequester = requesterId === loggedUser?.id;

  async function refresh() {
    await queryClient.invalidateQueries({
      queryKey: ["friendship-status", loggedUser?.id, profileUser?.id],
    });
  }

  // friend request handler
  const handleConnect = async () => {
    await sendFriendRequestAction({ targetUserId: profileUser.id });
    refresh();
  };

  // friend request cancel handler
  const handleCancel = async () => {
    await cancelFriendRequestAction({ targetUserId: profileUser.id });
    refresh();
  };

  // friend request accept handler
  const handleAccept = async () => {
    await acceptFriendRequestAction({ targetUserId: profileUser.id });
    refresh();
  };

  // friend request decline handler
  const handleDecline = async () => {
    await denyFriendRequestAction({ targetUserId: profileUser.id });
    refresh();
  };

  if (isLoading)
    return <div className="animate-pulse h-40 bg-gray-700/50 rounded-xl" />;

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold mb-1 w-[40%]">
          You and {profileUser.profile?.firstName} both have...
        </h2>
        {/* Match Badge */}
        <AvatarList
          list={[profileUser, loggedUser]}
          showMatch
          matchPercentage={80}
        />
      </div>

      {
        <RequestSection
          profileUser={profileUser}
          friendStatus={friendStatus}
          isRequester={isRequester}
          handleConnect={handleConnect}
          handleCancel={handleCancel}
          handleAccept={handleAccept}
          handleDecline={handleDecline}
        />
      }
    </div>
  );
};
