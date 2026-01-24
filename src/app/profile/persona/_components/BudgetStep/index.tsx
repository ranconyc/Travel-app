"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import * as Icons from "lucide-react";
import SelectionCard from "@/app/components/form/SelectionCard";
import budgetData from "@/data/budget.json";

interface BudgetItem {
  icon: string;
  label: string;
  description: string;
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export default function BudgetStep() {
  const { watch, setValue } = useFormContext();
  const selectedBudget = watch("budget");
  const selectedCurrency = watch("currency");

  const budgetOptions = (budgetData as BudgetItem[]).map((item) => ({
    ...item,
    icon: (Icons as Record<string, any>)[item.icon] || Icons.CircleDollarSign,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Budget Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-secondary uppercase tracking-wider">
          Travel Budget
        </label>
        <div className="grid grid-cols-1 gap-2">
          {budgetOptions.map((item) => (
            <SelectionCard
              key={item.label}
              type="radio"
              icon={item.icon}
              id={item.label}
              label={item.label}
              description={item.description}
              isSelected={selectedBudget === item.label}
              onChange={(val) => setValue("budget", val)}
            />
          ))}
        </div>
      </div>

      {/* Currency Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-secondary uppercase tracking-wider">
          Preferred Currency
        </label>
        <div className="flex flex-wrap gap-2">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              type="button"
              onClick={() => setValue("currency", curr.code)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                selectedCurrency === curr.code
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-surface bg-surface text-secondary hover:border-brand/50"
              }`}
            >
              <span className="font-bold">{curr.symbol}</span>
              <span className="text-sm font-medium">{curr.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
