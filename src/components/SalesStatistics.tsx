
import { CheckCircle, Heart, LineChart, Users } from "lucide-react";

const SalesStatistics = () => {
  return (
    <section className="bg-white py-20">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Potential Benefits
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Designed to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              transform your customer retention
            </span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our AI-powered platform is built to help companies of all sizes reduce churn and increase customer lifetime value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-secondary/30 rounded-xl p-8 text-center hover:shadow-md transition-all hover:translate-y-[-5px] duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-700">100%</h3>
            <p className="text-foreground/70 font-medium">Customer Visibility</p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-8 text-center hover:shadow-md transition-all hover:translate-y-[-5px] duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <LineChart className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-700">30%+</h3>
            <p className="text-foreground/70 font-medium">Potential Churn Reduction</p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-8 text-center hover:shadow-md transition-all hover:translate-y-[-5px] duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-700">95%</h3>
            <p className="text-foreground/70 font-medium">Customer Satisfaction Target</p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-8 text-center hover:shadow-md transition-all hover:translate-y-[-5px] duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-700">$1M+</h3>
            <p className="text-foreground/70 font-medium">Potential Annual Savings</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesStatistics;
