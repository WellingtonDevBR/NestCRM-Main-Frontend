
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses just getting started.",
      price: isAnnual ? 29 : 39,
      features: [
        "Up to 1,000 customers",
        "Basic churn prediction",
        "Weekly risk reports",
        "Email support",
        "1 user account",
      ],
      cta: "Start Free Trial",
      highlight: false,
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses seeking advanced insights.",
      price: isAnnual ? 79 : 99,
      features: [
        "Up to 10,000 customers",
        "Advanced churn prediction",
        "Daily risk reports",
        "Customer segmentation",
        "Intervention recommendations",
        "Priority support",
        "5 user accounts",
      ],
      cta: "Start Free Trial",
      highlight: true,
    },
    {
      name: "Enterprise",
      description: "Customized solutions for large organizations.",
      price: isAnnual ? 299 : 399,
      features: [
        "Unlimited customers",
        "Custom prediction models",
        "Real-time risk alerts",
        "Advanced analytics",
        "API access",
        "Dedicated account manager",
        "Unlimited user accounts",
        "24/7 support",
      ],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block mb-4 bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>

          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Annual <span className="text-green-600 font-medium">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border-0 overflow-hidden relative ${
                plan.highlight 
                  ? 'shadow-xl scale-105 border-primary/20 z-10' 
                  : 'shadow-lg'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center text-sm py-1">
                  Most Popular
                </div>
              )}
              <CardHeader className={`pb-0 pt-6 ${plan.highlight ? 'pt-8' : ''}`}>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground h-12">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="space-y-3 list-styled mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-sm">{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pb-6">
                <Button 
                  className={`w-full ${plan.highlight ? '' : 'bg-secondary hover:bg-secondary/80 text-primary'}`} 
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          All plans include a 14-day free trial. No credit card required.
        </div>
      </div>
    </section>
  );
};

export default Pricing;
