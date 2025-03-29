
import React from "react";
import { AlertCircle } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FieldMappingTable from "./FieldMappingTable";
import { CustomFieldCategory } from "@/domain/models/customField";
import { ModelFeature } from "@/domain/models/predictionMapping";

interface FieldMappingConfigurationProps {
  activeModel: "lightweight" | "full";
  isModified: boolean;
  isSaving: boolean;
  lightFeatures: ModelFeature[];
  advancedFeatures: ModelFeature[];
  customFieldCategories: CustomFieldCategory[];
  getMappedField: (modelField: string) => string | undefined;
  getMappingCategory?: (modelField: string) => string | undefined;
  onFieldChange: (modelField: string, tenantField: string, category: string) => void;
  onSave: () => void;
  mappedCount: number;
  totalCount: number;
}

const FieldMappingConfiguration: React.FC<FieldMappingConfigurationProps> = ({
  activeModel,
  isModified,
  isSaving,
  lightFeatures,
  advancedFeatures,
  customFieldCategories,
  getMappedField,
  getMappingCategory,
  onFieldChange,
  onSave,
  mappedCount,
  totalCount
}) => {
  return (
    <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Field Mapping Configuration
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm dark:bg-gray-800 dark:border-gray-700">
                    <p>Match each model feature to a corresponding field in your system. Compatible field types are shown.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              {activeModel === "lightweight" 
                ? "Basic model with essential features for churn prediction. Recommended for quick setup."
                : "Enhanced model with additional features for higher prediction accuracy. Requires more data points."
              }
            </CardDescription>
          </div>
          {isModified && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-md text-sm text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30">
              <AlertCircle className="h-4 w-4" />
              <span>Unsaved changes</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {activeModel === "lightweight" && (
          <FieldMappingTable
            title="Lightweight Model Features"
            features={lightFeatures}
            customFieldCategories={customFieldCategories || []}
            getMappedField={getMappedField}
            getMappingCategory={getMappingCategory}
            onFieldChange={onFieldChange}
          />
        )}
        
        {activeModel === "full" && (
          <>
            <FieldMappingTable
              title="Essential Model Features"
              features={lightFeatures}
              customFieldCategories={customFieldCategories || []}
              getMappedField={getMappedField}
              getMappingCategory={getMappingCategory}
              onFieldChange={onFieldChange}
            />
            
            <FieldMappingTable
              title="Advanced Model Features"
              features={advancedFeatures}
              customFieldCategories={customFieldCategories || []}
              getMappedField={getMappedField}
              getMappingCategory={getMappingCategory}
              onFieldChange={onFieldChange}
            />
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 dark:bg-gray-750 dark:border-gray-700 p-4">
        <div className="text-sm text-muted-foreground">
          {mappedCount} of {totalCount} fields mapped ({Math.round((mappedCount / totalCount) * 100)}% complete)
        </div>
        <Button 
          onClick={onSave} 
          disabled={isSaving || !isModified} 
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSaving ? "Saving..." : "Save Mappings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FieldMappingConfiguration;
