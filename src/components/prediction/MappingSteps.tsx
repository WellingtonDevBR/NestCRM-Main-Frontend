
import React from "react";
import { Users, TableProperties, Save } from "lucide-react";

const MappingSteps: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
            <span className="font-medium">1</span>
          </div>
          <h3 className="font-medium">Select Categories</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose the appropriate data category for each model feature, like "Customer" for demographic information.
        </p>
      </div>
      
      <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-3">
            <span className="font-medium">2</span>
          </div>
          <h3 className="font-medium">Map Your Fields</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Match each prediction model feature with the corresponding field from your system.
        </p>
      </div>
      
      <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-3">
            <span className="font-medium">3</span>
          </div>
          <h3 className="font-medium">Save & Use</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          After mapping your fields, save the configuration to enable accurate churn predictions.
        </p>
      </div>
    </div>
  );
};

export default MappingSteps;
