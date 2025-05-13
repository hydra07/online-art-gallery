'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from 'react';

const PERIOD_OPTIONS = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
];

interface BalanceCardProps {
    balance: number;
    currency?: string;
    isLoading?: boolean;
}

export function BalanceCard({ balance, currency = 'VND', isLoading = false }: BalanceCardProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('7d');

    const selectedPeriodLabel = PERIOD_OPTIONS.find(
        option => option.value === selectedPeriod
    )?.label || 'Last 7 days';

    if (isLoading) {
        return (
            <Card className="border-primary/20">
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-base font-medium'>
                        <Skeleton className="h-4 w-32" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-36 mb-4" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary/20">
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-base font-medium'>
                    Current Balance
                </CardTitle>
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                            {selectedPeriodLabel}
                            <ChevronDown className='ml-2 h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        {PERIOD_OPTIONS.map(option => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => setSelectedPeriod(option.value)}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu> */}
            </CardHeader>
            <CardContent>
                <div className='text-3xl font-bold text-green-500'>
                    {balance.toLocaleString()} {currency}
                </div>
            </CardContent>
        </Card>
    );
}
