import { PrismaClient } from "@prisma/client";
import { findNearbyCities, getAllCities } from "../lib/db/cityLocation.repo";

const prisma = new PrismaClient();

async function testRepo() {
  console.log("--- Testing getAllCities ---");
  try {
    const allCities = await getAllCities(5);
    console.log("Count:", allCities.length);
    if (allCities.length > 0) {
      console.log("First City:", JSON.stringify(allCities[0], null, 2));
    }
  } catch (err) {
    console.error("Error in getAllCities:", err);
  }

  console.log("\n--- Testing findNearbyCities (NYC) ---");
  try {
    // NYC coords: lng: -74.006, lat: 40.7128
    const nearbyCities = await findNearbyCities(-74.006, 40.7128, 1000, 5);
    console.log("Count:", nearbyCities.length);
    if (nearbyCities.length > 0) {
      console.log(
        "First Nearby City:",
        JSON.stringify(nearbyCities[0], null, 2),
      );
    }
  } catch (err) {
    console.error("Error in findNearbyCities:", err);
  }

  await prisma.$disconnect();
}

testRepo();
