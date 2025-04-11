
import React, { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface SetupProgressProps {
  setupStage: string;
  setupProgress: number;
}

const SetupProgress: React.FC<SetupProgressProps> = ({ setupStage, setupProgress }) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle className="text-lg font-medium">Setting up your account</AlertTitle>
        <AlertDescription>
          {setupStage}
        </AlertDescription>
      </Alert>
      <Progress value={setupProgress} className="h-2" />
      <p className="text-sm text-center text-muted-foreground mt-2">
        Please wait while we set up your workspace. This may take a moment...
      </p>
    </div>
  );
};

export default SetupProgress;
