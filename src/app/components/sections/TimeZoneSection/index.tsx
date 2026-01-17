import Block from "@/app/components/common/Block";
import Title from "@/app/components/Title";

import { Clock } from "lucide-react";

type TimeZoneProps = {
  timeZone?: string;
};

const subtitle = "text-sm font-medium capitalize mb-1";
const paragraph = "text-base";
const flexBetween = "flex items-center justify-between";

export default function TimeZoneSection({ timeZone }: TimeZoneProps) {
  {
    if (!timeZone) {
      return null;
    }
    return (
      <Block>
        <Title icon={<Clock size={16} />}>Time Zone</Title>
        <p className={paragraph + " font-bold"}>3:00 AM</p>
        <p className={paragraph + " text-gray-600"}>{timeZone}</p>
      </Block>
    );
  }
}
