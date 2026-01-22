"use client";

import Link from "next/link";
import {
  UserRoundSearch,
  Binoculars,
  MessageCircle,
  Settings,
  TowerControl,
} from "lucide-react";
import { useUnreadCount } from "@/lib/socket/useWebSocket";
import { NotificationBadge } from "@/app/components/Navbar/NotificationBadge";
import { Avatar } from "@/app/components/common/Avatar";
import { useUser } from "@/app/providers/UserProvider";

const iconsSize = 24;

export default function Navbar({ pathname }: { pathname: string }) {
  const user = useUser();
  const unreadCount = useUnreadCount();

  return (
    <nav className="fixed bottom-4 left-20 right-20">
      <ul className="text-secondary flex items-center justify-around bg-surface px-2 py-4 rounded-full shadow-xl">
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
            <NotificationBadge count={unreadCount} />
          </Link>
        </li>
        <li
          className={
            pathname === `/profile/${user?.id}`
              ? "border-2 border-brand rounded-full"
              : ""
          }
        >
          <Link href={`/profile/${user?.id}`} className="p-0 flex">
            <Avatar
              className="cursor-pointer"
              image={user?.avatarUrl || ""}
              name={user?.name || ""}
              size={iconsSize}
            />
          </Link>
        </li>
        {user?.role === "ADMIN" && (
          <li className={pathname === "/admin" ? "text-brand" : ""}>
            <Link href="/admin">
              <TowerControl size={iconsSize} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
