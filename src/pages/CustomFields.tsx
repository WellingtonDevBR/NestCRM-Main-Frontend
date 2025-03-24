
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomFields } from "@/hooks/useCustomFields";
import { CustomField } from "@/types/customer";

// Import the refactored components
import CustomFieldsHeader from "@/components/custom-fields/CustomFieldsHeader";
import CustomFieldsContainer from "@/components/custom-fields/CustomFieldsContainer";
import CustomFieldForm from "@/components/custom-fields/CustomFieldForm";

const CustomFields = () => {
  const { customFields, updateCustomFields, isLoading, isUpdating } = useCustomFields();
  const [fields, setFields] = useState<CustomField[]>([]);

  useEffect(() => {
    if (customFields) {
      console.log("Loaded custom fields:", customFields);
      setFields(customFields);
    }
  }, [customFields]);

  const addField = () => {
    setFields([
      ...fields,
      { key: "", label: "", type: "text", required: false }
    ]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<CustomField>) => {
    setFields(fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const invalidFields = fields.filter(field => !field.key || !field.label);
    if (invalidFields.length > 0) {
      toast.error("Please fill in all field keys and labels");
      return;
    }
    
    // Check for duplicate keys
    const keys = fields.map(field => field.key);
    const hasDuplicates = keys.some((key, index) => keys.indexOf(key) !== index);
    if (hasDuplicates) {
      toast.error("Field keys must be unique");
      return;
    }
    
    // Validate key format (alphanumeric and underscores only)
    const invalidKeyFormat = fields.some(field => !/^[a-zA-Z0-9_]+$/.test(field.key));
    if (invalidKeyFormat) {
      toast.error("Field keys must contain only letters, numbers, and underscores");
      return;
    }
    
    try {
      const validFields = fields.filter(field => field.key && field.label);
      await updateCustomFields(validFields);
    } catch (error) {
      console.error("Error updating fields:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300">
          <Button 
            variant="outline" 
            size="icon"
            className="fixed top-4 left-4 z-50 shadow-md bg-white md:hidden" 
            onClick={() => {
              window.dispatchEvent(new CustomEvent("sidebar:toggle"));
            }}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

          <div className="max-w-4xl mx-auto space-y-8 pt-6">
            <CustomFieldsHeader />
            
            <CustomFieldsContainer>
              <CustomFieldForm
                fields={fields}
                isLoading={isLoading}
                isUpdating={isUpdating}
                onAddField={addField}
                onRemoveField={removeField}
                onUpdateField={updateField}
                onSubmit={handleSubmit}
              />
            </CustomFieldsContainer>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CustomFields;
