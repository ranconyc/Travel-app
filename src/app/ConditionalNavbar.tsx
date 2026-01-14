"use client";

import { usePathname } from "next/navigation";
import Navbar from "./component/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on individual chat pages (/chat/[id])
  const showNavbar =
    pathname !== "/signin" &&
    pathname !== "/chat/" &&
    pathname !== "/profile/complete" &&
    pathname !== "/profile/travel-persona" &&
    pathname !== "/profile/travel-preferences" &&
    pathname !== "/style" &&
    pathname !== "/interests" &&
    !pathname?.startsWith("/travel") &&
    !pathname?.startsWith("/admin");

  if (!showNavbar) {
    return null;
  }

  return <Navbar />;
}
