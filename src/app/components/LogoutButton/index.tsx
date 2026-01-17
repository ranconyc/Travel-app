"use client";

import { signOut } from "next-auth/react";
import Button from "../common/Button";

export default function LogoutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/signin" })}>Logout</Button>
  );
}
