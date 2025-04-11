
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeaturesProps {
  features: string[];
  color: string;
}

export const PlanFeatures = ({ features, color }: PlanFeaturesProps) => {
  return (
    <ul className="space-y-3.5">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <div className={cn(
            "rounded-full p-1 mt-0.5 flex-shrink-0 shadow-sm",
            color, "text-white"
          )}>
            <Check className="h-3 w-3" />
          </div>
          <span className="text-sm text-gray-700">
            {feature}
          </span>
        </li>
      ))}
    </ul>
  );
};
