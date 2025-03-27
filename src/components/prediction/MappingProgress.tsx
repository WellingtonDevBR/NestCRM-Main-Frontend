
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
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Mapping Progress</h3>
          <p className="text-sm text-muted-foreground">
            {mapped} of {total} fields mapped ({mappingProgress}% complete)
          </p>
        </div>
        <div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${mappingProgress === 100 ? 'bg-green-500' : 'bg-purple-600'}`} 
              style={{ width: `${mappingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {mappingProgress < 100 && (
        <Alert className="mt-3 bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mapping incomplete</AlertTitle>
          <AlertDescription>
            Some fields are still unmapped. For best prediction results, please map all fields.
          </AlertDescription>
        </Alert>
      )}
      
      {mappingProgress === 100 && (
        <Alert className="mt-3 bg-green-50 text-green-800 border-green-200">
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
