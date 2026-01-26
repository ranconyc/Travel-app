import {
  type User,
  type UserProfile,
  type UserPersona,
  type UserSocials,
} from "@/domain/user/user.schema";
import { type GeoPoint } from "@/domain/common.schema";

/**
 * --- TYPE EXTENSIONS ---
 */

/** User with a definite location */
export type UserWithLocation = User & {
  currentLocation: GeoPoint;
};

/** User with a full profile */
export type UserWithFullProfile = User & {
  profile: UserProfile & {
    persona: UserPersona;
    socials: UserSocials;
  };
};

/** User with both location and a full profile */
export type UserWithLocationAndFullProfile = UserWithLocation &
  UserWithFullProfile;

/**
 * --- TYPE GUARDS ---
 */

/**
 * Checks if a user has a valid location.
 * @param user The user to check.
 * @returns True if the user has a location, false otherwise.
 */
export const hasLocation = (user: User): user is UserWithLocation => {
  return (
    user.currentLocation !== null &&
    typeof user.currentLocation === "object" &&
    "lat" in user.currentLocation &&
    "lng" in user.currentLocation
  );
};

/**
 * Checks if a user has a full profile.
 * @param user The user to check.
 * @returns True if the user has a full profile, false otherwise.
 */
export const hasFullProfile = (user: User): user is UserWithFullProfile => {
  return (
    !!user.profile &&
    user.profile.persona !== null &&
    user.profile.socials !== null
  );
};

/**
 * Checks if a user has both a valid location and a full profile.
 * @param user The user to check.
 * @returns True if the user has both a location and a full profile, false otherwise.
 */
export const hasLocationAndFullProfile = (
  user: User
): user is UserWithLocationAndFullProfile => {
  return hasLocation(user) && hasFullProfile(user);
};
