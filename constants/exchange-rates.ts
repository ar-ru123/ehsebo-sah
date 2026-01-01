/**
 * Exchange rates configuration
 * Default rate: 1 USD = 100 RUB
 */

export const EXCHANGE_RATES = {
  USD_TO_RUB: 100,
  RUB_TO_USD: 0.01,
};

export const CURRENCIES = {
  USD: {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
    nameAr: 'دولار أمريكي',
  },
  RUB: {
    symbol: '₽',
    code: 'RUB',
    name: 'Russian Ruble',
    nameAr: 'روبل روسي',
  },
};

/**
 * Convert USD to RUB
 */
export function convertUsdToRub(usd: number): number {
  return usd * EXCHANGE_RATES.USD_TO_RUB;
}

/**
 * Convert RUB to USD
 */
export function convertRubToUsd(rub: number): number {
  return rub * EXCHANGE_RATES.RUB_TO_USD;
}

/**
 * Format currency value with proper separators
 */
export function formatCurrency(value: number, currency: 'USD' | 'RUB'): string {
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${CURRENCIES[currency].symbol}${formatted}`;
}
