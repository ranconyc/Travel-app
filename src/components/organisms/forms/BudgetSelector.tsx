"use client";

import React from "react";
import * as Icons from "lucide-react";
import SelectionCard from "@/components/atoms/SelectionCard";
import budgetData from "@/data/budget.json";

interface BudgetItem {
  id: string;
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

interface BudgetSelectorProps {
  budgetValue: string;
  currencyValue: string;
  onBudgetChange: (budget: string) => void;
  onCurrencyChange: (currency: string) => void;
  variant?: "full" | "compact";
}

/**
 * BudgetSelector - Pure, reusable budget and currency selection component
 *
 * Decoupled from form context. Can be used in:
 * - PersonaForm (initial onboarding)
 * - Profile Edit page
 * - Settings page
 * - Any other context requiring budget/currency selection
 *
 * @example
 * ```tsx
 * // In PersonaForm with React Hook Form
 * <BudgetSelector
 *   budgetValue={watch("budget")}
 *   currencyValue={watch("currency")}
 *   onBudgetChange={(val) => setValue("budget", val)}
 *   onCurrencyChange={(val) => setValue("currency", val)}
 * />
 *
 * // In Profile Edit
 * <BudgetSelector
 *   budgetValue={userBudget}
 *   currencyValue={userCurrency}
 *   onBudgetChange={handleBudgetUpdate}
 *   onCurrencyChange={handleCurrencyUpdate}
 * />
 * ```
 */
export function BudgetSelector({
  budgetValue,
  currencyValue,
  onBudgetChange,
  onCurrencyChange,
  variant = "full",
}: BudgetSelectorProps) {
  const budgetOptions = (budgetData as BudgetItem[]).map((item) => ({
    ...item,
    icon: (Icons as Record<string, any>)[item.icon] || Icons.CircleDollarSign,
  }));

  return (
    <div className="flex flex-col gap-xl">
      {/* Budget Selection */}
      <div className="flex flex-col gap-md">
        <label className="text-upheader font-bold text-secondary uppercase tracking-wider">
          Travel Budget
        </label>
        <div className="grid grid-cols-1 gap-sm">
          {budgetOptions.map((item) => (
            <SelectionCard
              key={item.id}
              type="radio"
              icon={<item.icon size={20} />}
              label={item.label}
              description={variant === "full" ? item.description : undefined}
              isSelected={budgetValue === item.id}
              onChange={() => onBudgetChange(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Currency Selection */}
      <div className="flex flex-col gap-md">
        <label className="text-upheader font-bold text-secondary uppercase tracking-wider">
          Preferred Currency
        </label>
        <div className="flex flex-wrap gap-sm">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              type="button"
              onClick={() => onCurrencyChange(curr.code)}
              className={`flex items-center gap-xs px-lg py-lg rounded-full border-2 transition-all ${
                currencyValue === curr.code
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-surface-secondary text-secondary hover:border-brand/50"
              }`}
            >
              <span className="font-bold">{curr.symbol}</span>
              <span className="text-p font-medium">{curr.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BudgetSelector;
