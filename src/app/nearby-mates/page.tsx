import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllUsers, getNearbyUsers, getUserById } from "@/lib/db/user.repo";
import { redirect } from "next/navigation";
import NearbyMatesClient from "../component/home/HomeLoggedIn/NearbyMatesClient";

export default async function NearbyMatesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/signin");

  const loggedUser = (await getUserById(session.user.id)) as User;
  if (!loggedUser) redirect("/signin");

  const fakeLocationBKK = { lat: 13.7563, lng: 100.5018 };
  const fakeLocation = { lat: -98.08229113501248, lng: 30.2096836607377 };

  const mates = await getAllUsers();
  console.log("mates", mates);

  return <div>{<NearbyMatesClient mates={mates} />}</div>;
}
