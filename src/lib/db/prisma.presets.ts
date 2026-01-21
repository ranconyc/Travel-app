import { Prisma } from "@prisma/client";

/**
 * Standard select for User objects across the app.
 * Provides basic info including identity and profile bio.
 */
export const baseUserSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  role: true,
  profile: {
    select: {
      firstName: true,
      lastName: true,
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
  media: {
    where: { category: "AVATAR" },
    take: 1,
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
