
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
      <ol role="list" className="flex items-center w-full justify-between">
        {steps.map((step, stepIdx) => {
          const isActive = step.id === currentStep;
          const isCompleted = 
            (step.id === "form" && (currentStep === "plan_selection" || currentStep === "payment" || currentStep === "processing")) ||
            (step.id === "plan_selection" && (currentStep === "payment" || currentStep === "processing")) ||
            (step.id === "payment" && currentStep === "processing");
          
          return (
            <li
              key={step.id}
              className={`relative flex items-center ${stepIdx !== steps.length - 1 ? "flex-1" : ""}`}
            >
              {/* Step circle with number or check */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 
                  ${isCompleted 
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md" 
                    : isActive 
                      ? "border-2 border-primary bg-white shadow-sm" 
                      : "border-2 border-gray-200 bg-white"
                  }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" />
                ) : isActive ? (
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                ) : (
                  <span className="text-sm text-muted-foreground">{stepIdx + 1}</span>
                )}
              </div>
              
              {/* Step name */}
              <span 
                className={`ml-3 text-sm font-medium whitespace-nowrap
                  ${isActive ? "text-primary font-semibold" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}
              >
                {step.name}
              </span>

              {/* Connector line */}
              {stepIdx < steps.length - 1 && (
                <div 
                  className={`absolute left-12 right-0 h-0.5 top-5 mx-4
                    ${isCompleted ? "bg-gradient-to-r from-primary to-accent" : "bg-gray-200"}`}
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
