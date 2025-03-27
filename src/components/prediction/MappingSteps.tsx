
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MappingSteps: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="p-1.5 rounded-full bg-blue-100 text-blue-600">1</span>
            Select Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Choose the appropriate data category for each model feature, like "Customer" for demographic information.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="p-1.5 rounded-full bg-blue-100 text-blue-600">2</span>
            Map Your Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Match each prediction model feature with the corresponding field from your system.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="p-1.5 rounded-full bg-blue-100 text-blue-600">3</span>
            Save & Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">After mapping your fields, save the configuration to enable accurate churn predictions.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MappingSteps;
