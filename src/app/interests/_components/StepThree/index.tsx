import { Checkbox } from "@/app/mode/page";
import {
  TreePalm,
  Compass,
  Activity,
  Binoculars,
  CableCar,
} from "lucide-react";

const travelStyles: {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  description: string;
}[] = [
  {
    icon: TreePalm,
    label: "Relaxed",
    description: "You're all about calm vibes no rush",
  },
  {
    icon: Compass,
    label: "Easygoing",
    description:
      "You prefer slow days, wandering around, and enjoying things as they come",
  },
  {
    icon: Activity,
    label: "Balanced Traveler",
    description:
      "A bit of both adventure with time to relax and enjoy the moment.",
  },
  {
    icon: Binoculars,
    label: "Active Explorer",
    description:
      "Always on the move sightseeing, discovering hidden gems, making every day count.",
  },
  {
    icon: CableCar,
    label: "Adventurous",
    description:
      "You love pushing limits hiking, exploring, saying yes to everything.",
  },
];

// STEP THREE
export default function StepThree({
  handleRadioChange,
  selected,
}: {
  handleRadioChange: (value: string) => void;
  selected: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {travelStyles.map(
        (item: {
          label: string;
          icon: React.ComponentType<{ size: number }>;
          description: string;
        }) => (
          <Checkbox
            key={item.label}
            type="radio"
            icon={item.icon}
            id={item.label}
            label={item.label}
            description={item.description}
            isSelected={selected === item.label}
            onChange={handleRadioChange}
          />
        )
      )}
    </div>
  );
}
