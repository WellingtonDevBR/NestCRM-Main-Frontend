
import React from "react";
import { Loader2 } from "lucide-react";

const SignupProcessing: React.FC = () => {
  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">Processing your request</h3>
      <p className="text-muted-foreground">
        Please wait while we set up your account and redirect you to the checkout...
      </p>
    </div>
  );
};

export default SignupProcessing;
