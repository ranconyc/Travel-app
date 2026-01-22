import { MatchResult } from "@/domain/match/match.schema";
import SimilarLanguages from "./SimilarLanguages";
import SimilarPlaces from "./SimilarPlaces";
import AgeGap from "./AgeGap";
import SimilarInterests from "./SimilarInterests";
import LocationSimilarity from "./LocationSimilarity";

export default function MatchBreakdown({
  matchResult,
}: {
  matchResult: MatchResult;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SimilarInterests interests={matchResult?.breakdown.interests.shared} />
      <SimilarLanguages languages={matchResult?.breakdown.languages.shared} />
      <SimilarPlaces places={matchResult?.breakdown.places.shared} />
      <LocationSimilarity
        sameCity={matchResult?.breakdown.location.sameCity}
        sameCountry={matchResult?.breakdown.location.sameCountry}
      />
      <AgeGap ageGap={matchResult?.breakdown.age.diffYears} />
    </div>
  );
}
