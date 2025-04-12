
import React from "react";
import { formatPrice } from "@/utils/currencyUtils";

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  showCurrencyCode?: boolean;
  interval?: string;
  className?: string;
  trialDays?: number;
  trialAmount?: number;
}

/**
 * Reusable component for displaying prices with proper currency formatting
 * Can also show trial pricing information when applicable
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = "AUD",
  showCurrencyCode = false,
  interval,
  className = "",
  trialDays,
  trialAmount
}) => {
  const formattedPrice = formatPrice(amount, currency);
  const formattedTrialPrice = trialAmount !== undefined ? formatPrice(trialAmount, currency) : null;
  
  return (
    <span className={className}>
      {formattedPrice}
      {showCurrencyCode && <span className="text-xs ml-1">{currency}</span>}
      {interval && <span className="text-sm ml-1">/{interval}</span>}
      {trialDays && formattedTrialPrice && (
        <span className="text-xs ml-2 text-emerald-600">
          (First {trialDays} days: {formattedTrialPrice})
        </span>
      )}
    </span>
  );
};

export default PriceDisplay;
