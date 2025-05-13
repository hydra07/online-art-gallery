export interface Transaction {
    _id: string;
    userId: string;
    amount: number;
    status: "PAID" | "PENDING" | "FAILED";
    paymentUrl: string;
    orderCode: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface PaymentResponse {
    data: {
        payment: Transaction[];
        total: number;
    };
    message: string;
    statusCode: number;
    errorCode: null | string;
    details: null | any;
}

export interface DepositMethod {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    disabled: boolean;
}

export interface PresetAmount {
    value: number;
    label: string;
}


export interface PaymentData {
    userId: string;
    amount: number;
    description: string;
    status: string;
    paymentUrl: string;
    orderCode: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface WalletData {
    balance: number;
    transactions: any[]
}

export interface TransactionData {
    _id: string;
    walletId: string;
    amount: number;
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | string;
    status: "PENDING" | "PAID" | "FAILED" | string;
    orderCode: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
export interface TotalData {
    "total": number;
}
export interface Transaction {
    transactions: TransactionData[];
    total: number;
}


interface TimeSeriesData {
    _id: string;
    inflow: number;
    outflow: number;
    transactions: number;
}

interface TrendData {
    inflowTrend: number;
    outflowTrend: number;
    netFlowTrend: number;
}

interface SummaryData {
    totalInflow: number;
    totalOutflow: number;
    totalTransactions: number;
    avgDailyVolume: number;
}

export interface WalletStatistics {
    currentBalance: number;
    timeSeries: TimeSeriesData[];
    trends: TrendData;
    summary: SummaryData;
}