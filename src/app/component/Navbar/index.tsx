"use client";

import Link from "next/link";
import { UserRoundSearch, Binoculars, MessageCircle } from "lucide-react";
import { useUnreadCount } from "@/lib/socket/useWebSocket";
import { NotificationBadge } from "./NotificationBadge";

const iconsSize = 24;

export default function Navbar() {
  const unreadCount = useUnreadCount();
  console.log("unread Count", unreadCount);

  return (
    <nav className="fixed bottom-4 left-20 right-20">
      <ul className="flex items-center justify-around bg-surface px-2 py-4 rounded-full shadow-xl">
        <li>
          <Link href="/">
            <Binoculars size={iconsSize} />
          </Link>
        </li>
        <li>
          <Link href="/nearby-mates">
            <UserRoundSearch size={iconsSize} />
          </Link>
        </li>
        <li className="relative">
          <Link href="/chats">
            <MessageCircle size={iconsSize} />
            <NotificationBadge count={unreadCount} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
