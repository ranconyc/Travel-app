"use client";

import { memo, useState } from "react";
import { Coffee, Utensils, Users, Sparkles } from "lucide-react";
import Typography from "@/components/atoms/Typography";

export type Mood = "hungry" | "work" | "social" | "chill" | null;

interface MoodOption {
  id: Mood;
  label: string;
  icon: React.ElementType;
  color: string;
  relatedInterests: string[];
}

const MOODS: MoodOption[] = [
  {
    id: "hungry",
    label: "Hungry",
    icon: Utensils,
    color: "bg-orange-500",
    relatedInterests: [
      "street_food_markets",
      "fine_dining", 
      "cooking_classes",
      "wine_brewery_tours",
      "rooftop_bars",
      "nightclubs_dancing",
      "live_music_venues"
    ]
  },
  {
    id: "work",
    label: "Work",
    icon: Coffee,
    color: "bg-blue-500",
    relatedInterests: [
      "coworking_spaces",
      "work_friendly_cafes",
      "meetup_events"
    ]
  },
  {
    id: "social",
    label: "Social",
    icon: Users,
    color: "bg-purple-500",
    relatedInterests: [
      "nightclubs_dancing",
      "rooftop_bars",
      "live_music_venues",
      "meetup_events",
      "hostel_vibes"
    ]
  },
  {
    id: "chill",
    label: "Chill",
    icon: Sparkles,
    color: "bg-green-500",
    relatedInterests: [
      "yoga_meditation",
      "spa_wellness_centers",
      "hot_springs",
      "beach_lounging",
      "silent_retreats"
    ]
  }
];

interface MoodSelectorProps {
  selectedMood: Mood;
  onMoodChange: (mood: Mood) => void;
  className?: string;
}

const MoodSelector = memo(function MoodSelector({
  selectedMood,
  onMoodChange,
  className = "",
}: MoodSelectorProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Horizontal scrolling container */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {/* "All" option */}
        <MoodButton
          mood={null}
          label="All"
          icon={Sparkles}
          color="bg-gray-500"
          isSelected={selectedMood === null}
          onClick={() => onMoodChange(null)}
        />
        
        {/* Mood options */}
        {MOODS.map((mood) => (
          <MoodButton
            key={mood.id}
            mood={mood.id}
            label={mood.label}
            icon={mood.icon}
            color={mood.color}
            isSelected={selectedMood === mood.id}
            onClick={() => onMoodChange(mood.id)}
          />
        ))}
      </div>
      
      {/* Selected mood description */}
      {selectedMood && (
        <div className="mt-3 px-2">
          <Typography variant="micro" className="text-gray-600 dark:text-gray-400">
            Showing places that match your <span className="font-semibold">{MOODS.find(m => m.id === selectedMood)?.label}</span> mood
          </Typography>
        </div>
      )}
    </div>
  );
});

interface MoodButtonProps {
  mood: Mood;
  label: string;
  icon: React.ElementType;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

function MoodButton({ mood, label, icon: Icon, color, isSelected, onClick }: MoodButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        whitespace-nowrap transition-all duration-300
        ${isSelected 
          ? `${color} text-white shadow-lg scale-105` 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
      `}
    >
      <Icon size={16} />
      <Typography variant="micro" className="font-medium">
        {label}
      </Typography>
    </button>
  );
}

// Helper function to get mood-related interests
export function getMoodRelatedInterests(mood: Mood): string[] {
  if (!mood) return [];
  return MOODS.find(m => m.id === mood)?.relatedInterests || [];
}

export default MoodSelector;
