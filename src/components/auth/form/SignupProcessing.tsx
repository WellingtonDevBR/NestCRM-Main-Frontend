
import React from "react";
import { Loader2 } from "lucide-react";

const SignupProcessing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-foreground">Processing your request</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Please wait while we set up your account and redirect you to the dashboard...
      </p>
      <div className="w-full max-w-md h-1.5 bg-muted mt-8 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-progress"></div>
      </div>
    </div>
  );
};

export default SignupProcessing;
