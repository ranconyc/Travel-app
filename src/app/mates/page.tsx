import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllUsers, getUserById } from "@/lib/db/user.repo";
import { redirect } from "next/navigation";
import NearbyMatesClient from "./_components/NearbyMatesClient";

export default async function NearbyMatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  const loggedUser = await getUserById(session.user.id);
  if (!loggedUser) {
    redirect("/signin");
  }

  const userLocation = loggedUser.currentLocation;

  console.log("NearbyMates", userLocation);
  const mates = await getAllUsers();
  console.log("mates", mates);

  return (
    <div>{<NearbyMatesClient mates={mates} loggedUser={loggedUser} />}</div>
  );
}
