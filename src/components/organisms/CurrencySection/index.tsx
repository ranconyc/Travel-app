import Block from "@/components/atoms/Block";
import Title from "@/components/atoms/Title";
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
      <Title icon={<CircleDollarSign size={16} />}>Currency</Title>
      <div className="flex items-center justify-between gap-md">
        {/* <h1 className="text-sm font-medium capitalize mb-1">Currency Name</h1> */}
        <p className="text-xs">
          {name} {symbol} {code && `(${code})`}
        </p>
      </div>

      {paymentMethodsNote && (
        <>
          <h1 className="text-sm font-medium capitalize mb-1">
            Payment Methods
          </h1>
          <p className="text-xs">{paymentMethodsNote}</p>
        </>
      )}
    </Block>
  );
}

// <div className="flex items-center justify-between gap-md">
//   <h1 className="text-sm font-medium capitalize mb-1">Exchange Rate</h1>
//   {/* change this to be realtime || based on the user currency */}
//   <p className="text-xs">{exchangeRateNote}</p>
// </div>
//
