
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { plans } from "@/components/auth/form/plan/planData";

const HomePricing = () => {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white to-secondary/20">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Pricing Plans
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Simple, transparent{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              pricing
            </span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include a {plans[0].trialDays}-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`border shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
              style={{
                animationDelay: `${index * 0.15}s`,
                animationFillMode: 'both'
              }}
            >
              <CardHeader className={`${plan.popular ? `bg-gradient-to-br ${plan.colorClass} text-white` : ""}`}>
                {plan.popular && (
                  <div className="mb-2 py-1 px-3 text-xs font-medium rounded-full bg-white/20 text-white w-fit">
                    MOST POPULAR
                  </div>
                )}
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.interval && <span className="text-sm ml-1 opacity-90">/{plan.interval}</span>}
                </div>
                <CardDescription className={`${plan.popular ? "text-white/90" : "text-muted-foreground"}`}>
                  {plan.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className={`rounded-full p-1 mt-0.5 flex-shrink-0 ${plan.color} text-white`}>
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pb-6">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full ${plan.popular ? "button-gradient" : "border-primary/30 hover:bg-primary/5"}`}
                  asChild
                >
                  <Link to={`/signup?plan=${plan.id}`}>
                    {plan.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            All plans include a {plans[0].trialDays}-day free trial. No credit card required to start.
          </p>
          <Button variant="link" asChild className="mt-2">
            <Link to="/pricing">Compare all features</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomePricing;
