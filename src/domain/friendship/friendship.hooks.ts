import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendFriendRequestAction,
  cancelFriendRequestAction,
  acceptFriendRequestAction,
  denyFriendRequestAction,
  removeFriendAction,
} from "@/domain/friendship/friendship.actions";
import { Friendship } from "@prisma/client";

export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    Friendship,
    Error,
    { targetUserId: string; currentUserId: string }
  >({
    mutationFn: async ({ targetUserId }) => {
      const res = await sendFriendRequestAction({ targetUserId });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship"] }); // Broadest key
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCancelFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    Friendship | null,
    Error,
    { targetUserId: string; currentUserId: string }
  >({
    mutationFn: async ({ targetUserId }) => {
      const res = await cancelFriendRequestAction({ targetUserId });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    Friendship,
    Error,
    { targetUserId: string; currentUserId: string }
  >({
    mutationFn: async ({ targetUserId }) => {
      const res = await acceptFriendRequestAction({ targetUserId });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDenyFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    Friendship | null,
    Error,
    { targetUserId: string; currentUserId: string }
  >({
    mutationFn: async ({ targetUserId }) => {
      const res = await denyFriendRequestAction({ targetUserId });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation<
    Friendship | null,
    Error,
    { targetUserId: string; currentUserId: string }
  >({
    mutationFn: async ({ targetUserId }) => {
      const res = await removeFriendAction({ targetUserId });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useFriendshipAction({
  profileUserId,
  loggedUserId,
  friendship,
}: {
  profileUserId: string;
  loggedUserId?: string | null;
  friendship: { status: string; requesterId: string } | null;
}) {
  const sendRequest = useSendFriendRequest();
  const cancelRequest = useCancelFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const removeFriend = useRemoveFriend();

  const isLoading =
    sendRequest.isPending ||
    cancelRequest.isPending ||
    acceptRequest.isPending ||
    removeFriend.isPending;

  const isSentByMe = friendship?.requesterId === loggedUserId;

  const handleFriendshipAction = async () => {
    if (!loggedUserId) return;

    try {
      if (friendship?.status === "PENDING") {
        if (isSentByMe) {
          await cancelRequest.mutateAsync({
            targetUserId: profileUserId,
            currentUserId: loggedUserId,
          });
        } else {
          await acceptRequest.mutateAsync({
            targetUserId: profileUserId,
            currentUserId: loggedUserId,
          });
        }
      } else if (friendship?.status === "ACCEPTED") {
        await removeFriend.mutateAsync({
          targetUserId: profileUserId,
          currentUserId: loggedUserId,
        });
      } else {
        await sendRequest.mutateAsync({
          targetUserId: profileUserId,
          currentUserId: loggedUserId,
        });
      }
    } catch (error) {
      console.error("Friendship action failed:", error);
    }
  };

  return {
    handleFriendshipAction,
    isLoading,
    isSentByMe,
  };
}
