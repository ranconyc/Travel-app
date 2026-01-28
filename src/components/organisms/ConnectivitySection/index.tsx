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
        <Typography variant="h1" className="font-bold w-fit capitalize">
          Internet & Connectivity
        </Typography>
      </div>
      <h2>SIM Cards</h2>
      <p className="text-sm">{simNote}</p>
      <p className="text-sm">Price: {simePrice}</p>
      <h2>WiFi Availability</h2>
      <p className="text-sm">{wifiNote}</p>
    </Block>
  );
}
