
/**
 * Currency configuration for the subscription system
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  position: 'before' | 'after';
  decimalPlaces: number;
  thousandSeparator: string;
  decimalSeparator: string;
}

// Supported currencies configuration
export const currencies: Record<string, CurrencyConfig> = {
  AUD: {
    code: 'AUD',
    symbol: '$',
    position: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    position: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.'
  }
  // Add more currencies as needed
};

// Default currency for the application
export const DEFAULT_CURRENCY = 'AUD';

/**
 * Format a price amount according to the specified currency
 */
export function formatPrice(amount: number, currencyCode = DEFAULT_CURRENCY): string {
  const currency = currencies[currencyCode] || currencies[DEFAULT_CURRENCY];
  
  // Format the number with proper decimal places
  const formattedNumber = amount.toFixed(currency.decimalPlaces)
    .replace('.', currency.decimalSeparator)
    .replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandSeparator);
  
  // Return formatted price with currency symbol in the proper position
  return currency.position === 'before' 
    ? `${currency.symbol}${formattedNumber}` 
    : `${formattedNumber}${currency.symbol}`;
}

/**
 * Convert display price (like $49) to cents for Stripe (4900)
 */
export function priceToCents(price: number): number {
  return Math.round(price * 100);
}

/**
 * Convert cents from Stripe (4900) to display price ($49)
 */
export function centsToPrice(cents: number): number {
  return cents / 100;
}
