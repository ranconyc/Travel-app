"use client";

import Link from "next/link";
import {
  UserRoundSearch,
  Binoculars,
  MessageCircle,
  TowerControl,
} from "lucide-react";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import Badge from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { useUser } from "@/app/providers/UserProvider";
import NotificationBell from "@/components/molecules/NotificationBell";

import { Notification } from "@prisma/client";

const iconsSize = 32;

export default function Navbar({
  pathname,
  notifications = [],
}: {
  pathname: string;
  notifications?: Notification[];
}) {
  const user = useUser();
  const unreadCount = useUnreadCount();

  return (
    <nav className="fixed bottom-xs left-12 right-12 z-sticky">
      <ul className="p-md bg-surface/80 backdrop-blur-sm text-secondary flex items-center justify-around rounded-full shadow-lg">
        <li className={pathname === "/" ? "text-brand" : ""}>
          <Link href="/">
            <Binoculars size={iconsSize} />
          </Link>
        </li>
        <li className={pathname === "/mates" ? "text-brand" : ""}>
          <Link href="/mates">
            <UserRoundSearch size={iconsSize} />
          </Link>
        </li>
        <li className={pathname === "/chats" ? "text-brand" : ""}>
          <Link href="/chats">
            <MessageCircle size={iconsSize} />
            <Badge
              variant="danger"
              className="absolute top-1 right-1 px-1 py-0 min-w-[20px] h-5 flex items-center justify-center text-[10px] leading-none ring-2 ring-surface rounded-full"
            >
              {unreadCount}
            </Badge>
          </Link>
        </li>
        <li>
          <NotificationBell
            userId={user?.id || ""}
            initialNotifications={notifications}
          />
        </li>
        <li
          className={
            pathname === `/profile/${user?.id}`
              ? "border-2 border-brand rounded-full"
              : "border-2 border-secondary rounded-full"
          }
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
