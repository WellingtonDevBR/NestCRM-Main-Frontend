
import { Check } from "lucide-react";

export type SignupStep = "form" | "plan_selection" | "payment" | "processing";

interface StepIndicatorProps {
  currentStep: SignupStep;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    { id: "form", name: "Account Details" },
    { id: "plan_selection", name: "Select Plan" },
    { id: "payment", name: "Payment" },
    { id: "processing", name: "Complete" },
  ];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => {
          const isActive = step.id === currentStep;
          const isCompleted = 
            (step.id === "form" && (currentStep === "plan_selection" || currentStep === "payment" || currentStep === "processing")) ||
            (step.id === "plan_selection" && (currentStep === "payment" || currentStep === "processing")) ||
            (step.id === "payment" && currentStep === "processing");
          
          return (
            <li
              key={step.id}
              className={`relative ${stepIdx !== steps.length - 1 ? "pr-8 flex-1" : ""}`}
            >
              <div className="flex items-center">
                {/* Step circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? "bg-primary" 
                      : isActive 
                        ? "border-2 border-primary" 
                        : "border-2 border-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : isActive ? (
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  ) : null}
                </div>
                
                {/* Step name */}
                <span 
                  className={`ml-3 text-sm font-medium ${
                    isActive ? "text-primary" : isCompleted ? "text-gray-900" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              
              {/* Connecting line */}
              {stepIdx < steps.length - 1 && (
                <div 
                  className={`absolute left-4 top-4 -ml-px h-0.5 w-full ${
                    isCompleted ? "bg-primary" : "bg-gray-300"
                  }`}
                  style={{ transform: "translateY(-50%)" }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;
