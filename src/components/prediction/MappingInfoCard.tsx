
import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MappingInfoCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-none shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">Why Map Your Fields?</h3>
            <p className="text-muted-foreground">
              Field mapping connects your custom data fields to our churn prediction model, 
              enabling accurate predictions based on your customer data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MappingInfoCard;
