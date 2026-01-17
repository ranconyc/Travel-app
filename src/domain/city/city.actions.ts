"use server";

import {
  findOrCreateCity,
  ensureCountryAndCityFromLocation,
  findNearestCityFromCoords,
  getAllCities,
} from "@/lib/db/cityLocation.repo";
import { HomeBaseLocationMeta } from "@/domain/user/completeProfile.schema";
import { ActionResponse } from "@/types/actions";
import { DetectedCity } from "@/types/city";
import { City } from "@/domain/city/city.schema";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/domain/user/user.schema";
export async function getAllCitiesAction(): Promise<ActionResponse<City[]>> {
  try {
    const cities = await getAllCities();
    // Map to ensure relation arrays exist as per City schema
    const data = (cities || []).map((c) => ({
      ...c,
      places: [],
      usersHomeBase: [],
      usersCurrentCity: [],
    })) as unknown as City[];
    return { success: true, data };
  } catch (error) {
    console.error("getAllCitiesAction error:", error);
    return { success: false, error: "Failed to fetch cities" };
  }
}

export async function findOrCreateCityAction(
  cityName: string,
  countryCode: string,
  coords: { lat: number; lng: number },
) {
  const city = await findOrCreateCity(cityName, countryCode, coords);
  return city;
}

export async function ensureCountryAndCityFromLocationAction(
  meta: NonNullable<HomeBaseLocationMeta>,
) {
  const result = await ensureCountryAndCityFromLocation(meta);
  return result;
}

export async function findNearestCityFromCoordsAction(
  lat: number,
  lng: number,
  options?: {
    searchRadiusKm?: number;
    createIfMissing?: boolean;
  },
): Promise<ActionResponse<DetectedCity>> {
  try {
    const result = await findNearestCityFromCoords(lat, lng, options);
    return { success: true, data: result };
  } catch (error) {
    console.error("findNearestCityFromCoordsAction error:", error);
    return { success: false, error: "Failed to find nearest city" };
  }
}

const GenerateCityInput = z.object({
  cityName: z.string().min(2, "City name must be at least 2 characters"),
  countryCode: z.string().optional(),
});

export type GenerateCityResult = {
  cityId: string;
  name: string;
  countryCode: string;
  created: boolean;
};

export async function generateCityAction(
  cityName: string,
  countryCode?: string,
): Promise<ActionResponse<GenerateCityResult>> {
  try {
    // 1. Auth Check
    const session = await getServerSession(authOptions);
    if (!session || (session.user as User).role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Admins only" };
    }

    // 2. Validation
    const validation = GenerateCityInput.safeParse({ cityName, countryCode });
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: {
          cityName:
            validation.error.flatten().fieldErrors.cityName?.[0] ||
            "Invalid city name",
        },
      };
    }

    // 3. Create
    const { createCityFromName } = await import("@/lib/db/cityLocation.repo");
    const city = await createCityFromName(
      validation.data.cityName,
      validation.data.countryCode,
    );

    return {
      success: true,
      data: {
        cityId: city.cityId,
        name: city.name,
        countryCode: city.countryCode,
        created: true, // createCityFromName always returns a city, we assume strict "created" flag logic isn't fully exposed yet or we can assume successful fetch = created/found
      },
    };
  } catch (error: any) {
    console.error("generateCityAction error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate city",
    };
  }
}

export async function updateCityAction(
  id: string,
  data: any,
): Promise<ActionResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as User).role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Validate with Zod
    const { CityUpdateSchema } = await import("@/domain/city/city.schema");
    const validation = CityUpdateSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error: `Validation failed: ${validation.error.issues.map((e: any) => e.message).join(", ")}`,
      };
    }

    const { updateCity } = await import("@/lib/db/cityLocation.repo");
    const updated = await updateCity(id, validation.data);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("updateCityAction error:", error);
    return { success: false, error: error.message || "Failed to update city" };
  }
}

export async function deleteCityAction(
  id: string,
): Promise<ActionResponse<void>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as User).role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const { deleteCity } = await import("@/lib/db/cityLocation.repo");
    await deleteCity(id);
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error("deleteCityAction error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete city",
    };
  }
}
