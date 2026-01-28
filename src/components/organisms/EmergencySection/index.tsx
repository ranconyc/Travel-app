import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";

import { ShieldAlert } from "lucide-react";

type EmergencyProps = {
  touristPolice: string;
  emergency: string;
  ambulance: string;
  fire: string;
};

const subtitle = "text-ui-sm capitalize mb-1";
const paragraph = "text-sm  text-gray-600";
const flexBetween = "flex items-center justify-between";

export default function EmergencySection({
  touristPolice,
  emergency,
  ambulance,
  fire,
}: EmergencyProps) {
  if (!touristPolice && !emergency && !ambulance && !fire) {
    return null;
  }
  return (
    <Block>
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert size={16} />
        <Typography variant="h1" className="font-bold w-fit capitalize">
          Emergency Contact
        </Typography>
      </div>
      {touristPolice && (
        <div className={flexBetween}>
          <h1 className={subtitle}>Police</h1>
          <p className={paragraph}>{touristPolice}</p>
        </div>
      )}
      {emergency && (
        <div className={flexBetween}>
          <h1 className={subtitle}>Emergency</h1>
          <p className={paragraph}>{emergency}</p>
        </div>
      )}
      {ambulance && (
        <div className={flexBetween}>
          <h1 className={subtitle}>Ambulance</h1>
          <p className={paragraph}>{ambulance}</p>
        </div>
      )}
      {fire && (
        <div className={flexBetween}>
          <h1 className={subtitle}>Fire</h1>
          <p className={paragraph}>{fire}</p>
        </div>
      )}
    </Block>
  );
}
