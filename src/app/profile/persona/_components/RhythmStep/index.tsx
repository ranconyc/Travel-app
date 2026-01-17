import * as Icons from "lucide-react";
import SelectionStep from "@/app/profile/persona/_components/SelectionStep";
import dailyRhythmsData from "@/data/dailyRhythms.json";

interface RhythmData {
  icon: string;
  label: string;
  description: string;
}

const dailyRhythms = (dailyRhythmsData as RhythmData[]).map((item) => ({
  ...item,
  icon: (Icons as any)[item.icon] || Icons.Sun,
}));

// RHYTHM STEP
export default function RhythmStep() {
  return <SelectionStep fieldName="dailyRhythm" options={dailyRhythms} />;
}
