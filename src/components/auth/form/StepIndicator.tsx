
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted 
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-md" 
                      : isActive 
                        ? "border-2 border-primary bg-white/80 backdrop-blur-sm shadow-sm" 
                        : "border-2 border-gray-200 bg-white/50"
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
                  className={`ml-3 text-sm font-medium transition-all duration-300 ${
                    isActive ? "text-primary font-semibold" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              
              {/* Connecting line */}
              {stepIdx < steps.length - 1 && (
                <div 
                  className={`absolute left-5 top-5 -ml-px h-0.5 w-full transition-all duration-300 ${
                    isCompleted ? "bg-gradient-to-r from-primary to-accent" : "bg-gray-200"
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
