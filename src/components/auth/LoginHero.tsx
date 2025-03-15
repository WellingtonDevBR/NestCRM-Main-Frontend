
import React from "react";

const LoginHero = () => {
  return (
    <div className="hidden lg:block relative flex-1 bg-cover bg-center" style={{ 
      backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url("https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070")` 
    }}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/20 mix-blend-multiply"></div>
      <div className="absolute inset-0 flex flex-col justify-center p-20">
        <div className="max-w-md text-white">
          <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1 rounded-full">Welcome back</span>
          <h2 className="text-3xl font-bold mt-6 mb-4">Access your customer insights</h2>
          <p className="text-white/80 mb-8">
            Sign in to see your customer data, AI-powered insights, and take action to improve retention.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginHero;
