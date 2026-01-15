import { getUserById } from "@/lib/db/user.repo";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import Image from "next/image";

import { ProfileHeader } from "./ProfileHeader";
import {
  getFriendRequestsAction,
  getFriendshipStatusAction,
} from "@/domain/friendship/friendship.actions";
import world from "../../../data/world.json";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const requests = await getFriendRequestsAction(id);
  const loggedUser = session?.user;

  // Fetch the profile user's data
  const profileUser = await getUserById(id);
  const friendship = loggedUser?.id
    ? await getFriendshipStatusAction(loggedUser.id, id)
    : null;
  if (!profileUser) {
    return <div>User not found</div>;
  }

  const continentStats = getContinentStats(profileUser.visitedCountries, world);

  const isYourProfile = loggedUser?.id === profileUser?.id;

  type GeoData = Record<string, Record<string, string[]>>;

  function getContinentStats(visitedCountries: string[], data: GeoData) {
    const visitedContinents = new Set<string>();

    visitedCountries.forEach((country) => {
      // Look through each continent in the JSON
      for (const [continentName, regions] of Object.entries(data)) {
        // Check if any region in this continent contains the country
        const found = Object.values(regions).some((countryList) =>
          countryList.includes(country)
        );

        if (found) {
          visitedContinents.add(continentName);
          break; // Move to the next country in the user's list
        }
      }
    });

    return {
      count: visitedContinents.size,
      continents: Array.from(visitedContinents),
    };
  }

  // Type assertion for persona to access interests safely
  const persona = profileUser.profile?.persona as any;

  return (
    <div>
      <ProfileHeader
        isYourProfile={isYourProfile}
        loggedUser={loggedUser}
        friendship={friendship}
        profileUserId={profileUser.id}
      />
      <main className="p-4 flex flex-col gap-8">
        <div>
          <div className="pt-4 flex flex-col gap-6 items-center">
            <div className="w-32 h-32 relative">
              <Image
                src={
                  profileUser.media?.find(
                    (img: any) => img.category === "AVATAR"
                  )?.url ||
                  profileUser.avatarUrl ||
                  "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                }
                alt={profileUser.name || "User"}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="px-2 py-1 bg-surface border border-brand font-bold  text-brand rounded-full absolute -bottom-3 left-1/2 -translate-x-1/2">
                Visitor
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                {profileUser.profile?.firstName
                  ? `${profileUser.profile.firstName} ${
                      profileUser.profile.lastName || ""
                    }`.trim()
                  : profileUser.name}
              </h1>
              <p className="text-xs">
                {profileUser.currentCity?.name},
                {profileUser.currentCity?.country?.name ===
                "United States of America"
                  ? "USA"
                  : profileUser.currentCity?.country?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-bold">{requests?.length || 0}</h1>
              <h2 className="text-xs font-bold text-secondary uppercase">
                {requests?.length > 1 ? "Friends" : "Friend"}
              </h2>
            </div>
            <div>
              <h1 className="text-lg font-bold">{continentStats.count}</h1>
              <h2 className="text-xs font-bold text-secondary uppercase">
                {continentStats.count > 1 ? "Continents" : "Continent"}
              </h2>
            </div>
            <div>
              <h1 className="text-lg font-bold">
                {profileUser.visitedCountries?.length || 0}
              </h1>
              <h2 className="text-xs font-bold text-secondary uppercase">
                countries
              </h2>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold my-2">Interests</h1>
          <div className="flex flex-wrap gap-2">
            {persona?.interests?.map((interest: string) => {
              return (
                <p
                  className="text-xs text-secondary px-2 py-1 border border-brand rounded-full"
                  key={interest}
                >
                  {interest}
                </p>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold my-2">Countries Visited</h1>
          <div className="flex flex-wrap gap-2">
            {profileUser.visitedCountries.map((country: string) => {
              return (
                <div
                  className="bg-white border border-secondary p-2 "
                  key={country}
                >
                  <h2 className="text-xs font-bold text-secondary uppercase">
                    {country}
                  </h2>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xs mt-4">
          Member since {new Date(profileUser.createdAt).toLocaleDateString()}
        </p>
      </main>
    </div>
  );
}
