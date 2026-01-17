import { getCurrentUser } from "@/lib/auth/get-current-user";
import TravelFormClient from "@/app/travel/TravelFormClient";
import { redirect } from "next/navigation";

export default async function TravelPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin?callbackUrl=/travel");
  }

  return <TravelFormClient initialUser={JSON.parse(JSON.stringify(user))} />;
}
