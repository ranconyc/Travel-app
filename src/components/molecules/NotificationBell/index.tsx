import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { useClickOutside } from "@/hooks/ui/useClickOutside";
import { Notification } from "@prisma/client";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell({
  userId,
  initialNotifications = [],
}: {
  userId: string;
  initialNotifications?: Notification[];
}) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!userId) return;

    // 2. Subscribe to real-time events
    const channel = pusherClient.subscribe(`user-${userId}`);
    channel.bind("notification:new", (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId]);

  // Ensure ref is compatible with HTMLElement required by the hook
  useClickOutside(containerRef as any, () => setOpen(false));

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-surface-secondary transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <div className="absolute top-1 right-1 pointer-events-none">
            <Badge
              variant="danger"
              className="px-0.5 py-0 min-w-4 h-4 flex items-center justify-center text-[10px] leading-none ring-2 ring-surface rounded-full"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-dropdown w-80 max-h-96 flex flex-col rounded-2xl border border-surface-secondary bg-surface shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between p-4 border-b border-surface-secondary">
            <Typography variant="h4" className="font-bold">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="text-brand h-auto py-1 px-2 border-0"
              >
                <CheckCheck size={14} className="mr-1" /> Mark all read
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center gap-2">
                <Bell size={32} className="text-secondary opacity-20" />
                <Typography variant="p" className="text-secondary font-medium">
                  No notifications yet
                </Typography>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-surface-secondary last:border-0 hover:bg-surface-secondary transition-colors cursor-pointer ${
                    !n.isRead ? "bg-brand/5 border-l-2 border-l-brand" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <Typography
                      variant="p"
                      className="font-bold block leading-tight text-sm"
                    >
                      {n.title}
                    </Typography>
                    <span className="text-[10px] text-secondary shrink-0">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <Typography
                    variant="micro"
                    className="text-secondary mt-0.5 line-clamp-2"
                  >
                    {n.message}
                  </Typography>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-surface-secondary text-center">
            <Typography
              variant="micro"
              className="text-secondary font-medium opacity-60"
            >
              STAY NOTIFIED
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}
