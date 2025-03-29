
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Key } from "lucide-react";
import { useCustomFieldsContext } from "@/context/CustomFieldsContext";
import CustomFieldForm from "./CustomFieldForm";

interface CategoryFormProps {
  activeCategory: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ activeCategory }) => {
  const { 
    categoryFields, 
    isLoading, 
    isUpdating, 
    addField, 
    removeField, 
    updateField, 
    handleSubmit 
  } = useCustomFieldsContext();

  // Get association fields if we're not in the Customer category
  const associationFields = activeCategory !== "Customer" 
    ? categoryFields.filter(field => field.isAssociationField)
    : [];

  // Check if any association field is required
  const hasRequiredAssociationField = associationFields.some(field => field.required);

  return (
    <>
      {activeCategory === "Customer" && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
          <div className="flex gap-2">
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p>Customer ID, Name, Email, and Phone are built-in fields. These core fields are used throughout the CRM to identify and link customer data.</p>
              <p className="mt-1">Customer ID and Email fields are especially important as they serve as association fields that link customer data to other modules in the CRM.</p>
            </div>
          </div>
        </div>
      )}
      
      {activeCategory !== "Customer" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
          <div className="flex gap-2">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p><strong>Association Fields:</strong> Customer ID and Email fields are automatically included to link {activeCategory} data back to customers.</p>
              <p className="mt-1"><strong>Important:</strong> At least one of these fields (Customer ID or Email) must be marked as required when creating {activeCategory} records. You can also require both for stronger data validation.</p>
            </div>
          </div>
        </div>
      )}
      
      {activeCategory !== "Customer" && associationFields.length > 0 && hasRequiredAssociationField && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <AlertTitle className="text-green-800 dark:text-green-200">
            <Key className="inline h-4 w-4 mr-2" />
            Association fields configured
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {associationFields.filter(field => field.required).map(field => field.label).join(" and ")} {associationFields.filter(field => field.required).length === 1 ? "is" : "are"} being used to link {activeCategory} records to customers
          </AlertDescription>
        </Alert>
      )}
      
      <CustomFieldForm 
        activeCategory={activeCategory}
      />
    </>
  );
};

export default CategoryForm;
