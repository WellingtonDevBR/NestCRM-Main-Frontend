
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
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={`relative ${
              stepIdx !== steps.length - 1 ? "flex-1" : ""
            }`}
          >
            {/* Step indicator circle */}
            {step.id === currentStep ? (
              <div className="flex items-center" aria-current="step">
                <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <span className="ml-8 text-sm font-medium text-primary">
                  {step.name}
                </span>
              </div>
            ) : step.id === "form" && (currentStep === "plan_selection" || currentStep === "processing") ? (
              <div className="group flex items-center">
                <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="ml-8 text-sm font-medium text-muted-foreground">
                  {step.name}
                </span>
              </div>
            ) : step.id === "plan_selection" && currentStep === "processing" ? (
              <div className="group flex items-center">
                <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="ml-8 text-sm font-medium text-muted-foreground">
                  {step.name}
                </span>
              </div>
            ) : (
              <div className="group flex items-center">
                <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                </span>
                <span className="ml-8 text-sm font-medium text-muted-foreground">
                  {step.name}
                </span>
              </div>
            )}
            
            {/* Connecting line between steps */}
            {stepIdx !== steps.length - 1 ? (
              <div
                className={`absolute top-3 left-0 -ml-px h-0.5 w-full ${
                  (stepIdx === 0 && currentStep !== "form") ||
                  (stepIdx === 1 && currentStep === "processing")
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
                style={{ transform: "translateX(3px)", width: "calc(100% - 6px)" }}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;
