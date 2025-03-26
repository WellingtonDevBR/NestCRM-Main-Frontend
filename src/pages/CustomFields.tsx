
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { PanelLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomFields } from "@/hooks/useCustomFields";
import { CustomField, CustomFieldCategory, FIELD_CATEGORIES, FieldCategory } from "@/domain/models/customField";

// Import the refactored components
import CustomFieldsHeader from "@/components/custom-fields/CustomFieldsHeader";
import CustomFieldsContainer from "@/components/custom-fields/CustomFieldsContainer";
import CustomFieldForm from "@/components/custom-fields/CustomFieldForm";

const CustomFields = () => {
  console.log("CustomFields page rendering");
  
  const { 
    customFieldCategories, 
    isLoadingCategories, 
    updateCategoryFields,
    getCategoryFields,
    isUpdatingCategory,
    refetchCategories 
  } = useCustomFields();

  const [activeCategory, setActiveCategory] = useState<FieldCategory>("Customer");
  const [categoryFields, setCategoryFields] = useState<CustomField[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Initial data fetch when component mounts
  useEffect(() => {
    console.log("Running initial fetch effect");
    refetchCategories();
  }, [refetchCategories]);

  // Update category fields when the active category changes or when field data is loaded
  useEffect(() => {
    console.log("Category data changed, updating fields", { 
      customFieldCategories, 
      activeCategory 
    });
    
    if (customFieldCategories) {
      // Get the fields for the currently active category
      const fields = getCategoryFields(activeCategory);
      console.log(`Setting ${activeCategory} fields:`, fields);
      setCategoryFields(fields);
    }
  }, [customFieldCategories, activeCategory, getCategoryFields]);

  const addField = () => {
    console.log("Adding new field to", activeCategory);
    setCategoryFields([
      ...categoryFields,
      { key: "", label: "", type: "text", required: false }
    ]);
  };

  const removeField = (index: number) => {
    console.log(`Removing field at index ${index} from ${activeCategory}`);
    setCategoryFields(categoryFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<CustomField>) => {
    console.log(`Updating field at index ${index} in ${activeCategory}`, updates);
    setCategoryFields(categoryFields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log(`Submitting fields for ${activeCategory}:`, categoryFields);
    
    // Basic validation
    const invalidFields = categoryFields.filter(field => !field.key || !field.label);
    if (invalidFields.length > 0) {
      toast.error("Please fill in all field keys and labels");
      return;
    }
    
    // Check for duplicate keys
    const keys = categoryFields.map(field => field.key);
    const hasDuplicates = keys.some((key, index) => keys.indexOf(key) !== index);
    if (hasDuplicates) {
      toast.error("Field keys must be unique");
      return;
    }
    
    // Validate key format (alphanumeric and underscores only)
    const invalidKeyFormat = categoryFields.some(field => !/^[a-zA-Z0-9_]+$/.test(field.key));
    if (invalidKeyFormat) {
      toast.error("Field keys must contain only letters, numbers, and underscores");
      return;
    }
    
    try {
      setIsUpdating(true);
      console.log(`Saving fields for ${activeCategory}`, categoryFields);
      const validFields = categoryFields.filter(field => field.key && field.label);
      await updateCategoryFields({
        category: activeCategory,
        fields: validFields
      });
      setIsUpdating(false);
      toast.success(`${activeCategory} fields updated successfully`);
    } catch (error) {
      setIsUpdating(false);
      console.error("Error updating fields:", error);
      toast.error(`Failed to update ${activeCategory} fields`);
    }
  };

  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    // Cast the string value to FieldCategory since we know it's one of the valid categories
    setActiveCategory(value as FieldCategory);
  };

  console.log("Rendering CustomFields with categories:", customFieldCategories);
  console.log("Current active category:", activeCategory);
  console.log("Current category fields:", categoryFields);

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
            <CustomFieldsHeader title="Custom Data Fields" description="Customize what information you collect about your data entities" />
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Configure the custom fields for each module in the system. Each category's fields will be displayed in their respective section.
              </AlertDescription>
            </Alert>
            
            <Tabs 
              defaultValue="Customer" 
              value={activeCategory} 
              onValueChange={handleTabChange}
            >
              <TabsList className="w-full border-b">
                {FIELD_CATEGORIES.map(category => (
                  <TabsTrigger key={category} value={category} className="flex-1">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {FIELD_CATEGORIES.map(category => (
                <TabsContent key={category} value={category}>
                  <CustomFieldsContainer>
                    <CustomFieldForm
                      fields={categoryFields}
                      isLoading={isLoadingCategories}
                      isUpdating={isUpdating || isUpdatingCategory}
                      onAddField={addField}
                      onRemoveField={removeField}
                      onUpdateField={updateField}
                      onSubmit={handleSubmit}
                    />
                  </CustomFieldsContainer>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CustomFields;
