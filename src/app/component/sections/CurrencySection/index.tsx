import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";
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
      <div className="flex items-center justify-between gap-4">
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

// <div className="flex items-center justify-between gap-4">
//   <h1 className="text-sm font-medium capitalize mb-1">Exchange Rate</h1>
//   {/* change this to be realtime || based on the user currency */}
//   <p className="text-xs">{exchangeRateNote}</p>
// </div>
//
