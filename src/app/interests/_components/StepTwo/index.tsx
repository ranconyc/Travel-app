import { Sunrise, Sun, SunMoon, Sunset, Moon } from "lucide-react";
import SelectionStep from "../SelectionStep";

const dailyRhythm: {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  description: string;
}[] = [
  {
    icon: Sunrise,
    label: "Early Riser",
    description: "Up with the sun",
  },
  {
    icon: Sun,
    label: "Morning Person",
    description: "Gets going early",
  },
  {
    icon: SunMoon,
    label: "Flexible",
    description: "Goes with the flow",
  },
  {
    icon: Sunset,
    label: "Evening Person",
    description: "Energized after dark",
  },
  {
    icon: Moon,
    label: "Night Owl",
    description: "Thrives at night",
  },
];

// STEP TWO
export default function StepTwo() {
  return <SelectionStep fieldName="dailyRhythm" options={dailyRhythm} />;
}
