"use client";

import { useFormContext } from "react-hook-form";
import { PersonaFormValues } from "@/features/persona/types/form";
import { Edit2, Lock } from "lucide-react";
import Button from "@/components/atoms/Button";

// Import data for lookups
import dailyRhythms from "@/data/dailyRhythms.json";
import travelStyles from "@/data/travelStyles.json";
import budgetTiers from "@/data/budget.json";
import interestsDataRaw from "@/data/interests.json";

interface SummarySectionProps {
  title: string;
  value: string | string[];
  stepIndex: number;
  onEdit: (step: number) => void;
  isPrivate?: boolean;
}

function SummarySection({
  title,
  value,
  stepIndex,
  onEdit,
  isPrivate,
}: SummarySectionProps) {
  const displayValue = Array.isArray(value) ? value.join(", ") : value;

  return (
    <div className="bg-surface rounded-xl p-4 border border-surface-secondary">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">
          {title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(stepIndex)}
          className="h-8 w-8 p-0"
        >
          <Edit2 size={14} />
        </Button>
      </div>
      <p className="text-lg font-medium text-app-text">{displayValue}</p>
      {isPrivate && (
        <div className="flex items-center gap-1 mt-2 text-xs text-secondary/70">
          <Lock size={12} />
          <span>Private to you</span>
        </div>
      )}
    </div>
  );
}

export default function SummaryStep({
  imgUrl,
  onJumpToStep,
}: {
  imgUrl?: string; // Optional user avatar
  onJumpToStep: (step: number) => void;
}) {
  const { watch } = useFormContext<PersonaFormValues>();
  const values = watch();

  // Helper to get labels
  const getRhythmLabel = (id: string) =>
    dailyRhythms.find((r) => r.id === id)?.label || id;
  const getStyleLabel = (id: string) =>
    travelStyles.find((s) => s.id === id)?.label || id;
  const getBudgetLabel = (id: string) =>
    budgetTiers.find((b: any) => b.id === id)?.label || id;

  const getInterestLabels = (ids: string[]) => {
    const labels: string[] = [];
    const categories = Object.values(interestsDataRaw);
    ids.forEach((id) => {
      for (const cat of categories) {
        const item = cat.items.find((i: any) => i.id === id);
        if (item) {
          labels.push(item.label);
          break;
        }
      }
    });
    return labels.length > 0 ? labels : ids;
  };

  return (
    <div className="flex flex-col gap-xl w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-xll">
      <div className="text-center mb-xxl">
        <h2 className="text-h2 font-bold mb-sm">Almost done!</h2>
        <p className="text-p text-secondary">
          Review your profile before we build your recommendations.
        </p>
      </div>

      <SummarySection
        title="Basic Info"
        value={`${values.firstName || ""} • ${values.hometown || ""}`}
        stepIndex={1}
        onEdit={onJumpToStep}
      />

      <SummarySection
        title="Travel Rhythm"
        value={getRhythmLabel(values.dailyRhythm)}
        stepIndex={2}
        onEdit={onJumpToStep}
      />

      <SummarySection
        title="Travel Style"
        value={getStyleLabel(values.travelStyle)}
        stepIndex={3}
        onEdit={onJumpToStep}
      />

      <SummarySection
        title="Budget"
        value={`${getBudgetLabel(values.budget)} (${values.currency})`}
        stepIndex={4}
        onEdit={onJumpToStep}
        isPrivate
      />

      <SummarySection
        title="Interests"
        value={getInterestLabels(values.interests)}
        stepIndex={5}
        onEdit={onJumpToStep}
      />
    </div>
  );
}
