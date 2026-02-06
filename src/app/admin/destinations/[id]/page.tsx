import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import DestinationEditorClient from "./DestinationEditorClient";

type EntityType = "country" | "city" | "place" | "state";

async function findEntity(
  id: string,
): Promise<{ type: EntityType; data: any } | null> {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (isObjectId) {
    // Try Country
    const country = await prisma.country.findUnique({
      where: { id },
      include: { cities: true },
    });
    if (country) return { type: "country", data: country };

    // Try City
    const city = await prisma.city.findUnique({
      where: { id },
      include: { country: true },
    });
    if (city) return { type: "city", data: city };

    // Try State
    const state = await prisma.state.findUnique({
      where: { id },
      include: { country: true, cities: { take: 10 } },
    });
    if (state) return { type: "state", data: state };

    // Try Place
    const place = await prisma.place.findUnique({
      where: { id },
      include: { city: true },
    });
    if (place) return { type: "place", data: place };
  } else {
    // Try finding by Slug or other unique fields for non-ObjectIds
    // Country: cca3
    const country = await prisma.country.findUnique({
      where: { cca3: id.toUpperCase() }, // cca3 is usually uppercase
      include: { cities: true },
    });
    if (country) return { type: "country", data: country };

    // City: cityId or slug
    const city = await prisma.city.findFirst({
      where: {
        OR: [{ cityId: id }, { slug: id }],
      },
      include: { country: true },
    });
    if (city) return { type: "city", data: city };

    // State: slug
    const state = await prisma.state.findUnique({
      where: { slug: id },
      include: { country: true, cities: { take: 10 } },
    });
    if (state) return { type: "state", data: state };

    // Place: slug
    const place = await prisma.place.findUnique({
      where: { slug: id },
      include: { city: true },
    });
    if (place) return { type: "place", data: place };
  }

  return null;
}

export default async function DestinationItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entity = await findEntity(id);

  if (!entity) {
    return notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <DestinationEditorClient
        id={entity.data.id} // Pass the real DB ID, not the params.id (which might be a slug)
        initialData={entity.data}
        type={entity.type}
      />
    </div>
  );
}
