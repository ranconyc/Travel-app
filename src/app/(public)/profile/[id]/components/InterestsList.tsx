import {
  sortItems,
  getInterestLabel,
  getSelectedInterestsByCategory,
  getCategoriesFromInterests,
} from "@/domain/interests/interests.service";

import InterestTag from "@/components/atoms/InterestTag";

export default function InterestsList({ interests }: { interests: string[] }) {
  const sortedInterests = sortItems(interests, "charlength");
  const interestsCategories = getSelectedInterestsByCategory(interests);
  const categories = getCategoriesFromInterests(interests);

  console.log("interests", interests);
  console.log("interestsCategories", interestsCategories);
  console.log("categories", categories);

  // take the interests Tags and return categories with the interests

  return (
    <div className="flex flex-wrap gap-2">
      {sortedInterests.map((interest) => (
        <InterestTag key={interest}>{getInterestLabel(interest)}</InterestTag>
      ))}
    </div>
  );
}
