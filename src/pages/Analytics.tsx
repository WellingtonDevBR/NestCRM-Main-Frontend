
import React from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import MetricCard from "@/components/analytics/MetricCard";
import ChurnRateChart from "@/components/analytics/ChurnRateChart";
import SegmentationChart from "@/components/analytics/SegmentationChart";
import RevenueChart from "@/components/analytics/RevenueChart";

const Analytics: React.FC = () => {
  const { analytics, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error loading analytics</h3>
        <p className="text-red-700">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      {/* KPI metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          metric={analytics.kpiMetrics[0]} 
          change={3.2} 
        />
        <MetricCard 
          metric={analytics.kpiMetrics[1]} 
          change={-1.5} 
        />
        <MetricCard 
          metric={analytics.kpiMetrics[2]} 
          change={0.3} 
          suffix="%" 
        />
        <MetricCard 
          metric={analytics.kpiMetrics[3]} 
          change={0.5} 
          suffix="/10" 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChurnRateChart data={analytics.churnRateOverTime} />
        <SegmentationChart data={analytics.customerSegmentation} />
      </div>
      
      <RevenueChart data={analytics.revenueByCustomerTier} />
    </div>
  );
};

export default Analytics;
