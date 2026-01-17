"use client";

import Button from "@/app/components/common/Button";
import {
  Linkedin,
  ShieldUser,
  UserRoundPlus,
  Settings,
  UserRoundX,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";

import { useState, useTransition } from "react";
import { sendFriendRequestAction } from "@/domain/friendship/friendship.actions";
import { useRouter } from "next/navigation";
// import { User } from "@/domain/user/user.schema";

export const ProfileHeader = ({
  isYourProfile,
  loggedUser,
  profileUserId,
  friendship,
}: {
  friendship: { status: string; requesterId: string } | null;
  isYourProfile: boolean;
  loggedUser?: { id: string } | null;
  profileUserId: string;
}) => {
  const linkedinUsername = "rancodesign";
  const [isPending, startTransition] = useTransition();
  const [requestSent, setRequestSent] = useState(false);
  const router = useRouter();

  const handleSendFriendRequest = async () => {
    if (!loggedUser?.id) return;

    startTransition(async () => {
      try {
        await sendFriendRequestAction(profileUserId, loggedUser.id);
        setRequestSent(true);
        router.refresh();
      } catch (error) {
        console.error("Failed to send friend request:", error);
      }
    });
  };

  return (
    <div className="p-4 flex items-center justify-between gap-2 sticky top-6 left-0 right-0 bg-app-bg z-40">
      <Button variant="back" />
      <div className="flex items-center justify-between gap-2">
        <div className="p-3 bg-surface rounded-full cursor-pointer">
          <Link
            href={`https://www.linkedin.com/in/${linkedinUsername}`}
            target="_blank"
          >
            <Linkedin />
          </Link>
        </div>
        {
          <div className="p-3 bg-surface rounded-full cursor-pointer">
            <div role="button" onClick={handleSendFriendRequest}>
              {friendship?.status === "PENDING" ? (
                // cancel request
                <UserRoundX />
              ) : friendship?.status === "ACCEPTED" ? (
                // remove friend
                <ShieldUser />
              ) : friendship?.status === "DENIED" ? (
                "DENIED"
              ) : isYourProfile ? (
                <Link href="/profile/complete">
                  <Settings />
                </Link>
              ) : (
                // send request
                <UserRoundPlus />
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
};
