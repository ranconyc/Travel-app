"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import Button from "../common/Button";

export default function Nav() {
  return (
    <nav className="mb-8 w-full flex justify-between">
      <Link
        href="/"
        className="text-2xl font-bold text-zinc-900 dark:text-white"
      >
        TravelMate
      </Link>
      <Button
        onClick={() => signOut()}
        className="text-2xl font-bold text-zinc-900 dark:text-white"
      >
        Sign out
      </Button>
    </nav>
  );
}
