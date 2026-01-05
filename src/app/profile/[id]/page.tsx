import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";
import { getUserById } from "@/lib/db/user.repo";
import { ProfileUser } from "./types";

import { HeaderSection } from "./_components/sections/HeaderSection";
import { InfoSection } from "./_components/sections/InfoSection";
import { LanguagesSection } from "./_components/sections/LanguagesSection";
import { TravelPartnersSection } from "./_components/sections/TravelPartnersSection";
import { InterestsSection } from "./_components/sections/InterestsSection";
import { VisitedDestinationsSection } from "./_components/sections/VisitedDestinationsSection";
import { NextDestinationsSection } from "./_components/sections/NextDestinationsSection";
import { DeleteAccountSection } from "./_components/sections/DeleteAccountSection";

type ProfilePageProps = {
  params: {
    id: string;
  };
};

// SSR
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const loggedUser = (await getUserById(
    session?.user?.id as string
  )) as unknown as User;
  const profileUser = (await getUserById(id)) as unknown as ProfileUser;

  // Validate id parameter
  if (!id || id === "undefined" || id === "null") {
    return <div>Invalid user ID</div>;
  }

  if (!profileUser) {
    // you might want a proper 404 here
    return <div>User not found</div>;
  }

  const isYourProfile = loggedUser?.id === profileUser?.id;

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSection
        profileUser={profileUser}
        isYourProfile={isYourProfile}
        loggedUser={loggedUser}
      />
      <div className="p-4 pb-22 space-y-4 ">
        <InfoSection user={profileUser} />
        <LanguagesSection user={profileUser} />
        <TravelPartnersSection user={profileUser} />
        <InterestsSection />
        <VisitedDestinationsSection visitedCities={profileUser.visitedCities} />
        <NextDestinationsSection
          nextDestinations={[]}
          isYourProfile={isYourProfile}
        />
        {isYourProfile && <DeleteAccountSection />}
      </div>
    </div>
  );
}
