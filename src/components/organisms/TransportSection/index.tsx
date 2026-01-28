import { BusFront } from "lucide-react";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";

export default function TransportSection({ city }: { city: any }) {
  return (
    <Block>
      <div className="flex items-center gap-2 mb-2">
        <BusFront size={16} />
        <Typography variant="h1" className="font-bold w-fit capitalize">
          Transportation options
        </Typography>
      </div>
      <div className="grid gap-2 w-full">
        {city?.info.gettingAround.map(
          (o: { name: string; note: string; badge: any }) => (
            <div
              className="p-2 flex items-start gap-2 bg-gray-50 justify-between"
              key={o.name}
            >
              <div className="grid gap-2">
                <h1 className="text-p font-medium">{o.name}</h1>
                <p className="text-xs">{o.note}</p>
              </div>
              {o.badge && <div className="text-xs">{o.badge.text}</div>}
            </div>
          ),
        )}
      </div>
    </Block>
  );
}
