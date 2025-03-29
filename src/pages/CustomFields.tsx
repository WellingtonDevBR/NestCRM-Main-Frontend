
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { PanelLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomFields } from "@/hooks/useCustomFields";
import { 
  CustomField, 
  CustomFieldCategory, 
  FIELD_CATEGORIES, 
  DEFAULT_ASSOCIATION_FIELDS 
} from "@/domain/models/customField";

// Import the refactored components
import CustomFieldsHeader from "@/components/custom-fields/CustomFieldsHeader";
import CustomFieldsContainer from "@/components/custom-fields/CustomFieldsContainer";
import CustomFieldForm from "@/components/custom-fields/CustomFieldForm";

const CustomFields = () => {
  const { 
    customFieldCategories, 
    isLoadingCategories,
    getCategoryFields,
    updateCategoryFields,
    isUpdatingCategory
  } = useCustomFields();

  const [activeCategory, setActiveCategory] = useState("Customer");
  const [categoryFields, setCategoryFields] = useState<CustomField[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // When customFieldCategories data is loaded or activeCategory changes, update the fields
  useEffect(() => {
    console.log("CustomFields > customFieldCategories:", customFieldCategories);
    console.log("CustomFields > activeCategory:", activeCategory);
    
    if (customFieldCategories?.length) {
      const category = customFieldCategories.find(c => c.category === activeCategory);
      console.log("CustomFields > Found category data:", category);
      
      if (category) {
        setCategoryFields(category.fields || []);
      } else {
        setCategoryFields([]);
      }
    } else {
      console.log("CustomFields > No categories data available");
      setCategoryFields([]);
    }
  }, [customFieldCategories, activeCategory]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    console.log("Switching to category:", value);
    setActiveCategory(value);
  };

  const addField = () => {
    setCategoryFields([
      ...categoryFields,
      { key: "", label: "", type: "text", required: false }
    ]);
  };

  const removeField = (index: number) => {
    // Don't allow removing association fields
    const field = categoryFields[index];
    if (field.isAssociationField) {
      toast.error("Association fields cannot be removed as they're required for linking modules");
      return;
    }
    
    setCategoryFields(categoryFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<CustomField>) => {
    setCategoryFields(categoryFields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    // For Customer category, check if there are identifier fields
    if (activeCategory === "Customer") {
      const hasIdentifierField = categoryFields.some(f => f.isIdentifier);
      
      if (!hasIdentifierField) {
        toast.error("Please mark at least one field as an identifier to link customers across modules");
        return;
      }
    }
    
    // For non-Customer categories, ensure association fields are present
    if (activeCategory !== "Customer") {
      // Make sure at least one of the association fields exists
      const hasAssociationField = categoryFields.some(field => 
        field.isAssociationField && (field.key === "customer_id" || field.key === "email")
      );
      
      if (!hasAssociationField) {
        toast.error("At least one customer association field is required to link data to customers");
        return;
      }
    }
    
    try {
      setIsUpdating(true);
      console.log(`Submitting fields for ${activeCategory}:`, categoryFields);
      
      // Send the complete payload with category and all fields
      const validFields = categoryFields.filter(field => field.key && field.label);
      await updateCategoryFields({
        category: activeCategory,
        fields: validFields
      });
      
      toast.success(`${activeCategory} fields updated successfully`);
    } catch (error) {
      console.error("Error updating fields:", error);
      toast.error(`Failed to update ${activeCategory} fields`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Ensure association fields are present in each category
  useEffect(() => {
    if (activeCategory !== "Customer") {
      // For non-Customer categories, ensure association fields exist
      const missingAssociationFields = DEFAULT_ASSOCIATION_FIELDS.filter(defaultField => 
        !categoryFields.some(field => field.key === defaultField.key)
      );
      
      if (missingAssociationFields.length > 0) {
        const updatedFields = [
          ...missingAssociationFields.map(field => ({
            ...field,
            required: field.key === "customer_id" // Only customer_id is required
          })),
          ...categoryFields
        ];
        
        setCategoryFields(updatedFields);
      }
    }
  }, [activeCategory, categoryFields]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300">
          <Button 
            variant="outline" 
            size="icon"
            className="fixed top-4 left-4 z-50 shadow-md bg-background border-border dark:bg-gray-800 dark:border-gray-700 md:hidden" 
            onClick={() => {
              window.dispatchEvent(new CustomEvent("sidebar:toggle"));
            }}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

          <div className="max-w-4xl mx-auto space-y-8 pt-6">
            <CustomFieldsHeader />
            
            <Alert className="dark:bg-gray-800 dark:border-gray-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Configure the custom fields for each module in the system. For Customer category, mark at least one field as an identifier.
                For other modules, a Customer ID or Email field will be automatically included to link data to customers.
              </AlertDescription>
            </Alert>
            
            <Tabs value={activeCategory} onValueChange={handleTabChange} className="dark:text-white">
              <TabsList className="w-full border-b dark:bg-gray-800 dark:border-gray-700">
                {FIELD_CATEGORIES.map(category => (
                  <TabsTrigger key={category} value={category} className="flex-1 dark:data-[state=active]:bg-gray-700">
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
                      activeCategory={category}
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
