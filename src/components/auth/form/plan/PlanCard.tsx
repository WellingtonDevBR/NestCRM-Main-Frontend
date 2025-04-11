
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plan } from "./planData";
import { PlanFeatures } from "./PlanFeatures";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
}

export const PlanCard = ({ plan, isSelected }: PlanCardProps) => {
  const getPlanBadgeText = () => {
    if (plan.id === "starter") return "14-DAY FREE TRIAL";
    if (plan.popular) return "MOST POPULAR";
    return null;
  };

  const badgeText = getPlanBadgeText();
  
  return (
    <div className={cn(
      "relative transition-all",
      isSelected ? "scale-[1.02]" : ""
    )}>
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
          className={cn(
            "border h-full transition-all rounded-xl shadow-sm overflow-hidden",
            isSelected 
              ? 'border-primary/60 ring-2 ring-primary/30' 
              : 'border-border hover:border-primary/40'
          )}
        >
          <CardHeader className={cn(
            "px-6 py-4",
            plan.popular ? `bg-primary text-white` : ''
          )}>
            {badgeText && (
              <Badge className={cn(
                "mb-2",
                plan.popular 
                  ? "bg-white/20 text-white hover:bg-white/30" 
                  : "bg-amber-500/10 text-amber-600 border-amber-200"
              )}>
                {badgeText}
              </Badge>
            )}
            
            <CardTitle className="text-xl font-bold">
              {plan.name}
            </CardTitle>
            
            <div className="mt-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.interval && <span className="text-sm ml-1 opacity-90">/{plan.interval}</span>}
            </div>
            
            <CardDescription className={cn(
              "mt-2 text-sm",
              plan.popular ? "text-white/90" : "text-muted-foreground"
            )}>
              {plan.tagline}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <PlanFeatures features={plan.features} color={plan.id === "starter" ? "bg-green-500" : plan.popular ? "bg-primary" : "bg-purple-700"} />
          </CardContent>
        </Card>
      </Label>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg z-10">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
