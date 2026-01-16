import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllUsersQuery, getUserProfile } from "@/domain/user/user.queries";
import { redirect } from "next/navigation";
import NearbyMatesClient from "./_components/NearbyMatesClient";

export default async function NearbyMatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  const loggedUser = await getUserProfile(session.user.id);
  if (!loggedUser) {
    redirect("/signin");
  }

  const userLocation = loggedUser.currentLocation;

  console.log("NearbyMates", userLocation);
  const mates = await getAllUsersQuery();
  console.log("mates", mates);

  return (
    <div>{<NearbyMatesClient mates={mates} loggedUser={loggedUser} />}</div>
  );
}
