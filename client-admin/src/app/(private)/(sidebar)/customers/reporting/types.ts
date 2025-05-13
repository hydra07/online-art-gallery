import { ReasonReport, ReportStatus } from "@/utils/enums";

export type Report = {  
  id: string,
  reporterId: string,
  reportedId: string,
  refType: string,
  reason: ReasonReport,
  description: string,
  status: ReportStatus,
  url?: string,
  image?: string[]
}

export interface ReportPageProps {
  params: {
    id: string;
  };
}

export interface ReportFiltersState {
  searchQuery: string;
  selectedStatus: string;
  selectedReason: string;
}

export interface ReportTableProps {
  reports: Report[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => Promise<any>;
  isFetching: boolean;
  processingIds: string[];
  onBanClick: (report: Report) => void;
  onResolve: (reportId: string) => void;
  getReasonLabel: (reason: ReasonReport) => string;
}