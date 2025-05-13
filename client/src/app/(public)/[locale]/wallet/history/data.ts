export interface HistoryTransaction {
    id: string;
    type: 'deposit' | 'payment' | 'withdrawal';
    amount: number;
    date: string;
    description: string;
    status: 'pending' | 'success' | 'failed';
    balance: number;
}

export const transactions: HistoryTransaction[] = [
    {
        id: '1',
        type: 'deposit',
        amount: 500000,
        date: '2024-02-06T13:45:00',
        description: 'Bank Transfer Deposit',
        status: 'success',
        balance: 500000
    },
    {
        id: '2',
        type: 'payment',
        amount: -200000,
        date: '2024-02-06T10:30:00',
        description: 'Service Payment',
        status: 'success',
        balance: 300000
    },
    {
        id: '3',
        type: 'deposit',
        amount: 1000000,
        date: '2024-02-05T15:20:00',
        description: 'Credit Card Deposit',
        status: 'success',
        balance: 1300000
    },
    {
        id: '4',
        type: 'withdrawal',
        amount: -300000,
        date: '2024-02-04T09:15:00',
        description: 'Bank Withdrawal',
        status: 'success',
        balance: 1000000
    },
    {
        id: '5',
        type: 'payment',
        amount: -150000,
        date: '2024-02-03T14:45:00',
        description: 'Premium Subscription',
        status: 'success',
        balance: 850000
    }
];
