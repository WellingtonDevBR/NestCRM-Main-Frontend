
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomers, Customer } from "@/hooks/useCustomers";
import { useCustomFields } from "@/hooks/useCustomFields";
import { toast } from "sonner";
import { CustomerFormData, CustomField } from "@/types/customer";
import { Separator } from "@/components/ui/separator";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  customer: Customer | null;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  onOpenChange,
  isEditMode,
  customer,
}) => {
  const { addCustomer, updateCustomer } = useCustomers();
  const { customFields, isLoading: isLoadingFields } = useCustomFields();
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    customFields: {}
  });

  // Reset form when dialog opens/closes or customer changes
  useEffect(() => {
    if (open && isEditMode && customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        customFields: customer.customFields || {}
      });
    } else if (open && !isEditMode) {
      // Initialize empty form with default values for any required custom fields
      const initialCustomFields: {[key: string]: string | number | null} = {};
      
      // Pre-populate required fields with empty values
      customFields.forEach(field => {
        if (field.type === 'number') {
          initialCustomFields[field.key] = null;
        } else if (field.type === 'date') {
          initialCustomFields[field.key] = "";
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
  }, [open, isEditMode, customer, customFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required custom fields
    const missingRequiredFields = customFields
      .filter(field => field.required)
      .filter(field => {
        const value = formData.customFields[field.key];
        return value === undefined || value === null || value === "";
      });

    if (missingRequiredFields.length > 0) {
      const fieldLabels = missingRequiredFields.map(f => f.label).join(", ");
      toast.error(`Please fill in required fields: ${fieldLabels}`);
      return;
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
      onOpenChange(false);
    } catch (error) {
      toast.error(isEditMode ? "Failed to update customer" : "Failed to add customer");
      console.error("Error saving customer:", error);
    }
  };

  const handleFieldChange = (field: CustomField, value: string) => {
    let processedValue: string | number | null = value;
    
    if (field.type === 'number') {
      processedValue = value === "" ? null : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [field.key]: processedValue
      }
    }));
  };

  const getFieldProps = (field: CustomField) => {
    const value = formData.customFields[field.key] ?? "";
    
    // Common props
    const props: any = {
      id: field.key,
      placeholder: `Enter ${field.label.toLowerCase()}`,
      required: field.required,
      className: field.required ? "border-l-4 border-l-purple-500 pl-3" : "",
      value: value === null ? "" : value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        handleFieldChange(field, e.target.value)
    };
    
    // Type-specific props
    if (field.type === 'date') {
      props.type = 'date';
    } else if (field.type === 'number') {
      props.type = 'number';
      props.step = '1';
    } else {
      props.type = 'text';
    }
    
    return props;
  };

  // Group fields by whether they're required or not
  const requiredFields = customFields.filter(f => f.required);
  const optionalFields = customFields.filter(f => !f.required);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update customer information"
                : "Add a new customer to your database"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">BASIC INFORMATION</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                  required
                  className="border-l-4 border-l-purple-500 pl-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@example.com"
                  required
                  className="border-l-4 border-l-purple-500 pl-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1234567890"
                  required
                  className="border-l-4 border-l-purple-500 pl-3"
                />
              </div>
            </div>

            {/* Custom Fields Section */}
            {(requiredFields.length > 0 || optionalFields.length > 0) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">ADDITIONAL INFORMATION</h3>
                  
                  {/* Required custom fields */}
                  {requiredFields.map(field => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="flex items-center">
                        {field.label}
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input {...getFieldProps(field)} />
                    </div>
                  ))}
                  
                  {/* Optional custom fields */}
                  {optionalFields.map(field => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input {...getFieldProps(field)} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isEditMode ? "Update Customer" : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
