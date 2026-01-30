import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { CircleDollarSign } from "lucide-react";

type CurrencyProps = {
  name: string;
  code?: string;
  symbol: string;
  paymentMethodsNote?: string;
};

export default function CurrencySection({
  name,
  code,
  symbol,
  paymentMethodsNote,
}: CurrencyProps) {
  return (
    <Block>
      <div className="flex items-center gap-2 mb-2">
        <CircleDollarSign size={16} />
        <Typography variant="h3" weight="bold" className="w-fit capitalize">
          Currency
        </Typography>
      </div>
      <div className="flex items-center justify-between gap-md">
        {/* <h1 className="text-ui-sm capitalize mb-1">Currency Name</h1> */}
        <Typography variant="body-sm">
          {name} {symbol} {code && `(${code})`}
        </Typography>
      </div>

      {paymentMethodsNote && (
        <>
          <Typography variant="ui-sm" className="capitalize mb-1">
            Payment Methods
          </Typography>
          <Typography variant="body-sm">{paymentMethodsNote}</Typography>
        </>
      )}
    </Block>
  );
}

// <div className="flex items-center justify-between gap-md">
//   <h1 className="text-ui-sm capitalize mb-1">Exchange Rate</h1>
//   {/* change this to be realtime || based on the user currency */}
//   <p className="text-xs">{exchangeRateNote}</p>
// </div>
//
