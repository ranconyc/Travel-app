import type { User } from "@prisma/client";
import CompleteProfileFormClient from "./CompleteProfileFormClient";
import FormHeader from "./sections/FormHeader";

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
