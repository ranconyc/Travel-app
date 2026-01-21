"use client";

import { Wallet, CreditCard, Banknote } from "lucide-react";

interface MoneyData {
  currency?: {
    code: string;
    symbol: string;
    name: string;
  };
  budget?: {
    daily?: {
      budget: string;
      mid: string;
      luxury: string;
    };
  };
  cashCulture?: {
    cashPreferred?: boolean;
    atmAvailability?: string;
    tipping?: any;
  };
}

export const FinanceSection = ({ data }: { data: MoneyData }) => {
  if (!data.currency && !data.budget) return <div>FinanceSection</div>;

  return (
    <div className="min-w-fit flex flex-col gap-6 p-6 bg-surface rounded-3xl border border-surface-secondary">
      <div className="w-40 flex items-center gap-3 mb-2">
        <div className="bg-green-500/10 p-2 rounded-full">
          <Wallet className="w-6 h-6 text-green-500" />
        </div>
        <h2 className="text-xl font-bold font-sora">Money</h2>
      </div>

      {/* Currency */}
      {data.currency && (
        <div className="flex justify-between items-center bg-app-bg p-4 rounded-2xl border border-surface-secondary">
          <div>
            <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">
              Currency
            </p>
            <h3 className="font-bold text-lg">{data.currency.name}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-surface shadow-sm border border-surface-secondary flex items-center justify-center font-sora font-bold text-xl text-app-text">
            {data.currency.symbol}
          </div>
        </div>
      )}

      {/* Daily Budget */}
      {data.budget?.daily && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xs text-secondary uppercase font-bold tracking-wider">
            Daily Budget (Per Person)
          </h3>
          <div className="flex flex-col gap-2">
            {[
              {
                label: "Budget",
                val: data.budget.daily.budget,
                icon: Banknote,
                color: "text-green-600",
              },
              {
                label: "Mid-range",
                val: data.budget.daily.mid,
                icon: CreditCard,
                color: "text-blue-500",
              },
              {
                label: "Luxury",
                val: data.budget.daily.luxury,
                icon: Wallet,
                color: "text-purple-500",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 bg-app-bg/50 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="font-bold font-mono text-sm">
                  {data.currency?.symbol}
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cash Culture */}
      {data.cashCulture && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
          <p className="text-xs font-bold text-yellow-600 mb-1 uppercase tracking-wide">
            Good to know
          </p>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {data.cashCulture.cashPreferred
              ? "Cash is king here. Always carry small bills."
              : "Cards are widely accepted."}
          </p>
        </div>
      )}
    </div>
  );
};
