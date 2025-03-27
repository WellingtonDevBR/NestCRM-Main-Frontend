
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FIELD_CATEGORIES } from "@/domain/models/customField";

interface CategorySelectorProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <Select 
      value={selectedCategory} 
      onValueChange={onCategoryChange}
    >
      <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
        {FIELD_CATEGORIES.map(category => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelector;
