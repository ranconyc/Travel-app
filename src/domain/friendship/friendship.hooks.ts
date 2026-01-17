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
    mutationFn: async ({ targetUserId, currentUserId }) => {
      return await sendFriendRequestAction(targetUserId, currentUserId);
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
    mutationFn: async ({ targetUserId, currentUserId }) => {
      return await cancelFriendRequestAction(targetUserId, currentUserId);
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
    mutationFn: async ({ targetUserId, currentUserId }) => {
      return await acceptFriendRequestAction(targetUserId, currentUserId);
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
    mutationFn: async ({ targetUserId, currentUserId }) => {
      return await denyFriendRequestAction(targetUserId, currentUserId);
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
    mutationFn: async ({ targetUserId, currentUserId }) => {
      return await removeFriendAction(targetUserId, currentUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
