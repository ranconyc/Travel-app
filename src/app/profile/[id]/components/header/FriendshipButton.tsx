import Button from "@/app/components/common/Button";
import { useFriendshipAction } from "@/domain/friendship/friendship.hooks";
import {
  Loader2,
  ShieldUser,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";
import { memo, useCallback } from "react";
import {
  useFriendship,
  useLoggedUser,
  useProfileActions,
  useProfileUser,
} from "../../store/useProfileStore";
import { useRouter } from "next/navigation";

function FriendshipButton() {
  const profileUser = useProfileUser();
  const loggedUser = useLoggedUser();
  const friendship = useFriendship();
  const router = useRouter();
  const { setProfileModalOpen } = useProfileActions();

  const {
    handleFriendshipAction,
    handleAccept,
    handleDeny,
    isLoading,
    isIncoming,
  } = useFriendshipAction({
    profileUserId: profileUser?.id ?? "",
    loggedUserId: loggedUser?.id,
    friendship,
  });

  const onAction = useCallback(async () => {
    await handleFriendshipAction();
    router.refresh();
  }, [handleFriendshipAction, router]);

  const onAccept = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      await handleAccept();
      router.refresh();
    },
    [handleAccept, router],
  );

  const onDeny = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      await handleDeny();
      router.refresh();
    },
    [handleDeny, router],
  );

  const onAcceptedClick = useCallback(() => {
    setProfileModalOpen(true);
  }, [setProfileModalOpen]);

  if (!profileUser) return null;

  // Loading state
  if (isLoading) {
    return (
      <Button
        size="sm"
        variant="icon"
        disabled
        icon={<Loader2 className="w-5 h-5 animate-spin" />}
        aria-label="Processing friendship request"
      />
    );
  }

  // Incoming request - show accept/deny buttons
  if (isIncoming) {
    return (
      <div
        className="flex items-center gap-2"
        role="group"
        aria-label="Friend request actions"
      >
        <Button
          size="sm"
          variant="icon"
          onClick={onDeny}
          icon={<UserRoundX size={20} className="text-red-500" />}
          aria-label="Deny friend request"
        />
        <Button
          size="sm"
          variant="icon"
          onClick={onAccept}
          icon={<UserRoundCheck size={20} className="text-green-500" />}
          aria-label="Accept friend request"
        />
      </div>
    );
  }

  // Render appropriate icon based on friendship status
  const getFriendshipIcon = () => {
    switch (friendship?.status) {
      case "ACCEPTED":
        return <ShieldUser size={20} />;
      case "DENIED":
        return <span className="text-xs text-secondary">Denied</span>;
      case "PENDING":
        return <UserRoundX size={20} className="text-yellow-500" />;
      default:
        return <UserRoundPlus size={20} />;
    }
  };

  const getAriaLabel = () => {
    switch (friendship?.status) {
      case "ACCEPTED":
        return "View friendship options";
      case "DENIED":
        return "Friend request denied";
      case "PENDING":
        return "Cancel friend request";
      default:
        return "Send friend request";
    }
  };

  return (
    <Button
      size="sm"
      variant="icon"
      onClick={friendship?.status === "ACCEPTED" ? onAcceptedClick : onAction}
      disabled={isLoading}
      icon={getFriendshipIcon()}
      aria-label={getAriaLabel()}
    />
  );
}

export default memo(FriendshipButton);
