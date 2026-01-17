"use server";

import { createCountryFromName } from "@/lib/db/country.repo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { User } from "@/domain/user/user.schema";

const GenerateInput = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

import { ActionResponse } from "@/types/actions";

export type GenerateCountryResult = {
  countryId: string;
  name: string;
  created: boolean;
};

export async function generateCountryAction(
  name: string
): Promise<ActionResponse<GenerateCountryResult>> {
  try {
    // 1. Auth Check
    const session = await getServerSession(authOptions);
    if (!session || (session.user as User).role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Admins only" };
    }

    // 2. Input Validation
    const validation = GenerateInput.safeParse({ name });
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: {
          name:
            validation.error.flatten().fieldErrors.name?.[0] || "Invalid input",
        },
      };
    }

    // 3. Execution using Repo
    const { country, created } = await createCountryFromName(
      validation.data.name
    );

    return {
      success: true,
      data: {
        countryId: country.countryId,
        name: country.name,
        created,
      },
    };
  } catch (error: any) {
    console.error("Generate country error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate country details",
    };
  }
}

export async function getAllCountriesAction(): Promise<ActionResponse<any[]>> {
  try {
    const { getAllCountries } = await import("@/lib/db/country.repo");
    const countries = await getAllCountries();
    return { success: true, data: countries };
  } catch (error: any) {
    console.error("getAllCountriesAction error:", error);
    return { success: false, error: "Failed to fetch countries" };
  }
}
