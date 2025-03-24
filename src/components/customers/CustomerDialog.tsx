
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
import { toast } from "sonner";
import { PlusCircle, X } from "lucide-react";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customFields, setCustomFields] = useState<{[key: string]: string}>({});
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or customer changes
  useEffect(() => {
    if (open && isEditMode && customer) {
      setName(customer.name || "");
      setEmail(customer.email || "");
      setCustomFields(customer.customFields || {});
    } else if (open && !isEditMode) {
      setName("");
      setEmail("");
      setCustomFields({});
    }
  }, [open, isEditMode, customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const customerData = {
        name,
        email,
        customFields
      };

      if (isEditMode && customer) {
        // Fix: We need to pass the id separately along with the customer data
        await updateCustomer({
          id: customer.id,
          ...customerData
        });
        toast.success("Customer updated successfully");
      } else {
        await addCustomer(customerData);
        toast.success("Customer added successfully");
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error(isEditMode ? "Failed to update customer" : "Failed to add customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCustomField = () => {
    if (!newFieldName.trim()) {
      toast.error("Field name cannot be empty");
      return;
    }

    // Normalize field name (remove spaces, convert to camelCase)
    const normalizedName = newFieldName
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word, index) => 
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");

    setCustomFields({
      ...customFields,
      [normalizedName]: newFieldValue
    });

    setNewFieldName("");
    setNewFieldValue("");
  };

  const removeCustomField = (fieldName: string) => {
    const updatedFields = { ...customFields };
    delete updatedFields[fieldName];
    setCustomFields(updatedFields);
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
                ? "Update customer information including custom fields."
                : "Add a new customer to your database with custom fields."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Customer name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                required
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Custom Fields</h3>
              </div>

              {/* Existing custom fields */}
              <div className="space-y-3">
                {Object.entries(customFields).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="flex-1 border rounded-md px-3 py-1 bg-muted">
                      <div className="text-xs text-muted-foreground">{key}</div>
                      <div>{value}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomField(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add new custom field */}
              <div className="flex flex-col gap-2 mt-4">
                <Label>Add Custom Field</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Field name"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                  />
                  <Input
                    placeholder="Value"
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addCustomField}
                    disabled={!newFieldName.trim()}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
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
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Customer"
                : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
