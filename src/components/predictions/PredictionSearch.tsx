
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PredictionSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PredictionSearch: React.FC<PredictionSearchProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Search customers..."
        className="pl-10 bg-background"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default PredictionSearch;
