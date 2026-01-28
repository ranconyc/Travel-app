"use client";

import { Wallet, CreditCard, Crown, Lightbulb, DollarSign } from "lucide-react";
import { countryBudgets } from "@/data/world/countryBudgets.json";
import { useCountry } from "../store/useCountryStore";
import { FinanceData, CountryBudgetData } from "@/types/finance.types";

export const FinanceSection = () => {
  const country = useCountry();

  if (!country) return null;

  // Extract data from country store with proper typing
  const finance = (country.finance as FinanceData) || {};
  const currency = finance.currency;

  if (!currency?.symbol) return null;

  // Get country code from country data (use cca3 for 3-letter code matching)
  const countryCode = country.cca3 || "DEFAULT";

  // Get budget data from countryBudgets JSON with proper typing
  const budgetData: CountryBudgetData = (
    countryBudgets as Record<string, CountryBudgetData>
  )[countryCode] || {
    budget: 50,
    moderate: 100,
    luxury: 250,
    tip: "Tipping customs vary. 10% is generally safe for restaurants if service charge not included.",
  };

  return (
    <div className="px-4 py-6 flex flex-col gap-6 bg-surface rounded-3xl border border-surface-secondary">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-success/10 p-2 rounded-full">
          <Wallet className="w-6 h-6 text-success" />
        </div>
        <h2 className="text-xl font-bold font-sora">Money</h2>
      </div>

      {/* Currency Hero Card */}
      <div className="bg-gradient-to-r from-success/5 to-brand/5 dark:from-success/20 dark:to-brand/20 p-6 rounded-2xl border border-success/20 dark:border-success/30">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-success uppercase font-bold tracking-wider mb-2">
              Local Currency
            </p>
            <h3 className="font-bold text-2xl text-txt-main">
              {currency.name}
            </h3>
            <p className="text-sm text-secondary mt-1">{currency.code}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-surface shadow-lg border-2 border-success/20 flex items-center justify-center font-sora font-bold text-2xl text-success">
            {currency.symbol}
          </div>
        </div>
      </div>

      {/* Daily Budget Cards */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">
          Daily Budget (Per Person)
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {/* Budget Card */}
          <div className="bg-surface p-4 rounded-2xl border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold text-txt-main">Budget</h4>
                  <p className="text-xs text-secondary">$</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-txt-main">
                  ${budgetData.budget}
                </p>
                <p className="text-xs text-secondary">per day</p>
              </div>
            </div>
          </div>

          {/* Moderate Card */}
          <div className="bg-surface p-4 rounded-2xl border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="font-semibold text-txt-main">Moderate</h4>
                  <p className="text-xs text-secondary">$$</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-txt-main">
                  ${budgetData.moderate}
                </p>
                <p className="text-xs text-secondary">per day</p>
              </div>
            </div>
          </div>

          {/* Luxury Card */}
          <div className="bg-surface p-4 rounded-2xl border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-alt/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-brand-alt" />
                </div>
                <div>
                  <h4 className="font-semibold text-txt-main">Luxury</h4>
                  <p className="text-xs text-secondary">$$$</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-txt-main">
                  ${budgetData.luxury}
                </p>
                <p className="text-xs text-secondary">per day</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tipping Culture Card */}
      <div className="bg-warning/5 p-4 rounded-2xl border border-warning/20">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 text-warning" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-txt-main mb-1">
              Tipping Culture
            </h4>
            <p className="text-sm text-secondary leading-relaxed">
              {budgetData.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Cash Culture */}
      {finance.cashCulture && (
        <div className="bg-brand/5 p-4 rounded-2xl border border-brand/20">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <DollarSign className="w-4 h-4 text-brand" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-txt-main mb-1">
                Payment Culture
              </h4>
              <p className="text-sm text-secondary leading-relaxed">
                {finance.cashCulture.primaryPayment === "Cash"
                  ? "Cash is preferred here. Always carry small bills for easier transactions."
                  : "Cards are widely accepted. Digital payments are common."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
