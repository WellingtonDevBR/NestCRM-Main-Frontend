
import { Activity, AlertTriangle, BarChart4, BrainCircuit, Fingerprint, LineChart, MessageSquare, Shield, UserCheck, Zap } from "lucide-react";

const features = [
  {
    title: "AI-Powered Churn Prediction",
    description: "Our advanced machine learning model identifies patterns that indicate a customer is likely to churn before it happens.",
    icon: BrainCircuit
  },
  {
    title: "Real-time Risk Alerts",
    description: "Get immediate notifications when a high-value customer shows signs of disengagement.",
    icon: AlertTriangle
  },
  {
    title: "Customer Health Scoring",
    description: "A comprehensive health score that aggregates multiple metrics to give you a clear view of each customer's status.",
    icon: Activity
  },
  {
    title: "Behavioral Analytics",
    description: "Track usage patterns, engagement metrics, and interaction history to understand the 'why' behind potential churn.",
    icon: BarChart4
  },
  {
    title: "Automated Intervention Workflows",
    description: "Trigger the right response at the right time with customized workflows based on risk level.",
    icon: Zap
  },
  {
    title: "Personalized Outreach Tools",
    description: "Create targeted communication strategies for at-risk segments with customizable templates.",
    icon: MessageSquare
  },
  {
    title: "Retention Analytics Dashboard",
    description: "Visualize trends, track the effectiveness of retention strategies, and forecast future churn rates.",
    icon: LineChart
  },
  {
    title: "Customer Sentiment Analysis",
    description: "Understand emotional signals in customer communications to detect satisfaction levels.",
    icon: UserCheck
  },
  {
    title: "Secure Customer Data Processing",
    description: "Enterprise-grade security ensures your customer data is always protected and compliant.",
    icon: Shield
  },
  {
    title: "Unique Customer Fingerprinting",
    description: "Create detailed profiles that capture the unique characteristics and needs of each customer.",
    icon: Fingerprint
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-secondary/30 to-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Key Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Everything you need to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              prevent customer churn
            </span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            NestCRM combines powerful AI with intuitive tools to help you identify, understand, and address customer churn before it impacts your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group hover:bg-white transition-all duration-300 p-6 rounded-xl hover:shadow-md"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
