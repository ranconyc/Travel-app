"use server";

import { z } from "zod";
import { createPublicAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db/prisma";

export const searchCitiesAction = createPublicAction(
  z.object({
    query: z.string().min(1),
    limit: z.number().default(5),
  }),
  async ({ query, limit }) => {
    // Basic insensitive search
    const cities = await prisma.city.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: limit,
      select: {
        id: true,
        cityId: true,
        name: true,
        country: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });

    // Map to option format
    return cities.map((c) => ({
      id: c.cityId,
      label: `${c.name}, ${c.country?.name || c.country?.code || "Unknown"}`,
      subtitle: c.country?.name,
    }));
  },
);
