"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/molecules/Navbar";

import { Notification } from "@prisma/client";

export default function ConditionalNavbar({
  notifications = [],
}: {
  notifications?: Notification[];
}) {
  const pathname = usePathname();

  // Hide navbar on individual chat pages (/chat/[id])
  const showNavbar =
    pathname !== "/signin" &&
    !pathname?.startsWith("/chats/") &&
    !pathname?.startsWith("/countries/") &&
    !pathname?.startsWith("/cities/") &&
    !pathname?.startsWith("/place/") &&
    pathname !== "/profile/edit" &&
    pathname !== "/profile/reavel" &&
    pathname !== "/profile/travelc" &&
    pathname !== "/profile/travelb" &&
    pathname !== "/profile/persona" &&
    pathname !== "/profile/travel-preferences" &&
    pathname !== "/style" &&
    pathname !== "/profile/onboarding" &&
    !pathname?.startsWith("/admin");

  if (!showNavbar) {
    return null;
  }

  return <Navbar pathname={pathname} notifications={notifications} />;
}
