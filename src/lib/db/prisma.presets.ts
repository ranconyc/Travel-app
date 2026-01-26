import { Prisma } from "@prisma/client";

/**
 * Minimal user select for list views and basic operations.
 * Only fetches essential fields: id, email, name, avatarUrl, profileCompleted.
 * Use for admin tables, dropdowns, and when only basic identity is needed.
 */
export const userBasicSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  profileCompleted: true,
} satisfies Prisma.UserSelect;

/**
 * Base user select for user cards and list views (e.g., MateCard).
 * Includes minimum fields needed to render a user card/avatar:
 * - Identity (id, name, avatarUrl, role)
 * - Profile basics (firstName, lastName, homeBaseCityId)
 * - Location (currentCityId, visitedCountries)
 * - Media (avatar image)
 * * This is the default for lightweight fetches.
 */
export const baseUserSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  visitedCountries: true, // From refactor
  role: true,             // From refactor
  currentCityId: true,    // From main
  profile: {
    select: {
      firstName: true,
      lastName: true,
      homeBaseCityId: true,
    },
  },
  media: {
    where: { category: "AVATAR" },
    take: 1,
    select: {
      id: true,
      url: true,
      category: true,
    },
  },
} satisfies Prisma.UserSelect;

/**
 * Extended user select with profile bio and additional details.
 * Use when you need more profile information but not full relations.
 */
export const extendedUserSelect = {
  ...baseUserSelect,
  profile: {
    select: {
      // Re-including base profile fields + additional ones
      firstName: true,
      lastName: true,
      homeBaseCityId: true,
      occupation: true,
      description: true,
      gender: true,
      languages: true,
      homeBaseCity: {
        select: {
          name: true,
          country: { select: { name: true } },
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

/**
 * Common include for City to get its country.
 */
export const cityWithCountryInclude = {
  country: true,
} satisfies Prisma.CityInclude;

/**
 * Standard include for everything related to a User.
 * Used in profile views and matching.
 */
export const userFullInclude = {
  profile: {
    include: {
      homeBaseCity: {
        include: cityWithCountryInclude,
      },
    },
  },
  media: true,
  currentCity: {
    include: cityWithCountryInclude,
  },
} satisfies Prisma.UserInclude;

/**
 * Standard include for Chat objects.
 */
export const chatInclude = {
  members: {
    include: {
      user: {
        select: baseUserSelect,
      },
    },
  },
  lastMessage: {
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.ChatInclude;

/**
 * Standard include for Country with its relations.
 */
export const countryFullInclude = {
  cities: {
    orderBy: { name: "asc" },
    include: {
      media: true,
    },
  },
  states: {
    orderBy: { name: "asc" },
  },
  places: true,
  media: true,
} satisfies Prisma.CountryInclude;

/**
 * Standard select for Country summary.
 */
export const countrySummarySelect = {
  id: true,
  cca3: true,
  code: true,
  name: true,
  imageHeroUrl: true,
  region: true,
  subRegion: true,
} satisfies Prisma.CountrySelect;

/**
 * Standard include for Place with city and media.
 */
export const placeFullInclude = {
  media: true,
  city: {
    include: cityWithCountryInclude,
  },
} satisfies Prisma.PlaceInclude;