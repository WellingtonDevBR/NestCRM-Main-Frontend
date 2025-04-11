
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
  return (
    <div className={cn(
      "relative",
      isSelected ? "scale-[1.01]" : ""
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
          className={`border h-full ${
            isSelected 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'border-border hover:border-primary/40'
          } transition-all rounded-xl shadow-sm overflow-hidden`}
        >
          <CardHeader className={cn(
            "px-6 py-4",
            plan.popular ? `bg-primary text-white` : ''
          )}>
            <div className="flex justify-between items-start">
              <div>
                {plan.popular && (
                  <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30">
                    MOST POPULAR
                  </Badge>
                )}
                {plan.trial && !plan.popular && (
                  <Badge variant="outline" className="mb-2 bg-amber-500/10 text-amber-600 border-amber-200">
                    14-DAY FREE TRIAL
                  </Badge>
                )}
              </div>
              {isSelected && plan.id === "starter" && (
                <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
            
            <CardTitle className="text-2xl font-bold">
              {plan.name}
            </CardTitle>
            
            <div className="mt-1">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.interval && <span className="text-sm ml-1 opacity-90">/{plan.interval}</span>}
            </div>
            
            <CardDescription className={cn(
              "mt-1",
              plan.popular ? "text-white/90" : "text-muted-foreground"
            )}>
              {plan.tagline}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <PlanFeatures features={plan.features} color={plan.popular ? "bg-primary" : plan.id === "starter" ? "bg-green-500" : "bg-purple-500"} />
          </CardContent>
        </Card>
      </Label>
      
      {isSelected && plan.id !== "starter" && (
        <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg z-10">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
