"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/molecules/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on individual chat pages (/chat/[id])
  const showNavbar =
    pathname !== "/signin" &&
    !pathname?.startsWith("/chats/") &&
    pathname !== "/profile/edit" &&
    pathname !== "/profile/reavel" &&
    pathname !== "/profile/travelc" &&
    pathname !== "/profile/travelb" &&
    pathname !== "/profile/persona" &&
    pathname !== "/profile/travel-persona" &&
    pathname !== "/profile/travel-preferences" &&
    pathname !== "/style" &&
    !pathname?.startsWith("/admin");

  if (!showNavbar) {
    return null;
  }

  return <Navbar pathname={pathname} />;
}
