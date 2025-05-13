'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Building2 } from 'lucide-react';

interface BalanceInfoCardProps {
    currentBalance: number;
    withdrawalAmount?: string | number;
}

export function BalanceInfoCard({
    currentBalance,
    withdrawalAmount = 0
}: BalanceInfoCardProps) {
    const numericAmount = typeof withdrawalAmount === 'string'
        ? Number(withdrawalAmount) || 0
        : withdrawalAmount;

    return (
        <div className="space-y-6">
            {/* Balance Card */}
            <Card className='border-primary/20'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        Available Balance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='text-3xl font-bold text-green-500'>
                        {currentBalance.toLocaleString()} VND
                    </div>
                </CardContent>
            </Card>

            {/* Bank Info Card */}
            <Card className='border-primary/20'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Building2 className='h-6 w-6 text-blue-500' />
                        Withdrawal Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {numericAmount > 0 && (
                        <div className='space-y-2'>
                            <div className='text-sm text-muted-foreground'>
                                Remaining Balance After Withdrawal
                            </div>
                            <div className='text-2xl font-bold'>
                                {Math.max(0, currentBalance - numericAmount).toLocaleString()} VND
                            </div>
                        </div>
                    )}
                    <div className='text-sm text-muted-foreground'>
                        • Processing time: 5-30 minutes
                        <br />
                        • Maximum daily limit: 500,000,000 VND
                        <br />• No withdrawal fee
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
