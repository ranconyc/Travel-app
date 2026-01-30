import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";

import { ShieldAlert } from "lucide-react";

type EmergencyProps = {
  touristPolice: string;
  emergency: string;
  ambulance: string;
  fire: string;
};

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
        <Typography variant="h3" weight="bold" className="w-fit capitalize">
          Emergency Contact
        </Typography>
      </div>
      {touristPolice && (
        <div className={flexBetween}>
          <Typography variant="ui-sm" className="capitalize">
            Police
          </Typography>
          <Typography variant="body-sm" color="sec">
            {touristPolice}
          </Typography>
        </div>
      )}
      {emergency && (
        <div className={flexBetween}>
          <Typography variant="ui-sm" className="capitalize">
            Emergency
          </Typography>
          <Typography variant="body-sm" color="sec">
            {emergency}
          </Typography>
        </div>
      )}
      {ambulance && (
        <div className={flexBetween}>
          <Typography variant="ui-sm" className="capitalize">
            Ambulance
          </Typography>
          <Typography variant="body-sm" color="sec">
            {ambulance}
          </Typography>
        </div>
      )}
      {fire && (
        <div className={flexBetween}>
          <Typography variant="ui-sm" className="capitalize">
            Fire
          </Typography>
          <Typography variant="body-sm" color="sec">
            {fire}
          </Typography>
        </div>
      )}
    </Block>
  );
}
