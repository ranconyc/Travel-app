import { getUserProfile } from "@/domain/user/user.queries";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import Image from "next/image";

import { ProfileHeader } from "@/app/profile/[id]/ProfileHeader";
import {
  getFriendRequestsAction,
  getFriendshipStatusAction,
} from "@/domain/friendship/friendship.actions";
import world from "@/data/world.json";
import { City } from "@prisma/client";

const Badge = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-2 py-1 bg-surface border border-brand font-bold  text-brand rounded-full absolute -bottom-3 left-1/2 -translate-x-1/2">
      {children}
    </div>
  );
};

const Avatar = ({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) => {
  return (
    <div className="w-32 h-32 relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover rounded-3xl"
      />
      <Badge>Visitor</Badge>
    </div>
  );
};

const InterestsSection = ({ interests }: { interests: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((interest) => {
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
  );
};

const TravelSection = ({
  visitedCountries,
  currentCity,
}: {
  visitedCountries: string[];
  currentCity: City | null;
}) => {
  const countries = visitedCountries.splice(0, 5);
  return (
    <div className="mb-4">
      <h1 className="text-lg font-bold">Travel</h1>
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-bold text-secondary uppercase">
          Current City
        </h2>
        <p className="">{currentCity?.name ?? "unknoun"}</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-bold text-secondary uppercase">
            Visited Countries
          </h2>
          {countries.map((country) => {
            return (
              <p
                className="text-xs text-secondary px-2 py-1 border border-brand rounded-full"
                key={country}
              >
                {country}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params; // id of the profile user
  const session = await getServerSession(authOptions);
  const requests = await getFriendRequestsAction(id);
  const loggedUser = session?.user; //  logged user data

  const profileUser = await getUserProfile(id); // profile user data
  const friendship = loggedUser?.id
    ? await getFriendshipStatusAction(loggedUser.id, id)
    : null;

  // if user not found return not found page

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
  const persona = profileUser?.profile?.persona as {
    interests?: string[];
  } | null;

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
            <Avatar
              src={
                profileUser.media?.find((img) => img.category === "AVATAR")
                  ?.url ||
                profileUser.avatarUrl ||
                "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
              }
              alt={profileUser.name || "User"}
              width={128}
              height={128}
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                {profileUser.profile?.firstName
                  ? `${profileUser.profile.firstName} ${
                      profileUser.profile.lastName || ""
                    }`.trim()
                  : profileUser.name}
              </h1>
              {profileUser.currentCity && (
                <p className="text-xs">
                  {profileUser.currentCity?.name},
                  {profileUser.currentCity?.country?.name ===
                  "United States of America"
                    ? "USA"
                    : profileUser.currentCity?.country?.name}
                </p>
              )}
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

        <InterestsSection interests={persona?.interests || []} />
        <TravelSection
          visitedCountries={profileUser.visitedCountries || []}
          currentCity={profileUser.currentCity}
        />

        <p className="text-xs mt-4">
          Member since {new Date(profileUser.createdAt).toLocaleDateString()}
        </p>
      </main>
    </div>
  );
}
