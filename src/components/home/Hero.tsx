
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Subtle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        const scrollY = window.scrollY;
        backgroundRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background elements */}
      <div 
        ref={backgroundRef} 
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-50 to-blue-100 opacity-70 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-50 to-purple-100 opacity-70 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-36 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-block mb-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <span className="text-sm font-medium text-primary">Predict customer behavior with AI</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-slide-up">
            Stop customer churn before it happens
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: "0.1s"}}>
            NestCRM predicts which customers are at risk of leaving, so you can take action before it's too late.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{animationDelay: "0.2s"}}>
            <Button size="lg" className="shadow-lg hover-lift">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="hover-lift">
              Book a Demo
            </Button>
          </div>
          
          <div className="mt-20 relative animate-scale-in" style={{animationDelay: "0.3s"}}>
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none h-12 bottom-0 top-auto"></div>
            <div className="relative shadow-2xl rounded-xl overflow-hidden border border-gray-100 floating-shadow">
              <img 
                src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80" 
                alt="Dashboard Preview" 
                className="w-full h-auto rounded-xl transform hover:scale-105 transition-transform duration-700 image-blur"
                onLoad={(e) => (e.target as HTMLImageElement).classList.add('loaded')}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;
