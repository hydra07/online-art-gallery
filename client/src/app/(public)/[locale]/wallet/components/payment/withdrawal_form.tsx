'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export const BANK_OPTIONS = [
    { id: 'vcb', name: 'Vietcombank', color: 'bg-emerald-500' },
    { id: 'mb', name: 'MB Bank', color: 'bg-purple-500' },
    { id: 'tcb', name: 'Techcombank', color: 'bg-red-500' },
    { id: 'tpb', name: 'TPBank', color: 'bg-violet-500' }
];

interface WithdrawalFormProps {
    currentBalance: number;
    onSubmit: (data: {
        bank: string;
        accountNumber: string;
        amount: string;
    }) => void;
}

export function WithdrawalForm({ currentBalance, onSubmit }: WithdrawalFormProps) {
    const [selectedBank, setSelectedBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');

    const canWithdraw =
        Number(amount) <= currentBalance &&
        Number(amount) > 0 &&
        selectedBank &&
        accountNumber;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (canWithdraw) {
            onSubmit({ bank: selectedBank, accountNumber, amount });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className='border-primary/20'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-blue-500"
                        >
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                        Withdrawal Form
                    </CardTitle>
                    <CardDescription>
                        Transfer money to your bank account
                    </CardDescription>
                </CardHeader>

                <CardContent className='space-y-6'>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label className='text-muted-foreground'>
                                Select Bank
                            </Label>
                            <Select
                                onValueChange={setSelectedBank}
                                required
                            >
                                <SelectTrigger className='h-12'>
                                    <SelectValue placeholder='Choose your bank' />
                                </SelectTrigger>
                                <SelectContent>
                                    {BANK_OPTIONS.map((bank) => (
                                        <SelectItem
                                            key={bank.id}
                                            value={bank.id}
                                            className='flex items-center gap-2'
                                        >
                                            <div
                                                className={cn(
                                                    'w-2 h-2 rounded-full',
                                                    bank.color
                                                )}
                                            />
                                            {bank.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label className='text-muted-foreground'>
                                Account Number
                            </Label>
                            <Input
                                placeholder='Enter your bank account number'
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className='h-12'
                                required
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label className='text-muted-foreground'>
                                Amount (VND)
                            </Label>
                            <Input
                                placeholder='Enter amount to withdraw'
                                type='number'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className='h-12 text-lg'
                                required
                            />
                            <AnimatePresence>
                                {Number(amount) > currentBalance && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className='flex items-center gap-2 text-sm text-red-500'
                                    >
                                        <AlertCircle className='h-4 w-4' />
                                        Insufficient balance
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        type='submit'
                        className='w-full h-12 text-lg bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity'
                        disabled={!canWithdraw}
                    >
                        Continue to Withdraw
                        <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
