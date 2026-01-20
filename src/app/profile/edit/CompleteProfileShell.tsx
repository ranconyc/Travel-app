"use client";
import type { User } from "@/domain/user/user.schema";
import CompleteProfileFormClient from "@/app/profile/edit/CompleteProfileFormClient";
import Button from "@/app/components/common/Button";
type Props = {
  user: User;
};

export default function CompleteProfileShell({ user }: Props) {
  return (
    <div className="">
      <header className="sticky top-0 z-10 w-full p-4 pt-8 bg-app-bg flex justify-between border-b border-app-border">
        <Button variant="back" href={`/profile/${user.id}`} />
      </header>
      <main className="p-4 pt-8">
        <CompleteProfileFormClient user={user} />
      </main>
    </div>
  );
}
