"use client";
import type { User } from "@/domain/user/user.schema";
import CompleteProfileFormClient from "@/app/profile/complete/CompleteProfileFormClient";
import Button from "@/app/components/common/Button";
type Props = {
  user: User;
};

export default function CompleteProfileShell({ user }: Props) {
  return (
    <main className="p-4 pt-8">
      <Button variant="back" />
      <CompleteProfileFormClient user={user} />
    </main>
  );
}
