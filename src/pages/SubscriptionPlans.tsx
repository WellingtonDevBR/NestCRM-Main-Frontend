
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SubscriptionPlans = () => {
  // Plans data structure
  const plans = [
    {
      name: "Starter",
      price: "$0",
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
      buttonText: "Start Free"
    },
    {
      name: "Growth",
      price: "$49",
      tagline: "Growing businesses needing automation and deeper insights",
      color: "bg-blue-500",
      colorClass: "from-blue-500 to-blue-400",
      features: [
        "Up to 5,000 customers tracked",
        "Advanced Churn Prediction Model (V2)",
        "Unlimited Real-time Risk Alerts",
        "Behavioral & Sentiment Analytics",
        "Automated Intervention Workflows",
        "Customizable Email Templates for Outreach",
        "Integration with Slack & CRM tools",
        "Weekly churn reports",
        "Priority email support (24h)"
      ],
      popular: true,
      buttonText: "Choose Growth"
    },
    {
      name: "Pro",
      price: "$149",
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
    },
    {
      name: "Enterprise",
      price: "Custom",
      tagline: "Large-scale platforms with high customer volumes",
      color: "bg-amber-500",
      colorClass: "from-amber-500 to-amber-400",
      features: [
        "Unlimited customers tracked",
        "Dedicated AI model tuning",
        "Custom data pipelines & analytics",
        "Onboarding & training sessions",
        "SOC 2 & HIPAA compliance options",
        "Role-based access control",
        "SLA-backed 24/7 support",
        "Account manager & quarterly reviews"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    {plan.price !== "Custom" && <span className="text-sm ml-1">/month</span>}
                  </div>
                  <CardDescription className={`${plan.popular ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {plan.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2 mt-4">
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
                <CardFooter>
                  <Button
                    variant={plan.name === "Enterprise" ? "outline" : "default"} 
                    className={`w-full ${plan.popular ? 'button-gradient' : ''}`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="container-custom mt-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Customizable Add-ons</h2>
              <p className="text-muted-foreground">
                Extend your plan with these powerful features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Users</CardTitle>
                  <CardDescription>$10/user/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Add more team members to collaborate on customer retention.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SMS Integration</CardTitle>
                  <CardDescription>Contact for pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Send SMS notifications for critical customer retention activities.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Predictive Revenue Forecasting</CardTitle>
                  <CardDescription>Contact for pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    AI-powered revenue projections based on customer behavior.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Multilingual Support</CardTitle>
                  <CardDescription>Contact for pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Communicate with customers in multiple languages.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* FAQs or CTA section could be added here */}
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
