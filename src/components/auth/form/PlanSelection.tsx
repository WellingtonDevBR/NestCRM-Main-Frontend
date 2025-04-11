
import { useState } from "react";
import { SignUpData } from "@/domain/auth/types";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { PlanCard } from "./plan/PlanCard";
import { plans, Plan } from "./plan/planData";

interface PlanSelectionProps {
  signupData: SignUpData;
  onContinue: (planId: string) => void;
  isLoading: boolean;
}

const PlanSelection = ({ signupData, onContinue, isLoading }: PlanSelectionProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0].id);
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = () => {
    onContinue(selectedPlanId);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2">
          Select the plan that best fits your business needs
        </p>
      </div>

      <RadioGroup value={selectedPlanId} onValueChange={handlePlanSelect} className="space-y-4">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
          />
        ))}
      </RadioGroup>

      <div className="flex justify-center mt-8">
        <Button 
          size="lg"
          onClick={handleContinue}
          disabled={isLoading}
          className="button-gradient min-w-44"
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default PlanSelection;
