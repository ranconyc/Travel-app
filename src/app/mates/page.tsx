import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllUsers, getUserById } from "@/lib/db/user.repo";
import NearbyMatesClient from "../component/home/HomeLoggedIn/NearbyMatesClient";
import { MOCK_USER } from "@/lib/auth/mock-user";

export default async function NearbyMatesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user || MOCK_USER;

  const loggedUser = (await getUserById(user.id)) || MOCK_USER;
  // if (!loggedUser) redirect("/signin");

  const userLocation = loggedUser.currentLocation;

  console.log("NearbyMates", userLocation);
  const mates = await getAllUsers();
  console.log("mates", mates);

  return <div>{<NearbyMatesClient mates={mates} />}</div>;
}
