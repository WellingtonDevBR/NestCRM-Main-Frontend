
import React from "react";

interface CustomFieldsContainerProps {
  children: React.ReactNode;
}

const CustomFieldsContainer: React.FC<CustomFieldsContainerProps> = ({ children }) => {
  return (
    <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm p-6">
      {children}
    </div>
  );
};

export default CustomFieldsContainer;
