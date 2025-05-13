'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface NetChangeAlertProps {
    netChange: number;
}

export function NetChangeAlert({ netChange }: NetChangeAlertProps) {
    const isPositive = netChange > 0;

    return (
        <Card
            className={`lg:col-span-1 ${isPositive
                    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
                }`}
        >
            <CardContent className="p-6">
                <div className="flex items-center gap-3">
                    {isPositive ? (
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                        <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                    <div className="font-medium">
                        {isPositive ? 'Increase' : 'Decrease'} in balance
                    </div>
                </div>
                <div
                    className={`text-2xl font-bold mt-2 ${isPositive
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                >
                    {isPositive ? '+' : ''}
                    {netChange.toLocaleString()} VND
                </div>
                <div className="text-sm mt-1 text-muted-foreground">
                    {isPositive
                        ? 'Your balance has increased since the beginning of this period.'
                        : 'Your balance has decreased since the beginning of this period.'}
                </div>
            </CardContent>
        </Card>
    );
}
