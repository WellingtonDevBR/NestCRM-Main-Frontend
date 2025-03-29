
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomFields } from "@/hooks/useCustomFields";
import { Customer, CustomerFormData } from "@/domain/models/customer";
import CustomFieldsSection from "./CustomFieldsSection";
import { processFieldValue } from "./utils/fieldUtils";
import { CustomField } from "@/domain/models/customField";

interface CustomerFormProps {
  isEditMode: boolean;
  customer: Customer | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  isEditMode,
  customer,
  onCancel,
  onSuccess
}) => {
  const { addCustomer, updateCustomer } = useCustomers();
  const { getCategoryFields, isLoadingCategories } = useCustomFields();
  const customerFields = getCategoryFields("Customer");
  
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    customFields: {}
  });

  // Reset form when dialog opens/closes or customer changes
  useEffect(() => {
    if (isEditMode && customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        customFields: customer.customFields || {}
      });
    } else if (!isEditMode) {
      // Initialize empty form with default values for any required custom fields
      const initialCustomFields: {[key: string]: string | number | null} = {};
      
      // Pre-populate required fields with empty values
      customerFields.forEach(field => {
        if (field.type === 'number') {
          initialCustomFields[field.label] = null;
        } else if (field.type === 'date') {
          initialCustomFields[field.label] = "";
        } else {
          initialCustomFields[field.label] = "";
        }
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        customFields: initialCustomFields
      });
    }
  }, [isEditMode, customer, customerFields]);

  const handleFieldChange = (field: CustomField, value: string) => {
    const processedValue = processFieldValue(field, value);
    
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [field.label]: processedValue
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required custom fields
    const missingRequiredFields = customerFields
      .filter(field => field.required)
      .filter(field => {
        const value = formData.customFields[field.label];
        return value === undefined || value === null || value === "";
      });

    if (missingRequiredFields.length > 0) {
      const fieldLabels = missingRequiredFields.map(f => f.label).join(", ");
      toast.error(`Please fill in required fields: ${fieldLabels}`);
      return;
    }
    
    // Validate identifier fields
    const identifierFields = customerFields.filter(field => field.isIdentifier);
    
    if (identifierFields.length > 0) {
      const missingIdentifiers = identifierFields.filter(field => {
        const value = formData.customFields[field.label];
        return value === undefined || value === null || value === "";
      });
      
      if (missingIdentifiers.length > 0) {
        const fieldLabels = missingIdentifiers.map(f => f.label).join(", ");
        toast.error(`Please fill in identifier fields: ${fieldLabels}`);
        return;
      }
    }

    try {
      if (isEditMode && customer) {
        await updateCustomer({
          id: customer.id,
          ...formData
        });
        toast.success("Customer updated successfully");
      } else {
        await addCustomer(formData);
        toast.success("Customer added successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(isEditMode ? "Failed to update customer" : "Failed to add customer");
      console.error("Error saving customer:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
        <CustomFieldsSection
          customFields={customerFields}
          formData={formData}
          onFieldChange={handleFieldChange}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isEditMode ? "Update Customer" : "Add Customer"}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
