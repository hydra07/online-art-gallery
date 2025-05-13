'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, Banknote, CreditCard, ShoppingBag, Wallet } from 'lucide-react';
import { useState } from 'react';
import { walletService } from '../../queries';

export interface ApiTransaction {
    _id: string;
    walletId: string;
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT';
    status: 'PENDING' | 'PAID' | 'FAILED';
    orderCode: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ApiResponse {
    data: {
        transactions: ApiTransaction[];
        total: number;
    };
    message: string;
    statusCode: number;
    errorCode: null | string;
    details: null | any;
}

export interface Transaction {
    id: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'SALE';
    amount: number;
    date: string;
    description?: string;
    status: 'PENDING' | 'PAID' | 'FAILED';
    orderCode: string;
}

interface TransactionListContentProps {
    transactions?: Transaction[];
    limit?: number;
    isLoading?: boolean;
}

interface TransactionListProps {
    showCard?: boolean;
    title?: string;
    limit?: number;
    // transactions: Transaction[]; // Add this line
}
export interface TransactionData {
    _id: string;
    walletId: string;
    amount: number;
    type: string;
    status: string; // Change to string to match incoming data
    description?: string;
    orderCode: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const mapApiToTransaction = (transaction: TransactionData): Transaction => {
    // Validate and cast the type to our union type
    const validType = ['DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'SALE'].includes(transaction.type)
        ? (transaction.type as 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'SALE')
        : 'PAYMENT';

    // Validate and cast the status to our union type
    const validStatus = ['PENDING', 'PAID', 'FAILED'].includes(transaction.status)
        ? (transaction.status as 'PENDING' | 'PAID' | 'FAILED')
        : 'PENDING';

    return {
        id: transaction._id,
        type: validType,
        amount: transaction.amount,
        date: transaction.createdAt,
        description: transaction.description || `${validType} - ${transaction.orderCode}`,
        status: validStatus,
        orderCode: transaction.orderCode
    };
};

export function TransactionListContent({ transactions = [], limit, isLoading }: TransactionListContentProps) {
    if (isLoading) {
        return <TransactionListSkeleton />;
    }

    const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

    if (displayedTransactions.length === 0) {
        return <div className="text-center py-4 text-muted-foreground">No transactions found</div>;
    }

    const getTransactionIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'DEPOSIT':
                return <ArrowUpRight className='h-4 w-4 text-green-500' />; // Money coming in (up)
            case 'SALE':
                return <ArrowUpRight className='h-4 w-4 text-green-500' />; // Money coming in (up)
            case 'WITHDRAWAL':
                return <ArrowDownLeft className='h-4 w-4 text-red-500' />; // Money going out (down)
            case 'PAYMENT':
                return <ArrowDownLeft className='h-4 w-4 text-red-500' />; // Money going out (down)
            default:
                return <Banknote className='h-4 w-4 text-gray-500' />;
        }
    };

    const getStatusStyle = (status: Transaction['status']) => {
        switch (status) {
            case 'PAID':
                return 'bg-green-100 text-green-700';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700';
            case 'FAILED':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className='space-y-4'>
            {displayedTransactions.map((transaction) => {
                const isIncoming = transaction.type === 'DEPOSIT' || transaction.type === 'SALE';
                
                return (
                    <div
                        key={transaction.id}
                        className='flex items-center justify-between space-x-4 rounded-lg border p-4 transition-all hover:bg-muted/50'
                    >
                        <div className='flex items-center space-x-4'>
                            <div className='rounded-full border p-2'>
                                {getTransactionIcon(transaction.type)}
                            </div>
                            <div className='space-y-1.5'>
                                <div className='flex items-center gap-2'>
                                    <span className='px-2 py-1 rounded-full text-xs bg-muted font-medium'>
                                        {transaction.type}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(transaction.status)}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                                <p className='text-sm text-muted-foreground'>
                                    {new Date(transaction.date).toLocaleString()}
                                </p>
                                <p className='text-sm text-foreground'>
                                    {transaction.description}
                                </p>
                            </div>
                        </div>
                        <div className={cn(
                            'text-sm font-medium',
                            isIncoming ? 'text-green-500' : 'text-red-500'
                        )}>
                            {isIncoming ? '+' : '-'}
                            {Math.abs(transaction.amount).toLocaleString()} VND
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function TransactionList({
    showCard = true,
    title = "Recent Transactions",
    limit
}: TransactionListProps) {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Calculate skip based on page
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const { data, error, isLoading, isFetching } = useQuery({
        queryKey: ['transactions', skip, take],
        queryFn: () => walletService.getTransaction(skip, take)
    });

    const transactions = data?.data?.transactions?.map(mapApiToTransaction) || [];
    const totalPages = data?.data?.total ? Math.ceil(data.data.total / pageSize) : 0;

    const handlePrevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };

    const content = (
        <>
            <TransactionListContent
                transactions={transactions}
                limit={limit}
                isLoading={isLoading}
            />

            {totalPages > 1 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={handlePrevPage}

                                isActive={!(page === 1) || !isLoading}
                            />
                        </PaginationItem>
                        <PaginationItem className="flex items-center">
                            <span className="text-sm">
                                Page {page} of {totalPages}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                onClick={handleNextPage}
                                isActive={!(page === totalPages) || !isLoading}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );

    if (!showCard) {
        return content;
    }

    return (
        <Card className="border-primary/20">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    );
}

export function TransactionListSkeleton() {
    return (
        <div className='space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className='flex items-center justify-between space-x-4 rounded-lg border p-4'
                >
                    <div className='flex items-center space-x-4'>
                        <Skeleton className='h-8 w-8 rounded-full' />
                        <div className='space-y-2'>
                            <Skeleton className='h-4 w-[200px]' />
                            <Skeleton className='h-4 w-[150px]' />
                        </div>
                    </div>
                    <Skeleton className='h-4 w-[100px]' />
                </div>
            ))}
        </div>
    );
}