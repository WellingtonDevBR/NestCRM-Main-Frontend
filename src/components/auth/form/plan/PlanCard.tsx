
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
    <div className="relative transition-transform duration-200 hover:scale-[1.02]">
      <RadioGroupItem 
        value={plan.id} 
        id={`plan-${plan.id}`}
        className="peer sr-only"
      />
      <Label 
        htmlFor={`plan-${plan.id}`} 
        className="cursor-pointer block h-full"
      >
        <Card 
          className={`border-2 ${
            isSelected 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'border-border hover:border-primary/40'
          } transition-all rounded-xl shadow-sm h-full`}
        >
          <CardHeader className={`${
            plan.popular 
              ? 'bg-gradient-to-br ' + plan.colorClass + ' text-white rounded-t-lg' 
              : ''
          }`}>
            {plan.popular && (
              <div className="mb-2 py-1 px-3 text-xs font-medium rounded-full bg-white/20 text-white w-fit animate-pulse">
                MOST POPULAR
              </div>
            )}
            {plan.trial && (
              <div className="mb-2 py-1 px-3 text-xs font-medium rounded-full bg-amber-500 text-white w-fit shadow-sm">
                {plan.trialDays}-DAY FREE TRIAL
              </div>
            )}
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              {plan.name}
              {isSelected && (
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-primary">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.interval && <span className="text-sm ml-1">/{plan.interval}</span>}
            </div>
            <CardDescription className={`${plan.popular ? 'text-white/90' : 'text-muted-foreground'} mt-1`}>
              {plan.tagline}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <PlanFeatures features={plan.features} color={plan.color} />
          </CardContent>
        </Card>
      </Label>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
