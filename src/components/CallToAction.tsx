
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Badge, ShieldCheck, Zap } from "lucide-react";

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
                  Join thousands of forward-thinking businesses that use NestCRM to predict and prevent customer churn before it happens.
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
              
              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">What our customers are saying</h3>
                  <blockquote className="text-foreground/80 italic mb-6">
                    "Within just 3 months of implementing NestCRM, we reduced customer churn by 37% and increased our MRR by 22%. The ROI was immediate and substantial."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-semibold text-purple-600">SJ</span>
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-foreground/60">Head of Customer Success, TechFlow</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-64 h-28 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-lg blur-xl -z-10"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <p className="text-lg font-medium mb-8">Trusted by innovative companies worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white/60 p-4 rounded-lg flex items-center justify-center h-16">
                <span className="font-bold text-lg text-gray-400">COMPANY A</span>
              </div>
              <div className="bg-white/60 p-4 rounded-lg flex items-center justify-center h-16">
                <span className="font-bold text-lg text-gray-400">COMPANY B</span>
              </div>
              <div className="bg-white/60 p-4 rounded-lg flex items-center justify-center h-16">
                <span className="font-bold text-lg text-gray-400">COMPANY C</span>
              </div>
              <div className="bg-white/60 p-4 rounded-lg flex items-center justify-center h-16">
                <span className="font-bold text-lg text-gray-400">COMPANY D</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
