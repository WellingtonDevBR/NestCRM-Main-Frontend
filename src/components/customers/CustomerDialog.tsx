
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
import { CustomerFormData } from "@/types/customer";

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
  const { customFields } = useCustomFields();
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
      setFormData({
        name: "",
        email: "",
        phone: "",
        customFields: {}
      });
    }
  }, [open, isEditMode, customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  const handleFieldChange = (key: string, value: string) => {
    const field = customFields.find(f => f.key === key);
    let processedValue: string | number | null = value;
    
    if (field?.type === 'number') {
      processedValue = value ? Number(value) : null;
    }

    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [key]: processedValue
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Customer name"
                required
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
              />
            </div>

            {/* Custom Fields */}
            {customFields.map(field => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  type={field.type}
                  value={formData.customFields[field.key] || ""}
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              </div>
            ))}
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
