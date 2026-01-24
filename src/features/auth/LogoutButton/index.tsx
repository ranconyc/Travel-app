"use client";

import { signOut } from "@/auth";
import Button from "@/components/atoms/Button";

export default function LogoutButton() {
  return <Button onClick={() => signOut()}>Logout</Button>;
}
