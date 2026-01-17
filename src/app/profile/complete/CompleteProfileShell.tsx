import type { User } from "@/domain/user/user.schema";
import CompleteProfileFormClient from "@/app/profile/complete/CompleteProfileFormClient";
import FormHeader from "@/app/profile/complete/sections/FormHeader";

type Props = {
  user: User;
};

export default function CompleteProfileShell({ user }: Props) {
  return (
    <main className="min-h-screen">
      <FormHeader />
      <CompleteProfileFormClient user={user} />
    </main>
  );
}
