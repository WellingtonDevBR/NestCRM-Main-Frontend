
import React from "react";
import { Link } from "react-router-dom";
import SignUpHeader from "@/components/auth/SignUpHeader";
import SignUpForm from "@/components/auth/SignUpForm";
import SignUpHero from "@/components/auth/SignUpHero";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 -ml-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <SignUpHeader />
          <div className="mt-8">
            <SignUpForm />
          </div>
        </div>
      </div>
      
      {/* Right side - Image and text */}
      <SignUpHero />
    </div>
  );
};

export default SignUp;
