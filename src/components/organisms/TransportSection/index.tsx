import { BusFront } from "lucide-react";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";

export default function TransportSection({
  city,
}: {
  city: {
    info: {
      gettingAround: { name: string; note: string; badge?: { text: string } }[];
    };
  };
}) {
  return (
    <Block>
      <div className="flex items-center gap-2 mb-2">
        <BusFront size={16} />
        <Typography variant="h3" weight="bold" className="w-fit capitalize">
          Transportation options
        </Typography>
      </div>
      <div className="grid gap-2 w-full">
        {city?.info.gettingAround.map((o) => (
          <div
            className="p-2 flex items-start gap-2 bg-gray-50 justify-between"
            key={o.name}
          >
            <div className="grid gap-1">
              <Typography variant="ui-sm" weight="medium">
                {o.name}
              </Typography>
              <Typography variant="body-sm" color="sec">
                {o.note}
              </Typography>
            </div>
            {o.badge && (
              <Typography
                variant="micro"
                className="bg-surface-secondary px-2 py-0.5 rounded"
              >
                {o.badge.text}
              </Typography>
            )}
          </div>
        ))}
      </div>
    </Block>
  );
}
