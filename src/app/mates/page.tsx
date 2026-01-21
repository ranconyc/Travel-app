import { getSession } from "@/lib/auth/get-current-user";
import { getAllUsersQuery, getUserProfile } from "@/domain/user/user.queries";
import { redirect } from "next/navigation";
import NearbyMatesClient from "@/app/mates/_components/NearbyMatesClient";
import { calculateMatchScoreBatch } from "@/domain/match/match.queries";

export default async function NearbyMatesPage() {
  const session = await getSession();
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
