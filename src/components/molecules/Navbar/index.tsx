"use client";

import Link from "next/link";
import {
  UserRoundSearch,
  Binoculars,
  MessageCircle,
  TowerControl,
} from "lucide-react";
import { useUnreadCount } from "@/domain/chat/hooks/useUnreadCount";
import Badge from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { useUser } from "@/app/providers/UserProvider";
import { Notification } from "@prisma/client";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconsSize = 32;

const navItemVariants = cva(
  "flex items-center justify-center transition-colors duration-200",
  {
    variants: {
      active: {
        true: "text-brand",
        false: "text-secondary hover:text-brand/70",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export default function Navbar({
  pathname,
  notifications = [],
}: {
  pathname: string;
  notifications?: Notification[];
}) {
  const user = useUser();
  const unreadCount = useUnreadCount();

  // Combine unread chats + unread notifications
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const totalUnread = unreadCount + unreadNotifications;

  return (
    <nav className="fixed bottom-xxl left-xxl right-xxl z-sticky">
      <ul className="p-md bg-surface/80 backdrop-blur-sm text-secondary flex items-center justify-around rounded-full shadow-lg">
        {/* Discovery */}
        <li className={navItemVariants({ active: pathname === "/" })}>
          <Link href="/">
            <Binoculars size={iconsSize} />
          </Link>
        </li>

        {/* Mates */}
        <li className={navItemVariants({ active: pathname === "/mates" })}>
          <Link href="/mates">
            <UserRoundSearch size={iconsSize} />
          </Link>
        </li>

        {/* Chats / Notifications */}
        <li
          className={cn(
            "relative",
            navItemVariants({ active: pathname === "/chats" }),
          )}
        >
          <Link href="/chats">
            <MessageCircle size={iconsSize} />
            {totalUnread > 0 && (
              <Badge className="absolute -top-1 -right-1 px-1 py-0 min-w-[20px] h-5 flex items-center justify-center text-[10px] leading-none border-2 border-surface bg-error text-white rounded-full">
                {totalUnread > 99 ? "99+" : totalUnread}
              </Badge>
            )}
          </Link>
        </li>

        {/* Profile */}
        <li
          className={cn(
            "rounded-full border-2 transition-colors",
            pathname === `/profile/${user?.id}`
              ? "border-brand"
              : "border-secondary hover:border-brand/50",
          )}
        >
          <Link href={`/profile/${user?.id}`} className="p-0 flex">
            <Avatar
              className="cursor-pointer"
              image={user?.avatarUrl || ""}
              alt={user?.name || ""}
              size={iconsSize}
            />
          </Link>
        </li>

        {/* Admin */}
        {user?.role === "ADMIN" && (
          <li>
            <Link href="/admin/dashboard">
              <TowerControl size={iconsSize} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
