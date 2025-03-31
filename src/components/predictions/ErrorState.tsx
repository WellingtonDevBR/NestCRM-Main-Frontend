
import React from "react";

interface ErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="p-6 bg-red-50 rounded-md">
      <h3 className="text-lg font-medium text-red-800">Error loading predictions</h3>
      <p className="text-red-700">{error.message}</p>
    </div>
  );
};

export default ErrorState;
