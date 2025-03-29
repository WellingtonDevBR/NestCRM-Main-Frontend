
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

  // Get association fields for all categories
  const associationFields = categoryFields.filter(field => field.isAssociationField === true);
  console.log("CategoryForm > associationFields:", associationFields);

  // Check if any association field is marked for use as association
  const hasAssociationFieldForUse = associationFields.some(field => field.useAsAssociation === true);
  
  // Get the names of association fields that are marked for use
  const usedAssociationFields = associationFields
    .filter(field => field.useAsAssociation === true)
    .map(field => field.label);

  return (
    <>
      {activeCategory === "Customer" && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
          <div className="flex gap-2">
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p><strong>Important:</strong> Customer ID and Email fields are critical fields that link customer data across all modules in the CRM.</p>
              <p className="mt-1">These core fields serve as association fields that other modules (Orders, Payments, etc.) will use to connect their data back to customers.</p>
              <p className="mt-1"><strong>At least one of these fields must be marked to use as association</strong> to ensure proper data integrity across the system.</p>
            </div>
          </div>
        </div>
      )}
      
      {activeCategory !== "Customer" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
          <div className="flex gap-2">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p><strong>Association Fields:</strong> Customer ID and Email fields are automatically included to link {activeCategory} data back to customers.</p>
              <p className="mt-1"><strong>Important:</strong> At least one of these fields (Customer ID or Email) must be marked to use as association when creating {activeCategory} records. You can also use both for stronger data validation.</p>
            </div>
          </div>
        </div>
      )}
      
      {activeCategory !== "Customer" && associationFields.length > 0 && hasAssociationFieldForUse && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <AlertTitle className="text-green-800 dark:text-green-200">
            <Key className="inline h-4 w-4 mr-2" />
            Association fields configured
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {usedAssociationFields.join(" and ")} {usedAssociationFields.length === 1 ? "is" : "are"} being used to link {activeCategory} records to customers
          </AlertDescription>
        </Alert>
      )}
      
      {/* For Customer category, show confirmation if association fields exist and any are marked for use */}
      {activeCategory === "Customer" && associationFields.length > 0 && (
        <Alert className={hasAssociationFieldForUse ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"}>
          <AlertTitle className={hasAssociationFieldForUse ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}>
            <Key className="inline h-4 w-4 mr-2" />
            {hasAssociationFieldForUse ? "Association fields configured" : "Association fields need configuration"}
          </AlertTitle>
          <AlertDescription className={hasAssociationFieldForUse ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>
            {hasAssociationFieldForUse ? (
              <>
                {usedAssociationFields.join(" and ")} {usedAssociationFields.length === 1 ? "is" : "are"} marked to use as association for customer data
              </>
            ) : (
              <>
                Please mark at least one association field (Customer ID or Email) to use as association to save your configuration
              </>
            )}
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
