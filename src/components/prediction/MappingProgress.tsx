
import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MappingProgressProps {
  mapped: number;
  total: number;
  mappingProgress: number;
}

const MappingProgress: React.FC<MappingProgressProps> = ({ 
  mapped, 
  total, 
  mappingProgress 
}) => {
  return (
    <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Mapping Progress</h3>
          <p className="text-sm text-muted-foreground">
            {mapped} of {total} fields mapped ({mappingProgress}% complete)
          </p>
        </div>
        <div>
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${mappingProgress === 100 ? 'bg-green-500' : 'bg-purple-600'}`} 
              style={{ width: `${mappingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {mappingProgress < 100 && (
        <Alert className="mt-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mapping incomplete</AlertTitle>
          <AlertDescription>
            Some fields are still unmapped. For best prediction results, please map all fields.
          </AlertDescription>
        </Alert>
      )}
      
      {mappingProgress === 100 && (
        <Alert className="mt-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/30">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>All fields mapped</AlertTitle>
          <AlertDescription>
            Great job! You've mapped all required fields for this model.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MappingProgress;
