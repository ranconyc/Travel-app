import * as Icons from "lucide-react";
import { useFormContext } from "react-hook-form";
import { GenericSelector } from "@/components/organisms/forms";
import travelStylesData from "@/data/travelStyles.json";

interface StyleData {
  id: string;
  icon: string;
  label: string;
  description: string;
}

const travelStyles = (travelStylesData as StyleData[]).map((item) => ({
  ...item,
  icon: (Icons as any)[item.icon] || Icons.Compass,
}));

/**
 * StyleStep - Form context wrapper for GenericSelector
 */
export default function StyleStep() {
  const { watch, setValue } = useFormContext();
  return (
    <GenericSelector
      value={watch("travelStyle")}
      onChange={(val) => setValue("travelStyle", val)}
      options={travelStyles}
    />
  );
}
