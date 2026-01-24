"use client";
import type { User } from "@/domain/user/user.schema";
import CompleteProfileFormClient from "@/app/profile/edit/CompleteProfileFormClient";
import Button from "@/components/atoms/Button";
type Props = {
  user: User;
};

export default function CompleteProfileShell({ user }: Props) {
  return (
    <div className="">
      <header className="sticky top-0 z-10 w-full p-md pt-8 bg-main flex justify-between border-b border-app-border">
        <Button variant="back" href={`/profile/${user.id}`} />
      </header>
      <main className="p-md pt-8">
        <CompleteProfileFormClient user={user} />
      </main>
    </div>
  );
}
