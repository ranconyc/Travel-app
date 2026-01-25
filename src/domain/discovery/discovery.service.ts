import { Gender, User } from "@/domain/user/user.schema";
import { getAge } from "@/domain/shared/utils/age";

export interface MateFilters {
  gender: Gender | "NON_BINARY";
  ageRange: { min: number; max: number };
  distance: { min: number; max: number };
  interests: string[];
  sort: "distance" | "age" | "name";
  search: string;
}

export class DiscoveryService {
  /**
   * Efficiently filters a list of mates based on multiple criteria.
   * Optimized for large lists by minimizing object lookups and pre-calculating values.
   */
  public filterMates(mates: User[], filters: MateFilters): User[] {
    const { gender, ageRange, interests } = filters;
    const hasInterestsFilter = interests.length > 0;

    return mates.filter((mate) => {
      // 1. Gender Filter (Fast check)
      if (gender !== "NON_BINARY" && mate.profile?.gender !== gender) {
        return false;
      }

      // 2. Age Filter
      const birthday = mate.profile?.birthday;
      if (birthday) {
        const age = getAge(birthday);
        if (age && (age < ageRange.min || age > ageRange.max)) {
          return false;
        }
      }

      // 3. Interests Filter (O(N*M) check, optimized with early return)
      if (hasInterestsFilter) {
        const persona = (mate.profile?.persona || {}) as Record<
          string,
          unknown
        >;
        const mateInterests = (persona.interests || []) as string[];

        const hasMatch = interests.some((interest) =>
          mateInterests.includes(interest),
        );
        if (!hasMatch) return false;
      }

      // 4. Search Filter (Case-insensitive)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const fullName =
          `${mate.profile?.firstName || ""} ${mate.profile?.lastName || ""}`.toLowerCase();
        const userName = (mate.name || "").toLowerCase();

        if (!fullName.includes(searchTerm) && !userName.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Provides default filter state for initialization.
   */
  public getDefaultFilters(): MateFilters {
    return {
      gender: "NON_BINARY",
      ageRange: { min: 18, max: 100 },
      distance: { min: 0, max: 100 },
      interests: [],
      sort: "distance",
      search: "",
    };
  }
}

export const discoveryService = new DiscoveryService();
