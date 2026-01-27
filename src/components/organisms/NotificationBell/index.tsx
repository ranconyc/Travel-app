import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { useClickOutside } from "@/hooks/ui/useClickOutside";
import { Notification } from "@prisma/client";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!userId) return;

    // 1. Fetch initial notifications
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notifications?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

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
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white ring-2 ring-surface">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 max-h-[400px] flex flex-col rounded-2xl border border-surface-secondary bg-surface shadow-2xl animate-in fade-in slide-in-from-top-2">
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
            {loading ? (
              <div className="p-8 text-center text-secondary text-sm">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
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
