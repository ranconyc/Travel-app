import { getSession } from "@/lib/auth/get-current-user";
import { getAllUsers, getUserById } from "@/lib/db/user.repo";
import { redirect } from "next/navigation";
import { calculateMatchScoreBatch } from "@/domain/match/match.queries";
import NearbyMatesClient from "./components/NearbyMatesClient";

export default async function NearbyMatesPage() {
  const session = await getSession();
  const loggedUser = await getUserById(session?.user?.id || "");

  if (!loggedUser) {
    redirect("/signin");
  }

  const userLocation = loggedUser.currentLocation;

  console.log("NearbyMates", userLocation);
  const mates = await getAllUsers();
  const matesWithMatch = await Promise.all(
    mates.map(async (mate) => {
      const match = await calculateMatchScoreBatch(loggedUser, mate, "current");
      return { match, ...mate };
    }),
  );
  // console.log("mates", matesWithMatch);

  return (
    <div>
      {<NearbyMatesClient mates={matesWithMatch} loggedUser={loggedUser} />}
    </div>
  );
}
