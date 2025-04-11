
import { useState } from "react";
import { SignUpData } from "@/domain/auth/types";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { PlanCard } from "./plan/PlanCard";
import { plans, Plan } from "./plan/planData";
import { ArrowRight } from "lucide-react";

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

  // Find the selected plan to display info in the continue button
  const selectedPlan = plans.find(plan => plan.id === selectedPlanId);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Select the plan that best fits your business needs. All plans include a {plans[0].trialDays}-day trial.
        </p>
      </div>

      <RadioGroup 
        value={selectedPlanId} 
        onValueChange={handlePlanSelect} 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
          />
        ))}
      </RadioGroup>

      <div className="flex justify-center mt-10">
        <Button 
          size="lg"
          onClick={handleContinue}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 min-w-60 h-12 rounded-lg shadow-lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue with {selectedPlan?.name}
              <ArrowRight className="h-5 w-5" />
            </span>
          )}
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-2">
        <p>All plans include a {plans[0].trialDays}-day trial. Your card will only be charged after the trial period.</p>
      </div>
    </div>
  );
};

export default PlanSelection;
