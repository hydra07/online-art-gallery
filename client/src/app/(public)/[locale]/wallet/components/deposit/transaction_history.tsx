'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionData } from '@/types/payment';



interface TransactionHistoryProps {
    transactions?: TransactionData[];
    totalItems: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    pageSize: number;
}

export function TransactionHistory({
    transactions = [],
    totalItems,
    isLoading,
    onPageChange,
    pageSize,
}: TransactionHistoryProps) {
    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <Card className="border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-gray-500"
                    >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                        <path d="m9 16 2 2 4-4" />
                    </svg>
                    Recent Deposit History
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div className="flex justify-between items-center p-3 border rounded-md" key={i}>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-3 w-[100px]" />
                                </div>
                                <Skeleton className="h-6 w-[80px]" />
                            </div>
                        ))}
                    </div>
                ) : transactions.length > 0 ? (
                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction._id}
                                className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
                            >
                                <div>
                                    <div className="font-medium">
                                        {transaction.amount.toLocaleString()} VND
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(transaction.createdAt).toLocaleString()} • Order #{transaction.orderCode}
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={
                                        transaction.status === 'PAID'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : transaction.status === 'PENDING'
                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                    }
                                >
                                    {transaction.status}
                                </Badge>
                            </div>
                        ))}

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex space-x-2">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onPageChange(i + 1)}
                                            className={`px-3 py-2 rounded ${i + 1 === Math.ceil(totalItems / pageSize) / pageSize
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        No deposit history found
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
