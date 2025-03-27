
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
  const { customFieldCategories, isLoading: isLoadingFields } = useCustomFields();
  
  const { 
    mappingData, 
    isLoading: isLoadingMappings, 
    saveMappings,
    isSaving,
    getMapping,
    updateMapping,
    LIGHT_FEATURES,
    FULL_FEATURES
  } = usePredictionMapping();
  
  // Local state to track changes
  const [localMappings, setLocalMappings] = useState<PredictionMappingType>({ mappings: [] });
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
  
  // Get advanced features by filtering out the lightweight features
  const advancedFeatures = FULL_FEATURES.filter(
    f => !LIGHT_FEATURES.some(lf => lf.modelField === f.modelField)
  );
  
  // Initialize local state from API data
  useEffect(() => {
    if (mappingData && mappingData.mappings) {
      setLocalMappings(mappingData);
      setIsModified(false);
    }
  }, [mappingData]);

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
  
  const getLocalMapping = (modelField: string): string | undefined => {
    if (!localMappings || !localMappings.mappings) return undefined;
    const mapping = localMappings.mappings.find(m => m.modelField === modelField);
    return mapping?.tenantField;
  };
  
  const handleFieldChange = (modelField: string, tenantField: string) => {
    const updated = updateMapping(modelField, tenantField);
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
      
      <div className="bg-white border rounded-lg shadow-sm p-4">
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
        onFieldChange={handleFieldChange}
        onSave={handleSave}
        mappedCount={mapped}
        totalCount={total}
      />
    </div>
  );
};

export default PredictionMapping;
