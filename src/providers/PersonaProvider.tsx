"use client";

import { createContext, useContext, ReactNode } from "react";

/**
 * Profile completion state tracking
 * Provides granular information about what parts of the profile are complete
 */
export type ProfileCompletionState = {
  // Flags
  hasPersona: boolean;
  hasTravelHistory: boolean;
  hasHomeBase: boolean;
  hasBirthday: boolean;
  hasProfilePicture: boolean;
  hasName: boolean;

  // Computed
  completionPercentage: number;
  missingFields: string[];
  isFullyComplete: boolean;
};

const PersonaContext = createContext<ProfileCompletionState | null>(null);

/**
 * Calculate profile completion state from user data
 */
function calculateCompletionState(user: any): ProfileCompletionState {
  const hasPersona = !!(
    user?.profile?.persona && Object.keys(user.profile.persona).length > 0
  );
  const hasTravelHistory = !!(
    user?.visitedCountries && user.visitedCountries.length > 0
  );
  const hasHomeBase = !!user?.profile?.homeBaseCityId;
  const hasBirthday = !!user?.profile?.birthday;
  const hasProfilePicture = !!user?.avatarUrl;
  const hasName = !!(user?.profile?.firstName && user?.profile?.lastName);

  const flags = [
    hasPersona,
    hasTravelHistory,
    hasHomeBase,
    hasBirthday,
    hasProfilePicture,
    hasName,
  ];

  const completedCount = flags.filter(Boolean).length;
  const completionPercentage = Math.round(
    (completedCount / flags.length) * 100,
  );

  const missingFields: string[] = [];
  if (!hasPersona) missingFields.push("Travel Persona");
  if (!hasTravelHistory) missingFields.push("Travel History");
  if (!hasHomeBase) missingFields.push("Home Base");
  if (!hasBirthday) missingFields.push("Birthday");
  if (!hasProfilePicture) missingFields.push("Profile Picture");
  if (!hasName) missingFields.push("Name");

  return {
    hasPersona,
    hasTravelHistory,
    hasHomeBase,
    hasBirthday,
    hasProfilePicture,
    hasName,
    completionPercentage,
    missingFields,
    isFullyComplete: completionPercentage === 100,
  };
}

interface PersonaProviderProps {
  user: any;
  children: ReactNode;
}

/**
 * PersonaProvider - Global profile completion state
 *
 * Provides profile completion information throughout the app.
 * Use this to:
 * - Show completion percentage
 * - Blur/lock features until profile is complete
 * - Display "Complete Profile" CTAs
 * - Track what sections are missing
 *
 * @example
 * ```tsx
 * const { hasPersona, completionPercentage } = usePersonaCompletion();
 *
 * {!hasPersona && (
 *   <div className="blur-sm pointer-events-none">
 *     <MatesSection />
 *   </div>
 * )}
 * ```
 */
export function PersonaProvider({ user, children }: PersonaProviderProps) {
  const state = calculateCompletionState(user);
  return (
    <PersonaContext.Provider value={state}>{children}</PersonaContext.Provider>
  );
}

/**
 * Hook to access profile completion state
 * Must be used within PersonaProvider
 */
export function usePersonaCompletion() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error("usePersonaCompletion must be used within PersonaProvider");
  }
  return context;
}
