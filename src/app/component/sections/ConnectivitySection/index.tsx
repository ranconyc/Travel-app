import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";
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
      <Title icon={<Wifi size={16} />}>Internet & Connectivity</Title>
      <h2>SIM Cards</h2>
      <p className="text-sm">{simNote}</p>
      <p className="text-sm">Price: {simePrice}</p>
      <h2>WiFi Availability</h2>
      <p className="text-sm">{wifiNote}</p>
    </Block>
  );
}
