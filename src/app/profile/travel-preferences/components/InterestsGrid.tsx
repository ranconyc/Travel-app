import { InterestItem } from "@/app/profile/travel-preferences/_hooks/useTravelPreferencesForm";

type InterestsGridProps = {
  interests: InterestItem[];
  selectedIds: string[];
  onToggleInterest: (interestId: string) => void;
};

export default function InterestsGrid({
  interests,
  selectedIds,
  onToggleInterest,
}: InterestsGridProps) {
  return (
    <div className="mt-md grid grid-cols-1 gap-3 sm:grid-cols-2">
      {interests.map((interest) => {
        const selected = selectedIds.includes(interest.id);

        return (
          <label
            key={interest.id}
            htmlFor={interest.id}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm cursor-pointer transition
              ${
                selected
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-gray-200 bg-[#f7fafc] hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-p font-medium text-gray-900">
                {interest.label}
              </span>
            </div>

            {/* Custom checkbox visual */}
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold
                ${
                  selected
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-gray-300 bg-white text-transparent"
                }`}
            >
              ✓
            </span>

            <input
              id={interest.id}
              type="checkbox"
              className="sr-only"
              checked={selected}
              onChange={() => onToggleInterest(interest.id)}
            />
          </label>
        );
      })}
    </div>
  );
}
