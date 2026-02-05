import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";
import { UserUpdateValues } from "@/domain/user/userUpdate.schema";
import { findNearestCityFromCoords } from "@/domain/city/city.service";
import { DetectedCity } from "@/domain/city/city.schema";
import * as userRepository from "@/lib/db/user.repo";
import { getAge } from "@/domain/shared/utils/age";

/**
 * Unified upsert for user profile and persona data.
 * Handles identity, demographics, location, and deep-merges persona JSON.
 */
export async function handleUpsertUserProfile(
  userId: string,
  data: UserUpdateValues,
) {
  if (!userId) throw new Error("User ID missing");

  const { persona, ...profileData } = data;

  // 1. Fetch current profile to get existing persona for merging
  const currentProfile = await userRepository.getUserProfile(userId);

  const existingPersona =
    (currentProfile?.persona as Record<string, any>) || {};
  const mergedPersona = persona
    ? { ...existingPersona, ...persona }
    : existingPersona;

  const birthdayDate =
    profileData.birthday && profileData.birthday.length > 0
      ? new Date(profileData.birthday)
      : undefined;

  // 2. Perform Atomic Update
  return await userRepository.updateUserWithProfile(userId, {
    ...(profileData.firstName && { name: profileData.firstName }),
    ...(profileData.avatarUrl && { avatarUrl: profileData.avatarUrl }),
    ...(profileData.profileCompleted !== undefined && {
      profileCompleted: profileData.profileCompleted,
    }),
    profile: {
      upsert: {
        create: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          birthday: birthdayDate,
          gender: profileData.gender,
          occupation: profileData.occupation,
          languages: profileData.languages,
          description: profileData.description,
          homeBaseCityId: profileData.homeBaseCityId,
          socials: profileData.socials,
          persona: mergedPersona,
        },
        update: {
          ...(profileData.firstName && { firstName: profileData.firstName }),
          ...(profileData.lastName && { lastName: profileData.lastName }),
          ...(birthdayDate && { birthday: birthdayDate }),
          ...(profileData.gender && { gender: profileData.gender }),
          ...(profileData.occupation && {
            occupation: profileData.occupation,
          }),
          ...(profileData.languages && { languages: profileData.languages }),
          ...(profileData.description && {
            description: profileData.description,
          }),
          ...(profileData.homeBaseCityId && {
            homeBaseCityId: profileData.homeBaseCityId,
          }),
          ...(profileData.socials && { socials: profileData.socials }),
          persona: mergedPersona,
        },
      },
    },
  });
}

/**
 * Retrieves the current authenticated user with full profile data.
 * Used for reactive client-side state synchronization.
 */
export async function handleGetAuthenticatedUser(userId: string) {
  return await userRepository.getUserById(userId, { strategy: "full" });
}

/**
 * Completes the user profile with the provided data.
 */
export async function completeProfile(
  userId: string,
  data: CompleteProfileFormValues,
): Promise<void> {
  if (!userId) {
    throw new Error("User ID missing");
  }

  const birthdayDate =
    data.birthday && data.birthday.length > 0 ? new Date(data.birthday) : null;

  const genderEnum =
    data.gender === ""
      ? null
      : (data.gender as "MALE" | "FEMALE" | "NON_BINARY");

  try {
    await userRepository.updateFullProfile(userId, {
      profileCompleted: true,
      name: `${data.firstName} ${data.lastName}`.trim(),
      profile: {
        upsert: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName || null,
            birthday: birthdayDate,
            gender: genderEnum,
            occupation: data.occupation || null,
            socials: data.socialLinks || null,
            languages: data.languages,
          },
          update: {
            firstName: data.firstName,
            lastName: data.lastName || null,
            birthday: birthdayDate,
            gender: genderEnum,
            occupation: data.occupation || null,
            socials: data.socialLinks || null,
            languages: data.languages,
          },
        },
      },
    });

    if (data.avatarUrl) {
      await userRepository.updateUserAvatar(userId, data.avatarUrl);
    }
  } catch (error) {
    console.error("completeProfile error:", error);
    throw new Error("Failed to update profile");
  }
}

