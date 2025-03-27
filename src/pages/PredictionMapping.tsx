
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Database, Settings as SettingsIcon } from "lucide-react";
import FieldMappingTable from "@/components/prediction/FieldMappingTable";
import { useCustomFields } from "@/hooks/useCustomFields";
import { usePredictionMapping } from "@/hooks/usePredictionMapping";
import { PredictionMappingData } from "@/utils/predictionMappingApi";

const PredictionMapping: React.FC = () => {
  const { customFieldCategories, isLoadingCategories } = useCustomFields();
  const { 
    mappingData, 
    isLoading: isLoadingMappings, 
    getMapping, 
    updateMapping, 
    saveMappings, 
    isSaving,
    LIGHTWEIGHT_MODEL_FEATURES,
    FULL_MODEL_FEATURES
  } = usePredictionMapping();

  const [localMappings, setLocalMappings] = useState<PredictionMappingData>({ mappings: [] });
  
  // Flatten all custom fields from all categories for dropdown options
  const allCustomFields = React.useMemo(() => {
    if (!customFieldCategories || customFieldCategories.length === 0) return [];
    
    return customFieldCategories.flatMap(category => 
      category.fields.map(field => ({
        ...field,
        category: category.category
      }))
    );
  }, [customFieldCategories]);
  
  // Initialize local mappings when data loads
  useEffect(() => {
    if (mappingData) {
      setLocalMappings(mappingData);
    }
  }, [mappingData]);
  
  const handleFieldChange = (modelField: string, tenantField: string) => {
    const updatedMappings = updateMapping(modelField, tenantField);
    if (updatedMappings) {
      setLocalMappings(updatedMappings);
    }
  };
  
  const handleSave = async () => {
    try {
      await saveMappings(localMappings);
    } catch (error) {
      console.error("Error saving mappings:", error);
      toast.error("Failed to save field mappings");
    }
  };
  
  const getLocalMapping = (modelField: string): string | undefined => {
    const mapping = localMappings.mappings.find(m => m.modelField === modelField);
    return mapping?.tenantField;
  };
  
  const isLoading = isLoadingCategories || isLoadingMappings;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SettingsIcon className="h-6 w-6 text-purple-600" />
                <h1 className="text-3xl font-bold">Churn Prediction Field Mapping</h1>
              </div>
              <p className="text-muted-foreground">
                Map your custom fields to the fields required by our churn prediction models
              </p>
              <Separator className="mt-6" />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-purple-600" />
                      <h2 className="text-xl font-semibold">Field Mapping Configuration</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Our churn prediction model expects specific field names. 
                      Map your custom fields to these model features to enable accurate predictions.
                    </p>
                  </div>
                  
                  <div className="space-y-8">
                    <FieldMappingTable
                      title="Lightweight Model Features"
                      features={LIGHTWEIGHT_MODEL_FEATURES}
                      customFields={allCustomFields}
                      getMappedField={getLocalMapping}
                      onFieldChange={handleFieldChange}
                    />
                    
                    <Separator />
                    
                    <FieldMappingTable
                      title="Full Model Features (Additional)"
                      features={FULL_MODEL_FEATURES.slice(LIGHTWEIGHT_MODEL_FEATURES.length)}
                      customFields={allCustomFields}
                      getMappedField={getLocalMapping}
                      onFieldChange={handleFieldChange}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving} 
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isSaving ? "Saving..." : "Save Mappings"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PredictionMapping;
