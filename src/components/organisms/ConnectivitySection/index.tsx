import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { Wifi } from "lucide-react";

type ConnectivityProps = {
  simNote: string;
  simePrice: string;
  wifiNote: string;
};

export default function ConnectivitySection({
  simNote,
  simePrice,
  wifiNote,
}: ConnectivityProps) {
  return (
    <Block>
      <div className="flex items-center gap-2 mb-2">
        <Wifi size={16} />
        <Typography variant="h3" weight="bold" className="w-fit capitalize">
          Internet & Connectivity
        </Typography>
      </div>
      <Typography variant="ui-sm" className="mt-2 mb-1">
        SIM Cards
      </Typography>
      <Typography variant="body-sm">{simNote}</Typography>
      <Typography variant="body-sm" color="sec" className="mt-1">
        Price: {simePrice}
      </Typography>

      <Typography variant="ui-sm" className="mt-3 mb-1">
        WiFi Availability
      </Typography>
      <Typography variant="body-sm">{wifiNote}</Typography>
    </Block>
  );
}
