
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCustomFields } from "@/hooks/useCustomFields";
import { usePredictionMapping } from "@/hooks/usePredictionMapping";
import { PredictionMapping as PredictionMappingType } from "@/domain/models/predictionMapping";

// Import refactored components
import PredictionMappingHeader from "@/components/prediction/PredictionMappingHeader";
import MappingInfoCard from "@/components/prediction/MappingInfoCard";
import MappingSteps from "@/components/prediction/MappingSteps";
import MappingProgress from "@/components/prediction/MappingProgress";
import ModelSelector from "@/components/prediction/ModelSelector";
import MappingHelpAccordion from "@/components/prediction/MappingHelpAccordion";
import FieldMappingConfiguration from "@/components/prediction/FieldMappingConfiguration";

const PredictionMapping: React.FC = () => {
  // First, define hooks to fetch data
  const { customFieldCategories, isLoading: isLoadingFields } = useCustomFields();
  
  const { 
    mappingData, 
    isLoading: isLoadingMappings, 
    saveMappings,
    isSaving,
    getMapping,
    getMappingCategory,
    updateMapping,
    mappingModel,
    LIGHT_FEATURES,
    FULL_FEATURES
  } = usePredictionMapping();
  
  // Then define component state
  // Initialize activeModel based on detected mapping model
  const [activeModel, setActiveModel] = useState<"lightweight" | "full">("lightweight");
  const [localMappings, setLocalMappings] = useState<PredictionMappingType>({ mappings: [] });
  const [isModified, setIsModified] = useState(false);
  
  // Calculate advanced features by filtering out the lightweight features
  const advancedFeatures = FULL_FEATURES.filter(
    fullFeature => !LIGHT_FEATURES.some(lightFeature => lightFeature.modelField === fullFeature.modelField)
  );
  
  // Initialize local state from API data and set the active model based on the detected model
  useEffect(() => {
    if (mappingData && mappingData.mappings) {
      console.log("Setting localMappings from mappingData:", mappingData);
      setLocalMappings(mappingData);
      setIsModified(false);
      
      // Set the active model based on the detected mapping model
      if (mappingModel) {
        setActiveModel(mappingModel);
      }
    }
  }, [mappingData, mappingModel]);

  // Define helper functions
  const getLocalMapping = (modelField: string): string | undefined => {
    if (!localMappings || !localMappings.mappings) return undefined;
    const mapping = localMappings.mappings.find(m => m.modelField === modelField);
    console.log(`getLocalMapping for ${modelField}:`, mapping?.tenantField);
    return mapping?.tenantField;
  };
  
  const getLocalMappingCategory = (modelField: string): string | undefined => {
    if (!localMappings || !localMappings.mappings) return undefined;
    const mapping = localMappings.mappings.find(m => m.modelField === modelField);
    return mapping?.category;
  };
  
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

  const handleSave = async () => {
    try {
      await saveMappings(localMappings);
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
  
  const handleFieldChange = (modelField: string, tenantField: string, category: string) => {
    console.log(`handleFieldChange - modelField: ${modelField}, tenantField: ${tenantField}, category: ${category}`);
    console.log('Current localMappings before update:', JSON.stringify(localMappings));
    
    // Use the updateMapping function from the hook but pass the local mappings
    const updated = updateMapping(modelField, tenantField, category, localMappings);
    console.log('Updated localMappings:', JSON.stringify(updated));
    
    setLocalMappings(updated);
    setIsModified(true);
  };
  
  const isLoading = isLoadingFields || isLoadingMappings;
  
  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <PredictionMappingHeader title="Churn Prediction Field Mapping" />
        <p className="text-muted-foreground">Loading field configuration...</p>
      </div>
    );
  }
  
  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <PredictionMappingHeader title="Churn Prediction Field Mapping" />
      
      <MappingInfoCard />
      
      <MappingSteps />
      
      <MappingProgress 
        mapped={mapped} 
        total={total} 
        mappingProgress={mappingProgress} 
      />
      
      <div className="bg-card dark:bg-gray-800 border rounded-lg shadow-sm p-4 dark:border-gray-700">
        <ModelSelector 
          activeModel={activeModel}
          setActiveModel={setActiveModel}
          lightFeaturesCount={LIGHT_FEATURES.length}
          fullFeaturesCount={FULL_FEATURES.length}
        />
      </div>
      
      <MappingHelpAccordion />
      
      <FieldMappingConfiguration 
        activeModel={activeModel}
        isModified={isModified}
        isSaving={isSaving}
        lightFeatures={LIGHT_FEATURES}
        advancedFeatures={advancedFeatures}
        customFieldCategories={customFieldCategories || []}
        getMappedField={getLocalMapping}
        getMappingCategory={getLocalMappingCategory}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
        mappedCount={mapped}
        totalCount={total}
      />
    </div>
  );
};

export default PredictionMapping;
