
import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PanelLeft, Plus, Trash2, ChevronLeft, Database, AlertCircle, HelpCircle } from "lucide-react";
import { useCustomFields } from "@/hooks/useCustomFields";
import { CustomField } from "@/types/customer";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CustomFields = () => {
  const { customFields, updateCustomFields, isLoading, isUpdating } = useCustomFields();
  const [fields, setFields] = useState<CustomField[]>([]);

  useEffect(() => {
    if (customFields) {
      console.log("Loaded custom fields:", customFields);
      setFields(customFields);
    }
  }, [customFields]);

  const addField = () => {
    setFields([
      ...fields,
      { key: "", label: "", type: "text", required: false }
    ]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<CustomField>) => {
    setFields(fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const invalidFields = fields.filter(field => !field.key || !field.label);
    if (invalidFields.length > 0) {
      toast.error("Please fill in all field keys and labels");
      return;
    }
    
    // Check for duplicate keys
    const keys = fields.map(field => field.key);
    const hasDuplicates = keys.some((key, index) => keys.indexOf(key) !== index);
    if (hasDuplicates) {
      toast.error("Field keys must be unique");
      return;
    }
    
    // Validate key format (alphanumeric and underscores only)
    const invalidKeyFormat = fields.some(field => !/^[a-zA-Z0-9_]+$/.test(field.key));
    if (invalidKeyFormat) {
      toast.error("Field keys must contain only letters, numbers, and underscores");
      return;
    }
    
    try {
      const validFields = fields.filter(field => field.key && field.label);
      await updateCustomFields(validFields);
    } catch (error) {
      console.error("Error updating fields:", error);
    }
  };

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
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" asChild className="h-8 w-8">
                    <Link to="/settings">
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-2">
                    <Database className="h-6 w-6 text-purple-600" />
                    <h1 className="text-2xl font-bold">Customer Data Fields</h1>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mt-2 ml-12">Customize what information you collect about your customers</p>
              <Separator className="mt-6" />
            </div>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  Field Customization
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Define additional fields to collect from your customers. These will appear in customer forms and tables.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription>Add the custom data fields you need to collect from your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-800">
                          Customer ID, Name, Email, and Phone are built-in fields and don't need to be added here.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center p-8">
                      <p>Loading custom fields...</p>
                    </div>
                  ) : fields.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50">
                      <Database className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <h3 className="text-lg font-medium mb-2">No custom fields defined yet</h3>
                      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        Add custom fields to collect additional information about your customers.
                      </p>
                      <Button 
                        type="button" 
                        onClick={addField} 
                        className="mt-2 bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Field
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-sm font-medium text-muted-foreground">
                        <div className="col-span-3">Field Key</div>
                        <div className="col-span-3">Display Label</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-3">Options</div>
                        <div className="col-span-1"></div>
                      </div>

                      {fields.map((field, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 items-center p-4 border rounded-lg bg-white shadow-sm hover:border-purple-200 transition-colors">
                          <div className="col-span-3">
                            <Input
                              value={field.key}
                              onChange={e => updateField(index, { key: e.target.value })}
                              placeholder="e.g., loyaltyPoints"
                              className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">API identifier</p>
                          </div>
                          <div className="col-span-3">
                            <Input
                              value={field.label}
                              onChange={e => updateField(index, { label: e.target.value })}
                              placeholder="e.g., Loyalty Points"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Shown to users</p>
                          </div>
                          <div className="col-span-2">
                            <Select
                              value={field.type}
                              onValueChange={value => updateField(index, { type: value as "text" | "date" | "number" })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3 flex items-center gap-2">
                            <Switch
                              id={`required-${index}`}
                              checked={field.required}
                              onCheckedChange={checked => updateField(index, { required: checked })}
                            />
                            <Label htmlFor={`required-${index}`} className="cursor-pointer">Required field</Label>
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeField(index)}
                              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {fields.length > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button type="button" variant="outline" onClick={addField} className="gap-1">
                        <Plus className="h-4 w-4" />
                        Add Another Field
                      </Button>
                      
                      <Button 
                        type="submit" 
                        className="bg-purple-600 hover:bg-purple-700"
                        disabled={isLoading || isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save Field Configuration"}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CustomFields;
