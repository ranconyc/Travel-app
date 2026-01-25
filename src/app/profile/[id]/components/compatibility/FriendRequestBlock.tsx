"use client";

import { useEffect, useState, useTransition } from "react";
import { useUser } from "@/app/providers/UserProvider";
import { useProfileUser } from "../../store/useProfileStore";
import {
  acceptFriendRequestAction,
  denyFriendRequestAction,
  sendFriendRequestAction,
  removeFriendAction,
  getFriendshipStatusAction,
} from "@/domain/friendship/friendship.actions";
import Button from "@/components/atoms/Button";
import MatchAvatars from "./MatchAvatars";
import {
  UserRoundCheck,
  UserRoundX,
  UserPlus,
  UserMinus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

type FriendshipStatus = {
  status: "PENDING" | "ACCEPTED" | "BLOCKED" | "IGNORED";
  requesterId: string;
  addresseeId: string;
} | null;

export default function FriendRequestBlock() {
  const user = useUser();
  const profileUser = useProfileUser();
  const [friendship, setFriendship] = useState<FriendshipStatus | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchStatus() {
      if (!user || !profileUser || user.id === profileUser.id) {
        setIsLoading(false);
        return;
      }

      const res = await getFriendshipStatusAction({
        targetUserId: profileUser.id,
      });

      if (res?.data) {
        // @ts-expect-error - Prisma enum type mismatch with local type if specific enums aren't imported, but string matching works
        setFriendship(res.data);
      } else {
        setFriendship(null);
      }
      setIsLoading(false);
    }

    fetchStatus();
  }, [user, profileUser]);

  if (
    !user ||
    !profileUser ||
    user.id === profileUser.id ||
    typeof friendship === "undefined"
  ) {
    return null;
  }

  const handleAction = (
    action: (data: { targetUserId: string }) => Promise<any>,
    successMessage: string,
  ) => {
    startTransition(async () => {
      const res = await action({ targetUserId: profileUser.id });
      if (res?.serverError || res?.validationErrors) {
        toast.error("Action failed");
      } else {
        toast.success(successMessage);
        // Refresh status
        const statusRes = await getFriendshipStatusAction({
          targetUserId: profileUser.id,
        });
        // @ts-expect-error - Prisma enum type mismatch
        setFriendship(statusRes?.data || null);
      }
    });
  };

  const isIncomingRequest =
    friendship?.status === "PENDING" && friendship.addresseeId === user.id;
  const isOutgoingRequest =
    friendship?.status === "PENDING" && friendship.requesterId === user.id;
  const isFriends = friendship?.status === "ACCEPTED";
  const noRelation = !friendship;

  // Render logic based on state
  if (isIncomingRequest) {
    return (
      <div className="w-full bg-bg-card p-md flex flex-col gap-md rounded-card shadow-soft border border-stroke">
        <h2 className="text-p text-center text-txt-main">
          <span className="text-brand capitalize font-bold">
            {profileUser.firstName}{" "}
          </span>
          wants to be your friend
        </h2>
        <MatchAvatars size={80} />
        <div className="flex gap-md">
          <Button
            icon={<UserRoundX size={20} />}
            className="flex-1 rounded-full shadow-sm"
            variant="outline"
            size="lg"
            onClick={() =>
              handleAction(denyFriendRequestAction, "Request rejected")
            }
            loading={isPending}
            disabled={isPending}
          >
            Reject
          </Button>
          <Button
            icon={<UserRoundCheck size={20} />}
            className="flex-1 rounded-full shadow-sm"
            variant="brand"
            size="lg"
            onClick={() =>
              handleAction(acceptFriendRequestAction, "Friend added!")
            }
            loading={isPending}
            disabled={isPending}
          >
            Accept
          </Button>
        </div>
      </div>
    );
  }

  if (isFriends) {
    return (
      <div className="w-full bg-bg-card p-md flex flex-col gap-md rounded-card shadow-soft border border-stroke">
        <h2 className="text-p text-center text-txt-main">
          You and{" "}
          <span className="text-brand capitalize font-bold">
            {profileUser.firstName}
          </span>{" "}
          are friends
        </h2>
        <MatchAvatars size={80} />
        <div className="flex gap-md">
          <Button
            icon={<UserMinus size={20} />}
            className="flex-1 rounded-full shadow-sm"
            variant="outline"
            size="lg"
            onClick={() => handleAction(removeFriendAction, "Friend removed")}
            loading={isPending}
            disabled={isPending}
          >
            Unfriend
          </Button>
        </div>
      </div>
    );
  }

  if (isOutgoingRequest) {
    return (
      <div className="w-full bg-bg-card p-md flex flex-col gap-md rounded-card shadow-soft border border-stroke">
        <h2 className="text-p text-center text-txt-main">
          Friend request sent to{" "}
          <span className="text-brand capitalize font-bold">
            {profileUser.firstName}
          </span>
        </h2>
        <MatchAvatars size={80} />
        <div className="flex gap-md justify-center">
          <Button
            className="w-full rounded-full shadow-sm"
            variant="secondary"
            size="lg"
            disabled
          >
            Request Sent
          </Button>
        </div>
      </div>
    );
  }

  if (noRelation) {
    return (
      <div className="w-full bg-bg-card p-md flex flex-col gap-md rounded-card shadow-soft border border-stroke">
        <h2 className="text-p text-center text-txt-main">
          Add{" "}
          <span className="text-brand capitalize font-bold">
            {profileUser.firstName}
          </span>{" "}
          to your network
        </h2>
        <MatchAvatars size={80} />
        <div className="flex gap-md">
          <Button
            icon={<UserPlus size={20} />}
            className="w-full rounded-full shadow-sm"
            variant="brand"
            size="lg"
            onClick={() =>
              handleAction(sendFriendRequestAction, "Friend request sent!")
            }
            loading={isPending}
            disabled={isPending}
          >
            Add Friend
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
