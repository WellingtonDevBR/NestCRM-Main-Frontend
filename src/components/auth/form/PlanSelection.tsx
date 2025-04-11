
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  // Get the plan from URL parameters if available
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlPlanId = searchParams.get('plan');
  
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0].id);
  
  // Effect to set the selected plan from URL if available
  useEffect(() => {
    if (urlPlanId) {
      const planExists = plans.some(plan => plan.id === urlPlanId);
      if (planExists) {
        setSelectedPlanId(urlPlanId);
      }
    }
  }, [urlPlanId]);
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = () => {
    onContinue(selectedPlanId);
  };

  // Find the selected plan to display info in the continue button
  const selectedPlan = plans.find(plan => plan.id === selectedPlanId);

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Select the plan that best fits your business needs. All plans include a {plans[0].trialDays}-day trial.
        </p>
      </div>

      <RadioGroup 
        value={selectedPlanId} 
        onValueChange={handlePlanSelect}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
          className="bg-primary hover:opacity-90 transition-all duration-300 min-w-52 h-11 rounded-md shadow-md"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue with {selectedPlan?.name}
              <ArrowRight className="h-4 w-4" />
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
