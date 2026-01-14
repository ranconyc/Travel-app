import {
  TreePalm,
  Compass,
  Activity,
  Binoculars,
  CableCar,
} from "lucide-react";
import SelectionStep from "../SelectionStep";

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
export default function StepThree() {
  return <SelectionStep fieldName="travelStyle" options={travelStyles} />;
}
