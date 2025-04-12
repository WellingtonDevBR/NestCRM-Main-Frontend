import React from "react";
import { Check, Circle } from "lucide-react";
import { Plan } from "./planData";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import PriceDisplay from "@/components/common/PriceDisplay";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected }) => {
  return (
    <Label
      htmlFor={`plan-${plan.id}`}
      className={`relative flex flex-col h-full border rounded-lg p-6 transition-all cursor-pointer ${
        isSelected 
          ? `ring-2 ring-primary bg-primary/5 border-primary/50` 
          : "border-muted hover:border-primary/30 hover:bg-primary/[0.02]"
      }`}
    >
      {plan.popular && (
        <div className={`absolute -top-3 right-4 px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${plan.colorClass} text-white`}>
          Most Popular
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">{plan.name}</h3>
          <div className="mt-1 mb-2 flex items-baseline">
            <PriceDisplay 
              amount={plan.priceValue} 
              currency={plan.currency}
              interval={plan.interval}
              className="text-2xl font-bold"
            />
          </div>
          <p className="text-sm text-muted-foreground">{plan.tagline}</p>
        </div>

        <RadioGroupItem 
          value={plan.id} 
          id={`plan-${plan.id}`}
          className="mt-1"
        />
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <div className={`rounded-full p-1 ${plan.color} text-white mt-0.5 flex-shrink-0`}>
              <Check className="h-3 w-3" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex-shrink-0">
        {isSelected ? (
          <div className={`w-full py-2 px-4 rounded bg-primary/10 text-primary text-center text-sm font-medium`}>
            Selected
          </div>
        ) : (
          <div className="w-full py-2 px-4 rounded border border-muted text-center text-sm text-muted-foreground">
            Select Plan
          </div>
        )}
      </div>
    </Label>
  );
};
