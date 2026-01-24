import * as Icons from "lucide-react";
import { useFormContext } from "react-hook-form";
import { GenericSelector } from "@/components/organisms/forms";
import dailyRhythmsData from "@/data/dailyRhythms.json";

interface RhythmData {
  id: string;
  icon: string;
  label: string;
  description: string;
}

const dailyRhythms = (dailyRhythmsData as RhythmData[]).map((item) => ({
  ...item,
  icon: (Icons as any)[item.icon] || Icons.Sun,
}));

/**
 * RhythmStep - Form context wrapper for GenericSelector
 */
export default function RhythmStep() {
  const { watch, setValue } = useFormContext();
  return (
    <GenericSelector
      value={watch("dailyRhythm")}
      onChange={(val) => setValue("dailyRhythm", val)}
      options={dailyRhythms}
    />
  );
}
