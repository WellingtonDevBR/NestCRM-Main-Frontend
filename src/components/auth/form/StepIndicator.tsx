
import React from "react";
import { CircleCheck, CircleIcon, LocateIcon } from "lucide-react";

export type SignupStep = "form" | "plan_selection" | "processing";

interface StepIndicatorProps {
  currentStep: SignupStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: "form", label: "Your Information" },
    { id: "plan_selection", label: "Select Plan" },
    { id: "processing", label: "Complete Setup" }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = getStepValue(step.id) < getStepValue(currentStep);
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${isActive ? 'border-primary bg-primary/10' : 
                    isCompleted ? 'border-primary bg-primary text-white' : 
                    'border-gray-200 bg-gray-50'}
                  mb-1
                `}>
                  {isCompleted ? (
                    <CircleCheck className="w-5 h-5 text-white" />
                  ) : isActive ? (
                    <LocateIcon className="w-5 h-5 text-primary" />
                  ) : (
                    <CircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className={`text-xs font-medium text-center 
                  ${isActive ? 'text-primary' : 
                    isCompleted ? 'text-primary' : 
                    'text-muted-foreground'}`}>
                  {step.label}
                </div>
              </div>
              
              {/* Connection line between steps */}
              {index < steps.length - 1 && (
                <div className={`flex-grow h-0.5 mx-2 
                  ${getStepValue(step.id) < getStepValue(currentStep) ? 
                  'bg-primary' : 'bg-gray-200'}`}>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to convert step ID to numeric value for comparison
function getStepValue(step: string): number {
  switch (step) {
    case "form": return 1;
    case "plan_selection": return 2;
    case "processing": return 3;
    default: return 0;
  }
}

export default StepIndicator;
