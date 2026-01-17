import SelectionCard from "@/app/components/form/SelectionCard";
import { useFormContext } from "react-hook-form";

interface SelectionStepProps {
  fieldName: "dailyRhythm" | "travelStyle";
  options: {
    icon: React.ComponentType<{ size: number }>;
    label: string;
    description: string;
  }[];
}

export default function SelectionStep({
  fieldName,
  options,
}: SelectionStepProps) {
  const { watch, setValue } = useFormContext();
  const selectedValue = watch(fieldName);

  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((item: SelectionStepProps["options"][number]) => (
        <SelectionCard
          key={item.label}
          type="radio"
          icon={item.icon}
          id={item.label}
          label={item.label}
          description={item.description}
          isSelected={selectedValue === item.label}
          onChange={(val) => {
            setValue(fieldName, val);
          }}
        />
      ))}
    </div>
  );
}
