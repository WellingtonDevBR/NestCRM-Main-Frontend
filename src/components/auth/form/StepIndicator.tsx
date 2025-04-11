
import { Check } from "lucide-react";

export type SignupStep = "form" | "plan_selection" | "payment" | "processing";

interface StepIndicatorProps {
  currentStep: SignupStep;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    { id: "form", name: "Account Details" },
    { id: "plan_selection", name: "Select Plan" },
    { id: "processing", name: "Complete" },
  ];

  return (
    <div className="mb-8">
      <ol className="flex items-center w-full">
        {steps.map((step, stepIdx) => {
          const isActive = step.id === currentStep;
          const isCompleted = 
            (step.id === "form" && (currentStep === "plan_selection" || currentStep === "processing")) ||
            (step.id === "plan_selection" && currentStep === "processing");
          
          return (
            <li
              key={step.id}
              className={`flex items-center ${stepIdx !== steps.length - 1 ? "flex-1" : ""}`}
            >
              {/* Step circle with number or check */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-200
                  ${isCompleted 
                    ? "bg-primary text-white" 
                    : isActive 
                      ? "border-2 border-primary bg-white shadow-sm" 
                      : "border-2 border-gray-200 bg-white"
                  }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {stepIdx + 1}
                  </span>
                )}
              </div>
              
              {/* Step name */}
              <span 
                className={`ml-2 text-sm font-medium
                  ${isActive ? "text-primary font-semibold" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}
              >
                {step.name}
              </span>

              {/* Connector line */}
              {stepIdx < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div 
                    className={`h-0.5 ${isCompleted ? "bg-primary" : "bg-gray-200"}`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default StepIndicator;
