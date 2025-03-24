
import React from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, onSearch }) => {
  return (
    <Input
      placeholder="Search customers..."
      value={searchTerm}
      onChange={onSearch}
      className="max-w-sm"
    />
  );
};

export default SearchInput;
