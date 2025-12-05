"use client";

import Button from "@/app/component/common/Button";
import { useFriendshipStatus } from "@/app/hooks/useFriendship";

import { useQueryClient } from "@tanstack/react-query";
import { sendFriendRequestAction } from "../../actions/sendFriendRequestAction";

export default function FriendReqButton({ profileUser, loggedUser }) {
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useFriendshipStatus(
    loggedUser?.id,
    profileUser?.id
  );

  async function refresh() {
    await queryClient.invalidateQueries({
      queryKey: ["friendship-status", loggedUser?.id, profileUser?.id],
    });
  }

  if (isLoading) return <Button disabled>Loading...</Button>;

  if (status === "NONE")
    return (
      <Button
        onClick={async () => {
          await sendFriendRequestAction(profileUser.id, loggedUser.id);
          refresh(); // re-check status
        }}
      >
        Follow
      </Button>
    );

  if (status === "PENDING") return <div>Pending...</div>;

  if (status === "ACCEPTED")
    return (
      <Button
        variant="outline"
        onClick={async () => {
          //   await removeFriendAction(profileUser.id, loggedUser.id);
          refresh();
        }}
      >
        Unfriend
      </Button>
    );

  if (status === "DENIED")
    return (
      <Button
        onClick={async () => {
          await sendFriendRequestAction(profileUser.id, loggedUser.id);
          refresh();
        }}
      >
        Re-request
      </Button>
    );

  if (status === "BLOCKED") return <Button disabled>Blocked</Button>;

  return null;
}
