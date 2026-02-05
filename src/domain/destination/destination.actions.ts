"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

interface Attribution {
  photographer: string;
  photographerUrl: string;
  source: "unsplash" | "pexels";
  originalUrl: string;
}

/**
 * Update hero image for a country
 */
export async function updateCountryHeroImage(
  countryId: string,
  imageUrl: string,
  attribution?: Attribution,
) {
  try {
    await prisma.country.update({
      where: { id: countryId },
      data: {
        imageHeroUrl: imageUrl,
      },
    });

    revalidatePath(`/countries`);
    revalidatePath(`/admin/destinations`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update country hero image:", error);
    return { success: false, error: "Failed to update image" };
  }
}

/**
 * Update hero image for a city
 */
export async function updateCityHeroImage(
  cityId: string,
  imageUrl: string,
  attribution?: Attribution,
) {
  try {
    await prisma.city.update({
      where: { id: cityId },
      data: {
        imageHeroUrl: imageUrl,
      },
    });

    revalidatePath(`/cities`);
    revalidatePath(`/admin/destinations`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update city hero image:", error);
    return { success: false, error: "Failed to update image" };
  }
}

/**
 * Update hero image for a state
 */
export async function updateStateHeroImage(
  stateId: string,
  imageUrl: string,
  attribution?: Attribution,
) {
  try {
    // Note: State model needs imageHeroUrl field added
    await prisma.state.update({
      where: { id: stateId },
      data: {
        imageHeroUrl: imageUrl,
      },
    });

    revalidatePath(`/state`);
    revalidatePath(`/admin/destinations`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update state hero image:", error);
    return { success: false, error: "Failed to update image" };
  }
}

/**
 * Get all countries for admin list
 */
export async function getCountriesForAdmin() {
  return prisma.country.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      cca3: true,
      imageHeroUrl: true,
      region: true,
      population: true,
    },
    orderBy: { name: "asc" },
  });
}

/**
 * Get all cities for admin list
 */
export async function getCitiesForAdmin() {
  return prisma.city.findMany({
    select: {
      id: true,
      name: true,
      cityId: true,
      slug: true,
      imageHeroUrl: true,
      country: {
        select: { name: true, code: true },
      },
    },
    orderBy: { name: "asc" },
    take: 100, // Limit for performance
  });
}

/**
 * Get all states for admin list
 */
export async function getStatesForAdmin() {
  return prisma.state.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      slug: true,
      type: true,
      country: {
        select: { name: true, code: true },
      },
    },
    orderBy: { name: "asc" },
    take: 100, // Limit for performance
  });
}

/**
 * Get single destination by type and ID
 */
export async function getDestinationById(
  type: "country" | "city" | "state",
  id: string,
) {
  switch (type) {
    case "country":
      return prisma.country.findUnique({
        where: { id },
        include: {
          states: { take: 10 },
          cities: { take: 10 },
        },
      });
    case "city":
      return prisma.city.findUnique({
        where: { id },
        include: {
          country: true,
          state: true,
        },
      });
    case "state":
      return prisma.state.findUnique({
        where: { id },
        include: {
          country: true,
          cities: { take: 10 },
        },
      });
  }
}
