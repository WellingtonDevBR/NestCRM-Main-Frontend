
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section id="call-to-action" className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom">
        <div className="max-w-5xl mx-auto text-center">
          <div className="glass-card p-10 md:p-16 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            
            <h2 className="heading-lg mb-6">Ready to grow your business?</h2>
            <p className="text-lg mb-8 text-foreground/70 max-w-2xl mx-auto">
              Join thousands of businesses using NestCRM to improve customer retention and increase revenue.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="button-gradient">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-purple-300 hover:bg-purple-50">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-20">
            <p className="text-lg font-medium mb-6">Launch Promotion</p>
            <div className="bg-white/60 p-6 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-primary mb-2">Early Adopter Discount</h3>
              <p className="text-foreground/80 mb-4">
                Sign up during our beta period and receive 30% off any plan for the first 12 months!
              </p>
              <Link to="/signup">
                <Button className="bg-accent hover:bg-accent/90 text-white">
                  Claim Discount
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
