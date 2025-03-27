
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { TrendingUp, AlertCircle, CheckCircle2, HelpCircle, ChevronRight } from "lucide-react";
import { useCustomFields } from "@/hooks/useCustomFields";
import { usePredictionMapping } from "@/hooks/usePredictionMapping";
import FieldMappingTable from "@/components/prediction/FieldMappingTable";
import { PredictionMappingData } from "@/utils/predictionMappingApi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PredictionMapping: React.FC = () => {
  const { customFieldCategories, isLoading: isLoadingFields } = useCustomFields();
  
  const { 
    mappingData, 
    isLoading: isLoadingMappings, 
    saveMappings,
    isSaving,
    getMapping,
    LIGHT_FEATURES,
    FULL_FEATURES
  } = usePredictionMapping();
  
  // Local state to track changes
  const [localMappings, setLocalMappings] = useState<PredictionMappingData>({ mappings: [] });
  const [isModified, setIsModified] = useState(false);
  const [activeModel, setActiveModel] = useState<"lightweight" | "full">("lightweight");
  
  // Count how many fields are mapped vs unmapped
  const countMappedFields = () => {
    if (!localMappings.mappings) return { mapped: 0, total: 0 };
    
    const relevantFeatures = activeModel === "lightweight" 
      ? LIGHT_FEATURES 
      : FULL_FEATURES;
    
    const mapped = relevantFeatures.filter(feature => {
      const mapping = getLocalMapping(feature.modelField);
      return mapping && mapping !== "not_mapped";
    }).length;
    
    return { mapped, total: relevantFeatures.length };
  };
  
  const { mapped, total } = countMappedFields();
  const mappingProgress = total > 0 ? Math.round((mapped / total) * 100) : 0;
  
  // Initialize local state from API data
  useEffect(() => {
    if (mappingData && mappingData.mappings) {
      setLocalMappings(mappingData);
      setIsModified(false);
    }
  }, [mappingData]);

  const handleSave = async () => {
    try {
      // Filter out not_mapped values
      const cleanedMappings = {
        mappings: localMappings.mappings.filter(mapping => 
          mapping.tenantField && mapping.tenantField !== "not_mapped"
        )
      };
      
      await saveMappings(cleanedMappings);
      setIsModified(false);
      toast.success("Field mappings saved successfully", {
        description: "Your custom field mappings have been updated."
      });
    } catch (error) {
      toast.error("Failed to save field mappings", {
        description: "Please try again or contact support if the issue persists."
      });
      console.error("Save error:", error);
    }
  };
  
  const getLocalMapping = (modelField: string): string | undefined => {
    if (!localMappings || !localMappings.mappings) return undefined;
    const mapping = localMappings.mappings.find(m => m.modelField === modelField);
    return mapping?.tenantField;
  };
  
  const handleFieldChange = (modelField: string, tenantField: string) => {
    const updatedMappings = [...(localMappings.mappings || [])];
    const existingIndex = updatedMappings.findIndex(m => m.modelField === modelField);
    
    if (existingIndex >= 0) {
      // Update existing mapping
      updatedMappings[existingIndex] = {
        ...updatedMappings[existingIndex],
        tenantField
      };
    } else {
      // Add new mapping
      updatedMappings.push({ modelField, tenantField });
    }
    
    setLocalMappings({ mappings: updatedMappings });
    setIsModified(true);
  };
  
  const isLoading = isLoadingFields || isLoadingMappings;
  
  // Get advanced features by filtering out the lightweight features
  const advancedFeatures = FULL_FEATURES.filter(
    f => !LIGHT_FEATURES.some(lf => lf.modelField === f.modelField)
  );
  
  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-purple-600" />
          <h1 className="text-3xl font-bold">Churn Prediction Field Mapping</h1>
        </div>
        <p className="text-muted-foreground">Loading field configuration...</p>
      </div>
    );
  }
  
  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-purple-600" />
        <h1 className="text-3xl font-bold">Churn Prediction Field Mapping</h1>
      </div>
      
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-purple-600" />
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
        
        <div className="flex gap-2 mb-2">
          <Button
            onClick={() => setActiveModel("lightweight")}
            variant={activeModel === "lightweight" ? "default" : "outline"}
            className={activeModel === "lightweight" ? "bg-purple-600 hover:bg-purple-700" : ""}
            size="sm"
          >
            Lightweight Model ({LIGHT_FEATURES.length} fields)
          </Button>
          <Button
            onClick={() => setActiveModel("full")}
            variant={activeModel === "full" ? "default" : "outline"}
            className={activeModel === "full" ? "bg-purple-600 hover:bg-purple-700" : ""}
            size="sm"
          >
            Full Model ({FULL_FEATURES.length} fields)
          </Button>
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
      
      <Accordion type="single" collapsible defaultValue="explanation" className="bg-white border rounded-lg shadow-sm">
        <AccordionItem value="explanation">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-2 font-medium">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              How does field mapping work?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3 text-sm">
              <p>
                Our churn prediction model requires specific data points to predict which customers are at risk of churning.
                Through field mapping, you're telling the system which of your custom fields contain that required information.
              </p>
              
              <h4 className="font-medium">The mapping process:</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>For each model feature (like "Age" or "Gender"), select the category where that data lives in your system</li>
                <li>Then select the specific field from that category that contains the matching data</li>
                <li>Make sure the field types are compatible (numbers for numeric features, select/dropdown for categorical features)</li>
                <li>Save your mapping when complete</li>
              </ol>
              
              <p>
                You can choose between our Lightweight Model (fewer fields, quicker setup) or Full Model (more fields, higher accuracy).
                We recommend starting with the Lightweight Model and upgrading to the Full Model as needed.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Card className="mb-6">
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
                    <TooltipContent className="max-w-sm">
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
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-md text-sm text-amber-700 border border-amber-200">
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
              features={LIGHT_FEATURES}
              customFieldCategories={customFieldCategories || []}
              getMappedField={getLocalMapping}
              onFieldChange={handleFieldChange}
            />
          )}
          
          {activeModel === "full" && (
            <>
              <FieldMappingTable
                title="Essential Model Features"
                features={LIGHT_FEATURES}
                customFieldCategories={customFieldCategories || []}
                getMappedField={getLocalMapping}
                onFieldChange={handleFieldChange}
              />
              
              <FieldMappingTable
                title="Advanced Model Features"
                features={advancedFeatures}
                customFieldCategories={customFieldCategories || []}
                getMappedField={getLocalMapping}
                onFieldChange={handleFieldChange}
              />
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-gray-50 p-4">
          <div className="text-sm text-muted-foreground">
            {mapped} of {total} fields mapped ({mappingProgress}% complete)
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !isModified} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSaving ? "Saving..." : "Save Mappings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PredictionMapping;
