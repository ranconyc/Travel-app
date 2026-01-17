import * as Icons from "lucide-react";
import SelectionStep from "@/app/profile/persona/_components/SelectionStep";
import travelStylesData from "@/data/travelStyles.json";

interface StyleData {
  icon: string;
  label: string;
  description: string;
}

const travelStyles = (travelStylesData as StyleData[]).map((item) => ({
  ...item,
  icon: (Icons as any)[item.icon] || Icons.Compass,
}));

// STYLE STEP
export default function StyleStep() {
  return <SelectionStep fieldName="travelStyle" options={travelStyles} />;
}
