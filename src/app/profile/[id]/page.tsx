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
import LogoutButton from "@/app/components/LogoutButton";
import INTERESTS from "@/data/interests.json";
import Link from "next/link";
import { CurrentCitySection } from "./CurrentCitySection";
import TravelHistoryStamps from "./TravelHistoryStamps";

// Define types locally for simple access
type InterestItem = { id: string; label: string };
type Category = { id: string; label: string; items: InterestItem[] };
type InterestsData = Record<string, Category>;

const interestsData = INTERESTS as unknown as InterestsData;

const getInterestLabel = (interestId: string) => {
  for (const catKey in interestsData) {
    const category = interestsData[catKey];
    const foundItem = category.items?.find((item) => item.id === interestId);
    if (foundItem) {
      return foundItem.label;
    }
  }
  return interestId;
};

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
  console.log(interests, "dd");
  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((interest) => {
        return (
          <p
            className="text-xs text-secondary px-2 py-1 border border-brand rounded-full"
            key={interest}
          >
            {getInterestLabel(interest)}
          </p>
        );
      })}
    </div>
  );
};

import { getCountriesByCodes } from "@/lib/db/country.repo";
import { Country } from "@prisma/client";

// ... existing imports ...

// Update VisitedCountriesSection to accept Country objects
const VisitedCountriesSection = ({ countries }: { countries: Country[] }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <h2 className="text-xs font-bold text-secondary uppercase">
          Visited Countries
        </h2>
        <p className="text-xs text-secondary">{countries.length} countries</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {countries.map((country) => {
          return (
            <Link
              key={country.countryId}
              href={`/countries/${country.countryId}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] w-32 shadow-sm hover:shadow-md transition-all bg-surface border border-surface-secondary block"
            >
              {country.imageHeroUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={country.imageHeroUrl}
                  alt={country.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-surface-secondary flex items-center justify-center text-secondary font-bold text-xl">
                  {country.code}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2">
                <span className="text-white font-bold text-sm truncate w-full group-hover:text-brand transition-colors">
                  {country.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// Update TravelSection props
const TravelSection = ({
  visitedCountries,
  currentCity,
  userId,
}: {
  visitedCountries: Country[];
  currentCity: City | null;
  userId: string;
}) => {
  return (
    <div className="mb-4">
      <h1 className="text-lg font-bold">Travel</h1>
      <div className="flex flex-col gap-4">
        <CurrentCitySection currentCity={currentCity} />
        <TravelHistoryStamps userId={userId} />
        <VisitedCountriesSection countries={visitedCountries} />
      </div>
    </div>
  );
};

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const requests = await getFriendRequestsAction(id);
  const loggedUser = session?.user;

  const profileUser = await getUserProfile(id);
  const friendship = loggedUser?.id
    ? await getFriendshipStatusAction(loggedUser.id, id)
    : null;

  if (!profileUser) {
    return <div>User not found</div>;
  }

  // Fetch full country objects for visited country codes
  const visitedCountriesCodes = profileUser.visitedCountries || [];
  const visitedCountriesData = await getCountriesByCodes(visitedCountriesCodes);

  // For stats, we still use codes or names?
  // getContinentStats expects strings. If codes are passed, it should match codes in world.json?
  // world.json only implies names.
  // If we save Codes, getContinentStats logic (which uses world.json NAMES) will BREAK.
  // I should fix getContinentStats to map Codes -> Names.

  // Re-use existing getContinentStats but map inputs first.
  // To fetch names, I can reuse visitedCountriesData which has names!
  const visitedCountryNames = visitedCountriesData.map((c) => c.name);

  const continentStats = getContinentStats(visitedCountryNames, world);

  const isYourProfile = loggedUser?.id === profileUser?.id;

  type GeoData = Record<string, Record<string, string[]>>;

  function getContinentStats(visitedCountries: string[], data: GeoData) {
    const visitedContinents = new Set<string>();

    visitedCountries.forEach((country) => {
      // Look through each continent in the JSON
      for (const [continentName, regions] of Object.entries(data)) {
        // Check if any region in this continent contains the country
        const found = Object.values(regions).some((countryList) =>
          countryList.includes(country),
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
          visitedCountries={visitedCountriesData}
          currentCity={profileUser.currentCity}
          userId={profileUser.id}
        />

        <p className="text-xs mt-4">
          Member since {new Date(profileUser.createdAt).toLocaleDateString()}
        </p>
        {isYourProfile && <LogoutButton />}
      </main>
    </div>
  );
}
