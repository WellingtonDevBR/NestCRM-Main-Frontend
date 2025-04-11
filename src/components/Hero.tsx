
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-[700px] bg-gradient-to-b from-purple-200/30 to-transparent"></div>
        <div className="absolute top-20 left-1/4 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
            <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 mb-8 rounded-full bg-gradient-to-r from-purple-100 to-purple-200/70 text-purple-700 text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-purple-600 mr-2"></span>
                AI-Powered Customer Retention
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-8">
                Stop Customer Churn{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                  Before It Happens
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                NESTCRM uses advanced AI to identify at-risk customers before they leave, helping you take action when it matters most.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <Link to="/signup">
                  <Button size="lg" className="button-gradient w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="border-purple-300 hover:bg-purple-50 w-full sm:w-auto">
                    Explore Features
                  </Button>
                </a>
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-foreground/70">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl mx-auto">
              <div className="relative z-10 shadow-xl rounded-lg transform transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                <img
                  src="/lovable-uploads/d8c7cdb8-0aa8-4444-865f-70e276a15f2a.png"
                  alt="NESTCRM Dashboard"
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
              <div className="absolute -top-6 -left-6 -right-6 -bottom-6 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl blur-xl -z-10"></div>
              <div className="absolute -top-2 -right-16 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-12 w-28 h-28 bg-purple-400/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
