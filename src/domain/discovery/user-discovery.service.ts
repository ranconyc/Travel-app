import { prisma } from "@/lib/db/prisma";
import { UserBase } from "@/lib/db/user.repo";
import { baseUserSelect } from "@/lib/db/prisma.presets";
import { Prisma } from "@prisma/client";

export type DiscoveryFilters = {
  minAge?: number;
  maxAge?: number;
  maxDistance?: number; // in km
  currentUserLocation?: [number, number]; // [lng, lat]
};

export type DiscoveryResult = {
  users: UserBase[];
  total: number;
};

export class UserDiscoveryService {
  /**
   * Main entry point: Fetches paginated users using the appropriate strategy.
   */
  static async getUsersPaginated(
    page: number,
    limit: number,
    currentUserId: string,
    filters: DiscoveryFilters = {},
  ): Promise<DiscoveryResult> {
    const { maxDistance, currentUserLocation } = filters;

    // Strategy Selection:
    // If geospatial filter is required, use Hybrid/Mongo Aggregation.
    // Otherwise use Standard Prisma.
    if (maxDistance && currentUserLocation) {
      return this.fetchHybrid(page, limit, currentUserId, filters);
    }

    return this.fetchStandard(page, limit, currentUserId, filters);
  }

  /**
   * Strategy A: Standard Prisma (Efficient for simple filtering)
   */
  private static async fetchStandard(
    page: number,
    limit: number,
    currentUserId: string,
    filters: DiscoveryFilters,
  ): Promise<DiscoveryResult> {
    const { minAge = 18, maxAge = 100 } = filters;
    const skip = (page - 1) * limit;

    const now = new Date();
    const minBirthDate = new Date(
      now.getFullYear() - maxAge - 1,
      now.getMonth(),
      now.getDate(),
    );
    const maxBirthDate = new Date(
      now.getFullYear() - minAge,
      now.getMonth(),
      now.getDate(),
    );

    const where: Prisma.UserWhereInput = {
      id: { not: currentUserId },
      profile: {
        birthday: {
          gte: minBirthDate,
          lte: maxBirthDate,
        },
      },
    };

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      select: baseUserSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return { users, total };
  }

  /**
   * Strategy B: Hybrid MongoDB Aggregation (Required for Geospatial + joined filtering)
   */
  private static async fetchHybrid(
    page: number,
    limit: number,
    currentUserId: string,
    filters: DiscoveryFilters,
  ): Promise<DiscoveryResult> {
    const {
      minAge = 18,
      maxAge = 100,
      maxDistance,
      currentUserLocation,
    } = filters;
    const skip = (page - 1) * limit;

    // Safety check
    if (!maxDistance || !currentUserLocation) {
      throw new Error("Missing location data for Hybrid fetch");
    }

    const now = new Date();
    const minBirthDate = new Date(
      now.getFullYear() - maxAge - 1,
      now.getMonth(),
      now.getDate(),
    );
    const maxBirthDate = new Date(
      now.getFullYear() - minAge,
      now.getMonth(),
      now.getDate(),
    );

    const meters = maxDistance * 1000;
    const [longitude, latitude] = currentUserLocation;

    const pipeline: any[] = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "dist_m",
          spherical: true,
          maxDistance: meters,
        },
      },
      {
        $match: {
          $expr: { $ne: ["$_id", { $toObjectId: currentUserId }] },
        },
      },
      {
        $lookup: {
          from: "UserProfile",
          localField: "_id",
          foreignField: "userId",
          as: "profile",
        },
      },
      { $unwind: "$profile" },
      {
        $match: {
          "profile.birthday": {
            $gte: minBirthDate,
            $lte: maxBirthDate,
          },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }, { $project: { _id: 1 } }],
        },
      },
    ];

    const rawResult = await prisma.user.aggregateRaw({
      pipeline,
    });

    const result = (rawResult as any)?.[0];
    const total = result?.metadata?.[0]?.total ?? 0;
    const userIds = result?.data?.map((u: any) => u._id?.$oid) ?? [];

    if (userIds.length === 0) {
      return { users: [], total: 0 };
    }

    // Hydration: Fetch actual User objects for the found IDs
    // Note: We need to preserve the order from the aggregation (distance order)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: baseUserSelect,
    });

    const sortedUsers = userIds
      .map((id: string) => users.find((u) => u.id === id))
      .filter(Boolean) as UserBase[];

    return { users: sortedUsers, total };
  }
}
