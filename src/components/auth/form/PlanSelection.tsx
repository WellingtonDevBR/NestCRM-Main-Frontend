
import { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SignUpData } from "@/domain/auth/types";

// Plan types and properties
export interface Plan {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  priceId: string; // Stripe price ID
  interval?: string;
  tagline: string;
  color: string;
  colorClass: string;
  features: string[];
  popular: boolean;
  buttonText: string;
  trial?: boolean;
  trialDays?: number;
}

interface PlanSelectionProps {
  signupData: SignUpData;
  onContinue: (planId: string) => void;
  isLoading: boolean;
}

// Plans data structure
const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    priceValue: 0,
    priceId: "price_starter_free", // This would be your actual Stripe price ID
    tagline: "Small teams exploring AI-powered churn prevention",
    color: "bg-emerald-500",
    colorClass: "from-emerald-500 to-emerald-400",
    features: [
      "14-day full feature trial",
      "Up to 100 customers tracked",
      "Basic Churn Prediction Model (V1)",
      "Customer Health Scoring",
      "Real-time Risk Alerts (Limited to 10/month)",
      "Access to Retention Dashboard (basic view)",
      "Email support (response in 48h)",
      "No credit card required"
    ],
    popular: false,
    buttonText: "Start Free",
    trial: true,
    trialDays: 14
  },
  {
    id: "growth",
    name: "Growth",
    price: "$49",
    priceValue: 4900,
    priceId: "price_growth_monthly", // This would be your actual Stripe price ID
    interval: "month",
    tagline: "Growing businesses needing automation and deeper insights",
    color: "bg-blue-500",
    colorClass: "from-blue-500 to-blue-400",
    features: [
      "Up to 5,000 customers tracked",
      "Advanced Churn Prediction Model (V2)",
      "Unlimited Real-time Risk Alerts",
      "Behavioral & Sentiment Analytics",
      "Customizable Email Templates for Outreach",
      "Integration with Slack & CRM tools",
      "Weekly churn reports",
      "Priority email support (24h)"
    ],
    popular: true,
    buttonText: "Choose Growth"
  },
  {
    id: "pro",
    name: "Pro",
    price: "$149",
    priceValue: 14900, 
    priceId: "price_pro_monthly", // This would be your actual Stripe price ID
    interval: "month",
    tagline: "Customer success teams and scaling SaaS businesses",
    color: "bg-purple-600",
    colorClass: "from-purple-600 to-purple-500",
    features: [
      "Up to 50,000 customers tracked",
      "Custom Risk Scoring Models",
      "Customer Fingerprinting & Segmentation",
      "Retention Strategy Simulator",
      "In-app Messaging Tools",
      "A/B testing for outreach workflows",
      "Advanced Analytics Dashboard",
      "API access for custom integrations",
      "Live Chat Support"
    ],
    popular: false,
    buttonText: "Choose Pro"
  }
];

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
          <div key={plan.id} className="relative">
            <RadioGroupItem 
              value={plan.id} 
              id={`plan-${plan.id}`}
              className="peer sr-only"
            />
            <Label 
              htmlFor={`plan-${plan.id}`} 
              className="cursor-pointer"
            >
              <Card className={`border-2 ${selectedPlanId === plan.id ? 'border-primary' : 'border-border'} transition-all hover:border-primary/50 shadow-sm h-full`}>
                <CardHeader className={`${plan.popular ? 'bg-gradient-to-br ' + plan.colorClass + ' text-white' : ''}`}>
                  {plan.popular && (
                    <div className="mb-2 py-1 px-3 text-xs font-medium rounded-full bg-white/20 text-white w-fit">
                      MOST POPULAR
                    </div>
                  )}
                  <CardTitle className="text-2xl font-bold flex items-center justify-between">
                    {plan.name}
                    {selectedPlanId === plan.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </CardTitle>
                  <div className="mt-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.interval && <span className="text-sm ml-1">/{plan.interval}</span>}
                  </div>
                  <CardDescription className={`${plan.popular ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {plan.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className={`rounded-full p-1 mt-0.5 ${plan.color} text-white flex-shrink-0`}>
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Label>
          </div>
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
export { plans };
