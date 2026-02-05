/**
 * Debug script to test the location update flow.
 * Run with: npx tsx scripts/debug-location-flow.ts
 */

import { findNearestCityFromCoords } from "../src/domain/city/city.service";

async function testLocationFlow() {
  console.log("🧪 Testing Location Update Flow...\n");

  // Test coordinates for Munich, Germany
  const testCases = [
    { name: "Munich, Germany", lat: 48.1351, lng: 11.582 },
    { name: "New York, USA", lat: 40.7128, lng: -74.006 },
    { name: "Tel Aviv, Israel", lat: 32.0853, lng: 34.7818 },
  ];

  for (const testCase of testCases) {
    console.log(`\n📍 Testing: ${testCase.name}`);
    console.log(`   Coordinates: ${testCase.lat}, ${testCase.lng}`);

    try {
      const result = await findNearestCityFromCoords(
        testCase.lat,
        testCase.lng,
        {
          createIfMissing: true,
          searchRadiusKm: 100,
        },
      );

      console.log(`   ✅ Result:`);
      console.log(`      ID: ${result.id}`);
      console.log(`      City: ${result.cityName}`);
      console.log(`      Country: ${result.countryCode}`);
      console.log(`      Source: ${result.source}`);
      console.log(`      Distance: ${result.distanceKm}km`);
      console.log(`      Radius: ${result.radiusKm}km`);

      if (result.source === "json-db-created") {
        console.log(`   🎯 JSON Hydration: SUCCESS`);
      } else if (result.source === "db" || result.source === "db-bbox") {
        console.log(`   💾 Found in DB (already exists)`);
      } else {
        console.log(`   ⚠️ Fallback source: ${result.source}`);
      }
    } catch (error) {
      console.error(`   ❌ Error:`, error);
    }
  }

  console.log("\n🧪 Test complete.");
}

testLocationFlow();
