import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  sendFriendRequestAction,
  cancelFriendRequestAction,
  acceptFriendRequestAction,
  denyFriendRequestAction,
  removeFriendAction,
  getFriendshipStatusAction,
  getTravelPartnersAction,
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
  friendship: {
    status: string;
    requesterId: string;
    addresseeId: string;
  } | null;
}) {
  const sendRequest = useSendFriendRequest();
  const cancelRequest = useCancelFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const denyRequest = useDenyFriendRequest();
  const removeFriend = useRemoveFriend();

  const isLoading =
    sendRequest.isPending ||
    cancelRequest.isPending ||
    acceptRequest.isPending ||
    denyRequest.isPending ||
    removeFriend.isPending;

  const isSentByMe = !!loggedUserId && friendship?.requesterId === loggedUserId;
  const isIncoming =
    friendship?.status === "PENDING" &&
    !!loggedUserId &&
    friendship?.addresseeId === loggedUserId;

  const handleAdd = () =>
    sendRequest.mutateAsync({
      targetUserId: profileUserId,
      currentUserId: loggedUserId!,
    });

  const handleCancel = () =>
    cancelRequest.mutateAsync({
      targetUserId: profileUserId,
      currentUserId: loggedUserId!,
    });

  const handleAccept = () =>
    acceptRequest.mutateAsync({
      targetUserId: profileUserId,
      currentUserId: loggedUserId!,
    });

  const handleDeny = () =>
    denyRequest.mutateAsync({
      targetUserId: profileUserId,
      currentUserId: loggedUserId!,
    });

  const handleRemove = () =>
    removeFriend.mutateAsync({
      targetUserId: profileUserId,
      currentUserId: loggedUserId!,
    });

  const handleFriendshipAction = async () => {
    if (!loggedUserId) return;

    try {
      if (friendship?.status === "PENDING") {
        if (isSentByMe) {
          await handleCancel();
        } else {
          await handleAccept();
        }
      } else if (friendship?.status === "ACCEPTED") {
        await handleRemove();
      } else {
        await handleAdd();
      }
    } catch (error) {
      console.error("Friendship action failed:", error);
    }
  };

  return {
    handleFriendshipAction,
    handleAccept,
    handleDeny,
    handleCancel,
    handleAdd,
    handleRemove,
    isLoading,
    isSentByMe,
    isIncoming,
  };
}

export type FriendshipStatus =
  | "NONE"
  | "PENDING"
  | "ACCEPTED"
  | "DENIED"
  | "BLOCKED";

export type FriendshipData = {
  status: FriendshipStatus;
  requesterId?: string;
  addresseeId?: string;
};

export function useFriendshipStatus(userA: string, userB: string) {
  return useQuery<FriendshipData>({
    queryKey: ["friendship-status", userA, userB],

    queryFn: async () => {
      if (!userA || !userB) return { status: "NONE" };
      const res = await getFriendshipStatusAction({ targetUserId: userB });
      if (!res.success) {
        throw new Error(res.error || "Failed to retrieve friendship status.");
      }
      if (!res.data) return { status: "NONE" };
      return {
        status: res.data.status as FriendshipStatus,
        requesterId: res.data.requesterId,
        addresseeId: res.data.addresseeId,
      };
    },

    staleTime: 1000 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useTravelPartners(userId: string) {
  return useQuery({
    queryKey: ["travel-partners", userId],
    queryFn: () => getTravelPartnersAction(undefined),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
