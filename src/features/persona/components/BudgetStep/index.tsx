"use client";

import { useFormContext } from "react-hook-form";
import { BudgetSelector } from "@/components/organisms/forms";

/**
 * BudgetStep - Form context wrapper for BudgetSelector
 *
 * This component connects the pure BudgetSelector to React Hook Form.
 * For standalone use without form context, use BudgetSelector directly.
 */
export default function BudgetStep() {
  const { watch, setValue } = useFormContext();
  const selectedBudget = watch("budget");
  const selectedCurrency = watch("currency");

  return (
    <BudgetSelector
      budgetValue={selectedBudget}
      currencyValue={selectedCurrency}
      onBudgetChange={(val) => setValue("budget", val)}
      onCurrencyChange={(val) => setValue("currency", val)}
    />
  );
}