/**
 * Updates the user's visited countries and ensures corresponding city visits exist.
 */
export async function handleSaveVisitedCountries(
  userId: string,
  countryCodes: string[],
): Promise<void> {
  const { updateVisitedCountries } = await import("@/lib/db/user.repo");
  const { getStructuredWorld } = await import("@/lib/utils/world.utils");
  const { findCityByCapitalName } = await import("@/lib/db/cityLocation.repo");
  const { getActiveVisit, createCityVisit, getUserTravelHistory } =
    await import("@/lib/db/cityVisit.repo");

  // 1. Update the user's flat array
  await updateVisitedCountries(userId, countryCodes);

  // 2. Sync with CityVisits (Manual Entry)
  const { allCountries } = getStructuredWorld();
  const existingVisits = await getUserTravelHistory(userId);

  const visitedCountryCodes = new Set(
    existingVisits.map((v) => v.city.country?.code).filter(Boolean),
  );

  for (const code of countryCodes) {
    if (!visitedCountryCodes.has(code)) {
      const countryData = allCountries.find((c) => c.cca2 === code);
      if (countryData) {
        // Look up capital or first major city (placeholder)
        // Capital is not in the cca2 mock usually, but we'll try to match name
        // For simplicity, we find city by capital name if we can
        // We'll use a placeholder logic: if capital matches a city in our DB, we use it.
        const capitalName = (countryData as any).capital?.[0];
        if (capitalName) {
          const city = await findCityByCapitalName(capitalName, code);
          if (city) {
            await createCityVisit(userId, city.id, undefined, {
              source: "MANUAL",
              isVerified: false,
            });
          }
        }
      }
    }
  }
}

/**
 * Updates the user profile persona with the provided data.
 */
export async function updateUserProfilePersona(
  userId: string,
  newPersonaData: Record<string, unknown>,
): Promise<void> {
  if (!userId) {
    throw new Error("User ID missing");
  }

  try {
    const userProfile = await userRepository.getUserProfile(userId);

    const existingPersona =
      (userProfile?.persona as Record<string, unknown>) || {};
    const mergedPersona = {
      ...existingPersona,
      ...newPersonaData,
    };

    await userRepository.updateUserPersona(userId, mergedPersona);
  } catch (error) {
    console.error("updateUserProfilePersona error:", error);
    throw new Error("Failed to update user persona");
  }
}

/**
 * Saves the user's interests and persona data.
 */
export async function saveUserInterests(
  userId: string,
  data: {
    interests: string[];
    dailyRhythm: string;
    travelStyle: string;
    budget?: string;
    currency?: string;
    firstName?: string;
    hometown?: string;
    avatarUrl?: string;
    insights?: string[];
  },
): Promise<void> {
  const hasBasicInfo = data.firstName || data.avatarUrl;

  if (hasBasicInfo) {
    const updateData: any = {};
    if (data.firstName) updateData.name = data.firstName;
    if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;

    await userRepository.updateFullProfile(userId, {
      ...updateData,
      ...(data.firstName
        ? {
            profile: {
              upsert: {
                create: { firstName: data.firstName },
                update: { firstName: data.firstName },
              },
            },
          }
        : {}),
    });
  }

  return updateUserProfilePersona(userId, {
    interests: data.interests,
    dailyRhythm: data.dailyRhythm,
    travelStyle: data.travelStyle,
    budget: data.budget,
    currency: data.currency,
    hometown: data.hometown,
    insights: data.insights,
  });
}

/**
 * Handles the update of the user's location.
 */
