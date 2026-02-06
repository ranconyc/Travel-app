"use client";

import { Wallet, CreditCard, Crown, Banknote, Smartphone } from "lucide-react";
import { countryBudgets } from "@/data/world/countryBudgets.json";
import { useCountry } from "../store/useCountryStore";
import { FinanceData, CountryBudgetData } from "@/types/finance.types";
import { exchangeService } from "@/domain/finance/services/exchange.service";
import { useUser } from "@/app/providers/UserProvider";

// Country code to currency code mapping (ISO 3166-1 alpha-3 → ISO 4217)
const countryCurrencies: Record<string, string> = {
  USA: "USD",
  GBR: "GBP",
  ISR: "ILS",
  FRA: "EUR",
  DEU: "EUR",
  ITA: "EUR",
  ESP: "EUR",
  NLD: "EUR",
  BEL: "EUR",
  AUT: "EUR",
  PRT: "EUR",
  IRL: "EUR",
  GRC: "EUR",
  FIN: "EUR",
  JPN: "JPY",
  CHN: "CNY",
  THA: "THB",
  IND: "INR",
  MXN: "MXN",
  MEX: "MXN",
  BRA: "BRL",
  AUS: "AUD",
  CAN: "CAD",
  CHE: "CHF",
  KOR: "KRW",
  SGP: "SGD",
  TUR: "TRY",
  ZAF: "ZAR",
  RUS: "RUB",
  POL: "PLN",
  CZE: "CZK",
  HUN: "HUF",
  SWE: "SEK",
  NOR: "NOK",
  DNK: "DKK",
  NZL: "NZD",
  MYS: "MYR",
  PHL: "PHP",
  IDN: "IDR",
  VNM: "VND",
  EGY: "EGP",
  ARE: "AED",
  SAU: "SAR",
};

// Currency name mappings for standard display
const currencyNames: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  ILS: "New Israeli Shekel",
  JPY: "Japanese Yen",
  CNY: "Chinese Yuan",
  THB: "Thai Baht",
  INR: "Indian Rupee",
  MXN: "Mexican Peso",
  BRL: "Brazilian Real",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  KRW: "South Korean Won",
  SGD: "Singapore Dollar",
  TRY: "Turkish Lira",
  ZAR: "South African Rand",
};

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  ILS: "₪",
  JPY: "¥",
  CNY: "¥",
  THB: "฿",
  INR: "₹",
  MXN: "$",
  BRL: "R$",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  KRW: "₩",
  SGD: "S$",
  TRY: "₺",
  ZAR: "R",
};

export const FinanceSection = () => {
  const country = useCountry();
  const user = useUser();

  if (!country) return null;

  // Extract data from country store with proper typing
  const finance = (country.finance as FinanceData) || {};
  const currency = finance.currency;

  if (!currency?.symbol) return null;

  // Get country code from country data (use cca3 for 3-letter code matching)
  const countryCode = country.cca3 || "DEFAULT";
  const localSymbol = currencySymbols[currency.code] || currency.symbol;

  // Get budget data from countryBudgets JSON with proper typing
  const budgetData: CountryBudgetData = (
    countryBudgets as Record<string, CountryBudgetData>
  )[countryCode] || {
    budget: 50,
    moderate: 100,
    luxury: 250,
    tip: "Tipping customs vary. 10% is generally safe for restaurants if service charge not included.",
  };

  // Get user's home currency from their homeBase country
  const homeCountryCode = (
    user?.profile?.homeBaseCity as { country?: { cca3?: string } }
  )?.country?.cca3;
  const userCurrency = homeCountryCode
    ? countryCurrencies[homeCountryCode] || "USD"
    : "USD";
  const userSymbol = currencySymbols[userCurrency] || "$";

  // Calculate exchange rate for display
  const exchangeRate = exchangeService.getExchangeRate("USD", currency.code);

  // Format budget showing local currency + user's home currency
  const formatBudgetDual = (
    amountUSD: number,
  ): { local: string; home: string } => {
    const localAmount = exchangeRate
      ? Math.round(amountUSD * exchangeRate)
      : null;

    // Convert USD to user's home currency if different
    let homeAmount = amountUSD;
    if (userCurrency !== "USD") {
      const homeRate = exchangeService.getExchangeRate("USD", userCurrency);
      if (homeRate) {
        homeAmount = Math.round(amountUSD * homeRate);
      }
    }

    return {
      local: localAmount
        ? `${localSymbol} ${localAmount.toLocaleString()}`
        : "",
      home: `${userSymbol} ${homeAmount}`,
    };
  };

  // Standard currency name
  const standardCurrencyName = currencyNames[currency.code] || currency.name;

  // Payment culture indicator
  const paymentCulture = budgetData.paymentCulture;

  return (
    <div className="px-5 py-6 flex flex-col gap-5 bg-surface rounded-3xl border border-surface-secondary text-txt-main shrink-0 w-[312px]">
      {/* Header */}
      <h2 className="text-2xl font-bold font-sora">Finance</h2>

      {/* Exchange Rate */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-lg font-bold">Exchange Rate</h3>
          <span className="text-sm text-secondary">Per $1</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary">
            {standardCurrencyName} ({localSymbol})
          </span>
          <span className="text-xl font-bold">
            {localSymbol}
            {exchangeRate?.toFixed(exchangeRate < 10 ? 2 : 0) || "—"}
          </span>
        </div>
      </div>

      {/* ATM Fees */}
      {finance.cashCulture?.atmAvailability && (
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-lg font-bold">ATM Fees</h3>
            <span className="text-sm text-secondary">
              {localSymbol} {exchangeRate ? Math.round(6 * exchangeRate) : "—"}
            </span>
          </div>
          <div className="flex justify-end">
            <span className="text-xl font-bold">{userSymbol} 6-7</span>
          </div>
        </div>
      )}

      {/* Daily Budget */}
      <div>
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="text-lg font-bold">Daily Budget</h3>
          <span className="text-sm text-secondary">Per day</span>
        </div>

        <div className="space-y-4">
          {/* Budget */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-success" />
              <span className="font-medium">Budget</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary">
                {formatBudgetDual(budgetData.budget).local}
              </p>
              <p className="text-lg font-bold">
                {formatBudgetDual(budgetData.budget).home}
              </p>
            </div>
          </div>

          {/* Mid-Range */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand" />
              <span className="font-medium">Mid-Range</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary">
                {formatBudgetDual(budgetData.moderate).local}
              </p>
              <p className="text-lg font-bold">
                {formatBudgetDual(budgetData.moderate).home}
              </p>
            </div>
          </div>

          {/* Luxury */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-brand-alt" />
              <span className="font-medium">Luxury</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary">
                {formatBudgetDual(budgetData.luxury).local}+
              </p>
              <p className="text-lg font-bold">
                {formatBudgetDual(budgetData.luxury).home} +
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tipping */}
      <div>
        <h3 className="text-lg font-bold mb-1">Tipping</h3>
        <p className="text-secondary text-sm">
          {budgetData.tipping?.notes ||
            budgetData.tip ||
            "Not required, but appreciated."}
        </p>
      </div>

      {/* Payment */}
      <div>
        <h3 className="text-lg font-bold mb-1">Payment</h3>
        <p className="text-secondary text-sm flex items-center gap-2">
          {paymentCulture === "cash" ? (
            <>
              <Banknote className="w-4 h-4" />
              Cash is king; Tap-to-Pay available in major cities.
            </>
          ) : paymentCulture === "digital" ? (
            <>
              <Smartphone className="w-4 h-4" />
              Digital payments widely accepted.
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Cards accepted; carry some cash for smaller shops.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
