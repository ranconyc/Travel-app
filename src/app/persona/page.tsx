import { getCurrentUser } from "@/lib/auth/get-current-user";
import PersonaFormClient from "@/app/persona/PersonaFormClient";
import { redirect } from "next/navigation";
import { User } from "@/domain/user/user.schema";

export default async function MultiStepFormPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin?callbackUrl=/interests");
  }

  return <PersonaFormClient initialUser={user as unknown as User} />;
}
