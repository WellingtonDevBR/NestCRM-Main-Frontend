
export type ReportType = 'sales' | 'customer' | 'payment' | 'activity' | 'custom';

export interface Report {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  createdAt: string;
  lastRunAt?: string;
  scheduled?: boolean;
  scheduledFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  creator: string;
}

export interface ReportFilter {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  customerSegment?: string[];
  paymentStatus?: string[];
  salesChannel?: string[];
}
