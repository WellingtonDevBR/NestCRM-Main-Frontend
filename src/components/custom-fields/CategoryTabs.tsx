
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FIELD_CATEGORIES } from "@/domain/models/customField";
import { useCustomFieldsContext } from "@/context/CustomFieldsContext";
import CustomFieldsContainer from "./CustomFieldsContainer";
import CategoryForm from "./CategoryForm";

const CategoryTabs: React.FC = () => {
  const { 
    activeCategory, 
    setActiveCategory,
  } = useCustomFieldsContext();

  const handleTabChange = (value: string) => {
    console.log("Switching to category:", value);
    setActiveCategory(value);
  };

  return (
    <Tabs value={activeCategory} onValueChange={handleTabChange} className="dark:text-white">
      <TabsList className="w-full border-b dark:bg-gray-800 dark:border-gray-700">
        {FIELD_CATEGORIES.map(category => (
          <TabsTrigger key={category} value={category} className="flex-1 dark:data-[state=active]:bg-gray-700">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {FIELD_CATEGORIES.map(category => (
        <TabsContent key={category} value={category}>
          <CustomFieldsContainer>
            <CategoryForm activeCategory={category} />
          </CustomFieldsContainer>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CategoryTabs;
