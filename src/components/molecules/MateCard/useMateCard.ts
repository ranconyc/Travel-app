import { User, UserPersona } from "@/domain/user/user.schema";

export type MateCardProps = {
  mate: User & { match?: { score: number } };
  loggedUser?: User; // Optional now? Used for match score show/hide
};

export function useMateCard({ mate, loggedUser }: MateCardProps) {
  const { id: userId, avatarUrl, match } = mate;

  // Logic Extraction: Image Logic
  const mainImage =
    mate.media?.find(
      (img: { category: string; url: string }) => img.category === "AVATAR",
    )?.url || avatarUrl;

  // Logic Extraction: Residency Logic
  const isResident =
    !!mate.currentCityId &&
    !!mate.profile?.homeBaseCityId &&
    mate.currentCityId === mate.profile.homeBaseCityId;

  // Logic Extraction: Name Logic
  const name =
    (mate?.name &&
      mate.profile?.firstName &&
      mate.profile?.lastName &&
      `${mate.profile.firstName} ${mate.profile.lastName}`) ||
    mate.profile?.firstName ||
    mate.name ||
    "Unknown Mate";

  // Logic Extraction: Interests Logic
  const persona = mate.profile?.persona as UserPersona | null;
  const interests = persona?.interests?.slice(0, 3) || [];

  // Logic Extraction: Match Score Visibility
  const showMatchScore = loggedUser?.id !== userId;
  const matchScore = match?.score || 0;

  return {
    userId,
    mainImage,
    isResident,
    name,
    interests,
    showMatchScore,
    matchScore,
  };
}
