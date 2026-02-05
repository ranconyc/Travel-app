import {
  getNearbyCitiesAction,
  getAllCitiesAction,
} from "../domain/city/city.actions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testActions() {
  console.log("--- Testing getAllCitiesAction ---");
  const allResult = await getAllCitiesAction({ limit: 5 });
  console.log("All Cities Result Success:", allResult.success);
  if (allResult.success) {
    console.log("Count:", allResult.data?.length);
    console.log("First City:", JSON.stringify(allResult.data?.[0], null, 2));
  } else {
    console.error("Error:", allResult.error);
  }

  console.log("\n--- Testing getNearbyCitiesAction (NYC) ---");
  // NYC coords
  const nearbyResult = await getNearbyCitiesAction({
    lat: 40.7128,
    lng: -74.006,
    km: 1000,
    limit: 5,
  });
  console.log("Nearby Cities Result Success:", nearbyResult.success);
  if (nearbyResult.success) {
    console.log("Count:", nearbyResult.data?.length);
    if (nearbyResult.data && nearbyResult.data.length > 0) {
      console.log(
        "First Nearby City:",
        JSON.stringify(nearbyResult.data[0], null, 2),
      );
    }
  } else {
    console.error("Error:", nearbyResult.error);
  }

  await prisma.$disconnect();
}

testActions();
