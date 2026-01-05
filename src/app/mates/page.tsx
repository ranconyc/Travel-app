import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllUsers, getNearbyUsers, getUserById } from "@/lib/db/user.repo";
import { redirect } from "next/navigation";
import NearbyMatesClient from "../component/home/HomeLoggedIn/NearbyMatesClient";

export default async function NearbyMatesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/signin");

  const loggedUser = (await getUserById(session.user.id)) as User;
  if (!loggedUser) redirect("/signin");

  const userLocation = loggedUser.currentLocation;

  console.log("NearbyMates", userLocation);
  const mates = await getAllUsers();
  console.log("mates", mates);

  return <div>{<NearbyMatesClient mates={mates} />}</div>;
}
