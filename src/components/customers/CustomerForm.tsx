
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
      // For edit mode, extract data from existing customer
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        customFields: customer.customFields || {}
      });
    } else {
      // Initialize with empty form with default values for association fields
      const initialCustomFields: {[key: string]: string | number | null} = {};
      
      // Pre-populate fields that are needed for associations
      const associationFields = customerFields.filter(f => 
        f.isAssociationField === true && 
        f.useAsAssociation === true
      );
      
      associationFields.forEach(field => {
        if (field.type === 'number') {
          initialCustomFields[field.key] = null;
        } else {
          initialCustomFields[field.key] = "";
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
        [field.key]: processedValue
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only validate association fields
    const associationFields = customerFields.filter(f => 
      f.isAssociationField === true && 
      f.useAsAssociation === true
    );
    
    const missingAssociations = associationFields.filter(field => {
      const value = formData.customFields[field.key];
      return value === undefined || value === null || value === "";
    });
    
    if (missingAssociations.length > 0) {
      const fieldLabels = missingAssociations.map(f => f.label).join(", ");
      toast.error(`Please fill in association fields: ${fieldLabels}`);
      return;
    }

    try {
      // Use only the fields that are defined in the custom fields configuration
      const validCustomFields = { ...formData.customFields };
      const validFieldKeys = customerFields.map(field => field.key);
      
      Object.keys(validCustomFields).forEach(key => {
        if (!validFieldKeys.includes(key)) {
          delete validCustomFields[key];
        }
      });

      const validatedFormData = {
        ...formData,
        customFields: validCustomFields
      };

      console.log("Submitting customer data:", validatedFormData);

      if (isEditMode && customer) {
        await updateCustomer({
          id: customer.id,
          ...validatedFormData
        });
        toast.success("Customer updated successfully");
      } else {
        await addCustomer(validatedFormData);
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
          isEditMode={isEditMode}
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
