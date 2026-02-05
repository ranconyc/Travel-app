import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testRaw() {
  const lng = -74.006;
  const lat = 40.7128;
  const meters = 1000 * 1000;

  console.log(`Searching near [${lng}, ${lat}] with max distance ${meters}m`);

  const res = await prisma.city.aggregateRaw({
    pipeline: [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "dist_m",
          spherical: true,
          maxDistance: meters,
        },
      },
      { $limit: 10 },
    ],
  });

  console.log("Raw Result Type:", typeof res);
  console.log("Is Array:", Array.isArray(res));
  console.log("Raw Result:", JSON.stringify(res, null, 2));

  await prisma.$disconnect();
}

testRaw();
