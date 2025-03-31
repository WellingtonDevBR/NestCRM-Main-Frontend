
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Predictions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-60" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
