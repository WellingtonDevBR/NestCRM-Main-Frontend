
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";
import { useCustomFields } from "@/hooks/useCustomFields";
import { 
  usePredictionMapping, 
  LIGHTWEIGHT_MODEL_FEATURES, 
  FULL_MODEL_FEATURES 
} from "@/hooks/usePredictionMapping";
import FieldMappingTable from "@/components/prediction/FieldMappingTable";
import { FieldMapping, PredictionMappingData } from "@/utils/predictionMappingApi";

const PredictionMapping: React.FC = () => {
  const { customFieldCategories, isLoading: isLoadingFields } = useCustomFields();
  
  const { 
    mappingData, 
    isLoading: isLoadingMappings, 
    saveMappings,
    isSaving,
    getMapping
  } = usePredictionMapping();
  
  // Local state to track changes
  const [localMappings, setLocalMappings] = useState<PredictionMappingData>({ mappings: [] });
  const [isModified, setIsModified] = useState(false);
  
  // Flatten all custom fields from categories for easier access
  const allCustomFields = useMemo(() => {
    if (!customFieldCategories || customFieldCategories.length === 0) return [];
    
    return customFieldCategories.flatMap(category => 
      category.fields && Array.isArray(category.fields) 
        ? category.fields.map(field => ({
            ...field,
            category: category.category
          }))
        : []
    );
  }, [customFieldCategories]);
  
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
      toast.success("Field mappings saved successfully");
    } catch (error) {
      toast.error("Failed to save field mappings");
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
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-purple-600" />
        <h1 className="text-3xl font-bold">Churn Prediction Field Mapping</h1>
      </div>
      <p className="text-muted-foreground">
        Map your custom fields to match the prediction model features for accurate churn prediction.
      </p>
      
      <Separator className="my-6" />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Field Mapping Configuration</CardTitle>
          <CardDescription>
            Select which of your custom fields correspond to each model feature.
            This mapping is required for the prediction model to work properly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Lightweight Model Features */}
          <FieldMappingTable
            title="Lightweight Model Features (Basic)"
            features={LIGHTWEIGHT_MODEL_FEATURES}
            customFields={allCustomFields}
            getMappedField={getLocalMapping}
            onFieldChange={handleFieldChange}
          />
          
          {/* Full Model Features */}
          <FieldMappingTable
            title="Full Model Features (Advanced)"
            features={FULL_MODEL_FEATURES.filter(
              f => !LIGHTWEIGHT_MODEL_FEATURES.some(lf => lf.modelField === f.modelField)
            )}
            customFields={allCustomFields}
            getMappedField={getLocalMapping}
            onFieldChange={handleFieldChange}
          />
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !isModified} 
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? "Saving..." : "Save Mappings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionMapping;
