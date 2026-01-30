import {
  sortItems,
  getInterestLabel,
} from "@/domain/interests/interests.service";

import InterestTag from "@/components/atoms/InterestTag";

export default function InterestsList({ interests }: { interests: string[] }) {
  const sortedInterests = sortItems(interests, "charlength");

  return (
    <div className="flex flex-wrap gap-2">
      {sortedInterests.slice(0, 8).map((interest) => (
        <InterestTag key={interest}>{getInterestLabel(interest)}</InterestTag>
      ))}
    </div>
  );
}
