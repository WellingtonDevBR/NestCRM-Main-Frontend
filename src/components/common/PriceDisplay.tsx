
import React from "react";
import { formatPrice } from "@/utils/currencyUtils";

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  showCurrencyCode?: boolean;
  interval?: string;
  className?: string;
}

/**
 * Reusable component for displaying prices with proper currency formatting
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = "AUD",
  showCurrencyCode = false,
  interval,
  className = ""
}) => {
  const formattedPrice = formatPrice(amount, currency);
  
  return (
    <span className={className}>
      {formattedPrice}
      {showCurrencyCode && <span className="text-xs ml-1">{currency}</span>}
      {interval && <span className="text-sm ml-1">/{interval}</span>}
    </span>
  );
};

export default PriceDisplay;
