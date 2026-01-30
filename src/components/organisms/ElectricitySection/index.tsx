import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { Plug } from "lucide-react";

const flexBetween = "flex items-center justify-between";

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
      <div className="flex items-center gap-2 mb-2">
        <Plug size={16} />
        <Typography variant="h3" weight="bold" className="w-fit capitalize">
          Electricity
        </Typography>
      </div>
      <div className={flexBetween}>
        <Typography variant="ui-sm" className="capitalize">
          Voltage
        </Typography>
        <Typography variant="body-sm">{voltage}</Typography>
      </div>
      <div className={flexBetween}>
        <Typography variant="ui-sm" className="capitalize">
          Frequency
        </Typography>
        <Typography variant="body-sm">{frequencyHz}HZ</Typography>
      </div>
      <div className={flexBetween}>
        <Typography variant="ui-sm" className="capitalize">
          Plugs
        </Typography>
        <Typography variant="body-sm">{plugs.join(", ")}</Typography>
      </div>
    </Block>
  );
}
