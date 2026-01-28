import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";

import { Clock } from "lucide-react";

type TimeZoneProps = {
  timeZone?: string;
};

const subtitle = "text-ui-sm capitalize mb-1";
const paragraph = "text-p";
const flexBetween = "flex items-center justify-between";

export default function TimeZoneSection({ timeZone }: TimeZoneProps) {
  {
    if (!timeZone) {
      return null;
    }
    return (
      <Block>
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} />
          <Typography variant="h1" className="font-bold w-fit capitalize">
            Time Zone
          </Typography>
        </div>
        <p className={paragraph + " font-bold"}>3:00 AM</p>
        <p className={paragraph + " text-gray-600"}>{timeZone}</p>
      </Block>
    );
  }
}
