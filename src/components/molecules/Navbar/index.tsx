"use client";

import Link from "next/link";
import {
  UserRoundSearch,
  Binoculars,
  MessageCircle,
  TowerControl,
} from "lucide-react";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { NotificationBadge } from "@/components/molecules/Navbar/NotificationBadge";
import { Avatar } from "@/components/molecules/Avatar";
import { useUser } from "@/app/providers/UserProvider";
import NotificationBell from "@/components/organisms/NotificationBell";

const iconsSize = 32;

export default function Navbar({ pathname }: { pathname: string }) {
  const user = useUser();
  const unreadCount = useUnreadCount();

  return (
    <nav className="fixed bottom-xs left-12 right-12 z-50">
      <ul className="p-md bg-surface/80 backdrop-blur-sm text-secondary flex items-center justify-around rounded-full shadow-xl">
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
        <li>
          <NotificationBell userId={user?.id || ""} />
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
