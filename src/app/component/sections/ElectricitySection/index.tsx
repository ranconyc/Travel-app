import Block from "@/app/component/Block";
import Title from "@/app/component/Title";
import { Plug } from "lucide-react";

const flexBetween = "flex items-center justify-between";
const subtitle = "text-sm font-medium capitalize mb-1";
const paragraph = "text-xs";

type ElectricityProps = {
  voltage: string;
  frequencyHz: string;
  plugs: string[];
};

export default function ElectricitySection({
  voltage,
  frequencyHz,
  plugs,
}: ElectricityProps) {
  return (
    <Block>
      <Title icon={<Plug size={16} />}>Electricity</Title>
      <div className={flexBetween}>
        <h1 className="text-sm font-medium capitalize mb-1">Voltage</h1>
        <p className="text-xs">{voltage}</p>
      </div>
      <div className={flexBetween}>
        <h1 className="text-sm font-medium capitalize mb-1">Frequency</h1>
        <p className="text-xs">{frequencyHz}HZ</p>
      </div>
      <div className={flexBetween}>
        <h1 className="text-sm font-medium capitalize mb-1">Plugs</h1>
        <p className="text-xs">{plugs.join(", ")}</p>
      </div>
    </Block>
  );
}
