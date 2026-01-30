import { InterestItem } from "@/app/(public)/profile/travel-preferences/_hooks/useTravelPreferencesForm";

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
                  ? "border-brand bg-brand/5 shadow-sm"
                  : "border-border bg-surface-secondary hover:border-brand/50 hover:bg-brand/5"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-p font-medium text-txt-main">
                {interest.label}
              </span>
            </div>

            {/* Custom checkbox visual */}
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold
                ${
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-surface text-transparent"
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
