import Block from "@/app/component/Block";
import Title from "@/app/component/Title";

import { ShieldAlert } from "lucide-react";

type EmergencyProps = {
  touristPolice: string;
  emergency: string;
  ambulance: string;
  fire: string;
};

const subtitle = "text-sm font-medium capitalize mb-1";
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
      <Title icon={<ShieldAlert size={16} />}>Emergency Contact</Title>
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
