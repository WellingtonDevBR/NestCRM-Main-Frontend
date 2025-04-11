
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Badge, ShieldCheck, Zap, Sparkles, Clock, LineChart } from "lucide-react";

const CallToAction = () => {
  return (
    <section id="call-to-action" className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-10 md:p-16 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="heading-lg mb-6">Ready to transform your customer retention strategy?</h2>
                <p className="text-lg mb-8 text-foreground/70">
                  Be among the first to experience how NestCRM can predict and prevent customer churn before it happens.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <ShieldCheck className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Enterprise-grade security</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Badge className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">GDPR & privacy compliant</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Zap className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">Set up in minutes, not weeks</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Why Choose NestCRM?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">AI-Powered Predictions</h4>
                      <p className="text-foreground/70">Anticipate customer behavior before it happens with our advanced prediction models.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1">
                      <LineChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Actionable Insights</h4>
                      <p className="text-foreground/70">Convert data into clear action plans that increase retention and revenue.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Early Access Benefits</h4>
                      <p className="text-foreground/70">Join now to lock in founding member pricing and shape product development.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
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
