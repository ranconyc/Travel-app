import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";

import { Clock } from "lucide-react";

type TimeZoneProps = {
  timeZone?: string;
};

export default function TimeZoneSection({ timeZone }: TimeZoneProps) {
  {
    if (!timeZone) {
      return null;
    }
    return (
      <Block>
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} />
          <Typography variant="h3" weight="bold" className="w-fit capitalize">
            Time Zone
          </Typography>
        </div>
        <Typography variant="h2" weight="bold" className="mt-2">
          3:00 AM
        </Typography>
        <Typography variant="body-sm" color="sec">
          {timeZone}
        </Typography>
      </Block>
    );
  }
}
