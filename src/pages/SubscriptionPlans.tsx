
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PlanFeatures } from "@/components/auth/form/plan/PlanFeatures";
import { plans } from "@/components/auth/form/plan/planData";

const SubscriptionPlans = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <div className="container-custom mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              Choose the Right Plan for Your Business
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              AI-powered customer retention that grows with your needs.
              All plans include our core churn prevention technology.
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`border shadow-lg overflow-hidden h-full flex flex-col ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className={`${plan.popular ? 'bg-gradient-to-br ' + plan.colorClass + ' text-white' : ''}`}>
                  {plan.popular && (
                    <div className="mb-2 py-1 px-3 text-xs font-medium rounded-full bg-white/20 text-white w-fit">
                      MOST POPULAR
                    </div>
                  )}
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.interval && <span className="text-sm ml-1">/{plan.interval}</span>}
                  </div>
                  <CardDescription className={`${plan.popular ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {plan.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <PlanFeatures features={plan.features} color={plan.color} />
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.id === "enterprise" ? "outline" : "default"} 
                    className={`w-full ${plan.popular ? 'button-gradient' : ''}`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="container-custom mt-16">
          <div className="bg-muted p-8 rounded-lg text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
            <p className="mb-6 text-muted-foreground">
              Contact our team to discuss your specific requirements and get a personalized quote.
            </p>
            <Button size="lg" className="button-gradient">Contact Sales Team</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionPlans;
