import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import OnboardingClient from "./OnboardingClient";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";

/**
 * Parse a Date to birthday form fields
 */
function parseBirthday(date: Date | null | undefined) {
  if (!date) return undefined;
  const d = new Date(date);
  return {
    day: String(d.getDate()),
    month: String(d.getMonth() + 1),
    year: String(d.getFullYear()),
  };
}

/**
 * Simple fallback to split OAuth name for existing users
 * (new users get firstName/lastName split at auth time in createUser event)
 */
function splitNameFallback(fullName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  // For existing users without profile.firstName, fallback to splitting user.name
  const nameFallback = splitNameFallback(user.name);

  // Map existing user data to form initial values
  const initialValues: Partial<OnboardingIdentityFormValues> = {
    firstName: user.profile?.firstName || nameFallback.firstName,
    lastName: user.profile?.lastName || nameFallback.lastName,
    avatarUrl: user.avatarUrl || "",
  };

  if (user.profile) {
    const profile = user.profile;

    // Gender
    if (profile.gender) {
      initialValues.gender = profile.gender;
    }

    // Birthday
    const birthday = parseBirthday(profile.birthday);
    if (birthday) {
      initialValues.birthday = birthday;
    }

    // Home base location
    if (profile.homeBaseCity) {
      initialValues.location = {
        name: profile.homeBaseCity.name,
        placeId: profile.homeBaseCity.id,
        // Coords are optional and may need runtime validation
        coords: undefined,
      };
    }

    // Persona fields (stored as JSON)
    if (profile.persona && typeof profile.persona === "object") {
      const persona = profile.persona as Record<string, unknown>;
      if (persona.dailyRhythm)
        initialValues.rhythm = String(persona.dailyRhythm);
      if (persona.budget) initialValues.budget = String(persona.budget);
      if (persona.currency) initialValues.currency = String(persona.currency);
      if (persona.travelStyle)
        initialValues.travelStyles = String(persona.travelStyle);
    }
  }

  return <OnboardingClient initialValues={initialValues} />;
}
