
// Plan types and properties
export interface Plan {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  priceId: string; // Stripe price ID
  productId: string; // Stripe product ID
  interval?: string;
  tagline: string;
  color: string;
  colorClass: string;
  features: string[];
  popular: boolean;
  buttonText: string;
  trial: boolean;
  trialDays: number;
}

// Plans data structure
export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    priceValue: 0,
    priceId: "price_starter", // Will be mapped in the edge function
    productId: "prod_S6teQSASB4q3me", // Starter product ID
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
      "Credit card required"
    ],
    popular: false,
    buttonText: "Start Free Trial",
    trial: true,
    trialDays: 14
  },
  {
    id: "growth",
    name: "Growth",
    price: "$49",
    priceValue: 4900,
    priceId: "price_growth", // Changed to a simple identifier that will be mapped in the edge function
    productId: "prod_S6tf3FcTLazhdW", // Growth product ID
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
    buttonText: "Choose Growth",
    trial: true,
    trialDays: 14
  },
  {
    id: "pro",
    name: "Pro",
    price: "$149",
    priceValue: 14900, 
    priceId: "price_pro", // Changed to a simple identifier that will be mapped in the edge function
    productId: "prod_S6tflZPV1ei1dL", // Pro product ID
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
    buttonText: "Choose Pro",
    trial: true,
    trialDays: 14
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    priceValue: 0, // Custom pricing
    priceId: "price_enterprise",
    productId: "prod_enterprise",
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
    buttonText: "Contact Sales",
    trial: false,
    trialDays: 0
  }
];
