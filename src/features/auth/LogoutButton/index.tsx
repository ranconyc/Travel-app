"use client";

import { signOut } from "next-auth/react";
import Button from "@/components/atoms/Button";

export default function LogoutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/signin" })}>Logout</Button>
  );
}
