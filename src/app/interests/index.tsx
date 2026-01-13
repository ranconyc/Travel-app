import { Sunrise, Sun, SunMoon, Sunset, Moon } from "lucide-react";
import { Checkbox } from "../mode/page";

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
export default function StepTwo({
  handleRadioChange,
  selected,
}: {
  handleRadioChange: (value: string) => void;
  selected: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {dailyRhythm.map((item) => (
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
      ))}
    </div>
  );
}
