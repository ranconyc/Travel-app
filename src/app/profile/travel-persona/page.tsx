import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import { User } from "@/domain/user/user.schema";
import TravelPersonaClient from "@/app/profile/travel-persona/TravelPersonaClient";

export default async function TravelPersonaPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin?callbackUrl=/profile/travel-persona");
  }

  return <TravelPersonaClient initialUser={user as unknown as User} />;
}
