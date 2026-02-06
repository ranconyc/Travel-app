/**
 * Finance-related TypeScript interfaces
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface BudgetLevels {
  budget: number;
  moderate: number;
  luxury: number;
}

export interface CashCulture {
  tipping: string;
  atmAvailability: string;
  primaryPayment?: string;
  tapToPay?: boolean;
}

export interface FinanceData {
  currency?: Currency;
  avgDailyCost?: {
    budget?: number;
    mid?: number;
    luxury?: number;
    currencyCode?: string;
  };
  cashCulture?: CashCulture;
}

export interface CountryBudgetData {
  budget: number;
  moderate: number;
  luxury: number;
  tip?: string; // legacy single-string format
  tipping?: TippingInfo;
  paymentCulture?: "cash" | "digital" | "mixed";
}

export interface TippingInfo {
  restaurant?: string;
  taxi?: string;
  hotel?: string;
  notes?: string;
}

export interface ExchangeRates {
  base: string;
  lastUpdated: string;
  rates: Record<string, number>;
}
