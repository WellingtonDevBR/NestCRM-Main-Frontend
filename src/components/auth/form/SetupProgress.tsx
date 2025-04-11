
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface SetupProgressProps {
  setupStage: string;
  setupProgress: number;
}

const SetupProgress: React.FC<SetupProgressProps> = ({ setupStage, setupProgress }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Setting up your workspace</h3>
        <p className="text-muted-foreground">{setupStage}</p>
      </div>
      
      <Progress value={setupProgress} className="h-2" />
      
      <Alert className="bg-muted/50 border-primary/20">
        <AlertTitle className="font-medium">Please wait</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          We're setting up your account and configuring your workspace. This may take a moment...
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SetupProgress;
