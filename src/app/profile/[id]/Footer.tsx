"use client";
import Button from "@/components/atoms/Button";
import { User } from "@/domain/user/user.schema";
import { signOut } from "next-auth/react";

export function Footer({ profileUser }: { profileUser: User }) {
  return (
    <footer className="p-md pt-12 grayscale opacity-50">
      <p className="text-center text-xs font-medium tracking-widest uppercase">
        Member since{" "}
        {new Date(profileUser.createdAt).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        })}
      </p>
      <Button onClick={() => signOut()}>Logout</Button>
    </footer>
  );
}
