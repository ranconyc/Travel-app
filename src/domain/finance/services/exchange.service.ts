/**
 * Exchange Rate Service
 * Provides currency conversion using cached exchange rates
 */

import exchangeRatesData from "@/data/world/exchangeRates.json";
import { ExchangeRates } from "@/types/finance.types";

const exchangeRates: ExchangeRates = exchangeRatesData;

class ExchangeService {
  /**
   * Get exchange rate between two currencies
   * @param from Source currency code (e.g., "USD")
   * @param to Target currency code (e.g., "ILS")
   * @returns Exchange rate or null if not found
   */
  getExchangeRate(from: string, to: string): number | null {
    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();

    // Same currency
    if (fromUpper === toUpper) return 1;

    // Base is USD
    if (fromUpper === "USD") {
      return exchangeRates.rates[toUpper] ?? null;
    }

    if (toUpper === "USD") {
      const rate = exchangeRates.rates[fromUpper];
      return rate ? 1 / rate : null;
    }

    // Cross-rate via USD
    const fromRate = exchangeRates.rates[fromUpper];
    const toRate = exchangeRates.rates[toUpper];

    if (!fromRate || !toRate) return null;

    return toRate / fromRate;
  }

  /**
   * Convert an amount from one currency to another
   * @param amount Amount to convert
   * @param from Source currency code
   * @param to Target currency code
   * @returns Converted amount or null if conversion not possible
   */
  convertAmount(amount: number, from: string, to: string): number | null {
    const rate = this.getExchangeRate(from, to);
    return rate ? amount * rate : null;
  }

  /**
   * Format exchange rate display string
   * @param from Source currency code
   * @param to Target currency code
   * @returns Formatted string like "1 USD ≈ 3.72 ILS"
   */
  formatRateDisplay(from: string, to: string): string | null {
    const rate = this.getExchangeRate(from, to);
    if (!rate) return null;

    return `1 ${from.toUpperCase()} ≈ ${rate.toFixed(2)} ${to.toUpperCase()}`;
  }

  /**
   * Get the timestamp of the last rate update
   */
  getLastUpdated(): string {
    return exchangeRates.lastUpdated;
  }

  /**
   * Check if a currency is supported
   */
  isCurrencySupported(code: string): boolean {
    return (
      code.toUpperCase() === "USD" || code.toUpperCase() in exchangeRates.rates
    );
  }
}

export const exchangeService = new ExchangeService();
