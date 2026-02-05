import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export async function getAllStates({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  const skip = (page - 1) * limit;

  const where: Prisma.StateWhereInput = search
    ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.state.findMany({
      where,
      skip,
      take: limit,
      include: {
        country: {
          select: {
            name: true,
            cca3: true,
          },
        },
        _count: {
          select: {
            cities: true,
          },
        },
      },
      orderBy: {
        cities: {
          _count: "desc",
        },
      },
    }),
    prisma.state.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Finds a state using name or code within a country.
 */
export async function findState(
  countryRefId: string,
  name?: string,
  code?: string,
) {
  return prisma.state.findFirst({
    where: {
      countryRefId,
      OR: [
        { code: { equals: code || undefined, mode: "insensitive" } },
        { name: { equals: name || undefined, mode: "insensitive" } },
      ],
    },
  });
}

/**
 * Creates a new state record.
 */
export async function createState(data: {
  name: string;
  code: string | null;
  countryRefId: string;
  type?: string | null;
}) {
  return prisma.state.create({ data });
}
