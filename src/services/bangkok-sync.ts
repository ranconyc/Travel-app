import { GooglePlacesService } from "@/domain/discovery/googlePlaces.service";
import { prisma } from "@/lib/db/prisma";

const BANGKOK_CITY_ID = "bangkok-th";
const INTERESTS_TO_SYNC = ["rooftop_bars", "street_food_markets", "coworking_spaces"];

/**
 * Execute Bangkok Sync - Task A
 * Sync places for Bangkok with the specified interest categories
 */
export async function executeBangkokSync() {
  console.log("🚀 Starting Bangkok Sync for interests:", INTERESTS_TO_SYNC);
  
  const results = {
    totalSynced: 0,
    placesByInterest: {} as Record<string, number>,
    firstPlaces: [] as any[],
    errors: [] as string[]
  };

  try {
    // Verify Bangkok exists in database
    const bangkok = await prisma.city.findUnique({
      where: { cityId: BANGKOK_CITY_ID },
      include: { country: true }
    });

    if (!bangkok) {
      throw new Error(`Bangkok not found with cityId: ${BANGKOK_CITY_ID}`);
    }

    console.log(`📍 Found Bangkok: ${bangkok.name}, ${bangkok.country?.name}`);
    console.log(`📍 Coordinates:`, bangkok.coords);

    // Sync each interest category
    for (const interestId of INTERESTS_TO_SYNC) {
      try {
        console.log(`\n🔄 Syncing interest: ${interestId}`);
        
        const syncResult = await GooglePlacesService.fetchAndSyncPlaces(
          BANGKOK_CITY_ID, 
          interestId
        );

        results.placesByInterest[interestId] = syncResult.count;
        results.totalSynced += syncResult.count;
        
        console.log(`✅ ${interestId}: ${syncResult.count} places synced`);

        // Get first few places for this interest to show in report
        if (syncResult.synced.length > 0) {
          const places = await prisma.place.findMany({
            where: {
              googlePlaceId: { in: syncResult.synced.slice(0, 2) },
              tags: { has: interestId }
            },
            take: 2,
            select: {
              id: true,
              name: true,
              tags: true,
              priceLevel: true,
              rating: true,
              address: true,
              googlePlaceId: true,
              autoCreated: true,
              needsReview: true,
              createdAt: true
            }
          });
          
          results.firstPlaces.push(...places);
        }

      } catch (error) {
        const errorMsg = `Failed to sync ${interestId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        results.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    console.log(`\n🎉 Bangkok Sync Complete!`);
    console.log(`📊 Total places synced: ${results.totalSynced}`);
    console.log(`📊 Breakdown:`, results.placesByInterest);

    return results;

  } catch (error) {
    const errorMsg = `Bangkok sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    results.errors.push(errorMsg);
    console.error(`❌ ${errorMsg}`);
    throw error;
  }
}

/**
 * Get first 5 places added to Bangkok for reporting
 */
export async function getFirstFiveBangkokPlaces() {
  return await prisma.place.findMany({
    where: {
      cityRefId: {
        in: await prisma.city.findMany({
          where: { cityId: BANGKOK_CITY_ID },
          select: { id: true }
        }).then(cities => cities.map(c => c.id))
      },
      tags: { hasSome: INTERESTS_TO_SYNC }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      slug: true,
      name: true,
      cityRefId: true,
      countryRefId: true,
      type: true,
      categories: true,
      address: true,
      coords: true,
      tags: true,
      priceLevel: true,
      rating: true,
      reviewCount: true,
      amenities: true,
      vibe: true,
      accessibility: true,
      safetyNotes: true,
      imageHeroUrl: true,
      media: true,
      summary: true,
      highlights: true,
      isPermanentlyClosed: true,
      autoCreated: true,
      needsReview: true,
      googleData: true,
      googlePlaceId: true,
      vibeScores: true,
      createdAt: true,
      updatedAt: true
    }
  });
}
