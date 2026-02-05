import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to populate state slugs...");

  const states = await prisma.state.findMany({
    where: {
      OR: [{ slug: { equals: "" } }, { slug: { equals: "undefined" } }],
    },
    include: {
      country: true,
    },
  });

  // Also find states that might be missing the slug field entirely (MongoDB behavior)
  const allStates = await prisma.state.findMany({
    include: { country: true },
  });

  const statesToUpdate = allStates.filter(
    (s) => !s.slug || s.slug === "undefined",
  );

  console.log(
    `Found ${statesToUpdate.length} states that need slug population.`,
  );

  for (const state of statesToUpdate) {
    const countryCode = state.country?.code?.toLowerCase() || "unknown";
    const baseSlug = state.name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slug = `${baseSlug}-${countryCode}`;

    console.log(`Updating state: ${state.name} -> ${slug}`);

    try {
      await prisma.state.update({
        where: { id: state.id },
        data: { slug },
      });
    } catch (error) {
      console.error(`Failed to update state ${state.name}:`, error);
    }
  }

  console.log("Finished populating state slugs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
