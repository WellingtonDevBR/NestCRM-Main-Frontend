
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plan } from "./planData";
import { PlanFeatures } from "./PlanFeatures";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
}

export const PlanCard = ({ plan, isSelected }: PlanCardProps) => {
  return (
    <div className="relative">
      <RadioGroupItem 
        value={plan.id} 
        id={`plan-${plan.id}`}
        className="peer sr-only"
      />
      <Label 
        htmlFor={`plan-${plan.id}`} 
        className="cursor-pointer"
      >
        <Card className={`border-2 ${isSelected ? 'border-primary' : 'border-border'} transition-all hover:border-primary/50 shadow-sm h-full`}>
          <CardHeader className={`${plan.popular ? 'bg-gradient-to-br ' + plan.colorClass + ' text-white' : ''}`}>
            {plan.popular && (
              <div className="mb-2 py-1 px-3 text-xs font-medium rounded-full bg-white/20 text-white w-fit">
                MOST POPULAR
              </div>
            )}
            {plan.trial && (
              <div className="mb-2 py-1 px-3 text-xs font-medium rounded-full bg-amber-500 text-white w-fit">
                {plan.trialDays}-DAY FREE TRIAL
              </div>
            )}
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              {plan.name}
              {isSelected && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </CardTitle>
            <div className="mt-1">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.interval && <span className="text-sm ml-1">/{plan.interval}</span>}
            </div>
            <CardDescription className={`${plan.popular ? 'text-white/90' : 'text-muted-foreground'}`}>
              {plan.tagline}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <PlanFeatures features={plan.features} color={plan.color} />
          </CardContent>
        </Card>
      </Label>
    </div>
  );
};
