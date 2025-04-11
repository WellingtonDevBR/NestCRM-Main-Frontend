
import React from "react";
import { Check } from "lucide-react";

interface PlanFeaturesProps {
  features: string[];
  color: string;
}

export const PlanFeatures = ({ features, color }: PlanFeaturesProps) => {
  return (
    <ul className="space-y-2">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2">
          <div className={`rounded-full p-1 mt-0.5 ${color} text-white flex-shrink-0`}>
            <Check className="h-3 w-3" />
          </div>
          <span className="text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  );
};
