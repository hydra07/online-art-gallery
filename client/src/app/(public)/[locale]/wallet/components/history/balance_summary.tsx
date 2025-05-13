'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';

interface AccountStats {
    initialBalance: number;
    finalBalance: number;
    totalIncome: number;
    totalExpense: number;
    netChange: number;
}

interface BalanceSummaryProps {
    accountStats: AccountStats;
}

export function BalanceSummary({ accountStats }: BalanceSummaryProps) {
    return (
        <div className="lg:col-span-3 grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card className="border-primary/20">
                <CardContent className="p-6">
                    <div className="flex gap-4 items-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                            <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Current Balance
                            </div>
                            <div className="text-2xl font-bold">
                                {accountStats.finalBalance.toLocaleString()} VND
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/20">
                <CardContent className="p-6">
                    <div className="flex gap-4 items-center">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                            <ArrowDownRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Total Income
                            </div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                +{accountStats.totalIncome.toLocaleString()} VND
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/20">
                <CardContent className="p-6">
                    <div className="flex gap-4 items-center">
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                            <ArrowUpRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Total Expense
                            </div>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                -{accountStats.totalExpense.toLocaleString()} VND
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
