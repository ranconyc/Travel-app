type NotificationBadgeProps = {
  count: number;
  max?: number;
};

/**
 * Notification badge component that shows unread count
 */
export function NotificationBadge({ count, max = 99 }: NotificationBadgeProps) {
  if (count === 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
      {displayCount}
    </span>
  );
}
