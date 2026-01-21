import { getSession } from "@/lib/auth/get-current-user";
import Image from "next/image";
import { ProfileHeader } from "@/app/profile/[id]/ProfileHeader";
import {
  getFriendRequestsAction,
  getFriendshipStatusAction,
} from "@/domain/friendship/friendship.actions";
import { getCountriesByCodes } from "@/lib/db/country.repo";
import TravelSection from "./TravelSection";
import world from "@/data/world.json";
import LogoutButton from "@/app/components/LogoutButton";
import INTERESTS from "@/data/interests.json";
import StatsSection from "./StatsSection";

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
  return (
    <div>
      <div className="w-full mb-3 flex items-center justify-between">
        <h1 className="text-lg font-bold ">{interests?.length} Interests</h1>
        <h1 className="text-xs font-bold "> See all</h1>
      </div>
      <div className="flex flex-wrap gap-1">
        {interests.splice(0, 5).map((interest) => (
          <p
            key={interest}
            className="w-fit text-xs text-secondary px-2 py-1 border border-brand rounded-2xl"
          >
            {getInterestLabel(interest)}
          </p>
        ))}
      </div>
    </div>
  );
};

import { getUserProfile } from "@/domain/user/user.queries";
import { calculateMatchScoreBatch } from "@/domain/match/match.queries";
import { MatchScoreCard } from "@/app/components/MatchScoreCard";

export default async function Profile({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const requestsResult = await getFriendRequestsAction(id);
  const requests = requestsResult.success ? requestsResult.data : [];
  const loggedUser = session?.user;

  const profileUser = await getUserProfile(id);
  const loggedUserProfile = session?.user?.id
    ? await getUserProfile(session.user.id)
    : null;

  let friendship = null;
  if (loggedUser?.id) {
    const friendshipResult = await getFriendshipStatusAction({
      targetUserId: id,
    });
    friendship = friendshipResult.success ? friendshipResult.data : null;
  }

  if (!profileUser) {
    return <div>User not found</div>;
  }

  // Calculate Match Score
  const isMyProfile = loggedUser?.id === profileUser?.id;
  let matchData = null;
  const { mode: rawMode } = (await searchParams) || {};
  const matchMode = (rawMode === "travel" ? "travel" : "current") as
    | "current"
    | "travel";

  if (loggedUserProfile && !isMyProfile) {
    try {
      matchData = await calculateMatchScoreBatch(
        loggedUserProfile,
        profileUser,
        matchMode,
      );
    } catch (e) {
      console.error("Match calculation failed", e);
    }
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

  interface WorldCountry {
    name: { common: string };
    region: string;
  }

  function getContinentStats(visitedCountries: string[]) {
    const visitedContinents = new Set<string>();

    visitedCountries.forEach((countryName) => {
      const country = (world as unknown as WorldCountry[]).find(
        (c) => c.name.common === countryName,
      );
      if (country?.region) {
        visitedContinents.add(country.region);
      }
    });

    return {
      count: visitedContinents.size,
      continents: Array.from(visitedContinents),
    };
  }
  const continentStats = getContinentStats(visitedCountryNames);

  const persona = profileUser?.profile?.persona as {
    interests?: string[];
  } | null;

  return (
    <div>
      <ProfileHeader
        isYourProfile={isMyProfile}
        loggedUser={loggedUser}
        friendship={friendship}
        profileUser={profileUser}
      />

      <main className="p-4 flex flex-col gap-8">
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
        {isMyProfile && <LogoutButton />}
        {/* MATCH SCORE CARD with TOGGLE */}
        {!isMyProfile && matchData && (
          <div className="my-6 flex flex-col gap-4">
            <MatchScoreCard
              matchData={matchData}
              targetUserName={
                profileUser.profile?.firstName || profileUser.name || "User"
              }
            />
          </div>
        )}

        <StatsSection
          requests={requests}
          continentStats={continentStats}
          visitedCountries={profileUser.visitedCountries}
        />

        <InterestsSection interests={persona?.interests || []} />
        <TravelSection
          userId={profileUser.id}
          visitedCountries={visitedCountriesData}
          currentCity={profileUser.currentCity}
          isOwnProfile={isMyProfile}
        />

        <p className="text-xs mt-4">
          Member since {new Date(profileUser.createdAt).toLocaleDateString()}
        </p>
      </main>
    </div>
  );
}
