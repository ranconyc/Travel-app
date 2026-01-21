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
