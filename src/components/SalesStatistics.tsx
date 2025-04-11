
import { CheckCircle, Heart, LineChart, Users } from "lucide-react";

const SalesStatistics = () => {
  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Potential Benefits
          </div>
          <h2 className="heading-lg mb-6">
            Designed to 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {" "}transform your customer retention
            </span>
          </h2>
          <p className="text-lg text-foreground/70">
            Our AI-powered platform is built to help companies of all sizes reduce churn and increase customer lifetime value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-secondary/30 rounded-xl p-6 text-center hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-4xl font-bold mb-2">100%</h3>
            <p className="text-foreground/70">Customer Visibility</p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-6 text-center hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-4xl font-bold mb-2">30%+</h3>
            <p className="text-foreground/70">Potential Churn Reduction</p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-6 text-center hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-4xl font-bold mb-2">95%</h3>
            <p className="text-foreground/70">Customer Satisfaction Target</p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-6 text-center hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-4xl font-bold mb-2">$1M+</h3>
            <p className="text-foreground/70">Potential Annual Savings</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesStatistics;