export async function handleUpdateUserLocation(
  userId: string,
  coords: { lat: number; lng: number },
): Promise<{ detected: DetectedCity }> {
  const { lat, lng } = coords;

  const detected = await findNearestCityFromCoords(lat, lng, {
    createIfMissing: true,
    searchRadiusKm: 120,
  });

  console.log("detected", detected);

  if (!detected || !detected.id) {
    throw new Error("Could not identify city");
  }

  const { getActiveVisit, createCityVisit, closeCityVisit } =
    await import("@/lib/db/cityVisit.repo");
  const activeVisit = await getActiveVisit(userId);
  console.log("activeVisit", activeVisit);

  if (!activeVisit) {
    await createCityVisit(
      userId,
      detected.id,
      { lat, lng },
      { source: "AUTO", isVerified: true },
    );

    // Notify User
    const { createNotification } =
      await import("@/domain/notification/notification.service");
    await createNotification({
      userId,
      type: "PASSPORT_STAMPED",
      title: "New Stamp! ✈️",
      message: `You've just been stamped in ${detected.cityName}!`,
      data: { cityId: detected.id },
    });
  } else if (activeVisit.cityId !== detected.id) {
    await closeCityVisit(activeVisit.id, { lat, lng });
    await createCityVisit(
      userId,
      detected.id,
      { lat, lng },
      { source: "AUTO", isVerified: true },
    );

    // Notify User
    const { createNotification } =
      await import("@/domain/notification/notification.service");
    await createNotification({
      userId,
      type: "PASSPORT_STAMPED",
      title: "New Destination! 📍",
      message: `Passport stamped in ${detected.cityName}. Safe travels!`,
      data: { cityId: detected.id },
    });
  }

  // 1. Fetch user to check visitedCountries
  const user = await userRepository.getUserById(userId, { strategy: "full" });

  // 2. Sync Country if missing
  const countryCode = detected.countryCode;
  const visitedCountries = (user as any)?.visitedCountries as
    | string[]
    | undefined;

  if (
    countryCode &&
    visitedCountries &&
    !visitedCountries.includes(countryCode)
  ) {
    await userRepository.updateVisitedCountries(userId, [
      ...visitedCountries,
      countryCode,
    ]);
  }

  await userRepository.updateUserLocation(
    userId,
    {
      type: "Point",
      coordinates: [lng, lat],
    },
    detected.id,
  );

  return { detected: detected as any }; // Cast for schema compatibility
}

/**
 * Generates a bio for the user based on their profile data.
 * Consolidates display-string formatting into a clean business rule.
 */
export async function handleGenerateBio(data: {
  firstName: string;
  occupation: string;
  hometown: string;
  birthday: string;
  languages?: { code: string; name: string }[];
}) {
  const { firstName, occupation, hometown, birthday, languages } = data;
  const age = getAge(birthday);
  const ageText = age ? `${age}-year-old` : "";

  const langs = languages?.map((l) => l.name).slice(0, 3) || [];
  let langsText = "";
  if (langs.length === 1) langsText = langs[0];
  else if (langs.length === 2) langsText = `${langs[0]} and ${langs[1]}`;
  else if (langs.length >= 3)
    langsText = `${langs[0]}, ${langs[1]} and ${langs[2]}`;

  const langsClause = langsText ? ` I speak ${langsText}.` : "";
  const base = `I'm ${firstName}, a ${
    ageText ? `${ageText} ` : ""
  }${occupation} from ${hometown}.`;

  return {
    options: [
      {
        id: "formal",
        label: "Formal",
        text: `${base} I value meaningful connections and enjoy engaging conversations about travel and culture.${langsClause}`,
      },
      {
        id: "chill",
        label: "Chill",
        text: `${base} I’m easygoing, love exploring new spots, and I’m always down for good coffee and better stories.${langsClause}`,
      },
      {
        id: "funny",
        label: "Funny",
        text: `${base} Professional overpacker, part-time snack critic, and full-time ${occupation}. If there’s great food or a hidden alley to explore—I’m in.${langsClause}`,
      },
    ],
  };
}
