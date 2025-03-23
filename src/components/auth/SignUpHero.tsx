
import React from "react";

const SignUpHero: React.FC = () => {
  return (
    <div className="hidden lg:block relative flex-1 bg-cover bg-center" style={{ 
      backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url("https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070")` 
    }}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/20 mix-blend-multiply"></div>
      <div className="absolute inset-0 flex flex-col justify-center p-20">
        <div className="max-w-md text-white">
          <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1 rounded-full">Join modern businesses</span>
          <h2 className="text-3xl font-bold mt-6 mb-4">Retain customers like never before with AI-powered insights</h2>
          <p className="text-white/80 mb-8">
            Our AI analyzes customer behavior to predict churn before it happens, giving you the opportunity to take action and retain your valuable customers.
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-500"></div>
              ))}
            </div>
            <p className="text-sm text-white/90">
              Early access available now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpHero;
