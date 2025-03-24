
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomerFormData } from "@/domain/models/customer";

interface BasicInformationFieldsProps {
  formData: CustomerFormData;
  setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
}

const BasicInformationFields: React.FC<BasicInformationFieldsProps> = ({ 
  formData, 
  setFormData 
}) => {
  return (
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
  );
};

export default BasicInformationFields;
