"use client";

import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import { User } from "@/domain/user/user.schema";
import { UserCheck, UserX } from "lucide-react";
import {
  acceptFriendRequestAction,
  denyFriendRequestAction,
} from "@/domain/friendship/friendship.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FriendRequestBannerProps {
  friendship: {
    status: string;
    requesterId: string;
    addresseeId: string;
  } | null;
  profileUser: User;
  loggedUserId: string;
}

export default function FriendRequestBanner({
  friendship,
  profileUser,
  loggedUserId,
}: FriendRequestBannerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Show only if:
  // 1. Friendship exists and is PENDING
  // 2. The logged-in user is the ADDRESSEE (received the request)
  // 3. The profile owner is the REQUESTER (sent the request)
  const shouldShow =
    friendship?.status === "PENDING" &&
    friendship.addresseeId === loggedUserId &&
    friendship.requesterId === profileUser.id;

  if (!shouldShow) return null;

  const handleAction = async (action: "accept" | "reject") => {
    setIsLoading(true);
    try {
      if (action === "accept") {
        await acceptFriendRequestAction({ targetUserId: profileUser.id });
        toast.success(
          `You are now friends with ${profileUser.profile?.firstName}`,
        );
      } else {
        await denyFriendRequestAction({ targetUserId: profileUser.id });
        toast.success("Friend request rejected");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-20 left-4 right-4 z-40 md:relative md:top-0 md:mb-6 animate-in slide-in-from-top-md fade-in duration-500">
      <div className="bg-white dark:bg-surface rounded-[32px] p-6 shadow-xl border border-surface-secondary flex flex-col items-center gap-6 mx-auto">
        <h3 className="text-xl font-bold font-sora text-center">
          <span className="text-brand">
            {profileUser.profile?.firstName || profileUser.name}
          </span>{" "}
          wants to be your friend
        </h3>

        <div className="flex gap-md w-full">
          <Button
            variant="outline"
            className="flex-1"
            size="lg"
            onClick={() => handleAction("reject")}
            loading={isLoading}
            disabled={isLoading}
            icon={<UserX size={20} />}
          >
            Reject
          </Button>
          <Button
            variant="brand"
            className="flex-1"
            size="lg"
            onClick={() => handleAction("accept")}
            loading={isLoading}
            disabled={isLoading}
            icon={<UserCheck size={20} />}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
