"use client";

import { memo } from "react";
import { Coffee, Utensils, Users, Sparkles } from "lucide-react";
import Typography from "@/components/atoms/Typography";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type Mood = "hungry" | "work" | "social" | "chill" | null;

interface MoodOption {
  id: Mood;
  label: string;
  icon: React.ElementType;
  variant: "default" | "hungry" | "work" | "social" | "chill";
  relatedInterests: string[];
}

const moodButtonVariants = cva(
  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
        hungry: "bg-orange-500 text-white shadow-lg scale-105",
        work: "bg-blue-500 text-white shadow-lg scale-105",
        social: "bg-purple-500 text-white shadow-lg scale-105",
        chill: "bg-green-500 text-white shadow-lg scale-105",
        all: "bg-gray-500 text-white shadow-lg scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const MOODS: MoodOption[] = [
  {
    id: "hungry",
    label: "Hungry",
    icon: Utensils,
    variant: "hungry",
    relatedInterests: [
      "street_food_markets",
      "fine_dining",
      "cooking_classes",
      "wine_brewery_tours",
      "rooftop_bars",
      "nightclubs_dancing",
      "live_music_venues",
    ],
  },
  {
    id: "work",
    label: "Work",
    icon: Coffee,
    variant: "work",
    relatedInterests: [
      "coworking_spaces",
      "work_friendly_cafes",
      "meetup_events",
    ],
  },
  {
    id: "social",
    label: "Social",
    icon: Users,
    variant: "social",
    relatedInterests: [
      "nightclubs_dancing",
      "rooftop_bars",
      "live_music_venues",
      "meetup_events",
      "hostel_vibes",
    ],
  },
  {
    id: "chill",
    label: "Chill",
    icon: Sparkles,
    variant: "chill",
    relatedInterests: [
      "yoga_meditation",
      "spa_wellness_centers",
      "hot_springs",
      "beach_lounging",
      "silent_retreats",
    ],
  },
];

interface MoodSelectorProps {
  selectedMood: Mood;
  onMoodChange: (mood: Mood) => void;
  className?: string;
}

const MoodSelector = memo(function MoodSelector({
  selectedMood,
  onMoodChange,
  className,
}: MoodSelectorProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Horizontal scrolling container */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {/* "All" option */}
        <MoodButton
          label="All"
          icon={Sparkles}
          variant={selectedMood === null ? "all" : "default"}
          onClick={() => onMoodChange(null)}
        />

        {/* Mood options */}
        {MOODS.map((mood) => (
          <MoodButton
            key={mood.label}
            label={mood.label}
            icon={mood.icon}
            variant={selectedMood === mood.id ? mood.variant : "default"}
            onClick={() => onMoodChange(mood.id)}
          />
        ))}
      </div>

      {/* Selected mood description */}
      {selectedMood && (
        <div className="mt-3 px-2">
          <Typography variant="micro" color="sec">
            Showing places that match your{" "}
            <span className="font-semibold text-txt-main">
              {MOODS.find((m) => m.id === selectedMood)?.label}
            </span>{" "}
            mood
          </Typography>
        </div>
      )}
    </div>
  );
});

interface MoodButtonProps {
  label: string;
  icon: React.ElementType;
  variant: "default" | "hungry" | "work" | "social" | "chill" | "all";
  onClick: () => void;
}

function MoodButton({ label, icon: Icon, variant, onClick }: MoodButtonProps) {
  return (
    <button onClick={onClick} className={moodButtonVariants({ variant })}>
      <Icon size={16} />
      <Typography variant="micro" weight="medium">
        {label}
      </Typography>
    </button>
  );
}

// Helper function to get mood-related interests
export function getMoodRelatedInterests(mood: Mood): string[] {
  if (!mood) return [];
  return MOODS.find((m) => m.id === mood)?.relatedInterests || [];
}

export default MoodSelector;
