
import React from "react";
import { Database } from "lucide-react";

const CustomFieldsHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-3 bg-card dark:bg-gray-800 rounded-lg p-6 border border-border dark:border-gray-700 shadow-sm">
      <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
        <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">Custom Data Fields</h1>
        <p className="text-muted-foreground mt-1">
          Configure custom fields to collect additional information across different modules
        </p>
      </div>
    </div>
  );
};

export default CustomFieldsHeader;
