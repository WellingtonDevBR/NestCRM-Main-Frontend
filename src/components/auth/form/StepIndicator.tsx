
import { Check } from "lucide-react";

export type SignupStep = "form" | "plan_selection" | "processing";

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
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => {
          const isActive = step.id === currentStep;
          const isCompleted = 
            (step.id === "form" && (currentStep === "plan_selection" || currentStep === "processing")) ||
            (step.id === "plan_selection" && currentStep === "processing");
          
          return (
            <li
              key={step.id}
              className={`relative ${stepIdx !== steps.length - 1 ? "pr-8 flex-1" : ""}`}
            >
              <div className="flex items-center">
                {/* Step circle */}
                <div className="absolute flex items-center justify-center w-6 h-6 rounded-full">
                  {isCompleted ? (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  ) : isActive ? (
                    <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                
                {/* Step name */}
                <span 
                  className={`ml-8 text-sm font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              
              {/* Connecting line */}
              {stepIdx < steps.length - 1 && (
                <div 
                  className="absolute top-3 h-0.5" 
                  style={{ 
                    left: "1.5rem", 
                    right: "0.75rem",
                    backgroundColor: isCompleted ? "var(--primary)" : "#e5e7eb" // Use CSS var for primary or gray
                  }}
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
