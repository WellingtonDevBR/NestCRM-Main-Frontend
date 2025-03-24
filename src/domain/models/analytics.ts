
// Analytics domain models
export interface MetricData {
  name: string;
  value: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface ChartSeries {
  name: string;
  data: TimeSeriesDataPoint[];
}

export interface AnalyticsDashboard {
  kpiMetrics: MetricData[];
  churnRateOverTime: ChartSeries[];
  customerSegmentation: {
    segment: string;
    count: number;
    percentage: number;
  }[];
  revenueByCustomerTier: {
    tier: string;
    value: number;
  }[];
}
