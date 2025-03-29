
import React, { createContext, useContext, useState, useEffect } from "react";
import { CustomField } from "@/domain/models/customField";
import { useCustomFieldsManager } from "@/hooks/useCustomFieldsManager";

interface CustomFieldsContextType {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categoryFields: CustomField[];
  isLoading: boolean;
  isUpdating: boolean;
  addField: () => void;
  removeField: (index: number) => void;
  updateField: (index: number, updates: Partial<CustomField>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const CustomFieldsContext = createContext<CustomFieldsContextType | undefined>(undefined);

export const CustomFieldsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const customFieldsManager = useCustomFieldsManager();

  // Use effect to mark component as mounted to ensure hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render children after mounted to ensure proper hydration
  return (
    <CustomFieldsContext.Provider value={customFieldsManager}>
      {children}
    </CustomFieldsContext.Provider>
  );
};

export const useCustomFieldsContext = () => {
  const context = useContext(CustomFieldsContext);
  if (context === undefined) {
    throw new Error("useCustomFieldsContext must be used within a CustomFieldsProvider");
  }
  return context;
};
