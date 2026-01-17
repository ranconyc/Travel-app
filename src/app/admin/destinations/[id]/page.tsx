import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import DestinationEditorClient from "./DestinationEditorClient";

type EntityType = "country" | "city" | "place";

async function findEntity(
  id: string,
): Promise<{ type: EntityType; data: any } | null> {
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

  // Try Place
  const place = await prisma.place.findUnique({
    where: { id },
    include: { city: true },
  });
  if (place) return { type: "place", data: place };

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
        id={id}
        initialData={entity.data}
        type={entity.type}
      />
    </div>
  );
}
