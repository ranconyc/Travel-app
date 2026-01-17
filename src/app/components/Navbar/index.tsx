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

export default function Navbar() {
  const user = useUser();
  const unreadCount = useUnreadCount();

  return (
    <nav className="fixed bottom-4 left-20 right-20">
      <ul className="flex items-center justify-around bg-surface px-2 py-4 rounded-full shadow-xl">
        <li>
          <Link href="/">
            <Binoculars size={iconsSize} />
          </Link>
        </li>
        <li>
          <Link href="/mates">
            <UserRoundSearch size={iconsSize} />
          </Link>
        </li>
        <li className="relative">
          <Link href="/chats">
            <MessageCircle size={iconsSize} />
            <NotificationBadge count={unreadCount} />
          </Link>
        </li>
        <li>
          <Link href={`/profile/${user?.id}`} className="p-0 flex">
            <Avatar
              className="cursor-pointer"
              image={user?.avatarUrl || ""}
              name={user?.name || ""}
              size={30}
            />
          </Link>
        </li>
        {user?.role === "ADMIN" && (
          <li>
            <Link href="/admin/generator">
              <TowerControl size={iconsSize} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
