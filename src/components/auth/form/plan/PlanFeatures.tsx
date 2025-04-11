
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeaturesProps {
  features: string[];
  color: string;
}

export const PlanFeatures = ({ features, color }: PlanFeaturesProps) => {
  return (
    <ul className="space-y-2">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2.5 group">
          <div className={cn(
            "rounded-full p-1 mt-0.5 flex-shrink-0 transition-colors",
            color, "text-white shadow-sm"
          )}>
            <Check className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm text-gray-700 group-hover:text-foreground/90 transition-colors">
            {feature}
          </span>
        </li>
      ))}
    </ul>
  );
};
