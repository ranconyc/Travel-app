import { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
import { getCitiesWithCountry } from "@/lib/db/cityLocation.repo";
import { prisma } from "@/lib/db/prisma";
import { filterAndSortPlaces } from "@/domain/discovery/services/enhanced-matching.service";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import CityDetailView from "@/features/city/components/CityDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = (await getCitiesWithCountry(slug)) as any;

  if (!city) {
    return {
      title: "City Not Found",
    };
  }

  const countryName = city.country?.name || "Unknown Country";

  return {
    title: `${city.name}, ${countryName} Travel Guide`,
    description: `Everything you need to know about visiting ${city.name}. Top places, best time to visit, and local insights.`,
    openGraph: {
      title: `${city.name} Travel Guide`,
      description: `Plan your trip to ${city.name}, ${countryName}.`,
      images: [city.imageHeroUrl].filter(Boolean),
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/signin");
  }

  const { slug } = await params;
  const city = (await getCitiesWithCountry(slug)) as any;

  if (!city) {
    return <div>City not found</div>;
  }

  // Fetch places in this city with matching service
  let topPlaces: any[] = [];
  if (currentUser) {
    try {
      // Get all places in this city
      const allPlaces = await prisma.place.findMany({
        where: {
          cityRefId: city.id,
          isPermanentlyClosed: false,
        },
        take: 20, // Limit to top 20 for performance
      });

      // Filter and sort based on user preferences
      const persona = (currentUser.profile?.persona || {}) as any;
      const userPersona = {
        interests: persona.interests || [],
        budget: persona.budget || "moderate",
        travelStyle: persona.travelStyle || [],
      };

      const topPlacesResult = filterAndSortPlaces(
        allPlaces as any,
        userPersona,
        { limit: 8 }, // Show top 8
      );
      topPlaces = topPlacesResult;
    } catch (error) {
      console.error("Error fetching top places:", error);
    }
  }

  return (
    <CityDetailView
      city={city}
      currentUser={currentUser}
      topPlaces={topPlaces}
    />
  );
}
